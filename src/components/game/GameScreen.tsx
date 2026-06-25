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
import { playClick, playResolve } from '../../systems/soundEngine';
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

  // Sync external navigation to tabs
  useEffect(() => {
    const tab = PAGE_TO_TAB[currentPage];
    if (tab) setActiveTab(tab);
  }, [currentPage]);

  const tabItems: TabItem[] = [
    {
      key: 'combat',
      label: <span className="flex items-center gap-1.5"><span>⚔️</span><span className="hidden sm:inline">对决</span></span>,
      children: <BattlePage />,
    },
    {
      key: 'tasks',
      label: <span className="flex items-center gap-1.5"><span>📋</span><span className="hidden sm:inline">任务</span></span>,
      children: <TasksPage />,
    },
    {
      key: 'minigames',
      label: <span className="flex items-center gap-1.5"><span>🏕️</span><span className="hidden sm:inline">静心</span></span>,
      children: <MiniGamesPage />,
    },
    {
      key: 'teashop',
      label: <span className="flex items-center gap-1.5"><span>🍵</span><span className="hidden sm:inline">花茶</span></span>,
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
          }}
          leafAnimation
        />
      </div>
      <Divider type="wave-yellow" />
      {/* Level-Up Celebration Modal */}
      {showLevelUp && (
        <Modal open title="🎉 升级了！" typewriter={false} footer={null} onClose={dismissLevelUp} width={480}>
          <motion.div className="text-center py-8" initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 200 }}>
            <motion.div className="text-7xl mb-4" animate={{ rotate: [0, 10, -10, 0], scale: [1, 1.2, 1] }} transition={{ duration: 1, repeat: Infinity }}>🌟</motion.div>
            <p className="text-2xl font-extrabold" style={{ color: '#f5c31c' }}>升级到 Lv.{chapter}！</p>
            <p className="text-sm mt-2" style={{ color: '#725d42' }}>
              {chapter === 2 ? '解锁新技能！战斗力提升了！' : '达到最高等级！可以挑战最终Boss了！'}
            </p>
            <button onClick={() => { playResolve(); dismissLevelUp(); }} className="mt-6 px-8 py-3 rounded-full text-white font-extrabold border-2 border-[#2E7D32]"
              style={{ background: '#6fba2c', boxShadow: '0 4px 0 0 #2E7D32' }}>太棒了！</button>
          </motion.div>
        </Modal>
      )}
    </AppLayout>
  );
}
