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

const SONGS = {
  battle: {
    bpm: 152,
    lead: seq(
      'A4 - C5 - E5 - A5 - G5 - E5 - C5 - D5 - ' +
      'C5 - - - A4 - - - F4 - A4 - C5 - - - ' +
      'B4 - D5 - G5 - - - F5 - E5 - D5 - B4 - ' +
      'E5 - - - - - G#4 - B4 - D5 - E5 - - - ' +
      'A5 - G5 - E5 - A5 - G5 - E5 - C5 - E5 - ' +
      'F5 - E5 - C5 - A4 - C5 - F5 - A5 - - - ' +
      'G5 - F5 - D5 - B4 - D5 - G5 - B5 - - - ' +
      'G#5 - - - E5 - - - B4 - - - E5 . E5 . '
    ),
    bass: seq(
      'A2 . A2 A3 A2 . A2 A3 A2 . A2 A3 A2 . G2 G3 ' +
      'F2 . F2 F3 F2 . F2 F3 F2 . F2 F3 F2 . E2 E3 ' +
      'G2 . G2 G3 G2 . G2 G3 G2 . G2 G3 G2 . A2 A3 ' +
      'E2 . E2 E3 E2 . E2 E3 E2 . E2 E3 G#2 . B2 B3 ' +
      'A2 . A2 A3 A2 . A2 A3 A2 . A2 A3 A2 . G2 G3 ' +
      'F2 . F2 F3 F2 . F2 F3 F2 . F2 F3 F2 . E2 E3 ' +
      'G2 . G2 G3 G2 . G2 G3 G2 . G2 G3 G2 . A2 A3 ' +
      'E2 . E2 E3 E2 . E2 E3 E2 . E2 E3 G#2 . B2 B3'
    ),
    drums: 'k.h.s.hkk.h.s.hh',
  },
  title: {
    bpm: 128,
    lead: seq(
      'E5 - G5 - C6 - - - B5 - G5 - D5 - - - ' +
      'D5 - G5 - B5 - - - A5 - G5 - D5 - - - ' +
      'C5 - E5 - A5 - - - G5 - E5 - C5 - - - ' +
      'F5 - - - E5 - - - D5 - - - G5 - - - '
    ),
    bass: seq(
      'C3 . C3 . C4 . C3 . C3 . C3 . C4 . G2 . ' +
      'G2 . G2 . G3 . G2 . G2 . G2 . G3 . D3 . ' +
      'A2 . A2 . A3 . A2 . A2 . A2 . A3 . E3 . ' +
      'F2 . F2 . F3 . F2 . G2 . G2 . G3 . G2 . '
    ),
    drums: 'k.h.s.h.k.h.s.hh',
  },
  menu: {
    bpm: 116,
    lead: seq(
      'C5 . E5 . G5 . E5 . C5 . E5 . G5 - - - ' +
      'A4 . C5 . E5 . C5 . A4 . C5 . E5 - - - ' +
      'F4 . A4 . C5 . A4 . F4 . A4 . C5 - - - ' +
      'G4 . B4 . D5 . B4 . G4 . B4 . D5 - - - '
    ),
    bass: seq(
      'C3 - - - G2 - - - C3 - - - G2 - - - ' +
      'A2 - - - E2 - - - A2 - - - E2 - - - ' +
      'F2 - - - C3 - - - F2 - - - C3 - - - ' +
      'G2 - - - D3 - - - G2 - - - B2 - - - '
    ),
    drums: 'k...h...s...h...',
  },
};

export class Sound {
  constructor() {
    this.ctx = null;
    this.muted = store.get('tpb_muted', false);
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
    this.musBus.gain.value = 0.32;
    this.musBus.connect(this.master);
    const len = this.ctx.sampleRate;
    this.noiseBuf = this.ctx.createBuffer(1, len, this.ctx.sampleRate);
    const d = this.noiseBuf.getChannelData(0);
    for (let i = 0; i < len; i++) d[i] = Math.random() * 2 - 1;
    if (this.pendingBgm) {
      const n = this.pendingBgm;
      this.pendingBgm = null;
      this.playBgm(n);
    }
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
    o.type = type;
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
  schedule(song) {
    if (!this.ctx || this.ctx.state !== 'running') return;
    const spb = 60 / song.bpm / 4;
    const len = song.lead.length;
    while (this.nextT < this.ctx.currentTime + 0.12) {
      const when = this.nextT - this.ctx.currentTime;
      const i = this.step % len;
      const L = song.lead[i];
      if (L && L.m) this.tone('square', freq(L.m), null, spb * L.len * 0.95, 0.09, when, this.musBus);
      const B = song.bass[i % song.bass.length];
      if (B && B.m) this.tone('triangle', freq(B.m), null, spb * B.len * 0.9, 0.3, when, this.musBus);
      const d = song.drums[i % song.drums.length];
      if (d === 'k') this.tone('sine', 150, 40, 0.12, 0.5, when, this.musBus);
      else if (d === 's') this.noise(0.1, 0.25, 'bandpass', 1800, when, this.musBus);
      else if (d === 'h') this.noise(0.03, 0.08, 'highpass', 7000, when, this.musBus);
      this.nextT += spb;
      this.step++;
    }
  }
}
