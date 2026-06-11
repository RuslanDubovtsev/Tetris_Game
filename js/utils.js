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

/**
 * Поворот матрицы на 90° по часовой стрелке.
 * result[c][rows - 1 - r] = matrix[r][c]
 */
function rotateMatrixClockwise(matrix) {
  const rows = matrix.length;
  const cols = matrix[0].length;
  const result = Array.from({ length: cols }, () => Array(rows).fill(0));
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      result[c][rows - 1 - r] = matrix[r][c];
    }
  }
  return result;
}

/**
 * Таблицы Wall Kick (смещения) для поворота фигур.
 * Основаны на стандартных SRS-смещениях, упрощённая версия.
 *
 * Каждый массив содержит пары [colOffset, rowOffset],
 * которые последовательно пробуются при повороте.
 */
const WALL_KICKS = {
  // Для J, L, S, T, Z
  JLSTZ: [
    [ 0,  0], // исходная позиция
    [-1,  0], // на 1 влево
    [ 1,  0], // на 1 вправо
    [ 0, -1], // на 1 вверх
    [-1, -1], // влево + вверх
    [ 1, -1], // вправо + вверх
  ],
  // Для I — длинная фигура, нужны большие смещения
  I: [
    [ 0,  0],
    [-2,  0],
    [ 2,  0],
    [-1,  0],
    [ 1,  0],
    [ 0, -1],
    [-2, -1],
    [ 2, -1],
    [-1, -1],
    [ 1, -1],
  ],
  // Для O — не вращается, но на всякий случай
  O: [
    [ 0,  0],
  ],
};

/** Возвращает массив wall kick смещений для данного типа фигуры */
function getWallKicks(pieceType) {
  if (pieceType === 'I') return WALL_KICKS.I;
  if (pieceType === 'O') return WALL_KICKS.O;
  return WALL_KICKS.JLSTZ;
}
