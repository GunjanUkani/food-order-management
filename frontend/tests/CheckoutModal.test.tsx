import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { CheckoutModal } from '../src/components/CheckoutModal';
import { CartProvider } from '../src/context/CartContext';

describe('CheckoutModal Component (TDD)', () => {
  it('displays inline validation errors when submitting empty form fields', async () => {
    const handleSubmit = vi.fn();

    render(
      <CartProvider>
        <CheckoutModal isOpen={true} onClose={vi.fn()} onSubmitOrder={handleSubmit} />
      </CartProvider>
    );

    const submitButton = screen.getByRole('button', { name: /place order/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Full name is required.')).toBeInTheDocument();
      expect(screen.getByText('Delivery address must be at least 5 characters.')).toBeInTheDocument();
      expect(screen.getByText('Please enter a valid phone number (at least 7 digits).')).toBeInTheDocument();
    });

    expect(handleSubmit).not.toHaveBeenCalled();
  });
});
