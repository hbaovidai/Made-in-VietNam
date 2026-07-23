import React, { useState, useEffect } from 'react';
import { User, Mail, Globe, Bell, CreditCard, ChevronRight, Building2, Lock, BellRing, BellOff, Check, Languages, Eye, EyeOff } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';
import { useToast } from '../../../components/ui/Toast';
import { Modal } from '../../../components/ui/Modal';
import { api } from '../../../lib/api';

export function SupplierSettings() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const { user, loginUser, token } = useAuth();
  const { addToast } = useToast();

  const [profileForm, setProfileForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
  });

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
  });

  const [saving, setSaving] = useState(false);
  const [showCurrentPw, setShowCurrentPw] = useState(false);
  const [showNewPw, setShowNewPw] = useState(false);

  useEffect(() => {
    if (user) {
      const nameParts = (user.fullName || '').split(' ');
      const lastName = nameParts.pop() || '';
      const firstName = nameParts.join(' ') || '';
      setProfileForm({
        firstName,
        lastName,
        email: user.email || '',
        phone: (user as any).phone || '',
      });
    }
  }, [user]);

  // Fetch latest profile from server to ensure fresh data
  useEffect(() => {
    if (user?.id && token) {
      api.get(`/auth/profile/${user.id}`).then(res => {
        const fresh = res.data;
        if (token) loginUser({ ...user, ...fresh }, token);
      }).catch(() => {});
    }
  }, []);

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
      const fullName = `${profileForm.firstName} ${profileForm.lastName}`.trim();
      const res = await api.put(`/auth/profile/${user.id}`, {
        fullName,
        phone: profileForm.phone,
      });
      const updatedUser = res.data.user || { ...user, fullName, phone: profileForm.phone };
      if (token) loginUser(updatedUser, token);
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
    { icon: <Building2 size={20} className="text-primary" />, title: t('setting_company_info'), desc: t('setting_company_info_desc') },
    { icon: <Mail size={20} className="text-primary" />, title: t('setting_email_notif'), desc: t('setting_email_notif_desc') },
    { icon: <CreditCard size={20} className="text-primary" />, title: t('setting_payment'), desc: t('setting_payment_desc') },
    { icon: <Globe size={20} className="text-primary" />, title: t('setting_lang_region'), desc: t('setting_lang_region_desc') },
  ];

  const notifOptions = [
    { key: 'orderUpdates', icon: <Bell size={16} className="text-primary" />, label: 'Cập nhật đơn hàng', desc: 'Nhận thông báo khi có đơn hàng mới hoặc thay đổi' },
    { key: 'rfqAlerts', icon: <BellRing size={16} className="text-primary" />, label: 'Yêu cầu báo giá (RFQ)', desc: 'Nhận thông báo khi có yêu cầu báo giá mới' },
    { key: 'messageAlerts', icon: <Mail size={16} className="text-primary" />, label: 'Tin nhắn mới', desc: 'Nhận thông báo khi có tin nhắn từ người mua' },
    { key: 'promotions', icon: <BellOff size={16} className="text-primary" />, label: 'Khuyến mãi & tin tức', desc: 'Nhận email về chương trình khuyến mãi và tin tức nền tảng' },
    { key: 'weeklyReport', icon: <Mail size={16} className="text-primary" />, label: 'Báo cáo hàng tuần', desc: 'Nhận email tổng kết hoạt động mỗi tuần' },
  ];

  const languages = [
    { code: 'vi', label: 'Tiếng Việt', flag: '🇻🇳' },
    { code: 'en', label: 'English', flag: '🇺🇸' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-sm font-semibold text-ink uppercase" style={{ letterSpacing: '0.32px' }}>{t('account_settings_title')}</h1>
        <p className="text-sm text-ink-muted mt-1" style={{ letterSpacing: '0.16px' }}>{t('account_settings_subtitle')}</p>
      </div>
      <div className="space-y-12">
        {/* Profile Form */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div className="space-y-6">
            <h3 className="text-sm font-normal text-ink uppercase tracking-wider flex items-center gap-2" style={{ letterSpacing: '0.32px' }}>
              <User size={20} className="text-primary" /> {t('contact_person_details')}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-[10px] font-normal text-ink-subtle uppercase tracking-widest" style={{ letterSpacing: '0.32px' }}>{t('first_name')}</label>
                <input type="text" value={profileForm.firstName} onChange={(e) => setProfileForm({...profileForm, firstName: e.target.value})} className="w-full px-4 py-3 bg-surface-1 border border-hairline text-sm outline-none focus:border-b-2 focus:border-b-primary" style={{ borderRadius: 0, letterSpacing: '0.16px' }} />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-normal text-ink-subtle uppercase tracking-widest" style={{ letterSpacing: '0.32px' }}>{t('last_name')}</label>
                <input type="text" value={profileForm.lastName} onChange={(e) => setProfileForm({...profileForm, lastName: e.target.value})} className="w-full px-4 py-3 bg-surface-1 border border-hairline text-sm outline-none focus:border-b-2 focus:border-b-primary" style={{ borderRadius: 0, letterSpacing: '0.16px' }} />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-normal text-ink-subtle uppercase tracking-widest" style={{ letterSpacing: '0.32px' }}>{t('email_address')}</label>
              <input type="email" value={profileForm.email} disabled className="w-full px-4 py-3 bg-surface-2 border border-hairline text-sm outline-none text-ink-subtle cursor-not-allowed" style={{ borderRadius: 0, letterSpacing: '0.16px' }} />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-normal text-ink-subtle uppercase tracking-widest" style={{ letterSpacing: '0.32px' }}>{t('phone_number')}</label>
              <input type="tel" value={profileForm.phone} onChange={(e) => setProfileForm({...profileForm, phone: e.target.value})} className="w-full px-4 py-3 bg-surface-1 border border-hairline text-sm outline-none focus:border-b-2 focus:border-b-primary" style={{ borderRadius: 0, letterSpacing: '0.16px' }} />
            </div>
            <button type="button" onClick={handleSaveProfile} disabled={saving} className="bg-primary text-white px-6 py-3 font-normal hover:bg-primary-hover transition-colors uppercase tracking-widest text-xs disabled:opacity-60" style={{ borderRadius: 0, letterSpacing: '0.16px' }}>
              {saving ? 'Đang lưu...' : t('save_changes')}
            </button>
          </div>

          <div className="space-y-6">
            <h3 className="text-sm font-normal text-ink uppercase tracking-wider flex items-center gap-2" style={{ letterSpacing: '0.32px' }}>
              <Lock size={20} className="text-primary" /> {t('change_password')}
            </h3>
            <div className="space-y-2">
              <label className="text-[10px] font-normal text-ink-subtle uppercase tracking-widest" style={{ letterSpacing: '0.32px' }}>{t('current_password')}</label>
              <div className="relative">
                <input type={showCurrentPw ? 'text' : 'password'} value={passwordForm.currentPassword} onChange={(e) => setPasswordForm({...passwordForm, currentPassword: e.target.value})} className="w-full px-4 py-3 pr-10 bg-surface-1 border border-hairline text-sm outline-none focus:border-b-2 focus:border-b-primary" placeholder={t('current_password_placeholder')} style={{ borderRadius: 0, letterSpacing: '0.16px' }} />
                <button type="button" onClick={() => setShowCurrentPw(!showCurrentPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-subtle hover:text-ink transition-colors">
                  {showCurrentPw ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-normal text-ink-subtle uppercase tracking-widest" style={{ letterSpacing: '0.32px' }}>{t('new_password')}</label>
              <div className="relative">
                <input type={showNewPw ? 'text' : 'password'} value={passwordForm.newPassword} onChange={(e) => setPasswordForm({...passwordForm, newPassword: e.target.value})} className="w-full px-4 py-3 pr-10 bg-surface-1 border border-hairline text-sm outline-none focus:border-b-2 focus:border-b-primary" placeholder={t('new_password_placeholder')} style={{ borderRadius: 0, letterSpacing: '0.16px' }} />
                <button type="button" onClick={() => setShowNewPw(!showNewPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-subtle hover:text-ink transition-colors">
                  {showNewPw ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
            <button type="button" onClick={handleChangePassword} className="bg-primary text-white px-6 py-3 font-normal hover:bg-primary-hover transition-colors uppercase tracking-widest text-xs" style={{ borderRadius: 0, letterSpacing: '0.16px' }}>
              {t('update_password_btn')}
            </button>
          </div>
        </div>

        {/* Other Settings List */}
        <div className="pt-12 border-t border-hairline space-y-4">
          <h3 className="text-sm font-normal text-ink uppercase tracking-wider mb-6" style={{ letterSpacing: '0.32px' }}>{t('other_settings')}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {settingsSections.map((section, idx) => (
              <div
                key={idx}
                onClick={() => handleSettingClick(idx)}
                className="bg-canvas p-6 border border-hairline hover:bg-surface-1 transition-all flex items-center justify-between group cursor-pointer"
                style={{ borderRadius: 0 }}
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-surface-1 border border-hairline flex items-center justify-center shrink-0" style={{ borderRadius: 0 }}>
                    {section.icon}
                  </div>
                  <div>
                    <div className="text-sm font-normal text-ink group-hover:text-primary transition-colors" style={{ letterSpacing: '0.16px' }}>{section.title}</div>
                    <div className="text-[10px] text-ink-subtle font-normal uppercase tracking-widest mt-1" style={{ letterSpacing: '0.32px' }}>{section.desc}</div>
                  </div>
                </div>
                <ChevronRight size={16} className="text-hairline group-hover:text-primary" />
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
              className="flex items-center justify-between p-4 hover:bg-surface-1 border-b border-hairline last:border-0 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-surface-2 border border-hairline flex items-center justify-center" style={{ borderRadius: 0 }}>
                  {opt.icon}
                </div>
                <div>
                  <div className="text-sm font-normal text-ink" style={{ letterSpacing: '0.16px' }}>{opt.label}</div>
                  <div className="text-[11px] text-ink-subtle mt-0.5" style={{ letterSpacing: '0.16px' }}>{opt.desc}</div>
                </div>
              </div>
              <button
                onClick={() => setNotifSettings({ ...notifSettings, [opt.key]: !notifSettings[opt.key as keyof typeof notifSettings] })}
                className={`relative inline-flex h-6 w-11 items-center border border-hairline transition-colors focus:outline-none shrink-0 ${
                  notifSettings[opt.key as keyof typeof notifSettings] ? 'bg-primary' : 'bg-surface-2'
                }`}
                style={{ borderRadius: 0 }}
              >
                <span
                  className={`inline-block h-4 w-4 bg-canvas transition-transform ${
                    notifSettings[opt.key as keyof typeof notifSettings] ? 'translate-x-5' : 'translate-x-0.5'
                  }`}
                  style={{ borderRadius: 0 }}
                />
              </button>
            </div>
          ))}
        </div>
        <div className="flex justify-end gap-3 pt-6 border-t border-hairline mt-4">
          <button onClick={() => setIsNotifModalOpen(false)} className="bg-surface-2 hover:bg-surface-3 text-ink text-xs font-normal px-4 py-2" style={{ borderRadius: 0, letterSpacing: '0.16px' }}>Hủy</button>
          <button onClick={handleSaveNotifSettings} className="bg-primary hover:bg-primary-hover text-white text-xs font-normal px-4 py-2 flex items-center gap-2" style={{ borderRadius: 0, letterSpacing: '0.16px' }}>
            <Check size={14} /> Lưu cài đặt
          </button>
        </div>
      </Modal>

      {/* Language & Region Modal */}
      <Modal isOpen={isLangModalOpen} onClose={() => setIsLangModalOpen(false)} title="Ngôn ngữ & Khu vực">
        <div className="space-y-3">
          <label className="text-[10px] font-normal text-ink-subtle uppercase tracking-widest" style={{ letterSpacing: '0.32px' }}>Chọn ngôn ngữ hiển thị</label>
          <div className="space-y-2">
            {languages.map((lang) => (
              <div
                key={lang.code}
                onClick={() => setSelectedLang(lang.code)}
                className={`flex items-center justify-between p-4 border cursor-pointer transition-all hover:bg-surface-1 ${
                  selectedLang === lang.code
                    ? 'border-primary bg-surface-1'
                    : 'border-hairline'
                }`}
                style={{ borderRadius: 0 }}
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{lang.flag}</span>
                  <div>
                    <div className="text-sm font-normal text-ink" style={{ letterSpacing: '0.16px' }}>{lang.label}</div>
                    <div className="text-[11px] text-ink-subtle" style={{ letterSpacing: '0.16px' }}>{lang.code === 'vi' ? 'Vietnamese' : 'English (US)'}</div>
                  </div>
                </div>
                {selectedLang === lang.code && (
                  <div className="w-6 h-6 bg-primary flex items-center justify-center" style={{ borderRadius: 0 }}>
                    <Check size={14} className="text-white" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
        <div className="flex justify-end gap-3 pt-6 border-t border-hairline mt-6">
          <button onClick={() => setIsLangModalOpen(false)} className="bg-surface-2 hover:bg-surface-3 text-ink text-xs font-normal px-4 py-2" style={{ borderRadius: 0, letterSpacing: '0.16px' }}>Hủy</button>
          <button onClick={handleSaveLang} className="bg-primary hover:bg-primary-hover text-white text-xs font-normal px-4 py-2 flex items-center gap-2" style={{ borderRadius: 0, letterSpacing: '0.16px' }}>
            <Languages size={14} /> Áp dụng
          </button>
        </div>
      </Modal>
    </div>
  );
}
