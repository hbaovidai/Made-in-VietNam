import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { blogDb, BlogSettings, BlogPost } from '../../../utils/blogDb';

export function AdminBlogSettings() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  
  // Settings Form State
  const [titleVi, setTitleVi] = useState('');
  const [titleEn, setTitleEn] = useState('');
  const [subtitleVi, setSubtitleVi] = useState('');
  const [subtitleEn, setSubtitleEn] = useState('');
  const [showSearch, setShowSearch] = useState(true);
  const [showCategories, setShowCategories] = useState(true);
  const [postsPerPage, setPostsPerPage] = useState('6');
  const [layout, setLayout] = useState<'grid' | 'list'>('grid');
  const [featuredPostId, setFeaturedPostId] = useState('');

  // Notification Banner State
  const [saved, setSaved] = useState(false);
  const [reseted, setReseted] = useState(false);

  useEffect(() => {
    // Load current values
    const current = blogDb.getSettings();
    setTitleVi(current.titleVi);
    setTitleEn(current.titleEn);
    setSubtitleVi(current.subtitleVi);
    setSubtitleEn(current.subtitleEn);
    setShowSearch(current.showSearch);
    setShowCategories(current.showCategories);
    setPostsPerPage(String(current.postsPerPage));
    setLayout(current.layout);
    setFeaturedPostId(current.featuredPostId || '');

    // Load posts for the featured dropdown selection
    setPosts(blogDb.getPosts().filter(p => p.status === 'PUBLISHED'));
  }, []);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();

    const data: BlogSettings = {
      titleVi: titleVi.trim(),
      titleEn: titleEn.trim(),
      subtitleVi: subtitleVi.trim(),
      subtitleEn: subtitleEn.trim(),
      showSearch,
      showCategories,
      postsPerPage: parseInt(postsPerPage) || 6,
      layout,
      featuredPostId
    };

    blogDb.saveSettings(data);
    
    setSaved(true);
    setReseted(false);
    setTimeout(() => setSaved(false), 3000);
  };

  const handleReset = () => {
    if (window.confirm('Bạn có muốn khôi phục toàn bộ cài đặt về mặc định không?')) {
      localStorage.removeItem('mivn5_blog_settings');
      const defaults = blogDb.getSettings();
      setTitleVi(defaults.titleVi);
      setTitleEn(defaults.titleEn);
      setSubtitleVi(defaults.subtitleVi);
      setSubtitleEn(defaults.subtitleEn);
      setShowSearch(defaults.showSearch);
      setShowCategories(defaults.showCategories);
      setPostsPerPage(String(defaults.postsPerPage));
      setLayout(defaults.layout);
      setFeaturedPostId(defaults.featuredPostId || '');

      setReseted(true);
      setSaved(false);
      setTimeout(() => setReseted(false), 3000);
    }
  };

  return (
    <div>
      {/* Breadcrumb */}
      <div className="wp-breadcrumb">
        <Link to="/dashboard/admin">Dashboard</Link>
        <span className="wp-breadcrumb-sep">›</span>
        <span className="wp-breadcrumb-current">Cài đặt blog</span>
      </div>

      <h1 className="wp-page-title">Cài đặt blog</h1>

      {saved && (
        <div style={{ padding: '8px 12px', background: '#e6f7e9', border: '1px solid #00a32a', borderRadius: 4, marginBottom: 16, fontSize: 13, color: '#00a32a' }}>
          ✓ Đã lưu cài đặt blog thành công.
        </div>
      )}

      {reseted && (
        <div style={{ padding: '8px 12px', background: '#fff9e6', border: '1px solid #d49700', borderRadius: 4, marginBottom: 16, fontSize: 13, color: '#d49700' }}>
          ✓ Đã khôi phục cài đặt mặc định thành công.
        </div>
      )}

      <form onSubmit={handleSave} style={{ maxWidth: 780 }}>
        {/* SECTION 1: General Settings */}
        <div className="wp-form-section">
          <h2 className="wp-form-section-title">Tiêu đề & Khẩu hiệu</h2>
          <table className="wp-form-table">
            <tbody>
              <tr>
                <th>Tiêu đề (Tiếng Việt)</th>
                <td>
                  <input
                    required
                    className="wp-form-input"
                    type="text"
                    value={titleVi}
                    onChange={e => setTitleVi(e.target.value)}
                  />
                  <p className="wp-form-desc">Tiêu đề hiển thị ở đầu trang Blog của phiên bản tiếng Việt.</p>
                </td>
              </tr>
              <tr>
                <th>Tiêu đề (English)</th>
                <td>
                  <input
                    required
                    className="wp-form-input"
                    type="text"
                    value={titleEn}
                    onChange={e => setTitleEn(e.target.value)}
                  />
                  <p className="wp-form-desc">Tiêu đề hiển thị ở đầu trang Blog của phiên bản tiếng Anh.</p>
                </td>
              </tr>
              <tr>
                <th>Khẩu hiệu (Tiếng Việt)</th>
                <td>
                  <textarea
                    rows={2}
                    className="wp-form-input"
                    value={subtitleVi}
                    onChange={e => setSubtitleVi(e.target.value)}
                    style={{ resize: 'vertical' }}
                  />
                  <p className="wp-form-desc">Slogan ngắn gọn dưới tiêu đề của phiên bản tiếng Việt.</p>
                </td>
              </tr>
              <tr>
                <th>Khẩu hiệu (English)</th>
                <td>
                  <textarea
                    rows={2}
                    className="wp-form-input"
                    value={subtitleEn}
                    onChange={e => setSubtitleEn(e.target.value)}
                    style={{ resize: 'vertical' }}
                  />
                  <p className="wp-form-desc">Slogan ngắn gọn dưới tiêu đề của phiên bản tiếng Anh.</p>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* SECTION 2: Features and Layout */}
        <div className="wp-form-section">
          <h2 className="wp-form-section-title">Tính năng & Giao diện</h2>
          <table className="wp-form-table">
            <tbody>
              <tr>
                <th>Thanh tìm kiếm</th>
                <td>
                  <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13 }}>
                    <input
                      type="checkbox"
                      checked={showSearch}
                      onChange={e => setShowSearch(e.target.checked)}
                      style={{ margin: 0 }}
                    />
                    Hiển thị thanh tìm kiếm bài viết ở đầu trang blog
                  </label>
                </td>
              </tr>
              <tr>
                <th>Bộ lọc danh mục</th>
                <td>
                  <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13 }}>
                    <input
                      type="checkbox"
                      checked={showCategories}
                      onChange={e => setShowCategories(e.target.checked)}
                      style={{ margin: 0 }}
                    />
                    Hiển thị các nút lọc danh mục bài viết (All, Tin tức, Hướng dẫn...)
                  </label>
                </td>
              </tr>
              <tr>
                <th>Bố cục hiển thị</th>
                <td>
                  <select
                    className="wp-form-input"
                    value={layout}
                    onChange={e => setLayout(e.target.value as any)}
                    style={{ maxWidth: 200 }}
                  >
                    <option value="grid">Dạng ô (Grid Layout)</option>
                    <option value="list">Dạng danh sách (List Layout)</option>
                  </select>
                  <p className="wp-form-desc">Kiểu hiển thị bài viết mặc định trên trang.</p>
                </td>
              </tr>
              <tr>
                <th>Số bài viết mỗi trang</th>
                <td>
                  <input
                    type="number"
                    className="wp-form-input"
                    value={postsPerPage}
                    onChange={e => setPostsPerPage(e.target.value)}
                    min="1"
                    max="24"
                    style={{ maxWidth: 100 }}
                  />
                  <p className="wp-form-desc">Số lượng bài viết hiển thị trên mỗi trang trước khi phân trang.</p>
                </td>
              </tr>
              <tr>
                <th>Bài viết nổi bật (Featured)</th>
                <td>
                  <select
                    className="wp-form-input"
                    value={featuredPostId}
                    onChange={e => setFeaturedPostId(e.target.value)}
                    style={{ maxWidth: 300 }}
                  >
                    <option value="">-- Không chọn bài viết nổi bật --</option>
                    {posts.map(p => (
                      <option key={p.id} value={p.id}>{p.title.vi}</option>
                    ))}
                  </select>
                  <p className="wp-form-desc">Bài viết nổi bật sẽ được hiển thị to và đẹp hơn ở vị trí đầu tiên.</p>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Buttons */}
        <div style={{ display: 'flex', gap: 12, marginTop: 20 }}>
          <button
            type="submit"
            className="wp-btn wp-btn-primary"
            style={{ padding: '6px 18px', fontSize: 13 }}
          >
            Lưu thay đổi
          </button>
          <button
            type="button"
            className="wp-btn"
            onClick={handleReset}
            style={{ padding: '6px 18px', fontSize: 13 }}
          >
            Khôi phục mặc định
          </button>
        </div>
      </form>
    </div>
  );
}
