import type { WorryCategory, HeroData, MonsterData, BattleSkill, DailyTask, SkillRef } from '../types';
import { makeSkill } from './skills';
import { generateDailyTasks } from './quests';

export const VICTORY_VIDEO_MAP: Record<string, string> = {
  work_stress:        '/vedio/work-stress.mp4',
  learning_growth:    '/vedio/Learning-Growth.mp4',
  interpersonal:      '/vedio/Interpersonal-Relations.mp4',
  family_origin:      '/vedio/family-origin.mp4',
  social_environment: '/vedio/Social-Environment.mp4',
  physical_health:    '/vedio/Physical-Health.mp4',
  time_management:    '/vedio/Time-Management.mp4',
  emotion_management: '/vedio/Emotion%20Management.mp4',
};

interface CategoryPreset {
  hero: HeroData;
  monster: MonsterData;
  cbtAnalysis: string;
  victoryText: string;
  skills: BattleSkill[];
}

// ── Helper: build SkillRef[] for HeroData ──
function refs(skills: BattleSkill[]): SkillRef[] {
  return skills.map(({ id, name, animal, level, description }) => ({ id, name, animal, level, description }));
}

// ═══════════════════════════════════════════════════════
// ① WORK STRESS — 熊猫悠悠 vs 笃笃魔
// ═══════════════════════════════════════════════════════
const WORK_STRESS: CategoryPreset = {
  hero: {
    name: '松弛感熊猫「悠悠」',
    story: '天生慢节奏的熊猫，懂得在竹林中找到最舒适的角落，一边啃着竹子一边晒太阳。它的座右铭是："总有时间吃一根竹子，也总有时间什么也不做。"',
    imageUrl: '/hero-monster/panda.png',
    skills: [],
  },
  monster: {
    name: '狂躁啄木鸟「笃笃魔」',
    story: '一只疯狂啄树的啄木鸟，眼睛里闪烁着永不停歇的焦虑。它无法停止啄击，就像一台停不下来的工作机器。但树干中其实根本没有什么虫子——它只是在啄一个早已空洞的恐惧。',
    attacks: ['连续敲击：频繁弹窗打扰，无法集中注意力', '枯木腐蚀：否定现有工作价值，意志削弱', '机械循环：强迫性操作，陷入"为了忙而忙"的死循环'],
    imageUrl: '/hero-monster/woodpecker.png',
  },
  cbtAnalysis: `笃笃魔如此焦躁地疯狂凿树，其实是因为你内心深处藏着一颗极其闪亮的「责任心种子」。你太想把每一根木头都凿得平整完美了，这多让人敬佩啊！但认知行为疗法（CBT）提醒我们：过度关注「结果」的完美，会让我们的「过程」变得苦涩。你的手在颤抖，是因为你把「工作完成」等同于了「个人价值」。试着告诉自己：「我可以有条不紊地工作，也可以有条不紊地休息。」当你可以为了保护森林（你自己）而停下凿击时，笃笃魔就会明白，真正的责任感，是可持续的平和。`,
  victoryText: `熊猫悠悠轻快地摇动着竹林，笃笃魔终于停下了疯狂的啄击，它那双忙乱的眼睛闪过一丝困惑，随后慢慢聚焦。树干中并没有所谓的「虫子」，而是一只只展开翅膀的斑斓蝴蝶。笃笃魔收起尖喙，它低下头，用头顶蹭了蹭树干，那疯狂的动作变成了一种安宁的节拍。最后，笃笃魔化作一只系着蓝色围裙的小知更鸟，它衔来一片巨大的荷叶为你遮荫，树木间飘落下的木屑竟然变成了清香的竹叶茶，那是属于你的、可以随时停下来休息的「自由时刻」。`,
  skills: [
    makeSkill('ws_turtle_l1', 'turtle', 1, '关掉通知', '暂时切断干扰源，给自己一个安静的空间', 10, 0, 10, 'heal', 0),
    makeSkill('ws_turtle_l2', 'turtle', 2, '正视焦虑', '意识到心跳加快只是身体的信号，不是命令', 8, 5, 5, 'debuff', 20),
    makeSkill('ws_turtle_l3', 'turtle', 3, '接受进度', '不强求完美收尾，完成比完美更重要', 12, 10, 30, 'shield', 40),
    makeSkill('ws_sloth_l1', 'sloth', 1, '深长呼吸', '感受肺部充盈，放慢节奏', 4, 5, 8, 'heal', 0),
    makeSkill('ws_sloth_l2', 'sloth', 2, '视线停留', '观察身边的一个物品30秒，回到当下', 8, 12, 0, 'damage', 0),
    makeSkill('ws_sloth_l3', 'sloth', 3, '感官沉浸', '放下思考，只体验当下的声音和触感', 12, 22, 15, 'buff', 30),
    makeSkill('ws_tiger_l1', 'tiger', 1, '标记首要', '只挑出最紧迫的一件事，其他放一边', 5, 12, 0, 'damage', 0),
    makeSkill('ws_tiger_l2', 'tiger', 2, '拒绝干扰', '委婉推掉非必要的事，保护自己的时间', 10, 20, 0, 'damage', 0),
    makeSkill('ws_tiger_l3', 'tiger', 3, '止损咆哮', '主动设定交付上限，宣布"这就够了"', 15, 32, 0, 'damage', 50),
    makeSkill('ws_snake_l1', 'snake', 1, '任务拆解', '将大项目化为小块，一块一块来', 5, 10, 0, 'damage', 0),
    makeSkill('ws_snake_l2', 'snake', 2, '经验总结', '视错误为流程优化的数据，而非失败', 10, 16, 0, 'damage', 0),
    makeSkill('ws_snake_l3', 'snake', 3, '加班重定义', '把加班时间看作能力提升的阶梯而非苦难', 14, 26, 5, 'buff', 35),
    makeSkill('ws_eagle_l1', 'eagle', 1, '说出拖延', '对自己承认正在逃避哪件工作，把它写下来', 10, 8, 5, 'heal', 0),
    makeSkill('ws_eagle_l2', 'eagle', 2, '直面反馈', '主动向上级汇报困难或寻求支持，而非独自扛着', 20, 18, 0, 'damage', 0),
    makeSkill('ws_eagle_l3', 'eagle', 3, '设限谈判', '直接开口拒绝一个不合理的工作要求', 30, 32, 0, 'buff', 45),
  ],
};

