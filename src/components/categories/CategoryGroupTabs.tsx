import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { CATEGORY_GROUPS } from '../../data/categories';
import { cn } from '../../utils/cn';

interface CategoryGroupTabsProps {
  activeSlug: string;
}

export function CategoryGroupTabs({ activeSlug }: CategoryGroupTabsProps) {
  const { t } = useTranslation();
  return (
    <div className="bg-white border-b border-slate-200 sticky top-16 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-8 overflow-x-auto no-scrollbar h-14">
          {CATEGORY_GROUPS.map((group) => (
            <Link
              key={group.slug}
              to={`/categories/${group.slug}`}
              className={cn(
                "text-sm font-bold text-slate-700 hover:text-viet-red transition-colors whitespace-nowrap h-full flex items-center border-b-2 border-transparent",
                activeSlug === group.slug && "text-viet-red border-viet-red"
              )}
            >
              {t(group.name)}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
