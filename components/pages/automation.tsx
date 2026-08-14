'use client';

import { useState } from 'react';
import {
  MessageCircle, Bot, Package, Clock, UserPlus, Tag, HeartHandshake, FileText,
  Zap, Play, Pause, ChevronRight,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { automations as initialAutomations } from '@/lib/mock-data';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import type { Automation } from '@/lib/types';

const iconMap: Record<string, typeof MessageCircle> = {
  MessageCircle, Bot, Package, Clock, UserPlus, Tag, HeartHandshake, FileText,
};

export function AutomationPage() {
  const [automations, setAutomations] = useState<Automation[]>(initialAutomations);

  const toggleStatus = (id: string) => {
    setAutomations((prev) => prev.map((a) => a.id === id ? { ...a, status: a.status === 'Active' ? 'Paused' : 'Active' } : a));
    const auto = automations.find((a) => a.id === id);
    if (auto) {
      toast.success(`${auto.name} ${auto.status === 'Active' ? 'paused' : 'activated'}`);
    }
  };

  const activeCount = automations.filter((a) => a.status === 'Active').length;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold">Automation Center</h1>
          <p className="text-sm text-muted-foreground">{activeCount} active automations · {automations.length - activeCount} paused</p>
        </div>
      </div>

      {/* Intro card */}
      <Card className="border-primary/20 bg-primary/5">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 shrink-0">
              <Zap className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-sm font-medium">Future-ready automation hub</p>
              <p className="text-xs text-muted-foreground mt-0.5">Automate WhatsApp messages, customer follow-ups, inventory alerts, and more. These are simulated for the prototype — real API integrations can be connected later.</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Automation cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {automations.map((auto) => {
          const Icon = iconMap[auto.icon] ?? Zap;
          return (
            <Card key={auto.id} className={cn('transition-all', auto.status === 'Active' ? 'border-success/20' : 'border-border')}>
              <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-3">
                <div className="flex items-start gap-3">
                  <div className={cn('flex h-10 w-10 items-center justify-center rounded-lg shrink-0',
                    auto.status === 'Active' ? 'bg-primary/10' : 'bg-muted')}>
                    <Icon className={cn('h-5 w-5', auto.status === 'Active' ? 'text-primary' : 'text-muted-foreground')} />
                  </div>
                  <div>
                    <CardTitle className="text-sm">{auto.name}</CardTitle>
                    <p className="text-xs text-muted-foreground mt-0.5">{auto.description}</p>
                  </div>
                </div>
                <Switch checked={auto.status === 'Active'} onCheckedChange={() => toggleStatus(auto.id)} />
              </CardHeader>
              <CardContent className="space-y-2.5">
                <div className="flex items-start gap-2 text-xs">
                  <span className="font-medium text-muted-foreground shrink-0 w-12">WHEN:</span>
                  <span className="text-foreground">{auto.trigger}</span>
                </div>
                <div className="flex items-start gap-2 text-xs">
                  <span className="font-medium text-muted-foreground shrink-0 w-12">THEN:</span>
                  <span className="text-foreground">{auto.action}</span>
                </div>
                <div className="flex items-center justify-between pt-2 border-t">
                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    <span>Last: {auto.lastRun}</span>
                    <span>Next: {auto.nextRun}</span>
                  </div>
                  <Badge variant="secondary" className={cn('text-[10px]', auto.status === 'Active' ? 'bg-success/15 text-success' : 'bg-muted text-muted-foreground')}>
                    {auto.status === 'Active' ? 'Active' : 'Paused'}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
