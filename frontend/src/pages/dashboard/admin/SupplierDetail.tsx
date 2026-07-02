import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ExternalLink, CheckCircle, ArrowLeft, X } from 'lucide-react';
import { BusinessType, SupplierStatus, SupplierType } from '@/src/lib/enums';
import { api } from '@/src/lib/api';

// TODO: THIS FILE NEEDS FIXING

function attrBox( {  } ) {
  return (
    <>
    </>
  );
}

// ─── Types (kept for backward compat with AdminSuppliers) ────
export type SupplierVerificationStatus = 'VERIFIED' | 'UNVERIFIED';

// ─── Types ───────────────────────────────────────────────────
export interface SupplierProfile {
  idOrSlug?: string,

  companyName?: string,
  province?: string,
  district?: string,
  ward?: string,
  streetAddress?: string,
  supplierType?: SupplierType,
  businessType?: BusinessType,
  status?: SupplierStatus,

  taxCode?: string,
  legalRepName?: string,
  legalRepPhone?: string,
  businessLicenseUrl?: string[],

  accountHolderFullName: string,
  accountHolderPhone: string,
  accountHolderEmail: string,
  accountHolderRole: string,
  accountHolderGovId: string,
  accountHolderGovIdUrl: string[],
  authorizationLetterUrl: string[],
}

interface Props {
  id: string;
  onApprove: (id: string) => void;
  onReject: (id: string, reason?: string) => void;
  onDelete: (id: string) => void;
  onBack: () => void;
}

// ─── Styles ──────────────────────────────────────────────────
const s = {
  card: { background: '#fff', border: '1px solid #e2e4e7', borderRadius: 4, marginBottom: 16, boxShadow: '0 1px 1px rgba(0,0,0,.04)' } as React.CSSProperties,
  cardHead: { padding: '10px 16px', borderBottom: '1px solid #e2e4e7', fontSize: 14, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 8 } as React.CSSProperties,
  cardBody: { padding: 16 } as React.CSSProperties,
  row: { display: 'flex', padding: '8px 0', borderBottom: '1px solid #f5f5f5', fontSize: 13 } as React.CSSProperties,
  rowLast: { display: 'flex', padding: '8px 0', fontSize: 13 } as React.CSSProperties,
  label: { width: 220, flexShrink: 0, color: '#646970', fontWeight: 500 } as React.CSSProperties,
  val: { flex: 1, color: '#1e1e1e', fontWeight: 400 } as React.CSSProperties,
  emptyState: { textAlign: 'center' as const, padding: 40, color: '#8c8f94', fontSize: 13 },
  tab: (active: boolean) => ({
    flex: 1, textAlign: 'center' as const,
    padding: '10px 16px', fontSize: 13, fontWeight: active ? 700 : 500, cursor: 'pointer',
    background: active ? '#fff' : 'transparent', color: active ? '#1d2327' : '#646970',
    border: 'none', borderBottom: active ? '2px solid #2271b1' : '2px solid transparent',
  } as React.CSSProperties),
  badge: (bg: string, color: string, border: string) => ({
    display: 'inline-block', fontSize: 11, fontWeight: 600, padding: '3px 10px',
    borderRadius: 4, background: bg, color, border: `1px solid ${border}`, marginRight: 6,
  } as React.CSSProperties),
};

const Field = ({ label, value, last, mono }: { label: string; value?: string; last?: boolean; mono?: boolean }) => (
  <div style={last ? s.rowLast : s.row}>
    <div style={s.label}>{label}</div>
    <div style={{ ...s.val, ...(mono ? { fontFamily: 'monospace' } : {}) }}>{value || <span style={{ color: '#c3c4c7' }}>—</span>}</div>
  </div>
);

type TabKey = 'overview' | 'contact' | 'legal' | 'manufacturer' | 'exporter' | 'documents' | 'products';

const TABS: { key: TabKey; label: string; icon: React.ReactNode }[] = [
  { key: 'overview', label: 'Overview', icon: <Building2 size={14} /> },
  { key: 'contact', label: 'Contact', icon: <User size={14} /> },
  { key: 'legal', label: 'Legal', icon: <Shield size={14} /> },
  { key: 'manufacturer', label: 'Manufacturer', icon: <Package size={14} /> },
  { key: 'exporter', label: 'Exporter', icon: <Globe size={14} /> },
  { key: 'documents', label: 'Documents', icon: <FileText size={14} /> },
  { key: 'products', label: 'Products', icon: <Package size={14} /> },
];

const statusBadge = (status?: string) => {
  const map: Record<string, { bg: string; color: string; border: string }> = {
    VERIFIED: { bg: '#e6f6ee', color: '#00713a', border: '#7bc4a0' },
    UNVERIFIED: { bg: '#fce4e4', color: '#8b1a1a', border: '#f1a7a7' },
    PENDING: { bg: '#fcf0e3', color: '#996800', border: '#dba617' },
    APPROVED: { bg: '#e6f6ee', color: '#00713a', border: '#7bc4a0' },
    REJECTED: { bg: '#fce4e4', color: '#8b1a1a', border: '#f1a7a7' },
    SUSPENDED: { bg: '#f0f0f1', color: '#646970', border: '#dcdcde' },
    NOT_APPLIED: { bg: '#f0f0f1', color: '#646970', border: '#dcdcde' },
  };
  const cfg = map[status || 'UNVERIFIED'] || map.UNVERIFIED;
  return <span style={s.badge(cfg.bg, cfg.color, cfg.border)}>{status || 'Unknown'}</span>;
}

