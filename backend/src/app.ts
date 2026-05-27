import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import { pinoHttp } from 'pino-http';
import { env } from './config/env.js';

import authRouter from './modules/auth/auth.router.js';
import usersRouter from './modules/users/users.router.js';
import categoriesRouter from './modules/categories/categories.router.js';
import tagsRouter from './modules/tags/tags.router.js';
import docsRouter from './modules/docs/docs.router.js';
import attachmentsRouter from './modules/attachments/attachments.router.js';
import searchRouter from './modules/search/search.router.js';
import statsRouter from './modules/stats/stats.router.js';

const app = express();

// Middleware
app.use(helmet());
app.use(cors({
  origin: env.FRONTEND_URL,
  credentials: true,
}));
app.use(express.json());
app.use(cookieParser());
app.use(pinoHttp({
  level: env.LOG_LEVEL,
}));

// Routes
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/users', usersRouter);
app.use('/api/v1/categories', categoriesRouter);
app.use('/api/v1/tags', tagsRouter);
app.use('/api/v1/docs', docsRouter);
app.use('/api/v1/attachments', attachmentsRouter);
app.use('/api/v1/search', searchRouter);
app.use('/api/v1/stats', statsRouter);

// Global Error Handler
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  req.log.error(err);
  res.status(err.status || 500).json({
    success: false,
    error: {
      code: err.code || 'INTERNAL_SERVER_ERROR',
      message: err.message || 'An unexpected error occurred',
    },
  });
});

export default app;
