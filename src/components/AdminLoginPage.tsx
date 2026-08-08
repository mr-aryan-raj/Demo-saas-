import React, { useState } from 'react';
import { LayoutDashboard, Lock, Mail, ShieldAlert, CheckCircle2, Key, Info } from 'lucide-react';
import { apiClient } from '../services/api';

interface AdminLoginPageProps {
  onAdminLoginSuccess: (user: any) => void;
  onCancel?: () => void;
}

export const AdminLoginPage: React.FC<AdminLoginPageProps> = ({
  onAdminLoginSuccess,
  onCancel,
}) => {
  const [email, setEmail] = useState('admin@dineflow.com');
  const [password, setPassword] = useState('admin123');
  const [rememberMe, setRememberMe] = useState(true);
  const [useTwoFactor, setUseTwoFactor] = useState(false);
  const [twoFactorCode, setTwoFactorCode] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showForgotMsg, setShowForgotMsg] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await apiClient.adminLogin({ email, password, twoFactorCode });
      setLoading(false);
      onAdminLoginSuccess(res);
    } catch (err: any) {
      setLoading(false);
      setError(err?.message || 'Invalid administrator credentials. Use admin@dineflow.com / admin123');
    }
  };

  return (
    <div className="min-h-[85vh] py-12 px-4 flex items-center justify-center relative bg-zinc-950 overflow-hidden">
      {/* Background Glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 w-full max-w-md bg-zinc-950 border border-amber-500/30 rounded-3xl p-6 sm:p-8 text-zinc-100 shadow-2xl backdrop-blur-xl">
        {/* Header Icon */}
        <div className="text-center mb-6">
          <div className="inline-flex p-3 rounded-2xl bg-amber-500/15 border border-amber-500/30 text-amber-400 mb-3 shadow-lg">
            <LayoutDashboard className="w-8 h-8" />
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-amber-100">Admin Portal Sign-In</h2>
          <p className="text-xs text-zinc-400 mt-1">DineFlow Pro SaaS Restaurant Management System</p>
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
            <label className="block text-xs font-semibold text-zinc-300 mb-1.5">Administrator Email</label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@dineflow.com"
                required
                className="w-full bg-zinc-900 border border-zinc-800 focus:border-amber-500 rounded-xl py-3 pl-10 pr-4 text-sm text-white focus:outline-none focus:ring-1 focus:ring-amber-500 font-mono"
                id="admin-email-input"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-semibold text-zinc-300">Password</label>
              <button
                type="button"
                onClick={() => setShowForgotMsg(true)}
                className="text-[11px] text-amber-400 hover:underline"
                id="admin-forgot-pw-btn"
              >
                Forgot Password?
              </button>
            </div>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full bg-zinc-900 border border-zinc-800 focus:border-amber-500 rounded-xl py-3 pl-10 pr-4 text-sm text-white focus:outline-none focus:ring-1 focus:ring-amber-500 font-mono"
                id="admin-password-input"
              />
            </div>
          </div>

          {/* Optional 2FA Section */}
          {useTwoFactor && (
            <div className="animate-fade-in space-y-1 pt-1">
              <label className="block text-xs font-semibold text-amber-300">2FA Authenticator Code</label>
              <div className="relative">
                <Key className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-amber-400" />
                <input
                  type="text"
                  value={twoFactorCode}
                  onChange={(e) => setTwoFactorCode(e.target.value)}
                  placeholder="6-digit 2FA Code"
                  maxLength={6}
                  className="w-full bg-zinc-900 border border-amber-500/40 rounded-xl py-2.5 pl-10 pr-4 text-sm text-amber-300 font-mono focus:outline-none"
                  id="admin-2fa-input"
                />
              </div>
            </div>
          )}

          {/* Checkboxes & 2FA toggle */}
          <div className="flex items-center justify-between text-xs pt-1">
            <label className="flex items-center gap-2 cursor-pointer text-zinc-400">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="rounded border-zinc-700 bg-zinc-900 text-amber-500 focus:ring-amber-500"
                id="admin-remember-me-checkbox"
              />
              <span>Remember Me</span>
            </label>

            <button
              type="button"
              onClick={() => setUseTwoFactor(!useTwoFactor)}
              className="text-zinc-400 hover:text-amber-300 transition-colors flex items-center gap-1"
              id="toggle-2fa-btn"
            >
              <span>{useTwoFactor ? 'Disable 2FA' : 'Enable 2FA (Optional)'}</span>
            </button>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-zinc-950 font-extrabold text-sm tracking-wide shadow-xl shadow-amber-500/20 transition-all flex items-center justify-center gap-2 mt-2"
            id="admin-login-submit-btn"
          >
            {loading ? 'Authenticating Admin...' : 'LOGIN TO ADMIN DASHBOARD'}
          </button>
        </form>

        {showForgotMsg && (
          <div className="mt-4 p-3 bg-zinc-900 border border-amber-500/30 rounded-xl text-xs text-amber-200 text-center space-y-1 animate-fade-in">
            <p className="font-bold">Password Reset Instructions</p>
            <p className="text-zinc-400 text-[11px]">
              Default demo admin credentials are <span className="text-amber-400 font-mono">admin@dineflow.com</span> / <span className="text-amber-400 font-mono">admin123</span>.
            </p>
            <button
              onClick={() => setShowForgotMsg(false)}
              className="text-[10px] text-zinc-500 underline pt-1"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Demo Credentials Hint */}
        <div className="mt-6 p-3 bg-zinc-900/80 border border-zinc-800 rounded-2xl text-[11px] text-zinc-400 space-y-1">
          <p className="font-semibold text-amber-300 flex items-center gap-1">
            <Info className="w-3.5 h-3.5" />
            <span>Administrator Access Level (RBAC)</span>
          </p>
          <p>Grants complete access to Customer CRM, Financial Sales Analytics, Menu Editor, QR Code Table Management, Loyalty Programs, & Consent Logs.</p>
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
