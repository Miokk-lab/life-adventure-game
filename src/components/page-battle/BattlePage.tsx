import { useEffect, useRef, useState } from 'react';
import { useGameStore } from '../../stores/useGameStore';
import { useAdventureStore } from '../../stores/useAdventureStore';
import { useBattleStore } from '../../stores/useBattleStore';
import { Card, Modal, Button, Collapse, Tooltip } from 'animal-island-ui';
import { motion } from 'motion/react';
import { Sword } from 'lucide-react';
import ProgressBar from '../shared/ProgressBar';
import FloatingText, { spawnFloatingText } from '../shared/FloatingText';
import { playResolve, playHurt, playCollect, pauseAmbient, resumeAmbient } from '../../systems/soundEngine';
import { VICTORY_VIDEO_MAP } from '../../data/presets';
import { useTranslations } from '../../i18n';
import { OnboardingTipManager } from '../onboarding';

const COPING_TACTIC_KEYS = [
  { key: 'avoid', emoji: '🐢', mpCost: 10 },
  { key: 'resist', emoji: '🦥', mpCost: 20 },
  { key: 'adapt', emoji: '🐯', mpCost: 20 },
  { key: 'challenge', emoji: '🦅', mpCost: 30 },
  { key: 'transform', emoji: '🐍', mpCost: 20 },
];

interface VictoryVideoPlayerProps {
  effectiveVideoUrl: string;
  worryType: string | null;
  onEnded: () => void;
  skipLabel: string;
}

function VictoryVideoPlayer({ effectiveVideoUrl, worryType, onEnded, skipLabel }: VictoryVideoPlayerProps) {
  const [videoSrc, setVideoSrc] = useState(effectiveVideoUrl);
  const [isMuted, setIsMuted] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    pauseAmbient();
    return () => {
      resumeAmbient();
    };
  }, []);

  useEffect(() => {
    setVideoSrc(effectiveVideoUrl);
    setIsMuted(false);
  }, [effectiveVideoUrl]);

  useEffect(() => {
    if (videoRef.current) {
      const playPromise = videoRef.current.play();
      if (playPromise !== undefined) {
        playPromise.catch((err) => {
          console.warn('Programmatic autoplay unmuted failed, falling back to muted:', err);
          setIsMuted(true);
        });
      }
    }
  }, [videoSrc]);

  useEffect(() => {
    if (isMuted && videoRef.current) {
      const playPromise = videoRef.current.play();
      if (playPromise !== undefined) {
        playPromise.catch((err) => {
          console.error('Programmatic autoplay muted also failed:', err);
        });
      }
    }
  }, [isMuted]);

  const handleError = () => {
    const fallback = VICTORY_VIDEO_MAP[worryType || ''] || '';
    if (videoSrc !== fallback && fallback) {
      console.warn(`Victory video failed to play (${videoSrc}), falling back to local: ${fallback}`);
      setVideoSrc(fallback);
      setIsMuted(false);
    } else {
      console.error('All victory video sources failed, proceeding...');
      onEnded();
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black flex items-center justify-center">
      <video
        ref={videoRef}
        src={videoSrc}
        autoPlay
        muted={isMuted}
        playsInline
        className="w-full h-full object-cover"
        onEnded={onEnded}
        onError={handleError}
      />
      <button
        onClick={onEnded}
        className="absolute bottom-8 right-8 px-6 py-3 rounded-full font-extrabold text-white border-2 border-white/40 bg-black/40 hover:bg-black/60 transition-all"
      >
        {skipLabel}
      </button>
    </div>
  );
}

