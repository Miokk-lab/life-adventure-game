/**
 * Agent 2: Game World Generation
 * Takes analysis → returns GameWorld (hero, monster, story)
 */

import type { ProblemAnalysis } from './analyzeAgent';

export interface GameWorld {
  heroName: string;
  heroStory: string;
  heroSkills: string[];
  monsterName: string;
  monsterStory: string;
  monsterAttacks: string[];
  cbtAnalysis: string;
  victoryText: string;
}

export async function generateWorld(
  analysis: ProblemAnalysis,
  apiKey: string,
): Promise<GameWorld> {
  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        systemInstruction: {
          parts: [{
            text: `你是一位动森风格的游戏设计师。根据心理分析生成游戏世界，输出JSON：
{
  "heroName": "英雄名字（动森风格可爱动物）",
  "heroStory": "英雄背景故事（约100字）",
  "heroSkills": ["技能1名", "技能2名", "技能3名", "技能4名"],
  "monsterName": "心魔名字（动森风格的可爱反派）",
  "monsterStory": "心魔背景故事（约100字）",
  "monsterAttacks": ["攻击1描述", "攻击2描述", "攻击3描述"],
  "cbtAnalysis": "CBT一体两面正向分析（约300字）",
  "victoryText": "通关胜利叙事（约200字）"
}
语言：中文，温馨可爱。禁止负面标签化词汇。`,
          }],
        },
        contents: [{
          parts: [{ text: `分析结果：${JSON.stringify(analysis)}` }],
        }],
      }),
    },
  );

  const data = await response.json();
  const text = data?.candidates?.[0]?.content?.parts?.[0]?.text ?? '{}';
  const json = JSON.parse(text.replace(/```json\n?/g, '').replace(/```/g, '').trim());
  return json as GameWorld;
}
