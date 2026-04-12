import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { PageHeader } from '../../components/PageHeader';
import { Star, CheckCircle2, Zap, Award, Shield, Globe, MessageSquare, TrendingUp, Loader2 } from 'lucide-react';
import { api } from '../../lib/api';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../components/ui/Toast';

export function Membership() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const { addToast } = useToast();
  const [plans, setPlans] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    api.get('/memberships/plans').then(res => {
      setPlans(res.data);
      setLoading(false);
    }).catch(err => {
      console.error(err);
      setLoading(false);
    });
  }, []);

  const handleSubscribe = async (planId: string) => {
    if (!user) {
      addToast({ type: 'error', title: 'Lỗi', message: 'Vui lòng đăng nhập để nâng cấp' });
      return;
    }
    setProcessing(true);
    try {
      await api.post('/memberships/subscribe', { planId });
      addToast({ type: 'success', title: 'Thành công', message: 'Đã nâng cấp gói thành viên!' });
    } catch (error) {
      addToast({ type: 'error', title: 'Lỗi', message: 'Nâng cấp thất bại, vui lòng thử lại' });
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <PageHeader 
        title={t('membership_plans_title')} 
        description={t('membership_plans_desc')}
        breadcrumbs={[
          { label: t('services'), href: '/services' },
          { label: t('membership') }
        ]}
        
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

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="animate-spin text-primary" size={48} />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {plans.map((plan, idx) => (
              <div key={plan.id || idx} className={`p-10 border transition-all relative flex flex-col ${plan.price > 0 ? "border-primary shadow-2xl scale-105 z-10" : "border-slate-100 hover:border-slate-300"}`}>
                {plan.price > 0 && (
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-primary text-white px-6 py-2 font-bold uppercase tracking-widest text-[10px] shadow-lg shadow-primary/20">
                    {t('most_popular')}
                  </div>
                )}
                <div className="space-y-2 mb-8">
                  <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight">{plan.name}</h3>
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-black text-slate-900">{plan.price === 0 ? 'Free' : `$${(plan.price / 25000).toFixed(2)}`}</span>
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">{plan.billingCycle}</span>
                  </div>
                </div>
                <div className="space-y-4 mb-12 flex-1">
                  {plan.features?.map((feature: string, fIdx: number) => (
                    <div key={fIdx} className="flex items-start gap-3">
                      <CheckCircle2 size={18} className="text-primary shrink-0" />
                      <span className="text-sm text-slate-600 leading-relaxed">{feature}</span>
                    </div>
                  ))}
                </div>
                <button 
                  onClick={() => handleSubscribe(plan.id)}
                  disabled={processing}
                  className={`w-full py-4 font-bold uppercase tracking-widest text-xs transition-all flex items-center justify-center gap-2 ${plan.price > 0 ? "bg-primary text-white hover:bg-primary-dark shadow-lg shadow-primary/20" : "bg-slate-900 text-white hover:bg-slate-800"}`}
                >
                  {processing ? <Loader2 size={16} className="animate-spin" /> : (plan.price > 0 ? 'Nâng cấp' : 'Miễn phí')}
                </button>
              </div>
            ))}
          </div>
        )}

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
