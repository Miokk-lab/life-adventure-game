import React, { useState } from "react";
import { motion } from "motion/react";
import { Modal } from "animal-island-ui";
import ItemIcon from "../shared/ItemIcon";
import { playCollect, playClick, playResolve, playHurt } from "../../systems/soundEngine";
import { useLanguageStore } from "../../stores/useLanguageStore";
import { useTranslations } from "../../i18n";
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

const LOCALIZED_DEFAULT_ITEMS: Record<string, ClutterItem[]> = {
  zh: [
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
  ],
  en: [
    {
      id: "item_1",
      text: "Actual big project/major exam/difficult life metric",
      correctBasket: "external",
      description: "This belongs to the 'objective environment'—a given reality. No need to overthink or complain about it, we just need to face and accept it."
    },
    {
      id: "item_2",
      text: "『I must not make a single mistake, or it's all over』",
      correctBasket: "burden",
      description: "This belongs to 'harsh burdens'—representing irrational attachments. We need to let go and release them from our minds."
    },
    {
      id: "item_3",
      text: "『Immediately go water the potted plants on the desk, write the 1001st line of code』",
      correctBasket: "micro",
      description: "This belongs to 'easy small steps'—a minor victory that can be instantly started in 5 minutes. Start now!"
    }
  ],
  ja: [
    {
      id: "item_1",
      text: "現実の大きなプロジェクト/大事な試験/困難な生活の目標",
      correctBasket: "external",
      description: "これは「客観的な環境」であり、不変の現実です。不満を抱くのではなく、直視し、受け入れるだけで十分です。"
    },
    {
      id: "item_2",
      text: "「一瞬のミスも許されない、さもないとすべておしまいだ」",
      correctBasket: "burden",
      description: "これは「厳しいこだわり（執着）」であり、非合理的な思い込みです。執着を手放し、心から解放しましょう。"
    },
    {
      id: "item_3",
      text: "「今すぐ机の上の観葉植物に水をやる、1001行目のコードを書く」",
      correctBasket: "micro",
      description: "これは「小さな一歩」であり、5分以内にすぐに始められる小さな勝利です。今すぐ行動しましょう！"
    }
  ]
};

const BASKET_COLORS: Record<string, string> = {
  external: "hover:bg-[#E2F1E7]",
  burden: "hover:bg-[#FFEAEA]",
  micro: "hover:bg-[#FFFDE0]"
};

export default function SortingMiniGame({
  taskTitle,
  taskDescription,
  items,
  onComplete,
  onClose,
}: SortingMiniGameProps) {
  const language = useLanguageStore((s) => s.language);
  const tr = useTranslations();
  const sortingTr = tr.minigameDetails.sorting;

  const localizedDefault = LOCALIZED_DEFAULT_ITEMS[language] || LOCALIZED_DEFAULT_ITEMS.zh;
  const initialItems = items && items.length > 0 ? items : localizedDefault;

  const [clutter] = useState<ClutterItem[]>(initialItems);
  const [selectedItemIdx, setSelectedItemIdx] = useState<number>(0);
  const [sortedCount, setSortedCount] = useState<number>(0);
  const [clutterStatus, setClutterStatus] = useState<Record<string, "unsorted" | "correct" | "wrong">>(
    () => Object.fromEntries(initialItems.map(i => [i.id, "unsorted" as const]))
  );
  const [feedback, setFeedback] = useState<string>(sortingTr.feedbackDefault);

  const handleSortItem = (basket: "external" | "burden" | "micro") => {
    if (selectedItemIdx >= clutter.length) return;
    const item = clutter[selectedItemIdx];
    if (item.correctBasket === basket) {
      playCollect();
      setClutterStatus(prev => ({ ...prev, [item.id]: "correct" }));
      setFeedback(`${sortingTr.feedbackCorrect} ${item.description}`);
      setSortedCount(c => c + 1);
      setTimeout(() => {
        setSelectedItemIdx(prev => prev + 1);
        if (selectedItemIdx + 1 < clutter.length) {
          setFeedback(sortingTr.feedbackNext);
        }
      }, 2500);
    } else {
      playHurt();
      setClutterStatus(prev => ({ ...prev, [item.id]: "wrong" }));
      setFeedback(sortingTr.feedbackWrong);
      setTimeout(() => {
        setClutterStatus(prev => ({ ...prev, [item.id]: "unsorted" }));
      }, 1500);
    }
  };

  const isFinished = sortedCount >= clutter.length;

  return (
    <Modal
      open={true}
      title={`🧺 ${sortingTr.title} - 【${taskTitle}】`}
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
                {sortingTr.progress}: {selectedItemIdx + 1} / {clutter.length}
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
              {sortingTr.baskets.map((basket: any) => (
                <button
                  key={basket.type}
                  onClick={() => handleSortItem(basket.type as any)}
                  className={`p-3 bg-white border-2 border-[#725D42] rounded-2xl flex flex-col items-center gap-1 shadow-[0_4px_0_0_#725D42] active:translate-y-[4px] active:shadow-none transition-all cursor-pointer ${BASKET_COLORS[basket.type] || ""}`}
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
            title={sortingTr.successTitle}
            description={sortingTr.successDesc}
            buttonLabel={sortingTr.successBtn}
            onComplete={() => { playResolve(); onComplete(); }}
          />
        )}
      </div>
    </Modal>
  );
}
