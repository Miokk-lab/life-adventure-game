import { useState } from 'react';
import { Modal } from 'animal-island-ui';
import { motion } from 'motion/react';
import { playCollect, playResolve } from '../../systems/soundEngine';

interface Props { title: string; description: string; themeText: string; sipCount?: number; onComplete: () => void; onClose: () => void; }

export default function WaterDrink({ title, description, themeText, sipCount = 5, onComplete, onClose }: Props) {
  const [sips, setSips] = useState(0);
  const done = sips >= sipCount;

  const handleSip = () => { playCollect(); setSips(s => Math.min(s + 1, sipCount)); };

  return (
    <Modal open title={`💧 ${title}`} footer={null} onClose={onClose} width={460}>
      <div className="flex flex-col items-center justify-center py-6 px-4 text-center w-full">
        <p className="text-sm mb-2" style={{ color: '#725d42' }}>{description}</p>
        <p className="text-xs mb-4 italic" style={{ color: '#9f927d' }}>{themeText}</p>
        {/* Cup */}
        <div className="relative w-20 h-28 mx-auto mb-4 rounded-b-2xl border-4 border-[#725D42] overflow-hidden bg-white/50">
          <motion.div className="absolute bottom-0 left-0 right-0"
            animate={{ height: `${(sips / sipCount) * 100}%` }}
            style={{ background: 'linear-gradient(180deg, #7ab8f5, #5b9bd5)', transition: 'height 0.3s' }} />
        </div>
        <p className="text-lg font-extrabold mb-4" style={{ color: '#5b9bd5' }}>
          {done ? '🎉 喝完啦！' : `${sips}/${sipCount} 口`}
        </p>
        {!done ? (
          <button onClick={handleSip}
            className="px-6 py-3 rounded-full text-white font-extrabold border-2 transition-all hover:scale-105 active:scale-95"
            style={{ background: '#5b9bd5', borderColor: '#3b7bc5', boxShadow: '0 4px 0 0 #3b7bc5' }}>
            🥤 喝一口
          </button>
        ) : (
          <button onClick={() => { playResolve(); onComplete(); }}
            className="px-6 py-3 rounded-full text-white font-extrabold border-2 border-[#2E7D32]"
            style={{ background: '#6fba2c', boxShadow: '0 4px 0 0 #2E7D32' }}>
            ✅ 完成！领取奖励
          </button>
        )}
      </div>
    </Modal>
  );
}
