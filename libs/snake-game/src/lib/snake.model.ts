import { Bait } from './bait.model';
import { Direction } from './constant';

const DF_LENGTH = 3;
const STARTING_POSITION = { x: 0, y: 0 };
export enum SnakeSkin {
  Red = 'red',
  Blue = 'blue',
}
export const DF_SNAKE_SKIN = SnakeSkin.Red;

export class Snake {
  body: Array<{ x: number; y: number }> = new Array(DF_LENGTH).fill({
    ...STARTING_POSITION,
  });
  skin = DF_SNAKE_SKIN;
  playgroundDimension!: { width: number; height: number };

  private _direction = Direction.Down;

  get headPosition() {
    return this.body[this.body.length - 1];
  }

  get isBitten() {
    return !!this.body
      .slice(0, this.body.length - 1)
      .find(
        ({ x, y }) => this.headPosition.x === x && this.headPosition.y === y
      );
  }

  get isHitTheWall(): boolean {
    const { x, y } = this.headPosition;
    const { width, height } = this.playgroundDimension;
    return x < 0 || x >= width || y < 0 || y >= height;
  }

  constructor(playgroundDimension: { width: number; height: number }) {
    this.playgroundDimension = playgroundDimension;
  }

  changeDirection(direction: Direction): boolean {
    if (this._direction + 1 === direction || this._direction - 1 === direction)
      return false;
    this._direction = direction;
    return true;
  }

  eat(nutrition: number) {
    const newHead = this.getNextHeadPosition(nutrition);
    if (!newHead) return;
    this.body.push(newHead);
  }

  move(distance = 1) {
    const newHead = this.getNextHeadPosition(distance);
    if (!newHead) return;
    // Remove the tail
    this.body.shift();
    // Add new head
    this.body.push(newHead);
  }

  getNextHeadPosition(distance = 1) {
    const currentHeadPosition = this.headPosition;
    switch (this._direction) {
      case Direction.Up: {
        return {
          x: currentHeadPosition.x,
          y: currentHeadPosition.y - distance,
        };
      }
      case Direction.Down: {
        return {
          x: currentHeadPosition.x,
          y: currentHeadPosition.y + distance,
        };
      }
      case Direction.Left: {
        return {
          x: currentHeadPosition.x - distance,
          y: currentHeadPosition.y,
        };
      }
      case Direction.Right: {
        return {
          x: currentHeadPosition.x + distance,
          y: currentHeadPosition.y,
        };
      }
      default: {
        console.error('Direction value is not correct');
        return null;
      }
    }
  }

  isEatable(bait: Bait) {
    const { position } = bait;
    const nextPosition = this.getNextHeadPosition();
    return nextPosition?.x === position.x && nextPosition.y === position.y;
  }
}
