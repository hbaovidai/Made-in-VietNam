import React from 'react';
import { Link } from 'react-router-dom';
import { Globe, Mail, Lock, User, ShieldCheck, Facebook, Chrome } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { cn } from '../utils/cn';

export function LoginRegister() {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = React.useState<'login' | 'register'>('login');

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 py-20">
      <div className="max-w-5xl w-full bg-white rounded-[2rem] shadow-2xl overflow-hidden flex flex-col md:flex-row border border-slate-200">
        {/* Left Side: Branding/Info */}
        <div className="md:w-1/2 bg-slate-900 p-12 text-white relative flex flex-col justify-between overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-viet-red/20 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-viet-gold/10 rounded-full translate-y-1/2 -translate-x-1/2 blur-3xl" />

          <div className="relative z-10">
            <Link to="/" className="flex items-center gap-2 mb-12">
              <div className="w-10 h-10 bg-viet-red rounded-lg flex items-center justify-center text-viet-gold">
                <Globe size={24} />
              </div>
              <div className="flex flex-col">
              <span className="text-xl font-bold text-white leading-none tracking-tight">MADE IN</span>
              <span className="text-xl font-bold text-viet-red leading-none tracking-tight">VIETNAM</span>
              </div>
            </Link>
            <div className="space-y-6">
              <h2 className="text-4xl font-extrabold leading-tight">
                {activeTab === 'login' ? t('login_welcome_title') : t('register_welcome_title')}
              </h2>
              <p className="text-slate-400 text-lg leading-relaxed">
                {t('auth_welcome_desc')}
              </p>
            </div>
          </div>

          <div className="relative z-10 space-y-6 pt-12">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center text-viet-gold">
                <ShieldCheck size={24} />
              </div>
              <div>
                <div className="font-bold">{t('verified_network')}</div>
                <div className="text-sm text-slate-500">{t('verified_network_desc')}</div>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center text-viet-red">
                <Mail size={24} />
              </div>
              <div>
                <div className="font-bold">{t('direct_communication')}</div>
                <div className="text-sm text-slate-500">{t('direct_communication_desc')}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Form */}
        <div className="md:w-1/2 p-12">
          <div className="flex gap-8 border-b border-slate-100 mb-10">
            <button
              onClick={() => setActiveTab('login')}
              className={cn(
                "pb-4 text-lg font-bold transition-all relative",
                activeTab === 'login' ? "text-viet-red" : "text-slate-400 hover:text-slate-600"
              )}
            >
              {t('login')}
              {activeTab === 'login' && <div className="absolute bottom-0 left-0 w-full h-1 bg-viet-red rounded-full" />}
            </button>
            <button
              onClick={() => setActiveTab('register')}
              className={cn(
                "pb-4 text-lg font-bold transition-all relative",
                activeTab === 'register' ? "text-viet-red" : "text-slate-400 hover:text-slate-600"
              )}
            >
              {t('register')}
              {activeTab === 'register' && <div className="absolute bottom-0 left-0 w-full h-1 bg-viet-red rounded-full" />}
            </button>
          </div>

          <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
            {activeTab === 'register' && (
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700">{t('first_name_label')}</label>
                  <div className="relative">
                    <User size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input type="text" placeholder={t('first_name_placeholder')} className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-viet-red/20 focus:border-viet-red outline-none transition-all" />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700">{t('last_name_label')}</label>
                  <input type="text" placeholder={t('last_name_placeholder')} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-viet-red/20 focus:border-viet-red outline-none transition-all" />
                </div>
              </div>
            )}

            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700">{t('email_address_label')}</label>
              <div className="relative">
                <Mail size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input type="email" placeholder={t('email_address_placeholder')} className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-viet-red/20 focus:border-viet-red outline-none transition-all" />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-sm font-bold text-slate-700">{t('password_label')}</label>
                {activeTab === 'login' && (
                  <button className="text-xs font-bold text-viet-red hover:underline">{t('forgot_password')}</button>
                )}
              </div>
              <div className="relative">
                <Lock size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input type="password" placeholder="••••••••" className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-viet-red/20 focus:border-viet-red outline-none transition-all" />
              </div>
            </div>

            {activeTab === 'register' && (
              <div className="space-y-4">
                <label className="text-sm font-bold text-slate-700 block">{t('i_am_a')}</label>
                <div className="grid grid-cols-2 gap-4">
                  <label className="flex items-center gap-3 p-3 border border-slate-200 rounded-xl cursor-pointer hover:bg-slate-50 transition-colors">
                    <input type="radio" name="role" className="w-4 h-4 text-viet-red" />
                    <span className="text-sm font-bold text-slate-700">{t('buyer')}</span>
                  </label>
                  <label className="flex items-center gap-3 p-3 border border-slate-200 rounded-xl cursor-pointer hover:bg-slate-50 transition-colors">
                    <input type="radio" name="role" className="w-4 h-4 text-viet-red" />
                    <span className="text-sm font-bold text-slate-700">{t('supplier')}</span>
                  </label>
                </div>
              </div>
            )}

            <button className="w-full py-4 bg-viet-red text-white rounded-xl font-bold text-lg hover:bg-red-700 transition-all shadow-xl hover:shadow-red-900/20">
              {activeTab === 'login' ? t('login') : t('create_account')}
            </button>

            <div className="relative py-4">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-100"></div>
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-4 text-slate-400 font-bold">{t('or_continue_with')}</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <button className="flex items-center justify-center gap-3 py-3 border border-slate-200 rounded-xl hover:bg-slate-50 transition-all font-bold text-sm text-slate-700">
                <Chrome size={18} />
                {t('google')}
              </button>
              <button className="flex items-center justify-center gap-3 py-3 border border-slate-200 rounded-xl hover:bg-slate-50 transition-all font-bold text-sm text-slate-700">
                <Facebook size={18} />
                {t('facebook')}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
