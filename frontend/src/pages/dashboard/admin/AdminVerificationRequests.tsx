import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Search } from 'lucide-react';

// ─── Types ───────────────────────────────────────────────────
type VerificationStatus = 'PENDING' | 'NEED_MORE_INFO' | 'APPROVED' | 'REJECTED';
type RequestType = 'MANUFACTURER' | 'EXPORTER';
type CurrentSupplierType = 'Trading Company' | 'Distributor' | 'Manufacturer' | 'Exporter';

interface VerificationRequest {
  id: string;
  companyName: string;
  requestType: RequestType;
  currentType: CurrentSupplierType;
  contactEmail: string;
  submittedAt: string;
  status: VerificationStatus;
  documents: string[];
}

// ─── Mock Data ───────────────────────────────────────────────
const mockRequests: VerificationRequest[] = [
  {
    id: 'VR-001', companyName: 'CTCP Thương Mại Phú Thịnh',
    requestType: 'MANUFACTURER', currentType: 'Trading Company',
    contactEmail: 'minh.le@phuthinh.vn', submittedAt: '2026-06-26T09:00:00',
    status: 'PENDING', documents: ['Giấy ĐKKD', 'Hình ảnh nhà xưởng', 'ISO 9001'],
  },
  {
    id: 'VR-002', companyName: 'Công ty TNHH Sản Xuất Thành Đạt',
    requestType: 'EXPORTER', currentType: 'Manufacturer',
    contactEmail: 'an.nguyen@thanhdat.vn', submittedAt: '2026-06-25T14:30:00',
    status: 'PENDING', documents: ['Giấy phép XNK', 'Hợp đồng xuất khẩu mẫu'],
  },
  {
    id: 'VR-003', companyName: 'Công ty CP Phân Phối Toàn Cầu',
    requestType: 'MANUFACTURER', currentType: 'Distributor',
    contactEmail: 'huong.vu@globalvn.com', submittedAt: '2026-06-24T11:15:00',
    status: 'NEED_MORE_INFO', documents: ['Giấy ĐKKD'],
  },
  {
    id: 'VR-004', companyName: 'Công ty XNK Gỗ Hòa Bình',
    requestType: 'EXPORTER', currentType: 'Trading Company',
    contactEmail: 'son.bui@hoabinh-wood.vn', submittedAt: '2026-06-23T16:00:00',
    status: 'APPROVED', documents: ['Giấy phép XNK', 'C/O mẫu', 'Hợp đồng ngoại thương'],
  },
  {
    id: 'VR-005', companyName: 'Nhà Máy Nhựa Đại Việt',
    requestType: 'EXPORTER', currentType: 'Manufacturer',
    contactEmail: 'hung.pham@daiviet-plastics.vn', submittedAt: '2026-06-22T08:45:00',
    status: 'REJECTED', documents: ['Giấy phép XNK (hết hạn)'],
  },
  {
    id: 'VR-006', companyName: 'Công ty TNHH Dệt May Sài Gòn Star',
    requestType: 'MANUFACTURER', currentType: 'Trading Company',
    contactEmail: 'tuan.dang@sgstar.vn', submittedAt: '2026-06-21T10:30:00',
    status: 'PENDING', documents: ['Giấy ĐKKD', 'Hình ảnh dây chuyền SX', 'Giấy CN ATTP'],
  },
];

// ─── Status config ───────────────────────────────────────────
const statusConfig: Record<VerificationStatus, { label: string; className: string }> = {
  PENDING:        { label: 'Chờ duyệt',       className: 'wp-badge-pending' },
  NEED_MORE_INFO: { label: 'Cần bổ sung',     className: 'wp-badge-info' },
  APPROVED:       { label: 'Đã duyệt',        className: 'wp-badge-approved' },
  REJECTED:       { label: 'Đã từ chối',      className: 'wp-badge-rejected' },
};

