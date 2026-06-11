// ============================================================
// RENDERER — отрисовка Canvas (поле + UI) в ретро-стиле
// ============================================================

class Renderer {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    this.ctx = this.canvas.getContext('2d');

    this.cols = CONFIG.COLS;
    this.rows = CONFIG.ROWS;
    this.cellSize = CONFIG.CELL_SIZE;

    // Основной canvas: поле + боковая панель
    this.boardWidth = this.cols * this.cellSize;
    this.panelWidth = 180;
    this.canvas.width = this.boardWidth + this.panelWidth;
    this.canvas.height = this.rows * this.cellSize + 60; // доп. место для заголовка

    // Смещение игрового поля внутри canvas
    this.boardOffsetX = 0;
    this.boardOffsetY = 50;
  }

  /** Главный метод отрисовки */
  render(board, activePiece, nextPiece, scoreManager, gameState) {
    const ctx = this.ctx;
    const theme = CONFIG.THEME;

    // Очистка
    ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    // Фон
    ctx.fillStyle = theme.pageBg;
    ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    // --- Заголовок ---
    this._drawTitle();

    // --- Игровое поле ---
    this._drawBoard(board);

    // --- Активная фигура ---
    if (activePiece && gameState === 'playing') {
      this._drawPiece(activePiece.matrix, activePiece.row, activePiece.col, activePiece.color);
    }

    // --- Сетка поверх ---
    this._drawGrid();

    // --- Боковая панель ---
    this._drawPanel(nextPiece, scoreManager);

    // --- Стартовый экран / Пауза / Game Over ---
    if (gameState === 'idle') {
      this._drawOverlay('TETRIS', theme.textPrimary, theme.boardBorder, 'Press ENTER to start');
    } else if (gameState === 'paused') {
      this._drawOverlay('PAUSED', theme.pauseText, '', 'Press P or ESC to resume');
    } else if (gameState === 'gameover') {
      this._drawOverlay('GAME OVER', theme.gameOverText, theme.gameOverGlow, 'Press ENTER to restart');
    }


    // --- Рамка поля с неоновой подсветкой ---
    this._drawBoardBorder();
  }

  /** Рисует заголовок TETRIS */
  _drawTitle() {
    const ctx = this.ctx;
    const theme = CONFIG.THEME;

    ctx.save();
    ctx.font = 'bold 28px "Courier New", monospace';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';

    // glow
    ctx.shadowColor = theme.boardBorder;
    ctx.shadowBlur = 15;
    ctx.fillStyle = theme.textPrimary;
    ctx.fillText('TETRIS', this.boardWidth / 2, 8);

    ctx.shadowBlur = 0;
    ctx.restore();
  }

  /** Рисует фон игрового поля */
  _drawBoard(board) {
    const ctx = this.ctx;
    const theme = CONFIG.THEME;
    const ox = this.boardOffsetX;
    const oy = this.boardOffsetY;

    // Фон
    ctx.fillStyle = theme.boardBg;
    ctx.fillRect(ox, oy, this.boardWidth, this.rows * this.cellSize);

    // Закреплённые фигуры
    for (let row = 0; row < this.rows; row++) {
      for (let col = 0; col < this.cols; col++) {
        const cell = board.grid[row][col];
        if (cell !== null) {
          const color = CONFIG.PIECE_COLORS[cell];
          this._drawCell(ox + col * this.cellSize, oy + row * this.cellSize, color);
        }
      }
    }
  }

  /** Рисует одну ячейку с объёмным эффектом */
  _drawCell(x, y, color) {
    const ctx = this.ctx;
    const s = this.cellSize;
    const inset = 1;

    // Основной цвет
    ctx.fillStyle = color.main;
    ctx.fillRect(x + inset, y + inset, s - inset * 2, s - inset * 2);

    // Светлая сторона (сверху и слева)
    ctx.fillStyle = color.light;
    ctx.fillRect(x + inset, y + inset, s - inset * 2, 2);
    ctx.fillRect(x + inset, y + inset, 2, s - inset * 2);

    // Тёмная сторона (снизу и справа)
    ctx.fillStyle = color.dark;
    ctx.fillRect(x + inset, y + s - inset - 2, s - inset * 2, 2);
    ctx.fillRect(x + s - inset - 2, y + inset, 2, s - inset * 2);
  }

  /** Рисует сетку (линии между ячейками) */
  _drawGrid() {
    const ctx = this.ctx;
    const theme = CONFIG.THEME;
    const ox = this.boardOffsetX;
    const oy = this.boardOffsetY;

    ctx.strokeStyle = theme.gridLines;
    ctx.lineWidth = 0.5;

    // Вертикальные линии
    for (let col = 0; col <= this.cols; col++) {
      const x = ox + col * this.cellSize;
      ctx.beginPath();
      ctx.moveTo(x, oy);
      ctx.lineTo(x, oy + this.rows * this.cellSize);
      ctx.stroke();
    }

    // Горизонтальные линии
    for (let row = 0; row <= this.rows; row++) {
      const y = oy + row * this.cellSize;
      ctx.beginPath();
      ctx.moveTo(ox, y);
      ctx.lineTo(ox + this.boardWidth, y);
      ctx.stroke();
    }
  }

  /** Рисует неоновую рамку вокруг поля */
  _drawBoardBorder() {
    const ctx = this.ctx;
    const theme = CONFIG.THEME;
    const ox = this.boardOffsetX;
    const oy = this.boardOffsetY;

    ctx.save();
    ctx.shadowColor = theme.boardBorder;
    ctx.shadowBlur = 20;
    ctx.strokeStyle = theme.boardBorder;
    ctx.lineWidth = 2;
    ctx.strokeRect(ox - 2, oy - 2, this.boardWidth + 4, this.rows * this.cellSize + 4);
    ctx.shadowBlur = 0;
    ctx.restore();
  }

  /** Рисует активную фигуру */
  _drawPiece(matrix, row, col, color) {
    const ctx = this.ctx;
    const ox = this.boardOffsetX;
    const oy = this.boardOffsetY;

    for (let r = 0; r < matrix.length; r++) {
      for (let c = 0; c < matrix[r].length; c++) {
        if (matrix[r][c] !== 0) {
          const x = ox + (col + c) * this.cellSize;
          const y = oy + (row + r) * this.cellSize;
          this._drawCell(x, y, color);
        }
      }
    }
  }

  /** Рисует боковую панель */
  _drawPanel(nextPiece, scoreManager) {
    const ctx = this.ctx;
    const theme = CONFIG.THEME;
    const px = this.boardWidth + 15;
    const py = this.boardOffsetY;

    // --- NEXT ---
    ctx.save();
    ctx.font = 'bold 16px "Courier New", monospace';
    ctx.fillStyle = theme.panelLabel;
    ctx.textAlign = 'left';
    ctx.textBaseline = 'top';
    ctx.fillText('▶ NEXT', px, py);

    // Рамка для превью
    const previewX = px;
    const previewY = py + 25;
    const previewSize = 4 * this.cellSize;

    ctx.strokeStyle = theme.panelBorder;
    ctx.lineWidth = 1;
    ctx.shadowColor = theme.boardBorderGlow;
    ctx.shadowBlur = 8;
    ctx.strokeRect(previewX, previewY, previewSize, previewSize);
    ctx.shadowBlur = 0;

    // Фон превью
    ctx.fillStyle = theme.panelBg;
    ctx.fillRect(previewX + 1, previewY + 1, previewSize - 2, previewSize - 2);

    // Следующая фигура
    if (nextPiece) {
      const matrix = nextPiece.matrix;
      const color = nextPiece.color;
      const cols = matrix[0].length;
      const rows = matrix.length;
      const offsetX = previewX + (previewSize - cols * this.cellSize) / 2;
      const offsetY = previewY + (previewSize - rows * this.cellSize) / 2;

      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          if (matrix[r][c] !== 0) {
            this._drawCell(offsetX + c * this.cellSize, offsetY + r * this.cellSize, color);
          }
        }
      }
    }

    // --- SCORE ---
    const scoreY = previewY + previewSize + 30;
    ctx.font = 'bold 16px "Courier New", monospace';
    ctx.fillStyle = theme.panelLabel;
    ctx.fillText('▶ SCORE', px, scoreY);

    ctx.font = 'bold 22px "Courier New", monospace';
    ctx.fillStyle = theme.scoreValue;
    ctx.textAlign = 'right';
    ctx.fillText(String(scoreManager.score), px + previewSize, scoreY + 25);

    // --- LEVEL ---
    const levelY = scoreY + 65;
    ctx.font = 'bold 16px "Courier New", monospace';
    ctx.fillStyle = theme.panelLabel;
    ctx.textAlign = 'left';
    ctx.fillText('▶ LEVEL', px, levelY);

    ctx.font = 'bold 22px "Courier New", monospace';
    ctx.fillStyle = theme.scoreValue;
    ctx.textAlign = 'right';
    ctx.fillText(String(scoreManager.level), px + previewSize, levelY + 25);

    // --- LINES ---
    const linesY = levelY + 65;
    ctx.font = 'bold 16px "Courier New", monospace';
    ctx.fillStyle = theme.panelLabel;
    ctx.textAlign = 'left';
    ctx.fillText('▶ LINES', px, linesY);

    ctx.font = 'bold 22px "Courier New", monospace';
    ctx.fillStyle = theme.scoreValue;
    ctx.textAlign = 'right';
    ctx.fillText(String(scoreManager.lines), px + previewSize, linesY + 25);

    ctx.restore();
  }

  /** Рисует полупрозрачное наложение (старт / пауза / game over) */
  _drawOverlay(text, color, glowColor, subtitle) {
    const ctx = this.ctx;
    const cx = this.canvas.width / 2;
    const cy = this.canvas.height / 2;

    ctx.save();
    ctx.fillStyle = CONFIG.THEME.gameOverBg;
    ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    if (glowColor) {
      ctx.shadowColor = glowColor;
      ctx.shadowBlur = 30;
    }

    ctx.font = 'bold 48px "Courier New", monospace';
    ctx.fillStyle = color;
    ctx.fillText(text, cx, cy - 20);

    ctx.shadowBlur = 0;
    if (subtitle) {
      ctx.font = '16px "Courier New", monospace';
      ctx.fillStyle = CONFIG.THEME.textSecondary;
      ctx.fillText(subtitle, cx, cy + 40);
    }

    ctx.restore();
  }

}
