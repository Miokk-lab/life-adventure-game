import { useState, useEffect, useRef } from 'react';
import { Modal } from 'animal-island-ui';
import { motion } from 'motion/react';
import { playResolve } from '../../systems/soundEngine';

interface Props { title: string; description: string; themeText: string; duration?: number; onComplete: () => void; onClose: () => void; }

export default function AutoTimer({ title, description, themeText, duration = 60, onComplete, onClose }: Props) {
  const [sec, setSec] = useState(duration);
  const [running, setRunning] = useState(false);
  const [done, setDone] = useState(false);
  const intRef = useRef<ReturnType<typeof setInterval>>();

  const start = () => {
    setRunning(true);
    intRef.current = setInterval(() => {
      setSec(s => { if (s <= 1) { clearInterval(intRef.current); setDone(true); playResolve(); return 0; } return s - 1; });
    }, 1000);
  };

  useEffect(() => () => clearInterval(intRef.current), []);

  return (
    <Modal open title={`🧘 ${title}`} footer={null} typewriter={false} onClose={onClose} width={480}>
      <div className="flex flex-col items-center justify-center py-6 px-4 text-center w-full">
        <p className="text-sm mb-2" style={{ color: '#725d42' }}>{description}</p>
        <p className="text-xs mb-4 italic" style={{ color: '#9f927d' }}>{themeText}</p>
        {!done ? (
          <>
            <motion.div className="text-6xl mb-4"
              animate={running ? { rotate: [0, 10, -10, 0], scale: [1, 1.05, 1] } : {}}
              transition={{ duration: 2, repeat: Infinity }}>🧘</motion.div>
            <p className="text-3xl font-black mb-4" style={{ color: '#6fba2c' }}>{sec}s</p>
            {!running ? (
              <button onClick={start} className="px-6 py-3 rounded-full text-white font-extrabold border-2 transition-all hover:scale-105"
                style={{ background: '#6fba2c', borderColor: '#2E7D32', boxShadow: '0 4px 0 0 #2E7D32' }}>
                ▶️ 开始 {duration}秒
              </button>
            ) : (
              <p className="text-sm font-bold animate-pulse" style={{ color: '#9f927d' }}>自动倒计时中…</p>
            )}
          </>
        ) : (
          <div className="text-center">
            <p className="text-2xl mb-2">✨</p>
            <p className="text-lg font-extrabold" style={{ color: '#6fba2c' }}>完成！</p>
            <button onClick={onComplete} className="mt-4 px-6 py-3 rounded-full text-white font-extrabold border-2 border-[#2E7D32]"
              style={{ background: '#6fba2c', boxShadow: '0 4px 0 0 #2E7D32' }}>领取奖励 ✨</button>
          </div>
        )}
      </div>
    </Modal>
  );
}