// ═══════════════════════════════════════════════════════
// ② LEARNING & GROWTH — 猫头鹰学学 vs 圈圈魔
// ═══════════════════════════════════════════════════════
const LEARNING_GROWTH: CategoryPreset = {
  hero: {
    name: '求知猫头鹰「学学」',
    story: '一只喜欢在夜晚沉思的猫头鹰，戴着圆圆的学者眼镜。它从高处俯瞰整个世界，知道每一片森林如何生长。它说："真正的学问不是快，而是深。"',
    imageUrl: '/hero-monster/owl.png',
    skills: [],
  },
  monster: {
    name: '迷茫仓鼠「圈圈魔」',
    story: '一只在跑轮上疯狂奔跑的仓鼠，跑得气喘吁吁却永远停在原地。它看到别人已经跑到了前方，于是跑得更快了——但它不知道，它需要的不是更快的速度，而是跳出那个跑轮的勇气。',
    attacks: ['高速跑轮：盲目努力，思维原地踏步', '坐标模糊：找不到重点，在无关细节中浪费精力', '进度恐吓：看着同龄人的成功，产生巨大落差感'],
    imageUrl: '/hero-monster/hamster.png',
  },
  cbtAnalysis: `哎呀，圈圈魔又在跑轮上疯狂奔跑了，这背后分明是一颗不甘平庸、对世界充满好奇的勇敢灵魂！你追求进步的样子真的很美。但心理学中的「过度概括」陷阱正在悄悄围住你：你把一次跑轮上的原地踏步，解读成了「我正在虚度人生」。但这只是坐标的暂时重合，不是停滞。下一次当你感到焦虑时，试着停下来，喝口水，看看跑轮外的风景。每一次「停顿」，都是猫头鹰在夜空中重新校准星图的必要动作。当你不再执着于跑得快，而是执着于跑得准时，圈圈魔就会安静地在你手心睡去。`,
  victoryText: `学学伸出羽毛笔在空中划出一个巨大的圆圈，跑轮失去了引力，砰的一声散成了无数金黄色的向日葵花瓣。圈圈魔茫然地落地，它跳出那个狭窄的圆圈，发现视野变得无比宽广。它抖了抖毛，身上的疲惫感化作了五彩纸屑。最后，圈圈魔变成了一只戴着小眼镜的可爱小灵鼠，它举着一张写满「已掌握」的复习卡，向你轻轻鞠躬。而原本那个枯燥的跑轮，现在变成了一张充满智慧的藏宝图，为你标注出了下一站惊喜的坐标。`,
  skills: [
    makeSkill('lg_turtle_l1', 'turtle', 1, '承认空白', '允许自己有不懂的地方，没有人全知全能', 3, 0, 8, 'heal', 0),
    makeSkill('lg_turtle_l2', 'turtle', 2, '接纳进度', '不再强求速成，学习是马拉松不是冲刺', 8, 5, 10, 'debuff', 15),
    makeSkill('lg_turtle_l3', 'turtle', 3, '坐标重置', '只和去年的自己比，而不是和全世界比', 12, 10, 20, 'shield', 40),
    makeSkill('lg_sloth_l1', 'sloth', 1, '闭目养神', '让过热的大脑冷却一下', 4, 5, 5, 'heal', 0),
    makeSkill('lg_sloth_l2', 'sloth', 2, '梳理羽毛', '整理现有的知识点，而不是学新的', 8, 12, 0, 'damage', 0),
    makeSkill('lg_sloth_l3', 'sloth', 3, '夜观星图', '跳出书本，观察全局，找到知识之间的联系', 12, 22, 10, 'buff', 30),
    makeSkill('lg_tiger_l1', 'tiger', 1, '列出要点', '只看最核心的概念，而不是所有细节', 5, 10, 0, 'damage', 0),
    makeSkill('lg_tiger_l2', 'tiger', 2, '标记路径', '制定短期可达目标，一步一步来', 10, 20, 0, 'damage', 0),
    makeSkill('lg_tiger_l3', 'tiger', 3, '破风之笔', '精准打击核心考点，一击必中', 15, 32, 0, 'damage', 45),
    makeSkill('lg_snake_l1', 'snake', 1, '错误记录', '分析失败的原因，这是最好的学习材料', 5, 8, 0, 'damage', 0),
    makeSkill('lg_snake_l2', 'snake', 2, '思维迁移', '用旧知识解释新知识，建立联系', 10, 16, 0, 'damage', 0),
    makeSkill('lg_snake_l3', 'snake', 3, '地图重绘', '将学习定义为一场探索游戏，而不是任务清单', 14, 26, 8, 'buff', 35),
    makeSkill('lg_eagle_l1', 'eagle', 1, '承认不懂', '在学习中主动说出"我不明白"，停止假装理解', 10, 8, 5, 'heal', 0),
    makeSkill('lg_eagle_l2', 'eagle', 2, '当面请教', '找比你懂的人当面提问，不再靠自己闷头钻研', 20, 18, 0, 'damage', 0),
    makeSkill('lg_eagle_l3', 'eagle', 3, '公开承诺', '向他人宣告一个具体的学习目标和截止日期', 30, 32, 0, 'buff', 45),
  ],
};

