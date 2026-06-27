import { useState } from 'react';
import { Modal, Footer } from 'animal-island-ui';
import { motion } from 'motion/react';
import { playResolve } from '../../systems/soundEngine';
import { useTranslations } from '../../i18n';

interface Props { title: string; description: string; placeholder: string; onComplete: () => void; onClose: () => void; }

export default function LetterWrite({ title, description, placeholder, onComplete, onClose }: Props) {
  const [text, setText] = useState('');
  const [sent, setSent] = useState(false);
  const tr = useTranslations().templates;

  const handleSend = () => {
    if (!text.trim()) return;
    playResolve(); setSent(true);
  };

  return (
    <Modal open title={`✍️ ${title}`} footer={null} typewriter={false} onClose={onClose} width={520}>
      <div className="flex flex-col items-center justify-center py-6 px-4 text-center w-full">
        <p className="text-sm mb-4" style={{ color: '#725d42' }}>{description}</p>
        {!sent ? (
          <>
            <div className="w-full max-w-sm p-4 rounded-2xl mb-3" style={{ background: '#F5F0E0', border: '2px dashed #8B7355' }}>
              <textarea value={text} onChange={e => setText(e.target.value)}
                placeholder={placeholder} rows={5}
                className="w-full bg-transparent resize-none text-sm leading-relaxed outline-none"
                style={{ color: '#5D4037', fontFamily: '"Nunito", "Noto Sans SC", serif' }} />
            </div>
            <p className="text-xs mb-3" style={{ color: '#c4b89e' }}>{text.length} 字</p>
            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={handleSend} disabled={!text.trim()}
              className="px-6 py-3 rounded-full text-white font-extrabold border-2 disabled:opacity-40"
              style={{ background: '#19c8b9', borderColor: '#11a89b', boxShadow: '0 4px 0 0 #11a89b' }}>
              {tr.letterSendBtn}
            </motion.button>
          </>
        ) : (
          <div className="text-center">
            <motion.div animate={{ x: [0, 50, -20, 0], opacity: [1, 0.5, 1] }} transition={{ duration: 1.5 }}
              className="text-2xl mb-2">📬→🌳</motion.div>
            <p className="text-lg font-extrabold" style={{ color: '#6fba2c' }}>{tr.letterSent}</p>
            <button onClick={onComplete} className="mt-4 px-6 py-3 rounded-full text-white font-extrabold border-2 border-[#2E7D32]"
              style={{ background: '#6fba2c', boxShadow: '0 4px 0 0 #2E7D32' }}>{tr.rewardBtn}</button>
          </div>
        )}
      </div>
      <Footer type="sea" seamless />
    </Modal>
  );
}
