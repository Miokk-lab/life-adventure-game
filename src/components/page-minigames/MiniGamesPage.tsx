import React, { useState } from 'react';
import { useAdventureStore } from '../../stores/useAdventureStore';
import { useGameStore } from '../../stores/useGameStore';
import { Card } from 'animal-island-ui';
import { motion } from 'motion/react';
import BreathingCircle from '../templates/BreathingCircle';
import SortBaskets from '../templates/SortBaskets';
import LetterWrite from '../templates/LetterWrite';
import WaterDrink from '../templates/WaterDrink';
import GratitudePetals from '../templates/GratitudePetals';
import AutoTimer from '../templates/AutoTimer';
import CloudMiniGame from '../minigames/CloudMiniGame';
import ShellCollectGame from '../minigames/ShellCollectGame';
import { getWorryContent } from '../../data/worryContent';
import { MINIGAME_HP_RESTORE, MINIGAME_EXP, MINIGAME_COINS, MINIGAME_STAMINA_COST } from '../../constants';

const TEMPLATE_MAP: Record<string, React.ComponentType<any>> = {
  breathing: BreathingCircle,
  sorting: SortBaskets,
  writing: LetterWrite,
  action: WaterDrink,
  gratitude: GratitudePetals,
  movement: AutoTimer,
  cloud: CloudMiniGame,
  shell_collect: ShellCollectGame,
};

