import { motion } from 'motion/react';

interface ItemEntry {
  id: string;
  src: string;
  label: string;
  onClick?: () => void;
}

interface Props {
  items: ItemEntry[];
  size?: number;
  gap?: number;
  className?: string;
}

export default function ItemGrid({ items, size = 72, gap = 12, className = '' }: Props) {
  return (
    <div
      className={`flex flex-wrap ${className}`}
      style={{ gap }}
    >
      {items.map((item) => (
        <motion.button
          key={item.id}
          whileHover={{ scale: 1.1, y: -4 }}
          whileTap={{ scale: 0.9 }}
          onClick={item.onClick}
          className="flex flex-col items-center gap-1 p-2 rounded-xl border-2 bg-white/60 cursor-pointer"
          style={{
            width: size + 16,
            borderColor: '#e8e2d6',
          }}
        >
          <img
            src={item.src}
            alt={item.label}
            style={{ width: size, height: size }}
            className="object-contain pointer-events-none"
          />
          <span
            className="text-xs font-semibold text-center leading-tight"
            style={{ color: '#725d42' }}
          >
            {item.label}
          </span>
        </motion.button>
      ))}
    </div>
  );
}
