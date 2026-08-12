import React from 'react';
import { Navigation, MapPin, Store, Bike, Sparkles } from 'lucide-react';
import { OrderStatus } from '../types';

interface SimulatedMapProps {
  status: OrderStatus;
  driverName?: string;
  vehicle?: string;
}

export const SimulatedMap: React.FC<SimulatedMapProps> = ({
  status,
  driverName = 'Marco Santos',
  vehicle = 'Black Vespa Scooter',
}) => {
  // Map progress calculation based on order status
  const getProgressPercentage = () => {
    switch (status) {
      case 'ORDER_RECEIVED':
        return 5;
      case 'PREPARING':
        return 25;
      case 'OUT_FOR_DELIVERY':
        return 70;
      case 'DELIVERED':
        return 100;
      case 'CANCELLED':
        return 0;
      default:
        return 10;
    }
  };

  const progress = getProgressPercentage();

  return (
    <div className="glass-card rounded-3xl p-5 border border-slate-800 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Navigation className="w-5 h-5 text-brand-400" />
          <h3 className="text-sm font-bold text-white">Live Courier Tracking</h3>
        </div>
        <span className="bg-emerald-500/20 text-emerald-400 text-xs font-bold px-2.5 py-1 rounded-full border border-emerald-500/30 flex items-center gap-1">
          <Sparkles className="w-3 h-3 animate-pulse" /> Live GPS Simulated
        </span>
      </div>

      {/* Simulated Map Container */}
      <div className="relative h-48 w-full rounded-2xl overflow-hidden bg-slate-950 border border-slate-800 p-4 flex flex-col justify-between">
        {/* Map Background Grid Simulation */}
        <div 
          className="absolute inset-0 opacity-15" 
          style={{
            backgroundImage: `radial-gradient(#38bdf8 1px, transparent 1px)`,
            backgroundSize: '24px 24px'
          }} 
        />

        {/* Route Line */}
        <div className="absolute top-1/2 left-12 right-12 -translate-y-1/2 h-1.5 bg-slate-800 rounded-full">
          <div 
            className="h-full bg-gradient-to-r from-brand-500 via-amber-400 to-emerald-400 rounded-full transition-all duration-1000 shadow-sm shadow-brand-500"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Restaurant Pin (Left) */}
        <div className="relative z-10 flex items-center gap-2">
          <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/40 flex items-center justify-center shadow-lg">
            <Store className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs font-bold text-white">Kitchen Hub</p>
            <p className="text-[10px] text-slate-400">742 Gourmet Ave</p>
          </div>
        </div>

        {/* Moving Driver Pin */}
        <div 
          className="absolute top-1/2 -translate-y-1/2 transition-all duration-1000 z-20"
          style={{ left: `calc(10% + ${progress * 0.75}%)` }}
        >
          <div className="relative -ml-5 group">
            <div className="w-10 h-10 rounded-full bg-brand-500 text-white flex items-center justify-center shadow-xl shadow-brand-500/40 border-2 border-white ring-4 ring-brand-500/20">
              <Bike className="w-5 h-5" />
            </div>

            {/* Tooltip */}
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-slate-900 border border-slate-700 px-2 py-1 rounded-lg text-[10px] font-bold text-white whitespace-nowrap shadow-xl">
              {status === 'DELIVERED' ? 'Arrived!' : `${driverName}`}
            </div>
          </div>
        </div>

        {/* Customer Address Pin (Right) */}
        <div className="relative z-10 flex items-center justify-end gap-2 self-end">
          <div className="text-right">
            <p className="text-xs font-bold text-white">Delivery Destination</p>
            <p className="text-[10px] text-slate-400">Your Address</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center shadow-lg">
            <MapPin className="w-5 h-5" />
          </div>
        </div>

      </div>

      {/* Driver Info Footer */}
      <div className="flex items-center justify-between text-xs pt-1">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-slate-300 font-bold border border-slate-700">
            {driverName.charAt(0)}
          </div>
          <div>
            <p className="font-bold text-white">{driverName}</p>
            <p className="text-[11px] text-slate-400">{vehicle}</p>
          </div>
        </div>

        <div className="text-right">
          <p className="text-[10px] uppercase font-bold text-slate-500">Live Status</p>
          <p className="font-extrabold text-brand-400">{status.replace(/_/g, ' ')}</p>
        </div>
      </div>
    </div>
  );
};
