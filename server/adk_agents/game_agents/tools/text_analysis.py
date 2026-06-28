"""
Tool: generate_text_content
Merges analyzeAgent + worldAgent + textContentAgent into one ADK tool.
Primary: DeepSeek → Fallback: Agnes AI (OpenAI-compatible)
"""

import json
import os

import requests
from pydantic import BaseModel


class BattleSkillContent(BaseModel):
    animal: str
    level: int
    name: str
    description: str


class AIDailyTask(BaseModel):
    type: str
    description: str
    target: int
    reward: dict


class TextContent(BaseModel):
    heroName: str
    heroStory: str
    heroSkills: list[str]
    monsterName: str
    monsterStory: str
    monsterAttacks: list[str]
    cbtAnalysis: str
    victoryText: str
    imagePromptHero: str
    imagePromptMonster: str
    animationPrompt: str
    victoryImagePrompt: str
    battleSkillContent: list[BattleSkillContent]
    dailyTasks: list[AIDailyTask]


SYSTEM_PROMPT_ZH = """你是一位CBT心理治疗师兼动森风格RPG游戏设计师。根据用户烦恼生成丰富完整的游戏内容。所有内容必须详尽、温暖、有深度。

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
  "heroName": "英雄名字，格式固定为 [形容词][动物种类]「[昵称]」，如：松弛感熊猫「悠悠」、智慧猫头鹰「学学」。动物种类必须严格按照上方对应表选择，不可改变。",
  "heroStory": "英雄背景故事（150字以上）：包含①这种动物的象征意义②它的处世哲学③与用户烦恼对应的治愈特质④它为何来帮助用户。语气温暖励志。",
  "heroSkills": ["技能1（3-4字，体现核心治愈能力）", "技能2", "技能3", "技能4"],
  "monsterName": "心魔名字，格式固定为 [形容词][动物种类]「[昵称]」，如：狂躁啄木鸟「笃笃魔」、焦虑仓鼠「转转魔」。动物种类必须严格按照上方对应表选择，不可改变。",
  "monsterStory": "心魔背景故事（150字以上）：包含①这种生物的来源②心魔其实在寻求什么（被理解/安全感等）③它的攻击方式背后是什么恐惧④为何它是可以被治愈的。语气同情理解。",
  "monsterAttacks": ["攻击1（10-20字，具体描述如何触发焦虑）", "攻击2", "攻击3"],
  "cbtAnalysis": "CBT心理分析（严格限制400字以内），分三小段，每段之间用空行分隔：①【看见力量】认可烦恼背后的正向品质（1-2句）\\n\\n②【识别陷阱】温柔点名认知扭曲并给出新视角（2-3句）\\n\\n③【小步行动】一个可操作的微小建议（1-2句）。全文中文，语气如知心朋友，简洁温暖。",
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
    {"animal": "eagle", "level": 1, "name": "3-4字，雄鹰系直面挑战技能", "description": "8-15字"},
    {"animal": "eagle", "level": 2, "name": "3-4字，中级鹰系技能", "description": "8-15字"},
    {"animal": "eagle", "level": 3, "name": "3-4字，最强鹰系技能", "description": "8-15字"}
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
- 语言：游戏内容用中文，图像/动画prompt用英文
- 风格：温暖、可爱、治愈，所有内容都要有深度和温度
- 名字格式必须严格遵守 [形容词][动物种类]「[昵称]」
- 字数要求：heroStory≥150字，monsterStory≥150字，cbtAnalysis≤400字符，victoryText≥300字
- battleSkillContent必须输出恰好15个对象（turtle×3, sloth×3, tiger×3, snake×3, eagle×3）
- dailyTasks必须输出恰好5个任务，类型分别为breathing/writing/action/gratitude/movement"""

LANGUAGE_INSTRUCTIONS = {
    "zh": "所有叙述文字（heroStory, monsterStory, cbtAnalysis, victoryText, heroSkills, monsterAttacks, battleSkillContent.name/description, dailyTasks.description）用中文。图像/动画prompt（imagePromptHero, imagePromptMonster, animationPrompt, victoryImagePrompt）必须用英文。",
    "en": 'Output all narrative text (heroStory, monsterStory, cbtAnalysis, victoryText, heroSkills, monsterAttacks, battleSkillContent name/description, dailyTasks description) in English. Hero/monster names use English format: [Adjective][Animal]"[Nickname]" e.g. "Calm Panda \'Yoyo\'". Image/animation prompts (imagePromptHero, imagePromptMonster, animationPrompt, victoryImagePrompt) must be in English.',
    "ja": "すべての物語テキスト（heroStory, monsterStory, cbtAnalysis, victoryText, heroSkills, monsterAttacks, battleSkillContent.name/description, dailyTasks.description）を日本語で出力してください。ヒーロー/モンスターの名前は日本語形式：[形容詞][動物]「[ニックネーム]」例：「のんびりパンダ「のんのん」」。画像/アニメーションプロンプト（imagePromptHero, imagePromptMonster, animationPrompt, victoryImagePrompt）は英語で記述してください。",
}

