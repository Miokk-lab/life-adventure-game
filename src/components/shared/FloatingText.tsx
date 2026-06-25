import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface FloatingEntry {
  id: number;
  text: string;
  x: number;
  y: number;
  color: string;
}

let nextId = 0;
const listeners = new Set<(entry: FloatingEntry) => void>();

export function spawnFloatingText(text: string, color = '#e05a5a') {
  const entry: FloatingEntry = {
    id: nextId++,
    text,
    x: Math.random() * 60 - 30,
    y: -(40 + Math.random() * 40),
    color,
  };
  listeners.forEach((fn) => fn(entry));
}

interface Props {
  className?: string;
}

export default function FloatingText({ className = '' }: Props) {
  const [entries, setEntries] = useState<FloatingEntry[]>([]);

  useEffect(() => {
    const handler = (entry: FloatingEntry) => {
      setEntries((prev) => [...prev, entry]);
      setTimeout(() => {
        setEntries((prev) => prev.filter((e) => e.id !== entry.id));
      }, 1200);
    };
    listeners.add(handler);
    return () => {
      listeners.delete(handler);
    };
  }, []);

  return (
    <div className={`pointer-events-none fixed inset-0 z-[999] ${className}`}>
      <AnimatePresence>
        {entries.map((entry) => (
          <motion.div
            key={entry.id}
            initial={{ opacity: 1, scale: 0.5, x: 0, y: 0 }}
            animate={{ opacity: 0, scale: 1.2, x: entry.x, y: entry.y }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1, ease: 'easeOut' }}
            className="absolute font-extrabold text-xl whitespace-nowrap pointer-events-none"
            style={{
              left: '50%',
              top: '50%',
              color: entry.color,
              textShadow: '0 2px 0 rgba(0,0,0,0.2)',
            }}
          >
            {entry.text}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
