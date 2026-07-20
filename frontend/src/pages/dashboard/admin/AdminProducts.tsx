import React, { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';
import { WPPagination } from '../../../components/admin/WPPagination';
import { api } from '../../../lib/api';

export function AdminProducts() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [filterStatus, setFilterStatus] = useState(searchParams.get('status') || 'all');
  const [page, setPage] = useState(1);
  const perPage = 20;

  useEffect(() => {
    setSearch(searchParams.get('search') || '');
    setFilterStatus(searchParams.get('status') || 'all');
  }, [searchParams]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const token = localStorage.getItem('mivn5_token');
        const authHeaders = { headers: { Authorization: `Bearer ${token}` } };
        const res = await api.get('/products/admin?limit=100', authHeaders);
        setProducts(res.data?.data || []);
      } catch { /* silent */ }
      setLoading(false);
    };
    fetchProducts();
  }, []);

  const filtered = products.filter(p => {
    const matchSearch = p.name?.toLowerCase().includes(search.toLowerCase());
    
    if (filterStatus === 'PENDING') {
      return matchSearch && p.status === 'PENDING';
    }
    
    if (filterStatus === 'all') {
      // In the "All Products" menu, only show APPROVED (ACTIVE) or REJECTED products
      return matchSearch && (p.status === 'ACTIVE' || p.status === 'REJECTED');
    }
    
    return matchSearch && p.status === filterStatus;
  });

  const totalPages = Math.ceil(filtered.length / perPage);
  const paginated = filtered.slice((page - 1) * perPage, page * perPage);

  const statusCounts = {
    all: products.filter(p => p.status === 'ACTIVE' || p.status === 'REJECTED').length,
    ACTIVE: products.filter(p => p.status === 'ACTIVE').length,
    REJECTED: products.filter(p => p.status === 'REJECTED').length,
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

  const handleTrash = async (id: string) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa sản phẩm này?')) return;
    try {
      const token = localStorage.getItem('mivn5_token');
      const authHeaders = { headers: { Authorization: `Bearer ${token}` } };
      await api.delete(`/products/${id}`, authHeaders);
      alert('Đã xóa sản phẩm thành công!');
      setProducts(prev => prev.filter(p => p.id !== id));
    } catch (err: any) {
      console.error(err);
      alert(err.response?.data?.message || 'Có lỗi xảy ra khi xóa sản phẩm.');
    }
  };

  const isApprovalMode = filterStatus === 'PENDING';

  return (
    <div>
      <div className="wp-page-header">
        <h1 className="wp-page-title">
          {isApprovalMode ? 'Kiểm duyệt sản phẩm' : 'Quản lý sản phẩm'}
        </h1>
      </div>

      {!isApprovalMode && (
        <div className="wp-filter-tabs">
          {Object.entries(statusCounts)
            .map(([status, count], idx) => (
              <React.Fragment key={status}>
                {idx > 0 && <span className="wp-filter-sep">|</span>}
                <button
                  className={`wp-filter-tab ${filterStatus === status ? 'active' : ''}`}
                  onClick={() => {
                    const newParams = new URLSearchParams(searchParams);
                    if (status === 'all') {
                      newParams.delete('status');
                    } else {
                      newParams.set('status', status);
                    }
                    newParams.set('page', '1');
                    setSearchParams(newParams);
                  }}
                >
                  {status === 'all' ? 'Tất cả' : status === 'ACTIVE' ? 'Đã duyệt' : 'Từ chối'} <span className="count">({count})</span>
                </button>
              </React.Fragment>
            ))}
        </div>
      )}

      <div className="wp-table-top">
        <div className="wp-bulk-actions">
          <select className="wp-bulk-select">
            <option>Chọn thao tác</option>
            <option>Xóa</option>
          </select>
          <button className="wp-btn">Áp dụng</button>
        </div>
        <form onSubmit={handleSearchSubmit} className="wp-table-search">
          <input type="text" placeholder="Tìm kiếm sản phẩm..." value={search}
            onChange={e => { setSearch(e.target.value); setPage(1); }} />
          <button type="submit" className="wp-btn"><Search size={14} /> Tìm kiếm</button>
        </form>
      </div>

      {loading ? (
        <div className="wp-loading">Đang tải sản phẩm...</div>
      ) : (
        <div className="wp-table-wrap">
          <table className="wp-table">
            <thead>
              <tr>
                <th style={{ width: 30 }}><input type="checkbox" /></th>
                <th style={{ width: 50 }}>Hình ảnh</th>
                <th>Tên sản phẩm</th>
                <th>Danh mục</th>
                <th>Giá bán</th>
                <th>MOQ</th>
                <th>Trạng thái</th>
                <th>Ngày tạo</th>
              </tr>
            </thead>
            <tbody>
              {paginated.length === 0 ? (
                <tr><td colSpan={8} style={{ textAlign: 'center', padding: 30, color: 'var(--wp-text-muted)' }}>Không tìm thấy sản phẩm nào.</td></tr>
              ) : paginated.map(p => (
                <tr key={p.id}>
                  <td><input type="checkbox" /></td>
                  <td>
                    <div style={{
                      width: 40, height: 40, borderRadius: 4,
                      background: p.images?.[0] ? `url(${p.images[0]}) center/cover` : '#f0f0f1',
                      border: '1px solid var(--wp-border-light)'
                    }} />
                  </td>
                  <td>
                    <span className="wp-row-title">{p.name}</span>
                    <div className="wp-row-actions">
                      <a href={`/dashboard/admin/products/approve/${p.id}`}>Kiểm duyệt</a>
                      <span className="sep">|</span>
                      <button className="trash" onClick={() => handleTrash(p.id)}>Xóa</button>
                      {p.status === 'ACTIVE' && (
                        <>
                          <span className="sep">|</span>
                          <a href={`/products/${p.slug || p.id}`} target="_blank" rel="noreferrer">Xem</a>
                        </>
                      )}
                    </div>
                  </td>
                  <td>{p.category?.name || '—'}</td>
                  <td style={{ whiteSpace: 'nowrap' }}>
                    {p.minPrice?.toLocaleString()} – {p.maxPrice?.toLocaleString()} {p.currency || 'VND'}
                  </td>
                  <td>{p.moq} {p.moqUnit || 'cái'}</td>
                  <td>
                    <span className={`wp-badge ${
                      p.status === 'ACTIVE' ? 'wp-badge-published' :
                      p.status === 'PENDING' ? 'wp-badge-pending' : 'wp-badge-rejected'
                    }`}>
                      {p.status === 'ACTIVE' ? 'Đã duyệt' : p.status === 'PENDING' ? 'Chờ duyệt' : 'Từ chối'}
                    </span>
                  </td>
                  <td style={{ fontSize: 12, color: 'var(--wp-text-muted)', whiteSpace: 'nowrap' }}>
                    {new Date(p.createdAt).toLocaleDateString()}
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
