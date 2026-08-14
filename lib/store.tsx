'use client';

import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import type { Role } from './types';
import { roleAccess } from './mock-data';
import type { Language } from './i18n';

interface AppState {
  role: Role;
  setRole: (role: Role) => void;
  sidebarCollapsed: boolean;
  toggleSidebar: () => void;
  outlet: string;
  setOutlet: (o: string) => void;
  demoMode: boolean;
  setDemoMode: (v: boolean) => void;
  canAccess: (page: string) => boolean;
  simulateDay: () => void;
  resetDemo: () => void;
  lastSimulation: string | null;
  language: Language;
  setLanguage: (l: Language) => void;
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}

const AppContext = createContext<AppState | null>(null);

export const outlets = [
  'The Mango Resort — Main Restaurant',
  'The Mango Resort — Garden Cafe',
  'The Mango Resort — Rooftop Bar',
];

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [role, setRole] = useState<Role>('Owner');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [outlet, setOutlet] = useState(outlets[0]);
  const [demoMode, setDemoMode] = useState(true);
  const [lastSimulation, setLastSimulation] = useState<string | null>(null);
  const [language, setLanguage] = useState<Language>('en');
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  const toggleTheme = useCallback(() => setTheme((v) => (v === 'light' ? 'dark' : 'light')), []);

  const toggleSidebar = useCallback(() => setSidebarCollapsed((v) => !v), []);

  const canAccess = useCallback(
    (page: string) => roleAccess[role]?.includes(page) ?? false,
    [role]
  );

  const simulateDay = useCallback(() => {
    setLastSimulation(new Date().toISOString());
    // Dispatch a custom event so pages can react
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('demo:simulate'));
    }
  }, []);

  const resetDemo = useCallback(() => {
    setLastSimulation(null);
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('demo:reset'));
    }
  }, []);

  // Persist sidebar state
  useEffect(() => {
    const saved = localStorage.getItem('mangoos-sidebar');
    if (saved !== null) setSidebarCollapsed(saved === 'true');
    const savedTheme = localStorage.getItem('mangoos-theme') as 'light' | 'dark' | null;
    if (savedTheme) setTheme(savedTheme);
  }, []);

  useEffect(() => {
    localStorage.setItem('mangoos-sidebar', String(sidebarCollapsed));
  }, [sidebarCollapsed]);

  useEffect(() => {
    localStorage.setItem('mangoos-theme', theme);
    if (typeof document !== 'undefined') {
      document.documentElement.classList.toggle('dark', theme === 'dark');
    }
  }, [theme]);

  return (
    <AppContext.Provider
      value={{
        role,
        setRole,
        sidebarCollapsed,
        toggleSidebar,
        outlet,
        setOutlet,
        demoMode,
        setDemoMode,
        canAccess,
        simulateDay,
        resetDemo,
        lastSimulation,
        language,
        setLanguage,
        theme,
        toggleTheme,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
