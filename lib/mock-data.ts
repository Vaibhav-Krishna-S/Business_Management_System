import type {
  MenuItem,
  Order,
  RestaurantTable,
  InventoryItem,
  Supplier,
  PurchaseOrder,
  Customer,
  StaffMember,
  Expense,
  Automation,
  Notification,
  KPIData,
  BusinessHealthScore,
  RevenueDataPoint,
  CategorySales,
  TopSellingItem,
  OperationalAlert,
  RecommendedAction,
  StockMovement,
  WasteEntry,
  CustomerJourneyEntry,
} from './types';
import { getRelativeDate, getRelativeDay } from './format';

// ============================================================
// MENU ITEMS — 63 items
// ============================================================
const menuNames: { name: string; category: MenuItem['category']; price: number; foodCost: number }[] = [
  // Breakfast (8)
  { name: 'Aloo Paratha', category: 'Breakfast', price: 180, foodCost: 65 },
  { name: 'Gundruk & Aloo', category: 'Breakfast', price: 220, foodCost: 80 },
  { name: 'Sel Roti (4 pcs)', category: 'Breakfast', price: 150, foodCost: 55 },
  { name: 'Masala Omelette', category: 'Breakfast', price: 250, foodCost: 95 },
  { name: 'Chana Bhatura', category: 'Breakfast', price: 280, foodCost: 110 },
  { name: 'Puri Tarkari', category: 'Breakfast', price: 200, foodCost: 75 },
  { name: 'Honey Pancakes', category: 'Breakfast', price: 320, foodCost: 120 },
  { name: 'Mango Breakfast Bowl', category: 'Breakfast', price: 380, foodCost: 145 },
  // Starters (7)
  { name: 'Chicken Choila', category: 'Starters', price: 350, foodCost: 140 },
  { name: 'Paneer Tikka', category: 'Starters', price: 320, foodCost: 120 },
  { name: 'Chicken Chilli', category: 'Starters', price: 380, foodCost: 150 },
  { name: 'Veg Spring Rolls', category: 'Starters', price: 220, foodCost: 80 },
  { name: 'Sekuwa (Pork)', category: 'Starters', price: 420, foodCost: 180 },
  { name: 'Buff Chhoila', category: 'Starters', price: 360, foodCost: 145 },
  { name: 'Mango Salsa Nachos', category: 'Starters', price: 290, foodCost: 100 },
  // Momo (8)
  { name: 'Veg Momo (10 pcs)', category: 'Momo', price: 180, foodCost: 70 },
  { name: 'Chicken Momo (10 pcs)', category: 'Momo', price: 220, foodCost: 85 },
  { name: 'Buff Momo (10 pcs)', category: 'Momo', price: 240, foodCost: 95 },
  { name: 'Paneer Momo (10 pcs)', category: 'Momo', price: 260, foodCost: 100 },
  { name: 'Jhol Momo', category: 'Momo', price: 280, foodCost: 110 },
  { name: 'C-Momo (Fried)', category: 'Momo', price: 300, foodCost: 120 },
  { name: 'Momo Platter', category: 'Momo', price: 550, foodCost: 210 },
  { name: 'Steamed Veg Momo', category: 'Momo', price: 160, foodCost: 60 },
  // Main Course (12)
  { name: 'Nepali Chicken Thali', category: 'Main Course', price: 450, foodCost: 170 },
  { name: 'Mango Special Chicken', category: 'Main Course', price: 650, foodCost: 235 },
  { name: 'Butter Chicken', category: 'Main Course', price: 520, foodCost: 195 },
  { name: 'Paneer Butter Masala', category: 'Main Course', price: 480, foodCost: 175 },
  { name: 'Chicken Curry', category: 'Main Course', price: 460, foodCost: 180 },
  { name: 'Mutton Curry', category: 'Main Course', price: 680, foodCost: 290 },
  { name: 'Dal Bhat Tarkari', category: 'Main Course', price: 350, foodCost: 120 },
  { name: 'Newari Khaja Set', category: 'Main Course', price: 480, foodCost: 185 },
  { name: 'Fish Curry', category: 'Main Course', price: 580, foodCost: 250 },
  { name: 'Khasi Ko Masu', category: 'Main Course', price: 620, foodCost: 270 },
  { name: 'Dhido Thali', category: 'Main Course', price: 380, foodCost: 130 },
  { name: 'Yak Meat Curry', category: 'Main Course', price: 720, foodCost: 310 },
  // Rice (6)
  { name: 'Veg Fried Rice', category: 'Rice', price: 280, foodCost: 95 },
  { name: 'Chicken Fried Rice', category: 'Rice', price: 340, foodCost: 125 },
  { name: 'Mutton Biryani', category: 'Rice', price: 520, foodCost: 210 },
  { name: 'Chicken Biryani', category: 'Rice', price: 420, foodCost: 165 },
  { name: 'Veg Biryani', category: 'Rice', price: 320, foodCost: 110 },
  { name: 'Jeera Rice', category: 'Rice', price: 180, foodCost: 55 },
  // Noodles (5)
  { name: 'Veg Hakka Noodles', category: 'Noodles', price: 260, foodCost: 90 },
  { name: 'Chicken Chowmein', category: 'Noodles', price: 320, foodCost: 115 },
  { name: 'Thukpa (Chicken)', category: 'Noodles', price: 340, foodCost: 120 },
  { name: 'Schezwan Noodles', category: 'Noodles', price: 300, foodCost: 105 },
  { name: 'Buff Thukpa', category: 'Noodles', price: 360, foodCost: 135 },
  // Beverages (10)
  { name: 'Mango Lassi', category: 'Beverages', price: 180, foodCost: 55 },
  { name: 'Sweet Lassi', category: 'Beverages', price: 150, foodCost: 45 },
  { name: 'Masala Chai', category: 'Beverages', price: 80, foodCost: 20 },
  { name: 'Cold Coffee', category: 'Beverages', price: 220, foodCost: 80 },
  { name: 'Mango Smoothie', category: 'Beverages', price: 250, foodCost: 85 },
  { name: 'Fresh Lime Soda', category: 'Beverages', price: 120, foodCost: 35 },
  { name: 'Coca-Cola', category: 'Beverages', price: 90, foodCost: 50 },
  { name: 'Tongba (Millet Beer)', category: 'Beverages', price: 350, foodCost: 120 },
  { name: 'Nepali Chhyang', category: 'Beverages', price: 280, foodCost: 90 },
  { name: 'Mango Mojito', category: 'Beverages', price: 280, foodCost: 95 },
  // Desserts (7)
  { name: 'Mango Kulfi', category: 'Desserts', price: 220, foodCost: 80 },
  { name: 'Gulab Jamun (2 pcs)', category: 'Desserts', price: 180, foodCost: 60 },
  { name: 'Rice Kheer', category: 'Desserts', price: 160, foodCost: 55 },
  { name: 'Chocolate Brownie', category: 'Desserts', price: 250, foodCost: 90 },
  { name: 'Mango Cheesecake', category: 'Desserts', price: 320, foodCost: 120 },
  { name: 'Ice Cream Scoop', category: 'Desserts', price: 140, foodCost: 45 },
  { name: 'Juju Dhau (Yogurt)', category: 'Desserts', price: 120, foodCost: 40 },
];

export const menuItems: MenuItem[] = menuNames.map((m, i) => ({
  id: `MI${String(i + 1).padStart(3, '0')}`,
  name: m.name,
  category: m.category,
  price: m.price,
  foodCost: m.foodCost,
  available: i % 17 !== 0, // a few unavailable
  description: `Authentic ${m.category.toLowerCase()} dish prepared fresh with local ingredients.`,
  ingredients: [],
  popularity: Math.floor(Math.random() * 100) + 1,
}));

