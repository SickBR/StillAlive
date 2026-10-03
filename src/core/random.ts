export class Random {
  constructor(public seed = Date.now() >>> 0) {}
  next() { let t = this.seed = (this.seed + 0x6D2B79F5) >>> 0; t = Math.imul(t ^ t >>> 15, t | 1); t ^= t + Math.imul(t ^ t >>> 7, t | 61); return ((t ^ t >>> 14) >>> 0) / 4294967296; }
  between(a: number, b: number) { return a + this.next() * (b - a); }
  pick<T>(list: readonly T[]) { return list[Math.floor(this.next() * list.length)]; }
}

