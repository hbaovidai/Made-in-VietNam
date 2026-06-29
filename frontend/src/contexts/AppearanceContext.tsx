import React, { createContext, useContext, useEffect, useState } from 'react';
import { api } from '../lib/api';

interface AppearanceContextType {
  settings: Record<string, string>;
  loading: boolean;
}

const AppearanceContext = createContext<AppearanceContextType>({ settings: {}, loading: true });

export function AppearanceProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/settings')
      .then(res => {
        const data = res.data || {};
        setSettings(data);

        // Inject CSS variables for colors
        const root = document.documentElement;
        const vars: Record<string, string> = {
          '--color-primary': data.primary_color,
          '--color-primary-light': data.primary_color_light,
          '--color-primary-dark': data.primary_color_dark,
          '--color-viet-gold': data.accent_color,
          '--color-background': data.bg_color,
          '--color-text': data.text_color,
          '--color-border': data.border_color,
          '--color-pending': data.pending_color,
          '--color-approved': data.approved_color,
          '--color-rejected': data.rejected_color,
          '--color-completed': data.completed_color,
          '--color-header-bg': data.header_bg,
          '--color-header-text': data.header_text,
          '--color-footer-bg': data.footer_bg,
          '--color-footer-text': data.footer_text,
        };
        Object.entries(vars).forEach(([prop, val]) => {
          if (val) root.style.setProperty(prop, val);
        });
        if (data.bg_color) document.body.style.background = data.bg_color;
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <AppearanceContext.Provider value={{ settings, loading }}>
      {children}
    </AppearanceContext.Provider>
  );
}

export const useAppearance = () => useContext(AppearanceContext);
