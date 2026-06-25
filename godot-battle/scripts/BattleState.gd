extends Node
class_name BattleState

# Turn phases matching BattlePage.tsx
enum Phase {
	PLAYER_TURN,
	PLAYER_ACTION,
	ENEMY_TURN,
	VICTORY,
	DEFEAT
}

# Coping tactics matching COPING_TACTICS array
const TACTICS = [
	{ "key": "avoid",     "label": "躲避",  "emoji": "🐢", "mp_cost": 10, "damage_min": 18, "damage_max": 26, "desc": "暂时远离压力源，给自己空间" },
	{ "key": "resist",    "label": "抵抗",  "emoji": "🦥", "mp_cost": 20, "damage_min": 25, "damage_max": 38, "desc": "观察并命名情绪，与它保持距离" },
	{ "key": "adapt",     "label": "适应",  "emoji": "🐯", "mp_cost": 20, "damage_min": 28, "damage_max": 42, "desc": "采取微小行动，打破无力感" },
	{ "key": "challenge", "label": "挑战",  "emoji": "🦅", "mp_cost": 30, "damage_min": 35, "damage_max": 55, "desc": "直面恐惧，做一件你一直在逃避的事" },
	{ "key": "transform", "label": "转换",  "emoji": "🐍", "mp_cost": 20, "damage_min": 22, "damage_max": 35, "desc": "换个角度看问题，寻找成长契机" },
]

const ENEMY_DAMAGE_MIN = 12
const ENEMY_DAMAGE_MAX = 20
const PHASE_TRANSITION_DELAY = 0.8  # seconds after action before next phase
