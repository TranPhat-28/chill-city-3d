import * as THREE from 'three';

// ── Core ──────────────────────────────────────────────────────────────────
import { engine }      from './core/Engine';
import { assetLoader } from './core/AssetLoader';

// ── Controls & UI ─────────────────────────────────────────────────────────
import { CameraController } from './controls/CameraController';
import { SettingsPanel }    from './ui/SettingsPanel';

// ── World (Phase 3) ───────────────────────────────────────────────────────
import { Sky }     from './world/Sky';
import { Terrain } from './world/Terrain';
import { Forest }  from './world/Forest';

// ── City (Phase 4) ────────────────────────────────────────────────────────
import { CityGenerator } from './city/CityGenerator';

// ── Entities (Phase 5) ────────────────────────────────────────────────────
import { EntityManager } from './entities/EntityManager';

// ── Systems (Phase 6) ─────────────────────────────────────────────────────
import { TimeSystem }    from './systems/TimeSystem';
import { WeatherSystem } from './systems/WeatherSystem';
import { SeasonSystem }  from './systems/SeasonSystem';

// ── DOM refs ──────────────────────────────────────────────────────────────
const canvas         = document.getElementById('app') as HTMLCanvasElement;
const loaderEl       = document.getElementById('loader') as HTMLElement;
const progressFillEl = document.getElementById('progress-fill') as HTMLElement;
const loaderStatusEl = document.getElementById('loader-status') as HTMLElement;

// ── Main ──────────────────────────────────────────────────────────────────
async function main() {

  engine.init(canvas);

  assetLoader.init();
  assetLoader.setProgressCallback((progress: number, key: string) => {
    progressFillEl.style.width = `${Math.round(progress * 100)}%`;
    if (key !== 'done') loaderStatusEl.textContent = `Loading ${key}…`;
  });

  loaderStatusEl.textContent = 'Loading assets…';
  await assetLoader.loadAll();

  progressFillEl.style.width = '100%';
  loaderStatusEl.textContent = 'Ready!';

  await sleep(400);
  loaderEl.classList.add('fade-out');
  loaderEl.addEventListener('transitionend', () => {
    loaderEl.style.display = 'none';
  }, { once: true });

  buildPhase1TestScene();

  const sky     = new Sky();
  const terrain = new Terrain();
  const forest  = new Forest();
  sky.init(engine);
  terrain.init(engine);
  forest.init(engine, assetLoader);

  const cityGen = new CityGenerator();
  await cityGen.generate(engine, assetLoader);

  const entityManager = new EntityManager();
  entityManager.init(engine, assetLoader, null);
  engine.onUpdate((delta: number) => entityManager.update(delta));

  const cameraController = new CameraController(
    engine.camera as THREE.PerspectiveCamera,
    engine.renderer!.domElement
  );
  engine.onUpdate(() => cameraController.update());

  const settingsPanel = new SettingsPanel();
  settingsPanel.mount(document.getElementById('settings-panel') as HTMLElement);

  const timeSystem    = new TimeSystem();
  const weatherSystem = new WeatherSystem();
  const seasonSystem  = new SeasonSystem();

  timeSystem.init(engine, sky);
  weatherSystem.init(engine);
  seasonSystem.init(engine, terrain, forest);

  engine.onUpdate((delta: number) => weatherSystem.update(delta));

  engine.start();
}

function buildPhase1TestScene() {
  const { scene } = engine;

  scene.background = new THREE.Color(0x87ceeb);

  const ambient = new THREE.AmbientLight(0xffffff, 0.35);
  scene.add(ambient);

  const hemi = new THREE.HemisphereLight(0xadd8e6, 0x4a7c59, 0.4);
  scene.add(hemi);

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

  const grid = new THREE.GridHelper(1200, 60, 0x000000, 0x2a2a2a);
  grid.position.y = 0.2;
  scene.add(grid);

  const cubeGeo = new THREE.BoxGeometry(20, 20, 20);
  const cubeMat = new THREE.MeshStandardMaterial({ color: 0xe74c3c, roughness: 0.6 });
  const cube = new THREE.Mesh(cubeGeo, cubeMat);
  cube.position.set(0, 10, 0);
  cube.castShadow = true;
  cube.receiveShadow = true;
  scene.add(cube);
}

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

main().catch((err) => {
  console.error('[ChillCity] Fatal initialization error:', err);
});
