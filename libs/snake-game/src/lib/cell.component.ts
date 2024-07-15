import { css, LitElement, PropertyValues } from 'lit';
import { customElement, property } from 'lit/decorators';
import { DF_SNAKE_SKIN, SnakeSkin } from './snake.model';

export enum Type {
  Ground = 1,
  Snake,
  Bait,
}
const DF_BAIT_COLOR = 'yellow';

@customElement('cell')
export class CellComponent extends LitElement {
  static override styles = css`
    :host {
      display: block;
      width: 48px;
      height: 48px;
      border: solid 1px transparent;
      border-radius: 50%;
    }
  `;

  @property()
  type: Type = Type.Ground;

  @property()
  snakeSkin: SnakeSkin = DF_SNAKE_SKIN;

  @property()
  isSnakeHead?: boolean;

  protected override updated(_changedProperties: PropertyValues) {
    super.updated(_changedProperties);
    this._setStyle();
  }

  private _setStyle() {
    // Reset styles
    this.style.backgroundColor = '';
    this.style.opacity = '';

    // Set styles
    switch (this.type) {
      case Type.Snake: {
        this.style.backgroundColor = this.snakeSkin;
        if (!this.isSnakeHead) {
          this.style.opacity = '0.5';
        }
        break;
      }
      case Type.Bait: {
        this.style.backgroundColor = DF_BAIT_COLOR;
        break;
      }
      default:
        break;
    }
  }
}
declare global {
  interface HTMLElementTagNameMap {
    cell: CellComponent;
  }
}
