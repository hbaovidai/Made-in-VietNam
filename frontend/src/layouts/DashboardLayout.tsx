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
        "flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all group relative",
        active
          ? "bg-primary/5 text-primary font-bold"
          : "text-slate-500 hover:bg-slate-50 hover:text-slate-800"
      )}
    >
      {active && <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 bg-primary rounded-r-full" />}
      <div className={cn("shrink-0 transition-transform group-hover:scale-105", active ? "text-primary" : "text-slate-400 group-hover:text-slate-600")}>
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
        active ? "text-primary" : "text-slate-400"
      )}
    >
      {active && <div className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-primary rounded-full" />}
      <div className={cn("transition-transform", active && "scale-110")}>{icon}</div>
      <span className="text-[10px] font-bold leading-none">{label}</span>
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
    { icon: <LayoutDashboard size={20} />, label: t('overview'), path: '/dashboard/buyer' },
    { icon: <ShoppingBag size={20} />, label: t('my_orders', 'Đơn mua'), path: '/dashboard/buyer/orders' },
    { icon: <FileText size={20} />, label: t('rfqs'), path: '/dashboard/buyer/rfqs' },
    { icon: <Heart size={20} />, label: t('saved'), path: '/dashboard/buyer/saved' },
    { icon: <Clock size={20} />, label: t('history', 'Lịch sử duyệt'), path: '/dashboard/buyer/history' },
    { icon: <MessageSquare size={20} />, label: t('msg_sidebar_label'), path: '/dashboard/buyer/messages' },
    { icon: <Settings size={20} />, label: t('settings'), path: '/dashboard/buyer/settings' },
  ];

  const supplierLinks = [
    { icon: <LayoutDashboard size={20} />, label: t('overview'), path: '/dashboard/supplier' },
    { icon: <Package size={20} />, label: t('products'), path: '/dashboard/supplier/products' },
    // { icon: <Archive size={20} />, label: t('batch_management'), path: '/dashboard/supplier/batches' },
    // { icon: <QrCode size={20} />, label: t('qr_management'), path: '/dashboard/supplier/qr-management' },
    // { icon: <ShieldAlert size={20} />, label: t('anti_counterfeit'), path: '/dashboard/supplier/anti-counterfeit' },
    // { icon: <ShoppingBag size={20} />, label: t('retail_orders', 'Đơn hàng lẻ'), path: '/dashboard/supplier/orders' },
    { icon: <FileText size={20} />, label: t('rfqs'), path: '/dashboard/supplier/rfqs' },
    { icon: <MessageSquare size={20} />, label: t('msg_sidebar_label'), path: '/dashboard/supplier/messages' },
    { icon: <BarChart3 size={20} />, label: t('analytics'), path: '/dashboard/supplier/analytics' },
    { icon: <User size={20} />, label: t('profile'), path: '/dashboard/supplier/profile' },
    { icon: <Settings size={20} />, label: t('settings'), path: '/dashboard/supplier/settings' },
  ];

  const adminLinks = [
    { icon: <LayoutDashboard size={20} />, label: t('admin_menu_overview'), path: '/dashboard/admin' },
    { icon: <User size={20} />, label: t('admin_menu_users'), path: '/dashboard/admin/users' },
    { icon: <ShieldCheck size={20} />, label: t('admin_menu_suppliers'), path: '/dashboard/admin/suppliers' },
    { icon: <Package size={20} />, label: t('admin_menu_products'), path: '/dashboard/admin/products' },
    { icon: <Archive size={20} />, label: t('admin_menu_categories'), path: '/dashboard/admin/categories' },
    { icon: <MessageSquare size={20} />, label: t('admin_menu_contacts'), path: '/dashboard/admin/contacts' },
    { icon: <ClipboardList size={20} />, label: t('admin_menu_orders'), path: '/dashboard/admin/orders' },
    { icon: <ScrollText size={20} />, label: t('admin_menu_audit_log'), path: '/dashboard/admin/audit-log' },
    { icon: <Wrench size={20} />, label: t('admin_menu_settings'), path: '/dashboard/admin/settings' },
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
      <div className="p-6 lg:p-8 border-b border-slate-100 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-1" onClick={closeSidebar}>
          <img src="/logoVIE.png" alt="Logo" className="h-10 w-auto object-contain mix-blend-multiply" />
          <div className="flex flex-row items-center">
            <span className="text-sm font-bold text-primary leading-none tracking-tight">VIE</span>
            <span className="text-sm font-bold text-slate-900 leading-none tracking-tight">PRODUCT</span>
          </div>
        </Link>
        {/* Close button — mobile only */}
        <button className="lg:hidden p-2 -mr-2 text-slate-400 hover:text-slate-600" onClick={closeSidebar}>
          <X size={20} />
        </button>
      </div>

      <div className="flex-1 p-4 lg:p-6 space-y-2 overflow-y-auto">
        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4 px-4">
          {type === 'admin' ? 'ADMIN' : (type === 'buyer' ? t('buyer') : t('supplier'))} {t('dashboard')}
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

      <div className="p-4 lg:p-6 border-t border-slate-100">
        {/* Go Premium button - hidden for now
        {type !== 'admin' && (
          <div className="bg-slate-900 rounded-2xl p-4 mb-4 lg:mb-6 relative overflow-hidden group cursor-pointer">
            ...
          </div>
        )}
        */}
        <button
          onClick={() => logout()}
          className="flex items-center gap-3 px-4 py-3 w-full rounded-xl text-sm font-bold text-slate-500 hover:bg-blue-50 hover:text-primary transition-all"
        >
          <LogOut size={20} />
          <span>{t('sign_out')}</span>
        </button>
      </div>
    </>
  );

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* ═══ Desktop Sidebar ═══ */}
      <aside className="w-72 bg-white border-r border-slate-200 hidden lg:flex flex-col sticky top-0 h-screen">
        {sidebarContent}
      </aside>

      {/* ═══ Mobile Sidebar Overlay ═══ */}
      {isSidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm animate-in fade-in"
            onClick={closeSidebar}
          />
          {/* Slide-in panel */}
          <aside
            className="absolute left-0 top-0 h-full w-[280px] max-w-[85vw] bg-white shadow-2xl flex flex-col animate-in slide-in-from-left"
            style={{ animation: 'slideInLeft 0.25s ease-out' }}
          >
            {sidebarContent}
          </aside>
        </div>
      )}

      {/* ═══ Main Content Area ═══ */}
      <main className="flex-1 flex flex-col min-w-0">
        {/* Top Header */}
        <header className="h-14 sm:h-16 lg:h-20 bg-white border-b border-slate-200 flex items-center justify-between px-4 sm:px-6 lg:px-8 sticky top-0 z-30">
          <div className="flex items-center gap-3">
            {/* Hamburger — mobile & tablet */}
            <button
              className="lg:hidden p-2 -ml-2 text-slate-600 hover:text-primary transition-colors"
              onClick={() => setIsSidebarOpen(true)}
            >
              <Menu size={22} />
            </button>
            <div>
              <h2 className="text-base sm:text-lg lg:text-xl font-bold text-slate-900 truncate">
                {pageTitle}
              </h2>
              {pageSubtitle && (
                <p className="text-[11px] sm:text-xs text-slate-400 font-medium truncate max-w-[200px] sm:max-w-none">{pageSubtitle}</p>
              )}
            </div>
          </div>
          <div className="flex items-center gap-3 sm:gap-6">
            <div className="flex items-center gap-3">
              <div className="text-right hidden sm:block">
                <div className="text-sm font-bold text-slate-900">{user?.fullName || 'User'}</div>
                <div className="text-[10px] text-slate-500 font-medium uppercase tracking-wider">{type === 'admin' ? 'ADMIN' : (type === 'buyer' ? t('buyer') : t('supplier'))} {t('account')}</div>
              </div>
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-400 font-bold text-xs sm:text-sm overflow-hidden">
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
      <nav className="fixed bottom-0 left-0 right-0 z-40 lg:hidden bg-white border-t border-slate-200 flex items-stretch safe-area-bottom shadow-[0_-4px_20px_rgba(0,0,0,0.08)]">
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
