// ============================================================
// BOARD — игровое поле 10×20
// ============================================================

class Board {
  constructor() {
    this.cols = CONFIG.COLS;
    this.rows = CONFIG.ROWS;
    this.grid = this._createEmptyGrid();
  }

  /** Создаёт пустую матрицу (null — пустая клетка) */
  _createEmptyGrid() {
    return Array.from({ length: this.rows }, () =>
      Array(this.cols).fill(null)
    );
  }

  /** Сброс поля */
  reset() {
    this.grid = this._createEmptyGrid();
  }

  /** Проверка, пуста ли клетка */
  isEmpty(row, col) {
    return row >= 0 && row < this.rows && col >= 0 && col < this.cols && this.grid[row][col] === null;
  }

  /** Проверка, находится ли клетка в пределах поля */
  isInBounds(row, col) {
    return row >= 0 && row < this.rows && col >= 0 && col < this.cols;
  }

  /** Можно ли разместить матрицу фигуры в позиции (row, col)? */
  canPlace(matrix, row, col) {
    for (let r = 0; r < matrix.length; r++) {
      for (let c = 0; c < matrix[r].length; c++) {
        if (matrix[r][c] !== 0) {
          const boardRow = row + r;
          const boardCol = col + c;
          if (!this.isInBounds(boardRow, boardCol) || !this.isEmpty(boardRow, boardCol)) {
            return false;
          }
        }
      }
    }
    return true;
  }

  /** Фиксация фигуры на поле */
  lockPiece(matrix, row, col, pieceType) {
    for (let r = 0; r < matrix.length; r++) {
      for (let c = 0; c < matrix[r].length; c++) {
        if (matrix[r][c] !== 0) {
          const boardRow = row + r;
          const boardCol = col + c;
          if (this.isInBounds(boardRow, boardCol)) {
            this.grid[boardRow][boardCol] = pieceType;
          }
        }
      }
    }
  }

  /** Находит и удаляет заполненные линии, возвращает количество удалённых */
  clearLines() {
    let cleared = 0;
    for (let row = this.rows - 1; row >= 0; row--) {
      if (this.grid[row].every(cell => cell !== null)) {
        // Удаляем строку
        this.grid.splice(row, 1);
        this.grid.unshift(Array(this.cols).fill(null));
        cleared++;
        row++; // проверяем эту же строку снова (после сдвига)
      }
    }
    return cleared;
  }

  /** Проверка Game Over: если в верхней строке есть блоки — проигрыш */
  isTopReached() {
    return this.grid[0].some(cell => cell !== null);
  }
}
