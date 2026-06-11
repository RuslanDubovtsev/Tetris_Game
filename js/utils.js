// ============================================================
// UTILS — вспомогательные функции
// ============================================================

/**
 * Генератор случайных чисел с использованием 7-bag randomizer.
 * Обеспечивает, что каждая из 7 фигур появится ровно 1 раз за "bag".
 * Это стандартный алгоритм Tetris для честного распределения.
 */
class BagRandomizer {
  constructor() {
    this._pieces = Object.keys(CONFIG.PIECES); // ['I','O','T','L','J','S','Z']
    this._bag = [];
  }

  /** Возвращает следующую фигуру */
  next() {
    if (this._bag.length === 0) {
      this._refill();
    }
    return this._bag.pop();
  }

  /** Показывает следующую фигуру без извлечения */
  peek() {
    if (this._bag.length === 0) {
      this._refill();
    }
    return this._bag[this._bag.length - 1];
  }

  _refill() {
    this._bag = [...this._pieces];
    // Перемешиваем Fisher-Yates
    for (let i = this._bag.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [this._bag[i], this._bag[j]] = [this._bag[j], this._bag[i]];
    }
  }
}

/** Глубокое копирование матрицы */
function cloneMatrix(matrix) {
  return matrix.map(row => [...row]);
}
