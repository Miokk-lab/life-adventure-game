import { useState, useEffect } from 'react';
import { useGameStore } from '../../stores/useGameStore';
import { useAdventureStore } from '../../stores/useAdventureStore';
import { Loading, Typewriter, Modal, Button, Card } from 'animal-island-ui';
import { motion } from 'motion/react';

interface StatusResponse {
  task_id: string;
  status: 'text' | 'image' | 'video' | 'complete' | 'error' | 'fallback';
  progress: number;
  text_content?: { heroName: string; monsterName: string; cbtAnalysis: string; victoryText: string };
  images?: { heroUrl: string; monsterUrl: string };
  video?: { videoUrl: string };
  fallback?: any;
  error?: string;
}

interface DataResponse {
  task_id: string;
  status: string;
  data?: {
    heroName: string;
    monsterName: string;
    heroStory: string;
    monsterStory: string;
    heroSkills: string[];
    monsterAttacks: string[];
    cbtAnalysis: string;
    victoryText: string;
    heroUrl: string;
    monsterUrl: string;
    videoUrl?: string;
  };
}

const STAGE_CONFIG = {
  text: { pct: 40, emoji: '✍️', label: '文字生成中…' },
  image: { pct: 70, emoji: '🎨', label: '英雄塑形中…' },
  video: { pct: 100, emoji: '🎬', label: '胜利动画烧制中…' },
  complete: { pct: 100, emoji: '✨', label: '準備完毕！' },
};

const PHASES = [
  { pct: 0, text: '你内心原本宁静的岛屿，住着很多可爱的小动物。但因为烦恼化作心魔，迷雾笼罩了这片土地…' },
  { pct: 40, text: '小动物们陷入混乱，内心呼唤守护者登场…你的英雄正在赶来！' },
  { pct: 70, text: '这股烦恼将你带向了心魔的专属岛屿…准备直面内心！' },
  { pct: 100, text: '靠岸！准备直面内心，找回平静！' },
];

const API_URL = 'http://localhost:3001';

export default function VoyagePage() {
  const worryText = useGameStore((s) => s.worryText);
  const worryType = useGameStore((s) => s.worryType);
  const navigateTo = useGameStore((s) => s.navigateTo);
  const setAdventureData = useAdventureStore((s) => s.setAdventureData);

  const [progress, setProgress] = useState(0);
  const [phaseIndex, setPhaseIndex] = useState(0);
  const [showTimeout, setShowTimeout] = useState(false);
  const [stageLabel, setStageLabel] = useState('');
  const [taskId, setTaskId] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  // Step 1: Create adventure on mount
  useEffect(() => {
    if (!worryText || !worryType || taskId) return;

    const createAdventure = async () => {
      try {
        const res = await fetch(`${API_URL}/api/adventure/create`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ worryText, worryType }),
        });
        const data = await res.json();
        if (data.task_id) {
          setTaskId(data.task_id);
        }
      } catch (err) {
        console.error('Failed to create adventure:', err);
        // Fallback to offline preset
        setProgress(100);
        setDone(true);
      }
    };

    createAdventure();
  }, [worryText, worryType, taskId]);

  // Step 2: Poll status every 2s
  useEffect(() => {
    if (!taskId || done) return;

    const startTime = Date.now();
    const pollInterval = setInterval(async () => {
      try {
        const res = await fetch(`${API_URL}/api/adventure/${taskId}/status`);
        const status: StatusResponse = await res.json();

        // Map backend stage to progress %
        const stageProgress = STAGE_CONFIG[status.status as keyof typeof STAGE_CONFIG]?.pct || 0;
        setProgress(stageProgress);
        setStageLabel(STAGE_CONFIG[status.status as keyof typeof STAGE_CONFIG]?.label || '处理中…');

        // Check timeout
        if (Date.now() - startTime > 12000) {
          clearInterval(pollInterval);
          setShowTimeout(true);
        }

        // Check completion
        if (status.status === 'complete' || status.status === 'fallback') {
          clearInterval(pollInterval);
          // Fetch full data
          const dataRes = await fetch(`${API_URL}/api/adventure/${taskId}/data`);
          const data: DataResponse = await dataRes.json();

          if (data.data) {
            // Convert skill names to SkillRef objects
            const skillAnimals = ['turtle', 'sloth', 'tiger', 'snake'];
            const skills = (data.data.heroSkills || []).map((name, i) => ({
              id: `skill_${i}`,
              name,
              animal: skillAnimals[i % 4] as any,
              level: 1 as any,
              description: name,
            }));

            setAdventureData({
              hero: {
                name: data.data.heroName,
                story: data.data.heroStory,
                skills,
                imageUrl: data.data.heroUrl,
              },
              monster: {
                name: data.data.monsterName,
                story: data.data.monsterStory,
                attacks: data.data.monsterAttacks,
                imageUrl: data.data.monsterUrl,
              },
              cbtAnalysis: data.data.cbtAnalysis,
              victoryText: data.data.victoryText,
              victoryVideoUrl: data.data.videoUrl || '',
            });
          }

          setProgress(100);
          setDone(true);
          setTimeout(() => navigateTo('analysis'), 1500);
        }
      } catch (err) {
        console.error('Poll error:', err);
      }
    }, 2000);

    return () => clearInterval(pollInterval);
  }, [taskId, done, setAdventureData, navigateTo]);

  // Update phase text based on progress
  useEffect(() => {
    for (let i = PHASES.length - 1; i >= 0; i--) {
      if (progress >= PHASES[i].pct) {
        setPhaseIndex(i);
        break;
      }
    }
  }, [progress]);

  const handleUseOffline = () => {
    setShowTimeout(false);
    setProgress(100);
    setDone(true);
  };

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden">
      {/* Coconut tree Loading background overlay */}
      <div className="absolute inset-0">
        <Loading key={Math.floor(progress / 10)} active={true} className="voyage-loading" style={{ position: 'absolute', inset: 0, height: '100%' }} />
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
          <p className="text-sm font-extrabold mt-2" style={{ color: '#f8f8f0', textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}>
            {Math.round(progress)}% — {stageLabel || '航向迷雾之岛'}
          </p>
        </div>

        <Card className="text-left shadow-[0_8px_0_0_#C4B89E] border-4 border-[#725D42] rounded-[32px] bg-white/90">
          <Typewriter speed={45} trigger={phaseIndex}>
            {PHASES[phaseIndex]?.text ?? ''}
          </Typewriter>
        </Card>
      </div>

      {showTimeout && (
        <Modal open title="🌊 海上风浪很大" typewriter={false} onClose={() => setShowTimeout(false)} footer={null}>
          <div className="text-center py-4">
            <p className="text-lg font-bold mb-4" style={{ color: '#725d42' }}>最近海上风浪很大，信号不太好…</p>
            <p className="text-sm mb-6" style={{ color: '#9f927d' }}>等待继续航行，还是前往最近的小岛？</p>
            <div className="flex gap-3 justify-center">
              <Button type="default" onClick={() => setShowTimeout(false)}>⏳ 继续等待</Button>
              <Button type="primary" onClick={handleUseOffline}>🏝️ 前往最近小岛</Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
