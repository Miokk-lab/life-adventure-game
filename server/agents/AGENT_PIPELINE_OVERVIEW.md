# 3-Agent AI Pipeline Overview

## System Architecture

```
User Input (Worry Text) 
    ↓
Agent 1: Text Generation (DeepSeek API)
    ├─ Hero name, bio, skills
    ├─ Monster name, bio, strengths
    ├─ CBT analysis (reframes worry → strength)
    ├─ Victory narrative
    ├─ Hero PNG prompt (for Agent 2)
    ├─ Monster PNG prompt (for Agent 2)
    ├─ Victory image prompt (for Agent 3)
    └─ Animation prompt (for Agent 3)
    ↓
[PARALLEL]
    ├─ Agent 2: Image Generation (Gemini 2.0)      [2-4 seconds]
    │   ├─ Hero PNG (512×512 transparent)
    │   └─ Monster PNG (512×512 transparent)
    │
    └─ Agent 3 Phase 1: Victory Image (Gemini)     [2-3 seconds]
        └─ Victory PNG (512×512 transparent)
    ↓
Agent 3 Phase 2: Video Animation (Frame API TBD)   [6-12 seconds]
    └─ Victory Video (2-3s MP4, hero + monster + celebration)
    ↓
Frontend Pages
    ├─ Page 3 (Loading): Progress bar (text: 30% → image: 40% → video: 0-100%)
    ├─ Page 5 (Battle): Uses hero + monster PNGs
    └─ Victory Modal: Shows image immediately, video when ready
```

## Timing & Flow

### Best Case (All APIs Fast)
```
Total time: ~6-8 seconds
├─ Agent 1 (text): 2-3s
├─ Agents 2&3 (images): 2-4s
└─ Agent 3 (video): 6-8s [in background during battle]
```

### Timeout Handling
```
Frontend waiting:
├─ Page 3 Loading: Show progress
│   ├─ Text ready (30%): 2-3s
│   ├─ Images ready (40%): 2-4s
│   └─ User can proceed to battle
│
└─ Video generation (0-100%): Continues in background
    ├─ Video completes: Auto-play in victory modal
    ├─ Video times out (>12s): Show static image instead
    └─ Log for monitoring
```

---

## Agent 1: Text Content (DeepSeek)

### Input
```json
{
  "worryText": "string (user's worry in Chinese)",
  "worryType": "work_stress | learning_growth | relationships | ..."
}
```

### Output (8 fields)
```json
{
  "heroName": "string (character name)",
  "heroDescription": "string (100-150 chars)",
  "monsterName": "string (character name)",
  "monsterDescription": "string (100-150 chars)",
  "cbtAnalysis": "string (300-500 chars, CBT reframe)",
  "victoryNarrative": "string (200-300 chars, transformation scene)",
  "heroImagePrompt": "string (English, detailed visual for PNG)",
  "monsterImagePrompt": "string (English, detailed visual for PNG)",
  "victoryImagePrompt": "string (English, celebration scene)",
  "animationPrompt": "string (English, 3 keyframes for video)"
}
```

