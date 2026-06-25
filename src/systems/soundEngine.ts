/**
 * Healing, light, cheerful music — C major pentatonic (C D E G A)
 * All pages get pleasant, soft background ambience
 */

let audioCtx: AudioContext | null = null;
let masterGain: GainNode | null = null;
let allNodes: AudioNode[] = [];
let allOscs: OscillatorNode[] = [];
let intervals: ReturnType<typeof setInterval>[] = [];
let isMuted = false;

const PENTA = [262, 294, 330, 392, 440, 523, 587, 659, 784, 880]; // C4-C6 pentatonic
const PENTA_LOW = [131, 165, 196, 262, 330]; // C3-C4

function getCtx(): AudioContext {
  if (!audioCtx) { audioCtx = new AudioContext(); masterGain = audioCtx.createGain(); masterGain.gain.value = 0.08; masterGain.connect(audioCtx.destination); }
  if (audioCtx.state === 'suspended') audioCtx.resume();
  return audioCtx;
}

function cleanAll() {
  allOscs.forEach(o => { try { o.stop(); } catch {} }); allOscs = [];
  allNodes.forEach(n => { try { n.disconnect(); } catch {} }); allNodes = [];
  intervals.forEach(i => clearInterval(i)); intervals = [];
}

function osc(freq: number, type: OscillatorType = 'sine', vol = 0.03): OscillatorNode {
  const ctx = getCtx();
  const o = ctx.createOscillator(); o.type = type; o.frequency.value = freq;
  const g = ctx.createGain(); g.gain.value = 0;
  o.connect(g); g.connect(masterGain!);
  allOscs.push(o); allNodes.push(g);
  g.gain.linearRampToValueAtTime(vol, ctx.currentTime + 0.3);
  o.start();
  return o;
}

function note(freq: number, start: number, dur: number, vol = 0.03, type: OscillatorType = 'sine') {
  const ctx = getCtx(); if (!masterGain || isMuted) return;
  const o = ctx.createOscillator(); o.type = type; o.frequency.value = freq;
  const g = ctx.createGain(); g.gain.setValueAtTime(0, start);
  g.gain.linearRampToValueAtTime(vol, start + 0.03);
  g.gain.exponentialRampToValueAtTime(0.001, start + dur);
  o.connect(g).connect(masterGain); o.start(start); o.stop(start + dur + 0.05);
}

function arp(notes: number[], interval: number, vol = 0.03) {
  const id = setInterval(() => {
    if (isMuted) return;
    const f = notes[Math.floor(Math.random() * notes.length)];
    note(f, getCtx().currentTime, 0.3, vol);
  }, interval);
  intervals.push(id);
}

// ── Page ambients ──

function oceanAmbient() {
  cleanAll();
  // Soft wave: low filtered noise
  osc(180, 'sine', 0.015);
  const lfo = osc(0.2, 'sine', 10); lfo.connect((allNodes[1] as GainNode).gain);
  // Occasional high bell (seagull feel)
  arp(PENTA.filter((_, i) => i % 2 === 0), 4000, 0.025);
}

function voyageAmbient() {
  cleanAll();
  osc(131, 'triangle', 0.02); // low boat hum
  arp([262, 330], 2000, 0.025); // gentle pulse
}

function museumAmbient() {
  cleanAll();
  // Slow ascending arp
  const notes = [262, 294, 330, 392, 440, 523, 440, 392, 330, 294];
  let i = 0;
  const id = setInterval(() => { note(notes[i % notes.length], getCtx().currentTime, 0.6, 0.025); i++; }, 1500);
  intervals.push(id);
}

function battleAmbient() {
  cleanAll();
  arp(PENTA, 800, 0.04);
  arp(PENTA_LOW, 2400, 0.025);
}

function tasksAmbient() {
  cleanAll();
  // Steady rhythmic pulse
  let beat = 0;
  const id = setInterval(() => {
    const f = beat % 4 === 0 ? 330 : beat % 2 === 0 ? 392 : 294;
    note(f, getCtx().currentTime, 0.15, 0.025);
    beat++;
  }, 600);
  intervals.push(id);
}

function natureAmbient() {
  cleanAll();
  // Bird-like random high notes
  arp([784, 880, 1047, 1175, 1319], 1500 + Math.random() * 2000, 0.02);
  // Wind: filtered noise
  osc(600, 'sawtooth', 0.008);
}

function cafeAmbient() {
  cleanAll();
  // Soft jazz: maj7 chord
  [262, 330, 392, 440].forEach(f => osc(f, 'sine', 0.015));
  // Gentle plucked arp
  arp([262, 330, 392, 440, 392, 330], 2000, 0.03);
}

function victoryAmbient() {
  cleanAll();
  // Ascending celebration
  [523, 659, 784, 1047].forEach((f, i) => {
    note(f, getCtx().currentTime + i * 0.3, 0.5, 0.05);
  });
  arp([523, 659, 784, 1047, 784, 659], 3000, 0.035);
}

// ── Public API ──

let currentPage = '';
export function setPageAmbient(page: string) {
  if (page === currentPage) return;
  currentPage = page;
  cleanAll();
  if (isMuted) return;
  switch (page) {
    case 'login': case 'worry': oceanAmbient(); break;
    case 'voyage': voyageAmbient(); break;
    case 'analysis': museumAmbient(); break;
    case 'gamescreen': case 'battle': battleAmbient(); break;
    case 'tasks': tasksAmbient(); break;
    case 'minigames': natureAmbient(); break;
    case 'teashop': cafeAmbient(); break;
    case 'victory': victoryAmbient(); break;
    default: battleAmbient(); break;
  }
}

export function startAmbient() { setPageAmbient('battle'); }
export function stopAmbient() { cleanAll(); }
export function playCollect() { note(880, getCtx().currentTime, 0.12, 0.05); }
export function playResolve() { note(523, getCtx().currentTime, 0.15, 0.05); note(659, getCtx().currentTime + 0.12, 0.15, 0.05); note(784, getCtx().currentTime + 0.24, 0.2, 0.06); }
export function playHurt() { note(200, getCtx().currentTime, 0.15, 0.04, 'triangle'); }
export function playClick() { note(1000, getCtx().currentTime, 0.04, 0.03, 'square'); }

export function toggleMute() {
  isMuted = !isMuted;
  if (isMuted) { cleanAll(); } else { const p = currentPage; currentPage = ''; setPageAmbient(p); }
  return isMuted;
}
