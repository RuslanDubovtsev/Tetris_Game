 // ============================================================
// GAME — ядро игры: состояния, цикл, коллизии, Game Over
// ============================================================

class Game {
  constructor() {
    this.board = new Board();
    this.scoreManager = new ScoreManager();
    this.renderer = new Renderer('game-canvas');
    this.input = new InputHandler();
    this.randomizer = new BagRandomizer();

    this.state = 'idle'; // idle | playing | paused | gameover
    this.activePiece = null;
    this.nextPiece = null;

    // Hold piece
    this.holdPiece = null;
    this.hasHeldThisTurn = false;

    this.dropTimer = null;
    this.lastDropTime = 0;
    this.animationId = null;

    this._bindInput();
  }

  /** Инициализация и запуск */
  init() {
    this.input.init();
    this.state = 'idle';
    this._loop();
  }

  /** Начало новой игры */
  start() {
    this.board.reset();
    this.scoreManager.reset();
    this.randomizer = new BagRandomizer();

    // Первая фигура
    const type1 = this.randomizer.next();
    this.activePiece = new Tetromino(type1);

    // Следующая фигура
    const type2 = this.randomizer.next();
    this.nextPiece = new Tetromino(type2);

    this.state = 'playing';
    this.lastDropTime = performance.now();
  }

  /** Рестарт */
  restart() {
    // Сброс hold при рестарте
    this.holdPiece = null;
    this.hasHeldThisTurn = false;
    this.start();
  }

  /** Основной игровой цикл (requestAnimationFrame) */
  _loop(now = performance.now()) {
    this.animationId = requestAnimationFrame((t) => this._loop(t));

    if (this.state === 'playing') {
      this._update(now);
    }

    this._draw();
  }

  /** Обновление логики */
  _update(now) {
    // Обработка удержания клавиш (DAS/ARR)
    this.input.update(now);

    const interval = this.scoreManager.dropInterval;
    if (now - this.lastDropTime >= interval) {
      this.lastDropTime = now;
      this._moveDown();
    }
  }

  /** Отрисовка */
  _draw() {
    this.renderer.render(
      this.board,
      this.activePiece,
      this.nextPiece,
      this.scoreManager,
      this.state,
      this.holdPiece
    );
  }

  // ============================================================
  // УПРАВЛЕНИЕ ФИГУРОЙ
  // ============================================================

  /** Движение влево */
  moveLeft() {
    if (this.state !== 'playing' || !this.activePiece) return;
    const piece = this.activePiece;
    if (this.board.canPlace(piece.matrix, piece.row, piece.col - 1)) {
      piece.col--;
    }
  }

  /** Движение вправо */
  moveRight() {
    if (this.state !== 'playing' || !this.activePiece) return;
    const piece = this.activePiece;
    if (this.board.canPlace(piece.matrix, piece.row, piece.col + 1)) {
      piece.col++;
    }
  }

  /** Движение вниз (один шаг) */
  moveDown() {
    if (this.state !== 'playing' || !this.activePiece) return;
    this._moveDown();
    this.lastDropTime = performance.now();
  }

  /** Внутреннее падение на 1 клетку */
  _moveDown() {
    if (!this.activePiece) return;
    const piece = this.activePiece;
    if (this.board.canPlace(piece.matrix, piece.row + 1, piece.col)) {
      piece.row++;
    } else {
      this._lockPiece();
    }
  }

  /** Soft drop — ускоренное падение (многократный вызов) */
  softDrop() {
    if (this.state !== 'playing' || !this.activePiece) return;
    // Двигаем вниз, пока не упрёмся, начисляем очки
    const piece = this.activePiece;
    if (this.board.canPlace(piece.matrix, piece.row + 1, piece.col)) {
      piece.row++;
      this.scoreManager.addSoftDropBonus(1);
      this.lastDropTime = performance.now();
    } else {
      this._lockPiece();
    }
  }

  /** Hard drop — мгновенное падение до низа */
  hardDrop() {
    if (this.state !== 'playing' || !this.activePiece) return;
    const piece = this.activePiece;
    let cells = 0;
    while (this.board.canPlace(piece.matrix, piece.row + 1, piece.col)) {
      piece.row++;
      cells++;
    }
    this.scoreManager.addHardDropBonus(cells);
    this._lockPiece();
  }

