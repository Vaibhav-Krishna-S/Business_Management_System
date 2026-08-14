'use client';

import { Play, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useApp } from '@/lib/store';
import { translate } from '@/lib/i18n';
import { toast } from 'sonner';

export function DemoControls() {
  const { simulateDay, resetDemo, language } = useApp();
  const tr = (key: string) => translate(key, language);

  const handleSimulate = () => {
    simulateDay();
    toast.success('Business simulation updated', {
      description: 'New orders, revenue, inventory consumption, and table changes have been applied.',
    });
  };

  const handleReset = () => {
    resetDemo();
    toast.info('Demo data has been reset', {
      description: 'All metrics restored to their initial state.',
    });
  };

  return (
    <div className="flex items-center gap-2">
      <Button variant="outline" size="sm" onClick={handleSimulate} className="gap-1.5 h-8 text-xs">
        <Play className="h-3.5 w-3.5 text-primary" />
        <span className="hidden sm:inline">{tr('Simulate Day')}</span>
      </Button>
      <Button variant="ghost" size="sm" onClick={handleReset} className="gap-1.5 h-8 text-xs text-muted-foreground">
        <RotateCcw className="h-3.5 w-3.5" />
        <span className="hidden sm:inline">{tr('Reset')}</span>
      </Button>
    </div>
  );
}
