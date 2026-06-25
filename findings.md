# Findings

## BattlePage.tsx Analysis

- **Turn-based**, NOT real-time. Phases: player-turn → player-action → enemy-turn → loop
- Hero HP=100 MP=100, Monster HP=100 (hardcoded in initBattle call)
- 5 tactics mapped to skills, each has mpCost (10/20/20/30/20)
- Damage comes from skill.damage in battleSkills store (unknown exact formula — use 20-35 range)
- Enemy damage: comes from executeTurn in useBattleStore — use 12-18 range
- Victory: addCoins(50) + addExp(50) → postMessage battle-victory
- Defeat: navigateTo tasks or minigames/teashop
- Battle log: shows last entries with color-coded icons (hero=teal, monster=red, system=green)
- Arena animations: player-action → hero lunges x+50 scale 1.3; enemy-turn → monster lunges x-50 scale 1.3

## Current Godot Build Issues
- Real-time WASD movement — wrong architecture
- No tactic grid UI
- Skill system uses keyboard Q/E/R — should be click buttons
- Enemy AI is autonomous — should only attack after player acts

## Godot 4 Notes
- Use CanvasLayer for UI
- Tween for animations (not AnimationPlayer for simple cases)
- Timer nodes for phase transitions
- Button signals for tactic selection
