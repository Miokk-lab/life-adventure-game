import type { WorryCategory } from '../types';

export interface WorryTypeInfo {
  key: WorryCategory;
  label: string;
  emoji: string;
  color: string;
  stampLabel: string;
  heroPreview: string;
  monsterPreview: string;
}

export const worryTypeList: WorryTypeInfo[] = [
  {
    key: 'work_stress',
    label: '工作压力',
    emoji: '💼',
    color: '#889df0',
    stampLabel: '加班地狱',
    heroPreview: '松弛感熊猫「悠悠」',
    monsterPreview: '狂躁啄木鸟「笃笃魔」',
  },
  {
    key: 'learning_growth',
    label: '学习成长',
    emoji: '📚',
    color: '#b77dee',
    stampLabel: '内卷迷途',
    heroPreview: '求知猫头鹰「学学」',
    monsterPreview: '迷茫仓鼠「圈圈魔」',
  },
  {
    key: 'interpersonal',
    label: '人际关系',
    emoji: '💝',
    color: '#f8a6b2',
    stampLabel: '社交荆棘',
    heroPreview: '暖心卡皮巴拉「橘橘」',
    monsterPreview: '敏感刺猬「刺刺魔」',
  },
  {
    key: 'family_origin',
    label: '原生家庭',
    emoji: '🏠',
    color: '#82d5bb',
    stampLabel: '旧壳重负',
    heroPreview: '坚韧小鹿「铃风」',
    monsterPreview: '沉重寄居蟹「壳壳魔」',
  },
  {
    key: 'social_environment',
    label: '社会环境',
    emoji: '🌍',
    color: '#f7cd67',
    stampLabel: '迎合迷失',
    heroPreview: '真我树袋熊「棉棉」',
    monsterPreview: '虚荣变色龙「迷失魔」',
  },
  {
    key: 'physical_health',
    label: '身体健康',
    emoji: '💪',
    color: '#e59266',
    stampLabel: '熬夜透支',
    heroPreview: '活力海獭「滑板仔」',
    monsterPreview: '熬夜浣熊「黑眼魔」',
  },
  {
    key: 'time_management',
    label: '时间管理',
    emoji: '⏰',
    color: '#8ac68a',
    stampLabel: '瞎忙陷阱',
    heroPreview: '沉稳乌龟「日晷爷爷」',
    monsterPreview: '盲从工蚁「搬搬魔」',
  },
  {
    key: 'emotion_management',
    label: '情绪管理',
    emoji: '🌈',
    color: '#fc736d',
    stampLabel: '情绪风暴',
    heroPreview: '静谧树懒「禅禅」',
    monsterPreview: '暴躁河豚「气鼓魔」',
  },
];

export function getWorryInfo(key: WorryCategory): WorryTypeInfo {
  return worryTypeList.find(w => w.key === key) ?? worryTypeList[0];
}
