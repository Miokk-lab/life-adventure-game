/**
 * Web Audio API sound engine — adapted from ver4 SoundManager.ts
 * Synthesized ambient + SFX, no audio files needed.
 */

let audioCtx: AudioContext | null = null;
let masterGain: GainNode | null = null;
let ambientNodes: OscillatorNode[] = [];
let isMuted = false;

function getCtx(): AudioContext {
  if (!audioCtx) {
    audioCtx = new AudioContext();
    masterGain = audioCtx.createGain();
    masterGain.gain.value = 0.3;
    masterGain.connect(audioCtx.destination);
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

export function startAmbient() {
  const ctx = getCtx();
  if (!masterGain || ambientNodes.length > 0) return;

  // Drone base — warm low frequency
  const drone = ctx.createOscillator();
  drone.type = 'sine';
  drone.frequency.value = 110; // A2
  const droneGain = ctx.createGain();
  droneGain.gain.value = 0.08;
  drone.connect(droneGain).connect(masterGain);
  drone.start();
  ambientNodes.push(drone);

  // Harmony — fifth above
  const harm = ctx.createOscillator();
  harm.type = 'sine';
  harm.frequency.value = 165; // E3
  const harmGain = ctx.createGain();
  harmGain.gain.value = 0.05;
  harm.connect(harmGain).connect(masterGain);
  harm.start();
  ambientNodes.push(harm);

  // High shimmer
  const shimmer = ctx.createOscillator();
  shimmer.type = 'sine';
  shimmer.frequency.value = 440; // A4
  const shimmerGain = ctx.createGain();
  shimmerGain.gain.value = 0.02;
  shimmer.connect(shimmerGain).connect(masterGain);
  shimmer.start();
  ambientNodes.push(shimmer);
}

export function stopAmbient() {
  ambientNodes.forEach((n) => {
    try { n.stop(); } catch {}
  });
  ambientNodes = [];
}

export function setMoodAdaptive(hpRatio: number) {
  if (!masterGain) return;
  // Lower HP → quieter, more tense
  const gain = 0.1 + hpRatio * 0.25;
  masterGain.gain.linearRampToValueAtTime(gain, getCtx().currentTime + 0.5);
}

export function playCollect() {
  playTone(880, 0.1, 'square', 0.06);
}

export function playResolve() {
  playTone(660, 0.15, 'sine', 0.08);
  setTimeout(() => playTone(880, 0.1, 'sine', 0.06), 150);
}

export function playHurt() {
  playTone(200, 0.2, 'sawtooth', 0.08);
}

export function playVictory() {
  const notes = [523, 659, 784, 1047]; // C5 E5 G5 C6
  notes.forEach((freq, i) => {
    setTimeout(() => playTone(freq, 0.25, 'sine', 0.1), i * 200);
  });
}

export function playClick() {
  playTone(1200, 0.05, 'square', 0.04);
}

function playTone(
  freq: number,
  duration: number,
  type: OscillatorType,
  volume: number,
) {
  if (isMuted) return;
  const ctx = getCtx();
  if (!masterGain) return;

  const osc = ctx.createOscillator();
  osc.type = type;
  osc.frequency.value = freq;
  const gain = ctx.createGain();
  gain.gain.setValueAtTime(volume, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
  osc.connect(gain).connect(masterGain);
  osc.start(ctx.currentTime);
  osc.stop(ctx.currentTime + duration + 0.05);
}

export function toggleMute() {
  isMuted = !isMuted;
  if (masterGain) {
    masterGain.gain.value = isMuted ? 0 : 0.3;
  }
  return isMuted;
}
