import { Bait } from './bait.model';

const DF_LENGTH = 3;
const STARTING_POSITION = { x: 0, y: 0 };
export enum SnakeSkin {
  Red = 'red',
  Blue = 'blue',
}
export const DF_SNAKE_SKIN = SnakeSkin.Red;
enum Direction {
  Top = 1,
  Bottom,
  Left = 5,
  Right,
}

export class Snake {
  body: Array<{ x: number; y: number }> = new Array(DF_LENGTH).fill({
    ...STARTING_POSITION,
  });
  skin = DF_SNAKE_SKIN;
  direction = Direction.Bottom;

  get headPosition() {
    return this.body[this.body.length - 1];
  }

  get isDead() {
    return !!this.body
      .slice(0, this.body.length - 1)
      .find(
        ({ x, y }) => this.headPosition.x === x && this.headPosition.y === y
      );
  }

  changeDirection(direction: Direction) {
    if (
      this.direction === direction ||
      this.direction + 1 === direction ||
      this.direction - 1 === direction
    )
      return;
    this.direction = direction;
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
    switch (this.direction) {
      case Direction.Top: {
        return {
          x: currentHeadPosition.x,
          y: currentHeadPosition.y - distance,
        };
      }
      case Direction.Bottom: {
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
