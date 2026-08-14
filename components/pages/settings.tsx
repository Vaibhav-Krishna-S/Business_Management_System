'use client';

import { useState } from 'react';
import {
  Store, Users, Percent, CreditCard, Bell, MessageCircle, Bot, Clock, Download, Save,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import { useApp } from '@/lib/store';
import { translate } from '@/lib/i18n';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

export function SettingsPage() {
  const { language } = useApp();
  const tr = (key: string) => translate(key, language);
  const [activeSection, setActiveSection] = useState('profile');

  const sections = [
    { key: 'profile', label: tr('Restaurant Profile'), icon: Store },
    { key: 'users', label: tr('Users & Roles'), icon: Users },
    { key: 'tax', label: tr('Tax Settings'), icon: Percent },
    { key: 'payments', label: tr('Payment Methods'), icon: CreditCard },
    { key: 'notifications', label: tr('Notifications'), icon: Bell },
    { key: 'whatsapp', label: tr('WhatsApp Integration'), icon: MessageCircle },
    { key: 'ai', label: tr('AI Assistant'), icon: Bot },
    { key: 'hours', label: tr('Business Hours'), icon: Clock },
    { key: 'export', label: tr('Data Export'), icon: Download },
  ];

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-bold">{tr('Settings')}</h1>
        <p className="text-sm text-muted-foreground">{tr('Configure your restaurant platform')}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[220px_1fr] gap-4">
        <div className="flex flex-wrap lg:flex-col gap-1.5">
          {sections.map((s) => {
            const Icon = s.icon;
            return (
              <button key={s.key} onClick={() => setActiveSection(s.key)} className={cn('flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors text-left', activeSection === s.key ? 'bg-primary text-primary-foreground' : 'hover:bg-accent')}>
                <Icon className="h-4 w-4 shrink-0" />
                <span className="whitespace-nowrap">{s.label}</span>
              </button>
            );
          })}
        </div>

        <div className="space-y-4">
          {activeSection === 'profile' && <ProfileSection tr={tr} />}
          {activeSection === 'users' && <UsersSection tr={tr} />}
          {activeSection === 'tax' && <TaxSection tr={tr} />}
          {activeSection === 'payments' && <PaymentsSection tr={tr} />}
          {activeSection === 'notifications' && <NotificationsSection tr={tr} />}
          {activeSection === 'whatsapp' && <WhatsAppSection tr={tr} />}
          {activeSection === 'ai' && <AISection tr={tr} />}
          {activeSection === 'hours' && <HoursSection tr={tr} />}
          {activeSection === 'export' && <ExportSection tr={tr} />}
        </div>
      </div>
    </div>
  );
}

type Tr = (key: string) => string;

function ProfileSection({ tr }: { tr: Tr }) {
  return (
    <Card>
      <CardHeader><CardTitle className="text-base">{tr('Restaurant Profile')}</CardTitle></CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div><Label className="mb-1.5 block">{tr('Restaurant Name')}</Label><Input defaultValue="The Mango Resort Restaurant" /></div>
          <div><Label className="mb-1.5 block">{tr('Outlet Name')}</Label><Input defaultValue="Main Restaurant" /></div>
          <div><Label className="mb-1.5 block">{tr('Phone')}</Label><Input defaultValue="+977-1-4445555" /></div>
          <div><Label className="mb-1.5 block">{tr('Email')}</Label><Input defaultValue="restaurant@mangoresort.com" /></div>
          <div className="md:col-span-2"><Label className="mb-1.5 block">{tr('Address')}</Label><Textarea defaultValue="Lakeside Road, Pokhara, Nepal" rows={2} /></div>
          <div><Label className="mb-1.5 block">{tr('Currency')}</Label><Select defaultValue="NPR"><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="NPR">NPR — Nepalese Rupee</SelectItem></SelectContent></Select></div>
          <div><Label className="mb-1.5 block">{tr('Timezone')}</Label><Select defaultValue="Asia/Kathmandu"><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="Asia/Kathmandu">Asia/Kathmandu (UTC+5:45)</SelectItem></SelectContent></Select></div>
        </div>
        <SaveButton tr={tr} />
      </CardContent>
    </Card>
  );
}

