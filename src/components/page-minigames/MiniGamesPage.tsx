import React, { useState } from 'react';
import { useAdventureStore } from '../../stores/useAdventureStore';
import { useGameStore } from '../../stores/useGameStore';
import { Card } from 'animal-island-ui';
import { motion } from 'motion/react';
import BreathingCircle from '../templates/BreathingCircle';
import SortBaskets from '../templates/SortBaskets';
import LetterWrite from '../templates/LetterWrite';
import WaterDrink from '../templates/WaterDrink';
import GratitudePetals from '../templates/GratitudePetals';
import AutoTimer from '../templates/AutoTimer';
import CloudMiniGame from '../minigames/CloudMiniGame';
import ShellCollectGame from '../minigames/ShellCollectGame';
import { getWorryContent } from '../../data/worryContent';
import { MINIGAME_HP_RESTORE, MINIGAME_EXP, MINIGAME_COINS, MINIGAME_STAMINA_COST } from '../../constants';
import { useTranslations } from '../../i18n';
import { useLanguageStore } from '../../stores/useLanguageStore';

const TEMPLATE_MAP: Record<string, React.ComponentType<any>> = {
  breathing: BreathingCircle,
  sorting: SortBaskets,
  writing: LetterWrite,
  action: WaterDrink,
  gratitude: GratitudePetals,
  movement: AutoTimer,
  cloud: CloudMiniGame,
  shell_collect: ShellCollectGame,
};

export default function MiniGamesPage() {
  const restoreHp = useAdventureStore((s) => s.restoreHp);
  const consumeStamina = useAdventureStore((s) => s.consumeStamina);
  const addExp = useAdventureStore((s) => s.addExp);
  const addCoins = useAdventureStore((s) => s.addCoins);
  const stamina = useAdventureStore((s) => s.stamina);
  const worryType = useGameStore((s) => s.worryType);
  const [active, setActive] = useState<{ type: string; title: string; desc: string } | null>(null);

  const tr = useTranslations();
  const t = tr.minigames;
  const tasksTr = tr.tasks;
  const language = useLanguageStore((s) => s.language);

  const worryContent = getWorryContent(worryType ?? 'emotion_management', language);
  const sortData = (tasksTr.sortData as any)[worryType ?? 'emotion_management'] ?? (tasksTr.sortData as any).emotion_management;

  const games = worryContent.miniGames.map((g) => ({
    ...g,
    hpRestore: MINIGAME_HP_RESTORE,
    staminaCost: MINIGAME_STAMINA_COST,
    template: g.id,
  }));

  const handlePlay = (game: typeof games[number]) => {
    if (game.staminaCost > 0 && stamina < game.staminaCost) return;
    if (game.staminaCost > 0) consumeStamina(game.staminaCost);
    setActive({ type: game.template, title: `${game.emoji} ${game.name}`, desc: game.description });
  };

  const handleComplete = (game: typeof games[number]) => {
    restoreHp(MINIGAME_HP_RESTORE);
    addExp(MINIGAME_EXP);
    addCoins(MINIGAME_COINS);
    setActive(null);
  };

  return (
    <div className="space-y-3">
      <div className="text-center p-4 rounded-3xl" style={{ background: 'linear-gradient(180deg, #1a1a2e, #16213e, #0f3460)', border: '3px solid #e8e2d6' }}>
        <div className="text-4xl mb-2">🏕️✨</div>
        <h2 className="text-xl font-black mb-1" style={{ color: '#f8f8f0' }}>{t.pageTitle}</h2>
        <p className="text-sm" style={{ color: '#c4b89e' }}>{t.pageSubtitle}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {games.map((game) => (
          <motion.div key={game.id} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Card color="app-yellow" className="cursor-pointer text-center" onClick={() => handlePlay(game)}>
              <span className="text-3xl block mb-1">{game.emoji}</span>
              <h3 className="font-extrabold text-sm mb-1" style={{ color: '#725d42' }}>{game.name}</h3>
              <p className="text-xs mb-2 px-2" style={{ color: '#9f927d' }}>{game.description}</p>
              <div className="flex justify-center gap-4 text-xs font-bold">
                <span style={{ color: '#e05a5a' }}>❤️ +{game.hpRestore}</span>
                <span style={{ color: '#f5c31c' }}>⭐ +15 EXP</span>
                {game.staminaCost > 0 && <span style={{ color: '#6fba2c' }}>💚 {game.staminaCost}</span>}
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Template modals */}
      {active && active.type === 'breathing' && (
        <BreathingCircle title={active.title} description={active.desc} themeText={t.breathingTheme} onComplete={() => { const g = games.find(g=>g.template==='breathing'); if(g) handleComplete(g); }} onClose={() => setActive(null)} />
      )}
      {active && active.type === 'sorting' && (
        <SortBaskets title={active.title} description={active.desc}
          items={sortData?.items ?? []} baskets={sortData?.baskets ?? []}
          onComplete={() => { const g = games.find(g=>g.template==='sorting'); if(g) handleComplete(g); }} onClose={() => setActive(null)} />
      )}
      {active && active.type === 'writing' && (
        <LetterWrite title={active.title} description={active.desc} placeholder={t.writingPlaceholder} onComplete={() => { const g = games.find(g=>g.template==='writing'); if(g) handleComplete(g); }} onClose={() => setActive(null)} />
      )}
      {active && active.type === 'movement' && (
        <AutoTimer title={active.title} description={active.desc} themeText={t.bodyTheme} duration={60} onComplete={() => { const g = games.find(g=>g.template==='movement'); if(g) handleComplete(g); }} onClose={() => setActive(null)} />
      )}
      {active && active.type === 'cloud' && (
        <CloudMiniGame taskTitle={active.title} taskDescription={active.desc} onComplete={() => { const g = games.find(g=>g.template==='cloud'); if(g) handleComplete(g); }} onClose={() => setActive(null)} />
      )}
      {active && active.type === 'shell_collect' && (
        <ShellCollectGame taskTitle={active.title} taskDescription={active.desc} onComplete={() => { const g = games.find(g=>g.template==='shell_collect'); if(g) handleComplete(g); }} onClose={() => setActive(null)} />
      )}
    </div>
  );
}
