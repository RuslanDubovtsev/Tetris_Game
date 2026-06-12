// ============================================================
// MAIN — точка входа
// ============================================================

// ---------- Анимированный пиксельный фон ----------
function createPixelRain() {
  const container = document.getElementById('pixel-rain');
  if (!container) return;
  for (let i = 0; i < 60; i++) {
    const pixel = document.createElement('div');
    pixel.className = 'pixel';
    pixel.style.left = Math.random() * 100 + '%';
    pixel.style.animationDuration = (3 + Math.random() * 7) + 's';
    pixel.style.animationDelay = -(Math.random() * 10) + 's';
    pixel.style.width = (2 + Math.random() * 3) + 'px';
    pixel.style.height = pixel.style.width;
    pixel.style.opacity = 0.1 + Math.random() * 0.2;
    container.appendChild(pixel);
  }
}

function createPixelStars() {
  const container = document.getElementById('pixel-stars');
  if (!container) return;
  for (let i = 0; i < 40; i++) {
    const star = document.createElement('div');
    star.className = 'pixel-star';
    star.style.left = Math.random() * 100 + '%';
    star.style.top = Math.random() * 100 + '%';
    star.style.animationDuration = (1.5 + Math.random() * 3) + 's';
    star.style.animationDelay = -(Math.random() * 4) + 's';
    container.appendChild(star);
  }
}

createPixelRain();
createPixelStars();

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