// ═══════════════════════════════════════════════════════
// ③ INTERPERSONAL — 卡皮巴拉橘橘 vs 刺刺魔
// ═══════════════════════════════════════════════════════
const INTERPERSONAL: CategoryPreset = {
  hero: {
    name: '暖心卡皮巴拉「橘橘」',
    story: '一只情绪极其稳定的水豚，头顶永远顶着一个刚摘下的橘子。它与万物为友——甚至和鳄鱼也能一起泡温泉。它说："温柔不是软弱，而是选择了不伤害。"',
    imageUrl: '/hero-monster/capybara.png',
    skills: [],
  },
  monster: {
    name: '敏感豪猪「刺刺魔」',
    story: '一只因为害怕受伤而竖起全身尖刺的豪猪。它渴望拥抱，但每次有人靠近，它就本能地竖起尖刺——然后那些人真的走远了。"看吧，果然没有人喜欢我。"它悲伤地想着。',
    attacks: ['流言回响：脑中挥之不去的他人看法', '防御姿态：用冷漠和挑剔排斥他人以保护自己', '社交过载：在人际交往中过分消耗心理能量'],
    imageUrl: '/hero-monster/hedgehog.png',
  },
  cbtAnalysis: `刺刺魔竖起全身尖刺，是因为它内心住着一个极度柔软、渴望被爱与被接纳的纯真小孩。你对他人的看法如此敏感，正是因为你极其看重那些真诚的连接。CBT 告诉我们：你的「防卫机制」是为了保护那个温柔的自己，但它扎伤了你最想靠近的森林。试着练习「自我慈悲」：你不必用尖刺来换取安全，你的存在本身就值得被温柔以待。当你尝试像水豚一样，把那份警觉替换为「我接纳当下的社交边界」时，尖刺就会退去，变成满地芬芳的花瓣。`,
  victoryText: `卡皮巴拉橘橘递给刺刺魔一个刚摘下的香甜橘子，那股温暖的香气在森林间弥漫开来。刺刺魔背上那些竖起的尖刺，像触碰到了春风一般，一片接一片地柔软下来，最后竟化作了满地粉嫩的樱花瓣。刺刺魔变成了一只圆滚滚的小刺猬，它羞涩地说「谢谢你愿意懂我」。`,
  skills: [
    makeSkill('ip_turtle_l1', 'turtle', 1, '适度疏离', '允许自己不被所有人喜欢，这很正常', 3, 0, 8, 'heal', 0),
    makeSkill('ip_turtle_l2', 'turtle', 2, '温和边界', '不强求讨好他人，设立舒适边界', 8, 5, 5, 'debuff', 20),
    makeSkill('ip_turtle_l3', 'turtle', 3, '和平共处', '接纳关系中的裂痕，不完美才是真实', 12, 10, 25, 'shield', 40),
    makeSkill('ip_sloth_l1', 'sloth', 1, '静谧呼吸', '社交紧张时，先回到自己的呼吸', 4, 5, 5, 'heal', 0),
    makeSkill('ip_sloth_l2', 'sloth', 2, '感知友善', '寻找周围环境中的积极互动', 8, 12, 0, 'damage', 0),
    makeSkill('ip_sloth_l3', 'sloth', 3, '心如止水', '剥离他人评价的杂质，看到真实的自己', 12, 22, 10, 'buff', 30),
    makeSkill('ip_tiger_l1', 'tiger', 1, '坦诚倾诉', '表达自己的真实感受，不压抑', 5, 10, 0, 'damage', 0),
    makeSkill('ip_tiger_l2', 'tiger', 2, '边界划定', '明确说出不喜欢的事，这是对自己的尊重', 10, 20, 0, 'damage', 0),
    makeSkill('ip_tiger_l3', 'tiger', 3, '拥抱破冰', '主动释放善意，打破僵局', 15, 32, 5, 'buff', 40),
    makeSkill('ip_snake_l1', 'snake', 1, '换位共情', '意识到对方也和你一样焦虑', 5, 8, 0, 'damage', 0),
    makeSkill('ip_snake_l2', 'snake', 2, '理解局限', '意识到他人也有软肋和局限', 10, 16, 0, 'damage', 0),
    makeSkill('ip_snake_l3', 'snake', 3, '关系化简', '只珍惜那些真诚的连接，其他的随缘', 14, 26, 5, 'buff', 35),
    makeSkill('ip_eagle_l1', 'eagle', 1, '说出心声', '对一个重要的人说出一句真实感受，不再掩饰', 10, 8, 5, 'heal', 0),
    makeSkill('ip_eagle_l2', 'eagle', 2, '提出需求', '直接要求你需要的支持或个人空间', 20, 18, 0, 'damage', 0),
    makeSkill('ip_eagle_l3', 'eagle', 3, '主动修复', '迈出修复一段关系的第一步，不等对方先行动', 30, 32, 5, 'buff', 40),
  ],
};

