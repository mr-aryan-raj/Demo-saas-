import React, { useState, useEffect } from 'react';
import { Cookie, Shield, Check, X, Info, Lock } from 'lucide-react';
import { CookiePreference } from '../types';

interface CookieSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSavePreferences: (prefs: CookiePreference) => void;
}

export const CookieSettingsModal: React.FC<CookieSettingsModalProps> = ({
  isOpen,
  onClose,
  onSavePreferences,
}) => {
  const [essentialCookie] = useState(true); // Always required
  const [analyticsCookie, setAnalyticsCookie] = useState(true);
  const [marketingCookie, setMarketingCookie] = useState(true);
  const [preferenceCookie, setPreferenceCookie] = useState(true);
  const [personalizedAdsCookie, setPersonalizedAdsCookie] = useState(true);

  useEffect(() => {
    const saved = localStorage.getItem('dineflow_cookie_consent');
    if (saved) {
      try {
        const parsed: CookiePreference = JSON.parse(saved);
        setAnalyticsCookie(parsed.analyticsCookie ?? true);
        setMarketingCookie(parsed.marketingCookie ?? true);
        setPreferenceCookie(parsed.preferenceCookie ?? true);
        setPersonalizedAdsCookie(parsed.personalizedAdsCookie ?? true);
      } catch (e) {
        console.error('Error reading saved cookie preferences:', e);
      }
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSave = () => {
    const updated: CookiePreference = {
      id: `cook-${Date.now()}`,
      customerId: 'guest',
      essentialCookie: true,
      analyticsCookie,
      marketingCookie,
      preferenceCookie,
      personalizedAdsCookie,
      updatedDate: new Date().toISOString(),
    };
    localStorage.setItem('dineflow_cookie_consent', JSON.stringify(updated));
    onSavePreferences(updated);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-2xl bg-zinc-950 border border-amber-500/30 rounded-3xl p-6 sm:p-8 text-zinc-100 shadow-2xl max-h-[90vh] flex flex-col overflow-hidden">
        {/* Glow */}
        <div className="absolute -top-24 -right-24 w-60 h-60 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Header */}
        <div className="flex items-center justify-between border-b border-zinc-800 pb-4 mb-4">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-amber-500/15 border border-amber-500/30 text-amber-400">
              <Cookie className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-serif text-2xl font-bold text-amber-100">Cookie Preferences</h3>
              <p className="text-xs text-zinc-400">Customize how DineFlow Pro handles your browsing data</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-zinc-900 text-zinc-400 hover:text-white transition-colors"
            id="close-cookie-modal-btn"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Categories List */}
        <div className="flex-1 overflow-y-auto space-y-4 pr-1 text-xs sm:text-sm">
          {/* 1. Essential Cookies */}
          <div className="bg-zinc-900/80 border border-zinc-800 p-4 rounded-2xl flex items-start justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-emerald-400" />
                <h4 className="font-bold text-amber-200">Essential Cookies (Always Active)</h4>
              </div>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Necessary for core website function, order processing, secure payment sessions, and table session persistence. Cannot be disabled.
              </p>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 font-bold text-[11px] border border-emerald-500/30 flex-shrink-0">
              <Lock className="w-3 h-3" />
              <span>Required</span>
            </div>
          </div>

          {/* 2. Analytics Cookies */}
          <div className="bg-zinc-900/80 border border-zinc-800 p-4 rounded-2xl flex items-start justify-between gap-4">
            <div className="space-y-1">
              <h4 className="font-bold text-amber-200">Analytics & Performance Cookies</h4>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Helps us measure guest traffic, most popular dishes, load speeds, and menu navigation optimization.
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer flex-shrink-0">
              <input
                type="checkbox"
                checked={analyticsCookie}
                onChange={(e) => setAnalyticsCookie(e.target.checked)}
                className="sr-only peer"
                id="toggle-analytics-cookie"
              />
              <div className="w-11 h-6 bg-zinc-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-zinc-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-500"></div>
            </label>
          </div>

          {/* 3. Marketing Cookies */}
          <div className="bg-zinc-900/80 border border-zinc-800 p-4 rounded-2xl flex items-start justify-between gap-4">
            <div className="space-y-1">
              <h4 className="font-bold text-amber-200">Marketing & Promotional Communication</h4>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Used to deliver special 15% discount coupons, chef recommendation updates, and loyalty reward notifications.
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer flex-shrink-0">
              <input
                type="checkbox"
                checked={marketingCookie}
                onChange={(e) => setMarketingCookie(e.target.checked)}
                className="sr-only peer"
                id="toggle-marketing-cookie"
              />
              <div className="w-11 h-6 bg-zinc-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-zinc-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-500"></div>
            </label>
          </div>

          {/* 4. Preference Cookies */}
          <div className="bg-zinc-900/80 border border-zinc-800 p-4 rounded-2xl flex items-start justify-between gap-4">
            <div className="space-y-1">
              <h4 className="font-bold text-amber-200">Preference & Dietary Filters</h4>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Remembers your dietary preferences (Vegan, Gluten-Free, Spice Levels) across menu visits.
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer flex-shrink-0">
              <input
                type="checkbox"
                checked={preferenceCookie}
                onChange={(e) => setPreferenceCookie(e.target.checked)}
                className="sr-only peer"
                id="toggle-preference-cookie"
              />
              <div className="w-11 h-6 bg-zinc-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-zinc-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-500"></div>
            </label>
          </div>

          {/* 5. Personalized Advertisement Cookies */}
          <div className="bg-zinc-900/80 border border-zinc-800 p-4 rounded-2xl flex items-start justify-between gap-4">
            <div className="space-y-1">
              <h4 className="font-bold text-amber-200">Personalized Advertisement Cookies</h4>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Allows restaurant partners to display targeted social campaigns and birthday meal invitations.
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer flex-shrink-0">
              <input
                type="checkbox"
                checked={personalizedAdsCookie}
                onChange={(e) => setPersonalizedAdsCookie(e.target.checked)}
                className="sr-only peer"
                id="toggle-ads-cookie"
              />
              <div className="w-11 h-6 bg-zinc-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-zinc-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-500"></div>
            </label>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="pt-4 border-t border-zinc-800 mt-4 flex items-center justify-between gap-3">
          <p className="text-[11px] text-zinc-500 hidden sm:block">Preferences automatically saved locally</p>
          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl bg-zinc-900 text-zinc-400 hover:text-white text-xs font-semibold"
              id="cancel-cookie-settings-btn"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-zinc-950 font-bold text-xs tracking-wide shadow-lg shadow-amber-500/20"
              id="save-cookie-settings-btn"
            >
              Save Preferences
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