const requestTypeConfig: Record<RequestType, { label: string; bg: string; color: string; border: string }> = {
  MANUFACTURER: { label: 'Xác minh Nhà sản xuất', bg: '#e8f5e9', color: '#2e7d32', border: '#a5d6a7' },
  EXPORTER:     { label: 'Xác minh Nhà xuất khẩu', bg: '#e3f2fd', color: '#1565c0', border: '#90caf9' },
};

const toastStyle: React.CSSProperties = {
  position: 'fixed', bottom: 24, right: 24, zIndex: 9999, background: '#1d2327', color: '#fff',
  padding: '12px 20px', borderRadius: 10, fontSize: 13, fontWeight: 600,
  boxShadow: '0 4px 20px rgba(0,0,0,.18)', display: 'flex', alignItems: 'center', gap: 8,
};

// ═════════════════════════════════════════════════════════════
export function AdminVerificationRequests() {
  const [requests, setRequests] = useState<VerificationRequest[]>(mockRequests);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [bulkAction, setBulkAction] = useState('');
  const [toast, setToast] = useState('');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(''), 3000); };

  // ─── Actions ─────────────────────────────────────────────
  const handleApprove = (id: string) => {
    setRequests(prev => prev.map(r => r.id === id ? { ...r, status: 'APPROVED' as VerificationStatus } : r));
    showToast('✅ Đã phê duyệt xác minh thành công');
  };
  const handleReject = (id: string) => {
    setRequests(prev => prev.map(r => r.id === id ? { ...r, status: 'REJECTED' as VerificationStatus } : r));
    showToast('❌ Đã từ chối yêu cầu xác minh');
  };
  const handleRequestInfo = (id: string) => {
    setRequests(prev => prev.map(r => r.id === id ? { ...r, status: 'NEED_MORE_INFO' as VerificationStatus } : r));
    showToast('📋 Đã gửi yêu cầu bổ sung hồ sơ xác minh');
  };

  const toggleAll = () => {
    if (selectedIds.length === filtered.length) setSelectedIds([]);
    else setSelectedIds(filtered.map(r => r.id));
  };

  const toggleOne = (id: string) => {
    setSelectedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  const handleBulkAction = () => {
    if (!bulkAction) return alert('Vui lòng chọn một thao tác.');
    if (selectedIds.length === 0) return alert('Vui lòng chọn ít nhất một yêu cầu.');
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
    return requests.filter(r => {
      if (filterStatus !== 'ALL' && r.status !== filterStatus) return false;
      if (search) {
        const term = search.toLowerCase();
        return r.companyName.toLowerCase().includes(term) || r.contactEmail.toLowerCase().includes(term);
      }
      return true;
    });
  }, [requests, search, filterStatus]);

  // ─── Counts ──────────────────────────────────────────────
  const counts = useMemo(() => ({
    ALL: requests.length,
    PENDING: requests.filter(r => r.status === 'PENDING').length,
    NEED_MORE_INFO: requests.filter(r => r.status === 'NEED_MORE_INFO').length,
    APPROVED: requests.filter(r => r.status === 'APPROVED').length,
    REJECTED: requests.filter(r => r.status === 'REJECTED').length,
  }), [requests]);

  return (
    <div>
      {/* Breadcrumb */}
      <div className="wp-breadcrumb">
        <Link to="/dashboard/admin">Dashboard</Link>
        <span className="wp-breadcrumb-sep">›</span>
        <span>Nhà cung cấp</span>
        <span className="wp-breadcrumb-sep">›</span>
        <span className="wp-breadcrumb-current">Yêu cầu xác minh</span>
      </div>

      {/* Page Header */}
      <div className="wp-page-header">
        <h1 className="wp-page-title">Yêu cầu xác minh</h1>
        <p style={{ color: '#646970', fontSize: 13, margin: '4px 0 0' }}>
          Xét duyệt các yêu cầu xác minh nhà sản xuất hoặc nhà xuất khẩu từ nhà cung cấp.
        </p>
      </div>

      {/* Status Tabs */}
      <div className="wp-filter-tabs">
        {(['ALL', 'PENDING', 'NEED_MORE_INFO', 'APPROVED', 'REJECTED'] as const).map((key, idx) => (
          <React.Fragment key={key}>
            {idx > 0 && <span className="wp-filter-sep">|</span>}
            <button
              className={`wp-filter-tab ${filterStatus === key ? 'active' : ''}`}
              onClick={() => setFilterStatus(key)}
            >
              {key === 'ALL' ? 'Tất cả' : statusConfig[key as VerificationStatus].label}
              {' '}<span className="count">({counts[key]})</span>
            </button>
          </React.Fragment>
        ))}
      </div>

      {/* Search + Bulk Actions */}
      <div className="wp-table-top">
        <div className="wp-bulk-actions">
          <select className="wp-bulk-select" value={bulkAction} onChange={e => setBulkAction(e.target.value)}>
            <option value="">Thao tác hàng loạt</option>
            <option value="approve">Duyệt xác minh</option>
            <option value="reject">Từ chối</option>
            <option value="request_info">Yêu cầu bổ sung</option>
          </select>
          <button className="wp-btn" onClick={handleBulkAction}>Áp dụng</button>
        </div>
        <form onSubmit={e => e.preventDefault()} className="wp-table-search">
          <input
            type="text"
            placeholder="Tìm công ty, email..."
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
                <th>Loại yêu cầu</th>
                <th>Loại nhà cung cấp</th>
                <th>Ngày gửi</th>
                <th>Trạng thái</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} style={{ textAlign: 'center', padding: 40, color: '#8c8f94' }}>
                    Không tìm thấy yêu cầu xác minh nào.
                  </td>
                </tr>
              ) : filtered.map(r => {
                const rt = requestTypeConfig[r.requestType];
                return (
                  <tr key={r.id}>
                    <td><input type="checkbox" checked={selectedIds.includes(r.id)} onChange={() => toggleOne(r.id)} /></td>
                    <td>
                      <span className="wp-row-title">{r.companyName}</span>
                      <div className="wp-row-actions">
                        <button>Xem hồ sơ</button>
                        {(r.status === 'PENDING' || r.status === 'NEED_MORE_INFO') && (
                          <>
                            <span className="sep">|</span>
                            <button style={{ color: '#00a32a' }} onClick={() => handleApprove(r.id)}>Duyệt xác minh</button>
                            <span className="sep">|</span>
                            <button className="delete" onClick={() => handleReject(r.id)}>Từ chối</button>
                            <span className="sep">|</span>
                            <button style={{ color: '#dba617' }} onClick={() => handleRequestInfo(r.id)}>Yêu cầu bổ sung</button>
                          </>
                        )}
                      </div>
                    </td>
                    <td>
                      <span style={{
                        display: 'inline-block', fontSize: 11, fontWeight: 600, padding: '4px 10px',
                        borderRadius: 20, background: rt.bg, color: rt.color, border: `1px solid ${rt.border}`,
                        whiteSpace: 'nowrap',
                      }}>
                        {rt.label}
                      </span>
                    </td>
                    <td style={{ fontSize: 13 }}>{r.currentType}</td>
                    <td style={{ fontSize: 12, color: '#646970', whiteSpace: 'nowrap' }}>
                      {new Date(r.submittedAt).toLocaleDateString('vi-VN')}
                      <div style={{ fontSize: 11, color: '#8c8f94' }}>
                        {new Date(r.submittedAt).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </td>
                    <td>
                      <span className={`wp-badge ${statusConfig[r.status].className}`}>
                        {statusConfig[r.status].label}
                      </span>
                    </td>

                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>


      {/* Toast */}
      {toast && <div style={toastStyle}>{toast}</div>}
    </div>
  );
}
