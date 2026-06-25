# Godot 2D Battle Game Specification
## Work Stress Battle: Panda Youyou vs Woodpecker Dudu-Demon

---

## 🎮 Game Overview
**Type:** 2D Real-time Action Battle  
**Theme:** Psychological healing through combat metaphors  
**Characters:** Guardian Hero (Panda) vs Inner Demon (Woodpecker)  
**Canvas:** 1280x720px  

---

## 🦑 Characters

### Hero: Panda "Youyou" (Left side)
- **Appearance:** Gentle panda, slow graceful movements
- **Color Scheme:** Teal/green (calm, healing)
- **Position:** Left side of screen, ground level
- **Stats:**
  - HP: 150
  - MP: 100 (for skills)
  - Base damage: 15
  - Speed: Medium (slower, deliberate)

### Enemy: Woodpecker "Dudu-Demon" (Right side)
- **Appearance:** Frantic woodpecker with sharp beak, constant motion
- **Color Scheme:** Red/brown (chaotic, aggressive)
- **Position:** Right side, can move vertically on tree
- **Stats:**
  - HP: 120
  - Base damage: 12-18 (variable)
  - Speed: Fast (erratic movements)
  - Attack pattern: 3 pecks, pause, 3 pecks (predictable)

---

## ⚔️ Combat Mechanics

### Hero Controls (Youyou)
- **WASD / Arrow Keys:** Move left/right/up/down (constrain to ground/safe zone)
- **SPACE / LMB:** Basic Attack (panda swing/push)
  - Damage: 15 + random(0-5)
  - Range: 100px
  - Cooldown: 0.5s
  - Animation: Swinging motion, knockback effect

- **Q:** Skill Slot 1 (Mindfulness - Acceptance Level)
  - **[Deep Breathing]** - MP cost: 10
  - Effect: Heal 20 HP, gain "Centered" buff (take 30% less damage for 3s)
  - Animation: Slow breathing, green glow

- **E:** Skill Slot 2 (Action - Acceptance Level)
  - **[Mark Priority]** - MP cost: 15
  - Effect: Stun enemy for 1.5s, boost next attack damage by 50%
  - Animation: Panda points/focuses

- **R:** Skill Slot 3 (Reframing - Acceptance Level)
  - **[Accept Progress]** - MP cost: 20
  - Effect: Block next attack completely, heal 10 HP per second for 4s
  - Animation: Panda settles into meditative pose

### Enemy AI (Dudu-Demon)
- **Phase 1 (HP > 70%):** Frantic pecking pattern
  - Charge at player, 3 quick pecks (0.3s apart)
  - Retreat, pause 1s, repeat
  - Occasionally use "Continuous Pecking" skill

- **Phase 2 (HP 40-70%):** Mixed aggression
  - Faster attack frequency
  - Use "Rotten Wood Erosion" skill (applies vulnerability debuff)
  - More vertical movement on tree

- **Phase 3 (HP < 40%):** Desperate phase
  - Extreme speed, erratic movement
  - Use "Mechanical Loop" skill (repeats last attack twice)
  - Opening for combos if player can dodge

### Enemy Skills (Dudu-Demon)
1. **Continuous Pecking** (Cooldown: 5s)
   - Rapid 5 pecks in 1.5s, damage: 8 each
   - Animation: Frantic pecking sounds
   - Player can dodge to avoid

2. **Rotten Wood Erosion** (Cooldown: 8s)
   - Debuff: "Weakened" - next attack does 50% damage for 4s
   - Range: Entire screen
   - Animation: Brown particles float toward player

3. **Mechanical Loop** (Cooldown: 10s, only Phase 3)
   - Repeats last attack automatically 2x without cooldown
   - Animation: Dudu-Demon glitches/stutters

---

## 🎯 Game Flow

### Initialization
1. Display hero (Youyou) on left, enemy (Dudu-Demon) on right
2. Show HP/MP bars for both
3. Display skill descriptions (Q, E, R buttons)
4. Player can move/attack freely after 1s intro

### Combat Loop
1. **Player Turn:** Player controls Youyou
   - Move with WASD, attack with SPACE
   - Use skills with Q/E/R
   - Collision detection: Can't overlap with enemy
2. **Enemy AI:** Dudu-Demon acts independently
   - Follows attack patterns based on phase
   - Takes damage from player attacks
3. **Resolution:**
   - HP bars update smoothly (animate over 0.3s)
   - Floating damage numbers appear on hit
   - Status effects display (buffs/debuffs as icons above character)

### Victory Condition
- Dudu-Demon HP reaches 0
- **Victory Sequence:**
  1. Dudu-Demon stops movement
  2. Confusion crosses its eyes (animation: head shake)
  3. Transformation sequence:
     - Tree trunk opens, reveals butterflies (particle effects)
     - Dudu-Demon beak softens, blue apron appears
     - Character transforms into small robin
     - Robin brings lotus leaf, particles turn into bamboo tea
  4. Display: "心魔被净化了！" (Inner Demon Purified!)
  5. Show victory stats: Damage dealt, HP remaining, time elapsed
  6. Emit `window.postMessage({ event: 'battle-victory', ... })`

