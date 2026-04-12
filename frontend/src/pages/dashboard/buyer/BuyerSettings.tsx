import React, { useState, useEffect } from 'react';
import { DashboardSection } from '../../../components/DashboardSection';
import { User, Mail, Phone, Globe, Shield, Bell, CreditCard, ChevronRight, Save, Loader2, Lock } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../../contexts/AuthContext';
import { api } from '../../../lib/api';
import { useToast } from '../../../components/ui/Toast';

export function BuyerSettings() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const { addToast } = useToast();

  const nameParts = (user?.fullName || '').split(' ');
  const defaultLastName = nameParts.pop() || '';
  const defaultFirstName = nameParts.join(' ') || '';

  const [firstName, setFirstName] = useState(defaultFirstName);
  const [lastName, setLastName] = useState(defaultLastName);
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState((user as any)?.phone || '');
  
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [isSavingPassword, setIsSavingPassword] = useState(false);
  
  useEffect(() => {
    if (user) {
      const parts = (user.fullName || '').split(' ');
      setLastName(parts.pop() || '');
      setFirstName(parts.join(' ') || '');
      setEmail(user.email || '');
      setPhone((user as any).phone || '');
    }
  }, [user]);

  const handleSaveProfile = async () => {
    if (!user) return;
    try {
      setIsSavingProfile(true);
      const fullName = `${firstName} ${lastName}`.trim();
      const res = await api.put(`/auth/profile/${user.id}`, { fullName, phone });
      addToast({ type: 'success', title: 'Thành công', message: 'Đã cập nhật thông tin cá nhân' });
      // You might want to update the context here if it provides a method
    } catch (error: any) {
      console.error(error);
      addToast({ type: 'error', title: 'Lỗi', message: error.message || 'Không thể cập nhật thông tin' });
    } finally {
      setIsSavingProfile(false);
    }
  };

  const handleChangePassword = async () => {
    if (!user) return;
    if (!oldPassword || !newPassword) {
      addToast({ type: 'error', title: 'Lỗi', message: 'Vui lòng nhập đầy đủ mật khẩu' });
      return;
    }
    if (newPassword.length < 6) {
      addToast({ type: 'error', title: 'Lỗi', message: 'Mật khẩu mới phải có ít nhất 6 ký tự' });
      return;
    }

    try {
      setIsSavingPassword(true);
      await api.put(`/auth/password/${user.id}`, { oldPassword, newPassword });
      addToast({ type: 'success', title: 'Thành công', message: 'Đã đổi mật khẩu' });
      setOldPassword('');
      setNewPassword('');
    } catch (error: any) {
      console.error(error);
      addToast({ type: 'error', title: 'Lỗi', message: error.message || 'Mật khẩu cũ không đúng' });
    } finally {
      setIsSavingPassword(false);
    }
  };

  const settingsSections = [
    { icon: <User size={20} className="text-blue-500" />, title: t('setting_personal_info'), desc: t('setting_personal_info_desc') },
    { icon: <Mail size={20} className="text-orange-500" />, title: t('setting_email_notif'), desc: t('setting_email_notif_desc') },
    { icon: <Shield size={20} className="text-red-500" />, title: t('setting_security'), desc: t('setting_security_desc') },
    { icon: <CreditCard size={20} className="text-green-500" />, title: t('setting_payment'), desc: t('setting_payment_desc') },
    { icon: <Globe size={20} className="text-purple-500" />, title: t('setting_lang_region'), desc: t('setting_lang_region_desc') },
  ];

  return (
    <DashboardSection 
      title={t('account_settings_title')} 
      subtitle={t('account_settings_subtitle')}
      actions={
        <button 
          onClick={handleSaveProfile}
          disabled={isSavingProfile}
          className="bg-primary text-white px-8 py-2 font-bold hover:bg-primary-dark transition-colors uppercase tracking-widest text-xs shadow-lg shadow-primary/20 flex items-center gap-2 disabled:opacity-50"
        >
          {isSavingProfile ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />} 
          {t('save_changes')}
        </button>
      }
    >
      <div className="p-8 space-y-12">
        {/* Profile Form */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div className="space-y-6">
            <h3 className="text-lg font-bold text-slate-900 uppercase tracking-tight flex items-center gap-2">
              <User size={20} className="text-primary" /> {t('profile_details')}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{t('first_name')}</label>
                <input type="text" value={firstName} onChange={e => setFirstName(e.target.value)} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 text-sm outline-none focus:border-primary" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{t('last_name')}</label>
                <input type="text" value={lastName} onChange={e => setLastName(e.target.value)} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 text-sm outline-none focus:border-primary" />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{t('email_address')}</label>
              <input type="email" value={email} disabled className="w-full px-4 py-3 bg-slate-100 border border-slate-200 text-sm outline-none text-slate-500 cursor-not-allowed" />
              <div className="text-[10px] text-slate-400">Email không thể thay đổi</div>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{t('phone_number')}</label>
              <input type="tel" value={phone} onChange={e => setPhone(e.target.value)} placeholder="+84 123 456 789" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 text-sm outline-none focus:border-primary" />
            </div>
          </div>

          <div className="space-y-6">
            <h3 className="text-lg font-bold text-slate-900 uppercase tracking-tight flex items-center gap-2">
              <Lock size={20} className="text-primary" /> Đổi mật khẩu
            </h3>
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Mật khẩu hiện tại</label>
                <input 
                  type="password" 
                  value={oldPassword} 
                  onChange={e => setOldPassword(e.target.value)} 
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 text-sm outline-none focus:border-primary" 
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Mật khẩu mới</label>
                <input 
                  type="password" 
                  value={newPassword} 
                  onChange={e => setNewPassword(e.target.value)} 
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 text-sm outline-none focus:border-primary" 
                />
              </div>
              <button 
                onClick={handleChangePassword}
                disabled={isSavingPassword || !oldPassword || !newPassword}
                className="bg-slate-900 text-white px-6 py-3 font-bold hover:bg-slate-800 transition-colors uppercase tracking-widest text-xs w-full disabled:opacity-50 flex justify-center items-center gap-2"
              >
                {isSavingPassword && <Loader2 size={14} className="animate-spin" />}
                Cập nhật mật khẩu
              </button>
            </div>
          </div>
        </div>

        {/* Other Settings List */}
        <div className="pt-12 border-t border-slate-100 space-y-4">
          <h3 className="text-lg font-bold text-slate-900 uppercase tracking-tight mb-6">{t('other_settings')}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {settingsSections.slice(1).map((section, idx) => (
              <div key={idx} className="p-6 border border-slate-100 hover:border-primary transition-all flex items-center justify-between group cursor-pointer">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-slate-50 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                    {section.icon}
                  </div>
                  <div>
                    <div className="text-sm font-bold text-slate-800 group-hover:text-primary transition-colors">{section.title}</div>
                    <div className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">{section.desc}</div>
                  </div>
                </div>
                <ChevronRight size={16} className="text-slate-300 group-hover:text-primary" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardSection>
  );
}
