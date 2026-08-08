export type CategoryType = 
  | 'Pizza'
  | 'Burger'
  | 'Main Course'
  | 'Chinese'
  | 'Indian'
  | 'South Indian'
  | 'Starters'
  | 'Drinks'
  | 'Desserts'
  | 'Salad';

export type FoodType = 'veg' | 'non-veg' | 'vegan' | 'eggless';
export type SpiceLevel = 'mild' | 'medium' | 'spicy' | 'extra-spicy';
export type DietaryOption = 'high-protein' | 'low-calorie' | 'gluten-free' | 'sugar-free' | 'healthy-choice' | 'vegan';

export interface CustomizationOption {
  id: string;
  name: string;
  price: number;
}

export interface CustomizationGroup {
  id: string;
  name: string;
  required?: boolean;
  options: CustomizationOption[];
}

export interface MenuItem {
  id: string;
  name: string;
  category: CategoryType;
  description: string;
  price: number;
  image: string;
  isVeg: boolean;
  foodType?: FoodType;
  spiceLevel?: SpiceLevel;
  dietaryInfo?: DietaryOption[];
  ingredients?: string[];
  cuisineType?: string;
  keywords?: string[];
  isSpicy?: boolean;
  rating: number;
  preparationTime: number; // in minutes
  available: boolean;
  isBestseller?: boolean;
  isChefSpecial?: boolean;
  isTodaysSpecial?: boolean;
  isLimitedItem?: boolean;
  isNewArrival?: boolean;
  isCustomerFavourite?: boolean;
  customizationGroups?: CustomizationGroup[];
}

export interface SelectedCustomization {
  groupId: string;
  groupName: string;
  selectedOptions: { id: string; name: string; price: number }[];
}

export interface CartItem {
  id: string; // unique cart item id
  menuItem: MenuItem;
  quantity: number;
  customizations: SelectedCustomization[];
  unitPrice: number;
  totalPrice: number;
}

export type TableStatus = 'available' | 'occupied' | 'reserved';

export interface Table {
  id: string;
  tableNumber: string; // e.g. "01", "05"
  seats: number;
  status: TableStatus;
  qrCodeUrl?: string;
  currentOrderId?: string;
}

export interface VisitRecord {
  id: string;
  date: string; // YYYY-MM-DD
  month: string; // e.g. "January", "February"
  spending: number;
  orderId: string;
  category: string;
}

export interface CustomerOffer {
  id: string;
  title: string;
  discountPercent: number;
  offerType: 'welcome' | 'single' | 'couple' | 'family' | 'custom';
  code: string;
  description: string;
  expiresAt: string;
  isUsed: boolean;
}

export type UserRole = 'customer' | 'admin' | 'manager' | 'kitchen_staff' | 'cashier';

export interface StaffAccount {
  id: string;
  name: string;
  phone: string;
  employeeId: string;
  role: UserRole;
  permissions: string[];
  createdAt: string;
}

export interface LoyaltyReward {
  id: string;
  title: string;
  costPoints: number;
  discountAmount?: number;
  discountPercent?: number;
  isFreeItem?: boolean;
  freeItemName?: string;
  description: string;
}

export interface RewardRedemption {
  id: string;
  customerId: string;
  rewardTitle: string;
  pointsSpent: number;
  code: string;
  date: string;
}

export interface CustomerConsent {
  id: string;
  customerId: string;
  termsAccepted: boolean;
  privacyAccepted: boolean;
  marketingConsent: boolean;
  acceptedDate: string; // ISO timestamp
  ipAddress?: string;
  deviceInformation?: string;
}

export interface User {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  kitchenId?: string;
  role: UserRole;
  token?: string;
}

export interface CookiePreference {
  id: string;
  customerId: string;
  essentialCookie: boolean;
  analyticsCookie: boolean;
  marketingCookie: boolean;
  preferenceCookie: boolean;
  personalizedAdsCookie?: boolean;
  updatedDate: string;
}

export interface Customer {
  id: string;
  name: string;
  mobile: string;
  birthday?: string;
  instagramId?: string;
  totalOrders: number;
  totalSpending: number;
  visitsCount: number;
  lastVisitDate: string;
  loyaltyPoints: number;
  offers: CustomerOffer[];
  visitHistory: VisitRecord[];
  rewardHistory?: RewardRedemption[];
  consent?: CustomerConsent;
}

