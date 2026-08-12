import request from 'supertest';
import { beforeEach, describe, expect, it } from 'vitest';
import { createApp } from '../src/app.js';
import { orderStore } from '../src/services/orderStore.js';

const app = createApp();

describe('Food Order Management API Test Suite (TDD)', () => {
  beforeEach(() => {
    orderStore.clearAllOrders();
  });

  describe('GET /api/menu', () => {
    it('should return all menu items with 200 OK status', async () => {
      const res = await request(app).get('/api/menu');
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data)).toBe(true);
      expect(res.body.data.length).toBeGreaterThan(0);
      expect(res.body.data[0]).toHaveProperty('name');
      expect(res.body.data[0]).toHaveProperty('price');
    });

    it('should filter menu items by category', async () => {
      const res = await request(app).get('/api/menu?category=pizza');
      expect(res.status).toBe(200);
      expect(res.body.data.every((item: any) => item.category === 'pizza')).toBe(true);
    });

    it('should filter menu items by search query', async () => {
      const res = await request(app).get('/api/menu?search=wagyu');
      expect(res.status).toBe(200);
      expect(res.body.data.length).toBeGreaterThan(0);
      expect(res.body.data[0].name.toLowerCase()).toContain('wagyu');
    });

    it('should return single menu item by ID', async () => {
      const res = await request(app).get('/api/menu/m1');
      expect(res.status).toBe(200);
      expect(res.body.data.id).toBe('m1');
    });

    it('should return 404 for non-existent menu item ID', async () => {
      const res = await request(app).get('/api/menu/m99999');
      expect(res.status).toBe(404);
      expect(res.body.success).toBe(false);
    });
  });

  describe('POST /api/orders (Order Placement & Validation)', () => {
    const validPayload = {
      items: [
        { menuItemId: 'm1', quantity: 2 },
        { menuItemId: 'm8', quantity: 1 },
      ],
      deliveryDetails: {
        customerName: 'Jane Doe',
        address: '123 Main Street, Apt 4B',
        phoneNumber: '+15551234567',
        deliveryNotes: 'Ring bell twice',
      },
    };

    it('should create order successfully and return 201 Created', async () => {
      const res = await request(app)
        .post('/api/orders?autoSimulate=false')
        .send(validPayload);

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty('id');
      expect(res.body.data.status).toBe('ORDER_RECEIVED');
      expect(res.body.data.items.length).toBe(2);
      expect(res.body.data.subtotal).toBeGreaterThan(0);
      expect(res.body.data.tax).toBeGreaterThan(0);
      expect(res.body.data.totalAmount).toBeGreaterThan(0);
    });

    it('should reject order with empty items array (400 Bad Request)', async () => {
      const invalidPayload = {
        ...validPayload,
        items: [],
      };

      const res = await request(app).post('/api/orders').send(invalidPayload);
      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.errors).toHaveProperty('items');
    });

    it('should reject order with invalid customer phone number (400 Bad Request)', async () => {
      const invalidPayload = {
        ...validPayload,
        deliveryDetails: {
          ...validPayload.deliveryDetails,
          phoneNumber: '12', // Too short
        },
      };

      const res = await request(app).post('/api/orders').send(invalidPayload);
      expect(res.status).toBe(400);
      expect(res.body.errors).toHaveProperty('phoneNumber');
    });

    it('should reject order with missing address (400 Bad Request)', async () => {
      const invalidPayload = {
        ...validPayload,
        deliveryDetails: {
          ...validPayload.deliveryDetails,
          address: '',
        },
      };

      const res = await request(app).post('/api/orders').send(invalidPayload);
      expect(res.status).toBe(400);
      expect(res.body.errors).toHaveProperty('address');
    });

    it('should reject order if menu item ID does not exist', async () => {
      const invalidPayload = {
        ...validPayload,
        items: [{ menuItemId: 'nonexistent-item-id', quantity: 1 }],
      };

      const res = await request(app).post('/api/orders').send(invalidPayload);
      expect(res.status).toBe(400);
      expect(res.body.errors).toHaveProperty('items[0].menuItemId');
    });
  });

  describe('GET /api/orders and GET /api/orders/:id', () => {
    it('should retrieve list of all orders', async () => {
      const res = await request(app).get('/api/orders');
      expect(res.status).toBe(200);
      expect(Array.isArray(res.body.data)).toBe(true);
      expect(res.body.data.length).toBeGreaterThan(0);
    });

    it('should retrieve order by ID', async () => {
      const res = await request(app).get('/api/orders/ord-sample-101');
      expect(res.status).toBe(200);
      expect(res.body.data.id).toBe('ord-sample-101');
    });

    it('should return 404 for non-existent order ID', async () => {
      const res = await request(app).get('/api/orders/ord-unknown-xyz');
      expect(res.status).toBe(404);
    });
  });

  describe('PATCH /api/orders/:id/status (Order Status Updates)', () => {
    it('should update order status to PREPARING', async () => {
      const res = await request(app)
        .patch('/api/orders/ord-sample-101/status')
        .send({ status: 'PREPARING', note: 'Kitchen started cooking' });

      expect(res.status).toBe(200);
      expect(res.body.data.status).toBe('PREPARING');
      expect(
        res.body.data.statusHistory.some((h: any) => h.status === 'PREPARING')
      ).toBe(true);
    });

    it('should return 400 Bad Request for invalid status string', async () => {
      const res = await request(app)
        .patch('/api/orders/ord-sample-101/status')
        .send({ status: 'INVALID_STATUS_NAME' });

      expect(res.status).toBe(400);
    });

    it('should return 404 when updating non-existent order', async () => {
      const res = await request(app)
        .patch('/api/orders/non-existent-order/status')
        .send({ status: 'DELIVERED' });

      expect(res.status).toBe(404);
    });
  });
});
