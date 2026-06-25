import { useGameStore } from '../../stores/useGameStore';
import { useAdventureStore } from '../../stores/useAdventureStore';
import { Button, Card, Title, Collapse } from 'animal-island-ui';
import { motion } from 'motion/react';
import GameLayout from '../shared/GameLayout';
import CharacterCard from '../shared/CharacterCard';

export default function AnalysisPage() {
  const navigateTo = useGameStore((s) => s.navigateTo);
  const hero = useAdventureStore((s) => s.hero);
  const monster = useAdventureStore((s) => s.monster);
  const cbtAnalysis = useAdventureStore((s) => s.cbtAnalysis);

  return (
    <GameLayout>
      <div className="max-w-4xl mx-auto">
        <Title size="large" color="app-blue">
          傅达的岛屿心理特展厅
        </Title>
        <p className="text-center text-sm mt-2 mb-8" style={{ color: '#9f927d' }}>
          让我们一起来看看，你的烦恼背后藏着什么样的故事…
        </p>

        {/* Hero + Monster cards side by side */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <motion.div
            initial={{ x: -40, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <CharacterCard
              name={hero?.name ?? '未知英雄'}
              story={hero?.story ?? '正在生成…'}
              imageUrl={hero?.imageUrl ?? ''}
              subtitle="🦸 你的守护英雄"
              color="teal"
              details={hero?.skills?.map((s) => s.name) ?? []}
            />
          </motion.div>

          <motion.div
            initial={{ x: 40, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            <CharacterCard
              name={monster?.name ?? '未知心魔'}
              story={monster?.story ?? '正在生成…'}
              imageUrl={monster?.imageUrl ?? ''}
              subtitle="👾 你的心魔怪兽"
              color="red"
              details={monster?.attacks ?? []}
            />
          </motion.div>
        </div>

        {/* CBT Analysis — center panel */}
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.5 }}
        >
          <Card color="app-yellow" className="mb-8">
            <Title size="middle" color="brown">
              📖 傅达的心理笔记
            </Title>
            <div
              className="mt-4 text-sm leading-relaxed"
              style={{ color: '#725d42' }}
            >
              {cbtAnalysis ? (
                <p>{cbtAnalysis}</p>
              ) : (
                <p className="text-center" style={{ color: '#c4b89e' }}>
                  分析正在生成中…
                </p>
              )}
            </div>
          </Card>
        </motion.div>

        {/* Proceed button */}
        <motion.div
          className="text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.0, duration: 0.5 }}
        >
          <Button
            type="primary"
            size="large"
            onClick={() => navigateTo('battle')}
          >
            ✨ 正式开启心灵大扫除！
          </Button>
        </motion.div>
      </div>
    </GameLayout>
  );
}
