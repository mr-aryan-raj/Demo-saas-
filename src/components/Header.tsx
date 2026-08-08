import React from 'react';
import { ShoppingBag, Utensils, LayoutDashboard, QrCode, User, Flame, Clock } from 'lucide-react';
import { RestaurantInfo, Table, Customer } from '../types';

interface HeaderProps {
  restaurant: RestaurantInfo;
  currentTable: Table | null;
  activeView: 'menu' | 'kitchen' | 'admin' | 'tracker' | 'customer_login' | 'admin_login' | 'kitchen_login';
  setActiveView: (view: 'menu' | 'kitchen' | 'admin' | 'tracker' | 'customer_login' | 'admin_login' | 'kitchen_login') => void;
  activeCustomerTab?: 'menu' | 'offers' | 'loyalty' | 'reviews' | 'about' | 'gallery' | 'contact';
  setActiveCustomerTab?: (tab: 'menu' | 'offers' | 'loyalty' | 'reviews' | 'about' | 'gallery' | 'contact') => void;
  cartCount: number;
  setIsCartOpen: (open: boolean) => void;
  setIsTableSelectorOpen: (open: boolean) => void;
  setIsAuthOpen: (open: boolean) => void;
  setIsProfileOpen: (open: boolean) => void;
  customer: Customer | null;
  hasActiveOrder: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  restaurant,
  currentTable,
  activeView,
  setActiveView,
  activeCustomerTab = 'menu',
  setActiveCustomerTab,
  cartCount,
  setIsCartOpen,
  setIsTableSelectorOpen,
  setIsAuthOpen,
  setIsProfileOpen,
  customer,
  hasActiveOrder,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-zinc-950/95 backdrop-blur-md border-b border-amber-500/20 transition-all shadow-2xl">
      {/* Top Header Row */}
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-2">
        {/* Left: Brand & Table Badge */}
        <div className="flex items-center gap-3">
          <div 
            onClick={() => setActiveView('menu')}
            className="flex items-center gap-2 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl overflow-hidden border border-amber-500/40 p-0.5 bg-zinc-900 shadow-md group-hover:border-amber-400 transition-colors">
              <img 
                src={restaurant.logo} 
                alt={restaurant.name} 
                className="w-full h-full object-cover rounded-lg"
                referrerPolicy="no-referrer"
              />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-serif text-lg font-bold text-amber-100 tracking-wide">
                  DineFlow
                </span>
                <span className="text-[10px] uppercase tracking-wider px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-400 border border-amber-500/30 font-semibold">
                  PRO
                </span>
              </div>
              <p className="text-xs text-zinc-400 hidden sm:block">
                {restaurant.tagline}
              </p>
            </div>
          </div>

