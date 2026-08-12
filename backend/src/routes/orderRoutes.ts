import { Request, Response, Router } from 'express';
import { orderStore } from '../services/orderStore.js';
import { OrderStatus } from '../types/index.js';
import { validateCreateOrderPayload } from '../validation/orderValidation.js';

export const orderRouter = Router();

// GET /api/orders - Get all orders
orderRouter.get('/', (req: Request, res: Response) => {
  const orders = orderStore.getAllOrders();
  res.json({
    success: true,
    count: orders.length,
    data: orders,
  });
});

// POST /api/orders - Create new order
orderRouter.post('/', (req: Request, res: Response) => {
  const availableItems = orderStore.getMenuItems();
  const validation = validateCreateOrderPayload(req.body, availableItems);

  if (!validation.isValid) {
    return res.status(400).json({
      success: false,
      message: 'Invalid order submission',
      errors: validation.errors,
    });
  }

  const autoSimulate = req.query.autoSimulate !== 'false';
  const newOrder = orderStore.createOrder(req.body, autoSimulate);

  res.status(201).json({
    success: true,
    message: 'Order placed successfully!',
    data: newOrder,
  });
});

// GET /api/orders/:id - Get order details by ID
orderRouter.get('/:id', (req: Request, res: Response) => {
  const order = orderStore.getOrderById(req.params.id);
  if (!order) {
    return res.status(404).json({
      success: false,
      error: `Order with ID '${req.params.id}' not found.`,
    });
  }

  res.json({
    success: true,
    data: order,
  });
});

// PATCH /api/orders/:id/status - Update order status (Admin / simulation)
orderRouter.patch('/:id/status', (req: Request, res: Response) => {
  const { status, note } = req.body;
  const validStatuses: OrderStatus[] = [
    'ORDER_RECEIVED',
    'PREPARING',
    'OUT_FOR_DELIVERY',
    'DELIVERED',
    'CANCELLED',
  ];

  if (!status || !validStatuses.includes(status as OrderStatus)) {
    return res.status(400).json({
      success: false,
      error: `Invalid status provided. Allowed values: ${validStatuses.join(', ')}`,
    });
  }

  const existingOrder = orderStore.getOrderById(req.params.id);
  if (!existingOrder) {
    return res.status(404).json({
      success: false,
      error: `Order with ID '${req.params.id}' not found.`,
    });
  }

  const updatedOrder = orderStore.updateOrderStatus(req.params.id, status as OrderStatus, note);

  res.json({
    success: true,
    message: `Order status updated to '${status}'.`,
    data: updatedOrder,
  });
});

// GET /api/orders/:id/stream - Server-Sent Events (SSE) live updates
orderRouter.get('/:id/stream', (req: Request, res: Response) => {
  const orderId = req.params.id;
  const order = orderStore.getOrderById(orderId);

  if (!order) {
    return res.status(404).json({
      success: false,
      error: `Order with ID '${orderId}' not found.`,
    });
  }

  // Set SSE Headers
  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive',
    'Access-Control-Allow-Origin': '*',
  });

  // Send initial order state
  res.write(`data: ${JSON.stringify(order)}\n\n`);

  // Register client for live updates
  orderStore.registerSseClient(orderId, res);

  // Send periodic ping to prevent connection timeout
  const pingInterval = setInterval(() => {
    res.write(': heartbeat ping\n\n');
  }, 15000);

  req.on('close', () => {
    clearInterval(pingInterval);
    orderStore.unregisterSseClient(orderId, res);
  });
});
