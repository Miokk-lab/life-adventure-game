import { useState } from 'react';
import { Modal } from 'animal-island-ui';
import { motion } from 'motion/react';
import { playResolve } from '../../systems/soundEngine';

interface Props { title: string; description: string; petals: string[]; onComplete: () => void; onClose: () => void; }

export default function GratitudePetals({ title, description, petals, onComplete, onClose }: Props) {
  const [texts, setTexts] = useState<string[]>(new Array(petals.length).fill(''));
  const done = texts.every(t => t.trim().length > 0);

  return (
    <Modal open title={`🙏 ${title}`} footer={null} onClose={onClose} width={500}>
      <div className="flex flex-col items-center justify-center py-6 px-4 text-center w-full">
        <p className="text-sm mb-4" style={{ color: '#725d42' }}>{description}</p>
        <div className="flex justify-center gap-4 mb-4 flex-wrap">
          {petals.map((label, i) => (
            <motion.div key={i} whileHover={{ scale: 1.05 }}
              className="w-24 h-24 rounded-full flex flex-col items-center justify-center p-2 border-2 transition-all"
              style={{ borderColor: texts[i] ? '#f5c31c' : '#e8e2d6', background: texts[i] ? '#fff9c4' : '#fff' }}>
              <input value={texts[i]} onChange={e => { const n = [...texts]; n[i] = e.target.value; setTexts(n); }}
                placeholder={label} maxLength={30}
                className="w-full text-center text-[10px] font-bold bg-transparent outline-none"
                style={{ color: '#725d42' }} />
            </motion.div>
          ))}
        </div>
        <button onClick={() => { playResolve(); onComplete(); }} disabled={!done}
          className="px-6 py-3 rounded-full text-white font-extrabold border-2 disabled:opacity-40 transition-all"
          style={{ background: '#f5c31c', borderColor: '#dba90e', boxShadow: '0 4px 0 0 #dba90e' }}>
          💛 记录完毕
        </button>
      </div>
    </Modal>
  );
}
