import React from 'react';
import { ShoppingBag, UtensilsCrossed, Clock, Sparkles } from 'lucide-react';
import { useCart } from '../context/CartContext';

interface NavbarProps {
  currentTab: 'menu' | 'history' | 'tracking';
  setCurrentTab: (tab: 'menu' | 'history' | 'tracking') => void;
  activeOrderId?: string | null;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  setCurrentTab,
  activeOrderId,
}) => {
  const { totalCount, setIsCartOpen } = useCart();

  return (
    <header className="sticky top-0 z-40 w-full glass-panel border-b border-slate-800/80 bg-slate-900/90 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo & Brand */}
          <div 
            className="flex items-center gap-3 cursor-pointer group"
            onClick={() => setCurrentTab('menu')}
          >
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-brand-600 to-amber-400 flex items-center justify-center shadow-lg shadow-brand-500/30 group-hover:scale-105 transition-transform duration-300">
              <UtensilsCrossed className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xl font-extrabold tracking-tight text-white group-hover:text-brand-400 transition-colors">
                  CraveDash
                </span>
                <span className="bg-brand-500/20 text-brand-400 text-xs font-semibold px-2 py-0.5 rounded-full border border-brand-500/30 flex items-center gap-1">
                  <Sparkles className="w-3 h-3" /> Live
                </span>
              </div>
              <p className="text-xs text-slate-400 hidden sm:block">
                Artisan Eats • Express Delivery
              </p>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="flex items-center gap-2 sm:gap-4">
            <button
              id="nav-menu-btn"
              onClick={() => setCurrentTab('menu')}
              className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 flex items-center gap-2 ${
                currentTab === 'menu'
                  ? 'bg-brand-500 text-white shadow-lg shadow-brand-500/25'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <UtensilsCrossed className="w-4 h-4" />
              <span>Menu</span>
            </button>

            {activeOrderId && (
              <button
                id="nav-tracker-btn"
                onClick={() => setCurrentTab('tracking')}
                className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 flex items-center gap-2 relative ${
                  currentTab === 'tracking'
                    ? 'bg-brand-500 text-white shadow-lg shadow-brand-500/25'
                    : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/20'
                }`}
              >
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                <span>Track Order</span>
              </button>
            )}

            <button
              id="nav-history-btn"
              onClick={() => setCurrentTab('history')}
              className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 flex items-center gap-2 ${
                currentTab === 'history'
                  ? 'bg-brand-500 text-white shadow-lg shadow-brand-500/25'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Clock className="w-4 h-4" />
              <span className="hidden sm:inline">Order History</span>
            </button>

            {/* Cart Drawer Trigger */}
            <button
              id="cart-trigger-btn"
              onClick={() => setIsCartOpen(true)}
              className="relative p-3 rounded-xl bg-slate-800 border border-slate-700 text-white hover:bg-slate-700/80 transition-all group"
              aria-label="Open shopping cart"
            >
              <ShoppingBag className="w-5 h-5 text-brand-400 group-hover:scale-110 transition-transform" />
              {totalCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-brand-500 text-white text-xs font-extrabold w-6 h-6 rounded-full flex items-center justify-center shadow-md animate-bounce-short">
                  {totalCount}
                </span>
              )}
            </button>
          </nav>

        </div>
      </div>
    </header>
  );
};
