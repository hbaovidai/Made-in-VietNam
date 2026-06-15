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

export function Register() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { addToast } = useToast();
  const { loginUser } = useAuth();
  
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [role, setRole] = useState<'buyer' | 'supplier'>('buyer');
  const [email, setEmail] = useState('');
  const [fullName, setFullName] = useState('');
  const [password, setPassword] = useState('');

  const [supplierName, setSupplierName] = useState("");
  const [supplierPosition, setSupplierPosition] = useState("");
  const [supplierIdNumber, setSupplierIdNumber] = useState("");
  const [supplierIdFile, setSupplierIdFile] = useState<File | null>(null);
  const [supplierEmail, setSupplierEmail] = useState("");
  const [supplierPhone, setSupplierPhone] = useState("");

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

  // Auto-detect role from URL query param if present
  useEffect(() => {
    const urlRole = searchParams.get('role');
    if (urlRole === 'supplier' || urlRole === 'buyer') {
      setRole(urlRole);
    }
  }, [searchParams]);

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
        role: role.toUpperCase() 
      });

      loginUser(res.data.user, res.data.token);
      addToast({ type: 'success', title: 'Hoan nghênh!', message: 'Đăng ký tài khoản thành công.' });
      navigate(role === 'buyer' ? '/' : `/dashboard/${role.toLowerCase()}`);
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
    <AuthLayout rightActionText="Sign In" rightActionLink="/login">
      <div className="w-full max-w-[440px] bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 overflow-hidden flex flex-col">
        {/* Top Icon & Titles */}
        <div className="px-10 pt-12 pb-8 flex flex-col items-center text-center">
          <div className="w-14 h-14 bg-[#0F172A] rounded-xl flex items-center justify-center text-white mb-6 shadow-md">
            <UserPlus size={28} strokeWidth={1.5} />
          </div>
          <h1 className="text-2xl font-black text-[#0F172A] mb-2 tracking-tight">Create an Account</h1>
          <p className="text-[13px] text-slate-500 font-medium">Join the Global Gateway for Vietnamese Excellence</p>
        </div>

        {/* Form Body */}
        <div className="px-10 pb-8 flex-1">
          {/* Role selector */}
          <div className="flex p-1 bg-[#F8FAFC] rounded-xl mb-6">
            <button 
              type="button"
              onClick={() => setRole('buyer')}
              className={cn(
                "flex-1 py-2 text-[13px] font-bold rounded-lg transition-all",
                role === 'buyer' ? "bg-white text-[#0F172A] shadow-sm" : "text-slate-500 hover:text-slate-700"
              )}
            >
              I am a Buyer
            </button>
            <button 
              type="button"
              onClick={() => setRole('supplier')}
              className={cn(
                "flex-1 py-2 text-[13px] font-bold rounded-lg transition-all",
                role === 'supplier' ? "bg-white text-[#0F172A] shadow-sm" : "text-slate-500 hover:text-slate-700"
              )}
            >
              I am a Supplier
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">

            {role === "buyer" ? (
              <>
                {/* Existing buyer fields */}

                <div className="space-y-2">
                  <label className="text-[13px] font-bold text-[#0F172A]">
                    Full Name
                  </label>

                  <input
                    required
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="John Doe"
                    className="w-full px-4 py-3.5 bg-[#F8FAFC] border border-slate-200 rounded-xl"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[13px] font-bold text-[#0F172A]">
                    Corporate Email
                  </label>

                  <input
                    required
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@company.com"
                    className="w-full px-4 py-3.5 bg-[#F8FAFC] border border-slate-200 rounded-xl"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[13px] font-bold text-[#0F172A]">
                    Password
                  </label>

                  <input
                    required
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full px-4 py-3.5 bg-[#F8FAFC] border border-slate-200 rounded-xl"
                  />
                </div>

                <div className="mt-8 flex items-center">
                  <div className="flex-1 border-t border-slate-200/80" />
                  <span className="px-4 text-[11px] font-medium text-slate-400 uppercase tracking-widest">Or continue with</span>
                  <div className="flex-1 border-t border-slate-200/80" />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[#0F172A] hover:bg-[#1E293B] text-white py-3.5 rounded-xl font-bold text-sm transition-colors flex items-center justify-center gap-2 disabled:opacity-70 shadow-sm mt-6"
                >
                  {loading ? (
                    <Loader2 size={18} className="animate-spin" />
                  ) : (
                    "Register"
                  )}
                </button>

                <div className="mt-6">
                  <button
                    type="button"
                    onClick={() => googleLogin()}
                    disabled={googleLoading}
                    className="w-full flex items-center justify-center gap-3 py-3.5 border border-slate-200 rounded-xl hover:bg-slate-50 hover:border-slate-300 transition-all text-sm font-bold text-slate-700 disabled:opacity-60"
                  >
                    {googleLoading ? (
                      <Loader2 size={18} className="animate-spin" />
                    ) : (
                      <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="w-5 h-5" />
                    )}
                    {googleLoading ? 'Đang xử lý...' : 'Đăng ký bằng Google'}
                  </button>
                </div>

              </>
            ) : (
              <>
                {/* Họ và tên */}

                <div className="space-y-2">
                  <label className="text-[13px] font-bold text-[#0F172A]">
                    Họ và tên người đăng ký
                  </label>

                  <input
                    required
                    type="text"
                    value={supplierName}
                    onChange={(e) => setSupplierName(e.target.value)}
                    placeholder="Nguyễn Văn A"
                    className="w-full px-4 py-3.5 bg-[#F8FAFC] border border-slate-200 rounded-xl"
                  />
                </div>

                {/* Chức vụ */}

                <div className="space-y-2">
                  <label className="text-[13px] font-bold text-[#0F172A]">
                    Chức vụ
                  </label>

                  <select
                    required
                    value={supplierPosition}
                    onChange={(e) => setSupplierPosition(e.target.value)}
                    className="w-full px-4 py-3.5 bg-[#F8FAFC] border border-slate-200 rounded-xl"
                  >
                    <option value="">
                      Chọn chức vụ
                    </option>

                    <option value="LEGAL_REPRESENTATIVE">
                      Người đại diện pháp luật
                    </option>

                    <option value="DIRECTOR">
                      Giám đốc / Chủ doanh nghiệp
                    </option>

                    <option value="BUSINESS">
                      Quản lý / Nhân viên kinh doanh
                    </option>
                  </select>
                </div>

                {/* CCCD */}

                <div className="space-y-2">
                  <label className="text-[13px] font-bold text-[#0F172A]">
                    Số CCCD / Passport
                  </label>

                  <input
                    required
                    type="text"
                    value={supplierIdNumber}
                    onChange={(e) => setSupplierIdNumber(e.target.value)}
                    placeholder="012345678901"
                    className="w-full px-4 py-3.5 bg-[#F8FAFC] border border-slate-200 rounded-xl"
                  />
                </div>

                {/* Upload */}

                <div className="space-y-2">

                  <label className="text-[13px] font-bold text-[#0F172A]">
                    Ảnh chụp CCCD / Passport
                  </label>

                  <input
                    required
                    type="file"
                    accept=".png,.jpg,.jpeg,.pdf"
                    onChange={(e) =>
                      setSupplierIdFile(
                        e.target.files?.[0] || null
                      )
                    }
                    className="w-full text-sm"
                  />

                  <p className="text-xs text-slate-500">
                    Upload 2 mặt CCCD hoặc trang thông tin Passport.
                    PNG, JPG, PDF. Tối đa 5MB.
                  </p>

                </div>

                {/* Email */}

                <div className="space-y-2">

                  <label className="text-[13px] font-bold text-[#0F172A]">
                    Email cá nhân / công việc
                  </label>

                  <input
                    required
                    type="email"
                    value={supplierEmail}
                    onChange={(e) => setSupplierEmail(e.target.value)}
                    placeholder="name@company.com"
                    className="w-full px-4 py-3.5 bg-[#F8FAFC] border border-slate-200 rounded-xl"
                  />

                </div>

                {/* Phone */}

                <div className="space-y-2">

                  <label className="text-[13px] font-bold text-[#0F172A]">
                    Số điện thoại liên hệ
                  </label>

                  <input
                    required
                    type="tel"
                    value={supplierPhone}
                    onChange={(e) => setSupplierPhone(e.target.value)}
                    placeholder="+84 912 345 678"
                    className="w-full px-4 py-3.5 bg-[#F8FAFC] border border-slate-200 rounded-xl"
                  />

                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[#0F172A] hover:bg-[#1E293B] text-white py-3.5 rounded-xl font-bold text-sm transition-colors flex items-center justify-center gap-2 disabled:opacity-70 shadow-sm mt-6"
                >
                  {loading ? (
                    <Loader2 size={18} className="animate-spin" />
                  ) : (
                    "Submit Application"
                  )}
                </button>

              </>
            )}



          </form>
        </div>

        {/* Card Footer */}
        <div className="bg-[#F8FAFC] p-6 text-center border-t border-slate-100 flex flex-col items-center justify-center">
          <p className="text-[13px] text-slate-500 font-medium mb-1">Already have an account?</p>
          <div className="flex items-center gap-2 text-[13px] font-bold text-[#9B7A4F]">
            <Link to="/login" className="hover:text-[#7A5F3A] transition-colors">Sign In to VIEProduct</Link>
          </div>
        </div>
      </div>
    </AuthLayout>
  );
}
