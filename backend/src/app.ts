import cors from 'cors';
import express, { Express, Request, Response } from 'express';
import { menuRouter } from './routes/menuRoutes.js';
import { orderRouter } from './routes/orderRoutes.js';

export const createApp = (): Express => {
  const app = express();

  // Middleware
  app.use(cors({ origin: '*' }));
  app.use(express.json());

  // Health check endpoint
  app.get('/api/health', (_req: Request, res: Response) => {
    res.json({
      status: 'ok',
      service: 'Food Order Management API',
      timestamp: new Date().toISOString(),
    });
  });

  // API Routes
  app.use('/api/menu', menuRouter);
  app.use('/api/orders', orderRouter);

  // 404 Handler
  app.use((_req: Request, res: Response) => {
    res.status(404).json({
      success: false,
      error: 'API Endpoint not found.',
    });
  });

  return app;
};
