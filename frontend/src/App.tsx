import React, { useEffect, useState } from 'react';
import { Navbar } from './components/Navbar';
import { MenuFilter } from './components/MenuFilter';
import { MenuCard } from './components/MenuCard';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { OrderTracker } from './components/OrderTracker';
import { OrderHistory } from './components/OrderHistory';
import { CartProvider, useCart } from './context/CartContext';
import { DeliveryDetails, FoodCategory, MenuItem } from './types';
import { createOrder, fetchMenu } from './services/api';
import { Sparkles, Utensils, ShieldCheck, Truck, RefreshCw, AlertTriangle } from 'lucide-react';

const MainApp: React.FC = () => {
  const { cartItems, clearCart, setIsCartOpen } = useCart();

  const [currentTab, setCurrentTab] = useState<'menu' | 'history' | 'tracking'>('menu');
  const [activeOrderId, setActiveOrderId] = useState<string | null>(() => {
    return localStorage.getItem('cravedash_active_order') || 'ord-sample-101';
  });

  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loadingMenu, setLoadingMenu] = useState<boolean>(true);
  const [menuError, setMenuError] = useState<string | null>(null);

  const [activeCategory, setActiveCategory] = useState<FoodCategory>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [vegOnly, setVegOnly] = useState<boolean>(false);

  const [isCheckoutOpen, setIsCheckoutOpen] = useState<boolean>(false);

  const loadMenuItems = async () => {
    try {
      setLoadingMenu(true);
      const items = await fetchMenu(activeCategory, searchQuery);
      setMenuItems(items);
      setMenuError(null);
    } catch (err: any) {
      setMenuError('Could not connect to backend REST API. Please ensure server is running.');
    } finally {
      setLoadingMenu(false);
    }
  };

  useEffect(() => {
    loadMenuItems();
  }, [activeCategory, searchQuery]);

  useEffect(() => {
    if (activeOrderId) {
      localStorage.setItem('cravedash_active_order', activeOrderId);
    }
  }, [activeOrderId]);

  const handleProceedToCheckout = () => {
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  const handlePlaceOrder = async (deliveryDetails: DeliveryDetails) => {
    const items = cartItems.map((ci) => ({
      menuItemId: ci.menuItem.id,
      quantity: ci.quantity,
    }));

    const newOrder = await createOrder(items, deliveryDetails);
    clearCart();
    setIsCheckoutOpen(false);
    setActiveOrderId(newOrder.id);
    setCurrentTab('tracking');
  };

  const filteredMenuItems = menuItems.filter((item) => {
    if (vegOnly && !item.isVegetarian) return false;
    return true;
  });

  return (
    <div className="min-h-screen flex flex-col justify-between bg-slate-950 text-slate-100">
      
      {/* Top Navbar */}
      <Navbar
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        activeOrderId={activeOrderId}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* VIEW 1: MENU DISPLAY */}
        {currentTab === 'menu' && (
          <div className="space-y-8 animate-fade-in">
            
            {/* Hero Banner */}
            <div className="relative rounded-3xl overflow-hidden glass-panel p-8 sm:p-12 border border-slate-800 bg-gradient-to-r from-slate-900 via-brand-900/40 to-slate-900 shadow-2xl">
              <div className="relative z-10 max-w-2xl space-y-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/20 text-brand-400 text-xs font-bold border border-brand-500/30">
                  <Sparkles className="w-3.5 h-3.5" /> Gourmet Express Dining
                </div>
                <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
                  Crafted Flavors, <br />
                  <span className="bg-gradient-to-r from-brand-400 to-amber-300 bg-clip-text text-transparent">
                    Delivered Real-Time.
                  </span>
                </h1>
                <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
                  Satisfy your cravings with wood-fired artisanal pizzas, 100% Wagyu burgers, and 16-hour bone broth ramen. Track your courier pin step-by-step live.
                </p>

                {/* Feature Chips */}
                <div className="flex flex-wrap items-center gap-4 pt-2 text-xs text-slate-300 font-semibold">
                  <span className="flex items-center gap-1.5 bg-slate-900/60 px-3 py-1.5 rounded-xl border border-slate-800">
                    <Truck className="w-4 h-4 text-brand-400" /> ~20 Min Fast Delivery
                  </span>
                  <span className="flex items-center gap-1.5 bg-slate-900/60 px-3 py-1.5 rounded-xl border border-slate-800">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" /> TDD & REST Verified
                  </span>
                </div>
              </div>
            </div>

            {/* Menu Filters */}
            <MenuFilter
              activeCategory={activeCategory}
              setActiveCategory={setActiveCategory}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              vegOnly={vegOnly}
              setVegOnly={setVegOnly}
            />

            {/* Loading / Error States */}
            {loadingMenu ? (
              <div className="min-h-[300px] flex flex-col items-center justify-center space-y-3">
                <RefreshCw className="w-8 h-8 text-brand-500 animate-spin" />
                <p className="text-sm font-semibold text-slate-300">Loading chef's fresh menu...</p>
              </div>
            ) : menuError ? (
              <div className="glass-card max-w-lg mx-auto p-8 rounded-3xl text-center space-y-4 border border-amber-500/30">
                <AlertTriangle className="w-10 h-10 text-amber-400 mx-auto" />
                <h3 className="text-base font-bold text-white">Backend Connection Notice</h3>
                <p className="text-xs text-slate-400">{menuError}</p>
                <button
                  onClick={loadMenuItems}
                  className="px-5 py-2.5 rounded-xl bg-brand-500 text-white font-bold text-xs shadow-lg hover:bg-brand-600"
                >
                  Retry API Connection
                </button>
              </div>
            ) : filteredMenuItems.length === 0 ? (
              <div className="glass-card rounded-3xl p-12 text-center space-y-3 border border-slate-800">
                <Utensils className="w-10 h-10 text-slate-500 mx-auto" />
                <h3 className="text-base font-bold text-slate-300">No food items found</h3>
                <p className="text-xs text-slate-500">Try clearing your search query or category filters.</p>
              </div>
            ) : (
              /* Menu Grid */
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredMenuItems.map((item) => (
                  <MenuCard key={item.id} item={item} />
                ))}
              </div>
            )}

          </div>
        )}

        {/* VIEW 2: REAL-TIME TRACKING */}
        {currentTab === 'tracking' && activeOrderId && (
          <OrderTracker
            orderId={activeOrderId}
            onBackToMenu={() => setCurrentTab('menu')}
          />
        )}

        {/* VIEW 3: ORDER HISTORY */}
        {currentTab === 'history' && (
          <OrderHistory
            onSelectOrder={(id) => {
              setActiveOrderId(id);
              setCurrentTab('tracking');
            }}
            onGoToMenu={() => setCurrentTab('menu')}
          />
        )}

      </main>

      {/* Slide-over Cart & Checkout Modals */}
      <CartDrawer onProceedToCheckout={handleProceedToCheckout} />

      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        onSubmitOrder={handlePlaceOrder}
      />

      {/* Footer */}
      <footer className="border-t border-slate-800/80 bg-slate-950 py-8 mt-12 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 space-y-2">
          <p>© 2026 CraveDash Food Delivery System • Built with React, Vite, Express REST API & Vitest TDD</p>
          <p className="text-[11px] text-slate-600">Designed for Raftlabs Technical Evaluation</p>
        </div>
      </footer>

    </div>
  );
};

export const App: React.FC = () => {
  return (
    <CartProvider>
      <MainApp />
    </CartProvider>
  );
};

export default App;
