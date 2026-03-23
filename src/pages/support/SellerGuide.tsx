import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { PageHeader } from '../../components/PageHeader';
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
      <PageHeader 
        title={t('seller_guide_title')} 
        description={t('seller_guide_desc')}
        breadcrumbs={[{ label: t('help'), href: "/help" }, { label: t('seller_guide_title') }]}
        image="https://picsum.photos/seed/seller/400/600"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        {/* Getting Started */}
        <div className="space-y-12 mb-32">
          <div className="flex items-center gap-4">
            <div className="h-8 w-1.5 bg-viet-red" />
            <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tight">
              {t('getting_started_seller')}
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-8">
            {steps.map((step, idx) => (
              <div key={idx} className="bg-white p-8 border border-slate-200 hover:shadow-xl transition-all group relative">
                <div className="absolute -top-4 -left-4 w-10 h-10 bg-viet-red text-white flex items-center justify-center font-black text-xl shadow-lg">
                  {idx + 1}
                </div>
                <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  {step.icon}
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2 group-hover:text-viet-red transition-colors">{step.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Benefits Section */}
        <div className="flex flex-col lg:flex-row gap-20 mb-32 items-center">
          <div className="flex-1 space-y-8">
            <h2 className="text-4xl font-black text-slate-900 uppercase tracking-tighter leading-tight">
              {t('why_sell_on')} <span className="text-viet-red">Made in Vietnam</span>?
            </h2>
            <p className="text-slate-600 text-lg leading-relaxed">
              {t('why_sell_on_desc')}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {benefits.map((benefit, idx) => (
                <div key={idx} className="flex items-center gap-3">
                  <CheckCircle2 size={20} className="text-viet-red shrink-0" />
                  <span className="text-slate-700 font-medium">{benefit}</span>
                </div>
              ))}
            </div>
            <div className="pt-8">
              <Link to="/register" className="bg-viet-red text-white px-12 py-4 font-bold hover:bg-red-700 transition-colors uppercase tracking-widest text-sm shadow-2xl shadow-red-500/40">
                {t('join_as_supplier_now')}
              </Link>
            </div>
          </div>
          <div className="flex-1 w-full max-w-xl">
            <div className="aspect-square bg-white border-8 border-white shadow-2xl rounded-3xl overflow-hidden rotate-3 hover:rotate-0 transition-transform duration-500">
              <img 
                src="https://picsum.photos/seed/factory/800/800" 
                alt="Factory" 
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
          </div>
        </div>

        {/* Success Stories */}
        <div className="bg-slate-900 p-12 lg:p-20 text-white rounded-3xl overflow-hidden relative">
          <div className="absolute inset-0 opacity-10">
            <img 
              src="https://picsum.photos/seed/success/1200/800" 
              alt="Success" 
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
          <div className="relative max-w-3xl mx-auto text-center space-y-8">
            <Award size={64} className="text-viet-gold mx-auto" />
            <h2 className="text-3xl font-black uppercase tracking-tight">{t('ready_take_business_global')}</h2>
            <p className="text-slate-400 text-lg">{t('ready_take_business_global_desc')}</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
              <Link to="/register" className="bg-viet-red text-white px-12 py-4 font-bold hover:bg-red-700 transition-colors uppercase tracking-widest text-sm shadow-2xl shadow-red-500/40">
                {t('register_as_supplier')}
              </Link>
              <Link to="/contact" className="bg-white text-slate-900 px-12 py-4 font-bold hover:bg-slate-100 transition-colors uppercase tracking-widest text-sm">
                {t('talk_to_expert')}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
