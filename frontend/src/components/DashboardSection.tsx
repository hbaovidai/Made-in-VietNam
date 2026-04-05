import React from 'react';

interface DashboardSectionProps {
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
  children: React.ReactNode;
}

export function DashboardSection({ title, subtitle, actions, children }: DashboardSectionProps) {
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 uppercase tracking-tight">{title}</h1>
          {subtitle && <p className="text-slate-500 text-sm">{subtitle}</p>}
        </div>
        {actions && <div className="flex gap-3">{actions}</div>}
      </div>
      <div className="bg-white border border-slate-200 shadow-sm">
        {children}
      </div>
    </div>
  );
}
