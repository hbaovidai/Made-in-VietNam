import React, { useState } from 'react';
import { Link, useLocation, Outlet, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, FileText, MessageSquare, Package,
  Users, Settings, LogOut, Menu, Bell, Search,
  ChevronDown, ChevronRight, ExternalLink, Home, UserPlus, User,
  FolderOpen, Tag, Star, Shield, Mail, Globe, List, Key
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useTranslation } from 'react-i18next';

interface SubMenuItem {
  label: string;
  path: string;
}

interface MenuItem {
  icon: React.ComponentType<{ size?: number }>;
  label: string;
  path: string;
  children?: SubMenuItem[];
}

const baseMenuItems = (t: (key: string) => string): MenuItem[] => [
  {
    icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard/admin',
    children: [{ label: 'Tổng quan', path: '/dashboard/admin' }],
  },
  {
    icon: FileText, label: 'Pages', path: '/dashboard/admin/pages',
  },
  {
    icon: MessageSquare, label: 'Feedbacks', path: '/dashboard/admin/contacts',
  },
  {
    icon: Package, label: 'Products', path: '/dashboard/admin/products',
    children: [
      { label: 'Tất cả sản phẩm', path: '/dashboard/admin/products' },
      { label: 'Thêm sản phẩm', path: '/dashboard/admin/products/add' },
      { label: 'Thương hiệu', path: '/dashboard/admin/products/brands' },
      { label: 'Danh mục', path: '/dashboard/admin/categories' },
      { label: 'Thuộc tính', path: '/dashboard/admin/products/attributes' },
      { label: 'Đánh giá', path: '/dashboard/admin/products/reviews' },
    ],
  },
  {
    icon: Users, label: 'Users', path: '/dashboard/admin/users',
    children: [
      { label: 'Tất cả người dùng', path: '/dashboard/admin/users' },
      { label: 'Thêm người dùng', path: '/dashboard/admin/users/add' },
    ],
  },
  {
    icon: Mail, label: t('req_menu_label'), path: '/dashboard/admin/requests',
    children: [
      { label: t('req_all_requests'), path: '/dashboard/admin/requests' },
      { label: t('req_customers'), path: '/dashboard/admin/requests?tab=customers' },
    ],
  },
  {
    icon: MessageSquare, label: t('msg_menu_label'), path: '/dashboard/admin/messages',
  },
  {
    icon: Shield, label: 'Doanh nghiệp', path: '/dashboard/admin/verifications',
    children: [
      { label: 'Tất cả doanh nghiệp', path: '/dashboard/admin/verifications' },
      { label: 'Link mời', path: '/dashboard/admin/verifications?tab=tokens' },
    ],
  },
  {
    icon: Settings, label: 'Settings', path: '/dashboard/admin/settings',
  },
];

