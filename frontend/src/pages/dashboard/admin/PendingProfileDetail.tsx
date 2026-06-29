import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Building2, MapPin, User, Shield, FileText, Download, Eye, X } from 'lucide-react';

// ─── Types ───────────────────────────────────────────────────
export type ProfileStatus = 'PENDING' | 'NEED_MORE_INFO' | 'REJECTED';

export interface PendingProfileFull {
  id: string;
  companyName: string;
  taxCode: string;
  orgType: string;
  businessModel: string;
  province: string;
  district: string;
  ward: string;
  address: string;
  legalRepName: string;
  legalRepPhone: string;
  accountHolderName: string;
  accountHolderPhone: string;
  accountHolderEmail: string;
  accountHolderGovId: string;
  accountHolderPosition: string;
  submittedAt: string;
  lastUpdated: string;
  status: ProfileStatus;
  reviewedBy: string | null;
  documents: { name: string; type: string; uploaded: boolean }[];
}

// ─── Mock detail data ────────────────────────────────────────
export const mockProfileDetails: Record<string, PendingProfileFull> = {
  'PP-001': {
    id: 'PP-001', companyName: 'Công ty TNHH Sản Xuất Thành Đạt', taxCode: '0312345678',
    orgType: 'Công ty TNHH', businessModel: 'Nhà sản xuất (Manufacturer)',
    province: 'TP. Hồ Chí Minh', district: 'Quận Bình Tân', ward: 'Phường An Lạc A',
    address: '123 Đường Kinh Dương Vương',
    legalRepName: 'Nguyễn Văn An', legalRepPhone: '0901234567',
    accountHolderName: 'Nguyễn Văn An', accountHolderPhone: '0901234567',
    accountHolderEmail: 'an.nguyen@thanhdat.vn', accountHolderGovId: '079123456789',
    accountHolderPosition: 'Giám đốc',
    submittedAt: '2026-06-25T10:30:00', lastUpdated: '2026-06-25T10:30:00',
    status: 'PENDING', reviewedBy: null,
    documents: [
      { name: 'Giấy phép ĐKKD - Thành Đạt.pdf', type: 'PDF', uploaded: true },
      { name: 'CCCD_NguyenVanAn_mat_truoc.jpg', type: 'Image', uploaded: true },
      { name: 'CCCD_NguyenVanAn_mat_sau.jpg', type: 'Image', uploaded: true },
    ],
  },
  'PP-002': {
    id: 'PP-002', companyName: 'Tổng Công ty Xuất Nhập Khẩu Miền Nam', taxCode: '0387654321',
    orgType: 'Công ty Cổ phần', businessModel: 'Nhà xuất khẩu (Exporter)',
    province: 'TP. Hồ Chí Minh', district: 'Quận 1', ward: 'Phường Bến Nghé',
    address: '45 Đường Lê Lợi',
    legalRepName: 'Trần Thị Bích', legalRepPhone: '0912345678',
    accountHolderName: 'Lê Minh Hoàng', accountHolderPhone: '0978123456',
    accountHolderEmail: 'bich.tran@miennam-exp.vn', accountHolderGovId: '052987654321',
    accountHolderPosition: 'Trưởng phòng Kinh doanh',
    submittedAt: '2026-06-24T14:15:00', lastUpdated: '2026-06-24T14:15:00',
    status: 'PENDING', reviewedBy: null,
    documents: [
      { name: 'ĐKKD_MienNam_Export.pdf', type: 'PDF', uploaded: true },
      { name: 'Giay_uy_quyen_LeMinh.pdf', type: 'PDF', uploaded: true },
      { name: 'CCCD_LeMinh_Hoang.jpg', type: 'Image', uploaded: true },
    ],
  },
  'PP-003': {
    id: 'PP-003', companyName: 'CTCP Thương Mại Phú Thịnh', taxCode: '0301122334',
    orgType: 'Công ty Cổ phần', businessModel: 'Thương mại (Trading Company)',
    province: 'Hà Nội', district: 'Quận Hoàn Kiếm', ward: 'Phường Tràng Tiền',
    address: '78 Đường Hàng Bài',
    legalRepName: 'Lê Hoàng Minh', legalRepPhone: '0923456789',
    accountHolderName: 'Lê Hoàng Minh', accountHolderPhone: '0923456789',
    accountHolderEmail: 'minh.le@phuthinh.vn', accountHolderGovId: '001234567890',
    accountHolderPosition: 'Tổng Giám đốc',
    submittedAt: '2026-06-23T09:00:00', lastUpdated: '2026-06-26T11:00:00',
    status: 'NEED_MORE_INFO', reviewedBy: 'Admin Hệ thống',
    documents: [
      { name: 'ĐKKD_PhuThinh.pdf', type: 'PDF', uploaded: true },
      { name: 'CCCD_mat_truoc.jpg', type: 'Image', uploaded: true },
    ],
  },
  'PP-005': {
    id: 'PP-005', companyName: 'Công ty CP Phân Phối Toàn Cầu', taxCode: '0309988776',
    orgType: 'Công ty Cổ phần', businessModel: 'Nhà phân phối (Distributor)',
    province: 'Đà Nẵng', district: 'Quận Hải Châu', ward: 'Phường Thạch Thang',
    address: '56 Đường Trần Phú',
    legalRepName: 'Vũ Thị Hương', legalRepPhone: '0945678901',
    accountHolderName: 'Vũ Thị Hương', accountHolderPhone: '0945678901',
    accountHolderEmail: 'huong.vu@globalvn.com', accountHolderGovId: '048765432109',
    accountHolderPosition: 'Giám đốc',
    submittedAt: '2026-06-21T11:20:00', lastUpdated: '2026-06-21T11:20:00',
    status: 'PENDING', reviewedBy: null,
    documents: [
      { name: 'ĐKKD_ToanCau.pdf', type: 'PDF', uploaded: true },
      { name: 'CCCD_VuThiHuong.jpg', type: 'Image', uploaded: true },
    ],
  },
};

