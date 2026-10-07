import * as THREE from 'three';

export class Vehicle {
  constructor(_mesh: THREE.Object3D, _waypoints: THREE.Vector3[], _speed: number = 8) {}
  update(_delta: number): void {}
}
