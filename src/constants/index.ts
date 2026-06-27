import type { GamePage, WorryCategory } from '../types';

export const PAGES: Record<GamePage, { title: string; subtitle: string }> = {
  login: { title: '登岛护照办理处', subtitle: '特急！心灵无人岛移居护照办理处' },
  worry: { title: '漂流瓶的烦恼信', subtitle: '写给大海的漂流瓶信笺' },
  voyage: { title: '迷雾航线中…', subtitle: '航向未知：航平的小船与突袭的黑雾' },
  analysis: { title: '岛屿心理档案室', subtitle: '傅达的岛屿心理特展厅' },
  gamescreen: { title: '心灵岛屿', subtitle: '你的心灵冒险' },
  battle: { title: '心灵守护大作战', subtitle: '无人岛广场的心灵大扫除' },
  tasks: { title: '拓荒日志与成长主页', subtitle: '集里游+：岛屿日常治愈日志' },
  minigames: { title: '静心小憩营地', subtitle: '星空下的露营篝火' },
  teashop: { title: '狸克花果特调茶饮店', subtitle: '鸽子巢咖啡馆分店' },
  victory: { title: '心灵雨过天晴', subtitle: '丰收祭：彩虹奇迹广场' },
  help: { title: '新手指南', subtitle: '帮助中心 · 找到你需要的答案' },
};

export const WORRY_CATEGORIES: { key: WorryCategory; label: string; emoji: string; color: string }[] = [
  { key: 'work_stress', label: '工作压力', emoji: '💼', color: '#889df0' },
  { key: 'learning_growth', label: '学习成长', emoji: '📚', color: '#b77dee' },
  { key: 'interpersonal', label: '人际关系', emoji: '💝', color: '#f8a6b2' },
  { key: 'family_origin', label: '原生家庭', emoji: '🏠', color: '#82d5bb' },
  { key: 'social_environment', label: '社会环境', emoji: '🌍', color: '#f7cd67' },
  { key: 'physical_health', label: '身体健康', emoji: '💪', color: '#e59266' },
  { key: 'time_management', label: '时间管理', emoji: '⏰', color: '#8ac68a' },
  { key: 'emotion_management', label: '情绪管理', emoji: '🌈', color: '#fc736d' },
];

export const MAX_WORRY_LENGTH = 500;
export const POLL_INTERVAL_MS = 2000;
export const POLL_TIMEOUT_MS = 30000;
export const INITIAL_HP = 100;
export const INITIAL_MP = 100;
export const INITIAL_STAMINA = 100;
export const INITIAL_COINS = 50;
export const MAX_CHAPTER = 3;
export const EXP_L1 = 50;
export const EXP_L2 = 100;
export const EXP_L3 = 200;
export const TASK_MP_RESTORE = 20;
export const TASK_EXP = 30;
export const TASK_COINS = 20;
export const TASK_STAMINA_COST = 20;
export const MINIGAME_HP_RESTORE = 20;
export const MINIGAME_EXP = 30;
export const MINIGAME_COINS = 20;
export const MINIGAME_STAMINA_COST = 20;
export const BATTLE_STAMINA_COST = 30;
export const BATTLE_VICTORY_EXP = 50;
export const BATTLE_VICTORY_COINS = 50;
