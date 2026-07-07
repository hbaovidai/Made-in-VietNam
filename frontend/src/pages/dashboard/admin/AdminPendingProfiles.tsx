import React, { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Search } from 'lucide-react';
import { PendingProfileDetail, ProfileStatus } from './PendingProfileDetail';

// ─── Types ───────────────────────────────────────────────────
type SupplierType = 'Manufacturer' | 'Trading Company' | 'Exporter' | 'Distributor';

interface PendingProfile {
  id: string;
  companyName: string;
  taxCode: string;
  supplierType: SupplierType;
  contactPerson: string;
  contactEmail: string;
  contactPhone: string;
  submittedAt: string;
  status: ProfileStatus;
}

// ─── Mock Data ───────────────────────────────────────────────
const mockProfiles: PendingProfile[] = [
  {
    id: 'PP-001', companyName: 'Công ty TNHH Sản Xuất Thành Đạt', taxCode: '0312345678',
    supplierType: 'Manufacturer', contactPerson: 'Nguyễn Văn An', contactEmail: 'an.nguyen@thanhdat.vn',
    contactPhone: '0901234567', submittedAt: '2026-06-25T10:30:00', status: 'PENDING',
  },
  {
    id: 'PP-002', companyName: 'Tổng Công ty Xuất Nhập Khẩu Miền Nam', taxCode: '0387654321',
    supplierType: 'Exporter', contactPerson: 'Trần Thị Bích', contactEmail: 'bich.tran@miennam-exp.vn',
    contactPhone: '0912345678', submittedAt: '2026-06-24T14:15:00', status: 'PENDING',
  },
  {
    id: 'PP-003', companyName: 'CTCP Thương Mại Phú Thịnh', taxCode: '0301122334',
    supplierType: 'Trading Company', contactPerson: 'Lê Hoàng Minh', contactEmail: 'minh.le@phuthinh.vn',
    contactPhone: '0923456789', submittedAt: '2026-06-23T09:00:00', status: 'NEED_MORE_INFO',
  },
  {
    id: 'PP-004', companyName: 'Nhà Máy Nhựa Đại Việt', taxCode: '0314455667',
    supplierType: 'Manufacturer', contactPerson: 'Phạm Quốc Hùng', contactEmail: 'hung.pham@daiviet-plastics.vn',
    contactPhone: '0934567890', submittedAt: '2026-06-22T16:45:00', status: 'REJECTED',
  },
  {
    id: 'PP-005', companyName: 'Công ty CP Phân Phối Toàn Cầu', taxCode: '0309988776',
    supplierType: 'Distributor', contactPerson: 'Vũ Thị Hương', contactEmail: 'huong.vu@globalvn.com',
    contactPhone: '0945678901', submittedAt: '2026-06-21T11:20:00', status: 'PENDING',
  },
  {
    id: 'PP-006', companyName: 'Công ty TNHH Dệt May Sài Gòn Star', taxCode: '0315566778',
    supplierType: 'Manufacturer', contactPerson: 'Đặng Minh Tuấn', contactEmail: 'tuan.dang@sgstar.vn',
    contactPhone: '0956789012', submittedAt: '2026-06-20T08:10:00', status: 'NEED_MORE_INFO',
  },
  {
    id: 'PP-007', companyName: 'Công ty XNK Gỗ Hòa Bình', taxCode: '0302233445',
    supplierType: 'Exporter', contactPerson: 'Bùi Thanh Sơn', contactEmail: 'son.bui@hoabinh-wood.vn',
    contactPhone: '0967890123', submittedAt: '2026-06-19T13:55:00', status: 'PENDING',
  },
];

// ─── Status config ───────────────────────────────────────────
const statusConfig: Record<ProfileStatus, { label: string; className: string }> = {
  PENDING:        { label: 'Chờ duyệt',       className: 'wp-badge-pending' },
  NEED_MORE_INFO: { label: 'Cần bổ sung',     className: 'wp-badge-info' },
  REJECTED:       { label: 'Đã từ chối',      className: 'wp-badge-rejected' },
};

const supplierTypes: SupplierType[] = ['Manufacturer', 'Trading Company', 'Exporter', 'Distributor'];

const toastStyle: React.CSSProperties = {
  position: 'fixed', bottom: 24, right: 24, zIndex: 9999, background: '#1d2327', color: '#fff',
  padding: '12px 20px', borderRadius: 10, fontSize: 13, fontWeight: 600,
  boxShadow: '0 4px 20px rgba(0,0,0,.18)', display: 'flex', alignItems: 'center', gap: 8,
};

