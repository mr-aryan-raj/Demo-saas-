import React, { useState } from 'react';
import { Order, OrderStatus, StaffAccount } from '../types';
import { Flame, Clock, Volume2, Utensils, ShieldCheck, LogIn, Lock } from 'lucide-react';
import { KitchenLoginModal } from './KitchenLoginModal';

interface KitchenDisplayProps {
  orders: Order[];
  onUpdateOrderStatus: (orderId: string, newStatus: OrderStatus) => void;
}

export const KitchenDisplay: React.FC<KitchenDisplayProps> = ({ orders, onUpdateOrderStatus }) => {
  const [kitchenStaff, setKitchenStaff] = useState<StaffAccount | null>({
    id: 'staff-k1',
    name: 'Chef Vikram Singh',
    phone: '9876543210',
    employeeId: 'KITCHEN01',
    role: 'kitchen_staff',
    permissions: ['view_orders', 'update_order_status'],
  });
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [filter, setFilter] = useState<'all' | 'received' | 'accepted' | 'preparing' | 'completed'>('all');

  const filteredOrders = orders.filter((o) => {
    if (filter === 'all') return o.status !== 'cancelled';
    return o.status === filter;
  });

  // Web Audio synth chime when order status changes or alert requested
  const playAlertChime = () => {
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, audioCtx.currentTime); // D5 note
      osc.frequency.exponentialRampToValueAtTime(880, audioCtx.currentTime + 0.15); // A5 note
      gain.gain.setValueAtTime(0.3, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.4);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.4);
    } catch (e) {
      console.log('Audio chime auto-play muted by browser', e);
    }
  };

  return (
    <div className="space-y-6 pb-20 animate-fade-in">
      {/* Kitchen Login Modal */}
      <KitchenLoginModal
        isOpen={isLoginModalOpen}
        onLoginSuccess={(staff) => {
          setKitchenStaff(staff);
          setIsLoginModalOpen(false);
        }}
      />

      {/* KDS Header Banner */}
      <div className="bg-gradient-to-r from-zinc-950 via-zinc-900 to-zinc-950 border border-amber-500/30 rounded-3xl p-6 shadow-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/30 shadow-lg">
            <Flame className="w-8 h-8 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-serif text-2xl font-bold text-amber-100">Live Kitchen Display System (KDS)</h2>
              <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-amber-500/20 text-amber-400 font-bold border border-amber-500/30">
                REAL-TIME
              </span>
            </div>
            <p className="text-xs text-zinc-400 mt-0.5">
              {kitchenStaff ? (
                <span>Logged in as: <strong className="text-amber-300">{kitchenStaff.name} ({kitchenStaff.employeeId})</strong> • Staff Role: <span className="uppercase text-emerald-400 font-bold">{kitchenStaff.role.replace('_', ' ')}</span></span>
              ) : (
                'Instant order alerts for chef station & table dispatch'
              )}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsLoginModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-300 hover:bg-amber-500/30 text-xs font-semibold"
          >
            <LogIn className="w-4 h-4" />
            <span>{kitchenStaff ? 'Switch Kitchen Staff' : 'Kitchen Staff Login'}</span>
          </button>

          <button
            onClick={playAlertChime}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-amber-300 hover:border-amber-500/40 text-xs font-semibold"
          >
            <Volume2 className="w-4 h-4 text-amber-400" />
            <span>Test Audio Chime</span>
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {(['all', 'received', 'accepted', 'preparing', 'completed'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setFilter(tab)}
            className={`px-4 py-2 rounded-xl text-xs font-bold capitalize transition-all ${
              filter === tab
                ? 'bg-amber-500 text-zinc-950 shadow-md'
                : 'bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white'
            }`}
          >
            {tab === 'all' ? 'All Active Orders' : tab}
          </button>
        ))}
      </div>

      {/* Orders KDS Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredOrders.length === 0 ? (
          <div className="col-span-full text-center py-20 bg-zinc-900/50 border border-zinc-800 rounded-3xl space-y-3">
            <Utensils className="w-12 h-12 text-zinc-600 mx-auto" />
            <p className="text-sm font-semibold text-zinc-400">No active kitchen orders in this view</p>
            <p className="text-xs text-zinc-500">Orders placed by customers on table QR codes appear here instantly!</p>
          </div>
        ) : (
          Array.from(new Map<string, Order>(filteredOrders.map((o) => [o.id, o])).values()).map((order, orderIdx) => {
            const isNew = order.status === 'received';
            const formattedTime = new Date(order.createdAt).toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit',
            });

            return (
              <div
                key={order.id || `kds-ord-${orderIdx}`}
                className={`relative bg-zinc-900/90 rounded-3xl p-5 border transition-all shadow-xl flex flex-col justify-between ${
                  isNew
                    ? 'border-amber-400 ring-2 ring-amber-500/30 shadow-amber-500/10 animate-pulse'
                    : order.status === 'preparing'
                    ? 'border-orange-500/50'
                    : order.status === 'ready'
                    ? 'border-emerald-500/50'
                    : 'border-zinc-800'
                }`}
              >
                <div>
                  {/* Top Header info */}
                  <div className="flex items-center justify-between pb-3 border-b border-zinc-800 mb-3">
                    <div>
                      <span className="text-[10px] uppercase font-black tracking-widest text-amber-400">
                        {isNew ? '🔥 NEW ORDER RECEIVED' : 'KITCHEN TICKET'}
                      </span>
                      <h3 className="font-serif text-2xl font-black text-amber-100">{order.orderNumber}</h3>
                    </div>

                    <div className="text-right">
                      <span className="text-xs font-black uppercase px-2.5 py-1 rounded-lg bg-amber-500/20 text-amber-300 border border-amber-500/30 font-mono">
                        TABLE {order.tableNumber}
                      </span>
                      <p className="text-[10px] text-zinc-400 mt-1 flex items-center justify-end gap-1 font-mono">
                        <Clock className="w-3 h-3 text-amber-400" />
                        {formattedTime}
                      </p>
                    </div>
                  </div>

                  {/* Customer Info */}
                  <div className="text-xs text-zinc-300 mb-3 flex items-center justify-between bg-zinc-950 p-2 rounded-xl border border-zinc-800/80">
                    <span>
                      Customer: <strong className="text-amber-200">{order.customerName}</strong>
                    </span>
                    <span className="text-[10px] text-zinc-500 font-mono">{order.customerMobile}</span>
                  </div>

                  {/* Order Items List */}
                  <div className="space-y-2 mb-4">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Order Items:</p>
                    {order.items.map((item, idx) => (
                      <div key={idx} className="bg-zinc-950 p-2.5 rounded-xl border border-zinc-800/80 text-xs">
                        <div className="flex items-center justify-between font-bold text-amber-100">
                          <span>
                            {item.quantity}x {item.name}
                          </span>
                          <span className="font-mono text-amber-400">${item.totalItemPrice.toFixed(2)}</span>
                        </div>
                        {item.customizationsText && (
                          <p className="text-[11px] text-amber-300/80 mt-1 pl-2 border-l border-amber-500/40 italic">
                            {item.customizationsText}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>

                  {order.notes && (
                    <div className="p-2 bg-amber-500/10 border border-amber-500/30 rounded-xl text-xs text-amber-300 mb-4">
                      <strong>Chef Note:</strong> {order.notes}
                    </div>
                  )}
                </div>

                {/* Status Control Buttons */}
                <div className="pt-3 border-t border-zinc-800 space-y-2">
                  <div className="flex items-center justify-between text-xs mb-2">
                    <span className="text-zinc-400">Current Status:</span>
                    <span className="font-bold text-amber-400 uppercase font-mono">{order.status}</span>
                  </div>

                  <div className="grid grid-cols-3 gap-2">
                    <button
                      onClick={() => {
                        onUpdateOrderStatus(order.id, 'accepted');
                        playAlertChime();
                      }}
                      disabled={order.status !== 'received'}
                      className={`py-2 px-1 rounded-xl text-[11px] font-extrabold uppercase transition-all ${
                        order.status === 'accepted' || order.status === 'preparing' || order.status === 'ready' || order.status === 'completed'
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                          : 'bg-gradient-to-r from-amber-500 to-amber-600 text-zinc-950 hover:from-amber-400 hover:to-amber-500 shadow-md'
                      }`}
                    >
                      [ACCEPT]
                    </button>

                    <button
                      onClick={() => {
                        onUpdateOrderStatus(order.id, 'preparing');
                        playAlertChime();
                      }}
                      disabled={order.status === 'completed'}
                      className={`py-2 px-1 rounded-xl text-[11px] font-extrabold uppercase transition-all ${
                        order.status === 'preparing'
                          ? 'bg-orange-500 text-zinc-950 font-black shadow-md'
                          : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700'
                      }`}
                    >
                      [PREPARING]
                    </button>

                    <button
                      onClick={() => {
                        onUpdateOrderStatus(order.id, 'completed');
                        playAlertChime();
                      }}
                      className={`py-2 px-1 rounded-xl text-[11px] font-extrabold uppercase transition-all ${
                        order.status === 'completed'
                          ? 'bg-emerald-500 text-zinc-950 font-black'
                          : 'bg-zinc-800 text-emerald-400 hover:bg-emerald-500 hover:text-zinc-950'
                      }`}
                    >
                      [COMPLETED]
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
