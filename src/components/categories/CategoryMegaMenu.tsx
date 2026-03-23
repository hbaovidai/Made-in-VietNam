import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { ALL_CATEGORIES_LIST, CATEGORY_GROUPS } from '../../data/categories';
import { cn } from '../../utils/cn';

export function CategoryMegaMenu() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [activeGroup, setActiveGroup] = React.useState<string | null>(null);

  return (
    <div className="relative flex bg-white border border-slate-200 shadow-xl min-h-[500px] w-full max-w-7xl mx-auto">
      {/* Sidebar List */}
      <div className="w-72 border-r border-slate-100 py-2 shrink-0 overflow-y-auto max-h-[600px]">
        {ALL_CATEGORIES_LIST.map((cat) => {
          // Find if this category belongs to a group for the mega menu detail
          const group = CATEGORY_GROUPS.find(g => g.slug === cat.slug);
          
          return (
            <div
              key={cat.slug}
              onClick={() => navigate(`/categories/${cat.slug}`)}
              className={cn(
                "group flex items-center justify-between px-4 py-2.5 cursor-pointer transition-colors hover:bg-slate-50",
                activeGroup === cat.slug && "bg-slate-50 text-viet-red"
              )}
              onMouseEnter={() => setActiveGroup(cat.slug)}
            >
              <span className="text-sm font-medium text-slate-700 group-hover:text-viet-red truncate flex-1">
                {t(cat.name)}
              </span>
              <ChevronRight size={14} className="text-slate-300 group-hover:text-viet-red" />
            </div>
          );
        })}
      </div>

      {/* Detail Panel */}
      <div className="flex-1 p-8 bg-white overflow-y-auto max-h-[600px]">
        {activeGroup ? (
          <div className="grid grid-cols-3 gap-8">
            {/* We'll find the group that matches the activeGroup name or just show a default set for demo */}
            {(() => {
              const group = CATEGORY_GROUPS.find(g => g.slug === activeGroup) || CATEGORY_GROUPS[0];

              return group.sections.map((section) => (
                <div key={section.title} className="space-y-4">
                  <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider border-b border-slate-100 pb-2">
                    <Link to={`/categories/${group.slug}`} className="hover:text-viet-red">
                      {t(section.title)}
                    </Link>
                  </h4>
                  <ul className="space-y-2">
                    {section.subcategories.map((sub) => (
                      <li key={sub.name}>
                        <Link
                          to={sub.href}
                          className="text-sm text-slate-600 hover:text-viet-red transition-colors block"
                        >
                          {t(sub.name)}
                        </Link>
                      </li>
                    ))}
                    <li>
                      <Link to={`/categories/${group.slug}`} className="text-sm text-viet-red font-bold hover:underline">
                        {t('view_more_arrow')}
                      </Link>
                    </li>
                  </ul>
                </div>
              ));
            })()}
          </div>
        ) : (
          <div className="flex items-center justify-center h-full text-slate-400 italic">
            {t('hover_category_desc')}
          </div>
        )}
      </div>
    </div>
  );
}
