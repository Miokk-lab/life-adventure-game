extends Node
class_name BattleManager

@onready var hero: HeroController = $"../Hero"
@onready var enemy: EnemyAI = $"../Enemy"
@onready var damage_number_container: Node2D = $"../DamageNumbers"
@onready var battle_log: RichTextLabel = $"../UI/BattleLog"
@onready var hero_hp_bar: ProgressBar = $"../UI/HeroPanel/HPBar"
@onready var hero_mp_bar: ProgressBar = $"../UI/HeroPanel/MPBar"
@onready var enemy_hp_bar: ProgressBar = $"../UI/EnemyPanel/HPBar"
@onready var result_panel: Panel = $"../UI/ResultPanel"
@onready var result_label: Label = $"../UI/ResultPanel/Label"
@onready var bridge: CommunicationBridge = $"../CommunicationBridge"
@onready var skill_q_cd: ProgressBar = $"../UI/SkillPanel/Q/CDBar"
@onready var skill_e_cd: ProgressBar = $"../UI/SkillPanel/E/CDBar"
@onready var skill_r_cd: ProgressBar = $"../UI/SkillPanel/R/CDBar"

var battle_active: bool = false
var battle_time: float = 0.0
var total_damage_dealt: int = 0
var skills_used: Array = []
var log_entries: Array = []

var DAMAGE_NUMBER_SCENE = load("res://scenes/UI/DamageNumber.tscn")

func _ready() -> void:
	result_panel.visible = false
	hero.enemy_ref = enemy
	enemy.hero_ref = hero

	hero.hp_changed.connect(_on_hero_hp_changed)
	hero.mp_changed.connect(_on_hero_mp_changed)
	hero.died.connect(_on_hero_died)
	hero.attack_performed.connect(_on_hero_attack)
	hero.skill_used.connect(_on_hero_skill_used)

	enemy.hp_changed.connect(_on_enemy_hp_changed)
	enemy.died.connect(_on_enemy_died)
	enemy.enemy_attack.connect(_on_enemy_attack)

	_init_bars()
	battle_active = true
	bridge.send_battle_start("Youyou", "Dudu-Demon")
	_log("Battle started! Youyou vs Dudu-Demon")

func _process(delta: float) -> void:
	if not battle_active:
		return
	battle_time += delta
	_update_skill_cooldowns()

func _init_bars() -> void:
	hero_hp_bar.max_value = hero.max_hp
	hero_hp_bar.value = hero.current_hp
	hero_mp_bar.max_value = hero.max_mp
	hero_mp_bar.value = hero.current_mp
	enemy_hp_bar.max_value = enemy.max_hp
	enemy_hp_bar.value = enemy.current_hp

func _update_skill_cooldowns() -> void:
	skill_q_cd.value = hero.get_skill_cooldown_ratio("deep_breathing")
	skill_e_cd.value = hero.get_skill_cooldown_ratio("mark_priority")
	skill_r_cd.value = hero.get_skill_cooldown_ratio("accept_progress")

func _on_hero_hp_changed(current: int, maximum: int) -> void:
	hero_hp_bar.value = current

func _on_hero_mp_changed(current: int, maximum: int) -> void:
	hero_mp_bar.value = current

func _on_enemy_hp_changed(current: int, maximum: int) -> void:
	enemy_hp_bar.value = current

func _on_hero_attack(damage: int) -> void:
	total_damage_dealt += damage
	_spawn_damage_number(enemy.position + Vector2(0, -40), str(damage), Color.WHITE)
	bridge.send_battle_action("attack", "Basic Attack", damage, 0)
	_log("Youyou attacks for %d damage" % damage)

func _on_hero_skill_used(skill_name: String, mp_cost: int) -> void:
	if not skill_name in skills_used:
		skills_used.append(skill_name)
	_spawn_damage_number(hero.position + Vector2(0, -60), skill_name, Color.GREEN)
	bridge.send_battle_action("skill", skill_name, 0, mp_cost)
	_log("Youyou uses %s (MP: %d)" % [skill_name, mp_cost])

func _on_enemy_attack(skill_name: String, damage: int) -> void:
	if damage > 0:
		_spawn_damage_number(hero.position + Vector2(0, -40), str(damage), Color(1.0, 0.5, 0.0))
	else:
		_spawn_damage_number(hero.position + Vector2(0, -60), skill_name, Color(0.8, 0.3, 0.0))
	bridge.send_enemy_action(skill_name, damage)
	_log("Dudu-Demon: %s %s" % [skill_name, ("(%d dmg)" % damage) if damage > 0 else ""])

func _on_hero_died() -> void:
	battle_active = false
	_show_result("能量耗尽…\nDefeat!", Color(0.8, 0.2, 0.2))
	bridge.send_defeat(enemy.current_hp, battle_time)
	_log("Youyou has fallen!")

func _on_enemy_died() -> void:
	battle_active = false
	_spawn_damage_number(enemy.position + Vector2(0, -80), "VICTORY!", Color.YELLOW)
	get_tree().create_timer(1.0).timeout.connect(func():
		_show_result("获得内心平静！\nVictory!", Color(0.2, 0.8, 0.3))
	)
	bridge.send_victory(hero.current_hp, total_damage_dealt, battle_time, skills_used)
	_log("Dudu-Demon defeated! Youyou wins!")

func _show_result(text: String, color: Color) -> void:
	result_panel.visible = true
	result_label.text = text
	result_label.modulate = color

func _spawn_damage_number(pos: Vector2, text: String, color: Color) -> void:
	if not is_instance_valid(damage_number_container):
		return
	var dn = DAMAGE_NUMBER_SCENE.instantiate()
	damage_number_container.add_child(dn)
	dn.setup(text, color, pos)

func _log(msg: String) -> void:
	log_entries.append(msg)
	if log_entries.size() > 5:
		log_entries.pop_front()
	if is_instance_valid(battle_log):
		battle_log.text = "\n".join(log_entries)
