import { css, LitElement, PropertyValues } from 'lit';
import { customElement, property } from 'lit/decorators.js';

export enum Type {
  Ground = 1,
  Snake,
  Bait,
}

@customElement('display-cell')
export class CellComponent extends LitElement {
  static override styles = css`
    :host {
      display: block;
      width: 24px;
      height: 24px;
      border: solid 1px transparent;
      border-radius: 50%;
    }
  `;

  @property()
  type: Type = Type.Ground;

  @property()
  skin?: string;

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
        this.style.backgroundColor = this.skin ?? '';
        if (!this.isSnakeHead) {
          this.style.opacity = '0.5';
        }
        break;
      }
      case Type.Bait: {
        this.style.backgroundColor = this.skin ?? '';
        break;
      }
      default:
        break;
    }
  }
}
declare global {
  interface HTMLElementTagNameMap {
    'display-cell': CellComponent;
  }
}
