import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Loader2 } from 'lucide-react';
import { api } from '../../lib/api';

interface Category {
  id: string;
  name: string;
  slug: string;
  parentId?: string | null;
}

export function CategoryMegaMenu() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCategories() {
      try {
        const res = await api.get('/categories');
        // Only L1: root categories (parentId is null)
        const l1 = (res.data || []).filter((c: Category) => !c.parentId);
        setCategories(l1);
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
      <div className="bg-white border border-slate-200 shadow-xl rounded-b-xl py-10 flex items-center justify-center">
        <Loader2 className="animate-spin text-primary" size={28} />
      </div>
    );
  }

  return (
    <div className="bg-white border border-slate-200 shadow-xl rounded-b-xl overflow-hidden w-[680px]">
      {/* Grid 4 columns */}
      <div className="p-4 grid grid-cols-4 gap-2">
        {categories.map((cat) => (
          <Link
            key={cat.id}
            to={`/products?category=${cat.slug}`}
            className="flex items-center gap-1.5 px-3 py-2.5 rounded-lg text-[13px] font-medium text-slate-700 hover:text-primary hover:bg-primary/5 transition-colors group"
          >
            <span className="leading-tight">{cat.name}</span>
            <ChevronRight
              size={12}
              className="text-slate-300 group-hover:text-primary/50 shrink-0 ml-auto opacity-0 group-hover:opacity-100 transition-opacity"
            />
          </Link>
        ))}
      </div>

      {/* Footer — View All */}
      <div className="border-t border-slate-100">
        <Link
          to="/products"
          className="flex items-center justify-center gap-1.5 py-3 text-sm font-bold text-primary hover:bg-primary/5 transition-colors"
        >
          Xem tất cả danh mục
          <ChevronRight size={15} />
        </Link>
      </div>
    </div>
  );
}