// ═══════════════════════════════════════════════════════
// ④ FAMILY OF ORIGIN — 小鹿铃风 vs 壳壳魔
// ═══════════════════════════════════════════════════════
const FAMILY_ORIGIN: CategoryPreset = {
  hero: {
    name: '坚韧小鹿「铃风」',
    story: '一只在森林风雨中独立行走的小鹿，鹿角上挂着细小的风铃，每走一步都发出清脆悦耳的声音。它说："我可以回头看，但不再往回走。"',
    imageUrl: '/hero-monster/deer.png',
    skills: [],
  },
  monster: {
    name: '沉重寄居蟹「壳壳魔」',
    story: '一只背着沉重、破旧且不属于自己的老旧贝壳的寄居蟹。它拖着这个壳艰难爬行，却舍不得放下——"这是爸爸妈妈留给我的，怎么能丢呢？"',
    attacks: ['负重羁绊：背负不属于自己的期待和压力', '旧日投影：不由自主地重复童年的应对模式', '情感锁链：因家庭缘故无法完全独立做决定'],
    imageUrl: '/hero-monster/hermitcrab.png',
  },
  cbtAnalysis: `壳壳魔背着那个破旧的壳艰难爬行，这背后其实是一个孩子对「家」与「归属感」最深沉、最忠诚的渴望。你是多么勇敢啊，为了保护那份安全感，承担了这么多不属于你的重量。ACT 疗法告诉我们：我们无法选择出身，但我们有权选择当下的「行为承诺」。那个壳，是上一代人为了生存而留下的，它不应该成为你奔跑的负担。当你决定放下旧壳的那一刻，并不是在背叛过去，而是在为自己种植未来。你完全有力量在属于你自己的森林里，筑造一个轻盈又温暖的新家。`,
  victoryText: `小鹿铃风轻快地在林间漫步，她用鹿角轻轻敲了敲寄居蟹那沉重的贝壳。那层充满岁月灰尘的旧壳开始发光，接着像烟花一样碎裂，化作了漫天的绿叶。寄居蟹从旧壳中跳出来，换上了一个闪着珍珠光泽、无比轻盈的新贝壳。它变成了一只穿着小雨靴的快乐海蟹，在沙滩上用沙子堆起了一座写着「家」的小堡垒。海风吹来，堡垒里长出了茂盛的新芽，它向你挥舞着小螯，示意那条通往未来的路现在完全由你自己决定。`,
  skills: [
    makeSkill('fo_turtle_l1', 'turtle', 1, '命名伤痛', '承认那些不适感，给它一个名字', 3, 0, 10, 'heal', 0),
    makeSkill('fo_turtle_l2', 'turtle', 2, '客观化经历', '告诉自己：这已经是过去式了', 8, 5, 0, 'debuff', 20),
    makeSkill('fo_turtle_l3', 'turtle', 3, '自我接纳', '我不完美，但我也是独立的个体', 12, 10, 30, 'shield', 45),
    makeSkill('fo_sloth_l1', 'sloth', 1, '聆听心跳', '关注自己当下的情绪和身体感受', 4, 5, 8, 'heal', 0),
    makeSkill('fo_sloth_l2', 'sloth', 2, '足底感知', '扎根于现在的环境，感受脚下的地面', 8, 12, 0, 'damage', 0),
    makeSkill('fo_sloth_l3', 'sloth', 3, '林间静心', '跳出家庭叙事背景，以旁观者角度看自己', 12, 22, 10, 'buff', 30),
    makeSkill('fo_tiger_l1', 'tiger', 1, '迈出一步', '尝试独立做一个小决定', 5, 10, 0, 'damage', 0),
    makeSkill('fo_tiger_l2', 'tiger', 2, '开辟新径', '建立自己的社交圈和生活方式', 10, 20, 0, 'damage', 0),
    makeSkill('fo_tiger_l3', 'tiger', 3, '风铃指引', '温柔但坚定地拒绝不合理的期待', 15, 32, 5, 'buff', 45),
    makeSkill('fo_snake_l1', 'snake', 1, '区分界限', '那是他们的课题，不是我的', 5, 8, 0, 'damage', 0),
    makeSkill('fo_snake_l2', 'snake', 2, '珍视自我', '我的需求同样重要，不必为此愧疚', 10, 16, 0, 'damage', 0),
    makeSkill('fo_snake_l3', 'snake', 3, '新生发芽', '建立属于自己的家，定义自己的归属', 14, 26, 8, 'buff', 35),
    makeSkill('fo_eagle_l1', 'eagle', 1, '命名旧伤', '说出一件影响至今的童年经历，不再回避它的存在', 10, 8, 5, 'heal', 0),
    makeSkill('fo_eagle_l2', 'eagle', 2, '设定界限', '对家人说出一条你需要的边界，用成年人身份表达', 20, 18, 0, 'damage', 0),
    makeSkill('fo_eagle_l3', 'eagle', 3, '直面创伤', '以旁观者角度重新进入最深的家庭痛点，不再逃走', 30, 32, 0, 'buff', 45),
  ],
};