export function WPAdminLayout() {
  const { user, logout } = useAuth();
  const { t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const menuItems = baseMenuItems(t);
  const [expandedMenus, setExpandedMenus] = useState<string[]>(() => {
    // Auto-expand the menu that matches current path
    const current = menuItems.find(m =>
      location.pathname === m.path || m.children?.some(c => c.path.split('?')[0] === location.pathname)
    );
    return current ? [current.label] : ['Dashboard'];
  });

  const handleLogout = () => { logout(); navigate('/login'); };

  const toggleMenu = (label: string) => {
    setExpandedMenus(prev =>
      prev.includes(label) ? prev.filter(l => l !== label) : [...prev, label]
    );
  };

  const isMenuActive = (item: MenuItem) => {
    if (location.pathname === item.path) return true;
    return item.children?.some(c => c.path.split('?')[0] === location.pathname) || false;
  };

  const isSubActive = (sub: SubMenuItem) => {
    const [subPath, subQuery] = sub.path.split('?');
    if (subPath !== location.pathname) return false;
    if (!subQuery) return !location.search || location.search === '?';
    return location.search === `?${subQuery}`;
  };

  return (
    <div className="wp-admin-root">
      {/* ═══ Admin Bar ═══ */}
      <div className="wp-admin-bar">
        <div className="wp-admin-bar-left">
          <Link to="/" className="wp-admin-bar-logo" title="Xem trang web">
            <Home size={16} />
            <span>VIEproduct</span>
            <ExternalLink size={10} />
          </Link>
        </div>
        <div className="wp-admin-bar-right">
          <div className="wp-admin-bar-search">
            <Search size={14} />
            <input type="text" placeholder="Tìm kiếm..." />
          </div>
          <button className="wp-admin-bar-btn">
            <Bell size={16} />
            <span className="wp-admin-bar-badge">3</span>
          </button>
          <div className="wp-admin-bar-profile" onClick={() => setProfileOpen(!profileOpen)}>
            <div className="wp-admin-bar-avatar">{user?.fullName?.charAt(0) || 'A'}</div>
            <span className="wp-admin-bar-name">{user?.fullName || 'Admin'}</span>
            <ChevronDown size={12} />
            {profileOpen && (
              <div className="wp-admin-profile-dropdown">
                <div className="wp-admin-profile-header">
                  <div className="wp-admin-profile-avatar-lg">{user?.fullName?.charAt(0) || 'A'}</div>
                  <div>
                    <div className="wp-admin-profile-name">{user?.fullName}</div>
                    <div className="wp-admin-profile-email">{user?.email}</div>
                    <span className="wp-admin-profile-role">{user?.role === 'ADMIN' ? 'Quản trị viên' : user?.role === 'SUPPLIER' ? 'Doanh nghiệp' : 'Khách hàng'}</span>
                  </div>
                </div>
                <div className="wp-admin-profile-divider" />
                <Link to="/dashboard/admin/profile" className="wp-admin-profile-item" onClick={() => setProfileOpen(false)}><User size={14} /><span>Hồ sơ cá nhân</span></Link>
                <Link to="/dashboard/admin/profile?tab=settings" className="wp-admin-profile-item" onClick={() => setProfileOpen(false)}><Settings size={14} /><span>Cài đặt tài khoản</span></Link>
                <Link to="/dashboard/admin/profile?tab=password" className="wp-admin-profile-item" onClick={() => setProfileOpen(false)}><Key size={14} /><span>Đổi mật khẩu</span></Link>
                <div className="wp-admin-profile-divider" />
                <Link to="/" className="wp-admin-profile-item"><Globe size={14} /><span>Xem trang web</span></Link>
                <button onClick={handleLogout} className="wp-admin-profile-logout"><LogOut size={14} /><span>Đăng xuất</span></button>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="wp-admin-body">
        {mobileOpen && <div className="wp-sidebar-overlay" onClick={() => setMobileOpen(false)} />}

        {/* ═══ Sidebar ═══ */}
        <aside className={`wp-sidebar ${collapsed ? 'collapsed' : ''} ${mobileOpen ? 'mobile-open' : ''}`}>
          <div className="wp-sidebar-header">
            <Link to="/dashboard/admin" className="wp-sidebar-logo">
              <div className="wp-sidebar-logo-icon">V</div>
              {!collapsed && <span className="wp-sidebar-logo-text">VIEproduct</span>}
            </Link>
          </div>

          <nav className="wp-sidebar-nav">
            {menuItems.map((item) => {
              const active = isMenuActive(item);
              const expanded = expandedMenus.includes(item.label);
              const hasChildren = item.children && item.children.length > 0;

              return (
                <div key={item.label} className={`wp-menu-group ${active ? 'active' : ''}`}>
                  {/* Parent item */}
                  <div
                    className={`wp-sidebar-item wp-menu-parent ${active ? 'active' : ''}`}
                    onClick={() => {
                      if (collapsed) { navigate(item.path); return; }
                      if (hasChildren) { toggleMenu(item.label); }
                      else { navigate(item.path); }
                    }}
                    title={collapsed ? item.label : undefined}
                  >
                    <item.icon size={18} />
                    {!collapsed && (
                      <>
                        <span className="wp-sidebar-item-label">{item.label}</span>
                        {hasChildren && (
                          <span className={`wp-menu-arrow ${expanded ? 'open' : ''}`}>
                            <ChevronDown size={14} />
                          </span>
                        )}
                      </>
                    )}
                  </div>

                  {/* Submenu */}
                  {!collapsed && hasChildren && expanded && (
                    <div className="wp-submenu">
                      {item.children!.map((sub) => (
                        <Link
                          key={sub.path}
                          to={sub.path}
                          className={`wp-submenu-item ${isSubActive(sub) ? 'active' : ''}`}
                          onClick={() => setMobileOpen(false)}
                        >
                          {sub.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </nav>

          {/* Collapse toggle */}
          <div className="wp-sidebar-footer">
            <button className="wp-sidebar-item wp-sidebar-collapse-toggle"
              onClick={() => setCollapsed(!collapsed)}
              title={collapsed ? 'Mở rộng menu' : 'Thu gọn menu'}>
              {collapsed ? <ChevronRight size={18} /> : <ChevronDown size={18} />}
              {!collapsed && <span className="wp-sidebar-item-label">Thu gọn menu</span>}
            </button>
          </div>
        </aside>

        {/* ═══ Main Content ═══ */}
        <main className={`wp-main ${collapsed ? 'sidebar-collapsed' : ''}`}>
          <div className="wp-mobile-header">
            <button onClick={() => setMobileOpen(true)} className="wp-mobile-menu-btn"><Menu size={20} /></button>
            <span className="wp-mobile-title">VIEproduct Admin</span>
          </div>
          <div className="wp-content"><Outlet /></div>
        </main>
      </div>

      {profileOpen && <div className="wp-admin-click-away" onClick={() => setProfileOpen(false)} />}
    </div>
  );
}
