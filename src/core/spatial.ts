export interface Point { x: number; y: number }
export class SpatialHash<T extends Point> {
  private cells = new Map<number, T[]>();
  constructor(private size = 100) {}
  rebuild(items: T[]) {
    this.cells.clear();
    for (const item of items) { const key = this.key(item.x, item.y); const cell = this.cells.get(key); if (cell) cell.push(item); else this.cells.set(key, [item]); }
  }
  private key(x: number, y: number) { return Math.floor(x / this.size) + Math.floor(y / this.size) * 10000; }
  query(x: number, y: number, radius: number): T[] {
    const out: T[] = [];
    for (let cy = Math.floor((y-radius)/this.size); cy <= Math.floor((y+radius)/this.size); cy++)
      for (let cx = Math.floor((x-radius)/this.size); cx <= Math.floor((x+radius)/this.size); cx++) {
        const cell = this.cells.get(cx + cy * 10000); if (cell) for (const e of cell) if ((e.x-x)**2 + (e.y-y)**2 <= radius**2) out.push(e);
      }
    return out;
  }
}
