export class TimeSystem {
  init(_engine: any, _sky: any): void {
    window.addEventListener('cc:time-change', ((e: CustomEvent) => {
      this.applyPreset(e.detail.preset);
    }) as EventListener);
  }

  applyPreset(_preset: string): void {}
}
