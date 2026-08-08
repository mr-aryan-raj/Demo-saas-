import React, { useState } from 'react';
import { Order, ZomatoSwiggyConfig } from '../types';
import { ShoppingBag, RefreshCw, Plus, TrendingUp, DollarSign, ExternalLink, Percent, ShieldCheck, CheckCircle2, AlertCircle } from 'lucide-react';
import { apiClient } from '../services/api';

interface DeliveryIntegrationAdminProps {
  orders: Order[];
  config: ZomatoSwiggyConfig;
  onConfigUpdated: (newConfig: ZomatoSwiggyConfig) => void;
  onOrderAdded: (order: Order) => void;
}

export const DeliveryIntegrationAdmin: React.FC<DeliveryIntegrationAdminProps> = ({
  orders,
  config,
  onConfigUpdated,
  onOrderAdded,
}) => {
  const [zomatoId, setZomatoId] = useState(config.zomatoRestaurantId);
  const [swiggyId, setSwiggyId] = useState(config.swiggyRestaurantId);
  const [zomatoComm, setZomatoComm] = useState(config.zomatoCommissionPct);
  const [swiggyComm, setSwiggyComm] = useState(config.swiggyCommissionPct);
  const [isSaving, setIsSaving] = useState(false);
  const [isSimulating, setIsSimulating] = useState(false);

  // Compute Comparative Analytics
  const qrOrders = orders.filter((o) => !o.source || o.source === 'qr');
  const zomatoOrders = orders.filter((o) => o.source === 'zomato');
  const swiggyOrders = orders.filter((o) => o.source === 'swiggy');

  const qrRevenue = qrOrders.reduce((acc, o) => acc + o.totalAmount, 0);
  const zomatoRevenue = zomatoOrders.reduce((acc, o) => acc + o.totalAmount, 0);
  const swiggyRevenue = swiggyOrders.reduce((acc, o) => acc + o.totalAmount, 0);

  const zomatoCommissionPaid = zomatoOrders.reduce((acc, o) => acc + (o.commissionFee || (o.totalAmount * config.zomatoCommissionPct) / 100), 0);
  const swiggyCommissionPaid = swiggyOrders.reduce((acc, o) => acc + (o.commissionFee || (o.totalAmount * config.swiggyCommissionPct) / 100), 0);

  const handleSaveConfig = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const updated = await apiClient.updateDeliveryConfig({
        zomatoRestaurantId: zomatoId,
        swiggyRestaurantId: swiggyId,
        zomatoCommissionPct: Number(zomatoComm),
        swiggyCommissionPct: Number(swiggyComm),
        zomatoConnected: true,
        swiggyConnected: true,
      });
      onConfigUpdated(updated);
      alert('Delivery Partner API credentials & commission rates saved successfully!');
    } catch (err) {
      alert('Error updating delivery settings');
    } finally {
      setIsSaving(false);
    }
  };

  const handleSimulateOrder = async (source: 'zomato' | 'swiggy') => {
    setIsSimulating(true);
    try {
      const sampleNames = ['Rohan Das', 'Kavita Singh', 'Tushar Garg', 'Aarti Patel'];
      const randomName = `${sampleNames[Math.floor(Math.random() * sampleNames.length)]} (${source === 'zomato' ? 'Zomato' : 'Swiggy'} #${Math.floor(100 + Math.random() * 900)})`;
      const randomAmount = Number((25 + Math.random() * 45).toFixed(2));

      const newOrder = await apiClient.simulateDeliveryOrder(source, randomName, randomAmount);
      onOrderAdded(newOrder);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSimulating(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Platform Connection Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Zomato Account Card */}
        <div className="bg-gradient-to-br from-rose-950/60 to-zinc-950 border border-rose-500/30 rounded-3xl p-6 shadow-2xl space-y-4 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-rose-500/20 text-rose-400 border border-rose-500/40 flex items-center justify-center font-bold text-xl font-serif">
                🔴
              </div>
              <div>
                <h3 className="font-serif text-lg font-bold text-rose-100">Zomato Restaurant Integration</h3>
                <span className="text-[10px] font-mono font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-2 py-0.5 rounded">
                  API Connected
                </span>
              </div>
            </div>

            <button
              onClick={() => handleSimulateOrder('zomato')}
              disabled={isSimulating}
              className="px-3 py-2 bg-rose-500 hover:bg-rose-400 text-zinc-950 font-bold text-xs rounded-xl shadow-lg shadow-rose-500/20 transition-all flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Simulate Zomato Order</span>
            </button>
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs font-mono">
            <div className="bg-zinc-950 p-3 rounded-xl border border-zinc-800">
              <span className="text-zinc-400 block text-[10px]">Orders Count</span>
              <span className="text-rose-300 font-bold text-lg">{zomatoOrders.length}</span>
            </div>
            <div className="bg-zinc-950 p-3 rounded-xl border border-zinc-800">
              <span className="text-zinc-400 block text-[10px]">Net Sales</span>
              <span className="text-rose-300 font-bold text-lg">${zomatoRevenue.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Swiggy Account Card */}
        <div className="bg-gradient-to-br from-orange-950/60 to-zinc-950 border border-orange-500/30 rounded-3xl p-6 shadow-2xl space-y-4 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-orange-500/20 text-orange-400 border border-orange-500/40 flex items-center justify-center font-bold text-xl font-serif">
                🟠
              </div>
              <div>
                <h3 className="font-serif text-lg font-bold text-orange-100">Swiggy Restaurant Integration</h3>
                <span className="text-[10px] font-mono font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-2 py-0.5 rounded">
                  API Connected
                </span>
              </div>
            </div>

            <button
              onClick={() => handleSimulateOrder('swiggy')}
              disabled={isSimulating}
              className="px-3 py-2 bg-orange-500 hover:bg-orange-400 text-zinc-950 font-bold text-xs rounded-xl shadow-lg shadow-orange-500/20 transition-all flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Simulate Swiggy Order</span>
            </button>
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs font-mono">
            <div className="bg-zinc-950 p-3 rounded-xl border border-zinc-800">
              <span className="text-zinc-400 block text-[10px]">Orders Count</span>
              <span className="text-orange-300 font-bold text-lg">{swiggyOrders.length}</span>
            </div>
            <div className="bg-zinc-950 p-3 rounded-xl border border-zinc-800">
              <span className="text-zinc-400 block text-[10px]">Net Sales</span>
              <span className="text-orange-300 font-bold text-lg">${swiggyRevenue.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Settings & Commission Form */}
      <div className="bg-zinc-900/90 border border-zinc-800 rounded-3xl p-6 shadow-2xl space-y-4">
        <h3 className="font-serif text-lg font-bold text-amber-100 flex items-center gap-2">
          <Percent className="w-5 h-5 text-amber-400" />
          <span>Commission & API Integration Settings</span>
        </h3>

        <form onSubmit={handleSaveConfig} className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-1">Zomato Merchant ID</label>
            <input
              type="text"
              value={zomatoId}
              onChange={(e) => setZomatoId(e.target.value)}
              className="w-full bg-zinc-950 border border-zinc-800 focus:border-rose-500 rounded-xl p-3 text-xs text-rose-200 font-mono focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-1">Zomato Commission (%)</label>
            <input
              type="number"
              value={zomatoComm}
              onChange={(e) => setZomatoComm(Number(e.target.value))}
              className="w-full bg-zinc-950 border border-zinc-800 focus:border-rose-500 rounded-xl p-3 text-xs text-rose-200 font-mono focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-1">Swiggy Merchant ID</label>
            <input
              type="text"
              value={swiggyId}
              onChange={(e) => setSwiggyId(e.target.value)}
              className="w-full bg-zinc-950 border border-zinc-800 focus:border-orange-500 rounded-xl p-3 text-xs text-orange-200 font-mono focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-1">Swiggy Commission (%)</label>
            <input
              type="number"
              value={swiggyComm}
              onChange={(e) => setSwiggyComm(Number(e.target.value))}
              className="w-full bg-zinc-950 border border-zinc-800 focus:border-orange-500 rounded-xl p-3 text-xs text-orange-200 font-mono focus:outline-none"
            />
          </div>

          <button
            type="submit"
            disabled={isSaving}
            className="md:col-span-4 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-xs shadow-lg shadow-amber-500/20 transition-all flex items-center justify-center gap-2"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>{isSaving ? 'Updating Credentials...' : 'Save Third-Party Delivery Configuration'}</span>
          </button>
        </form>
      </div>

      {/* Unified Multi-Channel Order Feed */}
      <div className="bg-zinc-900/90 border border-zinc-800 rounded-3xl p-6 shadow-2xl space-y-4">
        <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
          <h3 className="font-serif text-lg font-bold text-amber-100 flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-amber-400" />
            <span>Unified Multi-Channel Order Stream</span>
          </h3>
          <span className="text-[11px] font-mono text-zinc-400">Total Stream: {orders.length} Orders</span>
        </div>

        <div className="space-y-3 max-h-[500px] overflow-y-auto custom-scrollbar pr-1">
          {Array.from(new Map<string, Order>(orders.map((o) => [o.id, o])).values()).map((order, orderIdx) => {
            const isZomato = order.source === 'zomato';
            const isSwiggy = order.source === 'swiggy';

            return (
              <div
                key={order.id || `delivery-ord-${orderIdx}`}
                className="bg-zinc-950 border border-zinc-800 rounded-2xl p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-3"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span
                      className={`px-2.5 py-0.5 rounded-md text-[10px] font-mono font-bold border uppercase ${
                        isZomato
                          ? 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                          : isSwiggy
                          ? 'bg-orange-500/20 text-orange-300 border-orange-500/40'
                          : 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                      }`}
                    >
                      {isZomato ? '🔴 Zomato' : isSwiggy ? '🟠 Swiggy' : '🟡 Direct QR'}
                    </span>

                    <span className="font-mono text-xs font-bold text-amber-200">{order.orderNumber}</span>
                    <span className="text-xs text-zinc-400">• {order.customerName}</span>
                  </div>

                  <p className="text-[11px] text-zinc-400 font-mono">
                    Items: {order.items.map((i) => `${i.name} (${i.quantity})`).join(', ')}
                  </p>
                </div>

                <div className="text-right flex items-center gap-4">
                  <div className="font-mono text-xs">
                    <p className="text-amber-300 font-bold">${order.totalAmount.toFixed(2)}</p>
                    {(isZomato || isSwiggy) && (
                      <p className="text-[10px] text-rose-400">
                        Commission: -${(order.commissionFee || (order.totalAmount * 0.18)).toFixed(2)}
                      </p>
                    )}
                  </div>

                  <span className="text-[10px] uppercase font-mono font-bold px-2 py-1 rounded bg-zinc-900 border border-zinc-800 text-zinc-300">
                    {order.status}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
