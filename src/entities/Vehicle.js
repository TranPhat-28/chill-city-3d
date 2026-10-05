/**
 * @module Vehicle
 * Phase 5 — NPCs
 *
 * A single vehicle NPC that follows a closed loop of road waypoints.
 * Rotates smoothly to face the direction of travel.
 *
 * Public API:
 *   new Vehicle(mesh, waypoints, speed)
 *   vehicle.update(delta)
 */
export class Vehicle {
  /**
   * @param {import('three').Object3D} mesh
   * @param {import('three').Vector3[]} waypoints  — closed loop
   * @param {number} speed  — world units per second
   */
  constructor(_mesh, _waypoints, _speed = 8) {
    // TODO: Phase 5 implementation
  }

  update(_delta) {}
}
