import React, { useState } from 'react';
import { Search, Plus } from 'lucide-react';
import { WPPagination } from '../../../components/admin/WPPagination';

const staticPages = [
  { id: '1', title: 'Trang chủ', author: 'Admin', status: 'Published', created: '2026-01-15', updated: '2026-06-01', url: "/" },
  { id: '2', title: 'Giới thiệu & Liên hệ', author: 'Admin', status: 'Published', created: '2026-01-15', updated: '2026-05-20', url: "/about" },
  { id: '3', title: 'Chính sách bảo mật', author: 'Admin', status: 'Published', created: '2026-01-15', updated: '2026-03-10', url: "/privacy" },
  { id: '4', title: 'Điều khoản dịch vụ', author: 'Admin', status: 'Published', created: '2026-01-15', updated: '2026-03-10', url: "/terms" },
  { id: '5', title: 'Trung tâm trợ giúp', author: 'Admin', status: 'Published', created: '2026-02-01', updated: '2026-04-15', url: "/help" },
  { id: '6', title: 'Hướng dẫn bán hàng', author: 'Admin', status: 'Draft', created: '2026-03-01', updated: '2026-05-01', url: "#" },
];

export function AdminPages() {
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [page, setPage] = useState(1);
  const perPage = 20;

  const filtered = staticPages.filter(p => {
    const matchSearch = p.title.toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus === 'all' || p.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const paginated = filtered.slice((page - 1) * perPage, page * perPage);

  const statusCounts = {
    all: staticPages.length,
    Published: staticPages.filter(p => p.status === 'Published').length,
    Draft: staticPages.filter(p => p.status === 'Draft').length,
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
      <div className="wp-page-header">
        <h1 className="wp-page-title">
          Pages
          <button className="wp-page-title-btn"><Plus size={14} /> Add New</button>
        </h1>
      </div>

      {/* Filter tabs */}
      <div className="wp-filter-tabs">
        {Object.entries(statusCounts).map(([status, count], idx) => (
          <React.Fragment key={status}>
            {idx > 0 && <span className="wp-filter-sep">|</span>}
            <button className={`wp-filter-tab ${filterStatus === status ? 'active' : ''}`}
              onClick={() => { setFilterStatus(status); setPage(1); }}>
              {status === 'all' ? 'All' : status} <span className="count">({count})</span>
            </button>
          </React.Fragment>
        ))}
      </div>

      {/* Bulk + Search */}
      <div className="wp-table-top">
        <div className="wp-bulk-actions">
          <select className="wp-bulk-select">
            <option>Bulk actions</option>
            <option value="trash">Move to Trash</option>
          </select>
          <button className="wp-btn" onClick={() => {
            if (selectedIds.length === 0) return alert('No items selected.');
            alert(`Action would apply to ${selectedIds.length} items`);
          }}>Apply</button>
        </div>
        <div className="wp-table-search">
          <input type="text" placeholder="Search pages..." value={search}
            onChange={e => { setSearch(e.target.value); setPage(1); }} />
          <button className="wp-btn"><Search size={14} /> Search</button>
        </div>
      </div>

      {/* Table */}
      <div className="wp-table-wrap">
        <table className="wp-table">
          <thead>
            <tr>
              <th style={{ width: 30 }}><input type="checkbox" checked={selectedIds.length === paginated.length && paginated.length > 0} onChange={toggleAll} /></th>
              <th>Title</th>
              <th>Author</th>
              <th>Status</th>
              <th>Created</th>
              <th>Last Updated</th>
            </tr>
          </thead>
          <tbody>
            {paginated.map(p => (
              <tr key={p.id}>
                <td><input type="checkbox" checked={selectedIds.includes(p.id)} onChange={() => toggleOne(p.id)} /></td>
                <td>
                  <strong className="wp-row-title">{p.title}</strong>
                  {p.status === 'Draft' && <span style={{ color: 'var(--wp-text-muted)', fontWeight: 400 }}> — Draft</span>}
                  <div className="wp-row-actions">
                    <a href={p.url}>Edit</a>
                    <span className="sep">|</span>
                    <a href={p.url}>Quick Edit</a>
                    <span className="sep">|</span>
                    <button className="trash">Trash</button>
                    <span className="sep">|</span>
                    <a href={p.url}>View</a>
                  </div>
                </td>
                <td>{p.author}</td>
                <td><span className={`wp-badge ${p.status === 'Published' ? 'wp-badge-published' : 'wp-badge-draft'}`}>{p.status}</span></td>
                <td style={{ fontSize: 12, color: 'var(--wp-text-muted)' }}>{p.created}</td>
                <td style={{ fontSize: 12, color: 'var(--wp-text-muted)' }}>{p.updated}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <WPPagination page={page} perPage={perPage} total={filtered.length} onPageChange={setPage} />
    </div>
  );
}
