import { useState } from 'react';
import { useAdventureStore } from '../../stores/useAdventureStore';
import { Button, Card, Modal, Footer } from 'animal-island-ui';
import { motion } from 'motion/react';

const INGREDIENT_SPRITES = [
  { id: 'peach', label: '🍑 桃子' },
  { id: 'orange', label: '🍊 橙子' },
  { id: 'cherry', label: '🍒 樱桃' },
  { id: 'apple', label: '🍎 苹果' },
  { id: 'rose', label: '🌹 玫瑰' },
  { id: 'tulip', label: '🌷 郁金香' },
  { id: 'cosmos', label: '🌸 波斯菊' },
  { id: 'lily', label: '🪷 百合' },
];

interface TeaRecipe {
  id: string; name: string; emoji: string; cost: number; staminaRestore: number;
  buffDescription: string; ingredientCount: number;
}

const TEA_RECIPES: TeaRecipe[] = [
  { id: 'mint', name: '薄荷洋甘菊茶', emoji: '🍵', cost: 30, staminaRestore: 30, buffDescription: '清凉舒缓，缓解焦虑', ingredientCount: 2 },
  { id: 'peach', name: '桃桃乌龙果粒茶', emoji: '🧋', cost: 80, staminaRestore: 60, buffDescription: '果香四溢，恢复元气', ingredientCount: 3 },
  { id: 'aurora', name: '星空极光薰衣草茶', emoji: '✨', cost: 150, staminaRestore: 120, buffDescription: '体力满值+暴击Buff', ingredientCount: 4 },
];

export default function TeaShopPage() {
  const spendCoins = useAdventureStore((s) => s.spendCoins);
  const restoreStamina = useAdventureStore((s) => s.restoreStamina);
  const coins = useAdventureStore((s) => s.coins);

  const [selectedRecipe, setSelectedRecipe] = useState<TeaRecipe | null>(null);
  const [brewingSlots, setBrewingSlots] = useState<(string | null)[]>([null, null, null, null]);
  const [brewed, setBrewed] = useState<TeaRecipe | null>(null);

  const handleSelect = (recipe: TeaRecipe) => {
    if (coins < recipe.cost) return;
    setSelectedRecipe(recipe);
    setBrewingSlots(new Array(recipe.ingredientCount).fill(null));
  };

  const handleAddIngredient = (id: string) => {
    const idx = brewingSlots.findIndex(s => s === null);
    if (idx === -1) return;
    const slots = [...brewingSlots];
    slots[idx] = id;
    setBrewingSlots(slots);
  };

  const handleBrew = () => {
    if (!selectedRecipe || brewingSlots.some(s => s === null)) return;
    spendCoins(selectedRecipe.cost);
    restoreStamina(selectedRecipe.staminaRestore);
    setBrewed(selectedRecipe);
    setSelectedRecipe(null);
    setBrewingSlots([null, null, null, null]);
  };

  const filled = brewingSlots.filter(s => s !== null).length;
  const total = selectedRecipe?.ingredientCount ?? 0;

  return (
    <div className="space-y-4">
      {/* Roost header */}
      <div className="text-center p-6 rounded-3xl"
        style={{ background: 'linear-gradient(180deg, #3e2723, #5d4037, #4e342e)', border: '3px solid #8d6e63' }}>
        <div className="text-5xl mb-3">🕊️☕</div>
        <h2 className="text-2xl font-black mb-2" style={{ color: '#f8f8f0' }}>鸽子巢咖啡馆分店</h2>
        <p className="text-sm" style={{ color: '#a1887f' }}>老板老板为你冲泡暖心花茶 (余额: {coins} 🪙)</p>
      </div>

      {/* Menu */}
      <div className="space-y-3">
        {TEA_RECIPES.map((r) => (
          <motion.div key={r.id} whileHover={{ scale: 1.01 }}>
            <Card color={selectedRecipe?.id === r.id ? 'app-teal' : 'warm-peach-pink'}
              className="cursor-pointer" onClick={() => handleSelect(r)}>
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-2xl mr-2">{r.emoji}</span>
                  <span className="font-extrabold text-sm" style={{ color: '#725d42' }}>{r.name}</span>
                  <p className="text-xs mt-1" style={{ color: '#9f927d' }}>{r.buffDescription}</p>
                </div>
                <div className="text-right">
                  <div className="font-extrabold text-sm" style={{ color: '#b3a046' }}>🪙 {r.cost}</div>
                  <div className="text-xs font-bold" style={{ color: '#6fba2c' }}>💚 +{r.staminaRestore}</div>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Brewing table */}
      {selectedRecipe && (
        <Card color="app-yellow">
          <h3 className="font-extrabold text-sm mb-3" style={{ color: '#725d42' }}>🧪 调配台 — {selectedRecipe.name}</h3>
          <div className="flex flex-wrap gap-2 mb-4">
            {INGREDIENT_SPRITES.map((ing) => (
              <motion.button key={ing.id} whileHover={{ scale: 1.15, y: -4 }} whileTap={{ scale: 0.9 }}
                onClick={() => handleAddIngredient(ing.id)} disabled={brewingSlots.every(s => s !== null)}
                className="p-2 rounded-xl border-2 bg-white/70 cursor-pointer disabled:opacity-30"
                style={{ borderColor: '#e8e2d6' }}>
                <span className="text-2xl">{ing.label.slice(0, 2)}</span>
                <div className="text-[10px] font-semibold" style={{ color: '#725d42' }}>{ing.label.slice(3)}</div>
              </motion.button>
            ))}
          </div>
          <div className="flex gap-2 mb-4">
            {brewingSlots.map((slot, i) => (
              <div key={i} className="w-16 h-16 rounded-2xl border-2 border-dashed flex items-center justify-center text-2xl"
                style={{ borderColor: slot ? '#19c8b9' : '#e8dcc8', background: slot ? '#e6f9f6' : '#faf8f2' }}>
                {slot ? INGREDIENT_SPRITES.find(ing => ing.id === slot)?.label.slice(0, 2) ?? '?' : '🫗'}
              </div>
            ))}
          </div>
          <div className="flex gap-3">
            <Button type="primary" size="large" block disabled={filled < total} onClick={handleBrew}>
              🥄 搅拌冲泡
            </Button>
            <Button type="default" onClick={() => { setSelectedRecipe(null); setBrewingSlots([null, null, null, null]); }}>取消</Button>
          </div>
        </Card>
      )}

      <Modal open={brewed !== null} title="☕ 花茶泡好了！" footer={null} onClose={() => setBrewed(null)}>
        <div className="text-center py-4">
          <motion.div className="text-6xl mb-4" animate={{ scale: [1, 1.3, 1], rotate: [0, -5, 5, 0] }}>
            {brewed?.emoji ?? '🍵'}
          </motion.div>
          <p className="text-lg font-extrabold mb-2" style={{ color: '#725d42' }}>{brewed?.name}</p>
          <p className="text-lg font-bold" style={{ color: '#6fba2c' }}>💚 体力 +{brewed?.staminaRestore}</p>
          <div className="mt-4"><Button type="primary" onClick={() => setBrewed(null)}>品尝完毕</Button></div>
        </div>
      </Modal>
    </div>
  );
}
