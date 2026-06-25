import type { TeaRecipe } from '../types';

// Animal-island-ui item sprite IDs (placeholder — identify actual IDs from library)
export const INGREDIENT_ITEMS = {
  peach: { id: 'peach', src: '', label: '🍑 桃子', itemPath: '' },
  orange: { id: 'orange', src: '', label: '🍊 橙子', itemPath: '' },
  cherry: { id: 'cherry', src: '', label: '🍒 樱桃', itemPath: '' },
  apple: { id: 'apple', src: '', label: '🍎 苹果', itemPath: '' },
  rose: { id: 'rose', src: '', label: '🌹 玫瑰', itemPath: '' },
  tulip: { id: 'tulip', src: '', label: '🌷 郁金香', itemPath: '' },
  cosmos: { id: 'cosmos', src: '', label: '🌸 波斯菊', itemPath: '' },
  lily: { id: 'lily', src: '', label: '🪷 百合', itemPath: '' },
};

export const TEA_RECIPES: TeaRecipe[] = [
  {
    id: 'mint-chamomile',
    name: '薄荷洋甘菊茶',
    cost: 30,
    ingredients: [1, 2], // placeholder item IDs
    staminaRestore: 30,
    buffDescription: '清凉舒缓，缓解焦虑。恢复体力30点。',
  },
  {
    id: 'peach-oolong',
    name: '桃桃乌龙果粒茶',
    cost: 80,
    ingredients: [1, 2, 3],
    staminaRestore: 60,
    buffDescription: '果香四溢，恢复元气。恢复体力60点。',
  },
  {
    id: 'aurora-lavender',
    name: '星空极光薰衣草茶',
    cost: 150,
    ingredients: [3, 4, 7, 8],
    staminaRestore: 120,
    buffDescription: '体力满值 + 本局对战暴击Buff。',
  },
];
