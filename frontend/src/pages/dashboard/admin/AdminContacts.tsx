import React, { useState, useEffect } from 'react';
import { WPPagination } from '../../../components/admin/WPPagination';
import { api } from '../../../lib/api';

export function AdminContacts() {
  const [contacts, setContacts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('all');
  const [page, setPage] = useState(1);
  const perPage = 20;

  useEffect(() => {
    const fetchContacts = async () => {
      try {
        const res = await api.get('/contact', {
          headers: { Authorization: `Bearer ${localStorage.getItem('mivn5_token')}` }
        });
        setContacts(res.data || []);
      } catch { /* silent */ }
      setLoading(false);
    };
    fetchContacts();
  }, []);

  const filtered = contacts.filter(c => {
    if (filterStatus === 'all') return true;
    if (filterStatus === 'read') return c.isRead;
    return !c.isRead;
  });

  const totalPages = Math.ceil(filtered.length / perPage);
  const paginated = filtered.slice((page - 1) * perPage, page * perPage);

  const handleMarkRead = async (id: string) => {
    try {
      await api.patch(`/contact/${id}/read`, {}, {
        headers: { Authorization: `Bearer ${localStorage.getItem('mivn5_token')}` }
      });
      setContacts(prev => prev.map(c => c.id === id ? { ...c, isRead: true } : c));
    } catch { /* silent */ }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa thư liên hệ này?')) return;
    try {
      await api.delete(`/contact/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('mivn5_token')}` }
      });
      setContacts(prev => prev.filter(c => c.id !== id));
    } catch { /* silent */ }
  };

  return (
    <div>
      <h1 className="wp-page-title">Danh sách liên hệ</h1>

      <div className="wp-filter-tabs">
        {[
          { key: 'all', label: 'Tất cả', count: contacts.length },
          { key: 'unread', label: 'Chưa đọc', count: contacts.filter(c => !c.isRead).length },
          { key: 'read', label: 'Đã đọc', count: contacts.filter(c => c.isRead).length },
        ].map((tab, idx) => (
          <React.Fragment key={tab.key}>
            {idx > 0 && <span className="wp-filter-sep">|</span>}
            <button className={`wp-filter-tab ${filterStatus === tab.key ? 'active' : ''}`}
              onClick={() => { setFilterStatus(tab.key); setPage(1); }}>
              {tab.label} <span className="count">({tab.count})</span>
            </button>
          </React.Fragment>
        ))}
      </div>

      <div className="wp-table-top">
        <div className="wp-bulk-actions">
          <select className="wp-bulk-select">
            <option>Chọn thao tác</option>
            <option value="read">Đánh dấu đã đọc</option>
            <option value="delete">Xóa</option>
          </select>
          <button className="wp-btn">Áp dụng</button>
        </div>
      </div>

      {loading ? (
        <div className="wp-loading">Đang tải danh sách liên hệ...</div>
      ) : (
        <div className="wp-table-wrap">
          <table className="wp-table">
            <thead>
              <tr>
                <th style={{ width: 30 }}><input type="checkbox" /></th>
                <th style={{ width: 180 }}>Họ tên</th>
                <th style={{ width: 200 }}>Email</th>
                <th style={{ width: 220 }}>Tiêu đề</th>
                <th>Nội dung</th>
                <th style={{ width: 120 }}>Ngày gửi</th>
                <th style={{ width: 110 }}>Trạng thái</th>
              </tr>
            </thead>
            <tbody>
              {paginated.length === 0 ? (
                <tr>
                  <td colSpan={7} style={{ textAlign: 'center', padding: 30, color: 'var(--wp-text-muted)' }}>
                    Không tìm thấy liên hệ nào.
                  </td>
                </tr>
              ) : paginated.map(c => (
                <tr key={c.id} style={{ fontWeight: c.isRead ? 400 : 600 }}>
                  <td><input type="checkbox" /></td>
                  <td>
                    <strong style={{ color: 'var(--wp-accent)' }}>{c.fullName}</strong>
                  </td>
                  <td>
                    <span style={{ color: 'var(--wp-text-muted)' }}>{c.email}</span>
                  </td>
                  <td>
                    <span className="wp-row-title">{c.subject}</span>
                    <div className="wp-row-actions">
                      {!c.isRead && (
                        <>
                          <button onClick={() => handleMarkRead(c.id)}>Đã đọc</button>
                          <span className="sep">|</span>
                        </>
                      )}
                      <button className="trash" onClick={() => handleDelete(c.id)}>Xóa</button>
                    </div>
                  </td>
                  <td style={{ maxWidth: 400, wordBreak: 'break-word', whiteSpace: 'pre-wrap', fontSize: 13 }}>
                    {c.message}
                  </td>
                  <td style={{ fontSize: 12, color: 'var(--wp-text-muted)', whiteSpace: 'nowrap' }}>
                    {new Date(c.createdAt).toLocaleString('vi-VN', { dateStyle: 'short', timeStyle: 'short' })}
                  </td>
                  <td>
                    <span className={`wp-badge ${c.isRead ? 'wp-badge-published' : 'wp-badge-pending'}`}>
                      {c.isRead ? 'Đã đọc' : 'Chưa đọc'}
                    </span>
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
