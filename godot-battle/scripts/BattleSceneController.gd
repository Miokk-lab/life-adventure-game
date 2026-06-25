extends Node2D

@onready var battle_mgr: TurnBattleManager = $BattleMgr
@onready var bridge: CommunicationBridge = $CommunicationBridge

# Character sprites (Node2D in world space)
@onready var hero_side: Node2D = $HeroSide
@onready var monster_side: Node2D = $MonsterSide

# UI — CanvasLayer children
@onready var hero_hp_bar: ProgressBar = $UI/HeroCard/HPBar
@onready var hero_mp_bar: ProgressBar = $UI/HeroCard/MPBar
@onready var monster_hp_bar: ProgressBar = $UI/MonsterCard/HPBar
@onready var hero_hp_label: Label = $UI/HeroCard/HPLabel
@onready var hero_mp_label: Label = $UI/HeroCard/MPLabel
@onready var monster_hp_label: Label = $UI/MonsterCard/HPLabel

@onready var tactic_grid: Control = $UI/TacticArea/TacticGrid
@onready var confirm_panel: Control = $UI/TacticArea/ConfirmPanel
@onready var confirm_label: Label = $UI/TacticArea/ConfirmPanel/SkillLabel
@onready var confirm_mp_label: Label = $UI/TacticArea/ConfirmPanel/MPLabel
@onready var mp_warn_label: Label = $UI/TacticArea/ConfirmPanel/MPWarn
@onready var execute_btn: Button = $UI/TacticArea/ConfirmPanel/Buttons/ExecuteBtn
@onready var reselect_btn: Button = $UI/TacticArea/ConfirmPanel/Buttons/ReselectBtn

@onready var vs_label: Label = $UI/VSLabel
@onready var hero_action_badge: Label = $UI/HeroActionBadge
@onready var hero_damage_badge: Label = $UI/HeroDamageBadge
@onready var monster_action_badge: Label = $UI/MonsterActionBadge
@onready var monster_damage_badge: Label = $UI/MonsterDamageBadge

@onready var log_text: RichTextLabel = $UI/LogPanel/LogText
@onready var damage_numbers_node: Node2D = $DamageNumbers

@onready var result_panel: Panel = $UI/ResultPanel
@onready var result_title: Label = $UI/ResultPanel/Title
@onready var result_body: Label = $UI/ResultPanel/Body
@onready var result_btn: Button = $UI/ResultPanel/ActionBtn

var DAMAGE_NUMBER_SCENE = load("res://scenes/UI/DamageNumber.tscn")

func _ready() -> void:
	battle_mgr.bridge = bridge
	battle_mgr.hero_sprite = hero_side
	battle_mgr.monster_sprite = monster_side

	battle_mgr.phase_changed.connect(_on_phase_changed)
	battle_mgr.hero_stats_changed.connect(_on_hero_stats)
	battle_mgr.monster_stats_changed.connect(_on_monster_stats)
	battle_mgr.log_updated.connect(_on_log_updated)
	battle_mgr.tactic_selected.connect(_on_tactic_selected)
	battle_mgr.tactic_cleared.connect(_on_tactic_cleared)
	battle_mgr.hero_damaged.connect(_on_hero_damaged)
	battle_mgr.monster_damaged.connect(_on_monster_damaged)

	hero_hp_bar.max_value = battle_mgr.hero_max_hp
	hero_hp_bar.value = battle_mgr.hero_hp
	hero_mp_bar.max_value = battle_mgr.hero_max_mp
	hero_mp_bar.value = battle_mgr.hero_mp
	monster_hp_bar.max_value = battle_mgr.monster_max_hp
	monster_hp_bar.value = battle_mgr.monster_hp
	_update_stat_labels()

	_hide_badges()
	result_panel.visible = false
	confirm_panel.visible = false
	tactic_grid.visible = true

	for i in range(BattleState.TACTICS.size()):
		var btn = tactic_grid.get_child(i)
		if btn is Button:
			btn.pressed.connect(func(): battle_mgr.select_tactic(i))

	execute_btn.pressed.connect(battle_mgr.execute_turn)
	reselect_btn.pressed.connect(battle_mgr.clear_tactic)
	result_btn.pressed.connect(_on_result_btn)

	battle_mgr.start_battle()

