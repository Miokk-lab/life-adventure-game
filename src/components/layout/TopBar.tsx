import { motion } from 'motion/react';
import { Switch, Wallet } from 'animal-island-ui';
import { useAdventureStore } from '../../stores/useAdventureStore';
import { useUserStore } from '../../stores/useUserStore';
import { INITIAL_HP, INITIAL_STAMINA } from '../../constants';

interface Props {
  soundEnabled?: boolean;
  onToggleSound?: () => void;
}

export default function TopBar({ soundEnabled = true, onToggleSound }: Props) {
  const hp = useAdventureStore((s) => s.hp);
  const maxHp = useAdventureStore((s) => s.maxHp);
  const stamina = useAdventureStore((s) => s.stamina);
  const maxStamina = useAdventureStore((s) => s.maxStamina);
  const exp = useAdventureStore((s) => s.exp);
  const chapter = useAdventureStore((s) => s.chapter);
  const coins = useAdventureStore((s) => s.coins);
  const user = useUserStore((s) => s.user);

  const expForNext = chapter === 3 ? 300 : chapter === 2 ? 200 : 100;
  const expPct = Math.min(100, (exp / expForNext) * 100);

  return (
    <header
      className="sticky top-0 z-50 px-4 py-2 flex items-center gap-3 select-none"
      style={{
        background: 'linear-gradient(180deg, rgba(255,253,244,0.98), rgba(248,248,240,0.94))',
        backdropFilter: 'blur(8px)',
        borderBottom: '4px solid #725D42',
      }}
    >
      {/* Left: Avatar + Identity */}
      <div className="flex items-center gap-2 shrink-0">
        <div
          className="w-10 h-10 rounded-full flex items-center justify-center relative overflow-hidden"
          style={{
            background: '#F2EDE0',
            border: '3px solid #725D42',
            boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.06)',
          }}
        >
          {user?.avatarUrl ? (
            <img src={user.avatarUrl} alt="" className="w-full h-full object-cover" />
          ) : (
            <span className="text-lg">🧑‍🌾</span>
          )}
          <div
            className="absolute -bottom-0.5 -right-0.5 px-1 py-0 text-white text-[8px] font-black rounded-full z-10"
            style={{ background: '#8CC63F', border: '2px solid #725D42' }}
          >
            Lv.{chapter}
          </div>
        </div>
        <div className="leading-tight min-w-0 hidden sm:block">
          <span
            className="font-extrabold text-xs truncate block"
            style={{ color: '#5D4037' }}
          >
            {user?.nickname || '岛民'}
          </span>
          <span className="text-[9px] font-bold italic" style={{ color: '#A08E75' }}>
            {user?.islandName || '心灵岛'}
          </span>
        </div>
      </div>

      {/* Center: EXP + Stamina stacked */}
      <div className="flex-1 min-w-[120px] max-w-[240px] space-y-1">
        {/* EXP Bar */}
        <div className="flex items-center gap-1">
          <span className="text-xs shrink-0">⭐</span>
          <div className="flex-1 min-w-0">
            <div
              className="w-full h-2.5 rounded-full overflow-hidden"
              style={{
                background: '#F2EDE0',
                border: '2px solid #725D42',
                boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.06)',
              }}
            >
              <motion.div
                animate={{ width: `${expPct}%` }}
                className="h-full rounded-full"
                style={{
                  background: 'linear-gradient(90deg, #f5c31c, #ffd54f)',
                }}
              />
            </div>
          </div>
          <span className="text-[8px] font-black shrink-0" style={{ color: '#A08E75' }}>
            Lv.{chapter}
          </span>
        </div>

        {/* Stamina Bar */}
        <div className="flex items-center gap-1">
          <span className="text-xs shrink-0">💚</span>
          <div className="flex-1 min-w-0">
            <div
              className="w-full h-2.5 rounded-full overflow-hidden"
              style={{
                background: '#F2EDE0',
                border: '2px solid #725D42',
                boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.06)',
              }}
            >
              <motion.div
                animate={{ width: `${(stamina / maxStamina) * 100}%` }}
                className="h-full rounded-full"
                style={{
                  background: 'linear-gradient(90deg, #6fba2c, #8cd64a)',
                }}
              />
            </div>
          </div>
          <span className="text-[8px] font-black shrink-0" style={{ color: '#A08E75' }}>
            {stamina}/{maxStamina}
          </span>
        </div>
      </div>

      {/* Right: Shells + Settings + Language */}
      <div className="flex items-center gap-2 shrink-0">
        <Wallet value={coins} size="small" />
        <button
          className="w-8 h-8 rounded-full flex items-center justify-center text-sm transition-all hover:bg-[#F2EDE0] border-2"
          style={{ borderColor: '#e8e2d6' }}
          title="设置"
        >
          ⚙️
        </button>
        <button
          className="px-2 py-0.5 rounded-full text-[10px] font-extrabold transition-all hover:bg-[#e6f9f6] border-2"
          style={{ borderColor: '#e8e2d6', color: '#19c8b9' }}
          title="语言切换"
        >
          中
        </button>
        {onToggleSound && (
          <Switch checked={soundEnabled} onChange={onToggleSound} size="small" />
        )}
      </div>
    </header>
  );
}