// ─── Status config ───────────────────────────────────────────
const statusCfg: Record<ProfileStatus, { label: string; className: string; color: string }> = {
  PENDING:        { label: 'Chờ duyệt',   className: 'wp-badge-pending',  color: '#996800' },
  NEED_MORE_INFO: { label: 'Cần bổ sung', className: 'wp-badge-info',     color: '#1565c0' },
  REJECTED:       { label: 'Đã từ chối',  className: 'wp-badge-rejected', color: '#d63638' },
};

// ─── Styles ──────────────────────────────────────────────────
const s = {
  card: { background: '#fff', border: '1px solid #e2e4e7', borderRadius: 4, marginBottom: 16, boxShadow: '0 1px 1px rgba(0,0,0,.04)' } as React.CSSProperties,
  cardHead: { padding: '10px 16px', borderBottom: '1px solid #e2e4e7', fontSize: 14, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 8 } as React.CSSProperties,
  cardBody: { padding: 16 } as React.CSSProperties,
  row: { display: 'flex', padding: '8px 0', borderBottom: '1px solid #f5f5f5', fontSize: 13 } as React.CSSProperties,
  rowLast: { display: 'flex', padding: '8px 0', fontSize: 13 } as React.CSSProperties,
  label: { width: 200, flexShrink: 0, color: '#646970', fontWeight: 500 } as React.CSSProperties,
  value: { flex: 1, color: '#1e1e1e', fontWeight: 400 } as React.CSSProperties,
  btn: (bg: string, color: string) => ({
    display: 'inline-flex', alignItems: 'center', gap: 6, padding: '8px 16px', fontSize: 13,
    fontWeight: 600, border: 'none', borderRadius: 4, cursor: 'pointer', color, background: bg,
    transition: 'opacity .15s', width: '100%', justifyContent: 'center',
  } as React.CSSProperties),
  fileCard: {
    display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 14px',
    border: '1px solid #e2e4e7', borderRadius: 6, background: '#f9f9f9', marginBottom: 8,
  } as React.CSSProperties,
  overlay: {
    position: 'fixed' as const, inset: 0, background: 'rgba(0,0,0,.45)', zIndex: 10000,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
  },
  modal: {
    background: '#fff', borderRadius: 8, padding: 24, width: 460, maxWidth: '90vw',
    boxShadow: '0 12px 40px rgba(0,0,0,.2)',
  } as React.CSSProperties,
  textarea: {
    width: '100%', minHeight: 80, border: '1px solid #dcdcde', borderRadius: 4, padding: 10,
    fontSize: 13, resize: 'vertical' as const, outline: 'none', fontFamily: 'inherit', marginTop: 8,
  } as React.CSSProperties,
  toast: {
    position: 'fixed' as const, bottom: 24, right: 24, zIndex: 11000, background: '#1d2327',
    color: '#fff', padding: '12px 20px', borderRadius: 10, fontSize: 13, fontWeight: 600,
    boxShadow: '0 4px 20px rgba(0,0,0,.18)', display: 'flex', alignItems: 'center', gap: 8,
  },
};

