import { motion } from 'motion/react';

interface Props {
  value: number;
  max: number;
  colorClass: string; // e.g. 'bar-hp', 'bar-mp', 'bar-stamina', 'bar-exp'
  label?: string;
  showLabel?: boolean;
  height?: number;
}

export default function ProgressBar({
  value,
  max,
  colorClass,
  label,
  showLabel = true,
  height = 14,
}: Props) {
  const pct = max > 0 ? Math.min(100, (value / max) * 100) : 0;

  return (
    <div className="w-full">
      {showLabel && label && (
        <div className="flex justify-between text-xs font-semibold mb-1" style={{ color: '#725d42' }}>
          <span>{label}</span>
          <span>
            {value} / {max}
          </span>
        </div>
      )}
      <div
        className="w-full rounded-full overflow-hidden border-2"
        style={{
          height,
          background: '#e8e2d6',
          borderColor: '#c4b89e',
        }}
      >
        <motion.div
          className={`h-full rounded-full ${colorClass}`}
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
        />
      </div>
    </div>
  );
}
