# Agent 3: Victory Animation (Image + Video Generation)

## Role
Generate victory celebration artwork and animation. First generates static image, then generates video. If video times out, displays image in modal as fallback.

## Input (from Agent 1 + Agent 2)
```json
{
  "taskId": "string",
  "heroName": "string (from Agent 1)",
  "monsterName": "string (from Agent 1)",
  "victoryImagePrompt": "string (from Agent 1, English)",
  "animationPrompt": "string (from Agent 1, English with 3 keyframes)",
  "heroUrl": "string (hero PNG URL from Agent 2)",
  "monsterUrl": "string (monster PNG URL from Agent 2)"
}
```

## Output
```json
{
  "status": "success" | "image_only" | "error",
  "imageUrl": "https://supabase.../victory_image_[timestamp].png",
  "videoUrl": "https://supabase.../victory_video_[timestamp].mp4",
  "fallbackImage": "https://supabase.../victory_image_[timestamp].png",
  "generationTime": {
    "imageMs": number,
    "videoMs": number
  }
}
```

## Workflow

### Phase 1: Victory Image (2-3 seconds)
1. Receive `victoryImagePrompt` from Agent 1
2. Prepend style prefix (same as Agent 2)
3. Call Gemini 2.0 vision OR Replicate image API
4. Generate 512×512 PNG with transparent background
5. Upload to Supabase: `/adventures/{taskId}/victory_image_{timestamp}.png`
6. Return URL immediately (don't wait for video)

### Phase 2: Victory Video (6-12 seconds, async)
1. **In parallel**, start video generation using:
   - `animationPrompt` from Agent 1 (3 keyframes description)
   - `heroUrl` (PNG from Agent 2)
   - `monsterUrl` (PNG from Agent 2)
   - Style: 2-3 second loopable animation, 512×512 or 1024×768
2. Call video API (via env var `VICTORY_ANIMATION_API_ENDPOINT`)
3. **Timeout: 12 seconds**
4. Upload to Supabase: `/adventures/{taskId}/victory_video_{timestamp}.mp4`
5. Return URL when complete

### Phase 3: Fallback Logic
- If video fails/times out → return `"status": "image_only"`
- Frontend shows image in full-screen modal instead
- Video can continue generating in background; UI polls for completion
- Once video ready, offer to replay as animation

---

## Victory Image Prompt Structure

**Style Prefix (required):**
```
- Warm parchment palette: backgrounds `#f8f8f0` / `rgb(247,243,223)`, text `#725d42` / `#794f27`
- Mint teal accent: `#19c8b9`, focus yellow `#ffcc00`
- Pill shapes (12–50px radius), 3D pixel-stack shadows (Nintendo game-button aesthetic)
- Nunito + Noto Sans SC fonts, weights 500–900, never below 400
- No pure black, no cold gray, no sharp right angles, no blue focus rings
- Cozy flat-illustration style, pastel polka-dot textures, pastoral atmosphere, celebratory mood
- Image target: 512×512px PNG
```

**Prompt Template:**
```
[STYLE PREFIX]
[Hero name] and [Monster name (now transformed)]: [both looking peaceful/happy/at peace]
[Scene]: [The transformation is complete — victory celebration]
[Hero's gesture]: [Offering something to monster, or comforting, or celebrating together]
[Monster's new form]: [Cute, healed version of the creature]
[Environment]: [Nature, magical elements, light/warmth]
[Color mood]: [Warm golds, greens, soft pastels — peaceful & joyful]
[Special details]: [Gift being offered, energy/light, natural elements]
[Tone]: Peaceful, joyful, compassionate, transformative
```

**Examples:**

#### Example 1: Work Stress Victory (from templates)
```
animal illustration, watercolor + ink style, soft diffused lighting, transparent background, detailed textures, warm color palette, 512x512 pixels, celebratory mood

Panda Youyou gently placing a hand on a small, calm robin (transformed woodpecker named 笃笃魔). 
Both animals surrounded by butterflies and floating tea leaves. 
Golden light, peace, transformation. 
Bamboo grove background. 
Warm greens, golds, whites. 
The robin holds a tiny blue apron. 
Youyou smiles peacefully as tea leaves drift down like snow.
```

#### Example 2: Learning Growth Victory (from templates)
```
animal illustration, watercolor + ink style, soft diffused lighting, transparent background, detailed textures, warm-cool palette, 512x512 pixels

Cute mouse wearing tiny glasses (transformed 圈圈魔) holding a card marked 『已掌握』, standing free on ground away from the spinning wheel.
Owl 学学 floating above with quill pen, drawing a glowing constellation map in the air.
Golden sunflower petals falling everywhere.
Bright stars and hopeful sky.
Warm golds, cool blues, soft cream colors.
The mouse looks relieved and proud. The owl looks wise and proud.
```

---

## Animation Prompt Structure

**Keyframe Format (for video API):**
```
Frame 0 (0s):
- [Hero state and position]
- [Monster state and position — usually in distress]
- [Environment/context]

Frame 1 (1-1.5s):
- [Hero's action/gesture toward monster]
- [Monster beginning to transform — subtle changes]
- [Light/magical effects beginning]

Frame 2 (2-3s):
- [Transformation complete — both at peace]
- [Celebration or gift exchange]
- [Full magical light/warmth]
- [Loop back to end state]
```

**Examples:**

#### Example 1: Work Stress Animation
```
Frame 0 (0s):
Frantic woodpecker 笃笃魔 pecking wildly at a tree trunk, eyes crazed and movements jerky.
Panda Youyou approaches slowly from the left side, breathing gently, moving with calm intention.
Forest setting, dappled light.

Frame 1 (1.5s):
Youyou's hand (paw) reaches out and touches the woodpecker's wing softly.
Woodpecker's frantic pecking slows immediately.
Golden light begins to surround both creatures.
Woodpecker's feathers soften and reorganize.
Eyes begin to focus and calm.

Frame 2 (3s):
Woodpecker has transformed into a small, cute robin wearing a blue apron.
Both Youyou and the robin stand peacefully together.
Tea leaves float down gently around them like snow.
Warm golden light fills the scene.
Bamboo trees frame the scene peacefully.
The robin places a small hand on Youyou's shoulder.
END: Both at peace under the bamboo canopy.
```

#### Example 2: Learning Growth Animation
```
Frame 0 (0s):
Hamster 圈圈魔 running frantically on a spinning wheel, eyes wide and empty with desperation.
Wheel spinning so fast it's a blur.
Owl 学学 watches from a branch above, holding a glowing quill pen.
Dark, anxious lighting.

Frame 1 (1.5s):
Owl begins to draw a magical circle in the air with the quill.
The spinning wheel starts to slow.
Golden light begins to glow where the quill draws.
Hamster gradually slows its running.
The wheel begins to shimmer and break apart.

Frame 2 (3s):
Wheel shatters into golden sunflower petals floating gently downward.
Hamster steps gracefully off the ground (petals support it).
Transforms into a cute mouse wearing tiny glasses.
Holding a card labeled 『已掌握』 (Mastered).
Owl 学学 descends, and both are surrounded by a glowing constellation map.
Sunflowers bloom around them.
Starlight fills the sky.
END: Mouse and owl surrounded by peace, wisdom, and mastery.
```

---

## Implementation Details

### Victory Image Generation
**Model Options:**
- Gemini 2.0 vision (preferred, fast)
- Replicate API (fallback, slower)

**Call:**
```typescript
async function generateVictoryImage(
  victoryImagePrompt: string
): Promise<string> {
  const startTime = Date.now();
  
  const prompt = `
    animal illustration, watercolor + ink style, soft diffused lighting,
    fully transparent background, detailed textures, warm color palette,
    512x512 pixels, celebratory mood
    
    ${victoryImagePrompt}
  `;
  
  try {
    const image = await geminiVisionAPI.generate({
      prompt,
      size: "512x512",
      format: "png"
    });
    
    const url = await uploadToSupabase(image, `victory_image_${taskId}`);
    return {
      status: "success",
      imageUrl: url,
      timeMs: Date.now() - startTime
    };
  } catch (err) {
    console.error("Victory image generation failed:", err);
    return {
      status: "error",
      error: err.message,
      timeMs: Date.now() - startTime
    };
  }
}
```

### Victory Video Generation
**API:** Environment variable `VICTORY_ANIMATION_API_ENDPOINT`
- Set in `.env`: `VICTORY_ANIMATION_API_ENDPOINT=https://api.frame.io/...`
- Or: `VICTORY_ANIMATION_API_ENDPOINT=https://api.replicate.com/...`

**Call Template:**
```typescript
async function generateVictoryVideo(
  animationPrompt: string,
  heroUrl: string,
  monsterUrl: string,
  taskId: string,
  timeout: number = 12000
): Promise<VideoResult> {
  const startTime = Date.now();
  
  const payload = {
    prompt: animationPrompt,
    heroImageUrl: heroUrl,
    monsterImageUrl: monsterUrl,
    duration: 3,
    fps: 24,
    resolution: "512x512",
    format: "mp4",
    style: "watercolor_animation",
    loops: 1,
    callbacks: {
      onProgress: (progress) => jobQueue.updateJob(taskId, { videoProgress: progress }),
      onComplete: (url) => jobQueue.updateJob(taskId, { videoUrl: url, status: "complete" })
    }
  };
  
  try {
    const response = await fetch(process.env.VICTORY_ANIMATION_API_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json", "Authorization": `Bearer ${process.env.VIDEO_API_KEY}` },
      body: JSON.stringify(payload),
      timeout: timeout
    });
    
    if (!response.ok) throw new Error(`API error: ${response.status}`);
    
    const { videoUrl } = await response.json();
    const url = await uploadToSupabase(videoUrl, `victory_video_${taskId}`);
    
    return {
      status: "success",
      videoUrl: url,
      timeMs: Date.now() - startTime
    };
  } catch (err) {
    console.error("Video generation timeout/failed:", err);
    return {
      status: "timeout",
      error: err.message,
      timeMs: Date.now() - startTime
    };
  }
}
```

---

## Fallback Strategy

### If Image Fails
```json
{
  "status": "image_error",
  "imageUrl": null,
  "videoUrl": null,
  "fallbackColor": "#E8D4C0",
  "message": "Image generation failed. Proceeding to video."
}
```
→ Skip straight to video, no modal

### If Video Times Out
```json
{
  "status": "image_only",
  "imageUrl": "https://supabase.../victory_image_*.png",
  "videoUrl": null,
  "fallbackImage": "https://supabase.../victory_image_*.png",
  "generationTime": { "imageMs": 3200, "videoMs": 12000 }
}
```
→ Show image in full-screen modal
→ Continue polling for video in background
→ If video completes, offer to replay

### If Both Fail
```json
{
  "status": "error",
  "fallbackPreset": true,
  "fallbackAnimation": "generic_victory_celebration.mp4",
  "message": "Using fallback animation"
}
```
→ Use generic victory animation from offline preset
→ Log for monitoring

---

## Frontend Integration

**Page 5 Battle** → Defeat monster → Victory triggered

**Victory Flow:**
1. Show victory image immediately (from Agent 3 output)
2. Play victory video if available (replaces image)
3. If video times out, keep image + show "Video still generating..."
4. Offer replay button
5. On video complete, show in full screen

**Loading Page (Page 3):**
```
Text Generation: 30% ✓
Image Generation: 40% ✓
Video Generation: (0-100%) [in background]

[ Skip to Battle ] ← User can proceed after Image complete
```

After user wins battle (Page 5 → Victory):
- Show victory image/video
- If video still generating: "Your victory animation is being created..."
- Video completes → auto-play full screen

---

## Quality Checklist
- [ ] Victory image is 512×512 PNG transparent bg
- [ ] Watercolor + ink style
- [ ] Both hero + monster visible + happy/peaceful
- [ ] Animation keyframes are smooth and clear
- [ ] Video is 2-3 seconds, loopable
- [ ] Hero + Monster PNGs are composited correctly
- [ ] Celebration mood is clear
- [ ] Timeout handling works (image shown if video slow)
- [ ] Supabase URLs are public + CDN-accessible
- [ ] Fallback animations work