// ═══════════════════════════════════════════════════════
// ⑤ SOCIAL ENVIRONMENT — 树袋熊棉棉 vs 迷失魔
// ═══════════════════════════════════════════════════════
const SOCIAL_ENVIRONMENT: CategoryPreset = {
  hero: {
    name: '真我树袋熊「棉棉」',
    story: '一只穿着舒适亚麻睡衣的树袋熊，它按照自己的节奏生活，抱着树干闭目养神，完全不在意别人怎么活。它说："全世界都在赶路，而我在赶觉。"',
    imageUrl: '/hero-monster/koala.png',
    skills: [],
  },
  monster: {
    name: '虚荣变色龙「迷失魔」',
    story: '一只为了迎合周围环境不断飞速改变自己颜色的变色龙。它的眼睛已经混乱得转起了漩涡，因为它已经忘了——自己最初到底是什么颜色？',
    attacks: ['幻影变色：过度模仿他人以求安全感', '信息过量：沉溺于他人的动态中无法自拔', '真我迷失：为了迎合环境而牺牲个人爱好'],
    imageUrl: '/hero-monster/chameleon.png',
  },
  cbtAnalysis: `变色龙频繁变换着颜色，这正是因为你有着敏锐的环境感知力，你渴望被这个世界认可、被主流接纳，这是多么努力生活的证明！但认知重构告诉我们：当我们为了迎合外界的灯光而无限更换自己的底色时，我们反而失去了最珍贵的独特性。你不需要成为某种颜色才被看见。像树袋熊一样，找到那棵属于你自己的树吧。当你在内心深处确定了「我之所以是我，是因为我有自己的底色」时，变色龙就会停止闪烁，变回那个自然、纯净、独一无二的翠绿色。`,
  victoryText: `树袋熊棉棉抱住变色龙，用它的体温温暖着那个不断闪烁的小家伙。变色龙终于停止了疯狂的色彩变换，它身上的霓虹色褪去，恢复成了最纯净、最舒适的翠绿色。它看起来既安详又满足。最后，变色龙变成了一只系着彩色丝带的树蛙，它跳到棉棉的肩头，指着远方。原本那片混乱的虚荣光影，化作了一串串清澈的水滴，每一滴水珠里都映射出你最初出发时的样子——那个底色纯粹、无需迎合，就能闪闪发光的你。`,
  skills: [
    makeSkill('se_turtle_l1', 'turtle', 1, '屏蔽干扰', '放下比较的念头，专注自己的事', 3, 0, 10, 'heal', 0),
    makeSkill('se_turtle_l2', 'turtle', 2, '回归底色', '想起我原本是谁，我的价值不由他人定义', 8, 5, 5, 'debuff', 20),
    makeSkill('se_turtle_l3', 'turtle', 3, '定力光环', '不被外界浪潮影响，做自己的定海神针', 12, 10, 30, 'shield', 45),
    makeSkill('se_sloth_l1', 'sloth', 1, '感知重心', '找到自己的节奏，不是别人的节拍', 4, 5, 5, 'heal', 0),
    makeSkill('se_sloth_l2', 'sloth', 2, '拥抱本我', '停下来，看看自己原本的样子', 8, 12, 0, 'damage', 0),
    makeSkill('se_sloth_l3', 'sloth', 3, '本真聚焦', '屏蔽多余的社交信息，只关注对自己的意义', 12, 22, 10, 'buff', 30),
    makeSkill('se_tiger_l1', 'tiger', 1, '清理关注', '取关那些让你焦虑和不舒服的账号', 5, 12, 0, 'damage', 0),
    makeSkill('se_tiger_l2', 'tiger', 2, '自我评价', '用我的价值标准衡量我，而不是他人的', 10, 20, 0, 'damage', 0),
    makeSkill('se_tiger_l3', 'tiger', 3, '真我表达', '只展现真实的爱好和想法，不伪装', 15, 32, 0, 'damage', 45),
    makeSkill('se_snake_l1', 'snake', 1, '需求扫描', '我到底需要什么？还是只是想要？', 5, 8, 0, 'damage', 0),
    makeSkill('se_snake_l2', 'snake', 2, '审美重定义', '独特比流行更美，小众不等于错误', 10, 16, 0, 'damage', 0),
    makeSkill('se_snake_l3', 'snake', 3, '建立小岛', '建立属于自己的圈子和世界', 14, 26, 8, 'buff', 35),
    makeSkill('se_eagle_l1', 'eagle', 1, '说出异见', '在安全的小范围内表达与多数人不同的观点', 10, 8, 5, 'heal', 0),
    makeSkill('se_eagle_l2', 'eagle', 2, '抵制压力', '当众拒绝一个来自外部的不合理社会期待', 20, 18, 0, 'damage', 0),
    makeSkill('se_eagle_l3', 'eagle', 3, '公开立场', '在重要场合说出真实的自己，不伪装成别人期待的样子', 30, 32, 0, 'buff', 45),
  ],
};

