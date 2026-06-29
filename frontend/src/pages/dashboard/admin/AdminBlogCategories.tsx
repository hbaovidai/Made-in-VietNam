import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Search, Eye, EyeOff, Loader2 } from 'lucide-react';
import { blogDb, BlogCategory } from '../../../utils/blogDb';
import { ConfirmDialog } from '../../../components/ui/Modal';

export function AdminBlogCategories() {
  const [categories, setCategories] = useState<BlogCategory[]>([]);
  
  // Search & Filter state
  const [search, setSearch] = useState('');

  // Form states (left side editor)
  const [nameVi, setNameVi] = useState('');
  const [nameEn, setNameEn] = useState('');
  const [slug, setSlug] = useState('');
  const [order, setOrder] = useState('1');
  const [isVisible, setIsVisible] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Confirm delete states
  const [confirmDelete, setConfirmDelete] = useState<{ isOpen: boolean; category: BlogCategory | null }>({
    isOpen: false, category: null
  });

  const nameInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = () => {
    setCategories(blogDb.getCategories());
  };

  const saveToStorage = (updated: BlogCategory[]) => {
    setCategories(updated);
    blogDb.saveCategories(updated);
  };

  const generateSlug = (text: string) => {
    const slugStr = text
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[đĐ]/g, 'd')
      .replace(/([^a-z0-9\s-]|_)+/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-');
    setSlug(slugStr);
  };

  const handleNameViChange = (val: string) => {
    setNameVi(val);
    if (!editingId) {
      generateSlug(val);
    }
  };

  const resetForm = () => {
    setNameVi('');
    setNameEn('');
    setSlug('');
    setOrder(String(categories.length + 1));
    setIsVisible(true);
    setEditingId(null);
    nameInputRef.current?.focus();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nameVi.trim() || !nameEn.trim() || !slug.trim()) return;

    const data: BlogCategory = {
      id: editingId ? editingId : `cat-${Date.now()}`,
      key: slug.trim().toLowerCase(),
      en: nameEn.trim(),
      vi: nameVi.trim(),
      order: parseInt(order) || 1,
      isVisible
    };

    let updated;
    if (editingId) {
      updated = categories.map(c => c.id === editingId ? data : c);
    } else {
      updated = [...categories, data];
    }

    saveToStorage(updated.sort((a, b) => a.order - b.order));
    resetForm();
  };

  const startEdit = (cat: BlogCategory) => {
    setEditingId(cat.id);
    setNameVi(cat.vi);
    setNameEn(cat.en);
    setSlug(cat.key);
    setOrder(String(cat.order));
    setIsVisible(cat.isVisible);
    nameInputRef.current?.focus();
  };

  const handleToggleVisible = (cat: BlogCategory) => {
    const updated = categories.map(c => c.id === cat.id ? { ...c, isVisible: !c.isVisible } : c);
    saveToStorage(updated);
  };

  const handleDelete = () => {
    if (!confirmDelete.category) return;
    const updated = categories.filter(c => c.id !== confirmDelete.category!.id);
    saveToStorage(updated);
    if (editingId === confirmDelete.category.id) resetForm();
    setConfirmDelete({ isOpen: false, category: null });
  };

  const filteredCategories = categories.filter(cat => 
    !search || 
    cat.vi.toLowerCase().includes(search.toLowerCase()) || 
    cat.en.toLowerCase().includes(search.toLowerCase()) || 
    cat.key.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      {/* Breadcrumb */}
      <div className="wp-breadcrumb">
        <Link to="/dashboard/admin">Dashboard</Link>
        <span className="wp-breadcrumb-sep">›</span>
        <span className="wp-breadcrumb-current">Danh mục blog</span>
      </div>

      <h1 className="wp-page-title">Danh mục blog</h1>

      <div style={{ display: 'flex', gap: 20, alignItems: 'flex-start', flexWrap: 'wrap' }}>
        {/* ═══ LEFT: Add / Edit Form ═══ */}
        <div style={{ width: 340, flexShrink: 0 }} className="wp-form-column">
          <h2 style={{ fontSize: 14, fontWeight: 600, margin: '0 0 4px', color: '#1d2327' }}>
            {editingId ? 'Sửa danh mục' : 'Thêm danh mục mới'}
          </h2>
          <p style={{ fontSize: 12, color: '#646970', margin: '0 0 16px' }}>
            {editingId 
              ? 'Chỉnh sửa thông tin danh mục blog bên dưới.' 
              : 'Phân loại các chủ đề tin tức và hướng dẫn tìm nguồn hàng.'}
          </p>

          <form onSubmit={handleSubmit}>
            {/* Tên VI */}
            <div className="wp-form-row">
              <label className="wp-form-label">Tên danh mục (Tiếng Việt) *</label>
              <input
                ref={nameInputRef}
                required
                className="wp-form-input"
                type="text"
                value={nameVi}
                onChange={e => handleNameViChange(e.target.value)}
                placeholder="Ví dụ: Xu hướng Thị trường"
              />
              <p className="wp-form-desc">Hiển thị khi chuyển sang giao diện Tiếng Việt.</p>
            </div>

            {/* Tên EN */}
            <div className="wp-form-row">
              <label className="wp-form-label">Tên danh mục (English) *</label>
              <input
                required
                className="wp-form-input"
                type="text"
                value={nameEn}
                onChange={e => setNameEn(e.target.value)}
                placeholder="Example: Market Trends"
              />
              <p className="wp-form-desc">Hiển thị khi chuyển giao diện Tiếng Anh.</p>
            </div>

            {/* Slug */}
            <div className="wp-form-row">
              <label className="wp-form-label">Slug (Khóa định danh) *</label>
              <input
                required
                className="wp-form-input"
                type="text"
                value={slug}
                onChange={e => setSlug(e.target.value)}
                placeholder="xu-huong-thi-truong"
              />
              <p className="wp-form-desc">Đường dẫn tĩnh thân thiện URL, chữ thường không dấu.</p>
            </div>

            {/* Order & Visibility */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }} className="wp-form-row">
              <div>
                <label className="wp-form-label">Thứ tự</label>
                <input
                  type="number"
                  className="wp-form-input"
                  value={order}
                  onChange={e => setOrder(e.target.value)}
                  min="1"
                />
              </div>
              <div>
                <label className="wp-form-label">Trạng thái</label>
                <select
                  className="wp-form-input"
                  value={isVisible ? 'true' : 'false'}
                  onChange={e => setIsVisible(e.target.value === 'true')}
                >
                  <option value="true">Hiển thị</option>
                  <option value="false">Ẩn danh mục</option>
                </select>
              </div>
            </div>

            {/* Buttons */}
            <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
              <button
                type="submit"
                className="wp-btn wp-btn-primary"
                style={{ padding: '6px 16px', fontSize: 13 }}
              >
                {editingId ? 'Cập nhật danh mục' : 'Thêm danh mục'}
              </button>
              {editingId && (
                <button
                  type="button"
                  className="wp-btn"
                  onClick={resetForm}
                  style={{ padding: '6px 16px', fontSize: 13 }}
                >
                  Huỷ
                </button>
              )}
            </div>
          </form>
        </div>

        {/* ═══ RIGHT: Categories Table ═══ */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
            <span style={{ fontSize: 12, color: '#646970' }}>
              {categories.length} danh mục phân loại
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

          <div className="wp-table-wrap">
            <table className="wp-table">
              <thead>
                <tr>
                  <th style={{ width: 60, textAlign: 'center' }}>Thứ tự</th>
                  <th>Tên danh mục VI</th>
                  <th>Tên danh mục EN</th>
                  <th style={{ width: 140 }}>Slug (Khóa)</th>
                  <th style={{ width: 100, textAlign: 'center' }}>Trạng thái</th>
                </tr>
              </thead>
              <tbody>
                {filteredCategories.length === 0 ? (
                  <tr>
                    <td colSpan={5} style={{ textAlign: 'center', padding: 40, color: '#646970', fontSize: 13 }}>
                      Chưa có danh mục nào.
                    </td>
                  </tr>
                ) : (
                  filteredCategories.map(cat => (
                    <tr key={cat.id}>
                      <td style={{ textAlign: 'center', fontWeight: 600, fontFamily: 'monospace' }}>
                        {cat.order}
                      </td>
                      <td>
                        <div>
                          <a
                            href="#"
                            onClick={e => { e.preventDefault(); startEdit(cat); }}
                            className="wp-row-title"
                            style={{ textDecoration: 'none' }}
                          >
                            {cat.vi}
                          </a>
                          
                          {/* Hover Actions in table */}
                          <div className="wp-row-actions">
                            <a href="#" onClick={e => { e.preventDefault(); startEdit(cat); }}>Sửa</a>
                            <span className="sep">|</span>
                            <button type="button" onClick={() => handleToggleVisible(cat)}>
                              {cat.isVisible ? 'Ẩn' : 'Hiện'}
                            </button>
                            <span className="sep">|</span>
                            <button
                              type="button"
                              onClick={() => setConfirmDelete({ isOpen: true, category: cat })}
                              className="delete"
                            >
                              Xoá
                            </button>
                          </div>
                        </div>
                      </td>
                      <td style={{ color: '#444' }}>
                        {cat.en}
                      </td>
                      <td style={{ fontSize: 12, color: '#646970', fontFamily: 'monospace' }}>
                        {cat.key}
                      </td>
                      <td style={{ textAlign: 'center' }}>
                        <span className={`wp-badge ${cat.isVisible ? 'wp-badge-published' : 'wp-badge-draft'}`}>
                          {cat.isVisible ? 'Hiển thị' : 'Đang ẩn'}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Delete Confirm */}
      <ConfirmDialog
        isOpen={confirmDelete.isOpen}
        onClose={() => setConfirmDelete({ isOpen: false, category: null })}
        onConfirm={handleDelete}
        title="Xoá danh mục blog"
        message={`Bạn có chắc chắn muốn xoá danh mục "${confirmDelete.category?.vi}"? Tất cả bài viết thuộc danh mục này sẽ chuyển sang chưa phân loại.`}
        confirmText="Xoá"
        variant="danger"
      />
    </div>
  );
}
