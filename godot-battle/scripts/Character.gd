extends CharacterBody2D
class_name Character

signal hp_changed(current_hp, max_hp)
signal mp_changed(current_mp, max_mp)
signal died

@export var max_hp: int = 100
@export var max_mp: int = 100
@export var base_damage: int = 10
@export var move_speed: float = 200.0

var current_hp: int
var current_mp: int
var is_dead: bool = false
var is_stunned: bool = false
var stun_timer: float = 0.0

# Status effects
var damage_reduction: float = 0.0
var damage_reduction_timer: float = 0.0
var damage_boost: float = 0.0
var damage_boost_used: bool = false
var regen_hp_rate: float = 0.0
var regen_timer: float = 0.0
var regen_duration: float = 0.0
var is_weakened: bool = false
var weakened_timer: float = 0.0

func _ready() -> void:
	current_hp = max_hp
	current_mp = max_mp

func _process(delta: float) -> void:
	_update_timers(delta)

func _update_timers(delta: float) -> void:
	if is_stunned:
		stun_timer -= delta
		if stun_timer <= 0:
			is_stunned = false

	if damage_reduction > 0:
		damage_reduction_timer -= delta
		if damage_reduction_timer <= 0:
			damage_reduction = 0.0

	if regen_duration > 0:
		regen_duration -= delta
		regen_timer -= delta
		if regen_timer <= 0:
			regen_timer = 1.0
			heal(int(regen_hp_rate))
		if regen_duration <= 0:
			regen_hp_rate = 0.0

	if is_weakened:
		weakened_timer -= delta
		if weakened_timer <= 0:
			is_weakened = false

func take_damage(amount: int) -> int:
	if is_dead:
		return 0
	var final_damage = amount
	if is_weakened:
		final_damage = int(final_damage * 0.5)
	if damage_reduction > 0:
		final_damage = int(final_damage * (1.0 - damage_reduction))
	final_damage = max(1, final_damage)
	current_hp -= final_damage
	if current_hp <= 0:
		current_hp = 0
		die()
	emit_signal("hp_changed", current_hp, max_hp)
	return final_damage

func heal(amount: int) -> void:
	current_hp = min(current_hp + amount, max_hp)
	emit_signal("hp_changed", current_hp, max_hp)

func use_mp(amount: int) -> bool:
	if current_mp < amount:
		return false
	current_mp -= amount
	emit_signal("mp_changed", current_mp, max_mp)
	return true

func restore_mp(amount: int) -> void:
	current_mp = min(current_mp + amount, max_mp)
	emit_signal("mp_changed", current_mp, max_mp)

func apply_stun(duration: float) -> void:
	is_stunned = true
	stun_timer = duration

func apply_damage_reduction(reduction: float, duration: float) -> void:
	damage_reduction = reduction
	damage_reduction_timer = duration

func apply_damage_boost(boost: float) -> void:
	damage_boost = boost
	damage_boost_used = false

func apply_regen(hp_per_second: float, duration: float) -> void:
	regen_hp_rate = hp_per_second
	regen_duration = duration
	regen_timer = 1.0

func apply_weaken(duration: float) -> void:
	is_weakened = true
	weakened_timer = duration

func get_attack_damage() -> int:
	var dmg = base_damage + randi() % 6
	if damage_boost > 0 and not damage_boost_used:
		dmg = int(dmg * (1.0 + damage_boost))
		damage_boost_used = true
		damage_boost = 0.0
	return dmg

func die() -> void:
	is_dead = true
	emit_signal("died")
