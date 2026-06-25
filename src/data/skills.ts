import type { BattleSkill, SkillAnimal } from '../types';

export const ANIMAL_LABELS: Record<SkillAnimal, { name: string; emoji: string; act: string }> = {
  turtle: { name: '乌龟', emoji: '🐢', act: '接纳' },
  sloth: { name: '树懒', emoji: '🦥', act: '正念' },
  tiger: { name: '老虎', emoji: '🐯', act: '行动' },
  snake: { name: '灵蛇', emoji: '🐍', act: '重构' },
};

export function makeSkill(
  id: string,
  animal: SkillAnimal,
  level: 1 | 2 | 3,
  name: string,
  description: string,
  mpCost: number,
  damage: number,
  healAmount: number,
  effectType: BattleSkill['effectType'],
  effectValue: number,
): BattleSkill {
  return { id, name, animal, level, description, mpCost, damage, healAmount, effectType, effectValue, iconItemPath: '' };
}

// ── Generic skill matrices — overridden per category ──

export const DEFAULT_SKILLS: BattleSkill[] = [
  // Turtle — Acceptance (接纳)
  makeSkill('turtle_l1', 'turtle', 1, '深呼吸接纳', '承认当下的不适感，允许它存在', 3, 0, 10, 'heal', 0),
  makeSkill('turtle_l2', 'turtle', 2, '正念观察', '以旁观者角度观察情绪，不评判', 8, 15, 0, 'debuff', 20),
  makeSkill('turtle_l3', 'turtle', 3, '完全接纳', '与烦恼和平共处，不再对抗', 12, 0, 30, 'shield', 50),

  // Sloth — Mindfulness (正念)
  makeSkill('sloth_l1', 'sloth', 1, '当下觉察', '停下来，感受此刻的呼吸与身体', 5, 8, 0, 'damage', 0),
  makeSkill('sloth_l2', 'sloth', 2, '身体扫描', '从头到脚扫描身体，释放紧张', 8, 12, 10, 'heal', 0),
  makeSkill('sloth_l3', 'sloth', 3, '慈悲关怀', '对自己发送善意与温暖', 12, 0, 25, 'buff', 30),

  // Tiger — Commitment (行动)
  makeSkill('tiger_l1', 'tiger', 1, '微小行动', '做一件小事，打破无力感', 6, 10, 0, 'damage', 0),
  makeSkill('tiger_l2', 'tiger', 2, '价值行动', '以核心价值为导向采取行动', 10, 18, 0, 'damage', 0),
  makeSkill('tiger_l3', 'tiger', 3, '承诺咆哮', '为你的价值观挺身而出', 16, 35, 0, 'damage', 50),

  // Snake — Cognitive Reframing (重构)
  makeSkill('snake_l1', 'snake', 1, '换框思考', '换个角度看问题', 6, 12, 0, 'damage', 0),
  makeSkill('snake_l2', 'snake', 2, '去灾难化', '最坏的结果真的会那么糟吗？', 10, 20, 0, 'debuff', 25),
  makeSkill('snake_l3', 'snake', 3, '智慧转化', '将痛苦经历化为成长的阶梯', 16, 30, 10, 'buff', 40),
];
