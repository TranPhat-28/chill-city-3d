/**
 * @module SeasonSystem
 * Phase 6 — Environment Systems
 *
 * Listens for 'cc:season-change' CustomEvents and applies the selected
 * season palette to scene elements. GSAP lerps all color changes over
 * ~2 seconds for a smooth cross-fade.
 *
 * Seasons: 'spring' | 'summer' | 'autumn' | 'winter'
 *
 * Each season defines a PALETTE:
 *   - foliageColor  → applied to Forest InstancedMesh instance colors
 *   - groundColor   → lerped into Terrain material.color
 *   - ambientWarmth → HemisphereLight color tint
 *
 * To add a new seasonal effect (e.g. pedestrian clothing tint):
 *   1. Add the property to the SEASON_PALETTES object (when implemented).
 *   2. Apply it in applyPalette() using the same lerp/tween pattern.
 *   3. Zero other changes needed — the event system handles dispatch.
 *
 * Public API:
 *   seasonSystem.init(engine, terrain, forest)  — register event, set default
 *   seasonSystem.applySeason(seasonName)        — called by event or directly
 */
export class SeasonSystem {
  // TODO: Phase 6 implementation

  /**
   * Season palettes. Extend this object to add new seasonal properties.
   * Each system that cares about seasons reads from here in applyPalette().
   */
  static PALETTES = {
    spring: {
      foliageColor:  '#4caf50',
      groundColor:   '#5a8a3c',
      ambientWarmth: '#ffe0b2',
    },
    summer: {
      foliageColor:  '#2e7d32',
      groundColor:   '#8d9a3a',
      ambientWarmth: '#fff9c4',
    },
    autumn: {
      foliageColor:  '#e65100',
      groundColor:   '#795548',
      ambientWarmth: '#ffe082',
    },
    winter: {
      foliageColor:  '#e0e0e0',
      groundColor:   '#f5f5f5',
      ambientWarmth: '#bbdefb',
    },
  };

  init(_engine, _terrain, _forest) {
    window.addEventListener('cc:season-change', (e) => {
      this.applySeason(e.detail.season);
    });
  }

  applySeason(_season) {}
}
