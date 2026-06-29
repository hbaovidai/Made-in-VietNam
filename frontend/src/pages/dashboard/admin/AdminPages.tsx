import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, ExternalLink } from 'lucide-react';
import { WPPagination } from '../../../components/admin/WPPagination';
import { PAGE_REGISTRY, getPageGroups } from '../../../utils/pageRegistry';

export function AdminPages() {
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterGroup, setFilterGroup] = useState('all');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [page, setPage] = useState(1);
  const perPage = 20;

  const groups = getPageGroups();

  const filtered = PAGE_REGISTRY.filter(p => {
    const matchSearch = !search || p.title.toLowerCase().includes(search.toLowerCase()) || p.path.toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus === 'all' || p.status === filterStatus;
    const matchGroup = filterGroup === 'all' || p.group === filterGroup;
    return matchSearch && matchStatus && matchGroup;
  });

  const paginated = filtered.slice((page - 1) * perPage, page * perPage);

  const statusCounts = {
    all: PAGE_REGISTRY.length,
    Published: PAGE_REGISTRY.filter(p => p.status === 'Published').length,
    Draft: PAGE_REGISTRY.filter(p => p.status === 'Draft').length,
    Hidden: PAGE_REGISTRY.filter(p => p.status === 'Hidden').length,
  };

  const toggleAll = () => {
    if (selectedIds.length === paginated.length) setSelectedIds([]);
    else setSelectedIds(paginated.map(p => p.id));
  };

  const toggleOne = (id: string) => {
    setSelectedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  return (
    <div>
      {/* Breadcrumb */}
      <div className="wp-breadcrumb">
        <Link to="/dashboard/admin">Dashboard</Link>
        <span className="wp-breadcrumb-sep">›</span>
        <span className="wp-breadcrumb-current">Tất cả trang</span>
      </div>

      <div className="wp-page-header">
        <h1 className="wp-page-title">Tất cả trang</h1>
      </div>
      <p style={{ fontSize: 12, color: '#646970', marginTop: -12, marginBottom: 16 }}>
        Danh sách tự động cập nhật từ Page Registry. Thêm trang mới tại <code style={{ background: '#f0f0f1', padding: '1px 5px', borderRadius: 3 }}>src/utils/pageRegistry.ts</code>
      </p>

      {/* Filter tabs */}
      <div className="wp-filter-tabs">
        {Object.entries(statusCounts).filter(([, count]) => count > 0).map(([status, count], idx) => (
          <React.Fragment key={status}>
            {idx > 0 && <span className="wp-filter-sep">|</span>}
            <button className={`wp-filter-tab ${filterStatus === status ? 'active' : ''}`}
              onClick={() => { setFilterStatus(status); setPage(1); }}>
              {status === 'all' ? 'Tất cả' : status === 'Published' ? 'Đang hoạt động' : status === 'Draft' ? 'Bản nháp' : 'Đang ẩn'} <span className="count">({count})</span>
            </button>
          </React.Fragment>
        ))}
      </div>

      {/* Bulk + Search */}
      <div className="wp-table-top">
        <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
          <select className="wp-bulk-select" value={filterGroup} onChange={e => { setFilterGroup(e.target.value); setPage(1); }}>
            <option value="all">Tất cả nhóm</option>
            {groups.map(g => <option key={g} value={g}>{g}</option>)}
          </select>
        </div>
        <div className="wp-table-search">
          <input type="text" placeholder="Tìm trang..." value={search}
            onChange={e => { setSearch(e.target.value); setPage(1); }} />
          <button className="wp-btn"><Search size={14} /> Tìm</button>
        </div>
      </div>

      {/* Table */}
      <div className="wp-table-wrap">
        <table className="wp-table">
          <thead>
            <tr>
              <th style={{ width: 30 }}><input type="checkbox" checked={selectedIds.length === paginated.length && paginated.length > 0} onChange={toggleAll} /></th>
              <th>Tên trang</th>
              <th style={{ width: 200 }}>Đường dẫn</th>
              <th style={{ width: 100 }}>Nhóm</th>
              <th style={{ width: 100 }}>Trạng thái</th>
              <th style={{ width: 100 }}>Tác giả</th>
              <th style={{ width: 100 }}>Cập nhật</th>
            </tr>
          </thead>
          <tbody>
            {paginated.length === 0 ? (
              <tr><td colSpan={7} style={{ textAlign: 'center', padding: 40, color: '#646970' }}>Không tìm thấy trang nào.</td></tr>
            ) : paginated.map(p => (
              <tr key={p.id}>
                <td><input type="checkbox" checked={selectedIds.includes(p.id)} onChange={() => toggleOne(p.id)} /></td>
                <td>
                  <div>
                    <span className="wp-row-title">{p.title}</span>
                    {p.status === 'Draft' && <span style={{ color: 'var(--wp-text-muted)', fontWeight: 400 }}> — Bản nháp</span>}
                    {p.description && <div style={{ fontSize: 11, color: '#646970', marginTop: 1 }}>{p.description}</div>}
                    <div className="wp-row-actions">
                      <a href={p.path} target="_blank" rel="noopener noreferrer">Xem trang <ExternalLink size={10} style={{ verticalAlign: -1 }} /></a>
                      {p.id === 'p-terms' && (
                        <>
                          <span className="wp-row-actions-sep"> | </span>
                          <Link to="/dashboard/admin/legal">Thiết lập điều khoản</Link>
                        </>
                      )}
                      {p.id === 'p-privacy' && (
                        <>
                          <span className="wp-row-actions-sep"> | </span>
                          <Link to="/dashboard/admin/legal/privacy">Thiết lập chính sách</Link>
                        </>
                      )}
                    </div>
                  </div>
                </td>
                <td><code style={{ fontSize: 11, color: '#2271b1', background: '#f0f6fc', padding: '1px 5px', borderRadius: 3 }}>{p.path}</code></td>
                <td style={{ fontSize: 12 }}>{p.group}</td>
                <td><span className={`wp-badge ${p.status === 'Published' ? 'wp-badge-published' : p.status === 'Draft' ? 'wp-badge-draft' : 'wp-badge-pending'}`}>{p.status === 'Published' ? 'Hoạt động' : p.status === 'Draft' ? 'Nháp' : 'Ẩn'}</span></td>
                <td style={{ fontSize: 12, color: 'var(--wp-text-muted)' }}>{p.author}</td>
                <td style={{ fontSize: 12, color: 'var(--wp-text-muted)', fontFamily: 'monospace' }}>{p.updatedAt}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <WPPagination page={page} perPage={perPage} total={filtered.length} onPageChange={setPage} />
    </div>
  );
}