function UsersSection({ tr }: { tr: Tr }) {
  const roles = [
    { role: 'Owner', name: 'Admin', access: tr('Full access') },
    { role: 'Manager', name: 'Suresh Maharjan', access: 'Operations + reports + staff' },
    { role: 'Cashier', name: 'Rabina Karki', access: 'Orders + payments' },
    { role: 'Waiter', name: 'Ramesh Tamang', access: 'Tables + orders' },
    { role: 'Chef', name: 'Chef Hari Bahadur', access: 'Kitchen/orders only' },
    { role: 'Inventory Manager', name: 'Gopal Tamang', access: 'Inventory + purchases' },
  ];
  return (
    <Card>
      <CardHeader><CardTitle className="text-base">{tr('Users & Roles')}</CardTitle></CardHeader>
      <CardContent className="space-y-3">
        {roles.map((r) => (
          <div key={r.role} className="flex items-center justify-between rounded-lg border p-3">
            <div>
              <p className="text-sm font-medium">{r.name}</p>
              <p className="text-xs text-muted-foreground">{r.role} · {r.access}</p>
            </div>
            <Button size="sm" variant="outline" className="h-7 text-xs" onClick={() => toast.success('Edit user form opened')}>{tr('Edit')}</Button>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

function TaxSection({ tr }: { tr: Tr }) {
  return (
    <Card>
      <CardHeader><CardTitle className="text-base">{tr('Tax Settings')}</CardTitle></CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div><Label className="mb-1.5 block">{tr('VAT Rate (%)')}</Label><Input type="number" defaultValue="13" /></div>
          <div><Label className="mb-1.5 block">{tr('Service Charge (%)')}</Label><Input type="number" defaultValue="10" /></div>
          <div><Label className="mb-1.5 block">{tr('Default Discount (%)')}</Label><Input type="number" defaultValue="5" /></div>
          <div><Label className="mb-1.5 block">{tr('Tax Number (PAN)')}</Label><Input defaultValue="601234567" /></div>
        </div>
        <SaveButton tr={tr} />
      </CardContent>
    </Card>
  );
}

function PaymentsSection({ tr }: { tr: Tr }) {
  const methods = [
    { name: 'Cash', enabled: true },
    { name: 'Card', enabled: true },
    { name: 'eSewa', enabled: true },
    { name: 'Khalti', enabled: true },
    { name: 'Bank Transfer', enabled: true },
  ];
  return (
    <Card>
      <CardHeader><CardTitle className="text-base">{tr('Payment Methods')}</CardTitle></CardHeader>
      <CardContent className="space-y-3">
        {methods.map((m) => (
          <div key={m.name} className="flex items-center justify-between rounded-lg border p-3">
            <span className="text-sm font-medium">{m.name}</span>
            <Switch defaultChecked={m.enabled} />
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

function NotificationsSection({ tr }: { tr: Tr }) {
  const notifs = [
    { label: 'Low stock alerts', desc: 'Notify when items fall below minimum stock', enabled: true },
    { label: 'Expiry alerts', desc: 'Notify when items are expiring soon', enabled: true },
    { label: 'Daily sales report', desc: 'Email daily summary at end of day', enabled: true },
    { label: 'New customer signup', desc: 'Notify when a new customer is added', enabled: false },
    { label: 'Order cancellation', desc: 'Notify when an order is cancelled', enabled: true },
  ];
  return (
    <Card>
      <CardHeader><CardTitle className="text-base">{tr('Notification Settings')}</CardTitle></CardHeader>
      <CardContent className="space-y-3">
        {notifs.map((n) => (
          <div key={n.label} className="flex items-center justify-between rounded-lg border p-3">
            <div><p className="text-sm font-medium">{n.label}</p><p className="text-xs text-muted-foreground">{n.desc}</p></div>
            <Switch defaultChecked={n.enabled} />
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

function WhatsAppSection({ tr }: { tr: Tr }) {
  return (
    <Card>
      <CardHeader><CardTitle className="text-base">{tr('WhatsApp Integration')}</CardTitle></CardHeader>
      <CardContent className="space-y-4">
        <div className="rounded-lg border border-warning/30 bg-warning/5 p-3 flex items-start gap-2.5">
          <MessageCircle className="h-4 w-4 text-warning shrink-0 mt-0.5" />
          <p className="text-xs text-muted-foreground">Connect your WhatsApp Business account to send automated messages, offers, and follow-ups to customers.</p>
        </div>
        <div><Label className="mb-1.5 block">WhatsApp Business Number</Label><Input placeholder="+977-98XXXXXXXX" /></div>
        <div><Label className="mb-1.5 block">API Key</Label><Input type="password" placeholder="Enter your WhatsApp Business API key" /></div>
        <Button onClick={() => toast.success('WhatsApp integration saved')} className="gap-1.5"><Save className="h-4 w-4" /> {tr('Connect WhatsApp')}</Button>
      </CardContent>
    </Card>
  );
}

function AISection({ tr }: { tr: Tr }) {
  return (
    <Card>
      <CardHeader><CardTitle className="text-base">{tr('AI Assistant Configuration')}</CardTitle></CardHeader>
      <CardContent className="space-y-4">
        <div className="rounded-lg border border-primary/20 bg-primary/5 p-3 flex items-start gap-2.5">
          <Bot className="h-4 w-4 text-primary shrink-0 mt-0.5" />
          <p className="text-xs text-muted-foreground">MangoOS Copilot uses your restaurant data to answer questions and provide insights.</p>
        </div>
        <div><Label className="mb-1.5 block">AI Provider</Label><Select defaultValue="simulated"><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="simulated">Simulated (Prototype)</SelectItem><SelectItem value="openai">OpenAI API</SelectItem><SelectItem value="custom">Custom API</SelectItem></SelectContent></Select></div>
        <div><Label className="mb-1.5 block">API Key</Label><Input type="password" placeholder="Enter API key (optional for prototype)" /></div>
        <div className="flex items-center justify-between rounded-lg border p-3">
          <div><p className="text-sm font-medium">{tr('Enable AI Copilot')}</p><p className="text-xs text-muted-foreground">{tr('Show Copilot button in header')}</p></div>
          <Switch defaultChecked />
        </div>
        <SaveButton tr={tr} />
      </CardContent>
    </Card>
  );
}

function HoursSection({ tr }: { tr: Tr }) {
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  return (
    <Card>
      <CardHeader><CardTitle className="text-base">{tr('Business Hours')}</CardTitle></CardHeader>
      <CardContent className="space-y-3">
        {days.map((day) => (
          <div key={day} className="flex items-center gap-3">
            <span className="text-sm font-medium w-28">{day}</span>
            <Switch defaultChecked />
            <Input type="time" defaultValue="07:00" className="w-32" />
            <span className="text-muted-foreground">{tr('to')}</span>
            <Input type="time" defaultValue="22:00" className="w-32" />
          </div>
        ))}
        <SaveButton tr={tr} />
      </CardContent>
    </Card>
  );
}

function ExportSection({ tr }: { tr: Tr }) {
  return (
    <Card>
      <CardHeader><CardTitle className="text-base">{tr('Data Export')}</CardTitle></CardHeader>
      <CardContent className="space-y-3">
        <p className="text-sm text-muted-foreground">Export your restaurant data for backup or analysis.</p>
        {['Orders', 'Customers', 'Inventory', 'Expenses', 'Menu Items', 'Purchase Orders'].map((d) => (
          <div key={d} className="flex items-center justify-between rounded-lg border p-3">
            <span className="text-sm font-medium">{d}</span>
            <Button size="sm" variant="outline" className="h-7 text-xs gap-1" onClick={() => toast.success(`Exporting ${d}...`)}>
              <Download className="h-3 w-3" /> {tr('Export CSV')}
            </Button>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

function SaveButton({ tr }: { tr: Tr }) {
  return (
    <div className="pt-2">
      <Button onClick={() => toast.success('Settings saved')} className="gap-1.5"><Save className="h-4 w-4" /> {tr('Save Changes')}</Button>
    </div>
  );
}
