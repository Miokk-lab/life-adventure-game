import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Modal, Card, Button } from "animal-island-ui";
import { playCollect, playClick, playResolve, playHurt } from "../../systems/soundEngine";
import MiniGameCompletion from "./MiniGameCompletion";

interface ShellCollectGameProps {
  taskTitle: string;
  taskDescription: string;
  targetItems?: string[];
  onComplete: () => void;
  onClose: () => void;
}

interface ShellItem {
  id: number;
  color: string;
  emoji: string;
  x: number;
  y: number;
  collected: boolean;
}

const SHELL_COLORS = [
  { color: "#FFB6C1", emoji: "🐚" },
  { color: "#FFD700", emoji: "🌟" },
  { color: "#98FB98", emoji: "🍀" },
  { color: "#87CEEB", emoji: "💎" },
  { color: "#DDA0DD", emoji: "🌸" },
  { color: "#F0E68C", emoji: "⭐" },
  { color: "#FFA07A", emoji: "🪸" },
  { color: "#B0E0E6", emoji: "🫧" },
];

function generateShells(count: number): ShellItem[] {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    color: SHELL_COLORS[i % SHELL_COLORS.length].color,
    emoji: SHELL_COLORS[i % SHELL_COLORS.length].emoji,
    x: 10 + Math.random() * 80,
    y: 20 + Math.random() * 60,
    collected: false,
  }));
}

export default function ShellCollectGame({
  taskTitle, taskDescription, targetItems, onComplete, onClose,
}: ShellCollectGameProps) {
  const count = targetItems?.length || 5;
  const [shells, setShells] = useState<ShellItem[]>(() => generateShells(count));
  const [collected, setCollected] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const target = Math.min(count, 5);

  const handleCollectShell = (id: number) => {
    playCollect();
    setShells((prev) => prev.map((s) => (s.id === id ? { ...s, collected: true } : s)));
    const newCollected = collected + 1;
    setCollected(newCollected);
    if (newCollected >= target) {
      setTimeout(() => { playResolve(); setIsFinished(true); }, 600);
    }
  };

  return (
    <Modal open={true} title={`🐚 ${taskTitle}`} onClose={() => { playHurt(); onClose(); }} typewriter={false} footer={null} width={560}>
      <div className="text-center space-y-4">
        <p className="text-xs text-[#A08E75]">{taskDescription}</p>

        {!isFinished ? (
          <div className="space-y-4">
            <div className="flex items-center justify-between text-xs font-bold">
              <span>已收集: {collected}/{target}</span>
              <span className="text-[#A08E75]">点击贝壳收集！</span>
            </div>

            {/* Beach area */}
            <div className="relative w-full h-64 bg-[#FFF8DC] border-4 border-[#725D42] rounded-3xl overflow-hidden shadow-inner">
              {/* Sand texture dots */}
              <div className="absolute inset-0 opacity-10" style={{
                backgroundImage: "radial-gradient(circle, #C4B89E 1px, transparent 1px)",
                backgroundSize: "20px 20px",
              }} />
              {/* Basket area */}
              <div className="absolute bottom-2 right-2 w-20 h-20 bg-[#F2EDE0] border-4 border-[#8B7355] rounded-2xl flex items-center justify-center text-3xl shadow-inner">
                🧺
                <span className="absolute -top-1 -right-1 w-6 h-6 bg-[#8CC63F] border-2 border-[#725D42] text-white text-[10px] font-black rounded-full flex items-center justify-center">
                  {collected}
                </span>
              </div>
              {/* Shells */}
              <AnimatePresence>
                {shells.filter((s) => !s.collected).map((shell) => (
                  <motion.button
                    key={shell.id}
                    initial={{ scale: 0, rotate: -30 }}
                    animate={{ scale: 1, rotate: 0, y: [0, -4, 0] }}
                    transition={{ y: { duration: 2, repeat: Infinity, ease: "easeInOut" } }}
                    exit={{ scale: 0, x: 280, y: 200, opacity: 0, transition: { duration: 0.5 } }}
                    onClick={() => handleCollectShell(shell.id)}
                    className="absolute text-3xl cursor-pointer hover:scale-125 transition-transform"
                    style={{ left: `${shell.x}%`, top: `${shell.y}%` }}
                  >
                    {shell.emoji}
                  </motion.button>
                ))}
              </AnimatePresence>
            </div>
          </div>
        ) : (
          <MiniGameCompletion
            emoji="🐚"
            title="贝壳收集完成！"
            description={`你成功收集了 ${target} 个贝壳！这些小胜利就是生活的基石。`}
            buttonLabel="领取奖励！"
            onComplete={() => { playResolve(); onComplete(); }}
          />
        )}
      </div>
    </Modal>
  );
}
