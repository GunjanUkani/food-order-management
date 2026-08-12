import { Response } from 'express';
import { INITIAL_MENU } from '../data/menuData.js';
import {
  CreateOrderPayload,
  MenuItem,
  Order,
  OrderItem,
  OrderStatus,
  StatusHistoryEntry,
} from '../types/index.js';

class OrderStore {
  private menuItems: MenuItem[] = [...INITIAL_MENU];
  private orders: Map<string, Order> = new Map();
  private sseClients: Map<string, Set<Response>> = new Map();
  private simulationTimers: Map<string, NodeJS.Timeout[]> = new Map();

  constructor() {
    this.seedInitialOrders();
  }

  private seedInitialOrders() {
    // Seed one sample completed/preparing order for immediate inspection
    const sampleOrder: Order = {
      id: 'ord-sample-101',
      items: [
        {
          menuItem: this.menuItems[0], // Truffle pizza
          quantity: 1,
          itemTotal: 18.99,
        },
        {
          menuItem: this.menuItems[7], // Hibiscus drink
          quantity: 2,
          itemTotal: 9.98,
        },
      ],
      deliveryDetails: {
        customerName: 'Alex Morgan',
        address: '742 Evergreen Terrace, Springfield',
        phoneNumber: '+1 (555) 234-5678',
        deliveryNotes: 'Please ring the doorbell and leave at front door.',
        paymentMethod: 'card',
      },
      status: 'PREPARING',
      subtotal: 28.97,
      tax: 2.32,
      deliveryFee: 3.99,
      totalAmount: 35.28,
      createdAt: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 3 * 60 * 1000).toISOString(),
      estimatedDeliveryTime: new Date(Date.now() + 25 * 60 * 1000).toISOString(),
      statusHistory: [
        {
          status: 'ORDER_RECEIVED',
          timestamp: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
          note: 'Order placed successfully by customer.',
        },
        {
          status: 'PREPARING',
          timestamp: new Date(Date.now() - 3 * 60 * 1000).toISOString(),
          note: 'Kitchen has accepted your order and started cooking.',
        },
      ],
      driverInfo: {
        name: 'Carlos Rivera',
        phone: '+1 (555) 987-6543',
        vehicle: 'Silver Honda Civic (Plate: 7XYZ89)',
        currentLat: 37.7749,
        currentLng: -122.4194,
      },
    };

