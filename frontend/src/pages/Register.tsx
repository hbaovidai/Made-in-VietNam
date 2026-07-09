import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useGoogleLogin } from '@react-oauth/google';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../components/ui/Toast';
import { api } from '../lib/api';
import { AuthLayout } from '../layouts/AuthLayout';
import { UserPlus, Loader2 } from 'lucide-react';
import { cn } from '../utils/cn';

import { useAppearance } from '../contexts/AppearanceContext';

export function Register() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { addToast } = useToast();
  const { loginUser } = useAuth();
  const { settings } = useAppearance();
  const authBgImage = settings.auth_bg_image || "https://images.unsplash.com/photo-1578575437130-527eed3abbec?q=80&w=1200&auto=format&fit=crop";
  
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const role = 'buyer';
  const [email, setEmail] = useState('');
  const [fullName, setFullName] = useState('');
  const [password, setPassword] = useState('');

  const googleLogin = useGoogleLogin({
    flow: 'implicit',
    onSuccess: async (tokenResponse) => {
      setGoogleLoading(true);
      try {
        const userInfoRes = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
          headers: { Authorization: `Bearer ${tokenResponse.access_token}` },
        });
        const userInfo = await userInfoRes.json();
        
        const res = await api.post('/auth/google', {
          credential: tokenResponse.access_token,
          email: userInfo.email,
          name: userInfo.name,
          picture: userInfo.picture,
        });
        loginUser(res.data.user, res.data.token);
        addToast({ type: 'success', title: 'Thành công', message: 'Đăng ký bằng Google thành công' });
        
        const userRole = res.data.user.role;
        navigate(userRole === 'BUYER' ? '/' : `/dashboard/${userRole.toLowerCase()}`);
      } catch (err: any) {
        addToast({ type: 'error', title: 'Thất bại', message: err.response?.data?.message || 'Đăng nhập Google thất bại' });
      } finally {
        setGoogleLoading(false);
      }
    },
    onError: () => {
      addToast({ type: 'error', title: 'Thất bại', message: 'Đăng nhập Google bị huỷ' });
    },
  });

  // If ?role=supplier is passed, redirect to /profile-submission page directly
  useEffect(() => {
    const urlRole = searchParams.get('role');
    if (urlRole === 'supplier') {
      navigate('/profile-submission');
    }
  }, [searchParams, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (!fullName.trim() || !email.trim() || !password) {
        throw new Error('Vui lòng nhập đầy đủ thông tin');
      }

      const res = await api.post('/auth/register', { 
        email, 
        password, 
        fullName, 
        role: 'BUYER' 
      });

      loginUser(res.data.user, res.data.token);
      addToast({ type: 'success', title: 'Hoan nghênh!', message: 'Đăng ký tài khoản thành công.' });
      navigate('/');
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
    <div className="min-h-screen flex flex-col bg-white">
      {/* Custom Header (Height exactly 72px) */}
      <header className="sticky top-0 w-full h-[72px] px-6 lg:px-12 flex items-center justify-between border-b border-[#E5E7EB] shrink-0 bg-white z-20">
        <Link to="/" className="flex items-center gap-1.5">
          <img src="/logoVIE.png" alt="Logo" className="h-10 w-auto object-contain mix-blend-multiply" />
          <span className="text-xl font-black text-[#0F172A] tracking-tight">
            VIE<span className="text-primary">Product</span>
          </span>
        </Link>
        <div className="flex items-center gap-6">
          <Link to="/help" className="text-sm font-semibold text-slate-500 hover:text-slate-800 transition-colors">
            Trợ giúp
          </Link>
          <Link
            to="/login"
            className="bg-[#0F172A] hover:bg-[#1E293B] text-white text-xs font-bold px-5 py-2.5 rounded-lg transition-colors shadow-sm"
          >
            Đăng nhập
          </Link>
        </div>
      </header>

      {/* Main split-screen content */}
      <main className="flex-1 flex flex-col lg:flex-row min-h-0">
        {/* LEFT PANEL (60%) */}
        <div className="relative hidden lg:block lg:w-[60%] overflow-hidden shadow-sm sticky top-[72px] h-[calc(100vh-72px)] self-start">
          {/* Background image */}
          <img
            src={authBgImage}
            alt="Global B2B Logistics & Trading"
            className="absolute inset-0 w-full h-full object-cover"
          />
        </div>

        {/* RIGHT PANEL (40%) */}
        <div className="flex-1 lg:w-[40%] bg-white flex items-center justify-center p-8 lg:p-12">
          <div className="w-full max-w-[440px] flex flex-col">
            {/* Header info */}
            <div className="mb-6">
              <h1 className="text-xl font-bold text-[#0F172A] mb-1.5 tracking-tight">
                Tạo tài khoản
              </h1>
              <p className="text-xs text-slate-400 font-medium">
                Tham gia cổng giao thương toàn cầu dành cho doanh nghiệp Việt.
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[12px] font-bold text-[#0F172A]">Họ và tên</label>
                <input
                  required
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Nguyễn Văn A"
                  className="w-full px-4 py-3 bg-[#FFFFFF] border border-[#E5E7EB] rounded-xl outline-none focus:ring-1 focus:ring-slate-400 focus:border-slate-500 transition-all text-xs font-semibold placeholder:text-slate-400 placeholder:font-normal"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[12px] font-bold text-[#0F172A]">Email doanh nghiệp</label>
                <input
                  required
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@company.com"
                  className="w-full px-4 py-3 bg-[#FFFFFF] border border-[#E5E7EB] rounded-xl outline-none focus:ring-1 focus:ring-slate-400 focus:border-slate-500 transition-all text-xs font-semibold placeholder:text-slate-400 placeholder:font-normal"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[12px] font-bold text-[#0F172A]">Mật khẩu</label>
                <input
                  required
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-4 py-3 bg-[#FFFFFF] border border-[#E5E7EB] rounded-xl outline-none focus:ring-1 focus:ring-slate-400 focus:border-slate-500 transition-all text-xs font-semibold placeholder:text-slate-400"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#0F172A] hover:bg-[#1E293B] text-white py-3 rounded-xl font-bold text-xs transition-colors flex items-center justify-center gap-2 disabled:opacity-70 shadow-sm mt-2"
              >
                {loading ? <Loader2 size={16} className="animate-spin" /> : "Đăng ký"}
              </button>

              <div className="my-5 flex items-center">
                <div className="flex-1 border-t border-[#E5E7EB]" />
                <span className="px-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Hoặc</span>
                <div className="flex-1 border-t border-[#E5E7EB]" />
              </div>

              <button
                type="button"
                onClick={() => googleLogin()}
                disabled={googleLoading}
                className="w-full flex items-center justify-center gap-2.5 py-3 border border-[#E5E7EB] rounded-xl hover:bg-slate-50 hover:border-slate-300 transition-all text-xs font-bold text-slate-700 disabled:opacity-60 bg-white"
              >
                {googleLoading ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : (
                  <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="w-4.5 h-4.5" />
                )}
                {googleLoading ? 'Đang xử lý...' : 'Đăng ký bằng Google'}
              </button>
            </form>

            {/* Footer link */}
            <div className="mt-8 pt-4 border-t border-[#E5E7EB] text-center">
              <span className="text-xs text-slate-500 font-medium mr-1.5">Đã có tài khoản?</span>
              <Link to="/login" className="text-xs font-bold text-[#9B7A4F] hover:text-[#7A5F3A] hover:underline inline-flex items-center gap-0.5">
                Đăng nhập ngay <span className="text-sm">→</span>
              </Link>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full px-6 lg:px-12 py-6 flex flex-col md:flex-row items-center justify-between border-t border-[#E5E7EB] mt-auto text-[11px] text-slate-400 bg-white">
        <div className="mb-4 md:mb-0">
          <span className="font-bold text-slate-600 text-xs mr-2">VIEProduct</span>
          <span>© 2026 VIEProduct. Vietnamese Industrial Excellence. Mọi quyền được bảo lưu.</span>
        </div>
        <div className="flex items-center gap-6 font-semibold">
          <Link to="/privacy" className="hover:text-slate-600 transition-colors">Chính sách bảo mật</Link>
          <Link to="/terms" className="hover:text-slate-600 transition-colors">Điều khoản dịch vụ</Link>
          <Link to="/contact" className="hover:text-slate-600 transition-colors">Liên hệ hỗ trợ</Link>
        </div>
      </footer>
    </div>
  );
}
