import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../components/ui/Toast';
import { api } from '../lib/api';
import { AuthLayout } from '../layouts/AuthLayout';
import { Factory, Loader2 } from 'lucide-react';

export function Login() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const { addToast } = useToast();
  const { loginUser } = useAuth();
  
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await api.post('/auth/login', { email, password });
      loginUser(res.data.user, res.data.token);
      
      const mappedRole = res.data.user.role === 'BUYER' ? t('login_as_buyer') : t('login_as_supplier');
      addToast({ type: 'success', title: t('success') || 'Thành công', message: mappedRole });
      
      let from = (location.state as any)?.from?.pathname;
      if (!from || (res.data.user.role === 'SUPPLIER' && from.startsWith('/dashboard/buyer')) || (res.data.user.role === 'BUYER' && from.startsWith('/dashboard/supplier'))) {
        from = res.data.user.role === 'BUYER' ? '/' : `/dashboard/${res.data.user.role.toLowerCase()}`;
      }
      navigate(from);
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
    <AuthLayout rightActionText="Register" rightActionLink="/register">
      <div className="w-full max-w-[440px] bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 overflow-hidden flex flex-col">
        {/* Top Icon & Titles */}
        <div className="px-10 pt-12 pb-8 flex flex-col items-center text-center">
          <div className="w-14 h-14 bg-[#0F172A] rounded-xl flex items-center justify-center text-white mb-6 shadow-md">
            <Factory size={28} strokeWidth={1.5} />
          </div>
          <h1 className="text-2xl font-black text-[#0F172A] mb-2 tracking-tight">Welcome Back</h1>
          <p className="text-[13px] text-slate-500 font-medium">Access the Global Gateway for Vietnamese Excellence</p>
        </div>

        {/* Form Body */}
        <div className="px-10 pb-8 flex-1">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <label className="text-[13px] font-bold text-[#0F172A]">Corporate Email</label>
              <input
                required
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@company.com"
                className="w-full px-4 py-3.5 bg-[#F8FAFC] border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm font-medium placeholder:text-slate-400 placeholder:font-normal"
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-[13px] font-bold text-[#0F172A]">Password</label>
                <button type="button" className="text-[11px] font-bold text-[#9B7A4F] hover:text-[#7A5F3A] transition-colors">
                  Forgot Password?
                </button>
              </div>
              <input
                required
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-3.5 bg-[#F8FAFC] border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm font-medium placeholder:text-slate-400"
              />
            </div>

            <div className="flex items-center gap-2 pt-1 pb-1">
              <input type="checkbox" id="remember" className="w-4 h-4 rounded border-slate-300 text-[#0F172A] focus:ring-[#0F172A]" />
              <label htmlFor="remember" className="text-[13px] font-medium text-slate-600">Remember this device</label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#0F172A] hover:bg-[#1E293B] text-white py-3.5 rounded-xl font-bold text-sm transition-colors flex items-center justify-center gap-2 disabled:opacity-70 shadow-sm"
            >
              {loading ? <Loader2 size={18} className="animate-spin" /> : "Sign In"}
            </button>
          </form>

          <div className="mt-8 flex items-center">
            <div className="flex-1 border-t border-slate-200/80" />
            <span className="px-4 text-[11px] font-medium text-slate-400 uppercase tracking-widest">Or continue with</span>
            <div className="flex-1 border-t border-slate-200/80" />
          </div>

          <div className="grid grid-cols-2 gap-3 mt-6">
            <button type="button" className="flex items-center justify-center gap-2 py-3 border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors text-sm font-bold text-slate-700">
              <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="w-4 h-4" />
              Google
            </button>
            <button type="button" className="flex items-center justify-center gap-2 py-3 border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors text-sm font-bold text-slate-700">
              <img src="https://www.svgrepo.com/show/475661/linkedin-color.svg" alt="LinkedIn" className="w-4 h-4" />
              LinkedIn
            </button>
          </div>
        </div>

        {/* Card Footer */}
        <div className="bg-[#F8FAFC] p-6 text-center border-t border-slate-100 flex flex-col items-center justify-center">
          <p className="text-[13px] text-slate-500 font-medium mb-1">Don't have an account?</p>
          <div className="flex items-center gap-2 text-[13px] font-bold text-[#9B7A4F]">
            <Link to="/register?role=buyer" className="hover:text-[#7A5F3A] transition-colors">Register as Buyer</Link>
            <span className="text-slate-300">|</span>
            <Link to="/register?role=supplier" className="hover:text-[#7A5F3A] transition-colors">Register as Manufacturer</Link>
          </div>
        </div>
      </div>
    </AuthLayout>
  );
}
