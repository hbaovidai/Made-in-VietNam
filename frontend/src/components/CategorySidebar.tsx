import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LayoutGrid, ChevronRight, Loader2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { cn } from '../utils/cn';
import { api } from '../lib/api';

interface Category {
  id: string;
  name: string;
  slug: string;
  children?: Category[];
}

export function CategorySidebar() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCategories() {
      try {
        const res = await api.get('/categories');
        // Chỉ lấy danh mục gốc (parentId === null)
        setCategories(res.data.filter((c: any) => !c.parentId));
      } catch (error) {
        console.error('Error loading categories:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchCategories();
  }, []);

  // Không hiện sidebar nếu chưa có danh mục nào


  return (
    <div className="hidden lg:flex flex-col w-64 bg-white border border-slate-200 shrink-0 relative z-30">
      <div className="bg-slate-50 px-4 py-3 border-b border-slate-200 flex items-center gap-2">
        <LayoutGrid size={18} className="text-primary" />
        <span className="font-bold text-slate-800">{t('categories')}</span>
      </div>
      <div className="flex-1 py-1 overflow-y-auto max-h-[400px] no-scrollbar">
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="animate-spin text-primary" size={20} />
          </div>
        ) : categories.length === 0 ? (
          <div className="flex items-center justify-center py-8 px-4 text-center">
            <p className="text-xs text-slate-400">Chưa có danh mục nào</p>
          </div>
        ) : (
          categories.map((cat) => (
            <div
              key={cat.id}
              onClick={() => navigate(`/products?category=${cat.slug}`)}
              onMouseEnter={() => setActiveCategory(cat.slug)}
              onMouseLeave={() => setActiveCategory(null)}
              className={cn(
                "group flex items-center justify-between px-4 py-2 cursor-pointer transition-colors",
                activeCategory === cat.slug ? "bg-blue-50 text-primary" : "hover:bg-blue-50 hover:text-primary"
              )}
            >
              <span className="text-xs font-medium text-slate-700 group-hover:text-primary truncate flex-1">
                {cat.name}
              </span>
              <ChevronRight size={12} className={cn("transition-opacity", activeCategory === cat.slug ? "opacity-100" : "opacity-30")} />
              
              {/* Submenu Panel — hiện danh mục con từ API */}
              {activeCategory === cat.slug && cat.children && cat.children.length > 0 && (
                <div 
                  className="absolute top-0 left-full w-[500px] bg-white border border-slate-200 shadow-2xl min-h-full p-8 z-50 cursor-default" 
                  onClick={(e) => e.stopPropagation()}
                >
                  <h4 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2 mb-4">
                    <Link to={`/products?category=${cat.slug}`} className="hover:text-primary">
                      {cat.name}
                    </Link>
                  </h4>
                  <div className="grid grid-cols-2 gap-x-8 gap-y-2">
                    {cat.children.map((sub) => (
                      <Link
                        key={sub.id}
                        to={`/products?category=${sub.slug}`}
                        className="text-xs text-slate-600 hover:text-primary py-1 block"
                      >
                        {sub.name}
                      </Link>
                    ))}
                  </div>
                  <Link to={`/products?category=${cat.slug}`} className="mt-4 inline-block text-xs text-primary font-bold hover:underline">
                    {t('view_more')} »
                  </Link>
                </div>
              )}
            </div>
          ))
        )}
      </div>
      <div className="p-3 border-t border-slate-100">
        <Link to="/products" className="flex items-center justify-center gap-1 w-full py-2 bg-slate-50 text-xs font-bold text-slate-700 hover:bg-slate-100 transition-colors">
          {t('all_categories')} <ChevronRight size={14} />
        </Link>
      </div>
    </div>
  );
}
