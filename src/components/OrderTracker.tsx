import React from 'react';
import { Order, OrderStatus } from '../types';
import { Clock, CheckCircle2, Flame, Utensils, Sparkles, ChefHat } from 'lucide-react';

interface OrderTrackerProps {
  order: Order | null;
  onBackToMenu: () => void;
  onOpenReviewModal?: () => void;
}

export const OrderTracker: React.FC<OrderTrackerProps> = ({ order, onBackToMenu, onOpenReviewModal }) => {
  if (!order) {
    return (
      <div className="text-center py-20 max-w-md mx-auto space-y-4">
        <Utensils className="w-12 h-12 text-amber-500/50 mx-auto" />
        <h3 className="font-serif text-2xl font-bold text-amber-100">No Active Order Found</h3>
        <p className="text-xs text-zinc-400">Scan table QR code and place an order to see live tracking</p>
        <button
          onClick={onBackToMenu}
          className="px-5 py-2.5 rounded-xl bg-amber-500 text-zinc-950 font-bold text-xs"
        >
          Browse Digital Menu
        </button>
      </div>
    );
  }

  const steps: { key: OrderStatus; label: string; icon: React.ReactNode; desc: string }[] = [
    {
      key: 'received',
      label: 'Order Received',
      icon: <Utensils className="w-4 h-4" />,
      desc: 'Transmitted to kitchen terminal',
    },
    {
      key: 'accepted',
      label: 'Accepted By Kitchen',
      icon: <ChefHat className="w-4 h-4" />,
      desc: 'Chef reviewed & approved items',
    },
    {
      key: 'preparing',
      label: 'Preparing',
      icon: <Flame className="w-4 h-4" />,
      desc: 'Food is cooking in the kitchen',
    },
    {
      key: 'ready',
      label: 'Ready to Serve',
      icon: <Sparkles className="w-4 h-4" />,
      desc: 'Waiter bringing to your table',
    },
    {
      key: 'completed',
      label: 'Completed',
      icon: <CheckCircle2 className="w-4 h-4" />,
      desc: 'Enjoy your meal!',
    },
  ];

  const getStepIndex = (status: OrderStatus) => {
    switch (status) {
      case 'received':
        return 0;
      case 'accepted':
        return 1;
      case 'preparing':
        return 2;
      case 'ready':
        return 3;
      case 'completed':
        return 4;
      default:
        return 0;
    }
  };

  const currentStepIdx = getStepIndex(order.status);

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-20 animate-fade-in">
      {/* Live Tracking Header Card */}
      <div className="relative bg-gradient-to-r from-zinc-950 via-zinc-900 to-zinc-950 border border-amber-500/30 rounded-3xl p-6 sm:p-8 shadow-2xl text-center overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs font-semibold mb-3">
          <Clock className="w-3.5 h-3.5 text-amber-400 animate-spin" style={{ animationDuration: '4s' }} />
          <span>LIVE REAL-TIME KITCHEN SYNC</span>
        </div>

        <h2 className="font-serif text-3xl font-extrabold text-amber-100">
          Order {order.orderNumber} Status
        </h2>
        <p className="text-xs text-zinc-400 mt-1">
          Table #{order.tableNumber} • Customer: <span className="text-amber-300 font-semibold">{order.customerName}</span>
        </p>

        {/* Estimated Time Box & Review Prompt */}
        <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-4">
          <div className="inline-flex items-center gap-3 bg-zinc-900/90 border border-amber-500/40 px-5 py-3 rounded-2xl shadow-lg">
            <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400">
              <Flame className="w-6 h-6 animate-pulse" />
            </div>
            <div className="text-left">
              <p className="text-[10px] uppercase font-extrabold text-zinc-400">Est. Preparation Time</p>
              <p className="text-lg font-serif font-black text-amber-300">
                {order.status === 'completed' ? 'Served & Completed 🎉' : `~${order.estimatedTimeMinutes} Minutes`}
              </p>
            </div>
          </div>

          {onOpenReviewModal && (
            <button
              onClick={onOpenReviewModal}
              className="px-5 py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-zinc-950 font-bold text-xs shadow-xl shadow-amber-500/20 transition-all flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              <span>{order.isReviewed ? 'View / Edit Your Review' : 'Rate Experience (+50 Points)'}</span>
            </button>
          )}
        </div>
      </div>

      {/* Visual Stepper */}
      <div className="bg-zinc-900/90 border border-zinc-800 rounded-3xl p-6 shadow-xl space-y-6">
        <h3 className="font-serif text-lg font-bold text-amber-100 border-b border-zinc-800 pb-3">
          Preparation Progress Tracker
        </h3>

        <div className="space-y-6 relative before:absolute before:top-2 before:bottom-2 before:left-5 before:w-0.5 before:bg-zinc-800">
          {steps.map((step, idx) => {
            const isDone = idx <= currentStepIdx;
            const isCurrent = idx === currentStepIdx;

            return (
              <div key={step.key} className="relative flex items-start gap-4">
                {/* Circle Icon */}
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all z-10 border ${
                    isCurrent
                      ? 'bg-amber-500 text-zinc-950 border-amber-400 ring-4 ring-amber-500/20 scale-110 shadow-lg shadow-amber-500/20'
                      : isDone
                      ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
                      : 'bg-zinc-900 text-zinc-600 border-zinc-800'
                  }`}
                >
                  {isDone ? step.icon : idx + 1}
                </div>

                {/* Text Content */}
                <div className="flex-1 pt-1">
                  <div className="flex items-center justify-between">
                    <h4
                      className={`font-bold text-sm ${
                        isCurrent
                          ? 'text-amber-300 text-base'
                          : isDone
                          ? 'text-zinc-200'
                          : 'text-zinc-600'
                      }`}
                    >
                      {step.label}
                    </h4>
                    {isCurrent && (
                      <span className="text-[10px] uppercase font-extrabold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30 animate-pulse">
                        Active Now
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-zinc-400 mt-0.5">{step.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Order Items Breakdown */}
      <div className="bg-zinc-900/90 border border-zinc-800 rounded-3xl p-6 shadow-xl space-y-4">
        <h3 className="font-serif text-lg font-bold text-amber-100 border-b border-zinc-800 pb-3">
          Ordered Items Summary
        </h3>

        <div className="space-y-3">
          {order.items.map((item, idx) => (
            <div key={idx} className="flex items-center justify-between bg-zinc-950 p-3 rounded-xl border border-zinc-800 text-xs">
              <div>
                <span className="font-bold text-amber-200">{item.quantity}x {item.name}</span>
                {item.customizationsText && (
                  <p className="text-[11px] text-zinc-400 mt-0.5">{item.customizationsText}</p>
                )}
              </div>
              <span className="font-mono font-bold text-amber-400 text-sm">
                ${item.totalItemPrice.toFixed(2)}
              </span>
            </div>
          ))}
        </div>

        <div className="pt-3 border-t border-zinc-800 flex justify-between text-xs text-zinc-300 font-bold">
          <span>Total Paid Amount</span>
          <span className="font-mono text-base text-amber-400">${order.totalAmount.toFixed(2)}</span>
        </div>
      </div>

      <div className="text-center pt-2">
        <button
          onClick={onBackToMenu}
          className="px-6 py-3 rounded-xl bg-zinc-900 border border-zinc-800 text-amber-300 font-bold text-xs hover:border-amber-500/40 transition-all"
        >
          Return to Digital Menu
        </button>
      </div>
    </div>
  );
};
