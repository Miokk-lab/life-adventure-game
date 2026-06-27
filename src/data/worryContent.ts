import type { WorryCategory, DailyTask } from '../types';
import { getWorryI18n } from './worryContentI18n';

export interface SortGameData { baskets: { key: string; label: string; emoji: string }[]; items: { text: string; basket: string }[]; }
export interface MiniGameDef { id: string; name: string; emoji: string; description: string; template?: string; sortData?: SortGameData; }

export interface WorryGameContent {
  tasks: { type: string; descriptions: string[]; targets: number[]; rewards: DailyTask['reward'][] }[];
  miniGames: MiniGameDef[];
  teas: { name: string; emoji: string; cost: number; stamina: number; desc: string; ingredients: string[] }[];
}

// ALL teas must have names that include 2-3 actual ingredients, and those ingredients must exist in the ALL_INGREDIENTS pool
// Ingredient pool: mint(薄荷), chamomile(洋甘菊), peach(蜜桃), oolong(乌龙), orange(甜橙), lavender(薰衣草), cosmos(波斯菊), lily(百合), rose(玫瑰), lemon(柠檬), ginger(生姜), honey(蜂蜜)

const CONTENT: Record<WorryCategory, WorryGameContent> = {
  work_stress: {
    tasks: [
      { type: 'breathing', descriptions: ['闭上眼睛，用4-7-8呼吸法给自己一个3分钟的工间休息。','在办公桌前做5次深长的腹式呼吸，感受肩膀一点点放松下来。','找一个安静的角落，闭上眼睛只聆听周围的5种声音，深呼吸。'], targets: [3,5,5], rewards: [{mpBonus:2,exp:15},{mpBonus:3,exp:20},{mpBonus:2,exp:15}] },
      { type: 'sorting', descriptions: ['把今天的工作任务分成"必须做"、"可以做"、"可以不做"三篮。','找出3件你无法控制的职场因素放在"放手篮"里。','把让你焦虑的工作邮件归档到"需要回复"和"仅供参考"两篮。'], targets: [3,3,2], rewards: [{exp:15},{exp:15},{exp:15}] },
      { type: 'writing', descriptions: ['给你最让你焦虑的那个项目写一封信："我已经尽力了，其他的交给时间。"','写下你这周工作中感到骄傲的一件小事，投递到树洞里。','给自己写一张"下班许可证"，宣布今天的工作到此结束。'], targets: [1,1,1], rewards: [{exp:20},{exp:15},{exp:15}] },
      { type: 'action', descriptions: ['站起来给自己倒一杯水，一口一口慢慢喝完它。','离开办公桌走到窗边，看着外面的天空慢慢喝一杯水。','给自己泡一杯热饮，感受杯子传来的温暖，小口品尝。'], targets: [5,5,5], rewards: [{exp:25},{exp:15},{exp:20}] },
      { type: 'gratitude', descriptions: ['在三个花瓣上写下工作中让你感谢的三件事。','写下一个帮助过你的同事的名字，在心里说谢谢。','写下这份工作带给你的3个正面改变。'], targets: [3,1,3], rewards: [{exp:15},{exp:10},{exp:15}] },
      { type: 'movement', descriptions: ['站起来从头顶到脚趾慢慢活动每一个关节，跟随引导做60秒。','走出办公室慢走，注意脚底接触地面的感觉。','做10次缓慢的肩颈转动，释放伏案工作的紧张。'], targets: [60,60,10], rewards: [{mpBonus:3,exp:15},{mpBonus:2,exp:20},{mpBonus:2,exp:15}] },
    ],
    miniGames: [
      { id: 'breathing', name: '工间呼吸法', emoji: '🍃', description: '释放工作压力，用4-7-8呼吸法平复紧张。' },
      { id: 'cloud', name: '放飞工作焦虑', emoji: '☁️', description: '把盘旋在脑海的工作烦恼写在云上，让风吹散。' },
      { id: 'sorting', name: '任务优先级整理', emoji: '🧺', description: '帮你理清什么是真正重要的，放下不必要的负担。' },
    ],
    teas: [
      { name: '薄荷洋甘菊安神茶', emoji: '🍵', cost: 30, stamina: 30, desc: '缓解工作紧张，帮助身心放松。', ingredients: ['mint','chamomile'] },
      { name: '蜜桃乌龙元气茶', emoji: '🧋', cost: 80, stamina: 60, desc: '补充精力，但不带来咖啡因焦虑。', ingredients: ['peach','oolong'] },
      { name: '薰衣草百合星空茶', emoji: '✨', cost: 150, stamina: 120, desc: '深度放松，帮你从工作模式切换到休息模式。', ingredients: ['lavender','lily','cosmos'] },
    ],
  },
  learning_growth: {
    tasks: [
      { type: 'breathing', descriptions: ['学习前做3次深呼吸清空脑中杂念再开始。','感到学习效率下降时停下来闭眼深呼吸2分钟。','用478呼吸法在考试或学习焦虑袭来时快速平静。'], targets: [3,2,3], rewards: [{mpBonus:2,exp:15},{mpBonus:2,exp:15},{mpBonus:3,exp:20}] },
      { type: 'sorting', descriptions: ['把要学的内容分成"核心概念"、"次要细节"、"可以跳过"三篮。','找出3个让你学习焦虑的念头，分析哪些是事实哪些是恐惧。','整理你的学习资料，把过时的、不需要的放入"丢弃篮"。'], targets: [3,3,1], rewards: [{exp:15},{exp:15},{exp:15}] },
      { type: 'writing', descriptions: ['写下你选择学习这个领域的初心和长远目标，投进树洞。','用自己的话重新解释今天学到的一个新概念，写成信。','给自己写一句鼓励的话投进树洞："进步不需要完美，只需要持续。"'], targets: [1,1,1], rewards: [{exp:20},{exp:15},{exp:15}] },
      { type: 'action', descriptions: ['站起来给自己倒一杯水，在喝水的同时回顾今天学到的要点。','把手机调成勿扰模式，喝着水专注学习25分钟。','每完成一个学习模块就奖励自己喝一口水。'], targets: [5,5,5], rewards: [{exp:25},{exp:20},{exp:25}] },
      { type: 'gratitude', descriptions: ['在三个花瓣上写下学习带给你的3个正面改变。','写下一位支持你学习的老师或朋友的名字，感谢他们。','感谢自己今天愿意花时间学习和成长。'], targets: [3,1,1], rewards: [{exp:15},{exp:10},{exp:15}] },
      { type: 'movement', descriptions: ['每学习45分钟后站起来伸展身体，跟随引导做60秒。','学习间隙去窗边远眺让眼睛和大脑休息，同时活动身体。','做一套简单的颈部放松操释放低头学习的紧张。'], targets: [60,60,10], rewards: [{mpBonus:2,exp:15},{mpBonus:2,exp:15},{mpBonus:2,exp:15}] },
    ],
    miniGames: [
      { id: 'sorting', name: '知识整理术', emoji: '🧺', description: '帮你把碎片化的知识归入体系，减少学习焦虑。' },
      { id: 'breathing', name: '考前静心法', emoji: '🍃', description: '在考试或重要学习任务前平复紧张心情。' },
      { id: 'cloud', name: '驱散冒名顶替感', emoji: '☁️', description: '把"我不够好"的想法写下来，然后吹散它们。' },
    ],
    teas: [
      { name: '薄荷柠檬专注茶', emoji: '🍵', cost: 30, stamina: 30, desc: '提升专注力，帮助进入深度思考状态。', ingredients: ['mint','lemon'] },
      { name: '蜜桃乌龙元气茶', emoji: '🧋', cost: 80, stamina: 60, desc: '温和提神，适合长时间学习。', ingredients: ['peach','oolong'] },
      { name: '薰衣草洋甘菊安睡茶', emoji: '✨', cost: 150, stamina: 120, desc: '学习后帮助大脑放松，改善睡眠质量。', ingredients: ['lavender','chamomile'] },
    ],
  },
  interpersonal: {
    tasks: [
      { type: 'breathing', descriptions: ['在社交场合感到紧张时做3次缓慢的腹式呼吸。','接到一个让你紧张的消息或电话前先深呼吸5次。','每天睡前做3分钟呼吸练习释放社交带来的心理疲劳。'], targets: [3,5,3], rewards: [{mpBonus:2,exp:15},{mpBonus:3,exp:20},{mpBonus:2,exp:15}] },
      { type: 'sorting', descriptions: ['区分"别人的看法"和"事实"——各放一篮。','把让你困扰的人际关系分成"可以修复"和"需要放手"两篮。','找出你过度迎合他人的3个场景放入"需要改变"篮。'], targets: [2,2,3], rewards: [{exp:15},{exp:15},{exp:15}] },
      { type: 'writing', descriptions: ['给你最在乎但最近有矛盾的人写一封不寄出的信投进树洞。','写下你觉得"被理解"的三个瞬间寄给自己。','用一段话描述你理想的社交边界是什么样子的投进树洞。'], targets: [1,3,1], rewards: [{exp:20},{exp:15},{exp:15}] },
      { type: 'action', descriptions: ['给自己倒一杯水，每喝一口在心里对一个人说一句善意的话。','练习说一次"不"——从一件小事开始，然后喝口水庆祝。','主动给一个你信任的朋友发一条简短问候，然后喝口水。'], targets: [5,5,5], rewards: [{exp:25},{exp:25},{exp:20}] },
      { type: 'gratitude', descriptions: ['在三个花瓣上写下3个让你感到温暖的人际关系。','写下一个曾经在你困难时帮助过你的人的名字。','感谢自己今天有勇气面对人际挑战。'], targets: [3,1,1], rewards: [{exp:15},{exp:10},{exp:15}] },
      { type: 'movement', descriptions: ['紧张时握紧拳头5秒然后松开，感受从紧张到放松的变化，做够60秒。','做一次"身体边界"练习：感受你的身体占据的空间。','对着镜子给自己一个微笑，配合轻松的肩颈活动。'], targets: [60,30,10], rewards: [{mpBonus:2,exp:15},{mpBonus:2,exp:15},{mpBonus:2,exp:15}] },
    ],
    miniGames: [
      { id: 'cloud', name: '社交焦虑云', emoji: '☁️', description: '把对他人评价的担忧写在云上，让它们飘走。' },
      { id: 'breathing', name: '冲突冷静法', emoji: '🍃', description: '在人际冲突中保持冷静的呼吸技巧。' },
      { id: 'shell_collect', name: '感恩贝壳', emoji: '🐚', description: '收集代表美好人际关系的贝壳。' },
    ],
    teas: [
      { name: '玫瑰蜂蜜自爱茶', emoji: '🍵', cost: 30, stamina: 30, desc: '温柔呵护自己，建立健康的自爱能力。', ingredients: ['rose','honey'] },
      { name: '薄荷洋甘菊清凉茶', emoji: '🧋', cost: 80, stamina: 60, desc: '在情绪激动时保持头脑清醒。', ingredients: ['mint','chamomile'] },
      { name: '薰衣草百合舒心茶', emoji: '✨', cost: 150, stamina: 120, desc: '释放社交压力，回归内心平静。', ingredients: ['lavender','lily'] },
    ],
  },
  family_origin: {
    tasks: [
      { type: 'breathing', descriptions: ['当家庭话题让你情绪波动时停下来深呼吸5次。','每天早晨做3分钟呼吸冥想建立一天的情绪基础。','在给家人打电话前先做3次深呼吸让自己平静下来。'], targets: [5,3,3], rewards: [{mpBonus:3,exp:20},{mpBonus:2,exp:15},{mpBonus:2,exp:15}] },
      { type: 'sorting', descriptions: ['区分"父母的期待"和"我自己想要的生活"——分两篮。','把童年记忆分成"温暖的"和"需要疗愈的"两篮。','找出3个你从原生家庭继承的行为模式放入"需要改变"篮。'], targets: [2,2,3], rewards: [{exp:20},{exp:15},{exp:20}] },
      { type: 'writing', descriptions: ['给小时候的自己写一封信投进树洞："你已经做得很好了。"','写下你认为"家"应该是什么样的——用你自己的定义。','记录下一次你意识到自己在重复家庭模式时的感受，写成信。'], targets: [1,1,1], rewards: [{exp:25},{exp:20},{exp:15}] },
      { type: 'action', descriptions: ['给自己倒一杯温水，每喝一口在心里对自己说一句温柔的话。','做一件完全为了自己、不考虑家人看法的小事，然后喝口水庆祝。','为自己布置一个只属于你的空间角落，完成后喝杯水休息。'], targets: [5,5,5], rewards: [{exp:25},{exp:25},{exp:20}] },
      { type: 'gratitude', descriptions: ['在花瓣上写下家庭带给你的3个积极影响。','写下你在成长过程中展现出的坚韧和勇气。','感谢家庭中有一个人曾经理解过你。'], targets: [3,1,1], rewards: [{exp:15},{exp:10},{exp:15}] },
      { type: 'movement', descriptions: ['做一次"扎根"练习：双脚站稳感受地面支撑你的力量。','用身体画一个圆圈象征你为自己设立的边界。','抱住自己给自己一个拥抱持续30秒。'], targets: [60,3,30], rewards: [{mpBonus:2,exp:15},{mpBonus:2,exp:15},{mpBonus:3,exp:15}] },
    ],
    miniGames: [
      { id: 'sorting', name: '过去与现在', emoji: '🧺', description: '区分哪些是过去的伤痛，哪些是现在可以改变的选择。' },
      { id: 'breathing', name: '触发点冷静', emoji: '🍃', description: '当家庭话题触发情绪时用呼吸找回平静。' },
      { id: 'cloud', name: '放下旧壳', emoji: '☁️', description: '把不属于你的期待和责任放走。' },
    ],
    teas: [
      { name: '洋甘菊蜂蜜暖心茶', emoji: '🍵', cost: 30, stamina: 30, desc: '给内心小孩一个温暖的拥抱。', ingredients: ['chamomile','honey'] },
      { name: '玫瑰薰衣草安宁茶', emoji: '🧋', cost: 80, stamina: 60, desc: '安抚过去的伤痛，找到内心的平静。', ingredients: ['rose','lavender'] },
      { name: '百合薄荷新生茶', emoji: '✨', cost: 150, stamina: 120, desc: '重新认识自己的价值，不被过去定义。', ingredients: ['lily','mint','cosmos'] },
    ],
  },
  social_environment: {
    tasks: [
      { type: 'breathing', descriptions: ['刷社交媒体感到焦虑时做5次深呼吸。','每天安排3分钟不看手机不做任何事的纯呼吸时间。','看到让人产生比较心理的内容时立刻闭眼呼吸10秒。'], targets: [5,3,1], rewards: [{mpBonus:3,exp:20},{mpBonus:2,exp:15},{mpBonus:2,exp:15}] },
      { type: 'sorting', descriptions: ['区分"我真正喜欢的东西"和"社会告诉我应该喜欢的东西"。','列出3个你为了迎合他人而做的改变放入"可以放下"篮。','把社交关注列表分成"滋养我的"和"消耗我的"两篮。'], targets: [2,3,2], rewards: [{exp:20},{exp:15},{exp:15}] },
      { type: 'writing', descriptions: ['写下你最珍视的3个核心价值观投进树洞——不看任何人脸色。','描述一个你感到完全做自己的时刻写成信寄给自己。','写一句话投进树洞："我不需要成为别人，我就是我。"'], targets: [3,1,1], rewards: [{exp:15},{exp:20},{exp:15}] },
      { type: 'action', descriptions: ['给自己倒一杯水慢慢喝，每喝一口提醒自己"我的价值不由他人定义"。','取消关注3个让你感到焦虑的账号然后喝口水庆祝。','穿着你最舒服的衣服喝一杯水，不在意别人怎么看。'], targets: [5,5,5], rewards: [{exp:25},{exp:25},{exp:20}] },
      { type: 'gratitude', descriptions: ['在三个花瓣上写下3个你欣赏自己的独特之处。','写下一个包容你、接纳你的人的名字。','感谢世界上有人欣赏真实的你。'], targets: [3,1,1], rewards: [{exp:15},{exp:10},{exp:15}] },
      { type: 'movement', descriptions: ['做一次"自我空间"练习：伸展四肢感受你占据的空间。','跟着你喜欢的音乐随意摇摆，不用在意舞姿。','对着镜子摆一个自信的姿势保持30秒。'], targets: [60,60,30], rewards: [{mpBonus:2,exp:15},{mpBonus:2,exp:15},{mpBonus:2,exp:15}] },
    ],
    miniGames: [
      { id: 'cloud', name: '吹散他人眼光', emoji: '☁️', description: '把外界评判写在云上，让它们随风飘散。' },
      { id: 'sorting', name: '真我vs迎合', emoji: '🧺', description: '区分哪些是你真正的喜好，哪些是为了迎合他人。' },
      { id: 'breathing', name: '内心定锚', emoji: '🍃', description: '在喧闹的世界中找到属于自己的宁静中心。' },
    ],
    teas: [
      { name: '薄荷柠檬清心茶', emoji: '🍵', cost: 30, stamina: 30, desc: '清除杂念，找回自己的声音。', ingredients: ['mint','lemon'] },
      { name: '蜜桃洋甘菊新生茶', emoji: '🧋', cost: 80, stamina: 60, desc: '焕然一新，重新认识真实的自己。', ingredients: ['peach','chamomile'] },
      { name: '薰衣草玫瑰内宁茶', emoji: '✨', cost: 150, stamina: 120, desc: '在纷扰中保持内心的宁静。', ingredients: ['lavender','rose'] },
    ],
  },
  physical_health: {
    tasks: [
      { type: 'breathing', descriptions: ['做5次深长的腹式呼吸感受腹部的起伏。','睡前做3分钟的478呼吸法帮助入睡。','早上起床前做3次伸展呼吸唤醒身体。'], targets: [5,3,3], rewards: [{mpBonus:3,exp:20},{mpBonus:2,exp:15},{mpBonus:2,exp:15}] },
      { type: 'sorting', descriptions: ['把健康习惯分成"已经做到的"和"想要养成的"两篮。','找出3个损害你健康的行为放入"需要改变"篮。','区分"身体真的累了"和"心理上的疲惫感"分两篮。'], targets: [2,3,1], rewards: [{exp:15},{exp:15},{exp:15}] },
      { type: 'writing', descriptions: ['记录今天身体的感受：哪里紧绷？哪里放松？写成信投进树洞。','写下你对健康的3个小目标寄给自己。','给你身体最累的部位写一句感谢的话投进树洞。'], targets: [1,3,1], rewards: [{exp:20},{exp:15},{exp:15}] },
      { type: 'action', descriptions: ['慢慢喝一杯温水，感受水从喉咙流到胃里的过程。','站起来给自己倒一杯水，一边喝一边做简单的全身拉伸。','每喝一口水在心里感谢身体的一个部位。'], targets: [5,5,5], rewards: [{exp:20},{exp:25},{exp:25}] },
      { type: 'gratitude', descriptions: ['在花瓣上写下一件你感谢身体为你做的事。','写下身体让你能够享受的3件事：走路、吃饭、拥抱。','感谢身体经历过许多但依然坚强地支撑着你。'], targets: [1,3,1], rewards: [{exp:10},{exp:15},{exp:15}] },
      { type: 'movement', descriptions: ['从头到脚做一次身体扫描，注意每个部位的感觉。','慢走并感受脚底与地面的每次接触。','伸展你的肩膀和背部释放一天积累的紧张。'], targets: [60,60,10], rewards: [{mpBonus:4,exp:15},{mpBonus:2,exp:20},{mpBonus:3,exp:15}] },
    ],
    miniGames: [
      { id: 'breathing', name: '身体觉察呼吸', emoji: '🍃', description: '通过呼吸重新连接你的身体，感受每个部位。' },
      { id: 'movement', name: '温柔伸展', emoji: '🧘', description: '轻柔地活动身体，释放积累的紧张。' },
      { id: 'shell_collect', name: '感官贝壳', emoji: '🐚', description: '收集代表不同感官体验的贝壳，增强身体觉察。' },
    ],
    teas: [
      { name: '生姜蜂蜜暖身茶', emoji: '🍵', cost: 30, stamina: 30, desc: '温暖身体，促进循环。', ingredients: ['ginger','honey'] },
      { name: '洋甘菊薄荷安眠茶', emoji: '🧋', cost: 80, stamina: 60, desc: '帮助入睡，改善休息质量。', ingredients: ['chamomile','mint'] },
      { name: '柠檬薰衣草清新茶', emoji: '✨', cost: 150, stamina: 120, desc: '焕新身体，重获活力。', ingredients: ['lemon','lavender'] },
    ],
  },
  time_management: {
    tasks: [
      { type: 'breathing', descriptions: ['感到时间不够用时做3次深呼吸回到当下。','在任务切换之间做1分钟呼吸停顿。','一天结束时做3分钟呼吸冥想放下"还要做更多"的执念。'], targets: [3,1,3], rewards: [{mpBonus:2,exp:15},{mpBonus:2,exp:15},{mpBonus:3,exp:20}] },
      { type: 'sorting', descriptions: ['用四象限法：把今天的事分成"紧急重要"四个篮子。','列出你时间消耗最大的3件事放入"需要评估"篮。','把待办清单分成"今天必须做"和"可以明天做"两篮。'], targets: [4,3,2], rewards: [{exp:20},{exp:15},{exp:15}] },
      { type: 'writing', descriptions: ['写下明天最重要的3件事投进树洞——只写3件。','记录今天的时间去向：哪些事真正有价值？写成信。','写一句提醒自己的话投进树洞："完成比完美更重要。"'], targets: [3,1,1], rewards: [{exp:15},{exp:20},{exp:15}] },
      { type: 'action', descriptions: ['给自己倒一杯水，每喝一口检查待办清单中已完成的一项。','把手机放在另一个房间，喝着水专注做一件事15分钟。','用喝水作为番茄钟的休息信号：专注25分钟→喝一口水。'], targets: [5,5,5], rewards: [{exp:25},{exp:25},{exp:25}] },
      { type: 'gratitude', descriptions: ['在花瓣上写下今天你有时间做的让你开心的一件事。','写下时间管理给你生活带来的3个好处。','感谢自己即使在忙碌中也愿意花时间自我成长。'], targets: [1,3,1], rewards: [{exp:10},{exp:15},{exp:15}] },
      { type: 'movement', descriptions: ['每坐45分钟站起来走动并活动身体。','做3次深呼吸配合手臂上举——简单但有效的能量重启。','站在窗边远眺让眼睛和大脑休息同时活动颈部。'], targets: [60,3,60], rewards: [{mpBonus:2,exp:15},{mpBonus:2,exp:15},{mpBonus:2,exp:15}] },
    ],
    miniGames: [
      { id: 'sorting', name: '优先级整理', emoji: '🧺', description: '帮你理清任务的轻重缓急，告别瞎忙状态。' },
      { id: 'breathing', name: '专注力恢复', emoji: '🍃', description: '用呼吸练习恢复被分散的注意力。' },
      { id: 'cloud', name: '吹散时间焦虑', emoji: '☁️', description: '把"来不及了"的焦虑想法吹走。' },
    ],
    teas: [
      { name: '薄荷柠檬专注茶', emoji: '🍵', cost: 30, stamina: 30, desc: '提升专注力，高效利用时间。', ingredients: ['mint','lemon'] },
      { name: '蜜桃生姜能量茶', emoji: '🧋', cost: 80, stamina: 60, desc: '快速补充能量，打破拖延。', ingredients: ['peach','ginger'] },
      { name: '洋甘菊薰衣草放松茶', emoji: '✨', cost: 150, stamina: 120, desc: '放下时间焦虑，享受当下的从容。', ingredients: ['chamomile','lavender'] },
    ],
  },
  emotion_management: {
    tasks: [
      { type: 'breathing', descriptions: ['情绪涌上来时做5次478呼吸。','每天早晚各做3分钟呼吸冥想稳定情绪基线。','感到愤怒时先深呼吸10次再说话。'], targets: [5,3,10], rewards: [{mpBonus:3,exp:20},{mpBonus:2,exp:15},{mpBonus:3,exp:20}] },
      { type: 'sorting', descriptions: ['给今天出现的情绪命名放入对应的篮子：愤怒？悲伤？焦虑？','区分"触发事件"和"情绪反应"分两篮。','把情绪分成"短暂的访客"和"需要关注的信号"两篮。'], targets: [3,2,2], rewards: [{exp:15},{exp:20},{exp:15}] },
      { type: 'writing', descriptions: ['写下今天感受到的情绪投进树洞——不用评价对错。','给你最常出现的负面情绪写一封信："我看到你了…"投进树洞。','写下3个帮助你平复情绪的方法投进树洞建立情绪工具箱。'], targets: [1,1,3], rewards: [{exp:25},{exp:20},{exp:15}] },
      { type: 'action', descriptions: ['给自己倒一杯温水，每喝一口在心里说"我允许自己感受这种情绪"。','情绪上头时用冷水洗把脸然后慢慢喝完一杯水。','找到一种安全表达情绪的方式：画画、跑步、唱歌，然后喝口水。'], targets: [5,5,5], rewards: [{exp:20},{exp:25},{exp:25}] },
      { type: 'gratitude', descriptions: ['在花瓣上写下一件你感谢情绪教会你的事。','写下让你感到平静的3个时刻。','感谢你的情绪——它们是你感知世界的天线。'], targets: [1,3,1], rewards: [{exp:10},{exp:15},{exp:15}] },
      { type: 'movement', descriptions: ['愤怒时去快走感受脚底与地面的接触。','悲伤时抱住自己轻轻摇晃做满60秒。','焦虑时握紧拳头深吸气然后慢慢松开重复多次。'], targets: [60,60,5], rewards: [{mpBonus:2,exp:15},{mpBonus:2,exp:15},{mpBonus:3,exp:15}] },
    ],
    miniGames: [
      { id: 'breathing', name: '情绪调节呼吸', emoji: '🍃', description: '无论什么情绪袭来，用呼吸找回平衡。' },
      { id: 'cloud', name: '情绪过客', emoji: '☁️', description: '把情绪看作天上来去的云朵，来了又走。' },
      { id: 'sorting', name: '情绪命名', emoji: '🧺', description: '学会给每种情绪一个名字，与它保持距离。' },
    ],
    teas: [
      { name: '薰衣草洋甘菊安神茶', emoji: '🍵', cost: 30, stamina: 30, desc: '平稳情绪，找回内心的风平浪静。', ingredients: ['lavender','chamomile'] },
      { name: '玫瑰蜂蜜抚慰茶', emoji: '🧋', cost: 80, stamina: 60, desc: '温柔包裹受伤的心。', ingredients: ['rose','honey'] },
      { name: '百合薄荷慰藉茶', emoji: '✨', cost: 150, stamina: 120, desc: '深度安抚，让紧绷的情绪彻底放松。', ingredients: ['lily','mint','cosmos'] },
    ],
  },
};

export function getWorryContent(type: WorryCategory, language = 'zh'): WorryGameContent {
  const base = CONTENT[type] ?? CONTENT.emotion_management;
  const i18n = language !== 'zh' ? getWorryI18n(type, language) : null;
  if (!i18n) return base;

  return {
    ...base,
    miniGames: base.miniGames.map((g, i) => ({
      ...g,
      name: i18n.miniGames[i]?.name ?? g.name,
      description: i18n.miniGames[i]?.description ?? g.description,
    })),
    teas: base.teas.map((t, i) => ({
      ...t,
      name: i18n.teas[i]?.name ?? t.name,
      desc: i18n.teas[i]?.desc ?? t.desc,
    })),
    tasks: base.tasks.map((task) => ({
      ...task,
      descriptions: i18n.taskDescriptions[task.type] ?? task.descriptions,
    })),
  };
}
