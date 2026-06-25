/**
 * Mind Island Adventure — Express Backend
 * Adapted from life-adventure_ver4 server.ts
 * Gemini 4-agent AI pipeline + offline fallback
 */

import express from 'express';
import type { Request, Response } from 'express';

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

// ── Health check ──
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', service: 'mind-island-adventure', version: '1.0.0' });
});

// ── AI Adventure Generation ──
app.post('/api/adventure/generate', async (req: Request, res: Response) => {
  const { worryText, worryType } = req.body;

  if (!worryText || !worryType) {
    res.status(400).json({ error: 'Missing worryText or worryType' });
    return;
  }

  try {
    // Try Gemini API if key is configured
    const apiKey = process.env.GEMINI_API_KEY;

    if (apiKey) {
      // Call Gemini for analysis + world generation
      const { analyzeProblem } = await import('./agents/analyzeAgent');
      const { generateWorld } = await import('./agents/worldAgent');
      const { generateQuests } = await import('./agents/questAgent');

      const analysis = await analyzeProblem(worryText, worryType, apiKey);
      const world = await generateWorld(analysis, apiKey);
      const quests = await generateQuests(world, apiKey);

      res.json({
        adventure_id: `adv_${Date.now()}`,
        status: 'ready',
        data: { analysis, world, quests },
      });
      return;
    }

    // No API key → return offline signal
    res.json({
      adventure_id: `adv_${Date.now()}`,
      status: 'offline',
      data: null,
    });

  } catch (err) {
    console.error('Adventure generation failed:', err);
    res.json({
      adventure_id: `adv_${Date.now()}`,
      status: 'offline',
      data: null,
    });
  }
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

// ── Start server ──
if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`🧠 Mind Island Adventure server running on http://localhost:${PORT}`);
  });
}

export default app;
