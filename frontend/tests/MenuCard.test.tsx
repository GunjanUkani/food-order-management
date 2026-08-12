import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { MenuCard } from '../src/components/MenuCard';
import { CartProvider } from '../src/context/CartContext';
import { MenuItem } from '../src/types';

const mockItem: MenuItem = {
  id: 'm1',
  name: 'Artisanal Truffle Mushroom Pizza',
  description: 'Wood-fired sourdough base topped with roasted wild mushrooms.',
  price: 18.99,
  image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591',
  category: 'pizza',
  isVegetarian: true,
  rating: 4.9,
  prepTimeMinutes: 20,
};

describe('MenuCard Component (TDD)', () => {
  it('renders menu item title, price, rating, and description', () => {
    render(
      <CartProvider>
        <MenuCard item={mockItem} />
      </CartProvider>
    );

    expect(screen.getByText('Artisanal Truffle Mushroom Pizza')).toBeInTheDocument();
    expect(screen.getByText('$18.99')).toBeInTheDocument();
    expect(screen.getByText('4.9')).toBeInTheDocument();
    expect(screen.getByText('VEG')).toBeInTheDocument();
  });

  it('triggers item addition when clicking "Add to Cart"', () => {
    render(
      <CartProvider>
        <MenuCard item={mockItem} />
      </CartProvider>
    );

    const addButton = screen.getByRole('button', { name: /add to cart/i });
    fireEvent.click(addButton);

    expect(screen.getByText(/added!/i)).toBeInTheDocument();
  });
});
