import { useEffect } from 'react';
import { useGameStore } from '../../stores/useGameStore';
import { useAdventureStore } from '../../stores/useAdventureStore';
import { Button, Card, Tabs, Title, Divider, Footer } from 'animal-island-ui';
import { motion } from 'motion/react';
import { useTranslations } from '../../i18n';
import { VICTORY_VIDEO_MAP } from '../../data/presets';
import { pauseAmbient, resumeAmbient } from '../../systems/soundEngine';

export default function VictoryPage() {
  const navigateTo = useGameStore((s) => s.navigateTo);

  useEffect(() => {
    const handleFullscreenChange = () => {
      const fsElement = document.fullscreenElement || (document as any).webkitFullscreenElement || (document as any).mozFullScreenElement || (document as any).msFullscreenElement;
      if (fsElement && fsElement.tagName === 'VIDEO') {
        pauseAmbient();
      } else {
        resumeAmbient();
      }
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
    document.addEventListener('mozfullscreenchange', handleFullscreenChange);
    document.addEventListener('msfullscreenchange', handleFullscreenChange);

    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
      document.removeEventListener('mozfullscreenchange', handleFullscreenChange);
      document.removeEventListener('msfullscreenchange', handleFullscreenChange);
      resumeAmbient();
    };
  }, []);
  const hero = useAdventureStore((s) => s.hero);
  const monster = useAdventureStore((s) => s.monster);
  const victoryText = useAdventureStore((s) => s.victoryText);
  const victoryVideoUrl = useAdventureStore((s) => s.victoryVideoUrl);
  const storeWorryType = useAdventureStore((s) => s.worryType);
  const gameWorryType = useGameStore((s) => s.worryType);
  const worryType = gameWorryType || storeWorryType;
  const effectiveVideoUrl = victoryVideoUrl || VICTORY_VIDEO_MAP[worryType || ''] || '';
  const chapter = useAdventureStore((s) => s.chapter);
  const exp = useAdventureStore((s) => s.exp);
  const reset = useAdventureStore((s) => s.reset);

  const t = useTranslations().victory;

  const handleNewAdventure = () => { reset(); navigateTo('login'); };

  const tabItems = [
    {
      key: 'heroes',
      label: t.heroTab,
      children: (
        <div className="p-4">
          {hero ? (
            <Card color="app-teal" className="mb-3">
              <div className="flex items-center gap-3">
                {hero.imageUrl ? <img src={hero.imageUrl} alt={hero.name} className="w-12 h-12 object-contain" /> : <span className="text-4xl">🦸</span>}
                <div>
                  <h3 className="font-extrabold text-sm" style={{ color: '#fff9e3' }}>{hero.name}</h3>
                  <p className="text-xs break-words" style={{ color: '#725d42' }}>{hero.story}</p>
                </div>
              </div>
            </Card>
          ) : <p className="text-sm text-center py-8" style={{ color: '#c4b89e' }}>{t.noHero}</p>}
        </div>
      ),
    },
    {
      key: 'monsters',
      label: t.monsterTab,
      children: (
        <div className="p-4">
          {monster ? (
            <Card color="app-red" className="mb-3">
              <div className="flex items-center gap-3">
                {monster.imageUrl ? <img src={monster.imageUrl} alt={monster.name} className="w-12 h-12 object-contain" /> : <span className="text-4xl">👾</span>}
                <div>
                  <h3 className="font-extrabold text-sm" style={{ color: '#fff9e3' }}>{monster.name}</h3>
                  <p className="text-xs break-words" style={{ color: '#725d42' }}>{monster.story}</p>
                </div>
              </div>
            </Card>
          ) : <p className="text-sm text-center py-8" style={{ color: '#c4b89e' }}>{t.noMonster}</p>}
        </div>
      ),
    },
    {
      key: 'letters',
      label: t.letterTab,
      children: <div className="p-4"><p className="text-sm text-center py-8" style={{ color: '#c4b89e' }}>{t.letterComingSoon}</p></div>,
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
          <Title size="large" color="app-yellow">{t.pageTitle}</Title>
          <p className="text-sm mt-4 leading-relaxed" style={{ color: '#725d42' }}>
            {t.pageSubtitle}
          </p>
          <div className="flex justify-center gap-6 mt-4 text-sm font-bold" style={{ color: '#725d42' }}>
            <span>⭐ Lv.{chapter}</span>
            <span>📊 {exp} EXP</span>
          </div>
        </div>
      </motion.div>

      {effectiveVideoUrl && (
        <motion.div initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.3 }} className="mb-8">
          <Card className="rounded-[32px] p-4 shadow-[0_8px_0_0_#C4B89E] border-4 border-[#725D42]">
            <div className="relative w-full rounded-2xl overflow-hidden bg-black">
              <video
                src={effectiveVideoUrl}
                autoPlay
                muted
                controls
                loop
                className="w-full h-auto"
                style={{ maxHeight: '400px' }}
              />
            </div>
            <p className="text-center text-xs mt-3 italic" style={{ color: '#A08E75' }}>
              {t.purifyVideo}
            </p>
          </Card>
        </motion.div>
      )}

      {victoryText && (
        <motion.div initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.5 }} className="mb-8">
          <Card color="app-yellow" pattern="app-teal">
            <Title size="middle" color="brown">{t.wisdomTitle}</Title>
            <div className="mt-4 text-sm leading-relaxed max-h-[200px] overflow-y-auto break-words" style={{ color: '#725d42' }}>{victoryText}</div>
          </Card>
        </motion.div>
      )}

      <Divider type="wave-yellow" />

      <motion.div className="mb-8" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.0 }}>
        <Title size="middle" color="app-blue">{t.compendiumTitle}</Title>
        <Card className="mt-4"><Tabs items={tabItems} defaultActiveKey="heroes" leafAnimation /></Card>
      </motion.div>

      <motion.div className="text-center mb-8" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.3 }}>
        <div className="flex gap-3 justify-center flex-wrap">
          <Button type="primary" size="large" onClick={handleNewAdventure}>{t.newAdventureBtn}</Button>
          <Button type="default" size="large" onClick={() => navigateTo('login')}>{t.homeBtn}</Button>
        </div>
      </motion.div>

      <Footer type="sea" seamless />
    </div>
  );
}
