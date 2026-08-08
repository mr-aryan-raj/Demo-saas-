import React, { useState } from 'react';
import { X, Trash2, Plus, Minus, QrCode, Sparkles, ShoppingBag, Gift, ArrowRight } from 'lucide-react';
import { CartItem, Customer, Table } from '../types';
import confetti from 'canvas-confetti';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onUpdateQuantity: (cartItemId: string, newQty: number) => void;
  onRemoveItem: (cartItemId: string) => void;
  table: Table | null;
  customer: Customer | null;
  onPlaceOrder: (notes: string, discountAmount: number, discountName: string) => Promise<void>;
  onOpenAuth: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  cartItems,
  onUpdateQuantity,
  onRemoveItem,
  table,
  customer,
  onPlaceOrder,
  onOpenAuth,
}) => {
  const [notes, setNotes] = useState('');
  const [placing, setPlacing] = useState(false);
  const [selectedOfferId, setSelectedOfferId] = useState<string | null>(null);

  if (!isOpen) return null;

  const subtotal = cartItems.reduce((sum, item) => sum + item.totalPrice, 0);

  // Calculate discount logic
  let discountAmount = 0;
  let discountName = '';

  if (customer && customer.offers.length > 0) {
    const activeOffer = customer.offers.find((o) => !o.isUsed && (selectedOfferId ? o.id === selectedOfferId : true));
    if (activeOffer) {
      discountAmount = (subtotal * activeOffer.discountPercent) / 100;
      discountName = `${activeOffer.title} (${activeOffer.discountPercent}% OFF)`;
    }
  }

  const tax = (subtotal - discountAmount) * 0.08; // 8% sales tax
  const finalTotal = subtotal - discountAmount + tax;

  const handleConfirmOrder = async () => {
    if (cartItems.length === 0) return;
    setPlacing(true);
    try {
      await onPlaceOrder(notes, discountAmount, discountName);
      confetti({
        particleCount: 100,
        spread: 80,
        origin: { y: 0.5 },
        colors: ['#D4AF37', '#F3E5AB', '#FFFFFF'],
      });
      onClose();
    } catch (err) {
      console.error('Error placing order:', err);
    } finally {
      setPlacing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-zinc-950 border-l border-amber-500/30 text-zinc-100 shadow-2xl flex flex-col">
          {/* Top Header */}
          <div className="p-5 border-b border-zinc-800 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-amber-500/20 border border-amber-500/30 text-amber-400">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-serif text-lg font-bold text-amber-100">Table Order Cart</h3>
                <p className="text-xs text-zinc-400">Review selected dishes & customize</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-zinc-900 text-zinc-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Table Detection Indicator Banner */}
          <div className="px-5 py-3 bg-zinc-900 border-b border-zinc-800/80 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2 text-amber-300 font-medium">
              <QrCode className="w-4 h-4 text-amber-400" />
              <span>Ordering for Table #{table ? table.tableNumber : '05'}</span>
            </div>
            <span className="text-[10px] px-2 py-0.5 rounded bg-amber-500/20 text-amber-400 font-semibold uppercase">
              Auto-Detected
            </span>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {cartItems.length === 0 ? (
              <div className="text-center py-16 space-y-3 text-zinc-500">
                <ShoppingBag className="w-12 h-12 mx-auto stroke-1 opacity-50" />
                <p className="text-sm font-medium">Your table cart is empty</p>
                <p className="text-xs text-zinc-600">Select food items from the digital menu to get started</p>
              </div>
            ) : (
              cartItems.map((item) => (
                <div
                  key={item.id}
                  className="bg-zinc-900 border border-zinc-800/80 rounded-2xl p-3.5 flex flex-col gap-2"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-3">
                      <img
                        src={item.menuItem.image}
                        alt={item.menuItem.name}
                        className="w-12 h-12 rounded-xl object-cover border border-zinc-800"
                        referrerPolicy="no-referrer"
                      />
                      <div>
                        <h4 className="font-bold text-xs text-amber-100">{item.menuItem.name}</h4>
                        <p className="text-[11px] font-mono text-amber-400 font-semibold mt-0.5">
                          ${item.unitPrice.toFixed(2)}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => onRemoveItem(item.id)}
                      className="text-zinc-500 hover:text-rose-400 p-1 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Customization Details */}
                  {item.customizations.length > 0 && (
                    <div className="text-[11px] bg-zinc-950 p-2 rounded-xl border border-zinc-800/60 text-zinc-400 space-y-0.5">
                      {item.customizations.map((c) => (
                        <div key={c.groupId}>
                          <span className="font-semibold text-amber-400/80">{c.groupName}: </span>
                          <span>{c.selectedOptions.map((o) => o.name).join(', ')}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Quantity & Item Total */}
                  <div className="flex items-center justify-between pt-1">
                    <div className="flex items-center gap-2 bg-zinc-950 border border-zinc-800 p-1 rounded-lg">
                      <button
                        onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                        className="p-1 text-zinc-400 hover:text-white"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="w-5 text-center font-bold text-xs font-mono">{item.quantity}</span>
                      <button
                        onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                        className="p-1 text-zinc-400 hover:text-white"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <span className="font-mono font-bold text-sm text-amber-200">
                      ${item.totalPrice.toFixed(2)}
                    </span>
                  </div>
                </div>
              ))
            )}

            {/* Special Instructions */}
            {cartItems.length > 0 && (
              <div>
                <label className="block text-xs font-semibold text-zinc-400 mb-1">
                  Kitchen Notes / Dietary Requests
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="e.g. Extra napkins, sauce on side, less salt..."
                  rows={2}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-2.5 text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-amber-500/60"
                />
              </div>
            )}
          </div>

          {/* Checkout Footer */}
          {cartItems.length > 0 && (
            <div className="p-5 border-t border-zinc-800 bg-zinc-900/80 space-y-3">
              {/* Login Banner if guest */}
              {!customer ? (
                <div
                  onClick={onOpenAuth}
                  className="cursor-pointer p-3 bg-gradient-to-r from-amber-500/20 to-amber-600/20 border border-amber-500/40 rounded-xl flex items-center justify-between text-xs text-amber-300 hover:bg-amber-500/30 transition-all"
                >
                  <div className="flex items-center gap-2">
                    <Gift className="w-4 h-4 text-amber-400 animate-bounce" />
                    <span>Login now to apply <strong>15% OFF</strong> Welcome Discount</span>
                  </div>
                  <ArrowRight className="w-4 h-4" />
                </div>
              ) : (
                discountAmount > 0 && (
                  <div className="p-2.5 bg-emerald-500/10 border border-emerald-500/30 rounded-xl flex items-center justify-between text-xs text-emerald-300">
                    <span className="flex items-center gap-1.5 font-medium">
                      <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                      Applied: {discountName}
                    </span>
                    <span className="font-mono font-bold">-${discountAmount.toFixed(2)}</span>
                  </div>
                )
              )}

              {/* Price Calculations */}
              <div className="space-y-1.5 text-xs text-zinc-400">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-mono font-semibold text-zinc-200">${subtotal.toFixed(2)}</span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between text-emerald-400">
                    <span>Discount</span>
                    <span className="font-mono font-semibold">-${discountAmount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Tax (8%)</span>
                  <span className="font-mono font-semibold text-zinc-200">${tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm font-bold text-amber-100 pt-2 border-t border-zinc-800">
                  <span>Total Amount</span>
                  <span className="font-mono text-base text-amber-400">${finalTotal.toFixed(2)}</span>
                </div>
              </div>

              <button
                onClick={handleConfirmOrder}
                disabled={placing}
                className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 hover:from-amber-400 hover:to-amber-500 text-zinc-950 font-black text-sm uppercase tracking-wider shadow-xl shadow-amber-500/20 transition-all flex items-center justify-center gap-2 transform active:scale-95"
              >
                {placing ? (
                  <span>Transmitting to Kitchen...</span>
                ) : (
                  <>
                    <span>PLACE ORDER NOW</span>
                    <ArrowRight className="w-4 h-4 stroke-[3]" />
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
