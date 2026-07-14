import React, { useState } from 'react';
import { Link, useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useGoogleLogin } from '@react-oauth/google';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../components/ui/Toast';
import { api } from '../lib/api';
import { AuthLayout } from '../layouts/AuthLayout';
import { Factory, Loader2, ShieldCheck, Eye, EyeOff } from 'lucide-react';

import { useAppearance } from '../contexts/AppearanceContext';

export function Login() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const { addToast } = useToast();
  const { loginUser } = useAuth();
  const { settings } = useAppearance();
  
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const [searchParams] = useSearchParams();
  const redirect_to = searchParams.get('redirect_to');

  const authBgImage = settings.auth_bg_image || "https://images.unsplash.com/photo-1578575437130-527eed3abbec?q=80&w=1200&auto=format&fit=crop";

  const googleLogin = useGoogleLogin({
    flow: 'implicit',
    onSuccess: async (tokenResponse) => {
      setGoogleLoading(true);
      try {
        // Get user info from Google using access token
        const userInfoRes = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
          headers: { Authorization: `Bearer ${tokenResponse.access_token}` },
        });
        const userInfo = await userInfoRes.json();
        
        // Send to our backend
        const res = await api.post('/auth/google', {
          credential: tokenResponse.access_token,
          email: userInfo.email,
          name: userInfo.name,
          picture: userInfo.picture,
        });
        const role = res.data.user.role;
        let from = redirect_to || (location.state as any)?.from?.pathname;

        // Admin Restriction
        if (role === 'ADMIN') {
          throw new Error('Tài khoản quản trị vui lòng đăng nhập qua cổng Admin (/wp-login)');
        }

        loginUser(res.data.user, res.data.token);
        addToast({ type: 'success', title: 'Thành công', message: 'Đăng nhập Google thành công' });
        
        navigate(role === 'BUYER' ? '/' : `/dashboard/${role.toLowerCase()}`);
      } catch (err: any) {
        addToast({ type: 'error', title: 'Thất bại', message: err.message || err.response?.data?.message || 'Đăng nhập Google thất bại' });
      } finally {
        setGoogleLoading(false);
      }
    },
    onError: () => {
      addToast({ type: 'error', title: 'Thất bại', message: 'Đăng nhập Google bị huỷ' });
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await api.post('/auth/login', { email, password });
      
      const role = res.data.user.role;
      let from = redirect_to || (location.state as any)?.from?.pathname;

      // Admin Restriction
      if (role === 'ADMIN') {
        throw new Error('Tài khoản quản trị vui lòng đăng nhập qua cổng Admin (/wp-login)');
      }

      loginUser(res.data.user, res.data.token);
      
      const roleMessages: Record<string, string> = {
        BUYER: t('login_as_buyer'),
        SUPPLIER: t('login_as_supplier'),
        ADMIN: 'Đăng nhập với vai trò Quản trị viên',
      };
      addToast({ type: 'success', title: t('success') || 'Thành công', message: roleMessages[role] || 'Đăng nhập thành công' });
      
      if (!from || (role === 'SUPPLIER' && from.startsWith('/dashboard/buyer')) || (role === 'BUYER' && from.startsWith('/dashboard/supplier'))) {
        from = role === 'BUYER' ? '/' : `/dashboard/${role.toLowerCase()}`;
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
    <div className="min-h-screen flex flex-col bg-canvas">
      {/* Custom Header (Height exactly 72px) */}
      <header className="sticky top-0 w-full h-[72px] px-6 lg:px-12 flex items-center justify-between border-b border-hairline shrink-0 bg-canvas z-20">
        <Link to="/" className="flex items-center gap-1.5">
          <img src="/logoVIE.png" alt="Logo" className="h-10 w-auto object-contain mix-blend-multiply" />
          <span className="text-xl font-semibold text-ink" style={{ letterSpacing: '0.16px' }}>
            VIE<span className="text-primary font-normal">Product</span>
          </span>
        </Link>
        <div className="flex items-center gap-6">
          <Link to="/help" className="text-sm font-normal text-ink-subtle hover:text-ink transition-colors" style={{ letterSpacing: '0.16px' }}>
            Trợ giúp
          </Link>
          <Link
            to="/register"
            className="bg-primary hover:bg-primary-hover text-white text-xs font-normal px-5 py-2.5 transition-colors" style={{ borderRadius: 0, letterSpacing: '0.16px' }}
          >
            Đăng ký
          </Link>
        </div>
      </header>

      {/* Main split-screen content */}
      <main className="flex-1 flex flex-col lg:flex-row min-h-0">
        {/* LEFT PANEL (60%) */}
        <div className="relative hidden lg:block lg:w-[60%] overflow-hidden border-r border-hairline sticky top-[72px] h-[calc(100vh-72px)] self-start">
          {/* Background image */}
          <img
            src={authBgImage}
            alt="Global B2B Logistics & Trading"
            className="absolute inset-0 w-full h-full object-cover"
          />
        </div>

        {/* RIGHT PANEL (40%) */}
        <div className="flex-1 lg:w-[40%] bg-canvas flex items-center justify-center p-8 lg:p-12">
          <div className="w-full max-w-[400px] flex flex-col">
            {/* Header info */}
            <div className="mb-6">
              <h1 className="text-xl font-light text-ink mb-1.5" style={{ letterSpacing: '0.16px' }}>
                Chào mừng trở lại
              </h1>
              <p className="text-xs text-ink-subtle font-normal" style={{ letterSpacing: '0.16px' }}>
                Đăng nhập để tiếp tục sử dụng nền tảng.
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[12px] font-normal text-ink" style={{ letterSpacing: '0.16px' }}>Email</label>
                <input
                  required
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@company.com"
                  className="w-full px-4 py-3 bg-surface-1 border border-hairline outline-none focus:border-b-2 focus:border-b-primary transition-all text-xs font-normal text-ink placeholder:text-ink-subtle placeholder:font-normal" style={{ borderRadius: 0, letterSpacing: '0.16px' }}
                />
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-[12px] font-normal text-ink" style={{ letterSpacing: '0.16px' }}>Mật khẩu</label>
                  <button type="button" className="text-[11px] font-normal text-primary hover:underline transition-colors" style={{ letterSpacing: '0.16px' }}>
                    Quên mật khẩu?
                  </button>
                </div>
                <div className="relative">
                  <input
                    required
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full px-4 py-3 pr-10 bg-surface-1 border border-hairline outline-none focus:border-b-2 focus:border-b-primary transition-all text-xs font-normal text-ink placeholder:text-ink-subtle" style={{ borderRadius: 0 }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-subtle hover:text-ink transition-colors"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between pt-1 pb-1">
                <div className="flex items-center gap-2">
                  <input type="checkbox" id="remember" className="w-4 h-4 border-hairline text-primary focus:ring-primary" style={{ borderRadius: 0 }} />
                  <label htmlFor="remember" className="text-xs font-normal text-ink-subtle" style={{ letterSpacing: '0.16px' }}>Ghi nhớ đăng nhập</label>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-primary hover:bg-primary-hover text-white py-3 font-normal text-xs transition-colors flex items-center justify-center gap-2 disabled:opacity-70" style={{ borderRadius: 0, letterSpacing: '0.16px' }}
              >
                {loading ? <Loader2 size={16} className="animate-spin" /> : "Đăng nhập"}
              </button>
            </form>

            <div className="my-5 flex items-center">
              <div className="flex-1 border-t border-hairline" />
              <span className="px-3 text-[10px] font-normal text-ink-subtle uppercase tracking-wider" style={{ letterSpacing: '0.32px' }}>Hoặc</span>
              <div className="flex-1 border-t border-hairline" />
            </div>

            <button
              type="button"
              onClick={() => googleLogin()}
              disabled={googleLoading}
              className="w-full flex items-center justify-center gap-2.5 py-3 border border-hairline hover:bg-surface-1 transition-all text-xs font-normal text-ink disabled:opacity-60 bg-canvas" style={{ borderRadius: 0, letterSpacing: '0.16px' }}
            >
              {googleLoading ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="w-4.5 h-4.5" />
              )}
              {googleLoading ? 'Đang xử lý...' : 'Đăng nhập bằng Google'}
            </button>

            {/* Footer link */}
            <div className="mt-8 pt-4 border-t border-hairline text-center">
              <span className="text-xs text-ink-subtle font-normal mr-1.5" style={{ letterSpacing: '0.16px' }}>Chưa có tài khoản?</span>
              <Link to="/register" className="text-xs font-normal text-primary hover:underline inline-flex items-center gap-0.5" style={{ letterSpacing: '0.16px' }}>
                Đăng ký ngay <span className="text-sm">→</span>
              </Link>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full px-6 lg:px-12 py-5 flex flex-col md:flex-row items-center justify-between border-t border-hairline shrink-0 text-[11px] text-ink-subtle bg-canvas z-10">
        <div className="mb-4 md:mb-0">
          <span className="font-semibold text-ink text-xs mr-2">VIEProduct</span>
          <span style={{ letterSpacing: '0.16px' }}>© 2026 VIEProduct. Vietnamese Industrial Excellence. Mọi quyền được bảo lưu.</span>
        </div>
        <div className="flex items-center gap-6 font-normal" style={{ letterSpacing: '0.16px' }}>
          <Link to="/privacy" className="hover:text-ink transition-colors">Chính sách bảo mật</Link>
          <Link to="/terms" className="hover:text-ink transition-colors">Điều khoản dịch vụ</Link>
          <Link to="/contact" className="hover:text-ink transition-colors">Liên hệ hỗ trợ</Link>
        </div>
      </footer>
    </div>
  );
}
