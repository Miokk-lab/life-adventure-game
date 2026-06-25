import { useEffect } from 'react';
import { useGameStore } from '../../stores/useGameStore';
import { useAdventureStore } from '../../stores/useAdventureStore';
import { useBattleStore } from '../../stores/useBattleStore';
import { Button, Card, Modal } from 'animal-island-ui';
import { motion, AnimatePresence } from 'motion/react';
import GameLayout from '../shared/GameLayout';
import SkillButton from '../shared/SkillButton';
import FloatingText, { spawnFloatingText } from '../shared/FloatingText';

export default function BattlePage() {
  const navigateTo = useGameStore((s) => s.navigateTo);
  const hero = useAdventureStore((s) => s.hero);
  const monster = useAdventureStore((s) => s.monster);
  const chapter = useAdventureStore((s) => s.chapter);
  const restoreHp = useAdventureStore((s) => s.restoreHp);
  const consumeStamina = useAdventureStore((s) => s.consumeStamina);

  const phase = useBattleStore((s) => s.phase);
  const heroActor = useBattleStore((s) => s.hero);
  const monsterActor = useBattleStore((s) => s.monster);
  const availableSkills = useBattleStore((s) => s.availableSkills);
  const selectedSkillId = useBattleStore((s) => s.selectedSkillId);
  const log = useBattleStore((s) => s.log);
  const turn = useBattleStore((s) => s.turn);
  const isFirstBattle = useBattleStore((s) => s.isFirstBattle);
  const initBattle = useBattleStore((s) => s.initBattle);
  const selectSkill = useBattleStore((s) => s.selectSkill);
  const executeTurn = useBattleStore((s) => s.executeTurn);
  const resetBattle = useBattleStore((s) => s.resetBattle);
  const forceNarrativeDefeat = useBattleStore((s) => s.forceNarrativeDefeat);

  // Init battle on mount
  useEffect(() => {
    if (hero && monster) {
      initBattle(
        hero.name,
        hero.imageUrl,
        monster.name,
        monster.imageUrl,
        isFirstBattle ? 300 : 150,
        (hero.skills as any) ?? []
      );
    }
  }, []);

  const handleExecuteTurn = () => {
    if (!selectedSkillId) return;
    const skill = availableSkills.find((s) => s.id === selectedSkillId);
    if (skill) {
      if (skill.damage > 0) spawnFloatingText(`-${skill.damage}`, '#e05a5a');
      if (skill.healAmount > 0) spawnFloatingText(`+${skill.healAmount}`, '#6fba2c');
    }
    executeTurn();
    consumeStamina(5);
  };

  return (
    <GameLayout showHUD className="relative">
      <FloatingText />

      <div className="max-w-4xl mx-auto">
        {/* Battle arena */}
        <div className="relative flex items-center justify-between mb-6 p-6 rounded-3xl" style={{ background: 'linear-gradient(180deg, #fff8e7, #e8f5e9)', border: '3px solid #e8e2d6' }}>
          {/* Hero (left) */}
          <motion.div
            className="text-center w-32"
            animate={phase === 'enemy-turn' ? { x: [0, -8, 0] } : {}}
          >
            <div className="w-24 h-24 mx-auto rounded-full border-4 flex items-center justify-center text-5xl" style={{ borderColor: '#6fba2c', background: '#e6f9f6' }}>
              🦸
            </div>
            <div className="font-extrabold text-sm mt-2" style={{ color: '#19c8b9' }}>
              {heroActor.name}
            </div>
            <div className="text-xs font-bold mt-1" style={{ color: '#e05a5a' }}>
              ❤️ {heroActor.hp}/{heroActor.maxHp}
            </div>
            <div className="text-xs font-bold" style={{ color: '#5b9bd5' }}>
              💙 MP {heroActor.mp}/{heroActor.maxMp}
            </div>
          </motion.div>

          {/* VS */}
          <div className="text-4xl font-black animate-bounce" style={{ color: '#e05a5a' }}>
            ⚔️
          </div>

          {/* Monster (right) */}
          <motion.div
            className="text-center w-32"
            animate={phase === 'player-turn' && selectedSkillId ? { x: [0, 8, 0] } : {}}
          >
            <div className="w-24 h-24 mx-auto rounded-full border-4 flex items-center justify-center text-5xl" style={{ borderColor: '#e05a5a', background: '#fde8e8' }}>
              👾
            </div>
            <div className="font-extrabold text-sm mt-2" style={{ color: '#e05a5a' }}>
              {monsterActor.name}
            </div>
            <div className="text-xs font-bold mt-1" style={{ color: '#e05a5a' }}>
              ❤️ {monsterActor.hp}/{monsterActor.maxHp}
            </div>
          </motion.div>
        </div>

        {/* Turn info */}
        <div className="text-center mb-4">
          <span className="text-xs font-bold px-3 py-1 rounded-full" style={{ background: '#e6f9f6', color: '#19c8b9' }}>
            回合 {turn} {isFirstBattle ? '· 第一章' : `· 第${chapter}章`}
          </span>
        </div>

        {/* Skill panel */}
        {phase === 'player-turn' && (
          <div className="mb-6">
            <h3 className="text-sm font-extrabold mb-3" style={{ color: '#725d42' }}>
              🎯 选择技能
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {availableSkills.map((skill) => (
                <div key={skill.id}>
                  <SkillButton
                    skill={skill}
                    isSelected={selectedSkillId === skill.id}
                    mpAvailable={heroActor.mp}
                    chapter={chapter}
                    onClick={() => selectSkill(skill.id)}
                  />
                </div>
              ))}
            </div>
            <div className="text-center mt-4">
              <Button
                type="primary"
                size="large"
                disabled={!selectedSkillId}
                onClick={handleExecuteTurn}
              >
                ⚔️ 执行技能！
              </Button>
            </div>
          </div>
        )}

        {/* Battle log */}
        <Card className="max-h-48 overflow-y-auto">
          <h4 className="text-xs font-extrabold mb-2" style={{ color: '#9f927d' }}>
            📜 战斗记录
          </h4>
          <div className="text-xs space-y-1" style={{ color: '#725d42' }}>
            {log.map((entry) => (
              <p key={entry.id}>{entry.text}</p>
            ))}
          </div>
        </Card>
      </div>

      {/* Victory modal */}
      <Modal
        open={phase === 'victory'}
        title="🎉 净化成功！"
        footer={null}
        onClose={() => {}}
      >
        <div className="text-center py-4">
          <p className="text-lg font-bold mb-4" style={{ color: '#6fba2c' }}>
            心魔被净化了！
          </p>
          <p className="text-sm mb-6" style={{ color: '#725d42' }}>
            你成功面对了自己的烦恼。去丰收祭庆祝吧！
          </p>
          <Button type="primary" size="large" onClick={() => navigateTo('victory')}>
            🌈 前往丰收祭
          </Button>
        </div>
      </Modal>

      {/* Scripted defeat modal */}
      <Modal
        open={phase === 'defeat' && isFirstBattle}
        title="💨 能量耗尽…"
        footer={null}
        onClose={() => {}}
      >
        <div className="text-center py-4">
          <p className="text-lg font-bold mb-4" style={{ color: '#e05a5a' }}>
            呼……心魔太强了！
          </p>
          <p className="text-sm mb-6" style={{ color: '#725d42' }}>
            需要在岛上生活一段时间，完成日常任务，积蓄能量后再来挑战。
          </p>
          <Button type="primary" size="large" onClick={() => {
            resetBattle();
            navigateTo('tasks');
          }}>
            📋 前往日常任务
          </Button>
        </div>
      </Modal>

      {/* Real defeat modal */}
      <Modal
        open={phase === 'defeat' && !isFirstBattle}
        title="💔 战斗失败"
        footer={null}
        onClose={() => {}}
      >
        <div className="text-center py-4">
          <p className="text-sm mb-6" style={{ color: '#725d42' }}>
            别灰心！去静心营地恢复HP，制作花茶补充体力，再战一次！
          </p>
          <div className="flex gap-3 justify-center">
            <Button type="default" onClick={() => {
              resetBattle();
              navigateTo('minigames');
            }}>
              🏕️ 静心营地
            </Button>
            <Button type="primary" onClick={() => {
              resetBattle();
              navigateTo('teashop');
            }}>
              🍵 花茶补给
            </Button>
          </div>
        </div>
      </Modal>
    </GameLayout>
  );
}