// ============================================================
// TABLES — 12 tables
// ============================================================
export const tables: RestaurantTable[] = [
  { id: 'T01', label: 'T01', status: 'Occupied', seats: 4, guests: 3, server: 'Ramesh', occupiedSince: '12:15', currentBill: 1850, section: 'Indoor' },
  { id: 'T02', label: 'T02', status: 'Available', seats: 2, guests: 0, section: 'Indoor' },
  { id: 'T03', label: 'T03', status: 'Occupied', seats: 4, guests: 4, server: 'Sita', occupiedSince: '12:30', currentBill: 2450, section: 'Indoor' },
  { id: 'T04', label: 'T04', status: 'Reserved', seats: 6, guests: 0, section: 'Indoor' },
  { id: 'T05', label: 'T05', status: 'Available', seats: 2, guests: 0, section: 'Indoor' },
  { id: 'T06', label: 'T06', status: 'Occupied', seats: 4, guests: 2, server: 'Ramesh', occupiedSince: '12:45', currentBill: 980, section: 'Outdoor' },
  { id: 'T07', label: 'T07', status: 'Cleaning', seats: 4, guests: 0, section: 'Outdoor' },
  { id: 'T08', label: 'T08', status: 'Available', seats: 8, guests: 0, section: 'Outdoor' },
  { id: 'T09', label: 'T09', status: 'Occupied', seats: 6, guests: 5, server: 'Anita', occupiedSince: '11:50', currentBill: 3650, section: 'Private' },
  { id: 'T10', label: 'T10', status: 'Reserved', seats: 4, guests: 0, section: 'Private' },
  { id: 'T11', label: 'T11', status: 'Available', seats: 2, guests: 0, section: 'Indoor' },
  { id: 'T12', label: 'T12', status: 'Occupied', seats: 4, guests: 3, server: 'Sita', occupiedSince: '13:05', currentBill: 1580, section: 'Indoor' },
];

// ============================================================
// ORDERS — recent orders
// ============================================================
const orderStatuses: Order['status'][] = ['Paid', 'Pending', 'Preparing', 'Completed', 'Cancelled', 'Served', 'Ready'];
const paymentMethods: Order['payment'][] = ['Cash', 'Card', 'eSewa', 'Khalti', 'Bank Transfer', 'Unpaid'];
const customerNames = [
  'Bishnu Sharma', 'Sita Gurung', 'Ram Thapa', 'Gita Maharjan', 'Hari Khadka',
  'Anita Tamang', 'Krishna Rai', 'Maya Limbu', 'Bikash Shrestha', 'Pooja Adhikari',
  'Dipak Magar', 'Rabina Karki', 'Suman Bhandari', 'Nisha Joshi', 'Arjun Pandey',
  'Kamala Bista', 'Rajesh Nepal', 'Bina Lama', 'Gopal Tamang', 'Sarita Chhetri',
  'Walk-in', 'Walk-in', 'Walk-in', 'Walk-in', 'Walk-in',
];

export const orders: Order[] = Array.from({ length: 30 }, (_, i) => {
  const time = `${String(11 + Math.floor(i / 4)).padStart(2, '0')}:${String((i * 7) % 60).padStart(2, '0')}`;
  const status = orderStatuses[i % orderStatuses.length];
  const itemCount = (i % 4) + 1;
  const items = Array.from({ length: itemCount }, (_, j) => {
    const menu = menuItems[(i * 3 + j) % menuItems.length];
    return { menuId: menu.id, name: menu.name, price: menu.price, quantity: (j % 3) + 1 };
  });
  const amount = items.reduce((s, it) => s + it.price * it.quantity, 0);
  const isUnpaid = status === 'Pending' || status === 'Preparing' || status === 'New';
  return {
    id: `ORD-${String(1024 + i).padStart(4, '0')}`,
    table: `T${String((i % 12) + 1).padStart(2, '0')}`,
    customer: customerNames[i % customerNames.length],
    items,
    amount,
    payment: isUnpaid ? 'Unpaid' : paymentMethods[i % paymentMethods.length],
    status,
    time,
    date: getRelativeDay(0),
    server: ['Ramesh', 'Sita', 'Anita', 'Dipak'][i % 4],
  };
});

