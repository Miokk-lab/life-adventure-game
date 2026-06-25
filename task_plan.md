# Task Plan: Rebuild Godot Battle as Turn-Based (matching BattlePage.tsx)

## Goal
Replace current real-time Godot battle with turn-based system matching BattlePage.tsx logic exactly.

## Key Findings from BattlePage.tsx

### Turn phases (exact match required):
- `player-turn` — player selects coping tactic
- `player-action` — hero attacks, animation plays, monster HP drops
- `enemy-turn` — monster attacks back, hero HP drops
- `victory` / `defeat` — modal shown

### 5 Coping Tactics (skill grid):
| key | label | emoji | mpCost |
|-----|-------|-------|--------|
| avoid | 躲避 | 🐢 | 10 |
| resist | 抵抗 | 🦥 | 20 |
| adapt | 适应 | 🐯 | 20 |
| challenge | 挑战 | 🦅 | 30 |
| transform | 转换 | 🐍 | 20 |

### Stats:
- Hero: HP 100, MP 100 (from initBattle call)
- Monster: HP 100 (from initBattle call)
- Each tactic costs MP; monster does fixed damage per turn

### postMessage events needed:
- battle-start
- battle-action (player attacks)
- enemy-action
- battle-victory (addCoins 50, addExp 50)
- battle-defeat

## Architecture (Godot 4 GDScript)

### Files to rewrite:
- scripts/BattleManager.gd — turn-based phase controller
- scripts/HeroController.gd — remove real-time input, stat holder only
- scripts/EnemyAI.gd — remove real-time AI, simple turn attack
- scripts/BattleScene.tscn — rework UI for tactic grid + phase panels

### UI Layout (matching React):
- Top: Hero card (HP+MP bars) | Monster card (HP bar)  
- Middle: Arena (hero sprite LEFT, VS center, monster sprite RIGHT)  
  - During player-action: hero lunges right, skill name badge appears
  - During enemy-turn: monster lunges left, damage badge on hero
- Bottom: Coping tactic grid (5 buttons) OR selected skill confirm panel
- Right: Battle log (last 5 entries)

## Phases

- [ ] Phase 1: New GDScript files (BattleManager, Character, Enemy simple)
- [ ] Phase 2: Scene redesign (UI layout matching React)
- [ ] Phase 3: Tactic grid UI + skill selection flow
- [ ] Phase 4: Animation (lunge, knockback) + damage numbers
- [ ] Phase 5: Victory/defeat modals + postMessage
- [ ] Phase 6: Test & verify
