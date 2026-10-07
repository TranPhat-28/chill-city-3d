import { GLTFLoader, GLTF } from 'three/addons/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js';
import * as THREE from 'three';

export const ASSET_MANIFEST: Record<string, string> = {
  // Add entries like:
  // 'building.residential.house_01': '/assets/models/buildings/residential/house_01.glb',
};

class AssetLoader {
  private _cache: Map<string, THREE.Group>;
  private _loader: GLTFLoader | null;
  private _onProgress: ((progress: number, currentKey: string) => void) | null;

  constructor() {
    this._cache = new Map();
    this._loader = null;
    this._onProgress = null;
  }

  init(): this {
    const draco = new DRACOLoader();
    draco.setDecoderPath(
      'https://www.gstatic.com/draco/versioned/decoders/1.5.6/'
    );

    this._loader = new GLTFLoader();
    this._loader.setDRACOLoader(draco);

    return this;
  }

  setProgressCallback(fn: (progress: number, currentKey: string) => void): this {
    this._onProgress = fn;
    return this;
  }

  async loadAll(): Promise<Map<string, THREE.Group>> {
    const entries = Object.entries(ASSET_MANIFEST);

    if (entries.length === 0) {
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

  get(key: string): THREE.Group | null {
    const original = this._cache.get(key);
    if (!original) {
      console.warn(`[AssetLoader] Asset not found in cache: "${key}"`);
      return null;
    }
    return original.clone(true) as THREE.Group;
  }

  has(key: string): boolean {
    return this._cache.has(key);
  }

  private _loadGLTF(path: string): Promise<GLTF> {
    return new Promise((resolve, reject) => {
      this._loader?.load(path, resolve, undefined, reject);
    });
  }
}

export const assetLoader = new AssetLoader();
