import type { WorryCategory } from '../types';

interface MiniGameI18n { name: string; description: string; }
interface TeaI18n { name: string; desc: string; }
interface TaskDescI18n { [type: string]: string[]; }

interface CategoryI18n {
  miniGames: MiniGameI18n[];
  teas: TeaI18n[];
  taskDescriptions: TaskDescI18n;
}

const EN: Record<WorryCategory, CategoryI18n> = {
  work_stress: {
    miniGames: [
      { name: 'Work Break Breathing', description: 'Release work stress with 4-7-8 breathing to calm tension.' },
      { name: 'Float Away Work Worries', description: 'Write your work worries on clouds and let the wind scatter them.' },
      { name: 'Task Priority Sort', description: 'Clarify what truly matters and set down unnecessary burdens.' },
    ],
    teas: [
      { name: 'Mint & Chamomile Calm Tea', desc: 'Eases work tension, helps body and mind relax.' },
      { name: 'Peach Oolong Energy Tea', desc: 'Replenishes energy without caffeine anxiety.' },
      { name: 'Lavender Lily Starlight Tea', desc: 'Deep relaxation, helps you shift from work mode to rest mode.' },
    ],
    taskDescriptions: {
      breathing: ['Close your eyes and give yourself a 3-minute break using 4-7-8 breathing.', 'Take 5 slow belly breaths at your desk and feel your shoulders slowly relax.', 'Find a quiet corner, close your eyes, listen for 5 sounds around you, and breathe deeply.'],
      sorting: ["Sort today's work tasks into 'Must Do', 'Could Do', and 'Drop' baskets.", 'Find 3 workplace factors beyond your control and place them in the Let Go basket.', 'Sort anxiety-triggering work emails into Need Reply and For Reference baskets.'],
      writing: ["Write a letter to your most stressful project: 'I've done my best; the rest is up to time.'", 'Write down one small work accomplishment you felt proud of this week and send it to the tree hollow.', "Write yourself a 'permission to log off' note, declaring today's work officially done."],
      action: ['Stand up and pour yourself a glass of water, drinking it slowly sip by sip.', 'Step to the window and slowly drink a glass of water while looking at the sky.', 'Brew yourself a warm drink, feel the warmth of the cup, and sip it gently.'],
      gratitude: ['Write three things at work you feel grateful for on the petals.', "Write down a colleague's name who helped you and silently say thank you.", 'Write down 3 positive changes this job has brought to your life.'],
      movement: ['Stand up and slowly move every joint from head to toe, following the 60-second guide.', 'Walk out of the office for a slow stroll, noticing the sensation of your feet on the ground.', 'Do 10 slow neck and shoulder rolls to release desk tension.'],
    },
  },
  learning_growth: {
    miniGames: [
      { name: 'Knowledge Organizer', description: 'Sort fragmented knowledge into a system to reduce learning anxiety.' },
      { name: 'Pre-Exam Calm', description: 'Calm nerves before exams or important study sessions.' },
      { name: 'Dispel Impostor Syndrome', description: "Write down 'I'm not good enough' thoughts, then let them go." },
    ],
    teas: [
      { name: 'Mint Lemon Focus Tea', desc: 'Boosts concentration, helps enter deep thinking mode.' },
      { name: 'Peach Oolong Energy Tea', desc: 'Gentle pick-me-up for long study sessions.' },
      { name: 'Lavender Chamomile Sleep Tea', desc: 'Helps the brain unwind after studying, improves sleep.' },
    ],
    taskDescriptions: {
      breathing: ['Take 3 deep breaths to clear mental clutter before starting to study.', 'When your study efficiency drops, stop and breathe with eyes closed for 2 minutes.', 'Use 4-7-8 breathing to quickly calm down when exam or study anxiety strikes.'],
      sorting: ["Sort what you need to learn into 'Core Concepts', 'Secondary Details', and 'Can Skip' baskets.", 'Find 3 learning anxiety thoughts and analyze which are facts and which are fears.', 'Organize your study materials and put outdated, unneeded items in the discard basket.'],
      writing: ['Write down why you chose this field and your long-term goals, then drop them in the tree hollow.', 'Rewrite one new concept you learned today in your own words as a letter.', "Write yourself an encouraging note: 'Progress doesn't need perfection, just consistency.'"],
      action: ["Pour yourself a glass of water and review today's key learnings as you drink.", 'Set your phone to Do Not Disturb and study focused for 25 minutes while sipping water.', 'Reward yourself with a sip of water each time you complete a study module.'],
      gratitude: ['Write 3 positive changes learning has brought you on the petals.', 'Write down a teacher or friend who supports your learning and thank them.', 'Thank yourself for choosing to spend time learning and growing today.'],
      movement: ['Stand up and stretch your body for 60 seconds after every 45 minutes of study.', "During study breaks, look out the window to rest your eyes and brain while stretching your body.", 'Do a simple neck relaxation routine to release tension from looking down.'],
    },
  },
  interpersonal: {
    miniGames: [
      { name: 'Social Anxiety Cloud', description: "Write worries about others' opinions on clouds and let them drift away." },
      { name: 'Conflict Calm Technique', description: 'Breathing skills to stay calm during interpersonal conflicts.' },
      { name: 'Gratitude Shells', description: 'Collect shells representing beautiful relationships.' },
    ],
    teas: [
      { name: 'Rose Honey Self-Love Tea', desc: 'Gently nurture yourself, build healthy self-love capacity.' },
      { name: 'Mint Chamomile Cool Tea', desc: 'Stay clear-headed when emotions run high.' },
      { name: 'Lavender Lily Soothe Tea', desc: 'Release social pressure, return to inner peace.' },
    ],
    taskDescriptions: {
      breathing: ['When feeling tense in social situations, take 3 slow belly breaths.', 'Take 5 deep breaths before receiving a call or message that makes you nervous.', 'Do 3 minutes of breathing exercises before bed to release social fatigue.'],
      sorting: ["Separate 'other people's opinions' from 'facts' — one basket each.", "Sort difficult relationships into 'Can Repair' and 'Need to Release' baskets.", 'Identify 3 situations where you over-accommodate others and place them in the Need to Change basket.'],
      writing: ['Write an unsent letter to someone you care about but have conflict with — drop it in the tree hollow.', 'Write down 3 moments when you felt truly understood and send them to yourself.', 'Describe what your ideal social boundaries look like and drop it in the tree hollow.'],
      action: ['Pour yourself a glass of water and silently say something kind about someone with each sip.', "Practice saying 'no' once — start with something small, then drink water to celebrate.", 'Send a brief, friendly message to someone you trust, then drink a glass of water.'],
      gratitude: ['Write 3 relationships that make you feel warm on the petals.', 'Write down the name of someone who helped you during a hard time.', 'Thank yourself for having the courage to face interpersonal challenges today.'],
      movement: ['Clench your fists for 5 seconds then release, feeling the shift from tension to relaxation, for 60 seconds.', 'Do a body boundary exercise: feel the space your body occupies.', 'Smile at yourself in the mirror while doing light neck and shoulder stretches.'],
    },
  },
  family_origin: {
    miniGames: [
      { name: 'Past vs. Present', description: 'Separate old wounds from choices you can make differently today.' },
      { name: 'Trigger Point Calm', description: 'Use breathing to find calm when family topics stir emotions.' },
      { name: 'Let Go of the Old Shell', description: "Release expectations and responsibilities that aren't yours to carry." },
    ],
    teas: [
      { name: 'Chamomile Honey Warm Tea', desc: 'A warm hug for your inner child.' },
      { name: 'Rose Lavender Peace Tea', desc: 'Soothe past wounds and find inner stillness.' },
      { name: 'Lily Mint Renewal Tea', desc: 'Rediscover your own worth — not defined by the past.' },
    ],
    taskDescriptions: {
      breathing: ['When family topics stir emotions, stop and take 5 deep breaths.', 'Start each morning with 3 minutes of breathing meditation to set your emotional foundation.', 'Take 3 deep breaths before calling family to center yourself.'],
      sorting: ["Separate 'what parents expect' from 'what I truly want' — one basket each.", "Sort childhood memories into 'Warmth' and 'Needs Healing' baskets.", 'Find 3 behavioral patterns inherited from your family of origin and place them in the Need to Change basket.'],
      writing: ["Write a letter to your younger self: 'You've already done so well.'", "Write down what you think 'home' should look like — in your own definition.", 'Record how it felt the moment you noticed yourself repeating a family pattern and send it as a letter.'],
      action: ['Pour yourself a glass of warm water, saying something gentle to yourself with each sip.', 'Do one small thing entirely for yourself without considering what family thinks, then drink water to celebrate.', 'Arrange a little corner that belongs only to you, then rest with a cup of water.'],
      gratitude: ['Write 3 positive influences your family has had on you on the petals.', 'Write about a moment of resilience and courage you showed while growing up.', 'Thank the family member who once understood you.'],
      movement: ['Do a grounding exercise: stand firmly and feel the ground supporting you, for 60 seconds.', 'Use your body to draw a circle, symbolizing the boundary you are setting for yourself.', 'Hold yourself in a self-hug for 30 seconds.'],
    },
  },
  social_environment: {
    miniGames: [
      { name: "Blow Away Others' Gaze", description: "Write society's judgments on clouds and let them drift with the wind." },
      { name: 'True Self vs. People-Pleasing', description: 'Distinguish your real preferences from what you do to please others.' },
      { name: 'Inner Anchor', description: 'Find your quiet center in a noisy world.' },
    ],
    teas: [
      { name: 'Mint Lemon Clear Mind Tea', desc: 'Clear the noise and find your own voice again.' },
      { name: 'Peach Chamomile Renewal Tea', desc: 'Refresh and rediscover your authentic self.' },
      { name: 'Lavender Rose Inner Peace Tea', desc: 'Maintain inner serenity amid all the commotion.' },
    ],
    taskDescriptions: {
      breathing: ['When scrolling social media makes you anxious, take 5 deep breaths.', 'Schedule 3 minutes of pure breathing time each day — no phone, no doing.', 'When you see content that triggers comparison, close your eyes and breathe for 10 seconds immediately.'],
      sorting: ["Separate 'what I truly love' from 'what society says I should love'.", 'List 3 changes you made to fit in with others and place them in the Can Let Go basket.', "Sort your follow list into 'nourishes me' and 'drains me' baskets."],
      writing: ["Write down your 3 core values — no caring what anyone thinks — and drop it in the tree hollow.", 'Describe a moment when you felt completely yourself and send it as a letter.', "Write one sentence for the tree hollow: 'I don't need to be anyone else — I am enough as I am.'"],
      action: ["Pour yourself water, sip slowly, and remind yourself with each sip: 'My worth isn't defined by others.'", 'Unfollow 3 accounts that make you anxious, then drink water to celebrate.', 'Wear your most comfortable clothes and sip a glass of water, not worrying about what anyone thinks.'],
      gratitude: ['Write 3 unique things about yourself that you admire on the petals.', 'Write down someone who accepts you as you are.', 'Thank the world for having people who appreciate the real you.'],
      movement: ['Do a self-space exercise: stretch your limbs and feel the space you occupy, for 60 seconds.', 'Sway freely to music you love — no worrying about how you look.', 'Strike a confident pose in the mirror and hold it for 30 seconds.'],
    },
  },
  physical_health: {
    miniGames: [
      { name: 'Body Awareness Breathing', description: 'Reconnect with your body through breath, feeling every part.' },
      { name: 'Gentle Stretch', description: 'Move your body gently to release accumulated tension.' },
      { name: 'Sensory Shells', description: 'Collect shells representing different sensory experiences to heighten body awareness.' },
    ],
    teas: [
      { name: 'Ginger Honey Warm Tea', desc: 'Warm the body and promote circulation.' },
      { name: 'Chamomile Mint Sleep Tea', desc: 'Aid sleep and improve rest quality.' },
      { name: 'Lemon Lavender Fresh Tea', desc: 'Refresh the body and restore vitality.' },
    ],
    taskDescriptions: {
      breathing: ['Take 5 long, deep belly breaths and notice your abdomen rise and fall.', 'Do 3 minutes of 4-7-8 breathing before bed to help fall asleep.', 'Take 3 stretching breaths before getting out of bed to wake up your body.'],
      sorting: ["Sort your health habits into 'Already Doing' and 'Want to Build' baskets.", 'Find 3 behaviors that harm your health and put them in the Need to Change basket.', "Distinguish 'genuinely physically tired' from 'mentally exhausted' and sort them into two baskets."],
      writing: ["Write today's body sensations as a letter: where is there tension? Where feels relaxed? Drop it in the tree hollow.", 'Write down 3 small health goals and mail them to yourself.', 'Write a word of gratitude to the most tired part of your body and drop it in the tree hollow.'],
      action: ['Slowly drink a glass of warm water and feel it travel from your throat to your stomach.', 'Stand up, pour water, and gently stretch your whole body as you drink.', 'Thank a different part of your body with each sip of water.'],
      gratitude: ['Write one thing on the petals that you are grateful your body does for you.', 'Write down 3 things your body enables you to enjoy: walking, eating, hugging.', 'Thank your body for carrying you through everything and still standing strong.'],
      movement: ['Do a full body scan from head to toe, noticing the sensation in each area, for 60 seconds.', 'Walk slowly and feel each contact of your foot with the ground.', 'Stretch your shoulders and back to release the tension of the day.'],
    },
  },
  time_management: {
    miniGames: [
      { name: 'Priority Organizer', description: 'Clarify what is urgent and important, and stop feeling busy for nothing.' },
      { name: 'Focus Restore', description: 'Use breathing exercises to restore scattered attention.' },
      { name: 'Blow Away Time Anxiety', description: "Blow away the anxious thought that 'I don't have enough time'." },
    ],
    teas: [
      { name: 'Mint Lemon Focus Tea', desc: 'Sharpen concentration and use time efficiently.' },
      { name: 'Peach Ginger Energy Tea', desc: 'Quickly recharge and break through procrastination.' },
      { name: 'Chamomile Lavender Relax Tea', desc: 'Let go of time anxiety and enjoy unhurried presence.' },
    ],
    taskDescriptions: {
      breathing: ['When time feels scarce, take 3 deep breaths and return to the present moment.', 'Take a 1-minute breathing pause when switching between tasks.', "At the end of the day, do 3 minutes of breathing meditation and release the urge to 'do more'."],
      sorting: ["Use the four-quadrant method: sort today's tasks into Urgent & Important, Important Not Urgent, Urgent Not Important, Neither.", 'List the 3 biggest time sinks in your day and place them in the Needs Evaluation basket.', "Split your to-do list into 'Must Do Today' and 'Can Do Tomorrow' baskets."],
      writing: ["Write down tomorrow's 3 most important tasks — just 3 — and drop them in the tree hollow.", "Record where your time went today: which tasks truly added value? Write it as a letter.", "Write a reminder to the tree hollow: 'Done is better than perfect.'"],
      action: ['Pour yourself a glass of water and tick off one completed item from your to-do list with each sip.', 'Put your phone in another room and focus on one task for 15 minutes while drinking water.', 'Use drinking water as a Pomodoro rest signal: focus for 25 minutes, then take a sip.'],
      gratitude: ['Write down one thing you had time to do today that made you happy.', 'Write 3 ways time management has improved your life.', 'Thank yourself for making time to grow, even in the midst of busyness.'],
      movement: ['Stand up and walk around every 45 minutes of sitting.', 'Do 3 deep breaths with arms raised overhead — a simple but effective energy reset.', 'Stand at the window to rest your eyes and brain while moving your neck.'],
    },
  },
  emotion_management: {
    miniGames: [
      { name: 'Emotion Regulation Breathing', description: 'No matter what emotion arises, use breathing to restore balance.' },
      { name: 'Emotions as Passing Clouds', description: 'See emotions as clouds in the sky — they come and go.' },
      { name: 'Emotion Naming', description: 'Learn to give each emotion a name and keep a healthy distance.' },
    ],
    teas: [
      { name: 'Lavender Chamomile Calm Tea', desc: 'Steady emotions and find the stillness within.' },
      { name: 'Rose Honey Comfort Tea', desc: 'Gently wrap your aching heart in warmth.' },
      { name: 'Lily Mint Solace Tea', desc: 'Deep soothing, letting taut emotions fully relax.' },
    ],
    taskDescriptions: {
      breathing: ['When emotion surges, do 5 rounds of 4-7-8 breathing.', 'Do 3 minutes of breathing meditation morning and evening to stabilize your emotional baseline.', 'When you feel angry, take 10 deep breaths before speaking.'],
      sorting: ['Name the emotions that appeared today and place them in the right basket: Anger? Sadness? Anxiety?', "Separate 'triggering event' from 'emotional reaction' — one basket each.", "Sort emotions into 'temporary visitors' and 'signals that need attention' baskets."],
      writing: ["Write down the emotions you felt today and drop them in the tree hollow — no judging right or wrong.", "Write a letter to your most frequent negative emotion: 'I see you…' and drop it in the tree hollow.", 'Write 3 methods that help you calm down emotionally and drop them in the tree hollow to build your emotion toolkit.'],
      action: ["Pour yourself warm water, and say 'I allow myself to feel this emotion' inwardly with each sip.", 'When emotions run high, splash cold water on your face, then slowly drink a full glass.', 'Find a safe way to express emotions — drawing, running, singing — then drink water.'],
      gratitude: ['Write one thing on the petals that you are grateful your emotions taught you.', 'Write down 3 moments that made you feel at peace.', 'Thank your emotions — they are the antennae through which you sense the world.'],
      movement: ['When angry, go for a brisk walk and feel your feet meeting the ground.', 'When sad, hold yourself and sway gently for 60 seconds.', 'When anxious, clench your fists, inhale deeply, then slowly release — repeat.'],
    },
  },
};

