export function formatNPR(amount: number): string {
  return `NPR ${amount.toLocaleString('en-IN')}`;
}

export function formatNPRShort(amount: number): string {
  if (amount >= 100000) return `NPR ${(amount / 100000).toFixed(1)}L`;
  if (amount >= 1000) return `NPR ${(amount / 1000).toFixed(1)}K`;
  return `NPR ${amount.toLocaleString('en-IN')}`;
}

export function formatNumber(n: number): string {
  return n.toLocaleString('en-IN');
}

export function formatPercent(n: number, decimals = 1): string {
  return `${n > 0 ? '+' : ''}${n.toFixed(decimals)}%`;
}

export function formatDate(date: string | Date): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    timeZone: 'Asia/Kathmandu',
  });
}

export function formatShortDate(date: string | Date): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    timeZone: 'Asia/Kathmandu',
  });
}

export function formatTime(date: string | Date): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleTimeString('en-GB', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
    timeZone: 'Asia/Kathmandu',
  });
}

export function daysUntil(dateStr: string): number {
  const target = new Date(dateStr);
  const now = new Date();
  const diff = target.getTime() - now.getTime();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

export function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  return 'Good evening';
}

export function getTodayISO(): string {
  return new Date().toISOString().split('T')[0];
}

export function getRelativeDay(daysAgo: number): string {
  const d = new Date();
  d.setDate(d.getDate() - daysAgo);
  return d.toISOString().split('T')[0];
}

export function getRelativeDate(daysFromNow: number): string {
  const d = new Date();
  d.setDate(d.getDate() + daysFromNow);
  return d.toISOString().split('T')[0];
}