WORRY_ANIMAL_CONSTRAINTS = {
    "work_stress": {"hero": "熊猫(panda)", "monster": "啄木鸟(woodpecker)"},
    "learning_growth": {"hero": "猫头鹰(owl)", "monster": "仓鼠(hamster)"},
    "interpersonal": {"hero": "水豚/卡皮巴拉(capybara)", "monster": "刺猬(hedgehog)"},
    "family_origin": {"hero": "小鹿(deer)", "monster": "寄居蟹(hermit crab)"},
    "social_environment": {
        "hero": "树袋熊/考拉(koala)",
        "monster": "变色龙(chameleon)",
    },
    "physical_health": {"hero": "海獭(otter)", "monster": "浣熊(raccoon)"},
    "time_management": {"hero": "乌龟(turtle)", "monster": "蚂蚁(ant)"},
    "emotion_management": {"hero": "树懒(sloth)", "monster": "河豚(pufferfish)"},
}


def _parse_json(text: str) -> dict:
    cleaned = (
        text.replace("```json\n", "").replace("```json", "").replace("```", "").strip()
    )
    return json.loads(cleaned)


def _call_openai_compatible(
    url: str, api_key: str, model: str, system_prompt: str, user_content: str
) -> TextContent:
    response = requests.post(
        url,
        headers={
            "Content-Type": "application/json",
            "Authorization": f"Bearer {api_key}",
        },
        json={
            "model": model,
            "messages": [
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_content},
            ],
            "temperature": 0.7,
            "max_tokens": 6000,
        },
        timeout=120,
    )
    response.raise_for_status()
    content = response.json()["choices"][0]["message"]["content"]
    data = _parse_json(content)
    return TextContent(
        heroName=data.get("heroName", "Unknown Hero"),
        heroStory=data.get("heroStory", ""),
        heroSkills=data.get("heroSkills", []),
        monsterName=data.get("monsterName", "Unknown Monster"),
        monsterStory=data.get("monsterStory", ""),
        monsterAttacks=data.get("monsterAttacks", []),
        cbtAnalysis=data.get("cbtAnalysis", ""),
        victoryText=data.get("victoryText", ""),
        imagePromptHero=data.get("imagePromptHero", ""),
        imagePromptMonster=data.get("imagePromptMonster", ""),
        animationPrompt=data.get("animationPrompt", ""),
        victoryImagePrompt=data.get("victoryImagePrompt", ""),
        battleSkillContent=[
            BattleSkillContent(**s) for s in data.get("battleSkillContent", [])
        ],
        dailyTasks=[AIDailyTask(**t) for t in data.get("dailyTasks", [])],
    )


def _call_gemini(api_key: str, system_prompt: str, user_content: str) -> TextContent:
    url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key={api_key}"
    headers = {"Content-Type": "application/json"}
    payload = {
        "systemInstruction": {"parts": [{"text": system_prompt}]},
        "contents": [{"parts": [{"text": user_content}]}],
        "generationConfig": {
            "responseMimeType": "application/json",
            "temperature": 0.7,
        },
    }
    response = requests.post(url, headers=headers, json=payload, timeout=120)
    if not response.ok:
        # try 2.0-flash as fallback
        url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key={api_key}"
        response = requests.post(url, headers=headers, json=payload, timeout=120)
        response.raise_for_status()

    data = response.json()
    content = data["candidates"][0]["content"]["parts"][0]["text"]
    data_parsed = _parse_json(content)
    return TextContent(
        heroName=data_parsed.get("heroName", "Unknown Hero"),
        heroStory=data_parsed.get("heroStory", ""),
        heroSkills=data_parsed.get("heroSkills", []),
        monsterName=data_parsed.get("monsterName", "Unknown Monster"),
        monsterStory=data_parsed.get("monsterStory", ""),
        monsterAttacks=data_parsed.get("monsterAttacks", []),
        cbtAnalysis=data_parsed.get("cbtAnalysis", ""),
        victoryText=data_parsed.get("victoryText", ""),
        imagePromptHero=data_parsed.get("imagePromptHero", ""),
        imagePromptMonster=data_parsed.get("imagePromptMonster", ""),
        animationPrompt=data_parsed.get("animationPrompt", ""),
        victoryImagePrompt=data_parsed.get("victoryImagePrompt", ""),
        battleSkillContent=[
            BattleSkillContent(**s) for s in data_parsed.get("battleSkillContent", [])
        ],
        dailyTasks=[AIDailyTask(**t) for t in data_parsed.get("dailyTasks", [])],
    )


