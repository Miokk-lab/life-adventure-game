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
  if (page === 'battle' || page === 'gamescreen') return BATTLE_SRC;
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

export function setPageAmbient(page: string) {
  if (page === currentPage) return;
  currentPage = page;
  if (isMuted) return;

  const src = getBgmSrc(page);

  // Same track already playing — don't restart
  if (bgmAudio && currentBgmSrc === src) {
    if (bgmAudio.paused) bgmAudio.play().catch(() => {});
    return;
  }

  ensureBgm(src);

  if (bgmAudio) {
    bgmAudio.src = src;
    currentBgmSrc = src;
    bgmAudio.play().catch(() => {});
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
