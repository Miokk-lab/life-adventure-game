import { useState, useEffect, useRef, memo } from 'react';
import { useGameStore } from '../../stores/useGameStore';
import { useAdventureStore } from '../../stores/useAdventureStore';
import { useLanguageStore } from '../../stores/useLanguageStore';
import { useTranslations } from '../../i18n';
import { Loading, Typewriter, Modal, Button, Card } from 'animal-island-ui';
import { motion } from 'motion/react';
import { getOfflinePreset, VICTORY_VIDEO_MAP } from '../../data/presets';
import type { WorryCategory } from '../../types';

interface StatusResponse {
  task_id: string;
  status: 'pending' | 'text' | 'image' | 'image_complete' | 'victory_image_ready' | 'video_complete' | 'complete' | 'error' | 'fallback';
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
    battleSkillContent?: { animal: string; level: number; name: string; description: string }[];
    dailyTasks?: { type: string; description: string; target: number; reward: { mpBonus?: number; exp?: number; coins?: number } }[];
  };
}

const API_URL = 'http://localhost:3001';

const BackgroundLoading = memo(() => {
  return (
    <div className="absolute inset-0">
      <Loading active={true} className="voyage-loading" style={{ position: 'absolute', inset: 0, height: '100%' }} />
    </div>
  );
});
BackgroundLoading.displayName = 'BackgroundLoading';

