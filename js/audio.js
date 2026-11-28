// 程式產生的 8-bit 音效與背景音樂（Web Audio API，不需要任何音檔）
import { store } from './util.js';

const NOTE = { C: 0, 'C#': 1, D: 2, 'D#': 3, E: 4, F: 5, 'F#': 6, G: 7, 'G#': 8, A: 9, 'A#': 10, B: 11 };
function midi(name) {
  const m = name.match(/^([A-G]#?)(\d)$/);
  if (!m) return null;
  return 12 * (+m[2] + 1) + NOTE[m[1]];
}
const freq = (m) => 440 * Math.pow(2, (m - 69) / 12);

// 把 "A4 - C5 . E5" 這種字串轉成 [{m,len}|null]；"-" 延長上一個音，"." 休止
function seq(str) {
  const tok = str.trim().split(/\s+/);
  const out = new Array(tok.length).fill(null);
  for (let i = 0; i < tok.length; i++) {
    const t = tok[i];
    if (t === '.' || t === '-') continue;
    let len = 1;
    while (tok[i + len] === '-') len++;
    out[i] = { m: midi(t), len };
  }
  return out;
}

// ───── 背景音樂：原創曲，走掌機 RPG 冒險風（主旋律＋快速分解和弦＋跳動低音＋輕鼓） ─────
// lead：主旋律（一小節 16 格）；chords：每小節的和弦（一格寫一個或兩個，兩個就是各半小節）
// bass / harm 的樣式由程式依和弦自動產生
const bars = (...b) => seq(b.join(' '));
const ROOT = { C: 0, 'C#': 1, Db: 1, D: 2, 'D#': 3, Eb: 3, E: 4, F: 5, 'F#': 6, Gb: 6, G: 7, 'G#': 8, Ab: 8, A: 9, 'A#': 10, Bb: 10, B: 11 };
function chord(name) {
  const m = name.match(/^([A-G][#b]?)(m?)(7?)$/);
  const r = ROOT[m[1]];
  return { r, third: m[2] ? 3 : 4, seventh: m[3] ? 10 : null };
}
// 低音樣式（半小節 8 格）
const BASS = {
  walk: (c) => [[0, 2], null, [12, 2], null, [7, 2], null, [12, 2], null],
  drive: (c) => [[0, 1], [0, 1], [12, 1], [0, 1], [0, 1], [12, 1], [0, 1], [7, 1]],
  march: (c) => [[0, 3], null, null, [7, 1], [0, 3], null, null, [7, 1]],
  calm: (c) => [[0, 4], null, null, null, [7, 4], null, null, null],
};
function build(song) {
  const n = song.chords.length * 16;
  const bass = new Array(n).fill(null), harm = new Array(n).fill(null);
  song.chords.forEach((bar, bi) => {
    const cs = bar.split(' ');
    const halves = cs.length === 1 ? [cs[0], cs[0]] : cs;
    halves.forEach((name, hi) => {
      const c = chord(name);
      const base = bi * 16 + hi * 8;
      const bm = 48 + c.r + (c.r > 4 ? -12 : 0); // 低音落在 F2～E3
      BASS[song.bassStyle || 'walk'](c).forEach((v, k) => {
        if (v) bass[base + k] = { m: bm + v[0], len: v[1] };
      });
      const tones = [0, c.third, 7, c.seventh || 12];
      const hm = 60 + c.r - (c.r > 7 ? 12 : 0);
      for (let k = 0; k < 8; k++) {
        if (song.harmStyle === 'arp8' && k % 2) continue;
        const idx = song.harmStyle === 'arp8' ? k / 2 : k;
        harm[base + k] = { m: hm + tones[idx % 4], len: 1 };
      }
    });
  });
  return { ...song, bass, harm };
}

const SONGS = {
  // 標題：冒險開始（C 大調）
  title: build({
    bpm: 132,
    lead: bars(
      'G4 - C5 - E5 - G5 - - - - - E5 - G5 -',
      'A5 - - - G5 - F5 - G5 - - - - - . .',
      'E5 - - - C5 - E5 - A5 - - - G5 - E5 -',
      'F5 - - - A5 - C6 - D6 - - - - - . .',
      'E6 - - - D6 - C6 - G5 - - - E5 - G5 -',
      'B5 - - - G5 - E5 - A5 - - - C6 - - -',
      'D6 - - - C6 - A5 - B5 - - - D6 - - -',
      'C6 - - - - - - - - - - - . . . .',
    ),
    chords: ['C', 'F G', 'Am', 'F G', 'C', 'Em F', 'Dm G', 'C'],
    bassStyle: 'walk',
    drums: 'k...h.h.s...h.h.',
  }),
  // 選單：安靜的小鎮（F 大調）
  menu: build({
    bpm: 112,
    lead: bars(
      'A5 - - - C6 - A5 - G5 - F5 - - - - -',
      'F5 - - - A5 - D6 - - - C6 - A5 - - -',
      'A#5 - - - A5 - G5 - F5 - - - D5 - - -',
      'E5 - - - G5 - C6 - - - - - . . . .',
      'A5 - - - C6 - F6 - - - E6 - D6 - C6 -',
      'C6 - - - E5 - - - F5 - - - A5 - - -',
      'A#5 - - - A5 - G5 - E5 - G5 - C6 - - -',
      'A5 - - - - - - - . . . . . . . .',
    ),
    chords: ['F', 'Dm', 'Bb', 'C', 'F', 'Am Dm', 'Gm C', 'F'],
    bassStyle: 'calm',
    harmStyle: 'arp8',
    drums: 'k.......s.......',
  }),
  // 對戰模式（E 小調，快節奏）
  battle: build({
    bpm: 172,
    lead: bars(
      'E5 . E5 . G5 . E5 . B5 - - . A5 . G5 .',
      'F#5 . G5 . A5 - - . B5 - - - E5 - - -',
      'C6 . C6 . B5 . A5 . G5 - - . E5 . G5 .',
      'A5 - - - F#5 - - - D6 - - - C6 - B5 -',
      'E6 . E6 . D6 . B5 . G5 - A5 . B5 - - .',
      'E6 - - . G6 - - . F#6 - E6 . C6 - - .',
      'C6 . B5 . A5 . C6 . D#6 - - . F#6 - - .',
      'E6 - - - B5 - - - E5 - - - . . . .',
    ),
    chords: ['Em', 'Em', 'C', 'D', 'Em', 'Em C', 'Am B', 'Em'],
    bassStyle: 'drive',
    drums: 'k.h.s.hkk.h.s.hh',
  }),
  // 第一關：廟口老街（D 大調，輕快冒險路線）
  story1: build({
    bpm: 150,
    lead: bars(
      'A4 - D5 - F#5 - A5 - - - F#5 - G5 - A5 -',
      'B5 - - - A5 - G5 - A5 - - - E5 - - -',
      'F#5 - E5 - D5 - E5 - F#5 - A5 - D6 - - -',
      'D6 - B5 - - - F#5 - A5 - - - - - . .',
      'G5 - B5 - D6 - - - B5 - G5 - D5 - G5 -',
      'A5 - - - C#6 - E6 - F#6 - - - C#6 - - -',
      'D6 - C#6 - B5 - A5 - B5 - - - F#5 - - -',
      'G5 - A5 - B5 - C#6 - A5 - - - - - - -',
    ),
    chords: ['D', 'G A', 'D', 'Bm A', 'G', 'A F#m', 'Bm', 'G A'],
    bassStyle: 'walk',
    drums: 'k.h.s.h.k.hks.h.',
  }),
  // 第二關：下樓梯（F 大調，快又俏皮）
  shaft: build({
    bpm: 176,
    lead: bars(
      'C5 . F5 . A5 - G5 . F5 . C5 . F5 - A5 .',
      'D6 - - . C6 . A5 . F5 - A5 . D5 - - .',
      'D6 . D6 . C6 . A#5 - A5 . F5 . D5 . F5 .',
      'G5 - - - E5 - C5 - E5 - G5 - C6 - - -',
      'A5 . C6 . F6 - E6 . D6 . C6 . A5 - G5 .',
      'C#6 - - . E6 . A5 . D6 - - . F6 . D6 .',
      'D6 . C6 . A#5 . A5 . G5 . A5 . A#5 . C6 .',
      'A5 - - - F5 - - - F6 - - - . . . .',
    ),
    chords: ['F', 'Dm', 'Bb', 'C', 'F', 'A Dm', 'Bb C', 'F'],
    bassStyle: 'walk',
    drums: 'k.hhs.hhk.hhs.hh',
  }),
  // 第三關：總統大選（G 大調，英雄進行曲）
  story3: build({
    bpm: 138,
    lead: bars(
      'D5 - - G5 - - B5 - D6 - - - B5 - D6 -',
      'E6 - - - D6 - C6 - D6 - - - A5 - - -',
      'B5 - - - G5 - E5 - G5 - B5 - E6 - - -',
      'C6 - B5 - A5 - G5 - F#5 - G5 - A5 - - -',
      'D6 - - G6 - - F#6 - E6 - D6 - B5 - D6 -',
      'E6 - - - G6 - E6 - C6 - - - E6 - - -',
      'C6 - B5 - A5 - - - F#5 - A5 - D6 - C6 -',
      'B5 - - - - - - - G5 - - - . . . .',
    ),
    chords: ['G', 'C D', 'Em', 'C D', 'G', 'Em C', 'Am D', 'G'],
    bassStyle: 'march',
    drums: 'k..ks.k.k..ks.ss',
  }),
  // Boss 戰（A 小調，館主對決的氣勢）
  boss: build({
    bpm: 168,
    lead: bars(
      'A5 - E5 - A5 - B5 - C6 - B5 - A5 - E5 -',
      'A5 - - - G5 - A5 - - - E5 - - - . .',
      'F5 - A5 - C6 - F6 - E6 - - - C6 - A5 -',
      'B5 - - - D6 - - - G5 - - - B5 - D6 -',
      'E6 - - - C6 - A5 - E6 - F6 - E6 - D6 -',
      'C6 - - - B5 - A5 - B5 - C6 - B5 - G#5 -',
      'A5 - - - C6 - F6 - - - E6 - D6 - B5 -',
      'G#5 - - - B5 - - - E6 - - - - - - -',
    ),
    chords: ['Am', 'Am', 'F', 'G', 'Am', 'Am', 'F G', 'E'],
    bassStyle: 'drive',
    drums: 'k.hsk.hsk.hsk.ss',
  }),
  // 過關：勝利號角（只放一次）
  clear: build({
    bpm: 150,
    loop: false,
    lead: bars(
      'C5 . C5 . C5 . G5 - - - E5 - G5 - - -',
      'A5 - - - F5 - A5 - B5 - - - G5 - B5 -',
      'C6 - - - - - - - - - - - . . . .',
    ),
    chords: ['C', 'F G', 'C'],
    bassStyle: 'walk',
    drums: 'k...s...k...s...',
  }),
};

export class Sound {
  constructor() {
    this.ctx = null;
    this.muted = store.get('tpb_muted', false);
    this.musicOn = store.get('tpb_music', true);
    this.bgmName = null;
    this.pendingBgm = null;
    this.timer = null;
  }
  get ready() {
    return !!this.ctx && this.ctx.state === 'running';
  }
  unlock() {
    if (this.ctx) {
      if (this.ctx.state === 'suspended') this.ctx.resume();
      return;
    }
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return;
    this.ctx = new AC();
    this.master = this.ctx.createGain();
    this.master.gain.value = this.muted ? 0 : 0.5;
    this.master.connect(this.ctx.destination);
    this.sfxBus = this.ctx.createGain();
    this.sfxBus.gain.value = 0.8;
    this.sfxBus.connect(this.master);
    this.musBus = this.ctx.createGain();
    this.musBus.gain.value = this.musicOn ? 0.32 : 0;
    this.musBus.connect(this.master);
    const len = this.ctx.sampleRate;
    this.noiseBuf = this.ctx.createBuffer(1, len, this.ctx.sampleRate);
    const d = this.noiseBuf.getChannelData(0);
    for (let i = 0; i < len; i++) d[i] = Math.random() * 2 - 1;
    // 掌機風格的窄方波：25%（主旋律）、12.5%（分解和弦）
    const pulse = (duty) => {
      const N = 32, re = new Float32Array(N), im = new Float32Array(N);
      for (let n = 1; n < N; n++) re[n] = (2 / (n * Math.PI)) * Math.sin(n * Math.PI * duty);
      return this.ctx.createPeriodicWave(re, im);
    };
    this.pulseWave = pulse(0.25);
    this.pulse12 = pulse(0.125);
    if (this.pendingBgm) {
      const n = this.pendingBgm;
      this.pendingBgm = null;
      this.playBgm(n);
    }
  }
  // 只開關背景音樂（音效照常）
  toggleMusic() {
    this.musicOn = !this.musicOn;
    store.set('tpb_music', this.musicOn);
    if (this.musBus) this.musBus.gain.value = this.musicOn ? 0.32 : 0;
    if (this.onMusic) this.onMusic(this.musicOn);
  }
  toggleMute() {
    this.muted = !this.muted;
    store.set('tpb_muted', this.muted);
    if (this.master) this.master.gain.value = this.muted ? 0 : 0.5;
  }

  tone(type, f0, f1, dur, vol, when = 0, bus = this.sfxBus) {
    const c = this.ctx;
    const t = c.currentTime + when;
    const o = c.createOscillator();
    const g = c.createGain();
    if (type === 'pulse') o.setPeriodicWave(this.pulseWave);
    else o.type = type;
    o.frequency.setValueAtTime(f0, t);
    if (f1) o.frequency.exponentialRampToValueAtTime(Math.max(20, f1), t + dur);
    g.gain.setValueAtTime(vol, t);
    g.gain.exponentialRampToValueAtTime(0.001, t + dur);
    o.connect(g);
    g.connect(bus);
    o.start(t);
    o.stop(t + dur + 0.03);
  }
  noise(dur, vol, ftype = 'lowpass', fq = 1000, when = 0, bus = this.sfxBus) {
    const c = this.ctx;
    const t = c.currentTime + when;
    const s = c.createBufferSource();
    s.buffer = this.noiseBuf;
    const f = c.createBiquadFilter();
    f.type = ftype;
    f.frequency.value = fq;
    const g = c.createGain();
    g.gain.setValueAtTime(vol, t);
    g.gain.exponentialRampToValueAtTime(0.001, t + dur);
    s.connect(f);
    f.connect(g);
    g.connect(bus);
    s.start(t, Math.random() * 0.5);
    s.stop(t + dur + 0.03);
  }

  sfx(name) {
    if (!this.ctx || this.ctx.state !== 'running') return;
    switch (name) {
      case 'hit':
        this.noise(0.08, 0.5, 'bandpass', 1800);
        this.tone('square', 220, 70, 0.09, 0.22);
        break;
      case 'heavy':
        this.noise(0.2, 0.7, 'lowpass', 900);
        this.tone('square', 160, 40, 0.22, 0.32);
        this.tone('sawtooth', 90, 30, 0.25, 0.18);
        break;
      case 'whiff':
        this.noise(0.08, 0.12, 'highpass', 3000);
        break;
      case 'block':
        this.tone('square', 1200, 900, 0.06, 0.12);
        this.noise(0.04, 0.2, 'highpass', 4000);
        break;
      case 'jump':
        this.tone('square', 260, 620, 0.12, 0.1);
        break;
      case 'land':
        this.noise(0.06, 0.2, 'lowpass', 400);
        break;
      case 'move':
        this.tone('square', 660, null, 0.04, 0.08);
        break;
      case 'confirm':
        this.tone('square', 523, null, 0.07, 0.12);
        this.tone('square', 659, null, 0.07, 0.12, 0.07);
        this.tone('square', 784, null, 0.14, 0.12, 0.14);
        break;
      case 'back':
        this.tone('square', 440, 220, 0.1, 0.1);
        break;
      case 'special':
        this.tone('sawtooth', 300, 900, 0.18, 0.12);
        this.noise(0.12, 0.15, 'bandpass', 2500);
        break;
      case 'cutin':
        this.tone('square', 523, null, 0.5, 0.1);
        this.tone('square', 659, null, 0.5, 0.1);
        this.tone('square', 784, null, 0.5, 0.1);
        this.tone('sawtooth', 130, 1300, 0.5, 0.12);
        this.noise(0.3, 0.3, 'highpass', 1500);
        break;
      case 'super':
        this.tone('sawtooth', 150, 1600, 0.5, 0.15);
        this.tone('square', 75, 600, 0.5, 0.12);
        this.noise(0.5, 0.25, 'bandpass', 2000);
        break;
      case 'ko':
        this.tone('square', 600, 60, 0.9, 0.22);
        this.noise(0.6, 0.4, 'lowpass', 600);
        break;
      case 'coin':
        this.tone('square', 988, null, 0.05, 0.06);
        this.tone('square', 1319, null, 0.1, 0.06, 0.05);
        break;
      case 'flash':
        this.noise(0.25, 0.35, 'highpass', 2000);
        this.tone('sine', 2000, 4000, 0.2, 0.1);
        break;
      case 'wave':
        this.tone('sawtooth', 140, 50, 0.7, 0.28);
        this.noise(0.6, 0.45, 'lowpass', 500);
        break;
      case 'zap':
        for (let i = 0; i < 6; i++) this.tone('square', 200 + Math.random() * 1500, 80, 0.06, 0.1, i * 0.04);
        this.noise(0.3, 0.3, 'bandpass', 3000);
        break;
      case 'throw':
        this.tone('square', 300, 80, 0.25, 0.18);
        this.noise(0.15, 0.3, 'lowpass', 700);
        break;
      case 'heal':
        [523, 659, 784, 1046].forEach((f, i) => this.tone('triangle', f, null, 0.12, 0.12, i * 0.06));
        break;
      case 'fight':
        this.tone('square', 392, null, 0.12, 0.13);
        this.tone('square', 523, null, 0.12, 0.13, 0.12);
        this.tone('square', 784, null, 0.4, 0.13, 0.24);
        break;
      case 'banana':
        this.tone('triangle', 600, 200, 0.2, 0.2);
        break;
      case 'slip':
        this.tone('square', 900, 100, 0.35, 0.13);
        break;
      case 'sound':
        this.tone('square', 500, 1200, 0.15, 0.1);
        this.tone('square', 700, 1600, 0.15, 0.08, 0.05);
        break;
      case 'camera':
        this.noise(0.05, 0.3, 'highpass', 5000);
        this.tone('square', 2400, null, 0.03, 0.06);
        break;
    }
  }

  playBgm(name) {
    if (this.bgmName === name && (this.timer || this.pendingBgm === name)) return;
    this.stopBgm();
    this.bgmName = name;
    if (!this.ctx) {
      this.pendingBgm = name;
      return;
    }
    const song = SONGS[name];
    if (!song) return;
    this.step = 0;
    this.nextT = this.ctx.currentTime + 0.05;
    this.timer = setInterval(() => this.schedule(song), 25);
  }
  stopBgm() {
    if (this.timer) clearInterval(this.timer);
    this.timer = null;
    this.bgmName = null;
  }
  // 一個音：快速起音、慢慢變小聲、長音加顫音
  voice(type, f, dur, vol, when, vib) {
    const c = this.ctx;
    const t = c.currentTime + when;
    const o = c.createOscillator();
    if (type === 'pulse') o.setPeriodicWave(this.pulseWave);
    else if (type === 'pulse12') o.setPeriodicWave(this.pulse12);
    else o.type = type;
    o.frequency.setValueAtTime(f, t);
    const g = c.createGain();
    g.gain.setValueAtTime(0, t);
    g.gain.linearRampToValueAtTime(vol, t + 0.008);
    g.gain.linearRampToValueAtTime(vol * 0.75, t + Math.min(0.1, dur * 0.5));
    g.gain.linearRampToValueAtTime(vol * 0.5, t + dur);
    g.gain.linearRampToValueAtTime(0, t + dur + 0.04);
    o.connect(g);
    g.connect(this.musBus);
    if (vib && dur > 0.25) {
      const lfo = c.createOscillator(), lg = c.createGain();
      lfo.frequency.value = 5.5;
      lg.gain.setValueAtTime(0, t);
      lg.gain.setValueAtTime(0, t + 0.14);
      lg.gain.linearRampToValueAtTime(f * 0.014, t + 0.3);
      lfo.connect(lg);
      lg.connect(o.frequency);
      lfo.start(t);
      lfo.stop(t + dur + 0.06);
    }
    o.start(t);
    o.stop(t + dur + 0.06);
  }
  schedule(song) {
    if (!this.ctx || this.ctx.state !== 'running') return;
    const spb = 60 / song.bpm / 4;
    const len = song.lead.length;
    while (this.nextT < this.ctx.currentTime + 0.12) {
      if (song.loop === false && this.step >= len) {
        this.stopBgm();
        return;
      }
      const when = this.nextT - this.ctx.currentTime;
      const i = this.step % len;
      const L = song.lead[i];
      if (L && L.m) this.voice('pulse', freq(L.m), spb * L.len * 0.96, 0.11, when, true);
      const H = song.harm[i];
      if (H && H.m) this.voice('pulse12', freq(H.m), spb * 0.85, 0.03, when, false);
      const B = song.bass[i];
      if (B && B.m) this.voice('triangle', freq(B.m), spb * B.len * 0.9, 0.34, when, false);
      const d = song.drums[i % song.drums.length];
      if (d === 'k') this.tone('sine', 130, 45, 0.1, 0.32, when, this.musBus);
      else if (d === 's') this.noise(0.08, 0.13, 'bandpass', 2600, when, this.musBus);
      else if (d === 'h') this.noise(0.02, 0.05, 'highpass', 8000, when, this.musBus);
      this.nextT += spb;
      this.step++;
    }
  }
}
