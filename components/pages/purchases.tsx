'use client';

import { useState } from 'react';
import { Plus, Search, ShoppingCart, Truck, Phone, Wallet, Check } from 'lucide-react';
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
import { StatusBadge } from '@/components/status-badge';
import { suppliers, purchaseOrders, inventoryItems } from '@/lib/mock-data';
import { formatNPR, formatShortDate } from '@/lib/format';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import type { PurchaseOrder } from '@/lib/types';

export function PurchasesPage() {
  const [pos, setPos] = useState<PurchaseOrder[]>(purchaseOrders);
  const [search, setSearch] = useState('');
  const [poOpen, setPoOpen] = useState(false);
  const [receiveOpen, setReceiveOpen] = useState(false);
  const [selectedPO, setSelectedPO] = useState<PurchaseOrder | null>(null);
  const [payOpen, setPayOpen] = useState(false);

  const totalOutstanding = suppliers.reduce((s, sup) => s + sup.outstandingBalance, 0);
  const filteredPOs = pos.filter((p) => p.poNumber.toLowerCase().includes(search.toLowerCase()) || p.supplier.toLowerCase().includes(search.toLowerCase()));

  const handleReceive = () => {
    if (!selectedPO) return;
    setPos((prev) => prev.map((p) => p.id === selectedPO.id ? { ...p, status: 'Received' } : p));
    toast.success(`Stock received for ${selectedPO.poNumber}`, { description: 'Inventory levels updated automatically.' });
    setReceiveOpen(false);
    setSelectedPO(null);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold">Purchases & Suppliers</h1>
          <p className="text-sm text-muted-foreground">Manage suppliers and purchase orders</p>
        </div>
        <Button className="gap-1.5" onClick={() => setPoOpen(true)}><Plus className="h-4 w-4" /> Create Purchase Order</Button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <KpiCard label="Total Suppliers" value={String(suppliers.length)} icon={Truck} iconBg="bg-primary/10 text-primary" />
        <KpiCard label="Active POs" value={String(pos.filter((p) => p.status === 'Sent' || p.status === 'Partially Received').length)} icon={ShoppingCart} iconBg="bg-chart-3/10 text-chart-3" />
        <KpiCard label="Outstanding Balance" value={formatNPR(totalOutstanding)} icon={Wallet} iconBg="bg-warning/10 text-warning" />
        <KpiCard label="Draft POs" value={String(pos.filter((p) => p.status === 'Draft').length)} icon={ShoppingCart} iconBg="bg-muted text-muted-foreground" />
      </div>

      <Tabs defaultValue="orders">
        <TabsList>
          <TabsTrigger value="orders">Purchase Orders</TabsTrigger>
          <TabsTrigger value="suppliers">Suppliers</TabsTrigger>
        </TabsList>

        <TabsContent value="orders" className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by PO number or supplier..." className="pl-9 max-w-md" />
          </div>
          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      {['PO Number', 'Supplier', 'Items', 'Total', 'Expected', 'Status', 'Actions'].map((h) => (
                        <th key={h} className="px-4 py-3 text-left font-medium text-muted-foreground text-xs uppercase tracking-wider">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {filteredPOs.map((po) => (
                      <tr key={po.id} className="border-b last:border-0 hover:bg-muted/30 transition-colors">
                        <td className="px-4 py-3 font-medium">{po.poNumber}</td>
                        <td className="px-4 py-3">{po.supplier}</td>
                        <td className="px-4 py-3 text-muted-foreground">{po.items.length} items</td>
                        <td className="px-4 py-3 font-medium">{formatNPR(po.total)}</td>
                        <td className="px-4 py-3 text-muted-foreground">{formatShortDate(po.expectedDelivery)}</td>
                        <td className="px-4 py-3"><StatusBadge status={po.status} kind="po" /></td>
                        <td className="px-4 py-3">
                          <div className="flex gap-1">
                            {(po.status === 'Sent' || po.status === 'Partially Received') && (
                              <Button size="sm" variant="outline" className="h-7 text-xs gap-1" onClick={() => { setSelectedPO(po); setReceiveOpen(true); }}>
                                <Check className="h-3 w-3" /> Receive
                              </Button>
                            )}
                            <Button size="sm" variant="ghost" className="h-7 text-xs" onClick={() => { setSelectedPO(po); setPayOpen(true); }}>
                              <Wallet className="h-3 w-3" /> Pay
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="suppliers">
          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      {['Supplier', 'Contact', 'Category', 'Payment Terms', 'Outstanding', 'Last Order', 'Status', ''].map((h) => (
                        <th key={h} className="px-4 py-3 text-left font-medium text-muted-foreground text-xs uppercase tracking-wider">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {suppliers.map((sup) => (
                      <tr key={sup.id} className="border-b last:border-0 hover:bg-muted/30 transition-colors">
                        <td className="px-4 py-3 font-medium">{sup.name}</td>
                        <td className="px-4 py-3">
                          <div className="flex flex-col">
                            <span className="text-xs">{sup.contact}</span>
                            <span className="text-xs text-muted-foreground flex items-center gap-1"><Phone className="h-2.5 w-2.5" />{sup.phone}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3"><Badge variant="secondary" className="text-[10px]">{sup.category}</Badge></td>
                        <td className="px-4 py-3 text-muted-foreground">{sup.paymentTerms}</td>
                        <td className="px-4 py-3 font-medium">{sup.outstandingBalance > 0 ? formatNPR(sup.outstandingBalance) : '—'}</td>
                        <td className="px-4 py-3 text-muted-foreground">{formatShortDate(sup.lastOrder)}</td>
                        <td className="px-4 py-3"><StatusBadge status={sup.status} kind="supplier" /></td>
                        <td className="px-4 py-3 text-right">
                          <Button size="sm" variant="ghost" className="h-7 text-xs" onClick={() => toast.success(`Supplier details for ${sup.name}`)}>Edit</Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Dialog open={poOpen} onOpenChange={setPoOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader><DialogTitle>Create Purchase Order</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div>
              <Label className="mb-1.5 block">Supplier</Label>
              <Select>
                <SelectTrigger><SelectValue placeholder="Select supplier" /></SelectTrigger>
                <SelectContent>
                  {suppliers.filter((s) => s.status === 'Active').map((s) => <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="mb-1.5 block">Item</Label>
              <Select>
                <SelectTrigger><SelectValue placeholder="Select inventory item" /></SelectTrigger>
                <SelectContent>
                  {inventoryItems.slice(0, 20).map((i) => <SelectItem key={i.id} value={i.id}>{i.name}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div><Label className="mb-1.5 block">Quantity</Label><Input type="number" placeholder="0" /></div>
              <div><Label className="mb-1.5 block">Expected Delivery</Label><Input type="date" /></div>
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild><Button variant="outline">Cancel</Button></DialogClose>
            <Button onClick={() => { toast.success('Purchase order created'); setPoOpen(false); }}>Create PO</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={receiveOpen} onOpenChange={setReceiveOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader><DialogTitle>Receive Stock</DialogTitle></DialogHeader>
          {selectedPO && (
            <div className="space-y-3">
              <div className="rounded-lg bg-muted/50 p-3">
                <p className="text-sm font-medium">{selectedPO.poNumber}</p>
                <p className="text-xs text-muted-foreground">{selectedPO.supplier} · {formatNPR(selectedPO.total)}</p>
              </div>
              {selectedPO.items.map((it, i) => (
                <div key={i} className="flex items-center justify-between rounded-lg border p-2.5">
                  <span className="text-sm">{it.name}</span>
                  <span className="text-sm text-muted-foreground">{it.quantity} {it.unit}</span>
                </div>
              ))}
            </div>
          )}
          <DialogFooter>
            <DialogClose asChild><Button variant="outline">Cancel</Button></DialogClose>
            <Button onClick={handleReceive} className="gap-1.5"><Check className="h-4 w-4" /> Confirm Received</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={payOpen} onOpenChange={setPayOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader><DialogTitle>Record Payment</DialogTitle></DialogHeader>
          {selectedPO && (
            <div className="space-y-3">
              <p className="text-sm">Pay <span className="font-semibold">{formatNPR(selectedPO.total)}</span> to {selectedPO.supplier}</p>
              <div>
                <Label className="mb-1.5 block">Payment Method</Label>
                <Select defaultValue="Bank Transfer">
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Cash">Cash</SelectItem>
                    <SelectItem value="Bank Transfer">Bank Transfer</SelectItem>
                    <SelectItem value="eSewa">eSewa</SelectItem>
                    <SelectItem value="Khalti">Khalti</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
          <DialogFooter>
            <DialogClose asChild><Button variant="outline">Cancel</Button></DialogClose>
            <Button onClick={() => { toast.success('Payment recorded'); setPayOpen(false); }}>Record Payment</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function KpiCard({ label, value, icon: Icon, iconBg }: { label: string; value: string; icon: typeof Truck; iconBg: string }) {
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
