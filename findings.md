# Findings

## Doc Summary (心岛疗愈记_完整开发文档_ver2.docx)

### Core Game Flow
登录 → 烦恼录入 → AI生成加载 → 心理档案室 → 对战 → 日常任务 → 静心小游戏 → 花茶商店 → 胜利图鉴

### 3 Resources
- HP (红条): battle damage, restored by mini-games
- MP (蓝条): skill cost, restored by tasks; starts LOW to force Page6
- Stamina (绿条): action cost, restored by tea shop

### Game Design Intent
- First battle MUST be lost (MP depleted) → forces user to Page6 tasks
- Lv1 → Lv2 → Lv3 progression unlocks stronger skills
- 4 animal companions × 3 levels = 12 skills per adventure
- Boss has 500HP, player starts MP=20 (can't finish it Lv1)

### AI Agent Pipeline (from doc Section 6)
**Agent A (Text):**
- Input: worry text + category
- Output: CBT analysis, hero/monster data, victory text + image descriptions for Agent B

**Agent B (Image):**
- Input: Agent A's image descriptions
- Fixed style prefix (from doc) MUST be prepended
- Output: 512×512px PNG, transparent background
- Style: Animal Crossing-inspired, warm parchment palette

**Agent C (Video):**
- Input: Agent A's victory text + Agent B's hero/monster images
- Maintain image consistency with hero/monster
- Output: 2–3s MP4, --ar 16:9
- Fallback: 3 keyframes → FFmpeg GIF

### Image Prompt Style Prefix (exact from doc)
```
Style anchors: Warm parchment palette: backgrounds #f8f8f0 / rgb(247,243,223), text #725d42 / #794f27
Mint teal accent: #19c8b9, focus yellow #ffcc00
Pill shapes (12–50px radius), 3D pixel-stack shadows
Nunito + Noto Sans SC fonts, weights 500–900
No pure black, no cold gray, no sharp right angles, no blue focus rings
Cozy flat-illustration style, pastel polka-dot textures, pastoral atmosphere
Image target: 512×512px PNG, no background(transparent)
NOT Animal Crossing fan art — independent original illustration in similar warm game style, 8k
```

### Offline Presets (8 categories, fully defined in doc Section 3)
All 8 categories have: hero name+story, monster name+story, CBT analysis, victory animation description, 12-skill matrix, battle content, plus image/video prompts in Section 9.
Categories: work_stress, learning_growth, interpersonal, family_origin, social_environment, physical_health, time_management, emotion_management

### Existing Agent Code Issues
- server/agents/*.ts use Gemini API (NOT DeepSeek as required)
- Only 3 agents (analyze, world, quest) — no image or video agents
- No orchestration / job queue
- No Supabase integration

### Google Agent Runtime
- Deploy each agent as separate Cloud Run service
- Orchestrate with Agent Runtime (Vertex AI Agent Builder or Workflows)
- Agents expose REST endpoints
- Use task_id pattern: POST returns task_id, GET /status polls until done

### DeepSeek API
- Base URL: https://api.deepseek.com/v1 (OpenAI-compatible)
- Model: deepseek-chat (or deepseek-reasoner for complex tasks)
- Same SDK as OpenAI (just swap baseURL + apiKey)

## BattlePage.tsx Analysis (from previous session)
- Turn-based: player-turn → player-action → enemy-turn → loop
- Hero HP=100 MP=100, Monster HP=100
- 5 tactics: avoid/resist/adapt/challenge/transform (MP costs 10/20/20/30/20)
- Victory: addCoins(50) + addExp(50)
- Arena animations: hero lunges +50px on player-action; monster lunges -50px on enemy-turn
