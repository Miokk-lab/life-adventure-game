import { Card } from 'animal-island-ui';
import { useTranslations } from '../../i18n';

interface Props {
  name: string;
  story: string;
  imageUrl: string;
  subtitle?: string;
  details?: string[];
  color?: string;
  className?: string;
}

const CARD_COLORS: Record<string, string> = {
  teal: 'app-teal',
  red: 'app-red',
  blue: 'app-blue',
  pink: 'app-pink',
  yellow: 'app-yellow',
  green: 'app-green',
  purple: 'purple',
};

export default function CharacterCard({
  name,
  story,
  imageUrl,
  subtitle,
  details,
  color = 'teal',
  className = '',
}: Props) {
  const cardColor = CARD_COLORS[color] ?? 'app-teal';
  const t = useTranslations().battle;

  return (
    <Card color={cardColor} className={`text-center ${className}`}>
      {/* Avatar placeholder — replace with actual image when available */}
      <div
        className="w-28 h-28 mx-auto rounded-full border-4 flex items-center justify-center text-5xl mb-3"
        style={{
          borderColor: '#f8f8f0',
          background: 'rgba(255,255,255,0.3)',
        }}
      >
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={name}
            className="w-full h-full rounded-full object-cover"
          />
        ) : (
          '🐾'
        )}
      </div>

      <h3
        className="text-lg font-extrabold mb-1"
        style={{ color: '#fff9e3', textShadow: '0 2px 0 rgba(0,0,0,0.15)' }}
      >
        {name}
      </h3>

      {subtitle && (
        <p className="text-xs font-semibold mb-2 opacity-80" style={{ color: '#fff9e3' }}>
          {subtitle}
        </p>
      )}

      <p className="text-sm leading-relaxed mt-2 max-h-[150px] overflow-y-auto break-words" style={{ color: '#725d42' }}>
        {story}
      </p>

      {details && details.length > 0 && (
        <div className="mt-3 pt-3 border-t" style={{ borderColor: 'rgba(255,255,255,0.2)' }}>
          <p className="text-xs font-bold mb-1" style={{ color: '#fff9e3' }}>
            {(t as any).skillAttackLabel}
          </p>
          <ul className="text-xs text-left list-disc list-inside" style={{ color: '#725d42' }}>
            {details.map((d, i) => (
              <li key={i}>{d}</li>
            ))}
          </ul>
        </div>
      )}
    </Card>
  );
}
