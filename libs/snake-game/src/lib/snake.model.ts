const DF_LENGTH = 3;
const STARTING_POSITION = { x: 0, y: 0 };
enum SKIN {
  Red = 1,
  Blue,
}
enum Direction {
  Top = 1,
  Bottom,
  Left,
  Right,
}

export class Snake {
  body: Array<{ x: number; y: number }> = new Array(DF_LENGTH).fill({
    ...STARTING_POSITION,
  });
  skin = SKIN.Red;
  direction = Direction.Bottom;

  get headPosition() {
    return this.body[this.body.length - 1];
  }

  eat(nutrition: number) {
    const newHead = this._calculateHeadPosition(nutrition);
    if (!newHead) return;
    this.body.push(newHead);
  }

  move(distance = 1) {
    const newHead = this._calculateHeadPosition(distance);
    if (!newHead) return;
    // Remove the tail
    this.body.shift();
    // Add new head
    this.body.push(newHead);
  }

  private _calculateHeadPosition(distance = 1) {
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
}
