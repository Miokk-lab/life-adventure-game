import { create } from 'zustand';
import type { GamePage, GamePhase, WorryCategory } from '../types';

interface GameState {
  currentPage: GamePage;
  previousPage: GamePage | null;
  gamePhase: GamePhase;
  worryText: string;
  worryType: WorryCategory | null;
  adventureId: string | null;

  navigateTo: (page: GamePage) => void;
  setWorryText: (text: string) => void;
  setWorryType: (type: WorryCategory) => void;
  setAdventureId: (id: string) => void;
  setGamePhase: (phase: GamePhase) => void;
}

export const useGameStore = create<GameState>((set) => ({
  currentPage: 'login',
  previousPage: null,
  gamePhase: 'idle',
  worryText: '',
  worryType: null,
  adventureId: null,

  navigateTo: (page) =>
    set((s) => ({ previousPage: s.currentPage, currentPage: page })),

  setWorryText: (text) => set({ worryText: text }),

  setWorryType: (type) => set({ worryType: type }),

  setAdventureId: (id) => set({ adventureId: id }),

  setGamePhase: (phase) => set({ gamePhase: phase }),
}));
