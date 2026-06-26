// ── Worry Categories ──
export type WorryCategory =
  | 'work_stress'
  | 'learning_growth'
  | 'interpersonal'
  | 'family_origin'
  | 'social_environment'
  | 'physical_health'
  | 'time_management'
  | 'emotion_management';

// ── Pages ──
export type GamePage =
  | 'login'
  | 'worry'
  | 'voyage'
  | 'analysis'
  | 'gamescreen'
  | 'battle'
  | 'tasks'
  | 'minigames'
  | 'teashop'
  | 'victory';

export type GamePhase =
  | 'idle'
  | 'input'
  | 'loading'
  | 'analysis'
  | 'battle'
  | 'task'
  | 'healing'
  | 'victory';

// ── User ──
export interface UserProfile {
  id: string;
  email: string;
  nickname: string;
  avatarUrl: string;
  islandName: string;
}

// ── Adventure / Prescription ──
export interface HeroData {
  name: string;
  story: string;
  imageUrl: string;
  skills: SkillRef[];
}

export interface MonsterData {
  name: string;
  story: string;
  attacks: string[];
  imageUrl: string;
}

export interface PrescriptionData {
  worryType: WorryCategory;
  hero: HeroData;
  monster: MonsterData;
  cbtAnalysis: string;
  victoryText: string;
  victoryVideoUrl: string;
}

// ── Skills ──
export type SkillAnimal = 'turtle' | 'sloth' | 'tiger' | 'snake' | 'eagle';
export type SkillLevel = 1 | 2 | 3;

export interface SkillRef {
  id: string;
  name: string;
  animal: SkillAnimal;
  level: SkillLevel;
  description: string;
}

export interface BattleSkill extends SkillRef {
  mpCost: number;
  damage: number;
  healAmount: number;
  effectType: 'damage' | 'heal' | 'buff' | 'debuff' | 'shield';
  effectValue: number;
  iconItemPath: string;
}

// ── Battle ──
export type BattlePhase = 'intro' | 'player-turn' | 'player-action' | 'enemy-turn' | 'victory' | 'defeat';

export interface BattleActor {
  name: string;
  hp: number;
  maxHp: number;
  mp: number;
  maxMp: number;
  imageUrl: string;
}

export interface BattleLogEntry {
  id: string;
  text: string;
  type: 'player-action' | 'enemy-action' | 'system' | 'narrative';
}

// ── Tasks ──
export interface DailyTask {
  id: string;
  type: string;
  description: string;
  progress: number;
  target: number;
  completed: boolean;
  reward: { mpBonus?: number; coins?: number; exp?: number };
}

// ── Teas ──
export interface TeaRecipe {
  id: string;
  name: string;
  cost: number;
  ingredients: number[]; // item ids
  staminaRestore: number;
  buffDescription: string;
}

// ── Mini Games ──
export interface MiniGameConfig {
  id: string;
  name: string;
  description: string;
  hpRestore: number;
  staminaCost: number;
}

// ── Collection ──
export interface Companion {
  animal: SkillAnimal;
  name: string;
  bondLevel: number; // 0–3
  unlocked: boolean;
}

export interface GalleryItem {
  id: string;
  type: 'hero' | 'monster' | 'letter';
  name: string;
  summary: string;
  unlockedAt: string;
}
