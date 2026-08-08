/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from 'react';
import {
  AdminStats,
  CartItem,
  Customer,
  InstagramCampaign,
  MenuItem,
  Order,
  OrderStatus,
  RestaurantInfo,
  Table,
  CustomerReview,
  ZomatoSwiggyConfig,
  RestaurantAbout,
  User,
  CookiePreference,
} from './types';
import { apiClient } from './services/api';
import { Header } from './components/Header';
import { DigitalMenu } from './components/DigitalMenu';
import { WelcomeDiscountModal } from './components/WelcomeDiscountModal';
import { CustomerAuthModal } from './components/CustomerAuthModal';
import { CustomerProfileModal } from './components/CustomerProfileModal';
import { ItemCustomizationModal } from './components/ItemCustomizationModal';
import { CartDrawer } from './components/CartDrawer';
import { OrderTracker } from './components/OrderTracker';
import { KitchenDisplay } from './components/KitchenDisplay';
import { AdminDashboard } from './components/AdminDashboard';
import { TableSelectorModal } from './components/TableSelectorModal';
import { ReviewModal } from './components/ReviewModal';
import { ReviewsSection } from './components/ReviewsSection';
import { AboutUsSection } from './components/AboutUsSection';
import { CookieConsentBanner } from './components/CookieConsentBanner';
import { CookieSettingsModal } from './components/CookieSettingsModal';
import { CustomerLoginPage } from './components/CustomerLoginPage';
import { AdminLoginPage } from './components/AdminLoginPage';
import { KitchenLoginPage } from './components/KitchenLoginPage';
import { TermsAndPrivacyModal } from './components/TermsAndPrivacyModal';

// Helper function to deduplicate array by item id
function deduplicateById<T extends { id: string }>(items: T[]): T[] {
  const seen = new Set<string>();
  return items.filter((item) => {
    if (!item.id || seen.has(item.id)) return false;
    seen.add(item.id);
    return true;
  });
}

