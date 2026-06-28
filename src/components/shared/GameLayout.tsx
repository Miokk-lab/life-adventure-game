import type { ReactNode } from 'react';
import { useGameStore } from '../../stores/useGameStore';
import { useTranslations } from '../../i18n';
import HUD from './HUD';
import PageTransition from './PageTransition';

interface Props {
  children: ReactNode;
  showHUD?: boolean;
  className?: string;
}

export default function GameLayout({ children, showHUD = false, className = '' }: Props) {
  const currentPage = useGameStore((s) => s.currentPage);
  const tr = useTranslations();
  const pageInfo = tr.pages[currentPage];

  return (
    <PageTransition className={className}>
      {/* Page Title Banner */}
      {pageInfo && (
        <div
          className="text-center py-4 px-4"
          style={{
            background: 'linear-gradient(180deg, #e6f9f6 0%, #f8f8f0 100%)',
            borderBottom: '2px dashed #c4b89e',
          }}
        >
          <h1
            className="text-2xl md:text-3xl font-black tracking-wide"
            style={{
              color: '#19c8b9',
              textShadow: '0 3px 0 rgba(0,0,0,0.08)',
              fontFamily: '"Nunito", "Noto Sans SC", sans-serif',
            }}
          >
            {pageInfo.title}
          </h1>
          <p className="text-sm mt-1 font-semibold" style={{ color: '#9f927d' }}>
            {pageInfo.subtitle}
          </p>
        </div>
      )}

      {/* HUD (HP, Stamina, EXP, Coins) */}
      {showHUD && <HUD />}

      {/* Content */}
      <div className="max-w-5xl mx-auto px-4 py-6">{children}</div>
    </PageTransition>
  );
}
