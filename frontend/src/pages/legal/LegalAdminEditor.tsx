import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Upload, Trash2, Plus, ChevronUp, ChevronDown, Loader2, Pencil, X, Eye, EyeOff, Save } from 'lucide-react';
import { api } from '../../lib/api';

// ─── Types ───────────────────────────────────────────────────
export interface LegalSection {
  id: string;
  titleVi: string;
  titleEn: string;
  slug: string;
  contentVi: string;
  contentEn: string;
  sortOrder: number;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

interface SettingsKeys {
  titleVi: string;
  titleEn: string;
  subtitleVi: string;
  subtitleEn: string;
  lastUpdated: string;
  bannerBg: string;
}

interface LegalAdminEditorProps {
  pageKey: 'terms' | 'privacy';
  pageTitle: string;
  settingsKeys: SettingsKeys;
}

// ─── Styles ──────────────────────────────────────────────────
const card: React.CSSProperties = { background: '#fff', border: '1px solid #dcdcde', borderRadius: 4, padding: 20, marginBottom: 20 };
const cardTitle: React.CSSProperties = { fontSize: 14, fontWeight: 600, color: '#1d2327', marginBottom: 16, paddingBottom: 10, borderBottom: '1px solid #f0f0f1' };
const fieldLabel: React.CSSProperties = { fontSize: 12, fontWeight: 600, color: '#1d2327', marginBottom: 4, display: 'block' };
const fieldDesc: React.CSSProperties = { fontSize: 11, color: '#646970', marginTop: 2, marginBottom: 12 };
const inputStyle: React.CSSProperties = { width: '100%', padding: '6px 10px', border: '1px solid #8c8f94', borderRadius: 4, fontSize: 13, boxSizing: 'border-box' as const };

// ─── Slug helper for Vietnamese ──────────────────────────────
function generateSlug(str: string): string {
  if (!str) return '';
  let slug = str.toLowerCase();
  slug = slug.replace(/á|à|ả|ã|ạ|ă|ắ|ằ|ẳ|ẵ|ặ|â|ấ|ầ|ẩ|ẫ|ậ/g, 'a');
  slug = slug.replace(/é|è|ẻ|ẽ|ẹ|ê|ế|ề|ể|ễ|ệ/g, 'e');
  slug = slug.replace(/i|í|ì|ỉ|ĩ|ị/g, 'i');
  slug = slug.replace(/ó|ò|ỏ|õ|ọ|ô|ố|ồ|ổ|ỗ|ộ|ơ|ớ|ờ|ở|ỡ|ợ/g, 'o');
  slug = slug.replace(/ú|ù|ủ|ũ|ụ|ư|ứ|ừ|ử|ữ|ự/g, 'u');
  slug = slug.replace(/ý|ỳ|ỷ|ỹ|ỵ/g, 'y');
  slug = slug.replace(/đ/g, 'd');
  slug = slug.replace(/[^a-z0-9\s-]/g, '');
  slug = slug.replace(/\s+/g, '-');
  slug = slug.replace(/-+/g, '-');
  return slug.trim().replace(/^-+|-+$/g, '');
}

// ─── Image Uploader Component ────────────────────────────────
function ImageUploader({ value, onChange, label, height = 120 }: { value: string; onChange: (url: string) => void; label?: string; height?: number }) {
  const ref = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  const handleFile = async (file: File) => {
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append('file', file);
      const res = await api.post('/uploads', fd, {
        headers: { Authorization: `Bearer ${localStorage.getItem('mivn5_token')}`, 'Content-Type': 'multipart/form-data' },
      });
      onChange(res.data.url);
    } catch (e: any) {
      alert(e?.response?.data?.message || 'Upload thất bại');
    }
    setUploading(false);
  };

