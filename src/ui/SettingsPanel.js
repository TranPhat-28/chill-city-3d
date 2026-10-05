/**
 * @module SettingsPanel
 *
 * Builds and manages the settings UI panel. Communicates with environment
 * systems via window CustomEvents so each system remains fully decoupled
 * from the UI.
 *
 * Events dispatched:
 *   'cc:time-change'    → detail: { preset: 'morning'|'day'|'dusk'|'night' }
 *   'cc:weather-change' → detail: { type: 'clear'|'cloudy'|'rain'|'snow'|'fog' }
 *   'cc:season-change'  → detail: { season: 'spring'|'summer'|'autumn'|'winter' }
 *
 * Systems listen for these events on `window` independently.
 * Settings are persisted to localStorage so they survive page refresh.
 *
 * Full UI controls are implemented in Phase 7.
 * This Phase 1 stub sets up the toggle and renders placeholder sections.
 */
export class SettingsPanel {
  constructor() {
    /** @type {HTMLElement | null} */
    this._panelEl = null;

    /** @type {HTMLButtonElement | null} */
    this._toggleEl = document.getElementById('settings-toggle');

    this._visible = false;

    // Wire up the toggle button immediately
    this._toggleEl?.addEventListener('click', () => this.toggle());
  }

  /**
   * Mount the panel into a container element and render its contents.
   * @param {HTMLElement} containerEl
   */
  mount(containerEl) {
    this._panelEl = containerEl;
    this._render();
  }

  toggle() {
    this._visible = !this._visible;
    this._panelEl?.classList.toggle('hidden', !this._visible);
  }

  show() {
    this._visible = true;
    this._panelEl?.classList.remove('hidden');
  }

  hide() {
    this._visible = false;
    this._panelEl?.classList.add('hidden');
  }

  /**
   * Dispatch a typed CustomEvent on window.
   * All environment systems listen for these.
   * @param {string} eventName
   * @param {object} detail
   */
  _emit(eventName, detail) {
    window.dispatchEvent(new CustomEvent(eventName, { detail }));
  }

  /**
   * Render panel HTML.
   * Phase 1: placeholder sections only.
   * Phase 7: full controls (dropdowns, button groups).
   * @private
   */
  _render() {
    if (!this._panelEl) return;

    this._panelEl.innerHTML = `
      <p class="settings-heading">ChillCity Settings</p>

      <div class="settings-section">
        <p class="settings-label">🌤️ Time of Day</p>
        <p class="settings-placeholder">Coming in Phase 7…</p>
      </div>

      <div class="settings-divider"></div>

      <div class="settings-section">
        <p class="settings-label">🌧️ Weather</p>
        <p class="settings-placeholder">Coming in Phase 7…</p>
      </div>

      <div class="settings-divider"></div>

      <div class="settings-section">
        <p class="settings-label">🍂 Season</p>
        <p class="settings-placeholder">Coming in Phase 7…</p>
      </div>
    `;
  }
}
