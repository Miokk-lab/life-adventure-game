import type { HelpArticle, OnboardingTip } from '../types/onboarding';
import type { Language } from '../stores/useLanguageStore';

export const HELP_ARTICLES_ZH: HelpArticle[] = [
  {
    id: 'getting_started_1',
    title: '这是什么游戏？',
    category: 'getting_started',
    content: `心岛是一款心理疗愈游戏。它将你的烦恼转化为游戏世界，通过创意的战斗和任务系统，帮助你用CBT（认知行为疗法）的方式理解和转化你的烦恼。

**核心理念：**
- 这不是简单的逃避现实
- 而是一个安全、温暖的空间来理解自己
- 游戏中的每个元素都有心理学基础
- 你的进步会真实地帮助你的心理健康`,
    estimatedReadTime: 3,
  },
  {
    id: 'getting_started_2',
    title: '怎样开始一次冒险？',
    category: 'getting_started',
    content: `**步骤 1：分享你的烦恼**
- 选择你正在经历的困扰类型
- 用自己的语言描述你的具体烦恼
- 这些信息用来生成你的个人游戏世界

**步骤 2：等待世界生成**
- 系统会用AI生成你的英雄
- 同时生成对应的心魔
- 这个过程通常需要 3-5 秒

**步骤 3：进入你的冒险**
- 遇见你的英雄
- 了解心魔的背景
- 完成日常任务，为战斗做准备

**步骤 4：挑战心魔**
- 通过小游戏进行战斗
- 每个小游戏都帮助你理解烦恼
- 战斗后获得洞察和奖励`,
    estimatedReadTime: 5,
  },
  {
    id: 'gameplay_hero',
    title: '英雄系统怎么玩？',
    category: 'gameplay',
    content: `**英雄是什么？**
你的英雄代表你内在的力量和潜能。每一个英雄都是独一无二的，完全由你的烦恼背景生成。

**英雄属性：**
- 生命值 (HP)：抗压能力
- 防御 (DEF)：心理防线
- 攻击 (ATK)：采取行动的能力
- 速度 (SPD)：反应速度
- 心情值：整体心理状态

**英雄升级：**
- 完成任务获得经验
- 升级时获得属性点
- 自由分配点数到各个属性
- 升级后会学到新的技能

**英雄装备：**
- 战斗中获得装备掉落
- 装备可以强化属性
- 不同装备有不同的加成
- 定期更换装备保持竞争力`,
    estimatedReadTime: 5,
    relatedTopics: ['gameplay_quests', 'gameplay_battle'],
  },
  {
    id: 'gameplay_quests',
    title: '日常任务怎么做？',
    category: 'gameplay',
    content: `**6 种任务类型：**

🌬️ **呼吸冥想**
- 跟随屏幕上的呼吸节奏
- 深呼吸 3-5 分钟
- 帮助平复焦虑和压力

📝 **整理日记**
- 写下今天发生的事
- 记录你的想法和感受
- 帮助整理思绪

🙏 **感恩实践**
- 列出今天值得感谢的 3 件事
- 可以是大事也可以是小事
- 帮助发现生活中的闪光点

✨ **行动步骤**
- 选择一个改变的小步骤
- 比如喝一杯水、散步 10 分钟
- 帮助你采取行动，成为改变

**任务奖励：**
- 💰 金币：购买游戏物品
- ⭐ 经验：英雄升级
- 🔵 心情值：英雄关键属性

**任务完成建议：**
- 每天坚持完成所有任务
- 连续完成能形成习惯
- 习惯会产生长期效果`,
    estimatedReadTime: 5,
    relatedTopics: ['gameplay_hero', 'gameplay_battle'],
  },
  {
    id: 'gameplay_battle',
    title: '战斗系统怎么理解？',
    category: 'gameplay',
    content: `**战斗不是真的"战斗"**
在心岛，"战斗"是一个隐喻。你不是在打败敌人，而是在理解、接纳和转化你的烦恼。

**战斗流程：**

1️⃣ **准备阶段**
   - 查看心魔的背景故事
   - 选择你的战斗策略
   - 准备心态

2️⃣ **战斗阶段**
   - 共 3 回合
   - 每回合你需要完成一个小游戏
   - 完成游戏就相当于一次"攻击"

3️⃣ **小游戏类型**
   - 🎮 呼吸节奏游戏
   - 🧩 情绪拼图游戏
   - ☕ 花茶调配游戏

4️⃣ **伤害计算**
   - 游戏分数高 = 伤害高
   - 英雄等级高 = 基础伤害高

5️⃣ **敌人反击**
   - 心魔也会反击
   - 这代表烦恼的反作用
   - 但不用害怕，这是理解的过程

6️⃣ **战斗结果**
   - 赢了：获得经验和掉落物
   - 输了：不会失去任何东西，反而能学到东西
   - 无论输赢，都是对烦恼的一次理解

**战斗的心理学意义：**
- 每个小游戏都帮助你调节心境
- 多次接触心魔让你习惯于它
- 最终，你会理解它甚至接纳它`,
    estimatedReadTime: 7,
    relatedTopics: ['systems_teahouse', 'gameplay_hero'],
  },
  {
    id: 'systems_teahouse',
    title: '花茶坊有什么用？',
    category: 'systems',
    content: `**花茶是什么？**
花茶是心岛的魔法饮品。它不仅是一个游戏系统，也是一个真实的心理工具。制作和品饮花茶是一种自我照顾的仪式。

**花茶效果：**

🌸 **樱花茶 - 温柔平静**
- 效果：英雄防御 +20%
- 故事：樱花象征温柔和接纳
- 适合：感到苛责自己的时候

🌼 **洋甘菊 - 焦虑缓解**
- 效果：焦虑减少 15%
- 故事：传统的放松花茶
- 适合：感到紧张和不安的时候

🌿 **薰衣草 - 深度放松**
- 效果：心情值恢复 +25%
- 故事：帮助深度放松和睡眠
- 适合：感到疲惫的时候

🌺 **玫瑰 - 自我关怀**
- 效果：英雄伤害 +15%
- 故事：自我爱护和赋权
- 适合：需要增强信心的时候

**花茶在战斗中的作用：**
- 战斗前制作的花茶会生效
- 在战斗界面选择要饮用的花茶
- 获得相应的属性加成
- 不同的战斗选择不同的花茶

**花茶的心理学意义：**
- 制作花茶是一个冥想过程
- 品饮花茶是一个自我照顾的仪式
- 选择花茶代表你对自己的理解
- 长期的花茶习惯能改变心境`,
    estimatedReadTime: 8,
    relatedTopics: ['gameplay_battle', 'gameplay_quests'],
  },
  {
    id: 'faq_lose_battle',
    title: 'Q: 我的英雄为什么老是输？',
    category: 'faq',
    content: `**回答：**
首先，不用担心！输并不是失败，而是学习的机会。

**可能的原因：**

1️⃣ **英雄等级太低**
   - 解决：完成更多任务获得经验
   - 升级后属性会显著提升

2️⃣ **没有装备**
   - 解决：完成战斗获得装备掉落
   - 装备可以大幅提升属性

3️⃣ **小游戏得分低**
   - 解决：多练习小游戏
   - 每种游戏都有技巧
   - 分数越高，伤害越大

**战斗的心理学意义：**
- 输也能学到东西
- 分析失败原因很重要
- 失败是通往理解的路
- 最终你会理解心魔，甚至接纳它

**实用建议：**
- 不要连续挑战多次
- 完成任务来提升属性
- 给英雄装备
- 多练习小游戏`,
    estimatedReadTime: 4,
  },
  {
    id: 'faq_tea',
    title: 'Q: 花茶怎样才能发挥最大效果？',
    category: 'faq',
    content: `**最大化花茶效果的技巧：**

🎯 **选择合适的花茶**
- 根据你的当前状态选择
- 感到焦虑？选洋甘菊
- 需要增强信心？选玫瑰
- 感到疲惫？选薰衣草

⏰ **制作时机**
- 在战斗前制作效果最好
- 新制作的花茶效果最强

📊 **根据战斗类型选择**
- 防守性战斗？选樱花 (防御加成)
- 进攻性战斗？选玫瑰 (伤害加成)
- 需要恢复？选薰衣草 (恢复加成)

🌱 **长期养成**
- 每天都制作喝花茶
- 建立自己的花茶习惯
- 长期效果会累积
- 你会发现偏好的配方

💡 **心理学应用**
- 制作花茶的过程本身就是冥想
- 选择花茶代表你对自己的理解
- 品饮是一个自我照顾的仪式
- 定期的花茶习惯能改变心境`,
    estimatedReadTime: 4,
  },
];

