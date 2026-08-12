export type OrderStatus = 'ORDER_RECEIVED' | 'PREPARING' | 'OUT_FOR_DELIVERY' | 'DELIVERED' | 'CANCELLED';

export type FoodCategory = 'all' | 'pizza' | 'burger' | 'asian' | 'salad' | 'dessert' | 'beverage';

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: FoodCategory;
  isVegetarian?: boolean;
  isSpicy?: boolean;
  rating: number;
  prepTimeMinutes: number;
  calories?: number;
}

export interface CartItemInput {
  menuItemId: string;
  quantity: number;
}

export interface OrderItem {
  menuItem: MenuItem;
  quantity: number;
  itemTotal: number;
}

export interface DeliveryDetails {
  customerName: string;
  address: string;
  phoneNumber: string;
  deliveryNotes?: string;
  paymentMethod?: 'card' | 'cash' | 'upi';
}

export interface CreateOrderPayload {
  items: CartItemInput[];
  deliveryDetails: DeliveryDetails;
}

export interface StatusHistoryEntry {
  status: OrderStatus;
  timestamp: string;
  note?: string;
}

export interface Order {
  id: string;
  items: OrderItem[];
  deliveryDetails: DeliveryDetails;
  status: OrderStatus;
  subtotal: number;
  tax: number;
  deliveryFee: number;
  totalAmount: number;
  createdAt: string;
  updatedAt: string;
  estimatedDeliveryTime: string;
  statusHistory: StatusHistoryEntry[];
  driverInfo?: {
    name: string;
    phone: string;
    vehicle: string;
    currentLat: number;
    currentLng: number;
  };
}
