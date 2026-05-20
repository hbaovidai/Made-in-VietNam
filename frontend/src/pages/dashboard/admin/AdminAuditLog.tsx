import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { api } from '../../../lib/api';
import { useToast } from '../../../components/ui/Toast';
import { Loader2, Search, ShieldCheck, ShieldAlert, Lock, Unlock, Trash2, UserPlus, UserX, Package, CheckCircle2, XCircle, Clock, FileText, Filter } from 'lucide-react';

export function AdminAuditLog() {
  const { t } = useTranslation();
  const { addToast } = useToast();
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [actionFilter, setActionFilter] = useState('ALL');

  const ACTION_MAP: Record<string, { label: string; icon: React.ReactNode; color: string }> = {
    VERIFY_SUPPLIER: { label: t('admin_audit_verify_supplier'), icon: <ShieldCheck size={14} />, color: 'text-emerald-600 bg-emerald-50' },
    UNVERIFY_SUPPLIER: { label: t('admin_audit_unverify_supplier'), icon: <ShieldAlert size={14} />, color: 'text-amber-600 bg-amber-50' },
    LOCK_USER: { label: t('admin_audit_lock_user'), icon: <Lock size={14} />, color: 'text-red-500 bg-red-50' },
    UNLOCK_USER: { label: t('admin_audit_unlock_user'), icon: <Unlock size={14} />, color: 'text-blue-600 bg-blue-50' },
    DELETE_USER: { label: t('admin_audit_delete_user'), icon: <UserX size={14} />, color: 'text-red-600 bg-red-50' },
    DELETE_PRODUCT: { label: t('admin_audit_delete_product'), icon: <Trash2 size={14} />, color: 'text-red-500 bg-red-50' },
    APPROVE_PRODUCT: { label: t('admin_audit_approve_product'), icon: <CheckCircle2 size={14} />, color: 'text-emerald-600 bg-emerald-50' },
    REJECT_PRODUCT: { label: t('admin_audit_reject_product'), icon: <XCircle size={14} />, color: 'text-amber-600 bg-amber-50' },
    UPDATE_ORDER_STATUS: { label: t('admin_audit_update_order'), icon: <Package size={14} />, color: 'text-blue-600 bg-blue-50' },
    CREATE_CATEGORY: { label: t('admin_audit_create_category'), icon: <FileText size={14} />, color: 'text-emerald-600 bg-emerald-50' },
    DELETE_CATEGORY: { label: t('admin_audit_delete_category'), icon: <Trash2 size={14} />, color: 'text-red-500 bg-red-50' },
    DELETE_CONTACT: { label: t('admin_audit_delete_contact'), icon: <Trash2 size={14} />, color: 'text-red-500 bg-red-50' },
  };

  useEffect(() => { loadLogs(); }, [actionFilter]);

  const loadLogs = async () => {
    setLoading(true);
    try {
      const params = actionFilter !== 'ALL' ? `?action=${actionFilter}&limit=100` : '?limit=100';
      const res = await api.get(`/audit-logs${params}`);
      setLogs(res.data.data || []);
    } catch (err) {
      addToast({ type: 'error', title: t('admin_error'), message: t('admin_orders_error_load') });
    } finally {
      setLoading(false);
    }
  };

  const filtered = logs.filter(l => {
    if (!search) return true;
    const s = search.toLowerCase();
    return l.user?.fullName?.toLowerCase().includes(s) ||
      l.targetName?.toLowerCase().includes(s) ||
      l.action?.toLowerCase().includes(s);
  });

  const formatTime = (dateStr: string) => {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    const now = new Date();
    const diff = now.getTime() - d.getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return t('admin_audit_just_now');
    if (mins < 60) return t('admin_audit_mins_ago', { count: mins });
    const hours = Math.floor(mins / 60);
    if (hours < 24) return t('admin_audit_hours_ago', { count: hours });
    const days = Math.floor(hours / 24);
    if (days < 7) return t('admin_audit_days_ago', { count: days });
    return d.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="space-y-6">
      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder={t('admin_audit_search')}
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter size={14} className="text-slate-400 shrink-0" />
          <select
            value={actionFilter}
            onChange={e => setActionFilter(e.target.value)}
            className="bg-white border border-slate-200 rounded-xl text-sm px-3 py-2.5 outline-none focus:border-primary font-medium text-slate-700"
          >
            <option value="ALL">{t('admin_audit_filter_all')}</option>
            {Object.entries(ACTION_MAP).map(([key, val]) => (
              <option key={key} value={key}>{val.label}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Timeline */}
      {loading ? (
        <div className="flex justify-center py-16"><Loader2 className="animate-spin text-primary" size={28} /></div>
      ) : filtered.length === 0 ? (
        <div className="py-16 text-center text-slate-400 text-sm">{t('admin_audit_empty')}</div>
      ) : (
        <div className="space-y-0">
          {filtered.map((log, idx) => {
            const actionInfo = ACTION_MAP[log.action] || { label: log.action, icon: <Clock size={14} />, color: 'text-slate-500 bg-slate-100' };
            const details = log.details ? JSON.parse(log.details) : null;
            return (
              <div key={log.id} className="flex gap-4 group">
                {/* Timeline line */}
                <div className="flex flex-col items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${actionInfo.color}`}>
                    {actionInfo.icon}
                  </div>
                  {idx < filtered.length - 1 && <div className="w-0.5 flex-1 bg-slate-100 my-1" />}
                </div>

                {/* Content */}
                <div className="pb-6 flex-1 min-w-0">
                  <div className="flex items-baseline justify-between gap-2">
                    <div className="text-sm">
                      <span className="font-bold text-slate-900">{log.user?.fullName || 'Admin'}</span>
                      <span className="text-slate-500 mx-1.5">{t('admin_audit_did')}</span>
                      <span className={`font-bold ${actionInfo.color.split(' ')[0]}`}>{actionInfo.label.toLowerCase()}</span>
                      {log.targetName && (
                        <>
                          <span className="text-slate-500 mx-1">→</span>
                          <span className="font-semibold text-slate-800">"{log.targetName}"</span>
                        </>
                      )}
                    </div>
                    <span className="text-[10px] text-slate-400 font-medium shrink-0 whitespace-nowrap">{formatTime(log.createdAt)}</span>
                  </div>
                  {details && (
                    <div className="mt-1 text-[11px] text-slate-400 font-mono bg-slate-50 px-2 py-1 rounded inline-block">
                      {Object.entries(details).map(([k, v]) => `${k}: ${v}`).join(' · ')}
                    </div>
                  )}
                  <div className="text-[10px] text-slate-300 mt-0.5">{log.user?.email}</div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
