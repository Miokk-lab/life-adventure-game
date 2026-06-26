# Agent 1: Text Content Generator (DeepSeek API)

## Role
Generate all narrative, psychological analysis, and image/animation prompts for a personalized therapeutic game experience based on user's worry input.

## Input
```json
{
  "worryText": "string (user's concern in Chinese)",
  "worryType": "string (work_stress | learning_growth | relationships | family | social_environment | physical_health | time_management | emotion_management | custom)",
  "language": "zh-CN"
}
```

## Output Format (JSON)
```json
{
  "heroName": "string (2-4 chars, memorable character name)",
  "heroDescription": "string (100-150 chars, guardian hero traits & purpose)",
  "monsterName": "string (2-4 chars, shadow creature name)",
  "monsterDescription": "string (100-150 chars, inner demon traits & root emotion)",
  "cbtAnalysis": "string (300-500 chars, compassionate CBT reframe of worry → strength)",
  "victoryNarrative": "string (200-300 chars, poetic transformation scene when monster becomes ally)",
  "heroImagePrompt": "string (English, detailed visual description for PNG generation)",
  "monsterImagePrompt": "string (English, detailed visual description for PNG generation)",
  "victoryImagePrompt": "string (English, celebration scene with hero+monster at peace)",
  "animationPrompt": "string (English, 2-3s video keyframes describing transformation sequence)"
}
```

## Style Guidelines

### Hero Character
- Embody the **reverse quality** of the worry (responsibility → rest, ambition → wisdom, etc.)
- Cute animal form, calming nature (such as panda, owl, capybara, koala, turtle, otter, sloth)
- Must feel like an **inner ally**, not external savior
- Skill set spans 3 dimensions (acceptance, mindfulness, action, reframe) × 3 levels each

### Monster Character
- Shadow of the worry (workaholic → woodpecker, anxiety → hamster, fear → porcupine)
- **Not evil** — trapped in a pattern, seeking the same thing as hero (safety, worth, love)
- Behavior reveals the person's real strength (responsibility-obsessed → woodpecker's dedication)

### CBT Analysis Structure
1. **Validate the strength** ("This is because you care deeply...")
2. **Name the cognitive trap** (overgeneralization, perfectionism, catastrophizing, etc.)
3. **Introduce reframe** (CBT/ACT principle: values vs. avoidance)
4. **Offer perspective shift** (what the hero would say)
5. **End with hope** ("When you... monster becomes...")

### Victory Narrative
- Show physical transformation (spikes soften → flower petals, running wheel → treasure map, etc.)
- Hero's action is **gentle, non-violent** (warmth, acceptance, perspective, not defeat)
- Monster becomes **cute ally form** (same creature, healed version)
- Metaphor reveals the gift (tea from wood shavings, clean eyes from rest, etc.)

