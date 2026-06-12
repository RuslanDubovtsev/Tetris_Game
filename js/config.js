// ============================================================
// CONFIG — все настройки игры и темы оформления
// ============================================================

const CONFIG = {
  // ---------- Игровое поле ----------
  COLS: 10,
  ROWS: 20,
  CELL_SIZE: 34,

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

  // ---------- Цвета фигур (цветные / оригинальные) ----------
  PIECE_COLORS: {
    I: { main: '#00f0f0', light: '#66ffff', dark: '#009999' }, // циан
    O: { main: '#f0f000', light: '#ffff66', dark: '#999900' }, // жёлтый
    T: { main: '#a000f0', light: '#cc66ff', dark: '#660099' }, // фиолетовый
    L: { main: '#f0a000', light: '#ffcc66', dark: '#996600' }, // оранжевый
    J: { main: '#0000f0', light: '#6666ff', dark: '#000099' }, // синий
    S: { main: '#00f000', light: '#66ff66', dark: '#009900' }, // зелёный
    Z: { main: '#f00000', light: '#ff6666', dark: '#990000' }, // красный
  },

  // ---------- Цвета фигур (неоновый жёлто-чёрный стиль) ----------
  // Каждый цвет - вариация жёлтого неона (разные оттенки для читаемости)
  PIECE_COLORS_NEON: {
    I: { main: '#FFEB3B', light: '#FFF9C4', dark: '#F9A825' }, // яркий жёлтый
    O: { main: '#FFD600', light: '#FFE082', dark: '#FF8F00' }, // золотистый
    T: { main: '#FFC107', light: '#FFE082', dark: '#FF6F00' }, // янтарный
    L: { main: '#FFD54F', light: '#FFF8E1', dark: '#F57F17' }, // светло-жёлтый
    J: { main: '#FDD835', light: '#FFF9C4', dark: '#F9A825' }, // канареечный
    S: { main: '#FFEE58', light: '#FFF9C4', dark: '#FBC02D' }, // лимонный
    Z: { main: '#FFCA28', light: '#FFE082', dark: '#FF8F00' }, // медовый
  },

  // ---------- Цвета фигур (неоновый красно-чёрный стиль для HARD MODE) ----------
  PIECE_COLORS_NEON_RED: {
    I: { main: '#FF1744', light: '#FF8A80', dark: '#C62828' }, // яркий красный
    O: { main: '#D50000', light: '#FF6D6D', dark: '#8E0000' }, // тёмно-красный
    T: { main: '#FF5252', light: '#FF8A80', dark: '#B71C1C' }, // красный
    L: { main: '#FF6D6D', light: '#FFCDD2', dark: '#C62828' }, // светло-красный
    J: { main: '#E53935', light: '#FF8A80', dark: '#B71C1C' }, // алый
    S: { main: '#EF5350', light: '#FFCDD2', dark: '#C62828' }, // кармин
    Z: { main: '#F44336', light: '#FF8A80', dark: '#B71C1C' }, // красно-алый
  },

  // Текущий активный стиль раскраски фигур ('neon' | 'colorful')
  _pieceStyle: 'neon',

  /** Переключить стиль фигур */
  get pieceStyle() {
    return this._pieceStyle;
  },

  set pieceStyle(value) {
    this._pieceStyle = value;
  },

  /** Получить текущую палитру цветов фигур */
  getCurrentPieceColors() {
    if (this._hardMode) {
      return this.PIECE_COLORS_NEON_RED;
    }
    return this._pieceStyle === 'colorful' ? this.PIECE_COLORS : this.PIECE_COLORS_NEON;
  },

  /** Получить цвет для конкретного типа фигуры по текущему стилю */
  getPieceColor(type) {
    const palette = this.getCurrentPieceColors();
    return palette[type] || palette.I;
  },

  // ---------- Тема NeoRetro (Dark + Yellow/Amber) ----------
  THEME: {
    // Фон страницы
    pageBg: '#0a0a0a',
    pageBgGradient: 'linear-gradient(180deg, #0a0a0a 0%, #121205 50%, #0a0a0a 100%)',

    // Игровое поле
    boardBg: '#0d0d06',
    boardBorder: '#FFEB3B',
    boardBorderGlow: 'rgba(255, 235, 59, 0.3)',
    cellBorder: '#1a1a00',

    // Сетка (линии между ячейками)
    gridLines: 'rgba(255, 235, 59, 0.08)',

    // Боковая панель (Next, Score, Level)
    panelBg: '#0a0a00',
    panelBorder: '#FFEB3B',
    panelText: '#FFEB3B',
    panelLabel: '#FDD835',

    // Текст
    textPrimary: '#FFEB3B',
    textSecondary: '#FDD835',
    textMuted: '#554400',

    // Game Over
    gameOverBg: 'rgba(0, 0, 0, 0.88)',
    gameOverText: '#FF5252',
    gameOverGlow: 'rgba(255, 82, 82, 0.5)',

    // Пауза
    pauseText: '#FFEB3B',

    // Кнопки
    buttonBg: '#121200',
    buttonBorder: '#FFEB3B',
    buttonText: '#FFEB3B',
    buttonHoverBg: '#1a1a00',

    // Счёт
    scoreText: '#FFEB3B',
    scoreValue: '#FFFFFF',

    // Тень от фигур на поле
    pieceGlow: 'rgba(255, 235, 59, 0.15)',

    // ---------- CSS-элементы (фон, украшения, кнопки, футер) ----------
    css: {
      canvasBorder: '#FFEB3B',
      canvasGlow1: 'rgba(255, 235, 59, 0.4)',
      canvasGlow2: 'rgba(255, 235, 59, 0.15)',
      canvasGlow3: 'rgba(255, 235, 59, 0.08)',
      canvasGlowInset: 'rgba(255, 235, 59, 0.05)',
      canvasGlowPulse1: 'rgba(255, 235, 59, 0.6)',
      canvasGlowPulse2: 'rgba(255, 235, 59, 0.25)',
      canvasGlowPulse3: 'rgba(255, 235, 59, 0.12)',
      canvasGlowPulseInset: 'rgba(255, 235, 59, 0.08)',

      bgRadialGlow: 'rgba(255, 235, 59, 0.06)',
      bgGradient: 'linear-gradient(180deg, #0a0a0a 0%, #121205 50%, #0a0a0a 100%)',

      pixelColor: 'rgba(255, 235, 59, 0.15)',
      starColor: 'rgba(255, 235, 59, 0.3)',
      starGlow1: 'rgba(255, 235, 59, 0.1)',
      starGlow2: 'rgba(255, 235, 59, 0.4)',

      cornerColor: '#FFEB3B',
      lineColor: '#FFEB3B',

      footerColor: '#554400',
      footerGlow: 'rgba(255, 235, 59, 0.1)',

      buttonBg: '#121200',
      buttonBorder: '#FFEB3B',
      buttonText: '#FFEB3B',
      buttonHoverBg: '#1a1a00',
      buttonGlow1: 'rgba(255, 235, 59, 0.2)',
      buttonGlow2: 'rgba(255, 235, 59, 0.4)',
      buttonGlow3: 'rgba(255, 235, 59, 0.05)',
      buttonGlowHover1: 'rgba(255, 235, 59, 0.4)',
      buttonGlowHover2: 'rgba(255, 235, 59, 0.1)',
      buttonGlowActive1: 'rgba(255, 235, 59, 0.3)',
      buttonGlowActive2: 'rgba(255, 235, 59, 0.05)',
    },
  },

  // ---------- Тема NeoRetro Red (для HARD MODE) ----------
  THEME_RED: {
    pageBg: '#0a0a0a',
    pageBgGradient: 'linear-gradient(180deg, #0a0a0a 0%, #120505 50%, #0a0a0a 100%)',

    boardBg: '#0d0606',
    boardBorder: '#FF1744',
    boardBorderGlow: 'rgba(255, 23, 68, 0.3)',
    cellBorder: '#1a0000',

    // Сетка — в hard mode она не рисуется, но оставляем для совместимости
    gridLines: 'rgba(255, 23, 68, 0.08)',

    panelBg: '#0a0000',
    panelBorder: '#FF1744',
    panelText: '#FF1744',
    panelLabel: '#FF5252',

    textPrimary: '#FF1744',
    textSecondary: '#FF5252',
    textMuted: '#550000',

    gameOverBg: 'rgba(0, 0, 0, 0.88)',
    gameOverText: '#FF5252',
    gameOverGlow: 'rgba(255, 82, 82, 0.5)',

    pauseText: '#FF1744',

    buttonBg: '#120000',
    buttonBorder: '#FF1744',
    buttonText: '#FF1744',
    buttonHoverBg: '#1a0000',

    scoreText: '#FF1744',
    scoreValue: '#FFFFFF',

    pieceGlow: 'rgba(255, 23, 68, 0.15)',

    // ---------- CSS-элементы (фон, украшения, кнопки, футер) — красные ----------
    css: {
      canvasBorder: '#FF1744',
      canvasGlow1: 'rgba(255, 23, 68, 0.4)',
      canvasGlow2: 'rgba(255, 23, 68, 0.15)',
      canvasGlow3: 'rgba(255, 23, 68, 0.08)',
      canvasGlowInset: 'rgba(255, 23, 68, 0.05)',
      canvasGlowPulse1: 'rgba(255, 23, 68, 0.6)',
      canvasGlowPulse2: 'rgba(255, 23, 68, 0.25)',
      canvasGlowPulse3: 'rgba(255, 23, 68, 0.12)',
      canvasGlowPulseInset: 'rgba(255, 23, 68, 0.08)',

      bgRadialGlow: 'rgba(255, 23, 68, 0.06)',
      bgGradient: 'linear-gradient(180deg, #0a0a0a 0%, #120505 50%, #0a0a0a 100%)',

      pixelColor: 'rgba(255, 23, 68, 0.15)',
      starColor: 'rgba(255, 23, 68, 0.3)',
      starGlow1: 'rgba(255, 23, 68, 0.1)',
      starGlow2: 'rgba(255, 23, 68, 0.4)',

      cornerColor: '#FF1744',
      lineColor: '#FF1744',

      footerColor: '#550000',
      footerGlow: 'rgba(255, 23, 68, 0.1)',

      buttonBg: '#120000',
      buttonBorder: '#FF1744',
      buttonText: '#FF1744',
      buttonHoverBg: '#1a0000',
      buttonGlow1: 'rgba(255, 23, 68, 0.2)',
      buttonGlow2: 'rgba(255, 23, 68, 0.4)',
      buttonGlow3: 'rgba(255, 23, 68, 0.05)',
      buttonGlowHover1: 'rgba(255, 23, 68, 0.4)',
      buttonGlowHover2: 'rgba(255, 23, 68, 0.1)',
      buttonGlowActive1: 'rgba(255, 23, 68, 0.3)',
      buttonGlowActive2: 'rgba(255, 23, 68, 0.05)',
    },
  },


  // ---------- HARD MODE ----------
  _hardMode: false,

  get hardMode() {
    return this._hardMode;
  },

  set hardMode(value) {
    this._hardMode = value;
  },

  /** Получить текущую тему в зависимости от hard mode */
  getCurrentTheme() {
    return this._hardMode ? this.THEME_RED : this.THEME;
  },

  // Множитель скорости для hard mode (0.5 = в 2 раза быстрее)
  HARD_MODE_SPEED_MULTIPLIER: 0.5,

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
