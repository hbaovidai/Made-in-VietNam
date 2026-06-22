import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { api } from '../../../lib/api';
import { useAuth } from '../../../contexts/AuthContext';
import { Eye, EyeOff, User, Shield, Key, Clock, Settings, Bell, Globe, Moon, Sun } from 'lucide-react';
import { SupplierStatus } from '@/src/lib/enums';

type TabKey = 'profile' | 'account' | 'password' | 'activity' | 'settings';

export function AdminUserProfile() {
  const { user: me } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const initialTab = (searchParams.get('tab') as TabKey) || 'profile';
  const [activeTab, setActiveTab] = useState<TabKey>(initialTab);

  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Editable profile fields
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');

  // Password fields
  const [oldPw, setOldPw] = useState('');
  const [newPw, setNewPw] = useState('');
  const [confirmPw, setConfirmPw] = useState('');
  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  // Activity logs
  const [activities, setActivities] = useState<any[]>([]);
  const [loadingActivity, setLoadingActivity] = useState(false);

  // Account settings
  const [lang, setLang] = useState(localStorage.getItem('wp_lang') || 'vi');
  const [theme, setTheme] = useState(localStorage.getItem('wp_theme') || 'light');
  const [emailNotif, setEmailNotif] = useState(localStorage.getItem('wp_email_notif') !== 'false');
  const [sysNotif, setSysNotif] = useState(localStorage.getItem('wp_sys_notif') !== 'false');

  useEffect(() => {
    const load = async () => {
      try {
        const res = await api.get(`/auth/profile/${me?.id}`, { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } });
        setProfile(res.data);
        setFullName(res.data.fullName || '');
        setPhone(res.data.phone || '');
      } catch { /* silent */ }
      setLoading(false);
    };
    load();
  }, [me?.id]);

  useEffect(() => {
    const t = searchParams.get('tab') as TabKey;
    if (t && ['profile', 'account', 'password', 'activity', 'settings'].includes(t)) setActiveTab(t);
  }, [searchParams]);

  const switchTab = (tab: TabKey) => {
    setActiveTab(tab);
    setSearchParams(tab === 'profile' ? {} : { tab });
    setMsg(null);
  };

  // Load activity when tab opens
  useEffect(() => {
    if (activeTab !== 'activity' || activities.length > 0) return;
    setLoadingActivity(true);
    api.get('/audit-logs?limit=20', { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } })
      .then(res => setActivities(res.data?.data || []))
      .catch(() => {})
      .finally(() => setLoadingActivity(false));
  }, [activeTab]);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setMsg(null);
    setSaving(true);
    try {
      await api.put(`/auth/profile/${me?.id}`, { fullName, phone }, { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } });
      setProfile((p: any) => ({ ...p, fullName, phone }));
      setMsg({ type: 'success', text: 'Hồ sơ đã được cập nhật thành công.' });
    } catch (err: any) {
      setMsg({ type: 'error', text: err?.response?.data?.message || 'Không thể cập nhật.' });
    }
    setSaving(false);
  };

  const handleChangePw = async (e: React.FormEvent) => {
    e.preventDefault();
    setMsg(null);
    if (newPw.length < 8) { setMsg({ type: 'error', text: 'Mật khẩu mới tối thiểu 8 ký tự.' }); return; }
    if (newPw !== confirmPw) { setMsg({ type: 'error', text: 'Mật khẩu xác nhận không khớp.' }); return; }
    setSaving(true);
    try {
      await api.put(`/auth/password/${me?.id}`, { oldPassword: oldPw, newPassword: newPw }, { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } });
      setMsg({ type: 'success', text: 'Đổi mật khẩu thành công.' });
      setOldPw(''); setNewPw(''); setConfirmPw('');
    } catch (err: any) {
      setMsg({ type: 'error', text: err?.response?.data?.message || 'Mật khẩu cũ không đúng.' });
    }
    setSaving(false);
  };

  const handleSaveSettings = () => {
    localStorage.setItem('wp_lang', lang);
    localStorage.setItem('wp_theme', theme);
    localStorage.setItem('wp_email_notif', String(emailNotif));
    localStorage.setItem('wp_sys_notif', String(sysNotif));
    setMsg({ type: 'success', text: 'Cài đặt đã được lưu.' });
  };

  const roleLabels: Record<string, string> = { ADMIN: 'Quản trị viên', SUPPLIER: 'Doanh nghiệp', BUYER: 'Khách hàng' };
  const roleColors: Record<string, string> = { ADMIN: '#2271b1', SUPPLIER: '#00a32a', BUYER: '#646970' };

  const formatTime = (d: string) => {
    const diff = Date.now() - new Date(d).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return 'Vừa xong';
    if (mins < 60) return `${mins} phút trước`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs} giờ trước`;
    return `${Math.floor(hrs / 24)} ngày trước`;
  };

  const tabs: { key: TabKey; icon: React.ComponentType<any>; label: string }[] = [
    { key: 'profile', icon: User, label: 'Thông tin cá nhân' },
    { key: 'account', icon: Shield, label: 'Thông tin tài khoản' },
    { key: 'password', icon: Key, label: 'Đổi mật khẩu' },
    { key: 'activity', icon: Clock, label: 'Hoạt động gần đây' },
    { key: 'settings', icon: Settings, label: 'Cài đặt tài khoản' },
  ];

  if (loading) return <div className="wp-loading">Đang tải hồ sơ...</div>;
  if (!profile) return <div className="wp-loading">Không tìm thấy hồ sơ.</div>;

  const PwInput = ({ val, set, show, toggle, placeholder }: any) => (
    <div style={{ position: 'relative', maxWidth: 400 }}>
      <input type={show ? 'text' : 'password'} className="wp-form-input" style={{ maxWidth: '100%', paddingRight: 36 }}
        value={val} onChange={e => set(e.target.value)} placeholder={placeholder} required />
      <button type="button" onClick={toggle} style={{ position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--wp-text-muted)' }}>
        {show ? <EyeOff size={16} /> : <Eye size={16} />}
      </button>
    </div>
  );

  return (
    <div>
      <div className="wp-breadcrumb">
        <Link to="/dashboard/admin">Dashboard</Link>
        <span className="wp-breadcrumb-sep">›</span>
        <span className="wp-breadcrumb-current">Hồ sơ cá nhân</span>
      </div>

      <h1 className="wp-page-title">Hồ sơ cá nhân</h1>

      {msg && (
        <div style={{ background: msg.type === 'success' ? '#d1e4dd' : '#fcf0f1', border: `1px solid ${msg.type === 'success' ? '#00a32a' : 'var(--wp-danger)'}`, padding: '10px 16px', marginBottom: 16, borderRadius: 4, fontSize: 13, color: msg.type === 'success' ? '#1e4620' : 'var(--wp-danger)' }}>
          {msg.text}
        </div>
      )}

      {/* Profile Header Card */}
      <div className="wp-card" style={{ marginBottom: 20 }}>
        <div className="wp-card-body" style={{ display: 'flex', alignItems: 'center', gap: 20, padding: 20 }}>
          <div style={{ width: 72, height: 72, borderRadius: '50%', background: roleColors[profile.role] || '#646970', color: '#fff', fontSize: 26, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, border: '3px solid var(--wp-border)' }}>
            {profile.avatar ? <img src={profile.avatar} alt="" style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} /> : (profile.fullName?.charAt(0) || '?')}
          </div>
          <div>
            <div style={{ fontSize: 18, fontWeight: 700 }}>{profile.fullName}</div>
            <div style={{ fontSize: 13, color: 'var(--wp-text-muted)', marginTop: 2 }}>{profile.email}</div>
            <span className={`wp-badge ${profile.role === 'ADMIN' ? 'wp-badge-published' : profile.role === 'SUPPLIER' ? 'wp-badge-pending' : 'wp-badge-draft'}`} style={{ marginTop: 6, display: 'inline-block' }}>
              {roleLabels[profile.role] || profile.role}
            </span>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div style={{ display: 'flex', gap: 0, borderBottom: '1px solid var(--wp-border)', marginBottom: 20 }}>
        {tabs.map(t => (
          <button key={t.key} onClick={() => switchTab(t.key)} style={{
            display: 'flex', alignItems: 'center', gap: 6, padding: '10px 16px', fontSize: 13, fontWeight: activeTab === t.key ? 600 : 400,
            background: 'none', border: 'none', borderBottom: activeTab === t.key ? '2px solid var(--wp-accent)' : '2px solid transparent',
            color: activeTab === t.key ? 'var(--wp-accent)' : 'var(--wp-text-muted)', cursor: 'pointer', transition: 'all .15s'
          }}>
            <t.icon size={14} /> {t.label}
          </button>
        ))}
      </div>

      {/* ═══ Tab: Thông tin cá nhân ═══ */}
      {activeTab === 'profile' && (
        <div className="wp-card">
          <div className="wp-card-header"><span className="wp-card-title">Thông tin cá nhân</span></div>
          <div className="wp-card-body">
            <form onSubmit={handleUpdateProfile}>
              <table className="wp-form-table">
                <tbody>
                  <tr>
                    <th style={{ width: 180, fontSize: 13 }}>Ảnh đại diện</th>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                        <div style={{ width: 64, height: 64, borderRadius: '50%', background: roleColors[profile.role], color: '#fff', fontSize: 22, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px solid var(--wp-border)' }}>
                          {profile.fullName?.charAt(0) || '?'}
                        </div>
                        <p className="wp-form-desc" style={{ margin: 0 }}>Ảnh đại diện quản lý qua <a href="https://gravatar.com" target="_blank" rel="noreferrer" style={{ color: 'var(--wp-accent)' }}>Gravatar</a>.</p>
                      </div>
                    </td>
                  </tr>
                  <tr><th style={{ fontSize: 13 }}>Họ và tên</th><td><input type="text" className="wp-form-input" style={{ maxWidth: 400 }} value={fullName} onChange={e => setFullName(e.target.value)} /></td></tr>
                  <tr><th style={{ fontSize: 13 }}>Email</th><td><input type="email" className="wp-form-input" style={{ maxWidth: 400, background: '#f0f0f1' }} value={profile.email} disabled /><p className="wp-form-desc">Email không thể thay đổi.</p></td></tr>
                  <tr><th style={{ fontSize: 13 }}>Số điện thoại</th><td><input type="tel" className="wp-form-input" style={{ maxWidth: 400 }} value={phone} onChange={e => setPhone(e.target.value)} placeholder="0901234567" /></td></tr>
                  <tr><th style={{ fontSize: 13 }}>Ngày tham gia</th><td style={{ fontSize: 13, color: 'var(--wp-text-muted)' }}>{profile.createdAt ? new Date(profile.createdAt).toLocaleDateString('vi-VN', { year: 'numeric', month: 'long', day: 'numeric' }) : '—'}</td></tr>
                  <tr><th style={{ fontSize: 13 }}>Vai trò</th><td><span className={`wp-badge ${profile.role === 'ADMIN' ? 'wp-badge-published' : 'wp-badge-draft'}`}>{roleLabels[profile.role]}</span></td></tr>
                </tbody>
              </table>
              <div style={{ borderTop: '1px solid var(--wp-border-light)', paddingTop: 16, marginTop: 8 }}>
                <button type="submit" className="wp-btn wp-btn-primary" disabled={saving}>{saving ? 'Đang lưu...' : 'Cập nhật thông tin'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ═══ Tab: Thông tin tài khoản ═══ */}
      {activeTab === 'account' && (
        <div className="wp-card">
          <div className="wp-card-header"><span className="wp-card-title">Thông tin tài khoản</span></div>
          <div className="wp-card-body">
            <table className="wp-form-table">
              <tbody>
                <tr><th style={{ width: 180, fontSize: 13 }}>Username</th><td><input className="wp-form-input" style={{ maxWidth: 400, background: '#f0f0f1' }} value={profile.email?.split('@')[0] || ''} disabled /><p className="wp-form-desc">Username không thể thay đổi.</p></td></tr>
                <tr><th style={{ fontSize: 13 }}>Email đăng nhập</th><td style={{ fontSize: 13 }}>{profile.email}</td></tr>
                <tr><th style={{ fontSize: 13 }}>Vai trò</th><td><span className={`wp-badge ${profile.role === 'ADMIN' ? 'wp-badge-published' : profile.role === 'SUPPLIER' ? 'wp-badge-pending' : 'wp-badge-draft'}`}>{roleLabels[profile.role]}</span></td></tr>
                <tr><th style={{ fontSize: 13 }}>Trạng thái</th><td><span className={`wp-badge ${profile.status === 'ACTIVE' ? 'wp-badge-approved' : 'wp-badge-rejected'}`}>{profile.status === 'ACTIVE' ? 'Hoạt động' : 'Bị khóa'}</span></td></tr>
                {profile.supplier && (
                  <tr><th style={{ fontSize: 13 }}>Doanh nghiệp</th><td><strong>{profile.supplier.companyName}</strong>{profile.supplier.status === SupplierStatus.VERIFIED && <span className="wp-badge wp-badge-approved" style={{ marginLeft: 8 }}>Đã xác minh</span>}</td></tr>
                )}
                <tr><th style={{ fontSize: 13 }}>Ngày tạo</th><td style={{ fontSize: 13, color: 'var(--wp-text-muted)' }}>{profile.createdAt ? new Date(profile.createdAt).toLocaleDateString('vi-VN', { year: 'numeric', month: 'long', day: 'numeric' }) : '—'}</td></tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ═══ Tab: Đổi mật khẩu ═══ */}
      {activeTab === 'password' && (
        <div className="wp-card">
          <div className="wp-card-header"><span className="wp-card-title">Đổi mật khẩu</span></div>
          <div className="wp-card-body">
            <form onSubmit={handleChangePw}>
              <table className="wp-form-table">
                <tbody>
                  <tr><th style={{ width: 180, fontSize: 13, verticalAlign: 'top', paddingTop: 12 }}>Mật khẩu hiện tại</th><td><PwInput val={oldPw} set={setOldPw} show={showOld} toggle={() => setShowOld(!showOld)} placeholder="Nhập mật khẩu hiện tại" /></td></tr>
                  <tr><th style={{ fontSize: 13, verticalAlign: 'top', paddingTop: 12 }}>Mật khẩu mới</th><td><PwInput val={newPw} set={setNewPw} show={showNew} toggle={() => setShowNew(!showNew)} placeholder="Tối thiểu 8 ký tự" /><p className="wp-form-desc">Mật khẩu mới phải có ít nhất 8 ký tự.</p></td></tr>
                  <tr><th style={{ fontSize: 13, verticalAlign: 'top', paddingTop: 12 }}>Xác nhận mật khẩu</th><td><PwInput val={confirmPw} set={setConfirmPw} show={showConfirm} toggle={() => setShowConfirm(!showConfirm)} placeholder="Nhập lại mật khẩu mới" /></td></tr>
                </tbody>
              </table>
              <div style={{ borderTop: '1px solid var(--wp-border-light)', paddingTop: 16, marginTop: 8 }}>
                <button type="submit" className="wp-btn wp-btn-primary" disabled={saving}>{saving ? 'Đang đổi...' : 'Cập nhật mật khẩu'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ═══ Tab: Hoạt động gần đây ═══ */}
      {activeTab === 'activity' && (
        <div className="wp-card">
          <div className="wp-card-header"><span className="wp-card-title">Hoạt động gần đây</span></div>
          <div className="wp-card-body" style={{ padding: 0 }}>
            {loadingActivity ? (
              <div className="wp-loading" style={{ padding: 30 }}>Đang tải...</div>
            ) : activities.length === 0 ? (
              <div style={{ textAlign: 'center', padding: 40, color: 'var(--wp-text-muted)', fontSize: 13 }}>Chưa có hoạt động nào được ghi nhận.</div>
            ) : (
              <table className="wp-table" style={{ margin: 0 }}>
                <thead>
                  <tr><th>Thời gian</th><th>Hành động</th><th>Đối tượng</th><th>Chi tiết</th></tr>
                </thead>
                <tbody>
                  {activities.map((a, i) => (
                    <tr key={i}>
                      <td style={{ fontSize: 12, color: 'var(--wp-text-muted)', whiteSpace: 'nowrap' }}>{formatTime(a.createdAt)}</td>
                      <td><span className="wp-badge wp-badge-draft">{a.action}</span></td>
                      <td style={{ fontWeight: 500 }}>{a.targetName || a.targetType || '—'}</td>
                      <td style={{ fontSize: 12, color: 'var(--wp-text-muted)' }}>{a.details || a.ipAddress || '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      )}

      {/* ═══ Tab: Cài đặt tài khoản ═══ */}
      {activeTab === 'settings' && (
        <div className="wp-card">
          <div className="wp-card-header"><span className="wp-card-title">Cài đặt tài khoản</span></div>
          <div className="wp-card-body">
            <table className="wp-form-table">
              <tbody>
                <tr>
                  <th style={{ width: 180, fontSize: 13 }}>Ngôn ngữ hệ thống</th>
                  <td>
                    <select className="wp-bulk-select" style={{ width: 250 }} value={lang} onChange={e => setLang(e.target.value)}>
                      <option value="vi">Tiếng Việt</option>
                      <option value="en">English</option>
                    </select>
                  </td>
                </tr>
                <tr>
                  <th style={{ fontSize: 13 }}>Giao diện</th>
                  <td>
                    <div style={{ display: 'flex', gap: 12 }}>
                      {[{ v: 'light', icon: Sun, label: 'Sáng' }, { v: 'dark', icon: Moon, label: 'Tối' }].map(opt => (
                        <label key={opt.v} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 16px', border: `2px solid ${theme === opt.v ? 'var(--wp-accent)' : 'var(--wp-border)'}`, borderRadius: 6, cursor: 'pointer', fontSize: 13, background: theme === opt.v ? '#f0f6fc' : 'transparent', transition: 'all .15s' }}>
                          <input type="radio" name="theme" value={opt.v} checked={theme === opt.v} onChange={e => setTheme(e.target.value)} style={{ display: 'none' }} />
                          <opt.icon size={16} /> {opt.label}
                        </label>
                      ))}
                    </div>
                  </td>
                </tr>
                <tr>
                  <th style={{ fontSize: 13, verticalAlign: 'top', paddingTop: 12 }}>Thông báo email</th>
                  <td>
                    <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontSize: 13 }}>
                      <input type="checkbox" checked={emailNotif} onChange={e => setEmailNotif(e.target.checked)} />
                      Nhận thông báo qua email khi có hoạt động mới
                    </label>
                  </td>
                </tr>
                <tr>
                  <th style={{ fontSize: 13, verticalAlign: 'top', paddingTop: 12 }}>Thông báo hệ thống</th>
                  <td>
                    <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontSize: 13 }}>
                      <input type="checkbox" checked={sysNotif} onChange={e => setSysNotif(e.target.checked)} />
                      Hiển thị thông báo trong hệ thống quản trị
                    </label>
                  </td>
                </tr>
              </tbody>
            </table>
            <div style={{ borderTop: '1px solid var(--wp-border-light)', paddingTop: 16, marginTop: 8 }}>
              <button type="button" className="wp-btn wp-btn-primary" onClick={handleSaveSettings}>Lưu cài đặt</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
