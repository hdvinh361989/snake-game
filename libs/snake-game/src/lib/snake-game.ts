import { customElement, property, state } from 'lit/decorators.js';
import { choose } from 'lit/directives/choose.js';
import { css, html, LitElement } from 'lit';
import './cell.component';
import { Type } from './cell.component';
import { Snake, SnakeSkin } from './snake.model';
import { Bait } from './bait.model';
import { getRandomItem } from './common';
import { Direction } from './constant';

enum Stage {
  Idle = 1,
  Started,
  End,
}

interface Cell {
  id: string;
  type: Type;
  x: number;
  y: number;
  snakeSkin?: SnakeSkin;
  isSnakeHead?: boolean;
}

@customElement('snake-game')
export class SnakeGame extends LitElement {
  static override styles = css`
    :host {
      display: block;
    }

    h1 {
      cursor: pointer;
    }

    .row {
      display: flex;
    }

    display-cell {
      outline: black 1px solid;
    }
  `;

  @property()
  dimension!: { width: number; height: number };
  @property()
  speed = 350;

  @state()
  private _stage: Stage = Stage.Idle;
  @state()
  private _cells?: Array<Array<Cell>>;
  private _snake?: Snake;
  private _bait?: Bait;
  private _result?: 'Win' | 'Lose';
  private intervalId?: number;

  get isIdle() {
    return this._stage === Stage.Idle;
  }

  get isStarted() {
    return this._stage === Stage.Started;
  }

  get isEnd() {
    return this._stage === Stage.End;
  }

  protected override render() {
    return html`
      ${choose(this._stage, [
        [Stage.Idle, () => this._getIdleTemplate()],
        [Stage.Started, () => this._getStartTemplate()],
        [Stage.End, () => this._getEndTemplate()],
      ])}
    `;
  }

  private _getIdleTemplate() {
    return html`<h1 @click="${this.start}">Start</h1>`;
  }

  private _getStartTemplate() {
    return html` <section id="cell-container">${this._getRows()}</section> `;
  }

  private _getEndTemplate() {
    return html`<h1 @click="${this.start}">${this._result}</h1>`;
  }

  private _getRows() {
    return html`
      ${new Array(this.dimension.height).fill(0).map(
        (v, rowIndex) => html`
          <div class="row">
            ${this._cells?.map((column) => {
              const { type, snakeSkin, isSnakeHead } = column[rowIndex];
              return html`
                <display-cell
                  .type="${type}"
                  .snakeSkin="${snakeSkin}"
                  .isSnakeHead="${isSnakeHead}"
                ></display-cell>
              `;
            })}
          </div>
        `
      )}
    `;
  }

  start() {
    this._stage = Stage.Started;
    this._snake = new Snake(this.dimension);
    this._result = void 0;
    this._cells = this._createNewCells();
    this._bait = this._createNewBait();
    this.run();
  }

  private _createNewBait() {
    if (!this._cells || this._cells.length <= 0) return void 0;

    let flattenedMatrix = this._cells?.flat(1);

    // Exclude snake cells and bait cells
    let usedPositions: Array<{ x: number; y: number }> = [];
    if (this._snake) {
      usedPositions = [...this._snake.body];
    }

    if (this._bait) {
      usedPositions = [...usedPositions, this._bait.position];
    }

    const usedIds = usedPositions.map(({ x, y }) => `${x}-${y}`);
    flattenedMatrix = flattenedMatrix.filter(
      (cell) => !usedIds.includes(cell.id)
    );
    const { x, y } = getRandomItem(flattenedMatrix);
    return new Bait({ x, y });
  }

  private _createNewCells(): Array<Array<Cell>> {
    const { width, height } = this.dimension;
    return new Array(width).fill(0).map((v, colIdx) =>
      new Array(height).fill(0).map((v, rowIdx) => ({
        id: `${colIdx}-${rowIdx}`,
        type: Type.Ground,
        x: colIdx,
        y: rowIdx,
      }))
    );
  }

  private run() {
    this.stop();
    this._update();

    // Set update interval
    this.intervalId = setInterval(
      () => this._update(),
      this.speed
    ) as unknown as number;

    // Listen for arrow key to change direction
    window.addEventListener('keydown', this._onKeyDown);
  }

  private stop() {
    this.intervalId && clearInterval(this.intervalId);
    window.removeEventListener('keydown', this._onKeyDown);
  }

  private _onKeyDown = (e: KeyboardEvent) => {
    switch (e.key) {
      case 'ArrowUp': {
        this._snake?.changeDirection(Direction.Up);
        break;
      }
      case 'ArrowDown': {
        this._snake?.changeDirection(Direction.Down);
        break;
      }
      case 'ArrowLeft': {
        this._snake?.changeDirection(Direction.Left);
        break;
      }
      case 'ArrowRight': {
        this._snake?.changeDirection(Direction.Right);
        break;
      }
      default:
        break;
    }
    this._update();
  };

  private _update() {
    if (!this._snake) return;

    if (!this._bait || !this._snake.isEatable(this._bait)) {
      this._snake.move();
    } else {
      const newBait = this._createNewBait();
      this._snake.eat(this._bait.nutrition);
      this._bait = newBait;
    }

    // Lose: If the snake bit him self and hit the
    if (this._snake.isBitten || this._snake.isHitTheWall) {
      this._result = 'Lose';
      this._stage = Stage.End;
      return;
    }

    const newCells = this._createNewCells();
    // Update snake cells
    this._snake.body.forEach(
      ({ x, y }, idx, list) =>
        (newCells[x][y] = {
          ...newCells[x][y],
          type: Type.Snake,
          isSnakeHead: idx === list.length - 1,
          snakeSkin: this._snake?.skin,
        })
    );
    // Update bait cell (if any)
    if (this._bait) {
      const { position } = this._bait;
      const { x, y } = position;
      newCells[x][y] = { ...newCells[x][y], type: Type.Bait };
    }

    // Update cells
    this._cells = newCells;

    // Win: The snake fill all cells
    const flattenCells = newCells.flat(1);
    if (!flattenCells.find((cell) => cell.type === Type.Ground)) {
      this._result = 'Win';
      this._stage = Stage.End;
    }
  }
}
declare global {
  interface HTMLElementTagNameMap {
    'snake-game': SnakeGame;
  }
}
