import { useEffect, useRef, useState } from 'react';
import { useGameStore } from '../../stores/useGameStore';
import { useAdventureStore } from '../../stores/useAdventureStore';
import { useBattleStore } from '../../stores/useBattleStore';
import { Card, Modal, Button, Collapse, Tooltip } from 'animal-island-ui';
import { motion } from 'motion/react';
import { Sword } from 'lucide-react';
import ProgressBar from '../shared/ProgressBar';
import FloatingText, { spawnFloatingText } from '../shared/FloatingText';
import { startAmbient, stopAmbient, playResolve, playHurt, playCollect } from '../../systems/soundEngine';
import type { BattleSkill } from '../../types';

const COPING_TACTICS = [
  { key: 'avoid', label: '躲避', emoji: '🐢', desc: '暂时远离压力源，给自己空间' },
  { key: 'resist', label: '抵抗', emoji: '🦥', desc: '观察并命名情绪，与它保持距离' },
  { key: 'adapt', label: '适应', emoji: '🐯', desc: '采取微小行动，打破无力感' },
  { key: 'challenge', label: '挑战', emoji: '🦅', desc: '直面恐惧，做一件你一直在逃避的事' },
  { key: 'transform', label: '转换', emoji: '🐍', desc: '换个角度看问题，寻找成长契机' },
];

