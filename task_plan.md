# Task Plan: AI 3-Agent Pipeline + Game Integration (life-adventure_ver12)

## Goal
Build 3-agent AI pipeline in ver12 folder: DeepSeek (text) → Gemini (hero/monster PNG) → video frame (API TBD tomorrow). Integrate with React game for custom content generation.

## Current Status (as of 2026-06-26)

### What's Built
- ✅ Frontend React app with 9 page scaffolds (Pages 1–9)
- ✅ Page1 Login, Page2 Worry input, Page3 Loading, Page5 Battle (BattlePage.tsx)
- ✅ Page6 Tasks, Page7 MiniGames, Page8 TeaShop, Page9 Victory (shells)
- ✅ Page4 Analysis (shell, no content)
- ✅ server/agents/ folder with 3 old agents using **Gemini API** (NOT DeepSeek)
  - analyzeAgent.ts — CBT analysis (Gemini)
  - worldAgent.ts — game world gen (Gemini)
  - questAgent.ts — quest generation (Gemini)
- ✅ server/server.ts — FastAPI-style TS server skeleton
- ✅ Godot battle (turn-based rewrite in progress, per old task_plan)
- ✅ 8 offline presets fully defined in doc (text + image prompts)

### What's Missing / Not Built
- ❌ 3-Agent pipeline (DeepSeek text, Image PNG, Victory animation)
- ❌ Google Agent Runtime deployment
- ❌ Supabase DB integration
- ❌ Page4 Analysis actual content rendering
- ❌ Page9 Victory actual content (video player, collection)
- ❌ Image generation agent (hero/monster PNG, transparent bg)
- ❌ Victory animation agent (using hero+monster images)
- ❌ Async job queue / polling system
- ❌ All backend API routes (adventure, battle, task, shop)

## 3-Agent Architecture (NEW TARGET)

### Agent 1: Text Content Agent (DeepSeek API)
- Input: worry text + category
- Output: ALL game text content + English prompts for Agent 2 & 3
  - hero name, story, skills
  - monster name, story, attacks
  - CBT analysis (400 chars)
  - victory narrative text
  - image_prompt_hero (English, for Agent 2)
  - image_prompt_monster (English, for Agent 2)
  - animation_prompt (English, for Agent 3, describes victory animation)
- Deploy: Google Agent Runtime
- API: DeepSeek API (deepseek-chat model)

### Agent 2: Image Generation Agent (Gemini API)
- Input: image_prompt_hero + image_prompt_monster from Agent 1
- Output: hero PNG (transparent bg, 512×512) + monster PNG (transparent bg, 512×512)
- Uses doc's fixed style prefix + character-specific prompt from Agent 1
- Upload to Supabase Storage → return CDN URLs
- API: Gemini 2.0 vision (gemini-2.0-flash-001) or use Replicate if needed

### Agent 3: Victory Animation Agent (Frame — API TBD)
- Input: animation_prompt from Agent 1 + hero_img_url + monster_img_url from Agent 2
- Output: 2–3s victory animation (MP4/WebM)
- Uses hero & monster images for visual consistency
- **API to be provided tomorrow via environment variable** (will add to .env)
- Fallback: 3-keyframe FFmpeg GIF synthesis

### Orchestration
- Agents run sequentially: 1 → 2 → 3 (Agent 2+3 can parallel after Agent 1)
- Job status polling: every 2s via GET /api/adventure/{id}/status
- Timeout >12s → auto-fallback to offline presets (8 categories hardcoded)

## Phases

- [ ] Phase 1: Agent 1 refactor — migrate from Gemini to DeepSeek, output text + English image/animation prompts
- [ ] Phase 2: Agent 2 build — Gemini image gen with style prefix, transparent PNG hero/monster
- [ ] Phase 3: Agent 3 frame — skeleton with animation_prompt input, API slot ready for env var
- [ ] Phase 4: Orchestration — job queue, status polling, Supabase storage upload (hero/monster PNG)
- [ ] Phase 5: Backend API routes — POST /api/adventure/create, GET /api/adventure/{id}/status, GET /api/adventure/{id}/data
- [ ] Phase 6: Page3 Loading — connect polling to progress bar (text→image→video stages)
- [ ] Phase 7: Page4 Analysis — render hero/monster cards + CBT analysis from Agent 1 output
- [ ] Phase 8: Page9 Victory — video player placeholder + collection unlock
- [ ] Phase 9: Offline fallback — wire 8 category presets for >12s timeout
- [ ] Phase 10: Integration test — end-to-end from worry input to victory page

## Key Technical Decisions
- **Agent 1 (Text):** DeepSeek API base URL https://api.deepseek.com/v1 (OpenAI-compatible)
- **Agent 2 (Image):** Gemini 2.0 vision API for hero/monster PNG (512×512 transparent)
- **Agent 3 (Video):** Frame skeleton now, API endpoint via environment variable (to be added tomorrow)
- Image style prefix from doc Section 6 MUST be prepended to all character prompts
- PNG upload → Supabase Storage, return CDN URLs
- Job orchestration: local async queue (Promise-based), NOT Google Agent Runtime yet
- Fallback (>12s timeout): auto-load offline preset by worry_type
