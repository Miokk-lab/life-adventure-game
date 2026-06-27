import { useState, useRef, useCallback } from 'react';
import { useGameStore } from '../../stores/useGameStore';
import { Button, Card, Footer } from 'animal-island-ui';
import { motion } from 'motion/react';
import { worryTypeList } from '../../constants/worryTypes';
import { MAX_WORRY_LENGTH } from '../../constants';
import type { WorryCategory } from '../../types';
import { useTranslations } from '../../i18n';
import { useLanguageStore } from '../../stores/useLanguageStore';
import { useAdventureStore } from '../../stores/useAdventureStore';
import { getOfflinePreset, VICTORY_VIDEO_MAP } from '../../data/presets';

const SPEECH_LANG: Record<string, string> = { zh: 'zh-CN', en: 'en-US', ja: 'ja-JP' };

export default function WorryPage() {
  const setWorryText = useGameStore((s) => s.setWorryText);
  const setWorryType = useGameStore((s) => s.setWorryType);
  const navigateTo = useGameStore((s) => s.navigateTo);
  const setAdventureData = useAdventureStore((s) => s.setAdventureData);
  const setTasks = useAdventureStore((s) => s.setTasks);
  const saveTaskId = useAdventureStore((s) => s.setTaskId);

  const [text, setText] = useState('');
  const [category, setCategory] = useState<WorryCategory>('work_stress');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<any>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const tr = useTranslations();
  const t = tr.worry;
  const wt = tr.worryTypes;
  const language = useLanguageStore((s) => s.language);

  const radioOptions = worryTypeList.map((w) => ({ label: `${w.emoji} ${wt[w.key].label}`, value: w.key }));

  const startListening = useCallback(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) { alert(t.voiceUnsupported); return; }

    const recognition = new SpeechRecognition();
    recognition.lang = SPEECH_LANG[language] ?? 'zh-CN';
    recognition.interimResults = true;
    recognition.continuous = false;
    recognitionRef.current = recognition;

    recognition.onresult = (event: any) => {
      let newFinal = '';
      for (const r of event.results) {
        if (r.isFinal) newFinal += r[0].transcript;
      }
      if (newFinal) {
        setText(prev => (prev + newFinal).slice(0, MAX_WORRY_LENGTH));
      }
    };
    recognition.onend = () => { setIsListening(false); };
    recognition.onerror = () => { setIsListening(false); };

    setIsListening(true);
    recognition.start();
  }, [language, t.voiceUnsupported]);

  const stopListening = useCallback(() => {
    if (recognitionRef.current) { recognitionRef.current.stop(); setIsListening(false); }
  }, []);

  const handleSubmit = () => {
    if (!text.trim()) return;
    setIsSubmitting(true);
    setWorryText(text.trim());
    setWorryType(category);
    setTimeout(() => { setIsSubmitting(false); navigateTo('voyage'); }, 800);
  };

  const handleOfflineSubmit = () => {
    const finalWorryText = text.trim() || wt[category]?.label || 'Offline Play';
    setWorryText(finalWorryText);
    setWorryType(category);
    setIsSubmitting(true);

    const preset = getOfflinePreset(finalWorryText, category, language);
    setAdventureData({
      hero: preset.hero,
      monster: preset.monster,
      cbtAnalysis: preset.cbtAnalysis,
      victoryText: preset.victoryText,
      victoryVideoUrl: VICTORY_VIDEO_MAP[category as string] || '',
      battleSkills: preset.skills,
    });
    setTasks(preset.tasks);
    saveTaskId('offline');

    setTimeout(() => {
      setIsSubmitting(false);
      navigateTo('analysis');
    }, 800);
  };

  return (
    <div className="w-full px-4 py-6">
      <Card type="dashed" className="mb-6 max-w-2xl mx-auto">
        <div className="text-center mb-4 p-3 rounded-2xl" style={{ background: 'rgba(25,200,185,0.08)' }}>
          <h2 className="text-lg font-extrabold" style={{ color: '#725d42' }}>📜 {t.title}</h2>
          <p className="text-xs mt-1" style={{ color: '#9f927d' }}>{t.subtitle}</p>
        </div>
        <textarea ref={textareaRef} value={text} onChange={(e) => setText(e.target.value.slice(0, MAX_WORRY_LENGTH))}
          placeholder={t.placeholder} rows={6}
          className="w-full p-4 rounded-2xl border-2 resize-none text-sm leading-relaxed"
          style={{ borderColor: '#e8dcc8', background: '#fdfaf3', color: '#725d42', fontFamily: '"Nunito", "Noto Sans SC", sans-serif' }} />
        <div className="flex justify-between items-center mt-2">
          <button onClick={isListening ? stopListening : startListening}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-bold border-2 transition-all ${isListening ? 'animate-pulse' : ''}`}
            style={{ borderColor: isListening ? '#e05a5a' : '#e8e2d6', background: isListening ? '#fde8e8' : 'transparent', color: isListening ? '#e05a5a' : '#9f927d' }}>
            🎙️ {isListening ? t.recording : t.voiceInput}
          </button>
          <span className="text-xs font-semibold" style={{ color: text.length >= MAX_WORRY_LENGTH ? '#e05a5a' : '#c4b89e' }}>
            {text.length}/{MAX_WORRY_LENGTH}
          </span>
        </div>
      </Card>

      <Card color="app-yellow" className="mb-6 max-w-2xl mx-auto">
        <h3 className="text-sm font-extrabold mb-3 text-center" style={{ color: '#725d42' }}>{t.categoryLabel}</h3>
        <div className="grid grid-cols-4 gap-2">
          {worryTypeList.map((w) => (
            <motion.button key={w.key} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
              onClick={() => setCategory(w.key)}
              className="flex flex-col items-center gap-1 p-2 rounded-xl border-2 transition-all"
              style={{
                borderColor: category === w.key ? w.color : '#e8e2d6',
                background: category === w.key ? `${w.color}15` : '#fff',
                boxShadow: category === w.key ? `0 0 8px ${w.color}40` : 'none',
              }}>
              <span className="text-2xl">{w.emoji}</span>
              <span className="text-[10px] font-extrabold leading-tight text-center" style={{ color: '#725d42' }}>
                {wt[w.key].label}
              </span>
              <span className="text-[8px] font-bold" style={{ color: w.color }}>{wt[w.key].stampLabel}</span>
            </motion.button>
          ))}
        </div>
      </Card>

      <div className="text-center mb-8">
        <motion.div
          className="flex justify-center items-center gap-4 flex-wrap"
          animate={isSubmitting ? { scale: 0.8, opacity: 0.5, y: 40 } : { scale: 1, opacity: 1, y: 0 }}
        >
          <Button type="primary" size="large" onClick={handleSubmit} disabled={!text.trim() || isSubmitting}>
            {t.submitBtn}
          </Button>
          <Button type="default" size="large" onClick={handleOfflineSubmit} disabled={isSubmitting}>
            {t.offlineBtn}
          </Button>
        </motion.div>
      </div>

      <Footer type="sea" seamless />
    </div>
  );
}