// ═══════════════════════════════════════════════════════
// ⑥ PHYSICAL HEALTH — 海獭滑板仔 vs 黑眼魔
// ═══════════════════════════════════════════════════════
const PHYSICAL_HEALTH: CategoryPreset = {
  hero: {
    name: '活力海獭「滑板仔」',
    story: '一只踩着迷你滑板的海獭，戴着红色的运动头带，四脚朝天地浮在水面上，与水流和谐共处。它说："有时候，最好的前进方式就是躺平，让水流推着你走。"',
    imageUrl: '/hero-monster/otter.png',
    skills: [],
  },
  monster: {
    name: '熬夜浣熊「黑眼魔」',
    story: '一只眼圈极黑的浣熊，大半夜在水边疯狂清洗根本不脏的树叶，它已经三天没睡了——"再洗一片就好了，万一这片也很脏呢？"',
    attacks: ['强迫循环：重复检查无关事项，停不下来', '黑夜侵扰：深夜无法入眠的胡思乱想', '焦虑透支：透支精力来换取虚假的安全感'],
    imageUrl: '/hero-monster/raccoon.png',
  },
  cbtAnalysis: `黑眼魔不眠不休地清洗树叶，这分明是你的身体在用一种极端的方式向你求救，因为它太爱这个世界，太想好好活着了！但请记住心理学中的「身体觉察」原则：你的焦虑本身，就是一种需要被温柔对待的症状。当你深夜里还在强迫自己做些什么时，那其实是内心在恐惧未来的不确定性。试着把那个动作停下来，抱抱自己。当你学会像海獭一样顺水推舟，相信身体那股天然的自我修复力，黑眼魔会明白，休息也是一种极其高级的自我保护。`,
  victoryText: `海獭滑板仔拉着浣熊漂浮在水面上，温柔地替它洗净了手中那片搓烂的树叶。浣熊眼圈的黑色渐渐褪去，露出了清澈明亮的双眸。它轻轻闭上眼睛，发出了一串又一串软糯的鼾声。随着鼾声，黑眼魔化作了一只抱着星星枕头的圆滚浣熊，它将枕头稳稳地放在你的床头。它挥手变出一张写着「今日份已圆满」的休息申请单，随后变成了一只发着荧光的萤火虫，点亮了你今晚通往甜美梦乡的小路。`,
  skills: [
    makeSkill('ph_turtle_l1', 'turtle', 1, '接受倦意', '累了就该休息，这不是懒惰是智慧', 3, 0, 12, 'heal', 0),
    makeSkill('ph_turtle_l2', 'turtle', 2, '听取信号', '身体在给我信号，不是威胁是提醒', 8, 5, 8, 'debuff', 20),
    makeSkill('ph_turtle_l3', 'turtle', 3, '恢复自然', '完全接纳身体的自我修复能力', 12, 10, 25, 'shield', 40),
    makeSkill('ph_sloth_l1', 'sloth', 1, '浮水扫描', '感受全身肌肉的紧绷和放松', 4, 5, 5, 'heal', 0),
    makeSkill('ph_sloth_l2', 'sloth', 2, '缓慢呼吸', '平复急促的心率，拉长每一次呼吸', 8, 12, 8, 'heal', 0),
    makeSkill('ph_sloth_l3', 'sloth', 3, '安抚循环', '停止无意义的强迫动作，相信已经够了', 12, 22, 15, 'buff', 30),
    makeSkill('ph_tiger_l1', 'tiger', 1, '强制关机', '放下电子设备，创造一个无屏幕的空间', 5, 10, 0, 'damage', 0),
    makeSkill('ph_tiger_l2', 'tiger', 2, '规律重置', '只做一件放松的事，而不是什么都不做', 10, 20, 0, 'damage', 0),
    makeSkill('ph_tiger_l3', 'tiger', 3, '阳光洗礼', '走进自然，让阳光重置你的生物钟', 15, 32, 5, 'buff', 40),
    makeSkill('ph_snake_l1', 'snake', 1, '倾听需求', '这不是病，是身体在向你求救', 5, 8, 0, 'damage', 0),
    makeSkill('ph_snake_l2', 'snake', 2, '健康重定义', '不追求完美的身体机能，而是整体的幸福感', 10, 16, 0, 'damage', 0),
    makeSkill('ph_snake_l3', 'snake', 3, '梦境重启', '睡个好觉就是最伟大的成就', 14, 26, 10, 'buff', 35),
    makeSkill('ph_eagle_l1', 'eagle', 1, '正视症状', '认真记录并承认身体发出的警告信号，不再忽视', 10, 8, 5, 'heal', 0),
    makeSkill('ph_eagle_l2', 'eagle', 2, '预约检查', '主动预约一次你一直在推迟的医疗或健康检查', 20, 18, 5, 'heal', 0),
    makeSkill('ph_eagle_l3', 'eagle', 3, '打破习惯', '直面并主动挑战一个损害健康的根深蒂固生活习惯', 30, 32, 0, 'buff', 45),
  ],
};

