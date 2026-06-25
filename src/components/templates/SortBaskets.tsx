import { useState } from 'react';
import { Modal } from 'animal-island-ui';
import { motion, AnimatePresence } from 'motion/react';
import { playCollect, playResolve, playHurt } from '../../systems/soundEngine';

interface Props { title: string; description: string; items: { text: string; basket: string }[]; baskets: { key: string; label: string; emoji: string }[]; onComplete: () => void; onClose: () => void; }

export default function SortBaskets({ title, description, items, baskets, onComplete, onClose }: Props) {
  const [idx, setIdx] = useState(0);
  const [done, setDone] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [status, setStatus] = useState<'sorting'|'correct'|'wrong'>('sorting');
  const current = items[idx];

  const handleSort = (basket: string) => {
    if (!current) return;
    if (basket === current.basket) {
      playCollect();
      setStatus('correct');
      setFeedback(`✅ 正确！${current.text} 属于「${baskets.find(b=>b.key===basket)?.label}」`);
      setTimeout(() => {
        if (idx + 1 >= items.length) { setDone(true); playResolve(); }
        else { setIdx(i => i + 1); setStatus('sorting'); setFeedback(''); }
      }, 1200);
    } else {
      playHurt();
      setStatus('wrong');
      setFeedback(`❌ 再想想？「${current.text}」应该放在哪里呢？`);
      setTimeout(() => { setStatus('sorting'); setFeedback(''); }, 1000);
    }
  };

  return (
    <Modal open title={`🧺 ${title}`} footer={null} onClose={onClose} width={520}>
      <div className="flex flex-col items-center justify-center py-6 px-4 text-center w-full">
        <p className="text-sm mb-4" style={{ color: '#725d42' }}>{description}</p>
        {!done ? (
          <>
            <motion.div key={idx} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="p-4 rounded-2xl border-2 mb-4 w-full max-w-sm"
              style={{ borderColor: status === 'correct' ? '#6fba2c' : status === 'wrong' ? '#e05a5a' : '#e8e2d6', background: '#fdfaf3' }}>
              <p className="text-xs font-bold mb-1" style={{ color: '#9f927d' }}>第 {idx+1}/{items.length} 项</p>
              <p className="text-lg font-extrabold" style={{ color: '#725d42' }}>{current?.text}</p>
            </motion.div>
            {feedback && <p className="text-xs font-bold mb-3" style={{ color: status === 'correct' ? '#6fba2c' : '#e05a5a' }}>{feedback}</p>}
            <div className="flex gap-3 flex-wrap justify-center">
              {baskets.map(b => (
                <button key={b.key} onClick={() => handleSort(b.key)}
                  className="px-4 py-3 rounded-2xl border-2 font-extrabold text-sm transition-all hover:scale-105 active:scale-95"
                  style={{ borderColor: '#725D42', background: '#fff', boxShadow: '0 3px 0 0 #C4B89E', color: '#725d42' }}>
                  {b.emoji} {b.label}
                </button>
              ))}
            </div>
          </>
        ) : (
          <div className="text-center">
            <p className="text-2xl mb-2">🌾</p>
            <p className="text-lg font-extrabold" style={{ color: '#6fba2c' }}>全部分类完成！</p>
            <button onClick={onComplete} className="mt-4 px-6 py-3 rounded-full text-white font-extrabold border-2 border-[#2E7D32]"
              style={{ background: '#6fba2c', boxShadow: '0 4px 0 0 #2E7D32' }}>领取奖励 ✨</button>
          </div>
        )}
      </div>
    </Modal>
  );
}
