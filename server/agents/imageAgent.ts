/**
 * Agent 2: Image Generation (Gemini)
 * Takes image prompts from Agent 1 → generates hero/monster PNG (512×512, transparent)
 * Uploads to Supabase Storage → returns CDN URLs
 */

const IMAGE_STYLE_PREFIX = `Style anchors (from doc Section 6):
- Warm parchment palette: backgrounds #f8f8f0 / rgb(247,243,223), text #725d42 / #794f27
- Mint teal accent: #19c8b9, focus yellow #ffcc00
- Pill shapes (12–50px radius), 3D pixel-stack shadows (Nintendo game-button aesthetic)
- Nunito + Noto Sans SC fonts, weights 500–900, never below 400
- No pure black, no cold gray, no sharp right angles, no blue focus rings
- Cozy flat-illustration style, pastel polka-dot textures, pastoral atmosphere
- Image target: 512×512px PNG, no background (transparent)
- NOT Animal Crossing fan art — independent original illustration in similar warm game style, 8k`;

export interface GeneratedImages {
  heroUrl: string;
  monsterUrl: string;
}

export async function generateImages(
  imagePromptHero: string,
  imagePromptMonster: string,
  worryType: string,
  geminiApiKey: string,
  supabaseToken?: string,
): Promise<GeneratedImages> {
  try {
    // Generate hero image
    const heroPromptFull = `${IMAGE_STYLE_PREFIX}\n\n${imagePromptHero}\n\n--ar 1:1`;
    const heroUrl = await generateAndUploadImage(heroPromptFull, `hero-${worryType}`, geminiApiKey, supabaseToken);

    // Generate monster image
    const monsterPromptFull = `${IMAGE_STYLE_PREFIX}\n\n${imagePromptMonster}\n\n--ar 1:1`;
    const monsterUrl = await generateAndUploadImage(
      monsterPromptFull,
      `monster-${worryType}`,
      geminiApiKey,
      supabaseToken,
    );

    return {
      heroUrl,
      monsterUrl,
    };
  } catch (error) {
    console.error('imageAgent error:', error);
    throw error;
  }
}

async function generateAndUploadImage(
  prompt: string,
  filename: string,
  geminiApiKey: string,
  supabaseToken?: string,
): Promise<string> {
  // For now, use Gemini Vision API for image generation
  // This will call an image generation model (e.g., Imagen via Gemini)
  // TODO: Update to use Gemini's actual image generation when available

  // Placeholder: use a mock generation or integrate with real image API
  // Expected flow: call Gemini image endpoint → get PNG binary → upload to Supabase → return CDN URL

  const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-goog-api-key': geminiApiKey,
    },
    body: JSON.stringify({
      contents: [
        {
          parts: [
            {
              text: `Generate an image based on this prompt:\n${prompt}`,
            },
          ],
        },
      ],
      generationConfig: {
        temperature: 1,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 2048,
      },
    }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(`Gemini API error: ${response.status} ${JSON.stringify(errorData)}`);
  }

  const data = await response.json();
  console.log('Gemini response:', data);

  // TODO: Parse image from response, upload to Supabase Storage
  // For now, return placeholder URL
  // Once actual image is generated:
  // 1. Convert to PNG blob
  // 2. Upload to Supabase: supabase.storage.from('hero-monster').upload(`${filename}.png`, blob)
  // 3. Return public URL: https://<project>.supabase.co/storage/v1/object/public/hero-monster/{filename}.png

  const mockUrl = `https://placeholder.com/images/${filename}.png`;
  console.log(`[imageAgent] Generated ${filename} → ${mockUrl}`);

  return mockUrl;
}