ANIMALS_LANG = {
    "zh": {
        "work_stress": {
            "hero": "熊猫",
            "hero_en": "panda",
            "monster": "啄木鸟",
            "monster_en": "woodpecker",
            "hero_nick": "悠悠",
            "monster_nick": "笃笃魔",
        },
        "learning_growth": {
            "hero": "猫头鹰",
            "hero_en": "owl",
            "monster": "仓鼠",
            "monster_en": "hamster",
            "hero_nick": "学学",
            "monster_nick": "转转魔",
        },
        "interpersonal": {
            "hero": "卡皮巴拉",
            "hero_en": "capybara",
            "monster": "刺猬",
            "monster_en": "hedgehog",
            "hero_nick": "卡卡",
            "monster_nick": "刺刺魔",
        },
        "family_origin": {
            "hero": "小鹿",
            "hero_en": "deer",
            "monster": "寄居蟹",
            "monster_en": "hermit crab",
            "hero_nick": "呦呦",
            "monster_nick": "壳壳魔",
        },
        "social_environment": {
            "hero": "考拉",
            "hero_en": "koala",
            "monster": "变色龙",
            "monster_en": "chameleon",
            "hero_nick": "安安",
            "monster_nick": "幻幻魔",
        },
        "physical_health": {
            "hero": "海獭",
            "hero_en": "otter",
            "monster": "浣熊",
            "monster_en": "raccoon",
            "hero_nick": "嗒嗒",
            "monster_nick": "呼呼魔",
        },
        "time_management": {
            "hero": "乌龟",
            "hero_en": "turtle",
            "monster": "蚂蚁",
            "monster_en": "ant",
            "hero_nick": "慢慢",
            "monster_nick": "忙忙魔",
        },
        "emotion_management": {
            "hero": "树懒",
            "hero_en": "sloth",
            "monster": "河豚",
            "monster_en": "pufferfish",
            "hero_nick": "静静",
            "monster_nick": "鼓鼓魔",
        },
    },
    "en": {
        "work_stress": {
            "hero": "Panda",
            "hero_en": "panda",
            "monster": "Woodpecker",
            "monster_en": "woodpecker",
            "hero_nick": "Yoyo",
            "monster_nick": "Dudu",
        },
        "learning_growth": {
            "hero": "Owl",
            "hero_en": "owl",
            "monster": "Hamster",
            "monster_en": "hamster",
            "hero_nick": "Xuexue",
            "monster_nick": "Zhuanzhuan",
        },
        "interpersonal": {
            "hero": "Capybara",
            "hero_en": "capybara",
            "monster": "Hedgehog",
            "monster_en": "hedgehog",
            "hero_nick": "Kaka",
            "monster_nick": "Cici",
        },
        "family_origin": {
            "hero": "Deer",
            "hero_en": "deer",
            "monster": "Hermit Crab",
            "monster_en": "hermit crab",
            "hero_nick": "Yoyo",
            "monster_nick": "Keke",
        },
        "social_environment": {
            "hero": "Koala",
            "hero_en": "koala",
            "monster": "Chameleon",
            "monster_en": "chameleon",
            "hero_nick": "Anan",
            "monster_nick": "Huanhuan",
        },
        "physical_health": {
            "hero": "Otter",
            "hero_en": "otter",
            "monster": "Raccoon",
            "monster_en": "raccoon",
            "hero_nick": "Dada",
            "monster_nick": "Huhu",
        },
        "time_management": {
            "hero": "Turtle",
            "hero_en": "turtle",
            "monster": "Ant",
            "monster_en": "ant",
            "hero_nick": "Manman",
            "monster_nick": "Mangmang",
        },
        "emotion_management": {
            "hero": "Sloth",
            "hero_en": "sloth",
            "monster": "Pufferfish",
            "monster_en": "pufferfish",
            "hero_nick": "Jingjing",
            "monster_nick": "Gugu",
        },
    },
    "ja": {
        "work_stress": {
            "hero": "パンダ",
            "hero_en": "panda",
            "monster": "キツツキ",
            "monster_en": "woodpecker",
            "hero_nick": "のんのん",
            "monster_nick": "トントン",
        },
        "learning_growth": {
            "hero": "フクロウ",
            "hero_en": "owl",
            "monster": "ハムスター",
            "monster_en": "hamster",
            "hero_nick": "ガクガク",
            "monster_nick": "クルクル",
        },
        "interpersonal": {
            "hero": "カピバラ",
            "hero_en": "capybara",
            "monster": "ハリネズミ",
            "monster_en": "hedgehog",
            "hero_nick": "カカ",
            "monster_nick": "チクチク",
        },
        "family_origin": {
            "hero": "シカ",
            "hero_en": "deer",
            "monster": "ヤドカリ",
            "monster_en": "hermit crab",
            "hero_nick": "チェリー",
            "monster_nick": "ヤドヤド",
        },
        "social_environment": {
            "hero": "コアラ",
            "hero_en": "koala",
            "monster": "カメレオン",
            "monster_en": "chameleon",
            "hero_nick": "コラコラ",
            "monster_nick": "ヘンヘン",
        },
        "physical_health": {
            "hero": "ラッコ",
            "hero_en": "otter",
            "monster": "アライグマ",
            "monster_en": "raccoon",
            "hero_nick": "コトコト",
            "monster_nick": "アラアラ",
        },
        "time_management": {
            "hero": "カメ",
            "hero_en": "turtle",
            "monster": "アリ",
            "monster_en": "ant",
            "hero_nick": "カメカメ",
            "monster_nick": "セカセカ",
        },
        "emotion_management": {
            "hero": "ナマケモノ",
            "hero_en": "sloth",
            "monster": "フグ",
            "monster_en": "pufferfish",
            "hero_nick": "レイジー",
            "monster_nick": "プンプン",
        },
    },
}

NATIVE_HERO_SKILLS = {
    "zh": ["温暖拥抱", "温柔低语", "心灵抚慰", "安宁守护"],
    "en": ["Warm Hug", "Gentle Whisper", "Mind Soothe", "Peace Shield"],
    "ja": ["温かい抱擁", "優しいささやき", "心の癒やし", "安らぎの守り"],
}