// ============================================================
// INVENTORY — 84 items
// ============================================================
const inventoryDefs: { name: string; category: InventoryItem['category']; unit: string; min: number; max: number; cost: number; supplier: string }[] = [
  // Meat (10)
  { name: 'Chicken Breast', category: 'Meat', unit: 'kg', min: 10, max: 50, cost: 320, supplier: 'Himalayan Poultry' },
  { name: 'Mutton', category: 'Meat', unit: 'kg', min: 5, max: 30, cost: 850, supplier: 'Kathmandu Meat Supply' },
  { name: 'Pork', category: 'Meat', unit: 'kg', min: 5, max: 25, cost: 480, supplier: 'Newa Fresh Meat' },
  { name: 'Buff Meat', category: 'Meat', unit: 'kg', min: 8, max: 35, cost: 420, supplier: 'Newa Fresh Meat' },
  { name: 'Fish (Rohu)', category: 'Meat', unit: 'kg', min: 5, max: 20, cost: 380, supplier: 'Fresh Catch Nepal' },
  { name: 'Chicken Mince', category: 'Meat', unit: 'kg', min: 8, max: 30, cost: 340, supplier: 'Himalayan Poultry' },
  { name: 'Chicken Wings', category: 'Meat', unit: 'kg', min: 5, max: 20, cost: 280, supplier: 'Himalayan Poultry' },
  { name: 'Pork Ribs', category: 'Meat', unit: 'kg', min: 3, max: 15, cost: 520, supplier: 'Kathmandu Meat Supply' },
  { name: 'Yak Meat', category: 'Meat', unit: 'kg', min: 2, max: 10, cost: 950, supplier: 'Mountain Meat Co.' },
  { name: 'Chicken Sausage', category: 'Meat', unit: 'kg', min: 3, max: 15, cost: 450, supplier: 'Himalayan Poultry' },
  // Vegetables (14)
  { name: 'Tomato', category: 'Vegetables', unit: 'kg', min: 10, max: 40, cost: 60, supplier: 'Kalimati Veg Market' },
  { name: 'Onion', category: 'Vegetables', unit: 'kg', min: 15, max: 50, cost: 50, supplier: 'Kalimati Veg Market' },
  { name: 'Potato', category: 'Vegetables', unit: 'kg', min: 15, max: 60, cost: 45, supplier: 'Kalimati Veg Market' },
  { name: 'Cabbage', category: 'Vegetables', unit: 'kg', min: 8, max: 30, cost: 40, supplier: 'Kalimati Veg Market' },
  { name: 'Cauliflower', category: 'Vegetables', unit: 'kg', min: 5, max: 25, cost: 70, supplier: 'Kalimati Veg Market' },
  { name: 'Carrot', category: 'Vegetables', unit: 'kg', min: 5, max: 20, cost: 55, supplier: 'Kalimati Veg Market' },
  { name: 'Capsicum', category: 'Vegetables', unit: 'kg', min: 3, max: 15, cost: 120, supplier: 'Kalimati Veg Market' },
  { name: 'Spinach', category: 'Vegetables', unit: 'kg', min: 3, max: 12, cost: 80, supplier: 'Kalimati Veg Market' },
  { name: 'Garlic', category: 'Vegetables', unit: 'kg', min: 2, max: 10, cost: 200, supplier: 'Kalimati Veg Market' },
  { name: 'Ginger', category: 'Vegetables', unit: 'kg', min: 2, max: 10, cost: 180, supplier: 'Kalimati Veg Market' },
  { name: 'Green Chilli', category: 'Vegetables', unit: 'kg', min: 1, max: 8, cost: 150, supplier: 'Kalimati Veg Market' },
  { name: 'Coriander', category: 'Vegetables', unit: 'kg', min: 1, max: 5, cost: 100, supplier: 'Kalimati Veg Market' },
  { name: 'Bok Choy', category: 'Vegetables', unit: 'kg', min: 2, max: 8, cost: 130, supplier: 'Kalimati Veg Market' },
  { name: 'Mushroom', category: 'Vegetables', unit: 'kg', min: 2, max: 10, cost: 220, supplier: 'Organic Farms Nepal' },
  // Fruits (8)
  { name: 'Mango', category: 'Fruits', unit: 'kg', min: 10, max: 40, cost: 120, supplier: 'Terai Fruit Suppliers' },
  { name: 'Mango Pulp', category: 'Fruits', unit: 'kg', min: 5, max: 20, cost: 180, supplier: 'Terai Fruit Suppliers' },
  { name: 'Lemon', category: 'Fruits', unit: 'kg', min: 3, max: 12, cost: 140, supplier: 'Terai Fruit Suppliers' },
  { name: 'Banana', category: 'Fruits', unit: 'dozen', min: 5, max: 20, cost: 90, supplier: 'Terai Fruit Suppliers' },
  { name: 'Apple', category: 'Fruits', unit: 'kg', min: 5, max: 20, cost: 160, supplier: 'Mustang Fruit Co.' },
  { name: 'Pineapple', category: 'Fruits', unit: 'pcs', min: 5, max: 15, cost: 120, supplier: 'Terai Fruit Suppliers' },
  { name: 'Pomegranate', category: 'Fruits', unit: 'kg', min: 3, max: 10, cost: 200, supplier: 'Terai Fruit Suppliers' },
  { name: 'Orange', category: 'Fruits', unit: 'kg', min: 5, max: 15, cost: 110, supplier: 'Mustang Fruit Co.' },
  // Dairy (8)
  { name: 'Paneer', category: 'Dairy', unit: 'kg', min: 5, max: 20, cost: 450, supplier: 'Dairy Pure Nepal' },
  { name: 'Milk', category: 'Dairy', unit: 'L', min: 15, max: 50, cost: 85, supplier: 'Dairy Pure Nepal' },
  { name: 'Fresh Cream', category: 'Dairy', unit: 'L', min: 3, max: 15, cost: 220, supplier: 'Dairy Pure Nepal' },
  { name: 'Yogurt (Curd)', category: 'Dairy', unit: 'kg', min: 5, max: 20, cost: 150, supplier: 'Dairy Pure Nepal' },
  { name: 'Butter', category: 'Dairy', unit: 'kg', min: 2, max: 10, cost: 550, supplier: 'Dairy Pure Nepal' },
  { name: 'Cheese', category: 'Dairy', unit: 'kg', min: 2, max: 8, cost: 680, supplier: 'Dairy Pure Nepal' },
  { name: 'Buttermilk', category: 'Dairy', unit: 'L', min: 5, max: 15, cost: 90, supplier: 'Dairy Pure Nepal' },
  { name: 'Ghee', category: 'Dairy', unit: 'kg', min: 1, max: 5, cost: 850, supplier: 'Dairy Pure Nepal' },
  // Dry Goods (12)
  { name: 'Basmati Rice', category: 'Dry Goods', unit: 'kg', min: 25, max: 100, cost: 95, supplier: 'Nepal Grain Traders' },
  { name: 'Regular Rice', category: 'Dry Goods', unit: 'kg', min: 20, max: 80, cost: 65, supplier: 'Nepal Grain Traders' },
  { name: 'Flour (Atta)', category: 'Dry Goods', unit: 'kg', min: 20, max: 80, cost: 55, supplier: 'Nepal Grain Traders' },
  { name: 'Cooking Oil', category: 'Dry Goods', unit: 'L', min: 15, max: 60, cost: 180, supplier: 'Sunrise Trading' },
  { name: 'Mustard Oil', category: 'Dry Goods', unit: 'L', min: 5, max: 20, cost: 250, supplier: 'Sunrise Trading' },
  { name: 'Lentils (Dal)', category: 'Dry Goods', unit: 'kg', min: 15, max: 50, cost: 130, supplier: 'Nepal Grain Traders' },
  { name: 'Besan (Gram Flour)', category: 'Dry Goods', unit: 'kg', min: 5, max: 20, cost: 110, supplier: 'Nepal Grain Traders' },
  { name: 'Soy Sauce', category: 'Dry Goods', unit: 'L', min: 3, max: 15, cost: 200, supplier: 'Sunrise Trading' },
  { name: 'Vinegar', category: 'Dry Goods', unit: 'L', min: 2, max: 10, cost: 130, supplier: 'Sunrise Trading' },
  { name: 'Sugar', category: 'Dry Goods', unit: 'kg', min: 10, max: 40, cost: 85, supplier: 'Nepal Grain Traders' },
  { name: 'Salt', category: 'Dry Goods', unit: 'kg', min: 5, max: 20, cost: 25, supplier: 'Nepal Grain Traders' },
  { name: 'Noodles', category: 'Dry Goods', unit: 'kg', min: 10, max: 30, cost: 90, supplier: 'Sunrise Trading' },
  // Beverages (10)
  { name: 'Coca-Cola Crate', category: 'Beverages', unit: 'crate', min: 5, max: 20, cost: 850, supplier: 'Beverage Distributors Nepal' },
  { name: 'Sprite Crate', category: 'Beverages', unit: 'crate', min: 3, max: 15, cost: 850, supplier: 'Beverage Distributors Nepal' },
  { name: 'Fanta Crate', category: 'Beverages', unit: 'crate', min: 2, max: 10, cost: 850, supplier: 'Beverage Distributors Nepal' },
  { name: 'Mineral Water', category: 'Beverages', unit: 'box', min: 10, max: 40, cost: 280, supplier: 'Beverage Distributors Nepal' },
  { name: 'Coffee Beans', category: 'Beverages', unit: 'kg', min: 3, max: 12, cost: 650, supplier: 'Himalayan Coffee' },
  { name: 'Tea Leaves', category: 'Beverages', unit: 'kg', min: 2, max: 10, cost: 380, supplier: 'Ilam Tea Co.' },
  { name: 'Beer (Tuborg)', category: 'Beverages', unit: 'crate', min: 3, max: 15, cost: 2200, supplier: 'Beverage Distributors Nepal' },
  { name: 'Red Wine', category: 'Beverages', unit: 'bottle', min: 5, max: 24, cost: 1200, supplier: 'Himalayan Winery' },
  { name: 'Whisky', category: 'Beverages', unit: 'bottle', min: 3, max: 12, cost: 2800, supplier: 'Nepal Liquor Traders' },
  { name: 'Millet (Tongba)', category: 'Beverages', unit: 'kg', min: 5, max: 20, cost: 120, supplier: 'Mountain Grains' },
  // Spices (12)
  { name: 'Turmeric Powder', category: 'Spices', unit: 'kg', min: 2, max: 10, cost: 280, supplier: 'Spice Kingdom Nepal' },
  { name: 'Cumin Seeds', category: 'Spices', unit: 'kg', min: 1, max: 8, cost: 420, supplier: 'Spice Kingdom Nepal' },
  { name: 'Coriander Powder', category: 'Spices', unit: 'kg', min: 2, max: 8, cost: 240, supplier: 'Spice Kingdom Nepal' },
  { name: 'Garam Masala', category: 'Spices', unit: 'kg', min: 1, max: 5, cost: 520, supplier: 'Spice Kingdom Nepal' },
  { name: 'Red Chilli Powder', category: 'Spices', unit: 'kg', min: 1, max: 6, cost: 320, supplier: 'Spice Kingdom Nepal' },
  { name: 'Black Pepper', category: 'Spices', unit: 'kg', min: 1, max: 5, cost: 680, supplier: 'Spice Kingdom Nepal' },
  { name: 'Cardamom', category: 'Spices', unit: 'kg', min: 0.5, max: 3, cost: 2400, supplier: 'Spice Kingdom Nepal' },
  { name: 'Cinnamon', category: 'Spices', unit: 'kg', min: 0.5, max: 3, cost: 480, supplier: 'Spice Kingdom Nepal' },
  { name: 'Bay Leaf', category: 'Spices', unit: 'kg', min: 0.5, max: 3, cost: 180, supplier: 'Spice Kingdom Nepal' },
  { name: 'Cloves', category: 'Spices', unit: 'kg', min: 0.2, max: 2, cost: 850, supplier: 'Spice Kingdom Nepal' },
  { name: 'Nutmeg', category: 'Spices', unit: 'kg', min: 0.2, max: 1, cost: 950, supplier: 'Spice Kingdom Nepal' },
  { name: 'Saffron', category: 'Spices', unit: 'g', min: 10, max: 50, cost: 120, supplier: 'Spice Kingdom Nepal' },
  // Packaging (6)
  { name: 'Takeaway Boxes', category: 'Packaging', unit: 'pcs', min: 100, max: 500, cost: 8, supplier: 'EcoPack Nepal' },
  { name: 'Paper Bags', category: 'Packaging', unit: 'pcs', min: 100, max: 500, cost: 5, supplier: 'EcoPack Nepal' },
  { name: 'Plastic Cups', category: 'Packaging', unit: 'pcs', min: 50, max: 300, cost: 3, supplier: 'EcoPack Nepal' },
  { name: 'Aluminium Foil', category: 'Packaging', unit: 'roll', min: 5, max: 20, cost: 350, supplier: 'EcoPack Nepal' },
  { name: 'Straws', category: 'Packaging', unit: 'pack', min: 10, max: 40, cost: 120, supplier: 'EcoPack Nepal' },
  { name: 'Napkins', category: 'Packaging', unit: 'pack', min: 10, max: 50, cost: 150, supplier: 'EcoPack Nepal' },
  // Cleaning Supplies (4)
  { name: 'Dish Soap', category: 'Cleaning Supplies', unit: 'L', min: 5, max: 20, cost: 180, supplier: 'CleanPro Nepal' },
  { name: 'Surface Cleaner', category: 'Cleaning Supplies', unit: 'L', min: 3, max: 15, cost: 220, supplier: 'CleanPro Nepal' },
  { name: 'Hand Sanitizer', category: 'Cleaning Supplies', unit: 'L', min: 2, max: 10, cost: 280, supplier: 'CleanPro Nepal' },
  { name: 'Floor Cleaner', category: 'Cleaning Supplies', unit: 'L', min: 3, max: 12, cost: 190, supplier: 'CleanPro Nepal' },
];

