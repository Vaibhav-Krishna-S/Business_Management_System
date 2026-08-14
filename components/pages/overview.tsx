'use client';

import { useState } from 'react';
import {
  TrendingUp, TrendingDown, DollarSign, ShoppingBag, Receipt,
  Package, Users, ArrowUpRight, ArrowDownRight, AlertTriangle,
  Lightbulb, ChevronRight, Sparkles, Calendar,
  CircleCheck, Clock, ShoppingCart, UserX,
} from 'lucide-react';
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  RadialBarChart, RadialBar, Legend,
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { StatusBadge } from '@/components/status-badge';
import { DemoControls } from '@/components/demo-controls';
import {
  kpiData, businessHealth, revenueData, revenueData7Days, revenueData3Months,
  categorySales, topSellingItems, operationalAlerts, recommendedActions,
  orders, customers,
} from '@/lib/mock-data';
import { formatNPR, formatNumber, formatPercent, getGreeting, formatDate } from '@/lib/format';
import { useApp } from '@/lib/store';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription,
} from '@/components/ui/dialog';
import { cn } from '@/lib/utils';
import { translate } from '@/lib/i18n';

type ChartMetric = 'revenue' | 'orders' | 'aov';
type ChartRange = 'today' | '7d' | '30d' | '3m';

