import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { OrderTracker } from '../src/components/OrderTracker';
import * as api from '../src/services/api';

vi.mock('../src/services/api', () => ({
  fetchOrderById: vi.fn(),
  subscribeToOrderStream: vi.fn(() => vi.fn()),
  updateOrderStatus: vi.fn(),
}));

const mockOrder = {
  id: 'ord-test-123',
  status: 'PREPARING' as const,
  items: [
    {
      menuItem: {
        id: 'm1',
        name: 'Artisanal Truffle Mushroom Pizza',
        price: 18.99,
        image: 'http://example.com/img.jpg',
        description: 'Test',
        category: 'pizza' as const,
        rating: 4.9,
        prepTimeMinutes: 20,
      },
      quantity: 1,
      itemTotal: 18.99,
    },
  ],
  deliveryDetails: {
    customerName: 'Alice Johnson',
    address: '456 Oak Street',
    phoneNumber: '+15559876543',
  },
  subtotal: 18.99,
  tax: 1.52,
  deliveryFee: 3.99,
  totalAmount: 24.50,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  estimatedDeliveryTime: new Date().toISOString(),
  statusHistory: [],
};

describe('OrderTracker Component (TDD)', () => {
  it('renders order details, current status, and progress timeline steps', async () => {
    vi.mocked(api.fetchOrderById).mockResolvedValue(mockOrder as any);

    render(<OrderTracker orderId="ord-test-123" onBackToMenu={vi.fn()} />);

    await waitFor(() => {
      expect(screen.getAllByText(/PREPARING/i).length).toBeGreaterThan(0);
      expect(screen.getByText('Alice Johnson')).toBeInTheDocument();
      expect(screen.getByText('456 Oak Street')).toBeInTheDocument();
    });
  });
});
