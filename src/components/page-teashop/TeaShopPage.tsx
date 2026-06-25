import { useState } from 'react';
import { useAdventureStore } from '../../stores/useAdventureStore';
import { Button, Card, Modal } from 'animal-island-ui';
import { motion } from 'motion/react';

interface TeaRecipe {
  id: string; name: string; emoji: string; cost: number; staminaRestore: number;
  buffDescription: string; requiredIngredients: string[];
}

const TEA_RECIPES: TeaRecipe[] = [
  { id: 'mint', name: '薄荷洋甘菊茶', emoji: '🍵', cost: 30, staminaRestore: 30,
    buffDescription: '清凉舒缓，缓解焦虑', requiredIngredients: ['peach', 'rose'] },
  { id: 'peach', name: '桃桃乌龙果粒茶', emoji: '🧋', cost: 80, staminaRestore: 60,
    buffDescription: '果香四溢，恢复元气', requiredIngredients: ['peach', 'orange', 'tulip'] },
  { id: 'aurora', name: '星空极光薰衣草茶', emoji: '✨', cost: 150, staminaRestore: 120,
    buffDescription: '体力满值+暴击Buff', requiredIngredients: ['cherry', 'apple', 'cosmos', 'lily'] },
];

const ALL_INGREDIENTS = [
  { id: 'peach', label: '🍑 桃子' },
  { id: 'orange', label: '🍊 橙子' },
  { id: 'cherry', label: '🍒 樱桃' },
  { id: 'apple', label: '🍎 苹果' },
  { id: 'rose', label: '🌹 玫瑰' },
  { id: 'tulip', label: '🌷 郁金香' },
  { id: 'cosmos', label: '🌸 波斯菊' },
  { id: 'lily', label: '🪷 百合' },
];

