import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ChevronRight, Loader2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { cn } from '../../utils/cn';
import { api } from '../../lib/api';

interface Category {
  id: string;
  name: string;
  slug: string;
  children?: Category[];
}

export function CategoryMegaMenu() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeGroup, setActiveGroup] = useState<Category | null>(null);

  useEffect(() => {
    async function fetchCategories() {
      try {
        const res = await api.get('/categories');
        setCategories(res.data);
        if (res.data.length > 0) {
          setActiveGroup(res.data[0]);
        }
      } catch (error) {
        console.error('Lỗi khi tải danh mục:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchCategories();
  }, []);

  if (loading) {
    return (
      <div className="relative flex items-center justify-center bg-white border border-slate-200 shadow-xl rounded-b-xl py-12 px-16">
        <Loader2 className="animate-spin text-primary" size={32} />
      </div>
    );
  }

  return (
    <div className="relative flex bg-white border border-slate-200 shadow-xl rounded-b-xl">
      {/* Sidebar List */}
      <div className="w-60 border-r border-slate-100 py-2 shrink-0 overflow-y-auto max-h-[70vh] bg-white">
        {categories.map((cat) => (
          <div
            key={cat.id}
            onClick={() => navigate(`/products?category=${cat.slug}`)}
            className={cn(
              "group flex items-center justify-between px-4 py-2.5 cursor-pointer transition-colors hover:bg-slate-50",
              activeGroup?.id === cat.id && "bg-slate-50 text-primary"
            )}
            onMouseEnter={() => setActiveGroup(cat)}
          >
            <span className="text-sm font-medium text-slate-700 group-hover:text-primary truncate flex-1">
              {cat.name}
            </span>
            <ChevronRight size={14} className="text-slate-300 group-hover:text-primary" />
          </div>
        ))}
      </div>

      {/* Detail Panel */}
      <div className="flex-1 p-6 bg-white overflow-y-auto max-h-[70vh] min-w-[320px]">
        {activeGroup ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="space-y-4 col-span-3">
               <h4 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-2 flex justify-between items-center">
                 <Link to={`/products?category=${activeGroup.slug}`} className="hover:text-primary">
                   Tất cả trong {activeGroup.name}
                 </Link>
               </h4>
            </div>
            
            {/* Split children into columns arbitrarily for UI */}
            {activeGroup.children && activeGroup.children.length > 0 ? (
              activeGroup.children.map((sub: Category) => (
                <div key={sub.id} className="space-y-4">
                  <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider border-b border-slate-100 pb-2">
                    <Link to={`/products?category=${sub.slug}`} className="hover:text-primary">
                      {sub.name}
                    </Link>
                  </h4>
                  {/* If backend has level-3 children, map them here. */}
                </div>
              ))
            ) : (
              <div className="col-span-3 text-sm text-slate-500">
                Chưa có danh mục con.
              </div>
            )}
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
