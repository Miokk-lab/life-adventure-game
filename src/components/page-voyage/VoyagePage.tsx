import { useState, useEffect } from 'react';
import { useGameStore } from '../../stores/useGameStore';
import { useAdventureStore } from '../../stores/useAdventureStore';
import { Loading, Typewriter, Modal, Button, Card } from 'animal-island-ui';
import { motion } from 'motion/react';
import { getOfflinePreset } from '../../data/presets';

const PHASES = [
  { pct: 25, text: '你内心原本宁静的岛屿，住着很多可爱的小动物。但因为烦恼化作心魔，迷雾笼罩了这片土地…' },
  { pct: 50, text: '小动物们陷入混乱，内心呼唤守护者登场…你的英雄正在赶来！' },
  { pct: 75, text: '这股烦恼将你带向了心魔的专属岛屿…准备直面内心！' },
  { pct: 100, text: '靠岸！准备直面内心，找回平静！' },
];

export default function VoyagePage() {
  const worryText = useGameStore((s) => s.worryText);
  const worryType = useGameStore((s) => s.worryType);
  const navigateTo = useGameStore((s) => s.navigateTo);
  const setAdventureData = useAdventureStore((s) => s.setAdventureData);
  const setTasks = useAdventureStore((s) => s.setTasks);

  const [progress, setProgress] = useState(0);
  const [phaseIndex, setPhaseIndex] = useState(0);
  const [showTimeout, setShowTimeout] = useState(false);
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (done) return;
    const interval = setInterval(() => {
      setProgress((prev) => {
        const next = prev + Math.random() * 6 + 3;
        if (next >= 100) { clearInterval(interval); return 100; }
        return next;
      });
    }, 500);
    const timeout = setTimeout(() => setShowTimeout(true), 12000);
    return () => { clearInterval(interval); clearTimeout(timeout); };
  }, [done]);

  useEffect(() => {
    for (let i = PHASES.length - 1; i >= 0; i--) {
      if (progress >= PHASES[i].pct) { setPhaseIndex(i); break; }
    }
  }, [progress]);

  useEffect(() => {
    if (progress >= 100 && !done) {
      setDone(true);
      const preset = getOfflinePreset(worryText, worryType ?? 'work_stress');
      setTimeout(() => {
        setAdventureData({
          hero: preset.hero,
          monster: preset.monster,
          cbtAnalysis: preset.cbtAnalysis,
          victoryText: preset.victoryText,
          victoryVideoUrl: '',
          battleSkills: preset.skills,
        });
        setTasks(preset.tasks);
        navigateTo('analysis');
      }, 1500);
    }
  }, [progress, done]);

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden">
      {/* Coconut tree Loading background overlay */}
      <div className="absolute inset-0">
        <Loading active style={{ position: 'absolute', inset: 0, height: '100%' }} />
      </div>

      {/* Content overlay */}
      <div className="relative z-10 w-full max-w-lg mx-auto px-4 text-center">
        <motion.div className="text-6xl mb-6"
          animate={{ y: [0, -10, 0], rotate: [-2, 2, -2] }}
          transition={{ duration: 3, repeat: Infinity }}>
          ⛵
        </motion.div>

        <div className="mb-6">
          <div className="w-full h-4 rounded-full overflow-hidden border-3 mx-auto"
            style={{ borderColor: '#725D42', background: 'rgba(255,255,255,0.6)' }}>
            <motion.div className="h-full rounded-full"
              style={{ background: 'linear-gradient(90deg, #19c8b9, #3dd4c6)', width: `${progress}%` }} />
          </div>
          <p className="text-xs font-bold mt-2" style={{ color: '#5D4037' }}>
            {Math.round(progress)}% — 航向迷雾之岛
          </p>
        </div>

        <Card className="text-left shadow-[0_8px_0_0_#C4B89E] border-4 border-[#725D42] rounded-[32px] bg-white/90">
          <Typewriter speed={45} trigger={phaseIndex}>
            {PHASES[phaseIndex]?.text ?? ''}
          </Typewriter>
        </Card>
      </div>

      {showTimeout && (
        <Modal open title="🌊 海上风浪很大" onClose={() => setShowTimeout(false)} footer={null}>
          <div className="text-center py-4">
            <p className="text-lg font-bold mb-4" style={{ color: '#725d42' }}>最近海上风浪很大，信号不太好…</p>
            <p className="text-sm mb-6" style={{ color: '#9f927d' }}>等待继续航行，还是前往最近的小岛？</p>
            <div className="flex gap-3 justify-center">
              <Button type="default" onClick={() => setShowTimeout(false)}>⏳ 继续等待</Button>
              <Button type="primary" onClick={() => { setShowTimeout(false); setProgress(100); }}>🏝️ 前往最近小岛</Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
