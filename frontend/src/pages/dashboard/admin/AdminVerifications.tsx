import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Search } from 'lucide-react';
import { WPPagination } from '../../../components/admin/WPPagination';
import { VerificationDetail, VerificationRequest } from './VerificationDetail';

// ─── Types ───────────────────────────────────────────────────
export type VerificationStatus = 'Pending' | 'Approved' | 'Rejected' | 'Invited' | 'Registered';

export interface BusinessVerificationApplication {
  id: string;
  companyName: string;
  contactName: string;
  phoneNumber: string;
  email: string;
  taxCode: string;
  industry: string;
  submittedDate: string;
  status: VerificationStatus;
  inviteToken?: string;
  tokenExpiresAt?: string;
}

// ─── Mock list data ──────────────────────────────────────────
const mockApplications: BusinessVerificationApplication[] = [
  { id: 'app-1', companyName: 'Công ty Cổ phần Gốm sứ Minh Long', contactName: 'Lê Minh Tuấn', phoneNumber: '0987654321', email: 'minhtuan@minhlong.com', taxCode: '0312456789', industry: 'Gốm sứ & Thủ công mỹ nghệ', submittedDate: '2026-06-01', status: 'Pending' },
  { id: 'app-2', companyName: 'Công ty TNHH Nông sản Việt Phát', contactName: 'Nguyễn Thị Lan', phoneNumber: '0912345678', email: 'lannguyen@vietphatagro.com', taxCode: '0109876543', industry: 'Nông sản & Thực phẩm', submittedDate: '2026-05-28', status: 'Invited', inviteToken: 'v5-tkn-8e9f2a7c4b1d', tokenExpiresAt: '2026-06-10' },
  { id: 'app-3', companyName: 'Hợp tác xã Tre Việt', contactName: 'Hoàng Văn Nam', phoneNumber: '0909876543', email: 'contact@trevietcraft.com', taxCode: '3701234567', industry: 'Gỗ & Thủ công mỹ nghệ', submittedDate: '2026-05-25', status: 'Registered', inviteToken: 'v5-tkn-3d4e5f6a7b8c', tokenExpiresAt: '2026-06-01' },
  { id: 'app-4', companyName: 'Công ty Dệt may Saigon Garment', contactName: 'Trần Thanh Sơn', phoneNumber: '0933445566', email: 'sontran@saigongarment.com', taxCode: '0304567890', industry: 'Dệt may & Da giày', submittedDate: '2026-05-20', status: 'Approved' },
  { id: 'app-5', companyName: 'Thủy sản Minh Hải', contactName: 'Phan Văn Hải', phoneNumber: '0977889900', email: 'haiphan@minhhaiseafood.com', taxCode: '1800123456', industry: 'Thủy hải sản', submittedDate: '2026-05-15', status: 'Rejected' },
];

// ─── Mock detail data ────────────────────────────────────────
const mockDetails: Record<string, VerificationRequest> = {
  'app-1': {
    id: 'app-1', companyName: 'Công ty Cổ phần Gốm sứ Minh Long', taxId: '0312456789', companyType: 'Công ty Cổ phần',
    foundedYear: 1970, address: '276 ĐT743, An Phú, Thuận An', province: 'Bình Dương', website: 'https://minhlong.com',
    repName: 'Lê Minh Tuấn', repTitle: 'Giám đốc điều hành', repIdCard: '038095001234', repEmail: 'minhtuan@minhlong.com', repPhone: '0987654321',
    industry: ['Gốm sứ', 'Thủ công mỹ nghệ', 'Xuất khẩu'], products: 'Bát đĩa sứ cao cấp, bộ trà sứ truyền thống, lọ hoa gốm nghệ thuật, bình phong thủy, quà tặng gốm sứ doanh nghiệp.',
    exportExperience: true, exportMarkets: 'Mỹ, Nhật Bản, Hàn Quốc, Đức', annualRevenue: '> 10 tỷ', employeeCount: '> 200',
    driveLink: 'https://drive.google.com/drive/folders/1a2b3c4d5e6f_minhlong',
    documentList: ['Giấy đăng ký kinh doanh', 'CCCD người đại diện', 'Chứng nhận ISO 9001:2015', 'Catalogue sản phẩm 2026', 'Báo cáo tài chính năm 2025'],
    submittedAt: '2026-06-01T09:30:00', status: 'pending', notes: 'Doanh nghiệp lớn, cần ưu tiên kiểm duyệt.',
  },
  'app-2': {
    id: 'app-2', companyName: 'Công ty TNHH Nông sản Việt Phát', taxId: '0109876543', companyType: 'Công ty TNHH',
    foundedYear: 2015, address: '45 Nguyễn Trãi, Thanh Xuân', province: 'Hà Nội',
    repName: 'Nguyễn Thị Lan', repTitle: 'Giám đốc', repIdCard: '012095009876', repEmail: 'lannguyen@vietphatagro.com', repPhone: '0912345678',
    industry: ['Nông sản', 'Thực phẩm', 'Xuất khẩu'], products: 'Gạo hữu cơ, cà phê nguyên chất Buôn Ma Thuột, hạt điều rang muối, tiêu đen Phú Quốc.',
    exportExperience: true, exportMarkets: 'EU, Nhật Bản', annualRevenue: '1 - 10 tỷ', employeeCount: '51 - 200',
    driveLink: 'https://drive.google.com/drive/folders/2b3c4d5e6f7g_vietphat',
    documentList: ['Giấy đăng ký kinh doanh', 'CCCD người đại diện', 'Chứng nhận HACCP', 'Catalogue sản phẩm'],
    submittedAt: '2026-05-28T14:15:00', status: 'invited', notes: 'Đã xác nhận ngành nghề xuất khẩu nông sản sạch.',
  },
};

