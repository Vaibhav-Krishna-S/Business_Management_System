'use client';

import { useState } from 'react';
import {
  BarChart3, TrendingUp, ShoppingBag, Package, Users, Receipt, Download, FileText,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';
import { revenueData, categorySales, topSellingItems, expenses, customers, inventoryItems } from '@/lib/mock-data';
import { formatNPR, formatNPRShort } from '@/lib/format';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

const reportTypes = [
  { key: 'sales', label: 'Sales Report', icon: TrendingUp },
  { key: 'profitability', label: 'Profitability', icon: BarChart3 },
  { key: 'menu', label: 'Menu Performance', icon: ShoppingBag },
  { key: 'inventory', label: 'Inventory Report', icon: Package },
  { key: 'purchase', label: 'Purchase Report', icon: Receipt },
  { key: 'expense', label: 'Expense Report', icon: Receipt },
  { key: 'customer', label: 'Customer Report', icon: Users },
];

const dateRanges = ['Today', 'Yesterday', 'This Week', 'This Month', 'Custom Range'];

export function ReportsPage() {
  const [activeReport, setActiveReport] = useState('sales');
  const [dateRange, setDateRange] = useState('This Month');

  const totalRevenue = revenueData.reduce((s, d) => s + d.revenue, 0);
  const totalOrders = revenueData.reduce((s, d) => s + d.orders, 0);
  const totalExpenses = expenses.reduce((s, e) => s + e.amount, 0);
  const profit = totalRevenue - totalExpenses;
  const inventoryValue = inventoryItems.reduce((s, i) => s + i.quantity * i.costPerUnit, 0);

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold">Reports & Analytics</h1>
          <p className="text-sm text-muted-foreground">Business intelligence and performance insights</p>
        </div>
        <div className="flex items-center gap-2">
          <Tabs value={dateRange} onValueChange={setDateRange}>
            <TabsList className="h-8">
              {dateRanges.slice(2, 4).map((r) => <TabsTrigger key={r} value={r} className="text-xs px-2.5">{r}</TabsTrigger>)}
            </TabsList>
          </Tabs>
          <Button variant="outline" size="sm" className="gap-1.5" onClick={() => toast.success('Exporting CSV...')}><Download className="h-3.5 w-3.5" /> CSV</Button>
          <Button variant="outline" size="sm" className="gap-1.5" onClick={() => toast.success('Generating PDF...')}><FileText className="h-3.5 w-3.5" /> PDF</Button>
        </div>
      </div>

      {/* Report type selector */}
      <div className="flex flex-wrap gap-2">
        {reportTypes.map((r) => {
          const Icon = r.icon;
          return (
            <button
              key={r.key}
              onClick={() => setActiveReport(r.key)}
              className={cn(
                'flex items-center gap-2 rounded-lg border px-3 py-2 text-sm font-medium transition-colors',
                activeReport === r.key ? 'border-primary bg-primary/10 text-primary' : 'hover:bg-accent'
              )}
            >
              <Icon className="h-3.5 w-3.5" />
              {r.label}
            </button>
          );
        })}
      </div>

      {/* Summary KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <KpiCard label="Total Revenue" value={formatNPRShort(totalRevenue)} change={12.4} />
        <KpiCard label="Total Orders" value={String(totalOrders)} change={8.2} />
        <KpiCard label="Total Expenses" value={formatNPRShort(totalExpenses)} change={-4.2} />
        <KpiCard label="Net Profit" value={formatNPRShort(profit)} change={15.6} />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Revenue Trend */}
        <Card>
          <CardHeader className="pb-4"><CardTitle className="text-base">Revenue Trend</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <AreaChart data={revenueData} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(32 95% 50%)" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="hsl(32 95% 50%)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                <XAxis dataKey="date" tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }} tickLine={false} axisLine={false} interval="preserveStartEnd" tickFormatter={(v) => { const d = new Date(v); return `${d.getDate()}/${d.getMonth() + 1}`; }} />
                <YAxis tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} tickLine={false} axisLine={false} tickFormatter={(v) => `${(v / 1000).toFixed(0)}K`} />
                <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px', fontSize: '12px' }} formatter={(v: number) => formatNPR(v)} />
                <Area type="monotone" dataKey="revenue" stroke="hsl(32 95% 50%)" strokeWidth={2} fill="url(#revGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Orders Trend */}
        <Card>
          <CardHeader className="pb-4"><CardTitle className="text-base">Orders Trend</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={revenueData} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                <XAxis dataKey="date" tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }} tickLine={false} axisLine={false} interval="preserveStartEnd" tickFormatter={(v) => { const d = new Date(v); return `${d.getDate()}/${d.getMonth() + 1}`; }} />
                <YAxis tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px', fontSize: '12px' }} />
                <Line type="monotone" dataKey="orders" stroke="hsl(142 52% 45%)" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Category Revenue */}
        <Card>
          <CardHeader className="pb-4"><CardTitle className="text-base">Category Revenue</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie data={categorySales} dataKey="revenue" nameKey="category" cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={2}>
                  {categorySales.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px', fontSize: '12px' }} formatter={(v: number) => formatNPR(v)} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Top Products */}
        <Card>
          <CardHeader className="pb-4"><CardTitle className="text-base">Top Products</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={topSellingItems} layout="vertical" margin={{ top: 5, right: 10, left: 80, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" horizontal={false} />
                <XAxis type="number" tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} tickLine={false} axisLine={false} />
                <YAxis type="category" dataKey="name" tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} tickLine={false} axisLine={false} width={80} />
                <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px', fontSize: '12px' }} formatter={(v: number) => formatNPR(v)} />
                <Bar dataKey="revenue" fill="hsl(32 95% 50%)" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Gross Margin & Inventory Value */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <CardHeader className="pb-4"><CardTitle className="text-base">Gross Margin by Category</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={categorySales} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                <XAxis dataKey="category" tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }} tickLine={false} axisLine={false} angle={-20} textAnchor="end" height={60} />
                <YAxis tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} tickLine={false} axisLine={false} tickFormatter={(v) => `${(v / 1000).toFixed(0)}K`} />
                <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px', fontSize: '12px' }} formatter={(v: number) => formatNPR(v)} />
                <Bar dataKey="revenue" fill="hsl(142 52% 45%)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-4"><CardTitle className="text-base">Key Metrics</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            <MetricRow label="Inventory Value" value={formatNPR(inventoryValue)} />
            <MetricRow label="Total Customers" value={String(customers.length)} />
            <MetricRow label="Avg Order Value" value={formatNPR(645)} />
            <MetricRow label="Profit Margin" value={`${((profit / totalRevenue) * 100).toFixed(1)}%`} />
            <MetricRow label="Top Selling Item" value={topSellingItems[0].name} />
            <MetricRow label="Customer Retention" value="84%" />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function KpiCard({ label, value, change }: { label: string; value: string; change?: number }) {
  return (
    <Card className="p-4">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="text-lg font-bold mt-0.5">{value}</p>
      {change !== undefined && (
        <p className={cn('text-xs font-medium mt-1', change >= 0 ? 'text-success' : 'text-destructive')}>
          {change >= 0 ? '+' : ''}{change}% vs last period
        </p>
      )}
    </Card>
  );
}

function MetricRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between border-b last:border-0 pb-2 last:pb-0">
      <span className="text-sm text-muted-foreground">{label}</span>
      <span className="text-sm font-medium">{value}</span>
    </div>
  );
}
