import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type Language = 'zh' | 'en' | 'ja';

const CYCLE: Record<Language, Language> = { zh: 'en', en: 'ja', ja: 'zh' };
export const LANG_LABELS: Record<Language, string> = { zh: '中', en: 'EN', ja: '日' };

interface LanguageStore {
  language: Language;
  setLanguage: (lang: Language) => void;
  cycleLanguage: () => void;
}

export const useLanguageStore = create<LanguageStore>()(
  persist(
    (set, get) => ({
      language: 'zh',
      setLanguage: (lang) => set({ language: lang }),
      cycleLanguage: () => set({ language: CYCLE[get().language] }),
    }),
    { name: 'language' },
  ),
);
