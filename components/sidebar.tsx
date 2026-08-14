'use client';

import Image from 'next/image';
import { cn } from '@/lib/utils';
import { useApp } from '@/lib/store';
import { navItems } from '@/lib/nav';
import { ChevronLeft, X } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from '@/components/ui/tooltip';
import { translate } from '@/lib/i18n';

interface SidebarProps {
  activePage: string;
  onNavigate: (key: string) => void;
  mobileOpen?: boolean;
  onMobileClose?: () => void;
}

export function Sidebar({ activePage, onNavigate, mobileOpen, onMobileClose }: SidebarProps) {
  const { sidebarCollapsed, toggleSidebar, canAccess, role, language } = useApp();
  const tr = (key: string) => translate(key, language);

  const handleNavigate = (key: string) => {
    onNavigate(key);
    onMobileClose?.();
  };

  const sidebarContent = (
    <aside className={cn('flex flex-col h-full bg-sidebar text-sidebar-foreground border-r border-sidebar-border transition-all duration-300 ease-in-out', sidebarCollapsed ? 'w-[68px]' : 'w-[240px]')}>
      {/* Logo */}
      <div className="flex h-16 items-center gap-2.5 px-4 border-b border-sidebar-border shrink-0">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg overflow-hidden shrink-0">
          <Image src="/logo.jpg" alt="MangoOS Logo" width={36} height={36} className="object-cover w-full h-full" />
        </div>
        {!sidebarCollapsed && (
          <div className="flex flex-col leading-none flex-1">
            <span className="text-base font-bold tracking-tight text-white">MangoOS</span>
            <span className="text-[10px] text-sidebar-foreground/60 mt-0.5">{tr('Restaurant Platform')}</span>
          </div>
        )}
        {/* Mobile close button */}
        {onMobileClose && (
          <button onClick={onMobileClose} className="ml-auto text-sidebar-foreground/60 hover:text-sidebar-foreground lg:hidden">
            <X className="h-5 w-5" />
          </button>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto scrollbar-thin py-3 px-2">
        <TooltipProvider delayDuration={0}>
          <ul className="space-y-0.5">
            {navItems.map((item) => {
              const hasAccess = canAccess(item.key);
              const isActive = activePage === item.key;
              const Icon = item.icon;
              return (
                <li key={item.key}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button
                        onClick={() => hasAccess && handleNavigate(item.key)}
                        disabled={!hasAccess}
                        className={cn(
                          'group relative flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all',
                          isActive ? 'bg-primary text-primary-foreground shadow-sm'
                            : hasAccess ? 'text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
                            : 'text-sidebar-foreground/30 cursor-not-allowed',
                          sidebarCollapsed && 'justify-center px-0'
                        )}
                      >
                        <Icon className={cn('h-[18px] w-[18px] shrink-0', isActive && 'text-primary-foreground')} />
                        {!sidebarCollapsed && <span className="truncate">{tr(item.label)}</span>}
                        {!hasAccess && !sidebarCollapsed && (
                          <span className="ml-auto text-[9px] uppercase tracking-wider text-sidebar-foreground/30">{tr('Locked')}</span>
                        )}
                      </button>
                    </TooltipTrigger>
                    {(sidebarCollapsed || !hasAccess) && (
                      <TooltipContent side="right" className="bg-popover">
                        {tr(item.label)}{!hasAccess ? ` — ${tr('Not available for')} ${role}` : ''}
                      </TooltipContent>
                    )}
                  </Tooltip>
                </li>
              );
            })}
          </ul>
        </TooltipProvider>
      </nav>

      {/* Collapse toggle — desktop only */}
      <div className="border-t border-sidebar-border p-2 shrink-0 hidden lg:block">
        <button
          onClick={toggleSidebar}
          className="flex w-full items-center justify-center gap-2 rounded-lg px-3 py-2 text-xs text-sidebar-foreground/60 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors"
        >
          <ChevronLeft className={cn('h-4 w-4 transition-transform', sidebarCollapsed && 'rotate-180')} />
          {!sidebarCollapsed && <span>{tr('Collapse')}</span>}
        </button>
      </div>
    </aside>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <div className="hidden lg:flex h-screen sticky top-0">
        {sidebarContent}
      </div>

      {/* Mobile overlay + drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/60" onClick={onMobileClose} />
          {/* Drawer */}
          <div className="absolute left-0 top-0 h-full w-[240px]">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
}
