import React, { useState } from 'react';
import { useAdventureStore } from '../../stores/useAdventureStore';
import { Card } from 'animal-island-ui';
import { motion } from 'motion/react';
import BreathingMiniGame from '../minigames/BreathingMiniGame';
import ShellCollectGame from '../minigames/ShellCollectGame';
import CloudMiniGame from '../minigames/CloudMiniGame';
import SortingMiniGame from '../minigames/SortingMiniGame';

interface GameInfo {
  id: string; name: string; emoji: string; description: string;
  hpRestore: number; staminaCost: number; component: React.ComponentType<any>;
}

const GAMES: GameInfo[] = [
  { id: 'breathing', name: '呼吸法环', emoji: '🍃', description: '跟随节奏深呼吸，3个循环平复焦虑。', hpRestore: 20, staminaCost: 0, component: BreathingMiniGame },
  { id: 'shell_collect', name: '贝壳收集', emoji: '🐚', description: '在海滩上收集美丽的贝壳。', hpRestore: 20, staminaCost: 5, component: ShellCollectGame },
  { id: 'cloud', name: '乌云吹散', emoji: '☁️', description: '把烦恼写在云上，让风吹散。', hpRestore: 20, staminaCost: 0, component: CloudMiniGame },
  { id: 'sorting', name: '心灵整理', emoji: '🧺', description: '把思绪分类到正确的篮子里。', hpRestore: 20, staminaCost: 0, component: SortingMiniGame },
];

type ActiveGame = { type: string; taskTitle: string; taskDescription: string } | null;

export default function MiniGamesPage() {
  const restoreHp = useAdventureStore((s) => s.restoreHp);
  const consumeStamina = useAdventureStore((s) => s.consumeStamina);
  const stamina = useAdventureStore((s) => s.stamina);
  const addCoins = useAdventureStore((s) => s.addCoins);
  const [activeGame, setActiveGame] = useState<ActiveGame>(null);

  const handlePlay = (game: GameInfo) => {
    if (game.staminaCost > 0 && stamina < game.staminaCost) return;
    if (game.staminaCost > 0) consumeStamina(game.staminaCost);
    setActiveGame({
      type: game.id,
      taskTitle: `${game.emoji} ${game.name}`,
      taskDescription: game.description,
    });
  };

  const handleComplete = (game: GameInfo) => {
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
        {GAMES.map((game) => (
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
      {activeGame && activeGame.type === 'breathing' && (
        <BreathingMiniGame
          taskTitle={activeGame.taskTitle}
          taskDescription={activeGame.taskDescription}
          onComplete={() => handleComplete(GAMES.find(g => g.id === 'breathing')!)}
          onClose={handleClose}
        />
      )}
      {activeGame && activeGame.type === 'shell_collect' && (
        <ShellCollectGame
          taskTitle={activeGame.taskTitle}
          taskDescription={activeGame.taskDescription}
          onComplete={() => handleComplete(GAMES.find(g => g.id === 'shell_collect')!)}
          onClose={handleClose}
        />
      )}
      {activeGame && activeGame.type === 'cloud' && (
        <CloudMiniGame
          taskTitle={activeGame.taskTitle}
          taskDescription={activeGame.taskDescription}
          onComplete={() => handleComplete(GAMES.find(g => g.id === 'cloud')!)}
          onClose={handleClose}
        />
      )}
      {activeGame && activeGame.type === 'sorting' && (
        <SortingMiniGame
          taskTitle={activeGame.taskTitle}
          taskDescription={activeGame.taskDescription}
          onComplete={() => handleComplete(GAMES.find(g => g.id === 'sorting')!)}
          onClose={handleClose}
        />
      )}
    </div>
  );
}