export default function BattlePage() {
  const tr = useTranslations();
  const t = tr.battle;
  const COPING_TACTICS = COPING_TACTIC_KEYS.map((k, i) => ({
    ...k,
    label: t.copingTactics[i]?.label ?? k.key,
    desc: t.copingTactics[i]?.desc ?? '',
  }));

  const navigateTo = useGameStore((s) => s.navigateTo);
  const storeWorryType = useAdventureStore((s) => s.worryType);
  const gameWorryType = useGameStore((s) => s.worryType);
  const worryType = gameWorryType || storeWorryType;
  const heroData = useAdventureStore((s) => s.hero);
  const monsterData = useAdventureStore((s) => s.monster);
  const battleSkills = useAdventureStore((s) => s.battleSkills);
  const chapter = useAdventureStore((s) => s.chapter);
  const adventureHp = useAdventureStore((s) => s.hp);
  const adventureMp = useAdventureStore((s) => s.mp);
  const persistedMonsterHp = useAdventureStore((s) => s.monsterHp);
  const setMonsterHp = useAdventureStore((s) => s.setMonsterHp);
  const stamina = useAdventureStore((s) => s.stamina);
  const consumeStamina = useAdventureStore((s) => s.consumeStamina);
  const updateHp = useAdventureStore((s) => s.updateHp);
  const updateMp = useAdventureStore((s) => s.updateMp);
  const restoreHp = useAdventureStore((s) => s.restoreHp);
  const restoreStamina = useAdventureStore((s) => s.restoreStamina);
  const addCoins = useAdventureStore((s) => s.addCoins);
  const addExp = useAdventureStore((s) => s.addExp);

  const victoryVideoUrl = useAdventureStore((s) => s.victoryVideoUrl);
  const victoryImageUrl = useAdventureStore((s) => s.victoryImageUrl);
  const effectiveVideoUrl = victoryVideoUrl || VICTORY_VIDEO_MAP[worryType || ''] || '';

  const phase = useBattleStore((s) => s.phase);
  const heroActor = useBattleStore((s) => s.hero);
  const monsterActor = useBattleStore((s) => s.monster);
  const log = useBattleStore((s) => s.log);
  const turn = useBattleStore((s) => s.turn);
  const isFirstBattle = useBattleStore((s) => s.isFirstBattle);
  const initBattle = useBattleStore((s) => s.initBattle);
  const executeTurn = useBattleStore((s) => s.executeTurn);
  const resetBattle = useBattleStore((s) => s.resetBattle);
  const selectSkill = useBattleStore((s) => s.selectSkill);
  const selectedSkillId = useBattleStore((s) => s.selectedSkillId);
  const lastHeroAction = useBattleStore((s) => s.lastHeroAction);
  const lastEnemyAction = useBattleStore((s) => s.lastEnemyAction);

  const availableSkills = useBattleStore((s) => s.availableSkills);
  const [selectedCoping, setSelectedCoping] = useState<string | null>(null);
  const [arenaMsg, setArenaMsg] = useState<{ hero?: string; monster?: string; heroDmg?: number; monsterDmg?: number }>({});
  const [mpPopupOpen, setMpPopupOpen] = useState(false);
  const [defeatPopupOpen, setDefeatPopupOpen] = useState(false);
  const initialized = useRef(false);
  const prevHeroHp = useRef(adventureHp);
  const prevMonsterHp = useRef(persistedMonsterHp ?? 100);
  const prevHeroMp = useRef(adventureMp);

  const selectedSkill = availableSkills.find(s => s.id === selectedSkillId) ?? null;

  useEffect(() => {
    if (!initialized.current && heroData && monsterData && battleSkills.length > 0) {
      initialized.current = true;
      initBattle(heroData.name, heroData.imageUrl, monsterData.name, monsterData.imageUrl, persistedMonsterHp ?? 100, battleSkills, adventureHp, adventureMp);
    }
  }, [heroData, monsterData, battleSkills]);

  // Sync HP/MP changes → adventure store + floating text
  // Only sync hero HP damage during enemy-turn phase
  useEffect(() => {
    if (!initialized.current) return;
    const hpDiff = heroActor.hp - prevHeroHp.current;
    const monsterDiff = monsterActor.hp - prevMonsterHp.current;
    const mpDiff = heroActor.mp - prevHeroMp.current;

    // Hero HP only decreases during enemy-turn
    if (hpDiff < 0 && phase === 'enemy-turn') {
      updateHp(hpDiff);
      spawnFloatingText(`${hpDiff}`, '#e05a5a');
    }
    // Monster HP decreases during player-action (hero attacks)
    if (monsterDiff < 0 && phase === 'player-action') {
      spawnFloatingText(`${monsterDiff}`, '#ff9f1c');
      setMonsterHp(monsterActor.hp);
    }
    // MP always syncs
    if (mpDiff !== 0) updateMp(mpDiff);

    prevHeroHp.current = heroActor.hp;
    prevMonsterHp.current = monsterActor.hp;
    prevHeroMp.current = heroActor.mp;
  }, [heroActor.hp, monsterActor.hp, heroActor.mp, phase]);

  const handleSelectCoping = (tactic: string) => {
    setSelectedCoping(tactic);
    const skillMap: Record<string, string> = { avoid: 'turtle', resist: 'sloth', adapt: 'tiger', challenge: 'eagle', transform: 'snake' };
    const animal = skillMap[tactic];
    const skillsOfAnimal = availableSkills.filter(s => s.animal === animal && s.level <= chapter);
    const skill = skillsOfAnimal.sort((a, b) => b.level - a.level)[0];
    if (skill) selectSkill(skill.id);
    else if (availableSkills.length > 0) selectSkill(availableSkills[0].id);
    playCollect();
  };

  // Reset popup states on every mount, detect conditions to open them
  useEffect(() => {
    setMpPopupOpen(false);
    setDefeatPopupOpen(false);
  }, []);

  useEffect(() => {
    if (heroActor.mp === 0 && phase !== 'defeat' && phase !== 'victory') {
      setMpPopupOpen(true);
    }
  }, [heroActor.mp, phase]);

  useEffect(() => {
    if (phase === 'defeat') setDefeatPopupOpen(true);
  }, [phase]);

  // One-time stamina cost to enter battle
  useEffect(() => {
    if (initialized.current && phase === 'player-turn' && turn === 1) {
      consumeStamina(30);
    }
  }, [phase, turn]);

  const handleExecute = () => {
    if (!selectedCoping) return;
    const tactic = COPING_TACTICS.find(ct => ct.key === selectedCoping);
    if (!tactic || heroActor.mp < tactic.mpCost) return;
    const skill = availableSkills.find(s => s.id === selectedSkillId);
    setArenaMsg({ hero: skill?.name ?? t.attackBtn, monsterDmg: undefined });
    executeTurn(tactic.mpCost);
    setSelectedCoping(null);
    playHurt();
  };

  const tacticDesc = COPING_TACTICS.find(ct => ct.key === selectedCoping);

  return (
    <div className="space-y-4">
      <FloatingText />

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        {/* Left: Battle Area (3 cols) */}
        <div className="lg:col-span-3 space-y-4">
          {/* Hero/Monster HP/MP Bars */}
          <div className="grid grid-cols-2 gap-4">
            <Card color="app-teal">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-10 h-10 rounded-full flex items-center justify-center overflow-hidden"
                  style={{ background: '#e6f9f6', border: '3px solid #19c8b9' }}>
                  {heroActor.imageUrl ? <img src={heroActor.imageUrl} alt={heroActor.name} className="w-full h-full object-cover" /> : <span className="text-2xl">🦸</span>}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-extrabold text-xs truncate" style={{ color: '#fff9e3' }}>{heroActor.name}</p>
                </div>
              </div>
              <ProgressBar value={heroActor.hp} max={heroActor.maxHp} colorClass="bar-hp" label="❤️ HP" height={10} />
              <div className="mt-1"><ProgressBar value={heroActor.mp} max={heroActor.maxMp} colorClass="bar-mp" label="💙 MP" height={8} /></div>
            </Card>
            <Card color="app-red">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-10 h-10 rounded-full flex items-center justify-center overflow-hidden"
                  style={{ background: '#fde8e8', border: '3px solid #e05a5a' }}>
                  {monsterActor.imageUrl ? <img src={monsterActor.imageUrl} alt={monsterActor.name} className="w-full h-full object-cover" /> : <span className="text-2xl">👾</span>}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-extrabold text-xs truncate" style={{ color: '#fff9e3' }}>{monsterActor.name}</p>
                </div>
              </div>
              <ProgressBar value={monsterActor.hp} max={monsterActor.maxHp} colorClass="bar-hp" label="❤️ HP" height={10} />
            </Card>
          </div>

          {/* Battle Arena with phase-based feedback */}
          <div className="relative rounded-3xl overflow-hidden flex items-center justify-center"
            style={{ minHeight: 220, background: 'linear-gradient(180deg, #e8f5e9 0%, #fff8e7 40%, #fce4ec 100%)', border: '4px solid #725D42' }}>
            {/* Hero side */}
            <div className="absolute left-4 flex flex-col items-center gap-1">
              <motion.div
                animate={phase === 'player-action' ? { x: [0, 50, 0], scale: [1, 1.3, 1] } : phase === 'enemy-turn' ? { x: [0, -15, 0] } : {}}
                transition={{ duration: phase === 'player-action' ? 0.6 : 0.4 }}>
                {heroActor.imageUrl ? <img src={heroActor.imageUrl} alt={heroActor.name} className="w-16 h-16 object-contain" /> : <span className="text-5xl">🦸</span>}
              </motion.div>
              {/* Hero attack label */}
              {phase === 'player-action' && lastHeroAction && (
                <motion.span initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }}
                  className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-white/90 border-2 border-[#19c8b9]" style={{ color: '#19c8b9' }}>
                  {lastHeroAction.skillName}
                </motion.span>
              )}
              {/* Hero takes damage */}
              {phase === 'enemy-turn' && lastEnemyAction && (
                <motion.span initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }}
                  className="text-xs font-extrabold px-2 py-0.5 rounded-full" style={{ background: '#fde8e8', color: '#e05a5a' }}>
                  -{lastEnemyAction.damage} HP
                </motion.span>
              )}
            </div>

            {/* VS indicator */}
            <motion.div className="text-2xl font-black"
              animate={phase === 'player-action' ? { scale: [1, 1.3, 1], rotate: [0, 10, 0] } : phase === 'enemy-turn' ? { scale: [1, 0.8, 1] } : {}}
              style={{ color: phase === 'player-action' ? '#19c8b9' : phase === 'enemy-turn' ? '#e05a5a' : '#c4b89e' }}>
              {phase === 'player-action' ? '⚔️' : phase === 'enemy-turn' ? '🛡️' : 'VS'}
            </motion.div>

            {/* Monster side */}
            <div className="absolute right-4 flex flex-col items-center gap-1">
              <motion.div
                animate={phase === 'enemy-turn' ? { x: [0, -50, 0], scale: [1, 1.3, 1] } : phase === 'player-action' ? { x: [0, 15, 0], scale: [1, 0.85, 1] } : {}}
                transition={{ duration: phase === 'enemy-turn' ? 0.6 : 0.4 }}>
                {monsterActor.imageUrl ? <img src={monsterActor.imageUrl} alt={monsterActor.name} className="w-16 h-16 object-contain" /> : <span className="text-5xl">👾</span>}
              </motion.div>
              {/* Monster takes damage */}
              {phase === 'player-action' && lastHeroAction && (
                <motion.span initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }}
                  className="text-xs font-extrabold px-2 py-0.5 rounded-full" style={{ background: '#fde8e8', color: '#e05a5a' }}>
                  -{lastHeroAction.damage} HP
                </motion.span>
              )}
              {/* Monster attack label */}
              {phase === 'enemy-turn' && lastEnemyAction && (
                <motion.span initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }}
                  className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-white/90 border-2 border-[#e05a5a]" style={{ color: '#e05a5a' }}>
                  {t.launchAttack}
                </motion.span>
              )}
            </div>
          </div>

          {/* Coping Strategy Grid — only during player-turn, hide during animations */}
          {(phase === 'player-turn') && (
            <Card color="app-yellow">
              <h4 className="text-xs font-extrabold mb-3 text-center" style={{ color: '#725d42' }}>{t.chooseStrategy}</h4>
              {!selectedCoping ? (
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                  {COPING_TACTICS.map((t) => (
                    <Tooltip key={t.key} title={t.desc} placement="top" variant="island">
                      <button onClick={() => handleSelectCoping(t.key)}
                        className="flex flex-col items-center gap-1 p-3 rounded-2xl border-2 bg-white/70 transition-all cursor-pointer hover:bg-[#e6f9f6]"
                        style={{ borderColor: '#e8e2d6', boxShadow: '0 3px 0 0 #C4B89E' }}>
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
                    {selectedSkill && (
                      <p className="text-base font-extrabold leading-snug" style={{ color: '#725d42' }}>
                        「{selectedSkill.description}」
                      </p>
                    )}
                    <p className="text-xs mt-2 font-bold" style={{ color: '#19c8b9' }}>
                      {tacticDesc?.label} · MP {tacticDesc?.mpCost} {selectedSkill ? `· ⚔️ ${selectedSkill.damage || '?'} ${(t as any).damageLabel}` : `— ${tacticDesc?.desc}`}
                    </p>
                    {heroActor.mp < (COPING_TACTICS.find(ct=>ct.key===selectedCoping)?.mpCost ?? 99) && (
                      <p className="text-xs mt-1 font-bold animate-pulse" style={{ color: '#e05a5a' }}>{t.mpWarning}</p>
                    )}
                  </Card>
                  <div className="flex gap-2">
                    <Button type="default" size="small" onClick={() => { setSelectedCoping(null); selectSkill(''); }}>{t.reselect}</Button>
                    <Button type="primary" size="large" block onClick={handleExecute} disabled={!selectedSkill || heroActor.mp < (COPING_TACTICS.find(ct=>ct.key===selectedCoping)?.mpCost ?? 99)}>
                      <Sword size={14} className="inline mr-1" />{t.executeBtn}
                    </Button>
                  </div>
                </div>
              )}
            </Card>
          )}
        </div>

        {/* Right: Battle Log (1 col) */}
        <div className="lg:col-span-1">
          <Card className="h-full max-h-[600px] overflow-hidden flex flex-col">
            <h4 className="text-xs font-extrabold mb-2 shrink-0" style={{ color: '#9f927d' }}>{t.battleLog}</h4>
            <div className="flex-1 overflow-y-auto text-[10px] space-y-0.5 pr-1" style={{ color: '#725d42' }}>
              {log.map(e => (
                <p key={e.id} className="leading-relaxed">
                  {e.type === 'player-action' && <span style={{ color: '#19c8b9' }}>🦸 </span>}
                  {e.type === 'enemy-action' && <span style={{ color: '#e05a5a' }}>👾 </span>}
                  {e.type === 'system' && <span style={{ color: '#6fba2c' }}>✨ </span>}
                  {e.text}
                </p>
              ))}
            </div>
          </Card>
        </div>
      </div>

      {/* Victory fullscreen overlay — upgrades from spinner → image → video as media arrives */}
      {phase === 'victory' && (() => {
        const handleProceed = () => { restoreHp(9999); updateMp(9999); restoreStamina(9999); addCoins(50); addExp(50); playResolve(); setMonsterHp(null); navigateTo('victory'); };

        // Priority 1: video ready → fullscreen video (local fallback by category if AI url missing)
        if (effectiveVideoUrl) {
          return (
            <VictoryVideoPlayer
              effectiveVideoUrl={effectiveVideoUrl}
              worryType={worryType}
              onEnded={handleProceed}
              skipLabel={t.skipVideo}
            />
          );
        }

        // Priority 2: victory image ready → PNG modal (auto-upgrades when video arrives)
        if (victoryImageUrl) {
          return (
            <div className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center overflow-y-auto py-8">
              <div className="text-center max-w-md mx-auto px-4 w-full">
                <motion.div
                  animate={{ scale: [1, 1.15, 1], rotate: [0, 5, -5, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="text-6xl mb-4"
                >
                  🎊
                </motion.div>
                <h2 className="text-3xl font-extrabold text-white mb-1">{t.purifySuccess}</h2>
                <p className="text-white/60 text-sm mb-4">{t.purifySubtitle}</p>
                <div className="rounded-3xl overflow-hidden border-4 border-white/20 mb-4">
                  <img src={victoryImageUrl} alt={t.purifyAlt} className="w-full h-auto" />
                </div>
                <p className="text-yellow-300 text-xs mb-5 animate-pulse">{t.videoLoading}</p>
                <button
                  onClick={handleProceed}
                  className="px-8 py-3 rounded-full font-extrabold text-white border-2 border-[#2E7D32]"
                  style={{ background: '#6fba2c', boxShadow: '0 4px 0 0 #2E7D32' }}
                >
                  {t.victoryBtn}
                </button>
              </div>
            </div>
          );
        }

        // Priority 3: nothing ready yet → animated waiting state
        return (
          <div className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center">
            <div className="text-center">
              <motion.div
                animate={{ rotate: [0, 10, -10, 0], scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="text-7xl mb-6"
              >
                🎊
              </motion.div>
              <h2 className="text-3xl font-extrabold text-white mb-2">{t.purifySuccess}</h2>
              <p className="text-white/60 text-sm mb-6">{t.purifySubtitle}</p>
              <motion.p
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="text-yellow-300 text-sm mb-6"
              >
                {t.videoLoadingShort}
              </motion.p>
              <button
                onClick={handleProceed}
                className="px-8 py-3 rounded-full font-extrabold text-white border-2 border-[#2E7D32]"
                style={{ background: '#6fba2c', boxShadow: '0 4px 0 0 #2E7D32' }}
              >
                {t.victoryBtn}
              </button>
            </div>
          </div>
        );
      })()}
      <Modal open={mpPopupOpen} title={t.mpModal.title} typewriter={false} footer={null} onClose={() => setMpPopupOpen(false)}>
        <div className="text-center py-4">
          <p className="text-lg font-bold mb-4" style={{ color: '#2196F3' }}>{t.mpModal.body1}</p>
          <p className="text-sm mb-6" style={{ color: '#725d42' }}>{t.mpModal.body2}</p>
          <Button type="primary" size="large" onClick={() => { setMpPopupOpen(false); resetBattle(); navigateTo('tasks'); }}>{t.mpModal.tasksBtn}</Button>
        </div>
      </Modal>
      <Modal open={defeatPopupOpen} title={isFirstBattle ? t.defeatModal.title1 : t.defeatModal.title2} typewriter={false} footer={null} onClose={() => setDefeatPopupOpen(false)}>
        <div className="text-center py-4">
          {isFirstBattle ? (
            <>
              <p className="text-lg font-bold mb-4" style={{ color: '#e05a5a' }}>{t.defeatModal.body1}</p>
              <p className="text-sm mb-4" style={{ color: '#725d42' }}>{t.defeatModal.body2}</p>
              <p className="text-xs mb-6 font-bold" style={{ color: '#e05a5a' }}>{t.defeatModal.body3}</p>
              <Button type="primary" size="large" onClick={() => { setDefeatPopupOpen(false); resetBattle(); navigateTo('tasks'); }}>{t.defeatModal.tasksBtn}</Button>
            </>
          ) : (
            <>
              <p className="text-sm mb-4" style={{ color: '#725d42' }}>{t.defeatModal.campBody}</p>
              <p className="text-xs mb-6 font-bold" style={{ color: '#e05a5a' }}>{t.defeatModal.body3}</p>
              <div className="flex gap-3 justify-center">
                <Button type="default" onClick={() => { setDefeatPopupOpen(false); resetBattle(); navigateTo('minigames'); }}>{t.defeatModal.campBtn}</Button>
                <Button type="primary" onClick={() => { setDefeatPopupOpen(false); resetBattle(); navigateTo('teashop'); }}>{t.defeatModal.teaBtn}</Button>
              </div>
            </>
          )}
        </div>
      </Modal>
      <OnboardingTipManager triggerId="battle_intro" />
    </div>
  );
}
