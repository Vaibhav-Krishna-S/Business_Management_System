'use client';

import { useState } from 'react';
import { Plus, Phone, Clock, ShoppingBag, TrendingUp, Search } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { StatusBadge } from '@/components/status-badge';
import { staff } from '@/lib/mock-data';
import { formatNPR } from '@/lib/format';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

const roleColors: Record<string, string> = {
  Owner: 'bg-primary/10 text-primary',
  Manager: 'bg-chart-3/10 text-chart-3',
  Cashier: 'bg-chart-4/10 text-chart-4',
  Waiter: 'bg-chart-2/10 text-chart-2',
  Chef: 'bg-destructive/10 text-destructive',
  'Inventory Manager': 'bg-chart-6/10 text-chart-6',
};

export function StaffPage() {
  const [search, setSearch] = useState('');
  const filtered = staff.filter((s) => s.name.toLowerCase().includes(search.toLowerCase()) || s.role.toLowerCase().includes(search.toLowerCase()));

  const present = staff.filter((s) => s.attendance === 'Present').length;
  const late = staff.filter((s) => s.attendance === 'Late').length;
  const absent = staff.filter((s) => s.attendance === 'Absent').length;
  const onLeave = staff.filter((s) => s.attendance === 'On Leave').length;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold">Staff</h1>
          <p className="text-sm text-muted-foreground">{staff.length} team members</p>
        </div>
        <Button className="gap-1.5" onClick={() => toast.success('Add staff form opened')}><Plus className="h-4 w-4" /> Add Staff</Button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <KpiCard label="Present" value={present} bg="bg-success/10 text-success" />
        <KpiCard label="Late" value={late} bg="bg-warning/10 text-warning" />
        <KpiCard label="Absent" value={absent} bg="bg-destructive/10 text-destructive" />
        <KpiCard label="On Leave" value={onLeave} bg="bg-muted text-muted-foreground" />
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search staff by name or role..." className="pl-9 max-w-md" />
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  {['Name', 'Role', 'Shift', 'Attendance', 'Orders', 'Sales', 'Status'].map((h) => (
                    <th key={h} className="px-4 py-3 text-left font-medium text-muted-foreground text-xs uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((s) => (
                  <tr key={s.id} className="border-b last:border-0 hover:bg-muted/30 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2.5">
                        <Avatar className="h-8 w-8"><AvatarFallback className="bg-primary/10 text-primary text-xs">{s.name.split(' ').map(n => n[0]).join('').slice(0, 2)}</AvatarFallback></Avatar>
                        <div>
                          <p className="font-medium">{s.name}</p>
                          <p className="text-xs text-muted-foreground flex items-center gap-1"><Phone className="h-2.5 w-2.5" />{s.phone}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3"><span className={cn('inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium', roleColors[s.role] ?? 'bg-muted text-muted-foreground')}>{s.role}</span></td>
                    <td className="px-4 py-3 text-muted-foreground flex items-center gap-1"><Clock className="h-3 w-3" />{s.shift}</td>
                    <td className="px-4 py-3">
                      <span className={cn('text-xs font-medium',
                        s.attendance === 'Present' ? 'text-success' :
                        s.attendance === 'Late' ? 'text-warning' :
                        s.attendance === 'Absent' ? 'text-destructive' : 'text-muted-foreground')}>
                        {s.attendance}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">{s.ordersHandled || '—'}</td>
                    <td className="px-4 py-3 font-medium">{s.salesGenerated ? formatNPR(s.salesGenerated) : '—'}</td>
                    <td className="px-4 py-3"><StatusBadge status={s.status} kind="staff" /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function KpiCard({ label, value, bg }: { label: string; value: number; bg: string }) {
  return (
    <Card className="p-4">
      <div className={cn('inline-flex h-9 w-9 items-center justify-center rounded-lg mb-2', bg)}>
        <span className="text-lg font-bold">{value}</span>
      </div>
      <p className="text-xs text-muted-foreground">{label}</p>
    </Card>
  );
}
