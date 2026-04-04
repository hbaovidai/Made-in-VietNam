import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { CategoryGroup } from '../../data/categories';
import { cn } from '../../utils/cn';

interface CategoryCardProps {
  group: CategoryGroup;
  className?: string;
}

export const CategoryCard: React.FC<CategoryCardProps> = ({ group, className }) => {
  const { t } = useTranslation();
  return (
    <Link
      to={`/categories/${group.slug}`}
      className={cn(
        "group bg-white border border-slate-200 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden flex flex-col items-center p-6 text-center",
        className
      )}
    >
      <div className="w-24 h-24 rounded-full bg-slate-50 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 overflow-hidden">
        <img
          src={group.image}
          alt={group.name}
          className="w-full h-full object-cover"
          referrerPolicy="no-referrer"
        />
      </div>
      <h3 className="text-sm font-bold text-slate-900 group-hover:text-primary transition-colors uppercase tracking-wider">
        {t(group.name)}
      </h3>
      <p className="text-xs text-slate-500 mt-2">
        {group.sections.length} {t('major_sections')}
      </p>
      <div className="mt-4 text-xs font-bold text-primary uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">
        {t('explore_directory')} »
      </div>
    </Link>
  );
}
