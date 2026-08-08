import React, { useState, useEffect } from 'react';
import { Cookie, Check, X, Settings, ShieldCheck } from 'lucide-react';
import { CookiePreference } from '../types';

interface CookieConsentBannerProps {
  onOpenSettings: () => void;
  onSavePreferences: (prefs: CookiePreference) => void;
}

export const CookieConsentBanner: React.FC<CookieConsentBannerProps> = ({
  onOpenSettings,
  onSavePreferences,
}) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('dineflow_cookie_consent');
    if (!saved) {
      setIsVisible(true);
    }
  }, []);

  if (!isVisible) return null;

  const handleAcceptAll = () => {
    const allAccepted: CookiePreference = {
      id: `cook-${Date.now()}`,
      customerId: 'guest',
      essentialCookie: true,
      analyticsCookie: true,
      marketingCookie: true,
      preferenceCookie: true,
      personalizedAdsCookie: true,
      updatedDate: new Date().toISOString(),
    };
    localStorage.setItem('dineflow_cookie_consent', JSON.stringify(allAccepted));
    onSavePreferences(allAccepted);
    setIsVisible(false);
  };

  const handleRejectNonEssential = () => {
    const essentialOnly: CookiePreference = {
      id: `cook-${Date.now()}`,
      customerId: 'guest',
      essentialCookie: true,
      analyticsCookie: false,
      marketingCookie: false,
      preferenceCookie: false,
      personalizedAdsCookie: false,
      updatedDate: new Date().toISOString(),
    };
    localStorage.setItem('dineflow_cookie_consent', JSON.stringify(essentialOnly));
    onSavePreferences(essentialOnly);
    setIsVisible(false);
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 sm:p-6 bg-zinc-950/95 border-t-2 border-amber-500/40 backdrop-blur-xl shadow-2xl animate-slide-up text-zinc-100">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        {/* Banner Content */}
        <div className="flex items-start gap-3.5 max-w-3xl">
          <div className="p-3 rounded-2xl bg-amber-500/15 border border-amber-500/30 text-amber-400 flex-shrink-0 mt-0.5">
            <Cookie className="w-6 h-6 animate-bounce" />
          </div>
          <div>
            <h4 className="font-serif text-base font-bold text-amber-100 flex items-center gap-2">
              <span>🍪 We Use Cookies & Value Your Privacy</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-sans">
                GDPR & CCPA Compliant
              </span>
            </h4>
            <p className="text-xs text-zinc-300 mt-1 leading-relaxed">
              We use essential, analytics, and marketing cookies to improve your dining experience, remember dish preferences, analyze website traffic, and deliver personalized discount offers.
            </p>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto justify-end">
          <button
            onClick={() => {
              setIsVisible(false);
              onOpenSettings();
            }}
            className="px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 hover:border-amber-500/50 text-zinc-300 hover:text-amber-300 text-xs font-semibold transition-all flex items-center gap-1.5"
            id="cookie-banner-manage-btn"
          >
            <Settings className="w-3.5 h-3.5 text-amber-400" />
            <span>[ Manage Preferences ]</span>
          </button>

          <button
            onClick={handleRejectNonEssential}
            className="px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 text-zinc-400 hover:text-white text-xs font-semibold transition-all"
            id="cookie-banner-reject-btn"
          >
            [ Reject Non Essential ]
          </button>

          <button
            onClick={handleAcceptAll}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-zinc-950 font-extrabold text-xs tracking-wide shadow-lg shadow-amber-500/20 transition-all flex items-center gap-1.5"
            id="cookie-banner-accept-all-btn"
          >
            <Check className="w-4 h-4 stroke-[3]" />
            <span>[ Accept All Cookies ]</span>
          </button>
        </div>
      </div>
    </div>
  );
};
