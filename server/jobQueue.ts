/**
 * Job Queue & Orchestration
 * Manages task tracking, coordinates text→image pipeline (battle-ready)
 * Then runs victory image + video generation in background
 */

import { generateTextContent } from './agents/textContentAgent';
import { generateImages, generateVictoryImage } from './agents/imageAgent';
import { generateVideo } from './agents/videoAgent';
import type { TextContent } from './agents/textContentAgent';
import type { GeneratedImages } from './agents/imageAgent';
import type { GeneratedVideo } from './agents/videoAgent';

export interface JobStatus {
  taskId: string;
  status:
    | 'pending'
    | 'text'
    | 'image'
    | 'image_complete'
    | 'victory_image_ready'
    | 'video_complete'
    | 'complete'
    | 'error'
    | 'fallback';
  progress: number;
  textContent?: TextContent;
  images?: GeneratedImages;
  video?: GeneratedVideo;
  victoryImageUrl?: string;
  error?: string;
  fallbackData?: any;
  createdAt: number;
  updatedAt: number;
}

class JobQueueManager {
  private jobs: Map<string, JobStatus> = new Map();
  private readonly TEXT_TIMEOUT_MS = 60000;  // 60s for text gen (allows DeepSeek→Agnes fallback)
  private readonly IMAGE_TIMEOUT_MS = 90000; // 90s for image gen (allows Gemini→Agnes fallback)

