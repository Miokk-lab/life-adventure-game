import { useState } from 'react';
import { useAdventureStore } from '../../stores/useAdventureStore';
import { Button, Card, Collapse, Modal } from 'animal-island-ui';
import { motion } from 'motion/react';
import ProgressBar from '../shared/ProgressBar';
import BreathingMiniGame from '../minigames/BreathingMiniGame';
import SortingMiniGame from '../minigames/SortingMiniGame';
import { playResolve, playCollect } from '../../systems/soundEngine';
import type { DailyTask } from '../../types';

export default function TasksPage() {
  const tasks = useAdventureStore((s) => s.tasks);
  const completeTask = useAdventureStore((s) => s.completeTask);
  const exp = useAdventureStore((s) => s.exp);
  const chapter = useAdventureStore((s) => s.chapter);
  const addCoins = useAdventureStore((s) => s.addCoins);
  const restoreHp = useAdventureStore((s) => s.restoreHp);
  const incrementWeeklyTask = useAdventureStore((s) => s.incrementWeeklyTask);
  const weeklyProgress = useAdventureStore((s) => s.weeklyProgress);

  const [activeGame, setActiveGame] = useState<{ type: string; task: DailyTask } | null>(null);
  const [waterSips, setWaterSips] = useState(0);
  const [gratitudeTexts, setGratitudeTexts] = useState(['', '', '']);
  const [stretchTimer, setStretchTimer] = useState(0);

  const completedCount = tasks.filter((t) => t.completed).length;
  const weekPct = weeklyProgress
    ? Math.min(100, Math.round((weeklyProgress.tasksCompletedThisWeek / weeklyProgress.weeklyTarget) * 100))
    : 0;

  const finishTask = (task: DailyTask) => {
    completeTask(task.id); // handles stamina cost, +20 shells, +5 MP, +EXP
    incrementWeeklyTask();
    playResolve();
    setActiveGame(null);
    setWaterSips(0);
    setGratitudeTexts(['', '', '']);
    setStretchTimer(0);
  };

  const launchGame = (task: DailyTask) => {
    playCollect();
    setActiveGame({ type: task.type, task });
  };

  const waterTarget = 5;
  const gratitudeDone = gratitudeTexts.every(t => t.trim().length > 0);
  const stretchDone = stretchTimer >= 60;

  return (
    <div className="space-y-4">
      {/* Weekly Progress Bar */}
      {weeklyProgress && (
        <Card color="app-teal">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-xs font-extrabold" style={{ color: '#fff9e3' }}>📊 周目标进度</h3>
            <span className="text-xs font-bold" style={{ color: '#fff9e3' }}>
              {weeklyProgress.tasksCompletedThisWeek} / {weeklyProgress.weeklyTarget}
            </span>
          </div>
          <div className="w-full h-4 rounded-full overflow-hidden border-2"
            style={{ background: '#F2EDE0', borderColor: '#725D42' }}>
            <motion.div
              className="h-full rounded-full transition-all duration-500"
              animate={{ width: `${weekPct}%` }}
              style={{ background: 'linear-gradient(90deg, #8CC63F, #19C8B9)' }}
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
        <ProgressBar value={exp} max={chapter === 3 ? 300 : chapter === 2 ? 200 : 100} colorClass="bar-exp" label="EXP" />
      </Card>

      {/* Daily Tasks */}
      <h3 className="text-sm font-extrabold" style={{ color: '#725d42' }}>
        📋 每日现实行动 ({completedCount}/{tasks.length})
      </h3>

      {tasks.length === 0 ? (
        <Card className="text-center py-8"><p className="text-sm" style={{ color: '#c4b89e' }}>任务加载中…</p></Card>
      ) : (
        <div className="space-y-3">
          {tasks.map((task, i) => (
            <motion.div key={task.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
              <Card color={task.completed ? 'app-teal' : 'default'}>
                <Collapse
                  question={<span className={task.completed ? 'line-through opacity-60' : ''}>{task.completed ? '✅' : '⬜'} {task.description}</span>}
                  answer={
                    <div>
                      <div className="flex gap-2 text-xs font-semibold mb-2">
                        {task.reward.exp && <span style={{ color: '#f5c31c' }}>⭐ +{task.reward.exp} EXP</span>}
                        {task.reward.coins && <span style={{ color: '#b3a046' }}>🪙 +{task.reward.coins} 铃钱</span>}
                      </div>
                      <p className="text-[10px] mb-2" style={{ color: '#9f927d' }}>进度: {task.progress}/{task.target}</p>
                      {!task.completed && (
                        <Button type="primary" size="small" onClick={() => launchGame(task)}>
                          🎮 开始小游戏
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

      {/* ── Breathing Mini-Game Modal ── */}
      {activeGame?.type === 'breathing' && (
        <BreathingMiniGame
          taskTitle={activeGame.task.description}
          taskDescription="跟随呼吸节奏，完成3个循环"
          onComplete={() => finishTask(activeGame.task)}
          onClose={() => setActiveGame(null)}
        />
      )}

      {/* ── Sorting Mini-Game Modal ── */}
      {activeGame?.type === 'sorting' && (
        <SortingMiniGame
          taskTitle={activeGame.task.description}
          taskDescription="将思绪分类到正确的篮子"
          onComplete={() => finishTask(activeGame.task)}
          onClose={() => setActiveGame(null)}
        />
      )}

      {/* ── Writing Mini-Game Modal ── */}
      {activeGame?.type === 'writing' && (
        <Modal open title="✍️ 给心魔写信" footer={null} onClose={() => setActiveGame(null)} width={520}>
          <div className="py-6 px-4 text-center max-w-md mx-auto">
            <p className="text-sm mb-4" style={{ color: '#725d42' }}>{activeGame.task.description}</p>
            <textarea
              className="w-full h-32 p-3 rounded-xl border-2 resize-none text-sm"
              style={{ borderColor: '#e8dcc8', background: '#fdfaf3', color: '#725d42' }}
              placeholder="亲爱的心魔，我想对你说…"
            />
            <Button type="primary" size="large" className="mt-3" onClick={() => finishTask(activeGame.task)}>
              📬 投递到树洞
            </Button>
          </div>
        </Modal>
      )}

      {/* ── Action/Water Drink Mini-Game ── */}
      {activeGame?.type === 'action' && (
        <Modal open title="💧 一杯水的时间" footer={null} onClose={() => { setActiveGame(null); setWaterSips(0); }} width={480}>
          <div className="py-6 px-4 text-center max-w-sm mx-auto">
            <p className="text-sm mb-4" style={{ color: '#725d42' }}>{activeGame.task.description}</p>
            {/* Cup visualization */}
            <div className="relative w-24 h-32 mx-auto mb-4 rounded-b-2xl border-4 border-[#725D42] overflow-hidden bg-white/50">
              <motion.div
                className="absolute bottom-0 left-0 right-0"
                animate={{ height: `${(waterSips / waterTarget) * 100}%` }}
                style={{ background: 'linear-gradient(180deg, #5b9bd5, #7ab8f5)', transition: 'height 0.3s' }}
              />
            </div>
            <p className="text-lg font-extrabold mb-4" style={{ color: '#5b9bd5' }}>
              {waterSips >= waterTarget ? '🎉 喝完啦！' : `${waterSips}/${waterTarget} 口`}
            </p>
            {waterSips < waterTarget ? (
              <Button type="primary" size="large" onClick={() => setWaterSips(s => s + 1)}>
                🥤 喝一口
              </Button>
            ) : (
              <Button type="primary" size="large" onClick={() => finishTask(activeGame.task)}>
                ✅ 完成！领取奖励
              </Button>
            )}
          </div>
        </Modal>
      )}

      {/* ── Gratitude Mini-Game ── */}
      {activeGame?.type === 'gratitude' && (
        <Modal open title="🙏 感恩三件事" footer={null} onClose={() => { setActiveGame(null); setGratitudeTexts(['', '', '']); }} width={500}>
          <div className="py-6 px-4 text-center max-w-sm mx-auto">
            <p className="text-sm mb-4" style={{ color: '#725d42' }}>{activeGame.task.description}</p>
            {[0, 1, 2].map(i => (
              <input
                key={i}
                className="w-full p-3 mb-2 rounded-xl border-2 text-sm"
                style={{ borderColor: '#e8dcc8', background: '#fdfaf3', color: '#725d42' }}
                placeholder={`第${i + 1}件感恩的事…`}
                value={gratitudeTexts[i]}
                onChange={e => {
                  const n = [...gratitudeTexts]; n[i] = e.target.value; setGratitudeTexts(n);
                }}
              />
            ))}
            <Button type="primary" size="large" className="mt-3" disabled={!gratitudeDone}
              onClick={() => finishTask(activeGame.task)}>
              💛 记录完毕
            </Button>
          </div>
        </Modal>
      )}

      {/* ── Movement/Stretch Mini-Game ── */}
      {activeGame?.type === 'movement' && (
        <Modal open title="🧘 身体觉察" footer={null} onClose={() => { setActiveGame(null); setStretchTimer(0); }} width={480}>
          <div className="py-6 px-4 text-center max-w-sm mx-auto">
            <p className="text-sm mb-4" style={{ color: '#725d42' }}>{activeGame.task.description}</p>
            <motion.div className="text-6xl mb-4"
              animate={{ rotate: [0, 10, -10, 0], scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity }}>🧘</motion.div>
            <p className="text-lg font-extrabold mb-4" style={{ color: '#6fba2c' }}>
              {stretchTimer >= 60 ? '✨ 完成！' : `伸展中… ${stretchTimer}秒 / 60秒`}
            </p>
            {stretchTimer < 60 ? (
              <div className="flex gap-3 justify-center">
                <Button type="default" onClick={() => setStretchTimer(s => Math.min(s + 15, 60))}>+15秒 伸展</Button>
                <Button type="primary" onClick={() => setStretchTimer(60)}>快速完成</Button>
              </div>
            ) : (
              <Button type="primary" size="large" onClick={() => finishTask(activeGame.task)}>✅ 完成！领取奖励</Button>
            )}
          </div>
        </Modal>
      )}
    </div>
  );
}
