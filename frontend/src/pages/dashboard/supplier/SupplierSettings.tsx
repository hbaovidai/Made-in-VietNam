import React, { useState } from 'react';
import { User, Mail, Globe, Bell, CreditCard, ChevronRight, Building2, Lock, BellRing, BellOff, Check, Languages } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';
import { useToast } from '../../../components/ui/Toast';
import { Modal } from '../../../components/ui/Modal';
import { api } from '../../../lib/api';

export function SupplierSettings() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
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

  // Notification settings (stored in localStorage)
  const [isNotifModalOpen, setIsNotifModalOpen] = useState(false);
  const [notifSettings, setNotifSettings] = useState(() => {
    const saved = localStorage.getItem('notif_settings');
    return saved ? JSON.parse(saved) : {
      orderUpdates: true,
      rfqAlerts: true,
      messageAlerts: true,
      promotions: false,
      weeklyReport: true,
    };
  });

  // Language & Region modal
  const [isLangModalOpen, setIsLangModalOpen] = useState(false);
  const [selectedLang, setSelectedLang] = useState(i18n.language || 'vi');

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

  const handleSaveNotifSettings = () => {
    localStorage.setItem('notif_settings', JSON.stringify(notifSettings));
    setIsNotifModalOpen(false);
    addToast({ type: 'success', title: 'Thành công', message: 'Đã cập nhật cài đặt thông báo' });
  };

  const handleSaveLang = () => {
    i18n.changeLanguage(selectedLang);
    localStorage.setItem('i18nextLng', selectedLang);
    setIsLangModalOpen(false);
    addToast({ type: 'success', title: 'Thành công', message: selectedLang === 'vi' ? 'Đã chuyển sang Tiếng Việt' : 'Switched to English' });
  };

  const handleSettingClick = (idx: number) => {
    switch (idx) {
      case 0: // Thông tin công ty
        navigate('/dashboard/supplier/profile');
        break;
      case 1: // Email & Thông báo
        setIsNotifModalOpen(true);
        break;
      case 2: // Thanh toán — chưa triển khai
        addToast({ type: 'info', title: 'Sắp ra mắt', message: 'Tính năng thanh toán sẽ được triển khai trong tương lai' });
        break;
      case 3: // Ngôn ngữ
        setIsLangModalOpen(true);
        break;
    }
  };

  const settingsSections = [
    { icon: <Building2 size={20} className="text-blue-500" />, title: t('setting_company_info'), desc: t('setting_company_info_desc') },
    { icon: <Mail size={20} className="text-orange-500" />, title: t('setting_email_notif'), desc: t('setting_email_notif_desc') },
    { icon: <CreditCard size={20} className="text-green-500" />, title: t('setting_payment'), desc: t('setting_payment_desc') },
    { icon: <Globe size={20} className="text-purple-500" />, title: t('setting_lang_region'), desc: t('setting_lang_region_desc') },
  ];

  const notifOptions = [
    { key: 'orderUpdates', icon: <Bell size={16} className="text-blue-500" />, label: 'Cập nhật đơn hàng', desc: 'Nhận thông báo khi có đơn hàng mới hoặc thay đổi' },
    { key: 'rfqAlerts', icon: <BellRing size={16} className="text-amber-500" />, label: 'Yêu cầu báo giá (RFQ)', desc: 'Nhận thông báo khi có yêu cầu báo giá mới' },
    { key: 'messageAlerts', icon: <Mail size={16} className="text-emerald-500" />, label: 'Tin nhắn mới', desc: 'Nhận thông báo khi có tin nhắn từ người mua' },
    { key: 'promotions', icon: <BellOff size={16} className="text-slate-400" />, label: 'Khuyến mãi & tin tức', desc: 'Nhận email về chương trình khuyến mãi và tin tức nền tảng' },
    { key: 'weeklyReport', icon: <Mail size={16} className="text-purple-500" />, label: 'Báo cáo hàng tuần', desc: 'Nhận email tổng kết hoạt động mỗi tuần' },
  ];

  const languages = [
    { code: 'vi', label: 'Tiếng Việt', flag: '🇻🇳' },
    { code: 'en', label: 'English', flag: '🇺🇸' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-slate-900">{t('account_settings_title')}</h1>
        <p className="text-sm text-slate-500 mt-1">{t('account_settings_subtitle')}</p>
      </div>
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
            <button type="button" onClick={handleSaveProfile} disabled={saving} className="bg-slate-900 text-white px-6 py-3 font-bold hover:bg-slate-800 transition-colors uppercase tracking-widest text-xs disabled:opacity-60">
              {saving ? 'Đang lưu...' : t('save_changes')}
            </button>
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
              <div
                key={idx}
                onClick={() => handleSettingClick(idx)}
                className="p-6 border border-slate-100 hover:border-primary transition-all flex items-center justify-between group cursor-pointer rounded-xl"
              >
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

      {/* Email & Notification Settings Modal */}
      <Modal isOpen={isNotifModalOpen} onClose={() => setIsNotifModalOpen(false)} title="Email & Thông báo">
        <div className="space-y-1">
          {notifOptions.map((opt) => (
            <div
              key={opt.key}
              className="flex items-center justify-between p-4 rounded-xl hover:bg-slate-50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center">
                  {opt.icon}
                </div>
                <div>
                  <div className="text-sm font-semibold text-slate-800">{opt.label}</div>
                  <div className="text-[11px] text-slate-400 mt-0.5">{opt.desc}</div>
                </div>
              </div>
              <button
                onClick={() => setNotifSettings({ ...notifSettings, [opt.key]: !notifSettings[opt.key as keyof typeof notifSettings] })}
                className={`relative inline-flex h-6 w-11 items-center rounded-full border-2 border-transparent transition-colors focus:outline-none shrink-0 ${
                  notifSettings[opt.key as keyof typeof notifSettings] ? 'bg-emerald-500' : 'bg-slate-300'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 rounded-full bg-white shadow transition-transform ${
                    notifSettings[opt.key as keyof typeof notifSettings] ? 'translate-x-5' : 'translate-x-0.5'
                  }`}
                />
              </button>
            </div>
          ))}
        </div>
        <div className="flex justify-end gap-3 pt-6 border-t border-slate-100 mt-4">
          <button onClick={() => setIsNotifModalOpen(false)} className="btn-ghost">Hủy</button>
          <button onClick={handleSaveNotifSettings} className="btn-primary flex items-center gap-2">
            <Check size={14} /> Lưu cài đặt
          </button>
        </div>
      </Modal>

      {/* Language & Region Modal */}
      <Modal isOpen={isLangModalOpen} onClose={() => setIsLangModalOpen(false)} title="Ngôn ngữ & Khu vực">
        <div className="space-y-3">
          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Chọn ngôn ngữ hiển thị</label>
          <div className="space-y-2">
            {languages.map((lang) => (
              <div
                key={lang.code}
                onClick={() => setSelectedLang(lang.code)}
                className={`flex items-center justify-between p-4 rounded-xl border-2 cursor-pointer transition-all ${
                  selectedLang === lang.code
                    ? 'border-primary bg-primary/5'
                    : 'border-slate-100 hover:border-slate-200'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{lang.flag}</span>
                  <div>
                    <div className="text-sm font-bold text-slate-800">{lang.label}</div>
                    <div className="text-[11px] text-slate-400">{lang.code === 'vi' ? 'Vietnamese' : 'English (US)'}</div>
                  </div>
                </div>
                {selectedLang === lang.code && (
                  <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                    <Check size={14} className="text-white" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
        <div className="flex justify-end gap-3 pt-6 border-t border-slate-100 mt-6">
          <button onClick={() => setIsLangModalOpen(false)} className="btn-ghost">Hủy</button>
          <button onClick={handleSaveLang} className="btn-primary flex items-center gap-2">
            <Languages size={14} /> Áp dụng
          </button>
        </div>
      </Modal>
    </div>
  );
}
