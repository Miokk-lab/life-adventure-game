import type { DailyTask, WorryCategory } from '../types';

interface TaskTemplate { type: string; descriptions: string[]; targets: number[]; rewards: DailyTask['reward'][] }

const TASK_POOL: Record<string, TaskTemplate> = {
  breathing: {
    type: 'breathing',
    descriptions: [
      '闭上眼睛，跟随呼吸节奏完成4-7-8呼吸法3次循环。',
      '找一个安静角落，闭上眼睛只聆听周围的5种声音。',
      '去海边的礁石上，听完三首海浪的歌。',
      '坐在树下，感受风吹过树叶的节奏，深呼吸10次。',
      '找到一棵大树，靠着它做5分钟正念呼吸。',
      '点燃一支香薰蜡烛，盯着火焰做3分钟深呼吸。',
      '仰望夜空，找到三颗最亮的星星，每颗星星深呼吸一次。',
      '泡一杯热茶，感受蒸汽的温暖，慢慢呼吸3分钟。',
    ],
    targets: [3, 5, 3, 10, 5, 3, 3, 3],
    rewards: [
      { mpBonus: 2, coins: 10, exp: 15 }, { mpBonus: 3, coins: 15, exp: 20 },
      { mpBonus: 2, coins: 10, exp: 15 }, { mpBonus: 3, coins: 15, exp: 20 },
      { mpBonus: 2, coins: 10, exp: 15 }, { mpBonus: 1, coins: 10, exp: 10 },
      { mpBonus: 2, coins: 10, exp: 15 }, { mpBonus: 1, coins: 10, exp: 15 },
    ],
  },
  sorting: {
    type: 'sorting',
    descriptions: [
      '找出3件你无法控制的事写在落叶上，让风吹走它们。',
      '把今天困扰你的事情分成"能做的"和"不能做的"两类。',
      '找出3个不合理的自动化思维，用理性回应它们。',
      '把烦恼写在云朵上，把它们推到"能改变"和"不能改变"的篮子里。',
      '列出3个最近让你焦虑的想法，逐一分析它们是否真实。',
      '用CBT三分法：把每个负面念头归为"事实"、"假设"、"恐惧"。',
      '写下今天出现的3个负面自动化思维(ANTs)，给每个起个名字。',
      '把脑海中飘过的杂念写下来，分类放入三个抽屉：过去/现在/未来。',
    ],
    targets: [3, 2, 3, 2, 3, 3, 3, 3],
    rewards: [
      { coins: 10, exp: 15 }, { coins: 15, exp: 20 }, { coins: 10, exp: 15 },
      { coins: 10, exp: 15 }, { coins: 15, exp: 20 }, { coins: 10, exp: 15 },
      { coins: 10, exp: 15 }, { coins: 10, exp: 15 },
    ],
  },
  writing: {
    type: 'writing',
    descriptions: [
      '给你的心魔写一封简短的信："我看到了你，但我不再害怕你。"',
      '在纸上写下今天最让你感到平静的3个瞬间。',
      '给你最信任的人写一张感谢卡（写下来就好，不用真的寄出）。',
      '记录下今天的一个小小的"胜利"，哪怕只是按时起床。',
      '给自己写一封来自未来的信，告诉自己一切都会好起来。',
      '写下3件你今天学到的关于自己的新认识。',
      '用3句话描述你现在的心情，像给一个老朋友写信那样。',
      '写下一件你一直在逃避的事，然后写出你可以做的第一步。',
    ],
    targets: [1, 3, 1, 1, 1, 3, 3, 1],
    rewards: [
      { coins: 10, exp: 20 }, { coins: 15, exp: 15 }, { coins: 15, exp: 25 },
      { coins: 10, exp: 15 }, { coins: 15, exp: 20 }, { coins: 10, exp: 15 },
      { coins: 10, exp: 15 }, { coins: 20, exp: 25 },
    ],
  },
  action: {
    type: 'action',
    descriptions: [
      '站起来，给自己倒一杯水，慢慢地一口一口喝完它。',
      '完成一项你拖延了超过一周的小任务（哪怕只需要5分钟）。',
      '走出家门（或打开窗户），深呼吸外面的空气30秒。',
      '整理你的书桌或床头柜——只整理一个角落就够了。',
      '站起来伸展身体，做5个深蹲或10秒平板支撑。',
      '给一颗植物浇水，或者给宠物添食换水。',
      '把手机调成勿扰模式，专注做一件事15分钟。',
      '清理你的手机相册，删除10张不需要的截图。',
    ],
    targets: [5, 1, 30, 1, 5, 1, 15, 10],
    rewards: [
      { coins: 20, exp: 25 }, { coins: 25, exp: 30 }, { coins: 10, exp: 15 },
      { coins: 15, exp: 20 }, { coins: 15, exp: 20 }, { coins: 10, exp: 15 },
      { coins: 20, exp: 25 }, { coins: 15, exp: 20 },
    ],
  },
  gratitude: {
    type: 'gratitude',
    descriptions: [
      '在沙滩上写下3个你感谢的人的名字（在心里写也可以）。',
      '对镜子里的自己说一句真诚的鼓励的话。',
      '想一想今天有没有什么小事让你感到温暖？记录下来。',
      '列出3件你平时视为理所当然但实际上值得感恩的事。',
      '给你身边的一个人送上一句赞美（当面说或发消息）。',
      '闭上眼睛，回忆一个让你感到幸福的画面，停留30秒。',
      '写下过去一年中3个你最感激的变化或成长。',
      '对今天帮助过你的一个人在心里说一声"谢谢"。',
    ],
    targets: [3, 1, 1, 3, 1, 1, 3, 1],
    rewards: [
      { coins: 10, exp: 15 }, { coins: 5, exp: 10 }, { coins: 10, exp: 15 },
      { coins: 15, exp: 20 }, { coins: 10, exp: 15 }, { coins: 5, exp: 10 },
      { coins: 15, exp: 20 }, { coins: 10, exp: 15 },
    ],
  },
  movement: {
    type: 'movement',
    descriptions: [
      '站起来，从头顶到脚趾慢慢活动每一个关节，感受身体。',
      '走出去散步5分钟，注意脚底接触地面的感觉。',
      '找一个舒服的姿势，做一次从头到脚的"身体扫描"。',
      '跟着音乐轻轻摇摆身体3分钟，不需要任何舞蹈技巧。',
      '做10次缓慢的肩颈转动，释放积累的紧张。',
      '找到一个能看到天空的地方，抬头望天60秒。',
      '双手交叉抱住自己，给自己一个持续30秒的拥抱。',
      '在房间里来回踱步，每一步都感受脚跟→脚掌→脚趾的触感。',
    ],
    targets: [1, 5, 1, 3, 10, 60, 30, 20],
    rewards: [
      { mpBonus: 3, coins: 10, exp: 15 }, { mpBonus: 2, coins: 15, exp: 20 },
      { mpBonus: 4, coins: 10, exp: 15 }, { mpBonus: 2, coins: 10, exp: 15 },
      { mpBonus: 2, coins: 10, exp: 15 }, { mpBonus: 1, coins: 5, exp: 10 },
      { mpBonus: 3, coins: 10, exp: 15 }, { mpBonus: 2, coins: 10, exp: 15 },
    ],
  },
};

