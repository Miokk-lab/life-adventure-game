import type { DailyTask, WorryCategory } from '../types';
import { generateDailyTasks } from '../data/quests';

export function getQuestProgress(task: DailyTask): number {
  return task.target > 0 ? Math.min(1, task.progress / task.target) : 0;
}

export function canCompleteTask(task: DailyTask): boolean {
  return !task.completed && task.progress >= task.target;
}

export function getRewardText(task: DailyTask): string {
  const parts: string[] = [];
  if (task.reward.exp) parts.push(`⭐ +${task.reward.exp} EXP`);
  if (task.reward.coins) parts.push(`🪙 +${task.reward.coins}`);
  if (task.reward.mpBonus) parts.push(`💙 MP上限 +${task.reward.mpBonus}`);
  return parts.join(' · ') || '无奖励';
}

export function getWeeklyProgress(tasks: DailyTask[]): number {
  return tasks.filter((t) => t.completed).length;
}

export function getWeeklyTarget(): number {
  return 7;
}

export function isWeeklyComplete(tasks: DailyTask[]): boolean {
  return getWeeklyProgress(tasks) >= getWeeklyTarget();
}

export { generateDailyTasks };
