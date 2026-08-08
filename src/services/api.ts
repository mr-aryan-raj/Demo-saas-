import { AdminStats, Customer, InstagramCampaign, MenuItem, Order, OrderStatus, RestaurantInfo, Table, StaffAccount, LoyaltyReward, CustomerReview, ZomatoSwiggyConfig, RestaurantAbout } from '../types';

const BASE_URL = '/api';

export const apiClient = {
  // Restaurant Info
  async getRestaurantInfo(): Promise<RestaurantInfo> {
    const res = await fetch(`${BASE_URL}/restaurant`);
    return res.json();
  },

  // Menu Items
  async getMenuItems(): Promise<MenuItem[]> {
    const res = await fetch(`${BASE_URL}/menu`);
    return res.json();
  },

  async addMenuItem(item: Partial<MenuItem>): Promise<MenuItem> {
    const res = await fetch(`${BASE_URL}/menu`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(item),
    });
    return res.json();
  },

  async updateMenuItem(id: string, item: Partial<MenuItem>): Promise<MenuItem> {
    const res = await fetch(`${BASE_URL}/menu/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(item),
    });
    return res.json();
  },

  async deleteMenuItem(id: string): Promise<{ success: boolean }> {
    const res = await fetch(`${BASE_URL}/menu/${id}`, {
      method: 'DELETE',
    });
    return res.json();
  },

  // Tables
  async getTables(): Promise<Table[]> {
    const res = await fetch(`${BASE_URL}/tables`);
    return res.json();
  },

  async createTable(tableNumber: string, seats: number): Promise<Table> {
    const res = await fetch(`${BASE_URL}/tables`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ tableNumber, seats }),
    });
    return res.json();
  },

  async updateTable(id: string, data: { status?: Table['status']; seats?: number }): Promise<Table> {
    const res = await fetch(`${BASE_URL}/tables/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return res.json();
  },

  async deleteTable(id: string): Promise<{ success: boolean }> {
    const res = await fetch(`${BASE_URL}/tables/${id}`, {
      method: 'DELETE',
    });
    return res.json();
  },

  // Customer Auth & Profiles
  async loginCustomer(data: {
    mobile: string;
    name?: string;
    birthday?: string;
    instagramId?: string;
    termsAccepted?: boolean;
    privacyAccepted?: boolean;
    marketingConsent?: boolean;
    ipAddress?: string;
    deviceInformation?: string;
  }): Promise<Customer> {
    const res = await fetch(`${BASE_URL}/customers/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return res.json();
  },

  async adminLogin(data: { email: string; password: string; twoFactorCode?: string }): Promise<any> {
    const res = await fetch(`${BASE_URL}/auth/admin-login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Admin login failed');
    }
    return res.json();
  },

  async kitchenLogin(data: { kitchenId: string; password: string }): Promise<any> {
    const res = await fetch(`${BASE_URL}/auth/kitchen-login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Kitchen login failed');
    }
    return res.json();
  },

  async saveCookiePreferences(data: any): Promise<any> {
    const res = await fetch(`${BASE_URL}/cookie-preferences`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return res.json();
  },

  async getConsentStats(): Promise<any> {
    const res = await fetch(`${BASE_URL}/admin/consent-stats`);
    return res.json();
  },

  async exportConsentRecords(): Promise<void> {
    window.open(`${BASE_URL}/admin/export-consent-records`, '_blank');
  },

  async getCustomers(): Promise<Customer[]> {
    const res = await fetch(`${BASE_URL}/customers`);
    return res.json();
  },

  async getCustomerById(id: string): Promise<Customer> {
    const res = await fetch(`${BASE_URL}/customers/${id}`);
    return res.json();
  },

  // Staff & Multi-Role Auth
  async loginKitchenStaff(data: { employeeId?: string; password?: string; phone?: string; otp?: string }): Promise<{ user: StaffAccount; token: string }> {
    const res = await fetch(`${BASE_URL}/auth/kitchen-login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Kitchen login failed');
    }
    return res.json();
  },

  async loginAdminStaff(data: { email: string; password?: string; twoFactorCode?: string }): Promise<{ user: any; token: string }> {
    const res = await fetch(`${BASE_URL}/auth/admin-login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Admin login failed');
    }
    return res.json();
  },

  async getStaffAccounts(): Promise<StaffAccount[]> {
    const res = await fetch(`${BASE_URL}/staff`);
    return res.json();
  },

  async createStaffAccount(data: { name: string; phone: string; employeeId: string; role: string; permissions?: string[] }): Promise<StaffAccount> {
    const res = await fetch(`${BASE_URL}/staff`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Failed to create staff account');
    }
    return res.json();
  },

  async deleteStaffAccount(id: string): Promise<{ success: boolean }> {
    const res = await fetch(`${BASE_URL}/staff/${id}`, {
      method: 'DELETE',
    });
    return res.json();
  },

  // Loyalty Rewards
  async getLoyaltyRewards(): Promise<LoyaltyReward[]> {
    const res = await fetch(`${BASE_URL}/loyalty/rewards`);
    return res.json();
  },

  async redeemLoyaltyReward(customerId: string, rewardId: string): Promise<{ success: boolean; message: string; code: string; customer: Customer }> {
    const res = await fetch(`${BASE_URL}/loyalty/redeem`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ customerId, rewardId }),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Reward redemption failed');
    }
    return res.json();
  },

  // Orders
  async getOrders(): Promise<Order[]> {
    const res = await fetch(`${BASE_URL}/orders`);
    return res.json();
  },

  async createOrder(orderData: Partial<Order>): Promise<Order> {
    const res = await fetch(`${BASE_URL}/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(orderData),
    });
    return res.json();
  },

  async updateOrderStatus(id: string, status: OrderStatus): Promise<Order> {
    const res = await fetch(`${BASE_URL}/orders/${id}/status`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
    return res.json();
  },

  // Instagram Loyalty
  async submitInstagramPost(data: {
    customerId: string;
    customerName: string;
    instagramId: string;
    postType: 'story' | 'reel' | 'streak' | 'tag';
    postUrl: string;
  }): Promise<InstagramCampaign> {
    const res = await fetch(`${BASE_URL}/loyalty/instagram`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return res.json();
  },

  async getInstagramCampaigns(): Promise<InstagramCampaign[]> {
    const res = await fetch(`${BASE_URL}/loyalty/instagram`);
    return res.json();
  },

  async updateInstagramCampaignStatus(id: string, status: 'approved' | 'rejected'): Promise<InstagramCampaign> {
    const res = await fetch(`${BASE_URL}/loyalty/instagram/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
    return res.json();
  },

  // Offer Generation
  async createOffer(data: {
    customerId: string;
    offerType: string;
    discountPercent: number;
    description: string;
  }) {
    const res = await fetch(`${BASE_URL}/offers/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return res.json();
  },

  // Admin Stats
  async getAdminStats(): Promise<AdminStats> {
    const res = await fetch(`${BASE_URL}/admin/stats`);
    return res.json();
  },

  // Customer Reviews & Feedback
  async getReviews(): Promise<CustomerReview[]> {
    const res = await fetch(`${BASE_URL}/reviews`);
    return res.json();
  },

  async submitReview(data: Partial<CustomerReview>): Promise<CustomerReview> {
    const res = await fetch(`${BASE_URL}/reviews`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Failed to submit review');
    }
    return res.json();
  },

  async replyToReview(id: string, reply: string): Promise<CustomerReview> {
    const res = await fetch(`${BASE_URL}/reviews/${id}/reply`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ reply }),
    });
    return res.json();
  },

  async toggleFeatureReview(id: string): Promise<CustomerReview> {
    const res = await fetch(`${BASE_URL}/reviews/${id}/feature`, {
      method: 'PATCH',
    });
    return res.json();
  },

  async toggleHideReview(id: string): Promise<CustomerReview> {
    const res = await fetch(`${BASE_URL}/reviews/${id}/hide`, {
      method: 'PATCH',
    });
    return res.json();
  },

  // Delivery Integrations (Zomato & Swiggy)
  async getDeliveryConfig(): Promise<ZomatoSwiggyConfig> {
    const res = await fetch(`${BASE_URL}/integrations/delivery`);
    return res.json();
  },

  async updateDeliveryConfig(data: Partial<ZomatoSwiggyConfig>): Promise<ZomatoSwiggyConfig> {
    const res = await fetch(`${BASE_URL}/integrations/delivery`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return res.json();
  },

  async simulateDeliveryOrder(source: 'zomato' | 'swiggy', customerName?: string, totalAmount?: number): Promise<Order> {
    const res = await fetch(`${BASE_URL}/integrations/delivery/order`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ source, customerName, totalAmount }),
    });
    return res.json();
  },

  // Restaurant About Us & Brand
  async getRestaurantAbout(): Promise<RestaurantAbout> {
    const res = await fetch(`${BASE_URL}/restaurant/about`);
    return res.json();
  },

  async updateRestaurantAbout(data: Partial<RestaurantAbout>): Promise<RestaurantAbout> {
    const res = await fetch(`${BASE_URL}/restaurant/about`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return res.json();
  },

  // SSE Subscription for live order updates
  subscribeToLiveEvents(onMessage: (event: { type: string; data: any }) => void) {
    const eventSource = new EventSource('/api/events');

    eventSource.addEventListener('new_order', (e) => {
      onMessage({ type: 'new_order', data: JSON.parse(e.data) });
    });

    eventSource.addEventListener('order_status_updated', (e) => {
      onMessage({ type: 'order_status_updated', data: JSON.parse(e.data) });
    });

    eventSource.addEventListener('tables_updated', (e) => {
      onMessage({ type: 'tables_updated', data: JSON.parse(e.data) });
    });

    return () => {
      eventSource.close();
    };
  }
};
