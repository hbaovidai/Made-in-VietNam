import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Search, ShoppingBag, User, Menu, Globe, ChevronDown, MessageSquare, ClipboardList, ShoppingCart, Smartphone, HelpCircle } from 'lucide-react';
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
  const location = useLocation();

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

  return (
    <header className="sticky top-0 z-50 w-full bg-white shadow-sm">
      {/* Main Header - Logo, Search & Utility Actions */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex justify-between items-center gap-8">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 shrink-0">
            <div className="flex flex-col">
              <div className="flex items-center gap-1">
              <span className="text-2xl font-black text-slate-900 leading-none tracking-tighter">Made in</span>
              <span className="text-2xl font-black text-viet-red leading-none tracking-tighter">VietNam</span>
              </div>
              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.2em]">{t('b2b_global_trade')}</span>
            </div>
          </Link>

          {/* Search Bar - Center */}
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
                className="flex-1 px-4 h-full text-sm outline-none"
                placeholder={t('search_placeholder', { type: searchType.toLowerCase() })}
              />
              <button className="bg-viet-red text-white px-6 h-full font-bold hover:bg-red-700 transition-colors flex items-center justify-center gap-2 whitespace-nowrap">
                <Search size={18} />
                <span>{t('search')}</span>
              </button>
            </div>
          </div>

          {/* Utility Actions - Right */}
          <div className="hidden lg:flex items-center gap-5 shrink-0">
            <Link to="/rfq" className="flex flex-col items-center gap-1 text-slate-600 hover:text-viet-red group">
              <ClipboardList size={22} className="group-hover:scale-110 transition-transform" />
              <span className="text-xs font-medium">{t('post_rfQ')}</span>
            </Link>
            <Link to="/dashboard/buyer/messages" className="flex flex-col items-center gap-1 text-slate-600 hover:text-viet-red group">
              <MessageSquare size={22} className="group-hover:scale-110 transition-transform" />
              <span className="text-xs font-medium">{t('messages')}</span>
            </Link>
            <Link to="/inquiry-basket" className="flex flex-col items-center gap-1 text-slate-600 hover:text-viet-red group">
              <ShoppingCart size={22} className="group-hover:scale-110 transition-transform" />
              <span className="text-xs font-medium">{t('inquiry_basket')}</span>
            </Link>
            <div className="h-8 w-px bg-slate-200 mx-1" />
            <div className="flex flex-col items-start justify-center">
              <Link to="/login" className="text-xs font-medium text-slate-600 hover:text-viet-red">{t('sign_in')}</Link>
              <Link to="/register" className="text-xs font-bold text-viet-red hover:underline">{t('join_free')}</Link>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="lg:hidden flex items-center gap-4">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 text-slate-600 hover:text-viet-red transition-colors"
            >
              <Menu size={24} />
            </button>
          </div>
        </div>
      </div>

      {/* Sub Navigation Bar */}
      <div className="border-t border-b border-slate-200 bg-white hidden md:block">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center h-10">
          <div className="flex items-center h-full">
            <div 
              className="relative h-full"
              onMouseEnter={() => setIsCategoriesOpen(true)}
              onMouseLeave={() => setIsCategoriesOpen(false)}
            >
              <Link to="/categories" className="flex items-center gap-2 bg-viet-red text-white px-6 h-full font-bold text-sm">
                <Menu size={18} />
                {t('all_categories')}
              </Link>
              
              {isCategoriesOpen && (
                <div className="absolute top-full left-0 z-[100] w-[1200px]">
                  <CategoryMegaMenu />
                </div>
              )}
            </div>
            <nav className="flex items-center gap-8 ml-8">
              <Link to="/products" className="text-sm font-bold text-slate-700 hover:text-viet-red">{t('top_ranking_products')}</Link>
              <Link to="/video" className="text-sm font-bold text-slate-700 hover:text-viet-red">{t('video_channel')}</Link>
              <Link to="/services" className="text-sm font-bold text-slate-700 hover:text-viet-red">{t('secured_trading_service')}</Link>
            </nav>
          </div>
          <div className="flex items-center h-full gap-6">
            <div className="flex items-center h-full gap-5 text-xs font-medium text-slate-500">
              <NavDropdown label={t('supplier')} to="/suppliers" className="h-full" panelClassName="left-auto right-0" arrowClassName="left-auto right-6">
                <MegaMenu sections={supplierMenuSections} columns={2} className="w-[480px]" />
              </NavDropdown>
              <NavDropdown label={t('buyer')} to="/dashboard/buyer" className="h-full" panelClassName="left-auto right-0" arrowClassName="left-auto right-6">
                <MegaMenu sections={buyerMenuSections} columns={3} className="w-[720px]" />
              </NavDropdown>
              <Link to="/help" className="hover:text-viet-red">{t('help')}</Link>
              <Link to="/apps" className="hover:text-viet-red flex items-center gap-1"><Smartphone size={12} /> {t('apps')}</Link>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="lg:hidden bg-white border-t border-slate-100 py-4 px-4 space-y-4 shadow-xl">
          <nav className="flex flex-col gap-4">
            <Link to="/products" className="text-base font-medium text-slate-700">{t('products')}</Link>
            <Link to="/suppliers" className="text-base font-medium text-slate-700">{t('suppliers')}</Link>
            <Link to="/rfq" className="text-base font-medium text-slate-700">{t('post_rfQ')}</Link>
            <Link to="/inquiry-basket" className="text-base font-medium text-slate-700">{t('inquiry_basket')}</Link>
          </nav>
        </div>
      )}
    </header>
  );
}



