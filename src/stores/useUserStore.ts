import { create } from 'zustand';
import type { UserProfile } from '../types';

interface UserState {
  user: UserProfile | null;
  isAuthReady: boolean;

  initialize: () => void;
  setUser: (profile: UserProfile) => void;
  setAvatar: (avatarUrl: string) => void;
  signOut: () => void;
}

export const useUserStore = create<UserState>((set) => ({
  user: null,
  isAuthReady: false,

  initialize: () => {
    // TODO: wire Supabase onAuthStateChange
    set({ isAuthReady: true });
  },

  setUser: (profile) => set({ user: profile, isAuthReady: true }),

  setAvatar: (avatarUrl) =>
    set((s) => ({
      user: s.user ? { ...s.user, avatarUrl } : null,
    })),

  signOut: () => set({ user: null }),
}));
