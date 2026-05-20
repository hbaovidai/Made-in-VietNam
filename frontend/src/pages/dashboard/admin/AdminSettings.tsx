import React, { useEffect, useState } from 'react';
import { api } from '../../../lib/api';
import { useTranslation } from 'react-i18next';
import { useToast } from '../../../components/ui/Toast';
import { Loader2, Save, MapPin, Phone, Mail, Globe, Facebook, Twitter, Linkedin, Instagram } from 'lucide-react';

const FIELDS = [
  { key: 'contact_address', icon: MapPin, label: 'admin_settings_address', type: 'text' },
  { key: 'contact_phone', icon: Phone, label: 'admin_settings_phone', type: 'text' },
  { key: 'contact_email', icon: Mail, label: 'admin_settings_email', type: 'email' },
  { key: 'facebook_url', icon: Facebook, label: 'Facebook URL', type: 'url' },
  { key: 'twitter_url', icon: Twitter, label: 'Twitter / X URL', type: 'url' },
  { key: 'linkedin_url', icon: Linkedin, label: 'LinkedIn URL', type: 'url' },
  { key: 'instagram_url', icon: Instagram, label: 'Instagram URL', type: 'url' },
];

export function AdminSettings() {
  const { t } = useTranslation();
  const { addToast } = useToast();
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    api.get('/settings')
      .then(res => setSettings(res.data))
      .catch(() => addToast({ type: 'error', title: t('admin_error'), message: t('admin_load_error') }))
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await api.put('/settings', settings);
      setSettings(res.data);
      addToast({ type: 'success', title: t('admin_success'), message: t('admin_settings_saved') });
    } catch {
      addToast({ type: 'error', title: t('admin_error'), message: t('admin_settings_save_error') });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-24">
        <Loader2 className="animate-spin text-primary" size={28} />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Contact Info Section */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
        <div className="px-6 py-5 border-b border-slate-100">
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
            <Globe size={16} className="text-primary" />
            {t('admin_settings_contact_info')}
          </h3>
          <p className="text-xs text-slate-400 mt-1">{t('admin_settings_contact_desc')}</p>
        </div>
        <div className="p-6 space-y-5">
          {FIELDS.slice(0, 3).map(field => {
            const Icon = field.icon;
            return (
              <div key={field.key}>
                <label className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                  <Icon size={14} className="text-slate-400" />
                  {t(field.label)}
                </label>
                <input
                  type={field.type}
                  value={settings[field.key] || ''}
                  onChange={e => setSettings({ ...settings, [field.key]: e.target.value })}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all placeholder:text-slate-400"
                  placeholder={t(field.label)}
                />
              </div>
            );
          })}
        </div>
      </div>

      {/* Social Links Section */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
        <div className="px-6 py-5 border-b border-slate-100">
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
            <Globe size={16} className="text-primary" />
            {t('admin_settings_social')}
          </h3>
          <p className="text-xs text-slate-400 mt-1">{t('admin_settings_social_desc')}</p>
        </div>
        <div className="p-6 space-y-5">
          {FIELDS.slice(3).map(field => {
            const Icon = field.icon;
            return (
              <div key={field.key}>
                <label className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                  <Icon size={14} className="text-slate-400" />
                  {field.label}
                </label>
                <input
                  type={field.type}
                  value={settings[field.key] || ''}
                  onChange={e => setSettings({ ...settings, [field.key]: e.target.value })}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all placeholder:text-slate-400"
                  placeholder="https://..."
                />
              </div>
            );
          })}
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end">
        <button
          onClick={handleSave}
          disabled={saving}
          className="inline-flex items-center gap-2 bg-primary text-white text-sm font-bold px-6 py-3 rounded-xl hover:bg-primary-dark transition-colors shadow-sm disabled:opacity-50"
        >
          {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
          {t('admin_settings_save_btn')}
        </button>
      </div>
    </div>
  );
}