func _on_phase_changed(new_phase: int) -> void:
	_hide_badges()
	match new_phase:
		BattleState.Phase.PLAYER_TURN:
			vs_label.text = "VS"
			vs_label.modulate = Color(0.45, 0.36, 0.26, 1)
			tactic_grid.visible = true
			confirm_panel.visible = false

		BattleState.Phase.PLAYER_ACTION:
			vs_label.text = "⚔️"
			vs_label.modulate = Color(0.1, 0.78, 0.72, 1)
			tactic_grid.visible = false
			confirm_panel.visible = false
			hero_action_badge.visible = true

		BattleState.Phase.ENEMY_TURN:
			vs_label.text = "🛡️"
			vs_label.modulate = Color(0.88, 0.35, 0.35, 1)
			tactic_grid.visible = false
			confirm_panel.visible = false
			monster_action_badge.visible = true

		BattleState.Phase.VICTORY:
			tactic_grid.visible = false
			confirm_panel.visible = false
			_show_result("🎉 净化成功！", "心魔被净化了！\n+50🪙 +50EXP", "🌈 前往丰收祭", Color(0.22, 0.72, 0.22, 1))

		BattleState.Phase.DEFEAT:
			tactic_grid.visible = false
			confirm_panel.visible = false
			_show_result("💨 能量耗尽…", "呼……心魔太强了！\n需要完成日常任务积蓄能量。", "📋 去做日常任务", Color(0.88, 0.35, 0.35, 1))

func _on_hero_stats(hp: int, mp: int) -> void:
	var tw1 = create_tween()
	tw1.tween_property(hero_hp_bar, "value", float(hp), 0.3)
	var tw2 = create_tween()
	tw2.tween_property(hero_mp_bar, "value", float(mp), 0.2)
	battle_mgr.hero_hp = hp
	battle_mgr.hero_mp = mp
	_update_stat_labels()

func _on_monster_stats(hp: int) -> void:
	var tw = create_tween()
	tw.tween_property(monster_hp_bar, "value", float(hp), 0.3)
	battle_mgr.monster_hp = hp
	_update_stat_labels()

func _on_hero_damaged(amount: int) -> void:
	hero_damage_badge.text = "-%d HP" % amount
	hero_damage_badge.visible = true
	_spawn_float(hero_side.position + Vector2(0, -80), str(amount), Color(0.88, 0.35, 0.35))

func _on_monster_damaged(amount: int) -> void:
	monster_damage_badge.text = "-%d HP" % amount
	monster_damage_badge.visible = true
	_spawn_float(monster_side.position + Vector2(0, -80), str(amount), Color(1.0, 0.62, 0.11))

func _on_tactic_selected(index: int) -> void:
	var t = BattleState.TACTICS[index]
	tactic_grid.visible = false
	confirm_panel.visible = true
	confirm_label.text = "%s %s\n%s" % [t["emoji"], t["label"], t["desc"]]
	confirm_mp_label.text = "%s · MP %d · ⚔️ %d~%d 伤害" % [t["label"], t["mp_cost"], t["damage_min"], t["damage_max"]]
	var has_mp = battle_mgr.hero_mp >= int(t["mp_cost"])
	mp_warn_label.visible = not has_mp
	execute_btn.disabled = not has_mp

func _on_tactic_cleared() -> void:
	tactic_grid.visible = true
	confirm_panel.visible = false

func _on_log_updated(entries: Array) -> void:
	log_text.text = "\n".join(entries)

func _show_result(title: String, body: String, btn_text: String, color: Color) -> void:
	result_panel.visible = true
	result_title.text = title
	result_title.modulate = color
	result_body.text = body
	result_btn.text = btn_text

func _on_result_btn() -> void:
	var target = "victory" if battle_mgr.phase == BattleState.Phase.VICTORY else "tasks"
	if bridge:
		bridge.send_navigate(target)

func _hide_badges() -> void:
	hero_action_badge.visible = false
	hero_damage_badge.visible = false
	monster_action_badge.visible = false
	monster_damage_badge.visible = false

func _update_stat_labels() -> void:
	hero_hp_label.text = "❤️ %d/%d" % [battle_mgr.hero_hp, battle_mgr.hero_max_hp]
	hero_mp_label.text = "💙 %d/%d" % [battle_mgr.hero_mp, battle_mgr.hero_max_mp]
	monster_hp_label.text = "❤️ %d/%d" % [battle_mgr.monster_hp, battle_mgr.monster_max_hp]

func _spawn_float(pos: Vector2, text: String, color: Color) -> void:
	if not DAMAGE_NUMBER_SCENE or not is_instance_valid(damage_numbers_node):
		return
	var dn = DAMAGE_NUMBER_SCENE.instantiate()
	damage_numbers_node.add_child(dn)
	dn.setup(text, color, pos)
