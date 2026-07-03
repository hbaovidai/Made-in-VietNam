import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Building2, User, Shield, FileText, Package, Globe, Download, Eye } from 'lucide-react';

// ─── Types (kept for backward compat with AdminSuppliers) ────
export type SupplierVerificationStatus = 'VERIFIED' | 'UNVERIFIED';

export interface SupplierProfile {
  id?: string;
  userId?: string;
  companyName?: string;
  slug?: string;
  logo?: string;
  banner?: string;
  description?: string;
  businesstype?: string;
  businessType?: string;
  yearEstablished?: number;
  employeeCount?: string;
  address?: string;
  city?: string;
  province?: string;
  website?: string;
  taxCode?: string;
  taxId?: string;
  companyEmail?: string;
  companyPhone?: string;
  legalRepresentative?: string;
  businessLicenseUrl?: string;
  identityCardUrl?: string;
  verificationStatus?: SupplierVerificationStatus;
  isVerified?: boolean;
  createdAt?: Date | string;
  updatedAt?: Date | string;
  repName?: string;
  repTitle?: string;
  repIdCard?: string;
  repEmail?: string;
  repPhone?: string;
  industry?: string[];
  products?: string;
  exportExperience?: boolean;
  exportMarkets?: string;
  annualRevenue?: string;
  driveLink?: string;
  documentList?: string[];
  submittedAt?: Date | string;
}

interface Props {
  request: SupplierProfile;
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
};

// ═══ Tab Components ═══════════════════════════════════════════

function TabOverview({ data }: { data: SupplierProfile }) {
  return (
    <div style={s.card}>
      <div style={s.cardHead}><Building2 size={16} color="#2271b1" /> Thông tin doanh nghiệp</div>
      <div style={s.cardBody}>
        <Field label="Tên doanh nghiệp" value={data.companyName} />
        <Field label="Mã số thuế" value={data.taxCode} mono />
        <Field label="Loại hình tổ chức" value={data.businessType || data.businesstype} />
        <Field label="Mô hình hoạt động" />
        <Field label="Ngành nghề" value={data.industry?.join(', ')} />
        <Field label="Địa chỉ trụ sở" value={[data.address, data.city, data.province].filter(Boolean).join(', ')} />
        <Field label="Năm thành lập" value={data.yearEstablished?.toString()} />
        <Field label="Số lượng nhân viên" value={data.employeeCount} />
        <Field label="Website" value={data.website} />
        <Field label="Danh mục chính" />
        <Field label="Danh mục con" />
        <Field label="Ghi chú admin" last />
      </div>
    </div>
  );
}

function TabContact({ data }: { data: SupplierProfile }) {
  return (
    <div style={s.card}>
      <div style={s.cardHead}><User size={16} color="#2271b1" /> Thông tin liên hệ</div>
      <div style={s.cardBody}>
        <Field label="Họ tên người đăng ký" value={data.repName} />
        <Field label="Chức vụ" value={data.repTitle} />
        <Field label="Email" value={data.companyEmail || data.repEmail} />
        <Field label="Số điện thoại" value={data.companyPhone || data.repPhone} />
        <Field label="Người đại diện pháp luật" value={data.legalRepresentative || data.repName} />
        <Field label="SĐT người đại diện" value={data.repPhone} last />
      </div>
    </div>
  );
}

function TabLegal({ data }: { data: SupplierProfile }) {
  return (
    <div style={s.card}>
      <div style={s.cardHead}><Shield size={16} color="#2271b1" /> Thông tin pháp lý</div>
      <div style={s.cardBody}>
        <Field label="Tên DN theo ĐKKD" value={data.companyName} />
        <Field label="Mã số thuế / Mã số DN" value={data.taxCode || data.taxId} mono />
        <Field label="Loại hình tổ chức" value={data.businessType || data.businesstype} />
        <Field label="Địa chỉ ĐKKD" value={[data.address, data.city, data.province].filter(Boolean).join(', ')} />
        <Field label="Trạng thái xác minh pháp lý" last />
      </div>
    </div>
  );
}

