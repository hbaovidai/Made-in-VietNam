import React from 'react';
import { useTranslation } from 'react-i18next';
import { PageHeader } from '../components/PageHeader';

interface PolicyLayoutProps {
  title: string;
  lastUpdated: string;
  children: React.ReactNode;
  breadcrumbs: { label: string; href?: string }[];
}

export function PolicyLayout({ title, lastUpdated, children, breadcrumbs }: PolicyLayoutProps) {
  const { t } = useTranslation();
  return (
    <div className="min-h-screen bg-slate-50">
      <PageHeader 
        title={title} 
        description={`${t('last_updated')}: ${lastUpdated}`}
        breadcrumbs={breadcrumbs}
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="bg-white border border-slate-200 p-8 md:p-16 shadow-sm">
          <div className="prose prose-slate max-w-none prose-headings:font-black prose-headings:uppercase prose-headings:tracking-tight prose-a:text-viet-red hover:prose-a:text-red-700">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