NATIVE_MONSTER_ATTACKS = {
    "zh": [
        "焦虑撕咬（急促的压迫让人喘不过气）",
        "否定迷雾（让你开始怀疑自己的价值）",
        "无尽催促（脑海中不断回荡着快一点的魔音）",
    ],
    "en": [
        "Anxious Bite (creates overwhelming panic and stress)",
        "Doubt Mist (makes you question your self-worth)",
        "Relentless Push (compulsive voice yelling to hurry up)",
    ],
    "ja": [
        "焦りの牙（激しいプレッシャーで息苦しくさせます）",
        "自己否定の霧（自分の価値を疑わせる霧を放ちます）",
        "終わらない催促（早くしなければと焦らせる声を響かせます）",
    ],
}


def _generate_battle_skill_content(language: str) -> list:
    if language == "zh":
        return [
            {
                "animal": "turtle",
                "level": 1,
                "name": "龟缩防御",
                "description": "缩入壳中避开外界喧嚣，恢复5点生命值。",
            },
            {
                "animal": "turtle",
                "level": 2,
                "name": "玄武壁垒",
                "description": "凝聚灵力护盾，抵挡敌人的下一次强力冲击。",
            },
            {
                "animal": "turtle",
                "level": 3,
                "name": "万寿无疆",
                "description": "激发古老龟息之术，彻底净化身上的所有焦虑毒素。",
            },
            {
                "animal": "sloth",
                "level": 1,
                "name": "正念呼吸",
                "description": "放慢呼吸节奏，减轻20%受到的情绪伤害。",
            },
            {
                "animal": "sloth",
                "level": 2,
                "name": "半速漫步",
                "description": "放慢行动速度，在徐缓的节奏中看清心魔的弱点。",
            },
            {
                "animal": "sloth",
                "level": 3,
                "name": "空无一物",
                "description": "进入极度放松状态，免疫所有情绪负面状态。",
            },
            {
                "animal": "tiger",
                "level": 1,
                "name": "猛虎咆哮",
                "description": "大声喊出内心压抑，震慑并削弱心魔的斗志。",
            },
            {
                "animal": "tiger",
                "level": 2,
                "name": "奋勇跃击",
                "description": "以坚定信念破除迷茫，对心魔造成大量治愈伤害。",
            },
            {
                "animal": "tiger",
                "level": 3,
                "name": "百兽之王",
                "description": "展现王者威仪，彻底粉碎心魔的防御并将其打入沉睡。",
            },
            {
                "animal": "snake",
                "level": 1,
                "name": "蜕皮重生",
                "description": "像蛇一样蜕去旧日烦恼，瞬间回复30点体力。",
            },
            {
                "animal": "snake",
                "level": 2,
                "name": "灵蛇洞察",
                "description": "看穿心魔的伪装，识别它其实是由渴望被接纳演变而来。",
            },
            {
                "animal": "snake",
                "level": 3,
                "name": "万物相生",
                "description": "看透矛盾并重构认知，将心魔的攻击转化为温和的能量。",
            },
            {
                "animal": "eagle",
                "level": 1,
                "name": "展翅高飞",
                "description": "飞上高空俯瞰全局，摆脱狭隘局限的新视角。",
            },
            {
                "animal": "eagle",
                "level": 2,
                "name": "苍鹰之眼",
                "description": "锐利目光锁定问题根源，直击心魔最脆弱的部分。",
            },
            {
                "animal": "eagle",
                "level": 3,
                "name": "搏击长空",
                "description": "带着一往无前的坚毅，彻底驱散周围笼罩的所有阴霾。",
            },
        ]
    elif language == "ja":
        return [
            {
                "animal": "turtle",
                "level": 1,
                "name": "亀の甲羅",
                "description": "甲羅に閉じこもり、外の喧騒を遮断してHPを5回復します。",
            },
            {
                "animal": "turtle",
                "level": 2,
                "name": "玄武の盾",
                "description": "強力なシールドを展開し、敵の次の攻撃を防ぎます。",
            },
            {
                "animal": "turtle",
                "level": 3,
                "name": "万寿の息吹",
                "description": "深い亀呼吸により、すべてのマイナス状態を完全に浄化します。",
            },
            {
                "animal": "sloth",
                "level": 1,
                "name": "マインドフル",
                "description": "呼吸を整え、受けるストレスダメージを20%軽減します。",
            },
            {
                "animal": "sloth",
                "level": 2,
                "name": "スロー歩行",
                "description": "ゆっくり歩くことで、敵の焦りの弱点を見極めます。",
            },
            {
                "animal": "sloth",
                "level": 3,
                "name": "無我の境地",
                "description": "極限の脱力状態に入り、すべての攻撃を無効化します。",
            },
            {
                "animal": "tiger",
                "level": 1,
                "name": "虎の咆哮",
                "description": "抑圧された感情を吐き出し、心の魔の闘志を削ぎます。",
            },
            {
                "animal": "tiger",
                "level": 2,
                "name": "果敢な跳躍",
                "description": "強い決意で迷いを断ち切り、敵に大きなダメージを与えます。",
            },
            {
                "animal": "tiger",
                "level": 3,
                "name": "獣王の威厳",
                "description": "圧倒的な存在感で、心の魔を完全に穏やかな眠りに誘います。",
            },
            {
                "animal": "snake",
                "level": 1,
                "name": "脱皮の儀式",
                "description": "古い悩みから脱皮し、スタミナを瞬時に30回復します。",
            },
            {
                "animal": "snake",
                "level": 2,
                "name": "蛇の洞察",
                "description": "敵の正体を見破り、それがただ愛されたい叫びだと気づきます。",
            },
            {
                "animal": "snake",
                "level": 3,
                "name": "相生リセット",
                "description": "認知の枠組みを再構成し、敵の攻撃を癒しの力に変えます。",
            },
            {
                "animal": "eagle",
                "level": 1,
                "name": "鷹の飛翔",
                "description": "高く舞い上がり、広い視野から悩みを俯瞰します。",
            },
            {
                "animal": "eagle",
                "level": 2,
                "name": "千里の眼",
                "description": "悩みの本質を見抜き、心の魔の核を捉えます。",
            },
            {
                "animal": "eagle",
                "level": 3,
                "name": "天空の翼",
                "description": "揺るぎない覚悟で、周囲を覆う暗雲を完全に吹き飛ばします。",
            },
        ]
    else:  # default/en
        return [
            {
                "animal": "turtle",
                "level": 1,
                "name": "Shell Defense",
                "description": "Retreat into your shell to block out stress, restoring 5 HP.",
            },
            {
                "animal": "turtle",
                "level": 2,
                "name": "Iron Shield",
                "description": "Deploy a massive shield to absorb the next incoming attack.",
            },
            {
                "animal": "turtle",
                "level": 3,
                "name": "Eternal Calm",
                "description": "Invoke slow breathing to purge all negative debuffs instantly.",
            },
            {
                "animal": "sloth",
                "level": 1,
                "name": "Mindful Breath",
                "description": "Slow down your respiration to reduce incoming damage by 20%.",
            },
            {
                "animal": "sloth",
                "level": 2,
                "name": "Leisurely Walk",
                "description": "Walk at half-speed to identify the monster's hidden weakness.",
            },
            {
                "animal": "sloth",
                "level": 3,
                "name": "Absolute Chill",
                "description": "Enter state of complete relaxation, immune to all stress.",
            },
            {
                "animal": "tiger",
                "level": 1,
                "name": "Primal Roar",
                "description": "Shout out your stress to weaken the monster's resolve.",
            },
            {
                "animal": "tiger",
                "level": 2,
                "name": "Fierce Leap",
                "description": "Leap forward with confidence, dealing high healing damage.",
            },
            {
                "animal": "tiger",
                "level": 3,
                "name": "King's Will",
                "description": "Assert absolute self-mastery, putting the monster to sleep.",
            },
            {
                "animal": "snake",
                "level": 1,
                "name": "Shedding Skin",
                "description": "Shed past regrets to instantly recover 30 stamina points.",
            },
            {
                "animal": "snake",
                "level": 2,
                "name": "Viper Insight",
                "description": "See through the illusion, recognizing the monster's pain.",
            },
            {
                "animal": "snake",
                "level": 3,
                "name": "Reframe Mind",
                "description": "Reconstruct cognitive pathways, converting attacks into energy.",
            },
            {
                "animal": "eagle",
                "level": 1,
                "name": "Soaring View",
                "description": "Fly high to get a grand perspective on current worries.",
            },
            {
                "animal": "eagle",
                "level": 2,
                "name": "Eagle Vision",
                "description": "Pinpoint the core issue, finding the monster's weak spot.",
            },
            {
                "animal": "eagle",
                "level": 3,
                "name": "Storm Breaker",
                "description": "Shatter all dark clouds with unwavering determination.",
            },
        ]


