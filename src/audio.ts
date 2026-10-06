/** Tiny synthesised sound effects + haptics. No audio files; everything starts after a user gesture. */
const KEY = 'build30.muted';
let ctx: AudioContext | null = null;
let muted = false;
try {
  muted = localStorage.getItem(KEY) === '1';
} catch {
  /* storage unavailable */
}
const listeners = new Set<() => void>();

export const isMuted = () => muted;
export function setMuted(v: boolean) {
  muted = v;
  try {
    localStorage.setItem(KEY, v ? '1' : '0');
  } catch {
    /* ignore */
  }
  listeners.forEach((l) => l());
}
export function onMuteChange(fn: () => void) {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

function audio(): AudioContext | null {
  if (muted) return null;
  try {
    const AC = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AC) return null;
    ctx = ctx ?? new AC();
    if (ctx.state === 'suspended') void ctx.resume();
    return ctx;
  } catch {
    return null;
  }
}

function tone(c: AudioContext, freq: number, start: number, dur: number, type: OscillatorType = 'sine', vol = 0.07, slideTo?: number) {
  const o = c.createOscillator();
  const g = c.createGain();
  o.type = type;
  o.frequency.setValueAtTime(freq, c.currentTime + start);
  if (slideTo) o.frequency.exponentialRampToValueAtTime(slideTo, c.currentTime + start + dur);
  g.gain.setValueAtTime(0.0001, c.currentTime + start);
  g.gain.exponentialRampToValueAtTime(vol, c.currentTime + start + 0.015);
  g.gain.exponentialRampToValueAtTime(0.0001, c.currentTime + start + dur);
  o.connect(g).connect(c.destination);
  o.start(c.currentTime + start);
  o.stop(c.currentTime + start + dur + 0.05);
}

const N = { C5: 523, E5: 659, G5: 784, A5: 880, C6: 1047, E6: 1319, G4: 392, D5: 587, A4: 440 };

export type Sfx = 'tap' | 'ok' | 'win' | 'nope' | 'fanfare' | 'alarm' | 'ding' | 'whoosh';

export function haptic(pattern: number | number[]) {
  if (muted) return;
  try {
    navigator.vibrate?.(pattern);
  } catch {
    /* not supported */
  }
}

export function sfx(name: Sfx) {
  const c = audio();
  if (!c) return;
  switch (name) {
    case 'tap':
      tone(c, 620, 0, 0.05, 'triangle', 0.035);
      break;
    case 'ok':
      tone(c, N.E5, 0, 0.09, 'triangle', 0.06);
      tone(c, N.A5, 0.07, 0.14, 'triangle', 0.06);
      break;
    case 'win':
      [N.C5, N.E5, N.G5, N.C6].forEach((f, i) => tone(c, f, i * 0.08, 0.18, 'triangle', 0.07));
      haptic(30);
      break;
    case 'nope':
      tone(c, 220, 0, 0.18, 'sawtooth', 0.04, 140);
      haptic(40);
      break;
    case 'fanfare':
      [N.C5, N.E5, N.G5, N.C6, N.G5, N.C6, N.E6].forEach((f, i) => tone(c, f, i * 0.11, 0.26, 'triangle', 0.07));
      tone(c, N.C5 / 2, 0, 0.9, 'sine', 0.05);
      haptic([30, 40, 30]);
      break;
    case 'alarm':
      for (let i = 0; i < 4; i++) tone(c, i % 2 ? 660 : 880, i * 0.22, 0.2, 'square', 0.045);
      break;
    case 'ding':
      tone(c, N.E6, 0, 0.5, 'sine', 0.07);
      tone(c, N.C6, 0.18, 0.6, 'sine', 0.06);
      break;
    case 'whoosh':
      tone(c, 200, 0, 0.35, 'sawtooth', 0.025, 900);
      break;
  }
}

/** "Happy Birthday" (public domain), played softly on the last screen. Returns a function that stops it. */
export function playBirthday(): () => void {
  const c = audio();
  if (!c) return () => {};
  const master = c.createGain();
  master.gain.value = 1;
  master.connect(c.destination);
  const f = { G4: 392, A4: 440, B4: 494, C5: 523, D5: 587, E5: 659, F5: 698, G5: 784 };
  // [note, beats]; 100 bpm
  const tune: [number, number][] = [
    [f.G4, 0.75], [f.G4, 0.25], [f.A4, 1], [f.G4, 1], [f.C5, 1], [f.B4, 2],
    [f.G4, 0.75], [f.G4, 0.25], [f.A4, 1], [f.G4, 1], [f.D5, 1], [f.C5, 2],
    [f.G4, 0.75], [f.G4, 0.25], [f.G5, 1], [f.E5, 1], [f.C5, 1], [f.B4, 1], [f.A4, 1],
    [f.F5, 0.75], [f.F5, 0.25], [f.E5, 1], [f.C5, 1], [f.D5, 1], [f.C5, 2],
  ];
  const beat = 60 / 100;
  let t0 = 0.25;
  for (const [freq, b] of tune) {
    const o = c.createOscillator();
    const g = c.createGain();
    o.type = 'triangle';
    o.frequency.value = freq;
    const start = c.currentTime + t0;
    const dur = b * beat * 0.94;
    g.gain.setValueAtTime(0.0001, start);
    g.gain.exponentialRampToValueAtTime(0.06, start + 0.03);
    g.gain.exponentialRampToValueAtTime(0.0001, start + dur);
    o.connect(g).connect(master);
    o.start(start);
    o.stop(start + dur + 0.05);
    t0 += b * beat;
  }
  return () => {
    try {
      master.gain.setTargetAtTime(0, c.currentTime, 0.05);
    } catch {
      /* already closed */
    }
  };
}