export const HELP_ARTICLES_EN: HelpArticle[] = [
  {
    id: 'getting_started_1',
    title: 'What kind of game is this?',
    category: 'getting_started',
    content: `Soul Island is a psychological healing game. It turns your worries into a game world, helping you understand and transform them through CBT (Cognitive Behavioral Therapy) with creative combat and quest systems.

**Core Philosophy:**
- This is not a simple escape from reality
- It's a safe, warm space to understand yourself
- Every element in the game has a psychological foundation
- Your progress will truly help your mental health`,
    estimatedReadTime: 3,
  },
  {
    id: 'getting_started_2',
    title: 'How to start an adventure?',
    category: 'getting_started',
    content: `**Step 1: Share Your Worry**
- Choose the type of worry you are experiencing
- Describe your specific worry in your own words
- This information is used to generate your personal game world

**Step 2: Wait for World Generation**
- The system uses AI to generate your hero
- It also generates the corresponding Inner Demon
- This process usually takes 3-5 seconds

**Step 3: Enter Your Adventure**
- Meet your hero
- Understand the Inner Demon's background
- Complete daily quests to prepare for battle

**Step 4: Challenge the Inner Demon**
- Battle through minigames
- Each minigame helps you understand your worries
- Gain insights and rewards after battle`,
    estimatedReadTime: 5,
  },
  {
    id: 'gameplay_hero',
    title: 'How to play the hero system?',
    category: 'gameplay',
    content: `**What is a Hero?**
Your hero represents your inner strength and potential. Every hero is unique, fully generated from your worry background.

**Hero Attributes:**
- HP: Stress tolerance
- DEF: Psychological defense
- ATK: Ability to take action
- SPD: Reaction speed
- Mood: Overall mental state

**Hero Level Up:**
- Complete quests to earn experience
- Earn attribute points upon leveling up
- Allocate points freely to different attributes
- Learn new skills after leveling up

**Hero Equipment:**
- Obtain equipment drops during battle
- Equipment can strengthen attributes
- Different equipment has different bonuses
- Change equipment regularly to stay competitive`,
    estimatedReadTime: 5,
    relatedTopics: ['gameplay_quests', 'gameplay_battle'],
  },
  {
    id: 'gameplay_quests',
    title: 'How to do daily quests?',
    category: 'gameplay',
    content: `**6 Quest Types:**

🌬️ **Breathing Meditation**
- Follow the breathing rhythm on the screen
- Deep breathe for 3-5 minutes
- Helps calm anxiety and stress

📝 **Journaling**
- Write down what happened today
- Record your thoughts and feelings
- Helps organize your thoughts

🙏 **Gratitude Practice**
- List 3 things you are grateful for today
- Can be big things or small things
- Helps find the sparks in your life

✨ **Action Steps**
- Choose a small step to make a change
- e.g., drink a cup of water, walk for 10 minutes
- Helps you take action and become the change

**Quest Rewards:**
- 💰 Gold: Purchase game items
- ⭐ EXP: Hero level up
- 🔵 Mood: Key hero attribute

**Quest Recommendations:**
- Consistently complete all quests daily
- Consistent completion forms habits
- Habits produce long-term effects`,
    estimatedReadTime: 5,
    relatedTopics: ['gameplay_hero', 'gameplay_battle'],
  },
  {
    id: 'gameplay_battle',
    title: 'How to understand the battle system?',
    category: 'gameplay',
    content: `**Battle is not a real "battle"**
In Soul Island, "battle" is a metaphor. You are not defeating enemies, but understanding, accepting, and transforming your worries.

**Battle Flow:**

1️⃣ **Preparation Phase**
- View the Inner Demon's background story
- Choose your battle strategy
- Prepare your mindset

2️⃣ **Battle Phase**
- 3 rounds in total
- Each round requires you to complete a minigame
- Completing the game acts as an "attack"

3️⃣ **Minigame Types**
- 🎮 Breathing rhythm game
- 🧩 Emotion puzzle game
- ☕ Flower tea brewing game

4️⃣ **Damage Calculation**
- Higher game score = Higher damage
- Higher hero level = Higher base damage

5️⃣ **Enemy Counterattack**
- Inner demons will also counterattack
- This represents the counter-reaction of worries
- But do not fear, this is a process of understanding

6️⃣ **Battle Outcome**
- Win: Earn experience and item drops
- Lose: Lose nothing, but learn instead
- Win or lose, it is a step toward understanding your worry

**Psychological Meaning of Battle:**
- Each minigame helps regulate your state of mind
- Multiple encounters with Inner Demons help you get used to them
- Eventually, you will understand and even accept them`,
    estimatedReadTime: 7,
    relatedTopics: ['systems_teahouse', 'gameplay_hero'],
  },
  {
    id: 'systems_teahouse',
    title: 'What is the teahouse for?',
    category: 'systems',
    content: `**What is Flower Tea?**
Flower tea is the magic beverage of Soul Island. It's not just a game system, but also a real psychological tool. Brewing and sipping flower tea is a ritual of self-care.

**Flower Tea Effects:**

🌸 **Cherry Blossom Tea - Gentle Calm**
- Effect: Hero DEF +20%
- Story: Cherry blossoms symbolize gentleness and acceptance
- Best for: When you find yourself being overly critical

🌼 **Chamomile Tea - Anxiety Relief**
- Effect: Anxiety reduced by 15%
- Story: Traditional relaxing herbal tea
- Best for: When you feel tense and restless

🌿 **Lavender Tea - Deep Relaxation**
- Effect: Mood recovery +25%
- Story: Helps with deep relaxation and sleep
- Best for: When you feel exhausted

🌺 **Rose Tea - Self-Compassion**
- Effect: Hero ATK +15%
- Story: Self-love and empowerment
- Best for: When you need a confidence boost

**Role of Tea in Battle:**
- Tea brewed before battle will take effect
- Select which tea to drink on the battle interface
- Obtain corresponding attribute bonuses
- Choose different teas for different battles

**Psychological Meaning of Flower Tea:**
- Brewing tea is a meditation process
- Drinking tea is a self-care ritual
- Choosing tea represents your understanding of yourself
- A long-term tea habit can shift your state of mind`,
    estimatedReadTime: 8,
    relatedTopics: ['gameplay_battle', 'gameplay_quests'],
  },
  {
    id: 'faq_lose_battle',
    title: 'Q: Why does my hero always lose?',
    category: 'faq',
    content: `**Answer:**
First, don't worry! Losing is not failure, but an opportunity to learn.

**Possible Reasons:**

1️⃣ **Hero level is too low**
- Solution: Complete more quests to get experience
- Attributes increase significantly upon leveling up

2️⃣ **No equipment**
- Solution: Complete battles to get equipment drops
- Equipment can greatly boost attributes

3️⃣ **Low minigame score**
- Solution: Practice minigames more
- Each game has its tricks
- Higher score = higher damage

**Psychological Meaning of Battle:**
- You can learn even from losing
- Analyzing failure reasons is important
- Failure is the path to understanding
- Eventually, you will understand and accept the Inner Demon

**Practical Advice:**
- Avoid challenging multiple times in a row
- Complete quests to boost attributes
- Equip your hero
- Practice minigames more`,
    estimatedReadTime: 4,
  },
  {
    id: 'faq_tea',
    title: 'Q: How to maximize the tea\'s effect?',
    category: 'faq',
    content: `**Tips for Maximizing Tea Effects:**

🎯 **Choose the Right Tea**
- Choose based on your current state
- Feeling anxious? Choose Chamomile
- Need confidence? Choose Rose
- Feeling exhausted? Choose Lavender

⏰ **Timing of Brewing**
- Brewing right before battle works best
- Freshly brewed tea has the strongest effect

📊 **Choose Based on Battle Type**
- Defensive battle? Choose Cherry Blossom (DEF boost)
- Offensive battle? Choose Rose (Damage boost)
- Need recovery? Choose Lavender (Recovery boost)

🌱 **Long-Term Habit**
- Brew and drink tea daily
- Establish your own tea ritual
- Long-term effects accumulate
- You will discover your preferred recipes

💡 **Psychological Application**
- The process of making tea itself is meditation
- Choosing tea represents your self-understanding
- Sipping is a self-care ritual
- Regular tea habits can change your mindset`,
    estimatedReadTime: 4,
  },
];

