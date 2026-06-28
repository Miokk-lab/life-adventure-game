"""
Tool: generate_quests
Mirrors questAgent.ts — uses Gemini 2.0 Flash
"""

import json
import os

import requests
from pydantic import BaseModel


class QuestReward(BaseModel):
    mpBonus: int = 0
    coins: int = 0
    exp: int = 0


class Quest(BaseModel):
    type: str
    description: str
    target: int
    reward: QuestReward


class QuestData(BaseModel):
    tasks: list[Quest]


LANGUAGE_INSTRUCTIONS = {
    "zh": "任务描述用中文，动森风格，温暖可爱。",
    "en": "Write task descriptions in English, Animal Crossing style, warm and friendly.",
    "ja": "タスクの説明を日本語で書いてください。どうぶつの森スタイル、温かく可愛らしく。",
}


def _generate_mock_quests(language: str) -> dict:
    if language == "zh":
        return {
            "tasks": [
                {
                    "type": "breathing",
                    "description": "做3分钟舒缓呼吸练习，与英雄心灵共鸣",
                    "target": 3,
                    "reward": {"mpBonus": 5, "coins": 10, "exp": 15},
                },
                {
                    "type": "sorting",
                    "description": "整理一次房间的书桌，将杂乱的思绪理顺",
                    "target": 1,
                    "reward": {"mpBonus": 0, "coins": 20, "exp": 20},
                },
                {
                    "type": "writing",
                    "description": "记录今天让你感到温暖的一句话或一件事",
                    "target": 1,
                    "reward": {"mpBonus": 0, "coins": 15, "exp": 15},
                },
                {
                    "type": "action",
                    "description": "出门散步5分钟，呼吸新鲜空气，拥抱自然",
                    "target": 5,
                    "reward": {"mpBonus": 2, "coins": 25, "exp": 25},
                },
                {
                    "type": "gratitude",
                    "description": "向一位朋友或家人发送一条感谢短信，表达感激",
                    "target": 1,
                    "reward": {"mpBonus": 3, "coins": 15, "exp": 15},
                },
                {
                    "type": "movement",
                    "description": "做一次身体拉伸，感觉紧绷的肌肉得到放松",
                    "target": 1,
                    "reward": {"mpBonus": 0, "coins": 20, "exp": 20},
                },
            ]
        }
    elif language == "ja":
        return {
            "tasks": [
                {
                    "type": "breathing",
                    "description": "ヒーローの心と同調するために、3分間の深呼吸を行いましょう",
                    "target": 3,
                    "reward": {"mpBonus": 5, "coins": 10, "exp": 15},
                },
                {
                    "type": "sorting",
                    "description": "デスクの片付けをして、乱れた心を整理します",
                    "target": 1,
                    "reward": {"mpBonus": 0, "coins": 20, "exp": 20},
                },
                {
                    "type": "writing",
                    "description": "今日嬉しかったことや温かい言葉を1つ記録しましょう",
                    "target": 1,
                    "reward": {"mpBonus": 0, "coins": 15, "exp": 15},
                },
                {
                    "type": "action",
                    "description": "5分間外を散歩し、新鮮な空気を吸いましょう",
                    "target": 5,
                    "reward": {"mpBonus": 2, "coins": 25, "exp": 25},
                },
                {
                    "type": "gratitude",
                    "description": "友達や家族に感謝のメッセージを送って、気持ちを伝えます",
                    "target": 1,
                    "reward": {"mpBonus": 3, "coins": 15, "exp": 15},
                },
                {
                    "type": "movement",
                    "description": "ストレッチを行い、緊張した体を優しくほぐしましょう",
                    "target": 1,
                    "reward": {"mpBonus": 0, "coins": 20, "exp": 20},
                },
            ]
        }
    else:  # default/en
        return {
            "tasks": [
                {
                    "type": "breathing",
                    "description": "Do a 3-minute soothing breathing exercise to align with your hero.",
                    "target": 3,
                    "reward": {"mpBonus": 5, "coins": 10, "exp": 15},
                },
                {
                    "type": "sorting",
                    "description": "Tidy up your desk to organize your thoughts.",
                    "target": 1,
                    "reward": {"mpBonus": 0, "coins": 20, "exp": 20},
                },
                {
                    "type": "writing",
                    "description": "Write down one warm thought or kind gesture from today.",
                    "target": 1,
                    "reward": {"mpBonus": 0, "coins": 15, "exp": 15},
                },
                {
                    "type": "action",
                    "description": "Walk outside for 5 minutes, breathing fresh air and embracing nature.",
                    "target": 5,
                    "reward": {"mpBonus": 2, "coins": 25, "exp": 25},
                },
                {
                    "type": "gratitude",
                    "description": "Send a thank-you text to a friend or family member.",
                    "target": 1,
                    "reward": {"mpBonus": 3, "coins": 15, "exp": 15},
                },
                {
                    "type": "movement",
                    "description": "Stretch your body to release any physical tension.",
                    "target": 1,
                    "reward": {"mpBonus": 0, "coins": 20, "exp": 20},
                },
            ]
        }


