import { useState } from 'react';
import { useAdventureStore } from '../../stores/useAdventureStore';
import { useGameStore } from '../../stores/useGameStore';
import { Button, Card, Collapse } from 'animal-island-ui';
import { motion } from 'motion/react';
import ProgressBar from '../shared/ProgressBar';
import BreathingCircle from '../templates/BreathingCircle';
import SortBaskets from '../templates/SortBaskets';
import LetterWrite from '../templates/LetterWrite';
import WaterDrink from '../templates/WaterDrink';
import GratitudePetals from '../templates/GratitudePetals';
import AutoTimer from '../templates/AutoTimer';
import { playResolve, playCollect } from '../../systems/soundEngine';
import { useTranslations } from '../../i18n';
import { OnboardingTipManager } from '../onboarding';
import type { DailyTask } from '../../types';

export default function TasksPage() {
  const tasks = useAdventureStore((s) => s.tasks);
  const completeTask = useAdventureStore((s) => s.completeTask);
  const exp = useAdventureStore((s) => s.exp);
  const chapter = useAdventureStore((s) => s.chapter);
  const incrementWeeklyTask = useAdventureStore((s) => s.incrementWeeklyTask);
  const weeklyProgress = useAdventureStore((s) => s.weeklyProgress);
  const worryType = useGameStore((s) => s.worryType);

  const tr = useTranslations();
  const t = tr.tasks;

  const [active, setActive] = useState<{ type: string; task: DailyTask } | null>(null);

  const completedCount = tasks.filter(task => task.completed).length;
  const weekPct = weeklyProgress ? Math.min(100, Math.round((weeklyProgress.tasksCompletedThisWeek / weeklyProgress.weeklyTarget) * 100)) : 0;

  const finishTask = (task: DailyTask) => {
    completeTask(task.id);
    incrementWeeklyTask();
    playResolve();
    setActive(null);
  };

  const launchGame = (task: DailyTask) => {
    playCollect();
    setActive({ type: task.type, task });
  };

  const sortData = (t.sortData as any)[worryType ?? 'emotion_management'] ?? (t.sortData as any).emotion_management;

  return (
    <div className="space-y-3">
      {/* Weekly Progress */}
      {weeklyProgress && (
        <Card color="app-teal">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-xs font-extrabold" style={{ color: '#fff9e3' }}>{t.weeklyProgress}</h3>
            <span className="text-xs font-bold" style={{ color: '#fff9e3' }}>{weeklyProgress.tasksCompletedThisWeek} / {weeklyProgress.weeklyTarget}</span>
          </div>
          <div className="w-full h-4 rounded-full overflow-hidden border-2" style={{ background: '#F2EDE0', borderColor: '#725D42' }}>
            <motion.div className="h-full rounded-full transition-all duration-500" animate={{ width: `${weekPct}%` }} style={{ background: 'linear-gradient(90deg, #8CC63F, #19C8B9)' }} />
          </div>
        </Card>
      )}

      {/* EXP */}
      <Card color="app-green">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-extrabold" style={{ color: '#fff9e3' }}>⭐ Lv.{chapter}</h3>
        </div>
        <ProgressBar value={exp} max={chapter>=3?200:chapter>=2?100:50} colorClass="bar-exp" label="EXP" />
      </Card>

      {/* Tasks */}
      <h3 className="text-sm font-extrabold" style={{ color: '#725d42' }}>{t.dailyActions} ({completedCount}/{tasks.length})</h3>
      {tasks.length === 0 ? (
        <Card className="text-center py-8"><p className="text-sm" style={{ color: '#c4b89e' }}>{t.loading}</p></Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {tasks.map((task) => (
            <Card key={task.id} color={task.completed ? 'app-teal' : 'default'}>
              <Collapse question={<span className={task.completed?'line-through opacity-60':''}>{task.completed?'✅':'⬜'} {task.description}</span>}
                answer={<div>
                  <div className="flex gap-2 text-xs font-semibold mb-2">
                    {task.reward.exp && <span style={{ color: '#f5c31c' }}>⭐ +{task.reward.exp} EXP</span>}
                    {task.reward.coins && <span style={{ color: '#b3a046' }}>🪙 +{task.reward.coins}</span>}
                  </div>
                  <Button type="primary" size="small" onClick={() => launchGame(task)}>🎮 {task.completed ? t.playAgain : t.playMiniGame}</Button>
                  {task.completed && <span className="text-[10px] ml-2 font-bold" style={{ color: '#6fba2c' }}>{t.completedLabel}</span>}
                </div>} />
            </Card>
          ))}
        </div>
      )}

      {/* ── Template Modals ── */}
      {active?.type === 'breathing' && (
        <BreathingCircle title={t.breathing.title} description={active.task.description} themeText={t.breathing.themeText} onComplete={() => finishTask(active.task)} onClose={() => setActive(null)} />
      )}
      {active?.type === 'sorting' && (
        <SortBaskets title={t.sorting.title} description={active.task.description}
          items={sortData?.items ?? []}
          baskets={sortData?.baskets ?? []}
          onComplete={() => finishTask(active.task)} onClose={() => setActive(null)} />
      )}
      {active?.type === 'writing' && (
        <LetterWrite title={t.letter.title} description={active.task.description} placeholder={t.letter.placeholder} onComplete={() => finishTask(active.task)} onClose={() => setActive(null)} />
      )}
      {active?.type === 'action' && (
        <WaterDrink title={t.water.title} description={active.task.description} themeText={t.water.themeText} onComplete={() => finishTask(active.task)} onClose={() => setActive(null)} />
      )}
      {active?.type === 'gratitude' && (
        <GratitudePetals title={t.gratitude.title} description={active.task.description} petals={[...t.gratitude.petals]} onComplete={() => finishTask(active.task)} onClose={() => setActive(null)} />
      )}
      {active?.type === 'movement' && (
        <AutoTimer title={t.body.title} description={active.task.description} themeText={t.body.themeText} duration={60} onComplete={() => finishTask(active.task)} onClose={() => setActive(null)} />
      )}
      <OnboardingTipManager triggerId="first_quest" position="bottom" />
    </div>
  );
}
