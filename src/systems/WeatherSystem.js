/**
 * @module WeatherSystem
 * Phase 6 — Environment Systems
 *
 * Listens for 'cc:weather-change' CustomEvents and applies the selected
 * weather state to the scene.
 *
 * Weather types: 'clear' | 'cloudy' | 'rain' | 'snow' | 'fog'
 *
 * Each type controls:
 *   - scene.fog (THREE.FogExp2) — density
 *   - Rain particle system (THREE.Points / LineSegments attached to camera)
 *   - Snow particle system (THREE.Points with soft sprite)
 *   - Ambient light intensity modifier
 *
 * Transitions are smoothed via GSAP tweens (fog density, particle opacity).
 *
 * Public API:
 *   weatherSystem.init(engine)         — setup particles, register event
 *   weatherSystem.applyWeather(type)   — called by event or directly
 *   weatherSystem.update(delta)        — animate particles each frame
 *
 * To add a new weather type:
 *   1. Add an entry to the WEATHER_CONFIGS constant (when implemented).
 *   2. Add the option to SettingsPanel in Phase 7.
 */
export class WeatherSystem {
  // TODO: Phase 6 implementation
  init(_engine) {
    window.addEventListener('cc:weather-change', (e) => {
      this.applyWeather(e.detail.type);
    });
  }

  applyWeather(_type) {}
  update(_delta) {}
}
