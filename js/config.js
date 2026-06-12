// ============================================================
// CONFIG — все настройки игры и темы оформления
// ============================================================

const CONFIG = {
  // ---------- Игровое поле ----------
  COLS: 10,
  ROWS: 20,
  CELL_SIZE: 30,

  // ---------- Скорости (мс) ----------
  BASE_DROP_INTERVAL: 1000,  // начальная скорость падения
  SOFT_DROP_INTERVAL: 50,    // скорость при soft drop
  MIN_DROP_INTERVAL: 100,    // максимальная скорость (мин. интервал)

  // ---------- Очки ----------
  SCORE_TABLE: {
    1: 100,   // 1 линия
    2: 300,   // 2 линии
    3: 500,   // 3 линии
    4: 800,   // 4 линии (тетрис)
  },

  // ---------- Уровни ----------
  LINES_PER_LEVEL: 10,       // сколько линий для повышения уровня
  SPEED_DECREASE_PER_LEVEL: 80, // на сколько мс уменьшается интервал за уровень

  // ---------- Фигуры (матрицы без вращения) ----------
  // Каждая фигура задана в виде матрицы NxN
  PIECES: {
    I: {
      matrix: [
        [0, 0, 0, 0],
        [1, 1, 1, 1],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
      ],
    },
    O: {
      matrix: [
        [1, 1],
        [1, 1],
      ],
    },
    T: {
      matrix: [
        [0, 1, 0],
        [1, 1, 1],
        [0, 0, 0],
      ],
    },
    L: {
      matrix: [
        [0, 0, 1],
        [1, 1, 1],
        [0, 0, 0],
      ],
    },
    J: {
      matrix: [
        [1, 0, 0],
        [1, 1, 1],
        [0, 0, 0],
      ],
    },
    S: {
      matrix: [
        [0, 1, 1],
        [1, 1, 0],
        [0, 0, 0],
      ],
    },
    Z: {
      matrix: [
        [1, 1, 0],
        [0, 1, 1],
        [0, 0, 0],
      ],
    },
  },

  // ---------- Цвета фигур (основные) ----------
  // Каждый цвет – объект { main, light, dark } для объёмного эффекта
  PIECE_COLORS: {
    I: { main: '#00f0f0', light: '#66ffff', dark: '#009999' }, // циан
    O: { main: '#f0f000', light: '#ffff66', dark: '#999900' }, // жёлтый
    T: { main: '#a000f0', light: '#cc66ff', dark: '#660099' }, // фиолетовый
    L: { main: '#f0a000', light: '#ffcc66', dark: '#996600' }, // оранжевый
    J: { main: '#0000f0', light: '#6666ff', dark: '#000099' }, // синий
    S: { main: '#00f000', light: '#66ff66', dark: '#009900' }, // зелёный
    Z: { main: '#f00000', light: '#ff6666', dark: '#990000' }, // красный
  },

  // ---------- Тема NeoRetro (Dark + Yellow/Amber) ----------
  THEME: {
    // Фон страницы
    pageBg: '#0a0a0a',
    pageBgGradient: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a0a 100%)',

    // Игровое поле
    boardBg: '#111111',
    boardBorder: '#ffd700',
    boardBorderGlow: 'rgba(255, 215, 0, 0.3)',
    cellBorder: '#2a2a0a',

    // Сетка (линии между ячейками)
    gridLines: 'rgba(255, 215, 0, 0.08)',

    // Боковая панель (Next, Score, Level)
    panelBg: '#0d0d0d',
    panelBorder: '#ffd700',
    panelText: '#ffd700',
    panelLabel: '#b8960f',

    // Текст
    textPrimary: '#ffd700',
    textSecondary: '#b8960f',
    textMuted: '#665500',

    // Game Over
    gameOverBg: 'rgba(0, 0, 0, 0.85)',
    gameOverText: '#ff4444',
    gameOverGlow: 'rgba(255, 68, 68, 0.5)',

    // Пауза
    pauseText: '#ffd700',

    // Кнопки
    buttonBg: '#1a1a00',
    buttonBorder: '#ffd700',
    buttonText: '#ffd700',
    buttonHoverBg: '#2a2a00',

    // Счёт
    scoreText: '#ffd700',
    scoreValue: '#ffffff',

    // Тень от фигур на поле
    pieceGlow: 'rgba(255, 215, 0, 0.15)',
  },

  // ---------- Клавиши ----------
  KEYS: {
    LEFT: 'ArrowLeft',
    RIGHT: 'ArrowRight',
    DOWN: 'ArrowDown',
    HARD_DROP: ' ',
    ROTATE: ['ArrowUp', 'x', 'X'],
    PAUSE: ['p', 'P', 'Escape'],
    HOLD: ['c', 'C'],
  },
};
