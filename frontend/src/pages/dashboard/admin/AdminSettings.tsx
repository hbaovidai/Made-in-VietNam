import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { api } from '../../../lib/api';
import { aboutDb, AboutData, AboutStat } from '../../../utils/aboutDb';

// ─── Inline styles (matching AdminAppearance pattern) ────────
const card: React.CSSProperties = { background: '#fff', border: '1px solid #dcdcde', borderRadius: 4, padding: 20, marginBottom: 20 };
const cardTitle: React.CSSProperties = { fontSize: 14, fontWeight: 600, color: '#1d2327', marginBottom: 16, paddingBottom: 10, borderBottom: '1px solid #f0f0f1' };
const fieldLabel: React.CSSProperties = { fontSize: 12, fontWeight: 600, color: '#1d2327', marginBottom: 4, display: 'block' };
const inputStyle: React.CSSProperties = { width: '100%', padding: '6px 10px', border: '1px solid #8c8f94', borderRadius: 4, fontSize: 13, boxSizing: 'border-box' as const };

// ─── About Tab Component ─────────────────────────────────────
function AboutTabContent() {
  const [data, setData] = useState<AboutData>(aboutDb.getData());
  const [saved, setSaved] = useState(false);

  const update = (field: keyof AboutData, val: any) => {
    setData(prev => ({ ...prev, [field]: val }));
    setSaved(false);
  };

  const updateStat = (idx: number, field: keyof AboutStat, val: string) => {
    const stats = [...data.stats];
    stats[idx] = { ...stats[idx], [field]: val };
    update('stats', stats);
  };

  const updatePoint = (idx: number, lang: 'vi' | 'en', val: string) => {
    const points = [...data.missionPoints];
    points[idx] = { ...points[idx], [lang]: val };
    update('missionPoints', points);
  };

  const addPoint = () => update('missionPoints', [...data.missionPoints, { vi: '', en: '' }]);
  const removePoint = (idx: number) => update('missionPoints', data.missionPoints.filter((_: any, i: number) => i !== idx));

  const handleSave = () => {
    aboutDb.saveData(data);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const handleReset = () => {
    if (!confirm('Khôi phục tất cả nội dung về mặc định?')) return;
    setData(aboutDb.resetToDefault());
    setSaved(false);
  };

  return (
    <div>
      {saved && (
        <div style={{ padding: '8px 12px', background: '#e6f7e9', border: '1px solid #00a32a', borderRadius: 4, marginBottom: 16, fontSize: 13, color: '#00a32a' }}>
          ✓ Đã lưu nội dung trang Giới thiệu.
        </div>
      )}

      {/* Hero Section */}
      <div style={card}>
        <h3 style={cardTitle}>Hero Section</h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <div><label style={fieldLabel}>Tiêu đề Hero (VI)</label><input style={inputStyle} value={data.heroTitleVi} onChange={e => update('heroTitleVi', e.target.value)} /></div>
          <div><label style={fieldLabel}>Tiêu đề Hero (EN)</label><input style={inputStyle} value={data.heroTitleEn} onChange={e => update('heroTitleEn', e.target.value)} /></div>
          <div><label style={fieldLabel}>Mô tả Hero (VI)</label><textarea style={{ ...inputStyle, minHeight: 60, resize: 'vertical' }} value={data.heroDescVi} onChange={e => update('heroDescVi', e.target.value)} /></div>
          <div><label style={fieldLabel}>Mô tả Hero (EN)</label><textarea style={{ ...inputStyle, minHeight: 60, resize: 'vertical' }} value={data.heroDescEn} onChange={e => update('heroDescEn', e.target.value)} /></div>
        </div>
      </div>

      {/* Statistics */}
      <div style={card}>
        <h3 style={cardTitle}>Số liệu thống kê (4 ô)</h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          {data.stats.map((stat, idx) => (
            <div key={idx} style={{ padding: 12, border: '1px solid #f0f0f1', borderRadius: 6, background: '#fafafa' }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: '#646970', marginBottom: 8 }}>Ô #{idx + 1}</div>
              <div style={{ display: 'grid', gridTemplateColumns: '80px 1fr', gap: 8 }}>
                <div>
                  <label style={fieldLabel}>Giá trị</label>
                  <input style={{ ...inputStyle, textAlign: 'center', fontWeight: 700, fontSize: 16 }} value={stat.value} onChange={e => updateStat(idx, 'value', e.target.value)} placeholder="50+" />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                  <div><label style={fieldLabel}>Nhãn (VI)</label><input style={inputStyle} value={stat.labelVi} onChange={e => updateStat(idx, 'labelVi', e.target.value)} /></div>
                  <div><label style={fieldLabel}>Nhãn (EN)</label><input style={inputStyle} value={stat.labelEn} onChange={e => updateStat(idx, 'labelEn', e.target.value)} /></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Mission Section */}
      <div style={card}>
        <h3 style={cardTitle}>Sứ mệnh</h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <div><label style={fieldLabel}>Tiêu đề (VI)</label><input style={inputStyle} value={data.missionTitleVi} onChange={e => update('missionTitleVi', e.target.value)} /></div>
          <div><label style={fieldLabel}>Tiêu đề (EN)</label><input style={inputStyle} value={data.missionTitleEn} onChange={e => update('missionTitleEn', e.target.value)} /></div>
          <div><label style={fieldLabel}>Mô tả (VI)</label><textarea style={{ ...inputStyle, minHeight: 70, resize: 'vertical' }} value={data.missionDescVi} onChange={e => update('missionDescVi', e.target.value)} /></div>
          <div><label style={fieldLabel}>Mô tả (EN)</label><textarea style={{ ...inputStyle, minHeight: 70, resize: 'vertical' }} value={data.missionDescEn} onChange={e => update('missionDescEn', e.target.value)} /></div>
        </div>

        {/* Points */}
        <div style={{ marginTop: 16 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
            <label style={fieldLabel}>Điểm nổi bật (bullet points)</label>
            <button onClick={addPoint} style={{ background: 'none', border: '1px solid #2271b1', borderRadius: 4, padding: '3px 10px', cursor: 'pointer', fontSize: 11, color: '#2271b1' }}>+ Thêm</button>
          </div>
          {data.missionPoints.map((pt, idx) => (
            <div key={idx} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 30px', gap: 8, marginBottom: 6 }}>
              <input style={inputStyle} value={pt.vi} onChange={e => updatePoint(idx, 'vi', e.target.value)} placeholder="Nội dung tiếng Việt" />
              <input style={inputStyle} value={pt.en} onChange={e => updatePoint(idx, 'en', e.target.value)} placeholder="English content" />
              <button onClick={() => removePoint(idx)} style={{ background: 'none', border: '1px solid #d63638', borderRadius: 4, cursor: 'pointer', color: '#d63638', fontSize: 12 }} title="Xoá">×</button>
            </div>
          ))}
        </div>

        {/* Image & Quote */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginTop: 16 }}>
          <div>
            <label style={fieldLabel}>URL hình ảnh sứ mệnh</label>
            <input style={inputStyle} value={data.missionImage} onChange={e => update('missionImage', e.target.value)} placeholder="https://..." />
            {data.missionImage && <img src={data.missionImage} alt="" style={{ marginTop: 8, width: '100%', height: 120, objectFit: 'cover', borderRadius: 6, border: '1px solid #dcdcde' }} referrerPolicy="no-referrer" />}
          </div>
          <div>
            <label style={fieldLabel}>Trích dẫn (VI)</label>
            <textarea style={{ ...inputStyle, minHeight: 50, resize: 'vertical', marginBottom: 8 }} value={data.missionQuoteVi} onChange={e => update('missionQuoteVi', e.target.value)} />
            <label style={fieldLabel}>Trích dẫn (EN)</label>
            <textarea style={{ ...inputStyle, minHeight: 50, resize: 'vertical' }} value={data.missionQuoteEn} onChange={e => update('missionQuoteEn', e.target.value)} />
          </div>
        </div>
      </div>

      {/* Actions */}
      <div style={{ display: 'flex', gap: 10 }}>
        <button className="wp-btn wp-btn-primary" onClick={handleSave} style={{ padding: '8px 20px', fontSize: 13 }}>Lưu thay đổi</button>
        <button className="wp-btn" onClick={handleReset} style={{ padding: '8px 20px', fontSize: 13, background: '#fff', border: '1px solid #c3c4c7', color: '#d63638', cursor: 'pointer' }}>Khôi phục mặc định</button>
      </div>
    </div>
  );
}

// ═════════════════════════════════════════════════════════════
export function AdminSettings() {
  const location = useLocation();
  const tab = new URLSearchParams(location.search).get('tab') || 'general';

  const [settings, setSettings] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await api.get('/settings');
        if (res.data) {
          setSettings(res.data);
        }
      } catch (err) {
        console.error('Error fetching settings:', err);
      }
      setLoading(false);
    };
    fetchSettings();
  }, []);

  const update = (key: string, value: string) => {
    setSettings(prev => ({ ...prev, [key]: value }));
    setSaved(false);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await api.put('/settings', settings, { headers: { Authorization: `Bearer ${localStorage.getItem('mivn5_token')}` } });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch { /* silent */ }
    setSaving(false);
  };

  if (loading) return <div className="wp-loading">Loading settings...</div>;

  const sections = [
    {
      title: 'General Settings',
      fields: [
        { key: 'site_name', label: 'Site Title', desc: 'The name of your site.' },
        { key: 'site_tagline', label: 'Tagline', desc: 'In a few words, explain what this site is about.' },
        { key: 'site_url', label: 'Site URL', desc: 'The full URL of your site.' },
      ]
    },
    {
      title: 'Website Information',
      fields: [
        { key: 'contact_address', label: 'Address', desc: '' },
        { key: 'contact_phone', label: 'Phone', desc: '' },
        { key: 'contact_email', label: 'Email', desc: 'Admin email for notifications.' },
      ]
    },
    {
      title: 'Social Media',
      fields: [
        { key: 'facebook_url', label: 'Facebook URL', desc: '' },
        { key: 'twitter_url', label: 'Twitter URL', desc: '' },
        { key: 'linkedin_url', label: 'LinkedIn URL', desc: '' },
      ]
    },
    {
      title: 'Security Settings',
      fields: [
        { key: 'max_login_attempts', label: 'Max Login Attempts', desc: 'Number of allowed login attempts before lockout.' },
        { key: 'session_timeout', label: 'Session Timeout (mins)', desc: 'Auto-logout after inactivity.' },
      ]
    },
  ];

  return (
    <div>
      {/* Breadcrumb */}
      <div className="wp-breadcrumb">
        <Link to="/dashboard/admin">Dashboard</Link>
        <span className="wp-breadcrumb-sep">›</span>
        <span className="wp-breadcrumb-current">Settings</span>
      </div>

      <h1 className="wp-page-title">Settings</h1>

      {/* ═══ TAB: About Page ═══ */}
      {tab === 'about' && <AboutTabContent />}

      {/* ═══ TAB: General Settings ═══ */}
      {tab === 'general' && (
        <div>
          {saved && (
            <div style={{ padding: '8px 12px', background: '#e6f7e9', border: '1px solid #00a32a', borderRadius: 4, marginBottom: 16, fontSize: 13, color: '#00a32a' }}>
              ✓ Settings saved successfully.
            </div>
          )}

          {sections.map(section => (
            <div key={section.title} className="wp-form-section">
              <h2 className="wp-form-section-title">{section.title}</h2>
              <table className="wp-form-table">
                <tbody>
                  {section.fields.map(field => (
                    <tr key={field.key}>
                      <th>{field.label}</th>
                      <td>
                        <input
                          className="wp-form-input"
                          type="text"
                          value={settings[field.key] || ''}
                          onChange={e => update(field.key, e.target.value)}
                        />
                        {field.desc && <p className="wp-form-desc">{field.desc}</p>}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ))}

          <button className="wp-btn wp-btn-primary" onClick={handleSave} disabled={saving}
            style={{ padding: '6px 16px', fontSize: 13 }}>
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      )}
    </div>
  );
}
