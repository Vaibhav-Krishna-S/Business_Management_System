'use client';

import { useState } from 'react';
import { Users, Clock, Server, ArrowRightLeft, Merge, CalendarCheck, CircleCheck, X } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose,
} from '@/components/ui/dialog';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import { tables as initialTables } from '@/lib/mock-data';
import { formatNPR } from '@/lib/format';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import type { RestaurantTable, TableStatus } from '@/lib/types';

const statusColors: Record<TableStatus, string> = {
  Available: 'border-success/40 bg-success/5 hover:bg-success/10',
  Occupied: 'border-primary/40 bg-primary/5 hover:bg-primary/10',
  Reserved: 'border-chart-3/40 bg-chart-3/5 hover:bg-chart-3/10',
  Cleaning: 'border-border bg-muted/30 hover:bg-muted/50',
};

const statusDot: Record<TableStatus, string> = {
  Available: 'bg-success',
  Occupied: 'bg-primary',
  Reserved: 'bg-chart-3',
  Cleaning: 'bg-muted-foreground',
};

export function TablesPage() {
  const [tables, setTables] = useState<RestaurantTable[]>(initialTables);
  const [selectedTable, setSelectedTable] = useState<RestaurantTable | null>(null);
  const [transferTarget, setTransferTarget] = useState<string>('');

  const summary = {
    total: tables.length,
    available: tables.filter((t) => t.status === 'Available').length,
    occupied: tables.filter((t) => t.status === 'Occupied').length,
    reserved: tables.filter((t) => t.status === 'Reserved').length,
    cleaning: tables.filter((t) => t.status === 'Cleaning').length,
  };

  const updateTableStatus = (id: string, status: TableStatus) => {
    setTables((prev) => prev.map((t) => t.id === id ? { ...t, status, guests: status === 'Available' ? 0 : t.guests, occupiedSince: status === 'Occupied' ? new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }) : undefined, currentBill: status === 'Available' ? undefined : t.currentBill } : t));
    setSelectedTable((prev) => prev && prev.id === id ? { ...prev, status } : prev);
  };

  const handleTransfer = () => {
    if (!selectedTable || !transferTarget) return;
    const target = tables.find((t) => t.id === transferTarget);
    if (!target) return;
    setTables((prev) => prev.map((t) => {
      if (t.id === selectedTable.id) return { ...t, status: 'Available', guests: 0, occupiedSince: undefined, currentBill: undefined, server: undefined };
      if (t.id === transferTarget) return { ...t, status: 'Occupied', guests: selectedTable.guests, server: selectedTable.server, occupiedSince: selectedTable.occupiedSince, currentBill: selectedTable.currentBill };
      return t;
    }));
    toast.success(`Transferred ${selectedTable.label} to ${target.label}`);
    setSelectedTable(null);
    setTransferTarget('');
  };

  const handleMerge = (targetId: string) => {
    toast.success(`Merge request: ${selectedTable?.label} + ${targetId}`, { description: 'Tables will be combined for larger party.' });
    setSelectedTable(null);
  };

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-bold">Tables</h1>
        <p className="text-sm text-muted-foreground">Visual restaurant floor layout</p>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <SummaryCard label="Total Tables" value={summary.total} color="text-foreground" bg="bg-muted" />
        <SummaryCard label="Available" value={summary.available} color="text-success" bg="bg-success/10" />
        <SummaryCard label="Occupied" value={summary.occupied} color="text-primary" bg="bg-primary/10" />
        <SummaryCard label="Reserved" value={summary.reserved} color="text-chart-3" bg="bg-chart-3/10" />
      </div>

      {/* Floor layout */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-4">
        <Card>
          <CardHeader className="pb-4">
            <CardTitle className="text-base">Floor Plan</CardTitle>
            <div className="flex flex-wrap gap-3 mt-2">
              {(['Available', 'Occupied', 'Reserved', 'Cleaning'] as TableStatus[]).map((s) => (
                <div key={s} className="flex items-center gap-1.5">
                  <span className={cn('h-2.5 w-2.5 rounded-full', statusDot[s])} />
                  <span className="text-xs text-muted-foreground">{s}</span>
                </div>
              ))}
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {(['Indoor', 'Outdoor', 'Private'] as const).map((section) => (
                <div key={section}>
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">{section} Section</p>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                    {tables.filter((t) => t.section === section).map((table) => (
                      <button
                        key={table.id}
                        onClick={() => setSelectedTable(table)}
                        className={cn(
                          'group relative rounded-xl border-2 p-4 text-left transition-all',
                          statusColors[table.status]
                        )}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-lg font-bold">{table.label}</span>
                          <span className={cn('h-2.5 w-2.5 rounded-full', statusDot[table.status])} />
                        </div>
                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                          <Users className="h-3 w-3" />
                          {table.guests > 0 ? `${table.guests}/${table.seats} guests` : `${table.seats} seats`}
                        </div>
                        {table.currentBill && (
                          <p className="text-xs font-medium text-primary mt-1">{formatNPR(table.currentBill)}</p>
                        )}
                        {table.occupiedSince && (
                          <p className="text-[10px] text-muted-foreground mt-0.5 flex items-center gap-0.5">
                            <Clock className="h-2.5 w-2.5" /> Since {table.occupiedSince}
                          </p>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Side info */}
        <Card className="h-fit">
          <CardHeader className="pb-4">
            <CardTitle className="text-base">Table Status Overview</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {tables.map((t) => (
              <div key={t.id} className="flex items-center justify-between rounded-lg border p-2.5 hover:bg-muted/30 transition-colors cursor-pointer" onClick={() => setSelectedTable(t)}>
                <div className="flex items-center gap-2">
                  <span className={cn('h-2 w-2 rounded-full', statusDot[t.status])} />
                  <span className="text-sm font-medium">{t.label}</span>
                </div>
                <span className="text-xs text-muted-foreground">
                  {t.status === 'Occupied' && t.currentBill ? formatNPR(t.currentBill) : t.status}
                </span>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Table detail dialog */}
      <Dialog open={!!selectedTable} onOpenChange={(v) => !v && setSelectedTable(null)}>
        <DialogContent className="max-w-md">
          {selectedTable && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  Table {selectedTable.label}
                  <Badge variant="secondary" className="ml-1">{selectedTable.status}</Badge>
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <InfoRow icon={Users} label="Guests" value={`${selectedTable.guests} / ${selectedTable.seats}`} />
                  <InfoRow icon={Server} label="Server" value={selectedTable.server ?? '—'} />
                  <InfoRow icon={Clock} label="Occupied since" value={selectedTable.occupiedSince ?? '—'} />
                  <InfoRow icon={CalendarCheck} label="Section" value={selectedTable.section} />
                </div>
                {selectedTable.currentBill && (
                  <div className="rounded-lg bg-primary/5 border border-primary/20 p-3">
                    <p className="text-xs text-muted-foreground">Current Bill</p>
                    <p className="text-xl font-bold text-primary">{formatNPR(selectedTable.currentBill)}</p>
                  </div>
                )}

                {/* Actions */}
                <div className="space-y-2">
                  <p className="text-sm font-medium">Actions</p>
                  <div className="grid grid-cols-2 gap-2">
                    <Button size="sm" variant="outline" className="gap-1.5" onClick={() => { updateTableStatus(selectedTable.id, 'Occupied'); toast.success(`New order started for ${selectedTable.label}`); }}>
                      Create Order
                    </Button>
                    <Button size="sm" variant="outline" className="gap-1.5" onClick={() => { updateTableStatus(selectedTable.id, 'Reserved'); toast.success(`${selectedTable.label} reserved`); }}>
                      Reserve Table
                    </Button>
                    <Button size="sm" variant="outline" className="gap-1.5" onClick={() => { updateTableStatus(selectedTable.id, 'Available'); toast.success(`${selectedTable.label} marked available`); setSelectedTable(null); }}>
                      <CircleCheck className="h-3.5 w-3.5" /> Mark Available
                    </Button>
                    <Button size="sm" variant="outline" className="gap-1.5" onClick={() => { updateTableStatus(selectedTable.id, 'Cleaning'); toast.success(`${selectedTable.label} set to cleaning`); }}>
                      Mark Cleaning
                    </Button>
                  </div>
                </div>

                {/* Transfer */}
                <div className="space-y-2">
                  <p className="text-sm font-medium flex items-center gap-1.5"><ArrowRightLeft className="h-3.5 w-3.5" /> Transfer Table</p>
                  <div className="flex gap-2">
                    <Select value={transferTarget} onValueChange={setTransferTarget}>
                      <SelectTrigger className="flex-1 text-sm"><SelectValue placeholder="Select target table" /></SelectTrigger>
                      <SelectContent>
                        {tables.filter((t) => t.id !== selectedTable.id && t.status === 'Available').map((t) => (
                          <SelectItem key={t.id} value={t.id}>{t.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Button size="sm" onClick={handleTransfer} disabled={!transferTarget}>Transfer</Button>
                  </div>
                </div>

                {/* Merge */}
                <div className="space-y-2">
                  <p className="text-sm font-medium flex items-center gap-1.5"><Merge className="h-3.5 w-3.5" /> Merge Tables</p>
                  <div className="flex flex-wrap gap-1.5">
                    {tables.filter((t) => t.id !== selectedTable.id).slice(0, 6).map((t) => (
                      <button
                        key={t.id}
                        onClick={() => handleMerge(t.id)}
                        className="rounded-md border px-2.5 py-1.5 text-xs hover:bg-accent transition-colors"
                      >
                        {t.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              <DialogFooter>
                <DialogClose asChild>
                  <Button variant="outline">Close</Button>
                </DialogClose>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

function SummaryCard({ label, value, color, bg }: { label: string; value: number; color: string; bg: string }) {
  return (
    <Card className="p-4">
      <div className={cn('inline-flex h-9 w-9 items-center justify-center rounded-lg mb-2', bg)}>
        <span className={cn('text-lg font-bold', color)}>{value}</span>
      </div>
      <p className="text-xs text-muted-foreground">{label}</p>
    </Card>
  );
}

function InfoRow({ icon: Icon, label, value }: { icon: typeof Users; label: string; value: string }) {
  return (
    <div className="rounded-lg border p-2.5">
      <p className="text-xs text-muted-foreground flex items-center gap-1 mb-0.5">
        <Icon className="h-3 w-3" /> {label}
      </p>
      <p className="text-sm font-medium">{value}</p>
    </div>
  );
}
