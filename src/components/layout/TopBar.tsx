import { motion } from 'motion/react';
import { Switch, Wallet } from 'animal-island-ui';
import { useAdventureStore } from '../../stores/useAdventureStore';
import { useUserStore } from '../../stores/useUserStore';
import { useGameStore } from '../../stores/useGameStore';
import { INITIAL_HP, INITIAL_MP } from '../../constants';

interface Props {
  soundEnabled?: boolean;
  onToggleSound?: () => void;
}

export default function TopBar({ soundEnabled = true, onToggleSound }: Props) {
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

  return (
    <header
      className="sticky top-0 z-50 px-3 py-1.5 flex items-center gap-2 select-none flex-wrap"
      style={{
        background: 'linear-gradient(180deg, rgba(255,253,244,0.98), rgba(248,248,240,0.94))',
        backdropFilter: 'blur(8px)',
        borderBottom: '4px solid #725D42',
      }}
    >
      {/* Navigation buttons */}
      <div className="flex items-center gap-1 shrink-0">
        <button onClick={() => navigateTo('login')} title="回机场"
          className="w-7 h-7 rounded-full flex items-center justify-center text-xs border-2 hover:bg-[#F2EDE0] transition-all"
          style={{ borderColor: '#e8e2d6' }}>✈️</button>
        <button onClick={() => navigateTo('worry')} title="寄信处"
          className="w-7 h-7 rounded-full flex items-center justify-center text-xs border-2 hover:bg-[#F2EDE0] transition-all"
          style={{ borderColor: '#e8e2d6' }}>📮</button>
      </div>

      {/* Avatar */}
      <div className="flex items-center gap-1.5 shrink-0">
        <div className="w-8 h-8 rounded-full flex items-center justify-center relative overflow-hidden"
          style={{ background: '#F2EDE0', border: '3px solid #725D42' }}>
          {user?.avatarUrl ? <img src={user.avatarUrl} alt="" className="w-full h-full object-cover" /> : <span className="text-base">🧑‍🌾</span>}
          <div className="absolute -bottom-0.5 -right-0.5 px-0.5 py-0 text-white text-[7px] font-black rounded-full z-10"
            style={{ background: '#8CC63F', border: '2px solid #725D42' }}>Lv.{chapter}</div>
        </div>
      </div>

      {/* Bars: HP + MP + EXP + Stamina */}
      <div className="flex-1 flex items-center gap-2 min-w-0 flex-wrap">
        {/* HP bar */}
        <div className="flex items-center gap-0.5 min-w-[60px] max-w-[100px] flex-1">
          <span className="text-[10px] shrink-0">❤️</span>
          <div className="flex-1 min-w-0">
            <div className="w-full h-2 rounded-full overflow-hidden" style={{ background: '#F2EDE0', border: '1.5px solid #e8e2d6' }}>
              <motion.div animate={{ width: `${maxHp > 0 ? (hp / maxHp) * 100 : 0}%` }}
                className="h-full rounded-full bar-hp" />
            </div>
          </div>
        </div>
        {/* MP bar */}
        <div className="flex items-center gap-0.5 min-w-[60px] max-w-[100px] flex-1">
          <span className="text-[10px] shrink-0">💙</span>
          <div className="flex-1 min-w-0">
            <div className="w-full h-2 rounded-full overflow-hidden" style={{ background: '#F2EDE0', border: '1.5px solid #e8e2d6' }}>
              <motion.div animate={{ width: `${maxMp > 0 ? (mp / maxMp) * 100 : 0}%` }}
                className="h-full rounded-full bar-mp" />
            </div>
          </div>
        </div>
        {/* EXP */}
        <div className="flex items-center gap-0.5 min-w-[50px] max-w-[80px]">
          <span className="text-[10px] shrink-0">⭐</span>
          <div className="flex-1 min-w-0">
            <div className="w-full h-2 rounded-full overflow-hidden" style={{ background: '#F2EDE0', border: '1.5px solid #e8e2d6' }}>
              <motion.div animate={{ width: `${Math.min(100, (exp / expForNext) * 100)}%` }}
                className="h-full rounded-full bar-exp" />
            </div>
          </div>
        </div>
        {/* Stamina */}
        <div className="flex items-center gap-0.5 min-w-[50px] max-w-[80px]">
          <span className="text-[10px] shrink-0">💚</span>
          <div className="flex-1 min-w-0">
            <div className="w-full h-2 rounded-full overflow-hidden" style={{ background: '#F2EDE0', border: '1.5px solid #e8e2d6' }}>
              <motion.div animate={{ width: `${(stamina / maxStamina) * 100}%` }}
                className="h-full rounded-full bar-stamina" />
            </div>
          </div>
        </div>
      </div>

      {/* Right: Shells + Settings + Language */}
      <div className="flex items-center gap-1.5 shrink-0">
        <Wallet value={coins} size="small" />
        {onToggleSound && (
          <Switch checked={soundEnabled} onChange={onToggleSound} size="small" />
        )}
        <button className="w-7 h-7 rounded-full flex items-center justify-center text-xs border-2 hover:bg-[#F2EDE0] transition-all"
          style={{ borderColor: '#e8e2d6' }} title="设置">⚙️</button>
        <button className="px-1.5 py-0.5 rounded-full text-[10px] font-extrabold border-2 hover:bg-[#e6f9f6] transition-all"
          style={{ borderColor: '#e8e2d6', color: '#19c8b9' }} title="语言">中</button>
      </div>
    </header>
  );
}