export default function MiniGamesPage() {
  const restoreHp = useAdventureStore((s) => s.restoreHp);
  const consumeStamina = useAdventureStore((s) => s.consumeStamina);
  const addExp = useAdventureStore((s) => s.addExp);
  const addCoins = useAdventureStore((s) => s.addCoins);
  const stamina = useAdventureStore((s) => s.stamina);
  const worryType = useGameStore((s) => s.worryType);
  const [active, setActive] = useState<{ type: string; title: string; desc: string } | null>(null);

  const worryContent = getWorryContent(worryType ?? 'emotion_management');
  // Worry-specific sort data
  const sortDataMap: Record<string, {baskets:{key:string;label:string;emoji:string}[],items:{text:string;basket:string}[]}> = {
    work_stress: {baskets:[{key:'a',label:'紧急重要',emoji:'🔴'},{key:'b',label:'重要不紧急',emoji:'🟡'},{key:'c',label:'可委托或不做',emoji:'🟢'}],items:[{text:'系统上线前突然出现重大Bug需要修复',basket:'a'},{text:'客户临时邀约今晚聚餐',basket:'a'},{text:'制定下季度的项目规划',basket:'b'},{text:'整理三个月的报销单据',basket:'c'},{text:'回复团建时间投票邮件',basket:'c'}]},
    learning_growth: {baskets:[{key:'a',label:'核心概念',emoji:'🔴'},{key:'b',label:'次要细节',emoji:'🟡'},{key:'c',label:'可以跳过',emoji:'🟢'}],items:[{text:'理解牛顿第二定律的推导过程',basket:'a'},{text:'记住公式中每个符号的含义',basket:'a'},{text:'了解物理学家的生平趣事',basket:'c'},{text:'做10道典型例题',basket:'b'},{text:'用不同颜色的笔整理笔记',basket:'c'}]},
    interpersonal: {baskets:[{key:'a',label:'可以修复',emoji:'💚'},{key:'b',label:'需要时间',emoji:'🟡'},{key:'c',label:'需要放手',emoji:'🔴'}],items:[{text:'朋友因为误会而疏远了你',basket:'a'},{text:'同事总是不回应你的协作请求',basket:'b'},{text:'一段只消耗你能量却无成长的关系',basket:'c'},{text:'与家人的小摩擦而非原则性冲突',basket:'a'},{text:'过去的恋人在你的生活中已成过去',basket:'c'}]},
    family_origin: {baskets:[{key:'a',label:'童年的记忆',emoji:'🕰️'},{key:'b',label:'现在的选择',emoji:'🌱'},{key:'c',label:'未来的目标',emoji:'⭐'}],items:[{text:'小时候考了第一名却被家人忽视',basket:'a'},{text:'家人总是拿你和别人家孩子比较',basket:'a'},{text:'今天选择不再为家人的情绪负责',basket:'b'},{text:'建立自己独立的社交圈',basket:'b'},{text:'未来你想要一个怎样的小家',basket:'c'}]},
    social_environment: {baskets:[{key:'a',label:'我真正喜欢的',emoji:'💚'},{key:'b',label:'社会期待的',emoji:'🟡'},{key:'c',label:'可以放下的',emoji:'🔴'}],items:[{text:'穿着睡衣在家看书的周末',basket:'a'},{text:'学习一门不热门但有趣的技能',basket:'a'},{text:'买最新款名牌包来证明自己过得好',basket:'b'},{text:'因为同龄人都买房而感到焦虑',basket:'b'},{text:'取关让你感到自卑的社交媒体账号',basket:'c'}]},
    physical_health: {baskets:[{key:'a',label:'已经做到的',emoji:'💚'},{key:'b',label:'正在养成的',emoji:'🟡'},{key:'c',label:'需要改变的',emoji:'🔴'}],items:[{text:'每天喝足够的水',basket:'a'},{text:'每晚11点前上床睡觉',basket:'b'},{text:'每周运动3次',basket:'b'},{text:'凌晨2点还在刷手机',basket:'c'},{text:'压力大时暴饮暴食',basket:'c'}]},
    time_management: {baskets:[{key:'a',label:'紧急重要',emoji:'🔴'},{key:'b',label:'重要不紧急',emoji:'🟡'},{key:'c',label:'不重要',emoji:'🟢'}],items:[{text:'明天截止的项目方案提交',basket:'a'},{text:'客户投诉需要立即处理',basket:'a'},{text:'每周三次的健身计划',basket:'b'},{text:'学习一门新的专业技能',basket:'b'},{text:'刷社交媒体看朋友动态',basket:'c'}]},
    emotion_management: {baskets:[{key:'a',label:'愤怒',emoji:'🔴'},{key:'b',label:'悲伤',emoji:'🔵'},{key:'c',label:'焦虑',emoji:'🟡'}],items:[{text:'被同事抢功时的怒火',basket:'a'},{text:'在地铁上被人踩了一脚对方没道歉',basket:'a'},{text:'最好的朋友要搬到另一个城市',basket:'b'},{text:'想起已经离开的亲人',basket:'b'},{text:'下周一要做重要的公开演讲',basket:'c'}]},
  };
  const sortData = sortDataMap[worryType ?? 'emotion_management'] ?? sortDataMap.emotion_management;
  const games = worryContent.miniGames.map((g) => ({
    ...g,
    hpRestore: MINIGAME_HP_RESTORE,
    staminaCost: MINIGAME_STAMINA_COST,
    template: g.id, // use game id directly to map to correct template
  }));

  const handlePlay = (game: typeof games[number]) => {
    if (game.staminaCost > 0 && stamina < game.staminaCost) return;
    if (game.staminaCost > 0) consumeStamina(game.staminaCost);
    setActive({ type: game.template, title: `${game.emoji} ${game.name}`, desc: game.description });
  };

  const handleComplete = (game: typeof games[number]) => {
    restoreHp(MINIGAME_HP_RESTORE);
    addExp(MINIGAME_EXP);
    addCoins(MINIGAME_COINS);
    setActive(null);
  };

  return (
    <div className="space-y-4">
      <div className="text-center p-6 rounded-3xl" style={{ background: 'linear-gradient(180deg, #1a1a2e, #16213e, #0f3460)', border: '3px solid #e8e2d6' }}>
        <div className="text-5xl mb-3">🏕️✨</div>
        <h2 className="text-2xl font-black mb-2" style={{ color: '#f8f8f0' }}>星空下的露营篝火</h2>
        <p className="text-sm" style={{ color: '#c4b89e' }}>选一个方式，给自己放松的机会 (+15 EXP)</p>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {games.map((game) => (
          <motion.div key={game.id} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Card color="app-yellow" className="cursor-pointer text-center" onClick={() => handlePlay(game)}>
              <span className="text-4xl block mb-2">{game.emoji}</span>
              <h3 className="font-extrabold text-sm mb-1" style={{ color: '#725d42' }}>{game.name}</h3>
              <p className="text-xs mb-3 px-2" style={{ color: '#9f927d' }}>{game.description}</p>
              <div className="flex justify-center gap-4 text-xs font-bold">
                <span style={{ color: '#e05a5a' }}>❤️ +{game.hpRestore}</span>
                <span style={{ color: '#f5c31c' }}>⭐ +15 EXP</span>
                {game.staminaCost > 0 && <span style={{ color: '#6fba2c' }}>💚 {game.staminaCost}</span>}
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Template modals — use different templates than tasks */}
      {active && active.type === 'breathing' && (
        <BreathingCircle title={active.title} description={active.desc} themeText="跟随呼吸节奏，放松身心" onComplete={() => { const g = games.find(g=>g.template==='breathing'); if(g) handleComplete(g); }} onClose={() => setActive(null)} />
      )}
      {active && active.type === 'sorting' && (
        <SortBaskets title={active.title} description={active.desc}
          items={sortData.items} baskets={sortData.baskets}
          onComplete={() => { const g = games.find(g=>g.template==='sorting'); if(g) handleComplete(g); }} onClose={() => setActive(null)} />
      )}
      {active && active.type === 'writing' && (
        <LetterWrite title={active.title} description={active.desc} placeholder="写下你的想法…" onComplete={() => { const g = games.find(g=>g.template==='writing'); if(g) handleComplete(g); }} onClose={() => setActive(null)} />
      )}
      {active && active.type === 'movement' && (
        <AutoTimer title={active.title} description={active.desc} themeText="放松身体，跟随引导" duration={60} onComplete={() => { const g = games.find(g=>g.template==='movement'); if(g) handleComplete(g); }} onClose={() => setActive(null)} />
      )}
      {active && active.type === 'cloud' && (
        <CloudMiniGame taskTitle={active.title} taskDescription={active.desc} onComplete={() => { const g = games.find(g=>g.template==='cloud'); if(g) handleComplete(g); }} onClose={() => setActive(null)} />
      )}
      {active && active.type === 'shell_collect' && (
        <ShellCollectGame taskTitle={active.title} taskDescription={active.desc} onComplete={() => { const g = games.find(g=>g.template==='shell_collect'); if(g) handleComplete(g); }} onClose={() => setActive(null)} />
      )}
    </div>
  );
}
