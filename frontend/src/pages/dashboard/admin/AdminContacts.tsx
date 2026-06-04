import React, { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
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
        const res = await api.get('/contact', { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } });
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
      await api.patch(`/contact/${id}/read`, {}, { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } });
      setContacts(prev => prev.map(c => c.id === id ? { ...c, isRead: true } : c));
    } catch { /* silent */ }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this feedback?')) return;
    try {
      await api.delete(`/contact/${id}`, { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } });
      setContacts(prev => prev.filter(c => c.id !== id));
    } catch { /* silent */ }
  };

  return (
    <div>
      <h1 className="wp-page-title">Feedbacks</h1>

      <div className="wp-filter-tabs">
        {[
          { key: 'all', label: 'All', count: contacts.length },
          { key: 'unread', label: 'Pending', count: contacts.filter(c => !c.isRead).length },
          { key: 'read', label: 'Approved', count: contacts.filter(c => c.isRead).length },
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
            <option>Bulk actions</option>
            <option>Mark as Read</option>
            <option>Delete</option>
          </select>
          <button className="wp-btn">Apply</button>
        </div>
      </div>

      {loading ? (
        <div className="wp-loading">Loading feedbacks...</div>
      ) : (
        <div className="wp-table-wrap">
          <table className="wp-table">
            <thead>
              <tr>
                <th style={{ width: 30 }}><input type="checkbox" /></th>
                <th>Author</th>
                <th>Subject</th>
                <th>Content</th>
                <th>Date</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {paginated.length === 0 ? (
                <tr><td colSpan={6} style={{ textAlign: 'center', padding: 30, color: 'var(--wp-text-muted)' }}>No feedbacks found.</td></tr>
              ) : paginated.map(c => (
                <tr key={c.id} style={{ fontWeight: c.isRead ? 400 : 600 }}>
                  <td><input type="checkbox" /></td>
                  <td>
                    <div>
                      <strong style={{ color: 'var(--wp-accent)' }}>{c.fullName}</strong>
                      <div style={{ fontSize: 12, color: 'var(--wp-text-muted)' }}>{c.email}</div>
                    </div>
                  </td>
                  <td>
                    <span className="wp-row-title">{c.subject}</span>
                    <div className="wp-row-actions">
                      {!c.isRead && <><button onClick={() => handleMarkRead(c.id)}>Approve</button><span className="sep">|</span></>}
                      {!c.isRead && <><button>Reject</button><span className="sep">|</span></>}
                      <button className="trash" onClick={() => handleDelete(c.id)}>Trash</button>
                    </div>
                  </td>
                  <td style={{ maxWidth: 300, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{c.message}</td>
                  <td style={{ fontSize: 12, color: 'var(--wp-text-muted)', whiteSpace: 'nowrap' }}>{new Date(c.createdAt).toLocaleDateString()}</td>
                  <td>
                    <span className={`wp-badge ${c.isRead ? 'wp-badge-approved' : 'wp-badge-pending'}`}>
                      {c.isRead ? 'Approved' : 'Pending'}
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
