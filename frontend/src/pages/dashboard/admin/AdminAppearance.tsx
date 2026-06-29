import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Upload, Trash2, Plus, ChevronUp, ChevronDown, Image as ImageIcon, Loader2, Pencil, X, Eye, EyeOff } from 'lucide-react';
import { api } from '../../../lib/api';

// ─── Types ───────────────────────────────────────────────────
interface BannerSlide { id: string; image: string; title: string; titleVi: string; desc: string; descVi: string; link: string; status?: 'active' | 'hidden'; sortOrder?: number; }
interface PopupData { image: string; title: string; message: string; link: string; buttonText: string; showOnce: boolean; startDate: string; endDate: string; }
interface FaqRow { id: string; questionVi: string; answerVi: string; questionEn: string; answerEn: string; sortOrder: number; isActive: boolean; }

const THEME_PRESETS = [
  { id: 'default', name: 'Default', primary: '#003366', light: '#004080', dark: '#002244', accent: '#A2875E', bg: '#F8FAFC', text: '#1E293B', border: '#E2E8F0', pending: '#F59E0B', approved: '#16A34A', rejected: '#DC2626', completed: '#2563EB', headerBg: '#FFFFFF', headerText: '#1E293B', footerBg: '#043365', footerText: '#CBD5E1' },
  { id: 'dark', name: 'Dark', primary: '#60A5FA', light: '#93C5FD', dark: '#3B82F6', accent: '#F59E0B', bg: '#0F172A', text: '#E2E8F0', border: '#334155', pending: '#FBBF24', approved: '#4ADE80', rejected: '#F87171', completed: '#60A5FA', headerBg: '#1E293B', headerText: '#E2E8F0', footerBg: '#020617', footerText: '#94A3B8' },
  { id: 'tet', name: 'T\u1ebft', primary: '#DC2626', light: '#EF4444', dark: '#B91C1C', accent: '#F59E0B', bg: '#FFF7ED', text: '#7C2D12', border: '#FED7AA', pending: '#F97316', approved: '#16A34A', rejected: '#DC2626', completed: '#2563EB', headerBg: '#FEF2F2', headerText: '#991B1B', footerBg: '#7F1D1D', footerText: '#FECACA' },
  { id: 'christmas', name: 'Christmas', primary: '#16A34A', light: '#22C55E', dark: '#15803D', accent: '#DC2626', bg: '#F0FDF4', text: '#14532D', border: '#BBF7D0', pending: '#EAB308', approved: '#16A34A', rejected: '#DC2626', completed: '#2563EB', headerBg: '#F0FDF4', headerText: '#14532D', footerBg: '#14532D', footerText: '#BBF7D0' },
  { id: 'summer', name: 'Summer', primary: '#0891B2', light: '#22D3EE', dark: '#0E7490', accent: '#F97316', bg: '#ECFEFF', text: '#164E63', border: '#A5F3FC', pending: '#F59E0B', approved: '#10B981', rejected: '#EF4444', completed: '#0EA5E9', headerBg: '#ECFEFF', headerText: '#164E63', footerBg: '#164E63', footerText: '#A5F3FC' },
];



const EFFECT_OPTIONS = [
  { key: 'snow', name: 'Tuyết rơi', desc: 'Hiệu ứng tuyết rơi nhẹ nhàng trên trang' },
  { key: 'fireworks', name: 'Pháo hoa', desc: 'Pháo hoa nổ ngẫu nhiên trên màn hình' },
  { key: 'confetti', name: 'Confetti', desc: 'Giấy nhiều màu rơi từ trên xuống' },
  { key: 'hoamai', name: 'Hoa mai & Lồng đèn', desc: 'Hoa mai, lồng đèn, bao lì xì rơi — phong cách Tết' },
  { key: 'floating', name: 'Floating Icons', desc: 'Biểu tượng bay lên từ dưới màn hình' },
];

interface EffectConfig { enabled: boolean; startDate: string; endDate: string; }

// ─── Styles ──────────────────────────────────────────────────
const card: React.CSSProperties = { background: '#fff', border: '1px solid #dcdcde', borderRadius: 4, padding: 20, marginBottom: 20 };
const cardTitle: React.CSSProperties = { fontSize: 14, fontWeight: 600, color: '#1d2327', marginBottom: 16, paddingBottom: 10, borderBottom: '1px solid #f0f0f1' };
const fieldLabel: React.CSSProperties = { fontSize: 12, fontWeight: 600, color: '#1d2327', marginBottom: 4, display: 'block' };
const fieldDesc: React.CSSProperties = { fontSize: 11, color: '#646970', marginTop: 2, marginBottom: 12 };
const inputStyle: React.CSSProperties = { width: '100%', padding: '6px 10px', border: '1px solid #8c8f94', borderRadius: 4, fontSize: 13, boxSizing: 'border-box' as const };

// ─── Upload helper ───────────────────────────────────────────
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