### Image Prompts (for Agent 2)
**Style anchors for both hero and monster** 
```
- Warm parchment palette: backgrounds `#f8f8f0` / `rgb(247,243,223)`, text `#725d42` / `#794f27`
- Mint teal accent: `#19c8b9`, focus yellow `#ffcc00`
- Pill shapes (12–50px radius), 3D pixel-stack shadows (Nintendo game-button aesthetic)
- Nunito + Noto Sans SC fonts, weights 500–900, never below 400
- No pure black, no cold gray, no sharp right angles, no blue focus rings
- Cozy flat-illustration style, pastel polka-dot textures, pastoral atmosphere
- Image target: 256×256px or 512×512px PNG, pure white background
- Animal Crossing fan art — independent original illustration in similar warm game style
```

**Hero PNG Prompt Template:**
```
[STYLE PREFIX from doc Section 6: "animal illustration, watercolor + ink, soft lighting, transparent background, detailed fur texture, warm color palette, 512x512"]
[Character]: [Animal Type], [Personality], [Visual Feature]
[Scene Context]: [One-line environment or action]
[Color Palette]: [3-4 colors that evoke the emotion]
[Style Notes]: [Cute, calm, wise — NOT scary or aggressive]
```

**Monster PNG Prompt Template:**
```
[STYLE PREFIX]
[Character]: [Animal Type], [Emotional State], [Visual Feature That Reveals Strength]
[Scene Context]: [Trapped in pattern OR at turning point]
[Color Palette]: [Colors reflecting struggle/confusion]
[Style Notes]: [Sympathetic, not villainous — we see the pain inside]
```

### Animation Prompt (for Agent 3)
- **Keyframe 1** (0s): Monster in distressed state, hero approaching
- **Keyframe 2** (1-1.5s): Hero touches/speaks/looks at monster; monster begins transforming
- **Keyframe 3** (2-3s): Transformation complete; monster + hero at peace, gift exchanged

---

## Examples (from 8 preset worry categories)

### Example 1: 工作压力 (Work Stress)
**Input:**
```json
{
  "worryText": "最近工作太忙，脑子停不下来，每天都在赶deadline，感觉快要崩溃了。",
  "worryType": "work_stress"
}
```

**Output:**
```json
{
  "heroName": "悠悠",
  "heroDescription": "松弛感熊猫，天生慢节奏，懂得吃竹和休息。黑白毛发柔和，眼神温暖而深邃，身体呈放松姿态。代表可持续的平衡与自我保护。",
  "monsterName": "笃笃魔",
  "monsterDescription": "狂躁啄木鸟，尖喙锐利，眼神焦灼，羽毛竖立，在树干上疯狂啄击。隐喻无法停止工作的大脑和打字的手，代表被驱动感和完美主义的陷阱。",
  "cbtAnalysis": "笃笃魔如此焦躁地疯狂凿树，其实是因为你内心深处藏着一颗极其闪亮的『责任心种子』。你太想把每一根木头都凿得平整完美了，这多让人敬佩啊！但认知行为疗法(CBT)提醒我们：过度关注『结果』的完美，会让我们的『过程』变得苦涩。你的手在颤抖，是因为你把『工作完成』等同于了『个人价值』。试着告诉自己：『我可以有条不紊地工作，也可以有条不紊地休息。』当你可以为了保护森林（你自己）而停下凿击时，笃笃魔就会明白，真正的责任感，是可持续的平和。",
  "victoryNarrative": "熊猫悠悠轻快地摇动着竹林，笃笃魔终于停下了疯狂的啄击，它那双忙乱的眼睛闪过一丝困惑，随后慢慢聚焦。树干中并没有所谓的『虫子』，而是一只只展开翅膀的斑斓蝴蝶。笃笃魔收起尖喙，它低下头，用头顶蹭了蹭树干，那疯狂的动作变成了一种安宁的节拍。最后，笃笃魔化作一只系着蓝色围裙的小知更鸟，它衔来一片巨大的荷叶为你遮荫，树木间飘落下的木屑竟然变成了清香的竹叶茶。",
  "heroImagePrompt": "animal illustration, watercolor + ink, soft lighting, transparent background, detailed fur texture, warm color palette, 512x512. Giant panda named Youyou with serene expression, lying on bamboo shoots in relaxed pose. Black and white fur rendered with soft brushstrokes. Warm golden light filtering through bamboo grove. Peaceful, wise, nurturing energy. Color palette: black, white, forest green, warm gold.",
  "monsterImagePrompt": "animal illustration, watercolor + ink, soft lighting, transparent background, detailed feather texture, warm color palette, 512x512. Frantic woodpecker named 笃笃魔 with sharp beak and frazzled feathers, pecking frantically at tree trunk. Eyes wide and anxious, body tense. Dark reds and blacks showing stress. NOT scary — sympathetic, showing inner turmoil and desperate need to be useful.",
  "victoryImagePrompt": "animal illustration, watercolor + ink, soft lighting, transparent background, detailed textures, warm color palette, 512x512. Panda Youyou gently placing a hand on a small, calm robin (transformed woodpecker). Both animals surrounded by butterflies and floating tea leaves. Golden light, peace, transformation. Bamboo grove background. Warm greens, golds, whites.",
  "animationPrompt": "Keyframe 0s: Frantic woodpecker 笃笃魔 pecking wildly at tree, eyes crazed. Panda Youyou approaches slowly from left, breathing gently. Keyframe 1.5s: Youyou touches woodpecker's wing softly; woodpecker's frantic movement slows, feathers begin to soften and reorganize. Eyes start to focus. Golden light surrounds both. Keyframe 3s: Woodpecker now calm robin in blue apron, placing hand on Youyou's shoulder. Tea leaves floating peacefully. Both at rest under bamboo canopy. Transformation complete."
}
```

---

### Example 2: 学习成长 (Learning & Growth)
**Input:**
```json
{
  "worryText": "看着别人都在进步，而我还在原地踏步。每天刷题刷到晚上，但感觉什么都没学到，特别焦虑。",
  "worryType": "learning_growth"
}
```

**Output:**
```json
{
  "heroName": "学学",
  "heroDescription": "求知猫头鹰，夜晚沉思，充满智慧，纵观全局。金色眼睛闪闪发光，羽毛柔软而深邃，爪中握着羽毛笔。代表真正的学习与内在成长。",
  "monsterName": "圈圈魔",
  "monsterDescription": "迷茫仓鼠，在跑轮上疯狂奔跑却原地踏步，眼神空洞而急切，毛发凌乱。隐喻无效内卷和学习焦虑，代表被困在循环中的绝望。",
  "cbtAnalysis": "圈圈魔又在跑轮上疯狂奔跑了，这背后分明是一颗不甘平庸、对世界充满好奇的勇敢灵魂！你追求进步的样子真的很美。但心理学中的『过度概括』陷阱正在悄悄围住你：你把一次跑轮上的原地踏步，解读成了『我正在虚度人生』。但这只是坐标的暂时重合，不是停滞。下一次当你感到焦虑时，试着停下来，喝口水，看看跑轮外的风景。每一次『停顿』，都是猫头鹰在夜空中重新校准星图的必要动作。当你不再执着于跑得快，而是执着于跑得准时，圈圈魔就会安静地在你手心睡去。",
  "victoryNarrative": "学学伸出羽毛笔在空中划出一个巨大的圆圈，跑轮失去了引力，砰的一声散成了无数金黄色的向日葵花瓣。圈圈魔茫然地落地，它跳出那个狭窄的圆圈，发现视野变得无比宽广。它抖了抖毛，身上的疲惫感化作了五彩纸屑。最后，圈圈魔变成了一只戴着小眼镜的可爱小灵鼠，它举着一张写满『已掌握』的复习卡，向你轻轻鞠躬。",
  "heroImagePrompt": "animal illustration, watercolor + ink, soft lighting, transparent background, detailed feather texture, cool-warm color palette, 512x512. Wise owl named 学学 with large golden eyes, holding a quill pen in talon. Perched on open book under starlit sky. Feathers rendered in soft grays and browns. Peaceful, contemplative expression. Night sky with stars in background. Color palette: midnight blue, gold, cream, warm amber.",
  "monsterImagePrompt": "animal illustration, watercolor + ink, soft lighting, transparent background, detailed fur texture, muted color palette, 512x512. Frazzled hamster named 圈圈魔 running desperately on spinning wheel, eyes wide and anxious but empty. Fur disheveled, body tense. Wheel spinning endlessly. Dark reds, grays, tired browns showing exhaustion. NOT evil — showing a trapped soul trying so hard but going nowhere. Sympathetic, not mocking.",
  "victoryImagePrompt": "animal illustration, watercolor + ink, soft lighting, transparent background, detailed textures, warm-cool palette, 512x512. Cute small mouse with tiny glasses holding 『已掌握』 card, standing on ground away from wheel. Owl 学学 floating above with quill, drawing constellation map in air. Golden sunflower petals falling everywhere. Bright stars and hopeful sky. Warm golds, cool blues, soft cream colors.",
  "animationPrompt": "Keyframe 0s: Hamster 圈圈魔 running frantically on spinning wheel, eyes crazed and hollow, wheel turning faster and faster. Owl 学学 watches from branch. Keyframe 1.5s: Owl draws magical circle with quill; wheel slows, then shatters into golden flower petals. Hamster falls gently to ground, confusion crossing its face as it steps outside the circle. Soft golden light. Keyframe 3s: Hamster now calm mouse with glasses, holding mastery card, smiling. Owl and mouse surrounded by constellation map, sunflowers, and starlight. Peaceful, limitless vista."
}
```

---

## Instructions for DeepSeek API Call

1. **System Prompt:** You are a compassionate game designer creating therapeutic character and story content based on Chinese psychological concerns. Use CBT and ACT principles to reframe worries as hidden strengths. Output ONLY valid JSON.

2. **User Prompt:** (template below)

3. **Temperature:** 0.7 (creative but consistent)

4. **Max tokens:** 2000

### User Prompt Template:
```
用户的困扰：{worryText}
困扰类型：{worryType}

