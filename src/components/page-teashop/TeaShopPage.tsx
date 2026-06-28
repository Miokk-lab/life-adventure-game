import { useState } from 'react';
import { useAdventureStore } from '../../stores/useAdventureStore';
import { useGameStore } from '../../stores/useGameStore';
import { Button, Card, Modal } from 'animal-island-ui';
import { motion } from 'motion/react';
import { getWorryContent } from '../../data/worryContent';
import { useTranslations } from '../../i18n';
import { useLanguageStore } from '../../stores/useLanguageStore';
import { OnboardingTipManager } from '../onboarding';

interface TeaRecipe {
  id: string; name: string; emoji: string; cost: number; staminaRestore: number;
  buffDescription: string; requiredIngredients: string[];
}

const INGREDIENT_IDS = ['mint','chamomile','peach','oolong','orange','lavender','cosmos','lily','rose','lemon','ginger','honey'];

export default function TeaShopPage() {
  const worryType = useGameStore((s) => s.worryType);
  const language = useLanguageStore((s) => s.language);
  const worryContent = getWorryContent(worryType ?? 'emotion_management', language);
  const tr = useTranslations();
  const t = tr.teashop;

  const ALL_INGREDIENTS = INGREDIENT_IDS.map((id, i) => ({ id, label: t.ingredients[i] ?? id }));

  const TEA_RECIPES: TeaRecipe[] = worryContent.teas.map((tea, i) => ({
    id: `tea_${i}`, name: tea.name, emoji: tea.emoji, cost: tea.cost,
    staminaRestore: tea.stamina, buffDescription: tea.desc, requiredIngredients: tea.ingredients,
  }));

  const spendCoins = useAdventureStore((s) => s.spendCoins);
  const restoreStamina = useAdventureStore((s) => s.restoreStamina);
  const coins = useAdventureStore((s) => s.coins);

  const [selectedRecipe, setSelectedRecipe] = useState<TeaRecipe | null>(null);
  const [brewingSlots, setBrewingSlots] = useState<(string | null)[]>([null, null, null, null]);
  const [brewed, setBrewed] = useState<TeaRecipe | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [shuffledIngredients, setShuffledIngredients] = useState(() =>
    [...ALL_INGREDIENTS].sort(() => Math.random() - 0.5)
  );

  const handleSelect = (recipe: TeaRecipe) => {
    setShuffledIngredients([...ALL_INGREDIENTS].sort(() => Math.random() - 0.5));
    if (coins < recipe.cost) {
      setErrorMsg(t.coinWarning);
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

    const recipeIngs = selectedRecipe.requiredIngredients;
    const alreadyUsed = brewingSlots.filter(s => s === ingredientId).length;
    const needed = recipeIngs.filter(ing => ing === ingredientId).length;

    if (!recipeIngs.includes(ingredientId) || alreadyUsed >= needed) {
      setErrorMsg(t.wrongIngredientWarning);
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
    const required = [...selectedRecipe.requiredIngredients].sort().join(',');
    const actual = [...brewingSlots.filter(s => s !== null)].sort().join(',');
    if (required !== actual) {
      setErrorMsg(t.incompleteBrew);
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
      {/* Header */}
      <div className="text-center p-6 rounded-3xl"
        style={{ background: 'linear-gradient(180deg, #3e2723, #5d4037, #4e342e)', border: '3px solid #8d6e63' }}>
        <div className="text-5xl mb-3">🕊️☕</div>
        <h2 className="text-2xl font-black mb-2" style={{ color: '#f8f8f0' }}>{t.pageTitle}</h2>
        <p className="text-sm" style={{ color: '#a1887f' }}>{t.pageSubtitle.replace('{coins}', String(coins))}</p>
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
                    {t.ingredientPrefix}{r.requiredIngredients.map(id => ALL_INGREDIENTS.find(i => i.id === id)?.label ?? id).join(' + ')}
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
          <h3 className="font-extrabold text-sm mb-1" style={{ color: '#725d42' }}>{t.brewingStation.replace('{name}', selectedRecipe.name)}</h3>
          <p className="text-[10px] mb-3" style={{ color: '#9f927d' }}>
            {t.needIngredients}{selectedRecipe.requiredIngredients.map(id => ALL_INGREDIENTS.find(i => i.id === id)?.label ?? id).join(' + ')}
          </p>

          {/* Ingredient shelf */}
          <div className="flex flex-wrap gap-2 mb-4">
            {shuffledIngredients.map((ing) => (
              <motion.button key={ing.id} whileHover={{ scale: 1.15, y: -4 }} whileTap={{ scale: 0.9 }}
                onClick={() => handleAddIngredient(ing.id)}
                disabled={brewingSlots.every(s => s !== null)}
                className="p-2 rounded-xl border-2 bg-white/70 cursor-pointer disabled:opacity-30"
                style={{ borderColor: '#e8e2d6' }}>
                <span className="text-2xl">{ing.label.slice(0, 2)}</span>
                <div className="text-[10px] font-semibold" style={{ color: '#725d42' }}>{ing.label.slice(3)}</div>
              </motion.button>
            ))}
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
                {slot ? ALL_INGREDIENTS.find(ing => ing.id === slot)?.label ?? '?' : '🫗'}
              </button>
            ))}
          </div>

          <div className="text-center">
            <p className="text-xs mb-2" style={{ color: '#9f927d' }}>
              {t.teapotProgress.replace('{filled}', String(filled)).replace('{total}', String(total))}
            </p>
            <div className="flex gap-3 justify-center">
              <Button type="primary" size="large" disabled={filled < total} onClick={handleBrew}>
                {t.brewBtn}
              </Button>
              <Button type="default" onClick={() => { setSelectedRecipe(null); setBrewingSlots([null, null, null, null]); setErrorMsg(null); }}>
                {t.cancelBtn}
              </Button>
            </div>
          </div>
        </Card>
      )}

      {/* Brewed tea reveal */}
      <Modal open={brewed !== null} title={t.readyTitle} typewriter={false} footer={null} onClose={() => setBrewed(null)}>
        <div className="text-center py-6 px-4">
          <motion.div className="text-6xl mb-4" animate={{ scale: [1, 1.3, 1], rotate: [0, -5, 5, 0] }}>
            {brewed?.emoji ?? '🍵'}
          </motion.div>
          <p className="text-lg font-extrabold mb-2" style={{ color: '#725d42' }}>{brewed?.name}</p>
          <p className="text-xs mb-4" style={{ color: '#9f927d' }}>{brewed?.buffDescription}</p>
          <p className="text-lg font-bold" style={{ color: '#6fba2c' }}>💚 {t.staminaLabel} +{brewed?.staminaRestore}</p>
          <div className="mt-4"><Button type="primary" onClick={() => setBrewed(null)}>{t.doneBtn}</Button></div>
        </div>
      </Modal>
      <OnboardingTipManager triggerId="tea_craft" position="bottom" />
    </div>
  );
}
