import React, { useEffect, useState } from 'react';
import {
  CheckCircle2,
  Clock,
  PackageCheck,
  ChefHat,
  Bike,
  Sparkles,
  RefreshCw,
  FastForward,
  Phone,
  MapPin,
  Calendar,
  AlertTriangle,
} from 'lucide-react';
import { Order, OrderStatus } from '../types';
import { subscribeToOrderStream, updateOrderStatus, fetchOrderById } from '../services/api';
import { SimulatedMap } from './SimulatedMap';

interface OrderTrackerProps {
  orderId: string;
  onBackToMenu: () => void;
}

const STEPS: { status: OrderStatus; label: string; description: string; icon: React.ReactNode }[] = [
  {
    status: 'ORDER_RECEIVED',
    label: 'Order Placed',
    description: 'Order confirmed & sent to kitchen',
    icon: <PackageCheck className="w-5 h-5" />,
  },
  {
    status: 'PREPARING',
    label: 'Preparing',
    description: 'Chef is crafting your delicious meal',
    icon: <ChefHat className="w-5 h-5" />,
  },
  {
    status: 'OUT_FOR_DELIVERY',
    label: 'Out for Delivery',
    description: 'Courier picked up order & en route',
    icon: <Bike className="w-5 h-5" />,
  },
  {
    status: 'DELIVERED',
    label: 'Delivered',
    description: 'Enjoy your artisan meal!',
    icon: <CheckCircle2 className="w-5 h-5" />,
  },
];

