import { useGameStore } from '../../stores/useGameStore';
import { useAdventureStore } from '../../stores/useAdventureStore';
import { Button, Card, Tabs, Title, Divider, Footer } from 'animal-island-ui';
import { motion } from 'motion/react';

export default function VictoryPage() {
  const navigateTo = useGameStore((s) => s.navigateTo);
  const hero = useAdventureStore((s) => s.hero);
  const monster = useAdventureStore((s) => s.monster);
  const victoryText = useAdventureStore((s) => s.victoryText);
  const chapter = useAdventureStore((s) => s.chapter);
  const exp = useAdventureStore((s) => s.exp);
  const reset = useAdventureStore((s) => s.reset);

  const handleNewAdventure = () => { reset(); navigateTo('login'); };

  const tabItems = [
    {
      key: 'heroes',
      label: '🦸 英雄',
      children: (
        <div className="p-4">
          {hero ? (
            <Card color="app-teal" className="mb-3">
              <div className="flex items-center gap-3">
                <span className="text-4xl">🦸</span>
                <div>
                  <h3 className="font-extrabold text-sm" style={{ color: '#fff9e3' }}>{hero.name}</h3>
                  <p className="text-xs break-words" style={{ color: '#725d42' }}>{hero.story}</p>
                </div>
              </div>
            </Card>
          ) : <p className="text-sm text-center py-8" style={{ color: '#c4b89e' }}>还没有解锁的英雄。</p>}
        </div>
      ),
    },
    {
      key: 'monsters',
      label: '👾 心魔',
      children: (
        <div className="p-4">
          {monster ? (
            <Card color="app-red" className="mb-3">
              <div className="flex items-center gap-3">
                <span className="text-4xl">👾</span>
                <div>
                  <h3 className="font-extrabold text-sm" style={{ color: '#fff9e3' }}>{monster.name}</h3>
                  <p className="text-xs break-words" style={{ color: '#725d42' }}>{monster.story}</p>
                </div>
              </div>
            </Card>
          ) : <p className="text-sm text-center py-8" style={{ color: '#c4b89e' }}>还没有被净化的心魔。</p>}
        </div>
      ),
    },
    {
      key: 'letters',
      label: '💌 信件',
      children: <div className="p-4"><p className="text-sm text-center py-8" style={{ color: '#c4b89e' }}>信件存档功能即将开放…</p></div>,
    },
  ];

  return (
    <div className="max-w-3xl mx-auto px-4 py-6">
      <motion.div className="text-center mb-8 p-8 rounded-3xl relative overflow-hidden"
        style={{ background: 'linear-gradient(180deg, #fff9c4, #e1f5fe, #f3e5f5)', border: '3px solid #e8e2d6' }}
        initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.6 }}>
        <div className="absolute top-0 left-0 right-0 h-24 opacity-30"
          style={{ background: 'linear-gradient(180deg, #ff0000, #ff7700, #ffff00, #00ff00, #0077ff, #4b0082, #8b00ff)', borderRadius: '0 0 50% 50%' }} />
        <div className="relative z-10">
          <motion.div className="text-6xl mb-4" animate={{ rotate: [0, 5, -5, 0], scale: [1, 1.1, 1] }} transition={{ duration: 3, repeat: Infinity }}>🌈</motion.div>
          <Title size="large" color="app-yellow">丰收祭：彩虹奇迹广场</Title>
          <p className="text-sm mt-4 leading-relaxed" style={{ color: '#725d42' }}>
            阳光洒满全岛，巨大彩虹横跨，花瓣漫天飞舞。你成功面对了自己的烦恼。
          </p>
          <div className="flex justify-center gap-6 mt-4 text-sm font-bold" style={{ color: '#725d42' }}>
            <span>⭐ Lv.{chapter}</span>
            <span>📊 {exp} EXP</span>
          </div>
        </div>
      </motion.div>

      {victoryText && (
        <motion.div initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.5 }} className="mb-8">
          <Card color="app-yellow" pattern="app-teal">
            <Title size="middle" color="brown">📖 哲理升华</Title>
            <div className="mt-4 text-sm leading-relaxed max-h-[200px] overflow-y-auto break-words" style={{ color: '#725d42' }}>{victoryText}</div>
          </Card>
        </motion.div>
      )}

      <Divider type="wave-yellow" />

      <motion.div className="mb-8" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.0 }}>
        <Title size="middle" color="app-blue">📚 岛屿图鉴</Title>
        <Card className="mt-4"><Tabs items={tabItems} defaultActiveKey="heroes" leafAnimation /></Card>
      </motion.div>

      <motion.div className="text-center mb-8" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.3 }}>
        <div className="flex gap-3 justify-center flex-wrap">
          <Button type="primary" size="large" onClick={handleNewAdventure}>🆕 开启新冒险</Button>
          <Button type="default" size="large" onClick={() => navigateTo('login')}>🏠 返回首页</Button>
        </div>
      </motion.div>

      <Footer type="sea" />
    </div>
  );
}
