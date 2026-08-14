'use client';

import { useState, useMemo } from 'react';
import {
  Search, Plus, Package, AlertTriangle, Clock, XCircle, TrendingDown,
  ArrowDownToLine, ArrowUpFromLine, Trash2, SlidersHorizontal, Lightbulb,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose,
} from '@/components/ui/dialog';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import { inventoryItems, stockMovements, wasteEntries, suppliers } from '@/lib/mock-data';
import { formatNPR, formatShortDate, daysUntil } from '@/lib/format';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import type { InventoryItem, InventoryCategory, InventoryStatus } from '@/lib/types';

const invCategories: InventoryCategory[] = ['Meat', 'Vegetables', 'Fruits', 'Dairy', 'Dry Goods', 'Beverages', 'Spices', 'Packaging', 'Cleaning Supplies'];

function getStatus(item: InventoryItem): InventoryStatus {
  if (item.quantity <= 0) return 'Out of Stock';
  if (item.quantity < item.minStock * 0.5) return 'Critical';
  const days = daysUntil(item.expiryDate);
  if (days < 0) return 'Expired';
  if (days <= 3) return 'Expiring Soon';
  if (item.quantity < item.minStock) return 'Low Stock';
  return 'Healthy';
}

const statusStyles: Record<InventoryStatus, string> = {
  Healthy: 'bg-success/15 text-success',
  'Low Stock': 'bg-warning/15 text-warning',
  Critical: 'bg-destructive/15 text-destructive',
  'Expiring Soon': 'bg-warning/15 text-warning',
  Expired: 'bg-destructive/15 text-destructive',
  'Out of Stock': 'bg-destructive/15 text-destructive',
};

