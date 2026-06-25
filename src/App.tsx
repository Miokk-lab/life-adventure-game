import React from 'react';
import { useGameStore } from './stores/useGameStore';
import { Cursor } from 'animal-island-ui';
import { AnimatePresence } from 'motion/react';
import LoginPage from './components/page-login/LoginPage';
import WorryPage from './components/page-worry/WorryPage';
import VoyagePage from './components/page-voyage/VoyagePage';
import AnalysisPage from './components/page-analysis/AnalysisPage';
import BattlePage from './components/page-battle/BattlePage';
import TasksPage from './components/page-tasks/TasksPage';
import MiniGamesPage from './components/page-minigames/MiniGamesPage';
import TeaShopPage from './components/page-teashop/TeaShopPage';
import VictoryPage from './components/page-victory/VictoryPage';

const PAGES: Record<string, React.ComponentType> = {
  login: LoginPage,
  worry: WorryPage,
  voyage: VoyagePage,
  analysis: AnalysisPage,
  battle: BattlePage,
  tasks: TasksPage,
  minigames: MiniGamesPage,
  teashop: TeaShopPage,
  victory: VictoryPage,
};

export default function App() {
  const currentPage = useGameStore((s) => s.currentPage);
  const PageComponent = PAGES[currentPage];

  return (
    <Cursor>
      <div className="min-h-screen bg-[#f8f8f0]">
        <AnimatePresence mode="wait">
          {PageComponent && <PageComponent key={currentPage} />}
        </AnimatePresence>
      </div>
    </Cursor>
  );
}
