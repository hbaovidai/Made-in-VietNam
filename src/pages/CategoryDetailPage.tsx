import React from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { CATEGORY_GROUPS } from '../data/categories';
import { CategoryGroupTabs } from '../components/categories/CategoryGroupTabs';
import { CategorySectionBlock } from '../components/categories/CategorySectionBlock';
import { ChevronRight, Home } from 'lucide-react';

export function CategoryDetailPage() {
  const { t } = useTranslation();
  const { slug } = useParams<{ slug: string }>();
  
  const group = CATEGORY_GROUPS.find(g => g.slug === slug);

  if (!group) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Breadcrumbs */}
      <div className="bg-white border-b border-slate-200 py-3">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 flex items-center gap-2 text-xs text-slate-500">
          <Link to="/" className="hover:text-viet-red flex items-center gap-1">
            <Home size={12} /> {t('home')}
          </Link>
          <ChevronRight size={12} />
          <span className="text-slate-900 font-medium">{t('category_directory')}</span>
          <ChevronRight size={12} />
          <span className="text-viet-red font-bold">{t(group.name)}</span>
        </div>
      </div>

      {/* Hero Section */}
      <div className="bg-white py-12 border-b border-slate-200">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
            <div className="space-y-4 max-w-2xl">
              <h1 className="text-4xl font-black text-slate-900 leading-tight uppercase tracking-tighter">
                {t(group.name)} <span className="text-viet-red">{t('directory')}</span>
              </h1>
              <p className="text-slate-600 text-lg leading-relaxed">
                {t('category_hero_desc_1')} <span className="font-bold text-slate-900">{t(group.name)}</span> {t('category_hero_desc_2')} 
                {t('category_hero_desc_3')}
              </p>
              <div className="flex items-center gap-4 pt-4">
                <Link to="/rfq" className="bg-viet-red text-white px-8 py-3 font-bold hover:bg-red-700 transition-colors uppercase tracking-widest text-sm shadow-lg shadow-red-500/20">
                  {t('post_sourcing_request')}
                </Link>
                <Link to="/suppliers" className="bg-slate-900 text-white px-8 py-3 font-bold hover:bg-slate-800 transition-colors uppercase tracking-widest text-sm shadow-lg shadow-slate-900/20">
                  {t('find_suppliers')}
                </Link>
              </div>
            </div>
            <div className="hidden lg:block w-72 h-72 bg-slate-100 rounded-2xl overflow-hidden shadow-2xl rotate-3 hover:rotate-0 transition-transform duration-500">
              <img
                src={group.image}
                alt={t(group.name)}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Sticky Tabs */}
      <CategoryGroupTabs activeSlug={group.slug} />

      {/* Main Content Sections */}
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
        {group.sections.map((section, idx) => (
          <div key={section.title} className="space-y-6">
            <div className="flex items-center gap-4">
              <div className="h-8 w-1.5 bg-viet-red" />
              <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight">
                {t(section.title)}
              </h2>
            </div>
            <CategorySectionBlock 
              section={section} 
              image={`https://picsum.photos/seed/${group.slug}-${idx}/400/600`}
            />
          </div>
        ))}
      </div>

      {/* Bottom CTA */}
      <div className="bg-slate-900 py-20 mt-20">
        <div className="max-w-4xl mx-auto px-4 text-center space-y-8">
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
  );
}
