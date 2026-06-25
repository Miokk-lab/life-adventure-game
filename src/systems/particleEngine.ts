/**
 * Canvas particle system — adapted from ver4 useParticles.ts
 * Renders leaves, fire sparks, and lightning effects.
 */

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  size: number;
  color: string;
}

type ParticleLayer = 'leaf' | 'fire' | 'volt';

let canvas: HTMLCanvasElement | null = null;
let ctx: CanvasRenderingContext2D | null = null;
let animationId = 0;
const layers: Map<ParticleLayer, Particle[]> = new Map([
  ['leaf', []],
  ['fire', []],
  ['volt', []],
]);

const LAYER_COLORS: Record<ParticleLayer, string[]> = {
  leaf: ['#8cd64a', '#6fba2c', '#a8d870', '#c5e89d', '#5a9e1e'],
  fire: ['#ff6b6b', '#ff9f1c', '#ffbf00', '#e05a5a', '#f5c31c'],
  volt: ['#ffcc00', '#ffdd44', '#ffffff', '#f5c31c', '#ff9900'],
};

export function initParticleEngine(container: HTMLElement) {
  if (canvas) return;

  canvas = document.createElement('canvas');
  canvas.style.cssText = 'position:absolute;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:10;';
  canvas.width = container.offsetWidth;
  canvas.height = container.offsetHeight;
  container.style.position = 'relative';
  container.appendChild(canvas);
  ctx = canvas.getContext('2d');

  tick();
}

function tick() {
  if (!ctx || !canvas) return;
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  layers.forEach((particles, _layer) => {
    for (let i = particles.length - 1; i >= 0; i--) {
      const p = particles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.life--;

      const alpha = p.life / p.maxLife;
      ctx.globalAlpha = alpha;
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size * alpha, 0, Math.PI * 2);
      ctx.fill();

      if (p.life <= 0) {
        particles.splice(i, 1);
      }
    }
  });

  ctx.globalAlpha = 1;
  animationId = requestAnimationFrame(tick);
}

export function emitParticles(
  layer: ParticleLayer,
  x: number,
  y: number,
  count = 10,
) {
  const particles = layers.get(layer);
  if (!particles) return;

  const colors = LAYER_COLORS[layer];
  for (let i = 0; i < count; i++) {
    const angle = Math.random() * Math.PI * 2;
    const speed = 1 + Math.random() * 3;
    particles.push({
      x,
      y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed - 2,
      life: 30 + Math.random() * 30,
      maxLife: 60,
      size: 2 + Math.random() * 4,
      color: colors[Math.floor(Math.random() * colors.length)],
    });
  }
}

export function destroyParticleEngine() {
  cancelAnimationFrame(animationId);
  if (canvas) {
    canvas.remove();
    canvas = null;
    ctx = null;
  }
  layers.forEach((p) => { p.length = 0; });
}
