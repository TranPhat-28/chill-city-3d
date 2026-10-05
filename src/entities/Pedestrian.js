/**
 * @module Pedestrian
 * Phase 5 — NPCs
 *
 * A single pedestrian NPC that wanders sidewalk waypoints and occasionally
 * pauses (idle state) for a natural feel.
 *
 * Public API:
 *   new Pedestrian(mesh, sidewalkSegments, speed)
 *   pedestrian.update(delta)
 *   pedestrian.pause()   — stop movement (e.g. during heavy rain)
 *   pedestrian.resume()
 */
export class Pedestrian {
  /**
   * @param {import('three').Object3D} mesh
   * @param {import('three').Vector3[][]} sidewalkSegments
   * @param {number} speed  — world units per second
   */
  constructor(_mesh, _sidewalkSegments, _speed = 1.4) {
    // TODO: Phase 5 implementation
  }

  update(_delta) {}
  pause() {}
  resume() {}
}
