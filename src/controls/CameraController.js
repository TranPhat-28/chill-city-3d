import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import * as THREE from 'three';

// ── City boundary constants ─────────────────────────────────────────────────
// 30 blocks × (20 block width + 4 road gap) = 720 units total
// Half-size used for pan clamping.
const CITY_HALF_SIZE = 380;

/**
 * @module CameraController
 *
 * Wraps Three.js OrbitControls with constraints appropriate for a city
 * simulation:
 *   - Full 360° horizontal rotation (azimuth unconstrained)
 *   - Vertical angle clamped to prevent going underground or looking
 *     straight down into the void
 *   - Zoom limited so the user can't escape into outer space or clip
 *     into the ground
 *   - Pan target clamped to stay within the city boundary
 *   - Smooth inertia via enableDamping
 *
 * Usage:
 *   const cam = new CameraController(engine.camera, engine.renderer.domElement);
 *   engine.onUpdate(() => cam.update());
 */
export class CameraController {
  /**
   * @param {THREE.PerspectiveCamera} camera
   * @param {HTMLElement} domElement  — the renderer's canvas
   */
  constructor(camera, domElement) {
    this._camera = camera;

    /** @type {OrbitControls} */
    this.controls = new OrbitControls(camera, domElement);

    this._configure();
  }

  /** @private */
  _configure() {
    const c = this.controls;

    // ── Smoothness ──────────────────────────────────────────────────────
    c.enableDamping = true;
    c.dampingFactor = 0.06;

    // ── Panning ─────────────────────────────────────────────────────────
    // Keep panning on the XZ ground plane (not following camera orientation)
    c.screenSpacePanning = false;
    c.panSpeed = 0.8;

    // ── Zoom ────────────────────────────────────────────────────────────
    c.minDistance = 30;    // Can't zoom into buildings
    c.maxDistance = 700;   // Can't escape to orbit
    c.zoomSpeed = 1.0;

    // ── Vertical rotation (polar angle) ─────────────────────────────────
    // 0           = camera directly above (+Y looking down)
    // Math.PI / 2 = camera at horizon level
    // Math.PI     = camera below ground (forbidden)
    c.minPolarAngle = Math.PI / 10;   // ~18° — bird's-eye allowed
    c.maxPolarAngle = Math.PI / 2.1;  // ~86° — just above the horizon, never flipping

    // ── Horizontal rotation ─────────────────────────────────────────────
    // Fully free — no azimuth limits (let them spin the whole city)
    c.minAzimuthAngle = -Infinity;
    c.maxAzimuthAngle = Infinity;

    // ── Initial target ───────────────────────────────────────────────────
    c.target.set(0, 0, 0);
    c.update();
  }

  /**
   * Must be called every frame (register with engine.onUpdate).
   * Applies damping and clamps the orbit target to the city boundary.
   */
  update() {
    // Clamp the pan target so users can't drift infinitely off the map
    const t = this.controls.target;
    t.x = THREE.MathUtils.clamp(t.x, -CITY_HALF_SIZE, CITY_HALF_SIZE);
    t.z = THREE.MathUtils.clamp(t.z, -CITY_HALF_SIZE, CITY_HALF_SIZE);
    t.y = THREE.MathUtils.clamp(t.y, 0, 60); // Don't pan into the sky

    this.controls.update();
  }

  /** Release event listeners when tearing down the scene. */
  dispose() {
    this.controls.dispose();
  }
}
