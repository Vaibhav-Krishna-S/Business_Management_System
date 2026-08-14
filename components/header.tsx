'use client';

import { useState } from 'react';
import { Bell, Plus, Search, ChevronDown, Store, Check, Moon, Sun, Languages } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useApp, outlets } from '@/lib/store';
import { notifications } from '@/lib/mock-data';
import { Copilot } from './copilot';
import { cn } from '@/lib/utils';
import type { Role } from '@/lib/types';
import { translate } from '@/lib/i18n';

const roles: Role[] = ['Owner', 'Manager', 'Cashier', 'Waiter', 'Chef', 'Inventory Manager'];

const quickActions = [
  { label: 'New Order', key: 'orders' },
  { label: 'Add Menu Item', key: 'menu' },
  { label: 'Add Inventory', key: 'inventory' },
  { label: 'Record Expense', key: 'expenses' },
  { label: 'Create Purchase Order', key: 'purchases' },
  { label: 'Add Customer', key: 'customers' },
];

export function Header({ onNavigate }: { onNavigate: (key: string) => void }) {
  const { role, setRole, outlet, setOutlet, demoMode, language, setLanguage, theme, toggleTheme } = useApp();
  const tr = (key: string) => translate(key, language);
  const [search, setSearch] = useState('');
  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <header className="flex h-16 items-center gap-3 border-b bg-card px-4 sm:px-6">
      {/* Search */}
      <div className="relative flex-1 max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder={tr('Search orders, customers, menu items...')}
          className="pl-9 h-9 bg-muted/50 border-transparent focus-visible:border-input"
        />
      </div>

      <div className="flex items-center gap-2 ml-auto">
        {/* Language toggle */}
        <Button
          variant="outline"
          size="sm"
          className="gap-1.5 h-9 font-semibold"
          onClick={() => setLanguage(language === 'en' ? 'ne' : 'en')}
        >
          <Languages className="h-4 w-4" />
          {language === 'en' ? 'नेपाली' : 'English'}
        </Button>

        {/* Dark mode toggle */}
        <Button variant="ghost" size="icon" className="h-9 w-9" onClick={toggleTheme}>
          {theme === 'dark' ? <Sun className="h-[18px] w-[18px]" /> : <Moon className="h-[18px] w-[18px]" />}
        </Button>

        {/* Demo badge */}
        {demoMode && (
          <Badge variant="secondary" className="hidden sm:flex gap-1.5 bg-primary/10 text-primary border-primary/20">
            <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
            {tr('DEMO')}
          </Badge>
        )}

        {/* Copilot */}
        <Copilot onNavigate={onNavigate} />

        {/* Notifications */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="relative h-9 w-9">
              <Bell className="h-[18px] w-[18px]" />
              {unreadCount > 0 && (
                <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-destructive px-1 text-[10px] font-bold text-destructive-foreground">
                  {unreadCount}
                </span>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80">
            <DropdownMenuLabel className="flex items-center justify-between">
              <span>{tr('Notifications')}</span>
              <span className="text-xs font-normal text-muted-foreground">{unreadCount} {tr('new')}</span>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            {notifications.slice(0, 5).map((n) => (
              <DropdownMenuItem key={n.id} className="flex flex-col items-start gap-1 py-2.5">
                <div className="flex items-center gap-2 w-full">
                  <span
                    className={cn(
                      'h-2 w-2 rounded-full shrink-0',
                      n.type === 'alert' ? 'bg-destructive' : n.type === 'success' ? 'bg-success' : 'bg-chart-3'
                    )}
                  />
                  <span className="text-sm font-medium flex-1">{n.title}</span>
                  {!n.read && <span className="h-2 w-2 rounded-full bg-primary" />}
                </div>
                <span className="text-xs text-muted-foreground pl-4">{n.description}</span>
                <span className="text-[10px] text-muted-foreground/60 pl-4">{n.time}</span>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Quick Add */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button size="sm" className="gap-1.5 h-9">
              <Plus className="h-4 w-4" />
              <span className="hidden sm:inline">{tr('Quick Add')}</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>{tr('Quick Actions')}</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {quickActions.map((a) => (
              <DropdownMenuItem key={a.key} onClick={() => onNavigate(a.key)} className="gap-2 cursor-pointer">
                <Plus className="h-3.5 w-3.5 text-muted-foreground" />
                {tr(a.label)}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Outlet selector */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="hidden md:flex gap-2 h-9 max-w-[200px]">
              <Store className="h-4 w-4 text-muted-foreground" />
              <span className="truncate">{outlet.replace('The Mango Resort — ', '')}</span>
              <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-64">
            <DropdownMenuLabel>{tr('Outlet / Location')}</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {outlets.map((o) => (
              <DropdownMenuItem key={o} onClick={() => setOutlet(o)} className="gap-2 cursor-pointer">
                <span className="flex-1 truncate">{o.replace('The Mango Resort — ', '')}</span>
                {outlet === o && <Check className="h-4 w-4 text-primary" />}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* User profile */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-2 rounded-lg p-1 pr-2 hover:bg-accent transition-colors">
              <Avatar className="h-8 w-8">
                <AvatarFallback className="bg-primary/15 text-primary text-xs font-semibold">
                  AD
                </AvatarFallback>
              </Avatar>
              <div className="hidden lg:flex flex-col items-start leading-none">
                <span className="text-xs font-semibold">{tr('Admin')}</span>
                <span className="text-[10px] text-muted-foreground">{role}</span>
              </div>
              <ChevronDown className="hidden lg:block h-3.5 w-3.5 text-muted-foreground" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>{tr('Role Simulation')}</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {roles.map((r) => (
              <DropdownMenuItem key={r} onClick={() => setRole(r)} className="gap-2 cursor-pointer">
                <span className="flex-1">{r}</span>
                {role === r && <Check className="h-4 w-4 text-primary" />}
              </DropdownMenuItem>
            ))}
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-muted-foreground cursor-pointer">
              {tr('Sign out')}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
