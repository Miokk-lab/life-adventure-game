extends Character
class_name EnemyAI

signal enemy_attack(skill_name, damage)

enum Phase { PHASE1, PHASE2, PHASE3 }
enum State { IDLE, CHARGING, PECKING, RETREATING, SKILL }

var current_phase: Phase = Phase.PHASE1
var current_state: State = State.IDLE

var hero_ref: Node = null

var state_timer: float = 0.0
var peck_count: int = 0
var peck_max: int = 3
var peck_interval: float = 0.3
var retreat_distance: float = 200.0

var skill_timers: Dictionary = {
	"continuous_pecking": 0.0,
	"rotten_erosion": 0.0,
	"mechanical_loop": 0.0
}
var skill_cooldowns: Dictionary = {
	"continuous_pecking": 5.0,
	"rotten_erosion": 8.0,
	"mechanical_loop": 10.0
}

var continuous_peck_count: int = 0
var last_skill_used: String = ""
var mechanical_loop_active: bool = false
var home_x: float = 950.0
var charge_speed: float = 280.0
var retreat_target: Vector2

func _ready() -> void:
	max_hp = 120
	max_mp = 0
	base_damage = 15  # 12-18 range handled in get_attack_damage
	move_speed = 280.0
	super._ready()
	home_x = position.x
	retreat_target = Vector2(home_x, position.y)

func _process(delta: float) -> void:
	super._process(delta)
	_update_phase()
	_update_skills(delta)
	_update_state(delta)

func _update_phase() -> void:
	var hp_ratio = float(current_hp) / float(max_hp)
	if hp_ratio > 0.7:
		current_phase = Phase.PHASE1
		charge_speed = 280.0
	elif hp_ratio > 0.4:
		current_phase = Phase.PHASE2
		charge_speed = 340.0
	else:
		current_phase = Phase.PHASE3
		charge_speed = 420.0

func _update_skills(delta: float) -> void:
	for key in skill_timers:
		if skill_timers[key] > 0:
			skill_timers[key] -= delta

func _update_state(delta: float) -> void:
	if is_dead or is_stunned or hero_ref == null:
		return

	state_timer -= delta

	match current_state:
		State.IDLE:
			if state_timer <= 0:
				_try_skill_or_charge()

		State.CHARGING:
			_move_toward_hero(delta)
			var dist = position.distance_to(hero_ref.position)
			if dist < 80:
				peck_count = 0
				peck_max = 3 if current_phase == Phase.PHASE1 else 4
				current_state = State.PECKING
				state_timer = peck_interval

		State.PECKING:
			if state_timer <= 0:
				if peck_count < peck_max:
					_do_peck()
					peck_count += 1
					state_timer = peck_interval
				else:
					current_state = State.RETREATING
					retreat_target = Vector2(home_x + randf_range(-30, 30), position.y + randf_range(-20, 20))
					retreat_target.y = clamp(retreat_target.y, 300, 650)

		State.RETREATING:
			_move_toward(retreat_target, delta)
			if position.distance_to(retreat_target) < 10:
				current_state = State.IDLE
				state_timer = _get_idle_duration()

		State.SKILL:
			pass  # handled by skill functions

func _try_skill_or_charge() -> void:
	# Try skills based on phase
	if current_phase >= Phase.PHASE2 and skill_timers["rotten_erosion"] <= 0:
		_use_rotten_erosion()
		return
	if current_phase == Phase.PHASE3 and skill_timers["mechanical_loop"] <= 0:
		_use_mechanical_loop()
		return
	if skill_timers["continuous_pecking"] <= 0 and randf() < 0.3:
		_use_continuous_pecking()
		return
	# Normal charge
	current_state = State.CHARGING
	state_timer = 3.0

func _do_peck() -> void:
	if hero_ref == null or not is_instance_valid(hero_ref):
		return
	var dist = position.distance_to(hero_ref.position)
	if dist < 100:
		var dmg = 12 + randi() % 7  # 12-18
		if current_phase == Phase.PHASE2:
			dmg = int(dmg * 1.2)
		elif current_phase == Phase.PHASE3:
			dmg = int(dmg * 1.4)
		hero_ref.take_damage(dmg)
		emit_signal("enemy_attack", "Peck", dmg)
		last_skill_used = "Peck"

func _use_continuous_pecking() -> void:
	skill_timers["continuous_pecking"] = skill_cooldowns["continuous_pecking"]
	last_skill_used = "Continuous Pecking"
	current_state = State.SKILL
	continuous_peck_count = 0
	_schedule_continuous_peck()

func _schedule_continuous_peck() -> void:
	if continuous_peck_count >= 5:
		current_state = State.RETREATING
		retreat_target = Vector2(home_x, position.y)
		return
	get_tree().create_timer(0.3).timeout.connect(func():
		if is_dead or not is_instance_valid(self):
			return
		if hero_ref and is_instance_valid(hero_ref):
			var dist = position.distance_to(hero_ref.position)
			if dist < 120:
				hero_ref.take_damage(8)
				emit_signal("enemy_attack", "Continuous Pecking", 8)
		continuous_peck_count += 1
		_schedule_continuous_peck()
	)

func _use_rotten_erosion() -> void:
	skill_timers["rotten_erosion"] = skill_cooldowns["rotten_erosion"]
	last_skill_used = "Rotten Wood Erosion"
	if hero_ref and is_instance_valid(hero_ref):
		hero_ref.apply_weaken(4.0)
		emit_signal("enemy_attack", "Rotten Wood Erosion", 0)
	current_state = State.IDLE
	state_timer = 1.5

func _use_mechanical_loop() -> void:
	skill_timers["mechanical_loop"] = skill_cooldowns["mechanical_loop"]
	last_skill_used = "Mechanical Loop"
	emit_signal("enemy_attack", "Mechanical Loop", 0)
	# Repeat last attack twice
	for i in range(2):
		get_tree().create_timer(0.5 * (i + 1)).timeout.connect(func():
			if is_dead or not is_instance_valid(self):
				return
			_do_peck()
		)
	current_state = State.IDLE
	state_timer = 2.0

func _move_toward_hero(delta: float) -> void:
	if hero_ref == null:
		return
	var dir = (hero_ref.position - position).normalized()
	position += dir * charge_speed * delta

func _move_toward(target: Vector2, delta: float) -> void:
	var dir = (target - position).normalized()
	position += dir * move_speed * delta

func _get_idle_duration() -> float:
	match current_phase:
		Phase.PHASE1: return randf_range(0.8, 1.2)
		Phase.PHASE2: return randf_range(0.4, 0.8)
		Phase.PHASE3: return randf_range(0.1, 0.4)
	return 1.0

func get_attack_damage() -> int:
	return 12 + randi() % 7
