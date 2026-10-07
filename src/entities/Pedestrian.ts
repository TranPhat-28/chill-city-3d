import * as THREE from 'three';

export class Pedestrian {
  constructor(_mesh: THREE.Object3D, _sidewalkSegments: THREE.Vector3[][], _speed: number = 1.4) {}
  update(_delta: number): void {}
  pause(): void {}
  resume(): void {}
}
