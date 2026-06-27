import { useState, useEffect } from 'react';
import { Tabs, Divider, Modal } from 'animal-island-ui';
import type { TabItem } from 'animal-island-ui';
import { motion } from 'motion/react';
import AppLayout from '../layout/AppLayout';
import BattlePage from '../page-battle/BattlePage';
import TasksPage from '../page-tasks/TasksPage';
import MiniGamesPage from '../page-minigames/MiniGamesPage';
import TeaShopPage from '../page-teashop/TeaShopPage';
import { useGameStore } from '../../stores/useGameStore';
import { useAdventureStore } from '../../stores/useAdventureStore';
import { useVideoPolling } from '../../hooks/useVideoPolling';
import { playClick, playResolve, setPageAmbient } from '../../systems/soundEngine';
import { useTranslations } from '../../i18n';
import type { GamePage } from '../../types';

type GameTab = 'combat' | 'tasks' | 'minigames' | 'teashop';

const PAGE_TO_TAB: Record<string, GameTab> = {
  battle: 'combat',
  tasks: 'tasks',
  minigames: 'minigames',
  teashop: 'teashop',
};

export default function GameScreen() {
  const [activeTab, setActiveTab] = useState<GameTab>('combat');
  const currentPage = useGameStore((s) => s.currentPage);
  const showLevelUp = useAdventureStore((s) => s.showLevelUp);
  const chapter = useAdventureStore((s) => s.chapter);
  const dismissLevelUp = useAdventureStore((s) => s.dismissLevelUp);
  const taskId = useAdventureStore((s) => s.taskId);
  const tr = useTranslations();
  const sb = tr.sidebar;
  const gs = tr.gamescreen;

  // Poll for victory image + video while user is in game
  useVideoPolling(taskId);

  // Set battle music on initial mount (combat tab is default)
  useEffect(() => {
    setPageAmbient('battle');
  }, []);

  // Sync external navigation to tabs + music
  useEffect(() => {
    const tab = PAGE_TO_TAB[currentPage];
    if (tab) {
      setActiveTab(tab);
      setPageAmbient(tab === 'combat' ? 'battle' : 'gamescreen');
    }
  }, [currentPage]);

  const tabItems: TabItem[] = [
    {
      key: 'combat',
      label: <span className="flex items-center gap-1.5"><span>⚔️</span><span className="hidden sm:inline">{sb.battle}</span></span>,
      children: <BattlePage />,
    },
    {
      key: 'tasks',
      label: <span className="flex items-center gap-1.5"><span>📋</span><span className="hidden sm:inline">{sb.tasks}</span></span>,
      children: <TasksPage />,
    },
    {
      key: 'minigames',
      label: <span className="flex items-center gap-1.5"><span>🏕️</span><span className="hidden sm:inline">{sb.minigames}</span></span>,
      children: <MiniGamesPage />,
    },
    {
      key: 'teashop',
      label: <span className="flex items-center gap-1.5"><span>🍵</span><span className="hidden sm:inline">{sb.teashop}</span></span>,
      children: <TeaShopPage />,
    },
  ];

  return (
    <AppLayout showTopBar showSidebar className="p-3 sm:p-4">
      <div className="w-full">
        <Tabs
          items={tabItems}
          activeKey={activeTab}
          onChange={(key) => {
            playClick();
            setActiveTab(key as GameTab);
            if (key === 'combat') setPageAmbient('battle');
            else setPageAmbient('gamescreen');
          }}
          leafAnimation
        />
      </div>
      <Divider type="wave-yellow" />
      {/* Level-Up Celebration Modal */}
      {showLevelUp && (
        <Modal open title={gs.levelUpTitle} typewriter={false} footer={null} onClose={dismissLevelUp} width={480}>
          <motion.div className="text-center py-8" initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 200 }}>
            <motion.div className="text-7xl mb-4" animate={{ rotate: [0, 10, -10, 0], scale: [1, 1.2, 1] }} transition={{ duration: 1, repeat: Infinity }}>🌟</motion.div>
            <p className="text-2xl font-extrabold" style={{ color: '#f5c31c' }}>{gs.levelUpLevel.replace('{level}', String(chapter))}</p>
            <p className="text-sm mt-2" style={{ color: '#725d42' }}>
              {chapter === 2 ? gs.levelUpMsg2 : gs.levelUpMsg3}
            </p>
            <button onClick={() => { playResolve(); dismissLevelUp(); }} className="mt-6 px-8 py-3 rounded-full text-white font-extrabold border-2 border-[#2E7D32]"
              style={{ background: '#6fba2c', boxShadow: '0 4px 0 0 #2E7D32' }}>{gs.levelUpBtn}</button>
          </motion.div>
        </Modal>
      )}
    </AppLayout>
  );
}
