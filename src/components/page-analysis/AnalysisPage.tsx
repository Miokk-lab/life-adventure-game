import { useGameStore } from '../../stores/useGameStore';
import { useAdventureStore } from '../../stores/useAdventureStore';
import { Button, Card, Title } from 'animal-island-ui';
import { motion } from 'motion/react';
import { useTranslations } from '../../i18n';

function extractNickname(name: string | null | undefined, fallback: string): string {
  if (!name) return fallback;
  return name.match(/「(.+?)」/)?.[1] ?? name;
}

export default function AnalysisPage() {
  const navigateTo = useGameStore((s) => s.navigateTo);
  const hero = useAdventureStore((s) => s.hero);
  const monster = useAdventureStore((s) => s.monster);
  const cbtAnalysis = useAdventureStore((s) => s.cbtAnalysis);
  const t = useTranslations().analysis;
  const monsterNickname = extractNickname(monster?.name, t.unknownMonster);
  const heroNickname = extractNickname(hero?.name, t.unknownHero);

  return (
    <div className="min-h-screen px-4 py-6" style={{ background: '#F8F5EB' }}>
      <div className="max-w-5xl mx-auto">
        {/* Narrative Typewriter */}
        <div className="text-center mb-8">
          <Title size="large" color="app-blue">{t.clinicTitle}</Title>
          <p className="text-sm mt-2 mb-6" style={{ color: '#A08E75' }}>{t.clinicSubtitle}</p>
        </div>

        {/* Bento Grid — 3 columns (ver4 RevealScreen pattern) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          {/* Left: Monster Card */}
          <motion.div
            className="lg:col-span-4"
            initial={{ x: -30, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.1, duration: 0.5 }}
          >
            <Card className="h-full rounded-[32px] p-5 shadow-[0_8px_0_0_#C4B89E] border-4 border-[#725D42]">
              <div className="text-center">
                <span className="text-red-500 text-sm font-black">{t.monsterLabel}</span>
                <h3 className="text-lg font-extrabold mt-1" style={{ color: '#C62828' }}>
                  {monsterNickname}
                </h3>
                <span className="text-[10px] px-2 py-0.5 rounded-full border-2 border-[#725D42] bg-[#FFEAEA]"
                  style={{ color: '#C62828' }}>{t.monsterTag}</span>
              </div>
              <div className="flex justify-center my-4">
                <div className="w-32 h-32 rounded-full border-4 border-[#725D42] bg-[#F2EDE0] flex items-center justify-center overflow-hidden">
                  {monster?.imageUrl ? <img src={monster.imageUrl} alt={monster.name} className="w-full h-full object-cover" /> : <span className="text-6xl">👹</span>}
                </div>
              </div>
              <div className="space-y-2 max-h-[300px] overflow-y-auto">
                <div className="p-2 rounded-xl border-2 border-dashed border-[#C4B89E]">
                  <p className="text-[10px] font-black" style={{ color: '#A08E75' }}>{t.attackHabits}</p>
                  {(monster?.attacks ?? [t.unknownAttack]).map((a, i) => (
                    <p key={i} className="text-xs mt-0.5 break-words" style={{ color: '#725d42' }}>• {a}</p>
                  ))}
                </div>
                <div className="p-2 rounded-xl bg-[#E8F5E9]">
                  <p className="text-[10px] font-black" style={{ color: '#3A8D63' }}>{t.weakness}</p>
                  <p className="text-xs font-bold break-words" style={{ color: '#2E7D32' }}>
                    {monster?.story ?? t.unknownStory}
                  </p>
                </div>
              </div>
              <p className="text-[9px] text-center mt-3 italic" style={{ color: '#A08E75' }}>
                {t.monsterQuote}
              </p>
            </Card>
          </motion.div>

          {/* Middle: Analysis Card */}
          <motion.div
            className="lg:col-span-4"
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.15, duration: 0.5 }}
          >
            <Card className="h-full rounded-[32px] p-5 shadow-[0_8px_0_0_#C4B89E] border-4 border-[#725D42]">
              <div className="text-center mb-4">
                <span className="text-[10px] font-black" style={{ color: '#A08E75' }}>{t.diagnosisCard}</span>
                <h3 className="text-base font-extrabold mt-1" style={{ color: '#5D4037' }}>{t.analysisTitle}</h3>
              </div>
              <div className="space-y-3 max-h-[480px] overflow-y-auto pr-1">
                {cbtAnalysis ? (() => {
                  const SECTION_STYLES = [
                    { bg: '#E8F5E9', border: '#4CAF50', headingColor: '#2E7D32', icon: '✨', label: t.cbtSections[0] },
                    { bg: '#FFF8E1', border: '#FF9800', headingColor: '#E65100', icon: '🔍', label: t.cbtSections[1] },
                    { bg: '#E3F2FD', border: '#2196F3', headingColor: '#1565C0', icon: '🌱', label: t.cbtSections[2] },
                  ];
                  const sections = cbtAnalysis.split('\n\n').filter(Boolean).slice(0, 3);
                  return sections.map((para, i) => {
                    const style = SECTION_STYLES[i] ?? SECTION_STYLES[0];
                    // Extract section label from ①②③【label】 prefix
                    const labelMatch = para.match(/^[①②③]【([^】]*)】\s*/);
                    const sectionLabel = labelMatch ? labelMatch[1] : style.label;
                    const body = para.replace(/^[①②③]【[^】]*】\s*/, '').trim();
                    // Split into lines; detect bullet lines
                    const lines = body.split('\n').filter(Boolean);
                    const isBullet = (line: string) => /^[·•\-–]|^\d+[、.]/.test(line.trim());
                    // Highlight 「quoted」 terms inline
                    const renderWithHighlights = (text: string) => {
                      const parts = text.split(/(「[^」]+」|【[^】]+】)/g);
                      return parts.map((part, j) =>
                        /^「|^【/.test(part)
                          ? <mark key={j} style={{ background: style.border + '22', color: style.headingColor, borderRadius: 3, padding: '0 2px', fontWeight: 700 }}>{part}</mark>
                          : <span key={j}>{part}</span>
                      );
                    };
                    const bulletLines = lines.filter(isBullet);
                    const paraLines = lines.filter(l => !isBullet(l));
                    return (
                      <div key={i} style={{ background: style.bg, border: `2px solid ${style.border}`, borderRadius: 16, padding: '12px 14px' }}>
                        {/* Section heading */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
                          <span style={{ width: 8, height: 8, borderRadius: '50%', background: style.border, flexShrink: 0, display: 'inline-block' }} />
                          <p style={{ fontWeight: 900, color: style.headingColor, fontSize: 14, margin: 0 }}>
                            {style.icon} {sectionLabel}
                          </p>
                        </div>
                        {/* Paragraph lines */}
                        {paraLines.map((line, j) => (
                          <p key={j} style={{ fontSize: 12, lineHeight: 1.8, color: '#5D4037', marginBottom: bulletLines.length > 0 ? 6 : 0 }}>
                            {renderWithHighlights(line)}
                          </p>
                        ))}
                        {/* Bullet list */}
                        {bulletLines.length > 0 && (
                          <ul style={{ margin: '4px 0 0 0', paddingLeft: 16, listStyle: 'none' }}>
                            {bulletLines.map((line, j) => (
                              <li key={j} style={{ fontSize: 12, lineHeight: 1.8, color: '#5D4037', display: 'flex', gap: 6, alignItems: 'flex-start' }}>
                                <span style={{ color: style.border, fontWeight: 700, flexShrink: 0, marginTop: 2 }}>▸</span>
                                <span>{renderWithHighlights(line.replace(/^[·•\-–]|\d+[、.]/, '').trim())}</span>
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    );
                  });
                })() : (
                  <div className="p-3 text-center text-xs" style={{ color: '#9F927D' }}>
                    {t.loadingAnalysis}
                  </div>
                )}
              </div>
              <div className="text-center mt-3 pt-3 border-t border-[#FAF7EC]">
                <p className="text-[9px] italic" style={{ color: '#A08E75' }}>{t.analysisFooter}</p>
              </div>
            </Card>
          </motion.div>

          {/* Right: Hero Card */}
          <motion.div
            className="lg:col-span-4"
            initial={{ x: 30, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <Card className="h-full rounded-[32px] p-5 shadow-[0_8px_0_0_#C4B89E] border-4 border-[#725D42]">
              <div className="text-center">
                <span className="text-[10px] font-black" style={{ color: '#A08E75' }}>{t.heroLabel}</span>
                <h3 className="text-lg font-extrabold mt-1" style={{ color: '#1565C0' }}>
                  {heroNickname}
                </h3>
                <span className="text-[10px] px-2 py-0.5 rounded-full border-2 border-[#725D42] bg-[#E3F2FD]"
                  style={{ color: '#1565C0' }}>
                  {t.heroTag}
                </span>
              </div>
              <div className="flex justify-center my-4">
                <div className="w-32 h-32 rounded-full border-4 border-[#725D42] bg-[#F2EDE0] flex items-center justify-center overflow-hidden">
                  {hero?.imageUrl ? <img src={hero.imageUrl} alt={hero.name} className="w-full h-full object-cover" /> : <span className="text-6xl">🧑‍🌾</span>}
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex flex-wrap gap-1">
                  {(hero?.skills ?? []).slice(0, 4).map((s, i) => (
                    <span key={i} className="px-2 py-0.5 rounded-full border-2 border-[#725D42] bg-[#FFEEA6] text-[9px] font-bold"
                      style={{ color: '#725d42' }}>
                      ★ {s.name}
                    </span>
                  ))}
                </div>
                <div className="p-2 rounded-xl bg-[#E8F5E9]">
                  <p className="text-[10px] font-black" style={{ color: '#3A8D63' }}>{t.specialAbility}</p>
                  <p className="text-xs font-bold" style={{ color: '#2E7D32' }}>
                    {hero?.story?.slice(0, 80) ?? t.unknownStory}
                  </p>
                </div>
                <div className="p-2 rounded-xl border-2 border-dashed border-[#C4B89E]">
                  <p className="text-xs italic text-center" style={{ color: '#5D4037' }}>
                    "{hero?.skills?.[0]?.description ?? t.unknownSkill}"
                  </p>
                </div>
              </div>
              <p className="text-[9px] text-center mt-3 italic" style={{ color: '#A08E75' }}>
                {t.heroQuote}
              </p>
            </Card>
          </motion.div>
        </div>

        {/* CTA */}
        <motion.div
          className="text-center mt-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          <Button type="primary" size="large" onClick={() => navigateTo('gamescreen')}>
            {t.startBtn}
          </Button>
        </motion.div>
      </div>
    </div>
  );
}