  return (
    <div>
      {label && <label style={fieldLabel}>{label}</label>}
      <div style={{ display: 'flex', gap: 8, marginBottom: 6 }}>
        <input style={{ ...inputStyle, flex: 1 }} value={value} onChange={e => onChange(e.target.value)} placeholder="URL ảnh hoặc upload file bên dưới" />
        <input ref={ref} type="file" accept="image/*" hidden onChange={e => e.target.files?.[0] && handleFile(e.target.files[0])} />
        <button onClick={() => ref.current?.click()} disabled={uploading}
          style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '6px 12px', border: '1px solid #2271b1', borderRadius: 4, background: '#f6f7f7', cursor: 'pointer', fontSize: 12, color: '#2271b1', whiteSpace: 'nowrap' }}>
          {uploading ? <Loader2 size={14} className="animate-spin" /> : <Upload size={14} />}
          {uploading ? 'Đang tải...' : 'Upload'}
        </button>
      </div>
      {value && (
        <div style={{ position: 'relative', marginTop: 4, borderRadius: 6, overflow: 'hidden', border: '1px solid #dcdcde' }}>
          <img src={value} alt="" style={{ width: '100%', height, objectFit: 'cover', display: 'block' }} onError={e => (e.currentTarget.style.display = 'none')} referrerPolicy="no-referrer" />
          <button onClick={() => onChange('')} style={{ position: 'absolute', top: 6, right: 6, background: '#d63638', color: '#fff', border: 'none', borderRadius: 4, padding: '3px 8px', cursor: 'pointer', fontSize: 11, display: 'flex', alignItems: 'center', gap: 4 }}>
            <Trash2 size={12} /> Xóa
          </button>
        </div>
      )}
    </div>
  );
}

