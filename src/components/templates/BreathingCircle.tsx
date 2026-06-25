import { useState, useEffect, useRef } from 'react';
import { Modal } from 'animal-island-ui';
import { motion } from 'motion/react';
import { playCollect, playResolve } from '../../systems/soundEngine';

interface Props { title: string; description: string; themeText: string; onComplete: () => void; onClose: () => void; }

export default function BreathingCircle({ title, description, themeText, onComplete, onClose }: Props) {
  const [phase, setPhase] = useState<'inhale'|'hold'|'exhale'|'rest'>('inhale');
  const [sec, setSec] = useState(4);
  const [cycles, setCycles] = useState(0);
  const [done, setDone] = useState(false);
  const phaseRef = useRef(phase); phaseRef.current = phase;
  const cyclesRef = useRef(0); cyclesRef.current = cycles;

  useEffect(() => {
    const t = setInterval(() => {
      setSec(p => {
        if (p <= 1) {
          const cp = phaseRef.current;
          if (cp === 'inhale') { setPhase('hold'); return 4; }
          if (cp === 'hold') { setPhase('exhale'); playCollect(); return 4; }
          if (cp === 'exhale') {
            const nc = cyclesRef.current + 1; setCycles(nc); cyclesRef.current = nc;
            if (nc >= 3) { setDone(true); playResolve(); clearInterval(t); return 0; }
            setPhase('rest'); return 2;
          }
          setPhase('inhale'); return 4;
        }
        return p - 1;
      });
    }, 1000);
    return () => clearInterval(t);
  }, []);

  const scale = phase === 'inhale' ? 1.5 : phase === 'hold' ? 1.5 : phase === 'exhale' ? 1.0 : 1.0;
  const color = phase === 'inhale' ? '#19C8B9' : phase === 'hold' ? '#8CC63F' : phase === 'exhale' ? '#FF9F1C' : '#c4b89e';
  const labels: Record<string, string> = { inhale: '🌬️ 吸气', hold: '🧘 屏气', exhale: '🍃 呼气', rest: '☁️ 休息' };

  return (
    <Modal open title={`🍃 ${title}`} footer={null} onClose={onClose} width={480}>
      <div className="flex flex-col items-center justify-center py-6 px-4 text-center w-full">
        <p className="text-sm mb-2" style={{ color: '#725d42' }}>{description}</p>
        <p className="text-xs mb-4 italic" style={{ color: '#9f927d' }}>{themeText}</p>
        {!done ? (
          <>
            <div className="relative w-32 h-32 flex items-center justify-center mb-4">
              <motion.div className="absolute inset-0 rounded-full border-4 border-dashed" animate={{ scale: [1, 1.25, 1] }} transition={{ duration: 4, repeat: Infinity }} style={{ borderColor: color }} />
              <motion.div className="w-20 h-20 rounded-full flex items-center justify-center transition-all duration-1000" animate={{ scale }} style={{ background: `${color}20`, border: `3px solid ${color}` }}>
                <span className="text-3xl font-black" style={{ color }}>{sec}</span>
              </motion.div>
            </div>
            <p className="text-sm font-extrabold" style={{ color }}>{labels[phase]}</p>
            <div className="flex gap-1 mt-3">{Array.from({length:3}).map((_,i) => <span key={i}>{i < cycles ? '✅' : '⭕'}</span>)}</div>
          </>
        ) : (
          <div className="text-center">
            <p className="text-2xl mb-2">🎁</p>
            <p className="text-lg font-extrabold" style={{ color: '#6fba2c' }}>深呼吸完成！</p>
            <button onClick={onComplete} className="mt-4 px-6 py-3 rounded-full text-white font-extrabold border-2 border-[#2E7D32]"
              style={{ background: '#6fba2c', boxShadow: '0 4px 0 0 #2E7D32' }}>领取奖励 ✨</button>
          </div>
        )}
      </div>
    </Modal>
  );
}
