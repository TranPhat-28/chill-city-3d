/**
 * @module EntityManager
 * Phase 5 — NPCs
 *
 * Owns and updates all NPC instances (vehicles + pedestrians).
 * Target density: Moderate (~30–50 vehicles, ~100–150 pedestrians).
 *
 * Public API:
 *   manager.init(engine, assetLoader, waypointGraph)
 *   manager.update(delta)          — called each frame via engine.onUpdate
 *   manager.setWeatherResponse(w)  — e.g. pause pedestrians in heavy rain
 */
export class EntityManager {
  // TODO: Phase 5 implementation
  init(_engine, _assetLoader, _waypointGraph) {}
  update(_delta) {}
  setWeatherResponse(_weatherType) {}
}
