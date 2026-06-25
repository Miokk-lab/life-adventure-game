import type { DailyTask, WorryCategory } from '../types';

const TASK_TEMPLATES: Record<string, { type: string; descriptions: string[]; targets: number[]; rewards: DailyTask['reward'][] }> = {
  breathing: {
    type: 'breathing',
    descriptions: [
      '去海边的礁石上，听完三首海浪的歌。',
      '闭上眼睛，感受风吹过树叶的节奏。',
      '找到一棵大树，靠着它深呼吸10次。',
      '坐在篝火旁，数一数夜空中最亮的三颗星。',
    ],
    targets: [3, 5, 3, 5],
    rewards: [
      { mpBonus: 2, coins: 10, exp: 15 },
      { mpBonus: 3, coins: 15, exp: 20 },
      { mpBonus: 2, coins: 10, exp: 15 },
      { mpBonus: 3, coins: 15, exp: 20 },
    ],
  },
  sorting: {
    type: 'sorting',
    descriptions: [
      '找出3件你无法控制的事，轻轻放在一边。',
      '找出3件你能控制的事，把它们写在叶子上。',
      '把焦虑的事情分成"现在可以做的"和"现在无法做的"。',
      '用一个罐子装起所有烦恼，观察它们，但不必打开。',
    ],
    targets: [3, 3, 5, 1],
    rewards: [
      { coins: 10, exp: 15 },
      { coins: 15, exp: 20 },
      { coins: 10, exp: 15 },
      { coins: 10, exp: 10 },
    ],
  },
  writing: {
    type: 'writing',
    descriptions: [
      '给你的心魔写一封信："我看到你了…"。',
      '在树叶上写下今天最感恩的三件事。',
      '记录下今天一个让你感到平静的瞬间。',
      '给你最信任的动物伙伴写一张问候卡。',
    ],
    targets: [1, 3, 1, 1],
    rewards: [
      { coins: 10, exp: 20 },
      { coins: 15, exp: 15 },
      { coins: 10, exp: 15 },
      { coins: 5, exp: 10 },
    ],
  },
  action: {
    type: 'action',
    descriptions: [
      '完成一项你一直在拖延的小任务（哪怕只有5分钟）。',
      '走出家门，步行到最近的一棵树下。',
      '整理你的一个抽屉或书架的一小格。',
      '给一个很久没联系但你想念的朋友发一条简短消息。',
    ],
    targets: [1, 1, 1, 1],
    rewards: [
      { coins: 20, exp: 25 },
      { coins: 15, exp: 20 },
      { coins: 15, exp: 20 },
      { coins: 25, exp: 30 },
    ],
  },
  gratitude: {
    type: 'gratitude',
    descriptions: [
      '在沙滩上写下三个你感谢的人的名字。',
      '对镜子里的自己说一句鼓励的话。',
      '给你身边的一个人送上一朵小花（真实或想象）。',
      '想一想，今天有没有什么事让你笑了？',
    ],
    targets: [3, 1, 1, 1],
    rewards: [
      { coins: 10, exp: 15 },
      { coins: 5, exp: 10 },
      { coins: 15, exp: 20 },
      { coins: 5, exp: 10 },
    ],
  },
  movement: {
    type: 'movement',
    descriptions: [
      '站起来，伸展你的手臂和肩膀。',
      '做5分钟的慢走，感受脚底与地面的接触。',
      '跟着海浪的节奏，轻轻摇摆身体。',
      '找到一个舒适的姿势，从头到脚放松每一块肌肉。',
    ],
    targets: [1, 5, 3, 1],
    rewards: [
      { mpBonus: 3, coins: 10, exp: 15 },
      { mpBonus: 2, coins: 15, exp: 20 },
      { mpBonus: 2, coins: 10, exp: 15 },
      { mpBonus: 4, coins: 10, exp: 15 },
    ],
  },
};

const TYPE_KEYS = Object.keys(TASK_TEMPLATES);

export function generateDailyTasks(_worryType: WorryCategory, _chapter: number): DailyTask[] {
  // Shuffle and pick 6 tasks
  const shuffled = [...TYPE_KEYS].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, 6).map((key, i) => {
    const tmpl = TASK_TEMPLATES[key];
    const descIdx = i % tmpl.descriptions.length;
    return {
      id: `task_${Date.now()}_${i}`,
      type: tmpl.type,
      description: tmpl.descriptions[descIdx],
      progress: 0,
      target: tmpl.targets[descIdx],
      completed: false,
      reward: { ...tmpl.rewards[descIdx] },
    };
  });
}
