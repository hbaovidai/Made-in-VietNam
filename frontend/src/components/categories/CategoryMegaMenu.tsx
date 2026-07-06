import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
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
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [hoveredL1, setHoveredL1] = useState<Category | null>(null);

  useEffect(() => {
    async function fetchCategories() {
      try {
        const res = await api.get('/categories');
        // L1 = children of root nodes
        const l1Categories: Category[] = res.data.flatMap(
          (root: Category) => root.children ?? []
        );
        setCategories(l1Categories);
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
    <div className="relative flex bg-white border border-slate-200 shadow-xl rounded-b-xl min-h-[400px]">
      {/* Left: L1 Category List */}
      <div className="w-[260px] border-r border-slate-100 py-3 shrink-0 overflow-y-auto max-h-[70vh]">
        {categories.map((cat) => (
          <Link
            key={cat.id}
            to={`/products?category=${cat.slug}`}
            className={cn(
              "flex items-center justify-between px-5 py-2.5 text-sm font-medium transition-colors",
              hoveredL1?.id === cat.id
                ? "text-primary bg-primary/5 border-r-2 border-primary"
                : "text-slate-700 hover:text-primary hover:bg-slate-50"
            )}
            onMouseEnter={() => setHoveredL1(cat)}
          >
            <span className="truncate">{cat.name}</span>
            {cat.children && cat.children.length > 0 && (
              <ChevronRight size={14} className="text-slate-300 shrink-0 ml-2" />
            )}
          </Link>
        ))}
      </div>

      {/* Right: L2 → L4 Subcategories Panel */}
      {hoveredL1 && hoveredL1.children && hoveredL1.children.length > 0 && (
        <div className="flex-1 p-6 overflow-y-auto max-h-[70vh] min-w-[500px]">
          <div className={cn(
            "grid gap-x-10 gap-y-6",
            hoveredL1.children.length === 1 ? "grid-cols-1" :
            hoveredL1.children.length === 2 ? "grid-cols-2" :
            hoveredL1.children.length <= 4 ? "grid-cols-3" : "grid-cols-4"
          )}>
            {hoveredL1.children.map((l2) => (
              <div key={l2.id} className="min-w-0">
                {/* L2 heading */}
                <Link
                  to={`/products?category=${l2.slug}`}
                  className="text-sm font-bold text-slate-900 hover:text-primary transition-colors block pb-2 border-b border-slate-100 mb-2"
                >
                  {l2.name}
                </Link>

                {/* L3 items */}
                {l2.children && l2.children.length > 0 && (
                  <div className="space-y-1">
                    {l2.children.map((l3) => (
                      <div key={l3.id}>
                        <Link
                          to={`/products?category=${l3.slug}`}
                          className="text-xs text-slate-600 hover:text-primary transition-colors block py-1 font-medium"
                        >
                          {l3.name}
                        </Link>

                        {/* L4 items (if any) */}
                        {l3.children && l3.children.length > 0 && (
                          <div className="pl-3 space-y-0.5">
                            {l3.children.map((l4) => (
                              <Link
                                key={l4.id}
                                to={`/products?category=${l4.slug}`}
                                className="text-[11px] text-slate-400 hover:text-primary transition-colors block py-0.5"
                              >
                                {l4.name}
                              </Link>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
