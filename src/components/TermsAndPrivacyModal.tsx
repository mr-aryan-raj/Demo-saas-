import React, { useState } from 'react';
import { Shield, FileText, X, CheckCircle2, Lock, Users, Gift, Megaphone, Server, Star, AlertTriangle, Eye, Database, Bell } from 'lucide-react';

interface TermsAndPrivacyModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: 'terms' | 'privacy';
}

export const TermsAndPrivacyModal: React.FC<TermsAndPrivacyModalProps> = ({
  isOpen,
  onClose,
  initialTab = 'terms',
}) => {
  const [activeTab, setActiveTab] = useState<'terms' | 'privacy'>(initialTab);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-3xl bg-zinc-950 border border-amber-500/30 rounded-3xl p-6 sm:p-8 text-zinc-100 shadow-2xl max-h-[90vh] flex flex-col overflow-hidden">
        {/* Glow */}
        <div className="absolute -top-24 -right-24 w-60 h-60 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Header */}
        <div className="flex items-center justify-between border-b border-zinc-800 pb-4 mb-4">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-amber-500/15 border border-amber-500/30 text-amber-400">
              <Shield className="w-6 h-6" />
            </div>
            <div>
              <h2 className="font-serif text-2xl font-bold text-amber-100">Legal & Compliance Portal</h2>
              <p className="text-xs text-zinc-400">DineFlow Pro Service Agreements & Privacy Protections</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-zinc-900 text-zinc-400 hover:text-white transition-colors"
            id="close-terms-modal-btn"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex gap-2 bg-zinc-900 p-1.5 rounded-2xl border border-zinc-800 mb-4 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('terms')}
            className={`flex-1 py-2.5 px-4 rounded-xl transition-all flex items-center justify-center gap-2 ${
              activeTab === 'terms'
                ? 'bg-amber-500 text-zinc-950 font-bold shadow-lg shadow-amber-500/20'
                : 'text-zinc-400 hover:text-white'
            }`}
            id="tab-terms-btn"
          >
            <FileText className="w-4 h-4" />
            <span>Terms & Conditions</span>
          </button>
          <button
            onClick={() => setActiveTab('privacy')}
            className={`flex-1 py-2.5 px-4 rounded-xl transition-all flex items-center justify-center gap-2 ${
              activeTab === 'privacy'
                ? 'bg-amber-500 text-zinc-950 font-bold shadow-lg shadow-amber-500/20'
                : 'text-zinc-400 hover:text-white'
            }`}
            id="tab-privacy-btn"
          >
            <Lock className="w-4 h-4" />
            <span>Privacy Policy</span>
          </button>
        </div>

        {/* Content Scrollable Area */}
        <div className="flex-1 overflow-y-auto pr-2 space-y-6 text-sm text-zinc-300 leading-relaxed scrollbar-thin">
          {activeTab === 'terms' ? (
            /* TERMS & CONDITIONS CONTENT */
            <div className="space-y-6 animate-fade-in" id="terms-content-section">
              <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-2xl">
                <p className="text-xs text-amber-300 font-medium">
                  Last Updated: August 2026. Please read these Terms & Conditions carefully before using DineFlow Pro digital ordering, loyalty, and guest services.
                </p>
              </div>

              {/* 1. Introduction */}
              <section className="bg-zinc-900/60 border border-zinc-800/80 rounded-2xl p-5 space-y-2">
                <div className="flex items-center gap-2 text-amber-400 font-serif font-bold text-base">
                  <FileText className="w-5 h-5 text-amber-400" />
                  <h3>1. Introduction</h3>
                </div>
                <p className="text-zinc-300 text-xs sm:text-sm">
                  DineFlow Pro provides digital restaurant ordering, loyalty rewards, customer management, and marketing services. By accessing or using our QR table ordering, loyalty portal, or mobile website, you agree to be bound by these Terms & Conditions.
                </p>
              </section>

              {/* 2. Customer Account */}
              <section className="bg-zinc-900/60 border border-zinc-800/80 rounded-2xl p-5 space-y-2">
                <div className="flex items-center gap-2 text-amber-400 font-serif font-bold text-base">
                  <Users className="w-5 h-5 text-amber-400" />
                  <h3>2. Customer Account</h3>
                </div>
                <p className="text-zinc-300 text-xs sm:text-sm">
                  Customer provides information such as:
                </p>
                <ul className="list-disc list-inside text-xs sm:text-sm text-zinc-400 space-y-1 pl-2">
                  <li><strong className="text-zinc-200">Name</strong></li>
                  <li><strong className="text-zinc-200">Mobile Number</strong></li>
                  <li><strong className="text-zinc-200">Birthday</strong> (optional for special birthday offers)</li>
                  <li><strong className="text-zinc-200">Instagram ID</strong> (optional for social loyalty rewards)</li>
                </ul>
                <p className="text-zinc-300 text-xs sm:text-sm pt-1">
                  Customer is solely responsible for providing correct, accurate, and up-to-date information.
                </p>
              </section>

              {/* 3. Ordering Terms */}
              <section className="bg-zinc-900/60 border border-zinc-800/80 rounded-2xl p-5 space-y-2">
                <div className="flex items-center gap-2 text-amber-400 font-serif font-bold text-base">
                  <CheckCircle2 className="w-5 h-5 text-amber-400" />
                  <h3>3. Ordering Terms</h3>
                </div>
                <p className="text-zinc-300 text-xs sm:text-sm">
                  Customers can browse the interactive digital menu, place real-time table orders, customize dishes, and track order status directly on their mobile device.
                </p>
                <p className="text-zinc-300 text-xs sm:text-sm">
                  The restaurant reserves the right to update or modify:
                </p>
                <div className="grid grid-cols-3 gap-2 pt-1 text-center font-semibold text-xs">
                  <div className="bg-zinc-950 p-2 rounded-xl border border-zinc-800 text-amber-200">Menu Items</div>
                  <div className="bg-zinc-950 p-2 rounded-xl border border-zinc-800 text-amber-200">Prices</div>
                  <div className="bg-zinc-950 p-2 rounded-xl border border-zinc-800 text-amber-200">Availability</div>
                </div>
              </section>

              {/* 4. Loyalty Program Terms */}
              <section className="bg-zinc-900/60 border border-zinc-800/80 rounded-2xl p-5 space-y-2">
                <div className="flex items-center gap-2 text-amber-400 font-serif font-bold text-base">
                  <Gift className="w-5 h-5 text-amber-400" />
                  <h3>4. Loyalty Program Terms</h3>
                </div>
                <p className="text-zinc-300 text-xs sm:text-sm">
                  Customers can earn loyalty points through:
                </p>
                <ul className="list-disc list-inside text-xs sm:text-sm text-zinc-400 space-y-1 pl-2">
                  <li>Completed dining orders</li>
                  <li>Instagram activities (Story tags, Reels, and social check-ins)</li>
                  <li>Special promotional campaigns</li>
                </ul>
                <div className="p-3 bg-zinc-950 rounded-xl border border-zinc-800 mt-2 text-xs text-zinc-400 space-y-1">
                  <p><strong className="text-amber-300">Point Regulations:</strong></p>
                  <p>• Cannot be transferred to other customer accounts</p>
                  <p>• Cannot be exchanged for cash or currency</p>
                  <p>• May have expiry dates as announced by restaurant management</p>
                  <p>• Can only be redeemed according to available reward catalog items</p>
                </div>
              </section>

              {/* 5. Marketing & Promotional Communication */}
              <section className="bg-zinc-900/60 border border-zinc-800/80 rounded-2xl p-5 space-y-2">
                <div className="flex items-center gap-2 text-amber-400 font-serif font-bold text-base">
                  <Megaphone className="w-5 h-5 text-amber-400" />
                  <h3>5. Marketing & Promotional Communication</h3>
                </div>
                <p className="text-zinc-300 text-xs sm:text-sm">
                  By accepting these terms, customer agrees that the restaurant may send:
                </p>
                <div className="grid grid-cols-2 gap-2 text-xs text-amber-200 pt-1">
                  <div className="bg-zinc-950 p-2 rounded-xl border border-zinc-800">🏷️ Exclusive Offers & Coupons</div>
                  <div className="bg-zinc-950 p-2 rounded-xl border border-zinc-800">🍷 New Menu Updates</div>
                  <div className="bg-zinc-950 p-2 rounded-xl border border-zinc-800">🎉 Special Event Promotions</div>
                  <div className="bg-zinc-950 p-2 rounded-xl border border-zinc-800">⭐ Loyalty Points Alerts</div>
                </div>
                <p className="text-xs text-zinc-400 pt-1">
                  Communications may be sent through: <span className="text-amber-300 font-semibold">SMS, WhatsApp, Email, and App Notifications</span>. Customers can manage communication preferences at any time.
                </p>
              </section>

              {/* 6. Customer Data Usage */}
              <section className="bg-zinc-900/60 border border-zinc-800/80 rounded-2xl p-5 space-y-2">
                <div className="flex items-center gap-2 text-amber-400 font-serif font-bold text-base">
                  <Database className="w-5 h-5 text-amber-400" />
                  <h3>6. Customer Data Usage</h3>
                </div>
                <p className="text-zinc-300 text-xs sm:text-sm">
                  Restaurant may use customer information for:
                </p>
                <ul className="list-disc list-inside text-xs sm:text-sm text-zinc-400 space-y-1 pl-2">
                  <li>Personalized offers and tailored discounts</li>
                  <li>Customer experience improvement and taste preference mapping</li>
                  <li>Restaurant analytics and dining trend evaluation</li>
                  <li>Targeted marketing campaigns</li>
                  <li>Loyalty programs management</li>
                  <li>Restaurant service and operational improvement</li>
                </ul>
              </section>

              {/* 7. Third Party Services */}
              <section className="bg-zinc-900/60 border border-zinc-800/80 rounded-2xl p-5 space-y-2">
                <div className="flex items-center gap-2 text-amber-400 font-serif font-bold text-base">
                  <Server className="w-5 h-5 text-amber-400" />
                  <h3>7. Third Party Services</h3>
                </div>
                <p className="text-zinc-300 text-xs sm:text-sm">
                  Restaurant may use trusted external third-party services to deliver seamless experiences:
                </p>
                <div className="grid grid-cols-2 gap-2 text-xs pt-1">
                  <div className="bg-zinc-950 p-2.5 rounded-xl border border-zinc-800 text-zinc-300">
                    💳 <strong className="text-amber-300">Payment Gateways:</strong> Secure digital checkout & card processing
                  </div>
                  <div className="bg-zinc-950 p-2.5 rounded-xl border border-zinc-800 text-zinc-300">
                    🛵 <strong className="text-amber-300">Delivery Platforms:</strong> Zomato & Swiggy dispatch partner tools
                  </div>
                  <div className="bg-zinc-950 p-2.5 rounded-xl border border-zinc-800 text-zinc-300">
                    📊 <strong className="text-amber-300">Analytics Tools:</strong> Performance & guest satisfaction monitoring
                  </div>
                  <div className="bg-zinc-950 p-2.5 rounded-xl border border-zinc-800 text-zinc-300">
                    📣 <strong className="text-amber-300">Marketing Platforms:</strong> Automated SMS & messaging gateways
                  </div>
                </div>
              </section>

              {/* 8. Reviews & Feedback */}
              <section className="bg-zinc-900/60 border border-zinc-800/80 rounded-2xl p-5 space-y-2">
                <div className="flex items-center gap-2 text-amber-400 font-serif font-bold text-base">
                  <Star className="w-5 h-5 text-amber-400" />
                  <h3>8. Reviews & Feedback</h3>
                </div>
                <p className="text-zinc-300 text-xs sm:text-sm">
                  Customer reviews, dish ratings, and written feedback submitted through the platform may be displayed on the restaurant website and digital channels for promotional and quality assurance purposes.
                </p>
              </section>

              {/* 9. Account Termination */}
              <section className="bg-zinc-900/60 border border-zinc-800/80 rounded-2xl p-5 space-y-2">
                <div className="flex items-center gap-2 text-rose-400 font-serif font-bold text-base">
                  <AlertTriangle className="w-5 h-5 text-rose-400" />
                  <h3>9. Account Termination</h3>
                </div>
                <p className="text-zinc-300 text-xs sm:text-sm">
                  The restaurant reserves full authority to suspend or terminate accounts involved in:
                </p>
                <ul className="list-disc list-inside text-xs sm:text-sm text-zinc-400 space-y-1 pl-2">
                  <li>Fraudulent activity or fake orders</li>
                  <li>Abuse of loyalty point mechanisms or fake social submissions</li>
                  <li>Harassment or abuse of restaurant staff or platform services</li>
                </ul>
              </section>
            </div>
          ) : (
            /* PRIVACY POLICY CONTENT */
            <div className="space-y-6 animate-fade-in" id="privacy-content-section">
              <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl">
                <p className="text-xs text-emerald-300 font-medium">
                  Privacy Guarantee: We protect your guest information with bank-grade security standards and strict confidential handling protocols.
                </p>
              </div>

              {/* 1. Information We Collect */}
              <section className="bg-zinc-900/60 border border-zinc-800/80 rounded-2xl p-5 space-y-2">
                <div className="flex items-center gap-2 text-amber-400 font-serif font-bold text-base">
                  <Eye className="w-5 h-5 text-amber-400" />
                  <h3>1. Information We Collect</h3>
                </div>
                <p className="text-zinc-300 text-xs sm:text-sm">
                  We collect personal and transactional information essential to fulfill your restaurant experience:
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs pt-1">
                  <div className="bg-zinc-950 p-2 rounded-xl border border-zinc-800 text-amber-200 font-medium">• Name</div>
                  <div className="bg-zinc-950 p-2 rounded-xl border border-zinc-800 text-amber-200 font-medium">• Mobile Number</div>
                  <div className="bg-zinc-950 p-2 rounded-xl border border-zinc-800 text-amber-200 font-medium">• Birthday (Optional)</div>
                  <div className="bg-zinc-950 p-2 rounded-xl border border-zinc-800 text-amber-200 font-medium">• Instagram ID (Optional)</div>
                  <div className="bg-zinc-950 p-2 rounded-xl border border-zinc-800 text-amber-200 font-medium">• Order History</div>
                  <div className="bg-zinc-950 p-2 rounded-xl border border-zinc-800 text-amber-200 font-medium">• Transaction Data</div>
                  <div className="bg-zinc-950 p-2 rounded-xl border border-zinc-800 text-amber-200 font-medium">• Visit History</div>
                  <div className="bg-zinc-950 p-2 rounded-xl border border-zinc-800 text-amber-200 font-medium">• Feedback & Reviews</div>
                  <div className="bg-zinc-950 p-2 rounded-xl border border-zinc-800 text-amber-200 font-medium">• Loyalty Activity</div>
                </div>
              </section>

              {/* 2. How We Use Customer Data */}
              <section className="bg-zinc-900/60 border border-zinc-800/80 rounded-2xl p-5 space-y-2">
                <div className="flex items-center gap-2 text-amber-400 font-serif font-bold text-base">
                  <Database className="w-5 h-5 text-amber-400" />
                  <h3>2. How We Use Customer Data</h3>
                </div>
                <p className="text-zinc-300 text-xs sm:text-sm">
                  Customer data may be used for:
                </p>
                <ul className="list-disc list-inside text-xs sm:text-sm text-zinc-400 space-y-1 pl-2">
                  <li>Real-time order processing and kitchen workflow routing</li>
                  <li>Customer support and guest issue resolution</li>
                  <li>Personalized dish and beverage recommendations</li>
                  <li>Loyalty points accumulation and coupon reward management</li>
                  <li>Targeted marketing campaigns and special dining events</li>
                  <li>Restaurant analytics and menu performance optimization</li>
                </ul>
              </section>

              {/* 3. Marketing Data Usage Consent */}
              <section className="bg-gradient-to-r from-amber-500/15 via-zinc-900 to-amber-500/15 border border-amber-500/40 rounded-2xl p-5 space-y-3">
                <div className="flex items-center gap-2 text-amber-300 font-serif font-bold text-base">
                  <Megaphone className="w-5 h-5 text-amber-400" />
                  <h3>3. Marketing Data Usage Consent</h3>
                </div>
                <blockquote className="p-3 bg-zinc-950/80 border-l-4 border-amber-500 rounded-r-xl text-xs sm:text-sm text-amber-100 font-serif italic">
                  "By accepting this Privacy Policy, customers allow the restaurant to use their information for personalized marketing, offers, promotions and customer relationship management."
                </blockquote>
              </section>

              {/* 4. Data Sharing */}
              <section className="bg-zinc-900/60 border border-zinc-800/80 rounded-2xl p-5 space-y-2">
                <div className="flex items-center gap-2 text-amber-400 font-serif font-bold text-base">
                  <Users className="w-5 h-5 text-amber-400" />
                  <h3>4. Data Sharing</h3>
                </div>
                <p className="text-zinc-300 text-xs sm:text-sm font-semibold text-emerald-400">
                  ✔ Customer data is never sold to external data brokers.
                </p>
                <p className="text-zinc-300 text-xs sm:text-sm">
                  Data may only be shared with:
                </p>
                <ul className="list-disc list-inside text-xs sm:text-sm text-zinc-400 space-y-1 pl-2">
                  <li>Restaurant authorized staff and managers</li>
                  <li>Service providers required for core daily operations</li>
                  <li>Integrated payment gateway providers</li>
                  <li>Delivery partners (Zomato / Swiggy) when applicable</li>
                </ul>
              </section>

              {/* 5. Data Security */}
              <section className="bg-zinc-900/60 border border-zinc-800/80 rounded-2xl p-5 space-y-2">
                <div className="flex items-center gap-2 text-amber-400 font-serif font-bold text-base">
                  <Lock className="w-5 h-5 text-amber-400" />
                  <h3>5. Data Security</h3>
                </div>
                <p className="text-zinc-300 text-xs sm:text-sm">
                  We enforce technical safeguards to preserve guest data integrity:
                </p>
                <div className="grid grid-cols-2 gap-2 text-xs pt-1">
                  <div className="bg-zinc-950 p-2.5 rounded-xl border border-zinc-800 text-amber-200 font-medium">
                    🔒 Secure OTP Authentication
                  </div>
                  <div className="bg-zinc-950 p-2.5 rounded-xl border border-zinc-800 text-amber-200 font-medium">
                    🔐 Encrypted Cloud Storage
                  </div>
                  <div className="bg-zinc-950 p-2.5 rounded-xl border border-zinc-800 text-amber-200 font-medium">
                    🛡️ Strict Access Control
                  </div>
                  <div className="bg-zinc-950 p-2.5 rounded-xl border border-zinc-800 text-amber-200 font-medium">
                    🔑 Role-Based Permissions
                  </div>
                </div>
              </section>

              {/* 6. Customer Rights */}
              <section className="bg-zinc-900/60 border border-zinc-800/80 rounded-2xl p-5 space-y-2">
                <div className="flex items-center gap-2 text-amber-400 font-serif font-bold text-base">
                  <CheckCircle2 className="w-5 h-5 text-amber-400" />
                  <h3>6. Customer Rights</h3>
                </div>
                <p className="text-zinc-300 text-xs sm:text-sm">
                  Customers can at any time request to:
                </p>
                <div className="grid grid-cols-2 gap-2 text-xs text-zinc-300 pt-1">
                  <div className="bg-zinc-950 p-2 rounded-xl border border-zinc-800">• View their saved personal data</div>
                  <div className="bg-zinc-950 p-2 rounded-xl border border-zinc-800">• Update profile information</div>
                  <div className="bg-zinc-950 p-2 rounded-xl border border-zinc-800">• Delete customer account & data</div>
                  <div className="bg-zinc-950 p-2 rounded-xl border border-zinc-800">• Opt out of marketing messages</div>
                </div>
              </section>

              {/* 7. Cookies & Tracking */}
              <section className="bg-zinc-900/60 border border-zinc-800/80 rounded-2xl p-5 space-y-2">
                <div className="flex items-center gap-2 text-amber-400 font-serif font-bold text-base">
                  <Bell className="w-5 h-5 text-amber-400" />
                  <h3>7. Cookies & Tracking</h3>
                </div>
                <p className="text-zinc-300 text-xs sm:text-sm">
                  We utilize cookies, local storage, and session state technology for:
                </p>
                <ul className="list-disc list-inside text-xs sm:text-sm text-zinc-400 space-y-1 pl-2">
                  <li>Website and table ordering analytics</li>
                  <li>Performance monitoring and page loading optimization</li>
                  <li>User experience and layout preference persistence</li>
                </ul>
              </section>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="pt-4 border-t border-zinc-800 mt-4 flex items-center justify-between">
          <span className="text-[11px] text-zinc-500 font-mono">
            DineFlow Pro Compliance Engine v2.4
          </span>
          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-xs transition-all shadow-md"
            id="close-terms-bottom-btn"
          >
            Close Viewer
          </button>
        </div>
      </div>
    </div>
  );
};
