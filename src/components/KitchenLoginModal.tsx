import React, { useState } from 'react';
import { StaffAccount } from '../types';
import { Flame, Lock, ShieldCheck, KeyRound, Phone, AlertCircle } from 'lucide-react';
import { apiClient } from '../services/api';

interface KitchenLoginModalProps {
  isOpen: boolean;
  onLoginSuccess: (staff: StaffAccount) => void;
  onClose?: () => void;
}

export const KitchenLoginModal: React.FC<KitchenLoginModalProps> = ({
  isOpen,
  onLoginSuccess,
  onClose,
}) => {
  const [loginMethod, setLoginMethod] = useState<'id' | 'phone'>('id');
  const [employeeId, setEmployeeId] = useState('KITCHEN01');
  const [password, setPassword] = useState('kitchen123');
  const [phone, setPhone] = useState('9876543210');
  const [otp, setOtp] = useState('1234');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await apiClient.loginKitchenStaff({
        employeeId: loginMethod === 'id' ? employeeId : undefined,
        password: loginMethod === 'id' ? password : undefined,
        phone: loginMethod === 'phone' ? phone : undefined,
        otp: loginMethod === 'phone' ? otp : undefined,
      });

      onLoginSuccess(res.user);
    } catch (err: any) {
      setError(err.message || 'Kitchen login failed. Verify credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-md bg-zinc-950 border border-amber-500/40 rounded-3xl p-6 sm:p-8 text-zinc-100 shadow-2xl">
        {/* Glow */}
        <div className="absolute -top-16 -left-16 w-48 h-48 bg-orange-500/20 rounded-full blur-3xl pointer-events-none" />

        {/* Header */}
        <div className="text-center mb-6">
          <div className="w-16 h-16 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/40 flex items-center justify-center mx-auto mb-3 shadow-lg">
            <Flame className="w-9 h-9 animate-pulse" />
          </div>
          <h2 className="font-serif text-2xl font-bold text-amber-100">Kitchen Display Login</h2>
          <p className="text-xs text-zinc-400 mt-1">
            Restricted access for kitchen staff & line chefs only
          </p>
        </div>

        {/* Helper Test Credentials */}
        <div className="mb-5 p-3 bg-amber-500/10 border border-amber-500/30 rounded-2xl text-xs text-amber-300">
          <p className="font-bold flex items-center gap-1">
            <KeyRound className="w-3.5 h-3.5" /> Demo Kitchen Credentials:
          </p>
          <div className="mt-1 font-mono text-[11px] text-zinc-300 space-y-0.5">
            <p>ID: <span className="text-amber-200">KITCHEN01</span> • Pass: <span className="text-amber-200">kitchen123</span></p>
            <p>Phone: <span className="text-amber-200">9876543210</span> • OTP: <span className="text-amber-200">1234</span></p>
          </div>
        </div>

        {/* Toggle Login Method */}
        <div className="flex bg-zinc-900 p-1 rounded-xl border border-zinc-800 mb-5 text-xs">
          <button
            type="button"
            onClick={() => setLoginMethod('id')}
            className={`flex-1 py-2 rounded-lg font-bold transition-all flex items-center justify-center gap-1.5 ${
              loginMethod === 'id' ? 'bg-amber-500 text-zinc-950 shadow-md' : 'text-zinc-400'
            }`}
          >
            <Lock className="w-3.5 h-3.5" />
            <span>Kitchen ID & Pass</span>
          </button>
          <button
            type="button"
            onClick={() => setLoginMethod('phone')}
            className={`flex-1 py-2 rounded-lg font-bold transition-all flex items-center justify-center gap-1.5 ${
              loginMethod === 'phone' ? 'bg-amber-500 text-zinc-950 shadow-md' : 'text-zinc-400'
            }`}
          >
            <Phone className="w-3.5 h-3.5" />
            <span>Phone & OTP</span>
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-rose-500/20 border border-rose-500/40 rounded-xl text-xs text-rose-300 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {loginMethod === 'id' ? (
            <>
              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">Kitchen Employee ID</label>
                <input
                  type="text"
                  value={employeeId}
                  onChange={(e) => setEmployeeId(e.target.value)}
                  placeholder="KITCHEN01"
                  required
                  className="w-full bg-zinc-900 border border-zinc-800 focus:border-amber-500 rounded-xl p-3 text-xs text-white placeholder-zinc-600 focus:outline-none uppercase font-mono tracking-wider"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full bg-zinc-900 border border-zinc-800 focus:border-amber-500 rounded-xl p-3 text-xs text-white focus:outline-none"
                />
              </div>
            </>
          ) : (
            <>
              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">Staff Mobile Number</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="9876543210"
                  required
                  className="w-full bg-zinc-900 border border-zinc-800 focus:border-amber-500 rounded-xl p-3 text-xs text-white placeholder-zinc-600 focus:outline-none font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">OTP Verification Code</label>
                <input
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  placeholder="1234"
                  maxLength={4}
                  required
                  className="w-full bg-zinc-900 border border-zinc-800 focus:border-amber-500 rounded-xl p-3 text-xs text-white placeholder-zinc-600 focus:outline-none text-center font-mono tracking-widest text-lg font-bold"
                />
              </div>
            </>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-zinc-950 font-bold text-sm shadow-lg shadow-amber-500/20 transition-all flex items-center justify-center gap-2"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>{loading ? 'Authenticating...' : 'ACCESS KITCHEN KDS'}</span>
          </button>
        </form>

        {/* Security Warning Notice */}
        <div className="mt-5 text-center text-[11px] text-zinc-500 border-t border-zinc-900 pt-3">
          🔒 RBAC Enforced: Kitchen staff portal is restricted solely to order fulfillment and ticket dispatch.
        </div>
      </div>
    </div>
  );
};
