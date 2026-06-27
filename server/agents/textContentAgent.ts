/**
 * Agent 1: Text Content Generation
 * Primary: DeepSeek → Fallback: Agnes AI (OpenAI-compatible)
 */

export interface BattleSkillContent {
  animal: string;
  level: number;
  name: string;
  description: string;
}

export interface AIDailyTask {
  type: string;
  description: string;
  target: number;
  reward: { mpBonus?: number; exp?: number; coins?: number };
}

export interface TextContent {
  heroName: string;
  heroStory: string;
  heroSkills: string[];
  monsterName: string;
  monsterStory: string;
  monsterAttacks: string[];
  cbtAnalysis: string;
  victoryText: string;
  imagePromptHero: string;
  imagePromptMonster: string;
  animationPrompt: string;
  victoryImagePrompt: string;
  battleSkillContent: BattleSkillContent[];
  dailyTasks: AIDailyTask[];
}

export interface AgnesTextConfig {
  agnesKey?: string;
  agnesBaseUrl?: string;
  agnesTextModel?: string;
}

const LANGUAGE_INSTRUCTIONS: Record<string, string> = {
  zh: '所有叙述文字（heroStory, monsterStory, cbtAnalysis, victoryText, heroSkills, monsterAttacks, battleSkillContent.name/description, dailyTasks.description）用中文。图像/动画prompt（imagePromptHero, imagePromptMonster, animationPrompt, victoryImagePrompt）必须用英文。',
  en: 'Output all narrative text (heroStory, monsterStory, cbtAnalysis, victoryText, heroSkills, monsterAttacks, battleSkillContent name/description, dailyTasks description) in English. Hero/monster names: use format [Adjective][Animal]"[Nickname]" e.g. "Calm Panda \'Yoyo\'". In cbtAnalysis, use 【】 section markers in English e.g. ①【See Strength】, ②【Identify Traps】, ③【Small Steps】. Image/animation prompts must be in English.',
  ja: 'すべての物語テキスト（heroStory, monsterStory, cbtAnalysis, victoryText, heroSkills, monsterAttacks, battleSkillContent.name/description, dailyTasks.description）を日本語で出力してください。ヒーロー/モンスター名は「[形容詞][動物]「[ニックネーム]」」形式。cbtAnalysisのセクションは日本語で【】マーカーを使用：①【力を見つける】, ②【罠を見抜く】, ③【小さな一歩】。画像/アニメーションプロンプト（imagePromptHero, imagePromptMonster, animationPrompt, victoryImagePrompt）は英語で。',
};