export interface AdminConsentStats {
  totalRegisteredCustomers: number;
  marketingConsentCount: number;
  privacyAcceptedUsers: number;
  termsAcceptedUsers: number;
  communicationPermissionStatus: {
    sms: number;
    whatsapp: number;
    email: number;
    appNotifications: number;
  };
}

export type OrderStatus = 
  | 'received' 
  | 'accepted' 
  | 'preparing' 
  | 'ready' 
  | 'completed' 
  | 'cancelled';

export interface OrderItem {
  menuItemId: string;
  name: string;
  quantity: number;
  unitPrice: number;
  customizationsText: string;
  totalItemPrice: number;
}

export interface Order {
  id: string;
  orderNumber: string; // e.g. "#105"
  restaurantId: string;
  tableNumber: string;
  customerId?: string;
  customerName: string;
  customerMobile: string;
  items: OrderItem[];
  subtotal: number;
  discount: number;
  discountName?: string;
  tax: number;
  totalAmount: number;
  status: OrderStatus;
  createdAt: string; // ISO or formatted string
  estimatedTimeMinutes: number;
  paymentStatus: 'pending' | 'paid';
  notes?: string;
  source?: OrderSource; // 'qr' | 'zomato' | 'swiggy'
  commissionFee?: number;
  isReviewed?: boolean;
}

export interface InstagramCampaign {
  id: string;
  customerId: string;
  customerName: string;
  instagramId: string;
  postType: 'story' | 'reel' | 'streak' | 'tag';
  postUrl: string;
  status: 'pending' | 'approved' | 'rejected';
  pointsAwarded: number;
  submittedAt: string;
}

export type OrderSource = 'qr' | 'zomato' | 'swiggy';

export interface ItemRating {
  menuItemId: string;
  menuItemName: string;
  rating: number; // 1-5
}

export interface ReviewCategories {
  foodQuality: number; // 1-5
  taste: number;
  service: number;
  waitingTime: number;
  cleanliness: number;
  overall: number;
}

export interface CustomerReview {
  id: string;
  orderId: string;
  customerId?: string;
  customerName: string;
  overallRating: number; // 1-5
  categories: ReviewCategories;
  comment: string;
  foodImageUrl?: string;
  itemsOrdered: { id: string; name: string }[];
  itemRatings?: ItemRating[];
  createdAt: string; // YYYY-MM-DD or formatted date
  isFeatured: boolean;
  isHidden: boolean;
  adminReply?: string;
}

export interface ZomatoSwiggyConfig {
  zomatoConnected: boolean;
  zomatoRestaurantId: string;
  zomatoCommissionPct: number;
  swiggyConnected: boolean;
  swiggyRestaurantId: string;
  swiggyCommissionPct: number;
}

export interface GalleryImage {
  id: string;
  url: string;
  title: string;
  caption?: string;
  category: 'ambiance' | 'dishes' | 'events' | 'chef';
}

export interface RestaurantAbout {
  ourStory: string;
  sinceYear: string;
  chefName: string;
  chefTitle: string;
  chefBio: string;
  chefImage: string;
  mission: string;
  vision: string;
  awards: { id: string; title: string; year: string; issuer: string }[];
  galleryImages: GalleryImage[];
  openingHours: { days: string; hours: string }[];
  contactPhone: string;
  contactEmail: string;
  address: string;
  googleMapsDirectionsUrl: string;
  instagramUrl: string;
}

export interface RestaurantInfo {
  id: string;
  name: string;
  logo: string;
  tagline: string;
  address: string;
  phone: string;
  instagramHandle: string;
  currency: string;
}

export interface AdminStats {
  todaySales: number;
  totalOrders: number;
  activeTablesCount: number;
  totalCustomersCount: number;
  avgOrderValue: number;
  repeatCustomerRate: number;
  dailySalesData: { date: string; sales: number; orders: number }[];
  monthlySalesData: { month: string; sales: number; orders: number }[];
  popularItems: { name: string; category: string; count: number; revenue: number }[];
}