export const inventoryItems: InventoryItem[] = inventoryDefs.map((d, i) => {
  // Deterministic stock levels — some low, some critical, some expiring
  const stockRatio = ((i * 37) % 100) / 100;
  let quantity: number;
  let expiryDays: number;

  if (i < 4) {
    // First 4: critical low
    quantity = Math.max(1, Math.floor(d.min * 0.3 * stockRatio + 1));
  } else if (i < 12) {
    // Next 8: low stock
    quantity = Math.floor(d.min * (0.5 + stockRatio * 0.4));
  } else if (i < 16) {
    // Next 4: expiring soon
    quantity = Math.floor(d.max * (0.3 + stockRatio * 0.3));
  } else if (i === 16 || i === 17) {
    // 2 expired
    quantity = Math.floor(d.max * 0.2);
  } else {
    quantity = Math.floor(d.min + (d.max - d.min) * stockRatio);
  }

  // Expiry dates
  if (i < 4) expiryDays = 30 + (i * 10);
  else if (i < 12) expiryDays = 14 + (i * 3);
  else if (i < 16) expiryDays = i - 11; // 1-4 days
  else if (i < 18) expiryDays = -(i - 15); // expired
  else expiryDays = 20 + ((i * 7) % 60);

  return {
    id: `INV${String(i + 1).padStart(3, '0')}`,
    name: d.name,
    sku: `SKU-${String(i + 1).padStart(4, '0')}`,
    category: d.category,
    quantity,
    unit: d.unit,
    minStock: d.min,
    maxStock: d.max,
    costPerUnit: d.cost,
    supplier: d.supplier,
    batchNumber: `B${String(2400 + i).padStart(5, '0')}`,
    expiryDate: getRelativeDate(expiryDays),
    lastRestocked: getRelativeDay(-(2 + (i % 10))),
  };
});

// ============================================================
// STOCK MOVEMENTS
// ============================================================
export const stockMovements: StockMovement[] = Array.from({ length: 25 }, (_, i) => {
  const item = inventoryItems[i % inventoryItems.length];
  const types: StockMovement['type'][] = ['Stock In', 'Stock Out', 'Waste', 'Adjustment', 'Transfer'];
  const type = types[i % types.length];
  const qty = (i % 8) + 2;
  return {
    id: `SM${String(i + 1).padStart(4, '0')}`,
    itemId: item.id,
    itemName: item.name,
    type,
    quantity: qty,
    unit: item.unit,
    reason: type === 'Waste' ? 'Spoilage' : undefined,
    cost: qty * item.costPerUnit,
    date: getRelativeDay(-(i % 7)),
    recordedBy: ['Admin', 'Gopal (Inventory)', 'Sita'][i % 3],
  };
});

// ============================================================
// WASTE TRACKING
// ============================================================
const wasteReasons: WasteEntry['reason'][] = ['Spoilage', 'Overproduction', 'Damaged', 'Expired', 'Other'];
export const wasteEntries: WasteEntry[] = Array.from({ length: 12 }, (_, i) => {
  const item = inventoryItems[i % inventoryItems.length];
  const qty = (i % 5) + 1;
  return {
    id: `WS${String(i + 1).padStart(4, '0')}`,
    item: item.name,
    quantity: qty,
    unit: item.unit,
    reason: wasteReasons[i % wasteReasons.length],
    cost: qty * item.costPerUnit,
    date: getRelativeDay(-(i % 10)),
    recordedBy: ['Admin', 'Gopal (Inventory)', 'Chef Hari'][i % 3],
  };
});

// ============================================================
// SUPPLIERS — 11 suppliers
// ============================================================
export const suppliers: Supplier[] = [
  { id: 'S01', name: 'Himalayan Poultry', contact: 'Bishnu Prasad', phone: '9801234567', category: 'Meat', paymentTerms: 'Net 15', outstandingBalance: 24500, lastOrder: getRelativeDay(-3), status: 'Active' },
  { id: 'S02', name: 'Kalimati Veg Market', contact: 'Sita Devi', phone: '9802345678', category: 'Vegetables', paymentTerms: 'COD', outstandingBalance: 8200, lastOrder: getRelativeDay(-1), status: 'Active' },
  { id: 'S03', name: 'Terai Fruit Suppliers', contact: 'Ram Yadav', phone: '9803456789', category: 'Fruits', paymentTerms: 'Net 7', outstandingBalance: 12800, lastOrder: getRelativeDay(-2), status: 'Active' },
  { id: 'S04', name: 'Dairy Pure Nepal', contact: 'Gita Maharjan', phone: '9804567890', category: 'Dairy', paymentTerms: 'Net 10', outstandingBalance: 18600, lastOrder: getRelativeDay(-1), status: 'Active' },
  { id: 'S05', name: 'Nepal Grain Traders', contact: 'Hari Khadka', phone: '9805678901', category: 'Dry Goods', paymentTerms: 'Net 30', outstandingBalance: 42000, lastOrder: getRelativeDay(-5), status: 'Active' },
  { id: 'S06', name: 'Sunrise Trading', contact: 'Anita Tamang', phone: '9806789012', category: 'Dry Goods', paymentTerms: 'Net 15', outstandingBalance: 15600, lastOrder: getRelativeDay(-4), status: 'Active' },
  { id: 'S07', name: 'Beverage Distributors Nepal', contact: 'Krishna Rai', phone: '9807890123', category: 'Beverages', paymentTerms: 'Net 14', outstandingBalance: 28400, lastOrder: getRelativeDay(-3), status: 'Active' },
  { id: 'S08', name: 'Spice Kingdom Nepal', contact: 'Maya Limbu', phone: '9808901234', category: 'Spices', paymentTerms: 'Net 20', outstandingBalance: 9800, lastOrder: getRelativeDay(-7), status: 'Active' },
  { id: 'S09', name: 'EcoPack Nepal', contact: 'Bikash Shrestha', phone: '9809012345', category: 'Packaging', paymentTerms: 'COD', outstandingBalance: 0, lastOrder: getRelativeDay(-10), status: 'Inactive' },
  { id: 'S10', name: 'CleanPro Nepal', contact: 'Pooja Adhikari', phone: '9801123456', category: 'Cleaning Supplies', paymentTerms: 'Net 15', outstandingBalance: 4200, lastOrder: getRelativeDay(-6), status: 'Active' },
  { id: 'S11', name: 'Kathmandu Meat Supply', contact: 'Dipak Magar', phone: '9802234567', category: 'Meat', paymentTerms: 'Net 7', outstandingBalance: 31200, lastOrder: getRelativeDay(-2), status: 'On Hold' },
];

