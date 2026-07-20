import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Search, ShoppingBag, User, Menu, Globe, ChevronDown, MessageSquare, ClipboardList, ShoppingCart, Smartphone, HelpCircle, ShieldCheck, X, ChevronRight, Home, Package, FileText, BarChart3, Shield, Bell } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { cn } from '../utils/cn';
import { NavDropdown } from './NavDropdown';
import { MegaMenu } from './MegaMenu';
import { CategoryMegaMenu } from './categories/CategoryMegaMenu';
import { useAuth } from '../contexts/AuthContext';
import { useAppearance } from '../contexts/AppearanceContext';
import { api } from '../lib/api';
export function Header() {
  const { user, isAuthenticated, logout } = useAuth();
  const { settings: siteSettings } = useAppearance();
  const { t, i18n } = useTranslation();
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const [isCategoriesOpen, setIsCategoriesOpen] = React.useState(false);
  const [searchType, setSearchType] = React.useState('products');
  const [isSearchDropdownOpen, setIsSearchDropdownOpen] = React.useState(false);
  const [isLangDropdownOpen, setIsLangDropdownOpen] = React.useState(false);
  const [isMobileSearchOpen, setIsMobileSearchOpen] = React.useState(false);
  const [isNotifOpen, setIsNotifOpen] = React.useState(false);
  const [notifications, setNotifications] = React.useState<any[]>([]);
  const [unreadCount, setUnreadCount] = React.useState(0);
  const [cartCount, setCartCount] = React.useState(0);
  const [isSubnavVisible, setIsSubnavVisible] = React.useState(true);
  const lastScrollY = React.useRef(0);
  const location = useLocation();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = React.useState('');

  const handleSearch = (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    const query = searchQuery.trim();
    if (searchType === 'suppliers') {
      if (query) {
        navigate(`/suppliers?search=${encodeURIComponent(query)}`);
      } else {
        navigate(`/suppliers`);
      }
    } else {
      if (query) {
        navigate(`/search?search=${encodeURIComponent(query)}`);
      } else {
        navigate(`/search`);
      }
    }
    setIsMobileSearchOpen(false);
  };

  // Fetch notification unread count + inquiry basket count
  React.useEffect(() => {
    if (isAuthenticated && user?.id) {
      api.get(`/notifications/unread-count`)
        .then(res => setUnreadCount(res.data?.count || 0))
        .catch(() => { });
      api.get(`/cart`)
        .then(res => setCartCount(res.data?.items?.length || 0))
        .catch(() => { });
    }
  }, [isAuthenticated, user?.id, location.pathname]);

  const loadNotifications = async () => {
    if (!user?.id) return;
    try {
      const res = await api.get(`/notifications`);
      setNotifications(res.data || []);
    } catch (e) { }
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
      await api.patch(`/notifications/read-all`);
      setUnreadCount(0);
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
    } catch (e) { }
  };

  const markOneReadAndNavigate = async (notif: any) => {
    if (!notif.isRead) {
      try {
        await api.patch(`/notifications/${notif.id}/read`);
        setUnreadCount(prev => Math.max(0, prev - 1));
        setNotifications(prev => prev.map(n => n.id === notif.id ? { ...n, isRead: true } : n));
      } catch (e) { }
    }
    if (notif.link) {
      navigate(notif.link);
      setIsNotifOpen(false);
    }
  };

  // Close mobile menu on route change
  React.useEffect(() => {
    setIsMenuOpen(false);
    setIsMobileSearchOpen(false);
  }, [location.pathname]);

  // Detect scroll direction to hide/show subnav
  const isTransitioning = React.useRef(false);

  React.useEffect(() => {
    const SCROLL_THRESHOLD = 15;
    let timeoutId: any;

    const handleScroll = () => {
      if (isTransitioning.current) return;

      const currentY = window.scrollY;
      const diff = currentY - lastScrollY.current;

      if (Math.abs(diff) < SCROLL_THRESHOLD) return;

      if (diff > 0 && currentY > 120) {
        // Scrolling DOWN past 120px
        setIsSubnavVisible((visible) => {
          if (visible) {
            document.documentElement.style.setProperty('--subnav-h', '0px');
            isTransitioning.current = true;
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => {
              isTransitioning.current = false;
            }, 350);
            return false;
          }
          return visible;
        });
      } else if (diff < 0) {
        // Scrolling UP
        setIsSubnavVisible((visible) => {
          if (!visible) {
            document.documentElement.style.setProperty('--subnav-h', '40px');
            isTransitioning.current = true;
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => {
              isTransitioning.current = false;
            }, 350);
            return true;
          }
          return visible;
        });
      }
      lastScrollY.current = currentY;
    };

    document.documentElement.style.setProperty('--subnav-h', '40px');
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearTimeout(timeoutId);
    };
  }, []);

  // Lock body scroll when mobile menu is open
  React.useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isMenuOpen]);

  const searchOptions = ['products', 'suppliers'];

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
    setIsLangDropdownOpen(false);
  };

  const supplierMenuSections = [
    {
      title: t('supplier_services'),
      links: [
        { label: t('supplier_directory'), href: "/suppliers" },
        // { label: t('verified_suppliers'), href: "/suppliers?verified=true" },
        // { label: t('audited_factories'), href: "/suppliers?audited=true" },
      ]
    },
    {
      title: t('business_tools'),
      links: [
        { label: t('product_management'), href: "/dashboard/supplier/products" },
        { label: t('rfq_center'), href: "/dashboard/supplier/rfqs" },
        { label: t('inquiry_management'), href: "/dashboard/supplier/inquiries" },
        { label: t('analytics_dashboard'), href: "/dashboard/supplier/analytics" },
      ]
    },
    {
      title: t('resources'),
      links: [
        { label: t('seller_guide'), href: "/help/seller-guide" },
      ]
    }
  ];



  // Close dropdown when clicking outside
  React.useEffect(() => {
    const handleClickOutside = () => {
      setIsSearchDropdownOpen(false);
      setIsLangDropdownOpen(false);
      setIsNotifOpen(false);
    };
    if (isSearchDropdownOpen || isLangDropdownOpen || isNotifOpen) {
      window.addEventListener('click', handleClickOutside);
    }
    return () => window.removeEventListener('click', handleClickOutside);
  }, [isSearchDropdownOpen, isLangDropdownOpen, isNotifOpen]);

  /* ═══════════════════════════════════════════ */
  /* Mobile menu link groups                     */
  /* ═══════════════════════════════════════════ */
  const mobileMenuGroups = [
    {
      title: t('marketplace'),
      links: [
        { icon: <Menu size={18} />, label: t('all_categories'), href: "/products" },
        { icon: <User size={18} />, label: t('supplier_directory'), href: "/suppliers" },
        { icon: <FileText size={18} />, label: 'VIE Share', href: "/blog" },
      ]
    },
    {
      title: t('service'),
      links: [
        { icon: <ClipboardList size={18} />, label: t('post_rfQ'), href: "/rfq" },
        // { icon: <ShieldCheck size={18} />, label: t('verify_qr_short', 'Xác nhận hàng giả'), href: "/verify" },
        // { icon: <Shield size={18} />, label: t('trade_assurance'), href: "/services/trade-assurance" },
        { icon: <MessageSquare size={18} />, label: t('contact'), href: user?.role === 'SUPPLIER' ? "/dashboard/supplier/messages" : "/dashboard/buyer/messages" },
      ]
    },
    {
      title: t('support_info'),
      links: [
        { icon: <HelpCircle size={18} />, label: t('help_center'), href: "/help" },
        { icon: <FileText size={18} />, label: t('about_us'), href: "/about" },
        // { icon: <Smartphone size={18} />, label: t('apps'), href: "/apps" },
      ]
    },
  ];

  return (
    <header className="sticky top-0 z-50 w-full shadow-sm" style={{
      backgroundColor: 'var(--color-header-bg, #fff)',
      color: 'var(--color-header-text, #1E293B)',
      ...(siteSettings.header_banner_image ? {
        backgroundImage: `url(${siteSettings.header_banner_image})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      } : {}),
    }}>
      {/* ═══ Main Header ═══ */}
      <div className="max-w-[1600px] mx-auto px-3 sm:px-6 lg:px-8 py-3 sm:py-4">
        <div className="flex justify-between items-center gap-3 sm:gap-8">
          {/* Logo */}
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

          {/* ═══ Desktop Search Bar ═══ */}
          <div className="hidden md:flex flex-1 max-w-2xl lg:max-w-3xl ml-4">
            <form onSubmit={handleSearch} className="flex items-center w-full h-11 rounded-full border-2 border-primary bg-[#f8fafc] overflow-hidden transition-all focus-within:bg-white focus-within:shadow-sm">
              <button type="submit" className="shrink-0 pl-4 pr-2 h-full flex items-center bg-transparent border-none outline-none cursor-pointer">
                <Search size={18} className="text-slate-400" strokeWidth={2} />
              </button>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 h-full text-sm outline-none w-full min-w-0 bg-transparent text-slate-700 placeholder-slate-400 font-medium border-0 m-0 p-0 px-2"
                placeholder={t('search_products_suppliers', 'Tìm kiếm sản phẩm, nhà cung cấp...')}
              />
              <button
                type="submit"
                className="shrink-0 h-[calc(100%-6px)] mr-[3px] px-5 rounded-full text-sm font-bold text-white transition-colors"
                style={{ background: '#1e293b' }}
                onMouseOver={(e) => (e.currentTarget.style.background = '#334155')}
                onMouseOut={(e) => (e.currentTarget.style.background = '#1e293b')}
              >
                {t('search_btn', 'Tìm kiếm')}
              </button>
            </form>
          </div>

          <div className="hidden lg:flex items-center gap-4 shrink-0">

            {/*
                <Link to="/verify" className="p-2 text-primary hover:text-red-700 hover:bg-slate-50 rounded-full transition-colors relative group" title={t('verify_qr_short', 'Xác nhận Hàng giả')}>
                <ShieldCheck size={20} className="group-hover:scale-110 transition-transform" />
                </Link>
            */}

            <div className="flex items-center gap-1">
              <Link to="/rfq" className="p-2 text-slate-700 hover:text-primary hover:bg-slate-100 rounded-full transition-colors relative" title={t('post_rfQ')}>
                <ClipboardList size={20} />
              </Link>
              <Link to={user?.role === 'SUPPLIER' ? "/dashboard/supplier/messages" : "/dashboard/buyer/messages"} className="p-2 text-slate-700 hover:text-primary hover:bg-slate-100 rounded-full transition-colors relative" title={t('contact')}>
                <MessageSquare size={20} />
              </Link>

              {/* Notification Bell */}
              <div className="relative">
                <button
                  onClick={(e) => { e.stopPropagation(); toggleNotifDropdown(); }}
                  className="p-2 text-slate-700 hover:text-primary hover:bg-slate-100 rounded-full transition-colors relative"
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
                  <div className="absolute top-full right-0 mt-2 w-80 bg-white border border-slate-100 shadow-xl rounded-xl overflow-hidden z-[100]" onClick={(e) => e.stopPropagation()}>
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


            </div>

            <div className="h-6 w-px bg-slate-200 mx-2" />

            {isAuthenticated && user ? (
              <div className="flex items-center gap-3 group relative cursor-pointer">
                <Link to={`/dashboard/${user.role.toLowerCase()}`} className="flex items-center gap-3">
                  <div className="flex items-center justify-center w-9 h-9 rounded-full bg-primary/10 text-primary transition-colors overflow-hidden">
                    {user.avatar ? <img src={user.avatar} alt="avatar" className="w-full h-full object-cover" /> : <User size={18} />}
                  </div>
                  <div className="flex flex-col items-start justify-center">
                    <span className="text-xs font-bold text-slate-700 max-w-[100px] truncate">{user.fullName}</span>
                    <span className="text-[10px] text-primary font-medium">
                      {user.role === 'ADMIN' ? 'Quản trị viên' : (user.role === 'BUYER' ? t('buyer') : t('supplier'))}
                    </span>
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
              <div className="flex items-center gap-2 group relative">
                <div className="flex items-center justify-center w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 hover:text-slate-900 transition-colors">
                  <User size={18} />
                </div>
                <div className="flex items-center justify-center text-sm font-bold">
                  <Link to="/login" className="text-slate-600 hover:text-primary whitespace-nowrap transition-colors">
                    {t('sign_in')}
                  </Link>
                  <span className="mx-2 text-slate-300">/</span>
                  <Link to="/register" className="text-primary hover:text-primary-dark whitespace-nowrap transition-colors">
                    {t('register')}
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* ═══ Mobile Action Buttons ═══ */}
          <div className="lg:hidden flex items-center gap-1">
            {/* Search icon — opens mobile search */}
            <button
              onClick={() => setIsMobileSearchOpen(!isMobileSearchOpen)}
              className="p-2 text-slate-700 hover:text-primary hover:bg-slate-100 rounded-full transition-colors md:hidden"
            >
              <Search size={22} />
            </button>
            {/* Notification bell — mobile */}
            <button
              onClick={(e) => { e.stopPropagation(); toggleNotifDropdown(); }}
              className="p-2 text-slate-700 hover:text-primary hover:bg-slate-100 rounded-full transition-colors relative"
              title={t('notifications')}
            >
              <Bell size={22} />
              {unreadCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-red-500 text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {unreadCount > 99 ? '99+' : unreadCount}
                </span>
              )}
            </button>
            {/* Menu toggle */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 text-slate-700 hover:text-primary hover:bg-slate-100 rounded-full transition-colors"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* ═══ Mobile Search Bar (expandable) ═══ */}
      {isMobileSearchOpen && (
        <div className="md:hidden border-t border-slate-100 px-3 py-3 bg-white">
          <form onSubmit={handleSearch} className="flex items-center h-11 rounded-full border border-slate-200 bg-[#f8fafc] overflow-hidden focus-within:border-slate-300 focus-within:bg-white focus-within:shadow-sm">
            <button type="submit" className="shrink-0 pl-4 pr-2 h-full flex items-center bg-transparent border-none outline-none">
              <Search size={18} className="text-slate-400" strokeWidth={2} />
            </button>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 px-2 bg-transparent h-full text-sm outline-none w-full min-w-0 text-slate-700 placeholder-slate-400 font-medium border-0 m-0"
              placeholder={t('search_products_suppliers', 'Tìm kiếm sản phẩm, nhà cung cấp...')}
              autoFocus
            />
            <button
              type="submit"
              className="shrink-0 h-[calc(100%-6px)] mr-[3px] px-4 rounded-full text-xs font-bold text-white"
              style={{ background: '#1e293b' }}
            >
              {t('search_btn', 'Tìm kiếm')}
            </button>
          </form>
        </div>
      )}

      {/* ═══ Desktop Sub Navigation Bar ═══ */}
      <div
        className="border-t border-slate-200 bg-white hidden md:block transition-all duration-300 ease-in-out"
        style={{
          maxHeight: isSubnavVisible ? 44 : 0,
          overflow: isSubnavVisible ? 'visible' : 'hidden',
          borderBottom: isSubnavVisible ? '1px solid #e2e8f0' : 'none',
        }}
      >
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center h-10">
          <div className="flex items-center h-full">
            <div
              className="relative h-full"
              onMouseEnter={() => setIsCategoriesOpen(true)}
              onMouseLeave={() => setIsCategoriesOpen(false)}
            >
              <Link to="/products" className="flex items-center gap-2 text-slate-700 hover:text-primary px-4 h-full font-bold text-sm transition-colors">
                <Menu size={16} />
                {t('all_categories')}
              </Link>

              {isCategoriesOpen && (
                <div className="absolute top-full left-0 z-[100] max-w-[calc(100vw-2rem)]">
                  <CategoryMegaMenu />
                </div>
              )}
            </div>
            <nav className="flex items-center gap-0 h-full">
              <Link
                to="/suppliers"
                className={cn(
                  "text-sm font-bold transition-colors h-full flex items-center px-5 border-b-2 outline-none",
                  location.pathname.startsWith('/suppliers') ? "text-primary border-primary" : "text-slate-700 border-transparent hover:text-primary"
                )}
              >
                {t('supplier_directory')}
              </Link>
              <Link
                to="/blog"
                className={cn(
                  "text-sm font-bold transition-colors h-full flex items-center px-5 border-b-2 outline-none",
                  location.pathname.startsWith('/blog') ? "text-primary border-primary" : "text-slate-700 border-transparent hover:text-primary"
                )}
              >
                VIE Share
              </Link>
            </nav>
          </div>
          <div className="flex items-center h-full gap-6">
            <div className="flex items-center h-full gap-5 text-xs font-medium text-slate-500">
              {user?.role == 'SUPPLIER' && (
                <NavDropdown label={t('supplier')} to="/suppliers" className="h-full" panelClassName="left-auto right-0" arrowClassName="left-auto right-6">
                  <MegaMenu sections={supplierMenuSections} columns={2} className="w-[480px]" />
                </NavDropdown>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ═══ Mobile Full-Screen Menu Overlay ═══ */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-[60] lg:hidden" style={{ top: '0' }}>
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setIsMenuOpen(false)} />

          {/* Menu Panel — slides from right */}
          <div
            className="absolute right-0 top-0 h-full w-[300px] max-w-[85vw] bg-white shadow-2xl flex flex-col"
            style={{ animation: 'slideInRight 0.25s ease-out' }}
          >
            {/* Menu Header */}
            <div className="p-4 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 overflow-hidden">
                  {isAuthenticated && user?.avatar ? <img src={user.avatar} alt="avatar" className="w-full h-full object-cover" /> : <User size={18} />}
                </div>
                {isAuthenticated && user ? (
                  <div>
                    <Link to={`/dashboard/${user.role.toLowerCase()}`} onClick={() => setIsMenuOpen(false)} className="text-sm font-bold text-slate-900 hover:text-primary block">
                      {user.fullName}
                    </Link>
                    <button onClick={() => { logout(); setIsMenuOpen(false); }} className="text-xs font-medium text-red-500 hover:text-red-700 text-left">
                      {t('mobile_logout')}
                    </button>
                  </div>
                ) : (
                  <div>
                    <Link to="/login" onClick={() => setIsMenuOpen(false)} className="text-sm font-bold text-slate-900 hover:text-primary">
                      {t('sign_in')}
                    </Link>
                    <span className="mx-1.5 text-slate-300">|</span>
                    <Link to="/register" onClick={() => setIsMenuOpen(false)} className="text-sm font-bold text-primary">
                      {t('join_free')}
                    </Link>
                  </div>
                )}
              </div>
              <button onClick={() => setIsMenuOpen(false)} className="p-1 text-slate-400 hover:text-slate-600">
                <X size={22} />
              </button>
            </div>

            {/* Menu Content — scrollable */}
            <div className="flex-1 overflow-y-auto">
              {mobileMenuGroups.map((group, gIdx) => (
                <div key={gIdx} className="py-3">
                  <div className="px-4 pb-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">{group.title}</div>
                  {group.links.map((link, lIdx) => (
                    <Link
                      key={lIdx}
                      to={link.href}
                      onClick={() => setIsMenuOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-slate-700 hover:bg-slate-50 hover:text-primary transition-colors"
                    >
                      <span className="text-slate-400">{link.icon}</span>
                      <span className="flex-1">{link.label}</span>
                      <ChevronRight size={14} className="text-slate-300" />
                    </Link>
                  ))}
                </div>
              ))}
            </div>


          </div>
        </div>
      )}

      {/* Animations */}
      <style>{`
        @keyframes slideInRight {
          from { transform: translateX(100%); }
          to   { transform: translateX(0); }
        }
      `}</style>
    </header>
  );
}
