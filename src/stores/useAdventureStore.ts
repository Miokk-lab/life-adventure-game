import { create } from 'zustand';
import type { HeroData, MonsterData, Companion, GalleryItem, DailyTask } from '../types';
import { INITIAL_STAMINA, INITIAL_COINS, INITIAL_HP, INITIAL_MP } from '../constants';

interface AdventureState {
  adventureId: string | null;
  hero: HeroData | null;
  monster: MonsterData | null;
  cbtAnalysis: string | null;
  victoryText: string | null;
  victoryVideoUrl: string | null;

  hp: number;
  maxHp: number;
  mp: number;
  maxMp: number;
  stamina: number;
  maxStamina: number;
  coins: number;
  exp: number;
  chapter: number;

  tasks: DailyTask[];
  battleSkills: import('../types').BattleSkill[];
  collection: string[];
  companions: Companion[];
  gallery: GalleryItem[];
  weeklyProgress: {
    weekStartDate: string;
    tasksCompletedThisWeek: number;
    weeklyTarget: number;
    shellsEarnedThisWeek: number;
    weeklyBonusClaimed: boolean;
  };

  setAdventureData: (data: {
    adventureId?: string;
    hero: HeroData;
    monster: MonsterData;
    cbtAnalysis: string;
    victoryText: string;
    victoryVideoUrl: string;
    battleSkills?: import('../types').BattleSkill[];
  }) => void;
  setTasks: (tasks: DailyTask[]) => void;
  completeTask: (taskId: string) => void;
  updateHp: (delta: number) => void;
  updateMp: (delta: number) => void;
  restoreHp: (amount: number) => void;
  consumeStamina: (amount: number) => void;
  restoreStamina: (amount: number) => void;
  addCoins: (amount: number) => void;
  spendCoins: (amount: number) => boolean;
  addExp: (amount: number) => void;
  setChapter: (ch: number) => void;
  addToCollection: (itemId: string) => void;
  updateCompanionBond: (animal: Companion['animal'], delta: number) => void;
  incrementWeeklyTask: () => void;
  reset: () => void;
}

const initialState = {
  adventureId: null,
  hero: null,
  monster: null,
  cbtAnalysis: null,
  victoryText: null,
  victoryVideoUrl: null,
  hp: INITIAL_HP,
  maxHp: INITIAL_HP,
  mp: INITIAL_MP,
  maxMp: INITIAL_MP,
  stamina: INITIAL_STAMINA,
  maxStamina: INITIAL_STAMINA,
  coins: INITIAL_COINS,
  exp: 0,
  chapter: 1,
  tasks: [],
  battleSkills: [],
  collection: [],
  companions: [],
  gallery: [],
  weeklyProgress: {
    weekStartDate: new Date().toISOString().split('T')[0],
    tasksCompletedThisWeek: 0,
    weeklyTarget: 7,
    shellsEarnedThisWeek: 0,
    weeklyBonusClaimed: false,
  },
};

export const useAdventureStore = create<AdventureState>((set, get) => ({
  ...initialState,

  setAdventureData: (data) =>
    set({
      adventureId: data.adventureId ?? get().adventureId,
      hero: data.hero,
      monster: data.monster,
      cbtAnalysis: data.cbtAnalysis,
      victoryText: data.victoryText,
      victoryVideoUrl: data.victoryVideoUrl,
      battleSkills: data.battleSkills ?? [],
    }),

  setTasks: (tasks) => set({ tasks }),

  completeTask: (taskId) =>
    set((s) => {
      const task = s.tasks.find((t) => t.id === taskId);
      if (!task || task.completed || s.stamina < 10) return s;
      const reward = task.reward;
      return {
        tasks: s.tasks.map((t) => (t.id === taskId ? { ...t, completed: true, progress: t.target } : t)),
        exp: s.exp + (reward.exp ?? 0),
        coins: s.coins + 20,
        mp: Math.min(s.maxMp, s.mp + 5),
        stamina: s.stamina - 10,
      };
    }),

  updateHp: (delta) =>
    set((s) => ({ hp: Math.max(0, Math.min(s.maxHp, s.hp + delta)) })),

  updateMp: (delta) =>
    set((s) => ({ mp: Math.max(0, Math.min(s.maxMp, s.mp + delta)) })),

  restoreHp: (amount) =>
    set((s) => ({ hp: Math.min(s.maxHp, s.hp + amount) })),

  consumeStamina: (amount) =>
    set((s) => ({ stamina: Math.max(0, s.stamina - amount) })),

  restoreStamina: (amount) =>
    set((s) => ({ stamina: Math.min(s.maxStamina, s.stamina + amount) })),

  addCoins: (amount) => set((s) => ({ coins: s.coins + amount })),

  spendCoins: (amount) => {
    const s = get();
    if (s.coins < amount) return false;
    set({ coins: s.coins - amount });
    return true;
  },

  addExp: (amount) =>
    set((s) => {
      const newExp = s.exp + amount;
      let chapter = s.chapter;
      if (newExp >= 200 && chapter < 3) chapter = 3;
      else if (newExp >= 100 && chapter < 2) chapter = 2;
      return { exp: newExp, chapter };
    }),

  setChapter: (ch) => set({ chapter: ch }),

  addToCollection: (itemId) =>
    set((s) => (s.collection.includes(itemId) ? s : { collection: [...s.collection, itemId] })),

  updateCompanionBond: (animal, delta) =>
    set((s) => ({
      companions: s.companions.map((c) =>
        c.animal === animal ? { ...c, bondLevel: Math.min(3, c.bondLevel + delta) } : c,
      ),
    })),

  incrementWeeklyTask: () =>
    set((s) => ({
      weeklyProgress: {
        ...s.weeklyProgress,
        tasksCompletedThisWeek: s.weeklyProgress.tasksCompletedThisWeek + 1,
        shellsEarnedThisWeek: s.weeklyProgress.shellsEarnedThisWeek + 5,
      },
    })),

  reset: () => set(initialState),
}));
