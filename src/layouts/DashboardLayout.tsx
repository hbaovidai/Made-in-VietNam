import React from 'react';
import { Link, useLocation, Outlet } from 'react-router-dom';
import { LayoutDashboard, FileText, Heart, MessageSquare, Settings, LogOut, Globe, User, Package, BarChart3, ShieldCheck } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { cn } from '../utils/cn';

interface SidebarItemProps {
  key?: string;
  icon: React.ReactNode;
  label: string;
  path: string;
  active: boolean;
}

function SidebarItem({ icon, label, path, active }: SidebarItemProps) {
  return (
    <Link
      to={path}
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

export function DashboardLayout({ type }: { type: 'buyer' | 'supplier' }) {
  const { t } = useTranslation();
  const location = useLocation();

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
    { icon: <FileText size={20} />, label: t('rfqs'), path: '/dashboard/supplier/rfqs' },
    { icon: <BarChart3 size={20} />, label: t('analytics'), path: '/dashboard/supplier/analytics' },
    { icon: <User size={20} />, label: t('profile'), path: '/dashboard/supplier/profile' },
    { icon: <Settings size={20} />, label: t('settings'), path: '/dashboard/supplier/settings' },
  ];

  const links = type === 'buyer' ? buyerLinks : supplierLinks;

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar */}
      <aside className="w-72 bg-white border-r border-slate-200 hidden lg:flex flex-col sticky top-0 h-screen">
        <div className="p-8 border-b border-slate-100">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-viet-red rounded-lg flex items-center justify-center text-viet-gold">
              <Globe size={18} />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-bold text-slate-900 leading-none tracking-tight">MADE IN</span>
              <span className="text-sm font-bold text-viet-red leading-none tracking-tight">VIETNAM</span>
            </div>
          </Link>
        </div>

        <div className="flex-1 p-6 space-y-2 overflow-y-auto">
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
            />
          ))}
        </div>

        <div className="p-6 border-t border-slate-100">
          <div className="bg-slate-900 rounded-2xl p-4 mb-6 relative overflow-hidden group cursor-pointer">
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
          <button className="flex items-center gap-3 px-4 py-3 w-full rounded-xl text-sm font-bold text-slate-500 hover:bg-red-50 hover:text-viet-red transition-all">
            <LogOut size={20} />
            <span>{t('sign_out')}</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0">
        <header className="h-20 bg-white border-b border-slate-200 flex items-center justify-between px-8 sticky top-0 z-30">
          <h2 className="text-xl font-bold text-slate-900">
            {links.find(l => l.path === location.pathname)?.label || t('dashboard')}
          </h2>
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-3">
              <div className="text-right hidden sm:block">
                <div className="text-sm font-bold text-slate-900">Hoai Bao</div>
                <div className="text-[10px] text-slate-500 font-medium uppercase tracking-wider">{type === 'buyer' ? t('buyer') : t('supplier')} {t('account')}</div>
              </div>
              <div className="w-10 h-10 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-400 font-bold">
                HB
              </div>
            </div>
          </div>
        </header>
        <div className="p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