export const HELP_ARTICLES_JA: HelpArticle[] = [
  {
    id: 'getting_started_1',
    title: 'どんなゲームですか？',
    category: 'getting_started',
    content: `ココロ島（心島）は、メンタルケア・ヒーリングゲームです。あなたの悩みをゲームの世界へと変換し、クリエイティブな戦闘やクエストシステムを通じて、CBT（認知行動療法）のアプローチで悩みを理解し、ポジティブな変化へと導きます。

**コア理念：**
- 単なる現実逃避ではありません
- 自分自身を深く理解するための、安全で温かい空間です
- ゲーム内のあらゆる要素に心理学的なアプローチが反映されています
- ゲームの進行が、現実の心の健康に繋がっていきます`,
    estimatedReadTime: 3,
  },
  {
    id: 'getting_started_2',
    title: '冒険を始めるには？',
    category: 'getting_started',
    content: `**ステップ 1：悩みのシェア**
- 現在抱えている悩みのタイプを選択します
- あなたの言葉で、具体的な悩みを書き留めます
- この情報を元に、あなただけのゲーム世界が生成されます

**ステップ 2：世界の生成を待つ**
- システムがAIを用いてあなたのヒーローを生成します
- 同時に、悩みに対応する「心魔（Inner Demon）」が生成されます
- 生成には通常 3〜5 秒ほどかかります

**ステップ 3：冒険へ出発**
- あなたのヒーローと対面します
- 心魔の背景ストーリーを確認します
- 日常クエストをこなし、戦闘に備えます

**ステップ 4：心魔に挑む**
- ミニゲームを通じて戦闘を行います
- 各ミニゲームは、悩みを整理し理解する手助けになります
- 戦闘後、気づき（インサイト）と報酬が得られます`,
    estimatedReadTime: 5,
  },
  {
    id: 'gameplay_hero',
    title: 'ヒーローシステムの遊び方',
    category: 'gameplay',
    content: `**ヒーローとは？**
ヒーローは、あなたの内なる力や可能性を象徴しています。悩みの内容に応じて完全にパーソナライズされた、あなただけのオリジナルヒーローです。

**ヒーローのステータス：**
- HP（体力）：ストレス耐性
- DEF（防御）：心の防衛線
- ATK（攻撃）：行動を起こす力
- SPD（素早さ）：反応速度
- 気分値：全体的なメンタルコンディション

**ヒーローのレベルアップ：**
- クエストをクリアして経験値（EXP）を獲得します
- レベルアップ時にステータスポイントを獲得します
- 獲得したポイントを自由に各ステータスへ振り分けます
- レベルアップによって新しいスキルを習得します

**ヒーローの装備：**
- 戦闘を通じて装備品がドロップします
- 装備品により、ステータスをさらに強化できます
- 装備ごとに異なるボーナス効果があります
- 定期的に装備を整えて、強くなりましょう`,
    estimatedReadTime: 5,
    relatedTopics: ['gameplay_quests', 'gameplay_battle'],
  },
  {
    id: 'gameplay_quests',
    title: '日常クエストの進め方',
    category: 'gameplay',
    content: `**6つのクエストタイプ：**

🌬️ **呼吸瞑想**
- 画面の呼吸リズムに合わせます
- 3〜5分間、深呼吸を行います
- 焦りやストレスを和らげるのに役立ちます

📝 **ココロ日記**
- 今日起きた出来事を書き留めます
- あなたの考えや感情を記録します
- 頭の中を整理する手助けになります

🙏 **感謝のワーク**
- 今日感謝したい出来事を3つリストアップします
- 些細なことでも、大きなことでも構いません
- 日常の中にある小さな幸せに気づく練習になります

✨ **アクションステップ**
- 変化への小さな一歩を選択します
- （例：お水を一杯飲む、10分間散歩するなど）
- 実際に行動を起こし、変化を生み出す習慣を作ります

**クエストの報酬：**
- 💰 コイン：お買い物に使用します
- ⭐ 経験値：ヒーローのレベルアップに必要です
- 🔵 気分値：ヒーローの重要なステータスです

**クリアへのアドバイス：**
- 毎日すべてのクエストをクリアすることを心がけましょう
- 継続することで習慣が形成されます
- 良い習慣は、長期的な心の安定に繋がります`,
    estimatedReadTime: 5,
    relatedTopics: ['gameplay_hero', 'gameplay_battle'],
  },
  {
    id: 'gameplay_battle',
    title: '戦闘システムについて',
    category: 'gameplay',
    content: `**戦闘は本当の「争い」ではありません**
ココロ島において、「戦闘」はメタファー（比喩）です。敵を倒すのではなく、自身の悩みを理解し、受け入れ、そして対話するためのプロセスです。

**戦闘の流れ：**

1️⃣ **準備フェーズ**
- 心魔の背景ストーリーを読み込みます
- 戦闘戦略を選択します
- 心の準備を整えます

2️⃣ **戦闘フェーズ**
- 全3ラウンド構成
- 各ラウンドでミニゲームに挑戦します
- ゲームをクリアすることが「攻撃（働きかけ）」となります

3️⃣ **ミニゲームの種類**
- 🎮 呼吸リズムゲーム
- 🧩 感情パズルゲーム
- ☕ ハーブティー調合ゲーム

4️⃣ **ダメージ計算**
- ミニゲームのスコアが高い ＝ 与えるダメージが高い
- ヒーローのレベルが高い ＝ 基礎ダメージが高い

5️⃣ **敵の反撃**
- 心魔も反撃を行います
- 这是代表烦恼的反作用
- ですが、恐れる必要はありません。これも理解を深める過程です

6️⃣ **戦闘結果**
- 勝利：経験値やドロップアイテムを獲得
- 敗北：何かを失うことはありません。代わりにアドバイスや気づきを得られます
- 勝敗に関わらず、悩みを整理する一歩となります

**戦闘の心理学的意義：**
- 各ミニゲームは、あなたの心の状態を整える役割を果たします
- 心魔と向き合い続けることで、不安に対する慣れが生まれます
- 最終的には、悩みへの深い理解と自己受容に繋がります`,
    estimatedReadTime: 7,
    relatedTopics: ['systems_teahouse', 'gameplay_hero'],
  },
  {
    id: 'systems_teahouse',
    title: '花茶坊（ティーハウス）の役割',
    category: 'systems',
    content: `**ハーブティーとは？**
ハーブティーはココロ島における魔法の飲み物です。単なるゲームシステムではなく、現実のセルフケアを促すツールでもあります。お茶を淹れ、味わうプロセスは、自分を労わる大切な儀式です。

**ハーブティーの効果：**

🌸 **桜茶 - 穏やかな受容**
- 効果：ヒーローの防御力（DEF）+20%
- ストーリー：桜は優しさと自己受容を象徴します
- おすすめ：自分に厳しくなりすぎている時に

🌼 **カモミール - 不安の緩和**
- 効果：不安値を15%減少
- ストーリー：古くから親しまれているリラックスハーブ
- おすすめ：緊張や落ち着かなさを感じる時に

🌿 **ラベンダー - 深い休息**
- 効果：気分値を+25%回復
- ストーリー：深いリラクゼーションと睡眠を助けます
- おすすめ：疲れが溜まっていると感じる時に

🌺 **ローズ茶 - セルフコンパッション**
- 効果：ヒーローの攻撃力（ATK）+15%
- ストーリー：自己愛と内なる強さを育みます
- おすすめ：自信を取り戻したい時に

**戦闘での活用：**
- 戦闘前に淹れたハーブティーが効果を発揮します
- 戦闘画面で使用するハーブティーを選択します
- 対応するステータスボーナスが得られます
- 戦局に合わせてお茶を使い分けましょう

**心理学的意義：**
- ハーブティーを淹れる時間は、マインドフルネス瞑想になります
- お茶を飲むことは、自分自身をケアする大切なひとときです
- お茶を選ぶことは、今の自分の状態を理解することに繋がります
- お茶を飲む習慣を続けることで、心の状態が徐々に整っていきます`,
    estimatedReadTime: 8,
    relatedTopics: ['gameplay_battle', 'gameplay_quests'],
  },
  {
    id: 'faq_lose_battle',
    title: 'Q: ヒーローが勝てない時は？',
    category: 'faq',
    content: `**回答：**
まず、心配しないでください！敗北は失敗ではなく、学びのチャンスです。

**考えられる原因：**

1️⃣ **レベルが足りない**
- 解決策：クエストをクリアして経験値を溜めましょう
- レベルアップによりステータスが大幅に強化されます

2️⃣ **装備をしていない**
- 解決策：戦闘をクリアして装備を手に入れましょう
- 装備品を身につけるとステータスが大きく上昇します

3️⃣ **ミニゲームのスコアが低い**
- 解決策：ミニゲームのコツを掴みましょう
- 各ゲームにはちょっとしたコツがあります
- スコアが高ければ高いほど、大きなダメージを与えられます

**心理学的アドバイス：**
- 負けた戦闘からも学べる気づきがあります
- 負けた原因を振り返ることが成長の近道です
- 失敗を繰り返すことで、心魔への理解が深まります
- やがて悩みを克服し、受け入れることができるようになります

**実践的なおすすめ：**
- 無理に連続で挑戦しすぎないようにしましょう
- クエストでステータスを底上げしましょう
- 装備をこまめにチェックしましょう
- ミニゲームを何度か練習してみましょう`,
    estimatedReadTime: 4,
  },
  {
    id: 'faq_tea',
    title: 'Q: ハーブティーの効果を最大化するには？',
    category: 'faq',
    content: `**効果を最大化するためのヒント：**

🎯 **状態に合わせてお茶を選ぶ**
- 今のあなたの気分や状態に合わせて選びましょう
- 焦りや不安がある時：カモミール
- 自信を高めたい時：ローズ
- 疲労を感じる時：ラベンダー

⏰ **淹れるタイミング**
- 戦闘の直前に淹れるのが最も効果的です
- 淹れたてのお茶は最も高い効果を発揮します
- 戦闘画面からお茶を飲んで、バフ（強化効果）を適用しましょう

📊 **戦闘スタイルに合わせる**
- 長期戦や守り重視：桜茶（防御強化）
- 短期決戦や攻め重視：ローズ茶（攻撃強化）
- 回復が必要：ラベンダー（回復強化）

🌱 **継続は力なり**
- 毎日お茶を淹れる習慣をつけましょう
- 自分だけのセルフケア習慣を確立します
- 継続的なケアが、長期的なメンタルサポートになります

💡 **心への働きかけ**
- お茶を調合するプロセス自体が瞑想になります
- お茶を選ぶ行為は、自分のニーズに向き合う第一歩です
- 味わう時間は、貴重なセルフケアのひとときとなります
- 習慣化することで、心が穏やかに整っていきます`,
    estimatedReadTime: 4,
  },
];

