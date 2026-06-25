extends Node
class_name TurnBattleManager

# ── Stats ──────────────────────────────────────────────────
var hero_hp: int = 100
var hero_max_hp: int = 100
var hero_mp: int = 100
var hero_max_mp: int = 100
var monster_hp: int = 100
var monster_max_hp: int = 100

var phase: BattleState.Phase = BattleState.Phase.PLAYER_TURN
var selected_tactic_index: int = -1
var log_entries: Array[String] = []
var battle_time: float = 0.0
var total_damage_dealt: int = 0

# ── Node refs (set by scene) ───────────────────────────────
var hero_sprite: Node2D
var monster_sprite: Node2D
var bridge: CommunicationBridge

# ── Signals ────────────────────────────────────────────────
signal phase_changed(new_phase: int)
signal hero_stats_changed(hp: int, mp: int)
signal monster_stats_changed(hp: int)
signal log_updated(entries: Array)
signal tactic_selected(tactic_index: int)
signal tactic_cleared()
signal hero_damaged(amount: int)
signal monster_damaged(amount: int)
signal hero_healed(amount: int)

func _process(delta: float) -> void:
	if phase != BattleState.Phase.VICTORY and phase != BattleState.Phase.DEFEAT:
		battle_time += delta

func start_battle() -> void:
	_log("⚔️ 战斗开始！心魔出现了！", "system")
	_set_phase(BattleState.Phase.PLAYER_TURN)
	if bridge:
		bridge.send_battle_start("Youyou", "心魔")

func select_tactic(index: int) -> void:
	if phase != BattleState.Phase.PLAYER_TURN:
		return
	selected_tactic_index = index
	emit_signal("tactic_selected", index)

func clear_tactic() -> void:
	selected_tactic_index = -1
	emit_signal("tactic_cleared")

func execute_turn() -> void:
	if phase != BattleState.Phase.PLAYER_TURN:
		return
	if selected_tactic_index < 0:
		return
	var tactic = BattleState.TACTICS[selected_tactic_index]
	var mp_cost: int = tactic["mp_cost"]
	if hero_mp < mp_cost:
		_log("⚠️ MP不足！", "system")
		return

	# Consume MP
	hero_mp -= mp_cost
	emit_signal("hero_stats_changed", hero_hp, hero_mp)

	# Compute damage
	var dmg_min: int = tactic["damage_min"]
	var dmg_max: int = tactic["damage_max"]
	var damage: int = dmg_min + randi() % (dmg_max - dmg_min + 1)

	selected_tactic_index = -1
	emit_signal("tactic_cleared")

	_set_phase(BattleState.Phase.PLAYER_ACTION)
	_log("🦸 使用「%s」，造成 %d 伤害！" % [tactic["label"], damage], "player-action")

	if bridge:
		bridge.send_battle_action("skill", tactic["label"], damage, mp_cost)

	# Animate hero lunge, apply damage, then enemy turn
	if hero_sprite:
		var start_x = hero_sprite.position.x
		var tw = create_tween()
		tw.tween_property(hero_sprite, "position:x", start_x + 80, 0.2)
		tw.tween_property(hero_sprite, "position:x", start_x, 0.25)

	emit_signal("monster_damaged", damage)

	get_tree().create_timer(0.5).timeout.connect(func():
		monster_hp -= damage
		total_damage_dealt += damage
		emit_signal("monster_stats_changed", monster_hp)
		if monster_hp <= 0:
			monster_hp = 0
			_trigger_victory()
		else:
			get_tree().create_timer(BattleState.PHASE_TRANSITION_DELAY).timeout.connect(_do_enemy_turn)
	)

func _do_enemy_turn() -> void:
	_set_phase(BattleState.Phase.ENEMY_TURN)
	var dmg: int = BattleState.ENEMY_DAMAGE_MIN + randi() % (BattleState.ENEMY_DAMAGE_MAX - BattleState.ENEMY_DAMAGE_MIN + 1)
	_log("👾 心魔反击！造成 %d 伤害！" % dmg, "enemy-action")

	if bridge:
		bridge.send_enemy_action("心魔攻击", dmg)

	# Animate monster lunge
	if monster_sprite:
		var start_x = monster_sprite.position.x
		var tw = create_tween()
		tw.tween_property(monster_sprite, "position:x", start_x - 80, 0.2)
		tw.tween_property(monster_sprite, "position:x", start_x, 0.25)

	emit_signal("hero_damaged", dmg)

	get_tree().create_timer(0.5).timeout.connect(func():
		hero_hp -= dmg
		if hero_hp <= 0:
			hero_hp = 0
		emit_signal("hero_stats_changed", hero_hp, hero_mp)
		if hero_hp <= 0:
			_trigger_defeat()
		else:
			get_tree().create_timer(BattleState.PHASE_TRANSITION_DELAY).timeout.connect(func():
				_set_phase(BattleState.Phase.PLAYER_TURN)
			)
	)

func _trigger_victory() -> void:
	_set_phase(BattleState.Phase.VICTORY)
	_log("🎉 心魔被净化了！", "system")
	if bridge:
		bridge.send_victory(hero_hp, total_damage_dealt, battle_time, [])

func _trigger_defeat() -> void:
	_set_phase(BattleState.Phase.DEFEAT)
	_log("💨 能量耗尽…", "system")
	if bridge:
		bridge.send_defeat(monster_hp, battle_time)

func _set_phase(new_phase: BattleState.Phase) -> void:
	phase = new_phase
	emit_signal("phase_changed", int(new_phase))

func _log(text: String, _type: String) -> void:
	log_entries.append(text)
	if log_entries.size() > 8:
		log_entries.pop_front()
	emit_signal("log_updated", log_entries)
