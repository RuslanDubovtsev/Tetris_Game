// ============================================================
// INPUT — обработчик клавиатуры
// ============================================================

class InputHandler {
  constructor() {
    this._keys = {};
    this._holdStates = {}; // { code: { pressedAt, lastRepeatAt, dasTriggered } }
    this.DAS_DELAY = 170;  // задержка перед авто-повтором (ms)
    this.ARR_INTERVAL = 50; // интервал авто-повтора (ms)

    this._onKeyDown = this._onKeyDown.bind(this);
    this._onKeyUp = this._onKeyUp.bind(this);

    // Коллбеки для game.js
    this.onMoveLeft = null;
    this.onMoveRight = null;
    this.onSoftDrop = null;
    this.onHardDrop = null;
    this.onRotate = null;
    this.onPause = null;
    this.onHold = null;
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

  /**
   * Вызывается каждый кадр из игрового цикла
   * Обрабатывает удержание клавиш движения (DAS/ARR)
   */
  update(now) {
    const cfg = CONFIG.KEYS;
    const movementCodes = [cfg.LEFT, cfg.RIGHT, cfg.DOWN];

    for (const code of movementCodes) {
      if (!this._keys[code]) continue;

      const state = this._holdStates[code];
      if (!state) continue;

      const elapsed = now - state.pressedAt;

      if (!state.dasTriggered) {
        // DAS ещё не сработал — ждём
        if (elapsed >= this.DAS_DELAY) {
          state.dasTriggered = true;
          state.lastRepeatAt = now;
          this._fireByCode(code);
        }
      } else {
        // DAS сработал — повторяем с интервалом ARR
        if (now - state.lastRepeatAt >= this.ARR_INTERVAL) {
          state.lastRepeatAt = now;
          this._fireByCode(code);
        }
      }
    }
  }

  _onKeyDown(e) {
    const key = e.key;
    const code = e.code;
    const cfg = CONFIG.KEYS;

    // Определяем, является ли клавиша клавишей движения
    const isMovement = (code === cfg.LEFT || code === cfg.RIGHT || code === cfg.DOWN);

    if (isMovement) {
      // Для клавиш движения не блокируем repeat,
      // но обрабатываем только первый press
      if (!this._keys[code]) {
        this._keys[code] = true;
        this._holdStates[code] = {
          pressedAt: performance.now(),
          lastRepeatAt: 0,
          dasTriggered: false,
        };
        e.preventDefault();
        this._fireByCode(code);
      }
      return;
    }

    // Для остальных клавиш — защита от repeat
    if (this._keys[code]) return;
    this._keys[code] = true;

    // Space — hard drop
    if (key === cfg.HARD_DROP && this.onHardDrop) {
      e.preventDefault();
      this.onHardDrop();
    }
    // ↑ или X — поворот
    else if ((code === 'ArrowUp' || key === 'x' || key === 'X') && this.onRotate) {
      e.preventDefault();
      this.onRotate();
    }
    // P или Esc — пауза
    else if ((key === 'p' || key === 'P' || code === 'Escape') && this.onPause) {
      e.preventDefault();
      this.onPause();
    }
    // C — hold piece
    else if ((key === 'c' || key === 'C') && this.onHold) {
      e.preventDefault();
      this.onHold();
    }
  }

  _onKeyUp(e) {
    const code = e.code;
    this._keys[code] = false;
    delete this._holdStates[code];
  }

  /** Вызвать нужный callback по коду клавиши */
  _fireByCode(code) {
    const cfg = CONFIG.KEYS;
    if (code === cfg.LEFT && this.onMoveLeft) {
      this.onMoveLeft();
    } else if (code === cfg.RIGHT && this.onMoveRight) {
      this.onMoveRight();
    } else if (code === cfg.DOWN && this.onSoftDrop) {
      this.onSoftDrop();
    }
  }
}