export const HELP_ARTICLES: HelpArticle[] = HELP_ARTICLES_ZH;

export const TIPS_CONFIG_ZH: Record<string, OnboardingTip> = {
  menu_hero_panel: {
    id: 'menu_hero_panel',
    level: 'tertiary',
    title: '👤 英雄面板',
    description: '查看英雄的详细信息，包括等级、属性、技能和装备。每完成任务，英雄都会获得经验。',
    trigger: 'auto',
    dismissible: true,
  },
  menu_daily_quests: {
    id: 'menu_daily_quests',
    level: 'tertiary',
    title: '📋 日常任务',
    description: '完成任务赚取金币和经验，帮助英雄升级。任务与你的生活息息相关。',
    trigger: 'auto',
    dismissible: true,
  },
  menu_battle_log: {
    id: 'menu_battle_log',
    level: 'tertiary',
    title: '⚔️ 战斗日志',
    description: '查看英雄的战斗记录、统计和心魔图鉴。每场战斗都是对烦恼的一次理解之旅。',
    trigger: 'auto',
    dismissible: true,
  },
  menu_tea_house: {
    id: 'menu_tea_house',
    level: 'secondary',
    title: '🍵 花茶坊',
    description: '收集、制作和品饮花茶。花茶能帮助你调整心境，在战斗前制作合适的花茶还能获得战斗加成！',
    trigger: 'auto',
    dismissible: true,
  },
  battle_intro: {
    id: 'battle_intro',
    level: 'primary',
    title: '准备好了吗？',
    description: '战斗不是真的打败敌人，而是理解和接纳你的烦恼。通过小游戏，你会逐渐理解心魔的根源。准备好开始吗？',
    trigger: 'auto',
    dismissible: false,
  },
  first_quest: {
    id: 'first_quest',
    level: 'secondary',
    title: '🎯 完成任务',
    description: '完成任务可以帮助英雄成长！每种任务都有不同的心理学意义。选择一个开始吧。',
    trigger: 'auto',
    dismissible: true,
  },
  tea_craft: {
    id: 'tea_craft',
    level: 'secondary',
    title: '🍵 制作花茶',
    description: '选择你想要的花朵，制作一杯属于你的花茶。不同的花茶组合会产生不同效果。',
    trigger: 'auto',
    dismissible: true,
  },
};

