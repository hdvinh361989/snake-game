export class Bait {
  position!: { x: number; y: number };
  nutrition = 1;

  constructor(position: { x: number; y: number }, nutrition?: number) {
    this.position = position;
    nutrition && (this.nutrition = nutrition);
  }
}
