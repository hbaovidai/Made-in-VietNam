import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Star } from 'lucide-react';
import { WPPagination } from '../../../components/admin/WPPagination';

const initialReviews = [
  { id: '1', author: 'Nguyễn Văn A', email: 'a@example.com', product: 'Cà phê Robusta Đắk Lắk', rating: 5, content: 'Sản phẩm rất tốt, hương vị đậm đà, đóng gói cẩn thận.', status: 'approved', date: '2026-05-20' },
  { id: '2', author: 'Trần Thị B', email: 'b@example.com', product: 'Trà Oolong Bảo Lộc', rating: 4, content: 'Trà thơm ngon, giao hàng nhanh. Sẽ mua lại.', status: 'approved', date: '2026-05-18' },
  { id: '3', author: 'Lê Văn C', email: 'c@example.com', product: 'Nước mắm Phú Quốc', rating: 3, content: 'Chất lượng ổn nhưng giá hơi cao so với thị trường.', status: 'pending', date: '2026-05-15' },
  { id: '4', author: 'Phạm Thị D', email: 'd@example.com', product: 'Gạo ST25', rating: 5, content: 'Gạo rất dẻo, thơm ngon. Đóng gói chắc chắn.', status: 'pending', date: '2026-05-12' },
  { id: '5', author: 'Hoàng Văn E', email: 'e@example.com', product: 'Mật ong rừng Tây Nguyên', rating: 2, content: 'Giao hàng chậm, sản phẩm bị méo vỏ hộp.', status: 'rejected', date: '2026-05-10' },
  { id: '6', author: 'Đỗ Thị F', email: 'f@example.com', product: 'Hạt điều Bình Phước', rating: 4, content: 'Hạt điều giòn, béo, rất ngon. Đóng gói đẹp.', status: 'approved', date: '2026-05-08' },
];

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
  const [reviews, setReviews] = useState(initialReviews);
  const [filterStatus, setFilterStatus] = useState('all');
  const [page, setPage] = useState(1);
  const perPage = 20;

  const filtered = reviews.filter(r => filterStatus === 'all' || r.status === filterStatus);
  const paginated = filtered.slice((page - 1) * perPage, page * perPage);

  const statusCounts = {
    all: reviews.length,
    pending: reviews.filter(r => r.status === 'pending').length,
    approved: reviews.filter(r => r.status === 'approved').length,
    rejected: reviews.filter(r => r.status === 'rejected').length,
  };

  const changeStatus = (id: string, status: string) => {
    setReviews(prev => prev.map(r => r.id === id ? { ...r, status } : r));
  };

  const handleDelete = (id: string) => {
    if (!window.confirm('Xóa đánh giá này?')) return;
    setReviews(prev => prev.filter(r => r.id !== id));
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

      <div className="wp-table-wrap">
        <table className="wp-table">
          <thead>
            <tr>
              <th style={{ width: 30 }}><input type="checkbox" /></th>
              <th>{t('nguoi_danh_gia')}</th>
              <th>Đánh giá</th>
              <th>Sản phẩm</th>
              <th>Ngày</th>
              <th>Trạng thái</th>
            </tr>
          </thead>
          <tbody>
            {paginated.length === 0 ? (
              <tr><td colSpan={6} style={{ textAlign: 'center', padding: 30, color: 'var(--wp-text-muted)' }}>{t('khong_co_danh_gia_nao')}</td></tr>
            ) : paginated.map(r => (
              <tr key={r.id} style={{ fontWeight: r.status === 'pending' ? 600 : 400 }}>
                <td><input type="checkbox" /></td>
                <td>
                  <div>
                    <strong style={{ color: 'var(--wp-accent)' }}>{r.author}</strong>
                    <div style={{ fontSize: 12, color: 'var(--wp-text-muted)' }}>{r.email}</div>
                  </div>
                </td>
                <td>
                  <StarRating rating={r.rating} />
                  <div style={{ marginTop: 4, fontSize: 13, maxWidth: 300 }}>{r.content}</div>
                  <div className="wp-row-actions">
                    {r.status !== 'approved' && <><button onClick={() => changeStatus(r.id, 'approved')}>Duyệt</button><span className="sep">|</span></>}
                    {r.status !== 'rejected' && <><button onClick={() => changeStatus(r.id, 'rejected')}>Từ chối</button><span className="sep">|</span></>}
                    <button className="trash" onClick={() => handleDelete(r.id)}>Xóa</button>
                  </div>
                </td>
                <td><a href="#" style={{ color: 'var(--wp-accent)', textDecoration: 'none' }}>{r.product}</a></td>
                <td style={{ fontSize: 12, color: 'var(--wp-text-muted)', whiteSpace: 'nowrap' }}>{r.date}</td>
                <td>
                  <span className={`wp-badge ${r.status === 'approved' ? 'wp-badge-approved' : r.status === 'rejected' ? 'wp-badge-rejected' : 'wp-badge-pending'}`}>
                    {r.status === 'approved' ? 'Đã duyệt' : r.status === 'rejected' ? 'Từ chối' : 'Chờ duyệt'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <WPPagination page={page} perPage={perPage} total={filtered.length} onPageChange={setPage} />
    </div>
  );
}