export default function TeaShopPage() {
  const spendCoins = useAdventureStore((s) => s.spendCoins);
  const restoreStamina = useAdventureStore((s) => s.restoreStamina);
  const coins = useAdventureStore((s) => s.coins);

  const [selectedRecipe, setSelectedRecipe] = useState<TeaRecipe | null>(null);
  const [brewingSlots, setBrewingSlots] = useState<(string | null)[]>([null, null, null, null]);
  const [brewed, setBrewed] = useState<TeaRecipe | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSelect = (recipe: TeaRecipe) => {
    if (coins < recipe.cost) {
      setErrorMsg('铃钱不够哦！去做任务赚取铃钱吧。');
      return;
    }
    setSelectedRecipe(recipe);
    setBrewingSlots(new Array(recipe.requiredIngredients.length).fill(null));
    setErrorMsg(null);
  };

  const handleAddIngredient = (ingredientId: string) => {
    if (!selectedRecipe) return;
    const slotIdx = brewingSlots.findIndex(s => s === null);
    if (slotIdx === -1) return;

    // Validate: is this ingredient required for the recipe?
    const recipeIngs = selectedRecipe.requiredIngredients;
    const alreadyUsed = brewingSlots.filter(s => s === ingredientId).length;
    const needed = recipeIngs.filter(ing => ing === ingredientId).length;

    if (!recipeIngs.includes(ingredientId) || alreadyUsed >= needed) {
      setErrorMsg('是不是粗心看错了？请选择与花茶名称匹配的食材！');
      // Flash error, clear after 2s
      setTimeout(() => setErrorMsg(null), 2000);
      return;
    }

    const slots = [...brewingSlots];
    slots[slotIdx] = ingredientId;
    setBrewingSlots(slots);
    setErrorMsg(null);
  };

  const handleBrew = () => {
    if (!selectedRecipe) return;
    // Check all required ingredients are present (order doesn't matter)
    const required = [...selectedRecipe.requiredIngredients].sort().join(',');
    const actual = [...brewingSlots.filter(s => s !== null)].sort().join(',');
    if (required !== actual) {
      setErrorMsg('食材还没放对呢！请选择与花茶名称匹配的食材！');
      setTimeout(() => setErrorMsg(null), 2000);
      return;
    }

    spendCoins(selectedRecipe.cost);
    restoreStamina(selectedRecipe.staminaRestore);
    setBrewed(selectedRecipe);
    setSelectedRecipe(null);
    setBrewingSlots([null, null, null, null]);
    setErrorMsg(null);
  };

  const handleRemoveSlot = (idx: number) => {
    const slots = [...brewingSlots];
    slots[idx] = null;
    setBrewingSlots(slots);
  };

  const filled = brewingSlots.filter(s => s !== null).length;
  const total = selectedRecipe?.requiredIngredients.length ?? 0;

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
            <Card
              color={selectedRecipe?.id === r.id ? 'app-teal' : 'warm-peach-pink'}
              className="cursor-pointer"
              onClick={() => handleSelect(r)}
            >
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-2xl mr-2">{r.emoji}</span>
                  <span className="font-extrabold text-sm" style={{ color: '#725d42' }}>{r.name}</span>
                  <p className="text-xs mt-1" style={{ color: '#9f927d' }}>{r.buffDescription}</p>
                  <p className="text-[10px] mt-0.5" style={{ color: '#c4b89e' }}>
                    食材: {r.requiredIngredients.map(id => ALL_INGREDIENTS.find(i => i.id === id)?.label.split(' ')[0]).join(' + ')}
                  </p>
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

      {/* Error message */}
      {errorMsg && (
        <motion.div
          initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
          className="text-center p-3 rounded-2xl border-2"
          style={{ background: '#fde8e8', borderColor: '#e05a5a', color: '#c62828' }}
        >
          <span className="text-sm font-extrabold">{errorMsg}</span>
        </motion.div>
      )}

      {/* Brewing table */}
      {selectedRecipe && (
        <Card color="app-yellow">
          <h3 className="font-extrabold text-sm mb-1" style={{ color: '#725d42' }}>🧪 调配台 — {selectedRecipe.name}</h3>
          <p className="text-[10px] mb-3" style={{ color: '#9f927d' }}>
            需要食材: {selectedRecipe.requiredIngredients.map(id => ALL_INGREDIENTS.find(i => i.id === id)?.label.split(' ')[0]).join(' + ')}
          </p>

          {/* Ingredient shelf */}
          <div className="flex flex-wrap gap-2 mb-4">
            {ALL_INGREDIENTS.map((ing) => {
              const isRequired = selectedRecipe.requiredIngredients.includes(ing.id);
              return (
                <motion.button key={ing.id} whileHover={{ scale: 1.15, y: -4 }} whileTap={{ scale: 0.9 }}
                  onClick={() => handleAddIngredient(ing.id)}
                  disabled={brewingSlots.every(s => s !== null)}
                  className="p-2 rounded-xl border-2 bg-white/70 cursor-pointer disabled:opacity-30 relative"
                  style={{ borderColor: isRequired ? '#6fba2c' : '#e8e2d6' }}>
                  <span className="text-2xl">{ing.label.slice(0, 2)}</span>
                  <div className="text-[10px] font-semibold" style={{ color: '#725d42' }}>{ing.label.slice(3)}</div>
                  {isRequired && <span className="absolute -top-1 -right-1 text-[10px]">⭐</span>}
                </motion.button>
              );
            })}
          </div>

          {/* Brewing slots */}
          <div className="flex gap-2 mb-4">
            {brewingSlots.map((slot, i) => (
              <button key={i}
                onClick={() => slot && handleRemoveSlot(i)}
                className="w-16 h-16 rounded-2xl border-2 border-dashed flex items-center justify-center text-2xl transition-all cursor-pointer"
                style={{
                  borderColor: slot ? '#19c8b9' : '#e8dcc8',
                  background: slot ? '#e6f9f6' : '#faf8f2',
                }}>
                {slot ? ALL_INGREDIENTS.find(ing => ing.id === slot)?.label.slice(0, 2) ?? '?' : '🫗'}
              </button>
            ))}
          </div>

          <div className="text-center">
            <p className="text-xs mb-2" style={{ color: '#9f927d' }}>
              茶壶已放入: {filled}/{total} 种食材
            </p>
            <div className="flex gap-3 justify-center">
              <Button type="primary" size="large" disabled={filled < total} onClick={handleBrew}>
                🥄 搅拌冲泡
              </Button>
              <Button type="default" onClick={() => { setSelectedRecipe(null); setBrewingSlots([null, null, null, null]); setErrorMsg(null); }}>
                取消
              </Button>
            </div>
          </div>
        </Card>
      )}

      {/* Brewed tea reveal */}
      <Modal open={brewed !== null} title="☕ 花茶泡好了！" footer={null} onClose={() => setBrewed(null)}>
        <div className="text-center py-6 px-4">
          <motion.div className="text-6xl mb-4" animate={{ scale: [1, 1.3, 1], rotate: [0, -5, 5, 0] }}>
            {brewed?.emoji ?? '🍵'}
          </motion.div>
          <p className="text-lg font-extrabold mb-2" style={{ color: '#725d42' }}>{brewed?.name}</p>
          <p className="text-xs mb-4" style={{ color: '#9f927d' }}>{brewed?.buffDescription}</p>
          <p className="text-lg font-bold" style={{ color: '#6fba2c' }}>💚 体力 +{brewed?.staminaRestore}</p>
          <div className="mt-4"><Button type="primary" onClick={() => setBrewed(null)}>品尝完毕</Button></div>
        </div>
      </Modal>
    </div>
  );
}
