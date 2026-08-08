import React, { useState, useEffect } from 'react';
import { Customer, LoyaltyReward } from '../types';
import { X, Award, Gift, Instagram, History, Send, CheckCircle, Sparkles, Tag, Clock } from 'lucide-react';
import { apiClient } from '../services/api';

interface CustomerProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  customer: Customer;
  onCustomerUpdated: (updated: Customer) => void;
}

export const CustomerProfileModal: React.FC<CustomerProfileModalProps> = ({
  isOpen,
  onClose,
  customer,
  onCustomerUpdated,
}) => {
  const [activeTab, setActiveTab] = useState<'wallet' | 'redeem' | 'offers' | 'instagram' | 'history'>('wallet');
  const [postType, setPostType] = useState<'story' | 'reel' | 'streak'>('story');
  const [postUrl, setPostUrl] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submittedSuccess, setSubmittedSuccess] = useState(false);

  const [rewardsCatalog, setRewardsCatalog] = useState<LoyaltyReward[]>([]);
  const [redeemingId, setRedeemingId] = useState<string | null>(null);
  const [redemptionNotice, setRedemptionNotice] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      apiClient.getLoyaltyRewards().then(setRewardsCatalog).catch(console.error);
    }
  }, [isOpen]);

  if (!isOpen || !customer) return null;

  const handleRedeemReward = async (reward: LoyaltyReward) => {
    if (customer.loyaltyPoints < reward.costPoints) return;
    setRedeemingId(reward.id);
    try {
      const res = await apiClient.redeemLoyaltyReward(customer.id, reward.id);
      if (res.customer) {
        onCustomerUpdated(res.customer);
      }
      setRedemptionNotice(`🎉 Redeemed "${reward.title}"! Code: ${res.code}. Added to your active offers.`);
      setTimeout(() => setRedemptionNotice(null), 6000);
    } catch (err: any) {
      alert(err.message || 'Failed to redeem reward');
    } finally {
      setRedeemingId(null);
    }
  };

  const handleInstagramSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!postUrl.trim()) return;
    setSubmitting(true);
    try {
      await apiClient.submitInstagramPost({
        customerId: customer.id,
        customerName: customer.name,
        instagramId: customer.instagramId || '@guest',
        postType,
        postUrl,
      });
      setSubmittedSuccess(true);
      setTimeout(() => setSubmittedSuccess(false), 4000);
      setPostUrl('');
    } catch (err) {
      console.error('Error submitting Instagram campaign:', err);
    } finally {
      setSubmitting(false);
    }
  };

  // Next reward calculation
  const nextTargetPoints = customer.loyaltyPoints < 500 ? 500 : customer.loyaltyPoints < 700 ? 700 : 1000;
  const pointsRemaining = Math.max(0, nextTargetPoints - customer.loyaltyPoints);
  const nextRewardName = nextTargetPoints === 500 ? '$10 Coupon' : nextTargetPoints === 700 ? 'Free Dessert' : '20% Off Coupon';
  const progressPercent = Math.min(100, Math.round((customer.loyaltyPoints / nextTargetPoints) * 100));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-2xl bg-zinc-950 border border-amber-500/30 rounded-3xl p-6 sm:p-8 text-zinc-100 shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
        {/* Ambient Glow */}
        <div className="absolute -top-24 -right-24 w-56 h-56 bg-amber-500/15 rounded-full blur-3xl pointer-events-none" />

        {/* Header Greeting */}
        <div className="flex items-center justify-between border-b border-zinc-800 pb-4 mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 to-amber-300 text-zinc-950 font-black text-xl flex items-center justify-center shadow-md">
              {customer.name.charAt(0)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-serif text-xl font-bold text-amber-100">Welcome Back, {customer.name} 👋</h3>
              </div>
              <p className="text-xs text-zinc-400 font-mono">{customer.mobile} • {customer.instagramId || '@guest'}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-zinc-900 text-zinc-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Loyalty Wallet Summary Card */}
        <div className="bg-gradient-to-r from-zinc-900 via-amber-950/40 to-zinc-900 border border-amber-500/40 rounded-2xl p-4 sm:p-5 mb-4 relative overflow-hidden">
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="text-[10px] uppercase font-extrabold tracking-widest text-amber-400 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                YOUR LOYALTY WALLET
              </p>
              <h2 className="text-3xl font-serif font-black text-amber-200 mt-1">
                ⭐ {customer.loyaltyPoints} <span className="text-sm font-sans text-amber-400/80">Points Available</span>
              </h2>
            </div>
            <div className="p-3 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/30 shadow-inner">
              <Award className="w-8 h-8" />
            </div>
          </div>

          {/* Next Reward Progress Bar */}
          <div className="bg-zinc-950/80 p-3 rounded-xl border border-zinc-800/80 text-xs">
            <div className="flex items-center justify-between mb-1.5 font-medium">
              <span className="text-amber-300">Next Reward Progress</span>
              <span className="text-zinc-400 font-mono">
                {pointsRemaining > 0 ? `${pointsRemaining} pts remaining for ${nextRewardName}` : `🎉 Unlocked ${nextRewardName}!`}
              </span>
            </div>
            <div className="w-full h-2.5 bg-zinc-800 rounded-full overflow-hidden p-0.5 border border-zinc-700/50">
              <div 
                className="h-full bg-gradient-to-r from-amber-500 to-amber-300 rounded-full transition-all duration-500 shadow-sm"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-1 bg-zinc-900 p-1 rounded-xl border border-zinc-800 mb-4 text-xs overflow-x-auto">
          <button
            onClick={() => setActiveTab('wallet')}
            className={`flex-1 py-2 px-3 rounded-lg font-semibold transition-all flex items-center justify-center gap-1.5 whitespace-nowrap ${
              activeTab === 'wallet' ? 'bg-amber-500 text-zinc-950 shadow-md' : 'text-zinc-400 hover:text-white'
            }`}
          >
            <Award className="w-3.5 h-3.5" />
            <span>Overview</span>
          </button>
          <button
            onClick={() => setActiveTab('redeem')}
            className={`flex-1 py-2 px-3 rounded-lg font-semibold transition-all flex items-center justify-center gap-1.5 whitespace-nowrap ${
              activeTab === 'redeem' ? 'bg-amber-500 text-zinc-950 shadow-md' : 'text-zinc-400 hover:text-white'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Redeem Rewards</span>
          </button>
          <button
            onClick={() => setActiveTab('offers')}
            className={`flex-1 py-2 px-3 rounded-lg font-semibold transition-all flex items-center justify-center gap-1.5 whitespace-nowrap ${
              activeTab === 'offers' ? 'bg-amber-500 text-zinc-950 shadow-md' : 'text-zinc-400 hover:text-white'
            }`}
          >
            <Gift className="w-3.5 h-3.5" />
            <span>Coupons ({customer.offers.filter(o => !o.isUsed).length})</span>
          </button>
          <button
            onClick={() => setActiveTab('instagram')}
            className={`flex-1 py-2 px-3 rounded-lg font-semibold transition-all flex items-center justify-center gap-1.5 whitespace-nowrap ${
              activeTab === 'instagram' ? 'bg-amber-500 text-zinc-950 shadow-md' : 'text-zinc-400 hover:text-white'
            }`}
          >
            <Instagram className="w-3.5 h-3.5 text-pink-400" />
            <span>Earn Bonus</span>
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`flex-1 py-2 px-3 rounded-lg font-semibold transition-all flex items-center justify-center gap-1.5 whitespace-nowrap ${
              activeTab === 'history' ? 'bg-amber-500 text-zinc-950 shadow-md' : 'text-zinc-400 hover:text-white'
            }`}
          >
            <History className="w-3.5 h-3.5" />
            <span>History</span>
          </button>
        </div>

        {/* Banner Alert for Redemption */}
        {redemptionNotice && (
          <div className="mb-4 p-3 bg-amber-500/20 border border-amber-500/50 rounded-xl text-xs text-amber-200 flex items-center gap-2 animate-bounce">
            <CheckCircle className="w-4 h-4 text-amber-400 flex-shrink-0" />
            <span>{redemptionNotice}</span>
          </div>
        )}

        {/* Tab Contents */}
        <div className="flex-1 overflow-y-auto pr-1">
          {/* OVERVIEW TAB */}
          {activeTab === 'wallet' && (
            <div className="space-y-4">
              {/* Quick Stats Grid */}
              <div className="grid grid-cols-3 gap-3">
                <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-3 text-center">
                  <p className="text-[10px] uppercase font-bold text-zinc-400">Total Visits</p>
                  <p className="text-xl font-bold text-amber-200 mt-1">{customer.visitsCount}</p>
                </div>
                <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-3 text-center">
                  <p className="text-[10px] uppercase font-bold text-zinc-400">Total Spent</p>
                  <p className="text-xl font-bold text-amber-200 mt-1">${customer.totalSpending.toFixed(2)}</p>
                </div>
                <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-3 text-center">
                  <p className="text-[10px] uppercase font-bold text-zinc-400">Avg / Order</p>
                  <p className="text-xl font-bold text-amber-200 mt-1">
                    ${customer.visitsCount > 0 ? (customer.totalSpending / customer.visitsCount).toFixed(2) : '0.00'}
                  </p>
                </div>
              </div>

              {/* Earn Points Banner */}
              <div className="bg-zinc-900/90 border border-zinc-800 rounded-2xl p-4 flex items-center justify-between gap-3">
                <div>
                  <h4 className="font-bold text-sm text-amber-100">How to Earn Points</h4>
                  <p className="text-xs text-zinc-400 mt-0.5">
                    • Place QR orders (+50 pts per order)<br />
                    • Post IG Story (+15 pts) or Reel (+30 pts)<br />
                    • Welcome bonus on signup (+100 pts)
                  </p>
                </div>
                <button
                  onClick={() => setActiveTab('redeem')}
                  className="px-4 py-2 rounded-xl bg-amber-500 text-zinc-950 font-bold text-xs hover:bg-amber-400 transition-all shadow-md whitespace-nowrap"
                >
                  Redeem Rewards →
                </button>
              </div>
            </div>
          )}

          {/* REDEEM REWARDS CATALOG TAB */}
          {activeTab === 'redeem' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between mb-1">
                <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-wider">
                  Available Loyalty Rewards Catalog
                </h4>
                <span className="text-xs font-mono font-bold text-amber-400">
                  Balance: ⭐ {customer.loyaltyPoints} PTS
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {rewardsCatalog.map((reward) => {
                  const canAfford = customer.loyaltyPoints >= reward.costPoints;
                  return (
                    <div
                      key={reward.id}
                      className={`border rounded-2xl p-4 flex flex-col justify-between transition-all ${
                        canAfford
                          ? 'bg-gradient-to-b from-zinc-900 to-amber-950/30 border-amber-500/40 hover:border-amber-400 shadow-md'
                          : 'bg-zinc-900/40 border-zinc-800 opacity-70'
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400 font-mono font-bold border border-amber-500/30">
                            ⭐ {reward.costPoints} PTS
                          </span>
                          <Gift className="w-4 h-4 text-amber-400" />
                        </div>
                        <h5 className="font-bold text-sm text-amber-100">{reward.title}</h5>
                        <p className="text-xs text-zinc-400 mt-1 line-clamp-2">{reward.description}</p>
                      </div>

                      <div className="mt-4 pt-2 border-t border-zinc-800/80 flex items-center justify-between gap-2">
                        <span className="text-[11px] text-zinc-500">
                          {canAfford ? 'Ready to claim' : `Need ${reward.costPoints - customer.loyaltyPoints} more pts`}
                        </span>
                        <button
                          onClick={() => handleRedeemReward(reward)}
                          disabled={!canAfford || redeemingId === reward.id}
                          className={`px-3 py-1.5 rounded-xl font-bold text-xs transition-all flex items-center gap-1 ${
                            canAfford
                              ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-zinc-950 hover:from-amber-400 hover:to-amber-500 shadow-md cursor-pointer'
                              : 'bg-zinc-800 text-zinc-500 cursor-not-allowed'
                          }`}
                        >
                          <Sparkles className="w-3.5 h-3.5" />
                          <span>{redeemingId === reward.id ? 'Redeeming...' : 'REDEEM NOW'}</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* OFFERS & COUPONS TAB */}
          {activeTab === 'offers' && (
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-wider">
                Smart Coupons & Active Discount Wallet
              </h4>
              {customer.offers.length === 0 ? (
                <div className="text-center py-8 bg-zinc-900/50 rounded-2xl border border-zinc-800 text-zinc-500 text-xs">
                  No active offers. Place an order or redeem loyalty points to unlock coupons!
                </div>
              ) : (
                customer.offers.map((offer) => (
                  <div
                    key={offer.id}
                    className={`border rounded-2xl p-4 flex items-center justify-between gap-3 ${
                      offer.isUsed
                        ? 'bg-zinc-900/40 border-zinc-800 opacity-60'
                        : 'bg-gradient-to-r from-zinc-900 to-amber-950/20 border-amber-500/40'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-3 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-400">
                        <Tag className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h5 className="font-bold text-sm text-amber-100">{offer.title}</h5>
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400 font-mono font-bold">
                            {offer.code}
                          </span>
                        </div>
                        <p className="text-xs text-zinc-400 mt-0.5">{offer.description}</p>
                        <p className="text-[10px] text-zinc-500 mt-1">Expires: {offer.expiresAt}</p>
                      </div>
                    </div>

                    <div className="text-right flex-shrink-0">
                      <span className="text-lg font-black text-amber-400">{offer.discountPercent}% OFF</span>
                      <p className="text-[10px] text-zinc-400 mt-1">
                        {offer.isUsed ? 'USED' : 'AUTO-APPLIES AT CHECKOUT'}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* INSTAGRAM REWARDS TAB */}
          {activeTab === 'instagram' && (
            <div className="space-y-4">
              <div className="bg-gradient-to-r from-pink-900/20 via-purple-900/20 to-amber-900/20 border border-pink-500/30 rounded-2xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Instagram className="w-5 h-5 text-pink-400" />
                  <h4 className="font-serif font-bold text-amber-100">Instagram Reward Engine</h4>
                </div>
                <p className="text-xs text-zinc-300">
                  Post your dining experience on Instagram, tag <span className="text-pink-400 font-semibold">@dineflowluxe</span>, and submit the link below to get instant bonus loyalty points!
                </p>
                <div className="grid grid-cols-3 gap-2 mt-3 text-center text-xs">
                  <div className="bg-zinc-900/80 p-2 rounded-xl border border-zinc-800">
                    <p className="font-bold text-pink-400">+15 PTS</p>
                    <p className="text-[10px] text-zinc-400">IG Story</p>
                  </div>
                  <div className="bg-zinc-900/80 p-2 rounded-xl border border-zinc-800">
                    <p className="font-bold text-pink-400">+30 PTS</p>
                    <p className="text-[10px] text-zinc-400">IG Reel</p>
                  </div>
                  <div className="bg-zinc-900/80 p-2 rounded-xl border border-zinc-800">
                    <p className="font-bold text-pink-400">+80 PTS</p>
                    <p className="text-[10px] text-zinc-400">IG Streak</p>
                  </div>
                </div>
              </div>

              {submittedSuccess && (
                <div className="p-3 bg-emerald-500/20 border border-emerald-500/40 rounded-xl text-xs text-emerald-300 flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-400" />
                  <span>Submission received! Restaurant manager will verify and award your points.</span>
                </div>
              )}

              <form onSubmit={handleInstagramSubmit} className="space-y-3 bg-zinc-900 border border-zinc-800 p-4 rounded-2xl">
                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1">Post Type</label>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setPostType('story')}
                      className={`flex-1 py-1.5 rounded-lg text-xs font-semibold border ${
                        postType === 'story' ? 'bg-pink-500/20 border-pink-500 text-pink-300' : 'bg-zinc-800 border-zinc-700 text-zinc-400'
                      }`}
                    >
                      Story (+15)
                    </button>
                    <button
                      type="button"
                      onClick={() => setPostType('reel')}
                      className={`flex-1 py-1.5 rounded-lg text-xs font-semibold border ${
                        postType === 'reel' ? 'bg-pink-500/20 border-pink-500 text-pink-300' : 'bg-zinc-800 border-zinc-700 text-zinc-400'
                      }`}
                    >
                      Reel (+30)
                    </button>
                    <button
                      type="button"
                      onClick={() => setPostType('streak')}
                      className={`flex-1 py-1.5 rounded-lg text-xs font-semibold border ${
                        postType === 'streak' ? 'bg-pink-500/20 border-pink-500 text-pink-300' : 'bg-zinc-800 border-zinc-700 text-zinc-400'
                      }`}
                    >
                      Streak (+80)
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1">Instagram Post / Story Link</label>
                  <input
                    type="url"
                    value={postUrl}
                    onChange={(e) => setPostUrl(e.target.value)}
                    placeholder="https://instagram.com/stories/..."
                    required
                    className="w-full bg-zinc-950 border border-zinc-800 focus:border-pink-500 rounded-xl p-2.5 text-xs text-white placeholder-zinc-600 focus:outline-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-2.5 rounded-xl bg-gradient-to-r from-pink-500 to-purple-600 text-white font-bold text-xs shadow-md hover:from-pink-400 hover:to-purple-500 transition-all flex items-center justify-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{submitting ? 'Submitting...' : 'Submit Post Link'}</span>
                </button>
              </form>
            </div>
          )}

          {/* HISTORY TAB */}
          {activeTab === 'history' && (
            <div className="space-y-4">
              {/* Points Earned & Redeemed Log */}
              <div>
                <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">
                  Points Activity Log
                </h4>
                <div className="space-y-2">
                  <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-3 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-emerald-400" />
                      <div>
                        <p className="font-bold text-zinc-200">Completed Order Reward</p>
                        <p className="text-[10px] text-zinc-500">Order #105 • Table 05</p>
                      </div>
                    </div>
                    <span className="font-mono font-bold text-emerald-400">+50 PTS</span>
                  </div>

                  <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-3 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-pink-400" />
                      <div>
                        <p className="font-bold text-zinc-200">Instagram Story Verified</p>
                        <p className="text-[10px] text-zinc-500">@dineflowluxe tag</p>
                      </div>
                    </div>
                    <span className="font-mono font-bold text-emerald-400">+15 PTS</span>
                  </div>

                  <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-3 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-amber-400" />
                      <div>
                        <p className="font-bold text-zinc-200">Welcome Signup Bonus</p>
                        <p className="text-[10px] text-zinc-500">Initial login reward</p>
                      </div>
                    </div>
                    <span className="font-mono font-bold text-emerald-400">+100 PTS</span>
                  </div>

                  {customer.rewardHistory?.map((red) => (
                    <div key={red.id} className="bg-zinc-900 border border-zinc-800 rounded-xl p-3 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-rose-400" />
                        <div>
                          <p className="font-bold text-zinc-200">Redeemed: {red.rewardTitle}</p>
                          <p className="text-[10px] text-zinc-500">Code: {red.code} • {red.date}</p>
                        </div>
                      </div>
                      <span className="font-mono font-bold text-rose-400">-{red.pointsSpent} PTS</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Visit History */}
              <div>
                <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">
                  Visit & Dining History ({customer.visitHistory.length} Visits)
                </h4>
                {customer.visitHistory.length === 0 ? (
                  <div className="text-center py-6 bg-zinc-900/50 rounded-2xl border border-zinc-800 text-zinc-500 text-xs">
                    No prior visits recorded.
                  </div>
                ) : (
                  <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                    {customer.visitHistory.map((visit) => (
                      <div
                        key={visit.id}
                        className="bg-zinc-900 border border-zinc-800 rounded-xl p-3 flex items-center justify-between text-xs"
                      >
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-amber-200">{visit.category} Dining</span>
                            <span className="text-[10px] px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-400 font-mono">
                              {visit.orderId}
                            </span>
                          </div>
                          <p className="text-[11px] text-zinc-400 mt-0.5">
                            Date: {visit.date} ({visit.month})
                          </p>
                        </div>
                        <span className="font-mono font-bold text-amber-400 text-sm">
                          ${visit.spending.toFixed(2)}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