// ═══════════════════════════════════════════════════════
// ⑦ TIME MANAGEMENT — 乌龟日晷 vs 搬搬魔
// ═══════════════════════════════════════════════════════
const TIME_MANAGEMENT: CategoryPreset = {
  hero: {
    name: '沉稳乌龟「日晷爷爷」',
    story: '一只背上有年轮纹路的古老乌龟，步伐极其缓慢但方向从不偏移。它在海边有一片小茶园，每天只泡一杯茶——"一杯就够了。"它说："人生不是赶路，是散步。"',
    imageUrl: '/hero-monster/turtle.png',
    skills: [],
  },
  monster: {
    name: '盲从工蚁「搬搬魔」',
    story: '一只没有方向地疯狂搬运远超过自身重量杂物的蚂蚁，走得跌跌撞撞、东倒西歪。它背后的杂物山已经快要把它压扁了——但它不敢停下来整理，因为"太忙了，没时间停下来"。',
    attacks: ['杂物陷阱：被无关的小事填满时间', '伪装高效：看起来很忙但没有任何产出', '时间流沙：对时间流逝的恐慌和焦虑'],
    imageUrl: '/hero-monster/ant.png',
  },
  cbtAnalysis: `工蚁搬运着远超身体的重物，是因为你对生命有着极高的尊重，你不愿意浪费哪怕一秒钟的光阴，这种对生命的珍惜令人动容！但 CBT 的「优先级重塑」逻辑提醒你：当我们试图搬运全世界时，我们其实什么也没抓牢。你的焦虑感，来自于把「忙碌」误当作了「充实」。试着练习 ACT 的「价值澄清」：放下那些不属于你的杂物，只拿起那片最珍贵的树叶。乌龟爷爷走得很慢，但他每一步都走在自己的节奏里，每一步都离大海更近。放弃也是一种能力。`,
  victoryText: `乌龟日晷爷爷在工蚁面前停下，挡住了那座如山般的杂物。工蚁试着松开了一根杂草，随后整座杂物山轰然化作清风吹散，只剩下一片最轻盈、最翠绿的叶子。工蚁把叶子背在身后，感觉步伐从未如此轻快。它变成了一只戴着微型草帽的园丁蚁，在日晷的年轮上写下了一行字：「最重要的一件事，就是享受这一刻。」它送给你一个沙漏，但这沙漏里的沙子是彩色的糖果，提醒你：时间不仅用来赶路，更用来品尝。`,
  skills: [
    makeSkill('tm_turtle_l1', 'turtle', 1, '接受有限', '今天做不完也不坏，明天太阳照常升起', 3, 0, 10, 'heal', 0),
    makeSkill('tm_turtle_l2', 'turtle', 2, '顺其自然', '不因进度慢而焦虑，慢就是承认自己的节奏', 8, 5, 5, 'debuff', 20),
    makeSkill('tm_turtle_l3', 'turtle', 3, '时光定格', '专注于当下这一秒，所有焦虑都暂停', 12, 10, 30, 'shield', 45),
    makeSkill('tm_sloth_l1', 'sloth', 1, '感受香茗', '从琐事中抽离片刻，享受一杯茶的时间', 4, 5, 8, 'heal', 0),
    makeSkill('tm_sloth_l2', 'sloth', 2, '光影捕捉', '感受时间是一种流动，而不是一个牢笼', 8, 12, 0, 'damage', 0),
    makeSkill('tm_sloth_l3', 'sloth', 3, '深呼吸感', '降低忙碌带来的急促心跳，回到平静', 12, 22, 10, 'buff', 30),
    makeSkill('tm_tiger_l1', 'tiger', 1, '番茄清单', '只列出三件事，其他的都放一边', 5, 12, 0, 'damage', 0),
    makeSkill('tm_tiger_l2', 'tiger', 2, '优先级排序', '果断丢弃不重要的事，精准保留核心', 10, 20, 0, 'damage', 0),
    makeSkill('tm_tiger_l3', 'tiger', 3, '极简决策', '果断删除杂物，只留下最精华的一项', 15, 32, 0, 'damage', 50),
    makeSkill('tm_snake_l1', 'snake', 1, '定义忙碌', '区分「盲目地忙」和「有效地动」', 5, 8, 0, 'damage', 0),
    makeSkill('tm_snake_l2', 'snake', 2, '放弃艺术', '学会放弃，才能得到真正重要的东西', 10, 16, 0, 'damage', 0),
    makeSkill('tm_snake_l3', 'snake', 3, '金色慢步', '慢慢来，才比较快——重新定义速度', 14, 26, 8, 'buff', 35),
    makeSkill('tm_eagle_l1', 'eagle', 1, '承认浪费', '列出过去一周浪费最多时间的一件事，如实写下它', 10, 8, 5, 'heal', 0),
    makeSkill('tm_eagle_l2', 'eagle', 2, '拒绝消耗', '明确拒绝一件耗时最多但价值最低的活动', 20, 18, 0, 'damage', 0),
    makeSkill('tm_eagle_l3', 'eagle', 3, '价值重构', '从真实价值观出发，重新决定哪件事值得你的时间', 30, 32, 0, 'buff', 45),
  ],
};

