import * as THREE from 'three';

export const GRID_UNIT = 20;

export class Grid extends THREE.Group {
  public readonly GRID_UNIT = GRID_UNIT;
  public readonly size: number;

  constructor(size: number = 20) {
    super();
    this.size = size;
    this.name = 'Grid';
    this.build();
  }

  private build(): void {
    const halfSize = this.size / 2;
    const cellGeometry = new THREE.BoxGeometry(GRID_UNIT, 0.3, GRID_UNIT);

    for (let x = 0; x < this.size; x++) {
      for (let z = 0; z < this.size; z++) {
        const isDark = (x + z) % 2 === 0;
        const material = new THREE.MeshStandardMaterial({
          color: isDark ? 0x7ea56b : 0x88b177,
          roughness: 1,
          metalness: 0,
          transparent: true,
          opacity: 0.9,
        });

        const tile = new THREE.Mesh(cellGeometry, material);
        tile.position.set(
          (x - halfSize + 0.5) * GRID_UNIT,
          0.05,
          (z - halfSize + 0.5) * GRID_UNIT
        );
        tile.receiveShadow = true;
        this.add(tile);
      }
    }

    const outline = new THREE.LineSegments(
      new THREE.EdgesGeometry(new THREE.BoxGeometry(this.size * GRID_UNIT, 0.1, this.size * GRID_UNIT)),
      new THREE.LineBasicMaterial({ color: 0x203323 })
    );
    outline.position.y = 0.08;
    this.add(outline);
  }

  public cellToWorld(x: number, z: number): THREE.Vector3 {
    return new THREE.Vector3(
      (x - this.size / 2 + 0.5) * GRID_UNIT,
      0,
      (z - this.size / 2 + 0.5) * GRID_UNIT
    );
  }

  public worldToCell(worldX: number, worldZ: number): { x: number; z: number } {
    const x = Math.floor((worldX / GRID_UNIT) + this.size / 2);
    const z = Math.floor((worldZ / GRID_UNIT) + this.size / 2);
    return { x, z };
  }
}
