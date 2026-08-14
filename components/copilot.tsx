'use client';

import { useState, useRef, useEffect } from 'react';
import { Bot, Send, Sparkles, X, Package, Clock, TrendingUp, Users, ShoppingCart, Receipt } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { formatNPR } from '@/lib/format';
import {
  kpiData,
  topSellingItems,
  inventoryItems,
  customers,
  expenses,
  revenueData,
} from '@/lib/mock-data';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  actions?: { label: string; icon: string }[];
}

const suggestedQuestions = [
  'How much did we make today?',
  'What are our best selling items?',
  'Which ingredients need to be ordered?',
  'Which items are expiring this week?',
  'Who are our top 10 customers?',
  'Which menu items have the highest margin?',
  'How much did we spend on ingredients this month?',
  'What should we promote this weekend?',
];

function generateResponse(query: string): Message {
  const q = query.toLowerCase();

  if (q.includes('how much') && (q.includes('today') || q.includes('make') || q.includes('revenue'))) {
    return {
      role: 'assistant',
      content: `Today's revenue is **${formatNPR(kpiData.revenue)}** from **${kpiData.orders} orders**. That's up **${kpiData.revenueChange}%** compared to yesterday. Your average order value is **${formatNPR(kpiData.averageOrderValue)}**.`,
      actions: [{ label: 'View Reports', icon: 'trending' }],
    };
  }

  if (q.includes('best') && (q.includes('selling') || q.includes('item'))) {
    const items = topSellingItems.map((t, i) => `${i + 1}. ${t.name} — ${t.sold} sold (${formatNPR(t.revenue)})`).join('\n');
    return {
      role: 'assistant',
      content: `Here are your top selling items today:\n\n${items}\n\n**Nepali Chicken Thali** is your #1 seller with ${topSellingItems[0].sold} orders.`,
      actions: [{ label: 'View Menu', icon: 'utensils' }],
    };
  }

  if (q.includes('order') && (q.includes('ingredient') || q.includes('stock') || q.includes('restock'))) {
    const lowStock = inventoryItems.filter((i) => i.quantity < i.minStock).slice(0, 5);
    const list = lowStock.map((i) => `• ${i.name} — ${i.quantity}${i.unit} remaining (min: ${i.minStock}${i.unit})`).join('\n');
    return {
      role: 'assistant',
      content: `${lowStock.length} ingredients need immediate attention:\n\n${list}\n\nI recommend creating a purchase order for **Chicken Breast** and **Fresh Cream** — both are critically low.`,
      actions: [{ label: 'Create Purchase Order', icon: 'cart' }, { label: 'View Inventory', icon: 'package' }],
    };
  }

  if (q.includes('expir') && q.includes('week')) {
    const expiring = inventoryItems.filter((i) => {
      const exp = new Date(i.expiryDate).getTime();
      const now = Date.now();
      const days = Math.ceil((exp - now) / (1000 * 60 * 60 * 24));
      return days >= 0 && days <= 7;
    });
    const list = expiring.map((i) => {
      const days = Math.ceil((new Date(i.expiryDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
      return `• ${i.name} — expires in ${days === 0 ? 'tomorrow' : days + ' days'}`;
    }).join('\n');
    return {
      role: 'assistant',
      content: `Items expiring this week:\n\n${list}\n\nConsider using these in today's specials to minimize waste.`,
      actions: [{ label: 'Show Expiring Items', icon: 'clock' }],
    };
  }

  if (q.includes('top') && q.includes('customer')) {
    const top = [...customers].sort((a, b) => b.totalSpend - a.totalSpend).slice(0, 10);
    const list = top.map((c, i) => `${i + 1}. ${c.name} — ${c.totalVisits} visits, ${formatNPR(c.totalSpend)} total spend`).join('\n');
    return {
      role: 'assistant',
      content: `Your top 10 customers by total spend:\n\n${list}\n\n**${top[0].name}** is your most valuable customer with ${formatNPR(top[0].totalSpend)} in lifetime spend.`,
      actions: [{ label: 'View Customers', icon: 'users' }],
    };
  }

  if (q.includes('margin') || q.includes('profit')) {
    const highMargin: string[] = [
      'Mango Lassi — 69.4% margin', 'Masala Chai — 75% margin', 'Mango Kulfi — 63.6% margin', 'Juju Dhau — 66.7% margin', 'Sweet Lassi — 70% margin',
    ];
    return {
      role: 'assistant',
      content: `Your highest margin menu items:\n\n${highMargin.map((m) => `• ${m}`).join('\n')}\n\nBeverages and desserts typically have the best margins. Consider promoting these alongside main courses.`,
      actions: [{ label: 'View Menu', icon: 'utensils' }],
    };
  }

  if (q.includes('spend') && (q.includes('ingredient') || q.includes('month'))) {
    const total = expenses.filter((e) => e.category === 'Food Ingredients').reduce((s, e) => s + e.amount, 0);
    return {
      role: 'assistant',
      content: `You've spent **${formatNPR(total)}** on food ingredients this period. That's about **${(total / kpiData.revenue * 100).toFixed(1)}%** of your revenue. Food costs are up 4.2% compared to last month.`,
      actions: [{ label: 'View Expenses', icon: 'receipt' }],
    };
  }

  if (q.includes('promote') || q.includes('weekend')) {
    return {
      role: 'assistant',
      content: `Based on your sales patterns, I recommend promoting:\n\n• **Mango Lassi** — trending +22.8% this week\n• **Momo Platter** — high margin, popular for sharing\n• **Mango Special Chicken** — your signature dish\n\nConsider a weekend combo: Momo Platter + Mango Lassi for NPR 650 (saves NPR 80).`,
      actions: [{ label: 'Create Campaign', icon: 'sparkles' }],
    };
  }

  if (q.includes('revenue') && q.includes('drop') || q.includes('why') && q.includes('drop')) {
    return {
      role: 'assistant',
      content: `Yesterday's revenue dipped to ${formatNPR(revenueData[revenueData.length - 2].revenue)}, about 8% below the weekly average. Main factors:\n\n• 3 cancelled large orders (NPR 4,250 in refunds)\n• Lower dinner traffic — only 42 evening orders vs avg 65\n• 2 tables were unavailable for cleaning\n\nToday is already trending +12.4% — you're back on track.`,
    };
  }

  if (q.includes('attention') || q.includes('need') || q.includes('action')) {
    return {
      role: 'assistant',
      content: `3 items need immediate attention:\n\n1. **Chicken Breast** — 4.2kg remaining — critical\n2. **Fresh Cream** — expires tomorrow\n3. **Mango Pulp** — stock 18% below minimum\n\nI recommend creating a purchase order for Chicken Breast and Fresh Cream.`,
      actions: [{ label: 'Create Purchase Order', icon: 'cart' }, { label: 'View Inventory', icon: 'package' }, { label: 'Show Expiring Items', icon: 'clock' }],
    };
  }

  return {
    role: 'assistant',
    content: `I can help you understand your restaurant's performance. Try asking about:\n\n• Today's revenue and orders\n• Best selling items\n• Inventory that needs ordering\n• Expiring ingredients\n• Top customers\n• Menu margins\n• Expense breakdowns\n• Weekend promotion ideas`,
  };
}

const iconMap: Record<string, typeof Bot> = {
  trending: TrendingUp,
  utensils: Bot,
  cart: ShoppingCart,
  package: Package,
  clock: Clock,
  users: Users,
  sparkles: Sparkles,
  receipt: Receipt,
};

export function Copilot({ onNavigate }: { onNavigate: (key: string) => void }) {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: "Hi! I'm MangoOS Copilot. I can answer questions about your restaurant's performance using your live data. Ask me anything!",
    },
  ]);
  const [input, setInput] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = (text?: string) => {
    const query = text ?? input;
    if (!query.trim()) return;
    const userMsg: Message = { role: 'user', content: query };
    const response = generateResponse(query);
    setMessages((prev) => [...prev, userMsg, response]);
    setInput('');
  };

  return (
    <>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setOpen(true)}
        className="gap-2 text-muted-foreground hover:text-foreground"
      >
        <Sparkles className="h-4 w-4 text-primary" />
        <span className="hidden sm:inline">Copilot</span>
      </Button>

      {open && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div className="absolute inset-0 bg-black/30 animate-fade-in" onClick={() => setOpen(false)} />
          <div className="relative flex h-full w-full max-w-md flex-col bg-card shadow-2xl animate-slide-in-right border-l">
            {/* Header */}
            <div className="flex items-center justify-between border-b px-5 py-4">
              <div className="flex items-center gap-2.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
                  <Bot className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold">MangoOS Copilot</h3>
                  <p className="text-xs text-muted-foreground">AI Business Assistant</p>
                </div>
              </div>
              <Button variant="ghost" size="icon" onClick={() => setOpen(false)} className="h-8 w-8">
                <X className="h-4 w-4" />
              </Button>
            </div>

            {/* Messages */}
            <ScrollArea className="flex-1 px-5">
              <div ref={scrollRef} className="space-y-4 py-4">
                {messages.map((msg, i) => (
                  <div key={i} className={cn('flex', msg.role === 'user' ? 'justify-end' : 'justify-start')}>
                    <div className={cn('max-w-[85%]', msg.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-muted')} style={{ borderRadius: '0.75rem' }}>
                      <div className="px-3.5 py-2.5">
                        <p className="text-sm whitespace-pre-line leading-relaxed">{msg.content}</p>
                        {msg.actions && msg.actions.length > 0 && (
                          <div className="mt-3 flex flex-wrap gap-2">
                            {msg.actions.map((a, j) => {
                              const Icon = iconMap[a.icon] ?? Bot;
                              return (
                                <button
                                  key={j}
                                  onClick={() => {
                                    if (a.label.includes('Purchase')) onNavigate('purchases');
                                    else if (a.label.includes('Inventory') || a.label.includes('Expiring')) onNavigate('inventory');
                                    else if (a.label.includes('Customer')) onNavigate('customers');
                                    else if (a.label.includes('Menu')) onNavigate('menu');
                                    else if (a.label.includes('Report')) onNavigate('reports');
                                    else if (a.label.includes('Expense')) onNavigate('expenses');
                                    else if (a.label.includes('Campaign')) onNavigate('automation');
                                    setOpen(false);
                                  }}
                                  className="inline-flex items-center gap-1.5 rounded-md border border-border bg-background px-2.5 py-1.5 text-xs font-medium hover:bg-accent transition-colors"
                                >
                                  <Icon className="h-3 w-3" />
                                  {a.label}
                                </button>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>

            {/* Suggested questions */}
            {messages.length <= 2 && (
              <div className="px-5 pb-3">
                <p className="text-xs text-muted-foreground mb-2">Try asking:</p>
                <div className="flex flex-wrap gap-1.5">
                  {suggestedQuestions.slice(0, 4).map((q) => (
                    <button
                      key={q}
                      onClick={() => handleSend(q)}
                      className="rounded-full border border-border bg-background px-3 py-1.5 text-xs hover:bg-accent transition-colors"
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Input */}
            <div className="border-t p-4">
              <div className="flex gap-2">
                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="Ask about your restaurant..."
                  className="flex-1"
                />
                <Button size="icon" onClick={() => handleSend()}>
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