// ═════════════════════════════════════════════════════════════
export function AdminAppearance() {
  const location = useLocation();
  const navigate = useNavigate();
  const tab = new URLSearchParams(location.search).get('tab') || 'branding';

  const [settings, setSettings] = useState<Record<string, string>>({});
  const [originalSettings, setOriginalSettings] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    api.get('/settings').then(res => { const data = res.data || {}; setSettings(data); setOriginalSettings(data); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  const update = (key: string, val: string) => { setSettings(prev => ({ ...prev, [key]: val })); setSaved(false); };
  const hasChanges = JSON.stringify(settings) !== JSON.stringify(originalSettings);

  const handleSave = async () => {
    setSaving(true);
    try {
      await api.put('/settings', settings, { headers: { Authorization: `Bearer ${localStorage.getItem('mivn5_token')}` } });
      setOriginalSettings({ ...settings });
      setSaved(true); setTimeout(() => setSaved(false), 3000);
    } catch (e) { console.error(e); }
    setSaving(false);
  };

  // Banner helpers
  const getBanners = (): BannerSlide[] => { try { return JSON.parse(settings.hero_banners || '[]'); } catch { return []; } };
  const setBanners = (b: BannerSlide[]) => update('hero_banners', JSON.stringify(b));
  const addBanner = () => { const b = getBanners(); b.push({ id: Date.now().toString(), image: '', title: '', titleVi: '', desc: '', descVi: '', link: '/products' }); setBanners(b); };
  const removeBanner = (id: string) => setBanners(getBanners().filter(b => b.id !== id));
  const updateBanner = (id: string, field: keyof BannerSlide, val: string) => setBanners(getBanners().map(b => b.id === id ? { ...b, [field]: val } : b));
  const moveBanner = (id: string, dir: -1 | 1) => { const b = getBanners(); const idx = b.findIndex(x => x.id === id); if (idx + dir < 0 || idx + dir >= b.length) return; [b[idx], b[idx + dir]] = [b[idx + dir], b[idx]]; setBanners(b); };

  // Popup helpers
  const getPopup = (): PopupData => { try { return JSON.parse(settings.popup_data || '{}'); } catch { return { image: '', title: '', message: '', link: '', buttonText: 'Xem ngay', showOnce: true, startDate: '', endDate: '' }; } };
  const setPopup = (p: PopupData) => update('popup_data', JSON.stringify(p));
  const updatePopup = (field: keyof PopupData, val: any) => setPopup({ ...getPopup(), [field]: val });

  // Banner modals
  const [slideModal, setSlideModal] = useState<BannerSlide | null>(null);
  const [previewSlide, setPreviewSlide] = useState<BannerSlide | null>(null);

  const handleSaveSlide = (slide: BannerSlide) => {
    const banners = getBanners();
    let updated = [...banners];
    if (slide.id) {
      updated = updated.map(b => b.id === slide.id ? slide : b);
    } else {
      const newSlide = {
        ...slide,
        id: Date.now().toString(),
        status: slide.status || 'active',
        sortOrder: slide.sortOrder ?? (banners.length + 1)
      };
      updated.push(newSlide);
    }
    updated.sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0));
    updated = updated.map((b, index) => ({
      ...b,
      sortOrder: index + 1
    }));
    setBanners(updated);
    setSlideModal(null);
  };

  // FAQ state (DB-backed CRUD)
  const [faqList, setFaqList] = useState<FaqRow[]>([]);
  const [faqLoading, setFaqLoading] = useState(false);
  const [faqModal, setFaqModal] = useState<FaqRow | null>(null); // null = closed, empty obj = new
  const [faqSaving, setFaqSaving] = useState(false);
  const authHeader = { headers: { Authorization: `Bearer ${localStorage.getItem('mivn5_token')}` } };

  const loadFaqs = useCallback(async () => {
    setFaqLoading(true);
    try { const res = await api.get('/faqs/admin', authHeader); setFaqList(res.data); } catch { }
    setFaqLoading(false);
  }, []);

  useEffect(() => { if (tab === 'faq') loadFaqs(); }, [tab]);

  const saveFaq = async () => {
    if (!faqModal) return;
    setFaqSaving(true);
    try {
      if (faqModal.id) {
        await api.put(`/faqs/${faqModal.id}`, faqModal, authHeader);
      } else {
        await api.post('/faqs', faqModal, authHeader);
      }
      setFaqModal(null);
      await loadFaqs();
    } catch { }
    setFaqSaving(false);
  };

  const deleteFaq = async (id: string) => {
    if (!confirm('Xoá FAQ này?')) return;
    try { await api.delete(`/faqs/${id}`, authHeader); await loadFaqs(); } catch { }
  };

  const toggleFaqActive = async (faq: FaqRow) => {
    try { await api.put(`/faqs/${faq.id}`, { isActive: !faq.isActive }, authHeader); await loadFaqs(); } catch { }
  };

  // Theme preset
  const applyPreset = (preset: typeof THEME_PRESETS[0]) => {
    update('primary_color', preset.primary);
    update('primary_color_light', preset.light);
    update('primary_color_dark', preset.dark);
    update('accent_color', preset.accent);
    update('bg_color', preset.bg);
    update('text_color', preset.text);
    update('border_color', preset.border);
    update('pending_color', preset.pending);
    update('approved_color', preset.approved);
    update('rejected_color', preset.rejected);
    update('completed_color', preset.completed);
    update('header_bg', preset.headerBg);
    update('header_text', preset.headerText);
    update('footer_bg', preset.footerBg);
    update('footer_text', preset.footerText);
    update('site_theme', preset.id);
  };

  // HEX validation
  const isValidHex = (v: string) => /^#([0-9A-Fa-f]{3}){1,2}$/.test(v);

  if (loading) return <div className="wp-loading">Đang tải...</div>;

  return (
    <div>
      <div className="wp-breadcrumb">
        <Link to="/dashboard/admin">Dashboard</Link>
        <span className="wp-breadcrumb-sep">›</span>
        <span className="wp-breadcrumb-current">Giao diện</span>
      </div>
      <div className="wp-page-header"><h1 className="wp-page-title">Giao diện</h1></div>

      {saved && (
        <div style={{ padding: '8px 12px', background: '#e6f7e9', border: '1px solid #00a32a', borderRadius: 4, marginBottom: 16, fontSize: 13, color: '#00a32a' }}>
          ✓ Đã lưu thành công. Reload trang chủ để xem thay đổi.
        </div>
      )}



      {/* ═══ TAB: Branding ═══ */}
      {tab === 'branding' && (
        <div>
          {/* Logo */}
          <div style={card}>
            <h3 style={cardTitle}>Logo</h3>
            <ImageUploader value={settings.site_logo || ''} onChange={url => update('site_logo', url)} label="Ảnh Logo" height={60} />
            <p style={fieldDesc}>Để trống sẽ hiển thị logo text "VIEproduct" mặc định. Khuyến nghị: 200×60px, nền trong suốt (PNG).</p>
          </div>

          {/* Slogan */}
          <div style={card}>
            <h3 style={cardTitle}>Slogan</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <div>
                <label style={fieldLabel}>Slogan (Tiếng Anh)</label>
                <input style={inputStyle} value={settings.site_slogan || ''} onChange={e => update('site_slogan', e.target.value)} placeholder="B2B Global Trade" />
              </div>
              <div>
                <label style={fieldLabel}>Slogan (Tiếng Việt)</label>
                <input style={inputStyle} value={settings.site_slogan_vi || ''} onChange={e => update('site_slogan_vi', e.target.value)} placeholder="Thương mại B2B toàn cầu" />
              </div>
            </div>
            <p style={fieldDesc}>Hiển thị dưới logo trên header trang web.</p>
          </div>


          {/* Theme Presets */}
          <div style={card}>
            <h3 style={cardTitle}>Theme Preset</h3>
            <p style={{ ...fieldDesc, marginBottom: 12 }}>Chọn nhanh bộ màu theo chủ đề. Có thể tùy chỉnh thêm ở phần Màu chủ đạo bên dưới.</p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 10 }}>
              {THEME_PRESETS.map(p => {
                const active = settings.site_theme === p.id;
                return (
                  <button key={p.id} onClick={() => applyPreset(p)}
                    style={{ padding: '14px 8px', border: active ? '2px solid #2271b1' : '1px solid #dcdcde', borderRadius: 8, background: active ? '#f0f6fc' : '#fff', cursor: 'pointer', textAlign: 'center', transition: 'all .15s' }}>
                    <div style={{ fontSize: 12, fontWeight: 700, color: '#1d2327', marginBottom: 6 }}>{p.name}</div>
                    <div style={{ display: 'flex', justifyContent: 'center', gap: 3, marginTop: 8 }}>
                      {[p.primary, p.light, p.dark, p.accent].map((c, i) => (
                        <span key={i} style={{ width: 14, height: 14, borderRadius: '50%', background: c, border: '1.5px solid #fff', boxShadow: '0 0 0 0.5px #ccc' }} />
                      ))}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Color pickers */}
          <div style={card}>
            <h3 style={cardTitle}>Màu giao diện</h3>

            {/* ── Màu chủ đạo ── */}
            <p style={{ ...fieldDesc, marginBottom: 14 }}>Màu chủ đạo</p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
              {[
                { key: 'primary_color', label: 'Primary', def: '#003366' },
                { key: 'primary_color_light', label: 'Primary Light', def: '#004080' },
                { key: 'primary_color_dark', label: 'Primary Dark', def: '#002244' },
                { key: 'accent_color', label: 'Accent', def: '#A2875E' },
              ].map(c => {
                const val = settings[c.key] || c.def;
                const valid = isValidHex(val);
                return (
                  <div key={c.key}>
                    <label style={fieldLabel}>{c.label}</label>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <input type="color" value={valid ? val : c.def} onChange={e => update(c.key, e.target.value)} style={{ width: 36, height: 30, border: '1px solid #dcdcde', borderRadius: 4, cursor: 'pointer', padding: 0 }} />
                      <input style={{ ...inputStyle, fontFamily: 'monospace', fontSize: 12, borderColor: valid ? undefined : '#d63638' }} value={val} onChange={e => update(c.key, e.target.value)} />
                    </div>
                    {!valid && <span style={{ fontSize: 10, color: '#d63638' }}>Mã HEX không hợp lệ</span>}
                  </div>
                );
              })}
            </div>
            <div style={{ marginTop: 12, padding: 12, background: '#f9fafb', borderRadius: 6, border: '1px solid #f0f0f1' }}>
              <div style={{ fontSize: 10, color: '#a7aaad', marginBottom: 8 }}>Preview — Màu chủ đạo</div>
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                <span style={{ padding: '5px 16px', background: settings.primary_color || '#003366', color: '#fff', borderRadius: 4, fontSize: 12, fontWeight: 700 }}>Primary</span>
                <span style={{ padding: '5px 16px', background: settings.primary_color_light || '#004080', color: '#fff', borderRadius: 4, fontSize: 12, fontWeight: 700 }}>Light</span>
                <span style={{ padding: '5px 16px', background: settings.primary_color_dark || '#002244', color: '#fff', borderRadius: 4, fontSize: 12, fontWeight: 700 }}>Dark</span>
                <span style={{ padding: '5px 16px', background: settings.accent_color || '#A2875E', color: '#fff', borderRadius: 4, fontSize: 12, fontWeight: 700 }}>Accent</span>
              </div>
            </div>

            {/* ── Giao diện tổng thể ── */}
            <p style={{ ...fieldDesc, marginTop: 24, marginBottom: 14 }}>Giao diện tổng thể</p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
              {[
                { key: 'bg_color', label: 'Background', def: '#F8FAFC' },
                { key: 'text_color', label: 'Text', def: '#1E293B' },
                { key: 'border_color', label: 'Border', def: '#E2E8F0' },
              ].map(c => {
                const val = settings[c.key] || c.def;
                const valid = isValidHex(val);
                return (
                  <div key={c.key}>
                    <label style={fieldLabel}>{c.label}</label>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <input type="color" value={valid ? val : c.def} onChange={e => update(c.key, e.target.value)} style={{ width: 36, height: 30, border: '1px solid #dcdcde', borderRadius: 4, cursor: 'pointer', padding: 0 }} />
                      <input style={{ ...inputStyle, fontFamily: 'monospace', fontSize: 12, borderColor: valid ? undefined : '#d63638' }} value={val} onChange={e => update(c.key, e.target.value)} />
                    </div>
                    {!valid && <span style={{ fontSize: 10, color: '#d63638' }}>Mã HEX không hợp lệ</span>}
                  </div>
                );
              })}
            </div>
            <div style={{ marginTop: 12, padding: 16, background: settings.bg_color || '#F8FAFC', borderRadius: 6, border: `1px solid ${settings.border_color || '#E2E8F0'}` }}>
              <div style={{ fontSize: 10, color: '#a7aaad', marginBottom: 8 }}>Preview — Giao diện tổng thể</div>
              <div style={{ padding: 12, background: '#fff', border: `1px solid ${settings.border_color || '#E2E8F0'}`, borderRadius: 6 }}>
                <span style={{ fontSize: 14, fontWeight: 700, color: settings.text_color || '#1E293B' }}>Tiêu đề mẫu</span>
                <p style={{ fontSize: 12, color: settings.text_color || '#1E293B', opacity: 0.7, marginTop: 4, marginBottom: 0 }}>Đây là đoạn văn bản mẫu hiển thị trên nền background với viền border.</p>
              </div>
            </div>

            {/* ── Layout Colors ── */}
            <p style={{ ...fieldDesc, marginTop: 24, marginBottom: 14 }}>Layout Colors</p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
              {[
                { key: 'header_bg', label: 'Header Background', def: '#FFFFFF' },
                { key: 'header_text', label: 'Header Text', def: '#1E293B' },
                { key: 'footer_bg', label: 'Footer Background', def: '#043365' },
                { key: 'footer_text', label: 'Footer Text', def: '#CBD5E1' },
              ].map(c => {
                const val = settings[c.key] || c.def;
                const valid = isValidHex(val);
                return (
                  <div key={c.key}>
                    <label style={fieldLabel}>{c.label}</label>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <input type="color" value={valid ? val : c.def} onChange={e => update(c.key, e.target.value)} style={{ width: 36, height: 30, border: '1px solid #dcdcde', borderRadius: 4, cursor: 'pointer', padding: 0 }} />
                      <input style={{ ...inputStyle, fontFamily: 'monospace', fontSize: 12, borderColor: valid ? undefined : '#d63638' }} value={val} onChange={e => update(c.key, e.target.value)} />
                    </div>
                    {!valid && <span style={{ fontSize: 10, color: '#d63638' }}>Mã HEX không hợp lệ</span>}
                  </div>
                );
              })}
            </div>
            <div style={{ marginTop: 12, borderRadius: 6, overflow: 'hidden', border: '1px solid #e5e7eb' }}>
              <div style={{ fontSize: 10, color: '#a7aaad', padding: '6px 12px', background: '#f9fafb', borderBottom: '1px solid #f0f0f1' }}>Preview — Header & Footer</div>
              <div style={{ padding: '10px 16px', background: settings.header_bg || '#FFFFFF', color: settings.header_text || '#1E293B', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: 13, fontWeight: 800 }}>VIEproduct</span>
                <div style={{ display: 'flex', gap: 12, fontSize: 11, fontWeight: 600 }}>
                  <span>Trang chủ</span><span>Sản phẩm</span><span>Liên hệ</span>
                </div>
              </div>
              <div style={{ padding: '10px 16px', background: settings.footer_bg || '#043365', color: settings.footer_text || '#CBD5E1', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: 11, fontWeight: 600 }}>© 2026 VIEproduct</span>
                <div style={{ display: 'flex', gap: 12, fontSize: 10 }}>
                  <span>Về chúng tôi</span><span>Chính sách</span>
                </div>
              </div>
            </div>

            {/* ── Trạng thái ── */}
            <p style={{ ...fieldDesc, marginTop: 24, marginBottom: 14 }}>Trạng thái</p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
              {[
                { key: 'pending_color', label: 'Pending', def: '#F59E0B' },
                { key: 'approved_color', label: 'Approved', def: '#16A34A' },
                { key: 'rejected_color', label: 'Rejected', def: '#DC2626' },
                { key: 'completed_color', label: 'Completed', def: '#2563EB' },
              ].map(c => {
                const val = settings[c.key] || c.def;
                const valid = isValidHex(val);
                return (
                  <div key={c.key}>
                    <label style={fieldLabel}>{c.label}</label>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <input type="color" value={valid ? val : c.def} onChange={e => update(c.key, e.target.value)} style={{ width: 36, height: 30, border: '1px solid #dcdcde', borderRadius: 4, cursor: 'pointer', padding: 0 }} />
                      <input style={{ ...inputStyle, fontFamily: 'monospace', fontSize: 12, borderColor: valid ? undefined : '#d63638' }} value={val} onChange={e => update(c.key, e.target.value)} />
                    </div>
                    {!valid && <span style={{ fontSize: 10, color: '#d63638' }}>Mã HEX không hợp lệ</span>}
                  </div>
                );
              })}
            </div>
            <div style={{ marginTop: 12, padding: 12, background: '#f9fafb', borderRadius: 6, border: '1px solid #f0f0f1' }}>
              <div style={{ fontSize: 10, color: '#a7aaad', marginBottom: 8 }}>Preview — Trạng thái</div>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                <span style={{ padding: '4px 12px', borderRadius: 10, fontSize: 11, fontWeight: 600, color: '#fff', background: settings.pending_color || '#F59E0B' }}>Chờ duyệt</span>
                <span style={{ padding: '4px 12px', borderRadius: 10, fontSize: 11, fontWeight: 600, color: '#fff', background: settings.approved_color || '#16A34A' }}>Đã duyệt</span>
                <span style={{ padding: '4px 12px', borderRadius: 10, fontSize: 11, fontWeight: 600, color: '#fff', background: settings.rejected_color || '#DC2626' }}>Từ chối</span>
                <span style={{ padding: '4px 12px', borderRadius: 10, fontSize: 11, fontWeight: 600, color: '#fff', background: settings.completed_color || '#2563EB' }}>Hoàn thành</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ═══ TAB: Banners ═══ */}
      {tab === 'banners' && (
        <div className="space-y-6">
          {/* Header & Footer Banners Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Banner Header Card */}
            <div style={card} className="flex flex-col justify-between">
              <div>
                <h3 style={{ ...cardTitle, borderBottom: '1px solid #e2e8f0', paddingBottom: 8, marginBottom: 12 }}>Banner Header</h3>
                <p style={{ ...fieldDesc, fontSize: 13, color: '#475569', marginBottom: 16 }}>Ảnh nền hiển thị phía sau Header.</p>
                <div className="space-y-4">
                  <ImageUploader 
                    value={settings.header_banner_image || ''} 
                    onChange={url => update('header_banner_image', url)} 
                    height={80} 
                  />
                  <div style={{ ...fieldDesc, fontSize: 12, color: '#64748b', marginTop: 8 }}>
                    💡 Gợi ý kích thước: <strong>1920×120px</strong>, định dạng JPG/WebP
                  </div>
                </div>
              </div>
            </div>

            {/* Banner Footer Card */}
            <div style={card} className="flex flex-col justify-between">
              <div>
                <h3 style={{ ...cardTitle, borderBottom: '1px solid #e2e8f0', paddingBottom: 8, marginBottom: 12 }}>Banner Footer</h3>
                <p style={{ ...fieldDesc, fontSize: 13, color: '#475569', marginBottom: 16 }}>Ảnh nền hiển thị phía sau Footer.</p>
                <div className="space-y-4">
                  <ImageUploader 
                    value={settings.footer_banner_image || ''} 
                    onChange={url => update('footer_banner_image', url)} 
                    height={100} 
                  />
                  <div style={{ ...fieldDesc, fontSize: 12, color: '#64748b', marginTop: 8 }}>
                    💡 Gợi ý kích thước: <strong>1920×400px</strong>, định dạng JPG/WebP
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Hero Banner Slides Management */}
          <div style={card}>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 mb-4 border-b border-slate-200">
              <div>
                <h3 style={{ ...cardTitle, borderBottom: 'none', margin: 0, padding: 0 }}>Hero Banner Slides (Trang chủ)</h3>
                <p style={{ ...fieldDesc, margin: 0, marginTop: 4, fontSize: 13, color: '#475569' }}>
                  Quản lý danh sách slide hiển thị trên banner trang chủ.
                </p>
              </div>
              <button 
                type="button" 
                className="wp-btn wp-btn-primary flex items-center gap-2 self-start sm:self-auto"
                onClick={() => setSlideModal({ id: '', image: '', title: '', titleVi: '', desc: '', descVi: '', link: '/products', status: 'active', sortOrder: getBanners().length + 1 })}
              >
                <Plus size={16} /> Thêm slide
              </button>
            </div>

            {getBanners().length === 0 ? (
              <div className="text-center py-12 border border-dashed border-slate-200 rounded-lg bg-slate-50">
                <ImageIcon size={48} className="mx-auto text-slate-400 mb-3" />
                <p className="text-slate-600 font-medium">Chưa có banner slide nào.</p>
                <p className="text-xs text-slate-400 mt-1">Bấm nút "Thêm slide" ở góc trên bên phải để bắt đầu.</p>
              </div>
            ) : (
              <div className="wp-table-wrap">
                <table className="wp-table">
                  <thead>
                    <tr>
                      <th style={{ width: 60, textShadow: 'none', textAlign: 'center' }}>STT</th>
                      <th style={{ width: 100 }}>Ảnh Thumbnail</th>
                      <th>Tiêu đề (VI) / Hành động</th>
                      <th>Tiêu đề (EN)</th>
                      <th>CTA Link</th>
                      <th style={{ width: 100, textAlign: 'center' }}>Trạng thái</th>
                    </tr>
                  </thead>
                  <tbody>
                    {getBanners().map((slide, idx) => (
                      <tr key={slide.id || idx}>
                        <td className="text-center font-semibold" style={{ textAlign: 'center', padding: '12px 8px' }}>{idx + 1}</td>
                        <td style={{ padding: '12px 8px' }}>
                          {slide.image ? (
                            <img 
                              src={slide.image} 
                              alt={slide.titleVi} 
                              className="w-16 h-10 object-cover rounded bg-slate-100 border cursor-pointer hover:opacity-85 transition-opacity"
                              onClick={() => setPreviewSlide(slide)}
                              referrerPolicy="no-referrer"
                            />
                          ) : (
                            <div className="w-16 h-10 rounded bg-slate-100 border flex items-center justify-center text-slate-400">
                              <ImageIcon size={16} />
                            </div>
                          )}
                        </td>
                        <td style={{ padding: '12px 8px' }}>
                          <div className="font-semibold text-slate-700">{slide.titleVi || '—'}</div>
                          <div className="text-xs text-slate-400 line-clamp-1">{slide.descVi || ''}</div>
                          
                          <div className="wp-row-actions">
                            <a href="#" onClick={(e) => { e.preventDefault(); setSlideModal(slide); }}>Chỉnh sửa</a>
                            <span className="sep">|</span>
                            <a href="#" onClick={(e) => { e.preventDefault(); setPreviewSlide(slide); }}>Xem trước</a>
                            <span className="sep">|</span>
                            <a href="#" className="trash" onClick={(e) => {
                              e.preventDefault();
                              if (window.confirm('Bạn có chắc chắn muốn xóa slide banner này?')) {
                                removeBanner(slide.id);
                              }
                            }}>Xóa</a>
                          </div>
                        </td>
                        <td style={{ padding: '12px 8px' }}>
                          <div className="font-semibold text-slate-700">{slide.title || '—'}</div>
                          <div className="text-xs text-slate-400 line-clamp-1">{slide.desc || ''}</div>
                        </td>
                        <td style={{ padding: '12px 8px' }}>
                          <code className="text-xs text-slate-500 bg-slate-50 px-1.5 py-0.5 rounded border">
                            {slide.link || '—'}
                          </code>
                        </td>
                        <td className="text-center" style={{ textAlign: 'center', padding: '12px 8px' }}>
                          {slide.status === 'hidden' ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-800">
                              <span className="w-1.5 h-1.5 rounded-full bg-slate-400"></span> Ẩn
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> Hiển thị
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}



      {/* ═══ TAB: Popup ═══ */}
      {tab === 'popup' && (
        <div>
          <div style={card}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <h3 style={{ ...cardTitle, margin: 0, border: 'none', padding: 0 }}>Popup khuyến mãi</h3>
              <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontSize: 13 }}>
                <input type="checkbox" checked={settings.popup_enabled === 'true'} onChange={e => update('popup_enabled', e.target.checked ? 'true' : 'false')} style={{ width: 18, height: 18 }} />
                <span style={{ fontWeight: 600, color: settings.popup_enabled === 'true' ? '#00a32a' : '#646970' }}>
                  {settings.popup_enabled === 'true' ? 'Đang bật' : 'Đang tắt'}
                </span>
              </label>
            </div>

            {settings.popup_enabled === 'true' && (() => {
              const p = getPopup();
              return (
                <div>
                  <ImageUploader value={p.image} onChange={url => updatePopup('image', url)} label="Hình ảnh popup" height={200} />

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginTop: 12 }}>
                    <div><label style={fieldLabel}>Tiêu đề</label><input style={inputStyle} value={p.title} onChange={e => updatePopup('title', e.target.value)} placeholder="Khuyến mãi mùa hè!" /></div>
                    <div><label style={fieldLabel}>Text nút</label><input style={inputStyle} value={p.buttonText} onChange={e => updatePopup('buttonText', e.target.value)} placeholder="Xem ngay" /></div>
                  </div>

                  <div style={{ marginTop: 12 }}>
                    <label style={fieldLabel}>Nội dung</label>
                    <textarea style={{ ...inputStyle, minHeight: 60, resize: 'vertical' }} value={p.message} onChange={e => updatePopup('message', e.target.value)} placeholder="Giảm 20% cho đơn hàng đầu tiên..." />
                  </div>

                  <div style={{ marginTop: 12 }}>
                    <label style={fieldLabel}>Link khi bấm nút</label>
                    <input style={inputStyle} value={p.link} onChange={e => updatePopup('link', e.target.value)} placeholder="/products" />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginTop: 12 }}>
                    <div><label style={fieldLabel}>Ngày bắt đầu</label><input type="date" style={inputStyle} value={p.startDate} onChange={e => updatePopup('startDate', e.target.value)} /></div>
                    <div><label style={fieldLabel}>Ngày kết thúc</label><input type="date" style={inputStyle} value={p.endDate} onChange={e => updatePopup('endDate', e.target.value)} /></div>
                  </div>

                  <label style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 14, fontSize: 12, cursor: 'pointer' }}>
                    <input type="checkbox" checked={p.showOnce} onChange={e => updatePopup('showOnce', e.target.checked)} />
                    Chỉ hiển thị 1 lần cho mỗi người dùng
                  </label>
                </div>
              );
            })()}
          </div>
        </div>
      )}

      {/* ═══ Effects (inside Branding) ═══ */}
      {tab === 'branding' && (
        <div>
          <div style={card}>
            <h3 style={cardTitle}>Hiệu ứng trang trí</h3>
            <p style={{ ...fieldDesc, marginBottom: 16 }}>Bật hiệu ứng hình ảnh trên trang web. Có thể đặt lịch tự bật/tắt theo ngày.</p>
            {EFFECT_OPTIONS.map(eff => {
              const effects: Record<string, EffectConfig> = (() => { try { return JSON.parse(settings.theme_effects || '{}'); } catch { return {}; } })();
              const cfg: EffectConfig = effects[eff.key] || { enabled: false, startDate: '', endDate: '' };
              const updateEffect = (field: keyof EffectConfig, val: any) => {
                const updated = { ...effects, [eff.key]: { ...cfg, [field]: val } };
                update('theme_effects', JSON.stringify(updated));
              };
              return (
                <div key={eff.key} style={{ padding: '16px', borderBottom: '1px solid #f0f0f1' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: cfg.enabled ? 12 : 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div>
                        <div style={{ fontSize: 13, fontWeight: 600, color: '#1d2327' }}>{eff.name}</div>
                        <div style={{ fontSize: 11, color: '#646970', marginTop: 2 }}>{eff.desc}</div>
                      </div>
                    </div>
                    <label style={{ position: 'relative', display: 'inline-block', width: 44, height: 24, cursor: 'pointer' }}>
                      <input type="checkbox" checked={cfg.enabled} onChange={e => updateEffect('enabled', e.target.checked)} style={{ opacity: 0, width: 0, height: 0 }} />
                      <span style={{ position: 'absolute', inset: 0, borderRadius: 12, transition: 'all .2s', background: cfg.enabled ? '#2271b1' : '#c3c4c7' }}>
                        <span style={{ position: 'absolute', width: 18, height: 18, borderRadius: '50%', background: '#fff', top: 3, transition: 'all .2s', left: cfg.enabled ? 23 : 3, boxShadow: '0 1px 3px rgba(0,0,0,.2)' }} />
                      </span>
                    </label>
                  </div>
                  {cfg.enabled && (
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginLeft: 34 }}>
                      <div>
                        <label style={fieldLabel}>Ngày bắt đầu</label>
                        <input type="date" style={inputStyle} value={cfg.startDate} onChange={e => updateEffect('startDate', e.target.value)} />
                        <p style={{ fontSize: 10, color: '#a7aaad', marginTop: 2 }}>Để trống = bật ngay</p>
                      </div>
                      <div>
                        <label style={fieldLabel}>Ngày kết thúc</label>
                        <input type="date" style={inputStyle} value={cfg.endDate} onChange={e => updateEffect('endDate', e.target.value)} />
                        <p style={{ fontSize: 10, color: '#a7aaad', marginTop: 2 }}>Để trống = không tự tắt</p>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}


      {/* ═══ TAB: FAQ ═══ */}
      {tab === 'faq' && (
        <div>
          <div style={card}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <div>
                <h3 style={{ ...cardTitle, margin: 0, border: 'none', padding: 0 }}>Câu hỏi thường gặp (FAQ)</h3>
                <p style={{ ...fieldDesc, marginTop: 4 }}>Quản lý danh sách FAQ hiển thị ở trang Trung tâm trợ giúp. Dữ liệu lưu trực tiếp vào database.</p>
              </div>
              <button className="wp-btn wp-btn-primary" onClick={() => setFaqModal({ id: '', questionVi: '', answerVi: '', questionEn: '', answerEn: '', sortOrder: faqList.length, isActive: true })} style={{ padding: '6px 14px', fontSize: 12, display: 'flex', alignItems: 'center', gap: 4 }}>
                <Plus size={14} /> Thêm FAQ
              </button>
            </div>

            {faqLoading ? (
              <div style={{ textAlign: 'center', padding: '24px', color: '#646970', fontSize: 13 }}>Đang tải...</div>
            ) : faqList.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '32px 16px', color: '#646970', fontSize: 13 }}>Chưa có câu hỏi nào. Bấm "Thêm FAQ" để bắt đầu.</div>
            ) : (
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
                <thead>
                  <tr style={{ background: '#f6f7f7', borderBottom: '1px solid #c3c4c7' }}>
                    <th style={{ padding: '8px 12px', textAlign: 'left', fontWeight: 600, color: '#1d2327', width: 40 }}>STT</th>
                    <th style={{ padding: '8px 12px', textAlign: 'left', fontWeight: 600, color: '#1d2327' }}>Câu hỏi (VI)</th>
                    <th style={{ padding: '8px 12px', textAlign: 'left', fontWeight: 600, color: '#1d2327' }}>Question (EN)</th>
                    <th style={{ padding: '8px 12px', textAlign: 'center', fontWeight: 600, color: '#1d2327', width: 80 }}>Trạng thái</th>
                    <th style={{ padding: '8px 12px', textAlign: 'center', fontWeight: 600, color: '#1d2327', width: 60 }}>Thứ tự</th>
                    <th style={{ padding: '8px 12px', textAlign: 'center', fontWeight: 600, color: '#1d2327', width: 100 }}>Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {faqList.map((faq, idx) => (
                    <tr key={faq.id} style={{ borderBottom: '1px solid #f0f0f1', background: idx % 2 === 0 ? '#fff' : '#fafafa' }}>
                      <td style={{ padding: '10px 12px', color: '#646970' }}>{idx + 1}</td>
                      <td style={{ padding: '10px 12px', color: '#1d2327', maxWidth: 250, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{faq.questionVi || <span style={{ color: '#a7aaad', fontStyle: 'italic' }}>Chưa nhập</span>}</td>
                      <td style={{ padding: '10px 12px', color: '#1d2327', maxWidth: 250, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{faq.questionEn || <span style={{ color: '#a7aaad', fontStyle: 'italic' }}>Empty</span>}</td>
                      <td style={{ padding: '10px 12px', textAlign: 'center' }}>
                        <button onClick={() => toggleFaqActive(faq)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4 }} title={faq.isActive ? 'Đang hiển thị' : 'Đang ẩn'}>
                          {faq.isActive ? <Eye size={16} style={{ color: '#00a32a' }} /> : <EyeOff size={16} style={{ color: '#a7aaad' }} />}
                        </button>
                      </td>
                      <td style={{ padding: '10px 12px', textAlign: 'center', color: '#646970' }}>{faq.sortOrder}</td>
                      <td style={{ padding: '10px 12px', textAlign: 'center' }}>
                        <div style={{ display: 'flex', gap: 4, justifyContent: 'center' }}>
                          <button onClick={() => setFaqModal({ ...faq })} className="wp-btn" style={{ padding: '3px 8px', fontSize: 11 }} title="Sửa"><Pencil size={13} /></button>
                          <button onClick={() => deleteFaq(faq.id)} className="wp-btn" style={{ padding: '3px 8px', fontSize: 11, color: '#d63638' }} title="Xoá"><Trash2 size={13} /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      )}

      {/* FAQ Modal */}
      {faqModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,.5)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center' }} onClick={() => setFaqModal(null)}>
          <div style={{ background: '#fff', borderRadius: 8, width: '100%', maxWidth: 640, maxHeight: '90vh', overflow: 'auto', padding: 24, boxShadow: '0 8px 32px rgba(0,0,0,.2)' }} onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <h3 style={{ fontSize: 15, fontWeight: 700, color: '#1d2327', margin: 0 }}>{faqModal.id ? 'Sửa FAQ' : 'Thêm FAQ mới'}</h3>
              <button onClick={() => setFaqModal(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4 }}><X size={18} /></button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
              <div>
                <label style={fieldLabel}>Câu hỏi (Tiếng Việt) *</label>
                <input style={inputStyle} value={faqModal.questionVi} onChange={e => setFaqModal({ ...faqModal, questionVi: e.target.value })} placeholder="VD: Làm sao để xác minh nhà cung cấp?" />
              </div>
              <div>
                <label style={fieldLabel}>Question (English) *</label>
                <input style={inputStyle} value={faqModal.questionEn} onChange={e => setFaqModal({ ...faqModal, questionEn: e.target.value })} placeholder="e.g. How to verify a supplier?" />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
              <div>
                <label style={fieldLabel}>Trả lời (Tiếng Việt) *</label>
                <textarea style={{ ...inputStyle, minHeight: 80, resize: 'vertical' }} value={faqModal.answerVi} onChange={e => setFaqModal({ ...faqModal, answerVi: e.target.value })} placeholder="Nhập câu trả lời bằng tiếng Việt..." />
              </div>
              <div>
                <label style={fieldLabel}>Answer (English) *</label>
                <textarea style={{ ...inputStyle, minHeight: 80, resize: 'vertical' }} value={faqModal.answerEn} onChange={e => setFaqModal({ ...faqModal, answerEn: e.target.value })} placeholder="Enter answer in English..." />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 20 }}>
              <div>
                <label style={fieldLabel}>Thứ tự hiển thị (Sort Order)</label>
                <input type="number" style={inputStyle} value={faqModal.sortOrder} onChange={e => setFaqModal({ ...faqModal, sortOrder: parseInt(e.target.value) || 0 })} />
              </div>
              <div>
                <label style={fieldLabel}>Trạng thái</label>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 4 }}>
                  <label style={{ position: 'relative', display: 'inline-block', width: 44, height: 24, cursor: 'pointer' }}>
                    <input type="checkbox" checked={faqModal.isActive} onChange={e => setFaqModal({ ...faqModal, isActive: e.target.checked })} style={{ opacity: 0, width: 0, height: 0 }} />
                    <span style={{ position: 'absolute', inset: 0, borderRadius: 12, transition: 'all .2s', background: faqModal.isActive ? '#00a32a' : '#c3c4c7' }}>
                      <span style={{ position: 'absolute', width: 18, height: 18, borderRadius: '50%', background: '#fff', top: 3, transition: 'all .2s', left: faqModal.isActive ? 23 : 3, boxShadow: '0 1px 3px rgba(0,0,0,.2)' }} />
                    </span>
                  </label>
                  <span style={{ fontSize: 12, color: faqModal.isActive ? '#00a32a' : '#646970' }}>{faqModal.isActive ? 'Hiển thị' : 'Ẩn'}</span>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
              <button className="wp-btn" onClick={() => setFaqModal(null)} style={{ padding: '7px 16px', fontSize: 12 }}>Huỷ</button>
              <button className="wp-btn wp-btn-primary" onClick={saveFaq} disabled={faqSaving || !faqModal.questionVi || !faqModal.answerVi} style={{ padding: '7px 16px', fontSize: 12 }}>
                {faqSaving ? 'Đang lưu...' : (faqModal.id ? 'Cập nhật' : 'Tạo mới')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Slide Modal */}
      {slideModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,.5)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center' }} onClick={() => setSlideModal(null)}>
          <div style={{ background: '#fff', borderRadius: 8, width: '100%', maxWidth: 680, maxHeight: '90vh', overflow: 'auto', padding: 24, boxShadow: '0 8px 32px rgba(0,0,0,.2)' }} onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <h3 style={{ fontSize: 15, fontWeight: 700, color: '#1d2327', margin: 0 }}>{slideModal.id ? 'Sửa Slide Banner' : 'Thêm Slide Banner Mới'}</h3>
              <button onClick={() => setSlideModal(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4 }}><X size={18} /></button>
            </div>

            <div style={{ marginBottom: 16 }}>
              <ImageUploader value={slideModal.image} onChange={url => setSlideModal({ ...slideModal, image: url })} label="Hình ảnh slide *" height={160} />
              <p style={{ ...fieldDesc, marginTop: 4 }}>Khuyến nghị ảnh kích thước lớn, tỉ lệ banner (VD: 1200x450 hoặc 1920x720).</p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
              <div>
                <label style={fieldLabel}>Tiêu đề (Tiếng Việt)</label>
                <input style={inputStyle} value={slideModal.titleVi} onChange={e => setSlideModal({ ...slideModal, titleVi: e.target.value })} placeholder="VD: Nhà cung cấp hàng đầu Việt Nam" />
              </div>
              <div>
                <label style={fieldLabel}>Tiêu đề (English)</label>
                <input style={inputStyle} value={slideModal.title} onChange={e => setSlideModal({ ...slideModal, title: e.target.value })} placeholder="e.g. Vietnam's Top Suppliers" />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
              <div>
                <label style={fieldLabel}>Mô tả (Tiếng Việt)</label>
                <textarea style={{ ...inputStyle, minHeight: 60, resize: 'vertical' }} value={slideModal.descVi} onChange={e => setSlideModal({ ...slideModal, descVi: e.target.value })} placeholder="Mô tả ngắn bằng Tiếng Việt..." />
              </div>
              <div>
                <label style={fieldLabel}>Mô tả (English)</label>
                <textarea style={{ ...inputStyle, minHeight: 60, resize: 'vertical' }} value={slideModal.desc} onChange={e => setSlideModal({ ...slideModal, desc: e.target.value })} placeholder="Short description in English..." />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 20 }}>
              <div>
                <label style={fieldLabel}>CTA Link (Đường dẫn nút bấm)</label>
                <input style={inputStyle} value={slideModal.link} onChange={e => setSlideModal({ ...slideModal, link: e.target.value })} placeholder="VD: /products" />
              </div>
              <div>
                <label style={fieldLabel}>Thứ tự sắp xếp (Sort Order)</label>
                <input type="number" style={inputStyle} value={slideModal.sortOrder ?? 0} onChange={e => setSlideModal({ ...slideModal, sortOrder: parseInt(e.target.value) || 0 })} />
              </div>
            </div>

            <div style={{ marginBottom: 20 }}>
              <label style={{ fontSize: 13, fontWeight: 600, color: '#1d2327', display: 'block', marginBottom: 4 }}>Trạng thái hiển thị</label>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 4 }}>
                <label style={{ position: 'relative', display: 'inline-block', width: 44, height: 24, cursor: 'pointer' }}>
                  <input type="checkbox" checked={slideModal.status !== 'hidden'} onChange={e => setSlideModal({ ...slideModal, status: e.target.checked ? 'active' : 'hidden' })} style={{ opacity: 0, width: 0, height: 0 }} />
                  <span style={{ position: 'absolute', inset: 0, borderRadius: 12, transition: 'all .2s', background: slideModal.status !== 'hidden' ? '#00a32a' : '#c3c4c7' }}>
                    <span style={{ position: 'absolute', width: 18, height: 18, borderRadius: '50%', background: '#fff', top: 3, transition: 'all .2s', left: slideModal.status !== 'hidden' ? 23 : 3, boxShadow: '0 1px 3px rgba(0,0,0,.2)' }} />
                  </span>
                </label>
                <span style={{ fontSize: 12, color: slideModal.status !== 'hidden' ? '#00a32a' : '#646970' }}>{slideModal.status !== 'hidden' ? 'Hiển thị' : 'Ẩn'}</span>
              </div>
            </div>

            <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
              <button className="wp-btn" onClick={() => setSlideModal(null)} style={{ padding: '7px 16px', fontSize: 12 }}>Huỷ</button>
              <button className="wp-btn wp-btn-primary" onClick={() => handleSaveSlide(slideModal)} disabled={!slideModal.image} style={{ padding: '7px 16px', fontSize: 12 }}>
                Lưu slide
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Slide Preview Modal */}
      {previewSlide && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,.6)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center' }} onClick={() => setPreviewSlide(null)}>
          <div style={{ background: '#fff', borderRadius: 8, width: '100%', maxWidth: 720, padding: 20, boxShadow: '0 8px 32px rgba(0,0,0,.3)' }} onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <h3 style={{ fontSize: 15, fontWeight: 700, color: '#1d2327', margin: 0 }}>Xem trước slide banner</h3>
              <button onClick={() => setPreviewSlide(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4 }}><X size={18} /></button>
            </div>

            <div style={{ position: 'relative', width: '100%', aspectRatio: '16/9', overflow: 'hidden', borderRadius: 6, background: '#f1f5f9' }}>
              {previewSlide.image ? (
                <>
                  <img src={previewSlide.image} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} referrerPolicy="no-referrer" />
                  <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(90deg, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0) 100%)', display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: 32, color: '#fff' }}>
                    <div style={{ maxWidth: 450, display: 'flex', flexDirection: 'column', gap: 8 }}>
                      <h2 style={{ fontSize: 24, fontWeight: 900, lineHeight: 1.2, margin: 0, textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}>
                        {previewSlide.titleVi || previewSlide.title || 'Tiêu đề'}
                      </h2>
                      <p style={{ fontSize: 14, color: '#e2e8f0', margin: 0, textShadow: '0 1px 2px rgba(0,0,0,0.5)' }}>
                        {previewSlide.descVi || previewSlide.desc || 'Mô tả ngắn...'}
                      </p>
                      {previewSlide.link && (
                        <span style={{ alignSelf: 'flex-start', background: '#003366', color: '#fff', padding: '6px 16px', fontSize: 12, fontWeight: 'bold', boxShadow: '0 4px 6px rgba(0,0,0,0.1)', borderRadius: 4 }}>
                          Xem ngay
                        </span>
                      )}
                    </div>
                  </div>
                </>
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center text-slate-400">
                  <ImageIcon size={48} className="mb-2" />
                  <span>Không có hình ảnh</span>
                </div>
              )}
            </div>

            <div style={{ marginTop: 16, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, fontSize: 12, color: '#475569', borderTop: '1px solid #f1f5f9', paddingTop: 12 }}>
              <div>
                <strong>Tiêu đề (VI):</strong> {previewSlide.titleVi || '—'}<br />
                <strong>Mô tả (VI):</strong> {previewSlide.descVi || '—'}
              </div>
              <div>
                <strong>Tiêu đề (EN):</strong> {previewSlide.title || '—'}<br />
                <strong>Mô tả (EN):</strong> {previewSlide.desc || '—'}
              </div>
              <div style={{ gridColumn: 'span 2' }}>
                <strong>Đường dẫn (CTA Link):</strong> <code style={{ background: '#f1f5f9', padding: '2px 6px', borderRadius: 4 }}>{previewSlide.link || '—'}</code>
              </div>
            </div>
          </div>
        </div>
      )}

      {tab !== 'faq' && (
        <div style={{ display: 'flex', gap: 10, marginTop: 8 }}>
          <button className="wp-btn wp-btn-primary" onClick={handleSave} disabled={saving || !hasChanges} style={{ padding: '8px 20px', fontSize: 13 }}>
            {saving ? 'Đang lưu...' : 'Lưu thay đổi'}
          </button>
          {hasChanges && (
            <button className="wp-btn" onClick={() => { setSettings({ ...originalSettings }); setSaved(false); }} style={{ padding: '8px 20px', fontSize: 13, background: '#fff', border: '1px solid #c3c4c7', color: '#d63638', cursor: 'pointer' }}>
              Huỷ thay đổi
            </button>
          )}
        </div>
      )}
    </div>
  );
}
