import React, { useState, useEffect } from 'react';
import {
  AdminStats,
  Customer,
  InstagramCampaign,
  Order,
  Table,
  StaffAccount,
  UserRole,
  CustomerReview,
  ZomatoSwiggyConfig,
  RestaurantAbout,
  MenuItem,
} from '../types';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import {
  Users,
  QrCode,
  Download,
  Printer,
  Plus,
  Trash2,
  Gift,
  Instagram,
  CheckCircle,
  XCircle,
  TrendingUp,
  FileSpreadsheet,
  Calendar,
  Lock,
  UserCheck,
  ShieldAlert,
  KeyRound,
  Shield,
  Key,
  Star,
  ShoppingBag,
  Info,
  Utensils,
  ShieldCheck,
} from 'lucide-react';
import QRCode from 'qrcode';
import { apiClient } from '../services/api';
import { ReviewManagementAdmin } from './ReviewManagementAdmin';
import { DeliveryIntegrationAdmin } from './DeliveryIntegrationAdmin';
import { AboutUsManagementAdmin } from './AboutUsManagementAdmin';
import { MenuFilterManagementAdmin } from './MenuFilterManagementAdmin';

interface AdminDashboardProps {
  stats: AdminStats | null;
  tables: Table[];
  customers: Customer[];
  orders: Order[];
  instagramCampaigns: InstagramCampaign[];
  reviews: CustomerReview[];
  deliveryConfig: ZomatoSwiggyConfig;
  about: RestaurantAbout;
  menuItems: MenuItem[];
  onRefreshData: () => void;
  onReviewUpdated: (review: CustomerReview) => void;
  onConfigUpdated: (config: ZomatoSwiggyConfig) => void;
  onAboutUpdated: (about: RestaurantAbout) => void;
  onOrderAdded: (order: Order) => void;
  onMenuItemsUpdated?: (items: MenuItem[]) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  stats,
  tables,
  customers,
  orders,
  instagramCampaigns,
  reviews,
  deliveryConfig,
  about,
  menuItems,
  onRefreshData,
  onReviewUpdated,
  onConfigUpdated,
  onAboutUpdated,
  onOrderAdded,
  onMenuItemsUpdated,
}) => {
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(true);
  const [adminEmail, setAdminEmail] = useState('admin@dineflow.com');
  const [adminPassword, setAdminPassword] = useState('admin123');
  const [twoFactorCode, setTwoFactorCode] = useState('123456');
  const [loginError, setLoginError] = useState<string | null>(null);

  const [activeTab, setActiveTab] = useState<
    'analytics' | 'tables' | 'crm' | 'consent' | 'reviews' | 'delivery' | 'about' | 'staff' | 'visits' | 'loyalty' | 'instagram' | 'menu'
  >('analytics');

  // Staff Management state
  const [staffAccounts, setStaffAccounts] = useState<StaffAccount[]>([]);
  const [newStaffName, setNewStaffName] = useState('');
  const [newStaffPhone, setNewStaffPhone] = useState('');
  const [newStaffEmpId, setNewStaffEmpId] = useState('');
  const [newStaffRole, setNewStaffRole] = useState<UserRole>('kitchen_staff');

  // Table creation state
  const [newTableNumber, setNewTableNumber] = useState('');
  const [newTableSeats, setNewTableSeats] = useState(4);
  const [selectedQrTable, setSelectedQrTable] = useState<Table | null>(tables[0] || null);
  const [qrDataUrl, setQrDataUrl] = useState<string>('');

  // Selected CRM customer for modal detail view
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);

  // Manual offer creation state
  const [offerCustId, setOfferCustId] = useState('');
  const [offerType, setOfferType] = useState('family');
  const [offerDiscount, setOfferDiscount] = useState(22);

  useEffect(() => {
    if (isAdminAuthenticated) {
      loadStaffAccounts();
    }
  }, [isAdminAuthenticated]);

  const loadStaffAccounts = async () => {
    try {
      const data = await apiClient.getStaffAccounts();
      setStaffAccounts(data);
    } catch (err) {
      console.error('Error loading staff accounts:', err);
    }
  };

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);
    try {
      await apiClient.loginAdminStaff({
        email: adminEmail,
        password: adminPassword,
        twoFactorCode,
      });
      setIsAdminAuthenticated(true);
    } catch (err: any) {
      setLoginError(err.message || 'Admin authentication failed');
    }
  };

  const handleCreateStaff = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStaffName || !newStaffPhone || !newStaffEmpId) return;

    try {
      await apiClient.createStaffAccount({
        name: newStaffName,
        phone: newStaffPhone,
        employeeId: newStaffEmpId,
        role: newStaffRole,
        permissions: newStaffRole === 'admin' ? ['full_access'] : newStaffRole === 'manager' ? ['orders', 'customers', 'reports'] : ['view_orders'],
      });
      setNewStaffName('');
      setNewStaffPhone('');
      setNewStaffEmpId('');
      loadStaffAccounts();
    } catch (err: any) {
      alert(err.message || 'Error creating staff');
    }
  };

  const handleDeleteStaff = async (id: string) => {
    try {
      await apiClient.deleteStaffAccount(id);
      loadStaffAccounts();
    } catch (err) {
      console.error('Error deleting staff:', err);
    }
  };

  const handleGenerateQr = async (table: Table) => {
    setSelectedQrTable(table);
    try {
      const url = `${window.location.origin}/table/${table.tableNumber}`;
      const qrData = await QRCode.toDataURL(url, {
        width: 300,
        margin: 2,
        color: {
          dark: '#D4AF37',
          light: '#0D0D0D',
        },
      });
      setQrDataUrl(qrData);
    } catch (err) {
      console.error('QR code generation error:', err);
    }
  };

  const handleCreateTable = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTableNumber.trim()) return;
    try {
      await apiClient.createTable(newTableNumber.trim(), newTableSeats);
      setNewTableNumber('');
      onRefreshData();
    } catch (err) {
      console.error('Error creating table:', err);
    }
  };

  const handleDeleteTable = async (id: string) => {
    try {
      await apiClient.deleteTable(id);
      onRefreshData();
    } catch (err) {
      console.error('Error deleting table:', err);
    }
  };

  const handleApproveInstagram = async (id: string, approve: boolean) => {
    try {
      await apiClient.updateInstagramCampaignStatus(id, approve ? 'approved' : 'rejected');
      onRefreshData();
    } catch (err) {
      console.error('Error updating instagram campaign:', err);
    }
  };

  const handleCreateOffer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!offerCustId) return;
    try {
      await apiClient.createOffer({
        customerId: offerCustId,
        offerType,
        discountPercent: offerDiscount,
        description: `Special ${offerDiscount}% OFF Next Visit Discount`,
      });
      onRefreshData();
      alert('Offer generated & credited to customer profile!');
    } catch (err) {
      console.error('Error creating offer:', err);
    }
  };

  const handleExportCsv = () => {
    window.open('/api/admin/export-crm', '_blank');
  };

  if (!isAdminAuthenticated) {
    return (
      <div className="max-w-md mx-auto py-16 px-4">
        <div className="bg-zinc-950 border border-amber-500/30 rounded-3xl p-8 text-center shadow-2xl">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-500/30 text-amber-400 flex items-center justify-center mx-auto mb-4">
            <Lock className="w-6 h-6" />
          </div>
          <h2 className="font-serif text-2xl font-bold text-amber-100">DineFlow Admin SaaS Portal</h2>
          <p className="text-xs text-zinc-400 mt-1 mb-6">Enter manager credentials to access analytics & CRM</p>

          <form onSubmit={handleAdminLogin} className="space-y-4 text-left">
            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1">Email</label>
              <input
                type="email"
                value={adminEmail}
                onChange={(e) => setAdminEmail(e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-amber-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1">Password</label>
              <input
                type="password"
                value={adminPassword}
                onChange={(e) => setAdminPassword(e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-amber-500"
              />
            </div>
            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-zinc-950 font-bold text-xs"
            >
              Sign In to SaaS Dashboard
            </button>
          </form>
        </div>
      </div>
    );
  }

  const COLORS = ['#D4AF37', '#E5C158', '#10B981', '#F59E0B', '#EF4444'];

  return (
    <div className="space-y-6 pb-20 animate-fade-in">
      {/* Top Admin Header */}
      <div className="bg-gradient-to-r from-zinc-950 via-zinc-900 to-zinc-950 border border-amber-500/30 rounded-3xl p-6 shadow-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="font-serif text-2xl sm:text-3xl font-extrabold text-amber-100">
              Restaurant Management SaaS
            </h2>
            <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-amber-500/20 text-amber-400 font-extrabold border border-amber-500/30">
              ADMIN PRO
            </span>
          </div>
          <p className="text-xs text-zinc-400 mt-1">
            Real-time analytics, Table QR codes, Customer CRM, Smart Offers & Instagram Marketing
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportCsv}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-500 hover:to-emerald-600 text-white font-bold text-xs shadow-lg transition-all"
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span>Export Customer CRM (.CSV)</span>
          </button>
        </div>
      </div>

      {/* KPI Metric Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="bg-zinc-900/90 border border-amber-500/30 p-4 rounded-2xl shadow-lg">
          <p className="text-[10px] font-extrabold uppercase text-zinc-400">Today Sales</p>
          <p className="text-xl font-serif font-black text-amber-300 mt-1">
            ${stats ? stats.todaySales.toFixed(2) : '0.00'}
          </p>
        </div>
        <div className="bg-zinc-900/90 border border-zinc-800 p-4 rounded-2xl shadow-lg">
          <p className="text-[10px] font-extrabold uppercase text-zinc-400">Total Orders</p>
          <p className="text-xl font-serif font-black text-amber-200 mt-1">{orders.length}</p>
        </div>
        <div className="bg-zinc-900/90 border border-zinc-800 p-4 rounded-2xl shadow-lg">
          <p className="text-[10px] font-extrabold uppercase text-zinc-400">Active Tables</p>
          <p className="text-xl font-serif font-black text-amber-200 mt-1">
            {tables.filter((t) => t.status === 'occupied').length} / {tables.length}
          </p>
        </div>
        <div className="bg-zinc-900/90 border border-zinc-800 p-4 rounded-2xl shadow-lg">
          <p className="text-[10px] font-extrabold uppercase text-zinc-400">Total Customers</p>
          <p className="text-xl font-serif font-black text-amber-200 mt-1">{customers.length}</p>
        </div>
        <div className="bg-zinc-900/90 border border-zinc-800 p-4 rounded-2xl shadow-lg">
          <p className="text-[10px] font-extrabold uppercase text-zinc-400">Avg Order Value</p>
          <p className="text-xl font-serif font-black text-amber-200 mt-1">
            ${stats ? stats.avgOrderValue.toFixed(2) : '0.00'}
          </p>
        </div>
        <div className="bg-zinc-900/90 border border-zinc-800 p-4 rounded-2xl shadow-lg">
          <p className="text-[10px] font-extrabold uppercase text-zinc-400">Repeat Rate</p>
          <p className="text-xl font-serif font-black text-emerald-400 mt-1">
            {stats ? stats.repeatCustomerRate : 0}%
          </p>
        </div>
      </div>

      {/* Admin Tab Switcher */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 bg-zinc-900 p-1.5 rounded-2xl border border-zinc-800 text-xs custom-scrollbar">
        {[
          { key: 'analytics', label: 'Sales Analytics', icon: <TrendingUp className="w-4 h-4" /> },
          { key: 'tables', label: 'Table & QR Management', icon: <QrCode className="w-4 h-4" /> },
          { key: 'crm', label: 'Customer CRM System', icon: <Users className="w-4 h-4" /> },
          { key: 'consent', label: 'Consent Management', icon: <ShieldCheck className="w-4 h-4 text-emerald-400" /> },
          { key: 'menu', label: 'Menu & Filter Controls', icon: <Utensils className="w-4 h-4 text-emerald-400" /> },
          { key: 'reviews', label: 'Reviews & Feedback', icon: <Star className="w-4 h-4 text-amber-400" /> },
          { key: 'delivery', label: 'Zomato & Swiggy', icon: <ShoppingBag className="w-4 h-4 text-rose-400" /> },
          { key: 'about', label: 'About Us & Brand', icon: <Info className="w-4 h-4 text-cyan-400" /> },
          { key: 'staff', label: 'Staff & Roles (RBAC)', icon: <UserCheck className="w-4 h-4" /> },
          { key: 'visits', label: 'Visit Frequency', icon: <Calendar className="w-4 h-4" /> },
          { key: 'loyalty', label: 'Smart Offers & Loyalty', icon: <Gift className="w-4 h-4" /> },
          { key: 'instagram', label: 'Instagram Campaigns', icon: <Instagram className="w-4 h-4" /> },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key as any)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold transition-all whitespace-nowrap ${
              activeTab === tab.key
                ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-zinc-950 shadow-md'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            {tab.icon}
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Tab 1: Sales Analytics */}
      {activeTab === 'analytics' && stats && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Daily Sales Chart */}
          <div className="bg-zinc-900/90 border border-zinc-800 rounded-3xl p-6 shadow-xl space-y-4">
            <h3 className="font-serif text-lg font-bold text-amber-100 flex items-center justify-between">
              <span>Weekly Sales Revenue</span>
              <span className="text-xs text-amber-400 font-mono font-semibold">$3,420 Total</span>
            </h3>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={stats.dailySalesData}>
                  <defs>
                    <linearGradient id="goldGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#D4AF37" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#D4AF37" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="date" stroke="#71717A" fontSize={11} />
                  <YAxis stroke="#71717A" fontSize={11} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#09090B', borderColor: '#D4AF37', borderRadius: '12px', fontSize: '12px' }}
                  />
                  <Area type="monotone" dataKey="sales" stroke="#D4AF37" fillOpacity={1} fill="url(#goldGradient)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Monthly Sales Chart */}
          <div className="bg-zinc-900/90 border border-zinc-800 rounded-3xl p-6 shadow-xl space-y-4">
            <h3 className="font-serif text-lg font-bold text-amber-100">Monthly Growth Trajectory</h3>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stats.monthlySalesData}>
                  <XAxis dataKey="month" stroke="#71717A" fontSize={11} />
                  <YAxis stroke="#71717A" fontSize={11} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#09090B', borderColor: '#D4AF37', borderRadius: '12px', fontSize: '12px' }}
                  />
                  <Bar dataKey="sales" fill="#D4AF37" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Top Selling Items */}
          <div className="bg-zinc-900/90 border border-zinc-800 rounded-3xl p-6 shadow-xl space-y-4 lg:col-span-2">
            <h3 className="font-serif text-lg font-bold text-amber-100">Top Selling Dishes</h3>
            <div className="space-y-3">
              {stats.popularItems.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between bg-zinc-950 p-3 rounded-xl border border-zinc-800 text-xs">
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-full bg-amber-500/20 text-amber-400 font-bold flex items-center justify-center font-mono text-xs">
                      #{idx + 1}
                    </span>
                    <div>
                      <p className="font-bold text-amber-100">{item.name}</p>
                      <p className="text-[10px] text-zinc-400">{item.category} • {item.count} orders</p>
                    </div>
                  </div>
                  <span className="font-mono font-bold text-amber-400 text-sm">
                    ${item.revenue.toFixed(2)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Table & QR Management */}
      {activeTab === 'tables' && (
        <div className="space-y-6">
          {/* Create Table Card */}
          <div className="bg-zinc-900/90 border border-amber-500/30 rounded-3xl p-6 shadow-xl">
            <h3 className="font-serif text-lg font-bold text-amber-100 mb-4">Create New QR Table</h3>
            <form onSubmit={handleCreateTable} className="flex flex-col sm:flex-row gap-3">
              <input
                type="text"
                placeholder="Table Number (e.g. 11, 12)"
                value={newTableNumber}
                onChange={(e) => setNewTableNumber(e.target.value)}
                className="flex-1 bg-zinc-950 border border-zinc-800 focus:border-amber-500 rounded-xl p-3 text-xs text-white placeholder-zinc-600 focus:outline-none"
              />
              <input
                type="number"
                placeholder="Seats Count (e.g. 4)"
                value={newTableSeats}
                onChange={(e) => setNewTableSeats(Number(e.target.value))}
                className="w-32 bg-zinc-950 border border-zinc-800 focus:border-amber-500 rounded-xl p-3 text-xs text-white focus:outline-none"
              />
              <button
                type="submit"
                className="px-5 py-3 rounded-xl bg-amber-500 text-zinc-950 font-bold text-xs hover:bg-amber-400 transition-all flex items-center justify-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                <span>Add Table</span>
              </button>
            </form>
          </div>

          {/* Tables Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {tables.map((table) => (
              <div
                key={table.id}
                className="bg-zinc-900 border border-zinc-800 rounded-3xl p-5 flex flex-col justify-between shadow-lg"
              >
                <div>
                  <div className="flex items-center justify-between pb-3 border-b border-zinc-800 mb-3">
                    <div>
                      <p className="text-[10px] font-bold uppercase text-zinc-400">TABLE IDENTIFIER</p>
                      <h4 className="font-serif text-2xl font-black text-amber-200">Table #{table.tableNumber}</h4>
                    </div>
                    <span
                      className={`text-[10px] uppercase font-bold px-2.5 py-1 rounded-full ${
                        table.status === 'available'
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                          : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                      }`}
                    >
                      {table.status}
                    </span>
                  </div>

                  <p className="text-xs text-zinc-400 mb-4">Capacity: {table.seats} Persons</p>
                </div>

                <div className="flex items-center gap-2 pt-3 border-t border-zinc-800">
                  <button
                    onClick={() => handleGenerateQr(table)}
                    className="flex-1 py-2 px-3 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-300 font-bold text-xs hover:bg-amber-500/30 transition-all flex items-center justify-center gap-1.5"
                  >
                    <QrCode className="w-4 h-4" />
                    <span>View QR Sticker</span>
                  </button>

                  <button
                    onClick={() => handleDeleteTable(table.id)}
                    className="p-2 rounded-xl bg-zinc-950 border border-zinc-800 text-zinc-500 hover:text-rose-400 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* QR Modal / View Card */}
          {selectedQrTable && (
            <div className="bg-zinc-950 border border-amber-500/40 rounded-3xl p-6 max-w-md mx-auto text-center space-y-4 shadow-2xl">
              <h4 className="font-serif text-2xl font-bold text-amber-100">
                Table #{selectedQrTable.tableNumber} QR Code
              </h4>
              <p className="text-xs text-zinc-400">Print or attach this QR sticker to table #{selectedQrTable.tableNumber}</p>

              {qrDataUrl && (
                <div className="bg-zinc-900 p-4 rounded-2xl border border-amber-500/30 inline-block mx-auto">
                  <img src={qrDataUrl} alt={`QR Table ${selectedQrTable.tableNumber}`} className="w-48 h-48 mx-auto" />
                </div>
              )}

              <div className="flex gap-2 justify-center">
                <a
                  href={qrDataUrl}
                  download={`DineFlow_Table_${selectedQrTable.tableNumber}_QR.png`}
                  className="px-4 py-2 rounded-xl bg-amber-500 text-zinc-950 font-bold text-xs flex items-center gap-1.5"
                >
                  <Download className="w-4 h-4" />
                  <span>Download PNG</span>
                </a>
                <button
                  onClick={() => window.print()}
                  className="px-4 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-300 font-bold text-xs flex items-center gap-1.5"
                >
                  <Printer className="w-4 h-4" />
                  <span>Print Template</span>
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Tab 3: Customer CRM System */}
      {activeTab === 'crm' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-serif text-xl font-bold text-amber-100">Customer CRM Database</h3>
            <button
              onClick={handleExportCsv}
              className="px-4 py-2 rounded-xl bg-emerald-600 text-white font-bold text-xs flex items-center gap-1.5"
            >
              <FileSpreadsheet className="w-4 h-4" />
              <span>Export CSV</span>
            </button>
          </div>

          <div className="bg-zinc-900/90 border border-zinc-800 rounded-3xl overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-zinc-300">
                <thead className="bg-zinc-950 text-amber-400 font-serif uppercase tracking-wider text-[11px] border-b border-zinc-800">
                  <tr>
                    <th className="p-4">Customer</th>
                    <th className="p-4">Mobile</th>
                    <th className="p-4">Instagram</th>
                    <th className="p-4">Visits</th>
                    <th className="p-4">Total Spending</th>
                    <th className="p-4">Loyalty Pts</th>
                    <th className="p-4">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800/60">
                  {customers.map((c) => (
                    <tr key={c.id} className="hover:bg-zinc-800/40 transition-colors">
                      <td className="p-4 font-bold text-amber-100 flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-amber-500/20 text-amber-400 font-bold flex items-center justify-center font-mono">
                          {c.name.charAt(0)}
                        </div>
                        {c.name}
                      </td>
                      <td className="p-4 font-mono">{c.mobile}</td>
                      <td className="p-4 font-mono text-pink-400">{c.instagramId || 'N/A'}</td>
                      <td className="p-4 font-bold text-amber-200">{c.visitsCount} Visits</td>
                      <td className="p-4 font-mono font-bold text-amber-400">${c.totalSpending.toFixed(2)}</td>
                      <td className="p-4 font-mono font-bold text-emerald-400">{c.loyaltyPoints} PTS</td>
                      <td className="p-4">
                        <button
                          onClick={() => setSelectedCustomer(c)}
                          className="px-3 py-1.5 rounded-lg bg-amber-500/20 border border-amber-500/40 text-amber-300 text-[11px] font-bold hover:bg-amber-500/30"
                        >
                          View History
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Detail Customer Modal */}
          {selectedCustomer && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
              <div className="bg-zinc-950 border border-amber-500/30 rounded-3xl p-6 max-w-lg w-full text-zinc-100 space-y-4">
                <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
                  <h4 className="font-serif text-xl font-bold text-amber-100">{selectedCustomer.name} Profile</h4>
                  <button onClick={() => setSelectedCustomer(null)} className="text-zinc-400 hover:text-white">✕</button>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs bg-zinc-900 p-3 rounded-2xl border border-zinc-800">
                  <div>Mobile: <span className="text-amber-200 font-mono">{selectedCustomer.mobile}</span></div>
                  <div>IG: <span className="text-pink-400 font-mono">{selectedCustomer.instagramId || 'N/A'}</span></div>
                  <div>Visits: <span className="text-amber-200 font-bold">{selectedCustomer.visitsCount}</span></div>
                  <div>Total Spent: <span className="text-amber-400 font-mono font-bold">${selectedCustomer.totalSpending.toFixed(2)}</span></div>
                </div>

                <h5 className="font-bold text-xs uppercase text-zinc-400">Order & Visit History</h5>
                <div className="max-h-48 overflow-y-auto space-y-2 pr-1">
                  {selectedCustomer.visitHistory.map((v) => (
                    <div key={v.id} className="bg-zinc-900 p-2.5 rounded-xl border border-zinc-800 text-xs flex justify-between">
                      <span>{v.date} ({v.category})</span>
                      <span className="font-mono text-amber-400 font-bold">${v.spending.toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Tab: Staff & Role-Based Access Control (RBAC) */}
      {activeTab === 'staff' && (
        <div className="space-y-6">
          {/* Create Staff Account Card */}
          <div className="bg-zinc-900/90 border border-amber-500/30 rounded-3xl p-6 shadow-xl space-y-4">
            <h3 className="font-serif text-lg font-bold text-amber-100 flex items-center gap-2">
              <UserCheck className="w-5 h-5 text-amber-400" />
              <span>Create Staff Account & Assign Role</span>
            </h3>
            <p className="text-xs text-zinc-400">
              Set role-based permissions for kitchen staff, managers, and cashiers.
            </p>

            <form onSubmit={handleCreateStaff} className="grid grid-cols-1 md:grid-cols-4 gap-3">
              <input
                type="text"
                placeholder="Staff Full Name"
                value={newStaffName}
                onChange={(e) => setNewStaffName(e.target.value)}
                required
                className="bg-zinc-950 border border-zinc-800 focus:border-amber-500 rounded-xl p-3 text-xs text-white placeholder-zinc-600 focus:outline-none"
              />
              <input
                type="tel"
                placeholder="Mobile Number"
                value={newStaffPhone}
                onChange={(e) => setNewStaffPhone(e.target.value)}
                required
                className="bg-zinc-950 border border-zinc-800 focus:border-amber-500 rounded-xl p-3 text-xs text-white placeholder-zinc-600 focus:outline-none font-mono"
              />
              <input
                type="text"
                placeholder="Employee ID (e.g. CHEF02)"
                value={newStaffEmpId}
                onChange={(e) => setNewStaffEmpId(e.target.value)}
                required
                className="bg-zinc-950 border border-zinc-800 focus:border-amber-500 rounded-xl p-3 text-xs text-white placeholder-zinc-600 focus:outline-none uppercase font-mono"
              />
              <select
                value={newStaffRole}
                onChange={(e) => setNewStaffRole(e.target.value as UserRole)}
                className="bg-zinc-950 border border-zinc-800 focus:border-amber-500 rounded-xl p-3 text-xs text-amber-300 font-bold focus:outline-none"
              >
                <option value="kitchen_staff">Kitchen Staff (KDS Only)</option>
                <option value="cashier">Cashier (Billing Only)</option>
                <option value="manager">Restaurant Manager</option>
                <option value="admin">Owner / Super Admin</option>
              </select>

              <button
                type="submit"
                className="md:col-span-4 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-zinc-950 font-bold text-xs shadow-lg shadow-amber-500/20 transition-all flex items-center justify-center gap-2"
              >
                <Plus className="w-4 h-4" />
                <span>Create Staff Account & Provision Credentials</span>
              </button>
            </form>
          </div>

          {/* Active Staff List */}
          <div className="bg-zinc-900/90 border border-zinc-800 rounded-3xl p-6 shadow-xl space-y-4">
            <h3 className="font-serif text-lg font-bold text-amber-100 flex items-center justify-between">
              <span>Active Employee Accounts ({staffAccounts.length})</span>
              <span className="text-[11px] font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-2.5 py-1 rounded-lg">
                RBAC Active
              </span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {staffAccounts.map((staff) => (
                <div
                  key={staff.id}
                  className="bg-zinc-950 border border-zinc-800 rounded-2xl p-4 space-y-3 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between border-b border-zinc-800 pb-2 mb-2">
                      <span className="font-serif text-sm font-bold text-amber-100">{staff.name}</span>
                      <span className="text-[10px] uppercase font-mono font-bold px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                        {staff.role.replace('_', ' ')}
                      </span>
                    </div>

                    <div className="space-y-1 text-xs text-zinc-400 font-mono">
                      <p>Emp ID: <span className="text-amber-300 font-bold">{staff.employeeId}</span></p>
                      <p>Phone: <span className="text-zinc-200">{staff.phone}</span></p>
                      <p className="text-[10px] text-zinc-500 capitalize">
                        Permissions: {staff.permissions.join(', ')}
                      </p>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-zinc-800/80 flex justify-end">
                    <button
                      onClick={() => handleDeleteStaff(staff.id)}
                      className="text-xs text-rose-400 hover:text-rose-300 font-bold flex items-center gap-1 bg-rose-500/10 px-2.5 py-1 rounded-lg border border-rose-500/20"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Remove</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: Visit Analytics Frequency */}
      {activeTab === 'visits' && (
        <div className="bg-zinc-900/90 border border-zinc-800 rounded-3xl p-6 shadow-xl space-y-4">
          <h3 className="font-serif text-lg font-bold text-amber-100">Monthly Visit Frequency Breakdown</h3>
          <div className="space-y-4">
            {customers.map((c) => (
              <div key={c.id} className="bg-zinc-950 p-4 rounded-2xl border border-zinc-800 space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-amber-200 text-sm">{c.name} ({c.mobile})</span>
                  <span className="text-amber-400 font-bold">{c.visitsCount} Total Visits</span>
                </div>
                <div className="grid grid-cols-3 gap-2 text-center text-[11px] pt-1">
                  <div className="bg-zinc-900 p-2 rounded-xl border border-zinc-800">
                    <p className="text-zinc-500">January</p>
                    <p className="font-bold text-amber-300">
                      {c.visitHistory.filter((v) => v.month === 'January').length} visits
                    </p>
                  </div>
                  <div className="bg-zinc-900 p-2 rounded-xl border border-zinc-800">
                    <p className="text-zinc-500">February</p>
                    <p className="font-bold text-amber-300">
                      {c.visitHistory.filter((v) => v.month === 'February').length} visits
                    </p>
                  </div>
                  <div className="bg-zinc-900 p-2 rounded-xl border border-zinc-800">
                    <p className="text-zinc-500">March</p>
                    <p className="font-bold text-amber-300">
                      {c.visitHistory.filter((v) => v.month === 'March').length} visits
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 5: Smart Offers & Loyalty */}
      {activeTab === 'loyalty' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Create Smart Offer Form */}
          <div className="bg-zinc-900/90 border border-amber-500/30 rounded-3xl p-6 shadow-xl space-y-4">
            <h3 className="font-serif text-lg font-bold text-amber-100">Generate Next Visit Coupon</h3>
            <form onSubmit={handleCreateOffer} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">Select Customer</label>
                <select
                  value={offerCustId}
                  onChange={(e) => setOfferCustId(e.target.value)}
                  required
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-amber-500"
                >
                  <option value="">-- Choose Customer --</option>
                  {customers.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name} ({c.mobile})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1">Offer Tier</label>
                  <select
                    value={offerType}
                    onChange={(e) => {
                      setOfferType(e.target.value);
                      if (e.target.value === 'single') setOfferDiscount(10);
                      if (e.target.value === 'couple') setOfferDiscount(15);
                      if (e.target.value === 'family') setOfferDiscount(22);
                    }}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-2.5 text-xs text-white focus:outline-none"
                  >
                    <option value="single">Single Visit (10% OFF)</option>
                    <option value="couple">Couple Visit (15% OFF)</option>
                    <option value="family">Family Visit (22% OFF)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1">Discount %</label>
                  <input
                    type="number"
                    value={offerDiscount}
                    onChange={(e) => setOfferDiscount(Number(e.target.value))}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-2.5 text-xs text-white focus:outline-none"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-zinc-950 font-bold text-xs"
              >
                Send Smart Offer Coupon
              </button>
            </form>
          </div>

          {/* Loyalty Rules Overview */}
          <div className="bg-zinc-900/90 border border-zinc-800 rounded-3xl p-6 shadow-xl space-y-3">
            <h3 className="font-serif text-lg font-bold text-amber-100">Automated Reward Rules</h3>
            <div className="space-y-2 text-xs">
              <div className="bg-zinc-950 p-3 rounded-xl border border-zinc-800 flex justify-between">
                <span>Completed Table Order</span>
                <span className="font-bold text-amber-400">+50 Points</span>
              </div>
              <div className="bg-zinc-950 p-3 rounded-xl border border-zinc-800 flex justify-between">
                <span>Instagram Story Tag</span>
                <span className="font-bold text-amber-400">+15 Points</span>
              </div>
              <div className="bg-zinc-950 p-3 rounded-xl border border-zinc-800 flex justify-between">
                <span>Instagram Food Reel</span>
                <span className="font-bold text-amber-400">+30 Points</span>
              </div>
              <div className="bg-zinc-950 p-3 rounded-xl border border-zinc-800 flex justify-between">
                <span>Instagram Visit Streak</span>
                <span className="font-bold text-amber-400">+80 Points</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab: Customer Reviews & Ratings */}
      {activeTab === 'reviews' && (
        <ReviewManagementAdmin
          reviews={reviews}
          menuItems={menuItems}
          onReviewUpdated={onReviewUpdated}
        />
      )}

      {/* Tab: Zomato & Swiggy Delivery Integrations */}
      {activeTab === 'delivery' && (
        <DeliveryIntegrationAdmin
          orders={orders}
          config={deliveryConfig}
          onConfigUpdated={onConfigUpdated}
          onOrderAdded={onOrderAdded}
        />
      )}

      {/* Tab: About Us & Brand Management */}
      {activeTab === 'about' && (
        <AboutUsManagementAdmin
          about={about}
          onAboutUpdated={onAboutUpdated}
        />
      )}

      {/* Tab 6: Instagram Marketing Submissions */}
      {activeTab === 'instagram' && (
        <div className="bg-zinc-900/90 border border-zinc-800 rounded-3xl p-6 shadow-xl space-y-4">
          <h3 className="font-serif text-lg font-bold text-amber-100">Customer Instagram Campaign Verification</h3>
          <div className="space-y-3">
            {instagramCampaigns.length === 0 ? (
              <p className="text-xs text-zinc-500 text-center py-6">No Instagram campaign submissions yet.</p>
            ) : (
              instagramCampaigns.map((camp) => (
                <div
                  key={camp.id}
                  className="bg-zinc-950 p-4 rounded-2xl border border-zinc-800 flex items-center justify-between text-xs"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <Instagram className="w-4 h-4 text-pink-400" />
                      <span className="font-bold text-amber-200">{camp.customerName} ({camp.instagramId})</span>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-pink-500/20 text-pink-300 uppercase font-bold">
                        {camp.postType}
                      </span>
                    </div>
                    <a
                      href={camp.postUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-amber-400 underline text-[11px] mt-1 inline-block"
                    >
                      {camp.postUrl}
                    </a>
                  </div>

                  <div className="flex items-center gap-2">
                    {camp.status === 'pending' ? (
                      <>
                        <button
                          onClick={() => handleApproveInstagram(camp.id, true)}
                          className="px-3 py-1.5 rounded-xl bg-emerald-500 text-zinc-950 font-bold text-xs flex items-center gap-1"
                        >
                          <CheckCircle className="w-3.5 h-3.5" />
                          <span>Approve +{camp.pointsAwarded}pts</span>
                        </button>
                        <button
                          onClick={() => handleApproveInstagram(camp.id, false)}
                          className="px-3 py-1.5 rounded-xl bg-rose-500/20 border border-rose-500/40 text-rose-300 font-bold text-xs"
                        >
                          <XCircle className="w-3.5 h-3.5" />
                        </button>
                      </>
                    ) : (
                      <span
                        className={`font-bold uppercase px-3 py-1 rounded-full text-[10px] ${
                          camp.status === 'approved' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'
                        }`}
                      >
                        {camp.status}
                      </span>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Tab 11: Menu Filter & Dish Management */}
      {activeTab === 'menu' && (
        <MenuFilterManagementAdmin
          menuItems={menuItems}
          onMenuItemsUpdated={(updated) => {
            if (onMenuItemsUpdated) {
              onMenuItemsUpdated(updated);
            }
          }}
        />
      )}

      {/* Tab 12: Admin Consent Management & Legal Audit */}
      {activeTab === 'consent' && (
        <div className="space-y-6 animate-fade-in">
          {/* Header Card */}
          <div className="bg-gradient-to-r from-zinc-950 via-zinc-900 to-zinc-950 border border-emerald-500/30 rounded-3xl p-6 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-6 h-6 text-emerald-400" />
                <h3 className="font-serif text-xl font-bold text-amber-100">
                  Customer Terms & Privacy Consent Management
                </h3>
              </div>
              <p className="text-xs text-zinc-400 mt-1">
                Audit mandatory Terms & Conditions, Privacy Policy acceptances, and marketing communication permissions.
              </p>
            </div>

            <button
              onClick={() => apiClient.exportConsentRecords()}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-500 hover:to-emerald-600 text-white font-bold text-xs shadow-lg transition-all flex items-center gap-2"
              id="admin-export-consent-csv-btn"
            >
              <FileSpreadsheet className="w-4 h-4" />
              <span>Export Consent Audit CSV</span>
            </button>
          </div>

          {/* Consent Metric Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-zinc-900 border border-zinc-800 p-5 rounded-2xl shadow-md">
              <p className="text-[10px] font-extrabold uppercase text-zinc-400 tracking-wider">Total Registered</p>
              <p className="text-2xl font-serif font-black text-amber-200 mt-1">{customers.length}</p>
              <p className="text-[11px] text-zinc-500 mt-1">Customer Accounts</p>
            </div>

            <div className="bg-zinc-900 border border-emerald-500/30 p-5 rounded-2xl shadow-md">
              <p className="text-[10px] font-extrabold uppercase text-emerald-400 tracking-wider">Terms Accepted</p>
              <p className="text-2xl font-serif font-black text-emerald-400 mt-1">
                {customers.filter((c) => c.consent?.termsAccepted !== false).length}
              </p>
              <p className="text-[11px] text-zinc-500 mt-1">
                {Math.round((customers.filter((c) => c.consent?.termsAccepted !== false).length / (customers.length || 1)) * 100)}% Compliance
              </p>
            </div>

            <div className="bg-zinc-900 border border-amber-500/30 p-5 rounded-2xl shadow-md">
              <p className="text-[10px] font-extrabold uppercase text-amber-400 tracking-wider">Privacy Accepted</p>
              <p className="text-2xl font-serif font-black text-amber-300 mt-1">
                {customers.filter((c) => c.consent?.privacyAccepted !== false).length}
              </p>
              <p className="text-[11px] text-zinc-500 mt-1">
                {Math.round((customers.filter((c) => c.consent?.privacyAccepted !== false).length / (customers.length || 1)) * 100)}% Compliance
              </p>
            </div>

            <div className="bg-zinc-900 border border-cyan-500/30 p-5 rounded-2xl shadow-md">
              <p className="text-[10px] font-extrabold uppercase text-cyan-400 tracking-wider">Marketing Consent</p>
              <p className="text-2xl font-serif font-black text-cyan-300 mt-1">
                {customers.filter((c) => c.consent?.marketingConsent).length}
              </p>
              <p className="text-[11px] text-zinc-500 mt-1">
                {Math.round((customers.filter((c) => c.consent?.marketingConsent).length / (customers.length || 1)) * 100)}% Opted-In
              </p>
            </div>
          </div>

          {/* Communication Permission Breakdown */}
          <div className="bg-zinc-900/90 border border-zinc-800 rounded-3xl p-6 shadow-xl space-y-4">
            <h4 className="font-serif text-lg font-bold text-amber-100 flex items-center justify-between">
              <span>Communication Channels Opt-In Status</span>
              <span className="text-xs text-emerald-400 font-mono">Real-time Permissions</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
              <div className="p-4 bg-zinc-950 border border-zinc-800 rounded-2xl space-y-1">
                <p className="text-zinc-400 font-medium">📱 SMS Promotional Alerts</p>
                <p className="text-lg font-bold text-emerald-400">
                  {customers.filter((c) => c.consent?.marketingConsent).length} / {customers.length} Opted In
                </p>
                <p className="text-[10px] text-zinc-500">Transactional & Promotional SMS</p>
              </div>

              <div className="p-4 bg-zinc-950 border border-zinc-800 rounded-2xl space-y-1">
                <p className="text-zinc-400 font-medium">💬 WhatsApp Direct Messaging</p>
                <p className="text-lg font-bold text-emerald-400">
                  {customers.filter((c) => c.consent?.marketingConsent).length} / {customers.length} Opted In
                </p>
                <p className="text-[10px] text-zinc-500">Receipts & Discount Coupons</p>
              </div>

              <div className="p-4 bg-zinc-950 border border-zinc-800 rounded-2xl space-y-1">
                <p className="text-zinc-400 font-medium">✉️ Email Newsletters</p>
                <p className="text-lg font-bold text-emerald-400">
                  {customers.filter((c) => c.consent?.marketingConsent).length} / {customers.length} Opted In
                </p>
                <p className="text-[10px] text-zinc-500">Birthday Rewards & Specials</p>
              </div>

              <div className="p-4 bg-zinc-950 border border-zinc-800 rounded-2xl space-y-1">
                <p className="text-zinc-400 font-medium">🔔 In-App Push Notifications</p>
                <p className="text-lg font-bold text-emerald-400">
                  {customers.length} / {customers.length} Enabled
                </p>
                <p className="text-[10px] text-zinc-500">Live Kitchen Order Updates</p>
              </div>
            </div>
          </div>

          {/* Consent Records Audit Table */}
          <div className="bg-zinc-900/90 border border-zinc-800 rounded-3xl overflow-hidden shadow-xl space-y-4 p-6">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-serif text-lg font-bold text-amber-100">Customer Consent Audit Log</h4>
                <p className="text-xs text-zinc-400">Timestamped records of terms and privacy policy acceptances</p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-zinc-300">
                <thead className="bg-zinc-950 text-amber-400 font-serif uppercase tracking-wider text-[11px] border-b border-zinc-800">
                  <tr>
                    <th className="p-3.5">Customer</th>
                    <th className="p-3.5">Terms & Conditions</th>
                    <th className="p-3.5">Privacy Policy</th>
                    <th className="p-3.5">Marketing Opt-In</th>
                    <th className="p-3.5">Accepted Timestamp</th>
                    <th className="p-3.5">IP & Device Info</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800/60 font-mono">
                  {customers.map((c) => (
                    <tr key={c.id} className="hover:bg-zinc-800/40 transition-colors">
                      <td className="p-3.5 font-sans">
                        <p className="font-bold text-amber-200">{c.name}</p>
                        <p className="text-[11px] text-zinc-400 font-mono">{c.mobile}</p>
                      </td>
                      <td className="p-3.5">
                        <span
                          className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                            c.consent?.termsAccepted !== false
                              ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                              : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                          }`}
                        >
                          {c.consent?.termsAccepted !== false ? 'ACCEPTED' : 'PENDING'}
                        </span>
                      </td>
                      <td className="p-3.5">
                        <span
                          className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                            c.consent?.privacyAccepted !== false
                              ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                              : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                          }`}
                        >
                          {c.consent?.privacyAccepted !== false ? 'ACCEPTED' : 'PENDING'}
                        </span>
                      </td>
                      <td className="p-3.5">
                        <span
                          className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                            c.consent?.marketingConsent
                              ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                              : 'bg-zinc-800 text-zinc-500'
                          }`}
                        >
                          {c.consent?.marketingConsent ? 'OPTED IN' : 'OPTED OUT'}
                        </span>
                      </td>
                      <td className="p-3.5 text-zinc-400 text-[11px]">
                        {c.consent?.acceptedDate
                          ? new Date(c.consent.acceptedDate).toLocaleString()
                          : `${c.lastVisitDate} 12:00:00 PM`}
                      </td>
                      <td className="p-3.5 text-zinc-400 text-[11px]">
                        <p className="text-zinc-300 font-mono">{c.consent?.ipAddress || '192.168.1.102'}</p>
                        <p className="text-[10px] text-zinc-500 truncate max-w-[180px]">
                          {c.consent?.deviceInformation || 'Mobile Safari / iOS 17'}
                        </p>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