def _generate_daily_tasks(language: str) -> list:
    if language == "zh":
        return [
            {
                "type": "breathing",
                "description": "进行3分钟腹式深呼吸，专注感受气体进出。",
                "target": 3,
                "reward": {"mpBonus": 2, "exp": 15},
            },
            {
                "type": "writing",
                "description": "写下当下让你最焦虑的三个想法，并轻轻拍拍自己。",
                "target": 1,
                "reward": {"exp": 20},
            },
            {
                "type": "action",
                "description": "起立走动5分钟，做一些拉伸，感受身体的舒展。",
                "target": 5,
                "reward": {"exp": 25},
            },
            {
                "type": "gratitude",
                "description": "记录三件今天让你感到温暖或感激的小事。",
                "target": 3,
                "reward": {"exp": 15},
            },
            {
                "type": "movement",
                "description": "在阳光下散步10分钟，观察周围自然的颜色。",
                "target": 10,
                "reward": {"mpBonus": 3, "exp": 15},
            },
        ]
    elif language == "ja":
        return [
            {
                "type": "breathing",
                "description": "3分間の腹式深呼吸を行い、呼吸だけに集中しましょう。",
                "target": 3,
                "reward": {"mpBonus": 2, "exp": 15},
            },
            {
                "type": "writing",
                "description": "現在焦りを感じていることを3つ書き出し、自分を労いましょう。",
                "target": 1,
                "reward": {"exp": 20},
            },
            {
                "type": "action",
                "description": "5分間立ち上がってストレッチを行い、体をリフレッシュします。",
                "target": 5,
                "reward": {"exp": 25},
            },
            {
                "type": "gratitude",
                "description": "今日、温かさや感謝を感じた出来事を3つ手帳に書きます。",
                "target": 3,
                "reward": {"exp": 15},
            },
            {
                "type": "movement",
                "description": "10分間外を散歩し、自然の美しい色や音に耳を傾けます。",
                "target": 10,
                "reward": {"mpBonus": 3, "exp": 15},
            },
        ]
    else:  # default/en
        return [
            {
                "type": "breathing",
                "description": "Do 3 minutes of deep belly breathing, focusing entirely on the breath.",
                "target": 3,
                "reward": {"mpBonus": 2, "exp": 15},
            },
            {
                "type": "writing",
                "description": "Write down 3 stressful thoughts on paper, then gently stretch.",
                "target": 1,
                "reward": {"exp": 20},
            },
            {
                "type": "action",
                "description": "Stand up and stretch for 5 minutes, feeling the release of physical tension.",
                "target": 5,
                "reward": {"exp": 25},
            },
            {
                "type": "gratitude",
                "description": "Write down 3 tiny things you are grateful for today.",
                "target": 3,
                "reward": {"exp": 15},
            },
            {
                "type": "movement",
                "description": "Walk outside for 10 minutes, observing the natural elements around you.",
                "target": 10,
                "reward": {"mpBonus": 3, "exp": 15},
            },
        ]


