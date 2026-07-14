import React from 'react';
import { ShieldCheck, ShieldAlert, Activity, AlertTriangle, TrendingUp } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { api } from '../../../lib/api';
import { useAuth } from '../../../contexts/AuthContext';

export function AntiCounterfeit() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [qrs, setQrs] = React.useState<any[]>([]);

  React.useEffect(() => {
    if (!user) return;
    api.get(`/batches/supplier/${user.supplier?.id}/qrcodes`)
      .then(res => setQrs(res.data))
      .catch(err => console.error(err));
  }, [user]);

  const totalScans = qrs.reduce((sum, item) => sum + (item.scanCount || 0), 0);
  const compromised = qrs.filter(q => q.status === 'COMPROMISED').length;
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-normal text-ink uppercase" style={{ letterSpacing: '0.32px' }}>{t('anti_counterfeit_title')}</h1>
        <p className="text-sm text-ink-muted mt-1" style={{ letterSpacing: '0.16px' }}>{t('anti_counterfeit_subtitle')}</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
        <div className="p-6 border border-hairline border-l-4 border-l-blue-500 bg-canvas" style={{ borderRadius: 0 }}>
          <div className="flex justify-between items-start mb-4">
            <div className="w-10 h-10 bg-blue-100/50 flex items-center justify-center text-blue-600 border border-blue-200" style={{ borderRadius: 0 }}>
              <Activity size={20} />
            </div>
            <span className="text-xs font-normal text-ink-subtle uppercase tracking-wider" style={{ letterSpacing: '0.32px' }}>{t('total_scans')}</span>
          </div>
          <div className="text-2xl sm:text-3xl font-normal text-ink">{totalScans}</div>
          <div className="text-sm text-green-600 font-normal flex items-center gap-1 mt-2" style={{ letterSpacing: '0.16px' }}>
            <TrendingUp size={14} /> {t('vs_last_month')}
          </div>
        </div>

        <div className="p-6 border border-hairline border-l-4 border-l-green-500 bg-canvas" style={{ borderRadius: 0 }}>
          <div className="flex justify-between items-start mb-4">
            <div className="w-10 h-10 bg-green-100/50 flex items-center justify-center text-green-600 border border-green-200" style={{ borderRadius: 0 }}>
              <ShieldCheck size={20} />
            </div>
            <span className="text-xs font-normal text-ink-subtle uppercase tracking-wider" style={{ letterSpacing: '0.32px' }}>{t('valid_qrs')}</span>
          </div>
          <div className="text-2xl sm:text-3xl font-normal text-ink">{qrs.length - compromised}</div>
          <div className="text-sm text-ink-muted font-normal mt-2" style={{ letterSpacing: '0.16px' }}>{t('valid_qrs_desc')}</div>
        </div>

        <div className="p-6 border border-hairline border-l-4 border-l-red-500 bg-canvas" style={{ borderRadius: 0 }}>
          <div className="flex justify-between items-start mb-4">
            <div className="w-10 h-10 bg-red-100/50 flex items-center justify-center text-red-600 border border-red-200" style={{ borderRadius: 0 }}>
              <ShieldAlert size={20} />
            </div>
            <span className="text-xs font-normal text-red-600 uppercase tracking-wider" style={{ letterSpacing: '0.32px' }}>{t('suspicious_alerts')}</span>
          </div>
          <div className="text-2xl sm:text-3xl font-normal text-red-650">{compromised}</div>
          <div className="text-sm text-red-650 font-normal flex items-center gap-1 mt-2" style={{ letterSpacing: '0.16px' }}>
            <AlertTriangle size={14} /> {t('suspicious_alerts_desc')}
          </div>
        </div>
      </div>

      <h3 className="text-lg font-normal text-ink uppercase tracking-tight mb-4 flex items-center gap-2" style={{ letterSpacing: '0.32px' }}>
        <ShieldAlert size={18} className="text-red-500" />
        {t('recent_security_events')}
      </h3>
      
      {/* Mobile: Card List */}
      <div className="md:hidden space-y-3">
        {qrs.filter(q => q.status === 'COMPROMISED').map(alert => (
          <div key={alert.id} className="p-4 border border-hairline border-l-4 border-l-red-500 bg-surface-1 space-y-2" style={{ borderRadius: 0 }}>
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs font-normal bg-surface-2 border border-hairline px-2 py-1" style={{ borderRadius: 0 }}>{alert.code}</span>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-normal uppercase bg-red-100/50 text-red-800 border border-red-300" style={{ borderRadius: 0, letterSpacing: '0.16px' }}>{t('severity_critical')}</span>
            </div>
            <div className="text-xs text-ink-subtle" style={{ letterSpacing: '0.16px' }}>{new Date(alert.updatedAt || alert.createdAt).toLocaleString('vi-VN')}</div>
            <div className="text-sm text-ink-muted" style={{ letterSpacing: '0.16px' }}>{t('event_mock_desc')}</div>
          </div>
        ))}
        <div className="text-center py-4 text-sm text-ink-subtle" style={{ letterSpacing: '0.16px' }}>{t('no_more_events')}</div>
      </div>
      {/* Desktop: Table */}
      <div className="border border-hairline bg-canvas overflow-hidden hidden md:block" style={{ borderRadius: 0 }}>
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-surface-2 border-b border-hairline">
              <th className="px-6 py-3 text-xs font-normal text-ink-subtle uppercase" style={{ letterSpacing: '0.32px' }}>{t('event_time')}</th>
              <th className="px-6 py-3 text-xs font-normal text-ink-subtle uppercase" style={{ letterSpacing: '0.32px' }}>{t('event_qr')}</th>
              <th className="px-6 py-3 text-xs font-normal text-ink-subtle uppercase" style={{ letterSpacing: '0.32px' }}>{t('event_severity')}</th>
              <th className="px-6 py-3 text-xs font-normal text-ink-subtle uppercase" style={{ letterSpacing: '0.32px' }}>{t('event_description')}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-hairline">
            {qrs.filter(q => q.status === 'COMPROMISED').map(alert => (
              <tr key={alert.id} className="hover:bg-surface-1 transition-colors">
                <td className="px-6 py-4 text-sm font-normal text-ink-muted" style={{ letterSpacing: '0.16px' }}>
                  {new Date(alert.updatedAt || alert.createdAt).toLocaleString('vi-VN')}
                </td>
                <td className="px-6 py-4">
                  <span className="font-mono text-xs font-normal bg-surface-2 border border-hairline px-2 py-1" style={{ borderRadius: 0 }}>
                    {alert.code}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span 
                    className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-normal uppercase bg-red-100/50 text-red-800 border border-red-300"
                    style={{ borderRadius: 0, letterSpacing: '0.16px' }}
                  >
                    {t('severity_critical')}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-ink-muted" style={{ letterSpacing: '0.16px' }}>
                  {t('event_mock_desc')}
                </td>
              </tr>
            ))}
            <tr>
              <td className="px-6 py-8 text-center text-ink-subtle" style={{ letterSpacing: '0.16px' }} colSpan={4}>
                {t('no_more_events')}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
