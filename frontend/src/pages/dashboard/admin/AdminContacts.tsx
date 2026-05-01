import React, { useEffect, useState } from 'react';
import { api } from '../../../lib/api';
import { useTranslation } from 'react-i18next';
import { useToast } from '../../../components/ui/Toast';
import { Loader2, Mail, Search } from 'lucide-react';

export function AdminContacts() {
  const { t } = useTranslation();
  const { addToast } = useToast();
  const [contacts, setContacts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    loadContacts();
  }, []);

  const loadContacts = async () => {
    try {
      const res = await api.get('/contact');
      setContacts(res.data || []);
    } catch (err) {
      addToast({ type: 'error', title: t('admin_error'), message: t('admin_contacts_load_error') });
    } finally {
      setLoading(false);
    }
  };

  const filtered = contacts.filter(c =>
    !search || 
    c.fullName?.toLowerCase().includes(search.toLowerCase()) || 
    c.email?.toLowerCase().includes(search.toLowerCase()) ||
    c.subject?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-xl font-bold text-slate-900">{t('admin_contacts_title')}</h1>
        <p className="text-sm text-slate-500 mt-1">{t('admin_contacts_subtitle')} — {contacts.length}</p>
      </div>

      {/* Toolbar */}
      <div className="relative max-w-md">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          placeholder={t('admin_search_placeholder')}
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full pl-9 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all"
        />
      </div>

      {/* Table */}
      {loading ? (
        <div className="flex justify-center py-16"><Loader2 className="animate-spin text-primary" size={28} /></div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left min-w-[650px]">
            <thead>
              <tr className="border-b border-slate-200 text-[10px] uppercase tracking-wider font-bold text-slate-400">
                <th className="pb-3 pl-1">Người gửi</th>
                <th className="pb-3">Tiêu đề</th>
                <th className="pb-3">Nội dung</th>
                <th className="pb-3 pr-1 text-right">Ngày gửi</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {filtered.map(contact => (
                <tr key={contact.id} className="border-b border-slate-100 hover:bg-slate-50/60 transition-colors align-top">
                  <td className="py-4 pl-1">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-blue-50 text-blue-500 flex items-center justify-center shrink-0">
                        <Mail size={14} />
                      </div>
                      <div>
                        <div className="font-semibold text-slate-900">{contact.fullName}</div>
                        <div className="text-xs text-slate-400 mt-0.5">{contact.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-4">
                    <div className="font-medium text-slate-700 line-clamp-1">{contact.subject}</div>
                  </td>
                  <td className="py-4">
                    <div className="text-slate-500 text-xs leading-relaxed line-clamp-2">{contact.message}</div>
                  </td>
                  <td className="py-4 pr-1 text-right text-xs text-slate-400 font-medium whitespace-nowrap">
                    <div>{new Date(contact.createdAt).toLocaleDateString()}</div>
                    <div className="text-[10px] mt-0.5 opacity-70">{new Date(contact.createdAt).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })}</div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={4} className="py-16 text-center text-slate-400 text-sm">{t('admin_no_contacts_found')}</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