def _generate_mock_content(worry_text: str, worry_type: str, language: str) -> dict:
    lang = language if language in ANIMALS_LANG else "zh"
    category = worry_type if worry_type in ANIMALS_LANG[lang] else "work_stress"

    cfg = ANIMALS_LANG[lang][category]
    hero = cfg["hero"]
    hero_en = cfg["hero_en"]
    monster = cfg["monster"]
    monster_en = cfg["monster_en"]
    hero_nick = cfg["hero_nick"]
    monster_nick = cfg["monster_nick"]

    if lang == "zh":
        hero_name = f"松弛感{hero}「{hero_nick}」"
        monster_name = f"焦虑{monster}「{monster_nick}」"
        hero_story = f"在茂密宁静的森林深处，生活着一个温暖而有爱心的生物——{hero_name}。它深信大自然的节奏，知道凡事都需要时间慢慢沉淀。{hero}是沉稳、包容与疗愈力量的象征，在喧嚣多变的世界里，它始终能保持内心的安宁。{hero_name}用它那特有的温柔气场和敏锐的同理心，春风化雨般治愈着身边的每一个人。当面对用户所遇到的「{worry_text}」这一极具挑战性的烦恼时，它会张开双臂，以包容的态度化解所有的不安，用它那温暖的故事告诉用户：不要苛求自己，相信自己内在的力量，每一步的成长都是珍贵且有意义的。"
        monster_story = f"在这片森林的另一端，有一只被称为{monster_name}的神奇生物。它总是显得有些焦躁和紧绷，终日忙碌不停，甚至有些歇斯底里。其实，它的表现只是因为它内心深处极度缺乏安全感，急于寻找被肯定、被接纳和被关爱的感觉。它所有的挣扎和防御，背后都隐藏着对未知的极大恐惧与孤单。虽然它现在看起来有点难以接近，但它的本性非常纯真。通过耐心的陪伴、温柔的倾听与深度的接纳，{monster_name}一定能够解开心结，它渴望着被治愈，也完全可以重获新生成为我们最好的朋友。"
        cbt_analysis = f"①【看见力量】你为「{worry_text[:15]}」感到苦恼，说明你对生活极具责任感，非常渴望突破现状、追求美好，这份真挚的初心弥足珍贵。\n\n②【识别陷阱】你可能不自觉地陷入了「全或无」的绝对化认知陷阱，将一时的波折等同于彻底的失败，忽略了自己已经付出的努力和拥有的闪光点。\n\n③【小步行动】今天请试着花3分钟进行正念深呼吸，或者在本子上写下自己今天做得最棒的一件小事，温柔地接纳自己。"
        victory_text = f"在洒满柔和金色光芒的竹林深处，{hero_name}终于与疲惫不堪的{monster_name}迎面相遇了。此时的{monster_name}依然处于防备状态，发出低沉的声音试图掩盖内心的脆弱。然而，{hero_name}并没有展现出任何敌意，而是带着温暖祥和的微笑缓缓走上前去。它轻轻张开双臂，给对方递上一杯热气腾腾、散发着清香的花茶，并用无比温柔的嗓音说道：“你已经辛苦奔波太久了，在这里你可以卸下所有的防备，好好歇一歇，你已经做得很好了。”听到这句话的瞬间，{monster_name}彻底愣住了。它看着对方那清澈、包容且充满爱的眼眸，积压已久的委屈和焦虑终于如潮水般决堤，化作温热的泪水流下。随着一阵柔和的金色和翠绿色交织的光芒闪过，它身上的焦虑黑气彻底烟消云散，转化成了一只活泼快乐、唱着治愈之歌的彩虹小鸟，自由地在林间穿梭飞翔。在这一刻，用户也感到内心深处的重担被悄然卸下，重获了面对生活重重挑战的无限勇气与力量，学会了与自己和解，在阳光下开启温馨的新篇章。"
    elif lang == "ja":
        hero_name = f"のんびり{hero}「{hero_nick}」"
        monster_name = f"焦り{monster}「{monster_nick}」"
        hero_story = f"静かで豊かな森の奥深くに、温かく思いやりのある{hero_name}が暮らしています。彼らは自然の無限のサイクルを信じており、すべての成長には時間が必要であることを深く理解しています。{hero}は、静かな癒しの力、平和、そしてレジリエンスの象徴です。忙しく変化の激しいこの世界において、彼らは常に内なる穏やかさを保ち続けています。{hero_name}は、その優しい存在感と深い共感力で、周囲のすべての存在を温かく包み込み、癒しています。あなたが抱える「{worry_text}」という悩みに直面したとき、彼らはそっと手を差しおべ、自分を責めず、一歩一歩進むことの大切さを教えてくれます。"
        monster_story = f"この森の反対側には、{monster_name}と呼ばれる少し不器用な生き物がさまよっています。彼らはいつも焦り、緊張し、何かに追われるように毎日を過ごしています。しかし、その頑固で攻撃的な態度の裏には、安心感、肯定、そして愛されたいという切実な願いが隠されています。その絶え間ない葛藤や極端な行動パターンは、実は傷つくことを恐れるあまりに身につけてしまった心の防具なのです。とげとげしい外見とは裏腹に、その本質はとても純粋で優しいものです。辛抱強い寄り添いと深い共感があれば、{monster_name}の心の氷は解け、本来の穏やかな姿へと癒されていきます。"
        cbt_analysis = f"①【力を見出す】「{worry_text[:15]}」について悩むのは、あなたが自分の人生に対して強い責任感を持ち、より良くしたいと愿う真剣さの証であり、とても貴重な強みです。\n\n②【罠を見極める】一度のつまづきを「完全な失敗」と捉えてしまう「白黒思考」の認知の罠に陥っているかもしれません。これまでの努力を認めてあげましょう。\n\n③【小さな一歩】今すぐ3回ゆっくりと深呼吸をするか、今日自分を褒めてあげたい小さな出来事を1つだけ手帳に書き留めてみましょう。"
        victory_text = f"柔らかな黄金色の光が差し込む美しい森の奥で、{hero_name}はついに疲れ果てた{monster_name}と出会いました。{monster_name}はまだ警戒を解かず、鋭い仕草で自分の弱さを隠そうとしていました。しかし、{hero_name}は一歩も引くことなく、ただ優しく微笑みながら歩み寄りました。そして、温かいハーブティーを差し出し、ささやくように語りかけました。「もう十分に頑張ったよ。ここでは戦わなくていいんだ。少し休もう。」その言葉を聞いた瞬間、{monster_name}の動きが止まりました。{hero_name}の深く包み込むような瞳を見つめるうちに、張り詰めていた緊張が涙となって溢れ出しました。その瞬間、温かい光が二人を包み込み、{monster_name}の周りにあった黒い雾はきれいに消え去りました。そして、光り輝く美しい青い小鳥へと姿を変え、自由に空へと舞い上がっていきました。この瞬間、あなたの心からも重い荷物が下り、明日へ進むための穏やかな勇気と深い癒しが満ちていくのを感じました。"
    else:  # en
        hero_name = f"Relaxed {hero} '{hero_nick}'"
        monster_name = f"Anxious {monster} '{monster_nick}'"
        hero_story = f"Deep in the quiet and lush green forest, lives a warm and caring creature named {hero_name}. They believe in the natural rhythm of the universe, knowing that all things take time to grow and flourish. The {hero} is a classic symbol of peace, resilience, and quiet healing power. In this fast-paced and challenging world, they always maintain an inner sanctuary of calmness. {hero_name} uses their gentle presence and deep empathy to heal everyone around them. Facing your worry about '{worry_text}', they step forward to remind you that you are not alone, you are doing incredibly well, and it is completely okay to take things one small step at a time."
        monster_story = f"On the other side of the forest, there roams a creature known as {monster_name}. They often appear anxious, tense, and constantly on edge, struggling with their daily habits. However, behind this difficult behavior lies a deep need for security, love, and emotional acceptance. Their endless struggle and compulsive patterns are actually protective armor hiding their vulnerability and fear of failure. Despite their thorny outer shell, their true core is completely innocent and gentle. Through patience, open-ended listening, and compassionate understanding, {monster_name} can be healed and transformed into a peaceful friend."
        cbt_analysis = f"①【Seeing Strength】Caring about '{worry_text[:15]}' shows your strong sense of responsibility and desire for positive change. This genuine care is a wonderful strength.\n\n②【Identifying Traps】You might be in an 'all-or-nothing' thinking trap, viewing minor setbacks as complete failures and ignoring your progress.\n\n③【Micro Action】Try to take 3 deep breaths right now, or write down one tiny thing you appreciate about yourself today."
        victory_text = f"In the golden light of the ancient forest, {hero_name} met the exhausted {monster_name}. The monster was still in a defensive stance, making sharp gestures to hide its inner pain. But {hero_name} showed no fear. With a warm, compassionate smile, they gently stepped forward and offered a cup of fragrant hot tea, speaking softly: 'You have been running for so long. It is safe to rest here. You have done enough, and you are loved.' Hearing these words, the monster froze. Looking into {hero_name}'s peaceful, accepting eyes, its long-held anxieties finally melted into tears. With a brilliant flash of warm golden light, all negative shadows dissipated. The monster transformed into a beautiful, colorful butterfly of light, flying freely among the trees. At this exact moment, you feel a heavy burden lifted from your heart, gaining a deep sense of peaceful power and confidence to handle any challenge life brings."

    prompts = {
        "imagePromptHero": f"Cozy and cute {hero_en} hero character, friendly and warm, simple flat illustration, soft warm pastel palette, simple warm parchment background, Nintendo game button aesthetic, 512x512px transparent background PNG, pastoral RPG game style.",
        "imagePromptMonster": f"Struggling but sympathetic {monster_en} monster character, tense and anxious expression, mute colors but still warm, simple background, cozy warm game art style, 512x512px transparent background PNG, showing emotional struggle.",
        "animationPrompt": f"Cozy flat illustration. The cute {hero_en} approaches the anxious {monster_en} with a gentle gesture of peace. The monster begins to calm down and glow with warm healing light, transforming into a beautiful butterfly. Peaceful cozy RPG game style.",
        "victoryImagePrompt": f"Warm healing illustration. The cute {hero_en} and the transformed {monster_en} sitting together in peaceful harmony, smiling happily. Surrounded by beautiful flowers and warm golden light, cozy flat illustration style, 16:9 wide format.",
    }

    hero_skills = NATIVE_HERO_SKILLS.get(lang, NATIVE_HERO_SKILLS["en"])
    monster_attacks = NATIVE_MONSTER_ATTACKS.get(lang, NATIVE_MONSTER_ATTACKS["en"])

    return {
        "heroName": hero_name,
        "heroStory": hero_story,
        "heroSkills": hero_skills,
        "monsterName": monster_name,
        "monsterStory": monster_story,
        "monsterAttacks": monster_attacks,
        "cbtAnalysis": cbt_analysis,
        "victoryText": victory_text,
        "imagePromptHero": prompts["imagePromptHero"],
        "imagePromptMonster": prompts["imagePromptMonster"],
        "animationPrompt": prompts["animationPrompt"],
        "victoryImagePrompt": prompts["victoryImagePrompt"],
        "battleSkillContent": _generate_battle_skill_content(lang),
        "dailyTasks": _generate_daily_tasks(lang),
    }


