import express, { Request, Response } from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import {
  initialCustomers,
  initialInstagramCampaigns,
  initialMenuItems,
  initialOrders,
  initialRestaurantInfo,
  initialTables,
  initialStaffAccounts,
  initialLoyaltyRewards,
  initialCustomerReviews,
  initialZomatoSwiggyConfig,
  initialRestaurantAbout,
} from './src/data/mockData.js';
import {
  AdminStats,
  Customer,
  InstagramCampaign,
  MenuItem,
  Order,
  OrderStatus,
  RestaurantInfo,
  Table,
  StaffAccount,
  LoyaltyReward,
  RewardRedemption,
  CustomerReview,
  ZomatoSwiggyConfig,
  RestaurantAbout,
} from './src/types.js';

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // In-Memory Database Store
  let restaurant: RestaurantInfo = { ...initialRestaurantInfo };
  let tables: Table[] = [...initialTables];
  let menuItems: MenuItem[] = [...initialMenuItems];
  let customers: Customer[] = [...initialCustomers];
  let orders: Order[] = [...initialOrders];
  let instagramCampaigns: InstagramCampaign[] = [...initialInstagramCampaigns];
  let staffAccounts: StaffAccount[] = [...initialStaffAccounts];
  let loyaltyRewards: LoyaltyReward[] = [...initialLoyaltyRewards];
  let reviews: CustomerReview[] = [...initialCustomerReviews];
  let deliveryConfig: ZomatoSwiggyConfig = { ...initialZomatoSwiggyConfig };
  let restaurantAbout: RestaurantAbout = { ...initialRestaurantAbout };

  // SSE (Server-Sent Events) clients registry for live KDS & order tracking
  const sseClients: { id: string; res: Response }[] = [];

  function broadcastEvent(eventType: string, data: any) {
    const payload = `event: ${eventType}\ndata: ${JSON.stringify(data)}\n\n`;
    sseClients.forEach((client) => {
      try {
        client.res.write(payload);
      } catch (err) {
        console.error('Error sending SSE to client:', err);
      }
    });
  }

  // Real-time Event Stream (SSE)
  app.get('/api/events', (req: Request, res: Response) => {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.flushHeaders();

    const clientId = Date.now().toString();
    sseClients.push({ id: clientId, res });

    // Send initial connected ping
    res.write(`event: connected\ndata: ${JSON.stringify({ status: 'connected', clientId })}\n\n`);

    req.on('close', () => {
      const index = sseClients.findIndex((c) => c.id === clientId);
      if (index !== -1) {
        sseClients.splice(index, 1);
      }
    });
  });

  // REST API Endpoints

  // 1. Restaurant Info
  app.get('/api/restaurant', (req: Request, res: Response) => {
    res.json(restaurant);
  });

  // 2. Menu Items
  app.get('/api/menu', (req: Request, res: Response) => {
    res.json(menuItems);
  });

  app.post('/api/menu', (req: Request, res: Response) => {
    const newItem: MenuItem = {
      ...req.body,
      id: req.body.id || `item-${Date.now()}`,
    };
    menuItems.unshift(newItem);
    res.status(201).json(newItem);
  });

  app.put('/api/menu/:id', (req: Request, res: Response) => {
    const { id } = req.params;
    const itemIndex = menuItems.findIndex((m) => m.id === id);
    if (itemIndex === -1) {
      res.status(404).json({ error: 'Menu item not found' });
      return;
    }
    menuItems[itemIndex] = {
      ...menuItems[itemIndex],
      ...req.body,
    };
    res.json(menuItems[itemIndex]);
  });

  app.delete('/api/menu/:id', (req: Request, res: Response) => {
    const { id } = req.params;
    menuItems = menuItems.filter((m) => m.id !== id);
    res.json({ success: true });
  });

  // 3. Tables
  app.get('/api/tables', (req: Request, res: Response) => {
    res.json(tables);
  });

  app.post('/api/tables', (req: Request, res: Response) => {
    const { tableNumber, seats } = req.body;
    const existing = tables.find((t) => t.tableNumber === tableNumber);
    if (existing) {
      res.status(400).json({ error: `Table ${tableNumber} already exists` });
      return;
    }
    const newTable: Table = {
      id: `t-${Date.now()}`,
      tableNumber,
      seats: seats || 4,
      status: 'available',
    };
    tables.push(newTable);
    broadcastEvent('tables_updated', tables);
    res.status(201).json(newTable);
  });

  app.put('/api/tables/:id', (req: Request, res: Response) => {
    const { id } = req.params;
    const { status, seats } = req.body;
    const tableIndex = tables.findIndex((t) => t.id === id || t.tableNumber === id);
    if (tableIndex === -1) {
      res.status(404).json({ error: 'Table not found' });
      return;
    }
    if (status) tables[tableIndex].status = status;
    if (seats) tables[tableIndex].seats = seats;

    broadcastEvent('tables_updated', tables);
    res.json(tables[tableIndex]);
  });

  app.delete('/api/tables/:id', (req: Request, res: Response) => {
    const { id } = req.params;
    tables = tables.filter((t) => t.id !== id && t.tableNumber !== id);
    broadcastEvent('tables_updated', tables);
    res.json({ success: true });
  });

  // 4. Customer Login & Auth with Consent Record
  app.post('/api/customers/login', (req: Request, res: Response) => {
    const {
      mobile,
      name,
      birthday,
      instagramId,
      termsAccepted,
      privacyAccepted,
      marketingConsent,
      ipAddress,
      deviceInformation,
    } = req.body;

    if (!mobile) {
      res.status(400).json({ error: 'Mobile number is required' });
      return;
    }

    let customer = customers.find((c) => c.mobile === mobile);
    const clientIp = ipAddress || (req.headers['x-forwarded-for'] as string) || req.ip || '192.168.1.100';
    const clientDevice = deviceInformation || (req.headers['user-agent'] as string) || 'Mobile Web App';

    if (!customer) {
      // Create new customer with 15% Welcome Offer and Consent
      const newCustId = `c-${Date.now()}`;
      customer = {
        id: newCustId,
        name: name || 'Valued Guest',
        mobile,
        birthday: birthday || '',
        instagramId: instagramId || '',
        totalOrders: 0,
        totalSpending: 0,
        visitsCount: 1,
        lastVisitDate: new Date().toISOString().split('T')[0],
        loyaltyPoints: 100, // 100 welcome bonus points
        offers: [
          {
            id: `off-welcome-${Date.now()}`,
            title: '15% Welcome Discount Activated',
            discountPercent: 15,
            offerType: 'welcome',
            code: 'WELCOME15',
            description: '15% discount on your first QR order',
            expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            isUsed: false,
          },
        ],
        visitHistory: [],
        consent: {
          id: `con-${Date.now()}`,
          customerId: newCustId,
          termsAccepted: termsAccepted !== undefined ? Boolean(termsAccepted) : true,
          privacyAccepted: privacyAccepted !== undefined ? Boolean(privacyAccepted) : true,
          marketingConsent: marketingConsent !== undefined ? Boolean(marketingConsent) : true,
          acceptedDate: new Date().toISOString(),
          ipAddress: clientIp,
          deviceInformation: clientDevice,
        }
      };
      customers.push(customer);
    } else {
      // Existing customer login
      if (name) customer.name = name;
      if (birthday) customer.birthday = birthday;
      if (instagramId) customer.instagramId = instagramId;
      customer.lastVisitDate = new Date().toISOString().split('T')[0];

      // Update or create consent record if passed
      if (termsAccepted !== undefined || privacyAccepted !== undefined) {
        customer.consent = {
          id: customer.consent?.id || `con-${Date.now()}`,
          customerId: customer.id,
          termsAccepted: termsAccepted !== undefined ? Boolean(termsAccepted) : (customer.consent?.termsAccepted ?? true),
          privacyAccepted: privacyAccepted !== undefined ? Boolean(privacyAccepted) : (customer.consent?.privacyAccepted ?? true),
          marketingConsent: marketingConsent !== undefined ? Boolean(marketingConsent) : (customer.consent?.marketingConsent ?? true),
          acceptedDate: new Date().toISOString(),
          ipAddress: clientIp,
          deviceInformation: clientDevice,
        };
      }
    }

    res.json(customer);
  });

  // Admin Portal Login Route (RBAC)
  app.post('/api/auth/admin-login', (req: Request, res: Response) => {
    const { email, password } = req.body;
    if (email === 'admin@dineflow.com' && (password === 'admin123' || password === 'admin')) {
      res.json({
        id: 'u-admin-01',
        name: 'Chief Executive Admin',
        email: 'admin@dineflow.com',
        role: 'admin',
        token: `token-admin-${Date.now()}`
      });
    } else {
      res.status(401).json({ error: 'Invalid admin credentials. Use admin@dineflow.com / admin123' });
    }
  });

  // Kitchen Staff Login Route (RBAC)
  app.post('/api/auth/kitchen-login', (req: Request, res: Response) => {
    const { kitchenId, password } = req.body;
    if ((kitchenId === 'KITCHEN-01' || kitchenId === 'kitchen') && (password === 'kitchen123' || password === 'kitchen')) {
      res.json({
        id: 'u-kitchen-01',
        name: 'Head Chef Station #1',
        kitchenId: 'KITCHEN-01',
        role: 'kitchen_staff',
        token: `token-kitchen-${Date.now()}`
      });
    } else {
      res.status(401).json({ error: 'Invalid kitchen station credentials. Use KITCHEN-01 / kitchen123' });
    }
  });

  // Cookie Preference Management API
  let cookiePreferencesStore: any[] = [];
  app.post('/api/cookie-preferences', (req: Request, res: Response) => {
    const pref = {
      ...req.body,
      id: `pref-${Date.now()}`,
      updatedDate: new Date().toISOString()
    };
    cookiePreferencesStore.push(pref);
    res.json({ success: true, preference: pref });
  });

  // Admin Consent Management Stats
  app.get('/api/admin/consent-stats', (req: Request, res: Response) => {
    const totalRegistered = customers.length;
    const marketingConsentCount = customers.filter(c => c.consent?.marketingConsent).length;
    const privacyAcceptedUsers = customers.filter(c => c.consent?.privacyAccepted !== false).length;
    const termsAcceptedUsers = customers.filter(c => c.consent?.termsAccepted !== false).length;

    res.json({
      totalRegisteredCustomers: totalRegistered,
      marketingConsentCount,
      privacyAcceptedUsers,
      termsAcceptedUsers,
      communicationPermissionStatus: {
        sms: marketingConsentCount,
        whatsapp: marketingConsentCount,
        email: marketingConsentCount,
        appNotifications: marketingConsentCount,
      }
    });
  });

  // Export Customer Consent Records CSV
  app.get('/api/admin/export-consent-records', (req: Request, res: Response) => {
    const headers = [
      'Consent Record ID',
      'Customer ID',
      'Customer Name',
      'Mobile Number',
      'Instagram ID',
      'Terms & Conditions Accepted',
      'Privacy Policy Accepted',
      'Marketing Communication Consent',
      'Accepted Date & Time',
      'IP Address',
      'Device Information',
    ];

    const rows = customers.map((c) => [
      `"${c.consent?.id || 'con-legacy'}"`,
      `"${c.id}"`,
      `"${c.name}"`,
      `"${c.mobile}"`,
      `"${c.instagramId || 'N/A'}"`,
      c.consent?.termsAccepted !== false ? 'YES' : 'NO',
      c.consent?.privacyAccepted !== false ? 'YES' : 'NO',
      c.consent?.marketingConsent ? 'YES' : 'NO',
      `"${c.consent?.acceptedDate || c.lastVisitDate}"`,
      `"${c.consent?.ipAddress || '192.168.1.100'}"`,
      `"${c.consent?.deviceInformation || 'Mobile Browser'}"`,
    ]);

    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=DineFlow_Customer_Consent_Audit.csv');
    res.send(csvContent);
  });

  app.get('/api/customers', (req: Request, res: Response) => {
    res.json(customers);
  });

  app.get('/api/customers/:id', (req: Request, res: Response) => {
    const customer = customers.find((c) => c.id === req.params.id || c.mobile === req.params.id);
    if (!customer) {
      res.status(404).json({ error: 'Customer not found' });
      return;
    }
    res.json(customer);
  });

  // 4b. Kitchen Staff Auth (KDS Portal)
  app.post('/api/auth/kitchen-login', (req: Request, res: Response) => {
    const { employeeId, password, phone, otp } = req.body;

    // Check Employee ID or Phone match
    const staff = staffAccounts.find(
      (s) =>
        (employeeId && s.employeeId.toLowerCase() === employeeId.toLowerCase()) ||
        (phone && s.phone.replace(/\D/g, '') === phone.replace(/\D/g, ''))
    );

    if (!staff) {
      res.status(401).json({ error: 'Kitchen staff account not found. Try ID: KITCHEN01 or Phone: 9876543210' });
      return;
    }

    if (staff.role !== 'kitchen_staff' && staff.role !== 'manager' && staff.role !== 'admin') {
      res.status(403).json({ error: 'Access denied: User does not have kitchen privileges' });
      return;
    }

    // Return staff session
    res.json({
      user: staff,
      token: `kds-token-${Date.now()}`,
      portal: 'kitchen'
    });
  });

  // 4c. Admin Portal Auth
  app.post('/api/auth/admin-login', (req: Request, res: Response) => {
    const { email, password, twoFactorCode } = req.body;

    if (!email || !password) {
      res.status(400).json({ error: 'Email and password are required' });
      return;
    }

    // Mock admin authentication (accepts admin@dineflow.com / manager@dineflow.com or any valid admin user)
    const staff = staffAccounts.find(
      (s) => s.role === 'admin' || s.role === 'manager' || s.role === 'owner' as any
    );

    const user = {
      id: staff?.id || 'admin-root',
      name: staff?.name || 'Evelyn Thorne (Owner)',
      email: email,
      role: email.includes('manager') ? 'manager' : 'admin',
      permissions: ['full_access']
    };

    res.json({
      user,
      token: `admin-token-${Date.now()}`,
      portal: 'admin'
    });
  });

  // 4d. Staff Management Endpoints (Admin Portal)
  app.get('/api/staff', (req: Request, res: Response) => {
    res.json(staffAccounts);
  });

  app.post('/api/staff', (req: Request, res: Response) => {
    const { name, phone, employeeId, role, permissions } = req.body;

    if (!name || !phone || !employeeId || !role) {
      res.status(400).json({ error: 'Name, phone, employee ID, and role are required' });
      return;
    }

    const newStaff: StaffAccount = {
      id: `staff-${Date.now()}`,
      name,
      phone,
      employeeId: employeeId.toUpperCase(),
      role,
      permissions: permissions || ['view_orders'],
      createdAt: new Date().toISOString().split('T')[0]
    };

    staffAccounts.unshift(newStaff);
    res.status(201).json(newStaff);
  });

  app.delete('/api/staff/:id', (req: Request, res: Response) => {
    const { id } = req.params;
    staffAccounts = staffAccounts.filter((s) => s.id !== id && s.employeeId !== id);
    res.json({ success: true });
  });

  // 4e. Loyalty Reward Catalog & Redemption
  app.get('/api/loyalty/rewards', (req: Request, res: Response) => {
    res.json(loyaltyRewards);
  });

  app.post('/api/loyalty/redeem', (req: Request, res: Response) => {
    const { customerId, rewardId } = req.body;

    const cust = customers.find((c) => c.id === customerId);
    if (!cust) {
      res.status(404).json({ error: 'Customer profile not found' });
      return;
    }

    const reward = loyaltyRewards.find((r) => r.id === rewardId);
    if (!reward) {
      res.status(404).json({ error: 'Reward option not found' });
      return;
    }

    if (cust.loyaltyPoints < reward.costPoints) {
      res.status(400).json({ error: `Insufficient points balance. Need ${reward.costPoints} points.` });
      return;
    }

    // Deduct points
    cust.loyaltyPoints -= reward.costPoints;

    const redemptionCode = `REDEEM-${Math.floor(1000 + Math.random() * 9000)}`;

    // Record in reward history
    if (!cust.rewardHistory) cust.rewardHistory = [];
    cust.rewardHistory.unshift({
      id: `red-${Date.now()}`,
      customerId: cust.id,
      rewardTitle: reward.title,
      pointsSpent: reward.costPoints,
      code: redemptionCode,
      date: new Date().toISOString().split('T')[0]
    });

    // Create a redeemable coupon offer in customer offers
    const newOffer = {
      id: `off-reward-${Date.now()}`,
      title: reward.title,
      discountPercent: reward.discountPercent || (reward.discountAmount ? 15 : 100),
      offerType: 'custom' as any,
      code: redemptionCode,
      description: reward.description,
      expiresAt: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      isUsed: false,
    };

    cust.offers.unshift(newOffer);

    res.json({
      success: true,
      message: `Successfully redeemed ${reward.title}!`,
      code: redemptionCode,
      customer: cust
    });
  });

  // 5. Orders & Placement
  app.get('/api/orders', (req: Request, res: Response) => {
    res.json(orders);
  });

  app.post('/api/orders', (req: Request, res: Response) => {
    const {
      tableNumber,
      customerId,
      customerName,
      customerMobile,
      items,
      subtotal,
      discount,
      discountName,
      tax,
      totalAmount,
      notes,
    } = req.body;

    if (!items || items.length === 0) {
      res.status(400).json({ error: 'Order must contain items' });
      return;
    }

    const newOrderNumber = `#${100 + orders.length + 1}`;
    const newOrder: Order = {
      id: `ORD-${Date.now()}`,
      orderNumber: newOrderNumber,
      restaurantId: restaurant.id,
      tableNumber: tableNumber || '01',
      customerId,
      customerName: customerName || 'Guest',
      customerMobile: customerMobile || '',
      items,
      subtotal,
      discount: discount || 0,
      discountName,
      tax: tax || 0,
      totalAmount,
      status: 'received',
      createdAt: new Date().toISOString(),
      estimatedTimeMinutes: 20,
      paymentStatus: 'paid',
      notes,
    };

    orders.unshift(newOrder);

    // Update Table status to occupied
    const tableIndex = tables.findIndex((t) => t.tableNumber === tableNumber);
    if (tableIndex !== -1) {
      tables[tableIndex].status = 'occupied';
      tables[tableIndex].currentOrderId = newOrder.id;
    }

    // Update customer stats & loyalty points (+50 points per completed order or placed order)
    if (customerId) {
      const cust = customers.find((c) => c.id === customerId);
      if (cust) {
        cust.totalOrders += 1;
        cust.totalSpending += totalAmount;
        cust.visitsCount += 1;
        cust.lastVisitDate = new Date().toISOString().split('T')[0];
        cust.loyaltyPoints += 50;

        // Mark welcome offer as used if applied
        if (discountName && discountName.includes('15%')) {
          const welcomeOff = cust.offers.find((o) => o.offerType === 'welcome');
          if (welcomeOff) welcomeOff.isUsed = true;
        }

        // Add visit record
        cust.visitHistory.unshift({
          id: `v-${Date.now()}`,
          date: new Date().toISOString().split('T')[0],
          month: new Date().toLocaleString('en-US', { month: 'long' }),
          spending: totalAmount,
          orderId: newOrder.id,
          category: items[0]?.name || 'Dining',
        });

        // Automatically generate Smart Next Visit Coupon based on total spending or party
        const offerType = totalAmount > 100 ? 'family' : totalAmount > 50 ? 'couple' : 'single';
        const discountPct = offerType === 'family' ? 22 : offerType === 'couple' ? 15 : 10;

        cust.offers.unshift({
          id: `off-next-${Date.now()}`,
          title: `Next Visit ${offerType.toUpperCase()} Special (${discountPct}% OFF)`,
          discountPercent: discountPct,
          offerType: offerType as any,
          code: `NEXT${discountPct}`,
          description: `Enjoy ${discountPct}% OFF on your next visit!`,
          expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          isUsed: false,
        });
      }
    }

    // Broadcast new order to Kitchen Display & Customer Live Tracker
    broadcastEvent('new_order', newOrder);
    broadcastEvent('tables_updated', tables);

    res.status(201).json(newOrder);
  });

  app.put('/api/orders/:id/status', (req: Request, res: Response) => {
    const { id } = req.params;
    const { status } = req.body as { status: OrderStatus };

    const order = orders.find((o) => o.id === id || o.orderNumber === id);
    if (!order) {
      res.status(404).json({ error: 'Order not found' });
      return;
    }

    order.status = status;

    // If order completed or cancelled, set table available
    if (status === 'completed' || status === 'cancelled') {
      const table = tables.find((t) => t.tableNumber === order.tableNumber);
      if (table && table.currentOrderId === order.id) {
        table.status = 'available';
        table.currentOrderId = undefined;
      }
    }

    broadcastEvent('order_status_updated', order);
    broadcastEvent('tables_updated', tables);

    res.json(order);
  });

  // 6. Instagram Campaign Submissions & Verification
  app.post('/api/loyalty/instagram', (req: Request, res: Response) => {
    const { customerId, customerName, instagramId, postType, postUrl } = req.body;

    const newCampaign: InstagramCampaign = {
      id: `ig-${Date.now()}`,
      customerId,
      customerName,
      instagramId,
      postType,
      postUrl,
      status: 'pending',
      pointsAwarded: postType === 'streak' ? 80 : postType === 'reel' ? 30 : 15,
      submittedAt: new Date().toISOString(),
    };

    instagramCampaigns.unshift(newCampaign);
    res.status(201).json(newCampaign);
  });

  app.get('/api/loyalty/instagram', (req: Request, res: Response) => {
    res.json(instagramCampaigns);
  });

  app.put('/api/loyalty/instagram/:id', (req: Request, res: Response) => {
    const { id } = req.params;
    const { status } = req.body; // 'approved' or 'rejected'

    const campaign = instagramCampaigns.find((c) => c.id === id);
    if (!campaign) {
      res.status(404).json({ error: 'Campaign submission not found' });
      return;
    }

    campaign.status = status;

    if (status === 'approved') {
      const cust = customers.find((c) => c.id === campaign.customerId);
      if (cust) {
        cust.loyaltyPoints += campaign.pointsAwarded;
      }
    }

    res.json(campaign);
  });

  // 7. Offer Engine
  app.post('/api/offers/generate', (req: Request, res: Response) => {
    const { customerId, offerType, discountPercent, description } = req.body;

    const cust = customers.find((c) => c.id === customerId);
    if (!cust) {
      res.status(404).json({ error: 'Customer not found' });
      return;
    }

    const newOffer = {
      id: `off-admin-${Date.now()}`,
      title: `${offerType.toUpperCase()} Special (${discountPercent}% OFF)`,
      discountPercent,
      offerType,
      code: `SPECIAL${discountPercent}`,
      description: description || `Special ${discountPercent}% discount created by chef`,
      expiresAt: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      isUsed: false,
    };

    cust.offers.unshift(newOffer);
    res.status(201).json(newOffer);
  });

  // 8. Admin Analytics Stats
  app.get('/api/admin/stats', (req: Request, res: Response) => {
    const todaySales = orders
      .filter((o) => o.status !== 'cancelled')
      .reduce((sum, o) => sum + o.totalAmount, 0);

    const totalOrdersCount = orders.length;
    const activeTables = tables.filter((t) => t.status === 'occupied').length;
    const totalCustomers = customers.length;
    const avgOrder = totalOrdersCount > 0 ? todaySales / totalOrdersCount : 0;
    const repeatCount = customers.filter((c) => c.visitsCount > 1).length;
    const repeatRate = totalCustomers > 0 ? (repeatCount / totalCustomers) * 100 : 0;

    const stats: AdminStats = {
      todaySales,
      totalOrders: totalOrdersCount,
      activeTablesCount: activeTables,
      totalCustomersCount: totalCustomers,
      avgOrderValue: Number(avgOrder.toFixed(2)),
      repeatCustomerRate: Number(repeatRate.toFixed(1)),
      dailySalesData: [
        { date: 'Mon', sales: 420, orders: 8 },
        { date: 'Tue', sales: 580, orders: 11 },
        { date: 'Wed', sales: 710, orders: 14 },
        { date: 'Thu', sales: 650, orders: 12 },
        { date: 'Fri', sales: 980, orders: 18 },
        { date: 'Sat', sales: 1350, orders: 24 },
        { date: 'Sun', sales: 1120, orders: 20 },
      ],
      monthlySalesData: [
        { month: 'Jan', sales: 14200, orders: 280 },
        { month: 'Feb', sales: 16800, orders: 310 },
        { month: 'Mar', sales: 19500, orders: 370 },
        { month: 'Apr', sales: 18200, orders: 340 },
        { month: 'May', sales: 21400, orders: 410 },
        { month: 'Jun', sales: 24800, orders: 460 },
        { month: 'Jul', sales: 26500, orders: 490 },
        { month: 'Aug', sales: 28900, orders: 530 },
      ],
      popularItems: [
        { name: 'Truffle Burrata Pizza', category: 'Pizza', count: 142, revenue: 3264.58 },
        { name: 'Prime Wagyu Burger', category: 'Burger', count: 118, revenue: 3184.82 },
        { name: 'Filet Mignon 10oz', category: 'Main Course', count: 86, revenue: 3612.00 },
        { name: 'Szechuan Fire Dumplings', category: 'Chinese', count: 94, revenue: 1551.00 },
        { name: 'Valrhona Lava Cake', category: 'Desserts', count: 105, revenue: 1522.50 },
      ],
    };

    res.json(stats);
  });

  // 9. Customer Reviews & Ratings System
  app.get('/api/reviews', (req: Request, res: Response) => {
    res.json(reviews);
  });

  app.post('/api/reviews', (req: Request, res: Response) => {
    const {
      orderId,
      customerId,
      customerName,
      overallRating,
      categories,
      comment,
      foodImageUrl,
      itemsOrdered,
      itemRatings,
    } = req.body;

    if (!orderId || !overallRating) {
      res.status(400).json({ error: 'Order ID and overall rating are required' });
      return;
    }

    const newReview: CustomerReview = {
      id: `rev-${Date.now()}`,
      orderId,
      customerId,
      customerName: customerName || 'Valued Guest',
      overallRating: Number(overallRating) || 5,
      categories: categories || {
        foodQuality: 5,
        taste: 5,
        service: 5,
        waitingTime: 5,
        cleanliness: 5,
        overall: 5,
      },
      comment: comment || '',
      foodImageUrl,
      itemsOrdered: itemsOrdered || [],
      itemRatings: itemRatings || [],
      createdAt: new Date().toISOString().split('T')[0],
      isFeatured: false,
      isHidden: false,
    };

    reviews.unshift(newReview);

    // Mark order as reviewed
    const order = orders.find((o) => o.id === orderId || o.orderNumber === orderId);
    if (order) {
      order.isReviewed = true;
    }

    // Award bonus 50 loyalty points if customer ID present
    if (customerId) {
      const cust = customers.find((c) => c.id === customerId);
      if (cust) {
        cust.loyaltyPoints += 50;
      }
    }

    broadcastEvent('new_review', newReview);
    res.status(201).json(newReview);
  });

  app.patch('/api/reviews/:id/reply', (req: Request, res: Response) => {
    const { id } = req.params;
    const { reply } = req.body;

    const rev = reviews.find((r) => r.id === id);
    if (!rev) {
      res.status(404).json({ error: 'Review not found' });
      return;
    }

    rev.adminReply = reply;
    res.json(rev);
  });

  app.patch('/api/reviews/:id/feature', (req: Request, res: Response) => {
    const { id } = req.params;
    const rev = reviews.find((r) => r.id === id);
    if (!rev) {
      res.status(404).json({ error: 'Review not found' });
      return;
    }

    rev.isFeatured = !rev.isFeatured;
    res.json(rev);
  });

  app.patch('/api/reviews/:id/hide', (req: Request, res: Response) => {
    const { id } = req.params;
    const rev = reviews.find((r) => r.id === id);
    if (!rev) {
      res.status(404).json({ error: 'Review not found' });
      return;
    }

    rev.isHidden = !rev.isHidden;
    res.json(rev);
  });

  // 10. Third-Party Delivery Integrations (Zomato & Swiggy)
  app.get('/api/integrations/delivery', (req: Request, res: Response) => {
    res.json(deliveryConfig);
  });

  app.put('/api/integrations/delivery', (req: Request, res: Response) => {
    deliveryConfig = { ...deliveryConfig, ...req.body };
    res.json(deliveryConfig);
  });

  app.post('/api/integrations/delivery/order', (req: Request, res: Response) => {
    const { source, customerName, items, totalAmount } = req.body;
    const orderSource = source === 'swiggy' ? 'swiggy' : 'zomato';
    const commPct = orderSource === 'swiggy' ? deliveryConfig.swiggyCommissionPct : deliveryConfig.zomatoCommissionPct;

    const newOrder: Order = {
      id: `ORD-${Date.now()}`,
      orderNumber: `#${100 + orders.length + 1}`,
      restaurantId: restaurant.id,
      tableNumber: 'Delivery',
      customerName: customerName || `${orderSource === 'zomato' ? 'Zomato' : 'Swiggy'} Customer`,
      customerMobile: '+1 800-DELIVERY',
      source: orderSource,
      commissionFee: Number(((totalAmount * commPct) / 100).toFixed(2)),
      items: items || [
        {
          menuItemId: 'p-01',
          name: 'Truffle Burrata & Wood-Fired Margherita',
          quantity: 1,
          unitPrice: 22.99,
          customizationsText: 'Delivery Pack',
          totalItemPrice: 22.99,
        },
      ],
      subtotal: totalAmount || 22.99,
      discount: 0,
      tax: 2.00,
      totalAmount: totalAmount || 24.99,
      status: 'received',
      createdAt: new Date().toISOString(),
      estimatedTimeMinutes: 25,
      paymentStatus: 'paid',
    };

    orders.unshift(newOrder);
    broadcastEvent('new_order', newOrder);
    res.status(201).json(newOrder);
  });

  // 11. Restaurant About Us & Brand Management
  app.get('/api/restaurant/about', (req: Request, res: Response) => {
    res.json(restaurantAbout);
  });

  app.put('/api/restaurant/about', (req: Request, res: Response) => {
    restaurantAbout = { ...restaurantAbout, ...req.body };
    res.json(restaurantAbout);
  });

  // 12. Excel / CSV Export for Customer CRM
  app.get('/api/admin/export-crm', (req: Request, res: Response) => {
    const headers = [
      'Customer Name',
      'Mobile Number',
      'Instagram ID',
      'Total Orders',
      'Total Spending ($)',
      'Total Visits',
      'Last Visit Date',
      'Loyalty Points',
      'Offers Available',
    ];

    const rows = customers.map((c) => [
      `"${c.name}"`,
      `"${c.mobile}"`,
      `"${c.instagramId || 'N/A'}"`,
      c.totalOrders,
      c.totalSpending.toFixed(2),
      c.visitsCount,
      `"${c.lastVisitDate}"`,
      c.loyaltyPoints,
      c.offers.filter((o) => !o.isUsed).length,
    ]);

    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=DineFlow_Pro_Customers.csv');
    res.send(csvContent);
  });

  // Vite middleware for development vs static serve for production
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`DineFlow Pro server running on http://localhost:${PORT}`);
  });
}

startServer();