const JA: Record<WorryCategory, CategoryI18n> = {
  work_stress: {
    miniGames: [
      { name: '仕事中の呼吸法', description: '4-7-8呼吸法で仕事のストレスを解放し、緊張を和らげる。' },
      { name: '仕事の悩みを飛ばそう', description: '頭を占領している仕事の悩みを雲に書いて、風に散らせよう。' },
      { name: 'タスク優先順位整理', description: '本当に重要なことを明確にして、不要な負担を手放そう。' },
    ],
    teas: [
      { name: 'ミント＆カモミール安心茶', desc: '仕事の緊張をほぐし、心と体をリラックスさせる。' },
      { name: 'ピーチ烏龍元気茶', desc: 'カフェインの不安なく、エネルギーを補給。' },
      { name: 'ラベンダー・ユリの星空茶', desc: '深いリラックスで、仕事モードから休息モードへ切り替える。' },
    ],
    taskDescriptions: {
      breathing: ['目を閉じ、4-7-8呼吸法で3分間の仕事の休憩を取ろう。', 'デスクで5回ゆっくり腹式呼吸をして、肩が少しずつ緩むのを感じよう。', '静かな場所を見つけ、目を閉じて周囲の5つの音を聞きながら深呼吸。'],
      sorting: ['今日の仕事タスクを「必ずやる」「やれたらやる」「やらない」の3つに分けよう。', 'コントロールできない職場の要因を3つ見つけて「手放すバスケット」に入れよう。', '不安になるメールを「要返信」と「参考のみ」の2つに分けよう。'],
      writing: ['最もプレッシャーを感じるプロジェクトへ手紙を書こう：「最善を尽くした、あとは時間に任せる」。', '今週の仕事で誇りに思った小さなことを書いて、ツリーホロウへ投函しよう。', '「退勤許可証」を自分に書こう：今日の仕事はここで終わり、と宣言。'],
      action: ['立ち上がって水を一杯注ぎ、ゆっくり一口ずつ飲もう。', 'デスクを離れて窓際に行き、空を眺めながらゆっくり水を飲もう。', '温かい飲み物を入れ、カップから伝わる温もりを感じながら少しずつ味わおう。'],
      gratitude: ['職場で感謝できることを3つ、花びらに書こう。', '助けてくれた同僚の名前を書いて、心の中でありがとうと伝えよう。', 'この仕事がもたらしてくれた3つのポジティブな変化を書こう。'],
      movement: ['立ち上がり、頭のてっぺんからつま先まで、60秒のガイドに従って体を動かそう。', 'オフィスを出てゆっくり歩き、足の裏が地面に触れる感覚に注意しよう。', '肩と首をゆっくり10回転させて、デスクワークの緊張を解放しよう。'],
    },
  },
  learning_growth: {
    miniGames: [
      { name: '知識整理術', description: 'バラバラな知識を体系に整えて、学習不安を減らそう。' },
      { name: '試験前の静心法', description: '試験や重要な学習の前に緊張を和らげよう。' },
      { name: 'インポスター症候群を散らせ', description: '「自分はダメだ」という思いを書き出して、吹き飛ばそう。' },
    ],
    teas: [
      { name: 'ミント＆レモン集中茶', desc: '集中力を高め、深い思考モードに入る助けになる。' },
      { name: 'ピーチ烏龍元気茶', desc: '長時間の学習にぴったりな、穏やかな目覚めの一杯。' },
      { name: 'ラベンダー＆カモミール安眠茶', desc: '学習後の脳をリラックスさせ、睡眠の質を改善する。' },
    ],
    taskDescriptions: {
      breathing: ['勉強を始める前に3回深呼吸して、頭の中の雑念を払い落とそう。', '学習効率が落ちたら、目を閉じて2分間深呼吸しよう。', '試験や学習への不安が押し寄せてきたら、4-7-8呼吸法で素早く落ち着こう。'],
      sorting: ['学ぶ内容を「コア概念」「補足的な詳細」「スキップ可能」の3つに分けよう。', '学習不安を引き起こす思いを3つ見つけ、どれが事実でどれが恐れかを分析しよう。', '学習資料を整理して、古いものや不要なものを「処分バスケット」に入れよう。'],
      writing: ['この分野を選んだ理由と長期目標を書いてツリーホロウへ。', '今日学んだ新しい概念を自分の言葉で説明し直して、手紙として書こう。', '自分への励ましの言葉をツリーホロウへ：「上達に完璧は要らない、継続だけでいい」。'],
      action: ['水を一杯注いで、飲みながら今日のポイントを振り返ろう。', 'スマホをサイレントにして、水を飲みながら25分間集中して学習しよう。', '学習モジュールが完了するたびに、ご褒美として水を一口飲もう。'],
      gratitude: ['学習があなたにもたらした3つのポジティブな変化を花びらに書こう。', '学習を支えてくれた先生や友人の名前を書き、感謝を伝えよう。', '今日、時間を作って学び・成長しようとした自分に感謝しよう。'],
      movement: ['45分学習したら立ち上がって体を伸ばそう（60秒ガイドに従って）。', '学習の合間に窓際で遠くを眺め、目と脳を休めながら体を動かそう。', 'うつむいて学習した首の緊張を解放するシンプルなストレッチをしよう。'],
    },
  },
  interpersonal: {
    miniGames: [
      { name: '社交不安の雲', description: '他人の評価への心配を雲に書いて、流れていかせよう。' },
      { name: '対立の冷静法', description: '人間関係の摩擦の中で落ち着きを保つ呼吸テクニック。' },
      { name: '感謝の貝殻', description: '素敵な人間関係を表す貝殻を集めよう。' },
    ],
    teas: [
      { name: 'ローズ＆ハニー自己愛茶', desc: '自分を優しく大切にして、健康な自己愛を育む。' },
      { name: 'ミント＆カモミール清涼茶', desc: '感情が高ぶっているときも、頭を冷静に保てる。' },
      { name: 'ラベンダー＆ユリ安らぎ茶', desc: '社交のプレッシャーを解放して、内なる平和に戻る。' },
    ],
    taskDescriptions: {
      breathing: ['社交の場で緊張したら、ゆっくり腹式呼吸を3回しよう。', '緊張させるメッセージや電話を受ける前に、5回深呼吸しよう。', '毎晩寝る前に3分間呼吸練習をして、社交の心理的疲労を解放しよう。'],
      sorting: ['「他人の意見」と「事実」を分けよう——それぞれ別のバスケットに。', '悩ましい人間関係を「修復できる」と「手放す必要がある」の2つに分けよう。', '他人に過剰に合わせてしまう場面を3つ見つけ、「変えたいバスケット」に入れよう。'],
      writing: ['最も大切だが最近対立している人への、送らない手紙をツリーホロウへ。', '「理解してもらえた」と感じた3つの瞬間を書いて、自分に送ろう。', '理想の社交的な境界線はどんな形かを書いてツリーホロウへ投函しよう。'],
      action: ['水を一杯注ぎ、一口ごとに誰かへの優しい言葉を心の中で伝えよう。', '小さなことから「ノー」と一度言ってみよう——言えたら水を飲んでお祝い。', '信頼できる友人へ短いメッセージを送って、それから水を一杯飲もう。'],
      gratitude: ['温かみを感じる3つの人間関係を花びらに書こう。', '困ったときに助けてくれた人の名前を書こう。', '今日、人間関係の難しさに向き合う勇気を持った自分に感謝しよう。'],
      movement: ['拳を5秒握り締めてから解放し、緊張から弛緩への変化を感じる——60秒続けよう。', '「身体的な境界線」の練習：自分の体が占める空間を感じよう。', '鏡に向かって笑顔を作り、肩や首を軽くほぐそう。'],
    },
  },
  family_origin: {
    miniGames: [
      { name: '過去と現在', description: '過去の傷と、今変えられる選択を区別しよう。' },
      { name: 'トリガー冷静法', description: '家族の話題で感情が揺れたとき、呼吸で平静を取り戻そう。' },
      { name: '古い殻を手放す', description: '自分のものではない期待と責任を手放そう。' },
    ],
    teas: [
      { name: 'カモミール＆ハニー温心茶', desc: 'インナーチャイルドへの温かい抱擁。' },
      { name: 'ローズ＆ラベンダー安寧茶', desc: '過去の傷を癒し、内なる平静を見つける。' },
      { name: 'ユリ＆ミント新生茶', desc: '自分の価値を再発見——過去に定義させない。' },
    ],
    taskDescriptions: {
      breathing: ['家族の話題で感情が揺れたら、5回深呼吸しよう。', '毎朝3分間の呼吸瞑想で一日の感情の基盤を作ろう。', '家族に電話する前に3回深呼吸して気持ちを落ち着けよう。'],
      sorting: ['「親の期待」と「自分が本当に望む生活」を分けよう——別々のバスケットに。', '子どもの頃の記憶を「温かい」と「癒しが必要な」の2つに分けよう。', '原家族から引き継いだ行動パターンを3つ見つけ、「変えたい」バスケットに入れよう。'],
      writing: ['幼い頃の自分への手紙をツリーホロウへ：「もうすでによくやっているよ」。', '「家」とはどんなものであるべきか——自分なりの定義を書こう。', '家族のパターンを繰り返していると気づいた瞬間の気持ちを記録し、手紙として書こう。'],
      action: ['温かい水を一杯注ぎ、一口ごとに自分への優しい言葉を心の中で伝えよう。', '家族の目を気にせず、完全に自分のための小さなことを一つして、水を飲んでお祝い。', '自分だけの空間コーナーを整えて、水を飲んで一休みしよう。'],
      gratitude: ['家族があなたに与えた3つのポジティブな影響を花びらに書こう。', '成長過程で見せた自分の粘り強さと勇気を書こう。', '家族の中でかつて自分を理解してくれた人に感謝しよう。'],
      movement: ['「グラウンディング」の練習：両足をしっかり立て、地面の支えを感じよう（60秒）。', '体で円を描いて、自分が自分のために設けた境界を表現しよう。', '自分を抱きしめて30秒間そのままでいよう。'],
    },
  },
  social_environment: {
    miniGames: [
      { name: '他人の目を吹き飛ばせ', description: '外からの評価を雲に書いて、風に散らせよう。' },
      { name: '本当の自分 vs 迎合', description: '本当の好みと、他人のためにしていることを区別しよう。' },
      { name: '内なるアンカー', description: '喧騒の世界で、自分だけの静かな中心を見つけよう。' },
    ],
    teas: [
      { name: 'ミント＆レモン清心茶', desc: '雑念を払い、自分の声を取り戻す。' },
      { name: 'ピーチ＆カモミール新生茶', desc: 'リフレッシュして、本当の自分を再発見する。' },
      { name: 'ラベンダー＆ローズ内なる平和茶', desc: 'ざわめきの中でも、内なる静けさを保つ。' },
    ],
    taskDescriptions: {
      breathing: ['SNSを見て不安になったら、5回深呼吸しよう。', '毎日3分間、スマホも何もしない純粋な呼吸の時間を確保しよう。', '比較心を刺激するコンテンツを見たら、すぐ目を閉じて10秒呼吸しよう。'],
      sorting: ['「本当に自分が好きなもの」と「社会が好きであるべきだと言うもの」を区別しよう。', '他人に合わせるためにした変化を3つ挙げて、「手放せるバスケット」に入れよう。', 'フォローリストを「自分を育てる」と「自分を消耗させる」の2つに分けよう。'],
      writing: ['誰の顔色もうかがわず、自分の3つのコアバリューを書いてツリーホロウへ。', '完全に自分でいられた瞬間を描写して、自分宛に手紙を書こう。', 'ツリーホロウへ一言：「他の誰かになる必要はない、私は私でいい」。'],
      action: ['水をゆっくり飲みながら、一口ごとに「私の価値は他人が決めない」と思い出そう。', '不安にさせるアカウントを3つアンフォローして、水を飲んでお祝い。', '一番楽な服を着て水を一杯飲もう——他人の目を気にせずに。'],
      gratitude: ['自分の個性的な点で感心できることを3つ花びらに書こう。', '自分をありのまま受け入れてくれる人の名前を書こう。', '本当の自分を大切にしてくれる人が世界にいることに感謝しよう。'],
      movement: ['「自己空間」の練習：四肢を伸ばし、自分が占める空間を感じよう（60秒）。', '好きな音楽に合わせて自由に揺れよう——踊り方を気にしなくていい。', '鏡の前で自信のあるポーズを決めて30秒間キープしよう。'],
    },
  },
  physical_health: {
    miniGames: [
      { name: '身体感覚呼吸', description: '呼吸を通じて体と再つながり、各部位を感じよう。' },
      { name: '優しいストレッチ', description: '体を穏やかに動かして、溜まった緊張を解放しよう。' },
      { name: '感覚の貝殻', description: '異なる感覚体験を表す貝殻を集めて、身体意識を高めよう。' },
    ],
    teas: [
      { name: 'ジンジャー＆ハニー温身茶', desc: '体を温めて、血行を促進する。' },
      { name: 'カモミール＆ミント安眠茶', desc: '入眠を助け、休息の質を改善する。' },
      { name: 'レモン＆ラベンダー清新茶', desc: '体をリフレッシュして、活力を取り戻す。' },
    ],
    taskDescriptions: {
      breathing: ['5回長くゆっくり腹式呼吸をして、お腹の動きを感じよう。', '寝る前に3分間の4-7-8呼吸法で入眠を助けよう。', '起き上がる前に3回伸びをしながら呼吸して、体を目覚めさせよう。'],
      sorting: ['健康習慣を「すでにやっている」と「身につけたい」の2つに分けよう。', '健康を損なう行動を3つ見つけて「変えたいバスケット」に入れよう。', '「本当に体が疲れている」と「心が疲れている」を区別して2つのバスケットに。'],
      writing: ['今日の体の感覚を手紙に書こう：どこが張っている？どこがリラックスしている？', '健康への3つの小さな目標を書いて、自分に送ろう。', '一番疲れている体の部位へ感謝の言葉を書いてツリーホロウへ。'],
      action: ['温かい水をゆっくり飲み、喉からお腹に流れ込む感覚を感じよう。', '立ち上がって水を注ぎ、飲みながら全身を軽くストレッチしよう。', '水を一口飲むたびに、体の一部位に感謝しよう。'],
      gratitude: ['体が自分のためにしてくれることを一つ、花びらに書こう。', '体のおかげで楽しめる3つのこと——歩くこと、食べること、抱きしめること——を書こう。', 'たくさんのことを経験しながらもずっと支えてくれた体に感謝しよう。'],
      movement: ['頭のてっぺんから爪先まで身体スキャンをして、各部位の感覚に注目しよう（60秒）。', 'ゆっくり歩いて、足の裏が地面に触れるたびの感覚を味わおう。', '肩と背中を伸ばして、一日溜まった緊張を解放しよう。'],
    },
  },
  time_management: {
    miniGames: [
      { name: '優先順位整理', description: 'タスクの緊急度と重要度を整理して、「なんとなく忙しい」状態から抜け出そう。' },
      { name: '集中力回復', description: '呼吸練習で散漫になった注意力を取り戻そう。' },
      { name: '時間不安を吹き飛ばせ', description: '「間に合わない」という不安な思いを吹き飛ばそう。' },
    ],
    teas: [
      { name: 'ミント＆レモン集中茶', desc: '集中力を高めて、時間を効率的に使う。' },
      { name: 'ピーチ＆ジンジャーエネルギー茶', desc: '素早くエネルギーを補給して、先延ばしを打破する。' },
      { name: 'カモミール＆ラベンダーリラックス茶', desc: '時間への不安を手放して、今この瞬間の余裕を楽しむ。' },
    ],
    taskDescriptions: {
      breathing: ['時間が足りないと感じたら、3回深呼吸して今この瞬間に戻ろう。', 'タスクを切り替えるときに1分間呼吸の休憩を入れよう。', '一日の終わりに3分間呼吸瞑想をして「もっとやらなきゃ」という執念を手放そう。'],
      sorting: ['四象限法：今日のことを「緊急×重要」の4つのバスケットに分けよう。', '最も時間を取られている3つのことを挙げて「評価が必要なバスケット」に入れよう。', 'ToDoリストを「今日必ずやる」と「明日でもいい」の2つに分けよう。'],
      writing: ['明日最も重要な3つのことをツリーホロウへ——3つだけ書こう。', '今日の時間の使い方を記録しよう：本当に価値があったことは何か？', 'ツリーホロウへ自分への一言：「完了は完璧に勝る」。'],
      action: ['水を注いで、一口ごとにToDoリストの完了した項目を確認しよう。', 'スマホを別の部屋に置いて、水を飲みながら一つのことに15分集中しよう。', 'ポモドーロ法の休憩サインとして水を飲む：25分集中→水を一口。'],
      gratitude: ['今日、時間が取れてうれしかったことを一つ花びらに書こう。', '時間管理が生活にもたらした3つの良い変化を書こう。', '忙しい中でも自己成長のために時間を割いた自分に感謝しよう。'],
      movement: ['45分座ったら立ち上がって歩き、体を動かそう。', '腕を上げながら3回深呼吸——シンプルだけど効果的なエネルギーリセット。', '窓際に立って遠くを眺め、目と脳を休めながら首を動かそう。'],
    },
  },
  emotion_management: {
    miniGames: [
      { name: '感情調整の呼吸', description: 'どんな感情が押し寄せても、呼吸でバランスを取り戻そう。' },
      { name: '感情は過ぎ去る雲', description: '感情を空の雲のように眺めよう——来ては去っていく。' },
      { name: '感情の命名', description: '感情に名前をつけて、適切な距離を保つ練習。' },
    ],
    teas: [
      { name: 'ラベンダー＆カモミール安神茶', desc: '感情を落ち着かせ、内なる平穏を取り戻す。' },
      { name: 'ローズ＆ハニー慰めの茶', desc: '傷ついた心を優しく包み込む。' },
      { name: 'ユリ＆ミント癒しの茶', desc: '深い安らぎで、張り詰めた感情を完全にほぐす。' },
    ],
    taskDescriptions: {
      breathing: ['感情が押し寄せてきたら、4-7-8呼吸を5回しよう。', '毎朝夕、3分間の呼吸瞑想で感情のベースラインを安定させよう。', '怒りを感じたら、まず10回深呼吸してから話そう。'],
      sorting: ['今日現れた感情に名前をつけて、対応するバスケットに分けよう：怒り？悲しみ？不安？', '「引き金になった出来事」と「感情反応」を分けよう——別々のバスケットに。', '感情を「短期の訪問者」と「注意が必要なシグナル」の2つに分けよう。'],
      writing: ['今日感じた感情をツリーホロウへ——良い悪いは判断しなくていい。', '最もよく現れるネガティブな感情への手紙を書こう：「あなたのことが見えているよ…」', '感情を和らげるのに役立つ方法を3つ書いてツリーホロウへ——感情ツールボックスを作ろう。'],
      action: ['温かい水を注ぎ、一口ごとに「この感情を感じていいよ」と心の中で言おう。', '感情が高ぶったら冷水で顔を洗い、それからゆっくり水を一杯飲み干そう。', '感情を安全に表現できる方法を見つけよう：絵を描く、走る、歌う——そして水を飲もう。'],
      gratitude: ['感情が教えてくれたことへの感謝を一つ花びらに書こう。', '穏やかだと感じた3つの瞬間を書こう。', 'あなたの感情に感謝しよう——それらは世界を感知するアンテナ。'],
      movement: ['怒りを感じたら、足の裏と地面の接触を感じながら速歩きしよう。', '悲しいときは自分を抱きしめて、ゆっくり揺れよう（60秒）。', '不安なときは拳を握ってゆっくり吸い込み、ゆっくり解放する——何度も繰り返そう。'],
    },
  },
};

const CONTENT_MAP: Record<string, Record<WorryCategory, CategoryI18n>> = { en: EN, ja: JA };

export function getWorryI18n(type: WorryCategory, language: string): CategoryI18n | null {
  return CONTENT_MAP[language]?.[type] ?? null;
}
