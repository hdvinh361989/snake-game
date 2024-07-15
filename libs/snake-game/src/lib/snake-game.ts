import { customElement, property, state } from 'lit/decorators';
import { choose } from 'lit/directives/choose';
import { css, html, LitElement } from 'lit';
import { Snake, SnakeSkin } from './snake.model';
import { Type } from './cell.component';
import { Bait } from './bait.model';
import { getRandomItem } from './common';

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
    }
  `;

  @property()
  dimension!: { width: number; height: number };

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
    if (!this._cells || this._cells.length <= 0) return html``;

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
    return html`<h1 @click="${this.start}"></h1>`;
  }

  private _getRows() {
    return html`
      ${new Array(this.dimension.height).fill(0).map(
        (v, rowIndex) => html`
          <div class="row">
            ${this._cells?.map((column) => {
              const { type, snakeSkin, isSnakeHead } = column[rowIndex];
              return html`
                <cell
                  .type="${type}"
                  .snakeSkin="${snakeSkin}"
                  .isSnakeHead="${isSnakeHead}"
                ></cell>
              `;
            })}
          </div>
        `
      )}
    `;
  }

  start() {
    this._stage = Stage.Started;
    this._snake = new Snake();
    this._result = void 0;
    this._cells = this._createNewCells();
    this._bait = this._createNewBait();
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
    this.intervalId = setInterval(
      () => this._update(),
      1000
    ) as unknown as number;
  }

  private stop() {
    this.intervalId && clearInterval(this.intervalId);
  }

  private _update() {
    if (!this._snake) return;

    if (!this._bait || !this._snake.isEatable(this._bait)) {
      this._snake.move();
    } else {
      const newBait = this._createNewBait();
      this._snake.eat(this._bait.nutrition);
      this._bait = newBait;
    }

    const cells = this._createNewCells();
    // Update snake cells
    this._snake.body.forEach(
      ({ x, y }, idx, list) =>
        (cells[x][y] = {
          ...cells[x][y],
          type: Type.Snake,
          isSnakeHead: idx === list.length - 1,
          snakeSkin: this._snake?.skin,
        })
    );
    // Update bait cell (if any)
    if (this._bait) {
      const { position } = this._bait;
      const { x, y } = position;
      cells[x][y] = { ...cells[x][y], type: Type.Bait };
    }
  }
}