    this.orders.set(sampleOrder.id, sampleOrder);
  }

  public getMenuItems(category?: string, search?: string): MenuItem[] {
    let result = [...this.menuItems];

    if (category && category !== 'all') {
      result = result.filter(
        (item) => item.category.toLowerCase() === category.toLowerCase()
      );
    }

    if (search && search.trim()) {
      const q = search.toLowerCase().trim();
      result = result.filter(
        (item) =>
          item.name.toLowerCase().includes(q) ||
          item.description.toLowerCase().includes(q)
      );
    }

    return result;
  }

  public getMenuItemById(id: string): MenuItem | undefined {
    return this.menuItems.find((item) => item.id === id);
  }

  public getAllOrders(): Order[] {
    return Array.from(this.orders.values()).sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  public getOrderById(id: string): Order | undefined {
    return this.orders.get(id);
  }

  public createOrder(payload: CreateOrderPayload, autoSimulate: boolean = true): Order {
    const orderItems: OrderItem[] = payload.items.map((cartItem) => {
      const menuItem = this.getMenuItemById(cartItem.menuItemId)!;
      return {
        menuItem,
        quantity: cartItem.quantity,
        itemTotal: parseFloat((menuItem.price * cartItem.quantity).toFixed(2)),
      };
    });

    const subtotal = parseFloat(
      orderItems.reduce((sum, item) => sum + item.itemTotal, 0).toFixed(2)
    );
    const tax = parseFloat((subtotal * 0.08).toFixed(2));
    const deliveryFee = subtotal > 35 ? 0 : 3.99;
    const totalAmount = parseFloat((subtotal + tax + deliveryFee).toFixed(2));

    const orderId = `ord-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 6)}`;
    const now = new Date().toISOString();
    const estTime = new Date(Date.now() + 30 * 60 * 1000).toISOString();

    const newOrder: Order = {
      id: orderId,
      items: orderItems,
      deliveryDetails: payload.deliveryDetails,
      status: 'ORDER_RECEIVED',
      subtotal,
      tax,
      deliveryFee,
      totalAmount,
      createdAt: now,
      updatedAt: now,
      estimatedDeliveryTime: estTime,
      statusHistory: [
        {
          status: 'ORDER_RECEIVED',
          timestamp: now,
          note: 'Order confirmed and sent to restaurant.',
        },
      ],
      driverInfo: {
        name: 'Marco Santos',
        phone: '+1 (555) 444-1212',
        vehicle: 'Black Vespa Scooter',
        currentLat: 37.7749,
        currentLng: -122.4194,
      },
    };

    this.orders.set(orderId, newOrder);

    if (autoSimulate) {
      this.scheduleAutoSimulation(orderId);
    }

    return newOrder;
  }

  public updateOrderStatus(
    orderId: string,
    newStatus: OrderStatus,
    note?: string
  ): Order | undefined {
    const order = this.orders.get(orderId);
    if (!order) return undefined;

    if (order.status === newStatus) return order;

    const now = new Date().toISOString();
    order.status = newStatus;
    order.updatedAt = now;

    const statusNotes: Record<OrderStatus, string> = {
      ORDER_RECEIVED: 'Order placed successfully.',
      PREPARING: 'Chef is preparing your meal with fresh ingredients.',
      OUT_FOR_DELIVERY: 'Courier has picked up your meal and is en route!',
      DELIVERED: 'Order delivered! Bon appétit!',
      CANCELLED: 'Order has been cancelled.',
    };

    order.statusHistory.push({
      status: newStatus,
      timestamp: now,
      note: note || statusNotes[newStatus],
    });

    this.orders.set(orderId, order);

    // Notify connected SSE clients
    this.notifySseClients(orderId, order);

    return order;
  }

  private scheduleAutoSimulation(orderId: string) {
    const timers: NodeJS.Timeout[] = [];

    // Advance to PREPARING after 6 seconds
    const t1 = setTimeout(() => {
      this.updateOrderStatus(orderId, 'PREPARING');
    }, 6000);

    // Advance to OUT_FOR_DELIVERY after 18 seconds
    const t2 = setTimeout(() => {
      this.updateOrderStatus(orderId, 'OUT_FOR_DELIVERY');
    }, 18000);

    // Advance to DELIVERED after 32 seconds
    const t3 = setTimeout(() => {
      this.updateOrderStatus(orderId, 'DELIVERED');
    }, 32000);

    timers.push(t1, t2, t3);
    this.simulationTimers.set(orderId, timers);
  }

  public cancelSimulation(orderId: string) {
    const timers = this.simulationTimers.get(orderId);
    if (timers) {
      timers.forEach((t) => clearTimeout(t));
      this.simulationTimers.delete(orderId);
    }
  }

  public registerSseClient(orderId: string, res: Response) {
    if (!this.sseClients.has(orderId)) {
      this.sseClients.set(orderId, new Set());
    }
    this.sseClients.get(orderId)!.add(res);
  }

  public unregisterSseClient(orderId: string, res: Response) {
    const clients = this.sseClients.get(orderId);
    if (clients) {
      clients.delete(res);
      if (clients.size === 0) {
        this.sseClients.delete(orderId);
      }
    }
  }

  private notifySseClients(orderId: string, order: Order) {
    const clients = this.sseClients.get(orderId);
    if (clients) {
      const data = `data: ${JSON.stringify(order)}\n\n`;
      clients.forEach((res) => {
        res.write(data);
      });
    }
  }

  public clearAllOrders() {
    this.simulationTimers.forEach((timers) => timers.forEach(clearTimeout));
    this.simulationTimers.clear();
    this.orders.clear();
    this.seedInitialOrders();
  }
}

export const orderStore = new OrderStore();
