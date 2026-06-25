import { useState } from 'react';
import { useGameStore } from '../../stores/useGameStore';
import { useAdventureStore } from '../../stores/useAdventureStore';
import { Button, Card, Modal, Footer } from 'animal-island-ui';
import { motion } from 'motion/react';
import GameLayout from '../shared/GameLayout';
import ItemGrid from '../shared/ItemGrid';

// Placeholder item IDs — will be replaced with actual animal-island-ui item mapping
const INGREDIENT_SPRITES = [
  { id: 'peach', src: '', label: '🍑 桃子' },
  { id: 'orange', src: '', label: '🍊 橙子' },
  { id: 'cherry', src: '', label: '🍒 樱桃' },
  { id: 'apple', src: '', label: '🍎 苹果' },
  { id: 'rose', src: '', label: '🌹 玫瑰' },
  { id: 'tulip', src: '', label: '🌷 郁金香' },
  { id: 'cosmos', src: '', label: '🌸 波斯菊' },
  { id: 'lily', src: '', label: '🪷 百合' },
];

interface TeaRecipe {
  id: string;
  name: string;
  emoji: string;
  cost: number;
  staminaRestore: number;
  buffDescription: string;
  ingredients: string[];
}

const TEA_RECIPES: TeaRecipe[] = [
  {
    id: 'mint-chamomile',
    name: '薄荷洋甘菊茶',
    emoji: '🍵',
    cost: 30,
    staminaRestore: 30,
    buffDescription: '清凉舒缓，缓解焦虑',
    ingredients: ['peach', 'rose'],
  },
  {
    id: 'peach-oolong',
    name: '桃桃乌龙果粒茶',
    emoji: '🧋',
    cost: 80,
    staminaRestore: 60,
    buffDescription: '果香四溢，恢复元气',
    ingredients: ['peach', 'orange', 'tulip'],
  },
  {
    id: 'aurora-lavender',
    name: '星空极光薰衣草茶',
    emoji: '✨',
    cost: 150,
    staminaRestore: 120,
    buffDescription: '体力满值 + 暴击Buff',
    ingredients: ['cherry', 'apple', 'cosmos', 'lily'],
  },
];

