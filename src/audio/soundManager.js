// Romantic Web Audio Synthesizer: Music Box & Sound Effects
class RomanticSoundManager {
  constructor() {
    this.ctx = null;
    this.isPlaying = false;
    this.customAudio = null;
    this.musicTimeout = null;
    this.isMuted = false;
    this.currentMelodyIndex = 0;
    this.musicNodes = new Set();
    this.playRequest = 0;
  }

  init() {
    if (!this.ctx || this.ctx.state === 'closed') {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (!AudioContext) throw new Error('Web Audio is unavailable');
      this.ctx = new AudioContext();
    }
    // Safari can interrupt audio after locking the phone or using the microphone.
    const ready = this.ctx.state !== 'running' ? this.ctx.resume() : Promise.resolve();
    // Effects can use init synchronously; music callers also await the result.
    ready.catch(() => {});
    return ready;
  }

  unlock() {
    try {
      const ready = this.init();
      // Start a silent buffer within the tap, before any asynchronous work.
      const source = this.ctx.createBufferSource();
      source.buffer = this.ctx.createBuffer(1, 1, this.ctx.sampleRate);
      source.connect(this.ctx.destination);
      source.onended = () => source.disconnect();
      source.start(0);
      return ready;
    } catch {
      return Promise.resolve();
    }
  }

  // Play a single crystalline music-box tine
  playMusicBoxTone(freq, duration = 1.8, time = 0, gainLevel = 0.22, music = false) {
    if (!this.ctx || this.isMuted) return;
    const now = (time || this.ctx.currentTime);

    // Fundamental oscillator (pure chime)
    const osc1 = this.ctx.createOscillator();
    const gain1 = this.ctx.createGain();
    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(freq, now);

    // First overtone (bell shimmer - roughly 2.76x fundamental)
    const osc2 = this.ctx.createOscillator();
    const gain2 = this.ctx.createGain();
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(freq * 2.756, now);

    // Soft high harmonic (5.4x)
    const osc3 = this.ctx.createOscillator();
    const gain3 = this.ctx.createGain();
    osc3.type = 'sine';
    osc3.frequency.setValueAtTime(freq * 5.404, now);

    // Envelope
    gain1.gain.setValueAtTime(gainLevel, now);
    gain1.gain.exponentialRampToValueAtTime(0.0001, now + duration);

    gain2.gain.setValueAtTime(gainLevel * 0.35, now);
    gain2.gain.exponentialRampToValueAtTime(0.0001, now + duration * 0.5);

    gain3.gain.setValueAtTime(gainLevel * 0.15, now);
    gain3.gain.exponentialRampToValueAtTime(0.0001, now + duration * 0.25);

    // Connect
    osc1.connect(gain1);
    osc2.connect(gain2);
    osc3.connect(gain3);

    gain1.connect(this.ctx.destination);
    gain2.connect(this.ctx.destination);
    gain3.connect(this.ctx.destination);

    osc1.start(now);
    osc2.start(now);
    osc3.start(now);

    osc1.stop(now + duration);
    osc2.stop(now + duration);
    osc3.stop(now + duration);
    [osc1, osc2, osc3].forEach((osc, index) => {
      const gain = [gain1, gain2, gain3][index];
      if (music) this.musicNodes.add(osc);
      osc.onended = () => {
        this.musicNodes.delete(osc);
        osc.disconnect();
        gain.disconnect();
      };
    });
  }

  // Sweet chime sound effect for clicks / card reveals
  playChime() {
    try {
      this.init();
      const now = this.ctx.currentTime;
      this.playMusicBoxTone(784, 1.2, now, 0.15); // G5
      this.playMusicBoxTone(1046.5, 1.4, now + 0.08, 0.18); // C6
      this.playMusicBoxTone(1318.5, 1.6, now + 0.16, 0.15); // E6
    } catch (e) {
      // Audio autoplay policy fallback
    }
  }

  // Soft whoosh / gentle breath sound for blowing candles
  playBlow() {
    try {
      this.init();
      const bufferSize = this.ctx.sampleRate * 1.2;
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const output = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        output[i] = Math.random() * 2 - 1;
      }

      const whiteNoise = this.ctx.createBufferSource();
      whiteNoise.buffer = buffer;

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(800, this.ctx.currentTime);
      filter.frequency.exponentialRampToValueAtTime(150, this.ctx.currentTime + 1.2);

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.12, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 1.2);

