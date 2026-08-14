import {
  LayoutDashboard,
  ClipboardList,
  Grid3x3,
  UtensilsCrossed,
  Package,
  ShoppingCart,
  Users,
  UserCog,
  Receipt,
  BarChart3,
  Zap,
  Settings,
  type LucideIcon,
} from 'lucide-react';

export interface NavItem {
  label: string;
  key: string;
  icon: LucideIcon;
}

export const navItems: NavItem[] = [
  { label: 'Overview', key: 'overview', icon: LayoutDashboard },
  { label: 'Orders', key: 'orders', icon: ClipboardList },
  { label: 'Tables', key: 'tables', icon: Grid3x3 },
  { label: 'Menu', key: 'menu', icon: UtensilsCrossed },
  { label: 'Inventory', key: 'inventory', icon: Package },
  { label: 'Purchases', key: 'purchases', icon: ShoppingCart },
  { label: 'Customers', key: 'customers', icon: Users },
  { label: 'Staff', key: 'staff', icon: UserCog },
  { label: 'Expenses', key: 'expenses', icon: Receipt },
  { label: 'Reports', key: 'reports', icon: BarChart3 },
  { label: 'Automation', key: 'automation', icon: Zap },
  { label: 'Settings', key: 'settings', icon: Settings },
];
