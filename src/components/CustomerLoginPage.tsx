import React, { useState } from 'react';
import { Phone, Lock, User, Calendar, Instagram, ShieldCheck, Gift, ArrowRight, Check, Sparkles, FileText, ExternalLink } from 'lucide-react';
import { Customer, RestaurantInfo } from '../types';
import { apiClient } from '../services/api';
import confetti from 'canvas-confetti';
import { TermsAndPrivacyModal } from './TermsAndPrivacyModal';
import { CookieSettingsModal } from './CookieSettingsModal';

interface CustomerLoginPageProps {
  restaurant: RestaurantInfo;
  onLoginSuccess: (customer: Customer) => void;
  onContinueAsGuest: () => void;
}

export const CustomerLoginPage: React.FC<CustomerLoginPageProps> = ({
  restaurant,
  onLoginSuccess,
  onContinueAsGuest,
}) => {
  const [step, setStep] = useState<'phone' | 'otp' | 'details' | 'success'>('phone');
  const [mobile, setMobile] = useState('+1 9876543210');
  const [otp, setOtp] = useState('');
  const [name, setName] = useState('');
  const [birthday, setBirthday] = useState('');
  const [instagramId, setInstagramId] = useState('');

  // Consent
  const [termsAccepted, setTermsAccepted] = useState(true);
  const [privacyAccepted, setPrivacyAccepted] = useState(true);
  const [marketingConsent, setMarketingConsent] = useState(true);

  // Modals
  const [legalModalOpen, setLegalModalOpen] = useState(false);
  const [legalModalTab, setLegalModalTab] = useState<'terms' | 'privacy'>('terms');
  const [cookieModalOpen, setCookieModalOpen] = useState(false);

  const [loading, setLoading] = useState(false);
  const [customerResult, setCustomerResult] = useState<Customer | null>(null);

  const triggerConfetti = () => {
    confetti({
      particleCount: 90,
      spread: 80,
      origin: { y: 0.6 },
      colors: ['#D4AF37', '#F3E5AB', '#FFFFFF', '#10B981'],
    });
  };

  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!mobile.trim()) return;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setStep('otp');
      setOtp('123456');
    }, 500);
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setStep('details');
    }, 500);
  };

  const handleCreateAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!termsAccepted || !privacyAccepted) return;

    setLoading(true);
    try {
      const cust = await apiClient.loginCustomer({
        mobile,
        name: name.trim() || 'Valued Guest',
        birthday,
        instagramId: instagramId.trim().startsWith('@') ? instagramId : instagramId ? `@${instagramId}` : '',
        termsAccepted,
        privacyAccepted,
        marketingConsent,
        ipAddress: '192.168.1.102',
        deviceInformation: 'Mobile Safari / iOS 17'
      });
      setCustomerResult(cust);
      setStep('success');
      triggerConfetti();
      onLoginSuccess(cust);
    } catch (err) {
      console.error('Customer login error:', err);
    } finally {
      setLoading(false);
    }
  };

  const openLegalModal = (tab: 'terms' | 'privacy') => {
    setLegalModalTab(tab);
    setLegalModalOpen(true);
  };

  return (
    <div className="min-h-[85vh] py-8 px-4 flex items-center justify-center relative overflow-hidden bg-zinc-950">
      {/* Premium Food Visual Background */}
      <div className="absolute inset-0 z-0 opacity-25 scale-105 pointer-events-none">
        <img
          src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1600&q=80"
          alt="Restaurant Ambiance"
          className="w-full h-full object-cover filter blur-sm"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/80 to-zinc-950/90" />
      </div>

      <div className="relative z-10 w-full max-w-xl bg-zinc-950/90 border border-amber-500/30 rounded-3xl p-6 sm:p-10 shadow-2xl backdrop-blur-xl">
        {/* Restaurant Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 mx-auto rounded-2xl overflow-hidden border-2 border-amber-500/40 p-0.5 bg-zinc-900 shadow-xl mb-3">
            <img src={restaurant.logo} alt={restaurant.name} className="w-full h-full object-cover rounded-xl" />
          </div>
          <h1 className="font-serif text-3xl font-bold text-amber-100">{restaurant.name}</h1>
          <p className="text-xs text-amber-400 font-medium mt-1">DineFlow Pro Guest Portal • QR Dining & Loyalty</p>
        </div>

        {/* STEP 1: PHONE NUMBER */}
        {step === 'phone' && (
          <form onSubmit={handleSendOtp} className="space-y-5 animate-fade-in">
            <div className="bg-amber-500/10 border border-amber-500/30 rounded-2xl p-4 text-center space-y-1">
              <p className="text-xs font-extrabold uppercase tracking-widest text-amber-400">🎁 WELCOME OFFER</p>
              <p className="text-lg font-serif font-bold text-white">Login Now & Get 15% OFF Your Bill</p>
              <p className="text-xs text-zinc-400">Plus +100 Loyalty Points credited instantly</p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1.5">Mobile Phone Number</label>
              <div className="relative">
                <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                <input
                  type="text"
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value)}
                  placeholder="+1 (555) 000-0000"
                  required
                  className="w-full bg-zinc-900 border border-zinc-800 focus:border-amber-500 rounded-xl py-3 pl-10 pr-4 text-sm text-white font-mono placeholder-zinc-600 focus:outline-none focus:ring-1 focus:ring-amber-500"
                  id="page-mobile-input"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-zinc-950 font-bold text-sm tracking-wide shadow-xl shadow-amber-500/20 transition-all flex items-center justify-center gap-2"
              id="page-send-otp-btn"
            >
              {loading ? 'Sending Verification Code...' : 'SEND OTP CODE'}
            </button>

            {/* Social Login Options */}
            <div className="pt-4 border-t border-zinc-800 text-center space-y-3">
              <p className="text-[11px] text-zinc-500 uppercase tracking-wider font-mono">Or quick access options</p>
              <div className="grid grid-cols-2 gap-3 text-xs font-semibold">
                <button
                  type="button"
                  onClick={onContinueAsGuest}
                  className="py-2.5 px-3 rounded-xl bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 text-zinc-300 transition-all"
                  id="page-continue-guest-btn"
                >
                  Continue as Guest
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setName('Google Guest');
                    setStep('details');
                  }}
                  className="py-2.5 px-3 rounded-xl bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 text-zinc-300 transition-all flex items-center justify-center gap-1.5"
                  id="page-google-login-btn"
                >
                  <span>Google Sign-In</span>
                </button>
              </div>
            </div>
          </form>
        )}

        {/* STEP 2: VERIFY OTP */}
        {step === 'otp' && (
          <form onSubmit={handleVerifyOtp} className="space-y-5 animate-fade-in">
            <div className="text-center space-y-1">
              <h3 className="font-serif text-xl font-bold text-amber-100">Verify Mobile OTP</h3>
              <p className="text-xs text-zinc-400">Code dispatched to <span className="text-amber-300 font-mono">{mobile}</span></p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1.5 text-center">Enter 6-Digit OTP</label>
              <input
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                maxLength={6}
                required
                className="w-full bg-zinc-900 border border-amber-500/50 rounded-xl py-3 text-center text-2xl font-mono tracking-widest text-amber-300 focus:outline-none"
                id="page-otp-input"
              />
              <p className="text-[11px] text-emerald-400 text-center mt-1.5 font-mono">✓ Test OTP code (123456) pre-filled for instant access</p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-zinc-950 font-bold text-sm tracking-wide shadow-lg transition-all"
              id="page-verify-otp-btn"
            >
              {loading ? 'Verifying Code...' : 'VERIFY & CONTINUE'}
            </button>
          </form>
        )}

        {/* STEP 3: ACCOUNT DETAILS & MANDATORY CONSENTS */}
        {step === 'details' && (
          <form onSubmit={handleCreateAccount} className="space-y-4 animate-fade-in">
            <div className="text-center mb-2">
              <h3 className="font-serif text-xl font-bold text-amber-100">Complete Profile & Policy Consents</h3>
              <p className="text-xs text-zinc-400">Provide details for your personalized loyalty wallet</p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1">Full Name *</label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Rahul Verma"
                  required
                  className="w-full bg-zinc-900 border border-zinc-800 focus:border-amber-500 rounded-xl py-2.5 pl-10 pr-4 text-xs text-white placeholder-zinc-600 focus:outline-none"
                  id="page-name-input"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">Birthday (Optional)</label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-500" />
                  <input
                    type="date"
                    value={birthday}
                    onChange={(e) => setBirthday(e.target.value)}
                    className="w-full bg-zinc-900 border border-zinc-800 focus:border-amber-500 rounded-xl py-2 pl-9 pr-2 text-xs text-white focus:outline-none"
                    id="page-birthday-input"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">Instagram ID (Optional)</label>
                <div className="relative">
                  <Instagram className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-500" />
                  <input
                    type="text"
                    value={instagramId}
                    onChange={(e) => setInstagramId(e.target.value)}
                    placeholder="@handle"
                    className="w-full bg-zinc-900 border border-zinc-800 focus:border-amber-500 rounded-xl py-2 pl-9 pr-2 text-xs text-white placeholder-zinc-600 focus:outline-none"
                    id="page-instagram-input"
                  />
                </div>
              </div>
            </div>

            {/* MANDATORY CONSENT BOX */}
            <div className="space-y-2.5 bg-zinc-900/90 border border-zinc-800 p-4 rounded-2xl text-xs mt-3">
              <label className="flex items-start gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={termsAccepted}
                  onChange={(e) => setTermsAccepted(e.target.checked)}
                  className="mt-0.5 w-4 h-4 rounded border-zinc-700 bg-zinc-950 text-amber-500 focus:ring-amber-500 cursor-pointer"
                  id="page-checkbox-terms"
                />
                <span className="text-zinc-200">
                  ☑ I agree to <button type="button" onClick={() => openLegalModal('terms')} className="text-amber-400 font-semibold underline">Terms & Conditions</button>
                </span>
              </label>

              <label className="flex items-start gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={privacyAccepted}
                  onChange={(e) => setPrivacyAccepted(e.target.checked)}
                  className="mt-0.5 w-4 h-4 rounded border-zinc-700 bg-zinc-950 text-amber-500 focus:ring-amber-500 cursor-pointer"
                  id="page-checkbox-privacy"
                />
                <span className="text-zinc-200">
                  ☑ I agree to <button type="button" onClick={() => openLegalModal('privacy')} className="text-amber-400 font-semibold underline">Privacy Policy</button>
                </span>
              </label>

              <label className="flex items-start gap-2.5 cursor-pointer pt-2 border-t border-zinc-800">
                <input
                  type="checkbox"
                  checked={marketingConsent}
                  onChange={(e) => setMarketingConsent(e.target.checked)}
                  className="mt-0.5 w-4 h-4 rounded border-zinc-700 bg-zinc-950 text-amber-500 focus:ring-amber-500 cursor-pointer"
                  id="page-checkbox-marketing"
                />
                <span className="text-zinc-400">
                  ☑ I allow restaurant to send personalized offers, discounts and marketing updates via SMS, WhatsApp, & Email.
                </span>
              </label>
            </div>

            <button
              type="submit"
              disabled={!termsAccepted || !privacyAccepted || loading}
              className={`w-full py-3.5 px-4 rounded-xl font-bold text-sm tracking-wide transition-all shadow-lg ${
                termsAccepted && privacyAccepted
                  ? 'bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-zinc-950 cursor-pointer shadow-amber-500/20'
                  : 'bg-zinc-800 text-zinc-500 cursor-not-allowed opacity-60'
              }`}
              id="page-btn-create-account"
            >
              {loading ? 'Creating Account & Wallet...' : 'CREATE ACCOUNT'}
            </button>
          </form>
        )}

        {/* STEP 4: SUCCESS ANIMATION */}
        {step === 'success' && (
          <div className="text-center py-6 space-y-5 animate-scale-up">
            <div className="w-20 h-20 rounded-full bg-emerald-500/20 border-2 border-emerald-400 text-emerald-400 flex items-center justify-center mx-auto shadow-xl">
              <Check className="w-10 h-10 stroke-[3]" />
            </div>

            <div className="space-y-1">
              <h2 className="text-3xl font-serif font-black text-amber-100">🎉 Congratulations!</h2>
              <p className="text-sm text-zinc-300">Welcome to {restaurant.name} Loyalty Family</p>
            </div>

            <div className="bg-gradient-to-r from-amber-500/20 via-amber-400/20 to-amber-500/20 border border-amber-500/40 rounded-2xl p-5 text-center space-y-1">
              <p className="text-xs uppercase tracking-widest text-amber-400 font-extrabold">15% WELCOME DISCOUNT ACTIVATED</p>
              <p className="text-xl font-serif font-bold text-white">Your Loyalty Wallet Created</p>
              <p className="text-xs text-zinc-400">+100 Points Credited to {customerResult?.name || 'Account'}</p>
            </div>

            <button
              onClick={onContinueAsGuest}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-zinc-950 font-bold text-sm hover:from-amber-400 hover:to-amber-500 transition-all shadow-lg"
              id="page-btn-start-ordering"
            >
              START ORDERING & USE DISCOUNT
            </button>
          </div>
        )}

        {/* Footer Links */}
        <div className="mt-8 pt-4 border-t border-zinc-800/80 flex flex-wrap items-center justify-center gap-4 text-xs text-zinc-400">
          <button onClick={() => openLegalModal('terms')} className="hover:text-amber-300 transition-colors" id="footer-terms-link">
            Terms & Conditions
          </button>
          <span>•</span>
          <button onClick={() => openLegalModal('privacy')} className="hover:text-amber-300 transition-colors" id="footer-privacy-link">
            Privacy Policy
          </button>
          <span>•</span>
          <button onClick={() => setCookieModalOpen(true)} className="hover:text-amber-300 transition-colors" id="footer-cookie-link">
            Cookie Policy
          </button>
        </div>
      </div>

      {/* MODALS */}
      <TermsAndPrivacyModal
        isOpen={legalModalOpen}
        onClose={() => setLegalModalOpen(false)}
        initialTab={legalModalTab}
      />

      <CookieSettingsModal
        isOpen={cookieModalOpen}
        onClose={() => setCookieModalOpen(false)}
        onSavePreferences={() => {}}
      />
    </div>
  );
};
