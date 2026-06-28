"""
Tool: generate_video
Mirrors videoAgent.ts — Agnes AI video with polling, empty string fallback
"""

import os
import time

import requests

POLL_INTERVAL_S = 4
POLL_MAX_ATTEMPTS = 20  # 80s max


def _poll_for_video(poll_url: str, headers: dict) -> str | None:
    for _ in range(POLL_MAX_ATTEMPTS):
        time.sleep(POLL_INTERVAL_S)
        try:
            response = requests.get(poll_url, headers=headers, timeout=30)
            if not response.ok:
                continue
            data = response.json()
            status = data.get("status") or data.get("state")
            if status in ("completed", "succeeded", "success"):
                return (
                    data.get("video_url")
                    or data.get("url")
                    or data.get("videoUrl")
                    or (data.get("output") or {}).get("url")
                )
            if status in ("failed", "error"):
                raise RuntimeError(f"Video job failed: {data.get('error') or status}")
        except RuntimeError:
            raise
        except Exception:
            continue
    raise RuntimeError("Video generation timed out")


def generate_video(
    animation_prompt: str,
    hero_url: str,
    monster_url: str,
) -> dict:
    """Generate victory animation video.

    Args:
        animation_prompt: English prompt describing the victory animation scene
        hero_url: URL of the hero character image for visual consistency
        monster_url: URL of the monster character image for visual consistency

    Returns:
        dict with videoUrl (empty string if generation failed), status, message
    """
    agnes_key = os.environ.get("AGNES_API_KEY") or os.environ.get("GEMINI_API_KEY", "")
    agnes_base_url = os.environ.get("AGNES_BASE_URL", "https://apihub.agnes-ai.com/v1")
    video_model = os.environ.get("AGNES_VIDEO_MODEL", "agnes-video-v2.0")

    # Primary: Agnes AI (or Gemini API key acting as proxy)
    if agnes_key:
        try:
            headers = {
                "Content-Type": "application/json",
                "Authorization": f"Bearer {agnes_key}",
            }
            response = requests.post(
                f"{agnes_base_url}/videos/generations",
                headers=headers,
                json={
                    "model": video_model,
                    "prompt": animation_prompt,
                    "image_url": hero_url or None,
                    "duration": 3,
                    "aspect_ratio": "16:9",
                    "quality": "standard",
                },
                timeout=60,
            )
            response.raise_for_status()
            data = response.json()

            immediate_url = (
                data.get("video_url")
                or data.get("url")
                or data.get("videoUrl")
                or (data.get("data") or [{}])[0].get("url")
            )
            if immediate_url:
                print("[video_gen] Agnes returned video URL immediately")
                return {"videoUrl": immediate_url, "status": "success"}

            job_id = data.get("id") or data.get("job_id") or data.get("task_id")
            if job_id:
                print(f"[video_gen] Agnes video job {job_id}, polling...")
                poll_url = f"{agnes_base_url}/videos/generations/{job_id}"
                video_url = _poll_for_video(
                    poll_url, {"Authorization": f"Bearer {agnes_key}"}
                )
                if video_url:
                    return {"videoUrl": video_url, "status": "success"}
        except Exception as e:
            print(f"[video_gen] Agnes AI failed: {e}")

    # Secondary: generic VIDEO_API_ENDPOINT
    video_endpoint = os.environ.get("VIDEO_API_ENDPOINT", "")
    video_api_key = os.environ.get("VIDEO_API_KEY", "")
    if video_endpoint and video_api_key and "example.com" not in video_endpoint:
        try:
            response = requests.post(
                video_endpoint,
                headers={
                    "Content-Type": "application/json",
                    "Authorization": f"Bearer {video_api_key}",
                },
                json={
                    "prompt": animation_prompt,
                    "heroImageUrl": hero_url,
                    "monsterImageUrl": monster_url,
                    "duration": 3,
                    "aspectRatio": "16:9",
                },
                timeout=60,
            )
            if response.ok:
                data = response.json()
                video_url = (
                    data.get("videoUrl") or data.get("url") or data.get("video_url")
                )
                if video_url:
                    return {"videoUrl": video_url, "status": "success"}
        except Exception as e:
            print(f"[video_gen] Legacy endpoint failed: {e}")

    print("[video_gen] All providers failed, returning empty")
    return {
        "videoUrl": "",
        "status": "fallback",
        "message": "Video generation unavailable",
    }