### Key Principles
- **Hero embodies the reverse quality** (responsibility → rest, ambition → wisdom)
- **Monster is sympathetic** (not evil, showing the trapped pattern)
- **CBT reframes** (validates strength, names trap, offers perspective)
- **Victory is gentle** (hero doesn't defeat monster, helps it transform)
- **Image prompts are detailed & visual** (500+ chars, specific colors/mood)

### Quality Metrics
- Hero feels like an inner ally ✓
- Monster is cute/sympathetic (not scary) ✓
- CBT analysis is warm + hopeful ✓
- Victory narrative shows transformation ✓
- Prompts are detailed enough for image generation ✓

---

## Agent 2: Image Generation (Gemini 2.0 Vision)

### Input
```json
{
  "heroImagePrompt": "string (from Agent 1)",
  "monsterImagePrompt": "string (from Agent 1)"
}
```

### Output
```json
{
  "heroUrl": "https://supabase.../hero_*.png",
  "monsterUrl": "https://supabase.../monster_*.png"
}
```

### Process
1. Prepend **style prefix** to each prompt
2. Call Gemini 2.0 vision API
3. Ensure transparent background (PNG)
4. Verify 512×512 resolution
5. Upload to Supabase Storage
6. Return public CDN URLs

### Style Prefix (CRITICAL)
```
animal illustration, watercolor + ink style, soft diffused lighting,
fully transparent background, detailed fur/feather texture,
warm color palette (hero) or muted (monster), 512x512 pixels
```

### Timeout
- **Per image: 8 seconds**
- If timeout: return error, Agent 3 proceeds with video-only
- If success: URLs available for Agent 3 video compositing

### Quality Checklist
- Transparent background ✓
- 512×512 exact ✓
- PNG format ✓
- Cute, compassionate aesthetic ✓
- Watercolor + ink style visible ✓
- Professional quality ✓

---

## Agent 3: Victory Animation (Two Phases)

### Phase 1: Victory Image
**Input:**
```json
{
  "victoryImagePrompt": "string (from Agent 1)"
}
```

**Output:**
```json
{
  "victoryImageUrl": "https://supabase.../victory_image_*.png"
}
```

**Process:**
1. Same style prefix as Agent 2
2. Call Gemini 2.0 vision API
3. Show hero + monster (transformed) + celebration
4. 512×512 transparent PNG
5. Upload to Supabase
6. Return URL immediately (don't wait for video)

**Timeout: 3 seconds**

### Phase 2: Victory Video
**Input:**
```json
{
  "animationPrompt": "string (from Agent 1, 3 keyframes)",
  "heroUrl": "string (PNG from Agent 2)",
  "monsterUrl": "string (PNG from Agent 2)"
}
```

**Output:**
```json
{
  "videoUrl": "https://supabase.../victory_video_*.mp4"
}
```

**Process:**
1. Call `VICTORY_ANIMATION_API_ENDPOINT` (env var, set tomorrow)
2. Pass animation prompt + PNG URLs
3. Generate 2-3 second MP4 (512×512 or 1024×768)
4. Watercolor animation style
5. Loop-ready
6. Upload to Supabase
7. Return URL when complete

**Timeout: 12 seconds**

### Fallback Logic
```
If Image fails:
  → Skip to video generation

If Video times out (>12s):
  → Show victory image in full-screen modal
  → Continue polling for video in background
  → Once video ready, offer replay

If Both fail:
  → Use generic victory celebration (offline preset)
  → Log error for monitoring
```

---

## Frontend Integration

### Page 3: Loading Screen
```
Generating your adventure...

Text Analysis: ████████░░ 30%  ✓
Image Creation: ████████░░ 40%  ✓
Video Creation: ░░░░░░░░░░  0%

[ Skip to Battle ]  ← Can proceed after images done
```

### Page 5: Battle Screen
- Hero PNG on left (from Agent 2)
- Monster PNG on right (from Agent 2)
- Battle mechanics (turn-based)
- Monster HP reaches 0 → Victory triggered

### Victory Modal
```
VICTORY!

[Victory Image from Agent 3]

If video not ready:
"Your victory animation is being created..."
[ Replay Video ] ← Shows when ready

Otherwise:
[Victory Video plays automatically]
```

### Backend Status Polling
```typescript
GET /api/adventure/{taskId}/status

Response:
{
  "status": "complete",
  "progress": 100,
  "stage": "complete",
  "text_content": {
    "heroName": "...",
    "monsterName": "...",
    "cbtAnalysis": "..."
  },
  "images": {
    "heroUrl": "...",
    "monsterUrl": "..."
  },
  "video": {
    "videoUrl": "..."  ← null if still generating
  }
}
```

---

## Error Handling & Fallbacks

### Timeout Thresholds
```
Agent 1 (text): 5 seconds → Fail, use offline preset
Agent 2 (images): 8 seconds per image → Proceed without images
Agent 3 image: 3 seconds → Skip, go straight to video
Agent 3 video: 12 seconds → Show image instead
```

### Offline Presets
If any agent times out:
1. Load pre-generated content for the worry type
2. Use from `/server/data/offlinePresets.json` (8 categories × 1 example each)
3. Display with generic hero + monster + animation
4. Log failure for monitoring

### Retry Logic
- Agent 1 fails → Return 500, show "Please try again"
- Agent 2 fails → Continue with video-only (no images in battle)
- Agent 3 video fails → Show image, mark video as failed

---

## Environment Variables

```bash
# DeepSeek API
DEEPSEEK_API_KEY=sk_...
DEEPSEEK_API_ENDPOINT=https://api.deepseek.com/v1

# Gemini Vision
GEMINI_API_KEY=...
GEMINI_MODEL=gemini-2.0-flash-001

# Video Animation API (set tomorrow)
VICTORY_ANIMATION_API_ENDPOINT=https://api.frame.io/... (or similar)
VIDEO_API_KEY=...

# Supabase Storage
SUPABASE_URL=https://...
SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_KEY=...

# Optional: Replicate fallback
REPLICATE_API_TOKEN=...
```

---

## Testing Checklist

### Agent 1 (Text)
- [ ] DeepSeek API key works
- [ ] Returns valid JSON
- [ ] All 8 fields populated
- [ ] Chinese text is warm + compassionate
- [ ] English prompts are detailed (500+ chars)
- [ ] CBT analysis is present + reframes worry
- [ ] Victory narrative is poetic + gentle
- [ ] Timeout works (fallback to preset)

### Agent 2 (Images)
- [ ] Gemini API key works
- [ ] Produces PNGs with transparent backgrounds
- [ ] Size is exactly 512×512
- [ ] Watercolor + ink style visible
- [ ] Hero is cute + warm
- [ ] Monster is sympathetic (not scary)
- [ ] Supabase upload succeeds
- [ ] CDN URLs are public
- [ ] Timeout works (skips to video)

### Agent 3 (Victory)
- [ ] Victory image generates correctly
- [ ] Victory image shows hero + monster + celebration
- [ ] Video API endpoint works (when set tomorrow)
- [ ] Video is 2-3 seconds, loopable
- [ ] Video composits hero + monster PNGs correctly
- [ ] Timeout handling works (shows image if video slow)
- [ ] Supabase upload succeeds
- [ ] Fallback to offline preset works

### End-to-End
- [ ] User inputs worry → Agent 1 generates text
- [ ] Agent 2 generates hero + monster PNGs
- [ ] Agent 3 generates victory image + video
- [ ] Loading page shows progress (30% → 40%)
- [ ] Battle page displays hero + monster PNGs
- [ ] Victory modal shows image immediately
- [ ] Video plays when ready (or fallback if timeout)

---

## Monitoring & Logging

**Log All:**
- Agent execution times
- API error rates
- Timeout events
- Fallback triggers
- User satisfaction (if they skip to preset)

**Metrics to Track:**
- Average response time per agent
- Timeout frequency by agent
- Fallback frequency by worry type
- Image quality (user ratings?)
- Video completion rate

---

## Next Steps

1. **Tomorrow:** Video API endpoint will be provided (env var)
2. **Setup:** Add `VICTORY_ANIMATION_API_ENDPOINT` to `.env`
3. **Test:** Run end-to-end with real APIs
4. **Monitor:** Log all execution times + errors
5. **Iterate:** Refine prompts based on output quality