// ─── Status helpers ──────────────────────────────────────────
const statusLabels: Record<VerificationStatus, string> = {
  Pending: 'Chờ duyệt', Approved: 'Đã xác minh', Rejected: 'Đã từ chối', Invited: 'Đã gửi link', Registered: 'Đã đăng ký',
};
const statusBadgeClass: Record<VerificationStatus, string> = {
  Pending: 'wp-badge-pending', Approved: 'wp-badge-approved', Rejected: 'wp-badge-rejected', Invited: 'wp-badge-published', Registered: 'wp-badge-draft',
};
const statusColor: Record<VerificationStatus, string> = {
  Pending: '#dba617', Approved: '#00a32a', Rejected: '#d63638', Invited: '#2271b1', Registered: '#8c5ae2',
};

// ═════════════════════════════════════════════════════════════
export function AdminVerifications() {
  const { t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const params = new URLSearchParams(location.search);
  const tab = params.get('tab') || 'list';
  const detailId = params.get('id');

  const [applications, setApplications] = useState<BusinessVerificationApplication[]>(mockApplications);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [copiedToken, setCopiedToken] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const perPage = 20;

  // ─── Counts ────────────────────────────────────────────────
  const statusCounts: Record<string, number> = {
    all: applications.length,
    Pending: applications.filter(a => a.status === 'Pending').length,
    Invited: applications.filter(a => a.status === 'Invited').length,
    Registered: applications.filter(a => a.status === 'Registered').length,
    Approved: applications.filter(a => a.status === 'Approved').length,
    Rejected: applications.filter(a => a.status === 'Rejected').length,
  };
  const statusFilterLabels: Record<string, string> = {
    all: 'Tất cả', Pending: 'Chờ duyệt', Invited: 'Đã gửi link', Registered: 'Đã đăng ký', Approved: 'Đã xác minh', Rejected: 'Đã từ chối',
  };

  const filtered = applications.filter(a => {
    const matchSearch = !search || a.companyName.toLowerCase().includes(search.toLowerCase()) || a.contactName.toLowerCase().includes(search.toLowerCase()) || a.taxCode.includes(search);
    const matchStatus = filterStatus === 'all' || a.status === filterStatus;
    return matchSearch && matchStatus;
  });
  const paginated = filtered.slice((page - 1) * perPage, page * perPage);

  const toggleAll = () => { if (selectedIds.length === paginated.length) setSelectedIds([]); else setSelectedIds(paginated.map(a => a.id)); };
  const toggleOne = (id: string) => { setSelectedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]); };

  const handleStatusChange = (id: string, newStatus: VerificationStatus) => {
    setApplications(prev => prev.map(a => {
      if (a.id !== id) return a;
      const updates: Partial<BusinessVerificationApplication> = { status: newStatus };
      if (newStatus === 'Invited') {
        updates.inviteToken = `v5-tkn-${Math.random().toString(36).substring(2, 14)}`;
        const exp = new Date(); exp.setDate(exp.getDate() + 7);
        updates.tokenExpiresAt = exp.toISOString().split('T')[0];
      }
      return { ...a, ...updates };
    }));
  };

  const handleDelete = (id: string) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa hồ sơ này?')) return;
    setApplications(prev => prev.filter(a => a.id !== id));
  };

  const handleCopyLink = (token: string) => {
    navigator.clipboard.writeText(`${window.location.origin}/register?token=${token}`);
    setCopiedToken(token);
    setTimeout(() => setCopiedToken(null), 2000);
  };

  // ═══════════════════════════════════════════════════════════
  // TAB: Detail
  // ═══════════════════════════════════════════════════════════
  if (tab === 'detail' && detailId) {
    const detail = mockDetails[detailId];
    if (!detail) return <div style={{ padding: 40, textAlign: 'center', color: '#646970' }}>{t('khong_tim_thay_ho_so')}</div>;
    return (
      <VerificationDetail
        request={detail}
        onApprove={(id) => { handleStatusChange(id, 'Invited'); navigate('/dashboard/admin/verifications'); }}
        onReject={(id) => { handleStatusChange(id, 'Rejected'); navigate('/dashboard/admin/verifications'); }}
        onDelete={(id) => { handleDelete(id); navigate('/dashboard/admin/verifications'); }}
        onBack={() => navigate('/dashboard/admin/verifications')}
      />
    );
  }

  // ═══════════════════════════════════════════════════════════
  // TAB: List
  // ═══════════════════════════════════════════════════════════
  if (tab === 'list' || tab === null) {
    return (
      <div>
        <div className="wp-breadcrumb">
          <Link to="/dashboard/admin">Dashboard</Link><span className="wp-breadcrumb-sep">›</span>
          <span>Doanh nghiệp</span><span className="wp-breadcrumb-sep">›</span>
          <span className="wp-breadcrumb-current">{t('tat_ca_doanh_nghiep')}</span>
        </div>
        <div className="wp-page-header"><h1 className="wp-page-title">{t('tat_ca_doanh_nghiep')}</h1></div>

        <div className="wp-filter-tabs">
          {Object.entries(statusCounts).map(([key, count], idx) => (
            <React.Fragment key={key}>
              {idx > 0 && <span className="wp-filter-sep">|</span>}
              <button className={`wp-filter-tab ${filterStatus === key ? 'active' : ''}`} onClick={() => { setFilterStatus(key); setPage(1); }}>
                {statusFilterLabels[key]} <span className="count">({count})</span>
              </button>
            </React.Fragment>
          ))}
        </div>

        <div className="wp-table-top">
          <div className="wp-bulk-actions">
            <select className="wp-bulk-select"><option>{t('thao_tac_hang_loat')}</option><option>{t('phe_duyet')}</option><option>Từ chối</option><option>Xóa</option></select>
            <button className="wp-btn">Áp dụng</button>
          </div>
          <div className="wp-table-search">
            <input type="text" placeholder="Tìm công ty, MST..." value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} />
            <button className="wp-btn"><Search size={14} /> Tìm kiếm</button>
          </div>
        </div>

        <div className="wp-table-wrap">
          <table className="wp-table">
            <thead>
              <tr>
                <th style={{ width: 30 }}><input type="checkbox" checked={selectedIds.length === paginated.length && paginated.length > 0} onChange={toggleAll} /></th>
                <th>{t('ten_cong_ty')}</th><th>Mã số thuế</th><th>Ngành nghề</th><th>Email</th><th>{t('ngay_nop')}</th><th>Trạng thái</th>
              </tr>
            </thead>
            <tbody>
              {paginated.length === 0 ? (
                <tr><td colSpan={7} style={{ textAlign: 'center', padding: 30, color: 'var(--wp-text-muted)' }}>{t('khong_tim_thay_doanh_nghiep_nao_1')}</td></tr>
              ) : paginated.map(app => (
                <tr key={app.id}>
                  <td><input type="checkbox" checked={selectedIds.includes(app.id)} onChange={() => toggleOne(app.id)} /></td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div style={{ width: 36, height: 36, borderRadius: '50%', background: statusColor[app.status], color: '#fff', fontSize: 13, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        {app.companyName.charAt(0)}
                      </div>
                      <div>
                        <span className="wp-row-title">{app.companyName}</span>
                        <div style={{ fontSize: 11, color: 'var(--wp-text-muted)' }}>{app.contactName} • {app.phoneNumber}</div>
                        <div className="wp-row-actions">
                          <button onClick={() => navigate(`/dashboard/admin/verifications?tab=detail&id=${app.id}`)}>Xem</button>
                          <span className="sep">|</span>
                          {app.status === 'Pending' && (<><button style={{ color: '#00a32a' }} onClick={() => handleStatusChange(app.id, 'Invited')}>{t('phe_duyet')}</button><span className="sep">|</span><button className="delete" onClick={() => handleStatusChange(app.id, 'Rejected')}>Từ chối</button></>)}
                          {app.status === 'Invited' && (<><button style={{ color: '#2271b1' }} onClick={() => app.inviteToken && handleCopyLink(app.inviteToken)}>{copiedToken === app.inviteToken ? '✓ Đã copy' : 'Copy link'}</button><span className="sep">|</span><button className="delete" onClick={() => handleStatusChange(app.id, 'Pending')}>{t('thu_hoi')}</button></>)}
                          {app.status === 'Registered' && (<><span className="sep">|</span><button style={{ color: '#8c5ae2' }} onClick={() => handleStatusChange(app.id, 'Approved')}>{t('cap_tick_xanh')}</button></>)}
                          {(app.status === 'Rejected' || app.status === 'Approved') && (<><span className="sep">|</span><button className="delete" onClick={() => handleDelete(app.id)}>Xóa</button></>)}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td style={{ fontFamily: 'monospace', fontSize: 12 }}>{app.taxCode}</td>
                  <td>{app.industry}</td>
                  <td><a href={`mailto:${app.email}`} style={{ color: 'var(--wp-accent)', textDecoration: 'none' }}>{app.email}</a></td>
                  <td style={{ fontSize: 12, color: 'var(--wp-text-muted)', whiteSpace: 'nowrap' }}>{app.submittedDate}</td>
                  <td><span className={`wp-badge ${statusBadgeClass[app.status]}`}>{statusLabels[app.status]}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <WPPagination page={page} perPage={perPage} total={filtered.length} onPageChange={setPage} />
      </div>
    );
  }

  // ═══════════════════════════════════════════════════════════
  // TAB: Tokens
  // ═══════════════════════════════════════════════════════════
  const tokensData = applications.filter(a => a.inviteToken);
  return (
    <div>
      <div className="wp-breadcrumb">
        <Link to="/dashboard/admin">Dashboard</Link><span className="wp-breadcrumb-sep">›</span>
        <span>Doanh nghiệp</span><span className="wp-breadcrumb-sep">›</span>
        <span className="wp-breadcrumb-current">Link mời</span>
      </div>
      <div className="wp-page-header"><h1 className="wp-page-title">{t('quan_ly_link_moi')}</h1></div>
      <div className="wp-table-wrap">
        <table className="wp-table">
          <thead><tr><th>Doanh nghiệp</th><th>Token</th><th>{t('ngay_cap')}</th><th>{t('han_dung')}</th><th>Trạng thái</th></tr></thead>
          <tbody>
            {tokensData.length === 0 ? (
              <tr><td colSpan={5} style={{ textAlign: 'center', padding: 30, color: 'var(--wp-text-muted)' }}>{t('chua_co_link_moi_nao')}</td></tr>
            ) : tokensData.map(app => (
              <tr key={app.id}>
                <td>
                  <span className="wp-row-title">{app.companyName}</span>
                  <div className="wp-row-actions">
                    <button onClick={() => app.inviteToken && handleCopyLink(app.inviteToken)}>{copiedToken === app.inviteToken ? '✓ Đã copy' : 'Sao chép link'}</button>
                    <span className="sep">|</span><button onClick={() => alert(`Gửi email tới ${app.email}`)}>{t('gui_mail')}</button>
                    <span className="sep">|</span>
                    {app.status === 'Registered' && (<><button style={{ color: '#8c5ae2' }} onClick={() => handleStatusChange(app.id, 'Approved')}>{t('cap_tick_xanh')}</button><span className="sep">|</span></>)}
                    <button className="delete" onClick={() => handleStatusChange(app.id, 'Pending')}>{t('thu_hoi')}</button>
                  </div>
                </td>
                <td style={{ fontFamily: 'monospace', fontSize: 12, color: 'var(--wp-accent)' }}>{app.inviteToken}</td>
                <td style={{ fontSize: 12, color: 'var(--wp-text-muted)' }}>{app.submittedDate}</td>
                <td><div style={{ fontSize: 12 }}>{app.tokenExpiresAt}</div><div style={{ fontSize: 10, color: '#00a32a', fontWeight: 600 }}>{t('con_7_ngay')}</div></td>
                <td><span className={`wp-badge ${app.status === 'Registered' ? 'wp-badge-draft' : 'wp-badge-published'}`}>{app.status === 'Registered' ? 'Đã sử dụng' : 'Hoạt động'}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
