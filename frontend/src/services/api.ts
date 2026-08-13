import { DeliveryDetails, MenuItem, Order, OrderStatus } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

export async function fetchMenu(category?: string, search?: string): Promise<MenuItem[]> {
  const params = new URLSearchParams();
  if (category && category !== 'all') params.append('category', category);
  if (search && search.trim()) params.append('search', search.trim());

  const response = await fetch(`${API_BASE_URL}/menu?${params.toString()}`);
  if (!response.ok) {
    throw new Error('Failed to fetch menu items');
  }
  const json = await response.json();
  return json.data;
}

export async function fetchMenuItem(id: string): Promise<MenuItem> {
  const response = await fetch(`${API_BASE_URL}/menu/${id}`);
  if (!response.ok) {
    throw new Error(`Failed to fetch menu item ${id}`);
  }
  const json = await response.json();
  return json.data;
}

export async function createOrder(
  items: { menuItemId: string; quantity: number }[],
  deliveryDetails: DeliveryDetails
): Promise<Order> {
  const response = await fetch(`${API_BASE_URL}/orders`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ items, deliveryDetails }),
  });

  const json = await response.json();

  if (!response.ok) {
    const errorMsg = json.message || json.error || 'Failed to place order';
    const err = new Error(errorMsg) as any;
    err.validationErrors = json.errors;
    throw err;
  }

  return json.data;
}

export async function fetchAllOrders(): Promise<Order[]> {
  const response = await fetch(`${API_BASE_URL}/orders`);
  if (!response.ok) {
    throw new Error('Failed to fetch orders');
  }
  const json = await response.json();
  return json.data;
}

export async function fetchOrderById(id: string): Promise<Order> {
  const response = await fetch(`${API_BASE_URL}/orders/${id}`);
  if (!response.ok) {
    throw new Error(`Order with ID ${id} not found`);
  }
  const json = await response.json();
  return json.data;
}

export async function updateOrderStatus(
  id: string,
  status: OrderStatus,
  note?: string
): Promise<Order> {
  const response = await fetch(`${API_BASE_URL}/orders/${id}/status`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ status, note }),
  });

  if (!response.ok) {
    const json = await response.json();
    throw new Error(json.error || 'Failed to update order status');
  }

  const json = await response.json();
  return json.data;
}

export function subscribeToOrderStream(
  orderId: string,
  onUpdate: (order: Order) => void,
  onError?: (err: any) => void
): () => void {
  const eventSource = new EventSource(`${API_BASE_URL}/orders/${orderId}/stream`);

  eventSource.onmessage = (event) => {
    try {
      const orderData: Order = JSON.parse(event.data);
      onUpdate(orderData);
    } catch (e) {
      console.error('Error parsing SSE event data:', e);
    }
  };

  eventSource.onerror = (err) => {
    if (onError) onError(err);
  };

  return () => {
    eventSource.close();
  };
}