// ============================================================
// PURCHASE ORDERS
// ============================================================
export const purchaseOrders: PurchaseOrder[] = [
  {
    id: 'PO1', poNumber: 'PO-2024-001', supplier: 'Himalayan Poultry',
    items: [
      { name: 'Chicken Breast', quantity: 30, unit: 'kg', unitCost: 320, total: 9600 },
      { name: 'Chicken Mince', quantity: 15, unit: 'kg', unitCost: 340, total: 5100 },
    ],
    total: 14700, expectedDelivery: getRelativeDate(2), status: 'Sent', date: getRelativeDay(-1),
  },
  {
    id: 'PO2', poNumber: 'PO-2024-002', supplier: 'Dairy Pure Nepal',
    items: [
      { name: 'Fresh Cream', quantity: 10, unit: 'L', unitCost: 220, total: 2200 },
      { name: 'Paneer', quantity: 12, unit: 'kg', unitCost: 450, total: 5400 },
    ],
    total: 7600, expectedDelivery: getRelativeDate(1), status: 'Sent', date: getRelativeDay(-1),
  },
  {
    id: 'PO3', poNumber: 'PO-2024-003', supplier: 'Kalimati Veg Market',
    items: [
      { name: 'Tomato', quantity: 30, unit: 'kg', unitCost: 60, total: 1800 },
      { name: 'Onion', quantity: 40, unit: 'kg', unitCost: 50, total: 2000 },
      { name: 'Potato', quantity: 50, unit: 'kg', unitCost: 45, total: 2250 },
    ],
    total: 6050, expectedDelivery: getRelativeDate(3), status: 'Sent', date: getRelativeDay(-2),
  },
  {
    id: 'PO4', poNumber: 'PO-2024-004', supplier: 'Terai Fruit Suppliers',
    items: [
      { name: 'Mango', quantity: 25, unit: 'kg', unitCost: 120, total: 3000 },
      { name: 'Mango Pulp', quantity: 15, unit: 'kg', unitCost: 180, total: 2700 },
    ],
    total: 5700, expectedDelivery: getRelativeDate(4), status: 'Partially Received', date: getRelativeDay(-3),
  },
  {
    id: 'PO5', poNumber: 'PO-2024-005', supplier: 'Nepal Grain Traders',
    items: [
      { name: 'Basmati Rice', quantity: 80, unit: 'kg', unitCost: 95, total: 7600 },
      { name: 'Lentils (Dal)', quantity: 40, unit: 'kg', unitCost: 130, total: 5200 },
    ],
    total: 12800, expectedDelivery: getRelativeDate(5), status: 'Draft', date: getRelativeDay(0),
  },
  {
    id: 'PO6', poNumber: 'PO-2024-006', supplier: 'Spice Kingdom Nepal',
    items: [
      { name: 'Turmeric Powder', quantity: 5, unit: 'kg', unitCost: 280, total: 1400 },
      { name: 'Garam Masala', quantity: 3, unit: 'kg', unitCost: 520, total: 1560 },
    ],
    total: 2960, expectedDelivery: getRelativeDate(2), status: 'Sent', date: getRelativeDay(-1),
  },
  {
    id: 'PO7', poNumber: 'PO-2024-007', supplier: 'Beverage Distributors Nepal',
    items: [
      { name: 'Coca-Cola Crate', quantity: 15, unit: 'crate', unitCost: 850, total: 12750 },
    ],
    total: 12750, expectedDelivery: getRelativeDate(1), status: 'Sent', date: getRelativeDay(-2),
  },
  {
    id: 'PO8', poNumber: 'PO-2024-008', supplier: 'CleanPro Nepal',
    items: [
      { name: 'Dish Soap', quantity: 15, unit: 'L', unitCost: 180, total: 2700 },
    ],
    total: 2700, expectedDelivery: getRelativeDate(3), status: 'Cancelled', date: getRelativeDay(-5),
  },
];

// ============================================================
// CUSTOMERS — 42+ customers
// ============================================================
const segments: Customer['segment'][] = ['New Customer', 'Returning Customer', 'Regular', 'VIP', 'High Spender', 'Inactive', 'At Risk'];

function generateJourney(name: string, visits: number): CustomerJourneyEntry[] {
  const journey: CustomerJourneyEntry[] = [];
  const items = ['Mango Special Chicken', 'Nepali Chicken Thali', 'Momo Platter', 'Butter Naan', 'Mango Lassi', 'Chicken Biryani', 'Paneer Butter Masala'];
  const types: CustomerJourneyEntry['type'][] = ['Order', 'Visit', 'Offer', 'Message', 'Feedback'];
  for (let i = 0; i < Math.min(visits, 6); i++) {
    const type = types[i % types.length];
    const desc = type === 'Order'
      ? `Ordered ${items[i % items.length]}`
      : type === 'Offer'
      ? 'Received promotional offer'
      : type === 'Feedback'
      ? 'Left 5-star review'
      : type === 'Message'
      ? 'Received thank-you message'
      : 'Visited restaurant';
    journey.push({
      date: getRelativeDay(i * 5 + (i % 3)),
      type,
      description: desc,
      amount: type === 'Order' ? 450 + (i * 200) : undefined,
    });
  }
  return journey;
}

