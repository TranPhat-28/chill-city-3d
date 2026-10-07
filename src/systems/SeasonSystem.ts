export class SeasonSystem {
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

  init(_engine: any, _terrain: any, _forest: any): void {
    window.addEventListener('cc:season-change', ((e: CustomEvent) => {
      this.applySeason(e.detail.season);
    }) as EventListener);
  }

  applySeason(_season: string): void {}
}
