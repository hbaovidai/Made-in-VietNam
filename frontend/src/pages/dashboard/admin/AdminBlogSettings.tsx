import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { blogDb, BlogSettings, BlogPost } from '../../../utils/blogDb';

export function AdminBlogSettings() {
  const { t } = useTranslation();
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
          <h2 className="wp-form-section-title">{t('tieu_de_khau_hieu')}</h2>
          <table className="wp-form-table">
            <tbody>
              <tr>
                <th>{t('tieu_de_tieng_viet')}</th>
                <td>
                  <input
                    required
                    className="wp-form-input"
                    type="text"
                    value={titleVi}
                    onChange={e => setTitleVi(e.target.value)}
                  />
                  <p className="wp-form-desc">{t('tieu_de_hien_thi_o_dau_trang_blog_cua_ph')}</p>
                </td>
              </tr>
              <tr>
                <th>{t('tieu_de_english')}</th>
                <td>
                  <input
                    required
                    className="wp-form-input"
                    type="text"
                    value={titleEn}
                    onChange={e => setTitleEn(e.target.value)}
                  />
                  <p className="wp-form-desc">{t('tieu_de_hien_thi_o_dau_trang_blog_cua_ph_1')}</p>
                </td>
              </tr>
              <tr>
                <th>{t('khau_hieu_tieng_viet')}</th>
                <td>
                  <textarea
                    rows={2}
                    className="wp-form-input"
                    value={subtitleVi}
                    onChange={e => setSubtitleVi(e.target.value)}
                    style={{ resize: 'vertical' }}
                  />
                  <p className="wp-form-desc">{t('slogan_ngan_gon_duoi_tieu_de_cua_phien_b')}</p>
                </td>
              </tr>
              <tr>
                <th>{t('khau_hieu_english')}</th>
                <td>
                  <textarea
                    rows={2}
                    className="wp-form-input"
                    value={subtitleEn}
                    onChange={e => setSubtitleEn(e.target.value)}
                    style={{ resize: 'vertical' }}
                  />
                  <p className="wp-form-desc">{t('slogan_ngan_gon_duoi_tieu_de_cua_phien_b_1')}</p>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* SECTION 2: Features and Layout */}
        <div className="wp-form-section">
          <h2 className="wp-form-section-title">{t('tinh_nang_giao_dien')}</h2>
          <table className="wp-form-table">
            <tbody>
              <tr>
                <th>{t('thanh_tim_kiem')}</th>
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
                <th>{t('bo_loc_danh_muc')}</th>
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
                <th>{t('bo_cuc_hien_thi')}</th>
                <td>
                  <select
                    className="wp-form-input"
                    value={layout}
                    onChange={e => setLayout(e.target.value as any)}
                    style={{ maxWidth: 200 }}
                  >
                    <option value="grid">{t('dang_o_grid_layout')}</option>
                    <option value="list">{t('dang_danh_sach_list_layout')}</option>
                  </select>
                  <p className="wp-form-desc">{t('kieu_hien_thi_bai_viet_mac_dinh_tren_tra')}</p>
                </td>
              </tr>
              <tr>
                <th>{t('so_bai_viet_moi_trang')}</th>
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
                  <p className="wp-form-desc">{t('so_luong_bai_viet_hien_thi_tren_moi_tran')}</p>
                </td>
              </tr>
              <tr>
                <th>{t('bai_viet_noi_bat_featured')}</th>
                <td>
                  <select
                    className="wp-form-input"
                    value={featuredPostId}
                    onChange={e => setFeaturedPostId(e.target.value)}
                    style={{ maxWidth: 300 }}
                  >
                    <option value="">{t('khong_chon_bai_viet_noi_bat')}</option>
                    {posts.map(p => (
                      <option key={p.id} value={p.id}>{p.title.vi}</option>
                    ))}
                  </select>
                  <p className="wp-form-desc">{t('bai_viet_noi_bat_se_duoc_hien_thi_to_va_')}</p>
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
            {t('khoi_phuc_mac_dinh')}
          </button>
        </div>
      </form>
    </div>
  );
}
