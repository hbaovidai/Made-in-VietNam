import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Search, Eye, Edit, Trash2, EyeOff, X, Image as ImageIcon } from 'lucide-react';
import { blogDb, BlogPost, BlogCategory } from '../../../utils/blogDb';
import { ConfirmDialog } from '../../../components/ui/Modal';

export function AdminBlogPosts() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [categories, setCategories] = useState<BlogCategory[]>([]);
  
  // Search & Filter State
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');

  // Form Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  
  // Form Fields State
  const [titleVi, setTitleVi] = useState('');
  const [titleEn, setTitleEn] = useState('');
  const [slug, setSlug] = useState('');
  const [excerptVi, setExcerptVi] = useState('');
  const [excerptEn, setExcerptEn] = useState('');
  const [contentVi, setContentVi] = useState('');
  const [contentEn, setContentEn] = useState('');
  const [thumbnail, setThumbnail] = useState('');
  const [category, setCategory] = useState('');
  const [author, setAuthor] = useState('');
  const [publishDate, setPublishDate] = useState('');
  const [status, setStatus] = useState<'DRAFT' | 'PUBLISHED' | 'HIDDEN'>('PUBLISHED');
  const [displayOrder, setDisplayOrder] = useState('1');
  const [seoTitle, setSeoTitle] = useState('');
  const [seoDescription, setSeoDescription] = useState('');

  // Delete Confirm State
  const [confirmDelete, setConfirmDelete] = useState<{ isOpen: boolean; post: BlogPost | null }>({
    isOpen: false, post: null
  });
  
  // Preview Modal State
  const [previewPost, setPreviewPost] = useState<BlogPost | null>(null);

  useEffect(() => {
    setPosts(blogDb.getPosts());
    const cats = blogDb.getCategories();
    setCategories(cats);
    if (cats.length > 0) setCategory(cats[0].key);
  }, []);

  const saveToStorage = (updatedPosts: BlogPost[]) => {
    setPosts(updatedPosts);
    blogDb.savePosts(updatedPosts);
  };

  // Auto-generate slug from Vietnamese title
  const generateSlug = (text: string) => {
    const slugStr = text
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') // remove accents
      .replace(/[đĐ]/g, 'd')
      .replace(/([^a-z0-9\s-]|_)+/g, '') // remove special chars
      .replace(/\s+/g, '-') // replace space with -
      .replace(/-+/g, '-'); // collapse dashes
    setSlug(slugStr);
  };

  // Open Add Modal
  const handleOpenAdd = () => {
    setEditingPost(null);
    setTitleVi('');
    setTitleEn('');
    setSlug('');
    setExcerptVi('');
    setExcerptEn('');
    setContentVi('');
    setContentEn('');
    setThumbnail('');
    if (categories.length > 0) setCategory(categories[0].key);
    setAuthor('Admin');
    setPublishDate(new Date().toISOString().split('T')[0]);
    setStatus('PUBLISHED');
    setDisplayOrder('1');
    setSeoTitle('');
    setSeoDescription('');
    setIsModalOpen(true);
  };

  // Open Edit Modal
  const handleOpenEdit = (post: BlogPost) => {
    setEditingPost(post);
    setTitleVi(post.title.vi);
    setTitleEn(post.title.en);
    setSlug(post.slug || '');
    setExcerptVi(post.excerpt.vi);
    setExcerptEn(post.excerpt.en);
    setContentVi(post.content.vi);
    setContentEn(post.content.en);
    setThumbnail(post.image);
    setCategory(post.category);
    setAuthor(post.author);
    setPublishDate(post.date);
    setStatus(post.status);
    setDisplayOrder(String(post.order));
    setSeoTitle(post.seoTitle || '');
    setSeoDescription(post.seoDescription || '');
    setIsModalOpen(true);
  };

  // Submit Add/Edit Form
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!titleVi.trim() || !titleEn.trim() || !category) return;

    const postData: BlogPost = {
      id: editingPost ? editingPost.id : `post-${Date.now()}`,
      category,
      title: { vi: titleVi, en: titleEn },
      excerpt: { vi: excerptVi, en: excerptEn },
      content: { vi: contentVi, en: contentEn },
      date: publishDate || new Date().toISOString().split('T')[0],
      readTime: {
        vi: `${Math.max(1, Math.ceil(contentVi.split(/\s+/).length / 200))} phút đọc`,
        en: `${Math.max(1, Math.ceil(contentEn.split(/\s+/).length / 200))} min read`
      },
      image: thumbnail,
      status,
      author: author || 'Admin',
      order: parseInt(displayOrder) || 1,
      seoTitle,
      seoDescription,
      slug
    };

    let updatedPosts;
    if (editingPost) {
      updatedPosts = posts.map(p => p.id === editingPost.id ? postData : p);
    } else {
      updatedPosts = [postData, ...posts];
    }

    saveToStorage(updatedPosts);
    setIsModalOpen(false);
  };

  // Toggle visible status directly
  const handleToggleStatus = (post: BlogPost) => {
    const nextStatus: 'PUBLISHED' | 'HIDDEN' = post.status === 'PUBLISHED' ? 'HIDDEN' : 'PUBLISHED';
    const updated = posts.map(p => p.id === post.id ? { ...p, status: nextStatus } : p);
    saveToStorage(updated);
  };

  const handleDelete = () => {
    if (!confirmDelete.post) return;
    const updated = posts.filter(p => p.id !== confirmDelete.post!.id);
    saveToStorage(updated);
    setConfirmDelete({ isOpen: false, post: null });
  };

  // Filter Posts
  const filteredPosts = posts.filter(post => {
    const matchesSearch = 
      post.title.vi.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.title.en.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.author.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = categoryFilter === 'ALL' || post.category === categoryFilter;
    const matchesStatus = statusFilter === 'ALL' || post.status === statusFilter;

    return matchesSearch && matchesCategory && matchesStatus;
  });

  return (
    <div>
      {/* Breadcrumb */}
      <div className="wp-breadcrumb">
        <Link to="/dashboard/admin">Dashboard</Link>
        <span className="wp-breadcrumb-sep">›</span>
        <span className="wp-breadcrumb-current">Quản lý bài viết</span>
      </div>

      <div className="wp-page-header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
        <h1 className="wp-page-title" style={{ margin: 0 }}>Quản lý bài viết</h1>
        <button
          onClick={handleOpenAdd}
          className="wp-btn wp-btn-primary"
          style={{ display: 'inline-flex', alignItems: 'center', gap: 4, padding: '4px 12px', fontSize: 13 }}
        >
          <Plus size={14} /> Thêm bài viết
        </button>
      </div>

      {/* ─── Search & Filters Bar (WordPress Admin style) ─── */}
      <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8, alignItems: 'center', marginBottom: 12 }}>
        <div style={{ display: 'flex', gap: 6, alignItems: 'center', flexWrap: 'wrap' }}>
          <select
            value={categoryFilter}
            onChange={e => setCategoryFilter(e.target.value)}
            style={{ height: 30, fontSize: 12, padding: '0 8px', border: '1px solid #8c8f94', borderRadius: 3, outline: 'none' }}
          >
            <option value="ALL">Tất cả danh mục</option>
            {categories.map(cat => (
              <option key={cat.key} value={cat.key}>{cat.vi}</option>
            ))}
          </select>

          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            style={{ height: 30, fontSize: 12, padding: '0 8px', border: '1px solid #8c8f94', borderRadius: 3, outline: 'none' }}
          >
            <option value="ALL">Tất cả trạng thái</option>
            <option value="PUBLISHED">Công khai (Published)</option>
            <option value="DRAFT">Nháp (Draft)</option>
            <option value="HIDDEN">Bị ẩn (Hidden)</option>
          </select>
        </div>

        <div style={{ position: 'relative', width: 220 }}>
          <Search size={13} style={{ position: 'absolute', left: 8, top: '50%', transform: 'translateY(-50%)', color: '#8c8f94' }} />
          <input
            type="text"
            placeholder="Tìm theo tiêu đề, tác giả..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            style={{
              width: '100%', paddingLeft: 28, paddingRight: 8,
              height: 30, fontSize: 12, border: '1px solid #8c8f94',
              borderRadius: 3, outline: 'none', boxSizing: 'border-box'
            }}
          />
        </div>
      </div>

      {/* ─── Posts Table ─── */}
      <div className="wp-table-wrap">
        <table className="wp-table">
          <thead>
            <tr>
              <th style={{ width: 80 }}>Thumbnail</th>
              <th>Tiêu đề bài viết</th>
              <th style={{ width: 140 }}>Danh mục</th>
              <th style={{ width: 100 }}>Tác giả</th>
              <th style={{ width: 110 }}>Ngày đăng</th>
              <th style={{ width: 70, textAlign: 'center' }}>Thứ tự</th>
              <th style={{ width: 100, textAlign: 'center' }}>Trạng thái</th>
            </tr>
          </thead>
          <tbody>
            {filteredPosts.length === 0 ? (
              <tr>
                <td colSpan={7} style={{ textAlign: 'center', padding: 40, color: '#646970', fontSize: 13 }}>
                  Không tìm thấy bài viết nào.
                </td>
              </tr>
            ) : (
              filteredPosts.map(post => {
                const catObj = categories.find(c => c.key === post.category);
                
                return (
                  <tr key={post.id}>
                    <td>
                      <div style={{ width: 60, height: 38, borderRadius: 3, overflow: 'hidden', background: '#f0f0f1', border: '1px solid #dcdcde' }}>
                        {post.image ? (
                          <img src={post.image} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        ) : (
                          <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ccd0d4' }}>
                            <ImageIcon size={14} />
                          </div>
                        )}
                      </div>
                    </td>
                    <td>
                      <div>
                        <a
                          href="#"
                          onClick={e => { e.preventDefault(); handleOpenEdit(post); }}
                          className="wp-row-title"
                          style={{ textDecoration: 'none' }}
                        >
                          {post.title.vi}
                        </a>
                        <div style={{ fontSize: 11, color: '#646970', marginTop: 2 }}>{post.title.en}</div>
                        
                        {/* Hover Actions in table */}
                        <div className="wp-row-actions">
                          <a href="#" onClick={e => { e.preventDefault(); handleOpenEdit(post); }}>Sửa</a>
                          <span className="sep">|</span>
                          <button type="button" onClick={() => handleToggleStatus(post)}>
                            {post.status === 'PUBLISHED' ? 'Ẩn' : 'Hiện'}
                          </button>
                          <span className="sep">|</span>
                          <button type="button" onClick={() => setPreviewPost(post)}>Xem trước</button>
                          <span className="sep">|</span>
                          <button
                            type="button"
                            onClick={() => setConfirmDelete({ isOpen: true, post })}
                            className="delete"
                          >
                            Xoá
                          </button>
                        </div>
                      </div>
                    </td>
                    <td style={{ fontSize: 12 }}>
                      {catObj ? catObj.vi : post.category}
                    </td>
                    <td style={{ fontSize: 12, color: '#646970' }}>
                      {post.author}
                    </td>
                    <td style={{ fontSize: 12, color: '#646970', fontFamily: 'monospace' }}>
                      {post.date}
                    </td>
                    <td style={{ textAlign: 'center', fontSize: 12, fontFamily: 'monospace' }}>
                      {post.order}
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      <span className={`wp-badge ${post.status === 'PUBLISHED' ? 'wp-badge-published' : post.status === 'DRAFT' ? 'wp-badge-draft' : 'wp-badge-pending'}`}>
                        {post.status === 'PUBLISHED' ? 'Công khai' : post.status === 'DRAFT' ? 'Bản nháp' : 'Đang ẩn'}
                      </span>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* ─── Add/Edit Modal Form ─── */}
      {isModalOpen && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,.45)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999 }}>
          <div style={{ position: 'absolute', inset: 0 }} onClick={() => setIsModalOpen(false)} />
          
          <div style={{
            position: 'relative', width: '100%', maxWidth: 780, maxHeight: '90vh',
            background: '#fff', borderRadius: 6, border: '1px solid #c3c4c7',
            display: 'flex', flexDirection: 'column', overflow: 'hidden', boxShadow: '0 3px 6px rgba(0,0,0,0.3)'
          }}>
            {/* Modal Header */}
            <div style={{ display: 'flex', alignItems: 'center', padding: '12px 16px', background: '#f6f7f7', borderBottom: '1px solid #c3c4c7', justifyContent: 'space-between' }}>
              <h3 style={{ fontSize: 13, fontWeight: 600, margin: 0, color: '#1d2327' }}>
                {editingPost ? 'Chỉnh sửa bài viết' : 'Thêm bài viết mới'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#646970', padding: 4 }}
              >
                <X size={16} />
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleSubmit} style={{ padding: 16, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 12 }}>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div className="wp-form-row" style={{ margin: 0 }}>
                  <label className="wp-form-label">Tiêu đề Tiếng Việt *</label>
                  <input
                    required
                    type="text"
                    className="wp-form-input"
                    value={titleVi}
                    onChange={e => {
                      setTitleVi(e.target.value);
                      if (!editingPost) generateSlug(e.target.value);
                    }}
                    placeholder="Nhập tiêu đề tiếng Việt"
                  />
                </div>
                <div className="wp-form-row" style={{ margin: 0 }}>
                  <label className="wp-form-label">Tiêu đề English *</label>
                  <input
                    required
                    type="text"
                    className="wp-form-input"
                    value={titleEn}
                    onChange={e => setTitleEn(e.target.value)}
                    placeholder="Enter English title"
                  />
                </div>
              </div>

              <div className="wp-form-row" style={{ margin: 0 }}>
                <label className="wp-form-label">Đường dẫn (Slug)</label>
                <input
                  required
                  type="text"
                  className="wp-form-input"
                  value={slug}
                  onChange={e => setSlug(e.target.value)}
                  placeholder="vi-du-slug-bai-viet"
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div className="wp-form-row" style={{ margin: 0 }}>
                  <label className="wp-form-label">Mô tả ngắn Tiếng Việt</label>
                  <textarea
                    rows={2}
                    className="wp-form-input"
                    value={excerptVi}
                    onChange={e => setExcerptVi(e.target.value)}
                    placeholder="Tóm tắt ngắn gọn..."
                    style={{ resize: 'vertical' }}
                  />
                </div>
                <div className="wp-form-row" style={{ margin: 0 }}>
                  <label className="wp-form-label">Mô tả ngắn English</label>
                  <textarea
                    rows={2}
                    className="wp-form-input"
                    value={excerptEn}
                    onChange={e => setExcerptEn(e.target.value)}
                    placeholder="Short summary..."
                    style={{ resize: 'vertical' }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div className="wp-form-row" style={{ margin: 0 }}>
                  <label className="wp-form-label">Nội dung Tiếng Việt *</label>
                  <textarea
                    required
                    rows={6}
                    className="wp-form-input"
                    value={contentVi}
                    onChange={e => setContentVi(e.target.value)}
                    placeholder="Soạn nội dung chính..."
                    style={{ resize: 'vertical', fontSize: 12 }}
                  />
                </div>
                <div className="wp-form-row" style={{ margin: 0 }}>
                  <label className="wp-form-label">Nội dung English *</label>
                  <textarea
                    required
                    rows={6}
                    className="wp-form-input"
                    value={contentEn}
                    onChange={e => setContentEn(e.target.value)}
                    placeholder="Compose core content..."
                    style={{ resize: 'vertical', fontSize: 12 }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 12, alignItems: 'end' }}>
                <div className="wp-form-row" style={{ margin: 0 }}>
                  <label className="wp-form-label">Đường dẫn ảnh Thumbnail (URL)</label>
                  <input
                    type="url"
                    className="wp-form-input"
                    value={thumbnail}
                    onChange={e => setThumbnail(e.target.value)}
                    placeholder="https://images.unsplash.com/..."
                  />
                </div>
                <div style={{ width: '100%', height: 32, borderRadius: 3, border: '1px solid #c3c4c7', overflow: 'hidden', background: '#f0f0f1', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {thumbnail ? (
                    <img src={thumbnail} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    <span style={{ fontSize: 10, color: '#8c8f94' }}>Không có ảnh</span>
                  )}
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
                <div className="wp-form-row" style={{ margin: 0 }}>
                  <label className="wp-form-label">Danh mục *</label>
                  <select
                    className="wp-form-input"
                    value={category}
                    onChange={e => setCategory(e.target.value)}
                  >
                    {categories.map(cat => (
                      <option key={cat.key} value={cat.key}>{cat.vi}</option>
                    ))}
                  </select>
                </div>
                <div className="wp-form-row" style={{ margin: 0 }}>
                  <label className="wp-form-label">Tác giả</label>
                  <input
                    type="text"
                    className="wp-form-input"
                    value={author}
                    onChange={e => setAuthor(e.target.value)}
                  />
                </div>
                <div className="wp-form-row" style={{ margin: 0 }}>
                  <label className="wp-form-label">Ngày đăng</label>
                  <input
                    type="date"
                    className="wp-form-input"
                    value={publishDate}
                    onChange={e => setPublishDate(e.target.value)}
                  />
                </div>
                <div className="wp-form-row" style={{ margin: 0 }}>
                  <label className="wp-form-label">Trạng thái *</label>
                  <select
                    className="wp-form-input"
                    value={status}
                    onChange={e => setStatus(e.target.value as any)}
                  >
                    <option value="PUBLISHED">Công khai (Published)</option>
                    <option value="DRAFT">Bản nháp (Draft)</option>
                    <option value="HIDDEN">Ẩn bài viết (Hidden)</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '80px 1fr 1fr', gap: 12 }}>
                <div className="wp-form-row" style={{ margin: 0 }}>
                  <label className="wp-form-label">Thứ tự</label>
                  <input
                    type="number"
                    className="wp-form-input"
                    value={displayOrder}
                    onChange={e => setDisplayOrder(e.target.value)}
                    min="1"
                  />
                </div>
                <div className="wp-form-row" style={{ margin: 0 }}>
                  <label className="wp-form-label">SEO Title</label>
                  <input
                    type="text"
                    className="wp-form-input"
                    value={seoTitle}
                    onChange={e => setSeoTitle(e.target.value)}
                    placeholder="Mặc định lấy tiêu đề"
                  />
                </div>
                <div className="wp-form-row" style={{ margin: 0 }}>
                  <label className="wp-form-label">SEO Description</label>
                  <input
                    type="text"
                    className="wp-form-input"
                    value={seoDescription}
                    onChange={e => setSeoDescription(e.target.value)}
                    placeholder="Mặc định lấy mô tả ngắn"
                  />
                </div>
              </div>

              {/* Actions */}
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 12, paddingTop: 12, borderTop: '1px solid #c3c4c7', alignItems: 'center' }}>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="wp-btn"
                  style={{ fontSize: 13, padding: '4px 14px' }}
                >
                  Hủy
                </button>
                <div style={{ display: 'flex', gap: 6 }}>
                  <button
                    type="button"
                    onClick={() => setPreviewPost({
                      id: 'preview',
                      category,
                      title: { vi: titleVi || 'Tiêu đề trống', en: titleEn || 'Empty title' },
                      excerpt: { vi: excerptVi, en: excerptEn },
                      content: { vi: contentVi, en: contentEn },
                      date: publishDate || new Date().toISOString().split('T')[0],
                      readTime: { vi: '5 phút đọc', en: '5 min read' },
                      image: thumbnail,
                      status,
                      author: author || 'Admin',
                      order: parseInt(displayOrder) || 1
                    })}
                    className="wp-btn"
                    style={{ fontSize: 13, padding: '4px 14px' }}
                  >
                    Xem trước
                  </button>
                  <button
                    type="submit"
                    className="wp-btn wp-btn-primary"
                    style={{ fontSize: 13, padding: '4px 14px' }}
                  >
                    {editingPost ? 'Lưu thay đổi' : 'Đăng bài viết'}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirm */}
      <ConfirmDialog
        isOpen={confirmDelete.isOpen}
        onClose={() => setConfirmDelete({ isOpen: false, post: null })}
        onConfirm={handleDelete}
        title="Xoá bài viết"
        message={`Bạn có chắc muốn xoá bài viết "${confirmDelete.post?.title?.vi}" không? Thao tác này không thể hoàn tác.`}
        confirmText="Xoá"
        variant="danger"
      />

      {/* ─── Public Preview Modal ─── */}
      {previewPost && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,.45)', display: 'flex', alignItems: 'center', zIndex: 9999, justifyContent: 'center' }}>
          <div style={{ position: 'absolute', inset: 0 }} onClick={() => setPreviewPost(null)} />
          
          <div style={{
            position: 'relative', width: '90%', maxWidth: 640, maxHeight: '80vh',
            background: '#fff', borderRadius: 6, border: '1px solid #c3c4c7',
            display: 'flex', flexDirection: 'column', overflow: 'hidden', boxShadow: '0 3px 6px rgba(0,0,0,0.3)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', padding: '12px 16px', background: '#f6f7f7', borderBottom: '1px solid #c3c4c7', justifyContent: 'space-between' }}>
              <span style={{ fontSize: 11, fontWeight: 700, color: '#2271b1', background: '#e6f6ee', padding: '2px 6px', borderRadius: 3 }}>
                XEM TRƯỚC BÀI VIẾT
              </span>
              <button onClick={() => setPreviewPost(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#646970', padding: 4 }}>
                <X size={16} />
              </button>
            </div>
            
            <div style={{ padding: 20, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 12 }}>
              <h2 style={{ fontSize: 18, fontWeight: 700, margin: 0, color: '#1c1c1c' }}>{previewPost.title.vi}</h2>
              <div style={{ fontSize: 11, color: '#8c8f94' }}>Tác giả: {previewPost.author} • Ngày đăng: {previewPost.date}</div>
              {previewPost.image && (
                <div style={{ width: '100%', height: 240, overflow: 'hidden', borderRadius: 4 }}>
                  <img src={previewPost.image} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
              )}
              <div style={{ fontSize: 13, lineHeight: 1.6, color: '#32373c' }}>
                {previewPost.content.vi.split('\n\n').map((para, i) => (
                  <p key={i} style={{ margin: '0 0 10px' }}>{para}</p>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


