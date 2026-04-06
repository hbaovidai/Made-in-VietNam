import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LayoutGrid, ChevronRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { ALL_CATEGORIES_LIST, CATEGORY_GROUPS } from '../data/categories';
import { cn } from '../utils/cn';

export function CategorySidebar() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = React.useState<string | null>(null);

  return (
    <div className="hidden lg:flex flex-col w-64 bg-white border border-slate-200 shrink-0 relative z-30">
      <div className="bg-slate-50 px-4 py-3 border-b border-slate-200 flex items-center gap-2">
        <LayoutGrid size={18} className="text-primary" />
        <span className="font-bold text-slate-800">{t('categories')}</span>
      </div>
      <div className="flex-1 py-1 overflow-y-auto max-h-[400px] no-scrollbar">
        {ALL_CATEGORIES_LIST.map((cat) => (
          <div
            key={cat.slug}
            onClick={() => navigate(`/products?category=${cat.slug}`)}
            onMouseEnter={() => setActiveCategory(cat.slug)}
            onMouseLeave={() => setActiveCategory(null)}
            className={cn(
              "group flex items-center justify-between px-4 py-2 cursor-pointer transition-colors",
              activeCategory === cat.slug ? "bg-blue-50 text-primary" : "hover:bg-blue-50 hover:text-primary"
            )}
          >
            <span className="text-xs font-medium text-slate-700 group-hover:text-primary truncate flex-1">
              {t(cat.name)}
            </span>
            <ChevronRight size={12} className={cn("transition-opacity", activeCategory === cat.slug ? "opacity-100" : "opacity-30")} />
            
            {/* Submenu Panel */}
            {activeCategory === cat.slug && (
              <div 
                className="absolute top-0 left-full w-[800px] bg-white border border-slate-200 shadow-2xl min-h-full p-8 z-50 flex gap-8 cursor-default" 
                onClick={(e) => e.stopPropagation()}
              >
                {(() => {
                  const group = CATEGORY_GROUPS.find(g => g.slug === cat.slug) || CATEGORY_GROUPS[0];

                  return (
                    <>
                      <div className="flex-1 grid grid-cols-2 gap-8">
                        {group.sections.slice(0, 4).map((section) => (
                          <div key={section.title} className="space-y-3">
                            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider border-b border-slate-100 pb-1.5">
                              <Link to={`/products?category=${group.slug}`} className="hover:text-primary">
                                {t(section.title)}
                              </Link>
                            </h4>
                            <ul className="space-y-1.5">
                              {section.subcategories.slice(0, 5).map((sub) => (
                                <li key={sub.name}>
                                  <Link to={sub.href} className="text-xs text-slate-600 hover:text-primary block">
                                    {t(sub.name)}
                                  </Link>
                                </li>
                              ))}
                              <li>
                                <Link to={`/products?category=${group.slug}`} className="text-xs text-primary font-bold hover:underline">
                                  {t('view_more')} »
                                </Link>
                              </li>
                            </ul>
                          </div>
                        ))}
                      </div>
                      <div className="w-48 shrink-0">
                        <div className="aspect-[3/4] bg-slate-100 rounded overflow-hidden">
                          <img 
                            src={group.image} 
                            alt={group.name} 
                            className="w-full h-full object-cover"
                            referrerPolicy="no-referrer"
                          />
                        </div>
                        <div className="mt-4 p-4 bg-slate-50 rounded">
                          <p className="text-[10px] text-slate-500 leading-tight">
                            {t('source_directly_from')} {t(group.name)}.
                          </p>
                          <Link to={`/products?category=${group.slug}`} className="mt-2 inline-block text-[10px] font-bold text-primary uppercase tracking-widest hover:underline">
                            {t('explore_all')}
                          </Link>
                        </div>
                      </div>
                    </>
                  );
                })()}
              </div>
            )}
          </div>
        ))}
      </div>
      <div className="p-3 border-t border-slate-100">
        <Link to="/products" className="flex items-center justify-center gap-1 w-full py-2 bg-slate-50 text-xs font-bold text-slate-700 hover:bg-slate-100 transition-colors">
          {t('all_categories')} <ChevronRight size={14} />
        </Link>
      </div>
    </div>
  );
}
