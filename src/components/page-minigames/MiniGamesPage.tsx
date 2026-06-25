import { useState } from 'react';
import { useGameStore } from '../../stores/useGameStore';
import { useAdventureStore } from '../../stores/useAdventureStore';
import { Button, Card, Modal } from 'animal-island-ui';
import { motion, AnimatePresence } from 'motion/react';
import GameLayout from '../shared/GameLayout';

type MiniGameId = 'sound' | 'breathing' | 'worry-drawer' | 'bug-catching';

interface GameInfo {
  id: MiniGameId;
  name: string;
  emoji: string;
  description: string;
  hpRestore: number;
  staminaCost: number;
}

const GAMES: GameInfo[] = [
  {
    id: 'sound',
    name: '拟音捉迷藏',
    emoji: '🎵',
    description: '聆听岛上自然之声，点击对应的音源图标，锻炼你的正念聆听能力。',
    hpRestore: 20,
    staminaCost: 10,
  },
  {
    id: 'breathing',
    name: '呼吸风琴',
    emoji: '🫁',
    description: '跟随气球膨胀与收缩的节奏，练习4-7-8呼吸法，平复焦虑。',
    hpRestore: 25,
    staminaCost: 5,
  },
  {
    id: 'worry-drawer',
    name: '烦恼抽屉',
    emoji: '☁️',
    description: '把飘来的负面思绪云朵拖入对应的抽屉，分类整理你的自动化思维。',
    hpRestore: 20,
    staminaCost: 10,
  },
  {
    id: 'bug-catching',
    name: '昆虫采集',
    emoji: '🐛',
    description: '捉住散落在草地上的昆虫。每只昆虫都背负着你的负面想法，捉住它，消除它。',
    hpRestore: 30,
    staminaCost: 15,
  },
];

export default function MiniGamesPage() {
  const navigateTo = useGameStore((s) => s.navigateTo);
  const restoreHp = useAdventureStore((s) => s.restoreHp);
  const consumeStamina = useAdventureStore((s) => s.consumeStamina);
  const stamina = useAdventureStore((s) => s.stamina);

  const [activeGame, setActiveGame] = useState<MiniGameId | null>(null);
  const [gameResult, setGameResult] = useState<{ hpRestored: number } | null>(null);

  const startGame = (game: GameInfo) => {
    if (stamina < game.staminaCost) return;
    consumeStamina(game.staminaCost);
    setActiveGame(game.id);

    // Auto-complete for now — full mini-game implementations in Phase 6 detail
    setTimeout(() => {
      restoreHp(game.hpRestore);
      setActiveGame(null);
      setGameResult({ hpRestored: game.hpRestore });
    }, 2500);
  };

  return (
    <GameLayout showHUD>
      <div className="max-w-2xl mx-auto">
        {/* Night sky header */}
        <div
          className="text-center mb-8 p-6 rounded-3xl"
          style={{
            background: 'linear-gradient(180deg, #1a1a2e, #16213e, #0f3460)',
            border: '3px solid #e8e2d6',
          }}
        >
          <div className="text-5xl mb-3">🏕️✨</div>
          <h2 className="text-2xl font-black mb-2" style={{ color: '#f8f8f0', textShadow: '0 2px 4px rgba(0,0,0,0.3)' }}>
            星空下的露营篝火
          </h2>
          <p className="text-sm" style={{ color: '#c4b89e' }}>
            选一个你喜欢的方式，给自己放松的机会
          </p>
        </div>

        {/* Game grid */}
        <div className="grid md:grid-cols-2 gap-4 mb-8">
          {GAMES.map((game) => (
            <motion.div key={game.id} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Card
                color="app-yellow"
                className="cursor-pointer"
                onClick={() => startGame(game)}
              >
                <div className="text-center">
                  <span className="text-4xl block mb-2">{game.emoji}</span>
                  <h3 className="font-extrabold text-sm mb-1" style={{ color: '#725d42' }}>
                    {game.name}
                  </h3>
                  <p className="text-xs mb-3" style={{ color: '#9f927d' }}>
                    {game.description}
                  </p>
                  <div className="flex justify-center gap-4 text-xs font-bold">
                    <span style={{ color: '#e05a5a' }}>❤️ +{game.hpRestore}</span>
                    <span style={{ color: '#6fba2c' }}>💚 -{game.staminaCost} 体力</span>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Navigation */}
        <div className="flex gap-3 justify-center">
          <Button type="default" onClick={() => navigateTo('tasks')}>
            📋 返回任务
          </Button>
          <Button type="default" onClick={() => navigateTo('teashop')}>
            🍵 花茶补给
          </Button>
          <Button type="primary" onClick={() => navigateTo('battle')}>
            ⚔️ 回去战斗
          </Button>
        </div>
      </div>

      {/* Game playing modal */}
      <Modal
        open={activeGame !== null}
        title={GAMES.find((g) => g.id === activeGame)?.emoji + ' ' + (GAMES.find((g) => g.id === activeGame)?.name ?? '')}
        footer={null}
        onClose={() => {}}
      >
        <div className="text-center py-8">
          <motion.div
            className="text-6xl mb-4"
            animate={{ scale: [1, 1.2, 1], rotate: [0, 10, -10, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            {GAMES.find((g) => g.id === activeGame)?.emoji ?? '🎮'}
          </motion.div>
          <p className="text-lg font-bold" style={{ color: '#725d42' }}>
            游戏进行中…
          </p>
          <p className="text-sm mt-2" style={{ color: '#9f927d' }}>
            {activeGame === 'sound' && '🎵 仔细聆听自然之声…'}
            {activeGame === 'breathing' && '🫁 吸气… 屏住… 呼气…'}
            {activeGame === 'worry-drawer' && '☁️ 抓住飘过的烦恼云朵…'}
            {activeGame === 'bug-catching' && '🐛 别让虫子跑掉了…'}
          </p>
        </div>
      </Modal>

      {/* Completion modal */}
      <Modal
        open={gameResult !== null}
        title="✅ 完成！"
        footer={null}
        onClose={() => setGameResult(null)}
      >
        <div className="text-center py-4">
          <p className="text-lg font-bold mb-2" style={{ color: '#6fba2c' }}>
            做得很好！
          </p>
          <p className="text-sm" style={{ color: '#725d42' }}>
            恢复了 <span style={{ color: '#e05a5a', fontWeight: 800 }}>{gameResult?.hpRestored}</span> 点生命值 ❤️
          </p>
          <div className="mt-4">
            <Button type="primary" onClick={() => setGameResult(null)}>
              继续放松
            </Button>
          </div>
        </div>
      </Modal>
    </GameLayout>
  );
}