      whiteNoise.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);

      whiteNoise.start();
      whiteNoise.stop(this.ctx.currentTime + 1.2);

    } catch (e) {}
  }

  // Magical sparkle harp / fanfare on celebration
  playFanfare() {
    try {
      this.init();
      const notes = [523.25, 659.25, 783.99, 1046.5, 1318.51, 1567.98]; // C5, E5, G5, C6, E6, G6
      const now = this.ctx.currentTime;
      notes.forEach((freq, idx) => {
        this.playMusicBoxTone(freq, 2.0, now + idx * 0.09, 0.16);
      });
    } catch (e) {}
  }

  // Soft pop sound effect
  playPop() {
    try {
      this.init();
      const now = this.ctx.currentTime;
      this.playMusicBoxTone(659.25, 0.4, now, 0.08);
      this.playMusicBoxTone(987.77, 0.5, now + 0.04, 0.08);
    } catch (e) {}
  }

  // Happy Birthday + Romantic Music Box Melody loop
  startMusicBoxLoop() {
    if (!this.isPlaying) return;
    this.init();

    // Note frequencies
    const C4 = 261.63, D4 = 293.66, E4 = 329.63, F4 = 349.23, G4 = 392.00, A4 = 440.00, B4 = 493.88;
    const C5 = 523.25, D5 = 587.33, E5 = 659.25, F5 = 698.46, G5 = 783.99, A5 = 880.00, B5 = 987.77;
    const C6 = 1046.50;

    // "Happy Birthday" music box arrangement (Key of C)
    // [frequency, duration in beats, bassNote]
    const song = [
      // "Happy Birthday to you"
      { f: G4, b: 0.75 }, { f: G4, b: 0.25 }, { f: A4, b: 1, bass: F4 }, { f: G4, b: 1 }, { f: C5, b: 1, bass: E4 }, { f: B4, b: 2 },
      // "Happy Birthday to you"
      { f: G4, b: 0.75 }, { f: G4, b: 0.25 }, { f: A4, b: 1, bass: F4 }, { f: G4, b: 1 }, { f: D5, b: 1, bass: G4 }, { f: C5, b: 2 },
      // "Happy Birthday dear Oun Leap"
      { f: G4, b: 0.75 }, { f: G4, b: 0.25 }, { f: G5, b: 1, bass: E4 }, { f: E5, b: 1, bass: C4 }, { f: C5, b: 1, bass: A4 }, { f: B4, b: 1 }, { f: A4, b: 1.5 },
      // "Happy Birthday to you!"
      { f: F5, b: 0.75 }, { f: F5, b: 0.25 }, { f: E5, b: 1, bass: C4 }, { f: C5, b: 1, bass: E4 }, { f: D5, b: 1, bass: G4 }, { f: C5, b: 2.5, bass: C4 },
      // Romantic arpeggio interlude (Canon / Music box romance)
      { f: E5, b: 1, bass: C4 }, { f: G5, b: 1 }, { f: C6, b: 1 },
      { f: D5, b: 1, bass: G4 }, { f: G5, b: 1 }, { f: B5, b: 1 },
      { f: C5, b: 1, bass: A4 }, { f: E5, b: 1 }, { f: A5, b: 1 },
      { f: B4, b: 1, bass: E4 }, { f: E5, b: 1 }, { f: G5, b: 1 },
      { f: A4, b: 1, bass: F4 }, { f: C5, b: 1 }, { f: F5, b: 1 },
      { f: G4, b: 1, bass: C4 }, { f: C5, b: 1 }, { f: E5, b: 2 }
    ];

    const tempo = 0.52; // seconds per beat
    let currentDelay = 0;

    song.forEach((item) => {
      const playTime = this.ctx.currentTime + currentDelay;
      // Melody note
      this.playMusicBoxTone(item.f, 1.8, playTime, 0.16, true);

      // Bass / harmony note if present
      if (item.bass) {
        this.playMusicBoxTone(item.bass, 2.5, playTime, 0.12, true);
      }

      currentDelay += item.b * tempo;
    });

    // Schedule next cycle
    this.musicTimeout = setTimeout(() => {
      if (this.isPlaying) {
        this.startMusicBoxLoop();
      }
    }, currentDelay * 1000 + 400);
  }

  async togglePlay(customMusicPath = '') {
    if (this.isPlaying) {
      this.stop();
      return false;
    }

    this.isPlaying = true;
    const request = ++this.playRequest;
    // Unlock the fallback synthesizer while this call still belongs to a tap.
    const ready = this.unlock();

    if (customMusicPath) {
      try {
        if (!this.customAudio) {
          this.customAudio = new Audio(customMusicPath);
          this.customAudio.loop = true;
        }
        await this.customAudio.play();
        if (request !== this.playRequest) {
          if (!this.isPlaying) this.customAudio.pause();
          return this.isPlaying;
        }
        return true;
      } catch (e) {
        if (request !== this.playRequest) return this.isPlaying;
        // Fallback to synth if custom mp3 fails or is missing
        return this.startSynth(request, ready);
      }
    } else {
      return this.startSynth(request, ready);
    }
  }

  async startSynth(request = this.playRequest, ready = this.init()) {
    try {
      await ready;
      if (request !== this.playRequest) return this.isPlaying;
      if (this.ctx?.state !== 'running') {
        this.stop();
        return false;
      }
      this.startMusicBoxLoop();
      return true;
    } catch {
      if (request === this.playRequest) this.stop();
      return this.isPlaying;
    }
  }

  stop() {
    this.playRequest++;
    this.isPlaying = false;
    this.musicNodes.forEach((node) => {
      try { node.stop(); } catch {}
      node.disconnect();
    });
    this.musicNodes.clear();
    if (this.musicTimeout) {
      clearTimeout(this.musicTimeout);
      this.musicTimeout = null;
    }
    if (this.customAudio) {
      this.customAudio.pause();
    }
  }
}

export const soundManager = new RomanticSoundManager();

