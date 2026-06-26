/**
 * Agent 1: Text Content Generation (DeepSeek)
 * Takes user worry text + category → generates all game text content + English prompts for Agents 2 & 3
 */

export interface TextContent {
  // Game content (Chinese)
  heroName: string;
  heroStory: string;
  heroSkills: string[];
  monsterName: string;
  monsterStory: string;
  monsterAttacks: string[];
  cbtAnalysis: string;
  victoryText: string;
  // English prompts for image/video agents
  imagePromptHero: string;
  imagePromptMonster: string;
  animationPrompt: string;
}

export async function generateTextContent(
  worryText: string,
  worryType: string,
  apiKey: string,
): Promise<TextContent> {
  const systemPrompt = `你是一位心理治疗师兼动森风格游戏设计师。根据用户烦恼生成完整的游戏内容。

输出ONLY JSON，无markdown或额外文本：
{
  "heroName": "英雄名字（动森风格可爱动物）",
  "heroStory": "英雄背景故事（约100字，温暖励志）",
  "heroSkills": ["技能1名", "技能2名", "技能3名", "技能4名"],
  "monsterName": "心魔名字（动森风格可爱但有威胁的生物）",
  "monsterStory": "心魔背景故事及攻击习性（约100字）",
  "monsterAttacks": ["攻击1描述", "攻击2描述", "攻击3描述"],
  "cbtAnalysis": "CBT一体两面分析：先认可烦恼背后的正向品质，再给出认知重构视角（约400字，中文）",
  "victoryText": "通关胜利叙事文本（约200字，描述心魔被净化的过程，温暖治愈风）",
  "imagePromptHero": "英文prompt for hero image generation (2-3 sentences, describe visual characteristics, style, emotions)",
  "imagePromptMonster": "英文prompt for monster image generation (2-3 sentences, describe visual characteristics, style, emotions)",
  "animationPrompt": "英文prompt describing the victory animation (hero defeating/purifying monster, transformation, healing light, 2-3 sentences)"
}

Rules:
- 语言：游戏内容用中文，图像/动画prompt用英文
- 风格：温暖、可爱、治愈，禁止负面词汇
- 英雄：应与烦恼形成正向对应关系（如时间焦虑→沉稳慢速动物）
- 心魔：将烦恼具象化为可爱但有威胁感的生物
- Prompt需包含：Animal Crossing style, 512x512px, transparent background等关键词`;

  const userPrompt = `烦恼分类：${worryType}
用户烦恼：${worryText}`;

  try {
    const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt },
        ],
        temperature: 0.7,
        max_tokens: 2000,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`DeepSeek API error: ${response.status} ${JSON.stringify(errorData)}`);
    }

    const data = await response.json();
    const content = data?.choices?.[0]?.message?.content ?? '{}';

    // Parse JSON (strip markdown if present)
    const jsonStr = content
      .replace(/^```json\n?/, '')
      .replace(/\n?```$/, '')
      .trim();
    const json = JSON.parse(jsonStr);

    return {
      heroName: json.heroName || 'Unknown Hero',
      heroStory: json.heroStory || '',
      heroSkills: json.heroSkills || [],
      monsterName: json.monsterName || 'Unknown Monster',
      monsterStory: json.monsterStory || '',
      monsterAttacks: json.monsterAttacks || [],
      cbtAnalysis: json.cbtAnalysis || '',
      victoryText: json.victoryText || '',
      imagePromptHero: json.imagePromptHero || '',
      imagePromptMonster: json.imagePromptMonster || '',
      animationPrompt: json.animationPrompt || '',
    } as TextContent;
  } catch (error) {
    console.error('textContentAgent error:', error);
    throw error;
  }
}