def generate_text_content(
    worry_text: str, worry_type: str, language: str = "zh"
) -> dict:
    """Generate complete game content from user worry using CBT framework.

    Args:
        worry_text: User's worry description
        worry_type: Category (work_stress, learning_growth, interpersonal, family_origin,
                    social_environment, physical_health, time_management, emotion_management)
        language: Output language for narrative content - 'zh', 'en', or 'ja'

    Returns:
        Full TextContent with hero, monster, CBT analysis, skills, tasks, image prompts
    """
    lang = language if language in LANGUAGE_INSTRUCTIONS else "zh"

    # Fast-track mock fallback if in test suite
    if os.environ.get("INTEGRATION_TEST") == "TRUE":
        print(
            f"[text_analysis] INTEGRATION_TEST is active. Returning mock content for {worry_type}/{lang}."
        )
        return _generate_mock_content(worry_text, worry_type, lang)

    lang_instruction = LANGUAGE_INSTRUCTIONS[lang]
    system_prompt = f"{SYSTEM_PROMPT_ZH}\n\n⚠️ LANGUAGE INSTRUCTION: {lang_instruction}"

    ac = WORRY_ANIMAL_CONSTRAINTS.get(worry_type, {})
    animal_note = (
        f"\n\n⚠️ 动物种类约束（必须严格遵守）：英雄角色必须是{ac['hero']}，心魔角色必须是{ac['monster']}。"
        if ac
        else ""
    )
    user_content = f"烦恼分类：{worry_type}\n用户烦恼：{worry_text}{animal_note}"

    gemini_key = os.environ.get("GEMINI_API_KEY", "")
    deepseek_key = os.environ.get("DEEPSEEK_API_KEY", "")
    agnes_key = os.environ.get("AGNES_API_KEY", "")
    agnes_base_url = os.environ.get("AGNES_BASE_URL", "https://apihub.agnes-ai.com/v1")
    agnes_text_model = os.environ.get("AGNES_TEXT_MODEL", "agnes-2.0-flash")

    # Primary: Gemini
    if gemini_key:
        try:
            result = _call_gemini(
                gemini_key,
                system_prompt,
                user_content,
            )
            print(f"[text_analysis] Gemini succeeded for {worry_type}/{lang}")
            return result.model_dump()
        except Exception as e:
            print(f"[text_analysis] Gemini failed: {e}")

    # Secondary: DeepSeek
    if deepseek_key:
        try:
            result = _call_openai_compatible(
                "https://api.deepseek.com/v1/chat/completions",
                deepseek_key,
                "deepseek-chat",
                system_prompt,
                user_content,
            )
            print(f"[text_analysis] DeepSeek succeeded for {worry_type}/{lang}")
            return result.model_dump()
        except Exception as e:
            print(f"[text_analysis] DeepSeek failed: {e}")

    # Tertiary: Agnes AI
    if agnes_key:
        try:
            result = _call_openai_compatible(
                f"{agnes_base_url}/chat/completions",
                agnes_key,
                agnes_text_model,
                system_prompt,
                user_content,
            )
            print(f"[text_analysis] Agnes AI succeeded for {worry_type}/{lang}")
            return result.model_dump()
        except Exception as e:
            print(f"[text_analysis] Agnes AI failed: {e}")

    print(
        f"[text_analysis] All APIs failed for {worry_type}/{lang}. Returning mock content as safety fallback."
    )
    return _generate_mock_content(worry_text, worry_type, lang)