function TabManufacturer() {
  return (
    <>
      <div style={{ ...s.card, borderLeft: '3px solid #dba617' }}>
        <div style={s.cardBody}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
            <span style={{ fontWeight: 700, fontSize: 14, color: '#1d2327' }}>Manufacturer Verification</span>
            {statusBadge('NOT_APPLIED')}
          </div>
          <p style={{ fontSize: 13, color: '#646970', margin: 0 }}>
            Supplier has not applied for manufacturer verification.
          </p>
        </div>
      </div>

      <div style={{ ...s.card, opacity: 0.5 }}>
        <div style={s.cardHead}><Package size={16} color="#2271b1" /> Chi tiết năng lực sản xuất</div>
        <div style={s.cardBody}>
          <Field label="Trạng thái duyệt Manufacturer" />
          <Field label="Hình thức sản xuất" />
          <Field label="Địa chỉ nhà xưởng" />
          <Field label="Quy mô nhà xưởng" />
          <Field label="Số lượng nhân sự sản xuất" />
          <Field label="Năng lực SX mỗi tháng" />
          <Field label="Ngành sản xuất chính" />
          <Field label="Sản phẩm chính đang SX" />
          <Field label="Link Google Drive hồ sơ SX" />
          <Field label="Ghi chú admin" last />
        </div>
      </div>
    </>
  );
}

function TabExporter() {
  return (
    <>
      <div style={{ ...s.card, borderLeft: '3px solid #dba617' }}>
        <div style={s.cardBody}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
            <span style={{ fontWeight: 700, fontSize: 14, color: '#1d2327' }}>Exporter Verification</span>
            {statusBadge('NOT_APPLIED')}
          </div>
          <p style={{ fontSize: 13, color: '#646970', margin: 0 }}>
            Supplier has not applied for exporter verification.
          </p>
        </div>
      </div>

      <div style={{ ...s.card, opacity: 0.5 }}>
        <div style={s.cardHead}><Globe size={16} color="#2271b1" /> Chi tiết xuất khẩu</div>
        <div style={s.cardBody}>
          <Field label="Trạng thái duyệt Exporter" />
          <Field label="Thị trường xuất khẩu" />
          <Field label="Sản phẩm xuất khẩu chính" />
          <Field label="Kinh nghiệm xuất khẩu" />
          <Field label="Link Google Drive hồ sơ XK" />
          <Field label="Ghi chú admin" last />
        </div>
      </div>
    </>
  );
}

function TabDocuments() {
  const groups = [
    { title: 'Identity Documents', docs: ['CCCD / Passport mặt trước', 'CCCD / Passport mặt sau'] },
    { title: 'Business Legal Documents', docs: ['Giấy phép ĐKKD', 'Giấy chứng nhận đầu tư'] },
    { title: 'Manufacturer Documents', docs: ['Hình ảnh nhà xưởng', 'Chứng nhận ISO', 'Giấy phép sản xuất'] },
    { title: 'Exporter Documents', docs: ['Giấy phép xuất khẩu', 'C/O mẫu'] },
    { title: 'Other Documents', docs: ['Tài liệu bổ sung'] },
  ];

  return (
    <>
      {groups.map(g => (
        <div key={g.title} style={s.card}>
          <div style={s.cardHead}><FileText size={16} color="#2271b1" /> {g.title}</div>
          <div style={s.cardBody}>
            {g.docs.map((doc, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 0', borderBottom: i < g.docs.length - 1 ? '1px solid #f5f5f5' : 'none' }}>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: '#1e1e1e' }}>{doc}</div>
                  <div style={{ fontSize: 11, color: '#8c8f94', marginTop: 2 }}>
                    <span style={s.badge('#f0f0f1', '#646970', '#dcdcde')}>Not uploaded</span>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 6 }}>
                  <button className="wp-btn" style={{ fontSize: 11, padding: '4px 8px' }} disabled><Eye size={12} /> View</button>
                  <button className="wp-btn" style={{ fontSize: 11, padding: '4px 8px' }} disabled><Download size={12} /> Download</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </>
  );
}

function TabProducts() {
  return (
    <div className="wp-table-wrap">
      <table className="wp-table">
        <thead>
          <tr>
            <th>Product Name</th>
            <th>Category</th>
            <th>MOQ</th>
            <th>Status</th>
            <th>Created Date</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td colSpan={6} style={s.emptyState}>
              No products available.
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}


// ═══ Main Component ═══════════════════════════════════════════
export function SupplierDetail({ request, onApprove, onReject, onDelete, onBack }: Props) {
  const [activeTab, setActiveTab] = useState<TabKey>('overview');

  const verificationStatus = request.verificationStatus || 'UNVERIFIED';

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
        <Link to="/dashboard/admin/suppliers">Nhà cung cấp</Link>
        <span className="wp-breadcrumb-sep">›</span>
        <span className="wp-breadcrumb-current">{request.companyName || 'Supplier Detail'}</span>
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
                const isSupplierVerified = verificationStatus === 'VERIFIED';
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
