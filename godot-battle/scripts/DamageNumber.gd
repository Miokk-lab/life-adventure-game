extends Node2D

var velocity: Vector2 = Vector2(randf_range(-20, 20), -80)
var lifetime: float = 1.5
var elapsed: float = 0.0

func setup(text: String, color: Color, pos: Vector2) -> void:
	position = pos
	var label = $Label
	label.text = text
	label.modulate = color
	label.add_theme_color_override("font_shadow_color", Color(0, 0, 0, 0.7))
	label.add_theme_constant_override("shadow_offset_x", 2)
	label.add_theme_constant_override("shadow_offset_y", 2)

func _process(delta: float) -> void:
	elapsed += delta
	position += velocity * delta
	velocity.y += 30 * delta  # gentle gravity
	modulate.a = 1.0 - (elapsed / lifetime)
	if elapsed >= lifetime:
		queue_free()