export default function VoyagePage() {
  const worryText = useGameStore((s) => s.worryText);
  const worryType = useGameStore((s) => s.worryType);
  const navigateTo = useGameStore((s) => s.navigateTo);
  const language = useLanguageStore((s) => s.language);
  const setAdventureData = useAdventureStore((s) => s.setAdventureData);
  const setTasks = useAdventureStore((s) => s.setTasks);
  const saveTaskId = useAdventureStore((s) => s.setTaskId);
  const storeTaskId = useAdventureStore((s) => s.taskId);

  const tr = useTranslations();
  const t = tr.voyage;

  const [progress, setProgress] = useState(0);
  const [phaseIndex, setPhaseIndex] = useState(0);
  const [taskId, setTaskId] = useState<string | null>(null);
  const [done, setDone] = useState(false);
  const [simulatingToward, setSimulatingToward] = useState<number | null>(null);
  const [detectedText, setDetectedText] = useState<{ heroName: string; monsterName: string } | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const [isOfflineMode, setIsOfflineMode] = useState(storeTaskId === 'offline');
  const detectedTextSetRef = useRef(false);

  const phases = t.phases;

  // Helper to trigger offline/fallback state
  const switchToOfflineFallback = () => {
    const preset = getOfflinePreset('', worryType as WorryCategory, language);
    setAdventureData({
      worryType: worryType as WorryCategory,
      hero: preset.hero,
      monster: preset.monster,
      cbtAnalysis: preset.cbtAnalysis,
      victoryText: preset.victoryText,
      victoryVideoUrl: VICTORY_VIDEO_MAP[worryType as string] || '',
      battleSkills: preset.skills,
    });
    setTasks(preset.tasks);
    saveTaskId('offline');
    setIsOfflineMode(true);
  };

  // Auto-cycle story phases every 7s while loading (online mode only)
  useEffect(() => {
    if (done || isOfflineMode) return;
    const id = setInterval(() => {
      setPhaseIndex(i => (i >= phases.length - 2 ? 0 : i + 1));
    }, 7000);
    return () => clearInterval(id);
  }, [done, phases.length, isOfflineMode]);

  // Smooth progress animation engine
  useEffect(() => {
    if (simulatingToward === null || progress >= simulatingToward) return;
    const timer = setTimeout(() => {
      const step = isOfflineMode ? 1.0 : 0.4;
      setProgress(p => parseFloat(Math.min(p + step, simulatingToward as number).toFixed(1)));
    }, 120);
    return () => clearTimeout(timer);
  }, [progress, simulatingToward, isOfflineMode]);

  // Step 1: Create adventure on mount / retry (online mode only)
  useEffect(() => {
    if (!worryText || !worryType || taskId || isOfflineMode) return;

    const createAdventure = async () => {
      try {
        const res = await fetch(`${API_URL}/api/adventure/create`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ worryText, worryType, language }),
        });
        const data = await res.json();
        if (!res.ok || !data.task_id) {
          switchToOfflineFallback();
          return;
        }
        setTaskId(data.task_id);
        setSimulatingToward(65);
      } catch {
        switchToOfflineFallback();
      }
    };

    createAdventure();
  }, [worryText, worryType, taskId, retryCount, isOfflineMode]);

  // Step 2: Poll status every 2s (online mode only)
  useEffect(() => {
    if (!taskId || done || isOfflineMode) return;

    const pollInterval = setInterval(async () => {
      try {
        const res = await fetch(`${API_URL}/api/adventure/${taskId}/status`);
        const status: StatusResponse = await res.json();

        if (status.text_content && !detectedTextSetRef.current) {
          detectedTextSetRef.current = true;
          setSimulatingToward(88);
          setDetectedText({ heroName: status.text_content.heroName, monsterName: status.text_content.monsterName });
        }

        if (status.status === 'error') {
          clearInterval(pollInterval);
          switchToOfflineFallback();
          return;
        }

        if (
          status.status === 'image_complete' ||
          status.status === 'victory_image_ready' ||
          status.status === 'video_complete' ||
          status.status === 'complete' ||
          status.status === 'fallback'
        ) {
          clearInterval(pollInterval);

          const dataRes = await fetch(`${API_URL}/api/adventure/${taskId}/data`);
          const data: DataResponse = await dataRes.json();

          if (data.data) {
            const preset = getOfflinePreset('', worryType as WorryCategory, language);

            const aiSkillMap = Object.fromEntries(
              (data.data.battleSkillContent || []).map(s => [`${s.animal}_${s.level}`, s])
            );
            const battleSkills = preset.skills.map(sk => {
              const ai = aiSkillMap[`${sk.animal}_${sk.level}`];
              return ai ? { ...sk, name: ai.name, description: ai.description } : sk;
            });

            const aiTasks = data.data.dailyTasks;
            const tasks = (aiTasks && aiTasks.length >= 3)
              ? aiTasks.map((task, i) => ({
                  id: `ai_task_${i}`,
                  type: task.type,
                  description: task.description,
                  progress: 0,
                  target: task.target,
                  completed: false,
                  reward: task.reward,
                }))
              : preset.tasks;

            setAdventureData({
              worryType: worryType as WorryCategory,
              hero: {
                name: preset.hero.name,
                story: data.data.heroStory,
                skills: preset.hero.skills,
                imageUrl: data.data.heroUrl || preset.hero.imageUrl,
              },
              monster: {
                name: preset.monster.name,
                story: data.data.monsterStory,
                attacks: data.data.monsterAttacks,
                imageUrl: data.data.monsterUrl || preset.monster.imageUrl,
              },
              cbtAnalysis: data.data.cbtAnalysis,
              victoryText: data.data.victoryText,
              victoryVideoUrl: data.data.videoUrl || VICTORY_VIDEO_MAP[worryType as string] || '',
              battleSkills,
            });
            setTasks(tasks);
          }

          saveTaskId(taskId);
          setProgress(90);
          setTimeout(() => {
            setProgress(100);
            setDone(true);
            setPhaseIndex(phases.length - 1);
            setTimeout(() => navigateTo('analysis'), 1500);
          }, 400);
        }
      } catch {
        clearInterval(pollInterval);
        switchToOfflineFallback();
      }
    }, 2000);

    return () => clearInterval(pollInterval);
  }, [taskId, done, setAdventureData, navigateTo, saveTaskId, isOfflineMode, worryType, language, phases.length]);

  // Step 3: Offline / Fallback Playback Flow
  useEffect(() => {
    if (!isOfflineMode || done) return;

    setDone(false);
    setErrorMsg(null);

    const preset = getOfflinePreset('', worryType as WorryCategory, language);
    const phaseDuration = 4000; // 4 seconds per phase

    setPhaseIndex(0);
    setSimulatingToward(25);

    const interval = setInterval(() => {
      setPhaseIndex(currentPhase => {
        const nextPhase = currentPhase + 1;
        if (nextPhase < phases.length - 1) {
          setSimulatingToward((nextPhase + 1) * 25);
          if (nextPhase === 1) {
            setDetectedText({ heroName: preset.hero.name, monsterName: preset.monster.name });
          }
          return nextPhase;
        } else {
          clearInterval(interval);
          setSimulatingToward(100);
          setDetectedText({ heroName: preset.hero.name, monsterName: preset.monster.name });
          setTimeout(() => {
            setProgress(100);
            setDone(true);
            setTimeout(() => {
              navigateTo('analysis');
            }, 1500);
          }, 1000);
          return phases.length - 1;
        }
      });
    }, phaseDuration);

    return () => clearInterval(interval);
  }, [isOfflineMode, phases.length, worryType, language, navigateTo]);

  const handleRetry = () => {
    detectedTextSetRef.current = false;
    setErrorMsg(null);
    setProgress(0);
    setSimulatingToward(null);
    setTaskId(null);
    setDone(false);
    setDetectedText(null);
    setRetryCount(c => c + 1);
    setIsOfflineMode(false);
  };

  const handleGoOffline = () => {
    switchToOfflineFallback();
  };

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden">
      <BackgroundLoading />

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
              style={{ background: 'linear-gradient(90deg, #19c8b9, #3dd4c6)' }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.8, ease: 'easeOut' }} />
          </div>
          <p className="text-sm font-extrabold mt-2" style={{ color: '#f8f8f0', textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}>
            {Math.round(progress)}% — {t.progressLabel}
          </p>
        </div>

        <Card className="text-left shadow-[0_8px_0_0_#C4B89E] border-4 border-[#725D42] rounded-[32px] bg-white/90">
          <Typewriter speed={45} trigger={phaseIndex}>
            {phases[phaseIndex] ?? ''}
          </Typewriter>
          {detectedText && (
            <p className="text-xs font-bold mt-2" style={{ color: '#19c8b9' }}>
              {t.heroReady.replace('{hero}', detectedText.heroName).replace('{monster}', detectedText.monsterName)}
            </p>
          )}
        </Card>
      </div>

      {/* Error modal */}
      {errorMsg && (
        <Modal open title={t.errorModal.title} typewriter={false} onClose={() => {}} footer={null}>
          <div className="text-center py-4">
            <p className="text-sm mb-6" style={{ color: '#725d42' }}>{errorMsg}</p>
            <div className="flex gap-3 justify-center">
              <Button type="default" onClick={handleRetry}>{t.errorModal.retry}</Button>
              <Button type="primary" onClick={handleGoOffline}>{t.errorModal.offline}</Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
