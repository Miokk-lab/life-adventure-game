import React, { useState } from 'react';
import { useAdventureStore } from '../../stores/useAdventureStore';
import { useGameStore } from '../../stores/useGameStore';
import { Card } from 'animal-island-ui';
import { motion } from 'motion/react';
import BreathingMiniGame from '../minigames/BreathingMiniGame';
import ShellCollectGame from '../minigames/ShellCollectGame';
import CloudMiniGame from '../minigames/CloudMiniGame';
import SortingMiniGame from '../minigames/SortingMiniGame';
import { getWorryContent } from '../../data/worryContent';

const COMPONENT_MAP: Record<string, React.ComponentType<any>> = {
  breathing: BreathingMiniGame,
  shell_collect: ShellCollectGame,
  cloud: CloudMiniGame,
  sorting: SortingMiniGame,
};

type ActiveGame = { type: string; taskTitle: string; taskDescription: string } | null;

export default function MiniGamesPage() {
  const restoreHp = useAdventureStore((s) => s.restoreHp);
  const consumeStamina = useAdventureStore((s) => s.consumeStamina);
  const stamina = useAdventureStore((s) => s.stamina);
  const addCoins = useAdventureStore((s) => s.addCoins);
  const worryType = useGameStore((s) => s.worryType);
  const [activeGame, setActiveGame] = useState<ActiveGame>(null);

  const worryContent = getWorryContent(worryType ?? 'emotion_management');
  const games = worryContent.miniGames.map(g => ({
    ...g,
    hpRestore: 20,
    staminaCost: g.id === 'shell_collect' ? 5 : 0,
    component: COMPONENT_MAP[g.id] ?? BreathingMiniGame,
  }));

  const handlePlay = (game: typeof games[number]) => {
    if (game.staminaCost > 0 && stamina < game.staminaCost) return;
    if (game.staminaCost > 0) consumeStamina(game.staminaCost);
    setActiveGame({
      type: game.id,
      taskTitle: `${game.emoji} ${game.name}`,
      taskDescription: game.description,
    });
  };

  const handleComplete = (game: typeof games[number]) => {
    restoreHp(game.hpRestore);
    addCoins(5);
    setActiveGame(null);
  };

  const handleClose = () => setActiveGame(null);

  return (
    <div className="space-y-4">
      {/* Night sky header */}
      <div className="text-center p-6 rounded-3xl"
        style={{ background: 'linear-gradient(180deg, #1a1a2e, #16213e, #0f3460)', border: '3px solid #e8e2d6' }}>
        <div className="text-5xl mb-3">🏕️✨</div>
        <h2 className="text-2xl font-black mb-2" style={{ color: '#f8f8f0', textShadow: '0 2px 4px rgba(0,0,0,0.3)' }}>
          星空下的露营篝火
        </h2>
        <p className="text-sm" style={{ color: '#c4b89e' }}>选一个方式，给自己放松的机会</p>
      </div>

      {/* Game grid */}
      <div className="grid md:grid-cols-2 gap-4">
        {games.map((game) => (
          <motion.div key={game.id} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Card color="app-yellow" className="cursor-pointer text-center" onClick={() => handlePlay(game)}>
              <span className="text-4xl block mb-2">{game.emoji}</span>
              <h3 className="font-extrabold text-sm mb-1" style={{ color: '#725d42' }}>{game.name}</h3>
              <p className="text-xs mb-3 px-2" style={{ color: '#9f927d' }}>{game.description}</p>
              <div className="flex justify-center gap-4 text-xs font-bold">
                <span style={{ color: '#e05a5a' }}>❤️ +{game.hpRestore}</span>
                {game.staminaCost > 0 && <span style={{ color: '#6fba2c' }}>💚 {game.staminaCost}</span>}
                {game.staminaCost === 0 && <span style={{ color: '#19c8b9' }}>免费</span>}
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Mini-game modals */}
      {activeGame && (() => {
        const Comp = COMPONENT_MAP[activeGame.type] ?? BreathingMiniGame;
        const g = games.find(g => g.id === activeGame!.type);
        return <Comp taskTitle={activeGame.taskTitle} taskDescription={activeGame.taskDescription}
          onComplete={() => { if (g) handleComplete(g); }} onClose={handleClose} />;
      })()}
    </div>
  );
}
