/**
 * Agent 2: Image Generation
 * Tier 1: Gemini 2.5 Flash Image (Interactions API)
 * Tier 2: Agnes AI (OpenAI-compatible images/generations)
 * Tier 3: Local preset images by worryType
 */

import fs from 'fs';
import path from 'path';

export const IMAGE_STYLE_PREFIX = `Style: cozy flat-illustration, warm parchment palette (#f8f8f0), mint teal accent (#19c8b9), pill shapes, Nintendo game-button aesthetic, pastel polka-dot textures, pastoral atmosphere. NOT Animal Crossing fan art — independent original illustration in similar warm game style. 512x512px PNG, transparent background.`;

export interface GeneratedImages {
  heroUrl: string;
  monsterUrl: string;
}

export interface AgnesImageConfig {
  agnesKey?: string;
  agnesBaseUrl?: string;
  agnesImageModel?: string;
}

const WORRY_IMAGES: Record<string, { hero: string; monster: string }> = {
  work_stress:        { hero: '/hero-monster/panda.png',    monster: '/hero-monster/woodpecker.png' },
  learning_growth:    { hero: '/hero-monster/owl.png',      monster: '/hero-monster/hamster.png' },
  interpersonal:      { hero: '/hero-monster/capybara.png', monster: '/hero-monster/hedgehog.png' },
  family_origin:      { hero: '/hero-monster/deer.png',     monster: '/hero-monster/hermitcrab.png' },
  social_environment: { hero: '/hero-monster/koala.png',    monster: '/hero-monster/chameleon.png' },
  physical_health:    { hero: '/hero-monster/otter.png',    monster: '/hero-monster/raccoon.png' },
  time_management:    { hero: '/hero-monster/turtle.png',   monster: '/hero-monster/ant.png' },
  emotion_management: { hero: '/hero-monster/sloth.png',    monster: '/hero-monster/pufferfish.png' },
};

const GENERATED_DIR = '/tmp/claude-generated-images';
const SERVER_URL = `http://localhost:${process.env.PORT || 3001}`;

function saveBase64Image(base64: string, filename: string): string {
  fs.mkdirSync(GENERATED_DIR, { recursive: true });
  fs.writeFileSync(path.join(GENERATED_DIR, `${filename}.png`), Buffer.from(base64, 'base64'));
  return `${SERVER_URL}/generated-images/${filename}.png`;
}

async function generateWithGemini(prompt: string, filename: string, apiKey: string): Promise<string> {
  const res = await fetch('https://generativelanguage.googleapis.com/v1beta/interactions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-goog-api-key': apiKey },
    body: JSON.stringify({
      model: 'gemini-2.5-flash-image',
      input: `${IMAGE_STYLE_PREFIX}\n\n${prompt}`,
      stream: false,
    }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(`Gemini image API ${res.status}: ${JSON.stringify(err)}`);
  }
  const data = await res.json();
  const imageStep = data?.steps?.flatMap((s: any) => s.content ?? []).find((c: any) => c.type === 'image');
  if (!imageStep?.data) throw new Error('No image data in Gemini response');
  console.log(`[imageAgent] Gemini generated ${filename}`);
  return saveBase64Image(imageStep.data, filename);
}

async function generateWithAgnes(prompt: string, filename: string, agnes: AgnesImageConfig): Promise<string> {
  const baseUrl = agnes.agnesBaseUrl || 'https://apihub.agnes-ai.com/v1';
  const res = await fetch(`${baseUrl}/images/generations`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${agnes.agnesKey}`,
    },
    body: JSON.stringify({
      model: agnes.agnesImageModel || 'agnes-image-2.1-flash',
      prompt: `${IMAGE_STYLE_PREFIX}\n\n${prompt}`,
      n: 1,
      size: '512x512',
      response_format: 'b64_json',
    }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(`Agnes image API ${res.status}: ${JSON.stringify(err)}`);
  }
  const data = await res.json();
  const b64 = data?.data?.[0]?.b64_json;
  if (!b64) throw new Error('No image data in Agnes response');
  console.log(`[imageAgent] Agnes AI generated ${filename}`);
  return saveBase64Image(b64, filename);
}

export async function generateImages(
  imagePromptHero: string,
  imagePromptMonster: string,
  worryType: string,
  geminiApiKey: string,
  _supabaseToken?: string,
  agnes?: AgnesImageConfig,
): Promise<GeneratedImages> {
  const ts = Date.now();

  // Tier 1: Gemini 2.5 Flash Image
  try {
    const [heroUrl, monsterUrl] = await Promise.all([
      generateWithGemini(imagePromptHero, `hero-${worryType}-${ts}`, geminiApiKey),
      generateWithGemini(imagePromptMonster, `monster-${worryType}-${ts}`, geminiApiKey),
    ]);
    return { heroUrl, monsterUrl };
  } catch (err) {
    console.warn('[imageAgent] Gemini failed, trying Agnes AI:', (err as Error).message);
  }

  // Tier 2: Agnes AI
  if (agnes?.agnesKey) {
    try {
      const [heroUrl, monsterUrl] = await Promise.all([
        generateWithAgnes(imagePromptHero, `hero-${worryType}-${ts}`, agnes),
        generateWithAgnes(imagePromptMonster, `monster-${worryType}-${ts}`, agnes),
      ]);
      return { heroUrl, monsterUrl };
    } catch (err) {
      console.warn('[imageAgent] Agnes AI failed, using preset fallback:', (err as Error).message);
    }
  }

  // Tier 3: local preset
  console.warn('[imageAgent] Using local preset for', worryType);
  return WORRY_IMAGES[worryType] ?? WORRY_IMAGES.work_stress;
}

export async function generateVictoryImage(
  victoryImagePrompt: string,
  _heroUrl: string,
  _monsterUrl: string,
  geminiApiKey: string,
  _supabaseToken?: string,
  agnes?: AgnesImageConfig,
): Promise<string> {
  const filename = `victory-${Date.now()}`;
  try {
    return await generateWithGemini(victoryImagePrompt, filename, geminiApiKey);
  } catch {
    if (agnes?.agnesKey) {
      try {
        return await generateWithAgnes(victoryImagePrompt, filename, agnes);
      } catch {}
    }
    return '';
  }
}
