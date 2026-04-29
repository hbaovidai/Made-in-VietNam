import React from 'react';
import { useTranslation } from 'react-i18next';
import { PageHeader } from '../components/PageHeader';
import { Smartphone, Download, ShieldCheck, Globe, Zap, Award, CheckCircle2, ChevronRight, Search, MessageSquare, ShoppingCart, Bell } from 'lucide-react';

export function Apps() {
  const { t } = useTranslation();
  const features = [
    { icon: <Search className="text-blue-500" />, title: t('smart_sourcing'), desc: t('smart_sourcing_desc') },
    { icon: <MessageSquare className="text-orange-500" />, title: t('real_time_chat'), desc: t('real_time_chat_desc') },
    { icon: <Bell className="text-red-500" />, title: t('instant_alerts'), desc: t('instant_alerts_desc') },
    { icon: <ShieldCheck className="text-green-500" />, title: t('secure_payments'), desc: t('secure_payments_desc') },
    { icon: <ShoppingCart className="text-purple-500" />, title: t('inquiry_basket'), desc: t('inquiry_basket_desc') },
    { icon: <Globe className="text-indigo-500" />, title: t('multi_language'), desc: t('multi_language_desc') },
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      <PageHeader 
        title={t('mobile_apps_title')} 
        description={t('mobile_apps_desc')}
        breadcrumbs={[{ label: t('apps') }]}
        
      />

      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-20">
        {/* App Showcase */}
        <div className="flex flex-col lg:flex-row gap-20 items-center mb-32">
          <div className="flex-1 space-y-8 text-center lg:text-left">
            <h2 className="text-5xl font-black text-slate-900 uppercase tracking-tighter leading-tight">
              {t('sourcing_in_your')} <span className="text-primary">{t('pocket')}</span>
            </h2>
            <p className="text-slate-600 text-xl leading-relaxed max-w-2xl mx-auto lg:mx-0">
              {t('app_showcase_desc')}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start pt-8">
              <button className="bg-slate-900 text-white px-10 py-4 font-bold hover:bg-slate-800 transition-colors uppercase tracking-widest text-sm flex items-center justify-center gap-3 rounded-xl shadow-2xl">
                <div className="text-left">
                  <div className="text-[10px] opacity-60">{t('download_on_the')}</div>
                  <div className="text-base">{t('app_store')}</div>
                </div>
              </button>
              <button className="bg-slate-900 text-white px-10 py-4 font-bold hover:bg-slate-800 transition-colors uppercase tracking-widest text-sm flex items-center justify-center gap-3 rounded-xl shadow-2xl">
                <div className="text-left">
                  <div className="text-[10px] opacity-60">{t('get_it_on')}</div>
                  <div className="text-base">{t('google_play')}</div>
                </div>
              </button>
            </div>
            <div className="pt-8 flex items-center justify-center lg:justify-start gap-8">
              <div className="text-center">
                <div className="text-2xl font-black text-slate-900">4.8/5</div>
                <div className="text-xs text-slate-500 font-bold uppercase tracking-widest">{t('app_rating')}</div>
              </div>
              <div className="w-px h-10 bg-slate-200" />
              <div className="text-center">
                <div className="text-2xl font-black text-slate-900">1M+</div>
                <div className="text-xs text-slate-500 font-bold uppercase tracking-widest">{t('downloads')}</div>
              </div>
            </div>
          </div>
          <div className="flex-1 w-full max-w-xl relative">
            <div className="w-72 h-[580px] bg-slate-900 border-[12px] border-slate-800 rounded-[50px] shadow-2xl mx-auto relative overflow-hidden z-10 rotate-6 hover:rotate-0 transition-transform duration-700">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-7 bg-slate-800 rounded-b-3xl z-20" />
              <div className="w-full h-full bg-slate-950 flex flex-col items-center pt-20 px-6 relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGcgc3Ryb2tlPSJyZ2JhKDI1NSwgMjU1LCAyNTUsIDAuMDUpIiBzdHJva2Utd2lkdGg9IjEiIGZpbGw9Im5vbmUiPjxwYXRoIGQ9Ik00MCAwaC00MHY0MGg0MHoiLz48L2c+PC9zdmc+')] opacity-20 pointer-events-none" />
                <div className="absolute top-0 w-full h-64 bg-gradient-to-b from-primary/30 to-transparent blur-2xl pointer-events-none" />
                <div className="w-16 h-16 bg-gradient-to-br from-primary to-blue-600 rounded-2xl flex items-center justify-center mb-8 relative z-10 shadow-2xl shadow-primary/40">
                  <span className="text-white font-black text-2xl">M</span>
                </div>
                <div className="w-full space-y-4 relative z-10">
                  <div className="h-24 bg-slate-800/80 rounded-2xl w-full border border-slate-700" />
                  <div className="h-24 bg-slate-800/80 rounded-2xl w-full border border-slate-700" />
                  <div className="h-24 bg-slate-800/80 rounded-2xl w-full border border-slate-700" />
                </div>
              </div>
            </div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/5 rounded-full blur-3xl -z-10" />
          </div>
        </div>

        {/* Features Grid */}
        <div className="space-y-12 mb-32">
          <div className="text-center space-y-4">
            <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tight">{t('powerful_features')}</h2>
            <p className="text-slate-500 max-w-2xl mx-auto">{t('powerful_features_desc')}</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, idx) => (
              <div key={idx} className="bg-white p-8 border border-slate-200 hover:shadow-xl transition-all group">
                <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2 group-hover:text-primary transition-colors">{feature.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* QR Code Section */}
        <div className="bg-slate-900 p-12 lg:p-20 text-white rounded-3xl overflow-hidden relative flex flex-col lg:flex-row items-center gap-12">
          <div className="flex-1 space-y-8 text-center lg:text-left">
            <h2 className="text-3xl font-black uppercase tracking-tight">{t('scan_to_download')}</h2>
            <p className="text-slate-400 text-lg">{t('scan_to_download_desc')}</p>
            <div className="flex items-center justify-center lg:justify-start gap-4">
              <CheckCircle2 size={20} className="text-primary" />
              <span className="text-slate-300">{t('safe_and_secure_download')}</span>
            </div>
          </div>
          <div className="w-48 h-48 bg-white p-4 rounded-2xl shadow-2xl shrink-0">
            <img 
              src="https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=https://vieproduct.vn/apps" 
              alt="QR Code" 
              className="w-full h-full object-contain"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
