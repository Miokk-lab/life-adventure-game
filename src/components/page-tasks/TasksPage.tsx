import { useState } from 'react';
import { useAdventureStore } from '../../stores/useAdventureStore';
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
import type { DailyTask } from '../../types';

export default function TasksPage() {
  const tasks = useAdventureStore((s) => s.tasks);
  const completeTask = useAdventureStore((s) => s.completeTask);
  const exp = useAdventureStore((s) => s.exp);
  const chapter = useAdventureStore((s) => s.chapter);
  const addExp = useAdventureStore((s) => s.addExp);
  const incrementWeeklyTask = useAdventureStore((s) => s.incrementWeeklyTask);
  const weeklyProgress = useAdventureStore((s) => s.weeklyProgress);

  const [active, setActive] = useState<{ type: string; task: DailyTask } | null>(null);

  const completedCount = tasks.filter(t => t.completed).length;
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

  return (
    <div className="space-y-4">
      {/* Weekly Progress */}
      {weeklyProgress && (
        <Card color="app-teal">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-xs font-extrabold" style={{ color: '#fff9e3' }}>📊 周目标进度</h3>
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
          <h3 className="text-sm font-extrabold" style={{ color: '#fff9e3' }}>⭐ 岛民等级</h3>
          <span className="text-xs font-bold px-3 py-1 rounded-full" style={{ background: 'rgba(255,255,255,0.3)', color: '#fff9e3' }}>Lv.{chapter}</span>
        </div>
        <ProgressBar value={exp} max={chapter===3?300:chapter===2?200:100} colorClass="bar-exp" label="EXP" />
      </Card>

      {/* Tasks */}
      <h3 className="text-sm font-extrabold" style={{ color: '#725d42' }}>📋 每日现实行动 ({completedCount}/{tasks.length})</h3>
      {tasks.length === 0 ? (
        <Card className="text-center py-8"><p className="text-sm" style={{ color: '#c4b89e' }}>任务加载中…</p></Card>
      ) : (
        <div className="space-y-3">
          {tasks.map((task, i) => (
            <motion.div key={task.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
              <Card color={task.completed ? 'app-teal' : 'default'}>
                <Collapse question={<span className={task.completed?'line-through opacity-60':''}>{task.completed?'✅':'⬜'} {task.description}</span>}
                  answer={<div>
                    <div className="flex gap-2 text-xs font-semibold mb-2">
                      {task.reward.exp && <span style={{ color: '#f5c31c' }}>⭐ +{task.reward.exp} EXP</span>}
                      {task.reward.coins && <span style={{ color: '#b3a046' }}>🪙 +{task.reward.coins}</span>}
                    </div>
                    <Button type="primary" size="small" onClick={() => launchGame(task)}>🎮 {task.completed ? '再来一次' : '开始小游戏'}</Button>
                    {task.completed && <span className="text-[10px] ml-2 font-bold" style={{ color: '#6fba2c' }}>已完成 ✓ (可重复)</span>}
                  </div>} />
              </Card>
            </motion.div>
          ))}
        </div>
      )}

      {/* ── Template Modals ── */}
      {active?.type === 'breathing' && (
        <BreathingCircle title="呼吸练习" description={active.task.description} themeText="跟随呼吸节奏，完成3个循环" onComplete={() => finishTask(active.task)} onClose={() => setActive(null)} />
      )}
      {active?.type === 'sorting' && (
        <SortBaskets title="思绪整理" description={active.task.description}
          items={[{text:'我能控制的事',basket:'a'},{text:'我无法控制的事',basket:'b'},{text:'今天的焦虑来源',basket:'b'},{text:'我可以做的一小步',basket:'a'}]}
          baskets={[{key:'a',label:'我的事',emoji:'🟢'},{key:'b',label:'放下',emoji:'🔵'}]}
          onComplete={() => finishTask(active.task)} onClose={() => setActive(null)} />
      )}
      {active?.type === 'writing' && (
        <LetterWrite title="给心魔写信" description={active.task.description} placeholder="亲爱的心魔，我想对你说…" onComplete={() => finishTask(active.task)} onClose={() => setActive(null)} />
      )}
      {active?.type === 'action' && (
        <WaterDrink title="一杯水的时间" description={active.task.description} themeText="每喝一口，感受水的温度和流动" onComplete={() => finishTask(active.task)} onClose={() => setActive(null)} />
      )}
      {active?.type === 'gratitude' && (
        <GratitudePetals title="感恩记录" description={active.task.description} petals={['感恩1','感恩2','感恩3']} onComplete={() => finishTask(active.task)} onClose={() => setActive(null)} />
      )}
      {active?.type === 'movement' && (
        <AutoTimer title="身体觉察" description={active.task.description} themeText="放松身体，跟随自动倒计时" duration={60} onComplete={() => finishTask(active.task)} onClose={() => setActive(null)} />
      )}
    </div>
  );
}
