import React from 'react';
import { Link, useLocation, Outlet } from 'react-router-dom';
import { LayoutDashboard, FileText, Heart, MessageSquare, Settings, LogOut, Globe, User, Package, BarChart3, ShieldCheck, Archive, QrCode, ShieldAlert, Menu, X, Clock, ShoppingBag, ClipboardList, ScrollText, Wrench } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { cn } from '../utils/cn';
import { useAuth } from '../contexts/AuthContext';

interface SidebarItemProps {
  key?: string;
  icon: React.ReactNode;
  label: string;
  path: string;
  active: boolean;
  onClick?: () => void;
}

function SidebarItem({ icon, label, path, active, onClick }: SidebarItemProps) {
  return (
    <Link
      to={path}
      onClick={onClick}
      className={cn(
        "flex items-center gap-2.5 px-3.5 py-2.5 text-[13px] transition-all group relative rounded-lg mb-1 font-medium",
        active
          ? "bg-white/15 text-white font-bold shadow-2xs"
          : "text-white/80 hover:bg-white/10 hover:text-white"
      )}
      style={{ letterSpacing: '0.16px' }}
    >
      {active && <div className="absolute left-0 top-1 bottom-1 w-[3.5px] bg-viet-gold rounded-r-full" />}
      <div className={cn("shrink-0", active ? "text-viet-gold" : "text-white/70 group-hover:text-white")}>
        {icon}
      </div>
      <span>{label}</span>
    </Link>
  );
}