### Defeat Condition
- Youyou HP reaches 0
- **Defeat Sequence:**
  1. Youyou collapses
  2. Dudu-Demon continues frantic pecking (visual: slower over 2s)
  3. Display: "能量耗尽…" (Energy Depleted)
  4. Emit `window.postMessage({ event: 'battle-defeat', ... })`

---

## 🎨 Visual Requirements

### Scene Layers (back to front)
1. **Background:** Bamboo forest gradient, soft colors
2. **Environment:** Tree on right (Dudu-Demon perches here)
3. **Characters:** Youyou (left), Dudu-Demon (right)
4. **Effects:** Damage numbers, particles, buffs/debuffs
5. **UI:** HP/MP bars, skill buttons, battle log

### Animations
- **Youyou walking:** Slow, gentle stride
- **Youyou attack:** Swing animation (0.4s)
- **Dudu-Demon pecking:** Rapid head bobbing (0.2s per peck)
- **Dudu-Demon charge:** Fly toward player with wings
- **Hit feedback:** Character knockback (10-20px), screen shake (small)
- **Skill activation:** Glow effect, color change, particle burst

### UI Elements
- **HP Bar:** Smooth fill animation, red color, label "❤️ {hp}/{maxHp}"
- **MP Bar:** Blue color, label "💙 {mp}/{maxMp}"
- **Damage numbers:** Float upward, fade out (2s duration)
  - White text: Player damage
  - Orange text: Enemy damage
  - Green text: Healing
- **Skill buttons:** Q/E/R, show MP cost, highlight on hover
- **Status icons:** Small buffs/debuffs above character head (0.5s icons)
- **Battle log:** Small text log of last 5 actions (bottom right, transparent)

---

## 📡 Communication Protocol

### Godot → React (via postMessage)
```javascript
// Battle start
window.parent.postMessage({
  event: 'battle-start',
  hero: 'Youyou',
  demon: 'Dudu-Demon',
  timestamp: Date.now()
}, '*');

// Player action
window.parent.postMessage({
  event: 'battle-action',
  type: 'attack' | 'skill',
  skillName: 'Deep Breathing',
  damage: 15,
  mpCost: 10,
  timestamp: Date.now()
}, '*');

// Enemy action
window.parent.postMessage({
  event: 'enemy-action',
  skillName: 'Continuous Pecking',
  damage: 8,
  timestamp: Date.now()
}, '*');

// Victory
window.parent.postMessage({
  event: 'battle-victory',
  heroHpRemaining: 85,
  totalDamageDealt: 120,
  totalTimeSeconds: 45,
  skillsUsed: ['Deep Breathing', 'Mark Priority'],
  timestamp: Date.now()
}, '*');

// Defeat
window.parent.postMessage({
  event: 'battle-defeat',
  heroHpRemaining: 0,
  demonHpRemaining: 35,
  totalTimeSeconds: 32,
  timestamp: Date.now()
}, '*');
```

---

## 📁 Godot Project Structure
```
godot-battle/
├── scenes/
│   ├── BattleScene.tscn
│   ├── Hero.tscn (Youyou panda)
│   ├── Enemy.tscn (Dudu-Demon woodpecker)
│   ├── UI/
│   │   ├── HPBar.tscn
│   │   ├── SkillButton.tscn
│   │   └── DamageNumber.tscn
│   └── Effects/
│       ├── HitParticle.tscn
│       └── SkillEffects.tscn
├── scripts/
│   ├── BattleManager.gd (main battle logic)
│   ├── HeroController.gd (player input)
│   ├── EnemyAI.gd (Dudu-Demon behavior)
│   ├── Character.gd (base class)
│   ├── Skill.gd (skill execution)
│   └── CommunicationBridge.gd (postMessage)
├── assets/
│   ├── characters/ (Youyou & Dudu-Demon sprites/models)
│   ├── sounds/ (attack, skill, hit sounds)
│   └── vfx/ (particle textures)
└── project.godot
```

---

## 🔧 Technical Notes
- **Engine:** Godot 4.x
- **Language:** GDScript
- **Export:** HTML5 (WebAssembly)
- **Canvas Size:** 1280x720px (responsive scaling)
- **Framerate:** 60 FPS
- **Physics:** Simple 2D (Area2D for collision detection)

---

## 📝 Priority Order (MVP → Polish)
1. **MVP:** Basic character movement, enemy AI, HP/damage
2. **Core:** Skills (Q/E/R), victory/defeat conditions
3. **Polish:** Animations, particle effects, sound
4. **Communication:** postMessage events to React
5. **Refinement:** Victory animation sequence, difficulty tuning

---

## 🎬 Reference: Victory Animation Breakdown
1. **Setup (0.5s):** Youyou and Dudu-Demon come to a stop
2. **Confusion (1s):** Dudu-Demon head shakes, eyes blur
3. **Reveal (1.5s):** Tree trunk opens with butterfly particle burst
4. **Transform (2s):** Dudu-Demon morphs into robin with blue apron
5. **Gift (1s):** Robin brings lotus leaf, particles become tea
6. **Fade (1s):** Screen fades to white, text appears
7. **Total:** ~7-8 seconds