const TYPE_KEYS = Object.keys(TASK_POOL);

function getDateSeed(): number {
  const d = new Date();
  return d.getFullYear() * 10000 + (d.getMonth() + 1) * 100 + d.getDate();
}

function seededRandom(seed: number): () => number {
  let s = seed;
  return () => { s = (s * 16807 + 0) % 2147483647; return (s - 1) / 2147483646; };
}

export function generateDailyTasks(_worryType: WorryCategory, _chapter: number): DailyTask[] {
  const seed = getDateSeed();
  const rand = seededRandom(seed);
  // Pick 3-5 DIFFERENT task types (no duplicates)
  const count = 3 + Math.floor(rand() * 3); // 3, 4, or 5
  const shuffled = [...TYPE_KEYS].sort(() => rand() - 0.5);
  const selectedTypes = shuffled.slice(0, count);

  return selectedTypes.map((typeKey, i) => {
    const tmpl = TASK_POOL[typeKey];
    const descIdx = Math.floor(rand() * tmpl.descriptions.length);
    return {
      id: `task_${seed}_${i}`,
      type: tmpl.type,
      description: tmpl.descriptions[descIdx],
      progress: 0,
      target: tmpl.targets[descIdx],
      completed: false,
      reward: { ...tmpl.rewards[descIdx] },
    };
  });
}
