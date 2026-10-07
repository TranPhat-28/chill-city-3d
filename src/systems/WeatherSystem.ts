export class WeatherSystem {
  init(_engine: any): void {
    window.addEventListener('cc:weather-change', ((e: CustomEvent) => {
      this.applyWeather(e.detail.type);
    }) as EventListener);
  }

  applyWeather(_type: string): void {}
  update(_delta: number): void {}
}
