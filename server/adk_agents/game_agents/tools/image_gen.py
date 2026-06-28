"""
Tool: generate_images
Mirrors imageAgent.ts — 3-tier fallback:
Tier 1: Gemini 2.5 Flash Image (Interactions API)
Tier 2: Agnes AI (OpenAI-compatible images/generations)
Tier 3: Local preset paths by worryType
"""

import base64
import os
import time

import requests
from pydantic import BaseModel

IMAGE_STYLE_PREFIX = (
    "Style: cozy flat-illustration, warm parchment palette (#f8f8f0), "
    "mint teal accent (#19c8b9), pill shapes, Nintendo game-button aesthetic, "
    "pastel polka-dot textures, pastoral atmosphere. NOT Animal Crossing fan art — "
    "independent original illustration in similar warm game style. 512x512px PNG, transparent background."
)

GENERATED_DIR = "/tmp/adk-generated-images"

WORRY_IMAGES = {
    "work_stress": {
        "heroUrl": "/hero-monster/panda.png",
        "monsterUrl": "/hero-monster/hamster.png",
    },
    "learning_growth": {
        "heroUrl": "/hero-monster/owl.png",
        "monsterUrl": "/hero-monster/hamster.png",
    },
    "interpersonal": {
        "heroUrl": "/hero-monster/capybara.png",
        "monsterUrl": "/hero-monster/hedgehog.png",
    },
    "family_origin": {
        "heroUrl": "/hero-monster/deer.png",
        "monsterUrl": "/hero-monster/hermitcrab.png",
    },
    "social_environment": {
        "heroUrl": "/hero-monster/koala.png",
        "monsterUrl": "/hero-monster/chameleon.png",
    },
    "physical_health": {
        "heroUrl": "/hero-monster/otter.png",
        "monsterUrl": "/hero-monster/raccoon.png",
    },
    "time_management": {
        "heroUrl": "/hero-monster/turtle.png",
        "monsterUrl": "/hero-monster/ant.png",
    },
    "emotion_management": {
        "heroUrl": "/hero-monster/sloth.png",
        "monsterUrl": "/hero-monster/pufferfish.png",
    },
}


class GeneratedImages(BaseModel):
    heroUrl: str
    monsterUrl: str


def _save_base64(b64_data: str, filename: str) -> str:
    os.makedirs(GENERATED_DIR, exist_ok=True)
    path = os.path.join(GENERATED_DIR, f"{filename}.png")
    with open(path, "wb") as f:
        f.write(base64.b64decode(b64_data))
    server_url = os.environ.get("SERVER_URL", "http://localhost:3001")
    return f"{server_url}/generated-images/{filename}.png"


def _gemini_image(prompt: str, filename: str, api_key: str) -> str:
    response = requests.post(
        "https://generativelanguage.googleapis.com/v1beta/interactions",
        headers={"Content-Type": "application/json", "x-goog-api-key": api_key},
        json={
            "model": "gemini-2.5-flash-image",
            "input": f"{IMAGE_STYLE_PREFIX}\n\n{prompt}",
            "stream": False,
        },
        timeout=120,
    )
    response.raise_for_status()
    data = response.json()
    steps = data.get("steps", [])
    image_step = next(
        (
            c
            for s in steps
            for c in (s.get("content") or [])
            if c.get("type") == "image"
        ),
        None,
    )
    if not image_step or not image_step.get("data"):
        raise RuntimeError("No image data in Gemini response")
    return _save_base64(image_step["data"], filename)


def _agnes_image(
    prompt: str, filename: str, api_key: str, base_url: str, model: str
) -> str:
    response = requests.post(
        f"{base_url}/images/generations",
        headers={
            "Content-Type": "application/json",
            "Authorization": f"Bearer {api_key}",
        },
        json={
            "model": model,
            "prompt": f"{IMAGE_STYLE_PREFIX}\n\n{prompt}",
            "n": 1,
            "size": "512x512",
            "response_format": "b64_json",
        },
        timeout=120,
    )
    response.raise_for_status()
    data = response.json()
    b64 = data.get("data", [{}])[0].get("b64_json")
    if not b64:
        raise RuntimeError("No image data in Agnes response")
    return _save_base64(b64, filename)


