import express from 'express';
import { createServer as createViteServer } from 'vite';
import cookieParser from 'cookie-parser';
import path from 'path';
import dotenv from 'dotenv';
import { apiRouter } from './server/api';
import { getDb } from './server/db';

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = parseInt(process.env.PORT || '3000', 10);

  // Body parsing & cookie middleware
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));
  app.use(cookieParser());

  // Initialize SQLite Database with verified schema & demo seed accounts
  try {
    await getDb();
    console.log('ThriftHub SQLite Database initialized and verified.');
  } catch (err) {
    console.error('Database initialization warning:', err);
  }

  // API router
  app.use('/api', apiRouter);

  // Healthcheck endpoint
  app.get('/api/health', (_req, res) => {
    res.json({ status: 'ok', service: 'ThriftHub Academic Resource Platform', timestamp: new Date().toISOString() });
  });

  // Client handling
  if (process.env.NODE_ENV === 'production') {
    const distPath = path.resolve(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  } else {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[ThriftHub] Backend and Vite dev server listening at http://localhost:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('[ThriftHub] Fatal server startup error:', err);
  process.exit(1);
});
