/**
 * @module TimeSystem
 * Phase 6 — Environment Systems
 *
 * Manages lighting presets for time-of-day. Listens for the 'cc:time-change'
 * CustomEvent from SettingsPanel and applies the selected preset
 * (no gradual sun animation — each preset is a fixed lighting state).
 *
 * Presets: 'morning' | 'day' | 'dusk' | 'night'
 *
 * Each preset defines:
 *   - Sun (DirectionalLight) position, color, intensity
 *   - HemisphereLight sky/ground color + intensity
 *   - Scene background / fog color
 *   - Building window emissive intensity (night only)
 *
 * Public API:
 *   timeSystem.init(engine, sky)       — register event listener, set default
 *   timeSystem.applyPreset(presetName) — called by event or directly
 *
 * To add a new time preset:
 *   1. Add an entry to the PRESETS constant below (when implemented).
 *   2. Add the option to SettingsPanel._render() in Phase 7.
 *   That's it — the event system handles the rest automatically.
 */
export class TimeSystem {
  // TODO: Phase 6 implementation
  init(_engine, _sky) {
    window.addEventListener('cc:time-change', (e) => {
      this.applyPreset(e.detail.preset);
    });
  }

  applyPreset(_preset) {}
}