const customerDefs: { name: string; phone: string; visits: number; spend: number; segment: Customer['segment']; channel: Customer['preferredChannel']; payment: Customer['preferredPayment']; freq: string }[] = [
  { name: 'Bishnu Sharma', phone: '9801111111', visits: 87, spend: 142500, segment: 'VIP', channel: 'WhatsApp', payment: 'Card', freq: '2-3x/week' },
  { name: 'Sita Gurung', phone: '9802222222', visits: 65, spend: 98200, segment: 'VIP', channel: 'WhatsApp', payment: 'eSewa', freq: 'Weekly' },
  { name: 'Ram Thapa', phone: '9803333333', visits: 52, spend: 78600, segment: 'High Spender', channel: 'Email', payment: 'Card', freq: 'Weekly' },
  { name: 'Gita Maharjan', phone: '9804444444', visits: 44, spend: 62300, segment: 'Regular', channel: 'WhatsApp', payment: 'Khalti', freq: '1-2x/week' },
  { name: 'Hari Khadka', phone: '9805555555', visits: 38, spend: 54100, segment: 'Regular', channel: 'SMS', payment: 'Cash', freq: 'Weekly' },
  { name: 'Anita Tamang', phone: '9806666666', visits: 31, spend: 42800, segment: 'Regular', channel: 'WhatsApp', payment: 'eSewa', freq: 'Weekly' },
  { name: 'Krishna Rai', phone: '9807777777', visits: 28, spend: 39600, segment: 'Returning Customer', channel: 'WhatsApp', payment: 'Cash', freq: 'Bi-weekly' },
  { name: 'Maya Limbu', phone: '9808888888', visits: 24, spend: 31200, segment: 'Returning Customer', channel: 'Email', payment: 'Card', freq: 'Bi-weekly' },
  { name: 'Bikash Shrestha', phone: '9809999999', visits: 21, spend: 28400, segment: 'Returning Customer', channel: 'WhatsApp', payment: 'Khalti', freq: 'Monthly' },
  { name: 'Pooja Adhikari', phone: '9810000000', visits: 18, spend: 22100, segment: 'Returning Customer', channel: 'WhatsApp', payment: 'eSewa', freq: 'Monthly' },
  { name: 'Dipak Magar', phone: '9811111111', visits: 15, spend: 18900, segment: 'Returning Customer', channel: 'SMS', payment: 'Cash', freq: 'Monthly' },
  { name: 'Rabina Karki', phone: '9812222222', visits: 12, spend: 15600, segment: 'Returning Customer', channel: 'WhatsApp', payment: 'Khalti', freq: 'Monthly' },
  { name: 'Suman Bhandari', phone: '9813333333', visits: 10, spend: 12300, segment: 'Returning Customer', channel: 'Email', payment: 'Card', freq: 'Monthly' },
  { name: 'Nisha Joshi', phone: '9814444444', visits: 8, spend: 9800, segment: 'New Customer', channel: 'WhatsApp', payment: 'eSewa', freq: 'Occasional' },
  { name: 'Arjun Pandey', phone: '9815555555', visits: 6, spend: 7200, segment: 'New Customer', channel: 'WhatsApp', payment: 'Cash', freq: 'Occasional' },
  { name: 'Kamala Bista', phone: '9816666666', visits: 5, spend: 6100, segment: 'New Customer', channel: 'SMS', payment: 'Khalti', freq: 'Occasional' },
  { name: 'Rajesh Nepal', phone: '9817777777', visits: 4, spend: 4800, segment: 'New Customer', channel: 'WhatsApp', payment: 'eSewa', freq: 'Rare' },
  { name: 'Bina Lama', phone: '9818888888', visits: 3, spend: 3500, segment: 'New Customer', channel: 'Email', payment: 'Cash', freq: 'Rare' },
  { name: 'Gopal Tamang', phone: '9819999999', visits: 2, spend: 2800, segment: 'New Customer', channel: 'WhatsApp', payment: 'Khalti', freq: 'Rare' },
  { name: 'Sarita Chhetri', phone: '9820000000', visits: 1, spend: 1450, segment: 'New Customer', channel: 'SMS', payment: 'Cash', freq: 'First visit' },
  { name: 'Manoj K.C.', phone: '9821111111', visits: 45, spend: 81200, segment: 'VIP', channel: 'WhatsApp', payment: 'Card', freq: '2-3x/week' },
  { name: 'Rekha Poudel', phone: '9822222222', visits: 33, spend: 52400, segment: 'High Spender', channel: 'Email', payment: 'Card', freq: 'Weekly' },
  { name: 'Suresh Ale', phone: '9823333333', visits: 27, spend: 38900, segment: 'Regular', channel: 'WhatsApp', payment: 'eSewa', freq: 'Weekly' },
  { name: 'Bina Rana', phone: '9824444444', visits: 22, spend: 29800, segment: 'Regular', channel: 'WhatsApp', payment: 'Khalti', freq: 'Bi-weekly' },
  { name: 'Prakash Sapkota', phone: '9825555555', visits: 16, spend: 20100, segment: 'Returning Customer', channel: 'SMS', payment: 'Cash', freq: 'Monthly' },
  { name: 'Anjali Dangol', phone: '9826666666', visits: 14, spend: 17500, segment: 'Returning Customer', channel: 'WhatsApp', payment: 'eSewa', freq: 'Monthly' },
  { name: 'Bibek Maharjan', phone: '9827777777', visits: 9, spend: 11200, segment: 'New Customer', channel: 'WhatsApp', payment: 'Khalti', freq: 'Occasional' },
  { name: 'Sangita Bajracharya', phone: '9828888888', visits: 7, spend: 8600, segment: 'New Customer', channel: 'Email', payment: 'Card', freq: 'Occasional' },
  { name: 'Nabin Dongol', phone: '9829999999', visits: 5, spend: 6200, segment: 'New Customer', channel: 'WhatsApp', payment: 'Cash', freq: 'Rare' },
  { name: 'Pratima Shrestha', phone: '9830000000', visits: 3, spend: 3800, segment: 'New Customer', channel: 'SMS', payment: 'eSewa', freq: 'Rare' },
  { name: 'Kiran Tamang', phone: '9831111111', visits: 42, spend: 76300, segment: 'VIP', channel: 'WhatsApp', payment: 'Card', freq: '2-3x/week' },
  { name: 'Laxmi Gurung', phone: '9832222222', visits: 29, spend: 41500, segment: 'High Spender', channel: 'Email', payment: 'Card', freq: 'Weekly' },
  { name: 'Dinesh Rai', phone: '9833333333', visits: 20, spend: 26800, segment: 'Regular', channel: 'WhatsApp', payment: 'eSewa', freq: 'Bi-weekly' },
  { name: 'Sunita Lama', phone: '9834444444', visits: 13, spend: 16400, segment: 'Returning Customer', channel: 'WhatsApp', payment: 'Khalti', freq: 'Monthly' },
  { name: 'Ramesh B.K.', phone: '9835555555', visits: 8, spend: 9900, segment: 'New Customer', channel: 'SMS', payment: 'Cash', freq: 'Occasional' },
  { name: 'Geeta Aryal', phone: '9836666666', visits: 4, spend: 5200, segment: 'New Customer', channel: 'WhatsApp', payment: 'eSewa', freq: 'Rare' },
  { name: 'Hemanta Thapa', phone: '9837777777', visits: 38, spend: 68900, segment: 'VIP', channel: 'WhatsApp', payment: 'Card', freq: 'Weekly' },
  { name: 'Pabitra Nepal', phone: '9838888888', visits: 25, spend: 35200, segment: 'Regular', channel: 'Email', payment: 'Khalti', freq: 'Bi-weekly' },
  { name: 'Om Prakash', phone: '9839999999', visits: 11, spend: 13800, segment: 'Returning Customer', channel: 'WhatsApp', payment: 'Cash', freq: 'Monthly' },
  { name: 'Bishal Karki', phone: '9840000000', visits: 6, spend: 7400, segment: 'New Customer', channel: 'SMS', payment: 'eSewa', freq: 'Rare' },
  { name: 'Anita Shrestha', phone: '9841111111', visits: 35, spend: 62100, segment: 'VIP', channel: 'WhatsApp', payment: 'Card', freq: 'Weekly' },
  { name: 'Madhav Poudel', phone: '9842222222', visits: 18, spend: 23400, segment: 'Returning Customer', channel: 'WhatsApp', payment: 'Khalti', freq: 'Monthly' },
];

export const customers: Customer[] = customerDefs.map((c, i) => ({
  id: `C${String(i + 1).padStart(3, '0')}`,
  name: c.name,
  phone: c.phone,
  email: `${c.name.toLowerCase().replace(/[^a-z]/g, '.')}@email.com`,
  totalVisits: c.visits,
  totalSpend: c.spend,
  averageOrderValue: Math.round(c.spend / c.visits),
  lastVisit: getRelativeDay(i % 40),
  favoriteItems: ['Mango Special Chicken', 'Momo Platter', 'Mango Lassi'].slice(0, (i % 3) + 1),
  favoriteCategories: ['Main Course', 'Beverages', 'Momo'].slice(0, (i % 3) + 1),
  preferredChannel: c.channel,
  preferredPayment: c.payment,
  segment: c.segment,
  visitFrequency: c.freq,
  loyaltyPoints: c.visits * 50,
  journey: generateJourney(c.name, c.visits),
}));

