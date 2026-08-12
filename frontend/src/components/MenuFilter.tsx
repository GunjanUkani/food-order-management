import React from 'react';
import { Search, Flame, Leaf, Pizza, Utensils, CupSoda, Cake, Salad } from 'lucide-react';
import { FoodCategory } from '../types';

interface MenuFilterProps {
  activeCategory: FoodCategory;
  setActiveCategory: (cat: FoodCategory) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  vegOnly: boolean;
  setVegOnly: (veg: boolean) => void;
}

const CATEGORIES: { id: FoodCategory; label: string; icon: React.ReactNode }[] = [
  { id: 'all', label: 'All Items', icon: <Utensils className="w-4 h-4" /> },
  { id: 'pizza', label: 'Pizzas', icon: <Pizza className="w-4 h-4" /> },
  { id: 'burger', label: 'Burgers', icon: <Flame className="w-4 h-4" /> },
  { id: 'asian', label: 'Asian Noodles', icon: <Utensils className="w-4 h-4" /> },
  { id: 'salad', label: 'Bowls & Salads', icon: <Salad className="w-4 h-4" /> },
  { id: 'dessert', label: 'Desserts', icon: <Cake className="w-4 h-4" /> },
  { id: 'beverage', label: 'Drinks', icon: <CupSoda className="w-4 h-4" /> },
];

export const MenuFilter: React.FC<MenuFilterProps> = ({
  activeCategory,
  setActiveCategory,
  searchQuery,
  setSearchQuery,
  vegOnly,
  setVegOnly,
}) => {
  return (
    <div className="space-y-6 mb-8">
      {/* Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Search Bar */}
        <div className="relative w-full sm:w-96">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            type="text"
            id="menu-search-input"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search gourmet pizza, burgers, ramen..."
            className="w-full pl-12 pr-4 py-3 bg-slate-900/80 border border-slate-700/70 rounded-2xl text-white placeholder-slate-400 focus:outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 transition-all text-sm"
          />
        </div>

        {/* Veg Only Toggle */}
        <button
          onClick={() => setVegOnly(!vegOnly)}
          className={`flex items-center gap-2.5 px-4 py-2.5 rounded-xl border text-xs font-bold transition-all ${
            vegOnly
              ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400 shadow-md shadow-emerald-500/10'
              : 'bg-slate-800/80 border-slate-700 text-slate-400 hover:text-white'
          }`}
        >
          <Leaf className={`w-4 h-4 ${vegOnly ? 'text-emerald-400' : 'text-slate-400'}`} />
          <span>Vegetarian Only</span>
        </button>
      </div>

      {/* Category Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {CATEGORIES.map((cat) => {
          const isActive = activeCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold whitespace-nowrap transition-all duration-200 ${
                isActive
                  ? 'bg-gradient-to-r from-brand-500 to-brand-600 text-white shadow-lg shadow-brand-500/30 scale-105'
                  : 'bg-slate-800/60 border border-slate-700/60 text-slate-300 hover:bg-slate-700/60 hover:text-white'
              }`}
            >
              {cat.icon}
              <span>{cat.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
