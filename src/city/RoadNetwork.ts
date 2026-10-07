export class RoadNetwork {
  build(_gridSize: any, _blockSize: any, _roadWidth: any, _scene: any): { mesh: any, waypointGraph: Map<string, any[]> } {
    return { mesh: null, waypointGraph: new Map() };
  }
}
