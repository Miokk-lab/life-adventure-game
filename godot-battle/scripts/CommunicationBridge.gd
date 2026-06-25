extends Node
class_name CommunicationBridge

# postMessage to parent React window via JavaScript
func send_navigate(target: String) -> void:
	_post({
		"event": "navigate",
		"target": target,
		"timestamp": Time.get_unix_time_from_system() * 1000
	})

func send_battle_start(hero_name: String, demon_name: String) -> void:
	# Reuse for navigate signal hack
	if hero_name == "__navigate__":
		send_navigate(demon_name)
		return
	_post({
		"event": "battle-start",
		"hero": hero_name,
		"demon": demon_name,
		"timestamp": Time.get_unix_time_from_system() * 1000
	})

func send_battle_action(action_type: String, skill_name: String, damage: int, mp_cost: int) -> void:
	_post({
		"event": "battle-action",
		"type": action_type,
		"skillName": skill_name,
		"damage": damage,
		"mpCost": mp_cost,
		"timestamp": Time.get_unix_time_from_system() * 1000
	})

func send_enemy_action(skill_name: String, damage: int) -> void:
	_post({
		"event": "enemy-action",
		"skillName": skill_name,
		"damage": damage,
		"timestamp": Time.get_unix_time_from_system() * 1000
	})

func send_victory(hero_hp: int, total_damage: int, total_time: float, skills_used: Array) -> void:
	_post({
		"event": "battle-victory",
		"heroHpRemaining": hero_hp,
		"totalDamageDealt": total_damage,
		"totalTimeSeconds": int(total_time),
		"skillsUsed": skills_used,
		"timestamp": Time.get_unix_time_from_system() * 1000
	})

func send_defeat(demon_hp: int, total_time: float) -> void:
	_post({
		"event": "battle-defeat",
		"heroHpRemaining": 0,
		"demonHpRemaining": demon_hp,
		"totalTimeSeconds": int(total_time),
		"timestamp": Time.get_unix_time_from_system() * 1000
	})

func _post(data: Dictionary) -> void:
	if OS.has_feature("web"):
		var js_obj = _dict_to_js(data)
		JavaScriptBridge.eval("window.parent.postMessage(%s, '*')" % js_obj)

func _dict_to_js(d: Dictionary) -> String:
	var parts = []
	for key in d:
		var val = d[key]
		var js_val: String
		if val is String:
			js_val = '"%s"' % val.replace('"', '\\"')
		elif val is Array:
			var arr_parts = []
			for item in val:
				arr_parts.append('"%s"' % str(item))
			js_val = "[%s]" % ",".join(arr_parts)
		elif val is float or val is int:
			js_val = str(val)
		elif val is bool:
			js_val = "true" if val else "false"
		else:
			js_val = '"%s"' % str(val)
		parts.append('"%s":%s' % [key, js_val])
	return "{%s}" % ",".join(parts)
