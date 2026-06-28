"""
Game Orchestrator Agent — Google ADK 2.0
Orchestrates therapeutic game generation: text content, images, quests, victory video.
"""

from dotenv import load_dotenv
from google.adk.agents.context import Context
from google.adk.apps import App
from google.adk.events.event import Event
from google.adk.events.request_input import RequestInput
from google.adk.workflow import START, JoinNode, Workflow, node
from pydantic import BaseModel, model_validator

from .tools.image_gen import generate_images, generate_victory_image
from .tools.quest_gen import generate_quests
from .tools.text_analysis import generate_text_content
from .tools.video_gen import generate_video

load_dotenv()


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


class GameInput(BaseModel):
    worry_text: str
    worry_type: str
    language: str = "zh"

    @model_validator(mode="before")
    @classmethod
    def parse_from_content(cls, data):
        # 1. If it's a Content object or dict with 'parts'
        if hasattr(data, "parts") or (isinstance(data, dict) and "parts" in data):
            parts = data.parts if hasattr(data, "parts") else data["parts"]
            text = ""
            for part in parts:
                if hasattr(part, "text") and part.text:
                    text += part.text
                elif isinstance(part, dict) and "text" in part:
                    text += part["text"]
                elif (
                    isinstance(part, dict)
                    and "root" in part
                    and isinstance(part["root"], dict)
                    and "text" in part["root"]
                ):
                    text += part["root"]["text"]
                elif (
                    hasattr(part, "root")
                    and hasattr(part.root, "text")
                    and part.root.text
                ):
                    text += part.root.text

            text = text.strip()
            if text.startswith("{") and text.endswith("}"):
                try:
                    import json

                    parsed = json.loads(text)
                    return {
                        "worry_text": parsed.get("worry_text", text),
                        "worry_type": parsed.get("worry_type", "work_stress"),
                        "language": parsed.get("language", "zh"),
                    }
                except Exception:
                    pass

            lang = "en"
            if any(ord(c) > 127 for c in text):
                lang = "zh"

            worry_type = "work_stress"
            text_lower = text.lower()
            if (
                "growth" in text_lower
                or "learning" in text_lower
                or "study" in text_lower
            ):
                worry_type = "learning_growth"
            elif (
                "interpersonal" in text_lower
                or "friend" in text_lower
                or "social" in text_lower
            ):
                worry_type = "interpersonal"
            elif "family" in text_lower or "parent" in text_lower:
                worry_type = "family_origin"

            return {
                "worry_text": text or "no worry text provided",
                "worry_type": worry_type,
                "language": lang,
            }

        # 2. If it is already a dictionary but missing required keys, supply defaults
        if isinstance(data, dict):
            if "worry_text" not in data:
                data["worry_text"] = "no worry text provided"
            if "worry_type" not in data:
                data["worry_type"] = "work_stress"
            if "language" not in data:
                data["language"] = "zh"

        return data


class WorkflowOutput(BaseModel):
    videoUrl: str
    status: str
    message: str | None = None


@node
def text_gen_node(ctx: Context, node_input: GameInput) -> Event:
    data = generate_text_content(
        worry_text=node_input.worry_text,
        worry_type=node_input.worry_type,
        language=node_input.language,
    )
    # Save inputs and generated text content to state
    state_delta = {
        "worry_text": node_input.worry_text,
        "worry_type": node_input.worry_type,
        "language": node_input.language,
        **data,
    }
    return Event(output=data, state=state_delta)


@node
def image_gen_node(ctx: Context, node_input: dict) -> Event:
    worry_type = ctx.state.get("worry_type")
    image_prompt_hero = ctx.state.get("imagePromptHero")
    image_prompt_monster = ctx.state.get("imagePromptMonster")

    images = generate_images(
        image_prompt_hero=image_prompt_hero,
        image_prompt_monster=image_prompt_monster,
        worry_type=worry_type,
    )
    return Event(output=images, state=images)


@node
def quest_gen_node(ctx: Context, node_input: dict) -> Event:
    hero_name = ctx.state.get("heroName")
    monster_name = ctx.state.get("monsterName")
    hero_story = ctx.state.get("heroStory")
    language = ctx.state.get("language", "zh")

    quests = generate_quests(
        hero_name=hero_name,
        monster_name=monster_name,
        hero_story=hero_story,
        language=language,
    )
    return Event(output=quests, state={"quests": quests})


@node(name="battle_hitl_node", rerun_on_resume=True)
async def battle_hitl_node(ctx: Context, node_input: dict):
    if not ctx.resume_inputs or "battle_won" not in ctx.resume_inputs:
        yield RequestInput(
            interrupt_id="battle_won",
            message="Please confirm when you have won the battle to generate your victory celebration!",
        )
        return

    # Once resumed, output the value
    yield Event(
        output=ctx.resume_inputs["battle_won"],
        state={"battle_won": ctx.resume_inputs["battle_won"]},
    )


@node
def victory_image_node(ctx: Context, node_input: dict | bool) -> Event:
    victory_image_prompt = ctx.state.get("victoryImagePrompt")
    victory_image_data = generate_victory_image(victory_image_prompt)
    return Event(output=victory_image_data, state=victory_image_data)


@node
def video_gen_node(ctx: Context, node_input: dict) -> Event:
    animation_prompt = ctx.state.get("animationPrompt")
    hero_url = ctx.state.get("heroUrl")
    monster_url = ctx.state.get("monsterUrl")

    video_data = generate_video(
        animation_prompt=animation_prompt, hero_url=hero_url, monster_url=monster_url
    )
    return Event(output=video_data, state=video_data)


# Define Graph structure
join = JoinNode(name="merge")

edges = [
    (START, text_gen_node),
    (text_gen_node, (image_gen_node, quest_gen_node)),
    ((image_gen_node, quest_gen_node), join),
    (join, battle_hitl_node),
    (battle_hitl_node, victory_image_node),
    (victory_image_node, video_gen_node),
]

root_agent = Workflow(
    name="game_orchestrator",
    description=(
        "Therapeutic game orchestrator that turns player worries into CBT-based "
        "game adventures with heroes, monsters, daily quests, and victory animations."
    ),
    edges=edges,
    input_schema=GameInput,
    output_schema=WorkflowOutput,
)

app = App(root_agent=root_agent, name="game_agents")
