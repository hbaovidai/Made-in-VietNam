import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Search } from 'lucide-react';

const initialBrands = [
  { id: '1', name: 'VIEproduct', slug: 'vieproduct', description: 'Made in Vietnam platform brand', count: 12 },
  { id: '2', name: 'Trung Nguyên', slug: 'trung-nguyen', description: 'Vietnamese coffee brand', count: 8 },
  { id: '3', name: 'Vinamilk', slug: 'vinamilk', description: 'Dairy products', count: 5 },
  { id: '4', name: 'Phúc Long', slug: 'phuc-long', description: 'Tea & Coffee', count: 3 },
  { id: '5', name: 'Highlands Coffee', slug: 'highlands-coffee', description: 'Premium coffee chain', count: 7 },
];

export function AdminBrands() {
  const { t } = useTranslation();
  const [brands, setBrands] = useState(initialBrands);
  const [form, setForm] = useState({ name: '', slug: '', description: '' });
  const [search, setSearch] = useState('');
  const [editId, setEditId] = useState<string | null>(null);

  const filtered = brands.filter(b => b.name.toLowerCase().includes(search.toLowerCase()));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) return;
    if (editId) {
      setBrands(prev => prev.map(b => b.id === editId ? { ...b, ...form, slug: form.slug || form.name.toLowerCase().replace(/\s+/g, '-') } : b));
      setEditId(null);
    } else {
      setBrands(prev => [...prev, {
        id: Date.now().toString(), name: form.name,
        slug: form.slug || form.name.toLowerCase().replace(/\s+/g, '-'),
        description: form.description, count: 0
      }]);
    }
    setForm({ name: '', slug: '', description: '' });
  };

  const handleEdit = (brand: typeof initialBrands[0]) => {
    setEditId(brand.id);
    setForm({ name: brand.name, slug: brand.slug, description: brand.description });
  };

  const handleDelete = (id: string) => {
    if (!window.confirm('Xóa thương hiệu này?')) return;
    setBrands(prev => prev.filter(b => b.id !== id));
  };

  return (
    <div>
      <h1 className="wp-page-title">Thương hiệu</h1>

      <div style={{ display: 'grid', gridTemplateColumns: '340px 1fr', gap: 20, alignItems: 'start' }}>
        {/* Left: Add Form */}
        <div className="wp-card">
          <div className="wp-card-header">
            <span className="wp-card-title">{editId ? 'Sửa thương hiệu' : 'Thêm thương hiệu mới'}</span>
          </div>
          <div className="wp-card-body">
            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: 12 }}>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 4 }}>Tên</label>
                <input className="wp-form-input" style={{ maxWidth: '100%' }} value={form.name}
                  onChange={e => setForm(prev => ({ ...prev, name: e.target.value }))} placeholder="Tên thương hiệu" />
                <p className="wp-form-desc">{t('ten_se_hien_thi_tren_trang_web')}</p>
              </div>
              <div style={{ marginBottom: 12 }}>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 4 }}>Slug</label>
                <input className="wp-form-input" style={{ maxWidth: '100%' }} value={form.slug}
                  onChange={e => setForm(prev => ({ ...prev, slug: e.target.value }))} placeholder="ten-thuong-hieu" />
                <p className="wp-form-desc">{t('phien_ban_than_thien_url')}</p>
              </div>
              <div style={{ marginBottom: 12 }}>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 4 }}>Mô tả</label>
                <textarea className="wp-form-input" rows={3} style={{ maxWidth: '100%', resize: 'vertical' }} value={form.description}
                  onChange={e => setForm(prev => ({ ...prev, description: e.target.value }))} placeholder="Mô tả ngắn..." />
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                <button type="submit" className="wp-btn wp-btn-primary">
                  {editId ? 'Cập nhật' : 'Thêm thương hiệu'}
                </button>
                {editId && <button type="button" className="wp-btn" onClick={() => { setEditId(null); setForm({ name: '', slug: '', description: '' }); }}>Hủy</button>}
              </div>
            </form>
          </div>
        </div>

        {/* Right: List */}
        <div>
          <div className="wp-table-top">
            <div className="wp-bulk-actions">
              <select className="wp-bulk-select"><option>Bulk actions</option><option>Delete</option></select>
              <button className="wp-btn">Apply</button>
            </div>
            <div className="wp-table-search">
              <input type="text" placeholder="Tìm thương hiệu..." value={search}
                onChange={e => setSearch(e.target.value)} />
              <button className="wp-btn"><Search size={14} /> Search</button>
            </div>
          </div>

          <div className="wp-table-wrap">
            <table className="wp-table">
              <thead>
                <tr>
                  <th style={{ width: 30 }}><input type="checkbox" /></th>
                  <th>Tên</th>
                  <th>Mô tả</th>
                  <th>Slug</th>
                  <th>Số lượng</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr><td colSpan={5} style={{ textAlign: 'center', padding: 30, color: 'var(--wp-text-muted)' }}>{t('khong_tim_thay_thuong_hieu')}</td></tr>
                ) : filtered.map(b => (
                  <tr key={b.id}>
                    <td><input type="checkbox" /></td>
                    <td>
                      <strong className="wp-row-title">{b.name}</strong>
                      <div className="wp-row-actions">
                        <button onClick={() => handleEdit(b)}>Edit</button>
                        <span className="sep">|</span>
                        <button className="trash" onClick={() => handleDelete(b.id)}>Delete</button>
                        <span className="sep">|</span>
                        <a href="#">View</a>
                      </div>
                    </td>
                    <td style={{ color: 'var(--wp-text-muted)', maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{b.description || '—'}</td>
                    <td style={{ color: 'var(--wp-text-muted)' }}>{b.slug}</td>
                    <td><a href="#" style={{ color: 'var(--wp-accent)' }}>{b.count}</a></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
