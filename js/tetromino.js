// ============================================================
// TETROMINO — сущность активной фигуры
// ============================================================

class Tetromino {
  /**
   * @param {string} type - ключ фигуры ('I','O','T','L','J','S','Z')
   */
  constructor(type) {
    this.type = type;
    this.matrix = cloneMatrix(CONFIG.PIECES[type].matrix);
    this.color = CONFIG.PIECE_COLORS[type];
    this.row = 0;
    this.col = Math.floor((CONFIG.COLS - this.matrix[0].length) / 2);
  }

  /** Создаёт новую фигуру случайного типа */
  static random(type) {
    return new Tetromino(type);
  }

  /** Копия фигуры (для превью / проверки) */
  clone() {
    const t = new Tetromino(this.type);
    t.matrix = cloneMatrix(this.matrix);
    t.row = this.row;
    t.col = this.col;
    return t;
  }

  /**
   * Поворачивает матрицу фигуры на 90° по часовой стрелке.
   * Возвращает новую матрицу, не изменяя оригинал.
   */
  getRotatedMatrix() {
    return rotateMatrixClockwise(this.matrix);
  }
}
