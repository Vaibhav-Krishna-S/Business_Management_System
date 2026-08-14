'use client';

import { useState } from 'react';
import { Search, Plus, Minus, Trash2, Send, Printer, Save, CreditCard, X, UtensilsCrossed } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose,
} from '@/components/ui/dialog';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import { StatusBadge } from '@/components/status-badge';
import { menuItems, orders as initialOrders, tables } from '@/lib/mock-data';
import { formatNPR } from '@/lib/format';
import { useApp } from '@/lib/store';
import { translate } from '@/lib/i18n';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import type { MenuItem, OrderItem, Order, PaymentMethod } from '@/lib/types';

const categories = ['All', 'Breakfast', 'Starters', 'Momo', 'Main Course', 'Rice', 'Noodles', 'Beverages', 'Desserts'];
const paymentMethods: PaymentMethod[] = ['Cash', 'Card', 'eSewa', 'Khalti', 'Bank Transfer'];

export function OrdersPage() {
  const { language } = useApp();
  const tr = (key: string) => translate(key, language);

  const [activeCategory, setActiveCategory] = useState('All');
  const [search, setSearch] = useState('');
  const [cart, setCart] = useState<OrderItem[]>([]);
  const [selectedTable, setSelectedTable] = useState('T01');
  const [customerName, setCustomerName] = useState('Walk-in');
  const [orderStatus, setOrderStatus] = useState<'draft' | 'sent' | 'paid'>('draft');
  const [recentOrders, setRecentOrders] = useState<Order[]>(initialOrders);
  const [paymentOpen, setPaymentOpen] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('Cash');

  const filteredItems = menuItems.filter((item) => {
    const matchesCat = activeCategory === 'All' || item.category === activeCategory;
    const matchesSearch = item.name.toLowerCase().includes(search.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const addToCart = (item: MenuItem) => {
    if (!item.available) return;
    setCart((prev) => {
      const existing = prev.find((c) => c.menuId === item.id);
      if (existing) return prev.map((c) => c.menuId === item.id ? { ...c, quantity: c.quantity + 1 } : c);
      return [...prev, { menuId: item.id, name: item.name, price: item.price, quantity: 1 }];
    });
    toast.success(`${item.name} added to order`);
  };

  const updateQty = (id: string, delta: number) => {
    setCart((prev) => prev.map((c) => c.menuId === id ? { ...c, quantity: c.quantity + delta } : c).filter((c) => c.quantity > 0));
  };

  const removeFromCart = (id: string) => setCart((prev) => prev.filter((c) => c.menuId !== id));

  const subtotal = cart.reduce((s, c) => s + c.price * c.quantity, 0);
  const discount = Math.round(subtotal * 0.05);
  const tax = Math.round((subtotal - discount) * 0.13);
  const total = subtotal - discount + tax;

  const sendToKitchen = () => {
    if (cart.length === 0) { toast.error('Order is empty'); return; }
    setOrderStatus('sent');
    toast.success('Order sent to kitchen', { description: `${cart.length} items for ${selectedTable}` });
  };

  const printBill = () => {
    if (cart.length === 0) { toast.error('Order is empty'); return; }
    toast.success('Bill sent to printer');
  };

  const saveDraft = () => {
    if (cart.length === 0) { toast.error('Order is empty'); return; }
    toast.success('Order saved as draft');
  };

  const completePayment = () => {
    if (cart.length === 0) { toast.error('Order is empty'); return; }
    const newOrder: Order = {
      id: `ORD-${String(1030 + recentOrders.length).padStart(4, '0')}`,
      table: selectedTable,
      customer: customerName,
      items: cart,
      amount: total,
      payment: paymentMethod,
      status: 'Paid',
      time: new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', hour12: false }),
      date: new Date().toISOString().split('T')[0],
      server: 'Admin',
    };
    setRecentOrders((prev) => [newOrder, ...prev]);
    setCart([]);
    setOrderStatus('draft');
    setCustomerName('Walk-in');
    setPaymentOpen(false);
    toast.success('Payment completed', { description: `${formatNPR(total)} via ${paymentMethod}` });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold">{tr('Orders / POS')}</h1>
          <p className="text-sm text-muted-foreground">{tr('Create and manage restaurant orders')}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-4">
        {/* Menu side */}
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder={tr('Search menu items...')} className="pl-9" />
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button key={cat} onClick={() => setActiveCategory(cat)} className={cn('rounded-lg px-3 py-1.5 text-sm font-medium transition-colors', activeCategory === cat ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground hover:bg-accent')}>
                {cat}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-3">
            {filteredItems.map((item) => (
              <button key={item.id} onClick={() => addToCart(item)} disabled={!item.available} className={cn('group relative flex flex-col rounded-xl border bg-card p-3 text-left transition-all hover:shadow-md hover:border-primary/30', !item.available && 'opacity-50 cursor-not-allowed')}>
                <div className="mb-2 flex h-20 items-center justify-center rounded-lg bg-gradient-to-br from-primary/10 to-primary/5">
                  <UtensilsCrossed className="h-8 w-8 text-primary/40" />
                </div>
                <p className="text-sm font-medium leading-tight line-clamp-2">{item.name}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{item.category}</p>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-sm font-semibold text-primary">{formatNPR(item.price)}</span>
                  {!item.available && <Badge variant="secondary" className="text-[10px]">{tr('Unavailable')}</Badge>}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Current Order */}
        <Card className="lg:sticky lg:top-0 h-fit">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">{tr('Current Order')}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">{tr('Table')}</label>
                <Select value={selectedTable} onValueChange={setSelectedTable}>
                  <SelectTrigger className="h-9 text-sm"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {tables.map((t) => (<SelectItem key={t.id} value={t.id}>{t.label}</SelectItem>))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">{tr('Customer')}</label>
                <Input value={customerName} onChange={(e) => setCustomerName(e.target.value)} className="h-9 text-sm" placeholder="Walk-in" />
              </div>
            </div>

            <Separator />

            <ScrollArea className="h-[280px] -mx-2 px-2">
              {cart.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full py-8 text-center">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted mb-3">
                    <Plus className="h-6 w-6 text-muted-foreground" />
                  </div>
                  <p className="text-sm font-medium">{tr('No items yet')}</p>
                  <p className="text-xs text-muted-foreground mt-1">{tr('Click menu items to add them')}</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {cart.map((item) => (
                    <div key={item.menuId} className="flex items-center gap-2 rounded-lg border p-2">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{item.name}</p>
                        <p className="text-xs text-muted-foreground">{formatNPR(item.price)} {tr('each')}</p>
                      </div>
                      <div className="flex items-center gap-1">
                        <button onClick={() => updateQty(item.menuId, -1)} className="flex h-6 w-6 items-center justify-center rounded border hover:bg-accent"><Minus className="h-3 w-3" /></button>
                        <span className="w-6 text-center text-sm font-medium">{item.quantity}</span>
                        <button onClick={() => updateQty(item.menuId, 1)} className="flex h-6 w-6 items-center justify-center rounded border hover:bg-accent"><Plus className="h-3 w-3" /></button>
                      </div>
                      <span className="text-sm font-semibold w-16 text-right">{formatNPR(item.price * item.quantity)}</span>
                      <button onClick={() => removeFromCart(item.menuId)} className="text-muted-foreground hover:text-destructive"><Trash2 className="h-3.5 w-3.5" /></button>
                    </div>
                  ))}
                </div>
              )}
            </ScrollArea>

            {cart.length > 0 && (
              <>
                <Separator />
                <div className="space-y-1.5 text-sm">
                  <div className="flex justify-between"><span className="text-muted-foreground">{tr('Subtotal')}</span><span>{formatNPR(subtotal)}</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">{tr('Discount (5%)')}</span><span className="text-success">-{formatNPR(discount)}</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">{tr('Tax (13%)')}</span><span>{formatNPR(tax)}</span></div>
                  <Separator />
                  <div className="flex justify-between text-base font-bold"><span>{tr('Total')}</span><span className="text-primary">{formatNPR(total)}</span></div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <Button variant="outline" size="sm" onClick={sendToKitchen} className="gap-1.5"><Send className="h-3.5 w-3.5" /> {tr('Send to Kitchen')}</Button>
                  <Button variant="outline" size="sm" onClick={printBill} className="gap-1.5"><Printer className="h-3.5 w-3.5" /> {tr('Print Bill')}</Button>
                  <Button variant="outline" size="sm" onClick={saveDraft} className="gap-1.5"><Save className="h-3.5 w-3.5" /> {tr('Save Draft')}</Button>
                  <Button size="sm" onClick={() => setPaymentOpen(true)} className="gap-1.5"><CreditCard className="h-3.5 w-3.5" /> {tr('Pay')}</Button>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Recent Orders Table */}
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="text-base">{tr('All Orders')}</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  {[tr('Order ID'), tr('Time'), tr('Table'), tr('Customer'), tr('Items'), tr('Amount'), tr('Payment'), tr('Status')].map((h) => (
                    <th key={h} className="px-6 py-3 text-left font-medium text-muted-foreground text-xs uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {recentOrders.slice(0, 15).map((order) => (
                  <tr key={order.id} className="border-b last:border-0 hover:bg-muted/30 transition-colors">
                    <td className="px-6 py-3 font-medium">{order.id}</td>
                    <td className="px-6 py-3 text-muted-foreground">{order.time}</td>
                    <td className="px-6 py-3">{order.table}</td>
                    <td className="px-6 py-3">{order.customer}</td>
                    <td className="px-6 py-3 text-muted-foreground">{order.items.length} {tr('items')}</td>
                    <td className="px-6 py-3 font-medium">{formatNPR(order.amount)}</td>
                    <td className="px-6 py-3 text-muted-foreground">{order.payment}</td>
                    <td className="px-6 py-3"><StatusBadge status={order.status} kind="order" /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Payment Dialog */}
      <Dialog open={paymentOpen} onOpenChange={setPaymentOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{tr('Complete Payment')}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="rounded-lg bg-muted/50 p-4 space-y-1.5">
              <div className="flex justify-between text-sm"><span className="text-muted-foreground">{tr('Subtotal')}</span><span>{formatNPR(subtotal)}</span></div>
              <div className="flex justify-between text-sm"><span className="text-muted-foreground">{tr('Discount')}</span><span className="text-success">-{formatNPR(discount)}</span></div>
              <div className="flex justify-between text-sm"><span className="text-muted-foreground">{tr('Tax')}</span><span>{formatNPR(tax)}</span></div>
              <Separator />
              <div className="flex justify-between text-lg font-bold"><span>{tr('Total')}</span><span className="text-primary">{formatNPR(total)}</span></div>
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">{tr('Payment Method')}</label>
              <div className="grid grid-cols-3 gap-2">
                {paymentMethods.map((m) => (
                  <button key={m} onClick={() => setPaymentMethod(m)} className={cn('rounded-lg border p-3 text-sm font-medium transition-all', paymentMethod === m ? 'border-primary bg-primary/10 text-primary' : 'hover:border-border hover:bg-accent')}>
                    {m}
                  </button>
                ))}
              </div>
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">{tr('Cancel')}</Button>
            </DialogClose>
            <Button onClick={completePayment} className="gap-1.5">
              <CreditCard className="h-4 w-4" />
              {tr('Confirm Payment')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
