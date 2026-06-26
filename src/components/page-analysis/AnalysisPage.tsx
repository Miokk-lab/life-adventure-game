import { useGameStore } from '../../stores/useGameStore';
import { useAdventureStore } from '../../stores/useAdventureStore';
import { Button, Card, Title } from 'animal-island-ui';
import { motion } from 'motion/react';

export default function AnalysisPage() {
  const navigateTo = useGameStore((s) => s.navigateTo);
  const hero = useAdventureStore((s) => s.hero);
  const monster = useAdventureStore((s) => s.monster);
  const cbtAnalysis = useAdventureStore((s) => s.cbtAnalysis);

  return (
    <div className="min-h-screen px-4 py-6" style={{ background: '#F8F5EB' }}>
      <div className="max-w-5xl mx-auto">
        {/* Narrative Typewriter */}
        <div className="text-center mb-8">
          <Title size="large" color="app-blue">岛屿心理诊所</Title>
          <p className="text-sm mt-2 mb-6" style={{ color: '#A08E75' }}>让我们一起来看看，你的烦恼背后藏着什么样的故事…</p>
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
                <span className="text-red-500 text-sm font-black">💀 待平复的焦虑伙伴</span>
                <h3 className="text-lg font-extrabold mt-1" style={{ color: '#C62828' }}>
                  {monster?.name ?? '未知心魔'}
                </h3>
                <span className="text-[10px] px-2 py-0.5 rounded-full border-2 border-[#725D42] bg-[#FFEAEA]"
                  style={{ color: '#C62828' }}>心魔</span>
              </div>
              <div className="flex justify-center my-4">
                <div className="w-32 h-32 rounded-full border-4 border-[#725D42] bg-[#F2EDE0] flex items-center justify-center overflow-hidden">
                  {monster?.imageUrl ? <img src={monster.imageUrl} alt={monster.name} className="w-full h-full object-cover" /> : <span className="text-6xl">👹</span>}
                </div>
              </div>
              <div className="space-y-2 max-h-[300px] overflow-y-auto">
                <div className="p-2 rounded-xl border-2 border-dashed border-[#C4B89E]">
                  <p className="text-[10px] font-black" style={{ color: '#A08E75' }}>攻击习性</p>
                  {(monster?.attacks ?? ['未知攻击模式']).map((a, i) => (
                    <p key={i} className="text-xs mt-0.5 break-words" style={{ color: '#725d42' }}>• {a}</p>
                  ))}
                </div>
                <div className="p-2 rounded-xl bg-[#E8F5E9]">
                  <p className="text-[10px] font-black" style={{ color: '#3A8D63' }}>弱点</p>
                  <p className="text-xs font-bold break-words" style={{ color: '#2E7D32' }}>
                    {monster?.story ?? '探索中…'}
                  </p>
                </div>
              </div>
              <p className="text-[9px] text-center mt-3 italic" style={{ color: '#A08E75' }}>
                每个心魔背后都藏着珍贵的品质
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
                <span className="text-[10px] font-black" style={{ color: '#A08E75' }}>📋 心理诊断卡</span>
                <h3 className="text-base font-extrabold mt-1" style={{ color: '#5D4037' }}>CBT一体两面分析</h3>
              </div>
              <div className="space-y-3 max-h-[400px] overflow-y-auto">
                {cbtAnalysis ? (() => {
                  const SECTION_STYLES = [
                    { bg: '#E8F5E9', border: '#4CAF50', icon: '✨', label: '看见力量' },
                    { bg: '#FFF8E1', border: '#FF9800', icon: '🔍', label: '识别陷阱' },
                    { bg: '#E3F2FD', border: '#2196F3', icon: '🌱', label: '小步行动' },
                  ];
                  const sections = cbtAnalysis.split('\n\n').filter(Boolean).slice(0, 3);
                  return sections.map((para, i) => {
                    const style = SECTION_STYLES[i] ?? SECTION_STYLES[0];
                    // Strip ①②③【label】 prefix
                    const body = para.replace(/^[①②③]【[^】]*】\s*/, '').trim();
                    return (
                      <div key={i} style={{ background: style.bg, border: `2px solid ${style.border}`, borderRadius: 16, padding: '10px 14px' }}>
                        <p style={{ fontWeight: 800, color: style.border, fontSize: 11, marginBottom: 4 }}>
                          {style.icon} {style.label}
                        </p>
                        <p style={{ fontSize: 12, lineHeight: 1.7, color: '#5D4037' }}>{body}</p>
                      </div>
                    );
                  });
                })() : (
                  <div className="p-3 text-center text-xs" style={{ color: '#9F927D' }}>
                    心理分析生成中…
                  </div>
                )}
              </div>
              <div className="text-center mt-3 pt-3 border-t border-[#FAF7EC]">
                <p className="text-[9px] italic" style={{ color: '#A08E75' }}>烦恼一体两面 · 正向品质探寻</p>
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
                <span className="text-[10px] font-black" style={{ color: '#A08E75' }}>🛡️ 温暖岛屿神气村民</span>
                <h3 className="text-lg font-extrabold mt-1" style={{ color: '#1565C0' }}>
                  {hero?.name ?? '未知英雄'}
                </h3>
                <span className="text-[10px] px-2 py-0.5 rounded-full border-2 border-[#725D42] bg-[#E3F2FD]"
                  style={{ color: '#1565C0' }}>
                  Lv.1 守护者
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
                  <p className="text-[10px] font-black" style={{ color: '#3A8D63' }}>特殊能力</p>
                  <p className="text-xs font-bold" style={{ color: '#2E7D32' }}>
                    {hero?.story?.slice(0, 80) ?? '未知'}
                  </p>
                </div>
                <div className="p-2 rounded-xl border-2 border-dashed border-[#C4B89E]">
                  <p className="text-xs italic text-center" style={{ color: '#5D4037' }}>
                    "{hero?.skills?.[0]?.description ?? '勇敢面对内心的阴影'}"
                  </p>
                </div>
              </div>
              <p className="text-[9px] text-center mt-3 italic" style={{ color: '#A08E75' }}>
                每个英雄都曾面对过自己的心魔
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
            ✨ 正式开启心灵大扫除！
          </Button>
        </motion.div>
      </div>
    </div>
  );
}
