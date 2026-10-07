import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import * as THREE from 'three';

const CITY_HALF_SIZE = 380;

export class CameraController {
  public controls: OrbitControls;

  constructor(camera: THREE.PerspectiveCamera, domElement: HTMLElement) {
    this.controls = new OrbitControls(camera, domElement);
    this._configure();
  }

  private _configure(): void {
    const c = this.controls;

    c.enableDamping = true;
    c.dampingFactor = 0.06;

    c.screenSpacePanning = false;
    c.panSpeed = 0.8;

    c.minDistance = 30;
    c.maxDistance = 700;
    c.zoomSpeed = 1.0;

    c.minPolarAngle = Math.PI / 10;
    c.maxPolarAngle = Math.PI / 2.1;

    c.minAzimuthAngle = -Infinity;
    c.maxAzimuthAngle = Infinity;

    c.target.set(0, 0, 0);
    c.update();
  }

  update(): void {
    const t = this.controls.target;
    t.x = THREE.MathUtils.clamp(t.x, -CITY_HALF_SIZE, CITY_HALF_SIZE);
    t.z = THREE.MathUtils.clamp(t.z, -CITY_HALF_SIZE, CITY_HALF_SIZE);
    t.y = THREE.MathUtils.clamp(t.y, 0, 60);

    this.controls.update();
  }

  dispose(): void {
    this.controls.dispose();
  }
}