export const TIPS_CONFIG_EN: Record<string, OnboardingTip> = {
  menu_hero_panel: {
    id: 'menu_hero_panel',
    level: 'tertiary',
    title: '👤 Hero Panel',
    description: 'View details of your hero, including level, attributes, skills, and equipment. Your hero gains EXP for each completed quest.',
    trigger: 'auto',
    dismissible: true,
  },
  menu_daily_quests: {
    id: 'menu_daily_quests',
    level: 'tertiary',
    title: '📋 Daily Quests',
    description: 'Complete quests to earn gold and EXP to help your hero level up. Quests are closely related to your real life.',
    trigger: 'auto',
    dismissible: true,
  },
  menu_battle_log: {
    id: 'menu_battle_log',
    level: 'tertiary',
    title: '⚔️ Battle Log',
    description: 'View your battle history, stats, and the Inner Demon encyclopedia. Every battle is a journey of understanding your worries.',
    trigger: 'auto',
    dismissible: true,
  },
  menu_tea_house: {
    id: 'menu_tea_house',
    level: 'secondary',
    title: '🍵 Tea House',
    description: 'Collect, brew, and sip flower tea. Tea helps adjust your mind, and brewing the right tea before a battle grants combat buffs!',
    trigger: 'auto',
    dismissible: true,
  },
  battle_intro: {
    id: 'battle_intro',
    level: 'primary',
    title: 'Are you ready?',
    description: 'Battle is not about defeating enemies, but understanding and accepting your worries. Through minigames, you will gradually understand the root of your Inner Demon. Ready to start?',
    trigger: 'auto',
    dismissible: false,
  },
  first_quest: {
    id: 'first_quest',
    level: 'secondary',
    title: '🎯 Complete Quests',
    description: 'Completing quests helps your hero grow! Each quest has a different psychological meaning. Choose one to start.',
    trigger: 'auto',
    dismissible: true,
  },
  tea_craft: {
    id: 'tea_craft',
    level: 'secondary',
    title: '🍵 Brew Tea',
    description: 'Select your preferred flowers to brew your personalized tea. Different combinations produce different effects.',
    trigger: 'auto',
    dismissible: true,
  },
};

