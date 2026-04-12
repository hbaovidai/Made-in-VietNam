import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { PageHeader } from '../../components/PageHeader';
import { ShieldCheck, Clock, CreditCard, Truck, Award, CheckCircle2, ChevronRight, MessageSquare } from 'lucide-react';

export function TradeAssurance() {
  const { t } = useTranslation();
  const protections = [
    { icon: <CreditCard className="text-blue-500" />, title: t('payment_protection'), desc: t('payment_protection_desc') },
    { icon: <Truck className="text-orange-500" />, title: t('shipping_protection'), desc: t('shipping_protection_desc') },
    { icon: <ShieldCheck className="text-green-500" />, title: t('product_quality'), desc: t('product_quality_desc') },
    { icon: <Clock className="text-red-500" />, title: t('ontime_delivery'), desc: t('ontime_delivery_desc') },
  ];

  const benefits = [
    t('benefit_safe_payments'),
    t('benefit_dispute_resolution'),
    t('benefit_verified_history'),
    t('benefit_refund_guarantee'),
    t('benefit_inspection_services'),
    t('benefit_order_tracking')
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      <PageHeader 
        title={t('trade_assurance_title')} 
        description={t('trade_assurance_desc')}
        breadcrumbs={[{ label: t('services'), href: "/services" }, { label: t('trade_assurance') }]}
        
      />

      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-20">
        {/* How it Works */}
        <div className="space-y-12 mb-32">
          <div className="flex items-center gap-4">
            <div className="h-8 w-1.5 bg-primary" />
            <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tight">
              {t('how_trade_assurance_protects')}
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {protections.map((prot, idx) => (
              <div key={idx} className="bg-white p-8 border border-slate-200 hover:shadow-xl transition-all group">
                <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  {prot.icon}
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2 group-hover:text-primary transition-colors">{prot.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{prot.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Benefits Section */}
        <div className="flex flex-col lg:flex-row gap-20 mb-32 items-center">
          <div className="flex-1 space-y-8">
            <h2 className="text-4xl font-black text-slate-900 uppercase tracking-tighter leading-tight">
              {t('ultimate')} <span className="text-primary">{t('order_protection')}</span>
            </h2>
            <p className="text-slate-600 text-lg leading-relaxed">
              {t('trade_assurance_intro')}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {benefits.map((benefit, idx) => (
                <div key={idx} className="flex items-center gap-3">
                  <CheckCircle2 size={20} className="text-primary shrink-0" />
                  <span className="text-slate-700 font-medium">{benefit}</span>
                </div>
              ))}
            </div>
            <div className="pt-8">
              <Link to="/register" className="bg-primary text-white px-12 py-4 font-bold hover:bg-primary-dark transition-colors uppercase tracking-widest text-sm shadow-2xl shadow-primary/40">
                {t('start_protected_sourcing')}
              </Link>
            </div>
          </div>
          <div className="flex-1 w-full max-w-xl">
            <div className="aspect-square bg-white border-8 border-white shadow-2xl rounded-3xl overflow-hidden rotate-3 hover:rotate-0 transition-transform duration-500">
              <div className="w-full h-full bg-gradient-to-br from-blue-500 via-primary to-indigo-700 flex items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGcgc3Ryb2tlPSJyZ2JhKDI1NSwgMjU1LCAyNTUsIDAuMDUpIiBzdHJva2Utd2lkdGg9IjEiIGZpbGw9Im5vbmUiPjxwYXRoIGQ9Ik00MCAwaC00MHY0MGg0MHoiLz48L2c+PC9zdmc+')] opacity-30 pointer-events-none" />
                <div className="absolute -top-32 -right-32 w-96 h-96 bg-white/10 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-blue-900/40 rounded-full blur-3xl pointer-events-none" />
                <ShieldCheck size={160} className="text-white/90 relative z-10" strokeWidth={1} />
              </div>
            </div>
          </div>
        </div>

        {/* Dispute Resolution */}
        <div className="bg-slate-900 p-12 lg:p-20 text-white rounded-3xl overflow-hidden relative">
          <div className="absolute inset-0 opacity-100">
            <div className="w-full h-full bg-gradient-to-tr from-slate-900 via-primary-900/50 to-slate-900" />
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGcgc3Ryb2tlPSJyZ2JhKDI1NSwgMjU1LCAyNTUsIDAuMDUpIiBzdHJva2Utd2lkdGg9IjEiIGZpbGw9Im5vbmUiPjxwYXRoIGQ9Ik00MCAwaC00MHY0MGg0MHoiLz48L2c+PC9zdmc+')] opacity-20 mix-blend-overlay" />
          </div>
          <div className="relative max-w-3xl mx-auto text-center space-y-8">
            <MessageSquare size={64} className="text-viet-gold mx-auto" />
            <h2 className="text-3xl font-black uppercase tracking-tight">{t('need_help_order')}</h2>
            <p className="text-slate-400 text-lg">{t('dispute_resolution_desc')}</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
              <Link to="/help" className="bg-primary text-white px-12 py-4 font-bold hover:bg-primary-dark transition-colors uppercase tracking-widest text-sm shadow-2xl shadow-primary/40">
                {t('open_dispute')}
              </Link>
              <Link to="/help" className="bg-white text-slate-900 px-12 py-4 font-bold hover:bg-slate-100 transition-colors uppercase tracking-widest text-sm">
                {t('learn_more')}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