const SYSTEM_PROMPT = `你是一位CBT心理治疗师兼动森风格RPG游戏设计师。根据用户烦恼生成丰富完整的游戏内容。所有内容必须详尽、温暖、有深度。

⚠️ 动物种类对应表（必须严格遵守，不可更改）：
- work_stress（工作压力）：英雄=熊猫(panda)，心魔=啄木鸟(woodpecker)
- learning_growth（学习成长）：英雄=猫头鹰(owl)，心魔=仓鼠(hamster)
- interpersonal（人际关系）：英雄=水豚/卡皮巴拉(capybara)，心魔=刺猬(hedgehog)
- family_origin（家庭原生）：英雄=小鹿(deer)，心魔=寄居蟹(hermit crab)
- social_environment（社会环境）：英雄=树袋熊/考拉(koala)，心魔=变色龙(chameleon)
- physical_health（身体健康）：英雄=海獭(otter)，心魔=浣熊(raccoon)
- time_management（时间管理）：英雄=乌龟(turtle)，心魔=蚂蚁(ant)
- emotion_management（情绪管理）：英雄=树懒(sloth)，心魔=河豚(pufferfish)

输出ONLY JSON，无markdown或额外文本：
{
  "heroName": "英雄名字，动物种类必须严格按照上方对应表选择（不可更改）。昵称2字，可爱温暖。格式：[形容词][动物种类]「[昵称]」",
  "heroStory": "英雄背景故事（150字以上）：包含①上方动物约束表中指定的英雄动物（不可更改）的象征意义②它的处世哲学③与用户烦恼对应的治愈特质④它为何来帮助用户。语气温暖励志。",
  "heroSkills": ["技能1（3-4字，体现核心治愈能力）", "技能2", "技能3", "技能4"],
  "monsterName": "心魔名字，动物种类必须严格按照上方对应表选择（不可更改）。格式：[形容词][动物种类]「[昵称]」",
  "monsterStory": "心魔背景故事（150字以上）：包含①这种生物的来源②心魔其实在寻求什么（被理解/安全感等）③它的攻击方式背后是什么恐惧④为何它是可以被治愈的。语气同情理解。",
  "monsterAttacks": ["攻击1（10-20字，具体描述如何触发焦虑）", "攻击2", "攻击3"],
  "cbtAnalysis": "CBT心理分析（严格限制400字以内），分三小段，每段之间用空行分隔：①【第一节标题】认可烦恼背后的正向品质（1-2句）\n\n②【第二节标题】温柔点名认知扭曲并给出新视角（2-3句）\n\n③【第三节标题】一个可操作的微小建议（1-2句）。语气如知心朋友，简洁温暖。（节标题和文字语言遵循上方语言指令）",
  "victoryText": "通关胜利叙事（300字以上）：详细描述英雄与心魔相遇、对话、心魔被净化转化的全过程。包含①相遇场景②英雄说了什么/做了什么③心魔如何逐渐软化④最终转化成什么美好的东西⑤用户获得了什么力量。语气温暖治愈，如童话故事。",
  "imagePromptHero": "English image prompt (4-5 sentences): [Animal species], [name], [personality adjectives], [color palette: warm pastels], [pose and action in scene], [facial expression showing key trait], [background: simple warm parchment tones], [mood: cozy healing RPG style], 512x512px transparent background PNG, flat illustration, Animal Crossing inspired warm game art style",
  "imagePromptMonster": "English image prompt (4-5 sentences): [Animal species representing the worry], [name], [emotional state: struggling but sympathetic], [visual signs of the compulsive pattern], [color palette: slightly muted but still warm], [pose: in the middle of its compulsive behavior, showing both power and pain], [facial expression: conflicted, seeking something], [background: simple warm tones], 512x512px transparent background PNG, flat illustration, compassionate warm game art style",
  "animationPrompt": "English animation prompt (3-4 sentences): The hero [hero action] approaches the monster [monster state]. The hero [specific healing gesture] and the monster begins to [transformation description]. In the final frame, both characters [peaceful coexistence scene], surrounded by [healing visual elements like flowers/light/sparkles]. Warm healing light, cozy RPG game style, Animal Crossing inspired.",
  "victoryImagePrompt": "English still image prompt (3-4 sentences): [Hero name] and [monster name] sit together in peaceful harmony after the transformation. The former monster now shows [transformed positive form]. They are surrounded by [healing scenery details]. Warm golden healing light, both characters smiling/at peace, 16:9 wide format, cozy flat illustration, warm pastel palette.",
  "battleSkillContent": [
    {"animal": "turtle", "level": 1, "name": "3-4字，与用户烦恼相关的慢节奏防御技能名", "description": "8-15字，具体行动描述"},
    {"animal": "turtle", "level": 2, "name": "3-4字，更强版龟系技能", "description": "8-15字"},
    {"animal": "turtle", "level": 3, "name": "3-4字，最强龟系技能", "description": "8-15字"},
    {"animal": "sloth", "level": 1, "name": "3-4字，树懒系正念技能", "description": "8-15字"},
    {"animal": "sloth", "level": 2, "name": "3-4字", "description": "8-15字"},
    {"animal": "sloth", "level": 3, "name": "3-4字", "description": "8-15字"},
    {"animal": "tiger", "level": 1, "name": "3-4字，老虎系行动技能", "description": "8-15字"},
    {"animal": "tiger", "level": 2, "name": "3-4字", "description": "8-15字"},
    {"animal": "tiger", "level": 3, "name": "3-4字", "description": "8-15字"},
    {"animal": "snake", "level": 1, "name": "3-4字，蛇系洞察重构技能", "description": "8-15字"},
    {"animal": "snake", "level": 2, "name": "3-4字", "description": "8-15字"},
    {"animal": "snake", "level": 3, "name": "3-4字", "description": "8-15字"},
    {"animal": "eagle", "level": 1, "name": "3-4字，雄鹰系直面挑战技能（ACT暴露：识别正在逃避的具体情境）", "description": "8-15字"},
    {"animal": "eagle", "level": 2, "name": "3-4字，中级鹰系技能（直接接触触发情境）", "description": "8-15字"},
    {"animal": "eagle", "level": 3, "name": "3-4字，最强鹰系技能（价值导向的勇敢行动）", "description": "8-15字"}
  ],
  "dailyTasks": [
    {"type": "breathing", "description": "与用户具体烦恼相关的呼吸练习任务（15-30字）", "target": 3, "reward": {"mpBonus": 2, "exp": 15}},
    {"type": "writing", "description": "与烦恼相关的书写任务（15-30字）", "target": 1, "reward": {"exp": 20}},
    {"type": "action", "description": "与烦恼相关的微小行动任务（15-30字）", "target": 5, "reward": {"exp": 25}},
    {"type": "gratitude", "description": "与烦恼相关的感恩记录任务（15-30字）", "target": 3, "reward": {"exp": 15}},
    {"type": "movement", "description": "与烦恼相关的身体觉察任务（15-30字）", "target": 60, "reward": {"mpBonus": 3, "exp": 15}}
  ]
}

Rules:
- 风格：温暖、可爱、治愈，所有内容都要有深度和温度
- 名字格式必须严格遵守 [形容词][动物种类]「[昵称]」，动物种类不可省略、不可更换，必须与上方对应表完全一致
- 英雄：与烦恼形成正向对应（时间焦虑→沉稳慢速动物；人际困扰→温暖包容动物）
- 心魔：同情视角，它是烦恼的具象化，不是坏人，是需要被理解的存在
- 字数要求：heroStory≥150字，monsterStory≥150字，cbtAnalysis≤400字符（严格控制），victoryText≥300字
- heroSkills每个技能名3-4字，monsterAttacks每个攻击10-20字
- 所有中文内容必须是完整的、有情感深度的文本，不能用省略号或简短模板
- battleSkillContent必须输出恰好15个对象（turtle×3, sloth×3, tiger×3, snake×3, eagle×3），技能名称和描述必须与用户的具体烦恼相关；eagle系技能代表ACT暴露疗法：直面回避行为，做一件一直在逃避的事
- dailyTasks必须输出恰好5个任务，类型分别为breathing/writing/action/gratitude/movement，任务描述必须针对用户的具体问题而非泛泛而谈`;

