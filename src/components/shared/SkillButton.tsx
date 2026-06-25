import { motion } from 'motion/react';
import { Tooltip } from 'animal-island-ui';
import type { BattleSkill } from '../../types';

interface Props {
  skill: BattleSkill;
  isSelected: boolean;
  mpAvailable: number;
  chapter: number;
  onClick: () => void;
}

const ANIMAL_EMOJI: Record<string, string> = {
  turtle: '🐢',
  sloth: '🦥',
  tiger: '🐯',
  snake: '🐍',
};

const ANIMAL_NAMES: Record<string, string> = {
  turtle: '乌龟·接纳',
  sloth: '树懒·正念',
  tiger: '老虎·行动',
  snake: '灵蛇·重构',
};

export default function SkillButton({ skill, isSelected, mpAvailable, chapter, onClick }: Props) {
  const canUse = mpAvailable >= skill.mpCost && skill.level <= chapter;
  const emoji = ANIMAL_EMOJI[skill.animal] ?? '✨';

  return (
    <Tooltip title={skill.description} placement="top" variant="island">
      <motion.button
        whileHover={canUse ? { scale: 1.05, y: -2 } : {}}
        whileTap={canUse ? { scale: 0.95 } : {}}
        onClick={onClick}
        disabled={!canUse}
        className="relative w-full text-left p-3 rounded-2xl border-2 transition-all cursor-pointer"
        style={{
          background: isSelected ? '#e6f9f6' : canUse ? '#f8f8f0' : '#f0ece2',
          borderColor: isSelected ? '#19c8b9' : canUse ? '#e8e2d6' : '#d4cfc3',
          opacity: canUse ? 1 : 0.5,
        }}
      >
        <div className="flex items-center gap-2 mb-1">
          <span className="text-lg">{emoji}</span>
          <span className="text-xs font-bold px-2 py-0.5 rounded-full" style={{ background: '#e8e2d6', color: '#725d42' }}>
            {ANIMAL_NAMES[skill.animal] ?? skill.animal}
          </span>
          <span className="text-xs font-bold px-2 py-0.5 rounded-full" style={{ background: '#e6f9f6', color: '#19c8b9' }}>
            Lv{skill.level}
          </span>
        </div>

        <div className="font-extrabold text-sm" style={{ color: '#725d42' }}>
          {skill.name}
        </div>

        <div className="flex gap-3 mt-1 text-xs font-semibold" style={{ color: '#9f927d' }}>
          <span>MP {skill.mpCost}</span>
          {skill.damage > 0 && <span style={{ color: '#e05a5a' }}>⚔️ {skill.damage}</span>}
          {skill.healAmount > 0 && <span style={{ color: '#6fba2c' }}>💚 +{skill.healAmount}</span>}
        </div>

        {!canUse && skill.level > chapter && (
          <div className="absolute inset-0 flex items-center justify-center rounded-2xl" style={{ background: 'rgba(248,248,240,0.6)' }}>
            <span className="text-xs font-bold" style={{ color: '#c4b89e' }}>
              🔒 第{skill.level}章解锁
            </span>
          </div>
        )}
      </motion.button>
    </Tooltip>
  );
}
