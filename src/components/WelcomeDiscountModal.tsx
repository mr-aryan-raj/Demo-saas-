import React from 'react';
import { Sparkles, Utensils, Gift, ArrowRight } from 'lucide-react';
import { RestaurantInfo, Table } from '../types';

interface WelcomeDiscountModalProps {
  isOpen: boolean;
  restaurant: RestaurantInfo;
  table: Table | null;
  onOrderWithoutLogin: () => void;
  onLoginAndGetDiscount: () => void;
}

export const WelcomeDiscountModal: React.FC<WelcomeDiscountModalProps> = ({
  isOpen,
  restaurant,
  table,
  onOrderWithoutLogin,
  onLoginAndGetDiscount,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-md bg-zinc-950 border-2 border-amber-500/40 rounded-3xl p-6 sm:p-8 text-center text-zinc-100 shadow-2xl shadow-amber-500/10 overflow-hidden">
        {/* Glow Effects */}
        <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-56 h-56 bg-amber-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 left-1/2 -translate-x-1/2 w-56 h-56 bg-amber-600/10 rounded-full blur-3xl pointer-events-none" />

        {/* Header Icon */}
        <div className="mx-auto w-16 h-16 rounded-2xl bg-gradient-to-tr from-amber-500 to-amber-300 p-0.5 shadow-xl shadow-amber-500/20 mb-4 flex items-center justify-center">
          <div className="w-full h-full bg-zinc-950 rounded-[14px] flex items-center justify-center text-amber-400">
            <Utensils className="w-8 h-8" />
          </div>
        </div>

        {/* Welcome Text */}
        <p className="text-xs uppercase font-extrabold tracking-widest text-amber-400/90 mb-1">
          Welcome To
        </p>
        <h2 className="font-serif text-2xl sm:text-3xl font-extrabold text-amber-100 mb-2">
          "{restaurant.name}"
        </h2>
        
        {table && (
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs font-semibold mb-4">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Table #{table.tableNumber} Connected</span>
          </div>
        )}

        <p className="text-sm text-zinc-300 font-medium mb-6">
          🍽️ Enjoy Your Luxury Dining Experience
        </p>

        {/* Special Offer Card */}
        <div className="relative bg-gradient-to-b from-zinc-900 to-zinc-900/90 border border-amber-500/40 rounded-2xl p-5 mb-6 text-center shadow-lg group hover:border-amber-400 transition-colors">
          <div className="inline-flex items-center justify-center p-2 rounded-xl bg-amber-500/20 text-amber-400 mb-2 border border-amber-500/30">
            <Gift className="w-6 h-6 animate-bounce" />
          </div>
          <p className="text-xs font-extrabold uppercase tracking-wider text-amber-400">
            SPECIAL OFFER
          </p>
          <h3 className="text-xl font-serif font-black text-white mt-1">
            🎁 Login Now & Get <span className="text-amber-400 underline decoration-amber-500/50">15% OFF</span>
          </h3>
          <p className="text-xs text-zinc-400 mt-1">
            Instant discount applied directly to your order checkout.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <button
            onClick={onLoginAndGetDiscount}
            className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 hover:from-amber-400 hover:to-amber-500 text-zinc-950 font-black text-sm uppercase tracking-wider shadow-xl shadow-amber-500/20 flex items-center justify-center gap-2 transform hover:scale-[1.02] active:scale-95 transition-all"
          >
            <span>[ LOGIN & GET 15% OFF ]</span>
            <ArrowRight className="w-4 h-4 stroke-[3]" />
          </button>

          <button
            onClick={onOrderWithoutLogin}
            className="w-full py-3 px-4 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-700/80 text-zinc-300 hover:text-white font-semibold text-xs tracking-wide transition-all"
          >
            [ ORDER WITHOUT LOGIN ]
          </button>
        </div>
      </div>
    </div>
  );
};
