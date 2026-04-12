import React from 'react';
import { useTranslation } from 'react-i18next';
import { PageHeader } from '../../components/PageHeader';
import { Shield, CheckCircle2, Lock, CreditCard, Truck, MessageSquare } from 'lucide-react';

export function SecuredTrading() {
  const { t } = useTranslation();
  const features = [
    {
      icon: <Lock className="text-blue-500" />,
      title: t('secure_payment'),
      desc: t('secure_payment_desc')
    },
    {
      icon: <Shield className="text-green-500" />,
      title: t('supplier_verification'),
      desc: t('supplier_verification_desc')
    },
    {
      icon: <CheckCircle2 className="text-orange-500" />,
      title: t('quality_inspection'),
      desc: t('quality_inspection_desc')
    },
    {
      icon: <Truck className="text-purple-500" />,
      title: t('shipping_protection'),
      desc: t('shipping_protection_desc')
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      <PageHeader 
        title={t('secured_trading_title')} 
        description={t('secured_trading_desc')}
        breadcrumbs={[
          { label: t('services'), href: '/services' },
          { label: t('secured_trading') }
        ]}
        
      />
      
      <div className="max-w-[1600px] mx-auto px-4 py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-32">
          <div className="space-y-6">
            <h2 className="text-4xl font-black text-slate-900 uppercase tracking-tight leading-none">
              {t('your_safety')} <span className="text-primary">{t('priority')}</span>
            </h2>
            <p className="text-lg text-slate-600 leading-relaxed">
              {t('secured_trading_intro')}
            </p>
            <div className="space-y-4">
              {[t('payment_protection_100'), t('verified_supplier_network'), t('dispute_resolution_support'), t('quality_inspection_services')].map((item, idx) => (
                <div key={idx} className="flex items-center gap-3">
                  <CheckCircle2 size={20} className="text-primary" />
                  <span className="font-bold text-slate-800 uppercase tracking-widest text-xs">{item}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="relative">
            <div className="aspect-square bg-slate-100 rounded-3xl overflow-hidden shadow-2xl">
              <img src="https://picsum.photos/seed/trust/800/800" alt="Trust" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
            </div>
            <div className="absolute -bottom-10 -left-10 bg-white p-8 shadow-2xl border border-slate-100 rounded-2xl max-w-xs hidden lg:block">
              <Shield size={40} className="text-primary mb-4" />
              <p className="text-sm font-bold text-slate-900 leading-relaxed">
                {t('secured_trading_quote')}
              </p>
              <div className="mt-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">— {t('global_sourcing_manager')}</div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, idx) => (
            <div key={idx} className="p-8 border border-slate-100 hover:border-primary transition-all group">
              <div className="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                {feature.icon}
              </div>
              <h3 className="text-lg font-bold text-slate-900 uppercase tracking-tight mb-4">{feature.title}</h3>
              <p className="text-sm text-slate-500 leading-relaxed">{feature.desc}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-slate-900 py-24 text-white">
        <div className="max-w-[1600px] mx-auto px-4 text-center space-y-8">
          <h2 className="text-3xl font-black uppercase tracking-tight">{t('ready_to_trade_securely')}</h2>
          <p className="text-slate-400 max-w-2xl mx-auto">{t('ready_to_trade_securely_desc')}</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-primary text-white px-10 py-4 font-bold hover:bg-primary-dark transition-colors uppercase tracking-widest text-xs">
              {t('join_free_now')}
            </button>
            <button className="bg-transparent border border-white/20 text-white px-10 py-4 font-bold hover:bg-white/10 transition-colors uppercase tracking-widest text-xs">
              {t('contact_support')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