const statusMap: Record<string, { label: string; bg: string; color: string; border: string }> = {
  [SupplierStatus.VERIFIED]:   { label: 'Đã xác minh',   bg: '#e6f6ee', color: '#00713a', border: '#7bc4a0' },
  [SupplierStatus.UNVERIFIED]:   { label: 'Chưa xác minh',    bg: '#fce4e4', color: '#8b1a1a', border: '#f1a7a7' },
  [SupplierStatus.SUSPENDED]:   { label: 'Đã ăn ban',    bg: '#fce4e4', color: '#8b1a1a', border: '#f1a7a7' },
  [SupplierStatus.APPLICATION_REJECTED]:   { label: 'Đã từ chối phê duyệt',    bg: '#fce4e4', color: '#8b1a1a', border: '#f1a7a7' },
};

// ═════════════════════════════════════════════════════════════
export function SupplierDetail({ id, onApprove, onReject, onDelete, onBack }: Props) {

  const [showRejectBox, setShowRejectBox] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  const [showApproveModal, setShowApproveModal] = useState(false);
  const [notesSaved, setNotesSaved] = useState(false);
  
  const [profile, setProfile] = useState<SupplierProfile>(null);
  const fetchProfile = async (id: string) => { 
    const res = await api.get(
      `/suppliers/adminShotGun/${id}`, 
      {
        headers: {
          Authorization: `${localStorage.getItem('token')}`
        }
      }
    );

    setProfile(res.data);
  };
  useEffect(() => {
    fetchProfile(id);
  }, []);


  const st = statusMap[profile.status] || statusMap.PENDING;

  const renderTab = () => {
    switch (activeTab) {
      case 'overview': return <TabOverview data={request} />;
      case 'contact': return <TabContact data={request} />;
      case 'legal': return <TabLegal data={request} />;
      case 'manufacturer': return <TabManufacturer />;
      case 'exporter': return <TabExporter />;
      case 'documents': return <TabDocuments />;
      case 'products': return <TabProducts />;

    }
  };

  return (
    <div>
      {/* Breadcrumb */}
      <div className="wp-breadcrumb">
        <Link to="/dashboard/admin">Dashboard</Link>
        <span className="wp-breadcrumb-sep">›</span>
        <label>Nhà cung cấp</label> {/* TODO: đổi lại đúng  */}
        <span className="wp-breadcrumb-sep">›</span>
        <span className="wp-breadcrumb-current">{profile.companyName}</span>
      </div>


      {/* ═══ Header Card ═══ */}
      <div style={{ ...s.card, padding: '16px 20px' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'flex-start', gap: 16 }}>
          {/* Left: Info */}
          <div style={{ flex: 1, minWidth: 300 }}>
            <div style={{ fontSize: 18, fontWeight: 700, color: '#1d2327', marginBottom: 6 }}>
              {request.companyName || 'Company Name'}
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 10 }}>
              {/* Verification Badges */}
              {(() => {
                const isSupplierVerified = status === 'VERIFIED';
                const isManufacturerVerified = false; // placeholder — will be from API
                const isExporterVerified = false;     // placeholder — will be from API
                const active = { bg: '#e6f6ee', color: '#00713a', border: '#7bc4a0', icon: '✓' };
                const inactive = { bg: '#f0f0f1', color: '#8c8f94', border: '#dcdcde', icon: '○' };
                const badges = [
                  { label: 'Verified Supplier', on: isSupplierVerified },
                  { label: 'Verified Manufacturer', on: isManufacturerVerified },
                  { label: 'Verified Exporter', on: isExporterVerified },
                ];
                return badges.map(b => {
                  const cfg = b.on ? active : inactive;
                  return (
                    <span key={b.label} style={{
                      display: 'inline-flex', alignItems: 'center', gap: 4,
                      fontSize: 11, fontWeight: 600, padding: '4px 10px', borderRadius: 4,
                      background: cfg.bg, color: cfg.color, border: `1px solid ${cfg.border}`,
                    }}>
                      {cfg.icon} {b.label}
                    </span>
                  );
                });
              })()}
            </div>
          </div>
        </div>
      </div>

      {/* ═══ Tab Navigation ═══ */}
      <div style={{ display: 'flex', flexWrap: 'wrap', borderBottom: '1px solid #e2e4e7', marginBottom: 16, background: '#fff' }}>
        {TABS.map(t => (
          <button key={t.key} style={s.tab(activeTab === t.key)} onClick={() => setActiveTab(t.key)}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}>{t.icon} {t.label}</span>
          </button>
        ))}
      </div>

      {/* ═══ Tab Content ═══ */}
      {renderTab()}

      {/* ═══ Admin Actions ═══ */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 24, paddingTop: 16, borderTop: '1px solid #e2e4e7' }}>
        <button className="wp-btn wp-btn-primary" onClick={() => onApprove(request.id!)}>Approve</button>
        <button className="wp-btn wp-btn-danger" onClick={() => onReject(request.id!)}>Reject</button>
        <button className="wp-btn" onClick={() => alert('Request more documents')}>Request More Docs</button>
        <button className="wp-btn" onClick={() => alert('Suspend supplier')}>Suspend</button>
        <div style={{ flex: 1 }} />
        <button className="wp-btn" onClick={onBack}>← Back to List</button>
      </div>
    </div>
  );
}
