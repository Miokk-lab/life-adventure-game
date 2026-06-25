import { useAdventureStore } from '../../stores/useAdventureStore';
import { Button, Card, Collapse } from 'animal-island-ui';
import { motion } from 'motion/react';
import ProgressBar from '../shared/ProgressBar';

export default function TasksPage() {
  const tasks = useAdventureStore((s) => s.tasks);
  const completeTask = useAdventureStore((s) => s.completeTask);
  const exp = useAdventureStore((s) => s.exp);
  const chapter = useAdventureStore((s) => s.chapter);
  const addCoins = useAdventureStore((s) => s.addCoins);
  const restoreHp = useAdventureStore((s) => s.restoreHp);
  const incrementWeeklyTask = useAdventureStore((s) => s.incrementWeeklyTask);
  const weeklyProgress = useAdventureStore((s) => s.weeklyProgress);

  const completedCount = tasks.filter((t) => t.completed).length;
  const weekPct = weeklyProgress
    ? Math.min(100, Math.round((weeklyProgress.tasksCompletedThisWeek / weeklyProgress.weeklyTarget) * 100))
    : 0;

  const handleCompleteTask = (taskId: string) => {
    const task = tasks.find((t) => t.id === taskId);
    if (!task || task.completed) return;
    completeTask(taskId);
    if (task.reward.coins) addCoins(task.reward.coins);
    restoreHp(3);
    incrementWeeklyTask();
  };

  return (
    <div className="space-y-4">
      {/* Weekly Progress Bar */}
      {weeklyProgress && (
        <Card color="app-teal">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-xs font-extrabold" style={{ color: '#fff9e3' }}>
              📊 周目标进度
            </h3>
            <span className="text-xs font-bold" style={{ color: '#fff9e3' }}>
              {weeklyProgress.tasksCompletedThisWeek} / {weeklyProgress.weeklyTarget}
            </span>
          </div>
          <div className="w-full h-3 rounded-full overflow-hidden border-2"
            style={{ background: '#F2EDE0', borderColor: '#725D42' }}>
            <motion.div
              className="h-full rounded-full transition-all duration-500"
              animate={{ width: `${weekPct}%` }}
              style={{
                background: 'linear-gradient(90deg, #8CC63F, #19C8B9)',
              }}
            />
          </div>
          <div className="flex justify-between mt-2 text-[10px] font-semibold" style={{ color: 'rgba(255,255,255,0.7)' }}>
            <span>🪙 {weeklyProgress.shellsEarnedThisWeek} 贝壳</span>
            {weekPct >= 100 && !weeklyProgress.weeklyBonusClaimed && (
              <span className="animate-pulse" style={{ color: '#FFEEA6' }}>🎁 周奖励可领取!</span>
            )}
          </div>
        </Card>
      )}

      {/* EXP + chapter */}
      <Card color="app-green">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-extrabold" style={{ color: '#fff9e3' }}>⭐ 岛民等级</h3>
          <span className="text-xs font-bold px-3 py-1 rounded-full"
            style={{ background: 'rgba(255,255,255,0.3)', color: '#fff9e3' }}>
            Lv.{chapter} · 第{chapter}章
          </span>
        </div>
        <ProgressBar
          value={exp}
          max={chapter === 3 ? 300 : chapter === 2 ? 200 : 100}
          colorClass="bar-exp"
          label="EXP"
        />
      </Card>

      {/* Daily Tasks */}
      <h3 className="text-sm font-extrabold" style={{ color: '#725d42' }}>
        📋 每日现实行动 ({completedCount}/{tasks.length})
      </h3>

      {tasks.length === 0 ? (
        <Card className="text-center py-8">
          <p className="text-sm" style={{ color: '#c4b89e' }}>任务加载中…</p>
        </Card>
      ) : (
        <div className="space-y-3">
          {tasks.map((task, i) => (
            <motion.div key={task.id}
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}>
              <Card color={task.completed ? 'app-teal' : 'default'}>
                <Collapse
                  question={
                    <span className={task.completed ? 'line-through opacity-60' : ''}>
                      {task.completed ? '✅' : '⬜'} {task.description}
                    </span>
                  }
                  answer={
                    <div>
                      <div className="flex gap-2 text-xs font-semibold mb-2">
                        {task.reward.exp && <span style={{ color: '#f5c31c' }}>⭐ +{task.reward.exp} EXP</span>}
                        {task.reward.coins && <span style={{ color: '#b3a046' }}>🪙 +{task.reward.coins} 铃钱</span>}
                      </div>
                      <p className="text-[10px] mb-2" style={{ color: '#9f927d' }}>
                        进度: {task.progress}/{task.target}
                      </p>
                      {!task.completed && (
                        <Button type="primary" size="small" onClick={() => handleCompleteTask(task.id)}>
                          ✅ 完成打卡
                        </Button>
                      )}
                    </div>
                  }
                />
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
