export type Role =
  | 'Owner'
  | 'Manager'
  | 'Cashier'
  | 'Waiter'
  | 'Chef'
  | 'Inventory Manager';

export type OrderStatus =
  | 'New'
  | 'Confirmed'
  | 'Preparing'
  | 'Ready'
  | 'Served'
  | 'Paid'
  | 'Completed'
  | 'Cancelled'
  | 'Pending';

export type PaymentMethod = 'Cash' | 'Card' | 'eSewa' | 'Khalti' | 'Bank Transfer';

export type TableStatus = 'Available' | 'Occupied' | 'Reserved' | 'Cleaning';

export type MenuCategory =
  | 'Breakfast'
  | 'Starters'
  | 'Momo'
  | 'Main Course'
  | 'Rice'
  | 'Noodles'
  | 'Beverages'
  | 'Desserts';

export type InventoryCategory =
  | 'Meat'
  | 'Vegetables'
  | 'Fruits'
  | 'Dairy'
  | 'Dry Goods'
  | 'Beverages'
  | 'Spices'
  | 'Packaging'
  | 'Cleaning Supplies';

export type InventoryStatus =
  | 'Healthy'
  | 'Low Stock'
  | 'Critical'
  | 'Expiring Soon'
  | 'Expired'
  | 'Out of Stock';

export type SupplierStatus = 'Active' | 'Inactive' | 'On Hold';

export type PurchaseOrderStatus =
  | 'Draft'
  | 'Sent'
  | 'Partially Received'
  | 'Received'
  | 'Cancelled';

export type CustomerSegment =
  | 'New Customer'
  | 'Returning Customer'
  | 'Regular'
  | 'VIP'
  | 'High Spender'
  | 'Inactive'
  | 'At Risk';

export type StaffRole =
  | 'Owner'
  | 'Manager'
  | 'Cashier'
  | 'Waiter'
  | 'Chef'
  | 'Inventory Manager';

export type StaffStatus = 'Active' | 'On Break' | 'Off Duty' | 'Absent';

export type ExpenseCategory =
  | 'Food Ingredients'
  | 'Utilities'
  | 'Staff'
  | 'Maintenance'
  | 'Marketing'
  | 'Supplies'
  | 'Transport'
  | 'Other';

export type AutomationStatus = 'Active' | 'Paused';

export type MovementType = 'Stock In' | 'Stock Out' | 'Waste' | 'Adjustment' | 'Transfer';

export type WasteReason = 'Spoilage' | 'Overproduction' | 'Damaged' | 'Expired' | 'Other';

export interface MenuItem {
  id: string;
  name: string;
  category: MenuCategory;
  price: number;
  foodCost: number;
  available: boolean;
  description: string;
  ingredients: string[];
  image?: string;
  popularity: number;
}

export interface OrderItem {
  menuId: string;
  name: string;
  price: number;
  quantity: number;
  modifiers?: string[];
}

export interface Order {
  id: string;
  table: string;
  customer: string;
  items: OrderItem[];
  amount: number;
  payment: PaymentMethod | 'Unpaid';
  status: OrderStatus;
  time: string;
  date: string;
  server?: string;
}

export interface RestaurantTable {
  id: string;
  label: string;
  status: TableStatus;
  seats: number;
  guests: number;
  server?: string;
  occupiedSince?: string;
  currentBill?: number;
  section: 'Indoor' | 'Outdoor' | 'Private';
}

export interface InventoryItem {
  id: string;
  name: string;
  sku: string;
  category: InventoryCategory;
  quantity: number;
  unit: string;
  minStock: number;
  maxStock: number;
  costPerUnit: number;
  supplier: string;
  batchNumber: string;
  expiryDate: string;
  lastRestocked: string;
}

export interface StockMovement {
  id: string;
  itemId: string;
  itemName: string;
  type: MovementType;
  quantity: number;
  unit: string;
  reason?: string;
  cost: number;
  date: string;
  recordedBy: string;
}

export interface WasteEntry {
  id: string;
  item: string;
  quantity: number;
  unit: string;
  reason: WasteReason;
  cost: number;
  date: string;
  recordedBy: string;
}

export interface Supplier {
  id: string;
  name: string;
  contact: string;
  phone: string;
  category: string;
  paymentTerms: string;
  outstandingBalance: number;
  lastOrder: string;
  status: SupplierStatus;
}

export interface PurchaseOrderItem {
  name: string;
  quantity: number;
  unit: string;
  unitCost: number;
  total: number;
}

export interface PurchaseOrder {
  id: string;
  poNumber: string;
  supplier: string;
  items: PurchaseOrderItem[];
  total: number;
  expectedDelivery: string;
  status: PurchaseOrderStatus;
  date: string;
}

export interface Customer {
  id: string;
  name: string;
  phone: string;
  email: string;
  totalVisits: number;
  totalSpend: number;
  averageOrderValue: number;
  lastVisit: string;
  favoriteItems: string[];
  favoriteCategories: string[];
  preferredChannel: 'WhatsApp' | 'Email' | 'SMS';
  preferredPayment: PaymentMethod;
  segment: CustomerSegment;
  visitFrequency: string;
  loyaltyPoints: number;
  journey: CustomerJourneyEntry[];
}

export interface CustomerJourneyEntry {
  date: string;
  type: 'Order' | 'Visit' | 'Offer' | 'Message' | 'Feedback';
  description: string;
  amount?: number;
}

export interface StaffMember {
  id: string;
  name: string;
  role: StaffRole;
  shift: string;
  attendance: 'Present' | 'Late' | 'Absent' | 'On Leave';
  ordersHandled: number;
  salesGenerated: number;
  status: StaffStatus;
  phone: string;
}

export interface Expense {
  id: string;
  date: string;
  category: ExpenseCategory;
  description: string;
  amount: number;
  paymentMethod: PaymentMethod;
  recordedBy: string;
}

export interface Automation {
  id: string;
  name: string;
  description: string;
  category: string;
  status: AutomationStatus;
  trigger: string;
  action: string;
  lastRun: string;
  nextRun: string;
  icon: string;
}

export interface Notification {
  id: string;
  title: string;
  description: string;
  type: 'alert' | 'info' | 'success';
  time: string;
  read: boolean;
}

export interface KPIData {
  revenue: number;
  revenueChange: number;
  orders: number;
  ordersChange: number;
  averageOrderValue: number;
  aovChange: number;
  lowStock: number;
  customerVisits: number;
  visitsChange: number;
  refunds: number;
  tablesOccupied: number;
  tablesTotal: number;
  inventoryAttention: number;
}

export interface BusinessHealthScore {
  total: number;
  label: string;
  scores: {
    name: string;
    score: number;
    explanation: string;
  }[];
}

export interface RevenueDataPoint {
  date: string;
  revenue: number;
  orders: number;
  aov: number;
}

export interface CategorySales {
  category: string;
  revenue: number;
  percentage: number;
  color: string;
}

export interface TopSellingItem {
  rank: number;
  name: string;
  category: string;
  sold: number;
  revenue: number;
  trend: number;
}

export interface OperationalAlert {
  id: string;
  severity: 'critical' | 'warning' | 'info';
  message: string;
  detail: string;
}

export interface RecommendedAction {
  id: string;
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  action: string;
}
