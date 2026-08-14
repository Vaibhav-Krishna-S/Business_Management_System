'use client';

import { useState, useMemo } from 'react';
import { Plus, Receipt, Wallet, TrendingDown, Search } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose,
} from '@/components/ui/dialog';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { expenses as initialExpenses } from '@/lib/mock-data';
import { formatNPR, formatShortDate } from '@/lib/format';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import type { Expense, ExpenseCategory } from '@/lib/types';

const expenseCategories: ExpenseCategory[] = ['Food Ingredients', 'Utilities', 'Staff', 'Maintenance', 'Marketing', 'Supplies', 'Transport', 'Other'];

export function ExpensesPage() {
  const [expenses, setExpenses] = useState<Expense[]>(initialExpenses);
  const [search, setSearch] = useState('');
  const [filterCat, setFilterCat] = useState('All');
  const [addOpen, setAddOpen] = useState(false);
  const [newExpense, setNewExpense] = useState({ category: 'Food Ingredients' as ExpenseCategory, description: '', amount: 0, paymentMethod: 'Cash' });

  const filtered = useMemo(() => expenses.filter((e) => {
    const matchSearch = e.description.toLowerCase().includes(search.toLowerCase());
    const matchCat = filterCat === 'All' || e.category === filterCat;
    return matchSearch && matchCat;
  }), [expenses, search, filterCat]);

  const today = expenses.filter((e) => e.date === new Date().toISOString().split('T')[0]).reduce((s, e) => s + e.amount, 0);
  const thisMonth = expenses.reduce((s, e) => s + e.amount, 0);
  const outstanding = expenses.filter((e) => e.paymentMethod === 'Bank Transfer').reduce((s, e) => s + e.amount, 0);

  const byCategory = expenseCategories.map((cat) => ({
    category: cat,
    amount: expenses.filter((e) => e.category === cat).reduce((s, e) => s + e.amount, 0),
  })).filter((d) => d.amount > 0);

  const handleAdd = () => {
    if (!newExpense.description.trim() || newExpense.amount <= 0) { toast.error('Please fill all fields'); return; }
    const exp: Expense = {
      id: `EX${String(expenses.length + 1).padStart(4, '0')}`,
      date: new Date().toISOString().split('T')[0],
      category: newExpense.category,
      description: newExpense.description,
      amount: newExpense.amount,
      paymentMethod: newExpense.paymentMethod as Expense['paymentMethod'],
      recordedBy: 'Admin',
    };
    setExpenses((prev) => [exp, ...prev]);
    toast.success('Expense recorded', { description: formatNPR(newExpense.amount) });
    setAddOpen(false);
    setNewExpense({ category: 'Food Ingredients', description: '', amount: 0, paymentMethod: 'Cash' });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold">Expenses</h1>
          <p className="text-sm text-muted-foreground">Track and manage restaurant expenses</p>
        </div>
        <Button className="gap-1.5" onClick={() => setAddOpen(true)}><Plus className="h-4 w-4" /> Record Expense</Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
        <KpiCard label="Today's Expenses" value={formatNPR(today)} icon={Receipt} iconBg="bg-primary/10 text-primary" />
        <KpiCard label="This Month" value={formatNPR(thisMonth)} icon={Wallet} iconBg="bg-chart-3/10 text-chart-3" />
        <KpiCard label="Outstanding Payments" value={formatNPR(outstanding)} icon={TrendingDown} iconBg="bg-warning/10 text-warning" />
      </div>

      {/* Chart */}
      <Card>
        <CardHeader className="pb-4"><CardTitle className="text-base">Expenses by Category</CardTitle></CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={byCategory} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
              <XAxis dataKey="category" tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} tickLine={false} axisLine={false} angle={-20} textAnchor="end" height={60} />
              <YAxis tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} tickLine={false} axisLine={false} tickFormatter={(v) => `${(v / 1000).toFixed(0)}K`} />
              <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px', fontSize: '12px' }} formatter={(v: number) => formatNPR(v)} />
              <Bar dataKey="amount" fill="hsl(32 95% 50%)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search expenses..." className="pl-9" />
        </div>
        <Select value={filterCat} onValueChange={setFilterCat}>
          <SelectTrigger className="w-full sm:w-[180px]"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="All">All Categories</SelectItem>
            {expenseCategories.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  {['Date', 'Category', 'Description', 'Amount', 'Method', 'Recorded By'].map((h) => (
                    <th key={h} className="px-4 py-3 text-left font-medium text-muted-foreground text-xs uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((e) => (
                  <tr key={e.id} className="border-b last:border-0 hover:bg-muted/30 transition-colors">
                    <td className="px-4 py-3 text-muted-foreground">{formatShortDate(e.date)}</td>
                    <td className="px-4 py-3"><Badge variant="secondary" className="text-[10px]">{e.category}</Badge></td>
                    <td className="px-4 py-3">{e.description}</td>
                    <td className="px-4 py-3 font-medium">{formatNPR(e.amount)}</td>
                    <td className="px-4 py-3 text-muted-foreground">{e.paymentMethod}</td>
                    <td className="px-4 py-3 text-muted-foreground">{e.recordedBy}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <Dialog open={addOpen} onOpenChange={setAddOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader><DialogTitle>Record Expense</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div>
              <Label className="mb-1.5 block">Category</Label>
              <Select value={newExpense.category} onValueChange={(v) => setNewExpense({ ...newExpense, category: v as ExpenseCategory })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {expenseCategories.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="mb-1.5 block">Description</Label>
              <Input value={newExpense.description} onChange={(e) => setNewExpense({ ...newExpense, description: e.target.value })} placeholder="e.g. Chicken Breast — 20kg" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="mb-1.5 block">Amount (NPR)</Label>
                <Input type="number" value={newExpense.amount} onChange={(e) => setNewExpense({ ...newExpense, amount: Number(e.target.value) })} />
              </div>
              <div>
                <Label className="mb-1.5 block">Payment Method</Label>
                <Select value={newExpense.paymentMethod} onValueChange={(v) => setNewExpense({ ...newExpense, paymentMethod: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Cash">Cash</SelectItem>
                    <SelectItem value="Card">Card</SelectItem>
                    <SelectItem value="eSewa">eSewa</SelectItem>
                    <SelectItem value="Khalti">Khalti</SelectItem>
                    <SelectItem value="Bank Transfer">Bank Transfer</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild><Button variant="outline">Cancel</Button></DialogClose>
            <Button onClick={handleAdd}>Record Expense</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function KpiCard({ label, value, icon: Icon, iconBg }: { label: string; value: string; icon: typeof Receipt; iconBg: string }) {
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
