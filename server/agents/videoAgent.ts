/**
 * Agent 3: Victory Animation Generation (Video API TBD)
 * Takes animation prompt + hero/monster images → generates 2-3s victory animation
 * Video API endpoint to be provided tomorrow via environment variable
 */

export interface GeneratedVideo {
  videoUrl: string;
  status: 'success' | 'error' | 'fallback';
  message?: string;
}

export async function generateVideo(
  animationPrompt: string,
  heroUrl: string,
  monsterUrl: string,
  worryType: string,
): Promise<GeneratedVideo> {
  // Video API endpoint will be read from environment variable
  const videoApiEndpoint = process.env.VIDEO_API_ENDPOINT;
  const videoApiKey = process.env.VIDEO_API_KEY;

  if (!videoApiEndpoint || !videoApiKey) {
    console.warn('[videoAgent] VIDEO_API_ENDPOINT or VIDEO_API_KEY not set, using fallback');
    return generateVideoFallback(heroUrl, monsterUrl, worryType);
  }

  try {
    const response = await fetch(videoApiEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${videoApiKey}`,
      },
      body: JSON.stringify({
        prompt: animationPrompt,
        heroImageUrl: heroUrl,
        monsterImageUrl: monsterUrl,
        duration: 3,
        aspectRatio: '16:9',
        quality: 'high',
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error(`Video API error: ${response.status}`, errorData);
      return generateVideoFallback(heroUrl, monsterUrl, worryType);
    }

    const data = await response.json();
    const videoUrl = data.videoUrl || data.url || data.video_url;

    if (!videoUrl) {
      console.error('[videoAgent] No video URL in response:', data);
      return generateVideoFallback(heroUrl, monsterUrl, worryType);
    }

    return {
      videoUrl,
      status: 'success',
    };
  } catch (error) {
    console.error('[videoAgent] Error calling video API:', error);
    return generateVideoFallback(heroUrl, monsterUrl, worryType);
  }
}

async function generateVideoFallback(heroUrl: string, monsterUrl: string, worryType: string): Promise<GeneratedVideo> {
  // Fallback: 3-keyframe FFmpeg GIF synthesis or placeholder video
  // TODO: Implement FFmpeg 3-frame GIF synthesis
  // For now, return a placeholder with fallback flag

  const fallbackUrl = `https://placeholder.com/videos/victory-${worryType}.mp4`;
  console.log(`[videoAgent] Using fallback video: ${fallbackUrl}`);

  return {
    videoUrl: fallbackUrl,
    status: 'fallback',
    message: 'Using fallback video (API not configured)',
  };
}

/**
 * Helper: synthesize GIF from 3 keyframes using FFmpeg
 * This will be called when VIDEO_API_ENDPOINT is not available
 * Requires: ffmpeg binary, imagemagick
 */
export async function synthesizeGifFallback(
  keyframe1Url: string,
  keyframe2Url: string,
  keyframe3Url: string,
  outputPath: string,
): Promise<string> {
  // TODO: Download images from URLs → synthesize GIF with FFmpeg
  // ffmpeg -framerate 1 -pattern_type glob -i 'frame_*.png' -c:v libvpx-vp9 -pix_fmt yuva420p output.webm
  // return outputPath or upload to Supabase

  console.log('[videoAgent] GIF synthesis not yet implemented');
  return 'https://placeholder.com/videos/fallback.webm';
}
