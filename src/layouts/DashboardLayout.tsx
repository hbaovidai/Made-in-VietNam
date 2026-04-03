import React from 'react';
import { Link, useLocation, Outlet } from 'react-router-dom';
import { LayoutDashboard, FileText, Heart, MessageSquare, Settings, LogOut, Globe, User, Package, BarChart3, ShieldCheck, Archive, QrCode, ShieldAlert, Menu, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { cn } from '../utils/cn';

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
          ? "bg-viet-red text-white shadow-lg shadow-red-900/20"
          : "text-slate-500 hover:bg-slate-100 hover:text-slate-900"
      )}
    >
      <div className={cn("shrink-0 transition-transform group-hover:scale-110", active ? "text-white" : "text-slate-400 group-hover:text-viet-red")}>
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
        active ? "text-viet-red" : "text-slate-400"
      )}
    >
      {active && <div className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-viet-red rounded-full" />}
      <div className={cn("transition-transform", active && "scale-110")}>{icon}</div>
      <span className="text-[10px] font-bold leading-none">{label}</span>
    </Link>
  );
}

export function DashboardLayout({ type }: { type: 'buyer' | 'supplier' }) {
  const { t } = useTranslation();
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);

  const closeSidebar = () => setIsSidebarOpen(false);

  // Close sidebar on route change
  React.useEffect(() => {
    setIsSidebarOpen(false);
  }, [location.pathname]);

  const buyerLinks = [
    { icon: <LayoutDashboard size={20} />, label: /* t('overview') */ "Tổng quan", path: '/dashboard/buyer' },
    { icon: <FileText size={20} />, label: /* t('rfqs') */ "Yêu cầu báo giá", path: '/dashboard/buyer/rfqs' },
    { icon: <Heart size={20} />, label: /* t('saved') */ "Đã lưu", path: '/dashboard/buyer/saved' },
    { icon: <MessageSquare size={20} />, label: /* t('messages') */ "Tin nhắn", path: '/dashboard/buyer/messages' },
    { icon: <Settings size={20} />, label: /* t('settings') */ "Cài đặt", path: '/dashboard/buyer/settings' },
  ];

  const supplierLinks = [
    { icon: <LayoutDashboard size={20} />, label: /* t('overview') */ "Tổng quan", path: '/dashboard/supplier' },
    { icon: <Package size={20} />, label: /* t('products') */ "Sản phẩm", path: '/dashboard/supplier/products' },
    /* { icon: <Archive size={20} />, label: t('batch_management'), path: '/dashboard/supplier/batches' }, */
    /* { icon: <QrCode size={20} />, label: t('qr_management'), path: '/dashboard/supplier/qr-management' }, */
    /* { icon: <ShieldAlert size={20} />, label: t('anti_counterfeit'), path: '/dashboard/supplier/anti-counterfeit' }, */
    { icon: <FileText size={20} />, label: /* t('rfqs') */ "Yêu cầu báo giá", path: '/dashboard/supplier/rfqs' },
    { icon: <BarChart3 size={20} />, label: /* t('analytics') */ "Phân tích", path: '/dashboard/supplier/analytics' },
    { icon: <User size={20} />, label: /* t('profile') */ "Hồ sơ", path: '/dashboard/supplier/profile' },
    { icon: <Settings size={20} />, label: /* t('settings') */ "Cài đặt", path: '/dashboard/supplier/settings' },
  ];

  const links = type === 'buyer' ? buyerLinks : supplierLinks;

  // Bottom nav: show only the most important 5 items
  const buyerBottomNav = [
    { icon: <LayoutDashboard size={20} />, label: /* t('overview') */ "Tổng quan", path: '/dashboard/buyer' },
    { icon: <FileText size={20} />, label: /* t('rfqs') */ "RFQ", path: '/dashboard/buyer/rfqs' },
    { icon: <Heart size={20} />, label: /* t('saved') */ "Đã lưu", path: '/dashboard/buyer/saved' },
    { icon: <MessageSquare size={20} />, label: /* t('messages') */ "Tin nhắn", path: '/dashboard/buyer/messages' },
    { icon: <Settings size={20} />, label: /* t('settings') */ "Cài đặt", path: '/dashboard/buyer/settings' },
  ];

  const supplierBottomNav = [
    { icon: <LayoutDashboard size={20} />, label: /* t('overview') */ "Tổng quan", path: '/dashboard/supplier' },
    { icon: <Package size={20} />, label: /* t('products') */ "Sản phẩm", path: '/dashboard/supplier/products' },
    /* { icon: <QrCode size={20} />, label: 'QR', path: '/dashboard/supplier/qr-management' }, */
    { icon: <BarChart3 size={20} />, label: /* t('analytics') */ "Phân tích", path: '/dashboard/supplier/analytics' },
    { icon: <User size={20} />, label: /* t('profile') */ "Hồ sơ", path: '/dashboard/supplier/profile' },
  ];

  const bottomNavItems = type === 'buyer' ? buyerBottomNav : supplierBottomNav;

  /* ─────── Sidebar Content (shared between desktop & mobile) ─────── */
  const sidebarContent = (
    <>
      <div className="p-6 lg:p-8 border-b border-slate-100 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2" onClick={closeSidebar}>
          <div className="w-8 h-8 bg-viet-red rounded-lg flex items-center justify-center text-viet-gold">
            <Globe size={18} />
          </div>
          <div className="flex flex-row items-center">
            <span className="text-sm font-bold text-slate-900 leading-none tracking-tight">VIE</span>
            <span className="text-sm font-bold text-viet-red leading-none tracking-tight">PRODUCT</span>
          </div>
        </Link>
        {/* Close button — mobile only */}
        <button className="lg:hidden p-2 -mr-2 text-slate-400 hover:text-slate-600" onClick={closeSidebar}>
          <X size={20} />
        </button>
      </div>

      <div className="flex-1 p-4 lg:p-6 space-y-2 overflow-y-auto">
        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4 px-4">
          {type === 'buyer' ? (/* t('buyer') */ "Người mua") : (/* t('supplier') */ "Nhà cung cấp")} {/* t('dashboard') */} Bảng điều khiển
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
              <div className="text-xs font-bold text-white">{/* t('go_premium') */} Nâng cấp Premium</div>
              <div className="text-[10px] text-slate-400">{/* t('unlock_all_features') */} Mở khóa tất cả tính năng</div>
            </div>
          </div>
        </div>
        <button 
          onClick={() => {
            localStorage.removeItem('auth_token');
            localStorage.removeItem('user_role');
            window.location.href = '/login';
          }}
          className="flex items-center gap-3 px-4 py-3 w-full rounded-xl text-sm font-bold text-slate-500 hover:bg-red-50 hover:text-viet-red transition-all"
        >
          <LogOut size={20} />
          <span>{/* {t('sign_out')} */} Đăng xuất</span>
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
              className="lg:hidden p-2 -ml-2 text-slate-600 hover:text-viet-red transition-colors"
              onClick={() => setIsSidebarOpen(true)}
            >
              <Menu size={22} />
            </button>
            <h2 className="text-base sm:text-lg lg:text-xl font-bold text-slate-900 truncate">
              {links.find(l => l.path === location.pathname)?.label || (/* t('dashboard') */ "Bảng điều khiển")}
            </h2>
          </div>
          <div className="flex items-center gap-3 sm:gap-6">
            <div className="flex items-center gap-3">
              <div className="text-right hidden sm:block">
                <div className="text-sm font-bold text-slate-900">Hoai Bao</div>
                <div className="text-[10px] text-slate-500 font-medium uppercase tracking-wider">{type === 'buyer' ? (/* t('buyer') */ "Người mua") : (/* t('supplier') */ "Nhà cung cấp")} {/* t('account') */} Tài khoản</div>
              </div>
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-400 font-bold text-xs sm:text-sm">
                HB
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
