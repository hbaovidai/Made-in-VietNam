import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Search, ShoppingBag, User, Menu, Globe, ChevronDown, MessageSquare, ClipboardList, ShoppingCart, Smartphone, HelpCircle, ShieldCheck, X, ChevronRight, Home, Package, FileText, BarChart3, Shield } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { cn } from '../utils/cn';
import { NavDropdown } from './NavDropdown';
import { MegaMenu } from './MegaMenu';
import { CategoryMegaMenu } from './categories/CategoryMegaMenu';

export function Header() {
  const { t, i18n } = useTranslation();
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const [isCategoriesOpen, setIsCategoriesOpen] = React.useState(false);
  const [searchType, setSearchType] = React.useState(t('products'));
  const [isSearchDropdownOpen, setIsSearchDropdownOpen] = React.useState(false);
  const [isLangDropdownOpen, setIsLangDropdownOpen] = React.useState(false);
  const [isMobileSearchOpen, setIsMobileSearchOpen] = React.useState(false);
  const location = useLocation();

  // Close mobile menu on route change
  React.useEffect(() => {
    setIsMenuOpen(false);
    setIsMobileSearchOpen(false);
  }, [location.pathname]);

  // Lock body scroll when mobile menu is open
  React.useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isMenuOpen]);

  const searchOptions = [t('products'), t('suppliers'), t('audited_factories')];

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
    setIsLangDropdownOpen(false);
  };

  const supplierMenuSections = [
    {
      title: t('supplier_services'),
      links: [
        { label: t('supplier_directory'), href: "/suppliers" },
        { label: t('verified_suppliers'), href: "/suppliers?verified=true" },
        { label: t('audited_factories'), href: "/suppliers?audited=true" },
        { label: t('trade_assurance'), href: "/services/trade-assurance" },
        { label: t('supplier_membership'), href: "/services/membership" },
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
        { label: t('help_center'), href: "/help" },
        { label: t('contact_support'), href: "/contact" },
      ]
    }
  ];

  const buyerMenuSections = [
    {
      title: t('service'),
      links: [
        { label: t('new_user_guide'), href: "/help/user-guide" },
        { label: t('audited_suppliers_reports'), href: "/reports" },
        { label: t('meet_suppliers'), href: "/events" },
        { label: t('secured_trading_service'), href: "/services/secured-trading" },
        { label: t('buyer_center'), href: "/dashboard/buyer" },
        { label: t('contact_us'), href: "/contact" },
      ]
    },
    {
      title: t('search'),
      links: [
        { label: t('product_directory'), href: "/products" },
        { label: t('supplier_discover'), href: "/suppliers" },
        { label: t('post_sourcing_request'), href: "/rfq" },
      ]
    },
    {
      title: t('quick_links'),
      links: [
        { label: t('my_favorites'), href: "/dashboard/buyer/saved" },
        { label: t('browsing_history'), href: "/dashboard/buyer/history" },
      ]
    }
  ];

  // Close dropdown when clicking outside
  React.useEffect(() => {
    const handleClickOutside = () => {
      setIsSearchDropdownOpen(false);
      setIsLangDropdownOpen(false);
    };
    if (isSearchDropdownOpen || isLangDropdownOpen) {
      window.addEventListener('click', handleClickOutside);
    }
    return () => window.removeEventListener('click', handleClickOutside);
  }, [isSearchDropdownOpen, isLangDropdownOpen]);

  /* ═══════════════════════════════════════════ */
  /* Mobile menu link groups                     */
  /* ═══════════════════════════════════════════ */
  const mobileMenuGroups = [
    {
      title: t('marketplace'),
      links: [
        { icon: <Package size={18} />, label: t('products'), href: "/products" },
        { icon: <User size={18} />, label: t('suppliers'), href: "/suppliers" },
        { icon: <Menu size={18} />, label: t('all_categories'), href: "/categories" },
        { icon: <ShoppingCart size={18} />, label: t('inquiry_basket'), href: "/inquiry-basket" },
      ]
    },
    {
      title: t('service'),
      links: [
        { icon: <ClipboardList size={18} />, label: t('post_rfQ'), href: "/rfq" },
        { icon: <ShieldCheck size={18} />, label: t('verify_qr_short', 'Xác nhận hàng giả'), href: "/verify" },
        { icon: <Shield size={18} />, label: t('trade_assurance'), href: "/services/trade-assurance" },
        { icon: <MessageSquare size={18} />, label: t('messages'), href: "/dashboard/buyer/messages" },
      ]
    },
    {
      title: t('support_info'),
      links: [
        { icon: <HelpCircle size={18} />, label: t('help_center'), href: "/help" },
        { icon: <FileText size={18} />, label: t('about_us'), href: "/about" },
        { icon: <Smartphone size={18} />, label: t('apps'), href: "/apps" },
      ]
    },
  ];

  return (
    <header className="sticky top-0 z-50 w-full bg-white shadow-sm">
      {/* ═══ Main Header ═══ */}
      <div className="max-w-[1600px] mx-auto px-3 sm:px-6 lg:px-8 py-3 sm:py-4">
        <div className="flex justify-between items-center gap-3 sm:gap-8">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 shrink-0">
            <div className="flex flex-col">
              <div className="flex items-center">
                <span className="text-lg sm:text-2xl font-black text-slate-900 tracking-tighter">VIE</span>
                <span className="text-lg sm:text-2xl font-black text-viet-red tracking-tighter">product</span>
              </div>
              <span className="text-[8px] sm:text-[9px] font-bold text-slate-400 uppercase tracking-[0.2em]">
                {/* {t('b2b_global_trade')} */} Thương mại toàn cầu B2B
              </span>
            </div>
          </Link>

          {/* ═══ Desktop Search Bar ═══ */}
          <div className="hidden md:flex flex-1 max-w-2xl lg:max-w-3xl">
            <div className="flex items-stretch w-full h-11 border-2 border-viet-red rounded-sm overflow-visible bg-white">
              <div className="relative shrink-0 h-full">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsSearchDropdownOpen(!isSearchDropdownOpen);
                  }}
                  className="h-full flex items-center gap-1 px-4 bg-slate-50 text-sm font-medium text-slate-700 border-r border-slate-200 hover:bg-slate-100 min-w-[150px] justify-between whitespace-nowrap"
                >
                  {searchType} <ChevronDown size={14} className={cn("transition-transform", isSearchDropdownOpen && "rotate-180")} />
                </button>

                {isSearchDropdownOpen && (
                  <div className="absolute top-full left-0 mt-1 w-48 bg-white border border-slate-200 shadow-lg rounded-sm py-1 z-[60]">
                    {searchOptions.map((option) => (
                      <button
                        key={option}
                        onClick={() => {
                          setSearchType(option);
                          setIsSearchDropdownOpen(false);
                        }}
                        className={cn(
                          "w-full text-left px-4 py-2 text-sm hover:bg-slate-50 transition-colors",
                          searchType === option ? "text-viet-red font-bold" : "text-slate-700"
                        )}
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                )}
              </div>
              <input
                type="text"
                className="flex-1 px-4 h-full text-sm outline-none w-full min-w-0"
                placeholder={/* t('search_placeholder', { type: searchType.toLowerCase() }) */ `Tìm kiếm ${searchType.toLowerCase()}...`}
              />
              <button className="bg-viet-red text-white px-6 h-full font-bold hover:bg-red-700 transition-colors flex items-center justify-center gap-2 whitespace-nowrap shrink-0">
                <Search size={18} />
                <span>{/* {t('search')} */} Tìm kiếm</span>
              </button>
            </div>
          </div>

          <div className="hidden lg:flex items-center gap-4 shrink-0">
            {/* Language Switcher - Commented out for push
            <div className="relative">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setIsLangDropdownOpen(!isLangDropdownOpen);
                }}
                className="flex items-center gap-1 text-slate-600 hover:text-viet-red"
              >
                <Globe size={20} />
                <span className="text-sm font-bold uppercase">{i18n.language || 'vi'}</span>
                <ChevronDown size={14} className={cn("transition-transform", isLangDropdownOpen && "rotate-180")} />
              </button>
              {isLangDropdownOpen && (
                <div className="absolute top-full right-0 mt-4 w-40 bg-white border border-slate-100 shadow-xl rounded-xl overflow-hidden py-2 z-[100]">
                  <button onClick={() => changeLanguage('vi')} className={cn("w-full text-left px-4 py-2 text-sm hover:bg-slate-50 transition-colors flex items-center gap-2", i18n.language === 'vi' ? "text-viet-red font-bold bg-red-50/50" : "text-slate-700")}>🇻🇳 Tiếng Việt</button>
                  <button onClick={() => changeLanguage('en')} className={cn("w-full text-left px-4 py-2 text-sm hover:bg-slate-50 transition-colors flex items-center gap-2", i18n.language === 'en' ? "text-viet-red font-bold bg-red-50/50" : "text-slate-700")}>🇬🇧 English</button>
                </div>
              )}
            </div>
            */}

            {/* Anti-counterfeit link - Commented out for push
            <Link to="/verify" className="flex flex-col items-center gap-1 text-viet-red hover:text-red-700 group px-2">
              <ShieldCheck size={20} className="group-hover:scale-110 transition-transform" />
              <span className="text-[10px] font-bold whitespace-nowrap">{t('verify_qr_short', 'Xác nhận Hàng giả')}</span>
            </Link>
            */}

            <div className="flex items-center gap-1">
              <Link to="/rfq" className="p-2 text-slate-600 hover:text-viet-red hover:bg-slate-50 rounded-full transition-colors relative" title={t('post_rfQ')}>
                <ClipboardList size={20} />
              </Link>
              <Link to="/dashboard/buyer/messages" className="p-2 text-slate-600 hover:text-viet-red hover:bg-slate-50 rounded-full transition-colors relative" title={t('dashboard_messages')}>
                <MessageSquare size={20} />
                <span className="absolute top-1 right-1 w-2 h-2 bg-viet-red rounded-full ring-2 ring-white" />
              </Link>
              <Link to="/inquiry-basket" className="p-2 text-slate-600 hover:text-viet-red hover:bg-slate-50 rounded-full transition-colors relative" title={t('inquiry_basket')}>
                <ShoppingCart size={20} />
                <span className="absolute -top-1 -right-1 bg-viet-red text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center ring-2 ring-white">3</span>
              </Link>
            </div>

            <div className="h-6 w-px bg-slate-200 mx-2" />

            <div className="flex items-center gap-3 group relative cursor-pointer">
              <div className="flex items-center justify-center w-9 h-9 rounded-full bg-slate-100 group-hover:bg-slate-200 text-slate-600 transition-colors">
                <User size={18} />
              </div>
              <div className="flex flex-col items-start justify-center">
                <Link to="/login" className="text-xs font-medium text-slate-600 hover:text-viet-red">
                  {/* {t('sign_in')} */} Đăng nhập
                </Link>
                <Link to="/register" className="text-[10px] font-bold text-viet-red hover:underline uppercase tracking-wider">
                  {/* {t('join_free')} */} Tham gia miễn phí
                </Link>
              </div>
            </div>
          </div>

          {/* ═══ Mobile Action Buttons ═══ */}
          <div className="lg:hidden flex items-center gap-1">
            {/* Search icon — opens mobile search */}
            <button
              onClick={() => setIsMobileSearchOpen(!isMobileSearchOpen)}
              className="p-2 text-slate-600 hover:text-viet-red transition-colors md:hidden"
            >
              <Search size={22} />
            </button>
            {/* Cart icon */}
            <Link to="/inquiry-basket" className="p-2 text-slate-600 hover:text-viet-red transition-colors relative">
              <ShoppingCart size={22} />
              <span className="absolute -top-0.5 -right-0.5 bg-viet-red text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center">3</span>
            </Link>
            {/* Menu toggle */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 text-slate-600 hover:text-viet-red transition-colors"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* ═══ Mobile Search Bar (expandable) ═══ */}
      {isMobileSearchOpen && (
        <div className="md:hidden border-t border-slate-100 px-3 py-3 bg-white">
          <div className="flex items-stretch h-10 border-2 border-viet-red rounded-lg overflow-hidden">
            <input
              type="text"
              className="flex-1 px-3 text-sm outline-none min-w-0"
              placeholder={t('search_placeholder', { type: searchType.toLowerCase() })}
              autoFocus
            />
            <button className="bg-viet-red text-white px-4 shrink-0">
              <Search size={18} />
            </button>
          </div>
        </div>
      )}

      {/* ═══ Desktop Sub Navigation Bar ═══ */}
      <div className="border-t border-b border-slate-200 bg-white hidden md:block">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center h-10">
          <div className="flex items-center h-full">
            <div
              className="relative h-full"
              onMouseEnter={() => setIsCategoriesOpen(true)}
              onMouseLeave={() => setIsCategoriesOpen(false)}
            >
              <Link to="/categories" className="flex items-center gap-2 bg-viet-red text-white px-6 h-full font-bold text-sm">
                <Menu size={18} />
                {/* {t('all_categories')} */} Tất cả danh mục
              </Link>

              {isCategoriesOpen && (
                <div className="absolute top-full left-0 z-[100] w-[1200px]">
                  <CategoryMegaMenu />
                </div>
              )}
            </div>
            <nav className="flex items-center gap-8 ml-8">
              <Link to="/products" className="text-sm font-bold text-slate-700 hover:text-viet-red">{/* {t('top_ranking_products')} */} Sản phẩm xếp hạng hàng đầu</Link>
              <Link to="/video" className="text-sm font-bold text-slate-700 hover:text-viet-red">{/* {t('video_channel')} */} Kênh video</Link>
              <Link to="/services" className="text-sm font-bold text-slate-700 hover:text-viet-red">{/* {t('secured_trading_service')} */} Dịch vụ giao dịch an toàn</Link>
            </nav>
          </div>
          <div className="flex items-center h-full gap-6">
            <div className="flex items-center h-full gap-5 text-xs font-medium text-slate-500">
              <NavDropdown label={/* t('supplier') */ "Nhà cung cấp"} to="/suppliers" className="h-full" panelClassName="left-auto right-0" arrowClassName="left-auto right-6">
                <MegaMenu sections={supplierMenuSections} columns={2} className="w-[480px]" />
              </NavDropdown>
              <NavDropdown label={/* t('buyer') */ "Người mua"} to="/dashboard/buyer" className="h-full" panelClassName="left-auto right-0" arrowClassName="left-auto right-6">
                <MegaMenu sections={buyerMenuSections} columns={3} className="w-[720px]" />
              </NavDropdown>
              <Link to="/help" className="hover:text-viet-red">{/* {t('help')} */} Trợ giúp</Link>
              <Link to="/apps" className="hover:text-viet-red flex items-center gap-1"><Smartphone size={12} /> {/* {t('apps')} */} Ứng dụng</Link>
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
                <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500">
                  <User size={18} />
                </div>
                <div>
                  <Link to="/login" onClick={() => setIsMenuOpen(false)} className="text-sm font-bold text-slate-900 hover:text-viet-red">
                    {/* {t('sign_in')} */} Đăng nhập
                  </Link>
                  <span className="mx-1.5 text-slate-300">|</span>
                  <Link to="/register" onClick={() => setIsMenuOpen(false)} className="text-sm font-bold text-viet-red">
                    {/* {t('join_free')} */} Tham gia miễn phí
                  </Link>
                </div>
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
                      className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-slate-700 hover:bg-slate-50 hover:text-viet-red transition-colors"
                    >
                      <span className="text-slate-400">{link.icon}</span>
                      <span className="flex-1">{link.label}</span>
                      <ChevronRight size={14} className="text-slate-300" />
                    </Link>
                  ))}
                </div>
              ))}
            </div>

            {/* Menu Footer — Language + Verify */}
            <div className="border-t border-slate-100 p-4 space-y-3">
              {/* Language Switcher - Commented
              <div className="flex items-center gap-2">
                <Globe size={16} className="text-slate-400" />
                <button
                  onClick={() => changeLanguage('vi')}
                  className={cn("text-sm px-3 py-1.5 rounded-full font-bold transition-colors", i18n.language === 'vi' ? "bg-viet-red text-white" : "bg-slate-100 text-slate-600")}
                >
                  🇻🇳 VI
                </button>
                <button
                  onClick={() => changeLanguage('en')}
                  className={cn("text-sm px-3 py-1.5 rounded-full font-bold transition-colors", i18n.language === 'en' ? "bg-viet-red text-white" : "bg-slate-100 text-slate-600")}
                >
                  🇬🇧 EN
                </button>
              </div>
              */}
              {/* CTA Verify - Commented
              <Link
                to="/verify"
                onClick={() => setIsMenuOpen(false)}
                className="flex items-center gap-2 justify-center w-full py-3 bg-viet-red text-white text-sm font-bold rounded-xl hover:bg-red-700 transition-colors"
              >
                <ShieldCheck size={16} />
                {t('verify_qr_short', 'Xác nhận hàng giả')}
              </Link>
              */}
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
