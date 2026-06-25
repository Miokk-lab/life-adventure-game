import React, { useState } from "react";
import { motion } from "motion/react";
import { Modal } from "animal-island-ui";
import ItemIcon from "../shared/ItemIcon";
import { playCollect, playClick, playResolve, playHurt } from "../../systems/soundEngine";
import MiniGameCompletion from "./MiniGameCompletion";

interface SortingMiniGameProps {
  taskTitle: string;
  taskDescription: string;
  items?: ClutterItem[];
  onComplete: () => void;
  onClose: () => void;
}

export interface ClutterItem {
  id: string;
  text: string;
  correctBasket: "external" | "burden" | "micro";
  description: string;
}

const DEFAULT_ITEMS: ClutterItem[] = [
  {
    id: "item_1",
    text: "现实的大项目/大考/困难生活指标",
    correctBasket: "external",
    description: "这是属于「客观环境」，属于既定现实。不需要内耗或抱怨它，我们只需直面和接纳。"
  },
  {
    id: "item_2",
    text: "『我不能出一丝差错，否则就完蛋了』",
    correctBasket: "burden",
    description: "这是属于「严苛包袱」，代表不合理执念。我们要将其松手放下、释放出心房。"
  },
  {
    id: "item_3",
    text: "『立刻去给桌上的草盆浇水，写第一千零一行代码』",
    correctBasket: "micro",
    description: "这是属于「轻松小前行」，是一个5分钟内可瞬间开启的小胜利，立刻启动！"
  }
];

export default function SortingMiniGame({
  taskTitle,
  taskDescription,
  items,
  onComplete,
  onClose,
}: SortingMiniGameProps) {
  const initialItems = items && items.length > 0 ? items : DEFAULT_ITEMS;
  const [clutter] = useState<ClutterItem[]>(initialItems);
  const [selectedItemIdx, setSelectedItemIdx] = useState<number>(0);
  const [sortedCount, setSortedCount] = useState<number>(0);
  const [clutterStatus, setClutterStatus] = useState<Record<string, "unsorted" | "correct" | "wrong">>(
    () => Object.fromEntries(initialItems.map(i => [i.id, "unsorted" as const]))
  );
  const [feedback, setFeedback] = useState<string>("点击下列竹蓝，给当前出现的混杂念头归类整理...");

  const handleSortItem = (basket: "external" | "burden" | "micro") => {
    if (selectedItemIdx >= clutter.length) return;
    const item = clutter[selectedItemIdx];
    if (item.correctBasket === basket) {
      playCollect();
      setClutterStatus(prev => ({ ...prev, [item.id]: "correct" }));
      setFeedback(`分类正确！ ${item.description}`);
      setSortedCount(c => c + 1);
      setTimeout(() => {
        setSelectedItemIdx(prev => prev + 1);
        if (selectedItemIdx + 1 < clutter.length) {
          setFeedback("分类正确，请看下一个新心绪...");
        }
      }, 2500);
    } else {
      playHurt();
      setClutterStatus(prev => ({ ...prev, [item.id]: "wrong" }));
      setFeedback("哎呀，这个归类可以让岛上更挤了噢... 试着再仔细读读。提示：客观指标只能直面，思维定式需要松开，能立马开始的是微小步子！");
      setTimeout(() => {
        setClutterStatus(prev => ({ ...prev, [item.id]: "unsorted" }));
      }, 1500);
    }
  };

  const isFinished = sortedCount >= clutter.length;

  return (
    <Modal
      open={true}
      title={`🧺 心灵木篮整理术 - 【${taskTitle}】`}
      onClose={() => { if (!isFinished) { playHurt(); onClose(); } }}
      typewriter={false}
      footer={null}
      width={560}
    >
      <div className="text-center">
        <p className="text-xs text-[#A08E75] px-4 leading-relaxed mb-6">
          "{taskDescription}"
        </p>

        {!isFinished ? (
          <div className="space-y-6">
            <div className="bg-[#FAF7EC] border-2 border-[#725D42] rounded-2xl p-5 min-h-36 flex flex-col justify-center items-center shadow-inner relative overflow-hidden">
              <div className="absolute top-2 left-3 text-[10px] text-[#A08E75] font-bold">
                当前待归类堆物: {selectedItemIdx + 1} / {clutter.length}
              </div>
              {selectedItemIdx < clutter.length ? (
                <motion.div
                  key={selectedItemIdx}
                  initial={{ rotate: -5, scale: 0.95, opacity: 0 }}
                  animate={{ rotate: 0, scale: 1, opacity: 1 }}
                  className={`text-center space-y-2 p-3 rounded-xl border-2 ${
                    clutterStatus[clutter[selectedItemIdx].id] === "correct"
                      ? "border-[#8CC63F] bg-[#E8F5E9]"
                      : clutterStatus[clutter[selectedItemIdx].id] === "wrong"
                      ? "border-red-500 bg-red-50"
                      : "border-[#725D42] bg-white shadow-sm"
                  }`}
                >
                  <p className="text-sm font-black text-[#5D4037]">
                    {clutter[selectedItemIdx].text}
                  </p>
                </motion.div>
              ) : null}
            </div>

            <div className="text-xs font-bold text-[#725D42] italic bg-[#FFEEA6]/40 p-3.5 rounded-xl border border-dashed border-[#C4B89E] min-h-12 flex items-center justify-center max-w-md mx-auto">
              {feedback}
            </div>

            <div className="grid grid-cols-3 gap-3">
              {[
                { type: "external", name: "竹篮 A", desc: "客观大环境 (接纳不纠结)", color: "hover:bg-[#E2F1E7]" },
                { type: "burden", name: "竹篮 B", desc: "严苛执念 (原谅并卸载)", color: "hover:bg-[#FFEAEA]" },
                { type: "micro", name: "竹篮 C", desc: "微小步子 (踩下油门做起)", color: "hover:bg-[#FFFDE0]" }
              ].map((basket) => (
                <button
                  key={basket.type}
                  onClick={() => handleSortItem(basket.type as any)}
                  className={`p-3 bg-white border-2 border-[#725D42] rounded-2xl flex flex-col items-center gap-1 shadow-[0_4px_0_0_#725D42] active:translate-y-[4px] active:shadow-none transition-all cursor-pointer ${basket.color}`}
                >
                  <div className="flex items-center gap-1">
                    <ItemIcon emoji="🧺" size={14} />
                    <span className="text-xs font-black text-[#5D4037]">{basket.name}</span>
                  </div>
                  <span className="text-[9px] font-bold text-[#A08E75] leading-tight block text-center mt-1">
                    {basket.desc}
                  </span>
                </button>
              ))}
            </div>
          </div>
        ) : (
          <MiniGameCompletion
            emoji="🌾"
            title="杂乱归类，心灵清新！"
            description="干得太漂亮了！你成功理清了什么属于外界环境压力，什么属于自我执念。分类之后，你会发现要应对的事情清清爽爽！专属任务打卡成功！"
            buttonLabel="给小岛施肥并领取多巴胺经验！"
            onComplete={() => { playResolve(); onComplete(); }}
          />
        )}
      </div>
    </Modal>
  );
}
