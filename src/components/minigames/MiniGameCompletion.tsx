import React from "react";
import { motion } from "motion/react";
import { Check } from "lucide-react";

interface MiniGameCompletionProps {
  emoji: string;
  title: string;
  description: string;
  buttonLabel?: string;
  onComplete: () => void;
}

export default function MiniGameCompletion({
  emoji,
  title,
  description,
  buttonLabel = "领取经验！",
  onComplete,
}: MiniGameCompletionProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      className="py-6 space-y-6"
    >
      <div className="text-5xl">{emoji}</div>
      <div className="space-y-1">
        <h4 className="text-lg font-black text-[#8CC63F]">{title}</h4>
        <p className="text-xs text-[#725D42] max-w-sm mx-auto leading-relaxed">
          {description}
        </p>
      </div>
      <button
        onClick={onComplete}
        className="px-10 py-3.5 bg-[#4CAF50] hover:bg-[#66BB6A] text-white font-black rounded-2xl border-4 border-[#725D42] shadow-[0_5px_0_0_#2E7D32] hover:translate-y-[1px] active:translate-y-[5px] active:shadow-none transition-all cursor-pointer flex items-center justify-center gap-2 mx-auto"
      >
        <Check size={18} />
        <span>{buttonLabel}</span>
      </button>
    </motion.div>
  );
}
