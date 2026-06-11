// ============================================================
// INPUT — обработчик клавиатуры
// ============================================================

class InputHandler {
  constructor() {
    this._keys = {};
    this._onKeyDown = this._onKeyDown.bind(this);
    this._onKeyUp = this._onKeyUp.bind(this);

    // Коллбеки для game.js
    this.onMoveLeft = null;
    this.onMoveRight = null;
    this.onSoftDrop = null;
    this.onHardDrop = null;
    this.onRotate = null;
    this.onPause = null;
  }

  /** Привязка слушателей */
  init() {
    document.addEventListener('keydown', this._onKeyDown);
    document.addEventListener('keyup', this._onKeyUp);
  }

  /** Отвязка слушателей */
  destroy() {
    document.removeEventListener('keydown', this._onKeyDown);
    document.removeEventListener('keyup', this._onKeyUp);
  }

  _onKeyDown(e) {
    if (this._keys[e.code]) return; // защита от repeat
    this._keys[e.code] = true;

    const key = e.key;
    const code = e.code;

    const cfg = CONFIG.KEYS;

    // ←
    if (code === cfg.LEFT && this.onMoveLeft) {
      e.preventDefault();
      this.onMoveLeft();
    }
    // →
    else if (code === cfg.RIGHT && this.onMoveRight) {
      e.preventDefault();
      this.onMoveRight();
    }
    // ↓ — soft drop
    else if (code === cfg.DOWN && this.onSoftDrop) {
      e.preventDefault();
      this.onSoftDrop();
    }
    // Space — hard drop
    else if (key === cfg.HARD_DROP && this.onHardDrop) {
      e.preventDefault();
      this.onHardDrop();
    }
    // ↑ или X — поворот (зарезервировано на будущее)
    else if ((code === 'ArrowUp' || key === 'x' || key === 'X') && this.onRotate) {
      e.preventDefault();
      this.onRotate();
    }
    // P или Esc — пауза
    else if ((key === 'p' || key === 'P' || code === 'Escape') && this.onPause) {
      e.preventDefault();
      this.onPause();
    }
  }

  _onKeyUp(e) {
    this._keys[e.code] = false;
  }
}
