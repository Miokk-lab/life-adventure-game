import type { BattleSkill, BattleActor, MonsterData } from '../types';

export interface DamageResult {
  damage: number;
  heal: number;
  effectType: BattleSkill['effectType'];
  effectValue: number;
  description: string;
}

export function calculateSkillDamage(
  skill: BattleSkill,
  hero: BattleActor,
  monster: BattleActor,
  chapter: number,
): DamageResult {
  const chapterMultiplier = 1 + (chapter - 1) * 0.5; // Lv1=1x, Lv2=1.5x, Lv3=2x
  const variance = 0.85 + Math.random() * 0.3; // 0.85–1.15

  const damage = Math.round(skill.damage * chapterMultiplier * variance);
  const heal = Math.round(skill.healAmount * chapterMultiplier * variance);

  return {
    damage,
    heal,
    effectType: skill.effectType,
    effectValue: skill.effectValue,
    description: skill.description,
  };
}

export function calculateEnemyDamage(
  monster: MonsterData,
  turn: number,
  difficulty = 3,
): { damage: number; attackName: string } {
  const baseDmg = 5 + difficulty * 2 + turn;
  const variance = Math.floor(Math.random() * (difficulty + 5));
  const damage = baseDmg + variance;

  const attacks = monster.attacks && monster.attacks.length > 0
    ? monster.attacks
    : ['暗影攻击', '负面能量', '焦虑冲击'];
  const attackName = attacks[Math.floor(Math.random() * attacks.length)];

  return { damage, attackName };
}

export function rollDodge(heroLevel: number): boolean {
  const dodgeChance = Math.min(0.35, 0.2 + heroLevel * 0.03);
  return Math.random() < dodgeChance;
}

export function getChapterFromExp(exp: number): number {
  if (exp >= 200) return 3;
  if (exp >= 100) return 2;
  return 1;
}

export function getExpForNextChapter(chapter: number): number {
  if (chapter >= 3) return 0;
  return chapter * 100;
}

export function shouldTriggerScriptedLoss(
  isFirstBattle: boolean,
  turn: number,
  heroHp: number,
): boolean {
  return isFirstBattle && turn >= 3 && heroHp <= 0;
}
