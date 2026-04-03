import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { CATEGORY_GROUPS, ALL_CATEGORIES_LIST } from '../data/categories';
import { PageHeader } from '../components/PageHeader';
import { CategoryCard } from '../components/categories/CategoryCard';
import { ChevronRight, LayoutGrid, Search } from 'lucide-react';

export function CategoriesOverview() {
  const { t } = useTranslation();
  return (
    <div className="min-h-screen bg-slate-50">
      <PageHeader 
        title={t('product_categories_title')} 
        description={t('product_categories_desc')}
        breadcrumbs={[{ label: t('categories') }]}
        image="https://picsum.photos/seed/categories/400/600"
      />

      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Search Bar */}
        <div className="max-w-2xl mx-auto mb-16">
          <div className="relative">
            <input 
              type="text" 
              placeholder={t('search_category_placeholder')} 
              className="w-full px-6 py-5 bg-white border border-slate-200 rounded-sm outline-none focus:border-viet-red transition-colors shadow-xl shadow-slate-200/50 text-lg"
            />
            <button className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-400 hover:text-viet-red">
              <Search size={24} />
            </button>
          </div>
        </div>

        {/* Major Groups */}
        <div className="space-y-12">
          <div className="flex items-center gap-4">
            <div className="h-8 w-1.5 bg-viet-red" />
            <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight">
              {t('major_industry_groups')}
            </h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {CATEGORY_GROUPS.map((group) => (
              <CategoryCard key={group.slug} group={group} />
            ))}
          </div>
        </div>

        {/* Full List */}
        <div className="mt-24 space-y-12">
          <div className="flex items-center gap-4">
            <div className="h-8 w-1.5 bg-viet-red" />
            <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight">
              {t('all_categories')}
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {ALL_CATEGORIES_LIST.map((cat) => {
              const group = CATEGORY_GROUPS.find(g => g.slug === cat.slug);
              
              return (
                <Link
                  key={cat.slug}
                  to={group ? `/categories/${group.slug}` : `/products?cat=${cat.slug}`}
                  className="bg-white p-4 border border-slate-200 hover:border-viet-red hover:text-viet-red transition-all flex items-center justify-between group"
                >
                  <span className="text-sm font-medium text-slate-700 group-hover:text-viet-red">{t(cat.name)}</span>
                  <ChevronRight size={14} className="text-slate-300 group-hover:text-viet-red" />
                </Link>
              );
            })}
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="bg-slate-900 py-20 mt-24 rounded-2xl overflow-hidden relative">
          <div className="absolute inset-0 opacity-10">
            <img 
              src="https://picsum.photos/seed/vietnam/1200/800" 
              alt="Vietnam" 
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
          <div className="relative max-w-4xl mx-auto px-4 text-center space-y-8">
            <h2 className="text-3xl font-black text-white uppercase tracking-tight">
              {t('cant_find_what_you_are_looking_for')}
            </h2>
            <p className="text-slate-400 text-lg">
              {t('sourcing_requirements_desc')}
            </p>
            <Link to="/rfq" className="inline-block bg-viet-red text-white px-12 py-4 font-bold hover:bg-red-700 transition-colors uppercase tracking-widest text-lg shadow-2xl shadow-red-500/40">
              {t('post_your_rfq_now')}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