请生成以下内容（必须是JSON格式）：
1. 守护英雄：名字、描述（100-150字）、形象提示（英文，512×512 PNG，透明背景）
2. 心魔怪兽：名字、描述、形象提示（英文，512×512 PNG，透明背景）
3. CBT心理分析：300-500字，从『力量』角度重构困扰
4. 通关动画描述：英文，描述2-3秒的变身场景
5. 胜利图像提示：英文，英雄和怪兽和平的庆祝场景
6. 动画关键帧提示：英文，3个关键帧描述

参考示例（工作压力）：
[Examples above]

重要：
- 英雄和怪兽都应该是可爱的动物，充满同情心
- 怪兽的行为反映用户的真实力量，不是邪恶的
- 图像提示需要详细、可视化、适合 Gemini 2.0 绘图
- 保持温暖、希望的基调
```

---

## Quality Checks
- [ ] Hero feels like inner ally (not external savior)
- [ ] Monster is sympathetic (not evil or scary)
- [ ] CBT analysis validates + reframes (not just positive thinking)
- [ ] Victory narrative shows gentle transformation
- [ ] Image prompts are detailed & visual (500+ chars each)
- [ ] Animation prompt has 3 clear keyframes
- [ ] All Chinese text is warm & compassionate
- [ ] All English text is visual & detailed for image generation
