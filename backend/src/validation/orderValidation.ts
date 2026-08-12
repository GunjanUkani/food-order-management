import { CreateOrderPayload, MenuItem } from '../types/index.js';

export interface ValidationResult {
  isValid: boolean;
  errors: Record<string, string>;
}

export function validateCreateOrderPayload(
  payload: any,
  availableMenuItems: MenuItem[]
): ValidationResult {
  const errors: Record<string, string> = {};

  if (!payload || typeof payload !== 'object') {
    return {
      isValid: false,
      errors: { general: 'Order payload must be a valid JSON object.' },
    };
  }

  // Validate Delivery Details
  const { deliveryDetails, items } = payload as Partial<CreateOrderPayload>;

  if (!deliveryDetails || typeof deliveryDetails !== 'object') {
    errors['deliveryDetails'] = 'Delivery details are required.';
  } else {
    if (!deliveryDetails.customerName || typeof deliveryDetails.customerName !== 'string' || !deliveryDetails.customerName.trim()) {
      errors['customerName'] = 'Customer name is required.';
    }

    if (!deliveryDetails.address || typeof deliveryDetails.address !== 'string' || deliveryDetails.address.trim().length < 5) {
      errors['address'] = 'Delivery address must be at least 5 characters long.';
    }

    const phoneRegex = /^[+]?[(]?[0-9]{1,4}[)]?[-\s./0-9]{6,15}$/;
    if (
      !deliveryDetails.phoneNumber ||
      typeof deliveryDetails.phoneNumber !== 'string' ||
      !phoneRegex.test(deliveryDetails.phoneNumber.trim())
    ) {
      errors['phoneNumber'] = 'Please enter a valid phone number (at least 7 digits).';
    }
  }

  // Validate Cart Items
  if (!Array.isArray(items) || items.length === 0) {
    errors['items'] = 'Cart must contain at least one item.';
  } else {
    items.forEach((item, idx) => {
      if (!item || typeof item !== 'object') {
        errors[`items[${idx}]`] = 'Invalid item entry.';
        return;
      }

      if (!item.menuItemId || typeof item.menuItemId !== 'string') {
        errors[`items[${idx}].menuItemId`] = 'Menu item ID is required.';
      } else {
        const found = availableMenuItems.find((m) => m.id === item.menuItemId);
        if (!found) {
          errors[`items[${idx}].menuItemId`] = `Menu item with ID "${item.menuItemId}" not found.`;
        }
      }

      if (typeof item.quantity !== 'number' || !Number.isInteger(item.quantity) || item.quantity <= 0) {
        errors[`items[${idx}].quantity`] = 'Quantity must be a positive integer.';
      }
    });
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}
