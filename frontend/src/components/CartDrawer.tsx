import React, { useState } from 'react';
import { X, ShoppingBag, Trash2, Plus, Minus, ArrowRight, Tag, Sparkles } from 'lucide-react';
import { useCart } from '../context/CartContext';

interface CartDrawerProps {
  onProceedToCheckout: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({ onProceedToCheckout }) => {
  const {
    cartItems,
    isCartOpen,
    setIsCartOpen,
    updateQuantity,
    removeFromCart,
    subtotal,
    tax,
    deliveryFee,
    totalAmount,
    totalCount,
  } = useCart();

  const [promoCode, setPromoCode] = useState('');
  const [promoApplied, setPromoApplied] = useState(false);

  if (!isCartOpen) return null;

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    if (promoCode.trim().toUpperCase() === 'CRAVE50' || promoCode.trim().toUpperCase() === 'RAFTLABS') {
      setPromoApplied(true);
    } else {
      alert('Invalid promo code. Try "CRAVE50" for demo!');
    }
  };

  const freeDeliveryThreshold = 35;
  const deliveryProgress = Math.min(100, (subtotal / freeDeliveryThreshold) * 100);

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-950/70 backdrop-blur-sm animate-fade-in">
      <div 
        className="absolute inset-0" 
        onClick={() => setIsCartOpen(false)} 
        aria-label="Close modal overlay"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-slate-900 border-l border-slate-800 text-white shadow-2xl flex flex-col justify-between">
          
          {/* Header */}
          <div className="p-6 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-brand-500/20 text-brand-400 flex items-center justify-center border border-brand-500/30">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg font-bold">Your Order Cart</h2>
                <p className="text-xs text-slate-400">{totalCount} items selected</p>
              </div>
            </div>
            <button
              id="close-cart-btn"
              onClick={() => setIsCartOpen(false)}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Free Delivery Bar */}
          {subtotal > 0 && (
            <div className="bg-slate-800/80 px-6 py-3 border-b border-slate-800">
              <div className="flex items-center justify-between text-xs mb-1.5">
                <span className="text-slate-300 font-medium">
                  {subtotal >= freeDeliveryThreshold ? (
                    <span className="text-emerald-400 font-bold flex items-center gap-1">
                      <Sparkles className="w-3.5 h-3.5" /> Unlocked Free Delivery!
                    </span>
                  ) : (
                    <>Add <span className="font-bold text-white">${(freeDeliveryThreshold - subtotal).toFixed(2)}</span> more for Free Delivery</>
                  )}
                </span>
                <span className="text-slate-400 font-semibold">{Math.round(deliveryProgress)}%</span>
              </div>
              <div className="w-full bg-slate-700 h-2 rounded-full overflow-hidden">
                <div 
                  className="bg-gradient-to-r from-brand-500 to-emerald-400 h-full transition-all duration-500 rounded-full" 
                  style={{ width: `${deliveryProgress}%` }}
                />
              </div>
            </div>
          )}

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {cartItems.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-8 space-y-4">
                <div className="w-20 h-20 rounded-full bg-slate-800/80 flex items-center justify-center text-slate-500 border border-slate-700/60">
                  <ShoppingBag className="w-10 h-10" />
                </div>
                <h3 className="text-lg font-bold text-slate-300">Your cart is empty</h3>
                <p className="text-xs text-slate-500 max-w-xs">
                  Discover our delicious artisan pizzas, wagyu burgers, and spicy ramen!
                </p>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="mt-2 px-6 py-2.5 rounded-xl bg-brand-500 text-white text-xs font-bold shadow-lg shadow-brand-500/20 hover:bg-brand-600 transition-colors"
                >
                  Explore Menu
                </button>
              </div>
            ) : (
              cartItems.map(({ menuItem, quantity }) => (
                <div
                  key={menuItem.id}
                  className="p-4 rounded-2xl bg-slate-800/60 border border-slate-800 flex items-center gap-4 hover:border-slate-700 transition-all"
                >
                  <img
                    src={menuItem.image}
                    alt={menuItem.name}
                    className="w-16 h-16 rounded-xl object-cover bg-slate-900 shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-bold text-white truncate">{menuItem.name}</h4>
                    <p className="text-xs text-brand-400 font-semibold mt-0.5">
                      ${menuItem.price.toFixed(2)}
                    </p>

                    <div className="flex items-center justify-between mt-2">
                      {/* Quantity Modifier */}
                      <div className="flex items-center gap-2 bg-slate-900/90 border border-slate-700/80 rounded-xl px-2 py-1">
                        <button
                          id={`decrement-${menuItem.id}`}
                          onClick={() => updateQuantity(menuItem.id, quantity - 1)}
                          className="text-slate-400 hover:text-white p-0.5 rounded"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="text-xs font-bold w-4 text-center">{quantity}</span>
                        <button
                          id={`increment-${menuItem.id}`}
                          onClick={() => updateQuantity(menuItem.id, quantity + 1)}
                          className="text-slate-400 hover:text-white p-0.5 rounded"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <button
                        id={`remove-${menuItem.id}`}
                        onClick={() => removeFromCart(menuItem.id)}
                        className="text-slate-500 hover:text-rose-400 p-1.5 transition-colors"
                        title="Remove item"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer Summary & Checkout */}
          {cartItems.length > 0 && (
            <div className="p-6 border-t border-slate-800 bg-slate-900/90 space-y-4">
              
              {/* Promo Code Form */}
              <form onSubmit={handleApplyPromo} className="flex gap-2">
                <div className="relative flex-1">
                  <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <input
                    type="text"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                    placeholder="Promo code (e.g. CRAVE50)"
                    disabled={promoApplied}
                    className="w-full pl-9 pr-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-brand-500"
                  />
                </div>
                <button
                  type="submit"
                  disabled={promoApplied || !promoCode.trim()}
                  className="px-4 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs font-bold text-slate-300 hover:text-white hover:bg-slate-700 disabled:opacity-50"
                >
                  {promoApplied ? 'Applied!' : 'Apply'}
                </button>
              </form>

              {/* Pricing Breakdown */}
              <div className="space-y-2 text-xs border-t border-b border-slate-800 py-3">
                <div className="flex justify-between text-slate-400">
                  <span>Subtotal</span>
                  <span className="font-semibold text-white">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Estimated Tax (8%)</span>
                  <span className="font-semibold text-white">${tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Delivery Fee</span>
                  <span className="font-semibold text-white">
                    {deliveryFee === 0 ? (
                      <span className="text-emerald-400 font-bold">FREE</span>
                    ) : (
                      `$${deliveryFee.toFixed(2)}`
                    )}
                  </span>
                </div>
                {promoApplied && (
                  <div className="flex justify-between text-emerald-400 font-bold">
                    <span>Discount (CRAVE50)</span>
                    <span>-$5.00</span>
                  </div>
                )}
                <div className="flex justify-between text-sm font-extrabold text-white pt-2 border-t border-slate-800">
                  <span>Total Amount</span>
                  <span className="text-base text-brand-400">
                    ${(promoApplied ? Math.max(0, totalAmount - 5) : totalAmount).toFixed(2)}
                  </span>
                </div>
              </div>

              {/* Proceed to Checkout Button */}
              <button
                id="checkout-btn"
                onClick={onProceedToCheckout}
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-brand-500 to-brand-600 text-white font-extrabold text-sm shadow-lg shadow-brand-500/25 hover:from-brand-600 hover:to-brand-700 transition-all flex items-center justify-center gap-2 group"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
