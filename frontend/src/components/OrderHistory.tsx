import React, { useEffect, useState } from 'react';
import { Clock, ExternalLink, RefreshCw, ShoppingBag, ArrowRight } from 'lucide-react';
import { Order } from '../types';
import { fetchAllOrders } from '../services/api';

interface OrderHistoryProps {
  onSelectOrder: (orderId: string) => void;
  onGoToMenu: () => void;
}

export const OrderHistory: React.FC<OrderHistoryProps> = ({
  onSelectOrder,
  onGoToMenu,
}) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const loadHistory = async () => {
    try {
      setLoading(true);
      const data = await fetchAllOrders();
      setOrders(data);
    } catch (err) {
      console.error('Failed to load order history', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadHistory();
  }, []);

  if (loading) {
    return (
      <div className="min-h-[400px] flex flex-col items-center justify-center space-y-4">
        <RefreshCw className="w-8 h-8 text-brand-500 animate-spin" />
        <p className="text-sm font-semibold text-slate-300">Loading order history...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-white">Your Past Orders</h1>
          <p className="text-xs text-slate-400 mt-1">
            Track active orders or review past culinary purchases
          </p>
        </div>
        <button
          onClick={loadHistory}
          className="p-2.5 rounded-xl bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 transition-colors"
          title="Refresh orders"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      {orders.length === 0 ? (
        <div className="glass-card rounded-3xl p-12 text-center space-y-4 border border-slate-800">
          <div className="w-16 h-16 rounded-full bg-slate-800 flex items-center justify-center text-slate-500 mx-auto">
            <ShoppingBag className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-white">No orders placed yet</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Browse our artisan menu to place your first delicious order!
          </p>
          <button
            onClick={onGoToMenu}
            className="px-6 py-2.5 rounded-xl bg-brand-500 text-white font-bold text-xs shadow-lg hover:bg-brand-600 transition-colors"
          >
            Explore Menu
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => {
            const isDelivered = order.status === 'DELIVERED';
            return (
              <div
                key={order.id}
                className="glass-card rounded-3xl p-6 border border-slate-800 hover:border-slate-700 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
              >
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-bold text-white font-mono">{order.id}</span>
                    <span
                      className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full border ${
                        isDelivered
                          ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                          : 'bg-brand-500/10 text-brand-400 border-brand-500/30'
                      }`}
                    >
                      {order.status.replace(/_/g, ' ')}
                    </span>
                  </div>

                  <p className="text-xs text-slate-400">
                    {new Date(order.createdAt).toLocaleDateString()} at{' '}
                    {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>

                  <div className="flex items-center gap-2 text-xs text-slate-300">
                    <span className="font-semibold">{order.items.length} items:</span>
                    <span className="text-slate-400 truncate max-w-xs sm:max-w-md">
                      {order.items.map((i) => `${i.quantity}x ${i.menuItem.name}`).join(', ')}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end border-t sm:border-t-0 pt-3 sm:pt-0 border-slate-800">
                  <div className="text-right">
                    <span className="text-[10px] uppercase text-slate-500 font-bold block">Total</span>
                    <span className="text-lg font-black text-white">${order.totalAmount.toFixed(2)}</span>
                  </div>

                  <button
                    onClick={() => onSelectOrder(order.id)}
                    className="px-4 py-2.5 rounded-xl bg-slate-800 text-brand-400 border border-slate-700 hover:bg-brand-500 hover:text-white hover:border-brand-500 transition-all text-xs font-bold flex items-center gap-1.5"
                  >
                    <span>Track Status</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
