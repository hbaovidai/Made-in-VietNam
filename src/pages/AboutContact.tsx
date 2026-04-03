import React from 'react';
import { Mail, Phone, MapPin, Globe, MessageSquare, Send, CheckCircle2, Award, ShieldCheck, Users } from 'lucide-react';
import { useTranslation, Trans } from 'react-i18next';

export function AboutContact() {
  const { t } = useTranslation();

  return (
    <div className="bg-slate-50 min-h-screen pb-20">
      {/* Hero Section */}
      <section className="bg-slate-900 text-white py-24 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-viet-red/10 skew-x-12 transform translate-x-32" />
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl space-y-6">
            <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight">
              <Trans i18nKey="about_hero_title">
                Empowering <span className="text-viet-red">Vietnamese</span> Excellence Globally
              </Trans>
            </h1>
            <p className="text-slate-400 text-xl leading-relaxed">
              {t('about_hero_desc')}
            </p>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 -mt-12 relative z-20">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { label: t('verified_suppliers'), value: "5,000+", icon: <ShieldCheck className="text-viet-red" /> },
            { label: t('products_listed'), value: "100k+", icon: <Globe className="text-blue-400" /> },
            { label: t('global_buyers'), value: "25k+", icon: <Users className="text-emerald-400" /> },
            { label: t('export_markets'), value: "120+", icon: <Award className="text-viet-gold" /> }
          ].map((stat, idx) => (
            <div key={idx} className="bg-white p-8 rounded-3xl border border-slate-200 shadow-xl flex flex-col items-center text-center space-y-4">
              <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center">
                {stat.icon}
              </div>
              <div>
                <div className="text-3xl font-bold text-slate-900">{stat.value}</div>
                <div className="text-sm text-slate-500 font-medium">{stat.label}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Mission Section */}
      <section className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <div className="space-y-8">
            <h2 className="text-4xl font-bold text-slate-900">{t('our_mission')}</h2>
            <p className="text-slate-600 text-lg leading-relaxed">
              {t('mission_desc')}
            </p>
            <div className="space-y-4">
              {[
                t('mission_point_1'),
                t('mission_point_2'),
                t('mission_point_3'),
                t('mission_point_4')
              ].map((item) => (
                <div key={item} className="flex items-center gap-3">
                  <CheckCircle2 size={24} className="text-viet-red" />
                  <span className="text-slate-700 font-medium">{item}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="relative">
            <div className="aspect-square rounded-[3rem] overflow-hidden shadow-2xl">
              <img src="https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?auto=format&fit=crop&q=80&w=1000" alt="Vietnamese Factory" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
            </div>
            <div className="absolute -bottom-8 -left-8 bg-viet-red text-white p-8 rounded-3xl shadow-2xl max-w-xs">
              <p className="text-xl font-bold italic">{t('mission_quote')}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="bg-white rounded-[3rem] border border-slate-200 shadow-2xl overflow-hidden flex flex-col lg:flex-row">
          <div className="lg:w-1/3 bg-slate-900 p-12 text-white space-y-12">
            <div className="space-y-4">
              <h2 className="text-3xl font-bold">{t('get_in_touch')}</h2>
              <p className="text-slate-400">{t('contact_intro')}</p>
            </div>
            <div className="space-y-8">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center text-viet-red shrink-0">
                  <Phone size={24} />
                </div>
                <div>
                  <div className="text-xs text-slate-500 font-bold uppercase tracking-wider">{t('call_us')}</div>
                  <div className="text-lg font-bold">+84 (28) 1234 5678</div>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center text-viet-gold shrink-0">
                  <Mail size={24} />
                </div>
                <div>
                  <div className="text-xs text-slate-500 font-bold uppercase tracking-wider">{t('email_us')}</div>
                  <div className="text-lg font-bold">support@madeinvietnam.com</div>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center text-blue-400 shrink-0">
                  <MapPin size={24} />
                </div>
                <div>
                  <div className="text-xs text-slate-500 font-bold uppercase tracking-wider">{t('visit_us')}</div>
                  <div className="text-lg font-bold">{t('footer_address')}</div>
                </div>
              </div>
            </div>
          </div>
          <div className="lg:w-2/3 p-12 md:p-16">
            <form className="grid md:grid-cols-2 gap-8" onSubmit={(e) => e.preventDefault()}>
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">{t('full_name_label')}</label>
                <input type="text" placeholder={t('full_name_placeholder')} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-viet-red/20 focus:border-viet-red outline-none transition-all" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">{t('email_address_label')}</label>
                <input type="email" placeholder={t('email_address_placeholder')} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-viet-red/20 focus:border-viet-red outline-none transition-all" />
              </div>
              <div className="space-y-2 md:col-span-2">
                <label className="text-sm font-bold text-slate-700">{t('subject_label')}</label>
                <input type="text" placeholder={t('subject_placeholder')} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-viet-red/20 focus:border-viet-red outline-none transition-all" />
              </div>
              <div className="space-y-2 md:col-span-2">
                <label className="text-sm font-bold text-slate-700">{t('message_label')}</label>
                <textarea rows={5} placeholder={t('message_placeholder')} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-viet-red/20 focus:border-viet-red outline-none transition-all resize-none" />
              </div>
              <div className="md:col-span-2">
                <button className="w-full bg-viet-red text-white py-4 rounded-xl font-bold text-lg hover:bg-red-700 transition-all shadow-xl hover:shadow-red-900/20 flex items-center justify-center gap-3">
                  {t('send_message')}
                  <Send size={20} />
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}
