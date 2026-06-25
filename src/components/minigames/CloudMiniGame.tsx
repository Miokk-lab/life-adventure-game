import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Wind } from "lucide-react";
import { Modal } from "animal-island-ui";
import { playCollect, playClick, playResolve, playHurt } from "../../systems/soundEngine";
import MiniGameCompletion from "./MiniGameCompletion";

interface CloudMiniGameProps {
  taskTitle: string;
  taskDescription: string;
  onComplete: () => void;
  onClose: () => void;
}

export default function CloudMiniGame({
  taskTitle,
  taskDescription,
  onComplete,
  onClose,
}: CloudMiniGameProps) {
  const [thought, setThought] = useState("");
  const [isBlowing, setIsBlowing] = useState(false);
  const [isFinished, setIsFinished] = useState(false);

  const handleBlowAway = () => {
    if (!thought.trim()) {
      playHurt();
      alert("请先对白云倾吐那些让你退缩的杂念，才能进行微风吹散噢~");
      return;
    }
    playCollect();
    setIsBlowing(true);
    setTimeout(() => {
      setIsFinished(true);
      playResolve();
    }, 2000);
  };

  return (
    <Modal
      open={true}
      title={`☁️ 杂念浮云消散法 - 【${taskTitle}】`}
      onClose={() => { if (!isFinished) { playHurt(); onClose(); } }}
      typewriter={false}
      footer={null}
      width={520}
    >
      <div className="text-center">
        <p className="text-xs text-[#A08E75] px-4 leading-relaxed mb-6">
          "{taskDescription}"
        </p>

        {!isFinished ? (
          <div className="space-y-6 py-2">
            <AnimatePresence>
              {!isBlowing ? (
                <motion.div
                  initial={{ y: 0 }}
                  animate={{ y: [-6, 6, -6] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                  className="mx-auto w-full max-w-xs p-6 bg-[#FCFBF4] border-4 border-dashed border-[#725D42] rounded-3xl shadow-sm relative flex flex-col items-center gap-3"
                >
                  <div className="text-4xl">☁️</div>
                  <span className="text-[10px] uppercase tracking-widest font-bold text-[#A08E75]">烦忧心声草稿纸</span>
                  <textarea
                    autoFocus
                    value={thought}
                    onChange={(e) => setThought(e.target.value)}
                    rows={3}
                    placeholder="例如：『好想玩手机啊，一想到明天堆积的需求就头皮发麻不想动，觉得自己太软弱了...』"
                    className="w-full text-xs text-[#5D4037] p-3 border-2 border-[#725D42] rounded-xl bg-[#FFFDF4] shadow-inner placeholder:text-[#A08E75]/70 focus:outline-none focus:ring-1 focus:ring-[#19C8B9]"
                  />
                  <span className="text-[9.5px] italic text-[#A08E75]">请大胆倾吐。写下代表直面，直面意味着重夺控制权！</span>
                </motion.div>
              ) : (
                <motion.div
                  animate={{ x: 380, opacity: 0, rotate: 12, scale: 0.6 }}
                  transition={{ duration: 1.8, ease: "easeInOut" }}
                  className="mx-auto w-full max-w-xs p-6 bg-[#E1F5FE] border-4 border-[#725D42] rounded-3xl flex flex-col items-center gap-3"
                >
                  <div className="text-4xl animate-bounce">🌬️</div>
                  <p className="text-xs font-bold text-[#0288D1] italic">"微风呼呼，白云随草香飘散啦..."</p>
                  <p className="text-[11px] text-[#A08E75] line-through italic px-2">"{thought}"</p>
                </motion.div>
              )}
            </AnimatePresence>

            <button
              onClick={handleBlowAway}
              disabled={isBlowing}
              className={`w-full py-4 ${
                isBlowing ? "bg-neutral-300 pointer-events-none" : "bg-[#19C8B9] hover:bg-[#20DEC1]"
              } text-[#FFFDF4] font-black text-sm tracking-widest rounded-2xl border-4 border-[#725D42] shadow-[0_6px_0_0_#11A89B] hover:translate-y-[1px] active:translate-y-[5px] active:shadow-none transition-all cursor-pointer flex items-center justify-center gap-2`}
            >
              <Wind size={16} className={isBlowing ? "animate-spin" : ""} />
              <span>让小岛微风吹散脑中积云！</span>
            </button>
          </div>
        ) : (
          <MiniGameCompletion
            emoji="🧸"
            title="思绪送走，重见阳光！"
            description="恭喜你完成了倾泻直面与认知解离。那些苛刻自责、焦虑狂躁的堆积乌云，都随微风拂入山麓，化解无形啦。专属任务打卡成功！"
            buttonLabel="给小岛浇水并领取经验！"
            onComplete={() => { playResolve(); onComplete(); }}
          />
        )}
      </div>
    </Modal>
  );
}
