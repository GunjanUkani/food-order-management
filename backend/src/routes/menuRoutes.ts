import { Request, Response, Router } from 'express';
import { orderStore } from '../services/orderStore.js';

export const menuRouter = Router();

// GET /api/menu - Retrieve menu items with optional category & search filter
menuRouter.get('/', (req: Request, res: Response) => {
  const category = req.query.category as string | undefined;
  const search = req.query.search as string | undefined;

  const items = orderStore.getMenuItems(category, search);
  res.json({
    success: true,
    count: items.length,
    data: items,
  });
});

// GET /api/menu/:id - Retrieve single menu item
menuRouter.get('/:id', (req: Request, res: Response) => {
  const item = orderStore.getMenuItemById(req.params.id);
  if (!item) {
    return res.status(404).json({
      success: false,
      error: `Menu item with ID '${req.params.id}' not found.`,
    });
  }

  res.json({
    success: true,
    data: item,
  });
});
