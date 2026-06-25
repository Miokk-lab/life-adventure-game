import { useState, useEffect } from 'react';
import { Tabs, Divider } from 'animal-island-ui';
import type { TabItem } from 'animal-island-ui';
import AppLayout from '../layout/AppLayout';
import BattlePage from '../page-battle/BattlePage';
import TasksPage from '../page-tasks/TasksPage';
import MiniGamesPage from '../page-minigames/MiniGamesPage';
import TeaShopPage from '../page-teashop/TeaShopPage';
import { useGameStore } from '../../stores/useGameStore';
import { playClick } from '../../systems/soundEngine';
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
    </AppLayout>
  );
}