def generate_quests(
    hero_name: str,
    monster_name: str,
    hero_story: str,
    language: str = "zh",
) -> dict:
    """Generate daily quests based on hero and monster characteristics.

    Args:
        hero_name: Name of the hero character
        monster_name: Name of the monster/inner-demon character
        hero_story: Hero's background story
        language: Output language for descriptions - 'zh', 'en', or 'ja'

    Returns:
        QuestData with list of 6 daily tasks
    """
    lang = language if language in LANGUAGE_INSTRUCTIONS else "zh"

    # Fast-track mock fallback if in test suite
    if os.environ.get("INTEGRATION_TEST") == "TRUE":
        print(
            f"[quest_gen] INTEGRATION_TEST is active. Returning mock quests in {lang}."
        )
        return _generate_mock_quests(lang)

    lang_instruction = LANGUAGE_INSTRUCTIONS[lang]

    system_prompt = f"""你是一位动森风格的日常任务设计师。根据英雄和心魔信息生成6个日常任务，输出JSON：
{{
  "tasks": [
    {{
      "type": "breathing|sorting|writing|action|gratitude|movement",
      "description": "任务描述",
      "target": 目标数字,
      "reward": {{"mpBonus": MP奖励或0, "coins": 铃钱奖励, "exp": 经验奖励}}
    }}
  ]
}}
{lang_instruction}
任务应与英雄技能和心魔弱点相关联。输出ONLY JSON。"""

    user_content = f"英雄：{hero_name}，心魔：{monster_name}，英雄背景：{hero_story}"

    gemini_key = os.environ.get("GEMINI_API_KEY", "")
    if not gemini_key:
        print("[quest_gen] GEMINI_API_KEY not set. Returning mock quests.")
        return _generate_mock_quests(lang)

    try:
        response = requests.post(
            f"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key={gemini_key}",
            headers={"Content-Type": "application/json"},
            json={
                "systemInstruction": {"parts": [{"text": system_prompt}]},
                "contents": [{"parts": [{"text": user_content}]}],
            },
            timeout=60,
        )
        response.raise_for_status()

        text = response.json()["candidates"][0]["content"]["parts"][0]["text"]
        cleaned = (
            text.replace("```json\n", "")
            .replace("```json", "")
            .replace("```", "")
            .strip()
        )
        data = json.loads(cleaned)

        quests = QuestData(tasks=[Quest(**t) for t in data.get("tasks", [])])
        print(f"[quest_gen] Generated {len(quests.tasks)} quests in {lang}")
        return quests.model_dump()
    except Exception as e:
        print(f"[quest_gen] Gemini generation failed: {e}. Returning mock quests.")
        return _generate_mock_quests(lang)