/* ─── Bottom Nav Item ─── */
function BottomNavItem({ icon, label, path, active }: { icon: React.ReactNode; label: string; path: string; active: boolean }) {
  return (
    <Link
      to={path}
      className={cn(
        "flex flex-col items-center justify-center gap-0.5 flex-1 py-2 transition-colors relative",
        active ? "text-primary" : "text-ink-subtle"
      )}
    >
      {active && <div className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-[2px] bg-primary" />}
      <div>{icon}</div>
      <span className="text-[10px] font-normal leading-none" style={{ letterSpacing: '0.32px' }}>{label}</span>
    </Link>
  );
}

export function DashboardLayout({ type }: { type: 'buyer' | 'supplier' | 'admin' }) {
  const { t } = useTranslation();
  const location = useLocation();
  const { user, logout } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);

  const closeSidebar = () => setIsSidebarOpen(false);

  // Close sidebar on route change
  React.useEffect(() => {
    setIsSidebarOpen(false);
  }, [location.pathname]);

  const buyerLinks = [
    { icon: <LayoutDashboard size={18} />, label: t('overview'), path: '/dashboard/buyer' },
    { icon: <FileText size={18} />, label: t('rfqs'), path: '/dashboard/buyer/rfqs' },
    { icon: <Heart size={18} />, label: t('saved'), path: '/dashboard/buyer/saved' },
    { icon: <MessageSquare size={18} />, label: t('msg_sidebar_label'), path: '/dashboard/buyer/messages' },
    { icon: <BarChart3 size={18} />, label: t('analytics'), path: '/dashboard/buyer/analytics' },
    { icon: <Settings size={18} />, label: t('settings'), path: '/dashboard/buyer/settings' },
  ];

  const supplierLinks = [
    { icon: <LayoutDashboard size={18} />, label: t('overview'), path: '/dashboard/supplier' },
    { icon: <Package size={18} />, label: t('products'), path: '/dashboard/supplier/products' },
    { icon: <FileText size={18} />, label: t('rfqs'), path: '/dashboard/supplier/rfqs' },
    { icon: <MessageSquare size={18} />, label: t('msg_sidebar_label'), path: '/dashboard/supplier/messages' },
    { icon: <BarChart3 size={18} />, label: t('analytics'), path: '/dashboard/supplier/analytics' },
    { icon: <User size={18} />, label: t('profile'), path: '/dashboard/supplier/profile' },
    { icon: <Settings size={18} />, label: t('settings'), path: '/dashboard/supplier/settings' },
  ];

  const adminLinks = [
    { icon: <LayoutDashboard size={18} />, label: t('admin_menu_overview'), path: '/dashboard/admin' },
    { icon: <User size={18} />, label: t('admin_menu_users'), path: '/dashboard/admin/users' },
    { icon: <ShieldCheck size={18} />, label: t('admin_menu_suppliers'), path: '/dashboard/admin/suppliers' },
    { icon: <Package size={18} />, label: t('admin_menu_products'), path: '/dashboard/admin/products' },
    { icon: <Archive size={18} />, label: t('admin_menu_categories'), path: '/dashboard/admin/categories' },
    { icon: <MessageSquare size={18} />, label: t('admin_menu_contacts'), path: '/dashboard/admin/contacts' },
    { icon: <ClipboardList size={18} />, label: t('admin_menu_orders'), path: '/dashboard/admin/orders' },
    { icon: <ScrollText size={18} />, label: t('admin_menu_audit_log'), path: '/dashboard/admin/audit-log' },
    { icon: <Wrench size={18} />, label: t('admin_menu_settings'), path: '/dashboard/admin/settings' },
  ];

  const links = type === 'admin' ? adminLinks : (type === 'buyer' ? buyerLinks : supplierLinks);

  // Page title & subtitle mapping for header
  const pageTitles: Record<string, { title: string; subtitle?: string }> = {
    '/dashboard/admin': { title: t('admin_menu_overview') },
    '/dashboard/admin/users': { title: t('admin_users_title'), subtitle: t('admin_users_subtitle') },
    '/dashboard/admin/suppliers': { title: t('admin_suppliers_title'), subtitle: t('admin_suppliers_subtitle') },
    '/dashboard/admin/products': { title: t('admin_products_title'), subtitle: t('admin_products_subtitle') },
    '/dashboard/admin/categories': { title: t('admin_categories_title'), subtitle: t('admin_categories_subtitle') },
    '/dashboard/admin/contacts': { title: t('admin_contacts_title'), subtitle: t('admin_contacts_subtitle') },
    '/dashboard/admin/orders': { title: t('admin_orders_title'), subtitle: t('admin_orders_subtitle') },
    '/dashboard/admin/audit-log': { title: t('admin_audit_title'), subtitle: t('admin_audit_subtitle') },
    '/dashboard/admin/settings': { title: t('admin_settings_title'), subtitle: t('admin_settings_subtitle') },
  };

  const currentPage = pageTitles[location.pathname];
  const pageTitle = currentPage?.title || links.find(l => l.path === location.pathname)?.label || t('dashboard');
  const pageSubtitle = currentPage?.subtitle;

  // Bottom nav: show only the most important 5 items
  const buyerBottomNav = [
    { icon: <LayoutDashboard size={20} />, label: t('overview'), path: '/dashboard/buyer' },
    { icon: <FileText size={20} />, label: t('rfqs'), path: '/dashboard/buyer/rfqs' },
    { icon: <Heart size={20} />, label: t('saved'), path: '/dashboard/buyer/saved' },
    { icon: <MessageSquare size={20} />, label: t('msg_sidebar_label'), path: '/dashboard/buyer/messages' },
    { icon: <Settings size={20} />, label: t('settings'), path: '/dashboard/buyer/settings' },
  ];

  const supplierBottomNav = [
    { icon: <LayoutDashboard size={20} />, label: t('overview'), path: '/dashboard/supplier' },
    { icon: <Package size={20} />, label: t('products'), path: '/dashboard/supplier/products' },
    { icon: <QrCode size={20} />, label: 'QR', path: '/dashboard/supplier/qr-management' },
    { icon: <BarChart3 size={20} />, label: t('analytics'), path: '/dashboard/supplier/analytics' },
    { icon: <User size={20} />, label: t('profile'), path: '/dashboard/supplier/profile' },
  ];

  const adminBottomNav = adminLinks;

  const bottomNavItems = type === 'admin' ? adminBottomNav : (type === 'buyer' ? buyerBottomNav : supplierBottomNav);

  /* ─────── Sidebar Content (shared between desktop & mobile) ─────── */
  const sidebarContent = (
    <>
      <div className="px-3 py-2.5 lg:px-4 lg:py-2.5 border-b border-hairline flex items-center justify-between bg-white h-12 sm:h-14 lg:h-16">
        <Link to="/" className="flex items-center gap-1" onClick={closeSidebar}>
          <img src="/logoVIE.png" alt="Logo" className="h-9 w-auto object-contain" />
          <div className="flex items-center">
            <span className="text-lg font-black text-primary tracking-tighter">VIE</span>
            <span className="text-lg font-black text-slate-900 tracking-tighter">product</span>
          </div>
        </Link>
        {/* Close button — mobile only */}
        <button className="lg:hidden p-1.5 -mr-1 text-slate-400 hover:text-slate-600" onClick={closeSidebar}>
          <X size={18} />
        </button>
      </div>

      <div className="flex-1 p-3 lg:p-4 space-y-0.5 overflow-y-auto">
        <div className="text-[10px] font-semibold text-white/50 mb-3 px-3 uppercase tracking-wider" style={{ letterSpacing: '0.05em' }}>
          {type === 'admin' ? 'Admin' : (type === 'buyer' ? t('buyer') : t('supplier'))} {t('dashboard')}
        </div>
        {links.map((link) => (
          <SidebarItem
            key={link.path}
            icon={link.icon}
            label={link.label}
            path={link.path}
            active={location.pathname === link.path}
            onClick={closeSidebar}
          />
        ))}
      </div>

      <div className="p-3 lg:p-4 border-t border-white/10">
        <button
          onClick={() => logout()}
          className="flex items-center gap-2.5 px-3 py-2 w-full text-[13px] font-normal text-white/70 hover:bg-primary hover:text-white transition-all"
          style={{ letterSpacing: '0.16px' }}
        >
          <LogOut size={18} className="text-white/50" />
          <span>{t('sign_out')}</span>
        </button>
      </div>
    </>
  );

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* ═══ Desktop Sidebar ═══ */}
      <aside className="w-56 bg-primary hidden lg:flex flex-col sticky top-0 h-screen shadow-md">
        {sidebarContent}
      </aside>

      {/* ═══ Mobile Sidebar Overlay ═══ */}
      {isSidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/50"
            onClick={closeSidebar}
          />
          {/* Slide-in panel */}
          <aside
            className="absolute left-0 top-0 h-full w-[240px] max-w-[85vw] bg-primary flex flex-col shadow-xl"
            style={{ animation: 'slideInLeft 0.25s ease-out' }}
          >
            {sidebarContent}
          </aside>
        </div>
      )}

      {/* ═══ Main Content Area ═══ */}
      <main className="flex-1 flex flex-col min-w-0">
        {/* Top Header */}
        <header className="h-12 sm:h-14 lg:h-16 bg-white border-b border-slate-200/80 shadow-xs flex items-center justify-between px-4 sm:px-6 lg:px-8 sticky top-0 z-30">
          <div className="flex items-center gap-3">
            {/* Hamburger — mobile & tablet */}
            <button
              className="lg:hidden p-2 -ml-2 text-slate-500 hover:text-blue-600 transition-colors"
              onClick={() => setIsSidebarOpen(true)}
            >
              <Menu size={20} />
            </button>
            <div>
              <h2 className="text-base sm:text-lg lg:text-xl font-bold text-slate-900 truncate" style={{ letterSpacing: 0 }}>
                {pageTitle}
              </h2>
              {pageSubtitle && (
                <p className="text-[11px] sm:text-xs text-slate-500 font-normal truncate max-w-[200px] sm:max-w-none" style={{ letterSpacing: '0.16px' }}>{pageSubtitle}</p>
              )}
            </div>
          </div>
          <div className="flex items-center gap-3 sm:gap-6">
            <div className="flex items-center gap-3">
              <div className="text-right hidden sm:block">
                <div className="text-sm font-semibold text-slate-800" style={{ letterSpacing: '0.16px' }}>{user?.fullName || 'User'}</div>
                <div className="text-[10px] text-slate-500 font-medium uppercase tracking-wider" style={{ letterSpacing: '0.32px' }}>{type === 'admin' ? 'Admin' : (type === 'buyer' ? t('buyer') : t('supplier'))} {t('account')}</div>
              </div>
              <div className="w-9 h-9 sm:w-10 sm:h-10 bg-slate-100 border border-slate-200 rounded-full flex items-center justify-center text-slate-600 font-semibold text-xs sm:text-sm overflow-hidden shadow-xs">
                {(user as any)?.avatar ? (
                  <img src={(user as any).avatar.startsWith('http') ? (user as any).avatar : `${(import.meta.env.VITE_API_URL || 'http://localhost:3001/api/v1').replace('/api/v1', '')}${(user as any).avatar}`} alt="avatar" className="w-full h-full object-cover" />
                ) : (
                  user?.fullName?.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() || 'U'
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Page Content — extra bottom padding on mobile for bottom nav */}
        <div className="p-4 sm:p-6 lg:p-8 pb-24 lg:pb-8">
          <Outlet />
        </div>
      </main>

      {/* ═══ Bottom Navigation Bar — Mobile Only ═══ */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 lg:hidden bg-white border-t border-slate-200 flex items-stretch safe-area-bottom shadow-lg">
        {bottomNavItems.map((item) => (
          <BottomNavItem
            key={item.path}
            icon={item.icon}
            label={item.label}
            path={item.path}
            active={location.pathname === item.path}
          />
        ))}
      </nav>

      {/* ═══ Animations ═══ */}
      <style>{`
        @keyframes slideInLeft {
          from { transform: translateX(-100%); }
          to   { transform: translateX(0); }
        }
        .safe-area-bottom {
          padding-bottom: env(safe-area-inset-bottom, 0px);
        }
      `}</style>
    </div>
  );
}
