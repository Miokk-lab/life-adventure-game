import type { WorryCategory, DailyTask } from '../types';

export interface WorryGameContent {
  tasks: { type: string; descriptions: string[]; targets: number[]; rewards: DailyTask['reward'][] }[];
  miniGames: { id: string; name: string; emoji: string; description: string }[];
  teas: { name: string; emoji: string; cost: number; stamina: number; desc: string; ingredients: string[] }[];
}

const CONTENT: Record<WorryCategory, WorryGameContent> = {
  work_stress: {
    tasks: [
      { type: 'breathing', descriptions: ['闭上眼睛，用4-7-8呼吸法给自己一个3分钟的工间休息。','在办公桌前做5次深长的腹式呼吸，感受肩膀放松。','找一个安静的角落，闭上眼睛只聆听周围的5种声音。'], targets: [3,5,5], rewards: [{mpBonus:2,coins:0,exp:15},{mpBonus:3,coins:0,exp:20},{mpBonus:2,coins:0,exp:15}] },
      { type: 'sorting', descriptions: ['把今天的工作任务分成"必须做"、"可以做"、"可以不做"三类。','找出3件你无法控制的职场因素写在落叶上，让风吹走。','把让你焦虑的工作邮件归档到"需要回复"和"仅供参考"两个文件夹。'], targets: [3,3,2], rewards: [{coins:0,exp:15},{coins:0,exp:15},{coins:0,exp:15}] },
      { type: 'writing', descriptions: ['给你最让你焦虑的那个项目写一封信："我已经尽力了，其他的交给时间。"','写下你这周工作中感到骄傲的一件小事。','给自己写一封"下班许可证"，宣布今天的工作到此结束。'], targets: [1,1,1], rewards: [{coins:0,exp:20},{coins:0,exp:15},{coins:0,exp:15}] },
      { type: 'action', descriptions: ['设置一个下班闹钟，到点后关闭所有工作通讯软件。','站起来离开办公桌，去窗边看外面的天空2分钟。','整理你的办公桌，把与当前任务无关的东西暂时收起来。'], targets: [1,2,1], rewards: [{coins:0,exp:25},{coins:0,exp:15},{coins:0,exp:20}] },
      { type: 'gratitude', descriptions: ['列出工作中3个让你感到有成就感的方面。','想一想今天有没有同事帮助过你？在心里感谢他们。','写下这份工作带给你的3个好处（技能、收入、人际关系等）。'], targets: [3,1,3], rewards: [{coins:0,exp:15},{coins:0,exp:10},{coins:0,exp:15}] },
      { type: 'movement', descriptions: ['站起来，从头顶到脚趾慢慢活动每一个关节。','走出办公室（或房间），慢走5分钟，注意呼吸节奏。','做10次缓慢的肩颈转动，释放伏案工作积累的紧张。'], targets: [1,5,10], rewards: [{mpBonus:3,coins:0,exp:15},{mpBonus:2,coins:0,exp:20},{mpBonus:2,coins:0,exp:15}] },
    ],
    miniGames: [
      { id: 'breathing', name: '工间呼吸法', emoji: '🍃', description: '释放工作压力，用4-7-8呼吸法平复紧张情绪。' },
      { id: 'cloud', name: '放飞工作焦虑', emoji: '☁️', description: '把盘旋在脑海的工作烦恼写在云上，让风吹散。' },
      { id: 'sorting', name: '任务优先级整理', emoji: '🧺', description: '帮你理清什么是真正重要的，放下不必要的负担。' },
    ],
    teas: [
      { name: '安神洋甘菊茶', emoji: '🍵', cost: 30, stamina: 30, desc: '缓解工作紧张，帮助身心放松。', ingredients: ['mint','chamomile'] },
      { name: '元气蜜桃乌龙', emoji: '🧋', cost: 80, stamina: 60, desc: '补充精力，但不带来咖啡因焦虑。', ingredients: ['peach','oolong','orange'] },
      { name: '星空薰衣草茶', emoji: '✨', cost: 150, stamina: 120, desc: '深度放松，帮你从工作模式切换到休息模式。', ingredients: ['star','lavender','cosmos','lily'] },
    ],
  },
  learning_growth: {
    tasks: [
      { type: 'breathing', descriptions: ['学习前做3次深呼吸，清空脑中杂念再开始。','感到学习效率下降时，停下来闭眼深呼吸2分钟。','用478呼吸法在考试/学习焦虑袭来时快速平静。'], targets: [3,2,3], rewards: [{mpBonus:2,coins:0,exp:15},{mpBonus:2,coins:0,exp:15},{mpBonus:3,coins:0,exp:20}] },
      { type: 'sorting', descriptions: ['把要学的内容分成"核心概念"、"次要细节"、"可以跳过"三类。','找出3个让你感到焦虑的学习障碍，分析哪些可以克服。','整理你的学习资料，把过时的、不需要的删掉。'], targets: [3,3,1], rewards: [{coins:0,exp:15},{coins:0,exp:15},{coins:0,exp:15}] },
      { type: 'writing', descriptions: ['写下你选择学习这个领域的初心和长远目标。','记录下今天学到的一个新概念，用自己的话重新解释一遍。','给自己写一句鼓励的话："进步不需要完美，只需要持续。"'], targets: [1,1,1], rewards: [{coins:0,exp:20},{coins:0,exp:15},{coins:0,exp:15}] },
      { type: 'action', descriptions: ['用番茄钟法：专注学习25分钟，然后休息5分钟。','把手机调成勿扰模式，创造一个无干扰的30分钟学习时段。','画一张思维导图，把你正在学的知识点串联起来。'], targets: [1,30,1], rewards: [{coins:0,exp:25},{coins:0,exp:20},{coins:0,exp:25}] },
      { type: 'gratitude', descriptions: ['列出学习带给你的3个正面改变。','感谢自己今天愿意花时间学习和成长。','想一想有没有人支持你的学习之路？在心里感谢他们。'], targets: [3,1,1], rewards: [{coins:0,exp:15},{coins:0,exp:10},{coins:0,exp:15}] },
      { type: 'movement', descriptions: ['每学习45分钟后站起来伸展身体2分钟。','学习间隙去窗边远眺，让眼睛和大脑休息。','做一套简单的颈部放松操，释放低头学习的紧张。'], targets: [2,1,1], rewards: [{mpBonus:2,coins:0,exp:15},{mpBonus:2,coins:0,exp:15},{mpBonus:2,coins:0,exp:15}] },
    ],
    miniGames: [
      { id: 'sorting', name: '知识整理术', emoji: '🧺', description: '帮你把碎片化的知识归入体系，减少学习焦虑。' },
      { id: 'breathing', name: '考前静心法', emoji: '🍃', description: '在考试或重要学习任务前平复紧张心情。' },
      { id: 'cloud', name: '驱散冒名顶替感', emoji: '☁️', description: '把"我不够好"的想法写下来，然后吹散它们。' },
    ],
    teas: [
      { name: '迷迭香专注茶', emoji: '🍵', cost: 30, stamina: 30, desc: '提升专注力，帮助进入深度思考状态。', ingredients: ['mint','chamomile'] },
      { name: '蜜桃能量乌龙', emoji: '🧋', cost: 80, stamina: 60, desc: '温和提神，适合长时间学习。', ingredients: ['peach','oolong','orange'] },
      { name: '安睡薰衣草', emoji: '✨', cost: 150, stamina: 120, desc: '学习后帮助大脑放松，改善睡眠质量。', ingredients: ['star','lavender','cosmos','lily'] },
    ],
  },
  interpersonal: {
    tasks: [
      { type: 'breathing', descriptions: ['在社交场合感到紧张时，做3次缓慢的腹式呼吸。','接到一个让你紧张的消息或电话前，先深呼吸5次。','每天睡前做3分钟呼吸练习，释放社交带来的心理疲劳。'], targets: [3,5,3], rewards: [{mpBonus:2,coins:0,exp:15},{mpBonus:3,coins:0,exp:20},{mpBonus:2,coins:0,exp:15}] },
      { type: 'sorting', descriptions: ['区分"别人的看法"和"事实"——列出3个例子。','把让你困扰的人际关系分成"可以修复"和"需要放手"两类。','找出你过度迎合他人的3个场景，思考可以怎么改变。'], targets: [3,2,3], rewards: [{coins:0,exp:15},{coins:0,exp:15},{coins:0,exp:15}] },
      { type: 'writing', descriptions: ['给你最在乎但最近有矛盾的人写一封不寄出的信。','写下你觉得"被理解"的三个瞬间。','用3句话描述你理想的社交边界是什么样的。'], targets: [1,3,3], rewards: [{coins:0,exp:20},{coins:0,exp:15},{coins:0,exp:15}] },
      { type: 'action', descriptions: ['主动给一个你信任的朋友发一条简短问候。','练习说一次"不"——从一件小事开始。','今天主动赞美一个人（可以是陌生人）。'], targets: [1,1,1], rewards: [{coins:0,exp:25},{coins:0,exp:25},{coins:0,exp:20}] },
      { type: 'gratitude', descriptions: ['列出3个让你感到温暖的人际关系。','想一想谁曾经在你困难时帮过你。','感谢自己今天有勇气面对人际挑战。'], targets: [3,1,1], rewards: [{coins:0,exp:15},{coins:0,exp:10},{coins:0,exp:15}] },
      { type: 'movement', descriptions: ['紧张时握紧拳头5秒然后松开，感受从紧张到放松的变化。','做一次"身体边界"练习：感受你的身体占据的空间，确认你的存在感。','对着镜子给自己一个微笑，哪怕一开始觉得不自然。'], targets: [3,1,1], rewards: [{mpBonus:2,coins:0,exp:15},{mpBonus:2,coins:0,exp:15},{mpBonus:2,coins:0,exp:15}] },
    ],
    miniGames: [
      { id: 'cloud', name: '社交焦虑云', emoji: '☁️', description: '把对他人评价的担忧写在云上，让它们飘走。' },
      { id: 'breathing', name: '冲突冷静法', emoji: '🍃', description: '在人际冲突中保持冷静的呼吸技巧。' },
      { id: 'shell_collect', name: '感恩贝壳', emoji: '🐚', description: '收集代表美好人际关系的贝壳。' },
    ],
    teas: [
      { name: '玫瑰自爱茶', emoji: '🍵', cost: 30, stamina: 30, desc: '温柔呵护自己，建立健康的自爱能力。', ingredients: ['mint','chamomile'] },
      { name: '清凉薄荷茶', emoji: '🧋', cost: 80, stamina: 60, desc: '在情绪激动时保持头脑清醒。', ingredients: ['peach','oolong','orange'] },
      { name: '舒心薰衣草', emoji: '✨', cost: 150, stamina: 120, desc: '释放社交压力，回归内心平静。', ingredients: ['star','lavender','cosmos','lily'] },
    ],
  },
  family_origin: {
    tasks: [
      { type: 'breathing', descriptions: ['当家庭话题让你情绪波动时，停下来深呼吸5次。','每天早晨做3分钟呼吸冥想，建立一天的情绪基础。','在给家人打电话前，先做3次深呼吸让自己平静。'], targets: [5,3,3], rewards: [{mpBonus:3,coins:0,exp:20},{mpBonus:2,coins:0,exp:15},{mpBonus:2,coins:0,exp:15}] },
      { type: 'sorting', descriptions: ['区分"父母的期待"和"我自己想要的生活"——各列出3条。','把童年记忆分成"温暖的"和"需要疗愈的"两部分。','找出3个你从原生家庭继承的、但不再适合你的行为模式。'], targets: [6,2,3], rewards: [{coins:0,exp:20},{coins:0,exp:15},{coins:0,exp:20}] },
      { type: 'writing', descriptions: ['给小时候的自己写一封信："你已经做得很好了。"','写下你认为"家"应该是什么样的——用你自己的定义。','记录下一次你意识到自己在重复家庭模式时的感受。'], targets: [1,1,1], rewards: [{coins:0,exp:25},{coins:0,exp:20},{coins:0,exp:15}] },
      { type: 'action', descriptions: ['做一件完全为了自己、不考虑家人看法的小事。','练习对家人说一次温和但坚定的"我需要时间考虑"。','为自己布置一个只属于你的空间角落。'], targets: [1,1,1], rewards: [{coins:0,exp:25},{coins:0,exp:25},{coins:0,exp:20}] },
      { type: 'gratitude', descriptions: ['列出家庭带给你的3个积极影响。','感谢自己在成长过程中的坚韧和勇气。','想一想家庭中有没有一个人曾经理解过你。'], targets: [3,1,1], rewards: [{coins:0,exp:15},{coins:0,exp:10},{coins:0,exp:15}] },
      { type: 'movement', descriptions: ['做一次"扎根"练习：双脚站稳，感受地面支撑你的力量。','用身体画一个圆圈，象征你为自己设立的边界。','抱住自己给自己一个拥抱，持续30秒。'], targets: [1,1,30], rewards: [{mpBonus:2,coins:0,exp:15},{mpBonus:2,coins:0,exp:15},{mpBonus:3,coins:0,exp:15}] },
    ],
    miniGames: [
      { id: 'sorting', name: '过去与现在', emoji: '🧺', description: '区分哪些是过去的伤痛，哪些是现在可以改变的选择。' },
      { id: 'breathing', name: '触发点冷静', emoji: '🍃', description: '当家庭话题触发情绪时，用呼吸找回平静。' },
      { id: 'cloud', name: '放下旧壳', emoji: '☁️', description: '把不属于你的期待和责任放走。' },
    ],
    teas: [
      { name: '洋甘菊暖心茶', emoji: '🍵', cost: 30, stamina: 30, desc: '给内心小孩一个温暖的拥抱。', ingredients: ['mint','chamomile'] },
      { name: '薰衣草安宁茶', emoji: '🧋', cost: 80, stamina: 60, desc: '安抚过去的伤痛，找到内心的平静。', ingredients: ['peach','oolong','orange'] },
      { name: '玫瑰自我价值茶', emoji: '✨', cost: 150, stamina: 120, desc: '重新认识自己的价值，不被过去定义。', ingredients: ['star','lavender','cosmos','lily'] },
    ],
  },
  social_environment: {
    tasks: [
      { type: 'breathing', descriptions: ['刷社交媒体感到焦虑时做5次深呼吸。','每天安排3分钟不看手机、不做任何事的纯呼吸时间。','看到让人产生比较心理的内容时，立刻闭眼呼吸10秒。'], targets: [5,3,1], rewards: [{mpBonus:3,coins:0,exp:20},{mpBonus:2,coins:0,exp:15},{mpBonus:2,coins:0,exp:15}] },
      { type: 'sorting', descriptions: ['区分"我真正喜欢的东西"和"社会告诉我应该喜欢的东西"。','列出3个你为了迎合他人而做的改变，问自己值不值得。','把社交关注列表分成"滋养我的"和"消耗我的"两类。'], targets: [3,3,2], rewards: [{coins:0,exp:20},{coins:0,exp:15},{coins:0,exp:15}] },
      { type: 'writing', descriptions: ['写下你最珍视的3个核心价值观——不看任何人脸色。','描述一个你感到完全做自己的时刻。','写一句话："我不需要成为别人，我就是我。"'], targets: [3,1,1], rewards: [{coins:0,exp:15},{coins:0,exp:20},{coins:0,exp:15}] },
      { type: 'action', descriptions: ['今天做一件你真正喜欢、但不"流行"的事情。','取消关注3个让你感到焦虑的社交媒体账号。','穿着你最舒服的衣服出门，不在意别人怎么看。'], targets: [1,3,1], rewards: [{coins:0,exp:25},{coins:0,exp:25},{coins:0,exp:20}] },
      { type: 'gratitude', descriptions: ['列出3个你欣赏自己的独特之处。','感谢世界上有人欣赏真实的你。','想一想有没有一个包容你、接纳你的人。'], targets: [3,1,1], rewards: [{coins:0,exp:15},{coins:0,exp:10},{coins:0,exp:15}] },
      { type: 'movement', descriptions: ['做一次"自我空间"练习：伸展四肢，感受你占据的空间。','跟着你喜欢的音乐随意摇摆3分钟，不用在意舞姿。','对着镜子摆一个自信的姿势保持30秒。'], targets: [1,3,30], rewards: [{mpBonus:2,coins:0,exp:15},{mpBonus:2,coins:0,exp:15},{mpBonus:2,coins:0,exp:15}] },
    ],
    miniGames: [
      { id: 'cloud', name: '吹散他人眼光', emoji: '☁️', description: '把外界评判写在云上，让它们随风飘散。' },
      { id: 'sorting', name: '真我vs迎合', emoji: '🧺', description: '区分哪些是你真正的喜好，哪些是为了迎合他人。' },
      { id: 'breathing', name: '内心定锚', emoji: '🍃', description: '在喧闹的世界中找到属于自己的宁静中心。' },
    ],
    teas: [
      { name: '清心薄荷茶', emoji: '🍵', cost: 30, stamina: 30, desc: '清除杂念，找回自己的声音。', ingredients: ['mint','chamomile'] },
      { name: '柠檬新生茶', emoji: '🧋', cost: 80, stamina: 60, desc: '焕然一新，重新认识真实的自己。', ingredients: ['peach','oolong','orange'] },
      { name: '薰衣草内宁茶', emoji: '✨', cost: 150, stamina: 120, desc: '在纷扰中保持内心的宁静。', ingredients: ['star','lavender','cosmos','lily'] },
    ],
  },
  physical_health: {
    tasks: [
      { type: 'breathing', descriptions: ['做5次深长的腹式呼吸，感受腹部的起伏。','睡前做3分钟的478呼吸法帮助入睡。','早上起床前做3次伸展呼吸，唤醒身体。'], targets: [5,3,3], rewards: [{mpBonus:3,coins:0,exp:20},{mpBonus:2,coins:0,exp:15},{mpBonus:2,coins:0,exp:15}] },
      { type: 'sorting', descriptions: ['把健康习惯分成"已经做到的"和"想要养成的"。','找出3个损害你健康的行为，思考替代方案。','区分"身体真的累了"和"心理上的疲惫感"。'], targets: [2,3,1], rewards: [{coins:0,exp:15},{coins:0,exp:15},{coins:0,exp:15}] },
      { type: 'writing', descriptions: ['记录今天身体的感受：哪里紧绷？哪里放松？','写下你对健康的3个小目标。','给你身体最累的部位写一句感谢的话。'], targets: [1,3,1], rewards: [{coins:0,exp:20},{coins:0,exp:15},{coins:0,exp:15}] },
      { type: 'action', descriptions: ['喝一杯温水，感受水从喉咙流到胃里的过程。','站起来做一套简单的全身拉伸。','今晚比平时早30分钟上床。'], targets: [1,1,1], rewards: [{coins:0,exp:20},{coins:0,exp:25},{coins:0,exp:25}] },
      { type: 'gratitude', descriptions: ['感谢你的身体今天为你做的一切。','列出身体让你能够享受的3件事（走路、吃饭、拥抱等）。','想一想你的身体经历过什么但依然坚强。'], targets: [1,3,1], rewards: [{coins:0,exp:10},{coins:0,exp:15},{coins:0,exp:15}] },
      { type: 'movement', descriptions: ['从头到脚做一次身体扫描，注意每个部位的感觉。','慢走5分钟，感受脚底与地面的每次接触。','伸展你的肩膀和背部，释放一天积累的紧张。'], targets: [1,5,1], rewards: [{mpBonus:4,coins:0,exp:15},{mpBonus:2,coins:0,exp:20},{mpBonus:3,coins:0,exp:15}] },
    ],
    miniGames: [
      { id: 'breathing', name: '身体觉察呼吸', emoji: '🍃', description: '通过呼吸重新连接你的身体，感受每个部位。' },
      { id: 'movement', name: '温柔伸展', emoji: '🧘', description: '轻柔地活动身体，释放积累的紧张。' },
      { id: 'shell_collect', name: '感官贝壳', emoji: '🐚', description: '收集代表不同感官体验的贝壳，增强身体觉察。' },
    ],
    teas: [
      { name: '暖身姜茶', emoji: '🍵', cost: 30, stamina: 30, desc: '温暖身体，促进循环。', ingredients: ['mint','chamomile'] },
      { name: '安眠洋甘菊', emoji: '🧋', cost: 80, stamina: 60, desc: '帮助入睡，改善休息质量。', ingredients: ['peach','oolong','orange'] },
      { name: '清新薄荷茶', emoji: '✨', cost: 150, stamina: 120, desc: '焕新身体，重获活力。', ingredients: ['star','lavender','cosmos','lily'] },
    ],
  },
  time_management: {
    tasks: [
      { type: 'breathing', descriptions: ['感到时间不够用时做3次深呼吸，回到当下。','在任务切换之间做1分钟呼吸停顿。','一天结束时做3分钟呼吸冥想，放下"还要做更多"的执念。'], targets: [3,1,3], rewards: [{mpBonus:2,coins:0,exp:15},{mpBonus:2,coins:0,exp:15},{mpBonus:3,coins:0,exp:20}] },
      { type: 'sorting', descriptions: ['用四象限法：把今天的事分成"紧急重要"四类。','列出你时间消耗最大的3件事，判断是否值得。','把待办清单分成"今天必须做"和"可以明天做"。'], targets: [4,3,2], rewards: [{coins:0,exp:20},{coins:0,exp:15},{coins:0,exp:15}] },
      { type: 'writing', descriptions: ['写下明天最重要的3件事——只写3件。','记录今天的时间去向：哪些事真正有价值？','写一句提醒自己的话："完成比完美更重要。"'], targets: [3,1,1], rewards: [{coins:0,exp:15},{coins:0,exp:20},{coins:0,exp:15}] },
      { type: 'action', descriptions: ['现在就做一件你拖延超过一周的小事。','练习对一件不重要的事说"不"或"稍后"。','把手机放在另一个房间，专注做一件事15分钟。'], targets: [1,1,15], rewards: [{coins:0,exp:25},{coins:0,exp:25},{coins:0,exp:25}] },
      { type: 'gratitude', descriptions: ['感谢今天你有时间做自己喜欢的事。','列出时间管理给你带来的3个好处。','想一想：即使时间有限，你已经完成了哪些事？'], targets: [1,3,3], rewards: [{coins:0,exp:10},{coins:0,exp:15},{coins:0,exp:15}] },
      { type: 'movement', descriptions: ['每坐45分钟站起来走动2分钟。','做3次深呼吸配合手臂上举——简单但有效的能量重启。','站在窗边远眺1分钟，让眼睛和大脑休息。'], targets: [2,3,1], rewards: [{mpBonus:2,coins:0,exp:15},{mpBonus:2,coins:0,exp:15},{mpBonus:2,coins:0,exp:15}] },
    ],
    miniGames: [
      { id: 'sorting', name: '优先级整理', emoji: '🧺', description: '帮你理清任务的轻重缓急，告别瞎忙状态。' },
      { id: 'breathing', name: '专注力恢复', emoji: '🍃', description: '用呼吸练习恢复被分散的注意力。' },
      { id: 'cloud', name: '吹散时间焦虑', emoji: '☁️', description: '把"来不及了"的焦虑想法吹走。' },
    ],
    teas: [
      { name: '绿茶专注', emoji: '🍵', cost: 30, stamina: 30, desc: '提升专注力，高效利用时间。', ingredients: ['mint','chamomile'] },
      { name: '薄荷能量', emoji: '🧋', cost: 80, stamina: 60, desc: '快速补充能量，打破拖延。', ingredients: ['peach','oolong','orange'] },
      { name: '洋甘菊放松', emoji: '✨', cost: 150, stamina: 120, desc: '放下时间焦虑，享受当下的从容。', ingredients: ['star','lavender','cosmos','lily'] },
    ],
  },
  emotion_management: {
    tasks: [
      { type: 'breathing', descriptions: ['情绪涌上来时做5次478呼吸。','每天早晚各做3分钟呼吸冥想稳定情绪基线。','感到愤怒时先深呼吸10次再说话。'], targets: [5,3,10], rewards: [{mpBonus:3,coins:0,exp:20},{mpBonus:2,coins:0,exp:15},{mpBonus:3,coins:0,exp:20}] },
      { type: 'sorting', descriptions: ['给今天出现的情绪命名：愤怒？悲伤？焦虑？还是其他？','区分"触发事件"和"情绪反应"——各写3个。','把情绪分成"短暂的访客"和"需要关注的信号"。'], targets: [3,6,2], rewards: [{coins:0,exp:15},{coins:0,exp:20},{coins:0,exp:15}] },
      { type: 'writing', descriptions: ['写一页"情绪日记"——今天感受到了什么情绪？','给你最常出现的负面情绪写一封信。"我看到你了…"','写下3个帮助你平复情绪的方法，建立情绪工具箱。'], targets: [1,1,3], rewards: [{coins:0,exp:25},{coins:0,exp:20},{coins:0,exp:15}] },
      { type: 'action', descriptions: ['情绪上头时用冷水洗把脸。','找一个可以安全表达情绪的方式：画画、跑步、唱歌。','情绪平稳后，用一句话告诉身边人你的感受。'], targets: [1,1,1], rewards: [{coins:0,exp:20},{coins:0,exp:25},{coins:0,exp:25}] },
      { type: 'gratitude', descriptions: ['感谢你的情绪——它们是你感知世界的天线。','列出让你感到平静的3个时刻。','即使是负面情绪也有它的价值——想一想它教会你什么。'], targets: [1,3,1], rewards: [{coins:0,exp:10},{coins:0,exp:15},{coins:0,exp:15}] },
      { type: 'movement', descriptions: ['愤怒时去快走5分钟。','悲伤时抱住自己轻轻摇晃30秒。','焦虑时握紧拳头深吸气然后慢慢松开，重复5次。'], targets: [5,30,5], rewards: [{mpBonus:2,coins:0,exp:15},{mpBonus:2,coins:0,exp:15},{mpBonus:3,coins:0,exp:15}] },
    ],
    miniGames: [
      { id: 'breathing', name: '情绪调节呼吸', emoji: '🍃', description: '无论什么情绪袭来，用呼吸找回平衡。' },
      { id: 'cloud', name: '情绪过客', emoji: '☁️', description: '把情绪看作天上来去的云朵，来了又走。' },
      { id: 'sorting', name: '情绪命名', emoji: '🧺', description: '学会给每种情绪一个名字，与它保持距离。' },
    ],
    teas: [
      { name: '薰衣草安神茶', emoji: '🍵', cost: 30, stamina: 30, desc: '平稳情绪，找回内心的风平浪静。', ingredients: ['mint','chamomile'] },
      { name: '玫瑰抚慰茶', emoji: '🧋', cost: 80, stamina: 60, desc: '温柔包裹受伤的心。', ingredients: ['peach','oolong','orange'] },
      { name: '洋甘菊慰藉茶', emoji: '✨', cost: 150, stamina: 120, desc: '深度安抚，让紧绷的情绪彻底放松。', ingredients: ['star','lavender','cosmos','lily'] },
    ],
  },
};

export function getWorryContent(type: WorryCategory): WorryGameContent {
  return CONTENT[type] ?? CONTENT.emotion_management;
}
