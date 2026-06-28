import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useLanguageStore, type Language } from '../../stores/useLanguageStore';

const LANG_OPTIONS: { value: Language; flag: string; full: string }[] = [
  { value: 'zh', flag: '🇨🇳', full: '中文' },
  { value: 'en', flag: '🇺🇸', full: 'English' },
  { value: 'ja', flag: '🇯🇵', full: '日本語' },
];

export default function LanguageSwitcher() {
  const language = useLanguageStore((s) => s.language);
  const setLanguage = useLanguageStore((s) => s.setLanguage);
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  const current = LANG_OPTIONS.find(o => o.value === language) ?? LANG_OPTIONS[0];

  return (
    <div ref={ref} className="fixed bottom-4 right-4 z-[9999] flex flex-col items-end gap-2">
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.95 }}
            transition={{ duration: 0.18 }}
            className="flex flex-col gap-1.5 items-end"
          >
            {LANG_OPTIONS.map(opt => (
              <button
                key={opt.value}
                onClick={() => { setLanguage(opt.value); setOpen(false); }}
                className="flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-bold shadow-md transition-all hover:scale-105 active:scale-95"
                style={{
                  background: opt.value === language ? '#19c8b9' : '#FFF9F0',
                  color: opt.value === language ? '#fff' : '#725D42',
                  border: `2.5px solid ${opt.value === language ? '#19c8b9' : '#e8ddd0'}`,
                  boxShadow: '0 2px 8px rgba(0,0,0,0.12)',
                }}
              >
                <span>{opt.flag}</span>
                <span>{opt.full}</span>
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <button
        onClick={() => setOpen(v => !v)}
        className="flex items-center gap-1.5 px-3 py-2 rounded-full text-sm font-bold shadow-lg transition-all hover:scale-105 active:scale-95"
        style={{
          background: open ? '#19c8b9' : '#FFF9F0',
          color: open ? '#fff' : '#19c8b9',
          border: '2.5px solid #19c8b9',
          boxShadow: '0 3px 12px rgba(25,200,185,0.25)',
        }}
        title="Switch language"
      >
        <span>🌐</span>
        <span>{current.flag} {current.full}</span>
      </button>
    </div>
  );
}
