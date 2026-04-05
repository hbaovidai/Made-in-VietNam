import React from 'react';
import { useTranslation } from 'react-i18next';
import { PageHeader } from '../../components/PageHeader';
import { Star, CheckCircle2, Zap, Award, Shield, Globe, MessageSquare, TrendingUp } from 'lucide-react';

export function Membership() {
  const { t } = useTranslation();
  const plans = [
    {
      name: t('free_member'),
      price: "$0",
      period: t('forever'),
      features: [t('basic_search_browsing'), t('post_3_rfqs_month'), t('standard_messaging'), t('basic_support')],
      button: t('join_free'),
      popular: false
    },
    {
      name: t('premium_buyer'),
      price: "$29",
      period: t('per_month'),
      features: [t('unlimited_rfqs'), t('priority_quote_access'), t('verified_supplier_insights'), t('dedicated_account_manager'), t('advanced_sourcing_tools')],
      button: t('upgrade_now'),
      popular: true
    },
    {
      name: t('gold_supplier'),
      price: "$99",
      period: t('per_month'),
      features: [t('verified_supplier_badge'), t('unlimited_product_listings'), t('priority_search_ranking'), t('advanced_analytics'), t('direct_buyer_inquiries')],
      button: t('become_gold'),
      popular: false
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      <PageHeader 
        title={t('membership_plans_title')} 
        description={t('membership_plans_desc')}
        breadcrumbs={[
          { label: t('services'), href: '/services' },
          { label: t('membership') }
        ]}
        image="https://picsum.photos/seed/membership/1920/600"
      />
      
      <div className="max-w-[1600px] mx-auto px-4 py-20">
        <div className="text-center space-y-4 mb-20">
          <h2 className="text-4xl font-black text-slate-900 uppercase tracking-tight leading-none">
            {t('unlock_full')} <span className="text-primary">{t('potential')}</span>
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            {t('membership_intro')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan, idx) => (
            <div key={idx} className={`p-10 border transition-all relative flex flex-col ${plan.popular ? "border-primary shadow-2xl scale-105 z-10" : "border-slate-100 hover:border-slate-300"}`}>
              {plan.popular && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-primary text-white px-6 py-2 font-bold uppercase tracking-widest text-[10px] shadow-lg shadow-primary/20">
                  {t('most_popular')}
                </div>
              )}
              <div className="space-y-2 mb-8">
                <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight">{plan.name}</h3>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-black text-slate-900">{plan.price}</span>
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">{plan.period}</span>
                </div>
              </div>
              <div className="space-y-4 mb-12 flex-1">
                {plan.features.map((feature, fIdx) => (
                  <div key={fIdx} className="flex items-start gap-3">
                    <CheckCircle2 size={18} className="text-primary shrink-0" />
                    <span className="text-sm text-slate-600 leading-relaxed">{feature}</span>
                  </div>
                ))}
              </div>
              <button className={`w-full py-4 font-bold uppercase tracking-widest text-xs transition-all ${plan.popular ? "bg-primary text-white hover:bg-primary-dark shadow-lg shadow-primary/20" : "bg-slate-900 text-white hover:bg-slate-800"}`}>
                {plan.button}
              </button>
            </div>
          ))}
        </div>

        <div className="mt-32 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">
          {[
            { icon: <Zap className="text-yellow-500" />, title: t('priority_access'), desc: t('priority_access_desc') },
            { icon: <Award className="text-blue-500" />, title: t('verified_badge'), desc: t('verified_badge_desc') },
            { icon: <TrendingUp className="text-green-500" />, title: t('growth_tools'), desc: t('growth_tools_desc') },
            { icon: <MessageSquare className="text-purple-500" />, title: t('direct_support'), desc: t('direct_support_desc') }
          ].map((benefit, idx) => (
            <div key={idx} className="text-center space-y-4">
              <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6 group hover:scale-110 transition-transform">
                {benefit.icon}
              </div>
              <h4 className="text-sm font-bold text-slate-900 uppercase tracking-tight">{benefit.title}</h4>
              <p className="text-xs text-slate-500 leading-relaxed">{benefit.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
