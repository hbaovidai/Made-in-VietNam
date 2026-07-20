import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Star } from 'lucide-react';
import { WPPagination } from '../../../components/admin/WPPagination';
import { api } from '../../../lib/api';

function StarRating({ rating }: { rating: number }) {
  return (
    <div style={{ display: 'flex', gap: 1 }}>
      {[1, 2, 3, 4, 5].map(i => (
        <Star key={i} size={14} fill={i <= rating ? '#dba617' : 'none'} color={i <= rating ? '#dba617' : '#c3c4c7'} />
      ))}
    </div>
  );
}

export function AdminReviews() {
  const { t } = useTranslation();
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('all');
  const [page, setPage] = useState(1);
  const [replyTexts, setReplyTexts] = useState<Record<string, string>>({});
  const [activeReplyId, setActiveReplyId] = useState<string | null>(null);
  const perPage = 20;

  const fetchReviews = async () => {
    setLoading(true);
    try {
      const res = await api.get('/reviews', {
        headers: { Authorization: `Bearer ${localStorage.getItem('mivn5_token')}` },
      });
      setReviews(res.data || []);
    } catch { /* silent */ }
    setLoading(false);
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const filtered = reviews.filter(r => {
    if (filterStatus === 'all') return true;
    return r.status.toLowerCase() === filterStatus.toLowerCase();
  });

  const paginated = filtered.slice((page - 1) * perPage, page * perPage);

  const statusCounts = {
    all: reviews.length,
    pending: reviews.filter(r => r.status.toLowerCase() === 'pending').length,
    approved: reviews.filter(r => r.status.toLowerCase() === 'approved').length,
    rejected: reviews.filter(r => r.status.toLowerCase() === 'rejected').length,
  };

  const changeStatus = async (id: string, status: string) => {
    try {
      await api.patch(`/reviews/${id}/status`, { status: status.toUpperCase() }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('mivn5_token')}` },
      });
      setReviews(prev => prev.map(r => r.id === id ? { ...r, status: status.toUpperCase() } : r));
    } catch { /* silent */ }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa đánh giá này?')) return;
    try {
      await api.delete(`/reviews/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('mivn5_token')}` },
      });
      setReviews(prev => prev.filter(r => r.id !== id));
    } catch { /* silent */ }
  };

  const handleSendReply = async (id: string) => {
    const text = replyTexts[id];
    if (!text || !text.trim()) return;
    try {
      await api.patch(`/reviews/${id}/reply`, { reply: text }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('mivn5_token')}` },
      });
      setReviews(prev => prev.map(r => r.id === id ? { ...r, sellerReply: text, sellerRepliedAt: new Date().toISOString() } : r));
      setActiveReplyId(null);
    } catch { /* silent */ }
  };

  return (
    <div>
      <h1 className="wp-page-title">Đánh giá sản phẩm</h1>

      <div className="wp-filter-tabs">
        {Object.entries(statusCounts).map(([status, count], idx) => (
          <React.Fragment key={status}>
            {idx > 0 && <span className="wp-filter-sep">|</span>}
            <button className={`wp-filter-tab ${filterStatus === status ? 'active' : ''}`}
              onClick={() => { setFilterStatus(status); setPage(1); }}>
              {status === 'all' ? 'Tất cả' : status === 'pending' ? 'Chờ duyệt' : status === 'approved' ? 'Đã duyệt' : 'Từ chối'}
              {' '}<span className="count">({count})</span>
            </button>
          </React.Fragment>
        ))}
      </div>

      <div className="wp-table-top">
        <div className="wp-bulk-actions">
          <select className="wp-bulk-select">
            <option>Bulk actions</option>
            <option value="approve">Duyệt</option>
            <option value="reject">Từ chối</option>
            <option value="delete">Xóa</option>
          </select>
          <button className="wp-btn">Apply</button>
        </div>
      </div>

      {loading ? (
        <div className="wp-loading">Đang tải danh sách đánh giá...</div>
      ) : (
        <div className="wp-table-wrap">
          <table className="wp-table">
            <thead>
              <tr>
                <th style={{ width: 30 }}><input type="checkbox" /></th>
                <th style={{ width: 180 }}>Người đánh giá</th>
                <th>Đánh giá & Nội dung</th>
                <th style={{ width: 220 }}>Sản phẩm</th>
                <th style={{ width: 140 }}>Ngày</th>
                <th style={{ width: 110 }}>Trạng thái</th>
              </tr>
            </thead>
            <tbody>
              {paginated.length === 0 ? (
                <tr>
                  <td colSpan={6} style={{ textAlign: 'center', padding: 30, color: 'var(--wp-text-muted)' }}>
                    Không có đánh giá nào.
                  </td>
                </tr>
              ) : paginated.map(r => (
                <tr key={r.id} style={{ fontWeight: r.status.toLowerCase() === 'pending' ? 600 : 400 }}>
                  <td><input type="checkbox" /></td>
                  <td>
                    <div>
                      <strong style={{ color: 'var(--wp-accent)' }}>{r.authorName}</strong>
                      <div style={{ fontSize: 12, color: 'var(--wp-text-muted)' }}>{r.authorEmail}</div>
                    </div>
                  </td>
                  <td>
                    <StarRating rating={r.rating} />
                    <div style={{ marginTop: 4, fontSize: 13, wordBreak: 'break-word', whiteSpace: 'pre-wrap' }}>
                      {r.content}
                    </div>

                    {/* Media Attachments Preview */}
                    {r.images && r.images.length > 0 && (
                      <div style={{ display: 'flex', gap: 4, marginTop: 6 }}>
                        {r.images.map((imgUrl: string, idx: number) => (
                          <img
                            key={idx}
                            src={imgUrl}
                            alt="review attachment"
                            style={{ width: 40, height: 40, objectFit: 'cover', border: '1px solid #ccc' }}
                          />
                        ))}
                      </div>
                    )}

                    {/* Existing Seller Reply */}
                    {r.sellerReply && (
                      <div style={{ marginTop: 6, padding: 8, background: '#f5f5f5', borderLeft: '3px solid var(--wp-accent)', fontSize: 12 }}>
                        <strong>Phản hồi từ người bán:</strong> {r.sellerReply}
                      </div>
                    )}

                    {/* Inline Reply Form */}
                    {activeReplyId === r.id && (
                      <div style={{ marginTop: 8, display: 'flex', gap: 6, flexDirection: 'column', maxWidth: 400 }}>
                        <textarea
                          value={replyTexts[r.id] || ''}
                          onChange={(e) => setReplyTexts(prev => ({ ...prev, [r.id]: e.target.value }))}
                          placeholder="Nhập phản hồi từ người bán..."
                          rows={2}
                          style={{ padding: 6, border: '1px solid #ccc', fontSize: 12, resize: 'vertical' }}
                        />
                        <div style={{ display: 'flex', gap: 4 }}>
                          <button className="wp-btn" style={{ padding: '3px 8px', fontSize: 11 }} onClick={() => handleSendReply(r.id)}>Gửi</button>
                          <button className="wp-btn" style={{ padding: '3px 8px', fontSize: 11, background: '#ccc', color: '#333' }} onClick={() => setActiveReplyId(null)}>Hủy</button>
                        </div>
                      </div>
                    )}

                    <div className="wp-row-actions">
                      {r.status.toLowerCase() !== 'approved' && (
                        <>
                          <button onClick={() => changeStatus(r.id, 'approved')}>Duyệt</button>
                          <span className="sep">|</span>
                        </>
                      )}
                      {r.status.toLowerCase() !== 'rejected' && (
                        <>
                          <button onClick={() => changeStatus(r.id, 'rejected')}>Từ chối</button>
                          <span className="sep">|</span>
                        </>
                      )}
                      <button onClick={() => { setActiveReplyId(r.id); setReplyTexts(prev => ({ ...prev, [r.id]: r.sellerReply || '' })); }}>Phản hồi</button>
                      <span className="sep">|</span>
                      <button className="trash" onClick={() => handleDelete(r.id)}>Xóa</button>
                    </div>
                  </td>
                  <td>
                    <span style={{ color: 'var(--wp-text)' }}>
                      {r.product?.name || 'Sản phẩm không xác định'}
                    </span>
                  </td>
                  <td style={{ fontSize: 12, color: 'var(--wp-text-muted)', whiteSpace: 'nowrap' }}>
                    {new Date(r.createdAt).toLocaleString('vi-VN', { dateStyle: 'short', timeStyle: 'short' })}
                  </td>
                  <td>
                    <span className={`wp-badge ${r.status.toLowerCase() === 'approved' ? 'wp-badge-approved' : r.status.toLowerCase() === 'rejected' ? 'wp-badge-rejected' : 'wp-badge-pending'}`}>
                      {r.status.toLowerCase() === 'approved' ? 'Đã duyệt' : r.status.toLowerCase() === 'rejected' ? 'Từ chối' : 'Chờ duyệt'}
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
