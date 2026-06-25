extends Character
class_name HeroController

signal attack_performed(damage)
signal skill_used(skill_name, mp_cost)
signal blocked_next_attack

var attack_cooldown: float = 0.5
var attack_timer: float = 0.0
var attack_range: float = 100.0
var is_blocking: bool = false

var skill_cooldowns: Dictionary = {
	"deep_breathing": 0.0,
	"mark_priority": 0.0,
	"accept_progress": 0.0
}
var skill_max_cooldowns: Dictionary = {
	"deep_breathing": 6.0,
	"mark_priority": 8.0,
	"accept_progress": 10.0
}

var enemy_ref: Node = null

func _ready() -> void:
	max_hp = 150
	max_mp = 100
	base_damage = 15
	move_speed = 180.0
	super._ready()

func _process(delta: float) -> void:
	super._process(delta)
	_handle_input(delta)
	_update_cooldowns(delta)

func _physics_process(_delta: float) -> void:
	move_and_slide()

func _handle_input(delta: float) -> void:
	if is_dead or is_stunned:
		velocity = Vector2.ZERO
		return

	var dir = Vector2.ZERO
	if Input.is_action_pressed("ui_left") or Input.is_key_pressed(KEY_A):
		dir.x -= 1
	if Input.is_action_pressed("ui_right") or Input.is_key_pressed(KEY_D):
		dir.x += 1
	if Input.is_action_pressed("ui_up") or Input.is_key_pressed(KEY_W):
		dir.y -= 1
	if Input.is_action_pressed("ui_down") or Input.is_key_pressed(KEY_S):
		dir.y += 1

	velocity = dir.normalized() * move_speed

	# Clamp to play area
	var new_pos = position + velocity * delta
	new_pos.x = clamp(new_pos.x, 40, 580)
	new_pos.y = clamp(new_pos.y, 300, 650)
	position = new_pos
	velocity = Vector2.ZERO

	# Attack (held is fine — gated by cooldown timer)
	if Input.is_key_pressed(KEY_SPACE) and attack_timer <= 0:
		_perform_attack()

	# Cooldown > 0 gates re-fire while key held
	if Input.is_key_pressed(KEY_Q) and skill_cooldowns["deep_breathing"] <= 0:
		_use_deep_breathing()
	if Input.is_key_pressed(KEY_E) and skill_cooldowns["mark_priority"] <= 0:
		_use_mark_priority()
	if Input.is_key_pressed(KEY_R) and skill_cooldowns["accept_progress"] <= 0:
		_use_accept_progress()

func _update_cooldowns(delta: float) -> void:
	if attack_timer > 0:
		attack_timer -= delta
	for key in skill_cooldowns:
		if skill_cooldowns[key] > 0:
			skill_cooldowns[key] -= delta

func _perform_attack() -> void:
	if enemy_ref == null or not is_instance_valid(enemy_ref):
		return
	var dist = position.distance_to(enemy_ref.position)
	if dist <= attack_range:
		var dmg = get_attack_damage()
		var actual = enemy_ref.take_damage(dmg)
		emit_signal("attack_performed", actual)
	attack_timer = attack_cooldown

func _use_deep_breathing() -> void:
	if not use_mp(10):
		return
	heal(20)
	apply_damage_reduction(0.3, 3.0)
	skill_cooldowns["deep_breathing"] = skill_max_cooldowns["deep_breathing"]
	emit_signal("skill_used", "Deep Breathing", 10)

func _use_mark_priority() -> void:
	if not use_mp(15):
		return
	if enemy_ref and is_instance_valid(enemy_ref):
		enemy_ref.apply_stun(1.5)
	apply_damage_boost(0.5)
	skill_cooldowns["mark_priority"] = skill_max_cooldowns["mark_priority"]
	emit_signal("skill_used", "Mark Priority", 15)

func _use_accept_progress() -> void:
	if not use_mp(20):
		return
	is_blocking = true
	apply_regen(10.0, 4.0)
	skill_cooldowns["accept_progress"] = skill_max_cooldowns["accept_progress"]
	emit_signal("skill_used", "Accept Progress", 20)
	# Block wears off after using or 4s
	get_tree().create_timer(4.0).timeout.connect(func(): is_blocking = false)

func take_damage(amount: int) -> int:
	if is_blocking:
		is_blocking = false
		heal(0)  # trigger HP display refresh
		return 0
	return super.take_damage(amount)

func get_skill_cooldown_ratio(skill_name: String) -> float:
	if not skill_cooldowns.has(skill_name):
		return 0.0
	return skill_cooldowns[skill_name] / skill_max_cooldowns[skill_name]
