// ============================================================
// SCORE — логика подсчёта очков, уровня и скорости
// ============================================================

class ScoreManager {
  constructor() {
    this.score = 0;
    this.lines = 0;
    this.level = 1;
    this.dropInterval = CONFIG.BASE_DROP_INTERVAL;
  }

  reset() {
    this.score = 0;
    this.lines = 0;
    this.level = 1;
    this.dropInterval = CONFIG.BASE_DROP_INTERVAL;
  }

  /** Добавляет очки за очищенные линии */
  addClearedLines(count) {
    if (count === 0) return;
    const points = CONFIG.SCORE_TABLE[count] || 0;
    this.score += points * this.level;
    this.lines += count;

    // Повышение уровня
    const newLevel = Math.floor(this.lines / CONFIG.LINES_PER_LEVEL) + 1;
    if (newLevel > this.level) {
      this.level = newLevel;
      this.dropInterval = Math.max(
        CONFIG.MIN_DROP_INTERVAL,
        CONFIG.BASE_DROP_INTERVAL - (this.level - 1) * CONFIG.SPEED_DECREASE_PER_LEVEL
      );
    }
  }

  /** Добавляет очки за hard drop (1 очко за каждую клетку) */
  addHardDropBonus(cellsDropped) {
    this.score += cellsDropped * 2;
  }

  /** Добавляет очки за soft drop */
  addSoftDropBonus(cellsDropped) {
    this.score += cellsDropped * 1;
  }
}
