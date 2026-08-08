import React, { useState } from 'react';
import { Phone, Lock, User, Calendar, Instagram, Check, Sparkles, X, Gift, ShieldCheck, FileText, ArrowRight } from 'lucide-react';
import { Customer } from '../types';
import { apiClient } from '../services/api';
import confetti from 'canvas-confetti';
import { TermsAndPrivacyModal } from './TermsAndPrivacyModal';

interface CustomerAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (customer: Customer) => void;
}

export const CustomerAuthModal: React.FC<CustomerAuthModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [step, setStep] = useState<'phone' | 'otp' | 'details' | 'consent' | 'success'>('phone');
  const [mobile, setMobile] = useState('+1 9876543210');
  const [otp, setOtp] = useState('');
  const [name, setName] = useState('');
  const [birthday, setBirthday] = useState('');
  const [instagramId, setInstagramId] = useState('');
  
  // Consent Checkboxes
  const [termsAccepted, setTermsAccepted] = useState(true);
  const [privacyAccepted, setPrivacyAccepted] = useState(true);
  const [marketingConsent, setMarketingConsent] = useState(true);

  // Legal Modal viewer
  const [legalModalOpen, setLegalModalOpen] = useState(false);
  const [legalModalTab, setLegalModalTab] = useState<'terms' | 'privacy'>('terms');

  const [loading, setLoading] = useState(false);
  const [customerResult, setCustomerResult] = useState<Customer | null>(null);

  if (!isOpen) return null;

  const triggerConfetti = () => {
    confetti({
      particleCount: 80,
      spread: 70,
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
      setOtp('123456'); // Pre-fill test OTP
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

  const handleDetailsNext = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    setStep('consent');
  };

  const handleAcceptAndContinue = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!termsAccepted || !privacyAccepted) return;

    setLoading(true);
    try {
      const cust = await apiClient.loginCustomer({
        mobile,
        name: name.trim() || 'Rahul Verma',
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
      onSuccess(cust);
    } catch (err) {
      console.error('Login error:', err);
    } finally {
      setLoading(false);
    }
  };

  const openLegalModal = (tab: 'terms' | 'privacy') => {
    setLegalModalTab(tab);
    setLegalModalOpen(true);
  };

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
        <div className="relative w-full max-w-md bg-zinc-950 border border-amber-500/30 rounded-3xl p-6 sm:p-8 text-zinc-100 shadow-2xl overflow-hidden">
          {/* Glow */}
          <div className="absolute -top-24 -right-24 w-48 h-48 bg-amber-500/20 rounded-full blur-3xl pointer-events-none" />

          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-xl bg-zinc-900 text-zinc-400 hover:text-white transition-colors"
            id="close-auth-modal-btn"
          >
            <X className="w-5 h-5" />
          </button>

          {/* STEP 1: PHONE NUMBER */}
          {step === 'phone' && (
            <form onSubmit={handleSendOtp} className="space-y-4">
              <div className="text-center mb-6">
                <div className="inline-flex p-3 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400 mb-3">
                  <Phone className="w-6 h-6" />
                </div>
                <h3 className="font-serif text-2xl font-bold text-amber-100">Customer Login</h3>
                <p className="text-xs text-zinc-400 mt-1">Scan QR & Login with mobile OTP to unlock 15% Welcome Discount</p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1.5">Mobile Number</label>
                <div className="relative">
                  <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                  <input
                    type="text"
                    value={mobile}
                    onChange={(e) => setMobile(e.target.value)}
                    placeholder="+1 (555) 000-0000"
                    required
                    className="w-full bg-zinc-900 border border-zinc-800 focus:border-amber-500 rounded-xl py-3 pl-10 pr-4 text-sm text-white placeholder-zinc-600 focus:outline-none focus:ring-1 focus:ring-amber-500 transition-all font-mono"
                    id="mobile-input"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-zinc-950 font-bold text-sm tracking-wide shadow-lg shadow-amber-500/20 transition-all flex items-center justify-center gap-2"
                id="send-otp-btn"
              >
                {loading ? 'Sending OTP...' : 'Send OTP Verification'}
              </button>
            </form>
          )}

          {/* STEP 2: VERIFY OTP */}
          {step === 'otp' && (
            <form onSubmit={handleVerifyOtp} className="space-y-4">
              <div className="text-center mb-6">
                <div className="inline-flex p-3 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400 mb-3">
                  <Lock className="w-6 h-6" />
                </div>
                <h3 className="font-serif text-2xl font-bold text-amber-100">Enter OTP Code</h3>
                <p className="text-xs text-zinc-400 mt-1">Code sent to <span className="text-amber-300 font-mono">{mobile}</span></p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1.5">6-Digit Verification Code</label>
                <input
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  maxLength={6}
                  required
                  className="w-full bg-zinc-900 border border-amber-500/40 rounded-xl py-3 text-center text-xl font-mono tracking-widest text-amber-300 focus:outline-none focus:ring-1 focus:ring-amber-500"
                  id="otp-input"
                />
                <p className="text-[11px] text-zinc-500 text-right mt-1">Test OTP (123456) pre-filled</p>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-zinc-950 font-bold text-sm tracking-wide shadow-lg transition-all"
                id="verify-otp-btn"
              >
                {loading ? 'Verifying...' : 'Verify OTP'}
              </button>
            </form>
          )}

          {/* STEP 3: CUSTOMER DETAILS */}
          {step === 'details' && (
            <form onSubmit={handleDetailsNext} className="space-y-4">
              <div className="text-center mb-4">
                <div className="inline-flex p-2.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400 mb-2">
                  <Sparkles className="w-5 h-5" />
                </div>
                <h3 className="font-serif text-xl font-bold text-amber-100">Customer Profile</h3>
                <p className="text-xs text-zinc-400">Complete your details for rewards and personalized offers</p>
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
                    id="profile-name-input"
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
                      id="profile-birthday-input"
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
                      id="profile-instagram-input"
                    />
                  </div>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-zinc-950 font-bold text-sm transition-all flex items-center justify-center gap-2"
                id="next-consent-btn"
              >
                <span>Continue to Mandatory Consent</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}

          {/* STEP 4: MANDATORY CONSENT PAGE */}
          {step === 'consent' && (
            <form onSubmit={handleAcceptAndContinue} className="space-y-4 animate-fade-in">
              <div className="text-center mb-4">
                <div className="inline-flex p-2.5 rounded-2xl bg-amber-500/15 border border-amber-500/30 text-amber-400 mb-2">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <h3 className="font-serif text-xl font-bold text-amber-100">Terms & Privacy Consent</h3>
                <p className="text-xs text-zinc-400">Please review and accept our customer policies before continuing.</p>
              </div>

              {/* Mandatory Checkboxes */}
              <div className="space-y-3 bg-zinc-900/90 border border-zinc-800 p-4 rounded-2xl text-xs">
                {/* Terms & Conditions Checkbox */}
                <label className="flex items-start gap-3 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={termsAccepted}
                    onChange={(e) => setTermsAccepted(e.target.checked)}
                    className="mt-0.5 w-4 h-4 rounded border-zinc-700 bg-zinc-950 text-amber-500 focus:ring-amber-500 focus:ring-offset-zinc-950 cursor-pointer"
                    id="checkbox-terms"
                  />
                  <span className="text-zinc-200 group-hover:text-amber-200 transition-colors">
                    ☑ I agree to <strong className="text-amber-400 font-semibold">Terms & Conditions</strong>
                  </span>
                </label>

                {/* Privacy Policy Checkbox */}
                <label className="flex items-start gap-3 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={privacyAccepted}
                    onChange={(e) => setPrivacyAccepted(e.target.checked)}
                    className="mt-0.5 w-4 h-4 rounded border-zinc-700 bg-zinc-950 text-amber-500 focus:ring-amber-500 focus:ring-offset-zinc-950 cursor-pointer"
                    id="checkbox-privacy"
                  />
                  <span className="text-zinc-200 group-hover:text-amber-200 transition-colors">
                    ☑ I agree to <strong className="text-amber-400 font-semibold">Privacy Policy</strong>
                  </span>
                </label>

                {/* Marketing Consent Checkbox */}
                <label className="flex items-start gap-3 cursor-pointer group pt-1 border-t border-zinc-800">
                  <input
                    type="checkbox"
                    checked={marketingConsent}
                    onChange={(e) => setMarketingConsent(e.target.checked)}
                    className="mt-0.5 w-4 h-4 rounded border-zinc-700 bg-zinc-950 text-amber-500 focus:ring-amber-500 focus:ring-offset-zinc-950 cursor-pointer"
                    id="checkbox-marketing"
                  />
                  <span className="text-zinc-400 group-hover:text-zinc-300 transition-colors">
                    ☑ I consent to receiving promotional offers, discount coupons & menu updates via SMS, WhatsApp, & Email.
                  </span>
                </label>
              </div>

              {/* Action Buttons: Read Terms / Read Privacy */}
              <div className="grid grid-cols-2 gap-2 text-xs">
                <button
                  type="button"
                  onClick={() => openLegalModal('terms')}
                  className="py-2 px-3 rounded-xl bg-zinc-900 border border-zinc-800 hover:border-amber-500/50 text-zinc-300 hover:text-amber-300 transition-all flex items-center justify-center gap-1.5"
                  id="btn-read-terms"
                >
                  <FileText className="w-3.5 h-3.5 text-amber-400" />
                  <span>Read Terms & Conditions</span>
                </button>

                <button
                  type="button"
                  onClick={() => openLegalModal('privacy')}
                  className="py-2 px-3 rounded-xl bg-zinc-900 border border-zinc-800 hover:border-amber-500/50 text-zinc-300 hover:text-amber-300 transition-all flex items-center justify-center gap-1.5"
                  id="btn-read-privacy"
                >
                  <Lock className="w-3.5 h-3.5 text-amber-400" />
                  <span>Read Privacy Policy</span>
                </button>
              </div>

              {/* Welcome Discount Highlight */}
              <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-xl text-xs text-amber-300 flex items-center gap-2">
                <Gift className="w-4 h-4 flex-shrink-0 text-amber-400" />
                <span>Accepting activates 15% Welcome Discount & +100 Points!</span>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={!termsAccepted || !privacyAccepted || loading}
                className={`w-full py-3.5 px-4 rounded-xl font-bold text-sm tracking-wide transition-all shadow-lg flex items-center justify-center gap-2 ${
                  termsAccepted && privacyAccepted
                    ? 'bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-zinc-950 cursor-pointer shadow-amber-500/20'
                    : 'bg-zinc-800 text-zinc-500 cursor-not-allowed opacity-60'
                }`}
                id="btn-accept-continue"
              >
                {loading ? 'Creating Profile & Consent...' : 'Accept & Continue'}
              </button>
            </form>
          )}

          {/* STEP 5: SUCCESS */}
          {step === 'success' && (
            <div className="text-center py-4 space-y-4 animate-scale-up">
              <div className="w-16 h-16 rounded-full bg-emerald-500/20 border-2 border-emerald-400 text-emerald-400 flex items-center justify-center mx-auto">
                <Check className="w-8 h-8 stroke-[3]" />
              </div>

              <h3 className="text-2xl font-serif font-black text-amber-100">
                🎉 Welcome to DineFlow Pro!
              </h3>

              <div className="bg-gradient-to-r from-amber-500/20 via-amber-400/20 to-amber-500/20 border border-amber-500/40 rounded-2xl p-4 text-center space-y-1">
                <p className="text-xs uppercase tracking-widest text-amber-400 font-bold">
                  15% DISCOUNT ACTIVATED
                </p>
                <p className="text-xl font-serif font-bold text-white">
                  Profile & Consent Verified
                </p>
                <p className="text-xs text-zinc-400">
                  Welcome 15% offer applied to your active table cart!
                </p>
              </div>

              <button
                onClick={onClose}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-zinc-950 font-bold text-sm hover:from-amber-400 hover:to-amber-500 transition-all"
                id="btn-explore-menu"
              >
                Explore Digital Menu
              </button>
            </div>
          )}
        </div>
      </div>

      {/* FULL TERMS & PRIVACY VIEWER MODAL */}
      <TermsAndPrivacyModal
        isOpen={legalModalOpen}
        onClose={() => setLegalModalOpen(false)}
        initialTab={legalModalTab}
      />
    </>
  );
};
