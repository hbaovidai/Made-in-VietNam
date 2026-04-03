import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { PageHeader } from '../../components/PageHeader';
import { Search, HelpCircle, BookOpen, MessageSquare, ShieldCheck, User, Store, CreditCard, ChevronRight } from 'lucide-react';

export function HelpCenter() {
  const { t } = useTranslation();
  const helpCategories = [
    { icon: <User className="text-blue-500" />, title: t('account_security'), desc: t('account_security_desc') },
    { icon: <Store className="text-orange-500" />, title: t('buying_on_platform'), desc: t('buying_on_platform_desc') },
    { icon: <CreditCard className="text-green-500" />, title: t('payment_shipping'), desc: t('payment_shipping_desc') },
    { icon: <ShieldCheck className="text-red-500" />, title: t('trade_assurance'), desc: t('trade_assurance_desc') },
    { icon: <BookOpen className="text-purple-500" />, title: t('seller_guide'), desc: t('seller_guide_desc') },
    { icon: <MessageSquare className="text-indigo-500" />, title: t('dispute_resolution'), desc: t('dispute_resolution_desc') },
  ];

  const popularArticles = [
    t('article_verify_supplier'),
    t('article_what_is_trade_assurance'),
    t('article_post_rfq'),
    t('article_manage_inquiry_basket'),
    t('article_payment_methods'),
    t('article_shipping_vietnam_usa'),
    t('article_customs_duties'),
    t('article_report_suspicious_supplier')
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      <PageHeader 
        title={t('help_center_title')} 
        description={t('help_center_desc')}
        breadcrumbs={[{ label: t('help') }]}
        image="https://picsum.photos/seed/help/400/600"
      />

      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Search */}
        <div className="max-w-3xl mx-auto mb-20">
          <div className="relative">
            <input 
              type="text" 
              placeholder={t('search_help_placeholder')} 
              className="w-full px-8 py-6 bg-white border border-slate-200 rounded-full outline-none focus:border-viet-red transition-colors shadow-2xl shadow-slate-200/50 text-xl"
            />
            <button className="absolute right-8 top-1/2 -translate-y-1/2 bg-viet-red text-white p-3 rounded-full hover:bg-red-700 transition-colors">
              <Search size={24} />
            </button>
          </div>
        </div>

        {/* Categories */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-24">
          {helpCategories.map((cat, idx) => (
            <div key={idx} className="bg-white p-8 border border-slate-200 hover:shadow-xl transition-all group cursor-pointer">
              <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                {cat.icon}
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-viet-red transition-colors">{cat.title}</h3>
              <p className="text-slate-500 text-sm leading-relaxed mb-6">{cat.desc}</p>
              <div className="flex items-center gap-1 text-viet-red font-bold text-sm uppercase tracking-widest">
                {t('browse_articles')} <ChevronRight size={14} />
              </div>
            </div>
          ))}
        </div>

        {/* Popular Articles */}
        <div className="bg-white border border-slate-200 p-12">
          <div className="flex items-center gap-4 mb-12">
            <div className="h-8 w-1.5 bg-viet-red" />
            <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight">
              {t('popular_articles')}
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-4">
            {popularArticles.map((article, idx) => (
              <Link 
                key={idx} 
                to="/help/user-guide" 
                className="flex items-center justify-between py-4 border-b border-slate-100 group hover:border-viet-red transition-colors"
              >
                <span className="text-slate-700 font-medium group-hover:text-viet-red">{article}</span>
                <ChevronRight size={16} className="text-slate-300 group-hover:text-viet-red" />
              </Link>
            ))}
          </div>
        </div>

        {/* Still Need Help? */}
        <div className="mt-24 bg-slate-900 text-white p-12 flex flex-col md:flex-row items-center justify-between gap-12">
          <div className="space-y-4 text-center md:text-left">
            <h2 className="text-3xl font-black uppercase tracking-tight">{t('still_need_help')}</h2>
            <p className="text-slate-400 text-lg">{t('still_need_help_desc')}</p>
          </div>
          <div className="flex gap-4">
            <Link to="/contact" className="bg-viet-red text-white px-10 py-4 font-bold hover:bg-red-700 transition-colors uppercase tracking-widest text-sm shadow-2xl shadow-red-500/40">
              {t('contact_support')}
            </Link>
            <Link to="/contact" className="bg-white text-slate-900 px-10 py-4 font-bold hover:bg-slate-100 transition-colors uppercase tracking-widest text-sm">
              {t('live_chat')}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
