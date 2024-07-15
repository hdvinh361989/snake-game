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
  private _matrix?: Array<
    Array<{
      id: string;
      type: Type;
      x: number;
      y: number;
      snakeSkin?: SnakeSkin;
      isSnakeHead?: boolean;
    }>
  >;
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
    if (!this._matrix || this._matrix.length <= 0) return html``;

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
            ${this._matrix?.map((column) => {
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
    this._matrix = this._createNewMatrix();
    this._bait = this._createNewBait();
  }

  private _createNewBait() {
    if (!this._matrix || this._matrix.length <= 0) return void 0;
    let flattenedMatrix = this._matrix?.flat(1);
    // Remove first cell
    flattenedMatrix = flattenedMatrix.slice(1);
    const { x, y } = getRandomItem(flattenedMatrix);
    return new Bait({ x, y });
  }

  private _createNewMatrix() {
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
    this.intervalId = setInterval(() => {}, 1000);
  }

  private stop() {
    this.intervalId && clearInterval(this.intervalId);
  }
}
