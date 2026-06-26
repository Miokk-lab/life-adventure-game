/**
 * Background music via MP3 files, sound effects via Web Audio API.
 * Battle page → /music/battle page.mp3
 * All other pages → /music/main-menu.mp3
 */

let audioCtx: AudioContext | null = null;
let masterGain: GainNode | null = null;
let isMuted = false;

// ── BGM (HTML5 Audio with looping) ──

let bgmAudio: HTMLAudioElement | null = null;
let currentBgmSrc = '';

const BATTLE_SRC = '/music/battle page.mp3';
const MAIN_SRC = '/music/main-menu.mp3';

function getBgmSrc(page: string): string {
  if (page === 'battle') return BATTLE_SRC;
  return MAIN_SRC;
}

function ensureBgm(src: string) {
  if (!bgmAudio) {
    bgmAudio = new Audio(src);
    bgmAudio.loop = true;
    bgmAudio.volume = 0.4;
  }
}

// ── Web Audio helpers (for sound effects) ──

function getCtx(): AudioContext {
  if (!audioCtx) {
    audioCtx = new AudioContext();
    masterGain = audioCtx.createGain();
    masterGain.gain.value = 0.18;
    masterGain.connect(audioCtx.destination);
  }
  if (audioCtx.state === 'suspended') audioCtx.resume();
  return audioCtx;
}

function note(
  freq: number,
  start: number,
  dur: number,
  vol = 0.06,
  type: OscillatorType = 'sine',
) {
  const ctx = getCtx();
  if (!masterGain || isMuted) return;
  const o = ctx.createOscillator();
  o.type = type;
  o.frequency.value = freq;
  const g = ctx.createGain();
  g.gain.setValueAtTime(0, start);
  g.gain.linearRampToValueAtTime(vol, start + 0.03);
  g.gain.exponentialRampToValueAtTime(0.001, start + dur);
  o.connect(g).connect(masterGain);
  o.start(start);
  o.stop(start + dur + 0.05);
}

// ── Public API ──

let currentPage = '';
let pendingAudio: HTMLAudioElement | null = null;
let fadeTimer: ReturnType<typeof setInterval> | null = null;

function fadeVolume(audio: HTMLAudioElement, from: number, to: number, ms: number): Promise<void> {
  return new Promise(resolve => {
    if (fadeTimer) { clearInterval(fadeTimer); fadeTimer = null; }
    const steps = 20;
    const stepMs = ms / steps;
    const delta = (to - from) / steps;
    let i = 0;
    fadeTimer = setInterval(() => {
      i++;
      audio.volume = Math.max(0, Math.min(1, from + delta * i));
      if (i >= steps) { clearInterval(fadeTimer!); fadeTimer = null; resolve(); }
    }, stepMs);
  });
}

function retryPending() {
  if (pendingAudio) {
    pendingAudio.play().then(() => { pendingAudio = null; }).catch(() => {});
  }
}
(['click', 'touchstart', 'keydown', 'pointerdown'] as const).forEach(evt =>
  document.addEventListener(evt, retryPending)
);

function playWithRetry(audio: HTMLAudioElement) {
  pendingAudio = audio;
  audio.play().then(() => { pendingAudio = null; }).catch(() => {
    // retryPending() will be called on next user interaction
  });
}

export async function setPageAmbient(page: string) {
  if (page === currentPage) return;
  currentPage = page;
  if (isMuted) return;

  const src = getBgmSrc(page);

  // Same track already playing — resume if paused
  if (bgmAudio && currentBgmSrc === src) {
    if (bgmAudio.paused) playWithRetry(bgmAudio);
    return;
  }

  // Fade out current BGM before switching
  if (bgmAudio && !bgmAudio.paused) {
    await fadeVolume(bgmAudio, bgmAudio.volume, 0, 1000);
    bgmAudio.pause();
  }

  ensureBgm(src);

  if (bgmAudio) {
    bgmAudio.src = src;
    bgmAudio.volume = 0;
    currentBgmSrc = src;
    playWithRetry(bgmAudio);
    fadeVolume(bgmAudio, 0, 0.4, 1000);
  }
}

export function startAmbient() {
  setPageAmbient('battle');
}

export function stopAmbient() {
  if (bgmAudio) {
    bgmAudio.pause();
    bgmAudio.currentTime = 0;
  }
}

export function playCollect() {
  note(880, getCtx().currentTime, 0.12, 0.05);
}

export function playResolve() {
  note(523, getCtx().currentTime, 0.15, 0.05);
  note(659, getCtx().currentTime + 0.12, 0.15, 0.05);
  note(784, getCtx().currentTime + 0.24, 0.2, 0.06);
}

export function playHurt() {
  note(200, getCtx().currentTime, 0.15, 0.04, 'triangle');
}

export function playClick() {
  note(1000, getCtx().currentTime, 0.04, 0.03, 'square');
}

export function toggleMute() {
  isMuted = !isMuted;
  if (bgmAudio) bgmAudio.muted = isMuted;
  return isMuted;
}
