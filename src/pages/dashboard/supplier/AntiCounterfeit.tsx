import React from 'react';
import { DashboardSection } from '../../../components/DashboardSection';
import { ShieldCheck, ShieldAlert, Activity, AlertTriangle, TrendingUp } from 'lucide-react';
import { qrCodes } from '../../../data/qrMockData';
import { useTranslation } from 'react-i18next';

export function AntiCounterfeit() {
  const { t } = useTranslation();
  const totalScans = qrCodes.reduce((sum, item) => sum + item.scans, 0);
  const compromised = qrCodes.filter(q => q.status === 'compromised').length;
  
  return (
    <DashboardSection 
      title={t('anti_counterfeit_title')} 
      subtitle={t('anti_counterfeit_subtitle')}
    >
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
        <div className="card p-6 border-l-4 border-l-blue-500">
          <div className="flex justify-between items-start mb-4">
            <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center text-blue-600">
              <Activity size={20} />
            </div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">{t('total_scans')}</span>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900">{totalScans}</div>
          <div className="text-sm text-green-600 font-medium flex items-center gap-1 mt-2">
            <TrendingUp size={14} /> {t('vs_last_month')}
          </div>
        </div>

        <div className="card p-6 border-l-4 border-l-green-500">
          <div className="flex justify-between items-start mb-4">
            <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center text-green-600">
              <ShieldCheck size={20} />
            </div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">{t('valid_qrs')}</span>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900">{qrCodes.length - compromised}</div>
          <div className="text-sm text-slate-500 font-medium mt-2">{t('valid_qrs_desc')}</div>
        </div>

        <div className="card p-6 border-l-4 border-l-red-500 bg-blue-50/30">
          <div className="flex justify-between items-start mb-4">
            <div className="w-10 h-10 rounded-lg bg-red-100 flex items-center justify-center text-red-600 animate-pulse">
              <ShieldAlert size={20} />
            </div>
            <span className="text-xs font-bold text-red-400 uppercase tracking-wider">{t('suspicious_alerts')}</span>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-red-600">{compromised}</div>
          <div className="text-sm text-red-600 font-medium flex items-center gap-1 mt-2">
            <AlertTriangle size={14} /> {t('suspicious_alerts_desc')}
          </div>
        </div>
      </div>

      <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
        <ShieldAlert size={18} className="text-red-500" />
        {t('recent_security_events')}
      </h3>
      
      {/* Mobile: Card List */}
      <div className="md:hidden space-y-3">
        {qrCodes.filter(q => q.status === 'compromised').map(alert => (
          <div key={alert.id} className="card p-4 border-l-4 border-l-red-500 bg-blue-50/30 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs font-bold bg-slate-100 px-2 py-1 rounded">{alert.code}</span>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-red-100 text-red-700">{t('severity_critical')}</span>
            </div>
            <div className="text-xs text-slate-500">{new Date(alert.lastScanned).toLocaleString('vi-VN')}</div>
            <div className="text-sm text-slate-600">{t('event_mock_desc')}</div>
          </div>
        ))}
        <div className="text-center py-4 text-sm text-slate-400">{t('no_more_events')}</div>
      </div>
      {/* Desktop: Table */}
      <div className="card overflow-hidden hidden md:block">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200">
              <th className="px-6 py-3 text-xs font-bold text-slate-500 uppercase">{t('event_time')}</th>
              <th className="px-6 py-3 text-xs font-bold text-slate-500 uppercase">{t('event_qr')}</th>
              <th className="px-6 py-3 text-xs font-bold text-slate-500 uppercase">{t('event_severity')}</th>
              <th className="px-6 py-3 text-xs font-bold text-slate-500 uppercase">{t('event_description')}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {qrCodes.filter(q => q.status === 'compromised').map(alert => (
              <tr key={alert.id} className="hover:bg-blue-50 transition-colors">
                <td className="px-6 py-4 text-sm font-medium text-slate-600">
                  {new Date(alert.lastScanned).toLocaleString('vi-VN')}
                </td>
                <td className="px-6 py-4">
                  <span className="font-mono text-xs font-bold bg-slate-100 px-2 py-1 rounded">
                    {alert.code}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-red-100 text-red-700">
                    {t('severity_critical')}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-slate-600">
                  {t('event_mock_desc')}
                </td>
              </tr>
            ))}
            <tr>
              <td className="px-6 py-8 text-center text-slate-500" colSpan={4}>
                {t('no_more_events')}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </DashboardSection>
  );
}
