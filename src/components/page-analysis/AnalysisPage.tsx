import { useGameStore } from '../../stores/useGameStore';
import { useAdventureStore } from '../../stores/useAdventureStore';
import { Button, Card, Title, Typewriter } from 'animal-island-ui';
import { motion } from 'motion/react';
import ItemIcon from '../shared/ItemIcon';

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
          <Title size="large" color="app-blue">傅达的岛屿心理特展厅</Title>
          <p className="text-sm mt-2 mb-4" style={{ color: '#A08E75' }}>让我们一起来看看，你的烦恼背后藏着什么样的故事…</p>
          {cbtAnalysis && (
            <Card className="inline-block max-w-2xl">
              <Typewriter speed={40}>
                <p className="text-sm leading-relaxed italic" style={{ color: '#725d42' }}>
                  "{cbtAnalysis.slice(0, 200)}{cbtAnalysis.length > 200 && '…'}"
                </p>
              </Typewriter>
            </Card>
          )}
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
                  style={{ color: '#C62828' }}>
                  心魔
                </span>
              </div>
              <div className="flex justify-center my-4">
                <div className="w-32 h-32 rounded-full border-4 border-[#725D42] bg-[#F2EDE0] flex items-center justify-center overflow-hidden">
                  <ItemIcon emoji="👹" size={80} />
                </div>
              </div>
              <div className="space-y-2">
                <div className="p-2 rounded-xl border-2 border-dashed border-[#C4B89E]">
                  <p className="text-[10px] font-black" style={{ color: '#A08E75' }}>攻击习性</p>
                  {(monster?.attacks ?? ['未知攻击模式']).map((a, i) => (
                    <p key={i} className="text-xs mt-0.5" style={{ color: '#725d42' }}>• {a.length > 60 ? a.slice(0, 57) + '…' : a}</p>
                  ))}
                </div>
                <div className="p-2 rounded-xl bg-[#E8F5E9]">
                  <p className="text-[10px] font-black" style={{ color: '#3A8D63' }}>弱点</p>
                  <p className="text-xs font-bold" style={{ color: '#2E7D32' }}>
                    {monster?.story?.slice(0, 120) ?? '探索中…'}
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
                <span className="text-[10px] font-black" style={{ color: '#A08E75' }}>📋 心智松土谱图</span>
                <h3 className="text-base font-extrabold mt-1" style={{ color: '#5D4037' }}>心结溯源剖析</h3>
                <div className="flex justify-center gap-0.5 mt-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <span key={i}>{i < 3 ? '⭐' : '☆'}</span>
                  ))}
                </div>
              </div>
              <div className="space-y-3">
                <div>
                  <p className="text-[10px] font-black flex items-center gap-1" style={{ color: '#E57373' }}>
                    <span className="w-2 h-2 rounded-full bg-red-400" /> 外部环境
                  </p>
                  <p className="text-xs ml-3" style={{ color: '#725d42' }}>
                    {monster?.attacks?.[1] ?? '环境因素分析中…'}
                  </p>
                </div>
                <div className="border-t border-dashed border-[#C4B89E]" />
                <div>
                  <p className="text-[10px] font-black flex items-center gap-1" style={{ color: '#FF9F1C' }}>
                    <span className="w-2 h-2 rounded-full bg-orange-400" /> 内心原因
                  </p>
                  <p className="text-xs ml-3" style={{ color: '#725d42' }}>
                    {monster?.attacks?.[2] ?? '内心因素分析中…'}
                  </p>
                </div>
                <div className="border-t border-dashed border-[#C4B89E]" />
                <div>
                  <p className="text-[10px] font-black flex items-center gap-1" style={{ color: '#3A8D63' }}>
                    🔍 核心挑战
                  </p>
                  <p className="text-xs font-bold ml-3" style={{ color: '#2E7D32' }}>
                    {cbtAnalysis?.slice(0, 100) ?? '探索中…'}
                  </p>
                </div>
              </div>
              <div className="text-center mt-3 pt-3 border-t border-[#FAF7EC]">
                <p className="text-[9px] italic" style={{ color: '#A08E75' }}>烦恼一体两面 · CBT视角</p>
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
                  <ItemIcon emoji="🧑‍🌾" size={80} />
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
