import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js';

/**
 * @module AssetLoader
 *
 * Singleton GLTF asset loader. On startup, `loadAll()` fetches every model
 * listed in ASSET_MANIFEST and caches it. Other modules retrieve clones via
 * `assetLoader.get(key)`.
 *
 * Naming convention for manifest keys:
 *   '<category>.<subcategory>.<variant>'
 *   e.g. 'building.residential.house_01'
 *        'nature.tree_pine'
 *        'vehicle.car_01'
 *
 * All paths are relative to the public/ directory (served at root by Vite).
 *
 * --- Adding a new asset (Phase 4+) ---
 * 1. Drop the .glb file into the appropriate public/assets/models/ subfolder.
 * 2. Add an entry here: 'my.key': '/assets/models/path/to/model.glb'
 * 3. Retrieve in code: assetLoader.get('my.key')  ← returns a fresh clone
 */
export const ASSET_MANIFEST = {
  // ── Buildings ──────────────────────────────────────────────────────────
  // Residential  (add house_01.glb, house_02.glb … to public/assets/models/buildings/residential/)
  // 'building.residential.house_01': '/assets/models/buildings/residential/house_01.glb',

  // Commercial   (shop_01.glb, office_01.glb …)
  // 'building.commercial.shop_01': '/assets/models/buildings/commercial/shop_01.glb',

  // Industrial   (warehouse_01.glb …)
  // 'building.industrial.warehouse_01': '/assets/models/buildings/industrial/warehouse_01.glb',

  // Landmarks    (church.glb, skyscraper_01.glb …)
  // 'building.landmark.church': '/assets/models/buildings/landmarks/church.glb',

  // ── Nature ─────────────────────────────────────────────────────────────
  // 'nature.tree_01': '/assets/models/nature/tree_01.glb',
  // 'nature.tree_02': '/assets/models/nature/tree_02.glb',

  // ── Vehicles ───────────────────────────────────────────────────────────
  // 'vehicle.car_01':  '/assets/models/vehicles/car_01.glb',
  // 'vehicle.bus_01':  '/assets/models/vehicles/bus_01.glb',
  // 'vehicle.truck_01':'/assets/models/vehicles/truck_01.glb',

  // ── Pedestrians ────────────────────────────────────────────────────────
  // 'pedestrian.person_01': '/assets/models/pedestrians/person_01.glb',
  // 'pedestrian.person_02': '/assets/models/pedestrians/person_02.glb',
};

// ---------------------------------------------------------------------------

class AssetLoader {
  constructor() {
    /** @type {Map<string, import('three').Group>} */
    this._cache = new Map();

    /** @type {GLTFLoader | null} */
    this._loader = null;

    /** @type {function(progress: number, currentKey: string): void | null} */
    this._onProgress = null;
  }

  /**
   * Create and configure the GLTF + DRACO loaders.
   * Must be called before loadAll().
   * @returns {AssetLoader} this
   */
  init() {
    const draco = new DRACOLoader();
    // Load Draco decoders from Google's CDN — avoids bundling large WASM files
    draco.setDecoderPath(
      'https://www.gstatic.com/draco/versioned/decoders/1.5.6/'
    );

    this._loader = new GLTFLoader();
    this._loader.setDRACOLoader(draco);

    return this;
  }

  /**
   * Register a progress callback invoked as each asset loads.
   * @param {function(progress: number, currentKey: string): void} fn
   *   progress — 0..1 fraction of total assets loaded
   * @returns {AssetLoader} this
   */
  setProgressCallback(fn) {
    this._onProgress = fn;
    return this;
  }

  /**
   * Load all assets defined in ASSET_MANIFEST in parallel.
   * Failed loads are logged and skipped (non-fatal) so a missing model
   * doesn't crash the whole app.
   *
   * @returns {Promise<Map<string, import('three').Group>>} the populated cache
   */
  async loadAll() {
    const entries = Object.entries(ASSET_MANIFEST);

    if (entries.length === 0) {
      // No assets yet — immediately signal 100% complete
      this._onProgress?.(1, 'done');
      return this._cache;
    }

    let loaded = 0;
    const total = entries.length;

    await Promise.all(
      entries.map(async ([key, path]) => {
        try {
          const gltf = await this._loadGLTF(path);
          this._cache.set(key, gltf.scene);
        } catch (err) {
          console.warn(`[AssetLoader] Skipping "${key}" — failed to load "${path}":`, err);
        } finally {
          loaded++;
          this._onProgress?.(loaded / total, key);
        }
      })
    );

    return this._cache;
  }

  /**
   * Retrieve a cached asset by key.
   * ALWAYS returns a fresh clone so placing the same model multiple times
   * in the scene doesn't share the same Object3D reference.
   *
   * @param {string} key  Manifest key, e.g. 'building.residential.house_01'
   * @returns {import('three').Group | null}
   */
  get(key) {
    const original = this._cache.get(key);
    if (!original) {
      console.warn(`[AssetLoader] Asset not found in cache: "${key}"`);
      return null;
    }
    return original.clone(true);
  }

  /**
   * Check whether an asset key exists in the cache.
   * @param {string} key
   * @returns {boolean}
   */
  has(key) {
    return this._cache.has(key);
  }

  /** @private */
  _loadGLTF(path) {
    return new Promise((resolve, reject) => {
      this._loader.load(path, resolve, undefined, reject);
    });
  }
}

// ── Singleton export ──────────────────────────────────────────────────────
export const assetLoader = new AssetLoader();
