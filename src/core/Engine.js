import * as THREE from 'three';

/**
 * @module Engine
 *
 * The central hub of ChillCity 3D. Owns the Three.js renderer, scene,
 * camera, and the main animation loop. Every other system registers an
 * update callback here instead of running its own RAF.
 *
 * Usage:
 *   engine.init(canvasElement);
 *   engine.onUpdate((delta) => mySystem.update(delta));
 *   engine.start();
 *
 * All other modules receive `engine` as a reference and interact with
 * `engine.scene` to add/remove objects.
 */
class Engine {
  constructor() {
    /** @type {THREE.Scene} */
    this.scene = new THREE.Scene();

    /** @type {THREE.Clock} */
    this.clock = new THREE.Clock();

    /** @type {THREE.WebGLRenderer | null} */
    this.renderer = null;

    /** @type {THREE.PerspectiveCamera | null} */
    this.camera = null;

    /** @type {Array<function(delta: number): void>} */
    this._updateCallbacks = [];

    this._running = false;
  }

  /**
   * Initialize the renderer and camera. Must be called before start().
   * @param {HTMLCanvasElement} canvasEl
   * @returns {Engine} this (for chaining)
   */
  init(canvasEl) {
    // ── Renderer ─────────────────────────────────────────────────────────
    this.renderer = new THREE.WebGLRenderer({
      canvas: canvasEl,
      antialias: true,
      powerPreference: 'high-performance',
    });

    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.setSize(window.innerWidth, window.innerHeight);

    // Shadow maps
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    // Color & tone mapping — ACESFilmic gives a nice cinematic look
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.0;
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;

    // ── Camera ───────────────────────────────────────────────────────────
    this.camera = new THREE.PerspectiveCamera(
      60,                                        // Field of view
      window.innerWidth / window.innerHeight,    // Aspect ratio
      0.5,                                       // Near clipping plane
      2500,                                      // Far clipping plane
    );

    // Initial position: looking at city center from a nice angle
    this.camera.position.set(0, 120, 250);
    this.camera.lookAt(0, 0, 0);

    // ── Resize handler ───────────────────────────────────────────────────
    window.addEventListener('resize', this._onResize.bind(this));

    return this;
  }

  /**
   * Register a callback to be invoked every animation frame.
   * The callback receives `delta` — time in seconds since the last frame.
   * @param {function(delta: number): void} callback
   * @returns {Engine} this (for chaining)
   */
  onUpdate(callback) {
    this._updateCallbacks.push(callback);
    return this;
  }

  /**
   * Begin the render loop. Safe to call only once.
   * @returns {Engine} this (for chaining)
   */
  start() {
    if (this._running) return this;
    this._running = true;
    this.clock.start();
    this._tick();
    return this;
  }

  /** @private — main RAF loop */
  _tick() {
    requestAnimationFrame(this._tick.bind(this));

    const delta = this.clock.getDelta();

    for (const cb of this._updateCallbacks) {
      cb(delta);
    }

    this.renderer.render(this.scene, this.camera);
  }

  /** @private */
  _onResize() {
    const w = window.innerWidth;
    const h = window.innerHeight;
    this.camera.aspect = w / h;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(w, h);
  }
}

// ── Singleton export ──────────────────────────────────────────────────────
// A single Engine instance is shared across the entire app.
export const engine = new Engine();
