import React, { useState } from 'react';

const initialAttributes = [
  { id: '1', name: 'Màu sắc', slug: 'color', terms: ['Đỏ', 'Xanh', 'Vàng', 'Trắng', 'Đen'] },
  { id: '2', name: 'Kích thước', slug: 'size', terms: ['S', 'M', 'L', 'XL', 'XXL'] },
  { id: '3', name: 'Chất liệu', slug: 'material', terms: ['Cotton', 'Lụa', 'Polyester', 'Tre'] },
  { id: '4', name: 'Xuất xứ', slug: 'origin', terms: ['Hà Nội', 'TP.HCM', 'Đà Lạt', 'Tây Nguyên'] },
  { id: '5', name: 'Trọng lượng', slug: 'weight', terms: ['100g', '250g', '500g', '1kg'] },
];

export function AdminAttributes() {
  const [attributes, setAttributes] = useState(initialAttributes);
  const [form, setForm] = useState({ name: '', slug: '' });
  const [editId, setEditId] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [newTerm, setNewTerm] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) return;
    if (editId) {
      setAttributes(prev => prev.map(a => a.id === editId ? { ...a, name: form.name, slug: form.slug || form.name.toLowerCase().replace(/\s+/g, '-') } : a));
      setEditId(null);
    } else {
      setAttributes(prev => [...prev, {
        id: Date.now().toString(), name: form.name,
        slug: form.slug || form.name.toLowerCase().replace(/\s+/g, '-'), terms: []
      }]);
    }
    setForm({ name: '', slug: '' });
  };

  const handleDelete = (id: string) => {
    if (!window.confirm('Xóa thuộc tính này?')) return;
    setAttributes(prev => prev.filter(a => a.id !== id));
  };

  const addTerm = (attrId: string) => {
    if (!newTerm.trim()) return;
    setAttributes(prev => prev.map(a => a.id === attrId ? { ...a, terms: [...a.terms, newTerm.trim()] } : a));
    setNewTerm('');
  };

  const removeTerm = (attrId: string, termIdx: number) => {
    setAttributes(prev => prev.map(a => a.id === attrId ? { ...a, terms: a.terms.filter((_, i) => i !== termIdx) } : a));
  };

  return (
    <div>
      <h1 className="wp-page-title">Thuộc tính sản phẩm</h1>

      <div style={{ display: 'grid', gridTemplateColumns: '340px 1fr', gap: 20, alignItems: 'start' }}>
        {/* Left: Add Form */}
        <div className="wp-card">
          <div className="wp-card-header">
            <span className="wp-card-title">{editId ? 'Sửa thuộc tính' : 'Thêm thuộc tính mới'}</span>
          </div>
          <div className="wp-card-body">
            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: 12 }}>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 4 }}>Tên</label>
                <input className="wp-form-input" style={{ maxWidth: '100%' }} value={form.name}
                  onChange={e => setForm(prev => ({ ...prev, name: e.target.value }))} placeholder="Ví dụ: Màu sắc" />
                <p className="wp-form-desc">Tên thuộc tính cho quản trị.</p>
              </div>
              <div style={{ marginBottom: 12 }}>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 4 }}>Slug</label>
                <input className="wp-form-input" style={{ maxWidth: '100%' }} value={form.slug}
                  onChange={e => setForm(prev => ({ ...prev, slug: e.target.value }))} placeholder="mau-sac" />
                <p className="wp-form-desc">Mã định danh duy nhất.</p>
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                <button type="submit" className="wp-btn wp-btn-primary">{editId ? 'Cập nhật' : 'Thêm thuộc tính'}</button>
                {editId && <button type="button" className="wp-btn" onClick={() => { setEditId(null); setForm({ name: '', slug: '' }); }}>Hủy</button>}
              </div>
            </form>
          </div>
        </div>

        {/* Right: List */}
        <div className="wp-table-wrap">
          <table className="wp-table">
            <thead>
              <tr>
                <th style={{ width: 30 }}><input type="checkbox" /></th>
                <th>Tên</th>
                <th>Slug</th>
                <th>Giá trị</th>
              </tr>
            </thead>
            <tbody>
              {attributes.map(attr => (
                <React.Fragment key={attr.id}>
                  <tr>
                    <td><input type="checkbox" /></td>
                    <td>
                      <strong className="wp-row-title" onClick={() => setExpandedId(expandedId === attr.id ? null : attr.id)}>{attr.name}</strong>
                      <div className="wp-row-actions">
                        <button onClick={() => { setEditId(attr.id); setForm({ name: attr.name, slug: attr.slug }); }}>Edit</button>
                        <span className="sep">|</span>
                        <button className="trash" onClick={() => handleDelete(attr.id)}>Delete</button>
                        <span className="sep">|</span>
                        <button onClick={() => setExpandedId(expandedId === attr.id ? null : attr.id)}>
                          {expandedId === attr.id ? 'Ẩn giá trị' : 'Cấu hình giá trị'}
                        </button>
                      </div>
                    </td>
                    <td style={{ color: 'var(--wp-text-muted)' }}>{attr.slug}</td>
                    <td>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                        {attr.terms.slice(0, 5).map((t, i) => (
                          <span key={i} className="wp-badge wp-badge-draft">{t}</span>
                        ))}
                        {attr.terms.length > 5 && <span className="wp-badge wp-badge-draft">+{attr.terms.length - 5}</span>}
                      </div>
                    </td>
                  </tr>
                  {/* Expanded terms editor */}
                  {expandedId === attr.id && (
                    <tr>
                      <td colSpan={4} style={{ background: '#f9f9f9', padding: 16 }}>
                        <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 8 }}>Giá trị của "{attr.name}"</div>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 12 }}>
                          {attr.terms.map((term, i) => (
                            <span key={i} style={{
                              display: 'inline-flex', alignItems: 'center', gap: 4, padding: '4px 10px',
                              background: '#fff', border: '1px solid var(--wp-border)', borderRadius: 3, fontSize: 12
                            }}>
                              {term}
                              <button onClick={() => removeTerm(attr.id, i)} style={{
                                background: 'none', border: 'none', color: 'var(--wp-danger)', cursor: 'pointer', padding: 0, fontSize: 14, lineHeight: 1
                              }}>×</button>
                            </span>
                          ))}
                        </div>
                        <div style={{ display: 'flex', gap: 8 }}>
                          <input className="wp-form-input" style={{ maxWidth: 200 }} placeholder="Thêm giá trị mới..."
                            value={newTerm} onChange={e => setNewTerm(e.target.value)}
                            onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addTerm(attr.id); } }} />
                          <button className="wp-btn" type="button" onClick={() => addTerm(attr.id)}>Thêm</button>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
