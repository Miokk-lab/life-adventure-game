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
  const stamina = useAdventureStore((s) => s.stamina);
  const worryType = useGameStore((s) => s.worryType);
  const [active, setActive] = useState<{ type: string; title: string; desc: string } | null>(null);

  const worryContent = getWorryContent(worryType ?? 'emotion_management');
  const games = worryContent.miniGames.map((g, i) => ({
    ...g,
    hpRestore: 20,
    staminaCost: g.id === 'shell_collect' ? 5 : 0,
    template: ['breathing','sorting','cloud','shell_collect','writing','movement'][i % 6],
  }));

  const handlePlay = (game: typeof games[number]) => {
    if (game.staminaCost > 0 && stamina < game.staminaCost) return;
    if (game.staminaCost > 0) consumeStamina(game.staminaCost);
    setActive({ type: game.template, title: `${game.emoji} ${game.name}`, desc: game.description });
  };

  const handleComplete = (game: typeof games[number]) => {
    restoreHp(game.hpRestore);
    addExp(15);
    setActive(null);
  };

  return (
    <div className="space-y-4">
      <div className="text-center p-6 rounded-3xl" style={{ background: 'linear-gradient(180deg, #1a1a2e, #16213e, #0f3460)', border: '3px solid #e8e2d6' }}>
        <div className="text-5xl mb-3">🏕️✨</div>
        <h2 className="text-2xl font-black mb-2" style={{ color: '#f8f8f0' }}>星空下的露营篝火</h2>
        <p className="text-sm" style={{ color: '#c4b89e' }}>选一个方式，给自己放松的机会 (+15 EXP)</p>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {games.map((game) => (
          <motion.div key={game.id} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Card color="app-yellow" className="cursor-pointer text-center" onClick={() => handlePlay(game)}>
              <span className="text-4xl block mb-2">{game.emoji}</span>
              <h3 className="font-extrabold text-sm mb-1" style={{ color: '#725d42' }}>{game.name}</h3>
              <p className="text-xs mb-3 px-2" style={{ color: '#9f927d' }}>{game.description}</p>
              <div className="flex justify-center gap-4 text-xs font-bold">
                <span style={{ color: '#e05a5a' }}>❤️ +{game.hpRestore}</span>
                <span style={{ color: '#f5c31c' }}>⭐ +15 EXP</span>
                {game.staminaCost > 0 && <span style={{ color: '#6fba2c' }}>💚 {game.staminaCost}</span>}
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Template modals — use different templates than tasks */}
      {active && active.type === 'breathing' && (
        <BreathingCircle title={active.title} description={active.desc} themeText="跟随呼吸节奏，放松身心" onComplete={() => { const g = games.find(g=>g.template==='breathing'); if(g) handleComplete(g); }} onClose={() => setActive(null)} />
      )}
      {active && active.type === 'sorting' && (
        <SortBaskets title={active.title} description={active.desc}
          items={[{text:'过去的事',basket:'past'},{text:'现在的事',basket:'now'},{text:'童年的记忆',basket:'past'},{text:'今天的选择',basket:'now'}]}
          baskets={[{key:'past',label:'过去',emoji:'🕰️'},{key:'now',label:'现在',emoji:'🌱'}]}
          onComplete={() => { const g = games.find(g=>g.template==='sorting'); if(g) handleComplete(g); }} onClose={() => setActive(null)} />
      )}
      {active && active.type === 'writing' && (
        <LetterWrite title={active.title} description={active.desc} placeholder="写下你的想法…" onComplete={() => { const g = games.find(g=>g.template==='writing'); if(g) handleComplete(g); }} onClose={() => setActive(null)} />
      )}
      {active && active.type === 'movement' && (
        <AutoTimer title={active.title} description={active.desc} themeText="放松身体，跟随引导" duration={60} onComplete={() => { const g = games.find(g=>g.template==='movement'); if(g) handleComplete(g); }} onClose={() => setActive(null)} />
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
