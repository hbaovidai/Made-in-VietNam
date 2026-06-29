import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { PageHeader } from '../../components/PageHeader';
import { BreadcrumbBar } from '../../components/BreadcrumbBar';
import { Store, TrendingUp, ShieldCheck, MessageSquare, LayoutGrid, Award, CheckCircle2, ChevronRight } from 'lucide-react';

export function SellerGuide() {
  const { t } = useTranslation();
  const steps = [
    { icon: <Store className="text-blue-500" />, title: t('create_your_store'), desc: t('create_your_store_desc') },
    { icon: <LayoutGrid className="text-orange-500" />, title: t('post_products'), desc: t('post_products_desc') },
    { icon: <MessageSquare className="text-green-500" />, title: t('manage_inquiries'), desc: t('manage_inquiries_desc') },
    { icon: <ShieldCheck className="text-red-500" />, title: t('secure_payments'), desc: t('secure_payments_desc') },
    { icon: <TrendingUp className="text-purple-500" />, title: t('grow_your_business'), desc: t('grow_your_business_desc') },
  ];

  const benefits = [
    t('benefit_global_buyers'),
    t('benefit_verified_supplier'),
    t('benefit_advanced_tools'),
    t('benefit_realtime_analytics'),
    t('benefit_dedicated_support'),
    t('benefit_secure_logistics')
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      <BreadcrumbBar items={[{ label: t('help'), href: '/help' }, { label: t('seller_guide_title') }]} />
      <PageHeader 
        title={t('seller_guide_title')} 
        description={t('seller_guide_desc')}
        breadcrumbs={[{ label: t('help'), href: "/help" }, { label: t('seller_guide_title') }]}
        
      />

      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-20">
        {/* Getting Started */}
        <div className="space-y-12 mb-32">
          <div className="flex items-center gap-4">
            <div className="h-8 w-1.5 bg-gradient-to-b from-primary to-blue-400 rounded-full" />
            <h2 className="text-3xl lg:text-4xl font-black text-slate-900 uppercase tracking-tight">
              {t('getting_started_seller')}
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-8 pt-6">
            {steps.map((step, idx) => (
              <div key={idx} className="bg-white p-8 rounded-3xl border border-slate-100 shadow-xl shadow-slate-200/50 hover:shadow-2xl hover:shadow-primary/15 transition-all duration-500 group relative hover:-translate-y-2">
                <div className="absolute -top-6 -left-6 w-14 h-14 bg-gradient-to-br from-primary to-blue-600 outline outline-8 outline-slate-50 text-white rounded-full flex items-center justify-center font-black text-xl shadow-lg ring-4 ring-white z-10 group-hover:scale-110 transition-transform duration-300">
                  {idx + 1}
                </div>
                <div className="w-20 h-20 bg-slate-50 rounded-[1.5rem] flex items-center justify-center mb-8 group-hover:scale-110 group-hover:bg-blue-50 transition-all duration-500 relative mt-2">
                  <div className="absolute inset-0 bg-primary/5 rounded-[1.5rem] blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <div className="text-slate-500 group-hover:text-primary transition-colors relative z-10 [&>svg]:w-10 [&>svg]:h-10 flex items-center justify-center">
                    {step.icon}
                  </div>
                </div>
                <h3 className="text-xl font-black text-slate-900 mb-3 group-hover:text-primary transition-colors leading-tight">{step.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed font-light">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Benefits Section */}
        <div className="flex flex-col lg:flex-row gap-20 mb-32 items-center">
          <div className="flex-1 space-y-8">
            <h2 className="text-4xl lg:text-5xl font-black text-slate-900 uppercase tracking-tighter leading-none">
              {t('why_sell_on')} <br className="hidden lg:block"/>
              <span className="text-primary">VIEProduct</span>?
            </h2>
            <p className="text-slate-500 text-xl font-light leading-relaxed max-w-2xl">
              {t('why_sell_on_desc')}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {benefits.map((benefit, idx) => (
                <div key={idx} className="flex items-center gap-4 bg-slate-50 p-4 rounded-2xl hover:bg-white hover:shadow-lg transition-all group">
                  <div className="bg-primary/10 w-10 h-10 rounded-xl flex items-center justify-center shrink-0 group-hover:scale-110 group-hover:bg-primary transition-all">
                    <CheckCircle2 size={20} className="text-primary group-hover:text-white transition-colors" />
                  </div>
                  <span className="text-slate-700 font-bold text-sm tracking-wide">{benefit}</span>
                </div>
              ))}
            </div>
            <div className="pt-8">
              <Link to="/register" className="bg-primary text-white px-12 py-5 rounded-2xl font-black hover:shadow-2xl hover:shadow-primary/40 transition-all uppercase tracking-widest text-sm inline-block transform hover:-translate-y-1">
                {t('join_as_supplier_now')}
              </Link>
            </div>
          </div>
          <div className="flex-1 w-full max-w-xl relative">
            <div className="aspect-square bg-white shadow-2xl shadow-primary/20 rounded-[3rem] overflow-hidden rotate-2 hover:rotate-0 transition-transform duration-700 relative p-4 group z-10 block">
              <div className="w-full h-full rounded-[2.5rem] overflow-hidden relative">
                <div className="absolute inset-0 bg-primary/20 mix-blend-overlay z-10 group-hover:opacity-0 transition-opacity duration-700" />
                <img 
                  src="https://images.unsplash.com/photo-1565793298595-6a879b1d9492?auto=format&fit=crop&q=80&w=1200" 
                  alt="Factory" 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
                  referrerPolicy="no-referrer"
                />
              </div>
            </div>
            <div className="absolute top-1/2 -right-12 w-32 h-32 bg-[#9B7A4F] rounded-full blur-[80px] -z-10" />
            <div className="absolute bottom-12 -left-12 w-48 h-48 bg-blue-500 rounded-full blur-[80px] -z-10" />
          </div>
        </div>

        {/* CTA - Success Stories */}
        <div className="bg-[#0f172a] p-12 lg:p-24 text-white rounded-[3rem] overflow-hidden relative shadow-2xl group border border-white/10">
          <div className="absolute inset-0 z-0">
            <div className="absolute inset-0 bg-gradient-to-br from-[#0f172a] via-[#1e1b4b] to-[#0f172a] opacity-90 z-10" />
            <img 
              src="https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&q=80&w=1200" 
              alt="Global Business" 
              className="w-full h-full object-cover opacity-30 group-hover:scale-105 transition-transform duration-1000 mix-blend-luminosity"
              referrerPolicy="no-referrer"
            />
          </div>
          <div className="relative max-w-3xl mx-auto text-center space-y-10 z-20">
            <div className="inline-flex items-center justify-center w-24 h-24 bg-white/5 backdrop-blur-3xl rounded-3xl border border-white/10 shadow-2xl mb-4">
              <Award size={48} className="text-[#9B7A4F]" />
            </div>
            <h2 className="text-4xl lg:text-5xl font-black uppercase tracking-tight leading-tight">{t('ready_take_business_global')}</h2>
            <p className="text-slate-300 text-xl font-light">{t('ready_take_business_global_desc')}</p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center pt-8">
              <Link to="/register" className="bg-gradient-to-r from-[#9B7A4F] to-[#B3936A] text-white px-12 py-5 rounded-2xl font-black hover:shadow-2xl hover:shadow-[#9B7A4F]/40 transition-all uppercase tracking-widest text-sm inline-block transform hover:-translate-y-1">
                {t('register_as_supplier')}
              </Link>
              <Link to="/contact" className="bg-white/5 backdrop-blur-xl border border-white/20 text-white px-12 py-5 rounded-2xl font-black hover:bg-white/10 transition-all uppercase tracking-widest text-sm inline-block transform hover:-translate-y-1">
                {t('talk_to_expert')}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
