import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../components/ui/Toast';
import { api } from '../lib/api';
import { ShieldCheck, Loader2, Home } from 'lucide-react';

export function AdminLogin() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { addToast } = useToast();
  const { loginUser } = useAuth();
  
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [searchParams] = useSearchParams();
  const redirect_to = searchParams.get('redirect_to');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await api.post('/auth/login', { email, password });
      const role = res.data.user.role;

      if (role !== 'ADMIN') {
        throw new Error('Tài khoản không có quyền truy cập vào trang quản trị.');
      }

      loginUser(res.data.user, res.data.token);
      addToast({ 
        type: 'success', 
        title: 'Thành công', 
        message: 'Chào mừng Quản trị viên trở lại hệ thống' 
      });

      const from = redirect_to || '/dashboard/admin';
      navigate(from);
    } catch (err: any) {
      addToast({ 
        type: 'error', 
        title: 'Thất bại', 
        message: err.message || err.response?.data?.message || 'Thông tin đăng nhập không hợp lệ.' 
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col justify-between">
      {/* Mini Header */}
      <header className="w-full h-16 px-6 lg:px-12 flex items-center justify-between border-b border-[#E2E8F0] bg-white shrink-0">
        <Link to="/" className="flex items-center gap-1.5">
          <img src="/logoVIE.png" alt="Logo" className="h-8 w-auto object-contain mix-blend-multiply" />
          <span className="text-lg font-black text-[#0F172A] tracking-tight">
            VIE<span className="text-primary">Product</span>
          </span>
        </Link>
        <Link to="/" className="text-xs font-bold text-slate-500 hover:text-slate-800 transition-colors flex items-center gap-1.5">
          <Home size={14} />
          Trở về Trang chủ
        </Link>
      </header>

      {/* Main card */}
      <main className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-[420px] bg-white border border-[#E2E8F0] shadow-sm rounded-none p-8 flex flex-col">
          {/* Header Info */}
          <div className="mb-6 text-center">
            <div className="w-12 h-12 bg-[#0F172A] rounded-none flex items-center justify-center text-white mb-4 shadow-sm mx-auto">
              <ShieldCheck size={24} strokeWidth={2} />
            </div>
            <h1 className="text-xl font-bold text-[#0F172A] mb-1.5 tracking-tight">
              Cổng Quản Trị Hệ Thống
            </h1>
            <p className="text-xs text-slate-400 font-medium leading-relaxed">
              Đăng nhập an toàn dành riêng cho Quản trị viên của VIEproduct.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-[11px] uppercase tracking-wider font-extrabold text-[#0F172A]">Tên đăng nhập (Email)</label>
              <input
                required
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@vieproduct.vn"
                className="w-full px-4 py-3 bg-white border border-[#E2E8F0] rounded-none outline-none focus:border-[#0F172A] transition-all text-xs font-semibold placeholder:text-slate-400 placeholder:font-normal"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] uppercase tracking-wider font-extrabold text-[#0F172A]">Mật khẩu</label>
              <input
                required
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-3 bg-white border border-[#E2E8F0] rounded-none outline-none focus:border-[#0F172A] transition-all text-xs font-semibold placeholder:text-slate-400"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#0F172A] hover:bg-[#1E293B] text-white py-3 rounded-none font-bold text-xs transition-colors flex items-center justify-center gap-2 disabled:opacity-70 shadow-sm mt-6"
            >
              {loading ? <Loader2 size={16} className="animate-spin" /> : "Đăng Nhập Quản Trị"}
            </button>
          </form>
        </div>
      </main>

      {/* Mini Footer */}
      <footer className="w-full px-6 lg:px-12 py-4 flex flex-col sm:flex-row items-center justify-between border-t border-[#E2E8F0] text-[10px] text-slate-400 bg-white">
        <div className="mb-2 sm:mb-0">
          <span className="font-bold text-slate-600 text-xs mr-2">VIEProduct</span>
          <span>© 2026 VIEProduct. Vietnamese Industrial Excellence. Mọi quyền được bảo lưu.</span>
        </div>
        <div className="flex items-center gap-4 font-semibold">
          <Link to="/privacy" className="hover:text-slate-600 transition-colors">Chính sách bảo mật</Link>
          <Link to="/terms" className="hover:text-slate-600 transition-colors">Điều khoản dịch vụ</Link>
        </div>
      </footer>
    </div>
  );
}
