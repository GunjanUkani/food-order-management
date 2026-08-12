import React, { useState } from 'react';
import { Star, Clock, Plus, Check, Flame, Leaf } from 'lucide-react';
import { MenuItem } from '../types';
import { useCart } from '../context/CartContext';

interface MenuCardProps {
  item: MenuItem;
}

export const MenuCard: React.FC<MenuCardProps> = ({ item }) => {
  const { addToCart, cartItems } = useCart();
  const [justAdded, setJustAdded] = useState(false);

  const existingInCart = cartItems.find((ci) => ci.menuItem.id === item.id);
  const currentQty = existingInCart ? existingInCart.quantity : 0;

  const handleAdd = () => {
    addToCart(item, 1);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1200);
  };

  return (
    <div className="group glass-card rounded-3xl overflow-hidden border border-slate-800 hover:border-brand-500/40 transition-all duration-300 hover:shadow-2xl hover:shadow-brand-500/10 flex flex-col justify-between">
      {/* Image Header with Badges */}
      <div className="relative h-48 sm:h-52 w-full overflow-hidden bg-slate-900">
        <img
          src={item.image}
          alt={item.name}
          className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent opacity-80" />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none">
          <div className="flex items-center gap-1.5 bg-slate-900/80 backdrop-blur-md px-2.5 py-1 rounded-full text-xs font-bold text-amber-400 border border-amber-400/20">
            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            <span>{item.rating}</span>
          </div>

          <div className="flex items-center gap-1.5 bg-slate-900/80 backdrop-blur-md px-2.5 py-1 rounded-full text-xs font-semibold text-slate-300 border border-slate-700">
            <Clock className="w-3.5 h-3.5 text-brand-400" />
            <span>{item.prepTimeMinutes} min</span>
          </div>
        </div>

        {/* Dietary Badges */}
        <div className="absolute bottom-3 left-3 flex items-center gap-1.5">
          {item.isVegetarian && (
            <span className="bg-emerald-500/90 text-white text-[10px] font-extrabold px-2 py-0.5 rounded-full flex items-center gap-1 shadow-md">
              <Leaf className="w-3 h-3" /> VEG
            </span>
          )}
          {item.isSpicy && (
            <span className="bg-rose-600/90 text-white text-[10px] font-extrabold px-2 py-0.5 rounded-full flex items-center gap-1 shadow-md">
              <Flame className="w-3 h-3" /> SPICY
            </span>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div>
          <h3 className="text-lg font-bold text-white group-hover:text-brand-400 transition-colors line-clamp-1">
            {item.name}
          </h3>
          <p className="text-xs text-slate-400 mt-1.5 line-clamp-2 leading-relaxed">
            {item.description}
          </p>
        </div>

        {/* Footer Price & Add Button */}
        <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-500 block uppercase font-bold tracking-wider">Price</span>
            <span className="text-xl font-black text-white">
              ${item.price.toFixed(2)}
            </span>
          </div>

          <button
            id={`add-to-cart-${item.id}`}
            onClick={handleAdd}
            className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition-all duration-300 flex items-center gap-1.5 shadow-lg ${
              justAdded
                ? 'bg-emerald-500 text-white shadow-emerald-500/30'
                : currentQty > 0
                ? 'bg-brand-500 text-white shadow-brand-500/30 hover:bg-brand-600'
                : 'bg-slate-800 text-slate-200 border border-slate-700 hover:bg-brand-500 hover:text-white hover:border-brand-500 hover:shadow-brand-500/20'
            }`}
          >
            {justAdded ? (
              <>
                <Check className="w-4 h-4" /> Added!
              </>
            ) : (
              <>
                <Plus className="w-4 h-4" />
                <span>{currentQty > 0 ? `Add (${currentQty})` : 'Add to Cart'}</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
