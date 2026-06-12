// ============================================================
// MAIN — точка входа
// ============================================================

const game = new Game();
game.init();

// ---------- Кнопка переключения стиля фигур ----------
document.addEventListener('DOMContentLoaded', () => {
  const btn = document.getElementById('style-toggle');
  if (btn) {
    btn.addEventListener('click', () => {
      if (CONFIG.pieceStyle === 'neon') {
        CONFIG.pieceStyle = 'colorful';
        btn.textContent = '🟡 НЕОНОВЫЙ СТИЛЬ';
      } else {
        CONFIG.pieceStyle = 'neon';
        btn.textContent = '🎨 ЦВЕТНОЙ СТИЛЬ';
      }
    });
  }
});