export function InventoryPage() {
  const [items, setItems] = useState<InventoryItem[]>(inventoryItems);
  const [search, setSearch] = useState('');
  const [filterCat, setFilterCat] = useState('All');
  const [filterStatus, setFilterStatus] = useState('All');
  const [activeTab, setActiveTab] = useState('inventory');
  const [adjustItem, setAdjustItem] = useState<InventoryItem | null>(null);
  const [adjustQty, setAdjustQty] = useState(0);
  const [adjustReason, setAdjustReason] = useState('');
  const [wasteOpen, setWasteOpen] = useState(false);
  const [stockInOpen, setStockInOpen] = useState(false);

  const totalValue = items.reduce((s, i) => s + i.quantity * i.costPerUnit, 0);
  const lowStock = items.filter((i) => { const st = getStatus(i); return st === 'Low Stock' || st === 'Critical'; }).length;
  const critical = items.filter((i) => getStatus(i) === 'Critical').length;
  const expiringSoon = items.filter((i) => { const st = getStatus(i); return st === 'Expiring Soon' || st === 'Expired'; }).length;
  const expired = items.filter((i) => getStatus(i) === 'Expired').length;

  const filtered = useMemo(() => items.filter((i) => {
    const matchSearch = i.name.toLowerCase().includes(search.toLowerCase()) || i.sku.toLowerCase().includes(search.toLowerCase());
    const matchCat = filterCat === 'All' || i.category === filterCat;
    const st = getStatus(i);
    const matchStatus = filterStatus === 'All' || st === filterStatus;
    return matchSearch && matchCat && matchStatus;
  }), [items, search, filterCat, filterStatus]);

  const recommendations = [
    { text: `Order 15kg Chicken Breast`, detail: 'Critically low — only 4.2kg remaining', priority: 'high' },
    { text: `Fresh Cream expires in 1 day`, detail: 'Use immediately or mark as waste', priority: 'high' },
    { text: `Mango stock is 32% above normal consumption`, detail: 'Consider reducing next order quantity', priority: 'medium' },
    { text: `Rice consumption increased 18% this week`, detail: 'Trending up — monitor for next order', priority: 'low' },
  ];

  const handleAdjust = () => {
    if (!adjustItem) return;
    setItems((prev) => prev.map((i) => i.id === adjustItem.id ? { ...i, quantity: Math.max(0, i.quantity + adjustQty) } : i));
    toast.success(`${adjustItem.name} adjusted by ${adjustQty > 0 ? '+' : ''}${adjustQty}${adjustItem.unit}`, { description: adjustReason || undefined });
    setAdjustItem(null);
    setAdjustQty(0);
    setAdjustReason('');
  };

  const handleStockIn = () => {
    toast.success('Stock received', { description: 'Inventory levels updated automatically.' });
    setStockInOpen(false);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold">Inventory</h1>
          <p className="text-sm text-muted-foreground">Smart restaurant inventory management</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="gap-1.5" onClick={() => setStockInOpen(true)}>
            <ArrowDownToLine className="h-3.5 w-3.5" /> Add Stock
          </Button>
          <Button variant="outline" size="sm" className="gap-1.5" onClick={() => setWasteOpen(true)}>
            <Trash2 className="h-3.5 w-3.5" /> Record Waste
          </Button>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <KpiCard label="Total Stock Value" value={formatNPR(totalValue)} icon={Package} iconBg="bg-primary/10 text-primary" />
        <KpiCard label="Low Stock" value={String(lowStock)} icon={AlertTriangle} iconBg="bg-warning/10 text-warning" />
        <KpiCard label="Expiring Soon" value={String(expiringSoon)} icon={Clock} iconBg="bg-warning/10 text-warning" />
        <KpiCard label="Expired" value={String(expired)} icon={XCircle} iconBg="bg-destructive/10 text-destructive" />
      </div>

      {/* Smart Recommendations */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Lightbulb className="h-4 w-4 text-primary" /> Smart Recommendations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {recommendations.map((r, i) => (
              <div key={i} className="flex items-start gap-2.5 rounded-lg border p-3">
                <span className={cn('mt-1 h-2 w-2 rounded-full shrink-0', r.priority === 'high' ? 'bg-destructive' : r.priority === 'medium' ? 'bg-warning' : 'bg-chart-3')} />
                <div>
                  <p className="text-sm font-medium">{r.text}</p>
                  <p className="text-xs text-muted-foreground">{r.detail}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="inventory">Inventory</TabsTrigger>
          <TabsTrigger value="movements">Stock Movements</TabsTrigger>
          <TabsTrigger value="waste">Waste Tracking</TabsTrigger>
        </TabsList>

        {/* Inventory Tab */}
        <TabsContent value="inventory" className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by name or SKU..." className="pl-9" />
            </div>
            <Select value={filterCat} onValueChange={setFilterCat}>
              <SelectTrigger className="w-full sm:w-[160px]"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All Categories</SelectItem>
                {invCategories.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
              </SelectContent>
            </Select>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-full sm:w-[160px]"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All Status</SelectItem>
                <SelectItem value="Healthy">Healthy</SelectItem>
                <SelectItem value="Low Stock">Low Stock</SelectItem>
                <SelectItem value="Critical">Critical</SelectItem>
                <SelectItem value="Expiring Soon">Expiring Soon</SelectItem>
                <SelectItem value="Expired">Expired</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      {['Item', 'SKU', 'Category', 'Stock', 'Min', 'Cost/Unit', 'Expiry', 'Supplier', 'Status', ''].map((h) => (
                        <th key={h} className="px-4 py-3 text-left font-medium text-muted-foreground text-xs uppercase tracking-wider whitespace-nowrap">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.slice(0, 30).map((item) => {
                      const st = getStatus(item);
                      const days = daysUntil(item.expiryDate);
                      return (
                        <tr key={item.id} className="border-b last:border-0 hover:bg-muted/30 transition-colors">
                          <td className="px-4 py-3 font-medium">{item.name}</td>
                          <td className="px-4 py-3 text-muted-foreground text-xs">{item.sku}</td>
                          <td className="px-4 py-3"><Badge variant="secondary" className="text-[10px]">{item.category}</Badge></td>
                          <td className="px-4 py-3 font-medium">{item.quantity} {item.unit}</td>
                          <td className="px-4 py-3 text-muted-foreground">{item.minStock} {item.unit}</td>
                          <td className="px-4 py-3 text-muted-foreground">{formatNPR(item.costPerUnit)}</td>
                          <td className="px-4 py-3">
                            <span className={cn(days <= 3 && days >= 0 && 'text-warning font-medium', days < 0 && 'text-destructive font-medium')}>
                              {formatShortDate(item.expiryDate)}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-muted-foreground text-xs">{item.supplier}</td>
                          <td className="px-4 py-3"><span className={cn('inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium', statusStyles[st])}>{st}</span></td>
                          <td className="px-4 py-3 text-right">
                            <Button variant="ghost" size="sm" className="h-7 gap-1 text-xs" onClick={() => { setAdjustItem(item); setAdjustQty(0); }}>
                              <SlidersHorizontal className="h-3 w-3" /> Adjust
                            </Button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
              {filtered.length > 30 && (
                <div className="p-3 text-center text-sm text-muted-foreground">Showing 30 of {filtered.length} items</div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Stock Movements Tab */}
        <TabsContent value="movements">
          <Card>
            <CardHeader className="pb-3"><CardTitle className="text-base">Stock Movement History</CardTitle></CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      {['Date', 'Item', 'Type', 'Quantity', 'Cost', 'Recorded By'].map((h) => (
                        <th key={h} className="px-4 py-3 text-left font-medium text-muted-foreground text-xs uppercase tracking-wider">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {stockMovements.map((m) => (
                      <tr key={m.id} className="border-b last:border-0 hover:bg-muted/30 transition-colors">
                        <td className="px-4 py-3 text-muted-foreground">{formatShortDate(m.date)}</td>
                        <td className="px-4 py-3 font-medium">{m.itemName}</td>
                        <td className="px-4 py-3">
                          <span className={cn('inline-flex items-center gap-1 text-xs font-medium',
                            m.type === 'Stock In' ? 'text-success' :
                            m.type === 'Waste' ? 'text-destructive' :
                            m.type === 'Stock Out' ? 'text-warning' : 'text-chart-3')}>
                            {m.type === 'Stock In' && <ArrowDownToLine className="h-3 w-3" />}
                            {m.type === 'Stock Out' && <ArrowUpFromLine className="h-3 w-3" />}
                            {m.type === 'Waste' && <Trash2 className="h-3 w-3" />}
                            {m.type === 'Adjustment' && <SlidersHorizontal className="h-3 w-3" />}
                            {m.type === 'Transfer' && <TrendingDown className="h-3 w-3" />}
                            {m.type}
                          </span>
                        </td>
                        <td className="px-4 py-3">{m.quantity} {m.unit}</td>
                        <td className="px-4 py-3 text-muted-foreground">{formatNPR(m.cost)}</td>
                        <td className="px-4 py-3 text-muted-foreground">{m.recordedBy}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Waste Tab */}
        <TabsContent value="waste">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Waste Tracking</CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                Potential Waste Cost: <span className="font-semibold text-destructive">{formatNPR(wasteEntries.reduce((s, w) => s + w.cost, 0))}</span>
              </p>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      {['Date', 'Item', 'Quantity', 'Reason', 'Cost', 'Recorded By'].map((h) => (
                        <th key={h} className="px-4 py-3 text-left font-medium text-muted-foreground text-xs uppercase tracking-wider">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {wasteEntries.map((w) => (
                      <tr key={w.id} className="border-b last:border-0 hover:bg-muted/30 transition-colors">
                        <td className="px-4 py-3 text-muted-foreground">{formatShortDate(w.date)}</td>
                        <td className="px-4 py-3 font-medium">{w.item}</td>
                        <td className="px-4 py-3">{w.quantity} {w.unit}</td>
                        <td className="px-4 py-3"><Badge variant="secondary" className="text-[10px]">{w.reason}</Badge></td>
                        <td className="px-4 py-3 font-medium text-destructive">{formatNPR(w.cost)}</td>
                        <td className="px-4 py-3 text-muted-foreground">{w.recordedBy}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Adjust Dialog */}
      <Dialog open={!!adjustItem} onOpenChange={(v) => !v && setAdjustItem(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader><DialogTitle>Stock Adjustment</DialogTitle></DialogHeader>
          {adjustItem && (
            <div className="space-y-4">
              <div className="rounded-lg bg-muted/50 p-3">
                <p className="text-sm font-medium">{adjustItem.name}</p>
                <p className="text-xs text-muted-foreground">Current: {adjustItem.quantity} {adjustItem.unit} · Min: {adjustItem.minStock} {adjustItem.unit}</p>
              </div>
              <div>
                <Label className="mb-1.5 block">Adjustment (+/-)</Label>
                <Input type="number" value={adjustQty} onChange={(e) => setAdjustQty(Number(e.target.value))} placeholder="e.g. -5 or +10" />
              </div>
              <div>
                <Label className="mb-1.5 block">Reason</Label>
                <Input value={adjustReason} onChange={(e) => setAdjustReason(e.target.value)} placeholder="e.g. Damaged, miscount, etc." />
              </div>
            </div>
          )}
          <DialogFooter>
            <DialogClose asChild><Button variant="outline">Cancel</Button></DialogClose>
            <Button onClick={handleAdjust}>Apply Adjustment</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Stock In Dialog */}
      <Dialog open={stockInOpen} onOpenChange={setStockInOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader><DialogTitle>Add Stock</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div>
              <Label className="mb-1.5 block">Select Item</Label>
              <Select>
                <SelectTrigger><SelectValue placeholder="Choose inventory item" /></SelectTrigger>
                <SelectContent>
                  {items.slice(0, 20).map((i) => <SelectItem key={i.id} value={i.id}>{i.name}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="mb-1.5 block">Quantity</Label>
                <Input type="number" placeholder="0" />
              </div>
              <div>
                <Label className="mb-1.5 block">Batch Number</Label>
                <Input placeholder="B00000" />
              </div>
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild><Button variant="outline">Cancel</Button></DialogClose>
            <Button onClick={handleStockIn}>Add Stock</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Waste Dialog */}
      <Dialog open={wasteOpen} onOpenChange={setWasteOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader><DialogTitle>Record Waste</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div>
              <Label className="mb-1.5 block">Item</Label>
              <Select>
                <SelectTrigger><SelectValue placeholder="Choose item" /></SelectTrigger>
                <SelectContent>
                  {items.slice(0, 20).map((i) => <SelectItem key={i.id} value={i.id}>{i.name}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="mb-1.5 block">Quantity</Label>
                <Input type="number" placeholder="0" />
              </div>
              <div>
                <Label className="mb-1.5 block">Reason</Label>
                <Select>
                  <SelectTrigger><SelectValue placeholder="Select reason" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Spoilage">Spoilage</SelectItem>
                    <SelectItem value="Overproduction">Overproduction</SelectItem>
                    <SelectItem value="Damaged">Damaged</SelectItem>
                    <SelectItem value="Expired">Expired</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild><Button variant="outline">Cancel</Button></DialogClose>
            <Button onClick={() => { toast.success('Waste recorded'); setWasteOpen(false); }}>Record Waste</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function KpiCard({ label, value, icon: Icon, iconBg }: { label: string; value: string; icon: typeof Package; iconBg: string }) {
  return (
    <Card className="p-4">
      <div className={cn('inline-flex h-9 w-9 items-center justify-center rounded-lg mb-2', iconBg)}>
        <Icon className="h-[18px] w-[18px]" />
      </div>
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="text-lg font-bold mt-0.5">{value}</p>
    </Card>
  );
}
