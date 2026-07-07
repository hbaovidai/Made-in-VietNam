import React, { useEffect, useState, useRef } from 'react';
import { api } from '../../../lib/api';
import { useTranslation } from 'react-i18next';
import { useToast } from '../../../components/ui/Toast';
import { Loader2, Edit2, Trash2, Search, ChevronDown, ChevronRight } from 'lucide-react';
import { ConfirmDialog } from '../../../components/ui/Modal';

export function AdminCategories() {
  const { t } = useTranslation();
  const { addToast } = useToast();
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [saving, setSaving] = useState(false);

  // Form state (left side)
  const [formName, setFormName] = useState('');
  const [formSlug, setFormSlug] = useState('');
  const [formParent, setFormParent] = useState('');
  const [formDesc, setFormDesc] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);

  // Delete confirm
  const [confirmDelete, setConfirmDelete] = useState<{ isOpen: boolean; category: any }>({
    isOpen: false, category: null
  });

  // Expanded parents in table
  const [expandedParents, setExpandedParents] = useState<string[]>([]);

  const nameInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => { loadCategories(); }, []);

  const loadCategories = async () => {
    try {
      const res = await api.get('/categories');
      setCategories(res.data || []);
    } catch {
      addToast({ type: 'error', title: 'Lỗi', message: 'Không thể tải danh mục' });
    } finally {
      setLoading(false);
    }
  };

  // Auto-generate slug from name
  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/đ/g, 'd')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  };

  const handleNameChange = (val: string) => {
    setFormName(val);
    if (!editingId) {
      setFormSlug(generateSlug(val));
    }
  };

  const resetForm = () => {
    setFormName('');
    setFormSlug('');
    setFormParent('');
    setFormDesc('');
    setEditingId(null);
    nameInputRef.current?.focus();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim()) {
      addToast({ type: 'error', title: 'Lỗi', message: 'Vui lòng nhập tên danh mục' });
      return;
    }
    setSaving(true);
    try {
      const payload: any = {
        name: formName.trim(),
        slug: formSlug.trim() || generateSlug(formName),
        description: formDesc.trim() || undefined,
      };
      if (formParent) payload.parentId = formParent;

      if (editingId) {
        await api.put(`/categories/${editingId}`, payload);
        addToast({ type: 'success', title: 'Thành công', message: 'Đã cập nhật danh mục' });
      } else {
        await api.post('/categories', payload);
        addToast({ type: 'success', title: 'Thành công', message: 'Đã thêm danh mục mới' });
      }
      resetForm();
      loadCategories();
    } catch (err: any) {
      addToast({ type: 'error', title: 'Lỗi', message: err?.response?.data?.message || 'Không thể lưu danh mục' });
    } finally {
      setSaving(false);
    }
  };

  const startEdit = (cat: any) => {
    setEditingId(cat.id);
    setFormName(cat.name);
    setFormSlug(cat.slug || '');
    setFormParent(cat.parentId || '');
    setFormDesc(cat.description || '');
    nameInputRef.current?.focus();
  };

  const handleDelete = async () => {
    if (!confirmDelete.category) return;
    try {
      await api.delete(`/categories/${confirmDelete.category.id}`);
      addToast({ type: 'success', title: 'Thành công', message: 'Đã xoá danh mục' });
      setConfirmDelete({ isOpen: false, category: null });
      if (editingId === confirmDelete.category.id) resetForm();
      loadCategories();
    } catch (err: any) {
      addToast({ type: 'error', title: 'Lỗi', message: err?.response?.data?.message || 'Không thể xoá' });
      setConfirmDelete({ isOpen: false, category: null });
    }
  };

  const toggleExpand = (id: string) => {
    setExpandedParents(prev =>
      prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]
    );
  };

  // Only parent (top-level) categories for the table
  const parentCategories = categories.filter(c => !c.parentId);
  const filteredParents = parentCategories.filter(c =>
    !search || c.name?.toLowerCase().includes(search.toLowerCase()) ||
    c.children?.some((sub: any) => sub.name?.toLowerCase().includes(search.toLowerCase()))
  );

  // Flatten all categories for parent dropdown (only show parents, not children)
  const parentOptions = parentCategories.filter(c => c.id !== editingId);

  return (
    <div>
      <h1 className="wp-page-title">Danh mục</h1>

      <div style={{ display: 'flex', gap: 20, alignItems: 'flex-start' }}>
        {/* ═══ LEFT: Add / Edit Form ═══ */}
        <div style={{ width: 340, flexShrink: 0 }}>
          <h2 style={{ fontSize: 14, fontWeight: 600, margin: '0 0 4px', color: '#1d2327' }}>
            {editingId ? 'Sửa danh mục' : 'Thêm danh mục mới'}
          </h2>
          <p style={{ fontSize: 12, color: '#646970', margin: '0 0 16px' }}>
            {editingId 
              ? 'Chỉnh sửa thông tin danh mục bên dưới.' 
              : 'Danh mục sẽ hiển thị trên trang chủ và menu sản phẩm.'}
          </p>

          <form onSubmit={handleSubmit}>
            {/* Name */}
            <div className="wp-form-row">
              <label className="wp-form-label">Tên</label>
              <input
                ref={nameInputRef}
                className="wp-form-input"
                type="text"
                value={formName}
                onChange={e => handleNameChange(e.target.value)}
                placeholder="Nhập tên danh mục"
              />
              <p className="wp-form-desc">{t('ten_hien_thi_tren_website')}</p>
            </div>

            {/* Slug */}
            <div className="wp-form-row">
              <label className="wp-form-label">{t('duong_dan_slug')}</label>
              <input
                className="wp-form-input"
                type="text"
                value={formSlug}
                onChange={e => setFormSlug(e.target.value)}
                placeholder="tu-dong-tao-tu-ten"
              />
              <p className="wp-form-desc">{t('phien_ban_than_thien_url_thuong_la_chu_t')}</p>
            </div>

            {/* Parent Category */}
            <div className="wp-form-row">
              <label className="wp-form-label">{t('danh_muc_cha_1')}</label>
              <select
                className="wp-form-input"
                value={formParent}
                onChange={e => setFormParent(e.target.value)}
              >
                <option value="">{t('khong_danh_muc_goc')}</option>
                {parentOptions.map(p => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
              <p className="wp-form-desc">{t('chon_danh_muc_cha_neu_day_la_danh_muc_co')}</p>
            </div>

            {/* Description */}
            <div className="wp-form-row">
              <label className="wp-form-label">Mô tả</label>
              <textarea
                className="wp-form-input"
                rows={4}
                value={formDesc}
                onChange={e => setFormDesc(e.target.value)}
                placeholder="Mô tả ngắn về danh mục (không bắt buộc)"
                style={{ resize: 'vertical' }}
              />
              <p className="wp-form-desc">{t('mo_ta_mac_dinh_khong_quan_trong_nhung_mo')}</p>
            </div>

            {/* Buttons */}
            <div style={{ display: 'flex', gap: 8, marginTop: 4 }}>
              <button
                type="submit"
                className="wp-btn wp-btn-primary"
                disabled={saving}
                style={{ padding: '6px 16px', fontSize: 13 }}
              >
                {saving ? 'Đang lưu...' : editingId ? 'Cập nhật danh mục' : 'Thêm danh mục mới'}
              </button>
              {editingId && (
                <button
                  type="button"
                  className="wp-btn"
                  onClick={resetForm}
                  style={{ padding: '6px 16px', fontSize: 13 }}
                >
                  {t('huy')}
                </button>
              )}
            </div>
          </form>
        </div>

        {/* ═══ RIGHT: Categories Table ═══ */}
        <div style={{ flex: 1, minWidth: 0 }}>
          {/* Search & Count */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
            <span style={{ fontSize: 12, color: '#646970' }}>
              {parentCategories.length} danh mục gốc • {categories.length} tổng cộng
            </span>
            <div style={{ position: 'relative', width: 200 }}>
              <Search size={13} style={{ position: 'absolute', left: 8, top: '50%', transform: 'translateY(-50%)', color: '#8c8f94' }} />
              <input
                type="text"
                placeholder="Tìm danh mục..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                style={{
                  width: '100%', paddingLeft: 28, paddingRight: 8,
                  height: 30, fontSize: 12, border: '1px solid #8c8f94',
                  borderRadius: 3, outline: 'none',
                }}
              />
            </div>
          </div>

          {loading ? (
            <div style={{ display: 'flex', justifyContent: 'center', padding: '60px 0' }}>
              <Loader2 className="animate-spin" size={24} style={{ color: '#2271b1' }} />
            </div>
          ) : (
            <table className="wp-list-table widefat fixed striped" style={{ borderCollapse: 'collapse', width: '100%' }}>
              <thead>
                <tr style={{ background: '#f6f7f7', borderBottom: '1px solid #c3c4c7' }}>
                  <th style={thStyle}>Tên</th>
                  <th style={{ ...thStyle, width: 140 }}>Mô tả</th>
                  <th style={{ ...thStyle, width: 80, textAlign: 'center' }}>{t('duong_dan')}</th>
                  <th style={{ ...thStyle, width: 60, textAlign: 'center' }}>{t('so_sp')}</th>
                </tr>
              </thead>
              <tbody>
                {filteredParents.length === 0 ? (
                  <tr>
                    <td colSpan={4} style={{ textAlign: 'center', padding: 40, color: '#646970', fontSize: 13 }}>
                      Chưa có danh mục nào
                    </td>
                  </tr>
                ) : filteredParents.map(cat => {
                  const isExpanded = expandedParents.includes(cat.id);
                  const children = cat.children || [];
                  const childProductCount = children.reduce((sum: number, c: any) => sum + (c._count?.products || 0), 0);
                  const totalProducts = (cat._count?.products || 0) + childProductCount;

                  return (
                    <React.Fragment key={cat.id}>
                      {/* Parent Row */}
                      <tr style={trStyle} onMouseEnter={e => (e.currentTarget.style.background = '#f6f7f7')} onMouseLeave={e => (e.currentTarget.style.background = '')}>
                        <td style={tdStyle}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                            {children.length > 0 && (
                              <button
                                onClick={() => toggleExpand(cat.id)}
                                style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 2, color: '#646970', display: 'flex' }}
                              >
                                {isExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                              </button>
                            )}
                            <div>
                              <a
                                href="#"
                                onClick={e => { e.preventDefault(); startEdit(cat); }}
                                style={{ color: '#2271b1', fontWeight: 600, fontSize: 13, textDecoration: 'none' }}
                              >
                                {cat.name}
                              </a>
                              {/* Row actions */}
                              <div className="wp-row-actions" style={{ fontSize: 11, marginTop: 2 }}>
                                <span>
                                  <a href="#" onClick={e => { e.preventDefault(); startEdit(cat); }} style={{ color: '#2271b1', textDecoration: 'none' }}>Sửa</a>
                                </span>
                                {' | '}
                                <span>
                                  <a
                                    href="#"
                                    onClick={e => { e.preventDefault(); setConfirmDelete({ isOpen: true, category: cat }); }}
                                    style={{ color: '#b32d2e', textDecoration: 'none' }}
                                  >
                                    {t('xoa')}
                                  </a>
                                </span>
                                {' | '}
                                <span>
                                  <a href={`/products?category=${cat.slug}`} target="_blank" rel="noopener noreferrer" style={{ color: '#2271b1', textDecoration: 'none' }}>
                                    Xem
                                  </a>
                                </span>
                              </div>
                            </div>
                          </div>
                        </td>
                        <td style={{ ...tdStyle, fontSize: 12, color: '#646970' }}>
                          {cat.description ? (
                            <span style={{ display: 'block', maxWidth: 120, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                              {cat.description}
                            </span>
                          ) : '—'}
                        </td>
                        <td style={{ ...tdStyle, textAlign: 'center', fontSize: 12, color: '#646970' }}>{cat.slug}</td>
                        <td style={{ ...tdStyle, textAlign: 'center', fontWeight: 600, fontSize: 13 }}>{totalProducts}</td>
                      </tr>

                      {/* Children Rows */}
                      {isExpanded && children.map((sub: any) => (
                        <tr key={sub.id} style={trStyle} onMouseEnter={e => (e.currentTarget.style.background = '#f6f7f7')} onMouseLeave={e => (e.currentTarget.style.background = '')}>
                          <td style={{ ...tdStyle, paddingLeft: 36 }}>
                            <span style={{ color: '#8c8f94', marginRight: 4 }}>—</span>
                            <a
                              href="#"
                              onClick={e => { e.preventDefault(); startEdit(sub); }}
                              style={{ color: '#2271b1', fontWeight: 500, fontSize: 13, textDecoration: 'none' }}
                            >
                              {sub.name}
                            </a>
                            <div className="wp-row-actions" style={{ fontSize: 11, marginTop: 2, paddingLeft: 18 }}>
                              <span>
                                <a href="#" onClick={e => { e.preventDefault(); startEdit(sub); }} style={{ color: '#2271b1', textDecoration: 'none' }}>Sửa</a>
                              </span>
                              {' | '}
                              <span>
                                <a
                                  href="#"
                                  onClick={e => { e.preventDefault(); setConfirmDelete({ isOpen: true, category: sub }); }}
                                  style={{ color: '#b32d2e', textDecoration: 'none' }}
                                >
                                  {t('xoa')}
                                </a>
                              </span>
                            </div>
                          </td>
                          <td style={{ ...tdStyle, fontSize: 12, color: '#646970' }}>
                            {sub.description || '—'}
                          </td>
                          <td style={{ ...tdStyle, textAlign: 'center', fontSize: 12, color: '#646970' }}>{sub.slug}</td>
                          <td style={{ ...tdStyle, textAlign: 'center', fontSize: 12, color: '#646970' }}>{sub._count?.products || 0}</td>
                        </tr>
                      ))}
                    </React.Fragment>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>

      <ConfirmDialog
        isOpen={confirmDelete.isOpen}
        onClose={() => setConfirmDelete({ ...confirmDelete, isOpen: false })}
        onConfirm={handleDelete}
        title="Xoá danh mục"
        message={`Bạn có chắc muốn xoá danh mục "${confirmDelete.category?.name}"? Thao tác này không thể hoàn tác.`}
        confirmText="Xoá"
        variant="danger"
      />
    </div>
  );
}

/* ── inline styles ── */
const thStyle: React.CSSProperties = {
  padding: '8px 10px',
  fontSize: 12,
  fontWeight: 600,
  color: '#1d2327',
  textAlign: 'left',
  borderBottom: '1px solid #c3c4c7',
};

const tdStyle: React.CSSProperties = {
  padding: '8px 10px',
  fontSize: 13,
  color: '#1d2327',
  verticalAlign: 'top',
};

const trStyle: React.CSSProperties = {
  borderBottom: '1px solid #f0f0f1',
  transition: 'background 0.15s',
};
