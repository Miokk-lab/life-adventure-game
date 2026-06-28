import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { OnboardingState, OnboardingProgress, OnboardingStep } from '../types/onboarding';

interface OnboardingStore extends OnboardingState {
  // Actions
  initializeProgress: (userId: string) => void;
  markStepComplete: (step: OnboardingStep) => void;
  dismissTip: (tipId: string) => void;
  showTip: (tipId: string) => void;
  setTipLevel: (level: 'all' | 'important_only' | 'none') => void;
  toggleTips: (enabled: boolean) => void;
  resetOnboarding: () => void;
  setCompletedTutorial: (tutorialId: string) => void;
}

const getInitialProgress = (userId: string): OnboardingProgress => ({
  userId,
  completedStory: false,
  completedSteps: [],
  skipedTips: [],
  firstTimeViews: {
    menu: false,
    tasks: false,
    battle: false,
    teaHouse: false,
  },
  createdAt: new Date(),
  updatedAt: new Date(),
});

export const useOnboarding = create<OnboardingStore>()(
  persist(
    (set, get) => ({
      progress: getInitialProgress(''),
      visibleTips: [],
      completedTutorials: [],
      preferences: {
        showTips: true,
        tipLevel: 'all',
      },

      initializeProgress: (userId: string) => {
        const existing = get().progress;
        if (existing.userId !== userId) {
          set({
            progress: getInitialProgress(userId),
            visibleTips: [],
            completedTutorials: [],
          });
        }
      },

      markStepComplete: (step: OnboardingStep) => {
        set((state) => ({
          progress: {
            ...state.progress,
            completedSteps: [...new Set([...state.progress.completedSteps, step])],
            updatedAt: new Date(),
          },
        }));
      },

      dismissTip: (tipId: string) => {
        set((state) => ({
          progress: {
            ...state.progress,
            skipedTips: [...new Set([...state.progress.skipedTips, tipId])],
            updatedAt: new Date(),
          },
          visibleTips: state.visibleTips.filter((id) => id !== tipId),
        }));
      },

      showTip: (tipId: string) => {
        set((state) => ({
          visibleTips: [...new Set([...state.visibleTips, tipId])],
        }));
      },

      setTipLevel: (level: 'all' | 'important_only' | 'none') => {
        set((state) => ({
          preferences: {
            ...state.preferences,
            tipLevel: level,
          },
        }));
      },

      toggleTips: (enabled: boolean) => {
        set((state) => ({
          preferences: {
            ...state.preferences,
            showTips: enabled,
          },
        }));
      },

      setCompletedTutorial: (tutorialId: string) => {
        set((state) => ({
          completedTutorials: [...new Set([...state.completedTutorials, tutorialId])],
        }));
      },

      resetOnboarding: () => {
        const userId = get().progress.userId;
        set({
          progress: getInitialProgress(userId),
          visibleTips: [],
          completedTutorials: [],
          preferences: {
            showTips: true,
            tipLevel: 'all',
          },
        });
      },
    }),
    {
      name: 'onboarding-store',
      version: 1,
    }
  )
);