// ─── Field Row helper ────────────────────────────────────────
const Field = ({ label, value, last }: { label: string; value: string; last?: boolean }) => (
  <div style={last ? s.rowLast : s.row}>
    <div style={s.label}>{label}</div>
    <div style={s.value}>{value}</div>
  </div>
);

// ═════════════════════════════════════════════════════════════
interface Props {
  profileId: string;
  onBack: () => void;
  onStatusChange: (id: string, status: ProfileStatus) => void;
}

export function PendingProfileDetail({ profileId, onBack, onStatusChange }: Props) {
  const profile = mockProfileDetails[profileId];
  const [adminNote, setAdminNote] = useState('');
  const [toast, setToast] = useState('');
  const [modal, setModal] = useState<'approve' | 'reject' | 'info' | null>(null);
  const [modalText, setModalText] = useState('');

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(''), 3000); };

  if (!profile) {
    return (
      <div style={{ padding: 40, textAlign: 'center', color: '#646970' }}>
        <p>Không tìm thấy hồ sơ với ID: {profileId}</p>
        <button onClick={onBack} style={s.btn('#2271b1', '#fff')}>← Quay lại danh sách</button>
      </div>
    );
  }

  const st = statusCfg[profile.status];

  const handleConfirm = () => {
    if (modal === 'approve') {
      onStatusChange(profileId, 'PENDING'); // will be removed from list
      showToast('✅ Đã phê duyệt hồ sơ thành công');
    } else if (modal === 'reject') {
      if (!modalText.trim()) return alert('Vui lòng nhập lý do từ chối.');
      onStatusChange(profileId, 'REJECTED');
      showToast('❌ Đã từ chối hồ sơ');
    } else if (modal === 'info') {
      if (!modalText.trim()) return alert('Vui lòng nhập nội dung cần bổ sung.');
      onStatusChange(profileId, 'NEED_MORE_INFO');
      showToast('📋 Đã gửi yêu cầu bổ sung');
    }
    setModal(null);
    setModalText('');
    setTimeout(onBack, 800);
  };

  const modalConfig = {
    approve: { title: 'Xác nhận duyệt hồ sơ', desc: `Bạn có chắc chắn muốn phê duyệt hồ sơ của "${profile.companyName}"? Doanh nghiệp sẽ được kích hoạt trên sàn.`, needText: false, placeholder: '', btnLabel: 'Xác nhận duyệt', btnColor: '#00a32a' },
    reject: { title: 'Từ chối hồ sơ', desc: `Nhập lý do từ chối hồ sơ của "${profile.companyName}":`, needText: true, placeholder: 'VD: Giấy ĐKKD không hợp lệ, MST không khớp...', btnLabel: 'Xác nhận từ chối', btnColor: '#d63638' },
    info: { title: 'Yêu cầu bổ sung hồ sơ', desc: `Nhập nội dung cần bổ sung cho "${profile.companyName}":`, needText: true, placeholder: 'VD: Cần bổ sung ảnh CCCD mặt sau, giấy ủy quyền...', btnLabel: 'Gửi yêu cầu bổ sung', btnColor: '#dba617' },
  };

  return (
    <div>
      {/* Breadcrumb */}
      <div className="wp-breadcrumb">
        <Link to="/dashboard/admin">Dashboard</Link>
        <span className="wp-breadcrumb-sep">›</span>
        <Link to="/dashboard/admin/pending-profiles">Hồ sơ cần duyệt</Link>
        <span className="wp-breadcrumb-sep">›</span>
        <span className="wp-breadcrumb-current">Chi tiết hồ sơ</span>
      </div>

      {/* Header */}
      <div className="wp-page-header" style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <button onClick={onBack} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--wp-accent)', display: 'flex' }}>
          <ArrowLeft size={20} />
        </button>
        <div style={{ flex: 1 }}>
          <h1 className="wp-page-title" style={{ margin: 0 }}>Chi tiết hồ sơ</h1>
        </div>
      </div>

      {/* Header Card */}
      <div style={{ ...s.card, padding: '16px 20px', display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
        <div>
          <div style={{ fontSize: 17, fontWeight: 700, color: '#1e1e1e' }}>{profile.companyName}</div>
          <div style={{ fontSize: 12, color: '#8c8f94', marginTop: 4 }}>
            Mã hồ sơ: <strong style={{ color: '#646970' }}>{profile.id}</strong>
            <span style={{ margin: '0 8px' }}>•</span>
            Ngày gửi: {new Date(profile.submittedAt).toLocaleDateString('vi-VN')}
            <span style={{ margin: '0 8px' }}>•</span>
            <span className={`wp-badge ${st.className}`}>{st.label}</span>
          </div>
        </div>
      </div>

      {/* 2-column layout */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 16, alignItems: 'start' }}>

        {/* ═══ LEFT COLUMN ═══ */}
        <div>
          {/* 1. Thông tin doanh nghiệp */}
          <div style={s.card}>
            <div style={s.cardHead}><Building2 size={16} color="#2271b1" /> Thông tin doanh nghiệp</div>
            <div style={s.cardBody}>
              <Field label="Tên doanh nghiệp" value={profile.companyName} />
              <Field label="Mã số thuế" value={profile.taxCode} />
              <Field label="Loại hình tổ chức" value={profile.orgType} />
              <Field label="Mô hình hoạt động" value={profile.businessModel} last />
            </div>
          </div>

          {/* 2. Địa chỉ trụ sở */}
          <div style={s.card}>
            <div style={s.cardHead}><MapPin size={16} color="#2271b1" /> Địa chỉ trụ sở chính</div>
            <div style={s.cardBody}>
              <Field label="Tỉnh/Thành phố" value={profile.province} />
              <Field label="Quận/Huyện" value={profile.district} />
              <Field label="Phường/Xã" value={profile.ward} />
              <Field label="Số nhà / Tên đường" value={profile.address} last />
            </div>
          </div>

          {/* 3. Người đại diện pháp lý */}
          <div style={s.card}>
            <div style={s.cardHead}><User size={16} color="#2271b1" /> Người đại diện pháp lý</div>
            <div style={s.cardBody}>
              <Field label="Họ và tên" value={profile.legalRepName} />
              <Field label="Số điện thoại" value={profile.legalRepPhone} last />
            </div>
          </div>

          {/* 4. Người kiểm soát tài khoản */}
          <div style={s.card}>
            <div style={s.cardHead}><Shield size={16} color="#2271b1" /> Người kiểm soát tài khoản</div>
            <div style={s.cardBody}>
              <Field label="Họ và tên" value={profile.accountHolderName} />
              <Field label="Số điện thoại" value={profile.accountHolderPhone} />
              <Field label="Email" value={profile.accountHolderEmail} />
              <Field label="CCCD/Passport" value={profile.accountHolderGovId} />
              <Field label="Chức vụ" value={profile.accountHolderPosition} last />
            </div>
          </div>

          {/* 5. Hồ sơ đính kèm */}
          <div style={s.card}>
            <div style={s.cardHead}><FileText size={16} color="#2271b1" /> Hồ sơ đính kèm</div>
            <div style={s.cardBody}>
              {profile.documents.map((doc, i) => (
                <div key={i} style={s.fileCard}>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: '#1e1e1e' }}>{doc.name}</div>
                    <div style={{ fontSize: 11, color: '#8c8f94', marginTop: 2 }}>
                      Loại: {doc.type}
                      <span style={{ margin: '0 6px' }}>•</span>
                      <span style={{ color: doc.uploaded ? '#00a32a' : '#d63638' }}>
                        {doc.uploaded ? '✓ Đã tải lên' : '✗ Chưa tải lên'}
                      </span>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: 6 }}>
                    <button style={{ ...s.btn('#f0f6ff', '#2271b1'), width: 'auto', padding: '5px 10px', fontSize: 12, border: '1px solid #c3d9f0' }}>
                      <Eye size={12} /> Xem
                    </button>
                    <button style={{ ...s.btn('#f6f7f7', '#646970'), width: 'auto', padding: '5px 10px', fontSize: 12, border: '1px solid #dcdcde' }}>
                      <Download size={12} /> Tải
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ═══ RIGHT COLUMN ═══ */}
        <div>
          {/* Review Summary */}
          <div style={s.card}>
            <div style={s.cardHead}>Tổng quan xét duyệt</div>
            <div style={s.cardBody}>
              <Field label="Trạng thái" value={st.label} />
              <Field label="Ngày gửi" value={new Date(profile.submittedAt).toLocaleDateString('vi-VN') + ' ' + new Date(profile.submittedAt).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })} />
              <Field label="Cập nhật cuối" value={new Date(profile.lastUpdated).toLocaleDateString('vi-VN') + ' ' + new Date(profile.lastUpdated).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })} />
              <Field label="Người duyệt" value={profile.reviewedBy || '— Chưa có —'} last />
            </div>
          </div>

          {/* Admin Review */}
          <div style={s.card}>
            <div style={s.cardHead}>Ghi chú nội bộ</div>
            <div style={s.cardBody}>
              <textarea
                placeholder="Nhập ghi chú nội bộ cho hồ sơ này..."
                value={adminNote}
                onChange={e => setAdminNote(e.target.value)}
                style={s.textarea}
              />

            </div>
          </div>
        </div>
      </div>

      {/* ═══ ACTION BUTTONS ═══ */}
      {profile.status !== 'REJECTED' && (
        <div style={{ display: 'flex', gap: 8, marginTop: 16 }}>
          <button className="wp-btn wp-btn-primary" onClick={() => setModal('approve')}>Duyệt</button>
          <button className="wp-btn wp-btn-danger" onClick={() => setModal('reject')}>Từ chối</button>
          <button className="wp-btn" onClick={() => setModal('info')}>Bổ sung</button>
        </div>
      )}

      {/* ═══ CONFIRM MODAL ═══ */}
      {modal && (
        <div style={s.overlay as React.CSSProperties}>
          <div style={s.modal}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700 }}>{modalConfig[modal].title}</h3>
              <button onClick={() => { setModal(null); setModalText(''); }} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#8c8f94' }}>
                <X size={18} />
              </button>
            </div>
            <p style={{ fontSize: 13, color: '#646970', margin: '0 0 12px' }}>{modalConfig[modal].desc}</p>
            {modalConfig[modal].needText && (
              <textarea
                value={modalText}
                onChange={e => setModalText(e.target.value)}
                placeholder={modalConfig[modal].placeholder}
                style={s.textarea}
                autoFocus
              />
            )}
            <div style={{ display: 'flex', gap: 8, marginTop: 16, justifyContent: 'flex-end' }}>
              <button onClick={() => { setModal(null); setModalText(''); }} style={{ ...s.btn('#f6f7f7', '#646970'), width: 'auto', border: '1px solid #dcdcde' }}>
                Hủy
              </button>
              <button onClick={handleConfirm} style={{ ...s.btn(modalConfig[modal].btnColor, '#fff'), width: 'auto' }}>
                {modalConfig[modal].btnLabel}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast */}
      {toast && <div style={s.toast}>{toast}</div>}
    </div>
  );
}
