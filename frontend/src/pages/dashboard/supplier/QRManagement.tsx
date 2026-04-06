import React, { useState } from 'react';
import { DashboardSection } from '../../../components/DashboardSection';
import { Search, Download, QrCode, ShieldAlert, CheckCircle, Clock, Loader2 } from 'lucide-react';
import { Badge } from '../../../components/ui/Badge';
import { EmptyState } from '../../../components/ui/EmptyState';
import { useToast } from '../../../components/ui/Toast';
import { useTranslation } from 'react-i18next';
import { api } from '../../../lib/api';
import { useAuth } from '../../../contexts/AuthContext';

export function QRManagement() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const { addToast } = useToast();
  const [qrs, setQrs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  React.useEffect(() => {
    if (!user) return;
    setLoading(true);
    api.get(`/batches/supplier/${user.supplier?.id}/qrcodes`)
      .then(res => setQrs(res.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, [user]);

  const downloadQR = (code: string) => {
    addToast({ type: 'success', title: t('downloading_qr'), message: t('downloading_qr_desc', { code }) });
  };

  return (
    <DashboardSection 
      title={t('qr_mgmt_title')} 
      subtitle={t('qr_mgmt_subtitle')}
    >
      <div className="p-4 border-b border-slate-100 flex gap-4 items-center bg-slate-50/50">
        <div className="relative w-full max-w-sm">
          <input type="text" placeholder={t('search_qr')} className="input py-2 pl-10" />
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="animate-spin text-primary" size={32} />
        </div>
      ) : qrs.length === 0 ? (
        <EmptyState 
          icon={<QrCode size={48} className="text-slate-300" />}
          title={t('no_qrs')}
          description={t('no_qrs_desc')}
        />
      ) : (
        <div className="overflow-x-auto min-h-[400px]">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="table-header">
                <th className="px-6 py-4">{t('qr_table_id')}</th>
                <th className="px-6 py-4">{t('qr_table_batch')}</th>
                <th className="px-6 py-4 text-center">{t('qr_table_scans')}</th>
                <th className="px-6 py-4">{t('qr_table_last_scan')}</th>
                <th className="px-6 py-4">{t('qr_table_status')}</th>
                <th className="px-6 py-4 text-right">{t('qr_table_action')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {qrs.map((qr) => (
                <tr key={qr.id} className="table-row group">
                  <td className="table-cell">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-slate-100 rounded flex items-center justify-center p-1 border border-slate-200">
                        {/* Mock QR svg representation */}
                        <QrCode className="text-slate-700" size={24} />
                      </div>
                      <span className="font-bold font-mono text-sm text-slate-700">{qr.code}</span>
                    </div>
                  </td>
                  <td className="table-cell font-medium text-slate-600">
                    {qr.batch?.batchNumber || 'Unknown Batch'}
                  </td>
                  <td className="table-cell text-center font-bold text-slate-800">
                    {qr.scanCount}
                  </td>
                  <td className="table-cell text-xs text-slate-500">
                    {new Date(qr.createdAt).toLocaleString()}
                  </td>
                  <td className="table-cell">
                    {qr.status === 'ACTIVE' && <Badge variant="success" icon={<CheckCircle size={12}/>}>{t('qr_status_safe')}</Badge>}
                    {qr.status === 'COMPROMISED' && <Badge variant="danger" icon={<ShieldAlert size={12}/>}>{t('qr_status_compromised')}</Badge>}
                    {qr.status === 'EXPIRED' && <Badge variant="warning" icon={<Clock size={12}/>}>{t('qr_status_expired')}</Badge>}
                  </td>
                  <td className="table-cell text-right">
                    <button 
                      onClick={() => downloadQR(qr.code)}
                      className="btn-secondary py-1.5 px-3 text-xs flex items-center gap-1 ml-auto"
                    >
                      <Download size={14} /> {t('download_svg')}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </DashboardSection>
  );
}
