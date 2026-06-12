// ============================================================
// AUDIO — менеджер звуков (Web Audio API / Синтезатор)
// ============================================================
// Генерирует ретро-неоновые звуки в реальном времени
// без внешних аудиофайлов.
// ============================================================

class AudioManager {
  constructor() {
    this.ctx = null;  // AudioContext (создаётся по первому взаимодействию)
    this.masterGain = null;
    this._initialized = false;
    this._muted = false;
    this._enabled = true;

    // Список доступных звуков
    this.sounds = {};

    // Для избежания наложения одинаковых звуков
    this._lastPlayed = {};
  }

  /** Инициализация AudioContext (по клику/клавише — автополитика браузера) */
  init() {
    if (this._initialized) return;
    try {
      this.ctx = new (window.AudioContext || window.webkitAudioContext)();
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.value = 0.35;  // общая громкость
      this.masterGain.connect(this.ctx.destination);
      this._initialized = true;
      this._buildSounds();
    } catch (e) {
      console.warn('AudioManager: AudioContext не поддерживается');
      this._enabled = false;
    }
  }

  /** Построить все звуки (ленивое создание генераторов) */
  _buildSounds() {
    this.sounds = {
      move:       { fn: (ctx, t) => this._synthBlip(ctx, t, 440, 0.06, 0.3) },
      rotate:     { fn: (ctx, t) => this._synthChirp(ctx, t, 660, 880, 0.08, 0.25) },
      softDrop:   { fn: (ctx, t) => this._synthBlip(ctx, t, 220, 0.04, 0.15) },
      hardDrop:   { fn: (ctx, t) => this._synthNoise(ctx, t, 0.12, 0.5) },
      lock:       { fn: (ctx, t) => this._synthImpact(ctx, t, 0.10, 0.4) },
      clear:      { fn: (ctx, t) => this._synthSweep(ctx, t, 523, 1047, 0.20, 0.3) },
      tetris:     { fn: (ctx, t) => this._synthTetris(ctx, t) },
      hold:       { fn: (ctx, t) => this._synthWhoosh(ctx, t, 0.12, 0.35) },
      levelUp:    { fn: (ctx, t) => this._synthArpeggio(ctx, t, [523, 659, 784, 1047], 0.35, 0.3) },
      gameOver:   { fn: (ctx, t) => this._synthGameOver(ctx, t) },
      start:      { fn: (ctx, t) => this._synthStartJingle(ctx, t) },
      pause:      { fn: (ctx, t) => this._synthToggle(ctx, t, 400, 0.08, 0.2) },
    };
  }

  // ============================================================
  // ПУБЛИЧНЫЙ API
  // ============================================================

  /** Воспроизвести звук по имени */
  play(name) {
    if (!this._enabled || this._muted) return;
    if (!this._initialized) this.init();
    if (!this.ctx || !this.sounds[name]) return;

    // Защита от наложения — не проигрываем чаще чем раз в X мс
    const now = performance.now();
    const minInterval = 50; // мс
    if (this._lastPlayed[name] && now - this._lastPlayed[name] < minInterval) return;
    this._lastPlayed[name] = now;

    // Resume контекста (если браузер приостановил)
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }

