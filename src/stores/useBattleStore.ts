import { create } from 'zustand';
import type { BattleSkill, BattlePhase, BattleActor, BattleLogEntry } from '../types';
import { INITIAL_HP, INITIAL_MP } from '../constants';

let logId = 0;

interface BattleState {
  phase: BattlePhase;
  turn: number;
  isFirstBattle: boolean;
  hero: BattleActor;
  monster: BattleActor;
  availableSkills: BattleSkill[];
  selectedSkillId: string | null;
  log: BattleLogEntry[];
  lastHeroAction: { skillName: string; damage: number } | null;
  lastEnemyAction: { damage: number } | null;

  initBattle: (heroName: string, heroImg: string, monsterName: string, monsterImg: string, monsterMaxHp: number, skills: BattleSkill[], heroHp?: number, heroMp?: number) => void;
  selectSkill: (skillId: string) => void;
  executeTurn: (mpCost?: number) => void;
  advancePhase: () => void;
  forceNarrativeDefeat: () => void;
  resetBattle: () => void;
}

function addLog(
  log: BattleLogEntry[],
  text: string,
  type: BattleLogEntry['type'],
  key?: string,
  params?: Record<string, string | number>
): BattleLogEntry[] {
  return [...log, { id: String(++logId), text, type, key, params }];
}

export const useBattleStore = create<BattleState>((set, get) => ({
  phase: 'intro',
  turn: 0,
  isFirstBattle: true,
  hero: { name: '', hp: INITIAL_HP, maxHp: INITIAL_HP, mp: INITIAL_MP, maxMp: INITIAL_MP, imageUrl: '' },
  monster: { name: '', hp: 300, maxHp: 300, mp: 100, maxMp: 100, imageUrl: '' },
  availableSkills: [],
  selectedSkillId: null,
  log: [],
  lastHeroAction: null,
  lastEnemyAction: null,

  initBattle: (heroName, heroImg, monsterName, monsterImg, monsterMaxHp, skills, heroHp?, heroMp?) => {
    logId = 0;
    set({
      phase: 'player-turn',
      turn: 1,
      isFirstBattle: get().isFirstBattle,
      hero: { name: heroName, hp: heroHp ?? INITIAL_HP, maxHp: INITIAL_HP, mp: heroMp ?? INITIAL_MP, maxMp: INITIAL_MP, imageUrl: heroImg },
      monster: { name: monsterName, hp: monsterMaxHp, maxHp: monsterMaxHp, mp: 100, maxMp: 100, imageUrl: monsterImg },
      availableSkills: skills,
      selectedSkillId: null,
      log: addLog([], `⚔️ ${heroName} 与 ${monsterName} 的对决开始了！`, 'system', 'duelStart', { heroName, monsterName }),
      lastHeroAction: null,
      lastEnemyAction: null,
    });
  },

  selectSkill: (skillId) => set({ selectedSkillId: skillId }),

  executeTurn: (mpCost?: number) => {
    const s = get();
    if (s.phase !== 'player-turn' || !s.selectedSkillId) return;
    const skill = s.availableSkills.find((sk) => sk.id === s.selectedSkillId);
    const cost = mpCost ?? skill?.mpCost ?? 10;
    if (!skill || s.hero.mp < cost) return;

    // Player action — apply damage
    const newMp = s.hero.mp - cost;
    const newMonsterHp = Math.max(0, s.monster.hp - skill.damage);
    let newLog = addLog(
      s.log,
      `🦸 ${s.hero.name} 使用【${skill.name}】！造成 ${skill.damage} 点伤害`,
      'player-action',
      'playerUseSkill',
      { heroName: s.hero.name, skillName: skill.name, damage: skill.damage }
    );

    const updatedHero = { ...s.hero, mp: newMp };
    if (skill.healAmount > 0) {
      updatedHero.hp = Math.min(s.hero.maxHp, s.hero.hp + skill.healAmount);
      newLog = addLog(
        newLog,
        `💚 ${s.hero.name} 恢复了 ${skill.healAmount} 点生命`,
        'player-action',
        'playerHeal',
        { heroName: s.hero.name, healAmount: skill.healAmount }
      );
    }

    // Check monster defeat
    if (newMonsterHp <= 0) {
      set({
        hero: updatedHero,
        monster: { ...s.monster, hp: 0 },
        phase: 'victory',
        log: addLog(
          newLog,
          `🎉 ${s.monster.name} 被净化了！`,
          'system',
          'monsterPurified',
          { monsterName: s.monster.name }
        ),
        selectedSkillId: null,
        lastHeroAction: { skillName: skill.name, damage: skill.damage },
        lastEnemyAction: null,
      });
      return;
    }

    // Phase 1: hero attacked → show animation
    set({
      hero: updatedHero,
      monster: { ...s.monster, hp: newMonsterHp },
      phase: 'player-action',
      log: newLog,
      selectedSkillId: null,
      lastHeroAction: { skillName: skill.name, damage: skill.damage },
      lastEnemyAction: null,
      turn: s.turn,
    });

    // After 1.5s, monster attacks
    setTimeout(() => {
      const state = get();
      if (state.phase !== 'player-action') return;

      const baseDmg = 8 + state.turn * 2;
      const variance = Math.floor(Math.random() * 8);
      const enemyDmg = baseDmg + variance;
      const newHeroHp = Math.max(0, state.hero.hp - enemyDmg);
      let enemyLog = addLog(
        state.log,
        `👾 ${state.monster.name} 发起攻击！造成 ${enemyDmg} 点伤害`,
        'enemy-action',
        'enemyAttack',
        { monsterName: state.monster.name, damage: enemyDmg }
      );

      // Scripted defeat
      if (state.isFirstBattle && state.turn >= 3 && newHeroHp <= 0) {
        set({
          hero: { ...state.hero, hp: 0 },
          phase: 'defeat',
          log: enemyLog,
          lastHeroAction: null,
          lastEnemyAction: { damage: enemyDmg },
        });
        return;
      }

      if (newHeroHp <= 0) {
        set({
          hero: { ...state.hero, hp: 0 },
          phase: 'defeat',
          log: enemyLog,
          lastHeroAction: null,
          lastEnemyAction: { damage: enemyDmg },
        });
        return;
      }

      set({
        hero: { ...state.hero, hp: newHeroHp },
        phase: 'enemy-turn',
        log: enemyLog,
        lastHeroAction: null,
        lastEnemyAction: { damage: enemyDmg },
      });

      // After 1.5s, back to player turn
      setTimeout(() => {
        const s2 = get();
        if (s2.phase !== 'enemy-turn') return;
        set({ phase: 'player-turn', lastEnemyAction: null, turn: s2.turn + 1 });
      }, 1500);
    }, 1500);
  },

  advancePhase: () => {},
  forceNarrativeDefeat: () => {
    const s = get();
    set({
      hero: { ...s.hero, hp: 0, mp: 0 },
      phase: 'defeat',
      log: addLog(
        s.log,
        '💨 能量耗尽…需要在岛上积蓄力量再战！',
        'narrative',
        'energyDepleted'
      ),
    });
  },
  resetBattle: () => { logId = 0; set({ phase: 'intro', turn: 0, log: [], selectedSkillId: null, lastHeroAction: null, lastEnemyAction: null, isFirstBattle: false }); },
}));
