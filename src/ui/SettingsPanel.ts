export class SettingsPanel {
  private _panelEl: HTMLElement | null = null;
  private _toggleEl: HTMLButtonElement | null = document.getElementById('settings-toggle') as HTMLButtonElement | null;
  private _visible: boolean = false;

  constructor() {
    this._toggleEl?.addEventListener('click', () => this.toggle());
  }

  mount(containerEl: HTMLElement): void {
    this._panelEl = containerEl;
    this._render();
  }

  toggle(): void {
    this._visible = !this._visible;
    this._panelEl?.classList.toggle('hidden', !this._visible);
  }

  show(): void {
    this._visible = true;
    this._panelEl?.classList.remove('hidden');
  }

  hide(): void {
    this._visible = false;
    this._panelEl?.classList.add('hidden');
  }

  private _render(): void {
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