  async createJob(
    taskId: string,
    worryText: string,
    worryType: string,
    deepseekKey: string,
    geminiKey: string,
    supabaseToken?: string,
  ): Promise<JobStatus> {
    const job: JobStatus = {
      taskId,
      status: 'pending',
      progress: 0,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    this.jobs.set(taskId, job);

    // Start async pipeline (battle-blocking stages only)
    void this.runPipeline(taskId, worryText, worryType, deepseekKey, geminiKey, supabaseToken);

    return job;
  }

  private async runPipeline(
    taskId: string,
    worryText: string,
    worryType: string,
    deepseekKey: string,
    geminiKey: string,
    supabaseToken?: string,
  ) {
    try {
      const job = this.jobs.get(taskId);
      if (!job) return;

      // Stage 1: Text generation (→ 40%)
      job.status = 'text';
      job.updatedAt = Date.now();

      const agnesCfg = {
        agnesKey: process.env.AGNES_API_KEY,
        agnesBaseUrl: process.env.AGNES_BASE_URL,
        agnesTextModel: process.env.AGNES_TEXT_MODEL,
        agnesImageModel: process.env.AGNES_IMAGE_MODEL,
      };

      let textContent: TextContent;
      try {
        textContent = await Promise.race([
          generateTextContent(worryText, worryType, deepseekKey, agnesCfg),
          this.timeoutPromise(this.TEXT_TIMEOUT_MS, 'text'),
        ]);
      } catch {
        console.warn(`[jobQueue] Text generation timed out or failed for ${taskId}, using fallback`);
        return this.setFallback(taskId, worryType);
      }

      job.textContent = textContent;
      job.progress = 40;
      job.updatedAt = Date.now();

      // Stage 2: Image generation (→ 100%, battle ready)
      job.status = 'image';
      job.updatedAt = Date.now();

      let images: GeneratedImages;
      try {
        images = await Promise.race([
          generateImages(
            textContent.imagePromptHero,
            textContent.imagePromptMonster,
            worryType,
            geminiKey,
            supabaseToken,
            agnesCfg,
          ),
          this.timeoutPromise(this.IMAGE_TIMEOUT_MS, 'image'),
        ]);
      } catch {
        console.warn(`[jobQueue] Image generation timed out or failed for ${taskId}, using fallback`);
        return this.setFallback(taskId, worryType);
      }

      job.images = images;
      job.progress = 100;
      job.status = 'image_complete'; // ← Battle is now unblocked
      job.updatedAt = Date.now();

      // Fire background media pipeline (non-blocking — battle starts now)
      void this.runBackgroundMedia(taskId, textContent, images, worryType, geminiKey, supabaseToken, agnesCfg);

    } catch (error) {
      console.error(`[jobQueue] Pipeline error for ${taskId}:`, error);
      const job = this.jobs.get(taskId);
      if (job) {
        job.error = error instanceof Error ? error.message : 'Unknown error';
        job.status = 'error';
        job.updatedAt = Date.now();
      }
    }
  }

  private async runBackgroundMedia(
    taskId: string,
    textContent: TextContent,
    images: GeneratedImages,
    worryType: string,
    geminiKey: string,
    supabaseToken?: string,
    agnesCfg?: { agnesKey?: string; agnesBaseUrl?: string; agnesImageModel?: string },
  ) {
    const job = this.jobs.get(taskId);
    if (!job) return;

    // Background Stage 1: Victory image (PNG showing hero + monster at peace)
    try {
      const victoryImageUrl = await generateVictoryImage(
        textContent.victoryImagePrompt,
        images.heroUrl,
        images.monsterUrl,
        geminiKey,
        supabaseToken,
        agnesCfg,
      );
      job.victoryImageUrl = victoryImageUrl;
      job.status = 'victory_image_ready';
      job.updatedAt = Date.now();
      console.log(`[jobQueue] Victory image ready for ${taskId}: ${victoryImageUrl}`);
    } catch (err) {
      console.error(`[jobQueue] Victory image generation failed for ${taskId}:`, err);
    }

    // Background Stage 2: Victory video
    try {
      const video = await generateVideo(
        textContent.animationPrompt,
        images.heroUrl,
        images.monsterUrl,
        worryType,
      );
      job.video = video;
      job.status = 'video_complete';
      job.updatedAt = Date.now();
      console.log(`[jobQueue] Victory video ready for ${taskId}: ${video.videoUrl}`);
    } catch (err) {
      console.error(`[jobQueue] Video generation failed for ${taskId}:`, err);
    }
  }

  private async timeoutPromise(ms: number, stage: string): Promise<never> {
    return new Promise((_, reject) => {
      setTimeout(() => {
        reject(new Error(`${stage} stage timeout after ${ms}ms`));
      }, Math.max(0, ms));
    });
  }

  private setFallback(taskId: string, worryType: string) {
    const job = this.jobs.get(taskId);
    if (!job) return;

    const fallback = getOfflinePreset(worryType);

    job.fallbackData = fallback;
    job.status = 'fallback';
    job.progress = 100;
    job.updatedAt = Date.now();

    console.log(`[jobQueue] Fallback triggered for ${taskId} with preset: ${worryType}`);
  }

  getJob(taskId: string): JobStatus | undefined {
    return this.jobs.get(taskId);
  }

  getAllJobs(): JobStatus[] {
    return Array.from(this.jobs.values());
  }

  cleanupOldJobs(olderThanMs = 3600000) {
    const cutoff = Date.now() - olderThanMs;
    for (const [taskId, job] of this.jobs) {
      if (job.createdAt < cutoff) {
        this.jobs.delete(taskId);
      }
    }
  }
}

export const jobQueue = new JobQueueManager();

// Offline presets (8 categories)
export function getOfflinePreset(worryType: string): any {
  const presets: Record<string, any> = {
    work_stress: {
      heroName: '熊猫悠悠',
      heroStory: '一只天生悠闲的熊猫，懂得在竹林间享受生活的节奏。悠悠来自一片古老的竹林，那里时光流淌得格外缓慢。它深知：真正的效率来自内心的平静，而非不停的奔忙。悠悠拥有一种神奇的力量——每当它静坐在竹林里，周围的焦虑都会慢慢化为清风。它来帮助你，不是要让你停下前进，而是教你找到属于自己的节奏。',
      heroSkills: ['竹林冥想', '慢速呼吸', '优先排序', '放下执念'],
      monsterName: '笃笃魔',
      monsterStory: '疯狂敲击的啄木鸟，内心深处其实在寻找一个可以停下来的理由。笃笃魔从小就被告知"停下来就是失败"，于是它不停敲击，越来越快，越来越用力，却越来越空洞。它真正渴望的，是有人告诉它：你已经足够好了，可以歇一歇了。那些无休止的催促，不过是它内心深处对被认可的呐喊。',
      monsterAttacks: ['无休止催促：让你感觉永远不够努力', '自我批判风暴：用过去的失败淹没当下', '完美主义陷阱：让任何努力都显得不够好'],
      cbtAnalysis: '你的工作热情反映了高度的责任心与对生活的认真态度。当你感到工作压力巨大时，这背后其实藏着一个美好的品质：你在乎，你努力，你希望做到最好。这份认真，是你身上珍贵的能量。\n\n然而，当我们把"自我价值"完全绑定在工作表现上，就容易陷入一种叫做"应该陈述"的认知陷阱——总觉得自己"应该"更快、"应该"更好、"应该"永不停歇。这不是真实的，这是焦虑在说话。\n\n其实，效率和休息并不矛盾。研究发现，适当的休息能提升工作质量，而长期高压反而降低创造力。你的大脑需要充电时间，就像手机需要充电一样——这不是懒，这是必要。\n\n试试这个小实验：今天给自己设定一个"完成即可"的任务，不追求完美。你会发现，80分完成的任务，往往比拖延到100分更有价值。把精力当成预算，学会分配，而不是无限透支。\n\n你值得拥有一份既有成就感、又不耗尽自己的工作生活。放慢一步，不是放弃，而是为了走得更远。',
      victoryText: '悠悠踏着轻盈的步伐走向笃笃魔，后者正在一棵大树上疯狂敲击，木屑纷飞。"你已经很努力了，"悠悠轻声说，"停下来看看你做到了什么。"笃笃魔的喙悬在半空中，愣了一瞬。悠悠递给它一根翠绿的竹枝，"用这个感受一下风的节奏。"笃笃魔迟疑地接过竹枝，第一次放慢了动作——风吹过竹林，发出沙沙的声响。那一刻，它眼中的焦躁慢慢化为了清澈。敲击声停了，取而代之的是一首轻柔的竹林之歌。笃笃魔变成了一只悠然的鸟，在竹梢上轻轻鸣唱。你获得了"节奏之心"——知道何时用力、何时休息，这才是真正的力量。',
      heroUrl: '/hero-monster/panda.png',
      monsterUrl: '/hero-monster/woodpecker.png',
      videoUrl: '',
    },
    learning_growth: {
      heroName: '猫头鹰学学',
      heroStory: '充满智慧的夜行猫头鹰，纵观全局，知道何时该停顿。学学生活在一座古老的图书馆里，那里的书从地板堆到天花板。但学学从不急于读完所有书——它知道，真正的学习是在理解之后发生的，而不是在数量上。它的眼睛能看见别人看不见的：哪条路是真正重要的，哪些努力只是原地跑圈。它来帮你找到学习的真正方向，而不只是速度。',
      heroSkills: ['深度专注', '节奏调整', '视角切换', '知识整合'],
      monsterName: '圈圈魔',
      monsterStory: '在跑轮上疯狂奔跑的仓鼠，内心深处渴望终点和认可。圈圈魔每天奔跑二十小时，跑轮转得飞快，却永远在原地。它不是不努力，而是太努力了——努力到忘记问自己"为什么要跑"。它真正寻找的，是一个人告诉它：你跑的方向是对的，你可以停下来看看风景。那些让你感到内卷的压力，其实是圈圈魔在你心里高速转动的跑轮。',
      monsterAttacks: ['内卷焦虑：让你总觉得别人学得更多更快', '跑轮强迫：停下来就会产生强烈罪恶感', '自我怀疑：把努力过的每一步都否定掉'],
      cbtAnalysis: '你对成长的渴望是一种美好的驱动力，它让你不断突破舒适区，追求更好的自己。这份向上的心，是你最珍贵的财富，不要让压力把它变成负担。\n\n但有时候，我们容易陷入"比较陷阱"——总觉得别人学得更快、懂得更多。这是一种叫做"社会比较"的认知模式，它会让所有努力都显得不够，让所有成就都黯然失色。\n\n真实的学习不是线性的加速赛跑。神经科学告诉我们，大脑需要"整合期"来巩固知识。那些看似"浪费"的发呆时间、睡眠时间，其实是大脑在悄悄整理你学到的一切。休息不是偷懒，是学习的一部分。\n\n试着把"我要学完所有东西"换成"今天我要真正理解一件事"。深度胜过广度，理解胜过记忆。一个真正掌握的概念，比十个模糊印象更有价值。\n\n你的成长旅程是独一无二的。你有自己的节奏，有自己的方向。停下来问一问：这条路是我真正想走的吗？如果是，那就放下焦虑，享受每一步。',
      victoryText: '学学飞落在圈圈魔的跑轮旁，后者满头大汗却停不下来。"你跑得真快，"学学温和地说，"但你知道自己跑向哪里吗？"圈圈魔的脚步慢了一拍，这是几年来第一次。学学展开翅膀，在空中画出一道弧线，"跟我来，从高处看看。"圈圈魔迟疑地从跑轮上跳下——跑轮竟然停了，世界没有塌陷。它跟着学学飞上书架，俯瞰整个图书馆：原来它一直在一个角落里打转，而前方还有无数从未踏足的书架。它的眼睛里亮起了好奇的光芒。那个焦虑的圈圈魔，变成了一只探索者。你获得了"方向之眼"——知道何去何从，比跑得快更重要。',
      heroUrl: '/hero-monster/owl.png',
      monsterUrl: '/hero-monster/hamster.png',
      videoUrl: '',
    },
    interpersonal: {
      heroName: '水豚橘橘',
      heroStory: '温暖的水豚，天生具有接纳一切的力量，不带任何评判。橘橘生活在一条宁静的河边，所有动物都喜欢在它身边休息。它的秘密是：它从不要求别人改变，只是静静地存在，让周围的一切都感到安全。橘橘明白，每一个伤人的刺，背后都藏着一颗受过伤的心。它来帮你，不是要让你变得无坚不摧，而是教你用温柔化解那些刺。',
      heroSkills: ['温暖接纳', '边界守护', '共情倾听', '化解误会'],
      monsterName: '刺刺魔',
      monsterStory: '全身是刺的刺猬，其实是一颗极度渴望被拥抱的心。刺刺魔曾经被伤害过，于是它把所有刺都竖起来，告诉自己：先发制人，就不会再受伤。但每一根刺，都让它离温暖更远一步。它真正渴望的，是一个不怕它的刺、愿意靠近它的人。那些让人际关系感到棘手的防卫，其实是刺刺魔的眼泪，只是变成了尖锐的形状。',
      monsterAttacks: ['刺刺防御：让你觉得接近别人会带来伤害', '情感隔离：把真实感受锁进坚硬的外壳里', '过度敏感：把他人无心的话解读为攻击'],
      cbtAnalysis: '你对人际关系的敏感，说明你珍视与他人的连接。那些让你感到受伤或疲惫的时刻，恰恰证明你在认真对待这段关系。这种认真，是一份难得的真诚。\n\n然而，我们有时会陷入"读心术谬误"——把别人的行为解读为针对自己，或者预设对方会伤害自己。这会让我们在真正的亲近发生之前，就先筑起一道墙。\n\n真正的关系需要两个步骤：先照顾好自己的内心，才能与他人真诚连接。"边界"不是冷漠，而是一种自我尊重——它让你知道哪些可以接受，哪些不能；它保护你，同时也让真正在乎你的人能够靠近。\n\n试着练习"意图善意假设"：当别人的话让你不舒服时，先问自己：他们最善意的解读是什么？很多时候，误解来自沟通方式的不同，而不是真实的恶意。\n\n你值得拥有让你感到安全的关系。照顾好自己，才能照顾好彼此。',
      victoryText: '橘橘踏着轻盈的步伐走向刺刺魔，后者立刻竖起了所有的刺。"我知道你受过伤，"橘橘温柔地说，没有退缩，"但我不怕你的刺。"刺刺魔愣住了——从来没有人这样说过。橘橘慢慢坐下，"你不用保护自己了，这里很安全。"寂静中，刺刺魔的刺一根一根地软化，变成了粉色的花朵，飘落在地上。那一刻，刺刺魔哭了——不是悲伤的眼泪，而是久违的释放。它变成了一只温软的小刺猬，偎依在橘橘身边。你获得了"温柔之盾"——真正的保护，不是把自己武装起来，而是找到让你感到安全的关系。',
      heroUrl: '/hero-monster/capybara.png',
      monsterUrl: '/hero-monster/hedgehog.png',
      videoUrl: '',
    },
    family_origin: {
      heroName: '小鹿铃风',
      heroStory: '在风雨中独立行走的小鹿，轻盈且坚强，知道如何放下又如何前行。铃风来自一片古老的森林，那里的每棵树都有深深的根。铃风曾经背负着整片森林的记忆，直到它学会了：根是用来支撑自己生长的，不是用来把自己钉在原地的。它的脚步轻盈，因为它选择只携带那些滋养自己的记忆，而不是全部的重量。它来帮你，温柔地看待过去，轻盈地走向未来。',
      heroSkills: ['轻盈前行', '自我认同', '温柔切割', '重建归属'],
      monsterName: '壳壳魔',
      monsterStory: '背着破旧贝壳的寄居蟹，渴望找到一个真正属于自己的家。壳壳魔背着一个太大、太重、已经破损的贝壳，那是它从家里带出来的。它明明早已长大，却舍不得扔掉这个旧壳——因为那里面装着它对"家"的所有记忆和对被接纳的渴望。它真正寻找的，是一个新的家，一个适合现在自己的归宿。那些来自原生家庭的重量，是壳壳魔背负的破旧贝壳——沉重，但也承载着爱。',
      monsterAttacks: ['重壳束缚：用过去的规则评判现在的选择', '原生牵绊：让你觉得离开等于背叛', '身份混乱：分不清哪些想法是自己的，哪些是继承来的'],
      cbtAnalysis: '你与原生家庭的纠缠，说明你是一个重视连接、懂得感恩的人。那份无法割舍的牵绊，背后是深深的爱和对归属感的渴望。这不是软弱，这是人类最真实的情感之一。\n\n然而，有时我们会陷入"忠诚绑架"的认知模式——觉得成长、改变或者离开，等于对家人的背叛。这会让我们在需要前进的时候，被无形的链条拉住。\n\n真正的爱，是双向解放的。你可以深爱你的家人，同时也可以选择不同的生活方式。这两件事并不矛盾。健康的边界，不是不爱，而是在爱中保持自我——这对你和你的家人都更好。\n\n试着区分哪些是"家庭的期待"，哪些是"自己的愿望"。你可以尊重前者，同时也有权利选择后者。你的生命是你自己的故事，你有权利成为这个故事的主角。\n\n你已经背负了很多了。放下一些不属于你的重量，不是遗忘，而是腾出空间，装下更多属于你自己的美好。',
      victoryText: '铃风走向壳壳魔，后者弯着腰，背上的破旧贝壳咯吱作响。"那个壳太重了，"铃风轻声说，"但放下它不代表忘记里面的故事。"壳壳魔抬起头，眼里满是迷茫和不舍。铃风用鹿角轻轻触碰那个旧壳，"你已经长大了，配得上一个新家。"旧壳慢慢裂开，里面飞出一朵朵发光的蒲公英，带着所有美好的记忆飘向天空——不是消失，而是化成星光，永远都在。壳壳魔站直了身体，第一次看见了自己真实的样子：小巧、有力、自由。它找到了一个轻盈的新贝壳，恰好适合现在的它。你获得了"归属之光"——家不只是来处，也是你选择去往的方向。',
      heroUrl: '/hero-monster/deer.png',
      monsterUrl: '/hero-monster/hermitcrab.png',
      videoUrl: '',
    },
    social_environment: {
      heroName: '树袋熊棉棉',
      heroStory: '按照自己节奏生活的树袋熊，不被外界浪潮影响，知道什么对自己真正重要。棉棉挂在它最喜欢的桉树上，每天慢慢地生活。外面的世界变化再快，棉棉始终知道：那棵树是它的。它见过太多动物追赶潮流、迷失方向，然后又跌跌撞撞地回来找自己。棉棉来帮你，不是让你与世隔绝，而是在喧嚣中找到那棵属于你的树。',
      heroSkills: ['慢活哲学', '自我定锚', '真实表达', '拒绝迷失'],
      monsterName: '迷失魔',
      monsterStory: '不断变色的变色龙，深处渴望有一种颜色是真正属于自己的。迷失魔的皮肤每天都在变——为了工作变成灰色，为了社交变成亮色，为了家人变成柔和色。它太擅长迎合了，以至于有一天照镜子，发现自己已经不记得原来的颜色是什么了。它最深的恐惧不是不被接受，而是：如果我不再变色，还有人爱我吗？',
      monsterAttacks: ['随波逐流：让你觉得不跟上时代就会被淘汰', '身份迷失：把别人的期待当成了自己的愿望', '表演焦虑：觉得真实的自己不够好，需要伪装'],
      cbtAnalysis: '你对社会环境的敏感，是一种珍贵的社交智慧。你能感知他人的期待、察觉群体的氛围，这让你在很多场合都能应对自如。这不是缺点，这是天赋。\n\n然而，当我们过度依赖外部认可时，就容易陷入"自我认同外包"的陷阱——把自己的价值交给别人来定义，把自己的选择交给潮流来决定。这会让我们越来越不知道自己真正想要什么。\n\n真正的归属感，来自于你认识并接受真实的自己，然后找到同样欣赏真实你的人。那些因为你"表演"而喜欢你的人，喜欢的其实是一个角色，而不是你。当你勇敢做自己，留下来的才是真正懂你的人。\n\n试着每天问自己一个问题："如果没人知道，我会怎么选择？"那个答案，往往更接近你真实的心声。慢慢地，你会重新找到那个独一无二的自己。\n\n你不需要变成任何人，因为你本来的样子，已经足够珍贵。',
      victoryText: '棉棉从桉树上慢慢爬下来，走向迷失魔——此刻它正在疯狂切换颜色，一会儿橙、一会儿蓝、一会儿绿。"停一下，"棉棉温柔地说，"你原来是什么颜色？"迷失魔愣住了，所有颜色都停止了闪烁。沉默。"我……不记得了。"它的声音很小。棉棉递给它一面小镜子，"闭上眼睛，想想让你最快乐的一个瞬间。"迷失魔闭眼，慢慢地，它的皮肤开始透出一种宁静的翠绿色——那是它小时候在雨林里奔跑时的颜色。它睁开眼，看见镜中的自己，泪水滑落。那一刻，它想起了自己。那个焦虑的迷失魔，变成了一只骄傲的翠绿变色龙。你获得了"真实之镜"——你本来的样子，是你最珍贵的财富。',
      heroUrl: '/hero-monster/koala.png',
      monsterUrl: '/hero-monster/chameleon.png',
      videoUrl: '',
    },
    physical_health: {
      heroName: '海獭滑板仔',
      heroStory: '活力四溢的海獭，顺水推舟，懂得与身体的自然节律和谐共处。滑板仔住在一片温暖的海湾，它最喜欢的事是仰躺在水面上，看云朵飘过。它明白一个道理：身体是最诚实的朋友，它的信号都是为了保护你，而不是威胁你。滑板仔来帮你，不是要让你无视身体的感受，而是教你学会倾听，而不是恐惧。',
      heroSkills: ['顺流而动', '身心倾听', '放松疗愈', '活力充盈'],
      monsterName: '黑眼魔',
      monsterStory: '熬夜的浣熊，眼圈漆黑，内心深处渴望真正的安全感。黑眼魔一整夜都不敢睡，因为它总觉得：一旦放松警惕，什么可怕的事情就会发生。它强迫自己检查再检查，寻找每一个可能的威胁。它真正渴望的，不是没有危险，而是一种"就算我放松，也没关系"的安全感。那些关于身体健康的焦虑，是黑眼魔燃烧自己只为保持警觉的眼睛。',
      monsterAttacks: ['过度担忧：把身体正常的感觉解读为严重疾病', '熬夜焦虑：越担心越睡不着，越睡不着越担心', '强迫检查：反复确认症状只会放大而非消除焦虑'],
      cbtAnalysis: '你对健康的关注，反映了你对自己生命的珍视，以及对家人的责任感。愿意认真对待身体的信号，是一种积极的自我照顾态度，值得被肯定。\n\n然而，焦虑有一个特点：越是注意某个感觉，这个感觉就越明显。这叫做"躯体化焦虑"——当我们把注意力高度集中在身体某个部位时，大脑会放大那里传来的每一个信号，即使这些信号完全正常。\n\n身体是会波动的，不适感是正常的。心跳加速、肌肉紧张、轻微的头痛——这些都是身体在压力下的正常反应，而不是灾难的前兆。学会区分"身体的正常波动"和"需要就医的症状"，会让你既照顾好自己，又不被焦虑控制。\n\n试着今天做一件事：当你注意到身体某个不适时，深呼吸三次，然后问自己：这个感觉已经持续多久了？它在变好还是变坏？如果不确定，再观察一天再做决定。\n\n你的身体远比你想象的强壮。给它一点信任，它会给你安全感作为回报。',
      victoryText: '滑板仔在水面上漂浮，看见黑眼魔独自坐在岸边，眼圈漆黑，不敢闭眼。"来，"滑板仔拍拍水面，"躺到水上来。"黑眼魔迟疑地涉水，慢慢躺下——水托住了它，没有沉下去。"感受到了吗？"滑板仔轻声说，"你不用用力，也能被托着。"黑眼魔的身体开始慢慢放松，那双因过度警觉而睁大的眼睛，第一次微微闭合。海水轻轻摇晃，像一首久违的摇篮曲。黑眼魔的黑眼圈慢慢褪去，它沉沉地入睡了——这是几年来第一次真正的休息。醒来时，它的眼睛清澈明亮。你获得了"安住之心"——放松不是危险，是身体最需要的礼物。',
      heroUrl: '/hero-monster/otter.png',
      monsterUrl: '/hero-monster/raccoon.png',
      videoUrl: '',
    },
    time_management: {
      heroName: '乌龟日晷爷爷',
      heroStory: '沉稳的乌龟，寿命极长，步履缓慢但目标坚定，知道最重要的事值得花时间。日晷爷爷活了三百岁，见过无数动物匆忙来去。它知道：大多数"紧急"的事情，放到百年尺度里都微不足道。真正重要的事，往往不需要急，需要的是持续和专注。它来帮你，不是让你变慢，而是帮你找到什么值得你的时间，什么不值得。',
      heroSkills: ['稳步前行', '专注当下', '轻重取舍', '留白智慧'],
      monsterName: '搬搬魔',
      monsterStory: '没有方向地搬运重物的工蚁，内心渴望看见自己努力的意义。搬搬魔每天搬运远超自己体重的东西，从这里搬到那里，再从那里搬回来。它无法停下来，因为一旦停下，它就会想：我这么努力到底是为了什么？它真正渴望的，不是把东西搬完，而是有一天能停下来，看见自己搬运的意义。那种瞎忙的感觉，是搬搬魔找不到方向时的迷茫。',
      monsterAttacks: ['瞎忙轰炸：让每天都很忙却总感觉什么都没做完', '优先级混乱：把紧急的事当成重要的事，忽视真正重要的事', '时间吞噬：用无数小事填满日程，看不见大目标'],
      cbtAnalysis: '你对时间管理的焦虑，说明你非常珍视自己的生命，不想浪费任何一刻。这种对生命的认真态度，是非常美好的品质，它驱动着你不断成长。\n\n然而，我们容易陷入"紧急性偏差"——把"紧急"当成"重要"。待处理的邮件、未回的消息、明天的截止日期，这些紧急的事情会占领我们的注意力，而那些真正重要但不紧急的事——与家人相处、自我成长、照顾健康——却一拖再拖。\n\n有一个简单的工具：把你的任务分成四类：重要且紧急（马上做）、重要但不紧急（计划做）、不重要但紧急（委托或快速处理）、不重要且不紧急（舍弃）。每天给"重要但不紧急"的事情留出时间，才是真正的时间管理。\n\n试着每天设定三件"今天完成就算赢"的事情，其他都是加分项。当你完成这三件事时，允许自己感到满足，而不是立刻想下一件。\n\n你的时间是有限的，但你的专注力是无价的。把它用在值得的地方，你会发现，少即是多。',
      victoryText: '日晷爷爷走向搬搬魔，后者正拼命搬运一座小山般的杂物，气喘吁吁。"停一下，"日晷爷爷说，"告诉我，这些东西里，哪一件是你真正珍视的？"搬搬魔愣住了，第一次停下来看自己搬运的东西。沉默良久，它指向一片叶子——那是它第一次出门时带回来的。日晷爷爷点点头，"那就只带这一片。"搬搬魔放下了所有的东西，那座小山哗地散开，化成清风飘散。只有那片叶子，轻轻落在它的手里，发着温柔的光。搬搬魔站直了身体，感觉前所未有的轻盈。你获得了"取舍之慧"——知道什么值得带，是人生最重要的功课。',
      heroUrl: '/hero-monster/turtle.png',
      monsterUrl: '/hero-monster/ant.png',
      videoUrl: '',
    },
    emotion_management: {
      heroName: '树懒禅禅',
      heroStory: '动作极慢、呼吸深长的树懒，拥有情绪风暴中最强大的平静核心。禅禅生活在一棵古老的大树上，风来了它就随风晃，从不抗拒，也从不被吹倒。它不是没有情绪，而是学会了：感受情绪，但不成为情绪。它的慢，不是迟钝，而是在每一个反应之间，留出了选择的空间。它来帮你，教你做情绪的观察者，而不是它的囚徒。',
      heroSkills: ['深呼吸定', '情绪命名', '观察不评', '慈悲转化'],
      monsterName: '气鼓魔',
      monsterStory: '遇到刺激就膨胀的河豚，内心深处渴望被理解而不是被评判。气鼓魔一受到刺激就鼓起来，全身布满尖刺，吓走了所有想靠近的人。但气鼓魔最痛苦的不是愤怒，而是愤怒之后的孤独：它明明想说"我很受伤"，说出来的却是"我很愤怒"。它真正渴望的，是有人看见它尖刺背后的委屈，而不是被它的爆发吓跑。那些失控的情绪，是气鼓魔说不出口的眼泪。',
      monsterAttacks: ['情绪爆炸：把小刺激变成巨大反应，事后后悔', '膨胀尖刺：用愤怒推开想要靠近你的人', '触发风暴：某些词语或场景会自动激活强烈情绪'],
      cbtAnalysis: '你充沛的情感，是艺术家般的灵魂天赋。你能深深感受喜悦，也能深深感受悲伤，这说明你对生命有着丰富的体验。不要让人告诉你这是"太敏感"——这是一种礼物。\n\n然而，当情绪反应超过了触发事件的强度时，往往有一个隐藏的原因：那个情绪并不完全属于当下的事件，而是触碰到了过去的伤口。一句无心的话引发巨大的愤怒，一个小失误带来强烈的羞耻——这是旧的创伤在说话。\n\n情绪管理不是压制情绪，而是给情绪一个安全的空间。第一步：当强烈情绪来临时，暂停三秒，说出情绪的名字（"我现在感到愤怒/委屈/恐惧"）。命名情绪会激活理性脑，让你从被情绪淹没变成观察情绪。\n\n第二步：问自己"这个情绪想告诉我什么需求？"愤怒背后往往是边界被侵犯；悲伤背后是失去或渴望连接；恐惧背后是需要安全感。情绪是信使，不是敌人。\n\n你的情感深度是美好的。学会做它的主人，而不是它的奴隶，你会发现情感是你最强大的力量之一。',
      victoryText: '禅禅慢慢爬向气鼓魔，后者正因为一句小误会而急速膨胀，尖刺四射。所有其他动物都跑开了，但禅禅停在原地，不慌不忙。"我看见你了，"禅禅说，"你很委屈，对吗？"气鼓魔停止了膨胀——没有动物这样说过，它们只会逃跑。"我……"气鼓魔的尖刺软化了一根，"我只是不想被误解……""我知道，"禅禅点头，"说出来吧，我在听。"气鼓魔第一次把愤怒下面的委屈说了出来，声音越来越小，身体也慢慢缩回了正常大小。尖刺一根根落下，变成水晶般透明的泪珠，在地上发着柔和的光。气鼓魔看见了镜中的自己：小小的，柔软的，但完整的。你获得了"观情之眼"——看见情绪，而不是被情绪看见，这是最深的自由。',
      heroUrl: '/hero-monster/sloth.png',
      monsterUrl: '/hero-monster/pufferfish.png',
      videoUrl: '',
    },
  };

  return presets[worryType] || presets.work_stress;
}
