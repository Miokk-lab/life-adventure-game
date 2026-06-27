import React, { useEffect } from 'react';
import { useGameStore } from './stores/useGameStore';
import { Cursor } from 'animal-island-ui';
import { AnimatePresence } from 'motion/react';
import AppLayout from './components/layout/AppLayout';
import LoginPage from './components/page-login/LoginPage';
import WorryPage from './components/page-worry/WorryPage';
import VoyagePage from './components/page-voyage/VoyagePage';
import AnalysisPage from './components/page-analysis/AnalysisPage';
import GameScreen from './components/game/GameScreen';
import VictoryPage from './components/page-victory/VictoryPage';
import LanguageSwitcher from './components/shared/LanguageSwitcher';
import { HelpCenterPage } from './components/pages/HelpCenterPage';
import { OnboardingTipManager } from './components/onboarding';
import { useOnboarding } from './stores/onboardingStore';

const TOP_LEVEL_PAGES: Record<string, React.ComponentType> = {
  login: LoginPage,
  worry: WorryPage,
  voyage: VoyagePage,
  analysis: AnalysisPage,
  gamescreen: GameScreen,
  battle: GameScreen,
  tasks: GameScreen,
  minigames: GameScreen,
  teashop: GameScreen,
  victory: VictoryPage,
  help: HelpCenterPage,
};

const GAME_PAGES = new Set(['gamescreen', 'battle', 'tasks', 'minigames', 'teashop']);

// Pages that get the AppLayout wrapper (top bar + background)
const LAYOUT_PAGES = new Set(['worry', 'voyage', 'analysis', 'victory', 'help']);

export default function App() {
  const currentPage = useGameStore((s) => s.currentPage);
  const PageComponent = TOP_LEVEL_PAGES[currentPage];
  const { initializeProgress } = useOnboarding();

  useEffect(() => {
    const userId = localStorage.getItem('userId') || 'anonymous';
    initializeProgress(userId);
  }, [initializeProgress]);

  if (!PageComponent) return null;

  // GameScreen handles its own layout internally (with sidebar)
  if (GAME_PAGES.has(currentPage)) {
    return (
      <Cursor>
        <PageComponent />
        <LanguageSwitcher />
      </Cursor>
    );
  }

  // Login page: no top bar
  if (currentPage === 'login') {
    return (
      <Cursor>
        <PageComponent />
        <LanguageSwitcher />
      </Cursor>
    );
  }

  // All other pages: wrapped in AppLayout with top bar
  return (
    <Cursor>
      <AppLayout showTopBar>
        <PageComponent />
      </AppLayout>
      <LanguageSwitcher />
    </Cursor>
  );
}