    try {
      this.sounds[name].fn(this.ctx, this.ctx.currentTime);
    } catch (e) {
      // игнорируем ошибки воспроизведения
    }
  }

  /** Остановить все звуки */
  stopAll() {
    if (!this.ctx) return;
    // Просто отключаем и создаём новый gain
    this.masterGain.disconnect();
    this.masterGain = this.ctx.createGain();
    this.masterGain.gain.value = 0.35;
    this.masterGain.connect(this.ctx.destination);
  }

  /** Включить / выключить звук */
  toggleMute() {
    this._muted = !this._muted;
    return this._muted;
  }

  /** Состояние mute */
  get isMuted() {
    return this._muted;
  }

  /** Установить громкость (0.0 — 1.0) */
  setVolume(val) {
    if (this.masterGain) {
      this.masterGain.gain.value = Math.max(0, Math.min(1, val));
    }
  }

  // ============================================================
  // СИНТЕЗАТОРЫ ЗВУКОВ
  // ============================================================

  /**
   * Простой короткий blip (квадратная волна)
   * @param {AudioContext} ctx
   * @param {number} t — время старта (ctx.currentTime)
   * @param {number} freq — частота в Hz
   * @param {number} dur — длительность в секундах
   * @param {number} vol — громкость (0-1)
   */
  _synthBlip(ctx, t, freq, dur, vol) {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'square';
    osc.frequency.setValueAtTime(freq, t);
    gain.gain.setValueAtTime(vol * 0.8, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + dur);
    osc.connect(gain);
    gain.connect(this.masterGain);
    osc.start(t);
    osc.stop(t + dur);
  }

  /**
   * Чириканье (частотный сдвиг вверх)
   */
  _synthChirp(ctx, t, freqStart, freqEnd, dur, vol) {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'square';
    osc.frequency.setValueAtTime(freqStart, t);
    osc.frequency.exponentialRampToValueAtTime(freqEnd, t + dur);
    gain.gain.setValueAtTime(vol * 0.8, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + dur);
    osc.connect(gain);
    gain.connect(this.masterGain);
    osc.start(t);
    osc.stop(t + dur);
  }

  /**
   * Шумовой удар (для hard drop / lock)
   */
  _synthNoise(ctx, t, dur, vol) {
    // Используем комбинацию низких частот + noise
    const osc1 = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    const gain = ctx.createGain();
    osc1.type = 'sawtooth';
    osc1.frequency.setValueAtTime(80, t);
    osc1.frequency.exponentialRampToValueAtTime(40, t + dur);
    osc2.type = 'square';
    osc2.frequency.setValueAtTime(60, t);
    osc2.frequency.exponentialRampToValueAtTime(30, t + dur);
    gain.gain.setValueAtTime(vol * 0.7, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + dur);
    osc1.connect(gain);
    osc2.connect(gain);
    gain.connect(this.masterGain);
    osc1.start(t);
    osc1.stop(t + dur);
    osc2.start(t);
    osc2.stop(t + dur);
  }

  /**
   * Удар / импакт (для lock)
   */
  _synthImpact(ctx, t, dur, vol) {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(200, t);
    osc.frequency.exponentialRampToValueAtTime(60, t + dur);
    gain.gain.setValueAtTime(vol * 0.8, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + dur);
    osc.connect(gain);
    gain.connect(this.masterGain);
    osc.start(t);
    osc.stop(t + dur);
  }

  /**
   * Свипинг (для clear line — восходящий)
   */
  _synthSweep(ctx, t, freqLow, freqHigh, dur, vol) {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'square';
    osc.frequency.setValueAtTime(freqLow, t);
    osc.frequency.exponentialRampToValueAtTime(freqHigh, t + dur);
    gain.gain.setValueAtTime(vol * 0.7, t);
    gain.gain.linearRampToValueAtTime(vol * 0.5, t + dur * 0.3);
    gain.gain.exponentialRampToValueAtTime(0.001, t + dur);
    osc.connect(gain);
    gain.connect(this.masterGain);
    osc.start(t);
    osc.stop(t + dur);
  }

  /**
   * Тетрис (4 линии) — праздничная трель
   */
  _synthTetris(ctx, t) {
    const notes = [523, 659, 784, 1047, 784, 1047, 1319, 1047];
    const dur = 0.1;
    const vol = 0.35;
    notes.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'square';
      const start = t + i * dur * 0.8;
      osc.frequency.setValueAtTime(freq, start);
      gain.gain.setValueAtTime(vol * 0.8, start);
      gain.gain.exponentialRampToValueAtTime(0.001, start + dur);
      osc.connect(gain);
      gain.connect(this.masterGain);
      osc.start(start);
      osc.stop(start + dur);
    });
  }

  /**
   * Вууш (для hold)
   */
  _synthWhoosh(ctx, t, dur, vol) {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(300, t);
    osc.frequency.exponentialRampToValueAtTime(1200, t + dur * 0.5);
    osc.frequency.exponentialRampToValueAtTime(400, t + dur);
    gain.gain.setValueAtTime(vol * 0.4, t);
    gain.gain.linearRampToValueAtTime(vol * 0.2, t + dur * 0.4);
    gain.gain.exponentialRampToValueAtTime(0.001, t + dur);
    osc.connect(gain);
    gain.connect(this.masterGain);
    osc.start(t);
    osc.stop(t + dur);
  }

  /**
   * Арпеджио (для level up)
   */
  _synthArpeggio(ctx, t, freqs, dur, vol) {
    const noteLen = dur / freqs.length;
    freqs.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'square';
      const start = t + i * noteLen * 0.7;
      osc.frequency.setValueAtTime(freq, start);
      gain.gain.setValueAtTime(vol * 0.7, start);
      gain.gain.exponentialRampToValueAtTime(0.001, start + noteLen);
      osc.connect(gain);
      gain.connect(this.masterGain);
      osc.start(start);
      osc.stop(start + noteLen);
    });
  }

  /**
   * Game Over — нисходящая гамма
   */
  _synthGameOver(ctx, t) {
    const notes = [784, 740, 698, 659, 587, 523, 466, 392];
    const dur = 0.2;
    const vol = 0.3;
    notes.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'square';
      const start = t + i * dur * 0.7;
      osc.frequency.setValueAtTime(freq, start);
      gain.gain.setValueAtTime(vol * 0.6, start);
      gain.gain.exponentialRampToValueAtTime(0.001, start + dur);
      osc.connect(gain);
      gain.connect(this.masterGain);
      osc.start(start);
      osc.stop(start + dur);
    });
  }

  /**
   * Стартовый джингл
   */
  _synthStartJingle(ctx, t) {
    const notes = [262, 330, 392, 523, 660, 784, 1047];
    const dur = 0.15;
    const vol = 0.3;
    notes.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'square';
      const start = t + i * dur * 0.8;
      osc.frequency.setValueAtTime(freq, start);
      gain.gain.setValueAtTime(vol * 0.7, start);
      gain.gain.exponentialRampToValueAtTime(0.001, start + dur);
      osc.connect(gain);
      gain.connect(this.masterGain);
      osc.start(start);
      osc.stop(start + dur);
    });
  }

  /**
   * Короткий звук-переключатель (для паузы / mute)
   */
  _synthToggle(ctx, t, freq, dur, vol) {
    const osc1 = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    const gain = ctx.createGain();
    osc1.type = 'square';
    osc1.frequency.setValueAtTime(freq, t);
    osc2.type = 'square';
    osc2.frequency.setValueAtTime(freq * 1.5, t + dur * 0.5);
    gain.gain.setValueAtTime(vol * 0.6, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + dur);
    osc1.connect(gain);
    osc2.connect(gain);
    gain.connect(this.masterGain);
    osc1.start(t);
    osc1.stop(t + dur);
    osc2.start(t + dur * 0.5);
    osc2.stop(t + dur * 1.5);
  }
}
