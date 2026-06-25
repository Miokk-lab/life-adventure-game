import { motion } from 'motion/react';
import { Wallet } from 'animal-island-ui';
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

  const expForNext = chapter >= 3 ? 200 : chapter >= 2 ? 100 : 50;

  return (
    <header className="sticky top-0 z-50 px-3 py-2 flex items-center gap-3 select-none"
      style={{ background: 'linear-gradient(180deg, rgba(255,253,244,0.98), rgba(248,248,240,0.94))', backdropFilter: 'blur(8px)', borderBottom: '4px solid #725D42' }}>

      {/* Avatar — click to logout */}
      <button onClick={() => navigateTo('login')} title="退出登陆" className="shrink-0">
        <div className="w-10 h-10 rounded-full flex items-center justify-center relative overflow-hidden"
          style={{ background: '#F2EDE0', border: '3px solid #725D42' }}>
          {user?.avatarUrl ? <img src={user.avatarUrl} alt="" className="w-full h-full object-cover" />
            : <span className="text-xl">🧑‍🌾</span>}
          <div className="absolute -bottom-1 -right-1 px-1 text-white text-[8px] font-black rounded-full"
            style={{ background: '#8CC63F', border: '2px solid #725D42' }}>Lv.{chapter}</div>
        </div>
      </button>

      {/* Bars: 2x2 grid — left: EXP+体力, right: HP+MP — 10x wider */}
      <div className="flex gap-4 flex-1">
        <div className="flex flex-col gap-1.5 flex-1">
          <div className="flex items-center gap-2">
            <span className="text-xs font-extrabold shrink-0" style={{ color: '#f5c31c' }}>⭐</span>
            <div className="flex-1 h-4 rounded-full overflow-hidden border-2" style={{ background: '#F2EDE0', borderColor: '#c4b89e' }}>
              <motion.div animate={{ width: `${Math.min(100, (exp / expForNext) * 100)}%` }}
                className="h-full rounded-full bar-exp" />
            </div>
            <span className="text-[10px] font-extrabold shrink-0 w-14 text-right" style={{ color: '#f5c31c' }}>{exp}/{expForNext}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-extrabold shrink-0" style={{ color: '#6fba2c' }}>💚</span>
            <div className="flex-1 h-4 rounded-full overflow-hidden border-2" style={{ background: '#F2EDE0', borderColor: '#c4b89e' }}>
              <motion.div animate={{ width: `${(stamina / maxStamina) * 100}%` }}
                className="h-full rounded-full bar-stamina" />
            </div>
            <span className="text-[10px] font-extrabold shrink-0 w-14 text-right" style={{ color: '#6fba2c' }}>{stamina}/{maxStamina}</span>
          </div>
        </div>
        <div className="flex flex-col gap-1.5 flex-1">
          <div className="flex items-center gap-2">
            <span className="text-xs font-extrabold shrink-0" style={{ color: '#e05a5a' }}>❤️</span>
            <div className="flex-1 h-4 rounded-full overflow-hidden border-2" style={{ background: '#F2EDE0', borderColor: '#c4b89e' }}>
              <motion.div animate={{ width: `${maxHp ? (hp / maxHp) * 100 : 0}%` }}
                className="h-full rounded-full bar-hp" />
            </div>
            <span className="text-[10px] font-extrabold shrink-0 w-14 text-right" style={{ color: '#e05a5a' }}>{hp}/{maxHp}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-extrabold shrink-0" style={{ color: '#5b9bd5' }}>💙</span>
            <div className="flex-1 h-4 rounded-full overflow-hidden border-2" style={{ background: '#F2EDE0', borderColor: '#c4b89e' }}>
              <motion.div animate={{ width: `${maxMp ? (mp / maxMp) * 100 : 0}%` }}
                className="h-full rounded-full bar-mp" />
            </div>
            <span className="text-[10px] font-extrabold shrink-0 w-14 text-right" style={{ color: '#5b9bd5' }}>{mp}/{maxMp}</span>
          </div>
        </div>
      </div>

      {/* Right buttons */}
      <div className="flex items-center gap-1 shrink-0">
        <Wallet value={coins} size="small" />
        <button onClick={() => navigateTo('login')} className="flex items-center gap-0.5 px-1.5 py-1 rounded-full text-[10px] font-bold border-2 hover:bg-[#F2EDE0] transition-all"
          style={{ borderColor: '#e8e2d6', color: '#725D42' }}>✈️<span className="hidden sm:inline">机场</span></button>
        <button onClick={() => navigateTo('worry')} className="flex items-center gap-0.5 px-1.5 py-1 rounded-full text-[10px] font-bold border-2 hover:bg-[#F2EDE0] transition-all"
          style={{ borderColor: '#e8e2d6', color: '#725D42' }}>📮<span className="hidden sm:inline">寄信</span></button>
        <button className="flex items-center gap-0.5 px-1.5 py-1 rounded-full text-[10px] font-bold border-2 hover:bg-[#F2EDE0] transition-all"
          style={{ borderColor: '#e8e2d6', color: '#725D42' }} title="语言">🌐<span className="hidden sm:inline">中</span></button>
        <button className="flex items-center gap-0.5 px-1.5 py-1 rounded-full text-[10px] font-bold border-2 hover:bg-[#F2EDE0] transition-all"
          style={{ borderColor: '#e8e2d6', color: '#725D42' }} title="设置">⚙️<span className="hidden sm:inline">设置</span></button>
      </div>
    </header>
  );
}
