import { motion } from 'motion/react';
import { Switch, Wallet } from 'animal-island-ui';
import { useAdventureStore } from '../../stores/useAdventureStore';
import { useUserStore } from '../../stores/useUserStore';
import { useGameStore } from '../../stores/useGameStore';

export default function TopBar() {
  const hp = useAdventureStore((s) => s.hp);
  const maxHp = useAdventureStore((s) => s.maxHp);
  const mp = useAdventureStore((s) => s.mp);
  const maxMp = useAdventureStore((s) => s.maxMp);
  const stamina = useAdventureStore((s) => s.stamina);
  const maxStamina = useAdventureStore((s) => s.maxStamina);
  const exp = useAdventureStore((s) => s.exp);
  const chapter = useAdventureStore((s) => s.chapter);
  const coins = useAdventureStore((s) => s.coins);
  const user = useUserStore((s) => s.user);
  const navigateTo = useGameStore((s) => s.navigateTo);

  const expForNext = chapter === 3 ? 300 : chapter === 2 ? 200 : 100;
  const hpPct = maxHp ? (hp / maxHp) * 100 : 0;
  const mpPct = maxMp ? (mp / maxMp) * 100 : 0;
  const staminaPct = maxStamina ? (stamina / maxStamina) * 100 : 0;
  const expPct = Math.min(100, (exp / expForNext) * 100);

  const barH = 2.5;
  const barW = 'w-20';

  return (
    <header
      className="sticky top-0 z-50 px-3 py-2 flex items-center gap-3 select-none"
      style={{
        background: 'linear-gradient(180deg, rgba(255,253,244,0.98), rgba(248,248,240,0.94))',
        backdropFilter: 'blur(8px)',
        borderBottom: '4px solid #725D42',
      }}
    >
      {/* Left: Avatar + Lv badge */}
      <div className="shrink-0">
        <div className="w-9 h-9 rounded-full flex items-center justify-center relative overflow-hidden"
          style={{ background: '#F2EDE0', border: '3px solid #725D42' }}>
          {user?.avatarUrl ? <img src={user.avatarUrl} alt="" className="w-full h-full object-cover" />
            : <span className="text-lg">🧑‍🌾</span>}
          <div className="absolute -bottom-0.5 -right-0.5 px-0.5 text-white text-[7px] font-black rounded-full z-10"
            style={{ background: '#8CC63F', border: '2px solid #725D42' }}>Lv.{chapter}</div>
        </div>
      </div>

      {/* Stacked bars: EXP, 体力, HP, MP */}
      <div className="flex flex-col gap-0.5 min-w-0">
        {/* EXP */}
        <div className="flex items-center gap-1">
          <span className="text-[9px] w-6 text-right shrink-0 font-bold" style={{ color: '#f5c31c' }}>⭐</span>
          <div className={`${barW} h-[${barH}] rounded-full overflow-hidden`} style={{ background: '#F2EDE0', border: '1px solid #e8e2d6' }}>
            <motion.div animate={{ width: `${expPct}%` }} className="h-full rounded-full bar-exp" />
          </div>
        </div>
        {/* Stamina */}
        <div className="flex items-center gap-1">
          <span className="text-[9px] w-6 text-right shrink-0 font-bold" style={{ color: '#6fba2c' }}>💚</span>
          <div className={`${barW} h-[${barH}] rounded-full overflow-hidden`} style={{ background: '#F2EDE0', border: '1px solid #e8e2d6' }}>
            <motion.div animate={{ width: `${staminaPct}%` }} className="h-full rounded-full bar-stamina" />
          </div>
        </div>
        {/* HP */}
        <div className="flex items-center gap-1">
          <span className="text-[9px] w-6 text-right shrink-0 font-bold" style={{ color: '#e05a5a' }}>❤️</span>
          <div className={`${barW} h-[${barH}] rounded-full overflow-hidden`} style={{ background: '#F2EDE0', border: '1px solid #e8e2d6' }}>
            <motion.div animate={{ width: `${hpPct}%` }} className="h-full rounded-full bar-hp" />
          </div>
        </div>
        {/* MP */}
        <div className="flex items-center gap-1">
          <span className="text-[9px] w-6 text-right shrink-0 font-bold" style={{ color: '#5b9bd5' }}>💙</span>
          <div className={`${barW} h-[${barH}] rounded-full overflow-hidden`} style={{ background: '#F2EDE0', border: '1px solid #e8e2d6' }}>
            <motion.div animate={{ width: `${mpPct}%` }} className="h-full rounded-full bar-mp" />
          </div>
        </div>
      </div>

      {/* Spacer */}
      <div className="flex-1" />

      {/* Right: Settings, Language, Airport, Mail with text labels */}
      <div className="flex items-center gap-1.5 shrink-0">
        <Wallet value={coins} size="small" />
        <button onClick={() => navigateTo('login')}
          className="flex items-center gap-0.5 px-1.5 py-1 rounded-full text-[10px] font-bold border-2 hover:bg-[#F2EDE0] transition-all"
          style={{ borderColor: '#e8e2d6', color: '#725D42' }}>
          ✈️<span className="hidden sm:inline">机场</span>
        </button>
        <button onClick={() => navigateTo('worry')}
          className="flex items-center gap-0.5 px-1.5 py-1 rounded-full text-[10px] font-bold border-2 hover:bg-[#F2EDE0] transition-all"
          style={{ borderColor: '#e8e2d6', color: '#725D42' }}>
          📮<span className="hidden sm:inline">寄信</span>
        </button>
        <button className="flex items-center gap-0.5 px-1.5 py-1 rounded-full text-[10px] font-bold border-2 hover:bg-[#F2EDE0] transition-all"
          style={{ borderColor: '#e8e2d6', color: '#725D42' }} title="语言">
          🌐<span className="hidden sm:inline">中</span>
        </button>
        <button className="flex items-center gap-0.5 px-1.5 py-1 rounded-full text-[10px] font-bold border-2 hover:bg-[#F2EDE0] transition-all"
          style={{ borderColor: '#e8e2d6', color: '#725D42' }} title="设置">
          ⚙️<span className="hidden sm:inline">设置</span>
        </button>
      </div>
    </header>
  );
}