// ============================================================
// STAFF — 18 members
// ============================================================
const staffDefs: { name: string; role: StaffMember['role']; shift: string; attendance: StaffMember['attendance']; ordersHandled: number; salesGenerated: number; status: StaffMember['status']; phone: string }[] = [
  { name: 'Admin (Owner)', role: 'Owner', shift: '9:00 - 18:00', attendance: 'Present', ordersHandled: 0, salesGenerated: 0, status: 'Active', phone: '9800000001' },
  { name: 'Suresh Maharjan', role: 'Manager', shift: '8:00 - 17:00', attendance: 'Present', ordersHandled: 0, salesGenerated: 0, status: 'Active', phone: '9800000002' },
  { name: 'Ramesh Tamang', role: 'Waiter', shift: '8:00 - 16:00', attendance: 'Present', ordersHandled: 48, salesGenerated: 31200, status: 'Active', phone: '9800000003' },
  { name: 'Sita Gurung', role: 'Waiter', shift: '8:00 - 16:00', attendance: 'Present', ordersHandled: 42, salesGenerated: 28600, status: 'Active', phone: '9800000004' },
  { name: 'Anita Shrestha', role: 'Waiter', shift: '10:00 - 18:00', attendance: 'Present', ordersHandled: 38, salesGenerated: 25400, status: 'Active', phone: '9800000005' },
  { name: 'Dipak Magar', role: 'Waiter', shift: '12:00 - 20:00', attendance: 'Late', ordersHandled: 22, salesGenerated: 15800, status: 'Active', phone: '9800000006' },
  { name: 'Chef Hari Bahadur', role: 'Chef', shift: '7:00 - 15:00', attendance: 'Present', ordersHandled: 0, salesGenerated: 0, status: 'Active', phone: '9800000007' },
  { name: 'Chef Gopal', role: 'Chef', shift: '7:00 - 15:00', attendance: 'Present', ordersHandled: 0, salesGenerated: 0, status: 'Active', phone: '9800000008' },
  { name: 'Chef Sunita', role: 'Chef', shift: '15:00 - 23:00', attendance: 'Present', ordersHandled: 0, salesGenerated: 0, status: 'On Break', phone: '9800000009' },
  { name: 'Rabina Karki', role: 'Cashier', shift: '8:00 - 16:00', attendance: 'Present', ordersHandled: 86, salesGenerated: 184650, status: 'Active', phone: '9800000010' },
  { name: 'Bishnu Adhikari', role: 'Cashier', shift: '12:00 - 20:00', attendance: 'Present', ordersHandled: 0, salesGenerated: 0, status: 'On Break', phone: '9800000011' },
  { name: 'Gopal Tamang', role: 'Inventory Manager', shift: '9:00 - 17:00', attendance: 'Present', ordersHandled: 0, salesGenerated: 0, status: 'Active', phone: '9800000012' },
  { name: 'Manoj Bhandari', role: 'Waiter', shift: '15:00 - 23:00', attendance: 'Absent', ordersHandled: 0, salesGenerated: 0, status: 'Off Duty', phone: '9800000013' },
  { name: 'Kamala Joshi', role: 'Waiter', shift: '15:00 - 23:00', attendance: 'Present', ordersHandled: 28, salesGenerated: 19200, status: 'Active', phone: '9800000014' },
  { name: 'Chef Raju', role: 'Chef', shift: '15:00 - 23:00', attendance: 'Present', ordersHandled: 0, salesGenerated: 0, status: 'Active', phone: '9800000015' },
  { name: 'Nisha Pandey', role: 'Cashier', shift: '16:00 - 23:00', attendance: 'On Leave', ordersHandled: 0, salesGenerated: 0, status: 'Off Duty', phone: '9800000016' },
  { name: 'Arjun Lama', role: 'Waiter', shift: '8:00 - 16:00', attendance: 'Present', ordersHandled: 35, salesGenerated: 22100, status: 'Active', phone: '9800000017' },
  { name: 'Sarita Chhetri', role: 'Manager', shift: '15:00 - 23:00', attendance: 'Present', ordersHandled: 0, salesGenerated: 0, status: 'Active', phone: '9800000018' },
];

export const staff: StaffMember[] = staffDefs.map((s, i) => ({
  id: `ST${String(i + 1).padStart(3, '0')}`,
  ...s,
}));

// ============================================================
// EXPENSES
// ============================================================
const expenseDefs: { category: Expense['category']; description: string; amount: number; method: Expense['paymentMethod']; by: string }[] = [
  { category: 'Food Ingredients', description: 'Chicken Breast — 20kg', amount: 6400, method: 'Bank Transfer', by: 'Gopal' },
  { category: 'Food Ingredients', description: 'Fresh Vegetables — daily supply', amount: 3200, method: 'Cash', by: 'Gopal' },
  { category: 'Utilities', description: 'Electricity bill — August', amount: 18500, method: 'eSewa', by: 'Suresh' },
  { category: 'Staff', description: 'Staff lunch — daily', amount: 1200, method: 'Cash', by: 'Suresh' },
  { category: 'Maintenance', description: 'Refrigerator repair', amount: 4500, method: 'Cash', by: 'Suresh' },
  { category: 'Marketing', description: 'Facebook ad campaign', amount: 5000, method: 'Khalti', by: 'Admin' },
  { category: 'Supplies', description: 'Takeaway containers — 200 pcs', amount: 1600, method: 'Cash', by: 'Gopal' },
  { category: 'Transport', description: 'Delivery fuel — weekly', amount: 2800, method: 'Cash', by: 'Suresh' },
  { category: 'Food Ingredients', description: 'Basmati Rice — 50kg', amount: 4750, method: 'Bank Transfer', by: 'Gopal' },
  { category: 'Utilities', description: 'Water bill — August', amount: 3200, method: 'eSewa', by: 'Suresh' },
  { category: 'Other', description: 'POS software subscription', amount: 2500, method: 'Bank Transfer', by: 'Admin' },
  { category: 'Maintenance', description: 'Gas cylinder refill', amount: 2200, method: 'Cash', by: 'Chef Hari' },
  { category: 'Food Ingredients', description: 'Dairy supply — weekly', amount: 5800, method: 'Bank Transfer', by: 'Gopal' },
  { category: 'Marketing', description: 'Flyers — grand menu launch', amount: 1800, method: 'Cash', by: 'Admin' },
  { category: 'Supplies', description: 'Cleaning supplies — monthly', amount: 3400, method: 'eSewa', by: 'Gopal' },
];

export const expenses: Expense[] = expenseDefs.map((e, i) => ({
  id: `EX${String(i + 1).padStart(4, '0')}`,
  date: getRelativeDay(-(i % 14)),
  category: e.category,
  description: e.description,
  amount: e.amount,
  paymentMethod: e.method,
  recordedBy: e.by,
}));

// ============================================================
// AUTOMATIONS
// ============================================================
export const automations: Automation[] = [
  { id: 'A1', name: 'WhatsApp Automation', description: 'Send automated WhatsApp messages to customers', category: 'Customer', status: 'Active', trigger: 'Order completed', action: 'Send thank-you message + review request', lastRun: '2 min ago', nextRun: 'In 5 min', icon: 'MessageCircle' },
  { id: 'A2', name: 'AI Customer Assistant', description: 'AI-powered customer support on WhatsApp', category: 'Customer', status: 'Active', trigger: 'Customer sends message', action: 'AI responds to FAQ automatically', lastRun: '1 min ago', nextRun: 'Real-time', icon: 'Bot' },
  { id: 'A3', name: 'Low Stock Alert', description: 'Notify when stock falls below minimum', category: 'Inventory', status: 'Active', trigger: 'Chicken stock falls below 10kg', action: 'Notify Inventory Manager', lastRun: '1 hour ago', nextRun: 'In 1 hour', icon: 'Package' },
  { id: 'A4', name: 'Expiry Alert', description: 'Alert for ingredients expiring soon', category: 'Inventory', status: 'Active', trigger: 'Item expires within 3 days', action: 'Notify Chef + Inventory Manager', lastRun: '3 hours ago', nextRun: 'In 21 hours', icon: 'Clock' },
  { id: 'A5', name: 'Customer Re-engagement', description: 'Reach out to customers who haven\'t visited', category: 'Customer', status: 'Active', trigger: 'Customer has not visited for 30 days', action: 'Send personalized WhatsApp offer', lastRun: '5 hours ago', nextRun: 'In 19 hours', icon: 'UserPlus' },
  { id: 'A6', name: 'Offer Campaigns', description: 'Automated promotional campaigns', category: 'Marketing', status: 'Paused', trigger: 'Weekend promotion schedule', action: 'Send weekend special offers to VIP customers', lastRun: '3 days ago', nextRun: 'Paused', icon: 'Tag' },
  { id: 'A7', name: 'Post-Visit Follow-up', description: 'Follow up after customer visit', category: 'Customer', status: 'Active', trigger: 'Order completed', action: 'Send thank-you message + review request', lastRun: '2 min ago', nextRun: 'In 5 min', icon: 'HeartHandshake' },
  { id: 'A8', name: 'Daily Sales Report', description: 'Send daily summary to owner', category: 'Reports', status: 'Active', trigger: 'End of business day', action: 'Email daily sales summary to owner', lastRun: 'Yesterday 23:00', nextRun: 'Today 23:00', icon: 'FileText' },
];

