import React from 'react';
import { Link, useLocation, Outlet } from 'react-router-dom';
import { LayoutDashboard, FileText, Heart, MessageSquare, Settings, LogOut, Globe, User, Package, BarChart3, ShieldCheck, Archive, QrCode, ShieldAlert, Menu, X } from 'lucide-react';
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
        "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all group",
        active
          ? "bg-primary text-white shadow-lg shadow-primary-dark/20"
          : "text-slate-500 hover:bg-slate-100 hover:text-slate-900"
      )}
    >
      <div className={cn("shrink-0 transition-transform group-hover:scale-110", active ? "text-white" : "text-slate-400 group-hover:text-primary")}>
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

export function DashboardLayout({ type }: { type: 'buyer' | 'supplier' }) {
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
    { icon: <FileText size={20} />, label: t('rfqs'), path: '/dashboard/buyer/rfqs' },
    { icon: <Heart size={20} />, label: t('saved'), path: '/dashboard/buyer/saved' },
    { icon: <MessageSquare size={20} />, label: t('messages'), path: '/dashboard/buyer/messages' },
    { icon: <Settings size={20} />, label: t('settings'), path: '/dashboard/buyer/settings' },
  ];

  const supplierLinks = [
    { icon: <LayoutDashboard size={20} />, label: t('overview'), path: '/dashboard/supplier' },
    { icon: <Package size={20} />, label: t('products'), path: '/dashboard/supplier/products' },
    { icon: <Archive size={20} />, label: t('batch_management'), path: '/dashboard/supplier/batches' },
    { icon: <QrCode size={20} />, label: t('qr_management'), path: '/dashboard/supplier/qr-management' },
    { icon: <ShieldAlert size={20} />, label: t('anti_counterfeit'), path: '/dashboard/supplier/anti-counterfeit' },
    { icon: <FileText size={20} />, label: t('rfqs'), path: '/dashboard/supplier/rfqs' },
    { icon: <BarChart3 size={20} />, label: t('analytics'), path: '/dashboard/supplier/analytics' },
    { icon: <User size={20} />, label: t('profile'), path: '/dashboard/supplier/profile' },
    { icon: <Settings size={20} />, label: t('settings'), path: '/dashboard/supplier/settings' },
  ];

  const links = type === 'buyer' ? buyerLinks : supplierLinks;

  // Bottom nav: show only the most important 5 items
  const buyerBottomNav = [
    { icon: <LayoutDashboard size={20} />, label: t('overview'), path: '/dashboard/buyer' },
    { icon: <FileText size={20} />, label: t('rfqs'), path: '/dashboard/buyer/rfqs' },
    { icon: <Heart size={20} />, label: t('saved'), path: '/dashboard/buyer/saved' },
    { icon: <MessageSquare size={20} />, label: t('messages'), path: '/dashboard/buyer/messages' },
    { icon: <Settings size={20} />, label: t('settings'), path: '/dashboard/buyer/settings' },
  ];

  const supplierBottomNav = [
    { icon: <LayoutDashboard size={20} />, label: t('overview'), path: '/dashboard/supplier' },
    { icon: <Package size={20} />, label: t('products'), path: '/dashboard/supplier/products' },
    { icon: <QrCode size={20} />, label: 'QR', path: '/dashboard/supplier/qr-management' },
    { icon: <BarChart3 size={20} />, label: t('analytics'), path: '/dashboard/supplier/analytics' },
    { icon: <User size={20} />, label: t('profile'), path: '/dashboard/supplier/profile' },
  ];

  const bottomNavItems = type === 'buyer' ? buyerBottomNav : supplierBottomNav;

  /* ─────── Sidebar Content (shared between desktop & mobile) ─────── */
  const sidebarContent = (
    <>
      <div className="p-6 lg:p-8 border-b border-slate-100 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2" onClick={closeSidebar}>
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-viet-gold">
            <Globe size={18} />
          </div>
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
          {type === 'buyer' ? t('buyer') : t('supplier')} {t('dashboard')}
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
        <div className="bg-slate-900 rounded-2xl p-4 mb-4 lg:mb-6 relative overflow-hidden group cursor-pointer">
          <div className="absolute top-0 right-0 w-12 h-12 bg-viet-gold/20 rounded-full -translate-y-1/2 translate-x-1/2 blur-xl group-hover:scale-150 transition-transform" />
          <div className="flex items-center gap-3 relative z-10">
            <div className="w-8 h-8 bg-viet-gold rounded-lg flex items-center justify-center text-slate-900">
              <ShieldCheck size={18} />
            </div>
            <div>
              <div className="text-xs font-bold text-white">{t('go_premium')}</div>
              <div className="text-[10px] text-slate-400">{t('unlock_all_features')}</div>
            </div>
          </div>
        </div>
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
            <h2 className="text-base sm:text-lg lg:text-xl font-bold text-slate-900 truncate">
              {links.find(l => l.path === location.pathname)?.label || t('dashboard')}
            </h2>
          </div>
          <div className="flex items-center gap-3 sm:gap-6">
            <div className="flex items-center gap-3">
              <div className="text-right hidden sm:block">
                <div className="text-sm font-bold text-slate-900">{user?.fullName || 'User'}</div>
                <div className="text-[10px] text-slate-500 font-medium uppercase tracking-wider">{type === 'buyer' ? t('buyer') : t('supplier')} {t('account')}</div>
              </div>
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-400 font-bold text-xs sm:text-sm">
                {user?.fullName?.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() || 'U'}
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
