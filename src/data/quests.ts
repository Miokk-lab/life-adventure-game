import type { DailyTask, WorryCategory } from '../types';
import { getWorryContent } from './worryContent';

function getDateSeed(): number {
  const d = new Date();
  return d.getFullYear() * 10000 + (d.getMonth() + 1) * 100 + d.getDate();
}

function seededRandom(seed: number): () => number {
  let s = seed;
  return () => { s = (s * 16807 + 0) % 2147483647; return (s - 1) / 2147483646; };
}

export function generateDailyTasks(worryType: WorryCategory, _chapter: number, language = 'zh'): DailyTask[] {
  const content = getWorryContent(worryType, language);
  const seed = getDateSeed();
  const rand = seededRandom(seed);
  // Pick 3-5 tasks from this worry type's pool
  const count = Math.min(3 + Math.floor(rand() * 3), content.tasks.length);
  const shuffled = [...content.tasks].sort(() => rand() - 0.5);
  const selected = shuffled.slice(0, count);

  return selected.map((tmpl, i) => {
    const descIdx = Math.floor(rand() * tmpl.descriptions.length);
    return {
      id: `task_${worryType}_${seed}_${i}`,
      type: tmpl.type,
      description: tmpl.descriptions[descIdx],
      progress: 0,
      target: tmpl.targets[descIdx],
      completed: false,
      reward: { ...tmpl.rewards[descIdx] },
    };
  });
}
