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

// ---------- Применение CSS-темы из CONFIG к корневым переменным ----------
function applyCSSTheme() {
  const css = CONFIG.getCurrentTheme().css;
  const root = document.documentElement;

  root.style.setProperty('--canvas-border', css.canvasBorder);
  root.style.setProperty('--canvas-glow-1', css.canvasGlow1);
  root.style.setProperty('--canvas-glow-2', css.canvasGlow2);
  root.style.setProperty('--canvas-glow-3', css.canvasGlow3);
  root.style.setProperty('--canvas-glow-inset', css.canvasGlowInset);
  root.style.setProperty('--canvas-glow-pulse-1', css.canvasGlowPulse1);
  root.style.setProperty('--canvas-glow-pulse-2', css.canvasGlowPulse2);
  root.style.setProperty('--canvas-glow-pulse-3', css.canvasGlowPulse3);
  root.style.setProperty('--canvas-glow-pulse-inset', css.canvasGlowPulseInset);

  root.style.setProperty('--bg-radial-glow', css.bgRadialGlow);
  root.style.setProperty('--bg-gradient', css.bgGradient);

  root.style.setProperty('--pixel-color', css.pixelColor);
  root.style.setProperty('--star-color', css.starColor);
  root.style.setProperty('--star-glow-1', css.starGlow1);
  root.style.setProperty('--star-glow-2', css.starGlow2);

  root.style.setProperty('--corner-color', css.cornerColor);
  root.style.setProperty('--line-color', css.lineColor);

  root.style.setProperty('--footer-color', css.footerColor);
  root.style.setProperty('--footer-glow', css.footerGlow);

  root.style.setProperty('--button-bg', css.buttonBg);
  root.style.setProperty('--button-border', css.buttonBorder);
  root.style.setProperty('--button-text', css.buttonText);
  root.style.setProperty('--button-hover-bg', css.buttonHoverBg);
  root.style.setProperty('--button-glow-1', css.buttonGlow1);
  root.style.setProperty('--button-glow-2', css.buttonGlow2);
  root.style.setProperty('--button-glow-3', css.buttonGlow3);
  root.style.setProperty('--button-glow-hover-1', css.buttonGlowHover1);
  root.style.setProperty('--button-glow-hover-2', css.buttonGlowHover2);
  root.style.setProperty('--button-glow-active-1', css.buttonGlowActive1);
  root.style.setProperty('--button-glow-active-2', css.buttonGlowActive2);
}

createPixelRain();
createPixelStars();

const game = new Game();
game.init();

// ---------- Инициализация звука при первом взаимодействии ----------
function initAudioOnInteraction() {
  game.audio.init();
  document.removeEventListener('keydown', initAudioOnInteraction);
  document.removeEventListener('click', initAudioOnInteraction);
}
document.addEventListener('keydown', initAudioOnInteraction);
document.addEventListener('click', initAudioOnInteraction);

// ---------- Кнопка переключения стиля фигур ----------
document.addEventListener('DOMContentLoaded', () => {
  // Применяем CSS-тему при загрузке
  applyCSSTheme();

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

  // ---------- Кнопка Mute ----------
  const muteBtn = document.getElementById('mute-toggle');
  if (muteBtn) {
    muteBtn.addEventListener('click', () => {
      // Инициализация аудио при клике, если ещё не
      game.audio.init();
      const muted = game.audio.toggleMute();
      muteBtn.textContent = muted ? '🔇 ЗВУК ВЫКЛ' : '🔊 ЗВУК ВКЛ';
    });
  }

  // ---------- Кнопка HARD MODE ----------
  const hardBtn = document.getElementById('hardmode-toggle');
  if (hardBtn) {
    hardBtn.addEventListener('click', () => {
      game.audio.init();
      const wasHardMode = CONFIG.hardMode;

      if (wasHardMode) {
        // ВЫКЛЮЧАЕМ hard mode
        CONFIG.hardMode = false;
        hardBtn.textContent = '💀 HARD MODE';
        hardBtn.classList.remove('active');
        game.audio.stopMusic();
      } else {
        // ВКЛЮЧАЕМ hard mode
        CONFIG.hardMode = true;
        hardBtn.textContent = '☠️ HARD MODE ON';
        hardBtn.classList.add('active');
        // Если игра уже идёт, запускаем музыку
        if (game.state === 'playing') {
          game.audio.playMusic();
        }
      }

      // Применяем CSS-тему (жёлтая / красная) ко всем элементам страницы
      applyCSSTheme();
    });
  }
});
