import React, { useState, useEffect } from 'react';
import { Search, Plus } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';
import { WPPagination } from '../../../components/admin/WPPagination';
import { api } from '../../../lib/api';

export function AdminProducts() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [filterStatus, setFilterStatus] = useState('all');
  const [page, setPage] = useState(1);
  const perPage = 20;

  useEffect(() => {
    setSearch(searchParams.get('search') || '');
  }, [searchParams]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await api.get('/products?limit=100');
        setProducts(res.data?.products || []);
      } catch { /* silent */ }
      setLoading(false);
    };
    fetchProducts();
  }, []);

  const filtered = products.filter(p => {
    const matchSearch = p.name?.toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus === 'all' || p.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const totalPages = Math.ceil(filtered.length / perPage);
  const paginated = filtered.slice((page - 1) * perPage, page * perPage);

  const statusCounts = {
    all: products.length,
    ACTIVE: products.filter(p => p.status === 'ACTIVE').length,
    PENDING: products.filter(p => p.status === 'PENDING').length,
    DRAFT: products.filter(p => p.status === 'DRAFT').length,
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
      <div className="wp-page-header">
        <h1 className="wp-page-title">
          Products
          <a href="/dashboard/supplier/products/add" className="wp-page-title-btn">
            <Plus size={14} /> Add New
          </a>
        </h1>
      </div>

      <div className="wp-filter-tabs">
        {Object.entries(statusCounts).map(([status, count], idx) => (
          <React.Fragment key={status}>
            {idx > 0 && <span className="wp-filter-sep">|</span>}
            <button
              className={`wp-filter-tab ${filterStatus === status ? 'active' : ''}`}
              onClick={() => { setFilterStatus(status); setPage(1); }}
            >
              {status === 'all' ? 'All' : status} <span className="count">({count})</span>
            </button>
          </React.Fragment>
        ))}
      </div>

      <div className="wp-table-top">
        <div className="wp-bulk-actions">
          <select className="wp-bulk-select">
            <option>Bulk actions</option>
            <option>Delete</option>
            <option>Set Active</option>
          </select>
          <button className="wp-btn">Apply</button>
        </div>
        <form onSubmit={handleSearchSubmit} className="wp-table-search">
          <input type="text" placeholder="Search products..." value={search}
            onChange={e => { setSearch(e.target.value); setPage(1); }} />
          <button type="submit" className="wp-btn"><Search size={14} /> Search</button>
        </form>
      </div>

      {loading ? (
        <div className="wp-loading">Loading products...</div>
      ) : (
        <div className="wp-table-wrap">
          <table className="wp-table">
            <thead>
              <tr>
                <th style={{ width: 30 }}><input type="checkbox" /></th>
                <th style={{ width: 50 }}>Image</th>
                <th>Product Name</th>
                <th>Category</th>
                <th>Price</th>
                <th>MOQ</th>
                <th>Status</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {paginated.length === 0 ? (
                <tr><td colSpan={8} style={{ textAlign: 'center', padding: 30, color: 'var(--wp-text-muted)' }}>No products found.</td></tr>
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
                      <a href="#">Edit</a>
                      <span className="sep">|</span>
                      <a href="#">Quick Edit</a>
                      <span className="sep">|</span>
                      <button className="trash">Trash</button>
                      <span className="sep">|</span>
                      <a href={`/products/${p.slug || p.id}`}>View</a>
                    </div>
                  </td>
                  <td>{p.category?.name || '—'}</td>
                  <td style={{ whiteSpace: 'nowrap' }}>
                    {p.minPrice?.toLocaleString()} – {p.maxPrice?.toLocaleString()} {p.currency || 'VND'}
                  </td>
                  <td>{p.moq} {p.moqUnit}</td>
                  <td>
                    <span className={`wp-badge ${
                      p.status === 'ACTIVE' ? 'wp-badge-published' :
                      p.status === 'PENDING' ? 'wp-badge-pending' : 'wp-badge-draft'
                    }`}>
                      {p.status}
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
