import React, { useState } from 'react';
import { Flame, Lock, ShieldAlert, UserCheck, Utensils, Info, CheckCircle2 } from 'lucide-react';
import { apiClient } from '../services/api';

interface KitchenLoginPageProps {
  onKitchenLoginSuccess: (user: any) => void;
  onCancel?: () => void;
}

export const KitchenLoginPage: React.FC<KitchenLoginPageProps> = ({
  onKitchenLoginSuccess,
  onCancel,
}) => {
  const [kitchenId, setKitchenId] = useState('KITCHEN-01');
  const [password, setPassword] = useState('kitchen123');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await apiClient.kitchenLogin({ kitchenId, password });
      setLoading(false);
      onKitchenLoginSuccess(res);
    } catch (err: any) {
      setLoading(false);
      setError(err?.message || 'Invalid Kitchen credentials. Use KITCHEN-01 / kitchen123');
    }
  };

  return (
    <div className="min-h-[85vh] py-12 px-4 flex items-center justify-center relative bg-zinc-950 overflow-hidden">
      {/* Flame Glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 w-full max-w-md bg-zinc-950 border border-amber-500/30 rounded-3xl p-6 sm:p-8 text-zinc-100 shadow-2xl backdrop-blur-xl">
        {/* Header Icon */}
        <div className="text-center mb-6">
          <div className="inline-flex p-3 rounded-2xl bg-orange-500/15 border border-orange-500/30 text-orange-400 mb-3 shadow-lg">
            <Flame className="w-8 h-8" />
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-amber-100">Kitchen KDS Login</h2>
          <p className="text-xs text-zinc-400 mt-1">Kitchen Display System & Order Preparation Portal</p>
        </div>

        {error && (
          <div className="p-3 bg-rose-500/15 border border-rose-500/30 rounded-xl text-xs text-rose-300 mb-4 flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-rose-400 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-1.5">Kitchen Terminal / Station ID</label>
            <div className="relative">
              <Utensils className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
              <input
                type="text"
                value={kitchenId}
                onChange={(e) => setKitchenId(e.target.value)}
                placeholder="KITCHEN-01"
                required
                className="w-full bg-zinc-900 border border-zinc-800 focus:border-orange-500 rounded-xl py-3 pl-10 pr-4 text-sm text-white focus:outline-none focus:ring-1 focus:ring-orange-500 font-mono uppercase"
                id="kitchen-id-input"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-1.5">Station Password</label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full bg-zinc-900 border border-zinc-800 focus:border-orange-500 rounded-xl py-3 pl-10 pr-4 text-sm text-white focus:outline-none focus:ring-1 focus:ring-orange-500 font-mono"
                id="kitchen-password-input"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-400 hover:to-amber-500 text-zinc-950 font-extrabold text-sm tracking-wide shadow-xl shadow-orange-500/20 transition-all flex items-center justify-center gap-2 mt-2"
            id="kitchen-login-submit-btn"
          >
            {loading ? 'Authenticating Station...' : 'ENTER KITCHEN DISPLAY SYSTEM'}
          </button>
        </form>

        {/* Restricted RBAC Capabilities Notice */}
        <div className="mt-6 p-4 bg-zinc-900/90 border border-zinc-800 rounded-2xl text-[11px] text-zinc-300 space-y-2">
          <p className="font-bold text-orange-400 flex items-center gap-1.5">
            <Info className="w-4 h-4" />
            <span>Kitchen Staff Permission Boundaries (RBAC)</span>
          </p>

          <div className="space-y-1 font-mono text-[10px]">
            <p className="text-emerald-400 flex items-center gap-1">
              ✓ View Real-time Orders & Preparation Timers
            </p>
            <p className="text-emerald-400 flex items-center gap-1">
              ✓ Accept Orders & Mark Ready Status
            </p>
            <p className="text-rose-400 flex items-center gap-1">
              ✗ NO Access to Customer CRM Data
            </p>
            <p className="text-rose-400 flex items-center gap-1">
              ✗ NO Access to Admin Dashboard / Sales Reports
            </p>
            <p className="text-rose-400 flex items-center gap-1">
              ✗ NO Access to Menu Editing or System Settings
            </p>
          </div>
        </div>

        {onCancel && (
          <div className="mt-4 text-center">
            <button
              onClick={onCancel}
              className="text-xs text-zinc-500 hover:text-zinc-300 underline"
            >
              Return to Customer Menu
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