// ============================================================
// NOTIFICATIONS
// ============================================================
export const notifications: Notification[] = [
  { id: 'N1', title: 'Chicken Breast critically low', description: 'Only 4.2kg remaining — minimum is 10kg', type: 'alert', time: '5 min ago', read: false },
  { id: 'N2', title: 'Fresh Cream expires tomorrow', description: 'Batch B02403 expires in 1 day', type: 'alert', time: '15 min ago', read: false },
  { id: 'N3', title: '4 purchase orders awaiting delivery', description: 'PO-2024-001, PO-2024-002, PO-2024-003, PO-2024-007', type: 'info', time: '1 hour ago', read: false },
  { id: 'N4', title: 'New 5-star review from Bishnu Sharma', description: '"Best Mango Special Chicken in town!"', type: 'success', time: '2 hours ago', read: true },
  { id: 'N5', title: 'Daily sales report ready', description: 'Yesterday\'s report is available for review', type: 'info', time: '3 hours ago', read: true },
];

// ============================================================
// KPI DATA
// ============================================================
export const kpiData: KPIData = {
  revenue: 184650,
  revenueChange: 12.4,
  orders: 286,
  ordersChange: 8.2,
  averageOrderValue: 645,
  aovChange: 4.8,
  lowStock: 12,
  customerVisits: 214,
  visitsChange: 15.3,
  refunds: 4250,
  tablesOccupied: 5,
  tablesTotal: 12,
  inventoryAttention: 12,
};

// ============================================================
// BUSINESS HEALTH SCORE
// ============================================================
export const businessHealth: BusinessHealthScore = {
  total: 82,
  label: 'Performing well',
  scores: [
    { name: 'Sales', score: 91, explanation: 'Sales are 12% higher than the previous period.' },
    { name: 'Inventory', score: 76, explanation: 'Inventory health dropped because 12 ingredients are below minimum stock.' },
    { name: 'Customer Retention', score: 84, explanation: 'Customer retention improved by 8% this month.' },
    { name: 'Expenses', score: 72, explanation: 'Food cost increased by 4.2% compared to last month.' },
    { name: 'Menu Performance', score: 87, explanation: 'Top 5 items account for 38% of total revenue.' },
  ],
};

// ============================================================
// REVENUE DATA — 30 days
// ============================================================
export const revenueData: RevenueDataPoint[] = Array.from({ length: 30 }, (_, i) => {
  const base = 165000;
  const variance = Math.sin(i * 0.5) * 12000 + Math.cos(i * 0.3) * 8000;
  const trend = i * 800;
  const revenue = Math.round(base + variance + trend);
  const orders = Math.round(revenue / 645 + (Math.sin(i) * 15));
  return {
    date: getRelativeDay(29 - i),
    revenue,
    orders,
    aov: Math.round(revenue / orders),
  };
});

// 7-day and 3-month variants
export const revenueData7Days: RevenueDataPoint[] = revenueData.slice(-7);
export const revenueData3Months: RevenueDataPoint[] = Array.from({ length: 12 }, (_, i) => {
  const base = 4200000;
  const variance = Math.sin(i * 0.8) * 300000;
  const trend = i * 120000;
  const revenue = Math.round(base + variance + trend);
  const orders = Math.round(revenue / 645);
  return {
    date: getRelativeDay(-(i * 7 + 7)),
    revenue,
    orders,
    aov: Math.round(revenue / orders),
  };
}).reverse();

// ============================================================
// CATEGORY SALES
// ============================================================
export const categorySales: CategorySales[] = [
  { category: 'Main Course', revenue: 78400, percentage: 42.4, color: 'hsl(32 95% 50%)' },
  { category: 'Momo', revenue: 36200, percentage: 19.6, color: 'hsl(142 52% 45%)' },
  { category: 'Beverages', revenue: 28100, percentage: 15.2, color: 'hsl(200 70% 50%)' },
  { category: 'Rice', revenue: 18600, percentage: 10.1, color: 'hsl(280 60% 55%)' },
  { category: 'Starters', revenue: 12400, percentage: 6.7, color: 'hsl(0 72% 56%)' },
  { category: 'Desserts', revenue: 6200, percentage: 3.4, color: 'hsl(48 90% 55%)' },
  { category: 'Breakfast', revenue: 4150, percentage: 2.2, color: 'hsl(170 50% 45%)' },
  { category: 'Noodles', revenue: 600, percentage: 0.4, color: 'hsl(340 60% 55%)' },
];

// ============================================================
// TOP SELLING ITEMS
// ============================================================
export const topSellingItems: TopSellingItem[] = [
  { rank: 1, name: 'Nepali Chicken Thali', category: 'Main Course', sold: 84, revenue: 37800, trend: 12.5 },
  { rank: 2, name: 'Mango Special Chicken', category: 'Main Course', sold: 62, revenue: 40300, trend: 8.2 },
  { rank: 3, name: 'Momo Platter', category: 'Momo', sold: 58, revenue: 31900, trend: 15.1 },
  { rank: 4, name: 'Butter Naan', category: 'Main Course', sold: 95, revenue: 17100, trend: 3.4 },
  { rank: 5, name: 'Mango Lassi', category: 'Beverages', sold: 72, revenue: 12960, trend: 22.8 },
];

// ============================================================
// OPERATIONAL ALERTS
// ============================================================
export const operationalAlerts: OperationalAlert[] = [
  { id: 'OA1', severity: 'critical', message: 'Chicken Breast — critically low', detail: '4.2kg remaining (min: 10kg)' },
  { id: 'OA2', severity: 'warning', message: 'Fresh Cream — expires tomorrow', detail: 'Batch B02403 expires in 1 day' },
  { id: 'OA3', severity: 'warning', message: 'Mango Pulp — expires in 4 days', detail: 'Batch B02405 expires in 4 days' },
  { id: 'OA4', severity: 'info', message: '4 purchase orders awaiting delivery', detail: 'PO-001, PO-002, PO-003, PO-007' },
];

// ============================================================
// RECOMMENDED ACTIONS
// ============================================================
export const recommendedActions: RecommendedAction[] = [
  { id: 'RA1', title: 'Restock Chicken Breast', description: 'Only 4.2kg remaining. Order 30kg from Himalayan Poultry.', priority: 'high', action: 'Create Purchase Order' },
  { id: 'RA2', title: 'Follow up with 18 inactive customers', description: '18 customers haven\'t visited in 30+ days.', priority: 'medium', action: 'Send WhatsApp Offer' },
  { id: 'RA3', title: 'Review low-margin menu items', description: '3 items have margins below 40%.', priority: 'medium', action: 'Review Menu' },
  { id: 'RA4', title: 'Approve 4 pending purchase orders', description: 'PO-001 through PO-004 awaiting approval.', priority: 'high', action: 'Review Orders' },
];

// ============================================================
// ROLE ACCESS MAP
// ============================================================
export const roleAccess: Record<string, string[]> = {
  Owner: ['overview', 'orders', 'tables', 'menu', 'inventory', 'purchases', 'customers', 'staff', 'expenses', 'reports', 'automation', 'settings'],
  Manager: ['overview', 'orders', 'tables', 'menu', 'inventory', 'purchases', 'customers', 'staff', 'expenses', 'reports'],
  Cashier: ['overview', 'orders', 'tables'],
  Waiter: ['overview', 'tables', 'orders'],
  Chef: ['overview', 'orders'],
  'Inventory Manager': ['overview', 'inventory', 'purchases'],
};
