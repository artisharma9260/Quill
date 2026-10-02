import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import authRoutes from './routes/auth.js';
import blogRoutes from './routes/blogs.js';
import { notFound, errorHandler } from './middleware/error.js';

const app = express();

app.set('trust proxy', 1); // Render sits behind a proxy
app.use(helmet());

const allowed = (process.env.CLIENT_URL || 'http://localhost:5173')
  .split(',')
  .map((s) => s.trim().replace(/\/$/, ''))
  .filter(Boolean);

const escapeRe = (s) => s.replace(/[.+?^${}()|[\]\\]/g, '\\$&');

// Supports exact origins and "*" wildcards, e.g. https://quill-*-myteam.vercel.app
const isAllowed = (origin) =>
  allowed.some((a) =>
    a.includes('*')
      ? new RegExp('^' + a.split('*').map(escapeRe).join('[^.]*') + '$').test(origin)
      : a === origin
  );

app.use(
  cors({
    origin(origin, cb) {
      // allow same-origin / curl (no Origin header) and whitelisted origins
      if (!origin || isAllowed(origin)) return cb(null, true);
      cb(new Error('Not allowed by CORS'));
    },
  })
);

app.use(express.json({ limit: '1mb' }));

app.get('/', (_req, res) => res.json({ name: 'Quill API', status: 'ok' }));
app.get('/api/health', (_req, res) => res.json({ status: 'ok', uptime: process.uptime() }));

const authLimiter = rateLimit({ windowMs: 15 * 60 * 1000, limit: 50, standardHeaders: true, legacyHeaders: false, message: { message: 'Too many attempts, please try again later.' } });
app.use('/api/auth', authLimiter, authRoutes);
app.use('/api/blogs', blogRoutes);

app.use(notFound);
app.use(errorHandler);

export default app;