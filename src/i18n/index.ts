import { useLanguageStore } from '../stores/useLanguageStore';
import { getTranslations } from './translations';

export { getTranslations };

/** Returns the full translations object for the current language. */
export function useTranslations() {
  const language = useLanguageStore((s) => s.language);
  return getTranslations(language);
}
