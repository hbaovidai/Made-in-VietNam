import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { PageHeader } from '../../components/PageHeader';
import { Search, ShieldCheck, MessageSquare, LayoutGrid, Award, CheckCircle2, ChevronRight, ShoppingCart, Smartphone } from 'lucide-react';

export function UserGuide() {
  const { t } = useTranslation();
  const steps = [
    { icon: <Search className="text-blue-500" />, title: t('find_products'), desc: t('find_products_desc') },
    { icon: <Award className="text-orange-500" />, title: t('verify_suppliers'), desc: t('verify_suppliers_desc') },
    { icon: <MessageSquare className="text-green-500" />, title: t('contact_inquire'), desc: t('contact_inquire_desc') },
    { icon: <ShieldCheck className="text-red-500" />, title: t('secure_trading'), desc: t('secure_trading_desc') },
    { icon: <ShoppingCart className="text-purple-500" />, title: t('manage_orders'), desc: t('manage_orders_desc') },
  ];

  const features = [
    t('feature_verified_manufacturers'),
    t('feature_custom_sourcing'),
    t('feature_trade_assurance'),
    t('feature_secure_payments'),
    t('feature_direct_communication'),
    t('feature_mobile_app')
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      <PageHeader 
        title={t('user_guide_title')} 
        description={t('user_guide_desc')}
        breadcrumbs={[{ label: t('help'), href: "/help" }, { label: t('user_guide_title') }]}
        image="https://picsum.photos/seed/user/400/600"
      />

      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-20">
        {/* Sourcing Process */}
        <div className="space-y-12 mb-32">
          <div className="flex items-center gap-4">
            <div className="h-8 w-1.5 bg-primary" />
            <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tight">
              {t('sourcing_process')}
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-8">
            {steps.map((step, idx) => (
              <div key={idx} className="bg-white p-8 border border-slate-200 hover:shadow-xl transition-all group relative">
                <div className="absolute -top-4 -left-4 w-10 h-10 bg-primary text-white flex items-center justify-center font-black text-xl shadow-lg">
                  {idx + 1}
                </div>
                <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  {step.icon}
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2 group-hover:text-primary transition-colors">{step.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Why Source from Vietnam? */}
        <div className="flex flex-col lg:flex-row gap-20 mb-32 items-center">
          <div className="flex-1 w-full max-w-xl order-2 lg:order-1">
            <div className="aspect-square bg-white border-8 border-white shadow-2xl rounded-3xl overflow-hidden -rotate-3 hover:rotate-0 transition-transform duration-500">
              <img 
                src="https://picsum.photos/seed/vietnam-products/800/800" 
                alt="Vietnam Products" 
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
          </div>
          <div className="flex-1 space-y-8 order-1 lg:order-2">
            <h2 className="text-4xl font-black text-slate-900 uppercase tracking-tighter leading-tight">
              {t('why_source_from')} <span className="text-primary">Vietnam</span>?
            </h2>
            <p className="text-slate-600 text-lg leading-relaxed">
              {t('why_source_from_desc')}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {features.map((feature, idx) => (
                <div key={idx} className="flex items-center gap-3">
                  <CheckCircle2 size={20} className="text-primary shrink-0" />
                  <span className="text-slate-700 font-medium">{feature}</span>
                </div>
              ))}
            </div>
            <div className="pt-8">
              <Link to="/register" className="bg-primary text-white px-12 py-4 font-bold hover:bg-primary-dark transition-colors uppercase tracking-widest text-sm shadow-2xl shadow-primary/40">
                {t('start_sourcing_now')}
              </Link>
            </div>
          </div>
        </div>

        {/* Mobile App Section */}
        <div className="bg-slate-900 p-12 lg:p-20 text-white rounded-3xl overflow-hidden relative">
          <div className="absolute inset-0 opacity-10">
            <img 
              src="https://picsum.photos/seed/mobile/1200/800" 
              alt="Mobile" 
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
          <div className="relative max-w-4xl mx-auto flex flex-col lg:flex-row items-center gap-12">
            <div className="flex-1 space-y-8 text-center lg:text-left">
              <Smartphone size={64} className="text-viet-gold mx-auto lg:mx-0" />
              <h2 className="text-3xl font-black uppercase tracking-tight">{t('source_on_the_go')}</h2>
              <p className="text-slate-400 text-lg">{t('source_on_the_go_desc')}</p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start pt-8">
                <Link to="/apps" className="bg-white text-slate-900 px-10 py-4 font-bold hover:bg-slate-100 transition-colors uppercase tracking-widest text-sm">
                  {t('download_app')}
                </Link>
                <Link to="/help" className="bg-primary text-white px-10 py-4 font-bold hover:bg-primary-dark transition-colors uppercase tracking-widest text-sm shadow-2xl shadow-primary/40">
                  {t('learn_more')}
                </Link>
              </div>
            </div>
            <div className="flex-1 hidden lg:block">
              <div className="w-64 h-[500px] bg-slate-800 border-8 border-slate-700 rounded-[40px] shadow-2xl mx-auto relative overflow-hidden">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-slate-700 rounded-b-2xl z-10" />
                <img 
                  src="https://picsum.photos/seed/app-screen/400/800" 
                  alt="App Screen" 
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
