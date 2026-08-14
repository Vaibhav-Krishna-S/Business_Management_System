'use client';

import { useState, useMemo } from 'react';
import { Search, Plus, Pencil, Trash2, UtensilsCrossed, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose,
} from '@/components/ui/dialog';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import { menuItems as initialMenu } from '@/lib/mock-data';
import { formatNPR } from '@/lib/format';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import type { MenuItem, MenuCategory } from '@/lib/types';

const categories: MenuCategory[] = ['Breakfast', 'Starters', 'Momo', 'Main Course', 'Rice', 'Noodles', 'Beverages', 'Desserts'];

export function MenuPage() {
  const [items, setItems] = useState<MenuItem[]>(initialMenu);
  const [search, setSearch] = useState('');
  const [filterCat, setFilterCat] = useState<string>('All');
  const [editItem, setEditItem] = useState<MenuItem | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isNew, setIsNew] = useState(false);

  const filtered = useMemo(() => items.filter((i) => {
    const matchSearch = i.name.toLowerCase().includes(search.toLowerCase());
    const matchCat = filterCat === 'All' || i.category === filterCat;
    return matchSearch && matchCat;
  }), [items, search, filterCat]);

  const openEdit = (item: MenuItem) => { setEditItem({ ...item }); setIsNew(false); setIsDialogOpen(true); };
  const openNew = () => {
    setEditItem({ id: `MI${String(items.length + 1).padStart(3, '0')}`, name: '', category: 'Main Course', price: 0, foodCost: 0, available: true, description: '', ingredients: [], popularity: 0 });
    setIsNew(true);
    setIsDialogOpen(true);
  };

  const saveItem = () => {
    if (!editItem?.name.trim()) { toast.error('Item name is required'); return; }
    if (isNew) {
      setItems((prev) => [...prev, editItem]);
      toast.success(`${editItem.name} added to menu`);
    } else {
      setItems((prev) => prev.map((i) => i.id === editItem.id ? editItem : i));
      toast.success(`${editItem.name} updated`);
    }
    setIsDialogOpen(false);
    setEditItem(null);
  };

  const toggleAvailable = (id: string) => {
    setItems((prev) => prev.map((i) => i.id === id ? { ...i, available: !i.available } : i));
  };

  const deleteItem = (id: string) => {
    const item = items.find((i) => i.id === id);
    setItems((prev) => prev.filter((i) => i.id !== id));
    toast.success(`${item?.name} removed from menu`);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold">Menu Management</h1>
          <p className="text-sm text-muted-foreground">{items.length} items across {categories.length} categories</p>
        </div>
        <Button onClick={openNew} className="gap-1.5"><Plus className="h-4 w-4" /> Add Item</Button>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search menu items..." className="pl-9" />
        </div>
        <Select value={filterCat} onValueChange={setFilterCat}>
          <SelectTrigger className="w-full sm:w-[180px]"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="All">All Categories</SelectItem>
            {categories.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground text-xs uppercase tracking-wider">Item</th>
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground text-xs uppercase tracking-wider">Category</th>
                  <th className="px-4 py-3 text-right font-medium text-muted-foreground text-xs uppercase tracking-wider">Price</th>
                  <th className="px-4 py-3 text-right font-medium text-muted-foreground text-xs uppercase tracking-wider">Food Cost</th>
                  <th className="px-4 py-3 text-right font-medium text-muted-foreground text-xs uppercase tracking-wider">Margin</th>
                  <th className="px-4 py-3 text-center font-medium text-muted-foreground text-xs uppercase tracking-wider">Available</th>
                  <th className="px-4 py-3 text-right font-medium text-muted-foreground text-xs uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((item) => {
                  const margin = ((item.price - item.foodCost) / item.price * 100);
                  return (
                    <tr key={item.id} className="border-b last:border-0 hover:bg-muted/30 transition-colors">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2.5">
                          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 shrink-0">
                            <UtensilsCrossed className="h-4 w-4 text-primary/60" />
                          </div>
                          <span className="font-medium">{item.name}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3"><Badge variant="secondary">{item.category}</Badge></td>
                      <td className="px-4 py-3 text-right font-medium">{formatNPR(item.price)}</td>
                      <td className="px-4 py-3 text-right text-muted-foreground">{formatNPR(item.foodCost)}</td>
                      <td className="px-4 py-3 text-right">
                        <span className={cn('font-medium', margin >= 60 ? 'text-success' : margin >= 40 ? 'text-warning' : 'text-destructive')}>
                          {margin.toFixed(1)}%
                        </span>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <Switch checked={item.available} onCheckedChange={() => toggleAvailable(item.id)} />
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openEdit(item)}>
                            <Pencil className="h-3.5 w-3.5" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive" onClick={() => deleteItem(item.id)}>
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{isNew ? 'Add Menu Item' : 'Edit Menu Item'}</DialogTitle>
          </DialogHeader>
          {editItem && (
            <div className="space-y-4">
              <div>
                <Label className="mb-1.5 block">Item Name</Label>
                <Input value={editItem.name} onChange={(e) => setEditItem({ ...editItem, name: e.target.value })} placeholder="e.g. Mango Special Chicken" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label className="mb-1.5 block">Category</Label>
                  <Select value={editItem.category} onValueChange={(v) => setEditItem({ ...editItem, category: v as MenuCategory })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {categories.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="mb-1.5 block">Availability</Label>
                  <div className="flex items-center gap-2 h-10">
                    <Switch checked={editItem.available} onCheckedChange={(v) => setEditItem({ ...editItem, available: v })} />
                    <span className="text-sm text-muted-foreground">{editItem.available ? 'Available' : 'Unavailable'}</span>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label className="mb-1.5 block">Selling Price (NPR)</Label>
                  <Input type="number" value={editItem.price} onChange={(e) => setEditItem({ ...editItem, price: Number(e.target.value) })} />
                </div>
                <div>
                  <Label className="mb-1.5 block">Food Cost (NPR)</Label>
                  <Input type="number" value={editItem.foodCost} onChange={(e) => setEditItem({ ...editItem, foodCost: Number(e.target.value) })} />
                </div>
              </div>
              {editItem.price > 0 && (
                <div className="rounded-lg bg-muted/50 p-3 flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Gross Margin</span>
                  <span className={cn('text-sm font-semibold', ((editItem.price - editItem.foodCost) / editItem.price * 100) >= 60 ? 'text-success' : 'text-warning')}>
                    {((editItem.price - editItem.foodCost) / editItem.price * 100).toFixed(1)}%
                  </span>
                </div>
              )}
              <div>
                <Label className="mb-1.5 block">Description</Label>
                <Textarea value={editItem.description} onChange={(e) => setEditItem({ ...editItem, description: e.target.value })} rows={2} placeholder="Brief description of the dish..." />
              </div>
            </div>
          )}
          <DialogFooter>
            <DialogClose asChild><Button variant="outline">Cancel</Button></DialogClose>
            <Button onClick={saveItem}>{isNew ? 'Add Item' : 'Save Changes'}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
