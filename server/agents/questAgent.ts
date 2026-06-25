/**
 * Agent 3: Quest Generation
 * Takes world → returns daily tasks
 */

import type { GameWorld } from './worldAgent';

export interface QuestData {
  tasks: {
    type: string;
    description: string;
    target: number;
    reward: { mpBonus?: number; coins?: number; exp?: number };
  }[];
}

export async function generateQuests(
  world: GameWorld,
  apiKey: string,
): Promise<QuestData> {
  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        systemInstruction: {
          parts: [{
            text: `你是一位动森风格的日常任务设计师。根据英雄和心魔信息生成6个日常任务，输出JSON：
{
  "tasks": [
    {
      "type": "breathing|sorting|writing|action|gratitude|movement",
      "description": "任务描述（动森风格，温暖可爱）",
      "target": 目标数字,
      "reward": { "mpBonus": MP奖励或0, "coins": 铃钱奖励, "exp": 经验奖励 }
    }
  ]
}
语言：中文，动森风格。任务应与英雄技能和心魔弱点相关联。`,
          }],
        },
        contents: [{
          parts: [{ text: `英雄：${world.heroName}，心魔：${world.monsterName}，英雄背景：${world.heroStory}` }],
        }],
      }),
    },
  );

  const data = await response.json();
  const text = data?.candidates?.[0]?.content?.parts?.[0]?.text ?? '{}';
  const json = JSON.parse(text.replace(/```json\n?/g, '').replace(/```/g, '').trim());
  return json as QuestData;
}
