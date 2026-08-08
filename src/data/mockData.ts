import { Customer, InstagramCampaign, MenuItem, Order, RestaurantInfo, Table, StaffAccount, LoyaltyReward, CustomerReview, ZomatoSwiggyConfig, RestaurantAbout } from '../types';

export const initialZomatoSwiggyConfig: ZomatoSwiggyConfig = {
  zomatoConnected: true,
  zomatoRestaurantId: "ZM-DINEFLOW-884",
  zomatoCommissionPct: 18,
  swiggyConnected: true,
  swiggyRestaurantId: "SW-DINEFLOW-992",
  swiggyCommissionPct: 20,
};

export const initialRestaurantAbout: RestaurantAbout = {
  ourStory: "Since 2015, we have been serving authentic cuisine with premium ingredients, masterful culinary techniques, and unforgettable dining experiences. Born out of a passion for high-grade woodfired gastronomy and contemporary global fusion, DineFlow Luxe Bistro brings together warm hospitality and avant-garde culinary art.",
  sinceYear: "2015",
  chefName: "Chef Jean-Luc Moreau & Executive Team",
  chefTitle: "Master Culinary Director & Michelin Experienced Alumnus",
  chefBio: "Trained in Paris and Tokyo, Chef Jean-Luc blends classical European woodfired techniques with vibrant Asian citrus notes and locally sourced organic botanicals.",
  chefImage: "https://images.unsplash.com/photo-1577219491135-ce391730fb2c?auto=format&fit=crop&w=800&q=80",
  mission: "To craft extraordinary, sustainable dining moments through uncompromised ingredient sourcing, artisanal woodfired mastery, and seamless digital guest experiences.",
  vision: "To set the global gold standard for interactive dining where tech elegance meets culinary perfection.",
  awards: [
    { id: "aw-1", title: "Best Fine Casual Bistro 2024", year: "2024", issuer: "Culinary Excellence Awards" },
    { id: "aw-2", title: "Top Woodfired Gastronomy Spot", year: "2023", issuer: "Epicurean Guide" },
    { id: "aw-3", title: "Innovator in Restaurant Technology", year: "2025", issuer: "Hospitality Tech Summit" }
  ],
  galleryImages: [
    { id: "g-1", url: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80", title: "Main Dining Hall", category: "ambiance" },
    { id: "g-2", url: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80", title: "Open Kitchen & Wood Oven", category: "chef" },
    { id: "g-3", url: "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80", title: "Artisanal Smoked Ribs", category: "dishes" },
    { id: "g-4", url: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=800&q=80", title: "Truffle Pizza Crafting", category: "dishes" },
    { id: "g-5", url: "https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?auto=format&fit=crop&w=800&q=80", title: "Sommelier Wine Vault", category: "ambiance" },
    { id: "g-6", url: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=800&q=80", title: "Signature Plating", category: "events" }
  ],
  openingHours: [
    { days: "Monday - Thursday", hours: "11:30 AM - 10:30 PM" },
    { days: "Friday - Saturday", hours: "11:30 AM - 11:30 PM" },
    { days: "Sunday", hours: "10:00 AM - 10:00 PM (Brunch Special)" }
  ],
  contactPhone: "+1 (800) 555-DINE",
  contactEmail: "reservations@dineflowluxe.com",
  address: "742 Royal Plaza Boulevard, Gourmet District, NY 10001",
  googleMapsDirectionsUrl: "https://maps.google.com/?q=742+Royal+Plaza+Boulevard",
  instagramUrl: "https://instagram.com/dineflowluxe"
};

export const initialCustomerReviews: CustomerReview[] = [
  {
    id: "rev-101",
    orderId: "ORD-101",
    customerId: "cust-01",
    customerName: "Rahul Sharma",
    overallRating: 5,
    categories: {
      foodQuality: 5,
      taste: 5,
      service: 5,
      waitingTime: 4,
      cleanliness: 5,
      overall: 5
    },
    comment: "Excellent food and fast service! The Woodfired Truffle Mushroom Pizza was out of this world. The crust was crisp with incredible aroma.",
    foodImageUrl: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=600&q=80",
    itemsOrdered: [
      { id: "p1", name: "Woodfired Truffle Mushroom Pizza" },
      { id: "d1", name: "Matcha Yuzu Sparkling Elixir" }
    ],
    itemRatings: [
      { menuItemId: "p1", menuItemName: "Woodfired Truffle Mushroom Pizza", rating: 5 },
      { menuItemId: "d1", menuItemName: "Matcha Yuzu Sparkling Elixir", rating: 5 }
    ],
    createdAt: "2026-02-04",
    isFeatured: true,
    isHidden: false,
    adminReply: "Thank you Rahul! We are delighted you enjoyed our signature truffle pizza!"
  },
  {
    id: "rev-102",
    orderId: "ORD-102",
    customerId: "cust-02",
    customerName: "Ananya Roy",
    overallRating: 5,
    categories: {
      foodQuality: 5,
      taste: 5,
      service: 5,
      waitingTime: 5,
      cleanliness: 5,
      overall: 5
    },
    comment: "The Valrhona Molten Gold Lava Cake melted in my mouth! Ambience was top notch and QR ordering made service instant.",
    foodImageUrl: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=600&q=80",
    itemsOrdered: [
      { id: "ds1", name: "Valrhona Molten Gold Chocolate Lava Cake" },
      { id: "m2", name: "Smoked Hickory Wagyu Burger" }
    ],
    itemRatings: [
      { menuItemId: "ds1", menuItemName: "Valrhona Molten Gold Chocolate Lava Cake", rating: 5 },
      { menuItemId: "m2", menuItemName: "Smoked Hickory Wagyu Burger", rating: 5 }
    ],
    createdAt: "2026-02-05",
    isFeatured: true,
    isHidden: false,
    adminReply: "Warmest thanks Ananya! Hope to see you again for our weekend dessert pairing!"
  },
  {
    id: "rev-103",
    orderId: "ORD-103",
    customerId: "cust-03",
    customerName: "Karan Mehta",
    overallRating: 4,
    categories: {
      foodQuality: 5,
      taste: 4,
      service: 4,
      waitingTime: 3,
      cleanliness: 5,
      overall: 4
    },
    comment: "Great quality ingredients. The Paneer Tikka pizza was fresh and loaded with cheese. Slight delay during peak hours but worth the wait.",
    itemsOrdered: [
      { id: "p3", name: "Paneer Tikka Charcoal Pizza" },
      { id: "d2", name: "Smoked Espresso Old Fashioned" }
    ],
    itemRatings: [
      { menuItemId: "p3", menuItemName: "Paneer Tikka Charcoal Pizza", rating: 4 }
    ],
    createdAt: "2026-02-05",
    isFeatured: true,
    isHidden: false
  },
  {
    id: "rev-104",
    orderId: "ORD-104",
    customerName: "Priya Patel",
    overallRating: 5,
    categories: {
      foodQuality: 5,
      taste: 5,
      service: 5,
      waitingTime: 4,
      cleanliness: 5,
      overall: 5
    },
    comment: "Ordered via Swiggy and delivery was super fast. Packaging kept the pizza crisp and hot!",
    itemsOrdered: [
      { id: "p2", name: "Artisanal Burrata & San Marzano Pizza" }
    ],
    itemRatings: [
      { menuItemId: "p2", menuItemName: "Artisanal Burrata & San Marzano Pizza", rating: 5 }
    ],
    createdAt: "2026-02-06",
    isFeatured: false,
    isHidden: false
  }
];

export const initialStaffAccounts: StaffAccount[] = [
  {
    id: "staff-01",
    name: "Chef Marcus (Line Master)",
    phone: "9876543210",
    employeeId: "KITCHEN01",
    role: "kitchen_staff",
    permissions: ["view_orders", "update_order_status"],
    createdAt: "2026-01-01"
  },
  {
    id: "staff-02",
    name: "David Ross (Restaurant Manager)",
    phone: "9876543211",
    employeeId: "MGR01",
    role: "manager",
    permissions: ["view_orders", "manage_customers", "view_reports"],
    createdAt: "2026-01-01"
  },
  {
    id: "staff-03",
    name: "Evelyn Thorne (Restaurant Owner)",
    phone: "9876543212",
    employeeId: "ADMIN01",
    role: "admin",
    permissions: ["full_access"],
    createdAt: "2026-01-01"
  },
  {
    id: "staff-04",
    name: "Jessica Taylor (Head Cashier)",
    phone: "9876543213",
    employeeId: "CASHIER01",
    role: "cashier",
    permissions: ["view_orders", "cash_register"],
    createdAt: "2026-01-15"
  }
];

export const initialLoyaltyRewards: LoyaltyReward[] = [
  {
    id: "r-1",
    title: "$10 Discount Coupon",
    costPoints: 500,
    discountAmount: 10,
    description: "Redeem 500 points to get $10 off your current or next dining bill!"
  },
  {
    id: "r-2",
    title: "Free Artisanal Dessert",
    costPoints: 700,
    isFreeItem: true,
    freeItemName: "Valrhona Molten Gold Chocolate Lava Cake",
    description: "Redeem 700 points for a complimentary warm lava cake or gourmet cheesecake."
  },
  {
    id: "r-3",
    title: "20% Discount Coupon",
    costPoints: 1000,
    discountPercent: 20,
    description: "Redeem 1000 points for an exclusive 20% OFF total bill coupon!"
  },
  {
    id: "r-4",
    title: "Free Signature Drink",
    costPoints: 300,
    isFreeItem: true,
    freeItemName: "Matcha Yuzu Sparkling Elixir",
    description: "Redeem 300 points for a refreshing artisanal cocktail or mocktail."
  }
];

export const initialRestaurantInfo: RestaurantInfo = {
  id: "dineflow-luxe-01",
  name: "DineFlow Luxe Bistro",
  tagline: "Contemporary Fine Dining & Artisanal Delicacies",
  logo: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=300&q=80",
  address: "742 Royal Plaza Boulevard, Gourmet District",
  phone: "+1 (800) 555-DINE",
  instagramHandle: "@dineflowluxe",
  currency: "$"
};

export const initialTables: Table[] = [
  { id: "t-01", tableNumber: "01", seats: 2, status: "occupied" },
  { id: "t-02", tableNumber: "02", seats: 4, status: "available" },
  { id: "t-03", tableNumber: "03", seats: 4, status: "reserved" },
  { id: "t-04", tableNumber: "04", seats: 6, status: "available" },
  { id: "t-05", tableNumber: "05", seats: 2, status: "occupied", currentOrderId: "ORD-105" },
  { id: "t-06", tableNumber: "06", seats: 8, status: "available" },
  { id: "t-07", tableNumber: "07", seats: 4, status: "available" },
  { id: "t-08", tableNumber: "08", seats: 2, status: "occupied" },
  { id: "t-09", tableNumber: "09", seats: 6, status: "available" },
  { id: "t-10", tableNumber: "10", seats: 4, status: "available" },
];

export const initialMenuItems: MenuItem[] = [
  // Pizza
  {
    id: "p-01",
    name: "Truffle Burrata & Wood-Fired Margherita",
    category: "Pizza",
    description: "San Marzano tomato reduction, artisanal fresh burrata, shaved black truffle oil, fresh basil leaves.",
    price: 22.99,
    image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=800&q=80",
    isVeg: true,
    foodType: "veg",
    spiceLevel: "mild",
    dietaryInfo: ["healthy-choice"],
    ingredients: ["Fresh Burrata", "Truffle Oil", "San Marzano Tomatoes", "Fresh Basil"],
    cuisineType: "Italian",
    keywords: ["pizza", "truffle", "burrata", "margherita", "cheese"],
    rating: 4.9,
    preparationTime: 18,
    available: true,
    isBestseller: true,
    isChefSpecial: true,
    isCustomerFavourite: true,
    customizationGroups: [
      {
        id: "crust",
        name: "Choose Crust",
        required: true,
        options: [
          { id: "thin", name: "Artisanal Thin Crust", price: 0 },
          { id: "sourdough", name: "House Sourdough", price: 2.5 },
          { id: "glutenfree", name: "Gluten-Free Cauliflower Crust", price: 3.5 }
        ]
      },
      {
        id: "cheese",
        name: "Extra Cheese & Toppings",
        required: false,
        options: [
          { id: "double-burrata", name: "Extra Fresh Burrata Ball", price: 4.5 },
          { id: "truffle-oil", name: "Drizzle Aged Truffle Glaze", price: 2.0 },
          { id: "chili-honey", name: "Hot Chili Honey Drizzle", price: 1.5 }
        ]
      }
    ]
  },
  {
    id: "p-02",
    name: "Smoked Pepperoni & Hot Honey Feast",
    category: "Pizza",
    description: "Crispy artisan pepperoni cupping, house mozzarella, crushed chili flakes, wildflower hot honey infusion.",
    price: 24.50,
    image: "https://images.unsplash.com/photo-1628840042765-356cda07504e?auto=format&fit=crop&w=800&q=80",
    isVeg: false,
    foodType: "non-veg",
    spiceLevel: "spicy",
    ingredients: ["Artisan Pepperoni", "Mozzarella", "Wildflower Hot Honey", "Chili Flakes"],
    cuisineType: "Italian American",
    keywords: ["pepperoni", "spicy", "pizza", "honey", "meat"],
    rating: 4.8,
    preparationTime: 16,
    available: true,
    isBestseller: true,
    isTodaysSpecial: true,
    customizationGroups: [
      {
        id: "spice",
        name: "Spice Level",
        required: false,
        options: [
          { id: "mild", name: "Mild Spice", price: 0 },
          { id: "medium", name: "Original Spicy Kick", price: 0 },
          { id: "extra-hot", name: "Ghost Pepper Honey Infusion", price: 1.0 }
        ]
      }
    ]
  },
  {
    id: "p-03",
    name: "Wild Mushroom & Fontina Bianca",
    category: "Pizza",
    description: "Roasted shiitake, cremini, and oyster mushrooms with fontina cream, caramelized shallots, thyme.",
    price: 21.00,
    image: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?auto=format&fit=crop&w=800&q=80",
    isVeg: true,
    foodType: "vegan",
    spiceLevel: "mild",
    dietaryInfo: ["low-calorie", "healthy-choice"],
    ingredients: ["Shiitake Mushrooms", "Cremini", "Fontina Cream", "Caramelized Shallots"],
    cuisineType: "Italian",
    keywords: ["mushroom", "pizza", "vegan", "white pizza"],
    rating: 4.7,
    preparationTime: 15,
    available: true
  },
  {
    id: "p-04",
    name: "Paneer Tikka Charcoal Crust Pizza",
    category: "Pizza",
    description: "Tandoor charred paneer cubes, roasted bell peppers, activated charcoal sourdough crust, mint yogurt glaze.",
    price: 19.99,
    image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=800&q=80",
    isVeg: true,
    foodType: "veg",
    spiceLevel: "spicy",
    dietaryInfo: ["high-protein"],
    ingredients: ["Charred Paneer", "Bell Peppers", "Charcoal Sourdough", "Mint Chutney"],
    cuisineType: "Fusion Indian",
    keywords: ["paneer", "tikka", "pizza", "charcoal", "indian"],
    rating: 4.88,
    preparationTime: 17,
    available: true,
    isCustomerFavourite: true,
    isNewArrival: true
  },

  // Burger
  {
    id: "b-01",
    name: "Prime Wagyu Gold Reserve Burger",
    category: "Burger",
    description: "8oz Dry-aged Wagyu beef patty, smoked applewood bacon, aged sharp cheddar, truffle aioli on toasted brioche.",
    price: 26.99,
    image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=800&q=80",
    isVeg: false,
    foodType: "non-veg",
    spiceLevel: "mild",
    dietaryInfo: ["high-protein"],
    ingredients: ["Wagyu Beef Patty", "Applewood Bacon", "Aged Cheddar", "Brioche Bun", "Truffle Aioli"],
    cuisineType: "American",
    keywords: ["burger", "wagyu", "beef", "bacon", "cheese"],
    rating: 4.95,
    preparationTime: 15,
    available: true,
    isBestseller: true,
    isChefSpecial: true,
    customizationGroups: [
      {
        id: "doneness",
        name: "Patty Doneness",
        required: true,
        options: [
          { id: "med-rare", name: "Medium Rare (Juicy Pink Center)", price: 0 },
          { id: "medium", name: "Medium", price: 0 },
          { id: "well-done", name: "Well Done", price: 0 }
        ]
      },
      {
        id: "extras",
        name: "Burger Add-ons",
        required: false,
        options: [
          { id: "extra-patty", name: "Add Second Wagyu Patty", price: 8.0 },
          { id: "fried-egg", name: "Organic Fried Egg", price: 2.0 },
          { id: "avocado", name: "Sliced Hass Avocado", price: 2.5 }
        ]
      }
    ]
  },
  {
    id: "b-02",
    name: "Crispy Nashville Hot Chicken Glaze",
    category: "Burger",
    description: "Buttermilk-brined crispy fried chicken breast tossed in hot chili oil, spicy pickles, house purple slaw.",
    price: 19.50,
    image: "https://images.unsplash.com/photo-1625813506062-0aeb1d7a094b?auto=format&fit=crop&w=800&q=80",
    isVeg: false,
    foodType: "non-veg",
    spiceLevel: "extra-spicy",
    ingredients: ["Crispy Chicken Breast", "Hot Chili Oil", "Pickles", "Purple Slaw"],
    cuisineType: "American",
    keywords: ["chicken", "hot chicken", "spicy", "burger", "nashville"],
    rating: 4.85,
    preparationTime: 14,
    available: true,
    isCustomerFavourite: true
  },
  {
    id: "b-03",
    name: "Smoked Black Bean & Avocado Smash",
    category: "Burger",
    description: "House-crafted quinoa and black bean patty, vegan chipotle crema, grilled onions, Hass avocado, brioche bun.",
    price: 17.99,
    image: "https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=800&q=80",
    isVeg: true,
    foodType: "vegan",
    spiceLevel: "mild",
    dietaryInfo: ["high-protein", "low-calorie", "healthy-choice", "gluten-free"],
    ingredients: ["Quinoa & Black Bean Patty", "Hass Avocado", "Vegan Chipotle Crema", "Grilled Onions"],
    cuisineType: "Vegan American",
    keywords: ["burger", "vegan", "black bean", "avocado", "healthy"],
    rating: 4.7,
    preparationTime: 12,
    available: true
  },

  // Main Course & Indian
  {
    id: "m-01",
    name: "Herb-Crusted Filet Mignon 10oz",
    category: "Main Course",
    description: "Center-cut Angus filet mignon with rosemary garlic butter, potato puree, and red wine demi-glace reduction.",
    price: 42.00,
    image: "https://images.unsplash.com/photo-1558030006-450675393462?auto=format&fit=crop&w=800&q=80",
    isVeg: false,
    foodType: "non-veg",
    spiceLevel: "mild",
    dietaryInfo: ["high-protein", "gluten-free"],
    ingredients: ["Center-Cut Angus Filet", "Rosemary Garlic Butter", "Potato Puree", "Red Wine Demi-Glace"],
    cuisineType: "French American",
    keywords: ["steak", "mignon", "filet", "beef", "main course"],
    rating: 4.98,
    preparationTime: 22,
    available: true,
    isChefSpecial: true,
    isLimitedItem: true
  },
  {
    id: "m-02",
    name: "Pan-Seared Chilean Sea Bass",
    category: "Main Course",
    description: "Sustainably caught sea bass over saffron risotto, braised baby bok choy, citrus lemongrass beurre blanc.",
    price: 38.50,
    image: "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&w=800&q=80",
    isVeg: false,
    foodType: "non-veg",
    spiceLevel: "mild",
    dietaryInfo: ["high-protein", "gluten-free", "healthy-choice"],
    ingredients: ["Chilean Sea Bass", "Saffron Risotto", "Bok Choy", "Lemongrass Beurre Blanc"],
    cuisineType: "Seafood Fusion",
    keywords: ["seabass", "fish", "seafood", "risotto", "healthy"],
    rating: 4.9,
    preparationTime: 20,
    available: true,
    isTodaysSpecial: true
  },
  {
    id: "m-03",
    name: "Royal Paneer Tikka Butter Masala",
    category: "Main Course",
    description: "Tandoor-charred cottage cheese cubes simmered in rich creamy cashew tomatoes and fragrant fenugreek gravy.",
    price: 22.00,
    image: "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?auto=format&fit=crop&w=800&q=80",
    isVeg: true,
    foodType: "veg",
    spiceLevel: "medium",
    dietaryInfo: ["high-protein"],
    ingredients: ["Charred Paneer", "Cashew Tomato Gravy", "Butter", "Fenugreek Leaves"],
    cuisineType: "North Indian",
    keywords: ["paneer", "butter masala", "tikka", "curry", "indian", "main course"],
    rating: 4.88,
    preparationTime: 18,
    available: true,
    isBestseller: true,
    isCustomerFavourite: true
  },
  {
    id: "ind-01",
    name: "Dal Makhani Velvet Reserve",
    category: "Indian",
    description: "Slow-cooked 36-hour black lentils infused with white butter, vine-ripened tomatoes, and aromatic whole spices.",
    price: 18.50,
    image: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=800&q=80",
    isVeg: true,
    foodType: "veg",
    spiceLevel: "mild",
    dietaryInfo: ["high-protein", "gluten-free"],
    ingredients: ["Black Lentils", "White Butter", "Fresh Cream", "Garlic", "Spices"],
    cuisineType: "North Indian",
    keywords: ["dal", "makhani", "lentils", "curry", "indian", "butter dal"],
    rating: 4.92,
    preparationTime: 15,
    available: true,
    isBestseller: true,
    isCustomerFavourite: true
  },
  {
    id: "ind-02",
    name: "Tandoori Smoked Chicken Tikka",
    category: "Indian",
    description: "Boneless chicken thighs marinated in hung curd, garlic, ginger, and aromatic Kashmiri chili, charred in clay oven.",
    price: 21.50,
    image: "https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?auto=format&fit=crop&w=800&q=80",
    isVeg: false,
    foodType: "non-veg",
    spiceLevel: "spicy",
    dietaryInfo: ["high-protein", "gluten-free", "low-calorie"],
    ingredients: ["Chicken Thighs", "Hung Yoghurt", "Kashmiri Chili", "Garlic Mint Chutney"],
    cuisineType: "North Indian",
    keywords: ["chicken", "tikka", "tandoori", "kebabs", "indian", "spicy"],
    rating: 4.86,
    preparationTime: 16,
    available: true,
    isBestseller: true
  },

  // South Indian & Starters
  {
    id: "sind-01",
    name: "Crispy Masala Dosa & Trio Chutney",
    category: "South Indian",
    description: "Golden fermented rice-crepe stuffed with spiced mustard potato mash, served with piping hot Sambar & coconut chutneys.",
    price: 14.00,
    image: "https://images.unsplash.com/photo-1668236543090-82eba5ee5976?auto=format&fit=crop&w=800&q=80",
    isVeg: true,
    foodType: "vegan",
    spiceLevel: "medium",
    dietaryInfo: ["gluten-free", "vegan", "healthy-choice"],
    ingredients: ["Fermented Rice & Crepe Batter", "Spiced Potato Mash", "Coconut Chutney", "Piping Sambar"],
    cuisineType: "South Indian",
    keywords: ["dosa", "masala dosa", "sambar", "chutney", "south indian", "vegan"],
    rating: 4.89,
    preparationTime: 10,
    available: true,
    isBestseller: true,
    isNewArrival: true
  },
  {
    id: "sind-02",
    name: "Steamed Button Idli & Gunpowder Ghee",
    category: "South Indian",
    description: "Pillow-soft mini steamed rice cakes drenched in aromatic roasted podi spice mix and warm clarified ghee.",
    price: 11.50,
    image: "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=800&q=80",
    isVeg: true,
    foodType: "veg",
    spiceLevel: "medium",
    dietaryInfo: ["gluten-free", "low-calorie", "healthy-choice"],
    ingredients: ["Steamed Rice Cakes", "Gunpowder Podi Spice", "Warm Pure Ghee", "Sambar"],
    cuisineType: "South Indian",
    keywords: ["idli", "button idli", "podi", "ghee", "south indian"],
    rating: 4.8,
    preparationTime: 8,
    available: true,
    isTodaysSpecial: true
  },
  {
    id: "st-01",
    name: "Garlic Bread & Truffle Cheese Melt",
    category: "Starters",
    description: "Toasted artisan sourdough brushed with confit garlic butter, melted fior di latte mozzarella, truffle honey.",
    price: 12.00,
    image: "https://images.unsplash.com/photo-1573140247632-f8fd74997d5c?auto=format&fit=crop&w=800&q=80",
    isVeg: true,
    foodType: "veg",
    spiceLevel: "mild",
    ingredients: ["Artisan Sourdough", "Confit Garlic Butter", "Fior Di Latte Mozzarella", "Truffle Honey"],
    cuisineType: "Italian Starter",
    keywords: ["garlic bread", "cheese", "starter", "appetizer", "truffle"],
    rating: 4.9,
    preparationTime: 8,
    available: true,
    isBestseller: true,
    isCustomerFavourite: true
  },
  {
    id: "st-02",
    name: "Tandoori Paneer Tikka Skewers",
    category: "Starters",
    description: "Juicy organic cottage cheese blocks marinated in spiced yogurt and grilled over glowing charcoal embers.",
    price: 16.50,
    image: "https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?auto=format&fit=crop&w=800&q=80",
    isVeg: true,
    foodType: "veg",
    spiceLevel: "spicy",
    dietaryInfo: ["high-protein", "gluten-free"],
    ingredients: ["Organic Cottage Cheese", "Tandoori Spice Marination", "Bell Peppers", "Mint Dip"],
    cuisineType: "North Indian Starter",
    keywords: ["paneer", "tikka", "starter", "kebabs", "paneer starter", "tandoori"],
    rating: 4.85,
    preparationTime: 12,
    available: true,
    isChefSpecial: true
  },

  // Chinese
  {
    id: "c-01",
    name: "Szechuan Fire Chili Dumplings (8pcs)",
    category: "Chinese",
    description: "Steamed chicken & scallion dim sum drenched in house spiced garlic chili oil, sesame seeds, scallions.",
    price: 16.50,
    image: "https://images.unsplash.com/photo-1541696432-82c6da8ce7bf?auto=format&fit=crop&w=800&q=80",
    isVeg: false,
    foodType: "non-veg",
    spiceLevel: "extra-spicy",
    ingredients: ["Chicken Dim Sum", "Chili Oil", "Garlic", "Roasted Sesame Seeds"],
    cuisineType: "Chinese",
    keywords: ["dumplings", "dim sum", "chinese", "szechuan", "spicy"],
    rating: 4.8,
    preparationTime: 12,
    available: true,
    isBestseller: true
  },
  {
    id: "c-02",
    name: "Wok-Tossed Truffle Hakka Noodles",
    category: "Chinese",
    description: "Hand-pulled noodles with crisp julienned bell peppers, wild mushrooms, and black truffle sesame glaze.",
    price: 18.99,
    image: "https://images.unsplash.com/photo-1612927601601-6638404737ce?auto=format&fit=crop&w=800&q=80",
    isVeg: true,
    foodType: "vegan",
    spiceLevel: "mild",
    dietaryInfo: ["vegan"],
    ingredients: ["Hand-Pulled Noodles", "Wild Mushrooms", "Julienned Peppers", "Truffle Glaze"],
    cuisineType: "Indo-Chinese",
    keywords: ["noodles", "hakka noodles", "chinese", "truffle", "vegan"],
    rating: 4.75,
    preparationTime: 12,
    available: true,
    isCustomerFavourite: true
  },
  {
    id: "c-03",
    name: "Crispy Kung Pao Cauliflower & Cashew",
    category: "Chinese",
    description: "Crispy tempura cauliflower tossed with charred dried chilies, toasted cashews, sweet soy reduction.",
    price: 17.00,
    image: "https://images.unsplash.com/photo-1525755662778-989d0524087e?auto=format&fit=crop&w=800&q=80",
    isVeg: true,
    foodType: "vegan",
    spiceLevel: "spicy",
    dietaryInfo: ["vegan", "healthy-choice"],
    ingredients: ["Tempura Cauliflower", "Toasted Cashews", "Charred Chili", "Sweet Soy"],
    cuisineType: "Chinese",
    keywords: ["cauliflower", "kung pao", "chinese", "vegan", "cashew"],
    rating: 4.7,
    preparationTime: 14,
    available: true
  },

  // Drinks
  {
    id: "d-01",
    name: "Smoked Golden Bourbon Old Fashioned",
    category: "Drinks",
    description: "Premium single barrel bourbon, Angostura bitters, flamed orange peel, served under oak smoke dome.",
    price: 16.00,
    image: "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&w=800&q=80",
    isVeg: true,
    foodType: "vegan",
    spiceLevel: "mild",
    ingredients: ["Single Barrel Bourbon", "Angostura Bitters", "Flamed Orange Peel"],
    cuisineType: "Cocktails",
    keywords: ["bourbon", "old fashioned", "cocktail", "drink", "alcohol"],
    rating: 4.92,
    preparationTime: 5,
    available: true,
    isChefSpecial: true
  },
  {
    id: "d-02",
    name: "Matcha Yuzu Sparkling Elixir",
    category: "Drinks",
    description: "Japanese Ceremonial Matcha, fresh Yuzu juice, sparkling mineral water, mint & agave nectar.",
    price: 8.50,
    image: "https://images.unsplash.com/photo-1536935338788-846bb9981813?auto=format&fit=crop&w=800&q=80",
    isVeg: true,
    foodType: "vegan",
    spiceLevel: "mild",
    dietaryInfo: ["sugar-free", "low-calorie", "healthy-choice"],
    ingredients: ["Ceremonial Matcha", "Yuzu Juice", "Sparkling Water", "Mint", "Agave"],
    cuisineType: "Beverages",
    keywords: ["matcha", "yuzu", "sparkling", "elixir", "drink", "healthy"],
    rating: 4.8,
    preparationTime: 4,
    available: true,
    isBestseller: true
  },
  {
    id: "d-03",
    name: "Passionfruit Mango Dragonfruit Cooler",
    category: "Drinks",
    description: "Freshly pressed tropical passionfruit juice, diced mango cubes, coconut water, dragonfruit ice spheres.",
    price: 7.99,
    image: "https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&w=800&q=80",
    isVeg: true,
    foodType: "vegan",
    spiceLevel: "mild",
    dietaryInfo: ["low-calorie"],
    ingredients: ["Passionfruit Juice", "Mango Cubes", "Coconut Water", "Dragonfruit"],
    cuisineType: "Mocktails",
    keywords: ["cooler", "mango", "passionfruit", "dragonfruit", "drink", "mocktail"],
    rating: 4.85,
    preparationTime: 4,
    available: true
  },

  // Desserts
  {
    id: "des-01",
    name: "Valrhona Molten Gold Chocolate Lava Cake",
    category: "Desserts",
    description: "Warm 70% Dark Valrhona chocolate cake with liquid gold chocolate center, served with Madagascar vanilla gelati.",
    price: 14.50,
    image: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=800&q=80",
    isVeg: true,
    foodType: "eggless",
    spiceLevel: "mild",
    ingredients: ["70% Valrhona Dark Chocolate", "Madagascar Vanilla Gelato", "Gold Powder"],
    cuisineType: "French Desserts",
    keywords: ["chocolate", "lava cake", "molten cake", "dessert", "gold"],
    rating: 4.96,
    preparationTime: 12,
    available: true,
    isBestseller: true,
    isCustomerFavourite: true
  },
  {
    id: "des-02",
    name: "Pistachio Rosewater Cheesecake",
    category: "Desserts",
    description: "Creamy baked New York style cheesecake infused with Iranian rosewater, crushed bronzed pistachios, gold leaf.",
    price: 13.00,
    image: "https://images.unsplash.com/photo-1533134242443-d4fd215305ad?auto=format&fit=crop&w=800&q=80",
    isVeg: true,
    foodType: "veg",
    spiceLevel: "mild",
    ingredients: ["New York Cheesecake", "Iranian Rosewater", "Bronzed Pistachio", "Gold Leaf"],
    cuisineType: "Gourmet Desserts",
    keywords: ["cheesecake", "pistachio", "rosewater", "dessert"],
    rating: 4.88,
    preparationTime: 5,
    available: true,
    isChefSpecial: true
  },

  // Salad
  {
    id: "s-01",
    name: "Avocado, Citrus & Heirloom Burrata Salad",
    category: "Salad",
    description: "Blood oranges, pink grapefruit, organic baby arugula, sliced Hass avocado, candied pecans, citrus vinaigrette.",
    price: 16.00,
    image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=800&q=80",
    isVeg: true,
    foodType: "veg",
    spiceLevel: "mild",
    dietaryInfo: ["low-calorie", "gluten-free", "healthy-choice"],
    ingredients: ["Hass Avocado", "Blood Oranges", "Burrata Cheese", "Baby Arugula", "Pecans"],
    cuisineType: "Mediterranean Salad",
    keywords: ["salad", "avocado", "burrata", "citrus", "healthy"],
    rating: 4.82,
    preparationTime: 8,
    available: true
  },
  {
    id: "s-02",
    name: "Charred Caesar & Crispy Chickpea Crunch",
    category: "Salad",
    description: "Lightly charred artisan romaine heart, house vegan Caesar dressing, sourdough garlic croutons, aged parmesan.",
    price: 14.50,
    image: "https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=800&q=80",
    isVeg: true,
    foodType: "vegan",
    spiceLevel: "mild",
    dietaryInfo: ["high-protein", "vegan", "healthy-choice"],
    ingredients: ["Charred Romaine", "Roasted Chickpeas", "Vegan Caesar Dressing", "Sourdough Croutons"],
    cuisineType: "Healthy Salad",
    keywords: ["caesar salad", "salad", "vegan", "chickpeas", "healthy"],
    rating: 4.75,
    preparationTime: 8,
    available: true
  }
];

export const initialCustomers: Customer[] = [
  {
    id: "c-101",
    name: "Rahul Verma",
    mobile: "+1 9876543210",
    birthday: "1994-08-15",
    instagramId: "@rahul_gourmet",
    totalOrders: 12,
    totalSpending: 485.50,
    visitsCount: 12,
    lastVisitDate: "2026-08-05",
    loyaltyPoints: 680,
    offers: [
      {
        id: "off-family-22",
        title: "Family Visit Special Discount",
        discountPercent: 22,
        offerType: "family",
        code: "FAMILY22",
        description: "Special 22% OFF discount on family table dining",
        expiresAt: "2026-08-31",
        isUsed: false
      }
    ],
    visitHistory: [
      { id: "v-1", date: "2026-01-12", month: "January", spending: 75.00, orderId: "ORD-012", category: "Pizza" },
      { id: "v-2", date: "2026-01-24", month: "January", spending: 82.50, orderId: "ORD-028", category: "Main Course" },
      { id: "v-3", date: "2026-01-29", month: "January", spending: 60.00, orderId: "ORD-035", category: "Burger" },
      { id: "v-4", date: "2026-01-31", month: "January", spending: 95.00, orderId: "ORD-041", category: "Pizza" },
      { id: "v-5", date: "2026-02-14", month: "February", spending: 110.00, orderId: "ORD-059", category: "Main Course" },
      { id: "v-6", date: "2026-02-28", month: "February", spending: 63.00, orderId: "ORD-072", category: "Chinese" },
      { id: "v-7", date: "2026-03-05", month: "March", spending: 88.00, orderId: "ORD-084", category: "Pizza" },
      { id: "v-8", date: "2026-03-12", month: "March", spending: 92.00, orderId: "ORD-091", category: "Burger" },
      { id: "v-9", date: "2026-03-18", month: "March", spending: 55.00, orderId: "ORD-098", category: "Drinks" },
      { id: "v-10", date: "2026-03-22", month: "March", spending: 78.00, orderId: "ORD-101", category: "Main Course" },
      { id: "v-11", date: "2026-03-27", month: "March", spending: 64.00, orderId: "ORD-103", category: "Pizza" },
      { id: "v-12", date: "2026-08-05", month: "August", spending: 118.00, orderId: "ORD-105", category: "Pizza" },
    ],
    consent: {
      id: "con-101",
      customerId: "c-101",
      termsAccepted: true,
      privacyAccepted: true,
      marketingConsent: true,
      acceptedDate: "2026-08-01T09:30:00.000Z",
      ipAddress: "192.168.1.102",
      deviceInformation: "Mobile Safari / iOS 17"
    }
  },
  {
    id: "c-102",
    name: "Sophia Chen",
    mobile: "+1 8882345678",
    birthday: "1997-11-20",
    instagramId: "@sophiacooking",
    totalOrders: 6,
    totalSpending: 290.00,
    visitsCount: 6,
    lastVisitDate: "2026-08-04",
    loyaltyPoints: 340,
    offers: [
      {
        id: "off-couple-15",
        title: "Couple Date Night Offer",
        discountPercent: 15,
        offerType: "couple",
        code: "COUPLE15",
        description: "Enjoy 15% OFF your next dining experience for two",
        expiresAt: "2026-08-28",
        isUsed: false
      }
    ],
    visitHistory: [
      { id: "v-13", date: "2026-02-10", month: "February", spending: 48.00, orderId: "ORD-051", category: "Burger" },
      { id: "v-14", date: "2026-02-20", month: "February", spending: 52.00, orderId: "ORD-065", category: "Chinese" },
      { id: "v-15", date: "2026-03-01", month: "March", spending: 60.00, orderId: "ORD-080", category: "Main Course" },
      { id: "v-16", date: "2026-03-15", month: "March", spending: 65.00, orderId: "ORD-094", category: "Pizza" },
      { id: "v-17", date: "2026-07-28", month: "July", spending: 35.00, orderId: "ORD-100", category: "Desserts" },
      { id: "v-18", date: "2026-08-04", month: "August", spending: 30.00, orderId: "ORD-104", category: "Drinks" }
    ],
    consent: {
      id: "con-102",
      customerId: "c-102",
      termsAccepted: true,
      privacyAccepted: true,
      marketingConsent: true,
      acceptedDate: "2026-08-02T14:15:00.000Z",
      ipAddress: "192.168.1.144",
      deviceInformation: "Chrome Mobile / Android 14"
    }
  },
  {
    id: "c-103",
    name: "Michael Vance",
    mobile: "+1 5559998877",
    birthday: "1988-03-04",
    instagramId: "@mvance_foodie",
    totalOrders: 3,
    totalSpending: 145.20,
    visitsCount: 3,
    lastVisitDate: "2026-08-01",
    loyaltyPoints: 180,
    offers: [
      {
        id: "off-single-10",
        title: "Quick Bite Special",
        discountPercent: 10,
        offerType: "single",
        code: "SINGLE10",
        description: "Get 10% OFF on your next lunch order",
        expiresAt: "2026-08-25",
        isUsed: false
      }
    ],
    visitHistory: [
      { id: "v-19", date: "2026-03-10", month: "March", spending: 45.00, orderId: "ORD-088", category: "Main Course" },
      { id: "v-20", date: "2026-07-20", month: "July", spending: 50.20, orderId: "ORD-099", category: "Pizza" },
      { id: "v-21", date: "2026-08-01", month: "August", spending: 50.00, orderId: "ORD-102", category: "Burger" }
    ],
    consent: {
      id: "con-103",
      customerId: "c-103",
      termsAccepted: true,
      privacyAccepted: true,
      marketingConsent: false,
      acceptedDate: "2026-08-01T18:45:00.000Z",
      ipAddress: "172.16.0.45",
      deviceInformation: "Safari Desktop / macOS Sonoma"
    }
  }
];

export const initialOrders: Order[] = [
  {
    id: "ORD-105",
    orderNumber: "#105",
    restaurantId: "dineflow-luxe-01",
    tableNumber: "05",
    customerId: "c-101",
    customerName: "Rahul Verma",
    customerMobile: "+1 9876543210",
    source: "qr",
    items: [
      {
        menuItemId: "p-01",
        name: "Truffle Burrata & Wood-Fired Margherita",
        quantity: 2,
        unitPrice: 22.99,
        customizationsText: "Artisanal Thin Crust, Hot Chili Honey Drizzle",
        totalItemPrice: 48.98
      },
      {
        menuItemId: "d-03",
        name: "Passionfruit Mango Dragonfruit Cooler",
        quantity: 1,
        unitPrice: 7.99,
        customizationsText: "Standard Ice",
        totalItemPrice: 7.99
      },
      {
        menuItemId: "des-01",
        name: "Valrhona Molten Gold Chocolate Lava Cake",
        quantity: 1,
        unitPrice: 14.50,
        customizationsText: "Madagascar Vanilla Gelati",
        totalItemPrice: 14.50
      }
    ],
    subtotal: 71.47,
    discount: 10.72,
    discountName: "Welcome 15% OFF",
    tax: 4.86,
    totalAmount: 65.61,
    status: "preparing",
    createdAt: "2026-08-06T10:15:00Z",
    estimatedTimeMinutes: 18,
    paymentStatus: "paid",
    notes: "Please make the Truffle pizza extra crispy crust if possible."
  },
  {
    id: "ORD-104",
    orderNumber: "#104",
    restaurantId: "dineflow-luxe-01",
    tableNumber: "01",
    customerId: "c-102",
    customerName: "Sophia Chen",
    customerMobile: "+1 8882345678",
    source: "qr",
    items: [
      {
        menuItemId: "b-01",
        name: "Prime Wagyu Gold Reserve Burger",
        quantity: 1,
        unitPrice: 26.99,
        customizationsText: "Medium Rare, Sliced Hass Avocado",
        totalItemPrice: 29.49
      },
      {
        menuItemId: "d-01",
        name: "Smoked Golden Bourbon Old Fashioned",
        quantity: 2,
        unitPrice: 16.00,
        customizationsText: "Standard",
        totalItemPrice: 32.00
      }
    ],
    subtotal: 61.49,
    discount: 0,
    tax: 4.92,
    totalAmount: 66.41,
    status: "accepted",
    createdAt: "2026-08-06T10:20:00Z",
    estimatedTimeMinutes: 15,
    paymentStatus: "paid"
  },
  {
    id: "ORD-103",
    orderNumber: "#103",
    restaurantId: "dineflow-luxe-01",
    tableNumber: "Delivery",
    customerName: "Ankit Kapoor (Zomato #ZM-902)",
    customerMobile: "+1 4155551234",
    source: "zomato",
    commissionFee: 11.20,
    items: [
      {
        menuItemId: "m-01",
        name: "Herb-Crusted Filet Mignon 10oz",
        quantity: 1,
        unitPrice: 42.00,
        customizationsText: "Medium",
        totalItemPrice: 42.00
      },
      {
        menuItemId: "s-01",
        name: "Avocado, Citrus & Heirloom Burrata Salad",
        quantity: 1,
        unitPrice: 16.00,
        customizationsText: "Dressing on the side",
        totalItemPrice: 16.00
      }
    ],
    subtotal: 58.00,
    discount: 0,
    tax: 4.64,
    totalAmount: 62.64,
    status: "ready",
    createdAt: "2026-08-06T09:50:00Z",
    estimatedTimeMinutes: 20,
    paymentStatus: "paid"
  },
  {
    id: "ORD-102",
    orderNumber: "#102",
    restaurantId: "dineflow-luxe-01",
    tableNumber: "Delivery",
    customerName: "Simran Kaur (Swiggy #SW-441)",
    customerMobile: "+1 3125559876",
    source: "swiggy",
    commissionFee: 10.50,
    items: [
      {
        menuItemId: "p-01",
        name: "Truffle Burrata & Wood-Fired Margherita",
        quantity: 1,
        unitPrice: 22.99,
        customizationsText: "House Sourdough",
        totalItemPrice: 25.49
      },
      {
        menuItemId: "des-01",
        name: "Valrhona Molten Gold Chocolate Lava Cake",
        quantity: 1,
        unitPrice: 14.50,
        customizationsText: "Extra Vanilla Gelati",
        totalItemPrice: 14.50
      }
    ],
    subtotal: 39.99,
    discount: 5.00,
    discountName: "Swiggy Gold Coupon",
    tax: 3.20,
    totalAmount: 38.19,
    status: "completed",
    createdAt: "2026-08-06T09:30:00Z",
    estimatedTimeMinutes: 25,
    paymentStatus: "paid"
  }
];

export const initialInstagramCampaigns: InstagramCampaign[] = [
  {
    id: "ig-01",
    customerId: "c-101",
    customerName: "Rahul Verma",
    instagramId: "@rahul_gourmet",
    postType: "story",
    postUrl: "https://instagram.com/stories/rahul_gourmet/34211029",
    status: "approved",
    pointsAwarded: 15,
    submittedAt: "2026-08-05T14:30:00Z"
  },
  {
    id: "ig-02",
    customerId: "c-102",
    customerName: "Sophia Chen",
    instagramId: "@sophiacooking",
    postType: "reel",
    postUrl: "https://instagram.com/reel/C89xK123_l9",
    status: "pending",
    pointsAwarded: 30,
    submittedAt: "2026-08-06T09:10:00Z"
  }
];