export const OrderTracker: React.FC<OrderTrackerProps> = ({ orderId, onBackToMenu }) => {
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState<boolean>(false);

  useEffect(() => {
    let unsubscribeStream: (() => void) | undefined;

    const initTracker = async () => {
      try {
        setLoading(true);
        const data = await fetchOrderById(orderId);
        setOrder(data);
        setLoading(false);

        // Subscribe to real-time Server-Sent Events (SSE) stream
        unsubscribeStream = subscribeToOrderStream(
          orderId,
          (updatedOrder) => {
            setOrder(updatedOrder);
          },
          (err) => {
            console.warn('SSE stream error, falling back to polling if needed', err);
          }
        );
      } catch (err: any) {
        setError(err.message || 'Unable to load order details');
        setLoading(false);
      }
    };

    initTracker();

    return () => {
      if (unsubscribeStream) unsubscribeStream();
    };
  }, [orderId]);

  const handleManualStatusAdvance = async (nextStatus: OrderStatus) => {
    try {
      setIsUpdatingStatus(true);
      const updated = await updateOrderStatus(orderId, nextStatus);
      setOrder(updated);
    } catch (err: any) {
      alert(`Failed to update status: ${err.message}`);
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[400px] flex flex-col items-center justify-center space-y-4">
        <RefreshCw className="w-8 h-8 text-brand-500 animate-spin" />
        <p className="text-sm font-semibold text-slate-300">Connecting to real-time order stream...</p>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="glass-card max-w-md mx-auto p-8 rounded-3xl text-center space-y-4 border border-rose-500/30">
        <AlertTriangle className="w-12 h-12 text-rose-400 mx-auto" />
        <h3 className="text-lg font-bold text-white">Order Not Found</h3>
        <p className="text-xs text-slate-400">{error || 'The requested order could not be located.'}</p>
        <button
          onClick={onBackToMenu}
          className="px-6 py-2.5 rounded-xl bg-brand-500 text-white font-bold text-xs shadow-lg"
        >
          Return to Menu
        </button>
      </div>
    );
  }

  const currentStepIndex = STEPS.findIndex((s) => s.status === order.status);

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
      
      {/* Header Info Banner */}
      <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-3">
            <span className="bg-emerald-500/20 text-emerald-400 text-xs font-extrabold px-3 py-1 rounded-full border border-emerald-500/30 flex items-center gap-1.5">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              Real-Time Tracker
            </span>
            <span className="text-xs font-mono text-slate-400">Order ID: {order.id}</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-2">
            Status: <span className="text-brand-400">{order.status.replace(/_/g, ' ')}</span>
          </h1>

          <div className="flex items-center gap-4 text-xs text-slate-400 mt-2">
            <span className="flex items-center gap-1">
              <Calendar className="w-4 h-4 text-slate-500" />
              {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
            <span className="flex items-center gap-1">
              <MapPin className="w-4 h-4 text-slate-500" />
              {order.deliveryDetails.address}
            </span>
          </div>
        </div>

        {/* Estimated Arrival Badge */}
        <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-2xl flex items-center gap-4 w-full md:w-auto">
          <div className="w-12 h-12 rounded-xl bg-brand-500/20 text-brand-400 flex items-center justify-center border border-brand-500/30">
            <Clock className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <p className="text-[10px] uppercase font-bold text-slate-400">Est. Delivery Time</p>
            <p className="text-lg font-black text-white">20 - 25 Mins</p>
          </div>
        </div>
      </div>

      {/* Interactive Status Step Progress */}
      <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-slate-800 space-y-6">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-brand-400" /> Live Order Timeline
        </h3>

        {/* Timeline Bar */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 relative">
          {STEPS.map((step, idx) => {
            const isCompleted = idx <= currentStepIndex;
            const isCurrent = idx === currentStepIndex;

            return (
              <div
                key={step.status}
                className={`p-4 rounded-2xl border transition-all duration-300 relative ${
                  isCurrent
                    ? 'bg-brand-500/10 border-brand-500 shadow-lg shadow-brand-500/10'
                    : isCompleted
                    ? 'bg-slate-800/80 border-slate-700/80'
                    : 'bg-slate-900/40 border-slate-800/60 opacity-50'
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                      isCompleted
                        ? 'bg-brand-500 text-white shadow-md'
                        : 'bg-slate-800 text-slate-500 border border-slate-700'
                    }`}
                  >
                    {step.icon}
                  </div>
                  {isCompleted && (
                    <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/30">
                      ✓ Done
                    </span>
                  )}
                </div>
                <h4 className="text-sm font-bold text-white">{step.label}</h4>
                <p className="text-[11px] text-slate-400 mt-1 leading-snug">{step.description}</p>
              </div>
            );
          })}
        </div>

        {/* Demo Fast-Forward Simulation Panel */}
        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <p className="text-xs font-bold text-white flex items-center gap-1.5">
              <FastForward className="w-4 h-4 text-amber-400" /> Admin Simulation Controls
            </p>
            <p className="text-[11px] text-slate-400">Manually trigger status changes for evaluation demoing</p>
          </div>

          <div className="flex flex-wrap gap-2">
            {[
              { status: 'ORDER_RECEIVED', label: 'Received' },
              { status: 'PREPARING', label: 'Preparing' },
              { status: 'OUT_FOR_DELIVERY', label: 'Out for Delivery' },
              { status: 'DELIVERED', label: 'Delivered' },
            ].map((btn) => (
              <button
                key={btn.status}
                disabled={isUpdatingStatus || order.status === btn.status}
                onClick={() => handleManualStatusAdvance(btn.status as OrderStatus)}
                className={`px-3 py-1.5 rounded-xl text-[11px] font-bold transition-all ${
                  order.status === btn.status
                    ? 'bg-brand-500 text-white shadow-md'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white disabled:opacity-40'
                }`}
              >
                {btn.label}
              </button>
            ))}
          </div>
        </div>

      </div>

      {/* Map & Order Details Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Simulated Courier Map */}
        <SimulatedMap
          status={order.status}
          driverName={order.driverInfo?.name}
          vehicle={order.driverInfo?.vehicle}
        />

        {/* Itemized Receipt & Delivery Notes */}
        <div className="glass-card rounded-3xl p-6 border border-slate-800 space-y-4">
          <h3 className="text-sm font-bold text-white">Order Summary</h3>

          <div className="space-y-3 max-h-48 overflow-y-auto pr-1">
            {order.items.map((item, idx) => (
              <div key={idx} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-3">
                  <img
                    src={item.menuItem.image}
                    alt={item.menuItem.name}
                    className="w-10 h-10 rounded-lg object-cover bg-slate-900"
                  />
                  <div>
                    <p className="font-bold text-white">{item.menuItem.name}</p>
                    <p className="text-[11px] text-slate-400">Qty: {item.quantity}</p>
                  </div>
                </div>
                <span className="font-bold text-slate-200">${item.itemTotal.toFixed(2)}</span>
              </div>
            ))}
          </div>

          <div className="pt-3 border-t border-slate-800 space-y-1.5 text-xs">
            <div className="flex justify-between text-slate-400">
              <span>Subtotal</span>
              <span>${order.subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>Tax & Delivery</span>
              <span>${(order.tax + order.deliveryFee).toFixed(2)}</span>
            </div>
            <div className="flex justify-between font-extrabold text-sm text-white pt-2 border-t border-slate-800">
              <span>Total Paid</span>
              <span className="text-brand-400">${order.totalAmount.toFixed(2)}</span>
            </div>
          </div>

          {/* Customer & Courier Contact */}
          <div className="pt-3 border-t border-slate-800 text-xs space-y-2">
            <div className="flex items-center justify-between text-slate-300">
              <span className="font-semibold">{order.deliveryDetails.customerName}</span>
              <span className="text-slate-400 flex items-center gap-1">
                <Phone className="w-3.5 h-3.5" /> {order.deliveryDetails.phoneNumber}
              </span>
            </div>
            {order.deliveryDetails.deliveryNotes && (
              <p className="text-[11px] text-slate-400 italic bg-slate-900 p-2 rounded-lg">
                "{order.deliveryDetails.deliveryNotes}"
              </p>
            )}
          </div>

        </div>

      </div>

    </div>
  );
};
