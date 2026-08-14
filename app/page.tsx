'use client';

import { useState, useEffect } from 'react';
import { AppProvider, useApp } from '@/lib/store';
import { Sidebar } from '@/components/sidebar';
import { Header } from '@/components/header';
import { DemoControls } from '@/components/demo-controls';
import { Toaster } from 'sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { formatDate } from '@/lib/format';
import { Calendar } from 'lucide-react';

import { OverviewPage } from '@/components/pages/overview';
import { OrdersPage } from '@/components/pages/orders';
import { TablesPage } from '@/components/pages/tables';
import { MenuPage } from '@/components/pages/menu';
import { InventoryPage } from '@/components/pages/inventory';
import { PurchasesPage } from '@/components/pages/purchases';
import { CustomersPage } from '@/components/pages/customers';
import { StaffPage } from '@/components/pages/staff';
import { ExpensesPage } from '@/components/pages/expenses';
import { ReportsPage } from '@/components/pages/reports';
import { AutomationPage } from '@/components/pages/automation';
import { SettingsPage } from '@/components/pages/settings';

export const dynamic = 'force-dynamic';

function AppContent() {
  const [activePage, setActivePage] = useState('overview');
  const [mobileOpen, setMobileOpen] = useState(false);
  const { canAccess, role } = useApp();

  const handleNavigate = (key: string) => {
    if (canAccess(key)) setActivePage(key);
  };

  useEffect(() => {
    if (!canAccess(activePage)) setActivePage('overview');
  }, [role, activePage, canAccess]);

  const renderPage = () => {
    switch (activePage) {
      case 'overview': return <OverviewPage onNavigate={handleNavigate} />;
      case 'orders': return <OrdersPage />;
      case 'tables': return <TablesPage />;
      case 'menu': return <MenuPage />;
      case 'inventory': return <InventoryPage />;
      case 'purchases': return <PurchasesPage />;
      case 'customers': return <CustomersPage />;
      case 'staff': return <StaffPage />;
      case 'expenses': return <ExpensesPage />;
      case 'reports': return <ReportsPage />;
      case 'automation': return <AutomationPage />;
      case 'settings': return <SettingsPage />;
      default: return <OverviewPage onNavigate={handleNavigate} />;
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <Sidebar
        activePage={activePage}
        onNavigate={handleNavigate}
        mobileOpen={mobileOpen}
        onMobileClose={() => setMobileOpen(false)}
      />
      <div className="flex flex-1 flex-col overflow-hidden min-w-0">
        <Header
          onNavigate={handleNavigate}
          onMobileMenuOpen={() => setMobileOpen(true)}
        />
        <main className="flex-1 overflow-y-auto scrollbar-thin">
          <div className="mx-auto max-w-[1400px] px-3 sm:px-6 py-4 sm:py-6">
            {activePage !== 'overview' && (
              <div className="flex items-center justify-between mb-4 sm:mb-6">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  {formatDate(new Date())}
                </div>
                <DemoControls />
              </div>
            )}
            <div key={activePage} className="animate-fade-in">
              {renderPage()}
            </div>
          </div>
        </main>
      </div>
      <Toaster position="bottom-right" richColors closeButton />
    </div>
  );
}

export default function Home() {
  return (
    <AppProvider>
      <TooltipProvider>
        <AppContent />
      </TooltipProvider>
    </AppProvider>
  );
}
