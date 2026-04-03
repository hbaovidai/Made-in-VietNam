import React, { useState } from 'react';
import { cn } from '../../utils/cn';

interface Tab {
  id: string;
  label: string;
  icon?: React.ReactNode;
  content: React.ReactNode;
}

interface TabsProps {
  tabs: Tab[];
  defaultTab?: string;
  className?: string;
  onChange?: (tabId: string) => void;
}

export function Tabs({ tabs, defaultTab, className, onChange }: TabsProps) {
  const [activeTab, setActiveTab] = useState(defaultTab || tabs[0]?.id);

  if (!tabs || tabs.length === 0) return null;

  return (
    <div className={cn('w-full', className)}>
      <div className="flex overflow-x-auto border-b border-slate-200 scrollbar-hide">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => {
              setActiveTab(tab.id);
              if (onChange) onChange(tab.id);
            }}
            className={cn(
              'flex items-center gap-2 px-6 py-4 text-sm font-bold border-b-2 transition-all duration-200 whitespace-nowrap outline-none',
              activeTab === tab.id
                ? 'border-viet-red text-viet-red'
                : 'border-transparent text-slate-500 hover:text-slate-800 hover:border-slate-300'
            )}
          >
            {tab.icon && (
              <span className={cn('transition-colors', activeTab === tab.id ? 'text-viet-red' : 'text-slate-400')}>
                {tab.icon}
              </span>
            )}
            {tab.label}
          </button>
        ))}
      </div>
      <div className="py-6 animate-fade-in">
        {tabs.find((t) => t.id === activeTab)?.content}
      </div>
    </div>
  );
}
