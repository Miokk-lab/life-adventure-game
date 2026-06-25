/**
 * Web Audio API — cheerful pentatonic healing music
 * Gentle arpeggios in C major pentatonic (C D E G A)
 * with soft nature ambience
 */

let audioCtx: AudioContext | null = null;
let masterGain: GainNode | null = null;
let melodyInterval: ReturnType<typeof setInterval> | null = null;
let isMuted = false;

const PENTATONIC = [262, 294, 330, 392, 440]; // C4 D4 E4 G4 A4
const PENTATONIC_HIGH = [523, 587, 659, 784, 880]; // C5 D5 E5 G5 A5

function getCtx(): AudioContext {
  if (!audioCtx) {
    audioCtx = new AudioContext();
    masterGain = audioCtx.createGain();
    masterGain.gain.value = 0.12;
    masterGain.connect(audioCtx.destination);
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

function playNote(freq: number, startTime: number, duration: number, vol: number, type: OscillatorType = 'sine') {
  const ctx = getCtx();
  if (!masterGain || isMuted) return;
  const osc = ctx.createOscillator();
  osc.type = type;
  osc.frequency.value = freq;
  const gain = ctx.createGain();
  gain.gain.setValueAtTime(0, startTime);
  gain.gain.linearRampToValueAtTime(vol, startTime + 0.02);
  gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);
  osc.connect(gain).connect(masterGain);
  osc.start(startTime);
  osc.stop(startTime + duration + 0.05);
}

// Gentle arpeggiated melody
function playMelodyPhrase() {
  const ctx = getCtx();
  const now = ctx.currentTime;
  const notes = [...PENTATONIC, ...PENTATONIC_HIGH];
  // Pick 4-6 random notes ascending then descending
  const count = 4 + Math.floor(Math.random() * 3);
  const chosen: number[] = [];
  for (let i = 0; i < count; i++) {
    chosen.push(notes[Math.floor(Math.random() * notes.length)]);
  }
  chosen.sort((a, b) => a - b);
  const phrase = [...chosen, ...chosen.reverse().slice(1)];

  phrase.forEach((freq, i) => {
    const delay = i * 0.2;
    playNote(freq, now + delay, 0.3, 0.04, 'sine');
  });
}

// Soft wave/bird ambience (filtered noise)
let noiseNode: AudioBufferSourceNode | null = null;
function startNatureAmbience() {
  const ctx = getCtx();
  if (!masterGain) return;
  const bufferSize = ctx.sampleRate * 2;
  const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i++) {
    data[i] = (Math.random() * 2 - 1) * 0.03;
  }
  noiseNode = ctx.createBufferSource();
  noiseNode.buffer = buffer;
  noiseNode.loop = true;
  const filter = ctx.createBiquadFilter();
  filter.type = 'lowpass';
  filter.frequency.value = 800;
  filter.Q.value = 0.5;
  const gain = ctx.createGain();
  gain.gain.value = 0.015;
  noiseNode.connect(filter).connect(gain).connect(masterGain);
  noiseNode.start();
}

export function startAmbient() {
  if (melodyInterval) return;
  startNatureAmbience();
  playMelodyPhrase();
  melodyInterval = setInterval(() => {
    if (!isMuted) playMelodyPhrase();
  }, 4000 + Math.random() * 3000);
}

export function stopAmbient() {
  if (melodyInterval) { clearInterval(melodyInterval); melodyInterval = null; }
  if (noiseNode) { try { noiseNode.stop(); } catch {} noiseNode = null; }
}

export function playCollect() { playNote(880, getCtx().currentTime, 0.12, 0.06, 'sine'); }
export function playResolve() {
  [523, 659, 784].forEach((f, i) => playNote(f, getCtx().currentTime + i * 0.12, 0.25, 0.07));
}
export function playHurt() { playNote(200, getCtx().currentTime, 0.18, 0.06, 'triangle'); }
export function playClick() { playNote(1000, getCtx().currentTime, 0.04, 0.04, 'square'); }

export function toggleMute() {
  isMuted = !isMuted;
  if (masterGain) masterGain.gain.value = isMuted ? 0 : 0.12;
  return isMuted;
}
