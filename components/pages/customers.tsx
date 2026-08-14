'use client';

import { useState, useMemo } from 'react';
import {
  Search, Plus, MessageCircle, Mail, Star, ShoppingBag, Phone, Clock,
  TrendingUp, Users, UserX, Sparkles, ChevronRight, Send,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose,
} from '@/components/ui/dialog';
import { StatusBadge } from '@/components/status-badge';
import { customers as initialCustomers } from '@/lib/mock-data';
import { formatNPR, formatShortDate } from '@/lib/format';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import type { Customer } from '@/lib/types';

const segmentFilters = ['All', 'VIP', 'High Spender', 'Regular', 'Returning Customer', 'New Customer', 'Inactive', 'At Risk'];

export function CustomersPage() {
  const [customers] = useState<Customer[]>(initialCustomers);
  const [search, setSearch] = useState('');
  const [filterSegment, setFilterSegment] = useState('All');
  const [selected, setSelected] = useState<Customer | null>(null);
  const [offerOpen, setOfferOpen] = useState(false);
  const [emailOpen, setEmailOpen] = useState(false);

  const filtered = useMemo(() => customers.filter((c) => {
    const matchSearch = c.name.toLowerCase().includes(search.toLowerCase()) || c.phone.includes(search);
    const matchSegment = filterSegment === 'All' || c.segment === filterSegment;
    return matchSearch && matchSegment;
  }), [customers, search, filterSegment]);

  const segments = {
    new: customers.filter((c) => c.segment === 'New Customer').length,
    returning: customers.filter((c) => c.segment === 'Returning Customer').length,
    vip: customers.filter((c) => c.segment === 'VIP').length,
    inactive: customers.filter((c) => c.segment === 'Inactive' || c.segment === 'At Risk').length,
  };

  const retentionOps = [
    { text: '24 customers haven\'t visited in 30+ days', detail: 'Send re-engagement offers via WhatsApp' },
    { text: '12 VIP customers haven\'t visited this month', detail: 'Personalized outreach recommended' },
    { text: '18 customers frequently order beverages but haven\'t tried desserts', detail: 'Cross-sell opportunity' },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold">Customers</h1>
          <p className="text-sm text-muted-foreground">Restaurant customer intelligence system</p>
        </div>
        <Button className="gap-1.5" onClick={() => toast.success('Add customer form opened')}><Plus className="h-4 w-4" /> Add Customer</Button>
      </div>

      {/* Segment KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <KpiCard label="New Customers" value={segments.new} icon={Sparkles} color="text-chart-6" bg="bg-chart-6/10" />
        <KpiCard label="Returning" value={segments.returning} icon={TrendingUp} color="text-chart-3" bg="bg-chart-3/10" />
        <KpiCard label="VIP" value={segments.vip} icon={Users} color="text-primary" bg="bg-primary/10" />
        <KpiCard label="Inactive" value={segments.inactive} icon={UserX} color="text-destructive" bg="bg-destructive/10" />
      </div>

      {/* Retention Opportunities */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2"><Sparkles className="h-4 w-4 text-primary" /> Retention Opportunities</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {retentionOps.map((r, i) => (
              <div key={i} className="flex items-start gap-3 rounded-lg border p-3">
                <span className="mt-1 h-2 w-2 rounded-full bg-primary shrink-0" />
                <div className="flex-1">
                  <p className="text-sm font-medium">{r.text}</p>
                  <p className="text-xs text-muted-foreground">{r.detail}</p>
                </div>
                <Button size="sm" variant="outline" className="h-7 text-xs gap-1" onClick={() => toast.success('Campaign created')}>
                  <Send className="h-3 w-3" /> Act Now
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Search + Filter */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by name or phone..." className="pl-9" />
        </div>
        <div className="flex flex-wrap gap-1.5">
          {segmentFilters.map((s) => (
            <button
              key={s}
              onClick={() => setFilterSegment(s)}
              className={cn(
                'rounded-lg px-2.5 py-1.5 text-xs font-medium transition-colors',
                filterSegment === s ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground hover:bg-accent'
              )}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Customer Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  {['Customer', 'Segment', 'Visits', 'Total Spend', 'Avg Order', 'Last Visit', 'Preferred', ''].map((h) => (
                    <th key={h} className="px-4 py-3 text-left font-medium text-muted-foreground text-xs uppercase tracking-wider whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.slice(0, 25).map((c) => (
                  <tr key={c.id} className="border-b last:border-0 hover:bg-muted/30 transition-colors cursor-pointer" onClick={() => setSelected(c)}>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2.5">
                        <Avatar className="h-8 w-8"><AvatarFallback className="bg-primary/10 text-primary text-xs">{c.name.split(' ').map(n => n[0]).join('').slice(0, 2)}</AvatarFallback></Avatar>
                        <div>
                          <p className="font-medium">{c.name}</p>
                          <p className="text-xs text-muted-foreground">{c.phone}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3"><StatusBadge status={c.segment} kind="segment" /></td>
                    <td className="px-4 py-3">{c.totalVisits}</td>
                    <td className="px-4 py-3 font-medium">{formatNPR(c.totalSpend)}</td>
                    <td className="px-4 py-3 text-muted-foreground">{formatNPR(c.averageOrderValue)}</td>
                    <td className="px-4 py-3 text-muted-foreground">{formatShortDate(c.lastVisit)}</td>
                    <td className="px-4 py-3"><Badge variant="secondary" className="text-[10px]">{c.preferredChannel}</Badge></td>
                    <td className="px-4 py-3 text-right"><ChevronRight className="h-4 w-4 text-muted-foreground" /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {filtered.length > 25 && <div className="p-3 text-center text-sm text-muted-foreground">Showing 25 of {filtered.length} customers</div>}
        </CardContent>
      </Card>

      {/* Customer Detail Dialog */}
      <Dialog open={!!selected} onOpenChange={(v) => !v && setSelected(null)}>
        <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
          {selected && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-3">
                  <Avatar className="h-10 w-10"><AvatarFallback className="bg-primary/10 text-primary">{selected.name.split(' ').map(n => n[0]).join('').slice(0, 2)}</AvatarFallback></Avatar>
                  <div>
                    <p>{selected.name}</p>
                    <p className="text-sm font-normal text-muted-foreground flex items-center gap-2">
                      <Phone className="h-3 w-3" />{selected.phone}
                      <span>·</span>
                      <Mail className="h-3 w-3" />{selected.email}
                    </p>
                  </div>
                </DialogTitle>
              </DialogHeader>

              {/* Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <StatBox label="Total Orders" value={String(selected.totalVisits)} icon={ShoppingBag} />
                <StatBox label="Total Spend" value={formatNPR(selected.totalSpend)} icon={TrendingUp} />
                <StatBox label="Avg Order" value={formatNPR(selected.averageOrderValue)} icon={Star} />
                <StatBox label="Loyalty Points" value={String(selected.loyaltyPoints)} icon={Sparkles} />
              </div>

              {/* Details */}
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div><span className="text-muted-foreground">Last Visit:</span> {formatShortDate(selected.lastVisit)}</div>
                <div><span className="text-muted-foreground">Visit Frequency:</span> {selected.visitFrequency}</div>
                <div><span className="text-muted-foreground">Preferred Payment:</span> {selected.preferredPayment}</div>
                <div><span className="text-muted-foreground">Preferred Channel:</span> {selected.preferredChannel}</div>
              </div>

              {/* Favorites */}
              <div>
                <p className="text-sm font-medium mb-2">Favorite Items</p>
                <div className="flex flex-wrap gap-1.5">
                  {selected.favoriteItems.map((f, i) => <Badge key={i} variant="secondary">{f}</Badge>)}
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-wrap gap-2">
                <Button size="sm" variant="outline" className="gap-1.5" onClick={() => setOfferOpen(true)}><MessageCircle className="h-3.5 w-3.5" /> Send WhatsApp Offer</Button>
                <Button size="sm" variant="outline" className="gap-1.5" onClick={() => setEmailOpen(true)}><Mail className="h-3.5 w-3.5" /> Send Email</Button>
                <Button size="sm" variant="outline" className="gap-1.5" onClick={() => toast.success(`${selected.loyaltyPoints + 100} loyalty points`)}><Sparkles className="h-3.5 w-3.5" /> Add Loyalty Points</Button>
                <Button size="sm" variant="outline" className="gap-1.5" onClick={() => toast.success('Loading order history...')}><ShoppingBag className="h-3.5 w-3.5" /> View Orders</Button>
              </div>

              <Separator />

              {/* Journey Timeline */}
              <div>
                <p className="text-sm font-medium mb-3">Customer Journey</p>
                <div className="space-y-3">
                  {selected.journey.map((j, i) => (
                    <div key={i} className="flex gap-3">
                      <div className="flex flex-col items-center">
                        <div className={cn('flex h-7 w-7 items-center justify-center rounded-full shrink-0',
                          j.type === 'Order' ? 'bg-primary/10 text-primary' :
                          j.type === 'Offer' ? 'bg-chart-4/10 text-chart-4' :
                          j.type === 'Feedback' ? 'bg-success/10 text-success' :
                          j.type === 'Message' ? 'bg-chart-3/10 text-chart-3' : 'bg-muted text-muted-foreground')}>
                          {j.type === 'Order' ? <ShoppingBag className="h-3.5 w-3.5" /> :
                           j.type === 'Feedback' ? <Star className="h-3.5 w-3.5" /> :
                           j.type === 'Offer' ? <Sparkles className="h-3.5 w-3.5" /> :
                           <MessageCircle className="h-3.5 w-3.5" />}
                        </div>
                        {i < selected.journey.length - 1 && <div className="w-px h-6 bg-border mt-1" />}
                      </div>
                      <div className="flex-1 pb-1">
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-medium">{j.description}</p>
                          {j.amount && <span className="text-sm font-semibold text-primary">{formatNPR(j.amount)}</span>}
                        </div>
                        <p className="text-xs text-muted-foreground">{formatShortDate(j.date)} · {j.type}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Offer Dialog */}
      <Dialog open={offerOpen} onOpenChange={setOfferOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader><DialogTitle>Send WhatsApp Offer</DialogTitle></DialogHeader>
          {selected && (
            <div className="space-y-3">
              <p className="text-sm text-muted-foreground">Send a personalized offer to <span className="font-medium text-foreground">{selected.name}</span> via WhatsApp.</p>
              <div>
                <label className="text-sm font-medium mb-1.5 block">Offer Message</label>
                <textarea className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm" rows={3} defaultValue={`Hi ${selected.name.split(' ')[0]}! Enjoy 15% off your next visit to The Mango Resort Restaurant. Valid for 7 days. Show this message to claim.`} />
              </div>
            </div>
          )}
          <DialogFooter>
            <DialogClose asChild><Button variant="outline">Cancel</Button></DialogClose>
            <Button onClick={() => { toast.success('WhatsApp offer sent'); setOfferOpen(false); }} className="gap-1.5"><MessageCircle className="h-4 w-4" /> Send Offer</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Email Dialog */}
      <Dialog open={emailOpen} onOpenChange={setEmailOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader><DialogTitle>Send Email</DialogTitle></DialogHeader>
          {selected && (
            <div className="space-y-3">
              <p className="text-sm text-muted-foreground">To: {selected.email}</p>
              <div><label className="text-sm font-medium mb-1.5 block">Subject</label><Input defaultValue="Special offer just for you!" /></div>
              <div><label className="text-sm font-medium mb-1.5 block">Message</label><textarea className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm" rows={3} defaultValue={`Dear ${selected.name.split(' ')[0]}, thank you for being a valued customer...`} /></div>
            </div>
          )}
          <DialogFooter>
            <DialogClose asChild><Button variant="outline">Cancel</Button></DialogClose>
            <Button onClick={() => { toast.success('Email sent'); setEmailOpen(false); }} className="gap-1.5"><Mail className="h-4 w-4" /> Send Email</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function KpiCard({ label, value, icon: Icon, color, bg }: { label: string; value: number; icon: typeof Users; color: string; bg: string }) {
  return (
    <Card className="p-4">
      <div className={cn('inline-flex h-9 w-9 items-center justify-center rounded-lg mb-2', bg)}>
        <Icon className={cn('h-[18px] w-[18px]', color)} />
      </div>
      <p className="text-2xl font-bold leading-none">{value}</p>
      <p className="text-xs text-muted-foreground mt-1">{label}</p>
    </Card>
  );
}

function StatBox({ label, value, icon: Icon }: { label: string; value: string; icon: typeof Star }) {
  return (
    <div className="rounded-lg border p-3">
      <div className="flex items-center gap-1.5 text-muted-foreground mb-1"><Icon className="h-3 w-3" /><span className="text-xs">{label}</span></div>
      <p className="text-sm font-bold">{value}</p>
    </div>
  );
}
