import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Globe, Mail, Lock, User, ShieldCheck, Facebook, Chrome, Loader2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { cn } from '../utils/cn';
import { useToast } from '../components/ui/Toast';
import { useAuth } from '../contexts/AuthContext';
import { api } from '../lib/api';

export function LoginRegister() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const { addToast } = useToast();
  const { loginUser } = useAuth();
  
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');
  const [role, setRole] = useState<'buyer' | 'supplier'>('supplier');
  const [loading, setLoading] = useState(false);

  // Form State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (activeTab === 'login') {
        const res = await api.post('/auth/login', { email, password });
        // Response format is { message, user: { ... } }
        loginUser(res.data.user);
        
        const mappedRole = res.data.user.role === 'BUYER' ? t('login_as_buyer') : t('login_as_supplier');
        addToast({ type: 'success', title: t('success') || 'Thành công', message: mappedRole });
        
        let from = (location.state as any)?.from?.pathname;
        if (!from || (res.data.user.role === 'SUPPLIER' && from.startsWith('/dashboard/buyer')) || (res.data.user.role === 'BUYER' && from.startsWith('/dashboard/supplier'))) {
          from = `/dashboard/${res.data.user.role.toLowerCase()}`;
        }
        navigate(from);

      } else {
        // Validation missing details
        if (!firstName || !lastName) {
          throw new Error('Vui lòng nhập Họ và Tên');
        }

        const fullName = `${lastName} ${firstName}`.trim();
        const res = await api.post('/auth/register', { 
          email, 
          password, 
          fullName, 
          role: role.toUpperCase() 
        });

        loginUser(res.data.user);
        addToast({ type: 'success', title: 'Hoan nghênh!', message: 'Đăng ký tài khoản thành công.' });
        navigate(`/dashboard/${role.toLowerCase()}`);
      }
    } catch (err: any) {
      addToast({ 
        type: 'error', 
        title: 'Thất bại', 
        message: err.message || err.response?.data?.message || 'Có lỗi xảy ra, vui lòng thử lại' 
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-3 sm:p-4 py-10 sm:py-20">
      <div className="max-w-5xl w-full bg-white rounded-[2rem] shadow-2xl overflow-hidden flex flex-col md:flex-row border border-slate-200">
        {/* Left Side: Branding/Info — hidden on mobile */}
        <div className="hidden md:flex md:w-1/2 bg-slate-100 p-8 lg:p-12 text-slate-700 relative flex-col justify-between overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-viet-gold/10 rounded-full translate-y-1/2 -translate-x-1/2 blur-3xl" />

          <div className="relative z-10">
            <Link to="/" className="flex items-center gap-2 mb-12">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center text-viet-gold">
                <Globe size={24} />
              </div>
              <div className="flex flex-row items-center">
              <span className="text-xl font-bold text-primary leading-none tracking-tight">VIE</span>
              <span className="text-xl font-bold text-slate-900 leading-none tracking-tight">product</span>
              </div>
            </Link>
            <div className="space-y-6">
              <h2 className="text-2xl lg:text-4xl font-extrabold leading-tight text-slate-900">
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
              <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center text-primary">
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
        <div className="w-full md:w-1/2 p-6 sm:p-8 lg:p-12">
          <div className="flex gap-6 sm:gap-8 border-b border-slate-100 mb-6 sm:mb-10">
            <button
              type="button"
              onClick={() => setActiveTab('login')}
              className={cn(
                "pb-4 text-lg font-bold transition-all relative",
                activeTab === 'login' ? "text-primary" : "text-slate-400 hover:text-slate-600"
              )}
            >
              {t('login')}
              {activeTab === 'login' && <div className="absolute bottom-0 left-0 w-full h-1 bg-primary rounded-full" />}
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('register')}
              className={cn(
                "pb-4 text-lg font-bold transition-all relative",
                activeTab === 'register' ? "text-primary" : "text-slate-400 hover:text-slate-600"
              )}
            >
              {t('register')}
              {activeTab === 'register' && <div className="absolute bottom-0 left-0 w-full h-1 bg-primary rounded-full" />}
            </button>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit}>
            {activeTab === 'register' && (
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700">{t('first_name_label')}</label>
                  <div className="relative">
                    <User size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input 
                      type="text" 
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      placeholder={t('first_name_placeholder')} 
                      className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all" 
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700">{t('last_name_label')}</label>
                  <input 
                    type="text" 
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder={t('last_name_placeholder')} 
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all" 
                  />
                </div>
              </div>
            )}

            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700">{t('email_address_label')}</label>
              <div className="relative">
                <Mail size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={t('email_address_placeholder')} 
                  required
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all" 
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-sm font-bold text-slate-700">{t('password_label')}</label>
                {activeTab === 'login' && (
                  <button type="button" className="text-xs font-bold text-primary hover:underline">{t('forgot_password')}</button>
                )}
              </div>
              <div className="relative">
                <Lock size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••" 
                  required
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all" 
                />
              </div>
            </div>

            {activeTab === 'register' && (
              <div className="space-y-4">
                <label className="text-sm font-bold text-slate-700 block text-center border-t border-slate-100 mt-6 pt-6">{t('choose_role')}</label>
                <div className="grid grid-cols-2 gap-4">
                  <button 
                    type="button"
                    onClick={() => setRole('buyer')}
                    className={cn("p-3 border rounded-xl font-bold transition-all", role === 'buyer' ? "border-primary bg-blue-50 text-primary ring-2 ring-blue-100" : "border-slate-200 text-slate-500 hover:bg-slate-50")}
                  >
                    {t('login_as_buyer')}
                  </button>
                  <button 
                    type="button"
                    onClick={() => setRole('supplier')}
                    className={cn("p-3 border rounded-xl font-bold transition-all", role === 'supplier' ? "border-primary bg-blue-50 text-primary ring-2 ring-blue-100" : "border-slate-200 text-slate-500 hover:bg-slate-50")}
                  >
                    {t('login_as_supplier')}
                  </button>
                </div>
              </div>
            )}

            <button 
              type="submit" 
              disabled={loading}
              className="w-full py-4 bg-primary text-white flex items-center justify-center gap-2 rounded-xl font-bold text-lg hover:bg-primary-dark transition-all shadow-xl hover:shadow-primary-dark/20 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? <Loader2 className="animate-spin" size={20} /> : (activeTab === 'login' ? t('login') : t('create_account'))}
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
              <button type="button" className="flex items-center justify-center gap-3 py-3 border border-slate-200 rounded-xl hover:bg-slate-50 transition-all font-bold text-sm text-slate-700">
                <Chrome size={18} />
                {t('google')}
              </button>
              <button type="button" className="flex items-center justify-center gap-3 py-3 border border-slate-200 rounded-xl hover:bg-slate-50 transition-all font-bold text-sm text-slate-700">
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