export const TIPS_CONFIG_JA: Record<string, OnboardingTip> = {
  menu_hero_panel: {
    id: 'menu_hero_panel',
    level: 'tertiary',
    title: '👤 ヒーローパネル',
    description: 'レベル、ステータス、スキル、装備などヒーローの情報を確認できます。クエストをクリアすると経験値（EXP）が貯まります。',
    trigger: 'auto',
    dismissible: true,
  },
  menu_daily_quests: {
    id: 'menu_daily_quests',
    level: 'tertiary',
    title: '📋 日常クエスト',
    description: '日常クエストをクリアしてコインと経験値を手に入れ、ヒーローをレベルアップさせましょう。日常と連動しています。',
    trigger: 'auto',
    dismissible: true,
  },
  menu_battle_log: {
    id: 'menu_battle_log',
    level: 'tertiary',
    title: '⚔️ 戦闘記録',
    description: '戦闘ログ、統計、心魔図鑑を確認できます。各戦闘は、自身の悩みへの理解を深める旅となります。',
    trigger: 'auto',
    dismissible: true,
  },
  menu_tea_house: {
    id: 'menu_tea_house',
    level: 'secondary',
    title: '🍵 花茶坊',
    description: 'ハーブティーを調合・品飲しましょう。お茶は心を調えるだけでなく、戦闘前に淹れることで戦闘能力のバフを得られます！',
    trigger: 'auto',
    dismissible: true,
  },
  battle_intro: {
    id: 'battle_intro',
    level: 'primary',
    title: '準備はいいですか？',
    description: '戦闘とは敵を倒すことではなく、あなたの悩みを理解し、受け入れることです。ミニゲームを通じて、心魔の根源を少しずつ理解していきましょう。',
    trigger: 'auto',
    dismissible: false,
  },
  first_quest: {
    id: 'first_quest',
    level: 'secondary',
    title: '🎯 クエスト達成',
    description: '日常クエストはヒーローの成長をサポートします！それぞれのワークに大切な心理学的な意義があります。一つ選んで始めましょう。',
    trigger: 'auto',
    dismissible: true,
  },
  tea_craft: {
    id: 'tea_craft',
    level: 'secondary',
    title: '🍵 お茶を淹れる',
    description: '好きな花を選んで、あなただけのハーブティーを調合しましょう。組み合わせによって、異なるステータスボーナスが発生します。',
    trigger: 'auto',
    dismissible: true,
  },
};

export const TIPS_CONFIG: Record<string, OnboardingTip> = TIPS_CONFIG_ZH;

export function getHelpArticles(lang: Language): HelpArticle[] {
  switch (lang) {
    case 'en':
      return HELP_ARTICLES_EN;
    case 'ja':
      return HELP_ARTICLES_JA;
    default:
      return HELP_ARTICLES_ZH;
  }
}

export function getTipsConfig(lang: Language): Record<string, OnboardingTip> {
  switch (lang) {
    case 'en':
      return TIPS_CONFIG_EN;
    case 'ja':
      return TIPS_CONFIG_JA;
    default:
      return TIPS_CONFIG_ZH;
  }
}