          {/* Table Badge Indicator */}
          <button
            onClick={() => setIsTableSelectorOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-900 border border-amber-500/30 text-amber-300 hover:border-amber-400 hover:bg-zinc-800 transition-all text-xs font-medium shadow-sm"
            title="Click to switch simulated table"
          >
            <QrCode className="w-3.5 h-3.5 text-amber-400" />
            <span>Table {currentTable ? `#${currentTable.tableNumber}` : '#05'}</span>
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          </button>
        </div>

        {/* Center: System Role Switcher */}
        <nav className="hidden lg:flex items-center bg-zinc-900/90 p-1 rounded-xl border border-zinc-800 text-xs">
          <button
            onClick={() => setActiveView('menu')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all font-medium ${
              activeView === 'menu'
                ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-zinc-950 font-semibold shadow-md'
                : 'text-zinc-300 hover:text-amber-300 hover:bg-zinc-800/60'
            }`}
          >
            <Utensils className="w-3.5 h-3.5" />
            <span>Customer Website</span>
          </button>

          {hasActiveOrder && (
            <button
              onClick={() => setActiveView('tracker')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all font-medium relative ${
                activeView === 'tracker'
                  ? 'bg-amber-500 text-zinc-950 font-semibold shadow-md'
                  : 'text-amber-400 hover:bg-amber-500/10'
              }`}
            >
              <Clock className="w-3.5 h-3.5 text-amber-400 animate-spin" style={{ animationDuration: '3s' }} />
              <span>Live Tracker</span>
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping absolute -top-0.5 -right-0.5" />
            </button>
          )}

          <button
            onClick={() => setActiveView('kitchen')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all font-medium ${
              activeView === 'kitchen'
                ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-zinc-950 font-semibold shadow-md'
                : 'text-zinc-300 hover:text-amber-300 hover:bg-zinc-800/60'
            }`}
          >
            <Flame className="w-3.5 h-3.5 text-orange-400" />
            <span>Kitchen KDS</span>
          </button>

          <button
            onClick={() => setActiveView('admin')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all font-medium ${
              activeView === 'admin'
                ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-zinc-950 font-semibold shadow-md'
                : 'text-zinc-300 hover:text-amber-300 hover:bg-zinc-800/60'
            }`}
          >
            <LayoutDashboard className="w-3.5 h-3.5" />
            <span>Admin Portal</span>
          </button>
        </nav>

        {/* Right: Customer Profile & Cart Button */}
        <div className="flex items-center gap-2">
          {customer ? (
            <button
              onClick={() => setIsProfileOpen(true)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-zinc-900 border border-amber-500/30 hover:border-amber-400 text-amber-200 text-xs font-medium transition-all shadow-sm"
            >
              <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-amber-500 to-amber-300 text-zinc-950 flex items-center justify-center font-bold text-xs">
                {customer.name.charAt(0)}
              </div>
              <span className="hidden sm:inline font-semibold max-w-[100px] truncate">{customer.name}</span>
              <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-amber-500/20 text-amber-400 font-mono">
                {customer.loyaltyPoints}pts
              </span>
            </button>
          ) : (
            <button
              onClick={() => setIsAuthOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-500/20 to-amber-600/20 border border-amber-500/40 text-amber-300 hover:bg-amber-500/30 text-xs font-semibold transition-all shadow-sm"
            >
              <User className="w-3.5 h-3.5" />
              <span>Login / 15% OFF</span>
            </button>
          )}

          {/* Cart Button */}
          {activeView === 'menu' && (
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative flex items-center gap-2 px-3.5 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-zinc-950 font-bold text-xs shadow-lg shadow-amber-500/20 transition-all transform hover:scale-105 active:scale-95"
            >
              <ShoppingBag className="w-4 h-4" />
              <span className="hidden sm:inline">Cart</span>
              {cartCount > 0 && (
                <span className="w-5 h-5 rounded-full bg-zinc-950 text-amber-400 font-extrabold text-[11px] flex items-center justify-center border border-amber-400/50">
                  {cartCount}
                </span>
              )}
            </button>
          )}
        </div>
      </div>

      {/* Customer Navigation Bar (Home, Menu, Offers, Loyalty, Reviews, About Us, Gallery, Contact) */}
      {activeView === 'menu' && setActiveCustomerTab && (
        <div className="border-t border-zinc-900 bg-zinc-950/80 px-4 py-1.5 overflow-x-auto custom-scrollbar">
          <div className="max-w-7xl mx-auto flex items-center justify-start sm:justify-center gap-1 sm:gap-2 text-xs font-medium min-w-max">
            {[
              { id: 'menu' as const, label: 'Home / Menu' },
              { id: 'offers' as const, label: 'Offers' },
              { id: 'loyalty' as const, label: 'Loyalty Rewards' },
              { id: 'reviews' as const, label: 'Reviews' },
              { id: 'about' as const, label: 'About Us' },
              { id: 'gallery' as const, label: 'Gallery' },
              { id: 'contact' as const, label: 'Contact' },
            ].map((navItem) => (
              <button
                key={navItem.id}
                onClick={() => setActiveCustomerTab(navItem.id)}
                className={`px-3 py-1 rounded-lg transition-all text-xs font-semibold ${
                  activeCustomerTab === navItem.id
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-sm'
                    : 'text-zinc-400 hover:text-amber-200 hover:bg-zinc-900'
                }`}
              >
                {navItem.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </header>
  );
};