function parseTextContent(content: string): TextContent {
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
    victoryImagePrompt: json.victoryImagePrompt || '',
    battleSkillContent: json.battleSkillContent || [],
    dailyTasks: json.dailyTasks || [],
  };
}

const WORRY_ANIMAL_CONSTRAINTS: Record<string, { hero: string; monster: string }> = {
  work_stress:        { hero: '熊猫(panda)',             monster: '啄木鸟(woodpecker)' },
  learning_growth:    { hero: '猫头鹰(owl)',             monster: '仓鼠(hamster)' },
  interpersonal:      { hero: '水豚/卡皮巴拉(capybara)', monster: '刺猬(hedgehog)' },
  family_origin:      { hero: '小鹿(deer)',              monster: '寄居蟹(hermit crab)' },
  social_environment: { hero: '树袋熊/考拉(koala)',      monster: '变色龙(chameleon)' },
  physical_health:    { hero: '海獭(otter)',             monster: '浣熊(raccoon)' },
  time_management:    { hero: '乌龟(turtle)',            monster: '蚂蚁(ant)' },
  emotion_management: { hero: '树懒(sloth)',             monster: '河豚(pufferfish)' },
};

// Japanese katakana animal keywords for ja-language validation
const ANIMAL_KEYWORDS_JA: Record<string, { hero: string[]; monster: string[] }> = {
  work_stress:        { hero: ['パンダ'],              monster: ['キツツキ'] },
  learning_growth:    { hero: ['フクロウ'],            monster: ['ハムスター'] },
  interpersonal:      { hero: ['カピバラ', 'カピバ'],  monster: ['ハリネズミ', 'ハリ'] },
  family_origin:      { hero: ['シカ', '子鹿', '小鹿'], monster: ['ヤドカリ'] },
  social_environment: { hero: ['コアラ'],              monster: ['カメレオン'] },
  physical_health:    { hero: ['カワウソ'],            monster: ['アライグマ'] },
  time_management:    { hero: ['カメ'],                monster: ['アリ'] },
  emotion_management: { hero: ['ナマケモノ'],          monster: ['フグ'] },
};