export default function App() {
  const [restaurant, setRestaurant] = useState<RestaurantInfo | null>(null);
  const [tables, setTables] = useState<Table[]>([]);
  const [currentTable, setCurrentTable] = useState<Table | null>(null);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [instagramCampaigns, setInstagramCampaigns] = useState<InstagramCampaign[]>([]);
  const [adminStats, setAdminStats] = useState<AdminStats | null>(null);
  const [reviews, setReviews] = useState<CustomerReview[]>([]);
  const [deliveryConfig, setDeliveryConfig] = useState<ZomatoSwiggyConfig>({
    zomatoRestaurantId: 'ZOM-99482-DELHI',
    swiggyRestaurantId: 'SWIG-33821-DELHI',
    zomatoCommissionPct: 18,
    swiggyCommissionPct: 20,
    zomatoConnected: true,
    swiggyConnected: true,
  });
  const [restaurantAbout, setRestaurantAbout] = useState<RestaurantAbout | null>(null);

  // Active view
  const [activeView, setActiveView] = useState<'menu' | 'kitchen' | 'admin' | 'tracker' | 'customer_login' | 'admin_login' | 'kitchen_login'>('menu');
  const [activeCustomerTab, setActiveCustomerTab] = useState<'menu' | 'offers' | 'loyalty' | 'reviews' | 'about' | 'gallery' | 'contact'>('menu');

  // Multi-Role Auth Sessions
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [adminUser, setAdminUser] = useState<User | null>(null);
  const [kitchenUser, setKitchenUser] = useState<User | null>(null);

  // Cart
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Modals state
  const [isWelcomeModalOpen, setIsWelcomeModalOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isTableSelectorOpen, setIsTableSelectorOpen] = useState(false);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [isCookieModalOpen, setIsCookieModalOpen] = useState(false);
  const [isLegalModalOpen, setIsLegalModalOpen] = useState(false);
  const [legalModalTab, setLegalModalTab] = useState<'terms' | 'privacy'>('terms');
  const [customizingItem, setCustomizingItem] = useState<MenuItem | null>(null);

  // Active Order for live tracking
  const [activeOrder, setActiveOrder] = useState<Order | null>(null);

  // Initial Data Fetching
  const loadInitialData = async () => {
    try {
      const [restRes, tablesRes, menuRes, custRes, ordersRes, igRes, statsRes, reviewsRes, delivRes, aboutRes] =
        await Promise.all([
          apiClient.getRestaurantInfo(),
          apiClient.getTables(),
          apiClient.getMenuItems(),
          apiClient.getCustomers(),
          apiClient.getOrders(),
          apiClient.getInstagramCampaigns(),
          apiClient.getAdminStats(),
          apiClient.getReviews(),
          apiClient.getDeliveryConfig(),
          apiClient.getRestaurantAbout(),
        ]);

      setRestaurant(restRes);
      setTables(tablesRes);
      setMenuItems(menuRes);
      setCustomers(custRes);
      setOrders(deduplicateById(ordersRes));
      setInstagramCampaigns(igRes);
      setAdminStats(statsRes);
      setReviews(deduplicateById(reviewsRes));
      setDeliveryConfig(delivRes);
      setRestaurantAbout(aboutRes);

      // Default table detection (Table #05 or first table)
      const defaultTable = tablesRes.find((t) => t.tableNumber === '05') || tablesRes[0] || null;
      setCurrentTable(defaultTable);

      // Default active customer (Rahul Verma for seamless demo test)
      if (custRes.length > 0) {
        setCustomer(custRes[0]);
      }

      // Check for active order for current table
      const tableOrder = ordersRes.find((o) => o.tableNumber === defaultTable?.tableNumber && o.status !== 'completed');
      if (tableOrder) {
        setActiveOrder(tableOrder);
      }
    } catch (err) {
      console.error('Error fetching initial app state:', err);
    }
  };

  useEffect(() => {
    loadInitialData();

    // Show welcome discount modal on first load
    const timer = setTimeout(() => {
      setIsWelcomeModalOpen(true);
    }, 800);

    // Subscribe to SSE real-time events
    const unsubscribe = apiClient.subscribeToLiveEvents((evt) => {
      if (evt.type === 'new_order') {
        const newOrd = evt.data as Order;
        setOrders((prev) => deduplicateById([newOrd, ...prev]));
        if (currentTable && newOrd.tableNumber === currentTable.tableNumber) {
          setActiveOrder(newOrd);
        }
      } else if (evt.type === 'order_status_updated') {
        const updatedOrd = evt.data as Order;
        setOrders((prev) => prev.map((o) => (o.id === updatedOrd.id ? updatedOrd : o)));
        if (activeOrder && activeOrder.id === updatedOrd.id) {
          setActiveOrder(updatedOrd);
        }
      } else if (evt.type === 'tables_updated') {
        setTables(evt.data);
      }
    });

    return () => {
      clearTimeout(timer);
      unsubscribe();
    };
  }, []);

  // Cart operations
  const handleAddToCart = (
    item: MenuItem,
    quantity: number,
    customizations: CartItem['customizations'],
    unitPrice: number
  ) => {
    const newItemId = `${item.id}-${Date.now()}`;
    const newCartItem: CartItem = {
      id: newItemId,
      menuItem: item,
      quantity,
      customizations,
      unitPrice,
      totalPrice: unitPrice * quantity,
    };

    setCartItems((prev) => [...prev, newCartItem]);
    setIsCartOpen(true);
  };

  const handleQuickAdd = (item: MenuItem) => {
    handleAddToCart(item, 1, [], item.price);
  };

  const handleUpdateCartQuantity = (cartItemId: string, newQty: number) => {
    if (newQty <= 0) {
      handleRemoveCartItem(cartItemId);
      return;
    }
    setCartItems((prev) =>
      prev.map((i) => (i.id === cartItemId ? { ...i, quantity: newQty, totalPrice: i.unitPrice * newQty } : i))
    );
  };

  const handleRemoveCartItem = (cartItemId: string) => {
    setCartItems((prev) => prev.filter((i) => i.id !== cartItemId));
  };

  // Order Placement
  const handlePlaceOrder = async (notes: string, discountAmount: number, discountName: string) => {
    const formattedItems = cartItems.map((ci) => ({
      menuItemId: ci.menuItem.id,
      name: ci.menuItem.name,
      quantity: ci.quantity,
      unitPrice: ci.unitPrice,
      customizationsText: ci.customizations
        .map((c) => `${c.groupName}: ${c.selectedOptions.map((o) => o.name).join(', ')}`)
        .join(' | '),
      totalItemPrice: ci.totalPrice,
    }));

    const subtotal = cartItems.reduce((sum, i) => sum + i.totalPrice, 0);
    const tax = (subtotal - discountAmount) * 0.08;
    const totalAmount = subtotal - discountAmount + tax;

    const newOrder = await apiClient.createOrder({
      tableNumber: currentTable ? currentTable.tableNumber : '05',
      customerId: customer ? customer.id : undefined,
      customerName: customer ? customer.name : 'Guest Customer',
      customerMobile: customer ? customer.mobile : '',
      items: formattedItems,
      subtotal,
      discount: discountAmount,
      discountName,
      tax,
      totalAmount,
      notes,
    });

    setActiveOrder(newOrder);
    setCartItems([]);
    setActiveView('tracker');
    loadInitialData(); // Refresh CRM stats & orders
  };

  const handleUpdateOrderStatus = async (orderId: string, status: OrderStatus) => {
    await apiClient.updateOrderStatus(orderId, status);
    loadInitialData();
  };

  if (!restaurant) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center text-amber-300 font-serif text-lg">
        Loading DineFlow Pro Platform...
      </div>
    );
  }

  const totalCartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 font-sans selection:bg-amber-500 selection:text-zinc-950">
      {/* Header */}
      <Header
        restaurant={restaurant}
        currentTable={currentTable}
        activeView={activeView}
        setActiveView={setActiveView}
        activeCustomerTab={activeCustomerTab}
        setActiveCustomerTab={setActiveCustomerTab}
        cartCount={totalCartCount}
        setIsCartOpen={setIsCartOpen}
        setIsTableSelectorOpen={setIsTableSelectorOpen}
        setIsAuthOpen={setIsAuthOpen}
        setIsProfileOpen={setIsProfileOpen}
        customer={customer}
        hasActiveOrder={activeOrder !== null}
      />

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 py-6">
        {activeView === 'menu' && (
          <>
            {(activeCustomerTab === 'menu' || activeCustomerTab === 'offers') && (
              <DigitalMenu
                menuItems={menuItems}
                onOpenCustomization={(item) => setCustomizingItem(item)}
                onQuickAdd={handleQuickAdd}
                currentTableNumber={currentTable ? currentTable.tableNumber : '05'}
                cartItems={cartItems}
                orders={orders}
              />
            )}

            {activeCustomerTab === 'reviews' && (
              <ReviewsSection
                reviews={reviews}
                onRequestWriteReview={() => setIsReviewModalOpen(true)}
              />
            )}

            {(activeCustomerTab === 'about' || activeCustomerTab === 'gallery' || activeCustomerTab === 'contact') && restaurantAbout && (
              <AboutUsSection
                about={restaurantAbout}
                onRequestReservation={() => setIsCartOpen(true)}
              />
            )}

            {activeCustomerTab === 'loyalty' && customer && (
              <div className="max-w-xl mx-auto text-center py-10 space-y-4">
                <div className="bg-zinc-900 border border-amber-500/30 rounded-3xl p-8 shadow-2xl space-y-4">
                  <h2 className="font-serif text-3xl font-bold text-amber-100">Your Loyalty Rewards Wallet</h2>
                  <div className="p-6 bg-amber-500/10 border border-amber-500/30 rounded-2xl">
                    <span className="font-serif text-5xl font-extrabold text-amber-300">{customer.loyaltyPoints}</span>
                    <span className="text-xs text-amber-400 font-mono block mt-1">Total Verified Stars Earned</span>
                  </div>
                  <p className="text-xs text-zinc-300">Earn 50 Points on every completed review and 10% cashback points on every meal!</p>
                  <button
                    onClick={() => setIsProfileOpen(true)}
                    className="px-6 py-3 bg-amber-500 text-zinc-950 font-bold text-xs rounded-xl shadow-lg"
                  >
                    View Full Customer Profile & History
                  </button>
                </div>
              </div>
            )}
          </>
        )}

        {activeView === 'customer_login' && (
          <CustomerLoginPage
            restaurant={restaurant}
            onLoginSuccess={(cust) => {
              setCustomer(cust);
              setActiveView('menu');
              loadInitialData();
            }}
            onContinueAsGuest={() => setActiveView('menu')}
          />
        )}

        {activeView === 'admin_login' && (
          <AdminLoginPage
            onAdminLoginSuccess={(usr) => {
              setAdminUser(usr);
              setActiveView('admin');
            }}
            onCancel={() => setActiveView('menu')}
          />
        )}

        {activeView === 'kitchen_login' && (
          <KitchenLoginPage
            onKitchenLoginSuccess={(usr) => {
              setKitchenUser(usr);
              setActiveView('kitchen');
            }}
            onCancel={() => setActiveView('menu')}
          />
        )}

        {activeView === 'tracker' && (
          <OrderTracker
            order={activeOrder}
            onBackToMenu={() => setActiveView('menu')}
            onOpenReviewModal={() => setIsReviewModalOpen(true)}
          />
        )}

        {activeView === 'kitchen' && (
          !kitchenUser ? (
            <KitchenLoginPage
              onKitchenLoginSuccess={(usr) => {
                setKitchenUser(usr);
                setActiveView('kitchen');
              }}
              onCancel={() => setActiveView('menu')}
            />
          ) : (
            <div className="space-y-4">
              <div className="bg-zinc-900 border border-orange-500/30 p-3 rounded-2xl flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-zinc-300 font-semibold">Kitchen Station Active:</span>
                  <span className="text-orange-400 font-mono font-bold">{kitchenUser.name} ({kitchenUser.kitchenId})</span>
                  <span className="px-2 py-0.5 rounded bg-zinc-800 text-zinc-400 text-[10px]">RBAC Restricted View</span>
                </div>
                <button
                  onClick={() => setKitchenUser(null)}
                  className="px-3 py-1 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-lg font-semibold"
                >
                  Sign Out Station
                </button>
              </div>
              <KitchenDisplay
                orders={orders}
                onUpdateOrderStatus={handleUpdateOrderStatus}
              />
            </div>
          )
        )}

        {activeView === 'admin' && (
          !adminUser ? (
            <AdminLoginPage
              onAdminLoginSuccess={(usr) => {
                setAdminUser(usr);
                setActiveView('admin');
              }}
              onCancel={() => setActiveView('menu')}
            />
          ) : (
            <div className="space-y-4">
              <div className="bg-zinc-900 border border-amber-500/30 p-3 rounded-2xl flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-zinc-300 font-semibold">Administrator Authenticated:</span>
                  <span className="text-amber-400 font-mono font-bold">{adminUser.name} ({adminUser.email})</span>
                  <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 text-[10px]">Full Access (RBAC)</span>
                </div>
                <button
                  onClick={() => setAdminUser(null)}
                  className="px-3 py-1 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-lg font-semibold"
                >
                  Sign Out Admin
                </button>
              </div>
              <AdminDashboard
                stats={adminStats}
                tables={tables}
                customers={customers}
                orders={orders}
                instagramCampaigns={instagramCampaigns}
                reviews={reviews}
                deliveryConfig={deliveryConfig}
                about={restaurantAbout || {
                  id: 'rest-about-01',
                  ourStory: 'Authentic woodfired cuisine since 2015.',
                  chefName: 'Chef Marco Rossi',
                  chefTitle: 'Executive Culinary Director',
                  chefBio: 'Master of woodfired pizza and handcrafted pasta.',
                  chefImage: 'https://images.unsplash.com/photo-1577219491135-ce391730fb2c?auto=format&fit=crop&w=800&q=80',
                  mission: 'Deliver artisanal taste.',
                  vision: 'Pioneer dining technology.',
                  galleryImages: [],
                  awards: [],
                  contactPhone: '+1 (555) 234-5678',
                  address: '742 Evergreen Terrace',
                  googleMapsDirectionsUrl: 'https://maps.google.com',
                  instagramUrl: 'https://instagram.com',
                  openingHours: [],
                  sinceYear: 2015,
                }}
                menuItems={menuItems}
                onRefreshData={loadInitialData}
                onReviewUpdated={(upRev) => {
                  setReviews((prev) => prev.map((r) => (r.id === upRev.id ? upRev : r)));
                }}
                onConfigUpdated={(cfg) => setDeliveryConfig(cfg)}
                onAboutUpdated={(abt) => setRestaurantAbout(abt)}
                onOrderAdded={(ord) => setOrders((prev) => deduplicateById([ord, ...prev]))}
                onMenuItemsUpdated={(items) => setMenuItems(items)}
              />
            </div>
          )
        )}
      </main>

      {/* Footer Navigation for Direct Logins & Policy Links */}
      <footer className="border-t border-zinc-900 bg-zinc-950 py-8 px-4 mt-12 text-zinc-400 text-xs">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-serif text-sm font-bold text-amber-200">{restaurant.name}</span>
            <span>•</span>
            <span className="text-zinc-500">DineFlow Pro Multi-Role Dining & Consent Platform</span>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 text-xs">
            <button
              onClick={() => setActiveView('customer_login')}
              className="text-amber-400 hover:underline font-semibold"
            >
              Customer Portal (/login)
            </button>
            <span>•</span>
            <button
              onClick={() => setActiveView('kitchen_login')}
              className="text-orange-400 hover:underline font-semibold"
            >
              Kitchen Portal (/kitchen/login)
            </button>
            <span>•</span>
            <button
              onClick={() => setActiveView('admin_login')}
              className="text-amber-300 hover:underline font-semibold"
            >
              Admin Portal (/admin/login)
            </button>
            <span>•</span>
            <button
              onClick={() => {
                setLegalModalTab('terms');
                setIsLegalModalOpen(true);
              }}
              className="hover:text-amber-300 transition-colors"
            >
              Terms & Conditions
            </button>
            <span>•</span>
            <button
              onClick={() => {
                setLegalModalTab('privacy');
                setIsLegalModalOpen(true);
              }}
              className="hover:text-amber-300 transition-colors"
            >
              Privacy Policy
            </button>
            <span>•</span>
            <button
              onClick={() => setIsCookieModalOpen(true)}
              className="hover:text-amber-300 transition-colors"
            >
              Cookie Preferences
            </button>
          </div>
        </div>
      </footer>

      {/* Cookie Consent System */}
      <CookieConsentBanner
        onOpenSettings={() => setIsCookieModalOpen(true)}
        onSavePreferences={(prefs) => apiClient.saveCookiePreferences(prefs)}
      />

      <CookieSettingsModal
        isOpen={isCookieModalOpen}
        onClose={() => setIsCookieModalOpen(false)}
        onSavePreferences={(prefs) => apiClient.saveCookiePreferences(prefs)}
      />

      <TermsAndPrivacyModal
        isOpen={isLegalModalOpen}
        onClose={() => setIsLegalModalOpen(false)}
        initialTab={legalModalTab}
      />

      {/* Modals & Drawers */}
      <WelcomeDiscountModal
        isOpen={isWelcomeModalOpen}
        restaurant={restaurant}
        table={currentTable}
        onOrderWithoutLogin={() => setIsWelcomeModalOpen(false)}
        onLoginAndGetDiscount={() => {
          setIsWelcomeModalOpen(false);
          setIsAuthOpen(true);
        }}
      />

      <CustomerAuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onSuccess={(cust) => {
          setCustomer(cust);
          loadInitialData();
        }}
      />

      {customer && (
        <CustomerProfileModal
          isOpen={isProfileOpen}
          onClose={() => setIsProfileOpen(false)}
          customer={customer}
          onCustomerUpdated={(updated) => setCustomer(updated)}
        />
      )}

      <TableSelectorModal
        isOpen={isTableSelectorOpen}
        onClose={() => setIsTableSelectorOpen(false)}
        tables={tables}
        currentTable={currentTable}
        onSelectTable={(table) => {
          setCurrentTable(table);
          // Check if table has active order
          const ord = orders.find((o) => o.tableNumber === table.tableNumber && o.status !== 'completed');
          setActiveOrder(ord || null);
        }}
      />

      {/* Review Modal */}
      <ReviewModal
        isOpen={isReviewModalOpen}
        onClose={() => setIsReviewModalOpen(false)}
        order={activeOrder || orders[0] || null}
        customer={customer}
        onReviewSubmitted={(newRev) => {
          setReviews((prev) => deduplicateById([newRev, ...prev]));
          if (customer) {
            setCustomer({
              ...customer,
              loyaltyPoints: customer.loyaltyPoints + 50,
            });
          }
          loadInitialData();
        }}
      />

      <ItemCustomizationModal
        isOpen={customizingItem !== null}
        onClose={() => setCustomizingItem(null)}
        item={customizingItem}
        onAddToCart={handleAddToCart}
      />

      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        onUpdateQuantity={handleUpdateCartQuantity}
        onRemoveItem={handleRemoveCartItem}
        table={currentTable}
        customer={customer}
        onPlaceOrder={handlePlaceOrder}
        onOpenAuth={() => {
          setIsCartOpen(false);
          setIsAuthOpen(true);
        }}
      />
    </div>
  );
}
