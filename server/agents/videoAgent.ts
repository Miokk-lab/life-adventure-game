/**
 * Agent 3: Victory Video Generation
 * Primary: Agnes AI (agnes-video-v2.0)
 * Fallback: generic VIDEO_API_ENDPOINT env var
 * Final fallback: empty string (frontend handles gracefully)
 */

export interface GeneratedVideo {
  videoUrl: string;
  status: 'success' | 'error' | 'fallback';
  message?: string;
}

const POLL_INTERVAL_MS = 4000;
const POLL_MAX_ATTEMPTS = 20; // 80s max

async function pollForVideo(
  pollUrl: string,
  headers: Record<string, string>,
): Promise<string | null> {
  for (let i = 0; i < POLL_MAX_ATTEMPTS; i++) {
    await new Promise(r => setTimeout(r, POLL_INTERVAL_MS));
    const res = await fetch(pollUrl, { headers });
    if (!res.ok) continue;
    const data = await res.json();
    // Agnes job statuses
    const status = data.status || data.state;
    if (status === 'completed' || status === 'succeeded' || status === 'success') {
      return data.video_url || data.url || data.videoUrl || data.output?.url || null;
    }
    if (status === 'failed' || status === 'error') {
      throw new Error(`Video job failed: ${data.error || data.message || status}`);
    }
    // still processing — continue polling
  }
  throw new Error('Video generation timed out');
}

async function generateWithAgnes(
  animationPrompt: string,
  heroUrl: string,
  monsterUrl: string,
): Promise<string> {
  const agnesKey = process.env.AGNES_API_KEY;
  const agnesBaseUrl = process.env.AGNES_BASE_URL || 'https://apihub.agnes-ai.com/v1';
  const model = process.env.AGNES_VIDEO_MODEL || 'agnes-video-v2.0';

  if (!agnesKey) throw new Error('AGNES_API_KEY not set');

  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${agnesKey}`,
  };

  const res = await fetch(`${agnesBaseUrl}/videos/generations`, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      model,
      prompt: animationPrompt,
      // Reference images for character consistency
      image_url: heroUrl || undefined,
      duration: 3,
      aspect_ratio: '16:9',
      quality: 'standard',
    }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(`Agnes video API ${res.status}: ${JSON.stringify(err)}`);
  }

  const data = await res.json();

  // Immediate URL (synchronous response)
  const immediateUrl = data.video_url || data.url || data.videoUrl || data.data?.[0]?.url;
  if (immediateUrl) {
    console.log('[videoAgent] Agnes AI returned video URL immediately');
    return immediateUrl;
  }

  // Job-based response — poll until complete
  const jobId = data.id || data.job_id || data.task_id;
  if (jobId) {
    console.log(`[videoAgent] Agnes AI video job created: ${jobId}, polling...`);
    const pollUrl = `${agnesBaseUrl}/videos/generations/${jobId}`;
    const videoUrl = await pollForVideo(pollUrl, { Authorization: `Bearer ${agnesKey}` });
    if (videoUrl) return videoUrl;
  }

  throw new Error('Agnes video: no URL or job ID in response');
}

export async function generateVideo(
  animationPrompt: string,
  heroUrl: string,
  monsterUrl: string,
  worryType: string,
): Promise<GeneratedVideo> {
  // Primary: Agnes AI
  try {
    const videoUrl = await generateWithAgnes(animationPrompt, heroUrl, monsterUrl);
    console.log(`[videoAgent] Agnes AI video ready: ${videoUrl}`);
    return { videoUrl, status: 'success' };
  } catch (err) {
    console.warn('[videoAgent] Agnes AI failed:', (err as Error).message);
  }

  // Secondary: generic VIDEO_API_ENDPOINT (legacy)
  const videoApiEndpoint = process.env.VIDEO_API_ENDPOINT;
  const videoApiKey = process.env.VIDEO_API_KEY;
  if (videoApiEndpoint && videoApiKey && !videoApiEndpoint.includes('example.com')) {
    try {
      const res = await fetch(videoApiEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${videoApiKey}` },
        body: JSON.stringify({ prompt: animationPrompt, heroImageUrl: heroUrl, monsterImageUrl: monsterUrl, duration: 3, aspectRatio: '16:9' }),
      });
      if (res.ok) {
        const data = await res.json();
        const videoUrl = data.videoUrl || data.url || data.video_url;
        if (videoUrl) return { videoUrl, status: 'success' };
      }
    } catch (err) {
      console.warn('[videoAgent] Legacy endpoint failed:', (err as Error).message);
    }
  }

  // Final fallback: no video (frontend handles gracefully)
  console.warn('[videoAgent] All video providers failed, returning empty');
  return { videoUrl: '', status: 'fallback', message: 'Video generation unavailable' };
}
