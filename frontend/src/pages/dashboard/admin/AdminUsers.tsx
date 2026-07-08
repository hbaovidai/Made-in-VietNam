import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Search } from 'lucide-react';
import { useSearchParams, Link } from 'react-router-dom';
import { WPPagination } from '../../../components/admin/WPPagination';
import { api } from '../../../lib/api';
import { useAuth } from '../../../contexts/AuthContext';

export function AdminUsers() {
  const { t } = useTranslation();
  const { user: me } = useAuth();
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [filterRole, setFilterRole] = useState('all');
  const [page, setPage] = useState(1);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [bulkAction, setBulkAction] = useState('');
  const perPage = 20;

  useEffect(() => {
    setSearch(searchParams.get('search') || '');
  }, [searchParams]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await api.get('/users', { headers: { Authorization: `Bearer ${localStorage.getItem('mivn5_token')}` } });
        const data = res.data;
        setUsers(Array.isArray(data) ? data : (data?.users || data?.data || []));
      } catch { /* silent */ }
      setLoading(false);
    };
    fetchUsers();
  }, []);

  const filtered = users.filter(u => {
    const matchSearch = !search ||
      u.fullName?.toLowerCase().includes(search.toLowerCase()) ||
      u.email?.toLowerCase().includes(search.toLowerCase());
    const matchRole = filterRole === 'all' || u.role === filterRole;
    return matchSearch && matchRole;
  });

  const totalPages = Math.ceil(filtered.length / perPage);
  const paginated = filtered.slice((page - 1) * perPage, page * perPage);

  const roleCounts = {
    all: users.length,
    ADMIN: users.filter(u => u.role === 'ADMIN').length,
    SUPPLIER: users.filter(u => u.role === 'SUPPLIER').length,
    BUYER: users.filter(u => u.role === 'BUYER').length,
  };

  const roleLabels: Record<string, string> = {
    all: 'Tất cả',
    ADMIN: 'Quản trị viên',
    SUPPLIER: 'Doanh nghiệp',
    BUYER: 'Khách hàng',
  };

  const handleStatusChange = async (userId: string, status: string) => {
    try {
      await api.put(`/users/${userId}/status`, { status }, { headers: { Authorization: `Bearer ${localStorage.getItem('mivn5_token')}` } });
      setUsers(prev => prev.map(u => u.id === userId ? { ...u, status } : u));
    } catch { /* silent */ }
  };

  const handleRoleChange = async (userId: string, role: string) => {
    try {
      await api.put(`/users/${userId}/role`, { role }, { headers: { Authorization: `Bearer ${localStorage.getItem('mivn5_token')}` } });
      setUsers(prev => prev.map(u => u.id === userId ? { ...u, role } : u));
    } catch (err: any) {
      alert(err?.response?.data?.message || 'Không thể thay đổi vai trò.');
    }
  };

  const handleBulkAction = async () => {
    if (!bulkAction) {
      alert('Vui lòng chọn một thao tác hàng loạt.');
      return;
    }
    if (selectedIds.length === 0) {
      alert('Vui lòng chọn ít nhất một người dùng.');
      return;
    }

    if (bulkAction === 'delete') {
      if (!window.confirm(`Bạn có chắc chắn muốn xóa ${selectedIds.length} người dùng đã chọn?`)) return;
      setLoading(true);
      try {
        await Promise.all(
          selectedIds.map(id =>
            id !== me?.id ? api.delete(`/users/${id}`, { headers: { Authorization: `Bearer ${localStorage.getItem('mivn5_token')}` } }) : Promise.resolve()
          )
        );
        setUsers(prev => prev.filter(u => !selectedIds.includes(u.id)));
        setSelectedIds([]);
        alert('Đã xóa các người dùng thành công.');
      } catch {
        alert('Có lỗi xảy ra khi xóa người dùng.');
      }
      setLoading(false);
    } else if (bulkAction === 'lock') {
      setLoading(true);
      try {
        await Promise.all(
          selectedIds.map(id =>
            id !== me?.id ? api.put(`/users/${id}/status`, { status: 'SUSPENDED' }, { headers: { Authorization: `Bearer ${localStorage.getItem('mivn5_token')}` } }) : Promise.resolve()
          )
        );
        setUsers(prev => prev.map(u => selectedIds.includes(u.id) && u.id !== me?.id ? { ...u, status: 'SUSPENDED' } : u));
        setSelectedIds([]);
        alert('Đã khóa tài khoản các người dùng đã chọn.');
      } catch {
        alert('Có lỗi xảy ra khi khóa tài khoản.');
      }
      setLoading(false);
    } else if (bulkAction === 'unlock') {
      setLoading(true);
      try {
        await Promise.all(
          selectedIds.map(id =>
            api.put(`/users/${id}/status`, { status: 'ACTIVE' }, { headers: { Authorization: `Bearer ${localStorage.getItem('mivn5_token')}` } })
          )
        );
        setUsers(prev => prev.map(u => selectedIds.includes(u.id) ? { ...u, status: 'ACTIVE' } : u));
        setSelectedIds([]);
        alert('Đã mở khóa các tài khoản đã chọn.');
      } catch {
        alert('Có lỗi xảy ra khi mở khóa tài khoản.');
      }
      setLoading(false);
    }
  };

  const handleDelete = async (userId: string) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa người dùng này?')) return;
    try {
      await api.delete(`/users/${userId}`, { headers: { Authorization: `Bearer ${localStorage.getItem('mivn5_token')}` } });
      setUsers(prev => prev.filter(u => u.id !== userId));
    } catch { /* silent */ }
  };

  const toggleAll = () => {
    if (selectedIds.length === paginated.length) setSelectedIds([]);
    else setSelectedIds(paginated.map(u => u.id));
  };

  const toggleOne = (id: string) => {
    setSelectedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  const getAvatarColor = (role: string) => {
    switch (role) {
      case 'ADMIN': return '#2271b1';
      case 'SUPPLIER': return '#00a32a';
      default: return '#646970';
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newParams = new URLSearchParams(searchParams);
    if (search.trim()) {
      newParams.set('search', search.trim());
    } else {
      newParams.delete('search');
    }
    newParams.set('page', '1');
    setSearchParams(newParams);
  };

  return (
    <div>
      {/* Breadcrumb */}
      <div className="wp-breadcrumb">
        <Link to="/dashboard/admin">Dashboard</Link>
        <span className="wp-breadcrumb-sep">›</span>
        <span>Users</span>
        <span className="wp-breadcrumb-sep">›</span>
        <span className="wp-breadcrumb-current">Tất cả người dùng</span>
      </div>

      <div className="wp-page-header">
        <h1 className="wp-page-title">
          Tất cả người dùng
          <Link to="/dashboard/admin/users/add" className="wp-page-title-btn">Thêm người dùng</Link>
        </h1>
      </div>

      {/* Filter Tabs */}
      <div className="wp-filter-tabs">
        {Object.entries(roleCounts).map(([role, count], idx) => (
          <React.Fragment key={role}>
            {idx > 0 && <span className="wp-filter-sep">|</span>}
            <button
              className={`wp-filter-tab ${filterRole === role ? 'active' : ''}`}
              onClick={() => { setFilterRole(role); setPage(1); }}
            >
              {roleLabels[role]} <span className="count">({count})</span>
            </button>
          </React.Fragment>
        ))}
      </div>

      {/* Search + Bulk Actions */}
      <div className="wp-table-top">
        <div className="wp-bulk-actions">
          <select className="wp-bulk-select" value={bulkAction} onChange={e => setBulkAction(e.target.value)}>
            <option value="">{t('thao_tac_hang_loat')}</option>
            <option value="delete">Xóa</option>
            <option value="lock">Khóa tài khoản</option>
            <option value="unlock">Mở khóa tài khoản</option>
          </select>
          <button className="wp-btn" onClick={handleBulkAction}>Áp dụng</button>
        </div>
        <form onSubmit={handleSearchSubmit} className="wp-table-search">
          <input
            type="text"
            placeholder="Tìm người dùng..."
            value={search}
            onChange={e => { setSearch(e.target.value); setPage(1); }}
          />
          <button type="submit" className="wp-btn"><Search size={14} /> Tìm kiếm</button>
        </form>
      </div>

      {/* Table */}
      {loading ? (
        <div className="wp-loading">{t('dang_tai_du_lieu_nguoi_dung')}</div>
      ) : (
        <div className="wp-table-wrap">
          <table className="wp-table">
            <thead>
              <tr>
                <th style={{ width: 30 }}>
                  <input type="checkbox" checked={selectedIds.length === paginated.length && paginated.length > 0} onChange={toggleAll} />
                </th>
                <th>Username</th>
                <th>Họ và tên</th>
                <th>Email</th>
                <th>Vai trò</th>
                <th>Trạng thái</th>
                <th>Ngày tạo</th>
              </tr>
            </thead>
            <tbody>
              {paginated.length === 0 ? (
                <tr><td colSpan={7} style={{ textAlign: 'center', padding: 30, color: 'var(--wp-text-muted)' }}>{t('khong_tim_thay_nguoi_dung_nao')}</td></tr>
              ) : paginated.map(u => (
                <tr key={u.id}>
                  <td><input type="checkbox" checked={selectedIds.includes(u.id)} onChange={() => toggleOne(u.id)} /></td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      {u.avatar ? (
                        <img
                          src={u.avatar}
                          alt={u.fullName}
                          style={{ width: 32, height: 32, borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }}
                        />
                      ) : (
                        <div style={{
                          width: 32, height: 32, borderRadius: '50%',
                          background: getAvatarColor(u.role),
                          color: '#fff', fontSize: 12, fontWeight: 700,
                          display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
                        }}>
                          {u.fullName?.charAt(0) || '?'}
                        </div>
                      )}
                      <div>
                        <Link to={`/dashboard/admin/profile?id=${u.id}`} className="wp-row-title">{u.email?.split('@')[0]}</Link>
                        <div className="wp-row-actions">
                          <Link to={`/dashboard/admin/profile?id=${u.id}`}>Xem hồ sơ</Link>
                          {u.id !== me?.id && (
                            <>
                              <span className="sep">|</span>
                              {u.status === 'ACTIVE' ? (
                                <button onClick={() => handleStatusChange(u.id, 'SUSPENDED')}>Khóa</button>
                              ) : (
                                <button style={{ color: '#00a32a' }} onClick={() => handleStatusChange(u.id, 'ACTIVE')}>Mở khóa</button>
                              )}
                              <span className="sep">|</span>
                              <button className="delete" onClick={() => handleDelete(u.id)}>Xóa</button>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td style={{ fontWeight: 500 }}>{u.fullName}</td>
                  <td><a href={`mailto:${u.email}`} style={{ color: 'var(--wp-accent)', textDecoration: 'none' }}>{u.email}</a></td>
                  <td>
                    <span className={`wp-badge ${u.role === 'ADMIN' ? 'wp-badge-published' : u.role === 'SUPPLIER' ? 'wp-badge-pending' : 'wp-badge-draft'}`}>
                      {roleLabels[u.role] || u.role}
                    </span>
                  </td>
                  <td>
                    <span className={`wp-badge ${u.status === 'ACTIVE' ? 'wp-badge-approved' : 'wp-badge-rejected'}`}>
                      {u.status === 'ACTIVE' ? 'Hoạt động' : 'Bị khóa'}
                    </span>
                  </td>
                  <td style={{ fontSize: 12, color: 'var(--wp-text-muted)', whiteSpace: 'nowrap' }}>
                    {new Date(u.createdAt).toLocaleDateString('vi-VN')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <WPPagination page={page} perPage={perPage} total={filtered.length} onPageChange={setPage} />
    </div>
  );
}
