import React, { useState, useEffect } from 'react';
import { api } from '../../../lib/api';

export function AdminSettings() {
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
      await api.put('/settings', settings, { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } });
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
      <h1 className="wp-page-title">Settings</h1>

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
  );
}