// ═════════════════════════════════════════════════════════════
export function AdminPendingProfiles() {
  const { t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const params = new URLSearchParams(location.search);
  const tab = params.get('tab') || 'list';
  const detailId = params.get('id') || '';

  const [profiles, setProfiles] = useState<PendingProfile[]>(mockProfiles);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [bulkAction, setBulkAction] = useState('');
  const [toast, setToast] = useState('');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(''), 3000); };

  // ─── Actions ─────────────────────────────────────────────
  const handleApprove = (id: string) => {
    setProfiles(prev => prev.filter(p => p.id !== id));
    showToast('✅ Đã phê duyệt hồ sơ thành công');
  };
  const handleReject = (id: string) => {
    setProfiles(prev => prev.map(p => p.id === id ? { ...p, status: 'REJECTED' as ProfileStatus } : p));
    showToast('❌ Đã từ chối hồ sơ');
  };
  const handleRequestInfo = (id: string) => {
    setProfiles(prev => prev.map(p => p.id === id ? { ...p, status: 'NEED_MORE_INFO' as ProfileStatus } : p));
    showToast('📋 Đã gửi yêu cầu bổ sung hồ sơ');
  };

  const handleStatusChange = (id: string, status: ProfileStatus) => {
    if (status === 'REJECTED') handleReject(id);
    else if (status === 'NEED_MORE_INFO') handleRequestInfo(id);
    else handleApprove(id);
  };

  const toggleAll = () => {
    if (selectedIds.length === filtered.length) setSelectedIds([]);
    else setSelectedIds(filtered.map(p => p.id));
  };

  const toggleOne = (id: string) => {
    setSelectedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  const handleBulkAction = () => {
    if (!bulkAction) return alert('Vui lòng chọn một thao tác.');
    if (selectedIds.length === 0) return alert('Vui lòng chọn ít nhất một hồ sơ.');
    if (bulkAction === 'approve') {
      selectedIds.forEach(id => handleApprove(id));
    } else if (bulkAction === 'reject') {
      selectedIds.forEach(id => handleReject(id));
    } else if (bulkAction === 'request_info') {
      selectedIds.forEach(id => handleRequestInfo(id));
    }
    setSelectedIds([]);
    setBulkAction('');
  };

  // ─── Filter ──────────────────────────────────────────────
  const filtered = useMemo(() => {
    return profiles.filter(p => {
      if (filterStatus !== 'ALL' && p.status !== filterStatus) return false;
      if (search) {
        const term = search.toLowerCase();
        return (
          p.companyName.toLowerCase().includes(term) ||
          p.taxCode.includes(term) ||
          p.contactPerson.toLowerCase().includes(term)
        );
      }
      return true;
    });
  }, [profiles, search, filterStatus]);

  // ─── Counts ──────────────────────────────────────────────
  const counts = useMemo(() => ({
    ALL: profiles.length,
    PENDING: profiles.filter(p => p.status === 'PENDING').length,
    NEED_MORE_INFO: profiles.filter(p => p.status === 'NEED_MORE_INFO').length,
    REJECTED: profiles.filter(p => p.status === 'REJECTED').length,
  }), [profiles]);

  // ═══ TAB: Detail ═══════════════════════════════════════════
  if (tab === 'detail' && detailId) {
    return (
      <PendingProfileDetail
        profileId={detailId}
        onBack={() => navigate('/dashboard/admin/pending-profiles')}
        onStatusChange={handleStatusChange}
      />
    );
  }

  // ═══ TAB: List ═════════════════════════════════════════════
  return (
    <div>
      {/* Breadcrumb */}
      <div className="wp-breadcrumb">
        <Link to="/dashboard/admin">Dashboard</Link>
        <span className="wp-breadcrumb-sep">›</span>
        <span>Nhà cung cấp</span>
        <span className="wp-breadcrumb-sep">›</span>
        <span className="wp-breadcrumb-current">Hồ sơ cần duyệt</span>
      </div>

      {/* Page Header */}
      <div className="wp-page-header">
        <h1 className="wp-page-title">Hồ sơ cần duyệt</h1>
        <p style={{ color: '#646970', fontSize: 13, margin: '4px 0 0' }}>
          Quản lý các hồ sơ doanh nghiệp đang chờ xét duyệt để trở thành nhà cung cấp.
        </p>
      </div>

      {/* Status Tabs */}
      <div className="wp-filter-tabs">
        {(['ALL', 'PENDING', 'NEED_MORE_INFO', 'REJECTED'] as const).map((key, idx) => (
          <React.Fragment key={key}>
            {idx > 0 && <span className="wp-filter-sep">|</span>}
            <button
              className={`wp-filter-tab ${filterStatus === key ? 'active' : ''}`}
              onClick={() => setFilterStatus(key)}
            >
              {key === 'ALL' ? 'Tất cả' : statusConfig[key as ProfileStatus].label}
              {' '}<span className="count">({counts[key]})</span>
            </button>
          </React.Fragment>
        ))}
      </div>

      {/* Search + Bulk Actions */}
      <div className="wp-table-top">
        <div className="wp-bulk-actions">
          <select className="wp-bulk-select" value={bulkAction} onChange={e => setBulkAction(e.target.value)}>
            <option value="">{t('thao_tac_hang_loat')}</option>
            <option value="approve">Duyệt</option>
            <option value="reject">Từ chối</option>
            <option value="request_info">{t('yeu_cau_bo_sung')}</option>
          </select>
          <button className="wp-btn" onClick={handleBulkAction}>Áp dụng</button>
        </div>
        <form onSubmit={e => e.preventDefault()} className="wp-table-search">
          <input
            type="text"
            placeholder="Tìm công ty, MST, người LH..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          <button type="submit" className="wp-btn"><Search size={14} /> Tìm kiếm</button>
        </form>
      </div>

      {/* Table */}
      <div>
        <div className="wp-table-wrap">
          <table className="wp-table">
            <thead>
              <tr>
                <th style={{ width: 30 }}>
                  <input type="checkbox" checked={selectedIds.length === filtered.length && filtered.length > 0} onChange={toggleAll} />
                </th>
                <th>Tên công ty</th>
                <th>Mã số thuế</th>
                <th>{t('nguoi_lien_he')}</th>
                <th>Ngày gửi</th>
                <th>Trạng thái</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} style={{ textAlign: 'center', padding: 40, color: '#8c8f94' }}>
                    Không tìm thấy hồ sơ nào.
                  </td>
                </tr>
              ) : filtered.map(p => (
                <tr key={p.id}>
                  <td><input type="checkbox" checked={selectedIds.includes(p.id)} onChange={() => toggleOne(p.id)} /></td>
                  <td>
                    <span
                      className="wp-row-title"
                      onClick={() => navigate(`/dashboard/admin/pending-profiles?tab=detail&id=${p.id}`)}
                    >
                      {p.companyName}
                    </span>
                    <div className="wp-row-actions">
                      <button onClick={() => navigate(`/dashboard/admin/pending-profiles?tab=detail&id=${p.id}`)}>Xem hồ sơ</button>
                      {p.status !== 'REJECTED' && (
                        <>
                          <span className="sep">|</span>
                          <button style={{ color: '#00a32a' }} onClick={() => handleApprove(p.id)}>Duyệt</button>
                          <span className="sep">|</span>
                          <button className="delete" onClick={() => handleReject(p.id)}>Từ chối</button>
                          <span className="sep">|</span>
                          <button style={{ color: '#dba617' }} onClick={() => handleRequestInfo(p.id)}>{t('yeu_cau_bo_sung')}</button>
                        </>
                      )}
                    </div>
                  </td>
                  <td style={{ fontFamily: 'monospace', fontSize: 13 }}>{p.taxCode}</td>
                  <td>
                    <div style={{ fontSize: 13 }}>{p.contactPerson}</div>
                    <div style={{ fontSize: 11, color: '#8c8f94' }}>{p.contactEmail}</div>
                  </td>
                  <td style={{ fontSize: 12, color: '#646970', whiteSpace: 'nowrap' }}>
                    {new Date(p.submittedAt).toLocaleDateString('vi-VN')}
                    <div style={{ fontSize: 11, color: '#8c8f94' }}>
                      {new Date(p.submittedAt).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </td>
                  <td>
                    <span className={`wp-badge ${statusConfig[p.status].className}`}>
                      {statusConfig[p.status].label}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>


      {/* Toast */}
      {toast && <div style={toastStyle}>{toast}</div>}
    </div>
  );
}
