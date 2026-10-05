/**
 * main.js — ChillCity 3D Entry Point
 *
 * Bootstrap sequence:
 *   1. Init engine (renderer, camera, RAF loop)
 *   2. Init asset loader (GLTF/DRACO)
 *   3. Load all assets → update loading screen progress
 *   4. Dismiss loading screen
 *   5. Build scene (Phase 1: test scene; replaced in Phase 3+)
 *   6. Init camera controller
 *   7. Init settings panel
 *   8. Init environment systems (stubs until Phase 6)
 *   9. Start render loop
 *
 * As each Phase is implemented, the relevant step below is fleshed out.
 * The overall structure and order remain the same throughout development.
 */

import * as THREE from 'three';

// ── Core ──────────────────────────────────────────────────────────────────
import { engine }      from './core/Engine.js';
import { assetLoader } from './core/AssetLoader.js';

// ── Controls & UI ─────────────────────────────────────────────────────────
import { CameraController } from './controls/CameraController.js';
import { SettingsPanel }    from './ui/SettingsPanel.js';

// ── World (Phase 3) ───────────────────────────────────────────────────────
import { Sky }     from './world/Sky.js';
import { Terrain } from './world/Terrain.js';
import { Forest }  from './world/Forest.js';

// ── City (Phase 4) ────────────────────────────────────────────────────────
import { CityGenerator } from './city/CityGenerator.js';

// ── Entities (Phase 5) ────────────────────────────────────────────────────
import { EntityManager } from './entities/EntityManager.js';

// ── Systems (Phase 6) ─────────────────────────────────────────────────────
import { TimeSystem }    from './systems/TimeSystem.js';
import { WeatherSystem } from './systems/WeatherSystem.js';
import { SeasonSystem }  from './systems/SeasonSystem.js';

// ── DOM refs ──────────────────────────────────────────────────────────────
const canvas         = document.getElementById('app');
const loaderEl       = document.getElementById('loader');
const progressFillEl = document.getElementById('progress-fill');
const loaderStatusEl = document.getElementById('loader-status');

// ── Main ──────────────────────────────────────────────────────────────────
async function main() {

  // ── Step 1: Engine ───────────────────────────────────────────────────
  engine.init(canvas);

  // ── Step 2: Asset Loader ─────────────────────────────────────────────
  assetLoader.init();
  assetLoader.setProgressCallback((progress, key) => {
    progressFillEl.style.width = `${Math.round(progress * 100)}%`;
    if (key !== 'done') loaderStatusEl.textContent = `Loading ${key}…`;
  });

  // ── Step 3: Load Assets ──────────────────────────────────────────────
  loaderStatusEl.textContent = 'Loading assets…';
  await assetLoader.loadAll();

  // ── Step 4: Dismiss Loader ───────────────────────────────────────────
  progressFillEl.style.width = '100%';
  loaderStatusEl.textContent = 'Ready!';

  // Small delay so the user sees "Ready!" before the fade
  await sleep(400);
  loaderEl.classList.add('fade-out');
  loaderEl.addEventListener('transitionend', () => {
    loaderEl.style.display = 'none';
  }, { once: true });

  // ── Step 5: Build Scene ──────────────────────────────────────────────
  // Phase 1: temporary test scene (ground + lights + reference cube)
  // Phase 3: replaced by Sky, Terrain, Forest
  // Phase 4: city generation added
  buildPhase1TestScene();

  // World systems (stubs — will populate scene in Phase 3)
  const sky     = new Sky();
  const terrain = new Terrain();
  const forest  = new Forest();
  sky.init(engine);
  terrain.init(engine);
  forest.init(engine, assetLoader);

  // City generator (stub — will generate city in Phase 4)
  const cityGen = new CityGenerator();
  await cityGen.generate(engine, assetLoader);

  // Entity manager (stub — will spawn NPCs in Phase 5)
  const entityManager = new EntityManager();
  entityManager.init(engine, assetLoader, null /* waypointGraph from Phase 4 */);
  engine.onUpdate((delta) => entityManager.update(delta));

  // ── Step 6: Camera ───────────────────────────────────────────────────
  const cameraController = new CameraController(
    engine.camera,
    engine.renderer.domElement
  );
  engine.onUpdate(() => cameraController.update());

  // ── Step 7: Settings Panel ───────────────────────────────────────────
  const settingsPanel = new SettingsPanel();
  settingsPanel.mount(document.getElementById('settings-panel'));

  // ── Step 8: Environment Systems ──────────────────────────────────────
  const timeSystem    = new TimeSystem();
  const weatherSystem = new WeatherSystem();
  const seasonSystem  = new SeasonSystem();

  timeSystem.init(engine, sky);
  weatherSystem.init(engine);
  seasonSystem.init(engine, terrain, forest);

  engine.onUpdate((delta) => weatherSystem.update(delta));

  // ── Step 9: Start Render Loop ────────────────────────────────────────
  engine.start();
}

// ---------------------------------------------------------------------------

/**
 * Temporary scene for Phase 1 verification.
 * Provides enough to confirm rendering, shadows, and camera controls work.
 * Removed when Phase 3 world is implemented.
 */
function buildPhase1TestScene() {
  const { scene } = engine;

  // Placeholder sky color (replaced by Sky.js in Phase 3)
  scene.background = new THREE.Color(0x87ceeb);

  // Ambient fill
  const ambient = new THREE.AmbientLight(0xffffff, 0.35);
  scene.add(ambient);

  // Hemisphere light (sky blue / ground green)
  const hemi = new THREE.HemisphereLight(0xadd8e6, 0x4a7c59, 0.4);
  scene.add(hemi);

  // Directional "sun" with shadows
  const sun = new THREE.DirectionalLight(0xfff8e8, 1.4);
  sun.position.set(200, 300, 100);
  sun.castShadow = true;
  sun.shadow.mapSize.set(2048, 2048);
  sun.shadow.camera.near = 1;
  sun.shadow.camera.far  = 1500;
  const sw = 600;
  sun.shadow.camera.left   = -sw;
  sun.shadow.camera.right  =  sw;
  sun.shadow.camera.top    =  sw;
  sun.shadow.camera.bottom = -sw;
  scene.add(sun);

  // Ground plane — covers city footprint + forest margin
  // (replaced by Terrain.js in Phase 3)
  const groundGeo = new THREE.PlaneGeometry(1800, 1800);
  const groundMat = new THREE.MeshStandardMaterial({
    color: 0x4a7c59,
    roughness: 0.9,
    metalness: 0.0,
  });
  const ground = new THREE.Mesh(groundGeo, groundMat);
  ground.rotation.x = -Math.PI / 2;
  ground.receiveShadow = true;
  scene.add(ground);

  // Grid helper — orientation reference while city is not yet generated
  // (removed in Phase 3)
  const grid = new THREE.GridHelper(1200, 60, 0x000000, 0x2a2a2a);
  grid.position.y = 0.2;
  scene.add(grid);

  // Test cube — confirms shadows and camera orbit are working correctly
  // (removed in Phase 4 when buildings appear)
  const cubeGeo = new THREE.BoxGeometry(20, 20, 20);
  const cubeMat = new THREE.MeshStandardMaterial({ color: 0xe74c3c, roughness: 0.6 });
  const cube = new THREE.Mesh(cubeGeo, cubeMat);
  cube.position.set(0, 10, 0);
  cube.castShadow = true;
  cube.receiveShadow = true;
  scene.add(cube);
}

/** @param {number} ms */
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// ---------------------------------------------------------------------------

main().catch((err) => {
  console.error('[ChillCity] Fatal initialization error:', err);
});
