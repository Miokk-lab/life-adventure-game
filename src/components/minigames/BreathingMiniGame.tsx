import React, { useState, useEffect, useRef } from "react";
import { motion } from "motion/react";
import { X } from "lucide-react";
import { Modal } from "animal-island-ui";
import { playCollect, playClick, playResolve, playHurt } from "../../systems/soundEngine";
import { useTranslations } from "../../i18n";
import MiniGameCompletion from "./MiniGameCompletion";

interface BreathingMiniGameProps {
  taskTitle: string;
  taskDescription: string;
  onComplete: () => void;
  onClose: () => void;
}

type Phase = "inhale" | "hold" | "exhale" | "rest";

export default function BreathingMiniGame({
  taskTitle,
  taskDescription,
  onComplete,
  onClose,
}: BreathingMiniGameProps) {
  const [phase, setPhase] = useState<Phase>("inhale");
  const [secondsLeft, setSecondsLeft] = useState(4);
  const [cyclesCompleted, setCyclesCompleted] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  const tr = useTranslations();
  const breathingTr = tr.minigameDetails.breathing;

  const phaseRef = useRef(phase);
  phaseRef.current = phase;
  const cyclesRef = useRef(cyclesCompleted);
  cyclesRef.current = cyclesCompleted;

  useEffect(() => {
    playCollect();
    const interval = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          const currentPhase = phaseRef.current;
          if (currentPhase === "inhale") {
            setPhase("hold");
            playClick();
            return 4;
          } else if (currentPhase === "hold") {
            setPhase("exhale");
            playCollect();
            return 4;
          } else if (currentPhase === "exhale") {
            setPhase("rest");
            const newCycles = cyclesRef.current + 1;
            setCyclesCompleted(newCycles);
            if (newCycles >= 3) {
              // Side effect outside state updater
              setTimeout(() => {
                clearInterval(interval);
                setIsFinished(true);
                playResolve();
              }, 0);
            }
            return 2;
          } else {
            setPhase("inhale");
            return 4;
          }
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []); // empty deps — refs handle freshness

  // Determine circle zoom based on phase
  const getScaleAndColor = () => {
    switch (phase) {
      case "inhale":
        return { scale: 1.5, bg: "bg-[#19C8B9]/15", border: "border-[#19C8B9]" };
      case "hold":
        return { scale: 1.5, bg: "bg-[#8CC63F]/20", border: "border-[#8CC63F]" };
      case "exhale":
        return { scale: 1.0, bg: "bg-[#FF9F1C]/15", border: "border-[#FF9F1C]" };
      default:
        return { scale: 1.0, bg: "bg-neutral-100", border: "border-neutral-300" };
    }
  };

  const { scale, bg, border } = getScaleAndColor();

  return (
    <Modal
      open={true}
      title={`🍃 ${breathingTr.title} - 【${taskTitle}】`}
      onClose={() => { playHurt(); onClose(); }}
      typewriter={false}
      footer={null}
      width={520}
    >
      <div className="text-center">
        <p className="text-xs text-[#A08E75] px-4 leading-relaxed mb-6">
          "{taskDescription}"
        </p>

        {!isFinished ? (
          <div className="py-6 flex flex-col items-center">
            <div className="w-48 h-48 flex items-center justify-center relative mb-8">
              <motion.div
                animate={{ scale: [1, 1.25, 1], opacity: [0.3, 0.1, 0.3] }}
                transition={{ duration: 4, repeat: Infinity }}
                className="absolute inset-0 rounded-full bg-[#19C8B9]/5 border-2 border-dashed border-[#19C8B9]/30"
              />
              <motion.div
                animate={{ scale }}
                transition={{ duration: 3.8, ease: "easeInOut" }}
                className={`w-32 h-32 rounded-full border-4 ${border} ${bg} transition-colors duration-1000 flex flex-col items-center justify-center z-10`}
              >
                <div className="text-center">
                  <span className="text-[10px] font-black tracking-widest text-[#725D42] uppercase block">
                    {breathingTr.phases[phase]}
                  </span>
                  <span className="text-3xl font-black text-[#5D4037] font-mono block">
                    {secondsLeft}s
                  </span>
                </div>
              </motion.div>
            </div>

            <div className="flex items-center justify-center gap-2 mb-2">
              <span className="text-xs font-bold text-[#A08E75]">{breathingTr.cyclesLabel}:</span>
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  className={`w-5 h-5 rounded-full border-2 border-[#725D42] flex items-center justify-center ${
                    i < cyclesCompleted ? "bg-[#8CC63F] text-white" : "bg-[#F2EDE0]"
                  } text-[10px] font-bold transition-all`}
                >
                  {i < cyclesCompleted ? "✓" : i + 1}
                </div>
              ))}
            </div>
            <p className="text-xs text-[#725D42] font-semibold italic mt-1">
              {breathingTr.phaseTips[phase]}
            </p>
          </div>
        ) : (
          <MiniGameCompletion
            emoji="🎁"
            title={breathingTr.successTitle}
            description={breathingTr.successDesc}
            buttonLabel={breathingTr.successBtn}
            onComplete={() => { playResolve(); onComplete(); }}
          />
        )}
      </div>
    </Modal>
  );
}
