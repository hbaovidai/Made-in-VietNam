import React, { useState } from 'react';
import { DashboardSection } from '../../../components/DashboardSection';
import { User, Mail, Phone, Globe, Shield, Bell, CreditCard, ChevronRight, Save, Building2, Lock } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../../contexts/AuthContext';
import { useToast } from '../../../components/ui/Toast';
import { api } from '../../../lib/api';

export function SupplierSettings() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const { addToast } = useToast();
  const nameParts = (user?.fullName || '').split(' ');
  const lastName = nameParts.pop() || '';
  const firstName = nameParts.join(' ') || '';

  const [profileForm, setProfileForm] = useState({
    firstName,
    lastName,
    email: user?.email || '',
    phone: user?.phone || '',
  });

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
  });

  const [saving, setSaving] = useState(false);

  const handleSaveProfile = async () => {
    if (!user) return;
    setSaving(true);
    try {
      await api.put(`/auth/profile/${user.id}`, {
        fullName: `${profileForm.firstName} ${profileForm.lastName}`.trim(),
        phone: profileForm.phone,
      });
      addToast({ type: 'success', title: t('save_changes'), message: 'Đã cập nhật thông tin cá nhân' });
    } catch (e) {
      addToast({ type: 'error', title: 'Lỗi', message: 'Không thể cập nhật thông tin' });
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = async () => {
    if (!user || !passwordForm.currentPassword || !passwordForm.newPassword) return;
    if (passwordForm.newPassword.length < 6) {
      addToast({ type: 'error', title: 'Lỗi', message: 'Mật khẩu mới phải có ít nhất 6 ký tự' });
      return;
    }
    try {
      await api.put(`/auth/password/${user.id}`, {
        oldPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword,
      });
      setPasswordForm({ currentPassword: '', newPassword: '' });
      addToast({ type: 'success', title: 'Thành công', message: 'Đã đổi mật khẩu' });
    } catch (e: any) {
      addToast({ type: 'error', title: 'Lỗi', message: e.response?.data?.message || 'Không thể đổi mật khẩu' });
    }
  };

  const settingsSections = [
    { icon: <Building2 size={20} className="text-blue-500" />, title: t('setting_company_info'), desc: t('setting_company_info_desc') },
    { icon: <Mail size={20} className="text-orange-500" />, title: t('setting_email_notif'), desc: t('setting_email_notif_desc') },
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
          disabled={saving}
          className="bg-primary text-white px-8 py-2 font-bold hover:bg-primary-dark transition-colors uppercase tracking-widest text-xs shadow-lg shadow-primary/20 flex items-center gap-2 disabled:opacity-50"
        >
          <Save size={14} /> {saving ? 'Đang lưu...' : t('save_changes')}
        </button>
      }
    >
      <div className="p-8 space-y-12">
        {/* Profile Form */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div className="space-y-6">
            <h3 className="text-lg font-bold text-slate-900 uppercase tracking-tight flex items-center gap-2">
              <User size={20} className="text-primary" /> {t('contact_person_details')}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{t('first_name')}</label>
                <input type="text" value={profileForm.firstName} onChange={(e) => setProfileForm({...profileForm, firstName: e.target.value})} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 text-sm outline-none focus:border-primary" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{t('last_name')}</label>
                <input type="text" value={profileForm.lastName} onChange={(e) => setProfileForm({...profileForm, lastName: e.target.value})} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 text-sm outline-none focus:border-primary" />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{t('email_address')}</label>
              <input type="email" value={profileForm.email} disabled className="w-full px-4 py-3 bg-slate-100 border border-slate-200 text-sm outline-none text-slate-500 cursor-not-allowed" />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{t('phone_number')}</label>
              <input type="tel" value={profileForm.phone} onChange={(e) => setProfileForm({...profileForm, phone: e.target.value})} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 text-sm outline-none focus:border-primary" />
            </div>
          </div>

          <div className="space-y-6">
            <h3 className="text-lg font-bold text-slate-900 uppercase tracking-tight flex items-center gap-2">
              <Lock size={20} className="text-primary" /> Đổi mật khẩu
            </h3>
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Mật khẩu hiện tại</label>
              <input type="password" value={passwordForm.currentPassword} onChange={(e) => setPasswordForm({...passwordForm, currentPassword: e.target.value})} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 text-sm outline-none focus:border-primary" placeholder="Nhập mật khẩu hiện tại" />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Mật khẩu mới</label>
              <input type="password" value={passwordForm.newPassword} onChange={(e) => setPasswordForm({...passwordForm, newPassword: e.target.value})} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 text-sm outline-none focus:border-primary" placeholder="Nhập mật khẩu mới (tối thiểu 6 ký tự)" />
            </div>
            <button type="button" onClick={handleChangePassword} className="bg-slate-900 text-white px-6 py-3 font-bold hover:bg-slate-800 transition-colors uppercase tracking-widest text-xs">
              Cập nhật mật khẩu
            </button>
          </div>
        </div>

        {/* Other Settings List */}
        <div className="pt-12 border-t border-slate-100 space-y-4">
          <h3 className="text-lg font-bold text-slate-900 uppercase tracking-tight mb-6">{t('other_settings')}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {settingsSections.map((section, idx) => (
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