def generate_images(
    image_prompt_hero: str,
    image_prompt_monster: str,
    worry_type: str,
) -> dict:
    """Generate hero and monster character images.

    Args:
        image_prompt_hero: English description of hero character for image generation
        image_prompt_monster: English description of monster character for image generation
        worry_type: Category used for preset fallback selection

    Returns:
        GeneratedImages with heroUrl and monsterUrl
    """
    gemini_key = os.environ.get("GEMINI_API_KEY", "")
    agnes_key = os.environ.get("AGNES_API_KEY", "")
    agnes_base_url = os.environ.get("AGNES_BASE_URL", "https://apihub.agnes-ai.com/v1")
    agnes_image_model = os.environ.get("AGNES_IMAGE_MODEL", "agnes-image-2.1-flash")
    ts = int(time.time())

    # Tier 1: Gemini 2.5 Flash Image
    if gemini_key:
        try:
            import concurrent.futures

            with concurrent.futures.ThreadPoolExecutor(max_workers=2) as executor:
                hero_future = executor.submit(
                    _gemini_image,
                    image_prompt_hero,
                    f"hero-{worry_type}-{ts}",
                    gemini_key,
                )
                monster_future = executor.submit(
                    _gemini_image,
                    image_prompt_monster,
                    f"monster-{worry_type}-{ts}",
                    gemini_key,
                )
                hero_url = hero_future.result()
                monster_url = monster_future.result()
            print(f"[image_gen] Gemini generated images for {worry_type}")
            return GeneratedImages(
                heroUrl=hero_url, monsterUrl=monster_url
            ).model_dump()
        except Exception as e:
            print(f"[image_gen] Gemini failed: {e}")

    # Tier 2: Agnes AI
    if agnes_key:
        try:
            import concurrent.futures

            with concurrent.futures.ThreadPoolExecutor(max_workers=2) as executor:
                hero_future = executor.submit(
                    _agnes_image,
                    image_prompt_hero,
                    f"hero-{worry_type}-{ts}",
                    agnes_key,
                    agnes_base_url,
                    agnes_image_model,
                )
                monster_future = executor.submit(
                    _agnes_image,
                    image_prompt_monster,
                    f"monster-{worry_type}-{ts}",
                    agnes_key,
                    agnes_base_url,
                    agnes_image_model,
                )
                hero_url = hero_future.result()
                monster_url = monster_future.result()
            print(f"[image_gen] Agnes AI generated images for {worry_type}")
            return GeneratedImages(
                heroUrl=hero_url, monsterUrl=monster_url
            ).model_dump()
        except Exception as e:
            print(f"[image_gen] Agnes AI failed: {e}")

    # Tier 3: Preset fallback
    print(f"[image_gen] Using preset for {worry_type}")
    return WORRY_IMAGES.get(worry_type, WORRY_IMAGES["work_stress"])


def generate_victory_image(victory_image_prompt: str) -> dict:
    """Generate victory celebration image.

    Args:
        victory_image_prompt: English prompt for the victory scene

    Returns:
        dict with victoryImageUrl key
    """
    gemini_key = os.environ.get("GEMINI_API_KEY", "")
    agnes_key = os.environ.get("AGNES_API_KEY", "")
    agnes_base_url = os.environ.get("AGNES_BASE_URL", "https://apihub.agnes-ai.com/v1")
    agnes_image_model = os.environ.get("AGNES_IMAGE_MODEL", "agnes-image-2.1-flash")
    filename = f"victory-{int(time.time())}"

    if gemini_key:
        try:
            url = _gemini_image(victory_image_prompt, filename, gemini_key)
            return {"victoryImageUrl": url}
        except Exception as e:
            print(f"[image_gen] Gemini victory image failed: {e}")

    if agnes_key:
        try:
            url = _agnes_image(
                victory_image_prompt,
                filename,
                agnes_key,
                agnes_base_url,
                agnes_image_model,
            )
            return {"victoryImageUrl": url}
        except Exception as e:
            print(f"[image_gen] Agnes victory image failed: {e}")

    return {"victoryImageUrl": ""}