// ═══════════════════════════════════════════════════════
// ⑧ EMOTION MANAGEMENT — 树懒禅禅 vs 气鼓魔
// ═══════════════════════════════════════════════════════
const EMOTION_MANAGEMENT: CategoryPreset = {
  hero: {
    name: '静谧树懒「禅禅」',
    story: '一只坐在绿色荷叶上打坐冥想的树懒，呼吸极深极慢，眼睛半闭着，周围散发着柔和的光晕。它说："情绪是访客，你是主人。让它来，看它走，无需挽留也无需驱赶。"',
    imageUrl: '/hero-monster/sloth.png',
    skills: [],
  },
  monster: {
    name: '暴躁河豚「气鼓魔」',
    story: '一只遇到一点刺激就瞬间膨胀全身长满尖刺的河豚，在水中横冲直撞。它其实不想伤害任何人——但它控制不住自己鼓起来。"我只是太敏感了。"它哭着说。',
    attacks: ['尖刺突袭：突然爆发的攻击性言语', '膨胀过载：失控感席卷全身', '反噬伤痛：暴怒后深深的自我悔恨'],
    imageUrl: '/hero-monster/pufferfish.png',
  },
  cbtAnalysis: `河豚一旦受惊就鼓起全身的刺，这说明你拥有非常充沛、细腻的艺术情感，你是如此容易感知到世界的波动。这份敏锐不是缺点，它是你感知美的天赋，是艺术家般的灵魂！但当情绪这个「不速之客」敲门时，千万别让它直接住进客厅。像树懒一样观察它：哦，这是一个名为「愤怒」的访客。你可以注视它，但不用成为它。当你练习「去中心化」的视角，观察那团气鼓鼓的愤怒如何像气泡一样慢慢消散时，你会发现，你依然是这片海域里那个平静的主人。`,
  victoryText: `树懒禅禅慢吞吞地伸出手指，轻轻一点河豚鼓起的肚皮。砰！河豚吐出了一大串晶莹剔透、五颜六色的气泡。气泡里映着你之前感到委屈或愤怒的画面，但现在，这些画面都像老电影一样柔和而遥远。气鼓魔恢复了娇小可爱的模样，变成了一条系着蝴蝶结的小蓝鱼。它围着你欢快地游动，留下了一道道清凉的水痕。它最后吐出一个心形的大气泡，里面包着一张写有「情绪是访客，你是主人」的纸条，随后游进了平静的湖泊深处。`,
  skills: [
    makeSkill('em_turtle_l1', 'turtle', 1, '允许愤怒', '这是正常的人类情绪，不是你的错', 3, 0, 10, 'heal', 0),
    makeSkill('em_turtle_l2', 'turtle', 2, '观察来去', '像看天上的云一样看着情绪飘过', 8, 5, 5, 'debuff', 20),
    makeSkill('em_turtle_l3', 'turtle', 3, '禅定空间', '不让情绪成为你行为的主人', 12, 10, 30, 'shield', 45),
    makeSkill('em_sloth_l1', 'sloth', 1, '缓慢呼吸', '先让呼吸慢下来，情绪自然会跟上', 4, 5, 5, 'heal', 0),
    makeSkill('em_sloth_l2', 'sloth', 2, '情绪命名', '给情绪起个名字："啊，原来这叫愤怒"', 8, 12, 5, 'heal', 0),
    makeSkill('em_sloth_l3', 'sloth', 3, '清凉薄荷', '看情绪如过往云烟，抓住它可以，放开也可以', 12, 22, 15, 'buff', 30),
    makeSkill('em_tiger_l1', 'tiger', 1, '寻找源头', '我为什么会生气？找到那个触发器', 5, 10, 0, 'damage', 0),
    makeSkill('em_tiger_l2', 'tiger', 2, '冷静表达', '说出我的不满，而不是爆发出来', 10, 20, 0, 'damage', 0),
    makeSkill('em_tiger_l3', 'tiger', 3, '暂停策略', '离开现场冷处理，等情绪降温再回来', 15, 32, 5, 'buff', 40),
    makeSkill('em_snake_l1', 'snake', 1, '燃料转化', '将愤怒的能量转化为积极的动力', 5, 8, 0, 'damage', 0),
    makeSkill('em_snake_l2', 'snake', 2, '艺术升华', '把感受画下来、写下来、唱出来', 10, 16, 0, 'damage', 0),
    makeSkill('em_snake_l3', 'snake', 3, '雨后天晴', '看到暴风雨后的平静——情绪只是访客', 14, 26, 10, 'buff', 35),
    makeSkill('em_eagle_l1', 'eagle', 1, '直视触发', '找出让你最容易情绪失控的具体情境，如实命名它', 10, 8, 5, 'heal', 0),
    makeSkill('em_eagle_l2', 'eagle', 2, '表达边界', '向引发情绪的对象说出你的感受和界限，不再隐忍', 20, 18, 0, 'damage', 0),
    makeSkill('em_eagle_l3', 'eagle', 3, '迎向恐惧', '主动进入你一直在情绪上回避的场景，与恐惧正面相遇', 30, 32, 0, 'buff', 45),
  ],
};

// ═══════════════════════════════════════════════════════
// PRESET MAP + EXPORT
// ═══════════════════════════════════════════════════════

const PRESETS: Record<WorryCategory, CategoryPreset> = {
  work_stress: WORK_STRESS,
  learning_growth: LEARNING_GROWTH,
  interpersonal: INTERPERSONAL,
  family_origin: FAMILY_ORIGIN,
  social_environment: SOCIAL_ENVIRONMENT,
  physical_health: PHYSICAL_HEALTH,
  time_management: TIME_MANAGEMENT,
  emotion_management: EMOTION_MANAGEMENT,
};

export interface OfflinePreset {
  hero: HeroData;
  monster: MonsterData;
  cbtAnalysis: string;
  victoryText: string;
  skills: BattleSkill[];
  tasks: DailyTask[];
}

export function getOfflinePreset(worryText: string, worryType: WorryCategory): OfflinePreset {
  const preset = PRESETS[worryType] ?? PRESETS.emotion_management;

  // Attach skill refs to hero
  const heroWithSkills: HeroData = {
    ...preset.hero,
    skills: refs(preset.skills),
  };

  // Generate daily tasks
  const tasks = generateDailyTasks(worryType, 1);

  return {
    hero: heroWithSkills,
    monster: preset.monster,
    cbtAnalysis: preset.cbtAnalysis,
    victoryText: preset.victoryText,
    skills: preset.skills,
    tasks,
  };
}
