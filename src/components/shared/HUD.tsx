import { useAdventureStore } from '../../stores/useAdventureStore';
import { Wallet } from 'animal-island-ui';
import ProgressBar from './ProgressBar';
import { INITIAL_HP, INITIAL_MP, INITIAL_STAMINA } from '../../constants';

export default function HUD() {
  const hp = useAdventureStore((s) => s.hp);
  const maxHp = useAdventureStore((s) => s.maxHp);
  const stamina = useAdventureStore((s) => s.stamina);
  const maxStamina = useAdventureStore((s) => s.maxStamina);
  const coins = useAdventureStore((s) => s.coins);
  const exp = useAdventureStore((s) => s.exp);
  const chapter = useAdventureStore((s) => s.chapter);

  return (
    <div
      className="sticky top-0 z-50 px-4 py-3"
      style={{
        background: 'linear-gradient(180deg, rgba(248,248,240,0.98), rgba(248,248,240,0.92))',
        backdropFilter: 'blur(8px)',
        borderBottom: '3px solid #e8e2d6',
      }}
    >
      <div className="max-w-4xl mx-auto flex items-center gap-4 flex-wrap">
        {/* HP */}
        <div className="flex-1 min-w-[120px]">
          <ProgressBar value={hp} max={maxHp} colorClass="bar-hp" label="❤️ HP" />
        </div>

        {/* Stamina */}
        <div className="flex-1 min-w-[120px]">
          <ProgressBar value={stamina} max={maxStamina} colorClass="bar-stamina" label="💚 体力" />
        </div>

        {/* EXP */}
        <div className="flex-1 min-w-[120px]">
          <ProgressBar
            value={exp}
            max={chapter === 3 ? 300 : chapter === 2 ? 200 : 100}
            colorClass="bar-exp"
            label={`⭐ Lv${chapter}`}
          />
        </div>

        {/* Coins */}
        <div className="flex items-center gap-2">
          <Wallet value={coins} size="small" />
        </div>
      </div>
    </div>
  );
}