export function OverviewPage({ onNavigate }: { onNavigate: (key: string) => void }) {
  const { outlet, language } = useApp();
  const tr = (key: string) => translate(key, language);
  const [chartRange, setChartRange] = useState<ChartRange>('7d');
  const [chartMetric, setChartMetric] = useState<ChartMetric>('revenue');
  const [insightsOpen, setInsightsOpen] = useState(false);

  const chartData = chartRange === '7d' ? revenueData7Days : chartRange === '30d' ? revenueData : revenueData3Months;
  const dataKey = chartMetric;
  const color = chartMetric === 'revenue' ? 'hsl(32 95% 50%)' : chartMetric === 'orders' ? 'hsl(142 52% 45%)' : 'hsl(200 70% 50%)';

  const newCustomers = customers.filter((c) => c.segment === 'New Customer').length;
  const returningCustomers = customers.filter((c) => c.segment === 'Returning Customer').length;
  const vipCustomers = customers.filter((c) => c.segment === 'VIP').length;
  const inactiveCustomers = customers.filter((c) => c.segment === 'Inactive' || c.segment === 'At Risk').length;

  const healthColor = businessHealth.total >= 80 ? 'hsl(142 52% 45%)' : businessHealth.total >= 60 ? 'hsl(38 92% 50%)' : 'hsl(0 72% 51%)';

  return (
    <div className="space-y-6">
      {/* Greeting */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            {getGreeting()}, {tr('Admin')}
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            {tr("Here's what's happening at The Mango Resort Restaurant today.")}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="h-4 w-4" />
            {formatDate(new Date())}
          </div>
          <DemoControls />
        </div>
      </div>

      {/* KPI Row */}
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3">
        <KpiCard label={tr("Today's Revenue")} value={formatNPR(kpiData.revenue)} change={kpiData.revenueChange} icon={DollarSign} iconBg="bg-primary/10 text-primary" />
        <KpiCard label={tr('Orders')} value={formatNumber(kpiData.orders)} change={kpiData.ordersChange} icon={ShoppingBag} iconBg="bg-chart-2/10 text-chart-2" />
        <KpiCard label={tr('Average Order')} value={formatNPR(kpiData.averageOrderValue)} change={kpiData.aovChange} icon={Receipt} iconBg="bg-chart-3/10 text-chart-3" />
        <KpiCard label={tr('Tables')} value={`${kpiData.tablesOccupied} / ${kpiData.tablesTotal} occupied`} icon={Users} iconBg="bg-chart-4/10 text-chart-4" neutral />
        <KpiCard label={tr('Inventory')} value={`${kpiData.inventoryAttention} items`} subValue={tr('need attention')} icon={Package} iconBg="bg-destructive/10 text-destructive" alert />
        <KpiCard label={tr('Refunds')} value={formatNPR(kpiData.refunds)} icon={TrendingDown} iconBg="bg-muted text-muted-foreground" neutral />
      </div>

      {/* Revenue Chart + Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-6">
        <Card>
          <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-4">
            <div>
              <CardTitle className="text-base">{tr('Revenue Overview')}</CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                {chartRange === 'today' ? tr('Today') : chartRange === '7d' ? tr('Last 7 days') : chartRange === '30d' ? tr('Last 30 days') : tr('Last 3 months')}
              </p>
            </div>
            <div className="flex flex-col items-end gap-2">
              <Tabs value={chartRange} onValueChange={(v) => setChartRange(v as ChartRange)}>
                <TabsList className="h-8">
                  <TabsTrigger value="today" className="text-xs px-2.5">{tr('Today')}</TabsTrigger>
                  <TabsTrigger value="7d" className="text-xs px-2.5">7D</TabsTrigger>
                  <TabsTrigger value="30d" className="text-xs px-2.5">30D</TabsTrigger>
                  <TabsTrigger value="3m" className="text-xs px-2.5">3M</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2 mb-4">
              {(['revenue', 'orders', 'aov'] as ChartMetric[]).map((m) => (
                <button
                  key={m}
                  onClick={() => setChartMetric(m)}
                  className={cn(
                    'rounded-md px-3 py-1.5 text-xs font-medium transition-colors',
                    chartMetric === m ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground hover:bg-accent'
                  )}
                >
                  {m === 'revenue' ? tr('Revenue') : m === 'orders' ? tr('Orders') : tr('Avg Order')}
                </button>
              ))}
            </div>
            <ResponsiveContainer width="100%" height={280}>
              <AreaChart data={chartData} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorMetric" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={color} stopOpacity={0.2} />
                    <stop offset="95%" stopColor={color} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                <XAxis dataKey="date" tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} tickLine={false} axisLine={false} interval="preserveStartEnd" tickFormatter={(v) => { const d = new Date(v); return `${d.getDate()}/${d.getMonth() + 1}`; }} />
                <YAxis tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} tickLine={false} axisLine={false} tickFormatter={(v) => chartMetric === 'revenue' ? `${(v / 1000).toFixed(0)}K` : v.toString()} />
                <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px', fontSize: '12px' }} formatter={(value: number) => chartMetric === 'revenue' ? formatNPR(value) : value.toString()} />
                <Area type="monotone" dataKey={dataKey} stroke={color} strokeWidth={2} fill="url(#colorMetric)" />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-4">
            <CardTitle className="text-base flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-destructive" />
              {tr('Operational Alerts')}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {operationalAlerts.map((alert) => (
              <div key={alert.id} className={cn('flex items-start gap-3 rounded-lg border p-3 transition-colors hover:bg-muted/30', alert.severity === 'critical' ? 'border-destructive/30 bg-destructive/5' : alert.severity === 'warning' ? 'border-warning/30 bg-warning/5' : 'border-chart-3/30 bg-chart-3/5')}>
                <span className={cn('mt-1 h-2.5 w-2.5 rounded-full shrink-0', alert.severity === 'critical' ? 'bg-destructive' : alert.severity === 'warning' ? 'bg-warning' : 'bg-chart-3')} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium">{alert.message}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{alert.detail}</p>
                </div>
              </div>
            ))}
            <Button variant="ghost" size="sm" className="w-full text-xs" onClick={() => onNavigate('inventory')}>
              {tr('View all inventory alerts')}
              <ChevronRight className="h-3.5 w-3.5" />
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Business Health */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <div>
            <CardTitle className="text-base flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-primary" />
              {tr('Business Health')}
            </CardTitle>
            <p className="text-sm text-muted-foreground mt-1">{tr('AI-powered performance score')}</p>
          </div>
          <Button variant="outline" size="sm" onClick={() => setInsightsOpen(true)} className="gap-1.5">
            {tr('View Insights')}
            <ChevronRight className="h-3.5 w-3.5" />
          </Button>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-6">
            <div className="flex flex-col items-center justify-center">
              <div className="relative h-40 w-40">
                <ResponsiveContainer width="100%" height="100%">
                  <RadialBarChart innerRadius="70%" outerRadius="100%" data={[{ value: businessHealth.total }]} startAngle={90} endAngle={90 - (businessHealth.total / 100) * 360}>
                    <RadialBar dataKey="value" fill={healthColor} cornerRadius={20} background={{ fill: 'hsl(var(--muted))' }} />
                  </RadialBarChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-4xl font-bold">{businessHealth.total}</span>
                  <span className="text-xs text-muted-foreground">/ 100</span>
                </div>
              </div>
              <Badge className={cn('mt-2', businessHealth.total >= 80 ? 'bg-success/15 text-success border-success/20' : 'bg-warning/15 text-warning border-warning/20')}>
                {businessHealth.label}
              </Badge>
            </div>
            <div className="space-y-4">
              {businessHealth.scores.map((s) => (
                <div key={s.name}>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-sm font-medium">{s.name}</span>
                    <span className="text-sm font-semibold">{s.score}</span>
                  </div>
                  <Progress value={s.score} className={cn('h-2', s.score >= 80 ? '[&_[data-radix-progress-indicator]]:bg-success' : s.score >= 60 ? '[&_[data-radix-progress-indicator]]:bg-warning' : '[&_[data-radix-progress-indicator]]:bg-destructive')} />
                  <p className="text-xs text-muted-foreground mt-1">{s.explanation}</p>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Top Selling + Category Sales */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="pb-4">
            <CardTitle className="text-base">{tr('Top Selling Items')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {topSellingItems.map((item) => (
                <div key={item.rank} className="flex items-center gap-3 group hover:bg-muted/30 rounded-lg p-2 -mx-2 transition-colors">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary text-sm font-bold shrink-0">{item.rank}</div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{item.name}</p>
                    <p className="text-xs text-muted-foreground">{item.category} · {item.sold} {tr('sold')}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold">{formatNPR(item.revenue)}</p>
                    <p className="text-xs text-success flex items-center justify-end gap-0.5">
                      <TrendingUp className="h-3 w-3" />
                      {formatPercent(item.trend)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-4">
            <CardTitle className="text-base">{tr('Sales by Category')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <ResponsiveContainer width="50%" height={200}>
                <PieChart>
                  <Pie data={categorySales} dataKey="revenue" nameKey="category" cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={2}>
                    {categorySales.map((entry, i) => (<Cell key={i} fill={entry.color} />))}
                  </Pie>
                  <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px', fontSize: '12px' }} formatter={(value: number) => formatNPR(value)} />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex-1 space-y-2">
                {categorySales.slice(0, 6).map((c) => (
                  <div key={c.category} className="flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-full shrink-0" style={{ backgroundColor: c.color }} />
                    <span className="text-xs flex-1 truncate">{c.category}</span>
                    <span className="text-xs font-medium">{c.percentage}%</span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Orders */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle className="text-base">{tr('Recent Orders')}</CardTitle>
          <Button variant="ghost" size="sm" onClick={() => onNavigate('orders')} className="gap-1 text-xs">
            {tr('View all orders')}
            <ChevronRight className="h-3.5 w-3.5" />
          </Button>
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
                {orders.slice(0, 8).map((order) => (
                  <tr key={order.id} className="border-b last:border-0 hover:bg-muted/30 transition-colors">
                    <td className="px-6 py-3 font-medium">{order.id}</td>
                    <td className="px-6 py-3 text-muted-foreground">{order.time}</td>
                    <td className="px-6 py-3">{order.table}</td>
                    <td className="px-6 py-3">{order.customer}</td>
                    <td className="px-6 py-3 text-muted-foreground">{order.items.length} {tr('items')}</td>
                    <td className="px-6 py-3 text-right font-medium">{formatNPR(order.amount)}</td>
                    <td className="px-6 py-3 text-muted-foreground">{order.payment}</td>
                    <td className="px-6 py-3"><StatusBadge status={order.status} kind="order" /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Customer Insights */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle className="text-base">{tr('Customer Insights')}</CardTitle>
          <Button variant="ghost" size="sm" onClick={() => onNavigate('customers')} className="gap-1 text-xs">
            {tr('View all customers')}
            <ChevronRight className="h-3.5 w-3.5" />
          </Button>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <CustomerInsightCard label={tr('New Customers')} value={newCustomers} icon={Sparkles} color="text-chart-6" bg="bg-chart-6/10" />
            <CustomerInsightCard label={tr('Returning')} value={returningCustomers} icon={CircleCheck} color="text-chart-3" bg="bg-chart-3/10" />
            <CustomerInsightCard label={tr('VIP')} value={vipCustomers} icon={Users} color="text-primary" bg="bg-primary/10" />
            <CustomerInsightCard label={tr('Inactive')} value={inactiveCustomers} icon={UserX} color="text-destructive" bg="bg-destructive/10" />
          </div>
        </CardContent>
      </Card>

      {/* Recommended Actions */}
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="text-base flex items-center gap-2">
            <Lightbulb className="h-4 w-4 text-primary" />
            {tr('Recommended Actions')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {recommendedActions.map((action) => (
              <div key={action.id} className="flex items-start gap-3 rounded-lg border p-4 hover:border-primary/30 transition-colors group">
                <div className={cn('mt-0.5 h-2 w-2 rounded-full shrink-0', action.priority === 'high' ? 'bg-destructive' : action.priority === 'medium' ? 'bg-warning' : 'bg-chart-3')} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium">{action.title}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{action.description}</p>
                  <Button variant="outline" size="sm" className="mt-2.5 h-7 text-xs gap-1" onClick={() => {
                    if (action.action.includes('Purchase')) onNavigate('purchases');
                    else if (action.action.includes('WhatsApp') || action.action.includes('Follow')) onNavigate('customers');
                    else if (action.action.includes('Menu')) onNavigate('menu');
                    else if (action.action.includes('Order')) onNavigate('purchases');
                  }}>
                    {action.action}
                    <ChevronRight className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Insights Dialog */}
      <Dialog open={insightsOpen} onOpenChange={setInsightsOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              {tr('Business Insights')}
            </DialogTitle>
            <DialogDescription>
              {tr("AI-generated analysis of your restaurant's performance")}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            {businessHealth.scores.map((s) => (
              <div key={s.name} className="rounded-lg border p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium">{s.name}</span>
                  <span className={cn('text-lg font-bold', s.score >= 80 ? 'text-success' : s.score >= 60 ? 'text-warning' : 'text-destructive')}>
                    {s.score}/100
                  </span>
                </div>
                <p className="text-sm text-muted-foreground">{s.explanation}</p>
              </div>
            ))}
            <div className="rounded-lg bg-primary/5 border border-primary/20 p-4">
              <p className="text-sm font-medium mb-1">{tr('Overall Assessment')}</p>
              <p className="text-sm text-muted-foreground">
                Your restaurant is performing well with a health score of {businessHealth.total}/100. Sales are strong and customer retention is improving. Focus on restocking critical inventory items and reviewing food costs to push the score above 90.
              </p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function KpiCard({
  label, value, change, subValue, icon: Icon, iconBg, neutral, alert,
}: {
  label: string;
  value: string;
  change?: number;
  subValue?: string;
  icon: typeof DollarSign;
  iconBg: string;
  neutral?: boolean;
  alert?: boolean;
}) {
  return (
    <Card className="p-4 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-3">
        <div className={cn('flex h-9 w-9 items-center justify-center rounded-lg', iconBg)}>
          <Icon className="h-[18px] w-[18px]" />
        </div>
        {!neutral && change !== undefined && (
          <span className={cn('flex items-center gap-0.5 text-xs font-medium', alert ? 'text-destructive' : change >= 0 ? 'text-success' : 'text-destructive')}>
            {change >= 0 ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
            {formatPercent(change)}
          </span>
        )}
      </div>
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="text-lg font-bold mt-0.5 tracking-tight">{value}</p>
      {subValue && <p className="text-xs text-muted-foreground mt-0.5">{subValue}</p>}
    </Card>
  );
}

function CustomerInsightCard({
  label, value, icon: Icon, color, bg,
}: {
  label: string;
  value: number;
  icon: typeof Users;
  color: string;
  bg: string;
}) {
  return (
    <div className="flex items-center gap-3 rounded-lg border p-3">
      <div className={cn('flex h-10 w-10 items-center justify-center rounded-lg', bg)}>
        <Icon className={cn('h-5 w-5', color)} />
      </div>
      <div>
        <p className="text-2xl font-bold leading-none">{value}</p>
        <p className="text-xs text-muted-foreground mt-1">{label}</p>
      </div>
    </div>
  );
}
