import { motion, AnimatePresence } from 'motion/react';
import { useGameStore } from '../../stores/useGameStore';
import { useTranslations } from '../../i18n';
import type { GamePage } from '../../types';
import { OnboardingTipTertiary, useHelpTip } from '../onboarding';
import type { OnboardingTip } from '../../types/onboarding';

interface NavItem {
  key: GamePage;
  emoji: string;
  icon: string;
}

interface Props {
  collapsed: boolean;
  onToggle: () => void;
}

const NAV_ITEMS: NavItem[] = [
  { key: 'battle', emoji: '⚔️', icon: 'icon-diy' },
  { key: 'tasks', emoji: '📋', icon: 'icon-miles' },
  { key: 'minigames', emoji: '🏕️', icon: 'icon-camera' },
  { key: 'teashop', emoji: '🍵', icon: 'icon-shopping' },
];

const BOTTOM_ITEMS: NavItem[] = [
  { key: 'login', emoji: '✈️', icon: 'icon-helicopter' },
  { key: 'worry', emoji: '📮', icon: 'icon-chat' },
  { key: 'help', emoji: '📚', icon: '' },
];

export default function Sidebar({ collapsed, onToggle }: Props) {
  const currentPage = useGameStore((s) => s.currentPage);
  const navigateTo = useGameStore((s) => s.navigateTo);
  const sb = useTranslations().sidebar;

  const battleTip = useHelpTip('menu_battle_log');
  const tasksTip = useHelpTip('menu_daily_quests');
  const teashopTip = useHelpTip('menu_tea_house');

  const tipData: Partial<Record<GamePage, { tip: OnboardingTip | undefined; shouldShow: boolean }>> = {
    battle: battleTip,
    tasks: tasksTip,
    teashop: teashopTip,
  };

  const handleNav = (page: GamePage) => {
    navigateTo(page);
    if (window.innerWidth < 768) onToggle();
  };

  const isActive = (key: GamePage) => currentPage === key;

  return (
    <>
      {/* Mobile overlay */}
      <AnimatePresence>
        {!collapsed && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 md:hidden"
            style={{ background: 'rgba(0,0,0,0.3)' }}
            onClick={onToggle}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        animate={{ x: collapsed ? -240 : 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className="fixed left-0 top-[60px] bottom-0 z-50 w-48 flex flex-col"
        style={{
          background: 'linear-gradient(180deg, #FFFDF4, #F8F5EB)',
          borderRight: '4px solid #725D42',
        }}
      >
        {/* Top nav items */}
        <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
          {NAV_ITEMS.map((item) => {
            const td = tipData[item.key];
            return (
              <div key={item.key} className="flex items-center gap-1">
                <button
                  onClick={() => handleNav(item.key)}
                  className="flex-1 flex items-center gap-3 px-3 py-3 rounded-2xl text-left transition-all border-2 font-bold text-sm"
                  style={{
                    background: isActive(item.key) ? '#e6f9f6' : 'transparent',
                    borderColor: isActive(item.key) ? '#19c8b9' : 'transparent',
                    color: isActive(item.key) ? '#19c8b9' : '#725D42',
                  }}
                >
                  <span className="text-lg">{item.emoji}</span>
                  <span className="text-xs">{(sb as any)[item.key]}</span>
                </button>
                {td?.shouldShow && td?.tip && (
                  <OnboardingTipTertiary tip={td.tip as OnboardingTip} />
                )}
              </div>
            );
          })}
        </nav>

        {/* Divider */}
        <div className="mx-3 border-t-2" style={{ borderColor: '#e8e2d6' }} />

        {/* Bottom nav items */}
        <nav className="py-3 px-3 space-y-1">
          {BOTTOM_ITEMS.map((item) => (
            <button
              key={item.key}
              onClick={() => handleNav(item.key)}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-2xl text-left transition-all border-2 font-bold text-sm"
              style={{
                background: item.key === 'help' && isActive('help') ? '#e6f9f6' : 'transparent',
                borderColor: item.key === 'help' && isActive('help') ? '#19c8b9' : 'transparent',
                color: item.key === 'help' ? '#19c8b9' : '#9f927d',
              }}
            >
              <span className="text-lg">{item.emoji}</span>
              <span className="text-xs">{(sb as any)[item.key]}</span>
            </button>
          ))}
        </nav>
      </motion.aside>

      {/* Hamburger toggle */}
      <button
        onClick={onToggle}
        className="fixed top-[68px] left-2 z-50 w-8 h-8 rounded-full flex items-center justify-center text-sm transition-all md:hidden"
        style={{
          background: '#FFFDF4',
          border: '3px solid #725D42',
          boxShadow: '0 4px 0 0 #C4B89E',
        }}
      >
        {collapsed ? '☰' : '✕'}
      </button>
    </>
  );
}