export function LegalAdminEditor({
  pageKey,
  pageTitle,
  settingsKeys,
}: LegalAdminEditorProps) {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<'settings' | 'sections'>('sections');
  
  // Settings state
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [originalSettings, setOriginalSettings] = useState<Record<string, string>>({});
  const [settingsLoading, setSettingsLoading] = useState(true);
  const [settingsSaving, setSettingsSaving] = useState(false);
  const [settingsSaved, setSettingsSaved] = useState(false);

  // Sections state
  const [sections, setSections] = useState<LegalSection[]>([]);
  const [sectionsLoading, setSectionsLoading] = useState(true);
  const [sectionModal, setSectionModal] = useState<LegalSection | null>(null); // null = closed
  const [sectionSaving, setSectionSaving] = useState(false);

  const authHeader = { headers: { Authorization: `Bearer ${localStorage.getItem('mivn5_token')}` } };

  // Load Settings
  const loadSettings = useCallback(async () => {
    setSettingsLoading(true);
    try {
      const res = await api.get('/settings');
      const data = res.data || {};
      setSettings(data);
      setOriginalSettings(data);
    } catch (e) {
      console.error(e);
    }
    setSettingsLoading(false);
  }, []);

  // Load Sections
  const loadSections = useCallback(async () => {
    setSectionsLoading(true);
    try {
      const res = await api.get(`/legal-sections/admin?pageKey=${pageKey}`, authHeader);
      setSections(res.data || []);
    } catch (e) {
      console.error(e);
    }
    setSectionsLoading(false);
  }, [pageKey]);

  useEffect(() => {
    loadSettings();
    loadSections();
  }, [loadSettings, loadSections]);

  const updateSetting = (key: string, val: string) => {
    setSettings(prev => ({ ...prev, [key]: val }));
    setSettingsSaved(false);
  };

  const hasSettingsChanges = JSON.stringify(settings) !== JSON.stringify(originalSettings);

  const handleSaveSettings = async () => {
    setSettingsSaving(true);
    try {
      await api.put('/settings', settings, authHeader);
      setOriginalSettings({ ...settings });
      setSettingsSaved(true);
      setTimeout(() => setSettingsSaved(false), 3000);
    } catch (e) {
      console.error(e);
      alert('Lưu cài đặt thất bại');
    }
    setSettingsSaving(false);
  };

  // Section handlers
  const handleSaveSection = async () => {
    if (!sectionModal) return;
    if (!sectionModal.titleVi || !sectionModal.titleEn || !sectionModal.slug) {
      alert('Vui lòng nhập đầy đủ Tiêu đề và Slug');
      return;
    }

    setSectionSaving(true);
    try {
      const payload = {
        ...sectionModal,
        pageKey,
      };
      if (sectionModal.id) {
        await api.put(`/legal-sections/${sectionModal.id}`, payload, authHeader);
      } else {
        await api.post('/legal-sections', payload, authHeader);
      }
      setSectionModal(null);
      await loadSections();
    } catch (e: any) {
      console.error(e);
      alert(e?.response?.data?.message || e.message || 'Lưu phần nội dung thất bại');
    }
    setSectionSaving(false);
  };

  const handleDeleteSection = async (id: string) => {
    if (!confirm('Bạn có chắc chắn muốn xóa phần nội dung này?')) return;
    try {
      await api.delete(`/legal-sections/${id}`, authHeader);
      await loadSections();
    } catch (e: any) {
      console.error(e);
      alert(e?.response?.data?.message || 'Xóa thất bại');
    }
  };

  const handleMove = async (id: string, direction: 'up' | 'down') => {
    try {
      await api.patch(`/legal-sections/${id}/move`, { direction }, authHeader);
      await loadSections();
    } catch (e: any) {
      console.error(e);
      alert(e?.response?.data?.message || 'Không thể thay đổi thứ tự');
    }
  };

  const toggleSectionActive = async (sec: LegalSection) => {
    try {
      await api.put(`/legal-sections/${sec.id}`, { isActive: !sec.isActive }, authHeader);
      await loadSections();
    } catch (e) {
      console.error(e);
    }
  };

  const handleAutoSlug = () => {
    if (sectionModal) {
      const generated = generateSlug(sectionModal.titleVi || sectionModal.titleEn);
      setSectionModal({ ...sectionModal, slug: generated });
    }
  };

  return (
    <div>
      {/* Breadcrumb */}
      <div className="wp-breadcrumb">
        <Link to="/dashboard/admin">Dashboard</Link>
        <span className="wp-breadcrumb-sep">›</span>
        <Link to="/dashboard/admin/pages">Trang</Link>
        <span className="wp-breadcrumb-sep">›</span>
        <span className="wp-breadcrumb-current">{pageTitle}</span>
      </div>

      <div className="wp-page-header">
        <h1 className="wp-page-title">Quản lý {pageTitle}</h1>
      </div>

      {settingsSaved && (
        <div style={{ padding: '8px 12px', background: '#e6f7e9', border: '1px solid #00a32a', borderRadius: 4, marginBottom: 16, fontSize: 13, color: '#00a32a' }}>
          ✓ Đã lưu cài đặt chung thành công.
        </div>
      )}

      {/* Tabs */}
      <div className="wp-filter-tabs" style={{ marginBottom: 20 }}>
        <button 
          className={`wp-filter-tab ${activeTab === 'sections' ? 'active' : ''}`}
          onClick={() => setActiveTab('sections')}
        >
          Danh sách nội dung <span className="count">({sections.length})</span>
        </button>
        <span className="wp-filter-sep">|</span>
        <button 
          className={`wp-filter-tab ${activeTab === 'settings' ? 'active' : ''}`}
          onClick={() => setActiveTab('settings')}
        >
          Cấu hình trang
        </button>
      </div>

      {/* Tab 1: Sections */}
      {activeTab === 'sections' && (
        <div style={card}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <h3 style={{ ...cardTitle, margin: 0, border: 'none', padding: 0 }}>{t('cau_truc_trang_sectionbased')}</h3>
            <button 
              className="wp-btn wp-btn-primary" 
              onClick={() => setSectionModal({ id: '', titleVi: '', titleEn: '', slug: '', contentVi: '', contentEn: '', sortOrder: sections.length, isActive: true })}
              style={{ padding: '6px 14px', fontSize: 12, display: 'flex', alignItems: 'center', gap: 4 }}
            >
              <Plus size={14} /> Thêm phần mới
            </button>
          </div>

          {sectionsLoading ? (
            <div style={{ textAlign: 'center', padding: '24px', color: '#646970', fontSize: 13 }}>{t('dang_tai_danh_sach')}</div>
          ) : sections.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '32px 16px', color: '#646970', fontSize: 13 }}>
              Chưa có phần nội dung nào trong database. Vui lòng bấm "Thêm phần mới" để bắt đầu.
            </div>
          ) : (
            <div className="wp-table-wrap">
              <table className="wp-table">
                <thead>
                  <tr>
                    <th style={{ width: 50, textAlign: 'center' }}>STT</th>
                    <th>Tiêu đề</th>
                    <th style={{ width: 180 }}>Slug</th>
                    <th style={{ width: 100, textAlign: 'center' }}>Trạng thái</th>
                    <th style={{ width: 80, textAlign: 'center' }}>{t('thu_tu')}</th>
                  </tr>
                </thead>
                <tbody>
                  {sections.map((sec, idx) => (
                    <tr key={sec.id}>
                      <td style={{ textAlign: 'center', color: '#646970' }}>{idx + 1}</td>
                      <td>
                        <div>
                          <a href="#" onClick={e => { e.preventDefault(); setSectionModal({ ...sec }); }} className="wp-row-title" style={{ textDecoration: 'none' }}>
                            {sec.titleVi}
                          </a>
                          <div style={{ fontSize: 11, color: '#646970', marginTop: 1 }}>{sec.titleEn}</div>
                          <div className="wp-row-actions">
                            <a href="#" onClick={e => { e.preventDefault(); setSectionModal({ ...sec }); }}>Sửa</a>
                            <span className="sep">|</span>
                            <button type="button" className="delete" onClick={() => handleDeleteSection(sec.id)}>{t('xoa')}</button>
                          </div>
                        </div>
                      </td>
                      <td>
                        <code style={{ fontSize: 11, padding: '2px 4px', background: '#f0f0f1', borderRadius: 3 }}>{sec.slug}</code>
                      </td>
                      <td style={{ textAlign: 'center' }}>
                        <button onClick={() => toggleSectionActive(sec)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4 }} title={sec.isActive ? 'Đang hiển thị' : 'Đang ẩn'}>
                          {sec.isActive ? <Eye size={16} style={{ color: '#00a32a' }} /> : <EyeOff size={16} style={{ color: '#a7aaad' }} />}
                        </button>
                      </td>
                      <td style={{ textAlign: 'center', color: '#646970' }}>{sec.sortOrder}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Settings */}
      {activeTab === 'settings' && (
        <div style={card}>
          <h3 style={cardTitle}>Thông tin trang {pageTitle}</h3>
          
          {settingsLoading ? (
            <div style={{ textAlign: 'center', padding: '24px', color: '#646970', fontSize: 13 }}>{t('dang_tai_cai_dat')}</div>
          ) : (
            <div className="space-y-4">
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <div>
                  <label style={fieldLabel}>{t('tieu_de_tieng_viet')}</label>
                  <input style={inputStyle} value={settings[settingsKeys.titleVi] || ''} onChange={e => updateSetting(settingsKeys.titleVi, e.target.value)} placeholder="Nhập tiêu đề tiếng Việt" />
                </div>
                <div>
                  <label style={fieldLabel}>Title (English)</label>
                  <input style={inputStyle} value={settings[settingsKeys.titleEn] || ''} onChange={e => updateSetting(settingsKeys.titleEn, e.target.value)} placeholder="Enter English title" />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginTop: 12 }}>
                <div>
                  <label style={fieldLabel}>{t('mo_ta_ngan_tieng_viet_1')}</label>
                  <textarea style={{ ...inputStyle, minHeight: 60 }} value={settings[settingsKeys.subtitleVi] || ''} onChange={e => updateSetting(settingsKeys.subtitleVi, e.target.value)} placeholder="Nhập mô tả tiếng Việt..." />
                </div>
                <div>
                  <label style={fieldLabel}>Subtitle (English)</label>
                  <textarea style={{ ...inputStyle, minHeight: 60 }} value={settings[settingsKeys.subtitleEn] || ''} onChange={e => updateSetting(settingsKeys.subtitleEn, e.target.value)} placeholder="Enter English subtitle..." />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginTop: 12 }}>
                <div>
                  <label style={fieldLabel}>{t('ngay_cap_nhat_cuoi_cung_format_hien_thi')}</label>
                  <input style={inputStyle} value={settings[settingsKeys.lastUpdated] || ''} onChange={e => updateSetting(settingsKeys.lastUpdated, e.target.value)} placeholder="24/06/2026" />
                </div>
                <div>
                  <ImageUploader 
                    value={settings[settingsKeys.bannerBg] || ''} 
                    onChange={url => updateSetting(settingsKeys.bannerBg, url)} 
                    label="Ảnh nền Hero / Banner (Hỗ trợ GIF)"
                    height={100}
                  />
                  <span style={fieldDesc}>{t('de_trong_de_dung_anh_mac_dinh_cua_trang_')}</span>
                </div>
              </div>

              <div style={{ marginTop: 24, paddingTop: 16, borderTop: '1px solid #f0f0f1', display: 'flex', justifyContent: 'flex-end' }}>
                <button 
                  className="wp-btn wp-btn-primary" 
                  onClick={handleSaveSettings}
                  disabled={settingsSaving || !hasSettingsChanges}
                  style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '7px 20px', fontSize: 13 }}
                >
                  {settingsSaving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
                  Lưu thay đổi
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Section Modal (Add / Edit) */}
      {sectionModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,.5)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center' }} onClick={() => setSectionModal(null)}>
          <div style={{ background: '#fff', borderRadius: 8, width: '100%', maxWidth: 800, maxHeight: '92vh', overflow: 'auto', padding: 24, boxShadow: '0 8px 32px rgba(0,0,0,.2)' }} onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <h3 style={{ fontSize: 15, fontWeight: 700, color: '#1d2327', margin: 0 }}>
                {sectionModal.id ? 'Chỉnh sửa phần nội dung' : 'Thêm phần mới'}
              </h3>
              <button onClick={() => setSectionModal(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4 }}><X size={18} /></button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 12 }}>
              <div>
                <label style={fieldLabel}>{t('tieu_de_tieng_viet_2')}</label>
                <input style={inputStyle} value={sectionModal.titleVi} onChange={e => setSectionModal({ ...sectionModal, titleVi: e.target.value })} placeholder="Nhập tiêu đề tiếng Việt" />
              </div>
              <div>
                <label style={fieldLabel}>Title (English) *</label>
                <input style={inputStyle} value={sectionModal.titleEn} onChange={e => setSectionModal({ ...sectionModal, titleEn: e.target.value })} placeholder="Enter English title" />
              </div>
            </div>

            <div style={{ marginBottom: 16 }}>
              <label style={fieldLabel}>{t('duong_dan_tinh_slug')}</label>
              <div style={{ display: 'flex', gap: 8 }}>
                <input style={{ ...inputStyle, flex: 1 }} value={sectionModal.slug} onChange={e => setSectionModal({ ...sectionModal, slug: e.target.value })} placeholder="nhap-slug-viet-lien-khong-dau" />
                <button 
                  type="button" 
                  className="wp-btn" 
                  onClick={handleAutoSlug}
                  style={{ fontSize: 12, padding: '0 12px' }}
                >
                  Tạo tự động
                </button>
              </div>
              <span style={fieldDesc}>{t('slug_duy_nhat_dung_lam_id_neo_muc_luc_cu')}</span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
              <div>
                <label style={fieldLabel}>{t('noi_dung_tieng_viet_dinh_dang_html')}</label>
                <textarea 
                  style={{ ...inputStyle, minHeight: 180, resize: 'vertical', fontFamily: 'monospace', fontSize: 12 }} 
                  value={sectionModal.contentVi} 
                  onChange={e => setSectionModal({ ...sectionModal, contentVi: e.target.value })} 
                  placeholder="<p>{t('nhap_noi_dung_dang_html')}</p>" 
                />
              </div>
              <div>
                <label style={fieldLabel}>Content (English) - HTML Format</label>
                <textarea 
                  style={{ ...inputStyle, minHeight: 180, resize: 'vertical', fontFamily: 'monospace', fontSize: 12 }} 
                  value={sectionModal.contentEn} 
                  onChange={e => setSectionModal({ ...sectionModal, contentEn: e.target.value })} 
                  placeholder="<p>Enter content in English (HTML)...</p>" 
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 24 }}>
              <div>
                <label style={fieldLabel}>{t('thu_tu_hien_thi_sort_order')}</label>
                <input type="number" style={inputStyle} value={sectionModal.sortOrder} onChange={e => setSectionModal({ ...sectionModal, sortOrder: parseInt(e.target.value) || 0 })} />
              </div>
              <div>
                <label style={fieldLabel}>{t('trang_thai_hoat_dong')}</label>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 4 }}>
                  <label style={{ position: 'relative', display: 'inline-block', width: 44, height: 24, cursor: 'pointer' }}>
                    <input type="checkbox" checked={sectionModal.isActive} onChange={e => setSectionModal({ ...sectionModal, isActive: e.target.checked })} style={{ opacity: 0, width: 0, height: 0 }} />
                    <span style={{ position: 'absolute', inset: 0, borderRadius: 12, transition: 'all .2s', background: sectionModal.isActive ? '#00a32a' : '#c3c4c7' }}>
                      <span style={{ position: 'absolute', width: 18, height: 18, borderRadius: '50%', background: '#fff', top: 3, transition: 'all .2s', left: sectionModal.isActive ? 23 : 3, boxShadow: '0 1px 3px rgba(0,0,0,.2)' }} />
                    </span>
                  </label>
                  <span style={{ fontSize: 12, color: sectionModal.isActive ? '#00a32a' : '#646970' }}>
                    {sectionModal.isActive ? 'Đang hoạt động (Hiển thị ở trang)' : 'Bản nháp (Ẩn)'}
                  </span>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', paddingTop: 12, borderTop: '1px solid #f0f0f1' }}>
              <button className="wp-btn" onClick={() => setSectionModal(null)} style={{ padding: '7px 16px', fontSize: 12 }}>{t('huy')}</button>
              <button className="wp-btn wp-btn-primary" onClick={handleSaveSection} disabled={sectionSaving} style={{ padding: '7px 16px', fontSize: 12 }}>
                {sectionSaving ? 'Đang lưu...' : (sectionModal.id ? 'Cập nhật' : 'Tạo mới')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