function validateAnimalTypes(content: TextContent, worryType: string): void {
  const ac = WORRY_ANIMAL_CONSTRAINTS[worryType];
  if (!ac) return;

  // All Chinese variants (split by /)
  const heroChinese = ac.hero.split('(')[0].split('/').map(s => s.trim());
  const heroEnglish = (ac.hero.match(/\(([^)]+)\)/)?.[1] ?? '').split('/').map(s => s.toLowerCase().trim());
  const monsterChinese = ac.monster.split('(')[0].split('/').map(s => s.trim());
  const monsterEnglish = (ac.monster.match(/\(([^)]+)\)/)?.[1] ?? '').split('/').map(s => s.toLowerCase().trim());
  const jaKeywords = ANIMAL_KEYWORDS_JA[worryType];

  const heroLower = content.heroName.toLowerCase();
  const monsterLower = content.monsterName.toLowerCase();

  const heroValid =
    heroChinese.some(k => content.heroName.includes(k)) ||
    heroEnglish.some(k => k && heroLower.includes(k)) ||
    (jaKeywords?.hero.some(k => content.heroName.includes(k)) ?? false);

  const monsterValid =
    monsterChinese.some(k => content.monsterName.includes(k)) ||
    monsterEnglish.some(k => k && monsterLower.includes(k)) ||
    (jaKeywords?.monster.some(k => content.monsterName.includes(k)) ?? false);

  if (!heroValid) throw new Error(`Animal constraint violated: hero must be ${ac.hero}, got "${content.heroName}"`);
  if (!monsterValid) throw new Error(`Animal constraint violated: monster must be ${ac.monster}, got "${content.monsterName}"`);
}

async function callChatAPI(
  url: string,
  headers: Record<string, string>,
  model: string,
  worryText: string,
  worryType: string,
  language = 'zh',
): Promise<TextContent> {
  const ac = WORRY_ANIMAL_CONSTRAINTS[worryType];
  const animalRule = ac
    ? `⚠️ ABSOLUTE RULE — ANIMAL SPECIES CANNOT CHANGE:\nFor category "${worryType}": hero MUST be ${ac.hero}, monster MUST be ${ac.monster}. This cannot be changed under any circumstance.\n\n`
    : '';
  const userContent = `烦恼分类：${worryType}\n用户烦恼：${worryText}${ac ? `\n\n⚠️ 动物约束（绝对不可更改）：英雄必须是${ac.hero}，心魔必须是${ac.monster}` : ''}`;
  const langInstruction = LANGUAGE_INSTRUCTIONS[language] ?? LANGUAGE_INSTRUCTIONS['zh'];
  const systemWithLang = `${animalRule}⚠️ CRITICAL OUTPUT LANGUAGE — FOLLOW EXACTLY: ${langInstruction}\n\n${SYSTEM_PROMPT}`;

  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...headers },
    body: JSON.stringify({
      model,
      messages: [
        { role: 'system', content: systemWithLang },
        { role: 'user', content: userContent },
      ],
      temperature: 0.7,
      max_tokens: 6000,
    }),
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(`API error ${response.status}: ${JSON.stringify(err)}`);
  }

  const data = await response.json();
  const content = data?.choices?.[0]?.message?.content ?? '{}';
  const result = parseTextContent(content);
  validateAnimalTypes(result, worryType);
  return result;
}

export async function generateTextContent(
  worryText: string,
  worryType: string,
  deepseekKey: string,
  agnes?: AgnesTextConfig,
  language = 'zh',
): Promise<TextContent> {
  // Primary: DeepSeek
  try {
    return await callChatAPI(
      'https://api.deepseek.com/v1/chat/completions',
      { Authorization: `Bearer ${deepseekKey}` },
      'deepseek-chat',
      worryText,
      worryType,
      language,
    );
  } catch (err) {
    console.warn('[textAgent] DeepSeek failed, trying Agnes AI:', err);
  }

  // Fallback: Agnes AI
  if (agnes?.agnesKey) {
    try {
      return await callChatAPI(
        `${agnes.agnesBaseUrl || 'https://apihub.agnes-ai.com/v1'}/chat/completions`,
        { Authorization: `Bearer ${agnes.agnesKey}` },
        agnes.agnesTextModel || 'agnes-2.0-flash',
        worryText,
        worryType,
        language,
      );
    } catch (err) {
      console.warn('[textAgent] Agnes AI failed:', err);
    }
  }

  throw new Error('All text generation providers failed');
}
