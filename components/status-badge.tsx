'use client';

import { cn } from '@/lib/utils';
import type { OrderStatus, TableStatus, InventoryStatus, CustomerSegment, PurchaseOrderStatus, SupplierStatus, StaffStatus, AutomationStatus } from '@/lib/types';

const orderStatusStyles: Record<OrderStatus, string> = {
  Paid: 'bg-success/15 text-success border-success/20',
  Completed: 'bg-success/15 text-success border-success/20',
  Pending: 'bg-warning/15 text-warning border-warning/20',
  New: 'bg-primary/15 text-primary border-primary/20',
  Confirmed: 'bg-chart-3/15 text-chart-3 border-chart-3/20',
  Preparing: 'bg-chart-4/15 text-chart-4 border-chart-4/20',
  Ready: 'bg-chart-6/15 text-chart-6 border-chart-6/20',
  Served: 'bg-chart-3/15 text-chart-3 border-chart-3/20',
  Cancelled: 'bg-destructive/15 text-destructive border-destructive/20',
};

const tableStatusStyles: Record<TableStatus, string> = {
  Available: 'bg-success/15 text-success border-success/20',
  Occupied: 'bg-primary/15 text-primary border-primary/20',
  Reserved: 'bg-chart-3/15 text-chart-3 border-chart-3/20',
  Cleaning: 'bg-muted text-muted-foreground border-border',
};

const inventoryStatusStyles: Record<InventoryStatus, string> = {
  Healthy: 'bg-success/15 text-success border-success/20',
  'Low Stock': 'bg-warning/15 text-warning border-warning/20',
  Critical: 'bg-destructive/15 text-destructive border-destructive/20',
  'Expiring Soon': 'bg-warning/15 text-warning border-warning/20',
  Expired: 'bg-destructive/15 text-destructive border-destructive/20',
  'Out of Stock': 'bg-destructive/15 text-destructive border-destructive/20',
};

const segmentStyles: Record<CustomerSegment, string> = {
  VIP: 'bg-primary/15 text-primary border-primary/20',
  'High Spender': 'bg-chart-4/15 text-chart-4 border-chart-4/20',
  Regular: 'bg-success/15 text-success border-success/20',
  'Returning Customer': 'bg-chart-3/15 text-chart-3 border-chart-3/20',
  'New Customer': 'bg-chart-6/15 text-chart-6 border-chart-6/20',
  Inactive: 'bg-muted text-muted-foreground border-border',
  'At Risk': 'bg-destructive/15 text-destructive border-destructive/20',
};

const poStatusStyles: Record<PurchaseOrderStatus, string> = {
  Draft: 'bg-muted text-muted-foreground border-border',
  Sent: 'bg-chart-3/15 text-chart-3 border-chart-3/20',
  'Partially Received': 'bg-warning/15 text-warning border-warning/20',
  Received: 'bg-success/15 text-success border-success/20',
  Cancelled: 'bg-destructive/15 text-destructive border-destructive/20',
};

const supplierStatusStyles: Record<SupplierStatus, string> = {
  Active: 'bg-success/15 text-success border-success/20',
  Inactive: 'bg-muted text-muted-foreground border-border',
  'On Hold': 'bg-warning/15 text-warning border-warning/20',
};

const staffStatusStyles: Record<StaffStatus, string> = {
  Active: 'bg-success/15 text-success border-success/20',
  'On Break': 'bg-warning/15 text-warning border-warning/20',
  'Off Duty': 'bg-muted text-muted-foreground border-border',
  Absent: 'bg-destructive/15 text-destructive border-destructive/20',
};

const automationStatusStyles: Record<AutomationStatus, string> = {
  Active: 'bg-success/15 text-success border-success/20',
  Paused: 'bg-muted text-muted-foreground border-border',
};

const maps = {
  order: orderStatusStyles,
  table: tableStatusStyles,
  inventory: inventoryStatusStyles,
  segment: segmentStyles,
  po: poStatusStyles,
  supplier: supplierStatusStyles,
  staff: staffStatusStyles,
  automation: automationStatusStyles,
};

type BadgeKind = keyof typeof maps;

export function StatusBadge({
  status,
  kind,
  className,
}: {
  status: string;
  kind: BadgeKind;
  className?: string;
}) {
  const map = maps[kind] as Record<string, string>;
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium',
        map[status] ?? 'bg-muted text-muted-foreground border-border',
        className
      )}
    >
      {status}
    </span>
  );
}
