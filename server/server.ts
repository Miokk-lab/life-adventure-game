import 'dotenv/config';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
fs.mkdirSync('/tmp/claude-generated-images', { recursive: true });

import express from 'express';
import type { Request, Response } from 'express';
import { jobQueue, getOfflinePreset } from './jobQueue';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json({ limit: '10kb' }));

// ── CORS ──
app.use((_req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  if (_req.method === 'OPTIONS') {
    res.sendStatus(200);
    return;
  }
  next();
});

// ── Serve AI-generated images ──
app.use('/generated-images', express.static('/tmp/claude-generated-images'));

// ── Health check ──
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', service: 'mind-island-adventure', version: '1.0.0' });
});

// ── AI Adventure Creation (triggers pipeline) ──
app.post('/api/adventure/create', async (req: Request, res: Response) => {
  const { worryText, worryType, language = 'zh' } = req.body;

  if (!worryText || !worryType) {
    res.status(400).json({ error: 'Missing worryText or worryType' });
    return;
  }

  try {
    const deepseekKey = process.env.DEEPSEEK_API_KEY;
    const geminiKey = process.env.GEMINI_API_KEY;
    const supabaseToken = process.env.SUPABASE_TOKEN;

    if (!deepseekKey || !geminiKey) {
      return res.status(400).json({ error: 'Missing API keys (DEEPSEEK_API_KEY, GEMINI_API_KEY)' });
    }

    const taskId = `task_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;

    // Create job and start async pipeline
    const job = await jobQueue.createJob(taskId, worryText, worryType, deepseekKey, geminiKey, supabaseToken, language);

    res.json({
      task_id: taskId,
      status: job.status,
      progress: job.progress,
    });
  } catch (err) {
    console.error('Adventure creation failed:', err);
    res.status(500).json({ error: 'Failed to create adventure' });
  }
});

// ── Adventure Status (polling) ──
app.get('/api/adventure/:id/status', (req: Request, res: Response) => {
  const { id } = req.params;

  const job = jobQueue.getJob(id);
  if (!job) {
    return res.status(404).json({ error: 'Task not found' });
  }

  // Return progress + partial data
  const response: any = {
    task_id: job.taskId,
    status: job.status,
    progress: job.progress,
    stage: job.status, // text, image, video, complete, error, fallback
  };

  // Include data as it becomes available
  if (job.textContent) {
    response.text_content = {
      heroName: job.textContent.heroName,
      monsterName: job.textContent.monsterName,
      cbtAnalysis: job.textContent.cbtAnalysis,
      victoryText: job.textContent.victoryText,
    };
  }

  if (job.images) {
    response.images = job.images;
  }

  if (job.video) {
    response.video = job.video;
  }

  if (job.fallbackData) {
    response.fallback = job.fallbackData;
  }

  if (job.error) {
    response.error = job.error;
  }

  res.json(response);
});

// ── Adventure Data (full content) ──
app.get('/api/adventure/:id/data', (req: Request, res: Response) => {
  const { id } = req.params;

  const job = jobQueue.getJob(id);
  if (!job) {
    return res.status(404).json({ error: 'Task not found' });
  }

  // Only block on pending/text — image and later statuses have enough data for battle
  if (job.status === 'pending' || job.status === 'text') {
    return res.status(202).json({ error: 'Still generating, check /status for progress' });
  }

  const response: any = {
    task_id: job.taskId,
    status: job.status,
  };

  if (
    job.status === 'image_complete' ||
    job.status === 'victory_image_ready' ||
    job.status === 'video_complete' ||
    job.status === 'complete' ||
    job.status === 'image'
  ) {
    response.data = {
      ...job.textContent,
      heroUrl: job.images?.heroUrl,
      monsterUrl: job.images?.monsterUrl,
      videoUrl: job.video?.videoUrl ?? null,
    };
  } else if (job.status === 'fallback' || job.status === 'error') {
    response.data = job.fallbackData || job.textContent;
  }

  res.json(response);
});

// ── Video/Victory Image Status (background generation polling) ──
app.get('/api/adventure/:id/video-status', (req: Request, res: Response) => {
  const { id } = req.params;

  const job = jobQueue.getJob(id);
  if (!job) {
    return res.status(404).json({ error: 'Task not found' });
  }

  res.json({
    status: job.status,
    ready: job.status === 'video_complete',
    victoryImageUrl: job.victoryImageUrl ?? null,
    videoUrl: job.video?.videoUrl ?? null,
  });
});

// ── Offline preset (instant, no AI) ──
app.get('/api/adventure/offline/:worryType', (req: Request, res: Response) => {
  const preset = getOfflinePreset(req.params.worryType);
  res.json({ status: 'fallback', data: preset });
});

// ── Auth stub ──
app.post('/api/auth/login', (req: Request, res: Response) => {
  const { email } = req.body;
  res.json({
    token: `mock_jwt_${Date.now()}`,
    user: {
      id: `user_${Date.now()}`,
      email: email || 'villager@island.life',
      nickname: '新岛民',
      islandName: '心灵岛',
      avatarUrl: '',
    },
  });
});

app.post('/api/auth/register', (req: Request, res: Response) => {
  const { email, nickname } = req.body;
  res.json({
    token: `mock_jwt_${Date.now()}`,
    user: {
      id: `user_${Date.now()}`,
      email: email || 'villager@island.life',
      nickname: nickname || '新岛民',
      islandName: '心灵岛',
      avatarUrl: '',
    },
  });
});

// ── Game save stub ──
app.post('/api/save', (req: Request, res: Response) => {
  res.json({ saved: true, timestamp: new Date().toISOString() });
});

app.get('/api/load/:userId', (_req: Request, res: Response) => {
  res.json({ data: null, message: 'No cloud save found' });
});

// ── Serve built React frontend in production ──
if (process.env.NODE_ENV === 'production') {
  const distPath = path.join(__dirname, '../dist');
  app.use(express.static(distPath));
  app.get('*all', (_req, res) => res.sendFile(path.join(distPath, 'index.html')));
}

// ── Start server ──
if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`🧠 Mind Island Adventure server running on http://localhost:${PORT}`);
  });
}

export default app;
