import { useGameStore } from '../../stores/useGameStore';
import { useAdventureStore } from '../../stores/useAdventureStore';
import { Button, Card, Checkbox, Collapse } from 'animal-island-ui';
import { motion } from 'motion/react';
import GameLayout from '../shared/GameLayout';
import ProgressBar from '../shared/ProgressBar';

export default function TasksPage() {
  const navigateTo = useGameStore((s) => s.navigateTo);
  const tasks = useAdventureStore((s) => s.tasks);
  const completeTask = useAdventureStore((s) => s.completeTask);
  const exp = useAdventureStore((s) => s.exp);
  const chapter = useAdventureStore((s) => s.chapter);
  const addExp = useAdventureStore((s) => s.addExp);
  const addCoins = useAdventureStore((s) => s.addCoins);
  const restoreHp = useAdventureStore((s) => s.restoreHp);

  const completedCount = tasks.filter((t) => t.completed).length;

  const handleCompleteTask = (taskId: string) => {
    const task = tasks.find((t) => t.id === taskId);
    if (!task || task.completed) return;
    completeTask(taskId);
    spawnMiniReward(task);
  };

  const spawnMiniReward = (task: typeof tasks[number]) => {
    if (task.reward.exp) addExp(task.reward.exp);
    if (task.reward.coins) addCoins(task.reward.coins);
    restoreHp(3);
  };

  return (
    <GameLayout showHUD>
      <div className="max-w-2xl mx-auto">
        {/* EXP + chapter progress */}
        <Card color="app-green" className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-extrabold" style={{ color: '#fff9e3' }}>
              ⭐ 岛民等级
            </h3>
            <span className="text-xs font-bold px-3 py-1 rounded-full" style={{ background: 'rgba(255,255,255,0.3)', color: '#fff9e3' }}>
              Lv.{chapter} · 第{chapter}章
            </span>
          </div>
          <ProgressBar
            value={exp}
            max={chapter === 3 ? 300 : chapter === 2 ? 200 : 100}
            colorClass="bar-exp"
            showLabel
            label="EXP"
          />
          <p className="text-xs mt-2 font-semibold opacity-80" style={{ color: '#fff9e3' }}>
            {chapter < 3
              ? `距离第${chapter + 1}章还需 ${(chapter * 100) - exp} EXP`
              : '已达最高等级！可以挑战最终Boss！'}
          </p>
        </Card>

        {/* Task list */}
        <h3 className="text-sm font-extrabold mb-3" style={{ color: '#725d42' }}>
          📋 今日日常任务 ({completedCount}/{tasks.length})
        </h3>

        {tasks.length === 0 ? (
          <Card className="text-center py-8">
            <p className="text-lg mb-2">📭</p>
            <p className="text-sm" style={{ color: '#c4b89e' }}>
              任务生成中…
            </p>
          </Card>
        ) : (
          <div className="space-y-3 mb-8">
            {tasks.map((task, i) => (
              <motion.div
                key={task.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                <Card color={task.completed ? 'app-teal' : 'default'}>
                  <Collapse
                    question={
                      <div className="flex items-center gap-2">
                        <span className={task.completed ? 'line-through opacity-60' : ''}>
                          {task.completed ? '✅' : '⬜'} {task.description}
                        </span>
                      </div>
                    }
                    answer={
                      <div>
                        <p className="text-xs mb-2" style={{ color: '#9f927d' }}>
                          进度：{task.progress}/{task.target}
                        </p>
                        <div className="flex gap-2 text-xs font-semibold mb-3">
                          {task.reward.exp && <span style={{ color: '#f5c31c' }}>⭐ +{task.reward.exp} EXP</span>}
                          {task.reward.coins && <span style={{ color: '#b3a046' }}>🪙 +{task.reward.coins} 铃钱</span>}
                          {task.reward.mpBonus && <span style={{ color: '#5b9bd5' }}>💙 MP上限 +{task.reward.mpBonus}</span>}
                        </div>
                        {!task.completed && (
                          <Button type="primary" size="small" onClick={() => handleCompleteTask(task.id)}>
                            ✅ 完成任务
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

        {/* Navigation */}
        <div className="flex gap-3 justify-center flex-wrap">
          <Button type="default" onClick={() => navigateTo('minigames')}>
            🏕️ 静心营地
          </Button>
          <Button type="default" onClick={() => navigateTo('teashop')}>
            🍵 花茶补给
          </Button>
          <Button type="primary" onClick={() => navigateTo('battle')}>
            ⚔️ 回去挑战Boss
          </Button>
        </div>
      </div>
    </GameLayout>
  );
}
