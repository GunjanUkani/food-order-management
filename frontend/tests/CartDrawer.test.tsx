import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { CartDrawer } from '../src/components/CartDrawer';
import { CartProvider, useCart } from '../src/context/CartContext';
import { MenuItem } from '../src/types';

const mockItem: MenuItem = {
  id: 'm2',
  name: 'Smokey Wagyu Cheeseburger',
  description: 'Double Wagyu beef patty',
  price: 16.50,
  image: 'https://images.unsplash.com/photo-1568901346375',
  category: 'burger',
  rating: 4.8,
  prepTimeMinutes: 15,
};

const TestCartWrapper = () => {
  const { addToCart, setIsCartOpen } = useCart();

  React.useEffect(() => {
    addToCart(mockItem, 2);
    setIsCartOpen(true);
  }, []);

  return <CartDrawer onProceedToCheckout={vi.fn()} />;
};

describe('CartDrawer Component (TDD)', () => {
  it('renders cart item details, calculates subtotal correctly, and allows quantity modification', () => {
    const { container } = render(
      <CartProvider>
        <TestCartWrapper />
      </CartProvider>
    );

    expect(screen.getByText('Smokey Wagyu Cheeseburger')).toBeInTheDocument();
    // Subtotal for 2 items @ 16.50 = 33.00
    expect(screen.getByText('$33.00')).toBeInTheDocument();

    // Check increment button
    const incBtn = container.querySelector('#increment-m2');
    expect(incBtn).not.toBeNull();
    fireEvent.click(incBtn!);

    // Now subtotal for 3 items @ 16.50 = 49.50
    expect(screen.getByText('$49.50')).toBeInTheDocument();
  });
});