export default function TeaShopPage() {
  const navigateTo = useGameStore((s) => s.navigateTo);
  const spendCoins = useAdventureStore((s) => s.spendCoins);
  const restoreStamina = useAdventureStore((s) => s.restoreStamina);
  const coins = useAdventureStore((s) => s.coins);

  const [selectedRecipe, setSelectedRecipe] = useState<TeaRecipe | null>(null);
  const [brewingSlots, setBrewingSlots] = useState<(string | null)[]>([null, null, null, null]);
  const [brewed, setBrewed] = useState<TeaRecipe | null>(null);

  const handleSelectRecipe = (recipe: TeaRecipe) => {
    if (coins < recipe.cost) return;
    setSelectedRecipe(recipe);
    setBrewingSlots(new Array(recipe.ingredients.length).fill(null));
  };

  const handleAddIngredient = (ingredientId: string) => {
    const slotIndex = brewingSlots.findIndex((s) => s === null);
    if (slotIndex === -1) return;
    const newSlots = [...brewingSlots];
    newSlots[slotIndex] = ingredientId;
    setBrewingSlots(newSlots);
  };

  const handleBrew = () => {
    if (!selectedRecipe) return;
    const allFilled = brewingSlots.every((s) => s !== null);
    if (!allFilled) return;

    spendCoins(selectedRecipe.cost);
    restoreStamina(selectedRecipe.staminaRestore);
    setBrewed(selectedRecipe);
    setSelectedRecipe(null);
    setBrewingSlots([null, null, null, null]);
  };

  const filledSlots = brewingSlots.filter((s) => s !== null).length;
  const totalSlots = selectedRecipe?.ingredients.length ?? 0;

  return (
    <GameLayout showHUD>
      <div className="max-w-2xl mx-auto">
        {/* The Roost header */}
        <div
          className="text-center mb-8 p-6 rounded-3xl"
          style={{
            background: 'linear-gradient(180deg, #3e2723, #5d4037, #4e342e)',
            border: '3px solid #8d6e63',
          }}
        >
          <div className="text-5xl mb-3">🕊️☕</div>
          <h2 className="text-2xl font-black mb-2" style={{ color: '#f8f8f0', textShadow: '0 2px 4px rgba(0,0,0,0.3)' }}>
            鸽子巢咖啡馆分店
          </h2>
          <p className="text-sm" style={{ color: '#a1887f' }}>
            老板老板为你冲泡一杯暖心花茶… (余额: {coins} 🪙)
          </p>
        </div>

        {/* Tea menu */}
        <h3 className="text-sm font-extrabold mb-3" style={{ color: '#725d42' }}>
          📋 今日特调
        </h3>
        <div className="space-y-3 mb-8">
          {TEA_RECIPES.map((recipe) => (
            <motion.div key={recipe.id} whileHover={{ scale: 1.01 }}>
              <Card
                color={selectedRecipe?.id === recipe.id ? 'app-teal' : 'warm-peach-pink'}
                className="cursor-pointer"
                onClick={() => handleSelectRecipe(recipe)}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-2xl mr-2">{recipe.emoji}</span>
                    <span className="font-extrabold text-sm" style={{ color: '#725d42' }}>
                      {recipe.name}
                    </span>
                    <p className="text-xs mt-1" style={{ color: '#9f927d' }}>
                      {recipe.buffDescription}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="font-extrabold text-sm" style={{ color: '#b3a046' }}>
                      🪙 {recipe.cost}
                    </div>
                    <div className="text-xs font-bold" style={{ color: '#6fba2c' }}>
                      💚 +{recipe.staminaRestore}
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Brewing table */}
        {selectedRecipe && (
          <Card color="app-yellow" className="mb-6">
            <h3 className="font-extrabold text-sm mb-3" style={{ color: '#725d42' }}>
              🧪 调配台 — {selectedRecipe.name}
            </h3>

            {/* Ingredient shelf */}
            <h4 className="text-xs font-bold mb-2" style={{ color: '#9f927d' }}>
              食材架 (点击添加)
            </h4>
            <div className="flex flex-wrap gap-2 mb-4">
              {INGREDIENT_SPRITES.map((ing) => (
                <motion.button
                  key={ing.id}
                  whileHover={{ scale: 1.15, y: -4 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => handleAddIngredient(ing.id)}
                  disabled={brewingSlots.every((s) => s !== null)}
                  className="p-2 rounded-xl border-2 bg-white/70 cursor-pointer disabled:opacity-30"
                  style={{ borderColor: '#e8e2d6' }}
                >
                  <span className="text-2xl">{ing.label.slice(0, 2)}</span>
                  <div className="text-[10px] font-semibold" style={{ color: '#725d42' }}>
                    {ing.label.slice(3)}
                  </div>
                </motion.button>
              ))}
            </div>

            {/* Brewing slots */}
            <h4 className="text-xs font-bold mb-2" style={{ color: '#9f927d' }}>
              茶壶 ({filledSlots}/{totalSlots})
            </h4>
            <div className="flex gap-2 mb-4">
              {brewingSlots.map((slot, i) => (
                <div
                  key={i}
                  className="w-16 h-16 rounded-2xl border-2 border-dashed flex items-center justify-center text-2xl"
                  style={{
                    borderColor: slot ? '#19c8b9' : '#e8dcc8',
                    background: slot ? '#e6f9f6' : '#faf8f2',
                  }}
                >
                  {slot ? INGREDIENT_SPRITES.find((ing) => ing.id === slot)?.label.slice(0, 2) ?? '?' : '🫗'}
                </div>
              ))}
            </div>

            <div className="flex gap-3">
              <Button
                type="primary"
                size="large"
                block
                disabled={filledSlots < totalSlots}
                onClick={handleBrew}
              >
                🥄 搅拌！开始冲泡
              </Button>
              <Button type="default" onClick={() => {
                setSelectedRecipe(null);
                setBrewingSlots([null, null, null, null]);
              }}>
                取消
              </Button>
            </div>
          </Card>
        )}

        {/* Navigation */}
        <div className="flex gap-3 justify-center mb-8">
          <Button type="default" onClick={() => navigateTo('tasks')}>
            📋 返回任务
          </Button>
          <Button type="default" onClick={() => navigateTo('minigames')}>
            🏕️ 静心营地
          </Button>
          <Button type="primary" onClick={() => navigateTo('battle')}>
            ⚔️ 回去战斗
          </Button>
        </div>

        <Footer type="tree" />
      </div>

      {/* Brewed tea reveal */}
      <Modal
        open={brewed !== null}
        title="☕ 花茶泡好了！"
        footer={null}
        onClose={() => setBrewed(null)}
      >
        <div className="text-center py-4">
          <motion.div
            className="text-6xl mb-4"
            animate={{ scale: [1, 1.3, 1], rotate: [0, -5, 5, 0] }}
          >
            {brewed?.emoji ?? '🍵'}
          </motion.div>
          <p className="text-lg font-extrabold mb-2" style={{ color: '#725d42' }}>
            {brewed?.name}
          </p>
          <p className="text-sm mb-4" style={{ color: '#9f927d' }}>
            {brewed?.buffDescription}
          </p>
          <p className="text-lg font-bold" style={{ color: '#6fba2c' }}>
            💚 体力 +{brewed?.staminaRestore}
          </p>
          <div className="mt-4">
            <Button type="primary" onClick={() => setBrewed(null)}>
              品尝完毕
            </Button>
          </div>
        </div>
      </Modal>
    </GameLayout>
  );
}
