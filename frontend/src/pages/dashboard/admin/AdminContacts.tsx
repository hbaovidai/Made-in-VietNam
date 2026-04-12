import React, { useEffect, useState } from 'react';
import { DashboardSection } from '../../../components/DashboardSection';
import { api } from '../../../lib/api';
import { useToast } from '../../../components/ui/Toast';
import { Loader2, Mail, CheckCircle2, Circle } from 'lucide-react';

export function AdminContacts() {
  const { addToast } = useToast();
  const [contacts, setContacts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadContacts();
  }, []);

  const loadContacts = async () => {
    try {
      const res = await api.get('/contact');
      setContacts(res.data || []);
    } catch (err) {
      addToast({ type: 'error', title: 'Lỗi', message: 'Không thể tải danh sách liên hệ' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <DashboardSection 
        title="Quản lý Liên hệ" 
        subtitle="Danh sách các form liên hệ từ khách hàng trên trang About/Contact."
      >
        {loading ? (
          <div className="flex justify-center p-12"><Loader2 className="animate-spin text-primary" size={32} /></div>
        ) : (
          <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden mt-6">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[800px]">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-100 uppercase text-[10px] tracking-wider font-bold text-slate-500">
                    <th className="p-4 pl-6 w-1/4">Người gửi</th>
                    <th className="p-4 w-1/4">Tiêu đề</th>
                    <th className="p-4 w-1/3">Nội dung</th>
                    <th className="p-4">Ngày gửi</th>
                  </tr>
                </thead>
                <tbody className="text-sm">
                  {contacts.map(contact => (
                    <tr key={contact.id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors align-top">
                      <td className="p-4 pl-6">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-500 flex items-center justify-center shrink-0">
                            <Mail size={16} />
                          </div>
                          <div>
                            <div className="font-bold text-slate-900">{contact.fullName}</div>
                            <div className="text-xs text-slate-500">{contact.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="font-bold text-slate-800 line-clamp-2">{contact.subject}</div>
                      </td>
                      <td className="p-4">
                        <div className="text-slate-600 text-xs leading-relaxed whitespace-pre-wrap">{contact.message}</div>
                      </td>
                      <td className="p-4 text-slate-500 font-medium whitespace-nowrap">
                        {new Date(contact.createdAt).toLocaleDateString('vi-VN')}
                        <div className="text-xs opacity-70">{new Date(contact.createdAt).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}</div>
                      </td>
                    </tr>
                  ))}
                  {contacts.length === 0 && (
                    <tr><td colSpan={4} className="p-12 text-center text-slate-400 font-medium">Chưa có liên hệ nào</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </DashboardSection>
    </div>
  );
}
