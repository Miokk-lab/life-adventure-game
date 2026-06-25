import { motion, AnimatePresence } from 'motion/react';
import { useGameStore } from '../../stores/useGameStore';
import type { GamePage } from '../../types';

interface NavItem {
  key: GamePage;
  emoji: string;
  label: string;
  icon: string;
}

const NAV_ITEMS: NavItem[] = [
  { key: 'battle', emoji: '⚔️', label: '对决', icon: 'icon-diy' },
  { key: 'tasks', emoji: '📋', label: '任务', icon: 'icon-miles' },
  { key: 'minigames', emoji: '🏕️', label: '静心', icon: 'icon-camera' },
  { key: 'teashop', emoji: '🍵', label: '花茶', icon: 'icon-shopping' },
];

const BOTTOM_ITEMS: NavItem[] = [
  { key: 'login', emoji: '✈️', label: '机场', icon: 'icon-helicopter' },
  { key: 'worry', emoji: '📮', label: '寄信', icon: 'icon-chat' },
];

interface Props {
  collapsed: boolean;
  onToggle: () => void;
}

export default function Sidebar({ collapsed, onToggle }: Props) {
  const currentPage = useGameStore((s) => s.currentPage);
  const navigateTo = useGameStore((s) => s.navigateTo);

  const handleNav = (page: GamePage) => {
    navigateTo(page);
    if (window.innerWidth < 768) onToggle(); // close on mobile
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
          {NAV_ITEMS.map((item) => (
            <button
              key={item.key}
              onClick={() => handleNav(item.key)}
              className="w-full flex items-center gap-3 px-3 py-3 rounded-2xl text-left transition-all border-2 font-bold text-sm"
              style={{
                background: isActive(item.key) ? '#e6f9f6' : 'transparent',
                borderColor: isActive(item.key) ? '#19c8b9' : 'transparent',
                color: isActive(item.key) ? '#19c8b9' : '#725D42',
              }}
            >
              <span className="text-lg">{item.emoji}</span>
              <span className="text-xs">{item.label}</span>
            </button>
          ))}
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
                background: 'transparent',
                borderColor: 'transparent',
                color: '#9f927d',
              }}
            >
              <span className="text-lg">{item.emoji}</span>
              <span className="text-xs">{item.label}</span>
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
