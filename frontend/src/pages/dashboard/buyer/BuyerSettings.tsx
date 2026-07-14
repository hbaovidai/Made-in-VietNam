import React, { useState, useEffect } from 'react';
import { User, Mail, Phone, Globe, Shield, Bell, CreditCard, ChevronRight, Save, Loader2, Lock, BellRing, BellOff, Check, Languages, Camera } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../../contexts/AuthContext';
import { api } from '../../../lib/api';
import { useToast } from '../../../components/ui/Toast';
import { Modal } from '../../../components/ui/Modal';

export function BuyerSettings() {
  const { t, i18n } = useTranslation();
  const { user, loginUser, token } = useAuth();
  const { addToast } = useToast();

  const nameParts = (user?.fullName || '').split(' ');
  const defaultLastName = nameParts.pop() || '';
  const defaultFirstName = nameParts.join(' ') || '';

  const [firstName, setFirstName] = useState(defaultFirstName);
  const [lastName, setLastName] = useState(defaultLastName);
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState((user as any)?.phone || '');
  const [avatar, setAvatar] = useState((user as any)?.avatar || '');
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  
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
      setAvatar((user as any).avatar || '');
    }
  }, [user]);

  // Fetch latest profile from server to ensure fresh data (avatar, phone, etc.)
  useEffect(() => {
    if (user?.id && token) {
      api.get(`/auth/profile/${user.id}`).then(res => {
        const fresh = res.data;
        if (fresh.avatar) setAvatar(fresh.avatar);
        if (fresh.phone) setPhone(fresh.phone);
        // Also update context so header avatar updates too
        loginUser({ ...user, ...fresh }, token);
      }).catch(() => {});
    }
  }, []);

  const handleSaveProfile = async () => {
    if (!user) return;
    try {
      setIsSavingProfile(true);
      const fullName = `${firstName} ${lastName}`.trim();
      const res = await api.put(`/auth/profile/${user.id}`, { fullName, phone, avatar });
      // Update user in context and localStorage
      const updatedUser = res.data.user || { ...user, fullName, phone, avatar };
      if (token) loginUser(updatedUser, token);
      addToast({ type: 'success', title: t('buyer_success'), message: t('buyer_profile_updated') });
    } catch (error: any) {
      console.error(error);
      addToast({ type: 'error', title: t('buyer_error'), message: error.message || t('buyer_update_error') });
    } finally {
      setIsSavingProfile(false);
    }
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      addToast({ type: 'error', title: t('buyer_error'), message: t('buyer_avatar_size_error') });
      return;
    }

    try {
      setIsUploadingAvatar(true);
      const formData = new FormData();
      formData.append('file', file);
      const res = await api.post('/uploads', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      const avatarUrl = res.data.url;
      setAvatar(avatarUrl);
      addToast({ type: 'success', title: t('buyer_success'), message: t('buyer_avatar_uploaded') });
    } catch (err) {
      console.error(err);
      addToast({ type: 'error', title: t('buyer_error'), message: t('buyer_avatar_error') });
    } finally {
      setIsUploadingAvatar(false);
    }
  };

  const handleChangePassword = async () => {
    if (!user) return;
    if (!oldPassword || !newPassword) {
      addToast({ type: 'error', title: t('buyer_error'), message: t('buyer_pwd_required') });
      return;
    }
    if (newPassword.length < 6) {
      addToast({ type: 'error', title: t('buyer_error'), message: t('buyer_pwd_min_length') });
      return;
    }

    try {
      setIsSavingPassword(true);
      await api.put(`/auth/password/${user.id}`, { oldPassword, newPassword });
      addToast({ type: 'success', title: t('buyer_success'), message: t('buyer_pwd_changed') });
      setOldPassword('');
      setNewPassword('');
    } catch (error: any) {
      console.error(error);
      addToast({ type: 'error', title: t('buyer_error'), message: error.message || t('buyer_pwd_wrong') });
    } finally {
      setIsSavingPassword(false);
    }
  };

  // Notification settings
  const [isNotifModalOpen, setIsNotifModalOpen] = useState(false);
  const [notifSettings, setNotifSettings] = useState(() => {
    const saved = localStorage.getItem('notif_settings_buyer');
    return saved ? JSON.parse(saved) : {
      orderUpdates: true,
      rfqAlerts: true,
      messageAlerts: true,
      promotions: false,
      weeklyReport: false,
    };
  });

  // Language modal
  const [isLangModalOpen, setIsLangModalOpen] = useState(false);
  const [selectedLang, setSelectedLang] = useState(i18n.language || 'vi');

  const handleSaveNotifSettings = () => {
    localStorage.setItem('notif_settings_buyer', JSON.stringify(notifSettings));
    setIsNotifModalOpen(false);
    addToast({ type: 'success', title: t('buyer_success'), message: t('buyer_notif_saved') });
  };

  const handleSaveLang = () => {
    i18n.changeLanguage(selectedLang);
    localStorage.setItem('i18nextLng', selectedLang);
    setIsLangModalOpen(false);
    addToast({ type: 'success', title: 'Thành công', message: selectedLang === 'vi' ? 'Đã chuyển sang Tiếng Việt' : 'Switched to English' });
  };

  const handleSettingClick = (idx: number) => {
    // settingsSections: [Email, Security, Payment, Language]
    switch (idx) {
      case 0: // Email & Thông báo
        setIsNotifModalOpen(true);
        break;
      case 1: // Bảo mật
        window.scrollTo({ top: 0, behavior: 'smooth' });
        break;
      case 2: // Thanh toán
        addToast({ type: 'info', title: t('buyer_coming_soon'), message: t('buyer_payment_coming') });
        break;
      case 3: // Ngôn ngữ
        setIsLangModalOpen(true);
        break;
    }
  };

  const notifOptions = [
    { key: 'orderUpdates', icon: <Bell size={16} className="text-blue-500" />, label: t('buyer_notif_order'), desc: t('buyer_notif_order_desc') },
    { key: 'rfqAlerts', icon: <BellRing size={16} className="text-amber-500" />, label: t('buyer_notif_rfq'), desc: t('buyer_notif_rfq_desc') },
    { key: 'messageAlerts', icon: <Mail size={16} className="text-emerald-500" />, label: t('buyer_notif_msg'), desc: t('buyer_notif_msg_desc') },
    { key: 'promotions', icon: <BellOff size={16} className="text-slate-400" />, label: t('buyer_notif_promo'), desc: t('buyer_notif_promo_desc') },
    { key: 'weeklyReport', icon: <Mail size={16} className="text-purple-500" />, label: t('buyer_notif_weekly'), desc: t('buyer_notif_weekly_desc') },
  ];

  const languages = [
    { code: 'vi', label: 'Tiếng Việt', flag: '🇻🇳' },
    { code: 'en', label: 'English', flag: '🇺🇸' },
  ];

  const settingsSections = [
    { icon: <User size={20} className="text-ink-muted" />, title: t('setting_personal_info'), desc: t('setting_personal_info_desc') },
    { icon: <Mail size={20} className="text-ink-muted" />, title: t('setting_email_notif'), desc: t('setting_email_notif_desc') },
    { icon: <Shield size={20} className="text-ink-muted" />, title: t('setting_security'), desc: t('setting_security_desc') },
    { icon: <CreditCard size={20} className="text-ink-muted" />, title: t('setting_payment'), desc: t('setting_payment_desc') },
    { icon: <Globe size={20} className="text-ink-muted" />, title: t('setting_lang_region'), desc: t('setting_lang_region_desc') },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-normal text-ink uppercase" style={{ letterSpacing: '0.32px' }}>{t('account_settings_title')}</h1>
        <p className="text-sm text-ink-muted mt-1" style={{ letterSpacing: '0.16px' }}>{t('account_settings_subtitle')}</p>
      </div>
      <div className="bg-canvas border border-hairline p-8 space-y-12" style={{ borderRadius: 0 }}>
        {/* Profile Form */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div className="space-y-6">
            <h3 className="text-lg font-normal text-ink uppercase tracking-tight flex items-center gap-2" style={{ letterSpacing: '0.32px' }}>
              <User size={20} className="text-primary" /> {t('profile_details')}
            </h3>

            {/* Avatar Upload */}
            <div className="flex items-center gap-6">
              <div className="relative group">
                <div className="w-20 h-20 bg-surface-1 border border-hairline overflow-hidden flex items-center justify-center" style={{ borderRadius: 0 }}>
                  {avatar ? (
                    <img src={avatar.startsWith('http') ? avatar : `${(import.meta.env.VITE_API_URL || 'http://localhost:3001/api/v1').replace('/api/v1', '')}${avatar}`} alt="Avatar" className="w-full h-full object-cover" style={{ borderRadius: 0 }} />
                  ) : (
                    <span className="text-2xl font-light text-ink-subtle">{(firstName?.[0] || '') + (lastName?.[0] || '')}</span>
                  )}
                </div>
                <label className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center cursor-pointer transition-opacity" style={{ borderRadius: 0 }}>
                  {isUploadingAvatar ? <Loader2 size={20} className="text-white animate-spin" /> : <Camera size={20} className="text-white" />}
                  <input type="file" accept="image/*" onChange={handleAvatarUpload} className="hidden" disabled={isUploadingAvatar} />
                </label>
              </div>
              <div>
                <div className="text-sm font-normal text-ink" style={{ letterSpacing: '0.16px' }}>{t('buyer_avatar_label')}</div>
                <div className="text-[11px] text-ink-subtle mt-0.5" style={{ letterSpacing: '0.16px' }}>{t('buyer_avatar_desc')}</div>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-[10px] font-normal text-ink-subtle uppercase tracking-widest" style={{ letterSpacing: '0.32px' }}>{t('first_name')}</label>
                <input type="text" value={firstName} onChange={e => setFirstName(e.target.value)} className="w-full px-4 py-3 bg-surface-1 border border-hairline text-sm outline-none focus:border-b-2 focus:border-b-primary placeholder:text-ink-subtle" style={{ borderRadius: 0, letterSpacing: '0.16px' }} />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-normal text-ink-subtle uppercase tracking-widest" style={{ letterSpacing: '0.32px' }}>{t('last_name')}</label>
                <input type="text" value={lastName} onChange={e => setLastName(e.target.value)} className="w-full px-4 py-3 bg-surface-1 border border-hairline text-sm outline-none focus:border-b-2 focus:border-b-primary placeholder:text-ink-subtle" style={{ borderRadius: 0, letterSpacing: '0.16px' }} />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-normal text-ink-subtle uppercase tracking-widest" style={{ letterSpacing: '0.32px' }}>{t('email_address')}</label>
              <input type="email" value={email} disabled className="w-full px-4 py-3 bg-surface-2 border border-hairline text-sm outline-none text-ink-subtle cursor-not-allowed" style={{ borderRadius: 0, letterSpacing: '0.16px' }} />
              <div className="text-[10px] text-ink-subtle" style={{ letterSpacing: '0.16px' }}>{t('buyer_email_readonly')}</div>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-normal text-ink-subtle uppercase tracking-widest" style={{ letterSpacing: '0.32px' }}>{t('phone_number')}</label>
              <input type="tel" value={phone} onChange={e => setPhone(e.target.value)} placeholder="+84 123 456 789" className="w-full px-4 py-3 bg-surface-1 border border-hairline text-sm outline-none focus:border-b-2 focus:border-b-primary placeholder:text-ink-subtle" style={{ borderRadius: 0, letterSpacing: '0.16px' }} />
            </div>
            <button 
              onClick={handleSaveProfile}
              disabled={isSavingProfile}
              className="bg-primary text-white px-6 py-3 font-normal hover:bg-primary-hover transition-colors uppercase tracking-widest text-xs w-full disabled:opacity-50 flex justify-center items-center gap-2 mt-2"
              style={{ borderRadius: 0, letterSpacing: '0.16px' }}
            >
              {isSavingProfile ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
              {t('save_profile', 'Lưu thông tin')}
            </button>
          </div>

          <div className="space-y-6">
            <h3 className="text-lg font-normal text-ink uppercase tracking-tight flex items-center gap-2" style={{ letterSpacing: '0.32px' }}>
              <Lock size={20} className="text-primary" /> {t('change_password')}
            </h3>
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-[10px] font-normal text-ink-subtle uppercase tracking-widest" style={{ letterSpacing: '0.32px' }}>{t('current_password')}</label>
                <input 
                  type="password" 
                  value={oldPassword} 
                  onChange={e => setOldPassword(e.target.value)} 
                  className="w-full px-4 py-3 bg-surface-1 border border-hairline text-sm outline-none focus:border-b-2 focus:border-b-primary placeholder:text-ink-subtle" 
                  style={{ borderRadius: 0, letterSpacing: '0.16px' }}
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-normal text-ink-subtle uppercase tracking-widest" style={{ letterSpacing: '0.32px' }}>{t('new_password')}</label>
                <input 
                  type="password" 
                  value={newPassword} 
                  onChange={e => setNewPassword(e.target.value)} 
                  className="w-full px-4 py-3 bg-surface-1 border border-hairline text-sm outline-none focus:border-b-2 focus:border-b-primary placeholder:text-ink-subtle" 
                  style={{ borderRadius: 0, letterSpacing: '0.16px' }}
                />
              </div>
              <button 
                onClick={handleChangePassword}
                disabled={isSavingPassword || !oldPassword || !newPassword}
                className="bg-primary text-white px-6 py-3 font-normal hover:bg-primary-hover transition-colors uppercase tracking-widest text-xs w-full disabled:opacity-50 flex justify-center items-center gap-2"
                style={{ borderRadius: 0, letterSpacing: '0.16px' }}
              >
                {isSavingPassword && <Loader2 size={14} className="animate-spin" />}
                {t('update_password_btn')}
              </button>
            </div>
          </div>
        </div>

        {/* Other Settings List */}
        <div className="pt-12 border-t border-hairline space-y-4">
          <h3 className="text-lg font-normal text-ink uppercase tracking-tight mb-6" style={{ letterSpacing: '0.32px' }}>{t('other_settings')}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {settingsSections.slice(1).map((section, idx) => (
              <div
                key={idx}
                onClick={() => handleSettingClick(idx)}
                className="p-6 border border-hairline hover:bg-surface-1 hover:border-primary transition-all flex items-center justify-between group cursor-pointer"
                style={{ borderRadius: 0 }}
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-surface-1 border border-hairline flex items-center justify-center group-hover:scale-105 transition-transform" style={{ borderRadius: 0 }}>
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

      {/* Email & Notification Modal */}
      <Modal isOpen={isNotifModalOpen} onClose={() => setIsNotifModalOpen(false)} title={t('setting_email_notif')}>
        <div className="space-y-1">
          {notifOptions.map((opt) => (
            <div key={opt.key} className="flex items-center justify-between p-4 hover:bg-surface-1 transition-colors border-b border-hairline">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-surface-2 border border-hairline flex items-center justify-center" style={{ borderRadius: 0 }}>{opt.icon}</div>
                <div>
                  <div className="text-sm font-normal text-ink" style={{ letterSpacing: '0.16px' }}>{opt.label}</div>
                  <div className="text-[11px] text-ink-muted mt-0.5" style={{ letterSpacing: '0.16px' }}>{opt.desc}</div>
                </div>
              </div>
              <button
                onClick={() => setNotifSettings({ ...notifSettings, [opt.key]: !notifSettings[opt.key as keyof typeof notifSettings] })}
                className={`relative inline-flex h-6 w-11 items-center transition-colors focus:outline-none shrink-0 ${
                  notifSettings[opt.key as keyof typeof notifSettings] ? 'bg-emerald-500' : 'bg-surface-3'
                }`}
                style={{ borderRadius: 0 }}
              >
                <span
                  className={`inline-block h-4 w-4 bg-white transition-transform ${
                    notifSettings[opt.key as keyof typeof notifSettings] ? 'translate-x-6' : 'translate-x-0.5'
                  }`}
                  style={{ borderRadius: 0 }}
                />
              </button>
            </div>
          ))}
        </div>
        <div className="flex justify-end gap-3 pt-6 border-t border-hairline mt-4">
          <button onClick={() => setIsNotifModalOpen(false)} className="btn-ghost" style={{ borderRadius: 0 }}>{t('buyer_notif_cancel')}</button>
          <button onClick={handleSaveNotifSettings} className="btn-primary flex items-center gap-2" style={{ borderRadius: 0 }}><Check size={14} /> {t('buyer_notif_save')}</button>
        </div>
      </Modal>

      {/* Language Modal */}
      <Modal isOpen={isLangModalOpen} onClose={() => setIsLangModalOpen(false)} title={t('setting_lang_region')}>
        <div className="space-y-3">
          <label className="text-[10px] font-normal text-ink-subtle uppercase tracking-widest" style={{ letterSpacing: '0.32px' }}>{t('buyer_lang_label')}</label>
          <div className="space-y-2">
            {languages.map((lang) => (
              <div
                key={lang.code}
                onClick={() => setSelectedLang(lang.code)}
                className={`flex items-center justify-between p-4 border cursor-pointer transition-all ${selectedLang === lang.code ? 'border-primary bg-surface-2' : 'border-hairline hover:bg-surface-1'}`}
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
                  <div className="w-6 h-6 bg-primary flex items-center justify-center" style={{ borderRadius: 0 }}><Check size={14} className="text-white" /></div>
                )}
              </div>
            ))}
          </div>
        </div>
        <div className="flex justify-end gap-3 pt-6 border-t border-hairline mt-6">
          <button onClick={() => setIsLangModalOpen(false)} className="btn-ghost" style={{ borderRadius: 0 }}>{t('buyer_lang_cancel')}</button>
          <button onClick={handleSaveLang} className="btn-primary flex items-center gap-2" style={{ borderRadius: 0 }}><Languages size={14} /> {t('buyer_lang_apply')}</button>
        </div>
      </Modal>
    </div>
  );
}
