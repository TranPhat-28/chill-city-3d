/**
 * @module GridPlanner
 * Phase 4 — City Generation
 *
 * Produces the 2D zone map for the N×N block grid. Zones cluster
 * naturally using a noise-based flood fill (residential neighborhoods,
 * a commercial downtown core, an industrial edge zone, scattered parks,
 * a handful of landmark blocks).
 *
 * Zone types: RESIDENTIAL | COMMERCIAL | INDUSTRIAL | PARK | LANDMARK | EMPTY
 *
 * Public API:
 *   gridPlanner.generate(gridSize, seed) → number[][]   (2D array of zone IDs)
 *   GridPlanner.ZONES                    → enum-like object of zone constants
 */
export class GridPlanner {
  static ZONES = {
    RESIDENTIAL: 0,
    COMMERCIAL:  1,
    INDUSTRIAL:  2,
    PARK:        3,
    LANDMARK:    4,
    EMPTY:       5,
  };

  // TODO: Phase 4 implementation
  generate(_gridSize, _seed) {
    return [];
  }
}
