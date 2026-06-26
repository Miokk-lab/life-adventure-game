/**
 * Job Queue & Orchestration
 * Manages task tracking, coordinates text→image→video pipeline
 * Returns progress via polling
 */

import { generateTextContent } from './agents/textContentAgent';
import { generateImages } from './agents/imageAgent';
import { generateVideo } from './agents/videoAgent';
import type { TextContent } from './agents/textContentAgent';
import type { GeneratedImages } from './agents/imageAgent';
import type { GeneratedVideo } from './agents/videoAgent';

export interface JobStatus {
  taskId: string;
  status: 'pending' | 'text' | 'image' | 'video' | 'complete' | 'error' | 'fallback';
  progress: number;
  textContent?: TextContent;
  images?: GeneratedImages;
  video?: GeneratedVideo;
  error?: string;
  fallbackData?: any;
  createdAt: number;
  updatedAt: number;
}

class JobQueueManager {
  private jobs: Map<string, JobStatus> = new Map();
  private timeoutMs = 12000; // 12 second timeout before fallback

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

    // Start async pipeline
    this.runPipeline(taskId, worryText, worryType, deepseekKey, geminiKey, supabaseToken);

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
    const startTime = Date.now();

    try {
      // Stage 1: Text generation (40% progress)
      const job = this.jobs.get(taskId);
      if (!job) return;

      job.status = 'text';
      job.updatedAt = Date.now();

      const textContent = await Promise.race([
        generateTextContent(worryText, worryType, deepseekKey),
        this.timeoutPromise(this.timeoutMs, 'text'),
      ]);

      job.textContent = textContent;
      job.progress = 40;
      job.updatedAt = Date.now();

      // Check elapsed time
      if (Date.now() - startTime > this.timeoutMs) {
        return this.setFallback(taskId, worryType);
      }

      // Stage 2: Image generation (70% progress)
      job.status = 'image';
      job.updatedAt = Date.now();

      const images = await Promise.race([
        generateImages(textContent.imagePromptHero, textContent.imagePromptMonster, worryType, geminiKey, supabaseToken),
        this.timeoutPromise(this.timeoutMs - (Date.now() - startTime), 'image'),
      ]);

      job.images = images;
      job.progress = 70;
      job.updatedAt = Date.now();

      // Check elapsed time
      if (Date.now() - startTime > this.timeoutMs) {
        return this.setFallback(taskId, worryType);
      }

      // Stage 3: Video generation (100% progress)
      job.status = 'video';
      job.updatedAt = Date.now();

      const video = await Promise.race([
        generateVideo(textContent.animationPrompt, images.heroUrl, images.monsterUrl, worryType),
        this.timeoutPromise(this.timeoutMs - (Date.now() - startTime), 'video'),
      ]);

      job.video = video;
      job.progress = 100;
      job.status = 'complete';
      job.updatedAt = Date.now();
    } catch (error) {
      console.error(`[jobQueue] Pipeline error for ${taskId}:`, error);

      // Check if we should use fallback
      if (Date.now() - startTime > this.timeoutMs) {
        return this.setFallback(taskId, worryType);
      }

      const job = this.jobs.get(taskId);
      if (job) {
        job.error = error instanceof Error ? error.message : 'Unknown error';
        job.status = 'error';
        job.updatedAt = Date.now();
      }
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

    // Load offline preset by worry_type
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
    // Remove jobs older than 1 hour
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
function getOfflinePreset(worryType: string): any {
  const presets: Record<string, any> = {
    work_stress: {
      heroName: '熊猫悠悠',
      heroStory: '一只天生悠闲的熊猫，懂得在竹林间享受生活的节奏。',
      monsterName: '笃笃魔',
      monsterStory: '疯狂敲击的啄木鸟，代表无法停止的工作焦虑。',
      cbtAnalysis: '你的工作热情反映了高度的责任心。但当我们把个人价值完全绑定到工作成果时，就失去了生活的平衡...',
      victoryText: '熊猫悠悠摇动竹林，笃笃魔终于停下疯狂的啄击，眼神变得清晰。',
      heroUrl: 'https://placeholder.com/hero/panda.png',
      monsterUrl: 'https://placeholder.com/monster/woodpecker.png',
      videoUrl: 'https://placeholder.com/video/work-stress.mp4',
    },
    learning_growth: {
      heroName: '猫头鹰学学',
      heroStory: '充满智慧的夜行猫头鹰，纵观全局，知道何时该停顿。',
      monsterName: '圈圈魔',
      monsterStory: '在跑轮上疯狂奔跑却原地踏步的仓鼠，代表无效内卷。',
      cbtAnalysis: '你追求进步的样子很美。但过度关注速度而忽视方向，就成了盲目的奔跑...',
      victoryText: '学学挥动羽毛笔，跑轮散成金黄色花瓣，圈圈魔找到了新的视角。',
      heroUrl: 'https://placeholder.com/hero/owl.png',
      monsterUrl: 'https://placeholder.com/monster/hamster.png',
      videoUrl: 'https://placeholder.com/video/learning.mp4',
    },
    interpersonal: {
      heroName: '水豚橘橘',
      heroStory: '温暖的水豚，天生具有接纳的力量，不带评判。',
      monsterName: '刺刺魔',
      monsterStory: '敏感的豪猪，因害怕受伤而竖起所有的刺。',
      cbtAnalysis: '你的敏感反映了对深度连接的渴望。但防卫机制往往伤害了我们最想靠近的人...',
      victoryText: '橘橘递给刺刺魔一个温暖的拥抱，所有的刺都化成了粉色樱花。',
      heroUrl: 'https://placeholder.com/hero/capybara.png',
      monsterUrl: 'https://placeholder.com/monster/porcupine.png',
      videoUrl: 'https://placeholder.com/video/interpersonal.mp4',
    },
    family_origin: {
      heroName: '小鹿铃风',
      heroStory: '在风雨中独立行走的小鹿，轻盈且坚强。',
      monsterName: '壳壳魔',
      monsterStory: '背着沉重、破旧贝壳艰难爬行的寄居蟹，代表原生家庭的重担。',
      cbtAnalysis: '你背负这些重量，是因为对家和安全感最深沉的忠诚。但你有权利为自己选择新的道路...',
      victoryText: '小鹿轻轻敲了敲老旧的贝壳，壳壳魔换上了轻盈的新贝壳，找到了属于自己的家。',
      heroUrl: 'https://placeholder.com/hero/deer.png',
      monsterUrl: 'https://placeholder.com/monster/hermitcrab.png',
      videoUrl: 'https://placeholder.com/video/family.mp4',
    },
    social_environment: {
      heroName: '树袋熊棉棉',
      heroStory: '按照自己的节奏生活，不被外界浪潮影响的树袋熊。',
      monsterName: '迷失魔',
      monsterStory: '不断变色以迎合周围环境的变色龙，最终迷失了自己。',
      cbtAnalysis: '你敏锐感知社会期待，这是一份天赋。但当我们为了迎合而无限改变自己时，我们失去了最珍贵的独特性...',
      victoryText: '棉棉抱住变色龙，那闪烁的霓虹色褪去，变色龙恢复了纯净的翠绿色。',
      heroUrl: 'https://placeholder.com/hero/koala.png',
      monsterUrl: 'https://placeholder.com/monster/chameleon.png',
      videoUrl: 'https://placeholder.com/video/social.mp4',
    },
    physical_health: {
      heroName: '海獭滑板仔',
      heroStory: '活力四溢的海獭，顺水推舟，与自然和谐共处。',
      monsterName: '黑眼魔',
      monsterStory: '熬夜的浣熊，眼圈漆黑，强迫自己无休止地清洗，代表健康焦虑。',
      cbtAnalysis: '你强烈的身体警觉反映了对生命的珍视。但过度关注身体信号有时会放大焦虑本身...',
      victoryText: '海獭拉着浣熊漂浮在水面，黑眼魔的眼圈褪去，露出清澈的双眸。',
      heroUrl: 'https://placeholder.com/hero/otter.png',
      monsterUrl: 'https://placeholder.com/monster/raccoon.png',
      videoUrl: 'https://placeholder.com/video/health.mp4',
    },
    time_management: {
      heroName: '乌龟日晷爷爷',
      heroStory: '沉稳的乌龟，寿命极长，步履缓慢但目标坚定。',
      monsterName: '搬搬魔',
      monsterStory: '没有方向地疯狂搬运远超身体重量的工蚁，代表瞎忙与优先级混乱。',
      cbtAnalysis: '你对生命的珍惜令人感动。但当我们试图搬运全世界时，我们其实什么都没抓牢...',
      victoryText: '日晷爷爷停下搬搬魔，那座杂物山轰然化为清风，只剩最珍贵的一片叶子。',
      heroUrl: 'https://placeholder.com/hero/turtle.png',
      monsterUrl: 'https://placeholder.com/monster/ant.png',
      videoUrl: 'https://placeholder.com/video/time.mp4',
    },
    emotion_management: {
      heroName: '树懒禅禅',
      heroStory: '动作极慢，呼吸深长，情绪起伏极小的树懒。',
      monsterName: '气鼓魔',
      monsterStory: '遇到刺激就吸气膨胀、全身长满尖刺的河豚，代表易触发的爆炸情绪。',
      cbtAnalysis: '你充沛的情感是艺术家般的灵魂天赋。但当情绪成为主人而我们成为奴隶时，就失去了选择的自由...',
      victoryText: '树懒轻轻点一下河豚，河豚吐出一串晶莹的气泡，映着曾经的委屈但如今已经遥远。',
      heroUrl: 'https://placeholder.com/hero/sloth.png',
      monsterUrl: 'https://placeholder.com/monster/pufferfish.png',
      videoUrl: 'https://placeholder.com/video/emotion.mp4',
    },
  };

  return presets[worryType] || presets.work_stress; // Default fallback
}
