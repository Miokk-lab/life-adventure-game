# Agent 2: Image Generation (Gemini 2.0 Vision API)

## Role
Generate high-quality, transparent-background PNGs of the hero and monster characters using detailed prompts from Agent 1.

## Input
```json
{
  "heroName": "string (from Agent 1)",
  "heroImagePrompt": "string (detailed English prompt from Agent 1)",
  "monsterName": "string (from Agent 1)",
  "monsterImagePrompt": "string (detailed English prompt from Agent 1)"
}
```

## Output
```json
{
  "status": "success",
  "images": {
    "heroUrl": "https://supabase.../hero_[timestamp].png",
    "monsterUrl": "https://supabase.../monster_[timestamp].png"
  }
}
```

## Specifications
- **Model:** `gemini-2.0-flash-001` (or Gemini latest vision model)
- **Format:** PNG with transparent background
- **Dimensions:** 512×512 pixels
- **Quality:** High detail, smooth rendering
- **Upload:** Save to Supabase Storage, return CDN URLs
- **Timeout:** 8 seconds per image (fail-fast for Agent 3 video fallback)

## Style Prefix (CRITICAL)
**Prepend this to every prompt:**
```
- Warm parchment palette: backgrounds `#f8f8f0` / `rgb(247,243,223)`, text `#725d42` / `#794f27`
- Mint teal accent: `#19c8b9`, focus yellow `#ffcc00`
- Pill shapes (12–50px radius), 3D pixel-stack shadows (Nintendo game-button aesthetic)
- Nunito + Noto Sans SC fonts, weights 500–900, never below 400
- No pure black, no cold gray, no sharp right angles, no blue focus rings
- Cozy flat-illustration style, pastel polka-dot textures, pastoral atmosphere
- Image target: 512×512px PNG, pure white background
- Animal Crossing fan art — independent original illustration in similar warm game style
```

## Prompt Structure

### Hero Image
```
[STYLE PREFIX]
[Hero name and species]: [Personality traits], [Visual distinguishing feature]
[Pose/action]: [How the character is positioned — calm, protective, wise]
[Environment context]: [Minimal background elements if any]
[Color emphasis]: [Primary 3-4 colors]
[Mood]: [Peaceful, wise, nurturing, protective]
[Important]: Transparent background, must be cute and inviting, not scary
```

### Monster Image
```
[STYLE PREFIX]
[Monster name and species]: [Emotional state], [Visual sign of struggle]
[Pose/action]: [In the middle of their compulsive behavior OR just before transformation]
[Environment]: [What traps them — the spinning wheel, the tree to peck, etc.]
[Color emphasis]: [Darker or muted colors showing distress]
[Mood]: [Sympathetic, trapped, but NOT evil or scary]
[Important]: Transparent background, show the pain/struggle with compassion, 
not mockery. This creature deserves care.
```

## Example Calls

### Example 1: Work Stress Hero
**Input:**
```json
{
  "heroName": "悠悠",
  "heroImagePrompt": "animal illustration, watercolor + ink, soft lighting, transparent background, detailed fur texture, warm color palette, 512x512. Giant panda named Youyou with serene expression, lying on bamboo shoots in relaxed pose. Black and white fur rendered with soft brushstrokes. Warm golden light filtering through bamboo grove. Peaceful, wise, nurturing energy. Color palette: black, white, forest green, warm gold."
}
```

**Gemini API Call:**
```bash
curl https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-001:generateContent?key=$GEMINI_API_KEY \
  -H "Content-Type: application/json" \
  -d '{
    "contents": [{
      "parts": [{
        "text": "[STYLE PREFIX ABOVE]\n\nGiant panda named Youyou with serene expression, lying on bamboo shoots in relaxed pose. Black and white fur rendered with soft brushstrokes. Warm golden light filtering through bamboo grove. Peaceful, wise, nurturing energy. Color palette: black, white, forest green, warm gold."
      }]
    }],
    "generationConfig": {
      "temperature": 0.7,
      "maxOutputTokens": 1024
    }
  }'
```

### Example 2: Learning Growth Monster
**Input:**
```json
{
  "monsterName": "圈圈魔",
  "monsterImagePrompt": "animal illustration, watercolor + ink, soft lighting, transparent background, detailed fur texture, muted color palette, 512x512. Frazzled hamster named 圈圈魔 running desperately on spinning wheel, eyes wide and anxious but empty. Fur disheveled, body tense. Wheel spinning endlessly. Dark reds, grays, tired browns showing exhaustion. NOT evil — showing a trapped soul trying so hard but going nowhere. Sympathetic, not mocking."
}
```

---

## Implementation Flow

1. **Receive prompts from Agent 1**
2. **For each image:**
   - Prepend style prefix
   - Call Gemini 2.0 vision model
   - Set timeout: 8 seconds
   - If timeout: return fallback color + message for Agent 3 (image failed, skip to video)
3. **Process image:**
   - Ensure transparent background (remove/alpha out any background)
   - Verify 512×512 resolution
   - Convert to PNG
4. **Upload to Supabase:**
   - Path: `/adventures/{task_id}/hero_{timestamp}.png`
   - Path: `/adventures/{task_id}/monster_{timestamp}.png`
   - Return public CDN URLs
5. **Return JSON with URLs**

## Quality Checklist
- [ ] Transparent background (no white/colored edges)
- [ ] 512×512 exact resolution
- [ ] PNG format
- [ ] Character is recognizable and cute
- [ ] Colors match prompt intent (warm for hero, muted for monster)
- [ ] Watercolor/ink style visible
- [ ] Professional illustration quality
- [ ] Compassionate aesthetic (not scary or mocking)
- [ ] URLs are public and CDN-accessible

## Fallback Strategy
If image generation fails (timeout or API error):
- Log error with timestamp
- Return fallback: `{ "status": "timeout", "fallbackColor": "#9B7F5F" }`
- Agent 3 skips to video-only (image will be shown in modal if video takes too long)

## Error Handling
```json
{
  "status": "error",
  "heroUrl": null,
  "monsterUrl": null,
  "error": "Gemini API timeout after 8s",
  "fallback": "skip_to_video"
}
```

## Notes

- **Transparent background mandatory** — for compositing in battle UI
- **Cute, not scary** — users are vulnerable; art should be inviting
- **Symmetry in quality** — both hero and monster should feel equally important