export default function BattlePage() {
  const navigateTo = useGameStore((s) => s.navigateTo);
  const heroData = useAdventureStore((s) => s.hero);
  const monsterData = useAdventureStore((s) => s.monster);
  const chapter = useAdventureStore((s) => s.chapter);
  const stamina = useAdventureStore((s) => s.stamina);
  const consumeStamina = useAdventureStore((s) => s.consumeStamina);
  const updateHp = useAdventureStore((s) => s.updateHp);
  const addCoins = useAdventureStore((s) => s.addCoins);

  const phase = useBattleStore((s) => s.phase);
  const heroActor = useBattleStore((s) => s.hero);
  const monsterActor = useBattleStore((s) => s.monster);
  const availableSkills = useBattleStore((s) => s.availableSkills);
  const log = useBattleStore((s) => s.log);
  const turn = useBattleStore((s) => s.turn);
  const isFirstBattle = useBattleStore((s) => s.isFirstBattle);
  const initBattle = useBattleStore((s) => s.initBattle);
  const executeTurn = useBattleStore((s) => s.executeTurn);
  const resetBattle = useBattleStore((s) => s.resetBattle);
  const selectSkill = useBattleStore((s) => s.selectSkill);
  const selectedSkillId = useBattleStore((s) => s.selectedSkillId);

  const [selectedCoping, setSelectedCoping] = useState<string | null>(null);
  const initialized = useRef(false);
  const prevHeroHp = useRef(heroActor.hp);
  const prevMonsterHp = useRef(monsterActor.hp);

  const selectedSkill = availableSkills.find(s => s.id === selectedSkillId) ?? null;

  useEffect(() => { startAmbient(); return () => stopAmbient(); }, []);

  useEffect(() => {
    if (!initialized.current && heroData && monsterData && availableSkills.length > 0) {
      initialized.current = true;
      initBattle(
        heroData.name, heroData.imageUrl,
        monsterData.name, monsterData.imageUrl,
        isFirstBattle ? 300 : 150,
        availableSkills,
      );
    }
  }, [heroData, monsterData, availableSkills]);

  // Sync battle store HP changes → adventure store + floating text
  useEffect(() => {
    if (!initialized.current) return;
    const hpDiff = heroActor.hp - prevHeroHp.current;
    const monsterDiff = monsterActor.hp - prevMonsterHp.current;
    if (hpDiff < 0) {
      updateHp(hpDiff);
      spawnFloatingText(`${hpDiff}`, '#e05a5a');
    }
    if (monsterDiff < 0) {
      spawnFloatingText(`${monsterDiff}`, '#ff9f1c');
    }
    prevHeroHp.current = heroActor.hp;
    prevMonsterHp.current = monsterActor.hp;
  }, [heroActor.hp, monsterActor.hp]);

  const handleSelectCoping = (tactic: string) => {
    setSelectedCoping(tactic);
    const skillMap: Record<string, string> = {
      avoid: 'turtle', resist: 'sloth', adapt: 'tiger', challenge: 'tiger', transform: 'snake',
    };
    const animal = skillMap[tactic];
    // Find first available skill for this animal
    const skill = availableSkills.find(s => s.animal === animal && s.level <= chapter);
    if (skill) selectSkill(skill.id);
    else if (availableSkills.length > 0) selectSkill(availableSkills[0].id);
    playCollect();
  };

  const handleExecute = () => {
    if (!selectedCoping || stamina < 10) return;
    // Let the battle store handle all damage math
    executeTurn();
    consumeStamina(10);
    setSelectedCoping(null);
    playHurt();
  };

  const tacticDesc = COPING_TACTICS.find(t => t.key === selectedCoping);

  return (
    <div className="space-y-4">
      <FloatingText />

      {/* Hero/Monster HP/MP Bars */}
      <div className="grid grid-cols-2 gap-4">
        <Card color="app-teal">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 rounded-full flex items-center justify-center text-3xl"
              style={{ background: '#e6f9f6', border: '3px solid #19c8b9' }}>🦸</div>
            <div className="flex-1">
              <p className="font-extrabold text-sm" style={{ color: '#fff9e3' }}>{heroActor.name}</p>
              <p className="text-[10px] font-bold" style={{ color: 'rgba(255,255,255,0.7)' }}>Lv.{chapter} 守护者</p>
            </div>
          </div>
          <ProgressBar value={heroActor.hp} max={heroActor.maxHp} colorClass="bar-hp" label="❤️ HP" height={12} />
          <div className="mt-1">
            <ProgressBar value={heroActor.mp} max={heroActor.maxMp} colorClass="bar-mp" label="💙 MP" height={10} />
          </div>
        </Card>
        <Card color="app-red">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 rounded-full flex items-center justify-center text-3xl"
              style={{ background: '#fde8e8', border: '3px solid #e05a5a' }}>👾</div>
            <div className="flex-1">
              <p className="font-extrabold text-sm" style={{ color: '#fff9e3' }}>{monsterActor.name}</p>
              <p className="text-[10px] font-bold" style={{ color: 'rgba(255,255,255,0.7)' }}>回合 {turn}</p>
            </div>
          </div>
          <ProgressBar value={monsterActor.hp} max={monsterActor.maxHp} colorClass="bar-hp" label="❤️ HP" height={12} />
        </Card>
      </div>

      {/* Battle Arena */}
      <div className="relative rounded-3xl overflow-hidden flex items-center justify-center"
        style={{ minHeight: 200, background: 'linear-gradient(180deg, #e8f5e9 0%, #fff8e7 40%, #fce4ec 100%)', border: '4px solid #725D42' }}>
        <motion.div className="absolute left-8 text-6xl"
          animate={phase === 'enemy-turn' ? { x: [0, -15, 0], rotate: [0, -5, 0] } : {}}
          transition={{ duration: 0.4 }}>🦸</motion.div>
        <div className="text-3xl font-black animate-pulse" style={{ color: '#e05a5a' }}>⚡VS⚡</div>
        <motion.div className="absolute right-8 text-6xl"
          animate={phase === 'player-turn' && selectedCoping ? { x: [0, 15, 0], rotate: [0, 5, 0] } : {}}
          transition={{ duration: 0.4 }}>👾</motion.div>
      </div>

      {/* Coping Strategy Grid */}
      {phase === 'player-turn' && (
        <Card color="app-yellow">
          <h4 className="text-xs font-extrabold mb-3 text-center" style={{ color: '#725d42' }}>
            🎯 选择应对策略 (体力 -10/回合)
          </h4>

          {!selectedCoping ? (
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
              {COPING_TACTICS.map((t) => (
                <Tooltip key={t.key} title={t.desc} placement="top" variant="island">
                  <button
                    onClick={() => handleSelectCoping(t.key)}
                    className="flex flex-col items-center gap-1 p-3 rounded-2xl border-2 bg-white/70 transition-all cursor-pointer hover:bg-[#e6f9f6]"
                    style={{ borderColor: '#e8e2d6', boxShadow: '0 3px 0 0 #C4B89E' }}
                  >
                    <span className="text-2xl">{t.emoji}</span>
                    <span className="text-xs font-extrabold" style={{ color: '#725d42' }}>{t.label}</span>
                  </button>
                </Tooltip>
              ))}
            </div>
          ) : (
            <div>
              <Card color="app-teal" className="text-center mb-3">
                <p className="text-lg mb-1">{tacticDesc?.emoji}</p>
                <p className="font-extrabold text-sm" style={{ color: '#725d42' }}>
                  {tacticDesc?.label} — {tacticDesc?.desc}
                </p>
                {selectedSkill && (
                  <p className="text-xs mt-2" style={{ color: '#9f927d' }}>
                    {selectedSkill.description}
                  </p>
                )}
                {selectedSkill && (
                  <p className="text-xs mt-1 font-bold" style={{ color: '#19c8b9' }}>
                    MP {selectedSkill.mpCost} · ⚔️ {selectedSkill.damage || '?'} 伤害
                    {selectedSkill.healAmount > 0 && ` · 💚 +${selectedSkill.healAmount} 恢复`}
                  </p>
                )}
                {stamina < 10 && (
                  <p className="text-xs mt-1 font-bold animate-pulse" style={{ color: '#e05a5a' }}>
                    ⚠️ 体力不足！去花茶店补充体力。
                  </p>
                )}
              </Card>
              <div className="flex gap-2">
                <Button type="default" size="small" onClick={() => { setSelectedCoping(null); selectSkill(''); }}>
                  重选
                </Button>
                <Button type="primary" size="large" block onClick={handleExecute} disabled={stamina < 10}>
                  <Sword size={14} className="inline mr-1" />
                  执行战术 · 攻击心魔
                </Button>
              </div>
            </div>
          )}
        </Card>
      )}

      {/* Battle Log */}
      <Collapse
        question={<span className="text-xs font-extrabold" style={{ color: '#9f927d' }}>📜 战斗记录 ({log.length})</span>}
        answer={
          <div className="text-[11px] space-y-0.5 max-h-32 overflow-y-auto" style={{ color: '#725d42' }}>
            {log.map(e => <p key={e.id}>{e.text}</p>)}
          </div>
        }
      />

      {/* Victory */}
      {phase === 'victory' && (
        <Modal open title="🎉 净化成功！" footer={null} onClose={() => {}}>
          <div className="text-center py-4">
            <p className="text-lg font-bold mb-4" style={{ color: '#6fba2c' }}>心魔被净化了！</p>
            <Button type="primary" size="large" onClick={() => { playResolve(); navigateTo('victory'); }}>🌈 前往丰收祭</Button>
          </div>
        </Modal>
      )}

      {/* Scripted defeat */}
      {phase === 'defeat' && isFirstBattle && (
        <Modal open title="💨 能量耗尽…" footer={null} onClose={() => {}}>
          <div className="text-center py-4">
            <p className="text-lg font-bold mb-4" style={{ color: '#e05a5a' }}>呼……心魔太强了！</p>
            <p className="text-sm mb-6" style={{ color: '#725d42' }}>需要在岛上完成日常任务，积蓄能量后再来挑战。</p>
            <Button type="primary" size="large" onClick={() => { resetBattle(); navigateTo('tasks'); }}>📋 去做日常任务</Button>
          </div>
        </Modal>
      )}

      {/* Real defeat */}
      {phase === 'defeat' && !isFirstBattle && (
        <Modal open title="💔 战斗失败" footer={null} onClose={() => {}}>
          <div className="text-center py-4">
            <p className="text-sm mb-6" style={{ color: '#725d42' }}>去静心营地恢复HP，或泡杯花茶再来！</p>
            <div className="flex gap-3 justify-center">
              <Button type="default" onClick={() => { resetBattle(); navigateTo('minigames'); }}>🏕️ 静心营地</Button>
              <Button type="primary" onClick={() => { resetBattle(); navigateTo('teashop'); }}>🍵 花茶补给</Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
