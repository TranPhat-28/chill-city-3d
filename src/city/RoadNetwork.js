/**
 * @module RoadNetwork
 * Phase 4 — City Generation
 *
 * Generates road and sidewalk geometry for the grid, and produces a
 * waypoint graph used by the vehicle NPC system.
 *
 * Public API:
 *   roadNetwork.build(gridSize, blockSize, roadWidth, scene)
 *     → { mesh: THREE.Mesh, waypointGraph: WaypointGraph }
 *
 * WaypointGraph: Map<string, Vector3[]>
 *   keyed by road segment ID, value is [start, end] world positions
 */
export class RoadNetwork {
  // TODO: Phase 4 implementation
  build(_gridSize, _blockSize, _roadWidth, _scene) {
    return { mesh: null, waypointGraph: new Map() };
  }
}