  /** Поворот фигуры с Wall Kick */
  rotate() {
    if (this.state !== 'playing' || !this.activePiece) return;
    const piece = this.activePiece;

    // Не вращаем O
    if (piece.type === 'O') return;

    const rotatedMatrix = piece.getRotatedMatrix();
    const kicks = getWallKicks(piece.type);

    for (const [colOff, rowOff] of kicks) {
      const newCol = piece.col + colOff;
      const newRow = piece.row + rowOff;
      if (this.board.canPlace(rotatedMatrix, newRow, newCol)) {
        piece.matrix = rotatedMatrix;
        piece.col = newCol;
        piece.row = newRow;
        return; // успешный поворот
      }
    }
    // Если ни одно смещение не подошло — поворот не удался
  }

  /** Пауза / продолжение */
  togglePause() {
    if (this.state === 'playing') {
      this.state = 'paused';
    } else if (this.state === 'paused') {
      this.state = 'playing';
      this.lastDropTime = performance.now();
    }
  }

  // ============================================================
  // ФИКСАЦИЯ ФИГУРЫ И СПАВН
  // ============================================================

  /** Фиксация фигуры на поле */
  _lockPiece() {
    if (!this.activePiece) return;
    const piece = this.activePiece;

    this.board.lockPiece(piece.matrix, piece.row, piece.col, piece.type);

    // Очистка линий
    const linesCleared = this.board.clearLines();
    if (linesCleared > 0) {
      this.scoreManager.addClearedLines(linesCleared);
    }

    // Проверка Game Over
    if (this.board.isTopReached()) {
      this.state = 'gameover';
      this.activePiece = null;
      return;
    }

    // Сброс флага hold для нового хода
    this.hasHeldThisTurn = false;

    // Спавн новой фигуры
    this._spawnNext();
  }

  /** Спавн следующей фигуры */
  _spawnNext() {
    const type = this.nextPiece.type;
    this.activePiece = new Tetromino(type);

    // Следующая фигура из мешка
    const nextType = this.randomizer.next();
    this.nextPiece = new Tetromino(nextType);

    // Если новая фигура не может быть размещена — Game Over
    if (!this.board.canPlace(this.activePiece.matrix, this.activePiece.row, this.activePiece.col)) {
      this.state = 'gameover';
      this.activePiece = null;
    }
  }

  // ============================================================
  // ПРИВЯЗКА УПРАВЛЕНИЯ
  // ============================================================

  _bindInput() {
    this.input.onMoveLeft = () => this.moveLeft();
    this.input.onMoveRight = () => this.moveRight();
    this.input.onSoftDrop = () => this.softDrop();
    this.input.onHardDrop = () => this.hardDrop();
    this.input.onRotate = () => this.rotate();
    this.input.onPause = () => this.togglePause();
    this.input.onHold = () => this.hold();

    // Enter для старта / рестарта
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        if (this.state === 'idle' || this.state === 'gameover') {
          this.restart();
        }
      }
    });
  }

  // ============================================================
  // HOLD PIECE
  // ============================================================

  /** Отложить / обменять фигуру (клавиша C) */
  hold() {
    if (this.state !== 'playing' || !this.activePiece || this.hasHeldThisTurn) return;

    const currentType = this.activePiece.type;

    if (this.holdPiece) {
      // Обмен: берём отложенную фигуру
      const heldType = this.holdPiece.type;
      this.holdPiece = new Tetromino(currentType);
      this.activePiece = new Tetromino(heldType);
    } else {
      // Первый раз: сохраняем текущую и берём следующую
      this.holdPiece = new Tetromino(currentType);
      this._spawnNext();
    }

    this.hasHeldThisTurn = true;
  }

  // ============================================================
  // GHOST PIECE
  // ============================================================

  /** Вычисляет ghost piece (позицию приземления) */
  getGhostRow() {
    if (!this.activePiece) return 0;
    const piece = this.activePiece;
    let ghostRow = piece.row;
    while (this.board.canPlace(piece.matrix, ghostRow + 1, piece.col)) {
      ghostRow++;
    }
    return ghostRow;
  }
}


