import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Globe, Bell, User, ChevronDown } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { cn } from '../utils/cn';
import { useAuth } from '../contexts/AuthContext';
import { useAppearance } from '../contexts/AppearanceContext';
import { api } from '../lib/api';

export function SearchHeader() {
  const { user, isAuthenticated, logout } = useAuth();
  const { settings: siteSettings } = useAppearance();
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();

  const [isLangDropdownOpen, setIsLangDropdownOpen] = React.useState(false);
  const [isNotifOpen, setIsNotifOpen] = React.useState(false);
  const [notifications, setNotifications] = React.useState<any[]>([]);
  const [unreadCount, setUnreadCount] = React.useState(0);

  // Hide the global header when this component mounts, restore on unmount
  React.useEffect(() => {
    // The global header is the first <header> rendered by MainLayout
    const globalHeader = document.querySelector('header.sticky');
    if (globalHeader) {
      (globalHeader as HTMLElement).style.display = 'none';
    }
    return () => {
      if (globalHeader) {
        (globalHeader as HTMLElement).style.display = '';
      }
    };
  }, []);

  // Fetch unread notification count
  React.useEffect(() => {
    if (isAuthenticated && user?.id) {
      api.get('/notifications/unread-count')
        .then(res => setUnreadCount(res.data?.count || 0))
        .catch(() => {});
    }
  }, [isAuthenticated, user?.id]);

  const loadNotifications = async () => {
    if (!user?.id) return;
    try {
      const res = await api.get('/notifications');
      setNotifications(res.data || []);
    } catch (e) {}
  };

  const toggleNotifDropdown = async () => {
    if (!isNotifOpen) {
      await loadNotifications();
    }
    setIsNotifOpen(!isNotifOpen);
  };

  const markAllRead = async () => {
    if (!user?.id) return;
    try {
      await api.patch('/notifications/read-all');
      setUnreadCount(0);
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
    } catch (e) {}
  };

  const markOneReadAndNavigate = async (notif: any) => {
    if (!notif.isRead) {
      try {
        await api.patch(`/notifications/${notif.id}/read`);
        setUnreadCount(prev => Math.max(0, prev - 1));
        setNotifications(prev => prev.map(n => n.id === notif.id ? { ...n, isRead: true } : n));
      } catch (e) {}
    }
    if (notif.link) {
      navigate(notif.link);
      setIsNotifOpen(false);
    }
  };

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
    setIsLangDropdownOpen(false);
  };

  // Close dropdowns when clicking outside
  React.useEffect(() => {
    const handleClickOutside = () => {
      setIsLangDropdownOpen(false);
      setIsNotifOpen(false);
    };
    window.addEventListener('click', handleClickOutside);
    return () => window.removeEventListener('click', handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-50 w-full bg-white border-b border-slate-200 shadow-sm">
      <div className="max-w-[1600px] mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-[72px]">

          {/* ═══ LEFT: Logo + Brand ═══ */}
          <Link to="/" className="flex items-center gap-2 shrink-0">
            {siteSettings.site_logo ? (
              <img src={siteSettings.site_logo} alt="Logo" style={{ maxHeight: 40, maxWidth: 160 }} />
            ) : (
              <div className="flex flex-col">
                <div className="flex items-center">
                  <span className="text-lg sm:text-2xl font-black text-primary tracking-tighter">VIE</span>
                  <span className="text-lg sm:text-2xl font-black text-slate-900 tracking-tighter">product</span>
                </div>
                <span className="text-[8px] sm:text-[9px] font-bold text-slate-400 uppercase tracking-[0.2em]">
                  {siteSettings.site_slogan || siteSettings.site_slogan_vi || t('b2b_global_trade')}
                </span>
              </div>
            )}
          </Link>

          {/* ═══ CENTER: Navigation Menu ═══ */}
          <nav className="hidden md:flex items-center gap-8">
            <Link
              to="/suppliers"
              className="relative text-sm font-semibold text-slate-700 hover:text-primary transition-colors whitespace-nowrap py-1 after:content-[''] after:absolute after:left-0 after:bottom-0 after:w-0 after:h-[2px] after:bg-primary after:transition-all after:duration-300 hover:after:w-full"
            >
              {t('supplier_list', 'Danh sách Nhà cung cấp')}
            </Link>
            <Link
              to="/products"
              className="relative text-sm font-semibold text-slate-700 hover:text-primary transition-colors whitespace-nowrap py-1 after:content-[''] after:absolute after:left-0 after:bottom-0 after:w-0 after:h-[2px] after:bg-primary after:transition-all after:duration-300 hover:after:w-full"
            >
              {t('category_list', 'Danh mục ngành hàng')}
            </Link>
            <Link
              to="/blog"
              className="relative text-sm font-semibold text-slate-700 hover:text-primary transition-colors whitespace-nowrap py-1 after:content-[''] after:absolute after:left-0 after:bottom-0 after:w-0 after:h-[2px] after:bg-primary after:transition-all after:duration-300 hover:after:w-full"
            >
              VIE Share
            </Link>
          </nav>

          {/* ═══ RIGHT: Icon Actions ═══ */}
          <div className="flex items-center gap-1 shrink-0">

            {/* Language Switcher */}
            <div className="relative" onClick={(e) => e.stopPropagation()}>
              <button
                onClick={() => setIsLangDropdownOpen(!isLangDropdownOpen)}
                className="p-2 text-slate-600 hover:text-primary hover:bg-slate-50 rounded-full transition-colors flex items-center gap-1"
              >
                <Globe size={20} />
                <span className="text-sm font-bold uppercase hidden sm:inline">{i18n.language?.startsWith('vi') ? 'VI' : 'EN'}</span>
              </button>
              {isLangDropdownOpen && (
                <div className="absolute top-full right-0 mt-2 w-40 bg-white border border-slate-100 shadow-xl rounded-xl overflow-hidden py-2 z-[100]">
                  <button onClick={() => changeLanguage('vi')} className={cn("w-full text-left px-4 py-2 text-sm hover:bg-slate-50 transition-colors flex items-center gap-2", i18n.language?.startsWith('vi') ? "text-primary font-bold bg-blue-50/50" : "text-slate-700")}>{t('tieng_viet')}</button>
                  <button onClick={() => changeLanguage('en')} className={cn("w-full text-left px-4 py-2 text-sm hover:bg-slate-50 transition-colors flex items-center gap-2", i18n.language?.startsWith('en') ? "text-primary font-bold bg-blue-50/50" : "text-slate-700")}>🇬🇧 English</button>
                </div>
              )}
            </div>

            {/* Notification Bell */}
            <div className="relative" onClick={(e) => e.stopPropagation()}>
              <button
                onClick={toggleNotifDropdown}
                className="p-2 text-slate-600 hover:text-primary hover:bg-slate-50 rounded-full transition-colors relative"
                title={t('notifications')}
              >
                <Bell size={20} />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold min-w-[16px] h-4 rounded-full flex items-center justify-center ring-2 ring-white px-1">
                    {unreadCount > 99 ? '99+' : unreadCount}
                  </span>
                )}
              </button>
              {isNotifOpen && (
                <div className="absolute top-full right-0 mt-2 w-80 bg-white border border-slate-100 shadow-xl rounded-xl overflow-hidden z-[100]">
                  <div className="p-4 border-b border-slate-100 flex items-center justify-between">
                    <h4 className="font-bold text-sm text-slate-900">{t('notifications')}</h4>
                    {unreadCount > 0 && (
                      <button onClick={markAllRead} className="text-xs text-primary font-bold hover:underline">{t('mark_all_read')}</button>
                    )}
                  </div>
                  <div className="max-h-72 overflow-y-auto">
                    {notifications.length === 0 ? (
                      <div className="p-8 text-center text-sm text-slate-400">{t('no_notifications')}</div>
                    ) : notifications.slice(0, 10).map((notif: any) => (
                      <div key={notif.id} onClick={() => markOneReadAndNavigate(notif)} className={cn("p-4 border-b border-slate-50 hover:bg-slate-50 transition-colors cursor-pointer", !notif.isRead && "bg-blue-50/50")}>
                        <div className="text-sm font-bold text-slate-900">{notif.title}</div>
                        <div className="text-xs text-slate-500 mt-1 line-clamp-2">{notif.message}</div>
                        <div className="text-[10px] text-slate-400 mt-2">{new Date(notif.createdAt).toLocaleDateString()}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Account */}
            {isAuthenticated && user ? (
              <div className="flex items-center gap-2 group relative cursor-pointer">
                <Link to={`/dashboard/${user.role.toLowerCase()}`} className="p-2 text-slate-600 hover:text-primary hover:bg-slate-50 rounded-full transition-colors">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary overflow-hidden">
                    {user.avatar ? <img src={user.avatar} alt="avatar" className="w-full h-full object-cover" /> : <User size={18} />}
                  </div>
                </Link>
                <div className="absolute top-full right-0 pt-2 hidden group-hover:block z-[100]">
                  <div className="w-48 bg-white border border-slate-100 shadow-xl rounded-xl overflow-hidden py-2">
                    <Link to={`/dashboard/${user.role.toLowerCase()}`} className="w-full text-left px-4 py-2 text-sm hover:bg-slate-50 transition-colors block text-slate-700 font-medium">{t('dashboard_link')}</Link>
                    <button onClick={logout} className="w-full text-left px-4 py-2 text-sm hover:bg-red-50 text-red-600 transition-colors font-medium">{t('logout')}</button>
                  </div>
                </div>
              </div>
            ) : (
              <Link to="/login" className="p-2 text-slate-600 hover:text-primary hover:bg-slate-50 rounded-full transition-colors">
                <User size={20} />
              </Link>
            )}

          </div>
        </div>
      </div>
    </header>
  );
}
