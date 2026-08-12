import React, { useState } from 'react';
import { X, User, Phone, MapPin, FileText, CreditCard, Lock, CheckCircle2, AlertCircle } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { DeliveryDetails } from '../types';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmitOrder: (details: DeliveryDetails) => Promise<void>;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  onSubmitOrder,
}) => {
  const { cartItems, subtotal, tax, deliveryFee, totalAmount } = useCart();

  const [customerName, setCustomerName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [address, setAddress] = useState('');
  const [deliveryNotes, setDeliveryNotes] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'cash' | 'upi'>('card');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const validate = (): boolean => {
    const errs: Record<string, string> = {};

    if (!customerName.trim()) {
      errs.customerName = 'Full name is required.';
    }

    if (!address.trim() || address.trim().length < 5) {
      errs.address = 'Delivery address must be at least 5 characters.';
    }

    const phoneRegex = /^[+]?[(]?[0-9]{1,4}[)]?[-\s./0-9]{6,15}$/;
    if (!phoneNumber.trim() || !phoneRegex.test(phoneNumber.trim())) {
      errs.phoneNumber = 'Please enter a valid phone number (at least 7 digits).';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      await onSubmitOrder({
        customerName: customerName.trim(),
        phoneNumber: phoneNumber.trim(),
        address: address.trim(),
        deliveryNotes: deliveryNotes.trim(),
        paymentMethod,
      });
    } catch (err: any) {
      if (err.validationErrors) {
        setErrors(err.validationErrors);
      } else {
        setErrors({ general: err.message || 'Failed to place order.' });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
      <div 
        className="fixed inset-0" 
        onClick={onClose} 
        aria-label="Close modal overlay"
      />

      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden z-10 my-8">
        
        {/* Header */}
        <div className="p-6 border-b border-slate-800 flex items-center justify-between bg-slate-900/90">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-brand-500/20 text-brand-400 flex items-center justify-center border border-brand-500/30">
              <CreditCard className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Delivery & Checkout</h2>
              <p className="text-xs text-slate-400">Enter your details to confirm your order</p>
            </div>
          </div>
          <button
            id="close-checkout-btn"
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {errors.general && (
            <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-semibold flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errors.general}</span>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Left Column: Form Fields */}
            <div className="space-y-4">
              <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <User className="w-4 h-4 text-brand-400" /> Customer Information
              </h3>

              {/* Name */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Full Name <span className="text-rose-400">*</span>
                </label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <input
                    type="text"
                    id="checkout-name-input"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="e.g. Alex Morgan"
                    className={`w-full pl-10 pr-4 py-2.5 bg-slate-800/80 border rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none transition-all ${
                      errors.customerName
                        ? 'border-rose-500 focus:ring-2 focus:ring-rose-500/20'
                        : 'border-slate-700 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20'
                    }`}
                  />
                </div>
                {errors.customerName && (
                  <p className="text-[11px] text-rose-400 mt-1 font-medium">{errors.customerName}</p>
                )}
              </div>

              {/* Phone */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Phone Number <span className="text-rose-400">*</span>
                </label>
                <div className="relative">
                  <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <input
                    type="tel"
                    id="checkout-phone-input"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    placeholder="+1 (555) 019-2834"
                    className={`w-full pl-10 pr-4 py-2.5 bg-slate-800/80 border rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none transition-all ${
                      errors.phoneNumber
                        ? 'border-rose-500 focus:ring-2 focus:ring-rose-500/20'
                        : 'border-slate-700 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20'
                    }`}
                  />
                </div>
                {errors.phoneNumber && (
                  <p className="text-[11px] text-rose-400 mt-1 font-medium">{errors.phoneNumber}</p>
                )}
              </div>

              {/* Delivery Address */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Delivery Address <span className="text-rose-400">*</span>
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3.5 top-3 w-4 h-4 text-slate-500" />
                  <textarea
                    id="checkout-address-input"
                    rows={2}
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Street address, apartment, suite, city..."
                    className={`w-full pl-10 pr-4 py-2.5 bg-slate-800/80 border rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none transition-all ${
                      errors.address
                        ? 'border-rose-500 focus:ring-2 focus:ring-rose-500/20'
                        : 'border-slate-700 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20'
                    }`}
                  />
                </div>
                {errors.address && (
                  <p className="text-[11px] text-rose-400 mt-1 font-medium">{errors.address}</p>
                )}
              </div>

              {/* Delivery Notes */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Delivery Notes (Optional)
                </label>
                <div className="relative">
                  <FileText className="absolute left-3.5 top-3 w-4 h-4 text-slate-500" />
                  <input
                    type="text"
                    id="checkout-notes-input"
                    value={deliveryNotes}
                    onChange={(e) => setDeliveryNotes(e.target.value)}
                    placeholder="Gate code, doorbell instructions..."
                    className="w-full pl-10 pr-4 py-2 bg-slate-800/80 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-brand-500"
                  />
                </div>
              </div>
            </div>

            {/* Right Column: Payment & Order Summary */}
            <div className="space-y-4 flex flex-col justify-between">
              <div>
                <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-400 flex items-center gap-1.5 mb-3">
                  <CreditCard className="w-4 h-4 text-brand-400" /> Payment Method
                </h3>

                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'card', label: 'Credit Card', icon: '💳' },
                    { id: 'cash', label: 'Cash on Delivery', icon: '💵' },
                    { id: 'upi', label: 'UPI / Wallet', icon: '📱' },
                  ].map((method) => (
                    <button
                      key={method.id}
                      type="button"
                      onClick={() => setPaymentMethod(method.id as any)}
                      className={`p-3 rounded-2xl border text-center transition-all flex flex-col items-center gap-1 ${
                        paymentMethod === method.id
                          ? 'bg-brand-500/20 border-brand-500 text-white shadow-md'
                          : 'bg-slate-800/60 border-slate-700/80 text-slate-400 hover:text-white'
                      }`}
                    >
                      <span className="text-xl">{method.icon}</span>
                      <span className="text-[11px] font-bold">{method.label}</span>
                    </button>
                  ))}
                </div>

                {/* Items Mini List */}
                <div className="mt-4 p-4 rounded-2xl bg-slate-800/50 border border-slate-800 space-y-2">
                  <h4 className="text-xs font-bold text-slate-300">Order Summary ({cartItems.length} items)</h4>
                  <div className="max-h-28 overflow-y-auto space-y-1.5 pr-1">
                    {cartItems.map(({ menuItem, quantity }) => (
                      <div key={menuItem.id} className="flex justify-between text-xs text-slate-400">
                        <span className="truncate pr-2">{quantity}x {menuItem.name}</span>
                        <span className="font-semibold text-slate-200">${(menuItem.price * quantity).toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                  <div className="pt-2 border-t border-slate-700/60 text-xs flex justify-between font-extrabold text-white">
                    <span>Total Pay</span>
                    <span className="text-brand-400">${totalAmount.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  id="place-order-submit-btn"
                  disabled={isSubmitting}
                  className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-brand-500 to-brand-600 text-white font-extrabold text-sm shadow-xl shadow-brand-500/30 hover:from-brand-600 hover:to-brand-700 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Processing Order...</span>
                    </div>
                  ) : (
                    <>
                      <Lock className="w-4 h-4" />
                      <span>Place Order (${totalAmount.toFixed(2)})</span>
                    </>
                  )}
                </button>
              </div>

            </div>

          </div>
        </form>

      </div>
    </div>
  );
};
