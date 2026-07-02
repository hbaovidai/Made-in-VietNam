import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ExternalLink, CheckCircle, ArrowLeft, X } from 'lucide-react';
import { BusinessType, SupplierStatus, SupplierType } from '@/src/lib/enums';
import { api } from '@/src/lib/api';

function attrBox( {  } ) {
  return (
    <>
    </>
  );
}


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
  onReject: (id: string, reason: string) => void;
  onDelete: (id: string) => void;
  onBack: () => void;
}

// ─── Styles ──────────────────────────────────────────────────
const card: React.CSSProperties = {
  background: '#fff', border: '0.5px solid #dcdcde', borderRadius: 12, padding: 16, marginBottom: 16,
};
const label: React.CSSProperties = {
  fontSize: 11, textTransform: 'uppercase', color: '#8c8f94', letterSpacing: '0.5px', marginBottom: 2, fontWeight: 600,
};
const value: React.CSSProperties = { fontSize: 14, color: '#1d2327', marginBottom: 12 };
const grid2: React.CSSProperties = { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 24px' };
const badge: React.CSSProperties = {
  display: 'inline-block', background: '#e6f6ee', color: '#00713a', border: '1px solid #b8e6cc',
  borderRadius: 20, padding: '3px 10px', fontSize: 12, fontWeight: 600, marginRight: 6, marginBottom: 6,
};

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

  const handleSaveNotes = () => { setNotesSaved(true); setTimeout(() => setNotesSaved(false), 2000); };

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

      <div className="wp-page-header" style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <button onClick={onBack} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--wp-accent)', display: 'flex' }}>
          <ArrowLeft size={20} />
        </button>
        <h1 className="wp-page-title" style={{ margin: 0 }}>Chi tiết hồ sơ xác minh</h1>
      </div>

      {/* ═══ 2-column layout ═══ */}
      <div style={{ display: 'grid', gridTemplateColumns: '65% 35%', gap: 20, alignItems: 'start' }}>

        {/* ─── CỘT TRÁI ─── */}
        <div>
          {/* Card 1: Thông tin doanh nghiệp */}
          <div style={card}>
            <h3 style={{ fontSize: 14, fontWeight: 700, color: '#1d2327', borderBottom: '1px solid #f0f0f1', paddingBottom: 10, marginBottom: 14 }}>
              Thông tin doanh nghiệp
            </h3>
            <div style={grid2}>
              <div><div style={label}>TÊN CÔNG TY</div><div style={value}>{profile.companyName}</div></div>
              <div><div style={label}>MÃ SỐ THUẾ</div><div style={{ ...value, fontFamily: 'monospace' }}>{profile.taxCode}</div></div>
              {/* <div><div style={label}>LOẠI HÌNH DOANH NGHIỆP</div><div style={value}>{profile.companyType}</div></div> */}
              <div><div style={label}>ĐỊA CHỈ</div><div style={value}>{address}</div></div>
              <div><div style={label}>TỈNH / THÀNH PHỐ</div><div style={value}>{profile.province}</div></div>
              {profile.website && (
                <div style={{ gridColumn: '1 / -1' }}>
                  <div style={label}>WEBSITE</div>
                  <div style={value}><a href={profile.website} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--wp-accent)' }}>{profile.website}</a></div>
                </div>
              )}
            </div>
          </div>

          {/* Card 2: Người đại diện */}
          <div style={card}>
            <h3 style={{ fontSize: 14, fontWeight: 700, color: '#1d2327', borderBottom: '1px solid #f0f0f1', paddingBottom: 10, marginBottom: 14 }}>
              Người đại diện pháp luật
            </h3>
            <div style={grid2}>
              <div><div style={label}>HỌ VÀ TÊN</div><div style={value}>{profile.repName}</div></div>
              <div><div style={label}>CHỨC DANH</div><div style={value}>{profile.repTitle}</div></div>
              <div><div style={label}>SỐ CCCD</div><div style={{ ...value, fontFamily: 'monospace' }}>{profile.repIdCard}</div></div>
              <div><div style={label}>EMAIL</div><div style={value}><a href={`mailto:${profile.repEmail}`} style={{ color: 'var(--wp-accent)', textDecoration: 'none' }}>{profile.repEmail}</a></div></div>
              <div><div style={label}>SỐ ĐIỆN THOẠI</div><div style={value}><a href={`tel:${profile.repPhone}`} style={{ color: 'var(--wp-accent)', textDecoration: 'none' }}>{profile.repPhone}</a></div></div>
            </div>
          </div>

          {/* Card 3: Thông tin kinh doanh */}
          <div style={card}>
            <h3 style={{ fontSize: 14, fontWeight: 700, color: '#1d2327', borderBottom: '1px solid #f0f0f1', paddingBottom: 10, marginBottom: 14 }}>
              Thông tin kinh doanh
            </h3>

            <div style={label}>LĨNH VỰC KINH DOANH</div>
            <div style={{ marginBottom: 14 }}>
              {profile.industry.map(i => <span key={i} style={badge}>{i}</span>)}
            </div>

            <div style={label}>SẢN PHẨM / DỊCH VỤ CHÍNH</div>
            <div style={{ ...value, lineHeight: 1.6 }}>{profile.products}</div>

            <div style={grid2}>
              <div>
                <div style={label}>KINH NGHIỆM XUẤT KHẨU</div>
                <div style={value}>
                  <span style={{ ...badge, background: profile.exportExperience ? '#e6f6ee' : '#f0f0f1', color: profile.exportExperience ? '#00713a' : '#646970', border: profile.exportExperience ? '1px solid #b8e6cc' : '1px solid #dcdcde' }}>
                    {profile.exportExperience ? 'Có' : 'Không'}
                  </span>
                </div>
              </div>
              {profile.exportMarkets && (
                <div><div style={label}>THỊ TRƯỜNG XUẤT KHẨU</div><div style={value}>{profile.exportMarkets}</div></div>
              )}
              <div><div style={label}>DOANH THU HÀNG NĂM</div><div style={value}>{profile.annualRevenue}</div></div>
              <div><div style={label}>SỐ LƯỢNG NHÂN VIÊN</div><div style={value}>{profile.employeeCount}</div></div>
            </div>
          </div>

          {/* Card 4: Hồ sơ tài liệu */}
          <div style={card}>
            <h3 style={{ fontSize: 14, fontWeight: 700, color: '#1d2327', borderBottom: '1px solid #f0f0f1', paddingBottom: 10, marginBottom: 14 }}>
              Hồ sơ tài liệu
            </h3>
            <a
              href={profile.driveLink} target="_blank" rel="noopener noreferrer"
              style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                background: '#e6f6ee', color: '#00713a', border: '1px solid #b8e6cc',
                borderRadius: 8, padding: '10px 16px', fontWeight: 700, fontSize: 13,
                textDecoration: 'none', marginBottom: 16, transition: 'background .15s',
              }}
              onMouseOver={e => (e.currentTarget.style.background = '#d0f0dd')}
              onMouseOut={e => (e.currentTarget.style.background = '#e6f6ee')}
            >
              <ExternalLink size={16} /> Mở hồ sơ trên Google Drive
            </a>

            <div style={label}>DANH SÁCH TÀI LIỆU ĐÃ NỘP</div>
            <ul style={{ listStyle: 'none', padding: 0, margin: '8px 0 14px' }}>
              {profile.documentList.map(doc => (
                <li key={doc} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '5px 0', fontSize: 13, color: '#1d2327' }}>
                  <CheckCircle size={15} style={{ color: '#00a32a', flexShrink: 0 }} /> {doc}
                </li>
              ))}
            </ul>
            <div style={{ background: '#f6f7f7', borderRadius: 6, padding: '10px 12px', fontSize: 11, color: '#646970', lineHeight: 1.6 }}>
              Tài liệu được doanh nghiệp tự tải lên Google Drive và cung cấp đường dẫn.<br />
              Admin cần truy cập thư mục Drive để kiểm tra hồ sơ thực tế.
            </div>
          </div>
        </div>

        {/* ─── CỘT PHẢI ─── */}
        <div>
          {/* Trạng thái */}
          <div style={card}>
            <h3 style={{ fontSize: 14, fontWeight: 700, color: '#1d2327', borderBottom: '1px solid #f0f0f1', paddingBottom: 10, marginBottom: 14 }}>
              Trạng thái hồ sơ
            </h3>
            <div style={{ textAlign: 'center', marginBottom: 14 }}>
              <span style={{ display: 'inline-block', background: st.bg, color: st.color, border: `1px solid ${st.border}`, borderRadius: 20, padding: '6px 18px', fontSize: 13, fontWeight: 700 }}>
                {st.label}
              </span>
            </div>
            <div style={grid2}>
              <div><div style={label}>NGÀY GỬI</div><div style={{ fontSize: 13, color: '#1d2327', marginBottom: 8 }}>{new Date(profile.submittedAt).toLocaleDateString('vi-VN')}</div></div>
              <div><div style={label}>GIỜ GỬI</div><div style={{ fontSize: 13, color: '#1d2327', marginBottom: 8 }}>{new Date(profile.submittedAt).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}</div></div>
              <div><div style={label}>NGUỒN GỬI</div><div style={{ fontSize: 13, color: '#1d2327', marginBottom: 8 }}>Landing Page</div></div>
              <div><div style={label}>ĐỊA CHỈ IP</div><div style={{ fontSize: 13, color: '#1d2327', fontFamily: 'monospace' }}>14.161.12.34</div></div>
            </div>
          </div>

          {/* Quyết định — chỉ hiện khi pending */}
          {profile.status === SupplierStatus.VERIFIED && (
            <div style={card}>
              <h3 style={{ fontSize: 14, fontWeight: 700, color: '#1d2327', borderBottom: '1px solid #f0f0f1', paddingBottom: 10, marginBottom: 14 }}>
                Quyết định
              </h3>
              <button
                onClick={() => setShowApproveModal(true)}
                style={{ width: '100%', padding: '10px 0', background: '#00a32a', color: '#fff', border: 'none', borderRadius: 6, fontWeight: 700, fontSize: 13, cursor: 'pointer', marginBottom: 8 }}
              >
                Duyệt & Cấp link mời
              </button>

              {!showRejectBox ? (
                <button
                  onClick={() => setShowRejectBox(true)}
                  style={{ width: '100%', padding: '10px 0', background: '#fff', color: '#d63638', border: '1px solid #d63638', borderRadius: 6, fontWeight: 700, fontSize: 13, cursor: 'pointer', marginBottom: 8 }}
                >
                  Từ chối
                </button>
              ) : (
                <div style={{ background: '#fce4e4', border: '1px solid #f1a7a7', borderRadius: 8, padding: 12, marginBottom: 8 }}>
                  <textarea
                    value={rejectReason}
                    onChange={e => setRejectReason(e.target.value)}
                    placeholder="Lý do từ chối (sẽ gửi email thông báo cho doanh nghiệp)"
                    rows={3}
                    style={{ width: '100%', border: '1px solid #f1a7a7', borderRadius: 6, padding: 8, fontSize: 12, resize: 'none', outline: 'none', boxSizing: 'border-box' }}
                  />
                  <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
                    <button
                      onClick={() => { if (rejectReason.trim()) { onReject(profile.id, rejectReason); setShowRejectBox(false); } }}
                      disabled={!rejectReason.trim()}
                      style={{ flex: 1, padding: '8px 0', background: rejectReason.trim() ? '#d63638' : '#dcdcde', color: '#fff', border: 'none', borderRadius: 6, fontWeight: 700, fontSize: 12, cursor: rejectReason.trim() ? 'pointer' : 'not-allowed' }}
                    >
                      Xác nhận từ chối
                    </button>
                    <button
                      onClick={() => { setShowRejectBox(false); setRejectReason(''); }}
                      style={{ flex: 1, padding: '8px 0', background: '#f0f0f1', color: '#646970', border: 'none', borderRadius: 6, fontWeight: 600, fontSize: 12, cursor: 'pointer' }}
                    >
                      Hủy
                    </button>
                  </div>
                </div>
              )}

              <button
                onClick={() => onDelete(profile.id)}
                style={{ width: '100%', padding: '10px 0', background: '#f0f0f1', color: '#646970', border: 'none', borderRadius: 6, fontWeight: 600, fontSize: 13, cursor: 'pointer' }}
              >
                Xóa hồ sơ
              </button>
            </div>
          )}

          {/* Ghi chú nội bộ */}
          <div style={card}>
            {/*
            <h3 style={{ fontSize: 14, fontWeight: 700, color: '#1d2327', borderBottom: '1px solid #f0f0f1', paddingBottom: 10, marginBottom: 14 }}>
              Ghi chú nội bộ
            </h3>
            <textarea
              value={localNotes}
              onChange={e => setLocalNotes(e.target.value)}
              placeholder="Ghi chú nội bộ (không hiển thị cho doanh nghiệp)"
              rows={4}
              style={{ width: '100%', border: '1px solid #dcdcde', borderRadius: 6, padding: 10, fontSize: 12, resize: 'vertical', outline: 'none', boxSizing: 'border-box' }}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 8 }}>
              {notesSaved
                ? <span style={{ fontSize: 11, color: '#00a32a', fontWeight: 600 }}>✓ Đã lưu lúc {new Date().toLocaleString('vi-VN')}</span>
                : <span style={{ fontSize: 11, color: '#8c8f94' }}>{profile.notes ? `Lưu lần cuối: ${new Date().toLocaleDateString('vi-VN')} ${new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}` : ''}</span>
              }
              <button onClick={handleSaveNotes} className="wp-btn" style={{ fontSize: 12 }}>Lưu ghi chú</button>
            </div>
            */}

          </div>
        </div>
      </div>

      {/* ═══ Modal xác nhận duyệt ═══ */}
      {showApproveModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,.45)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999 }}>
          <div style={{ background: '#fff', borderRadius: 12, padding: 24, width: 420, maxWidth: '90vw', position: 'relative' }}>
            <button onClick={() => setShowApproveModal(false)} style={{ position: 'absolute', top: 12, right: 12, background: 'none', border: 'none', cursor: 'pointer', color: '#646970' }}>
              <X size={18} />
            </button>
            <h3 style={{ fontSize: 16, fontWeight: 700, color: '#1d2327', marginBottom: 16 }}>Xác nhận phê duyệt</h3>
            <p style={{ fontSize: 13, color: '#646970', marginBottom: 16 }}>Bạn sắp phê duyệt hồ sơ xác minh và tạo link mời cho doanh nghiệp:</p>
            <div style={{ background: '#f6f7f7', borderRadius: 8, padding: 14, marginBottom: 16, fontSize: 13 }}>
              <div style={grid2}>
                <div><div style={label}>TÊN CÔNG TY</div><div style={{ fontWeight: 600, color: '#1d2327', marginBottom: 8 }}>{profile.companyName}</div></div>
                <div><div style={label}>MÃ SỐ THUẾ</div><div style={{ fontWeight: 600, color: '#1d2327', fontFamily: 'monospace', marginBottom: 8 }}>{profile.taxId}</div></div>
                <div><div style={label}>NGƯỜI ĐẠI DIỆN</div><div style={{ fontWeight: 600, color: '#1d2327', marginBottom: 8 }}>{profile.repName}</div></div>
                <div><div style={label}>EMAIL</div><div style={{ fontWeight: 600, color: '#1d2327', marginBottom: 8 }}>{profile.repEmail}</div></div>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 10 }}>
              <button
                onClick={() => { onApprove(profile.id); setShowApproveModal(false); }}
                style={{ flex: 1, padding: '10px 0', background: '#00a32a', color: '#fff', border: 'none', borderRadius: 6, fontWeight: 700, fontSize: 13, cursor: 'pointer' }}
              >
                Xác nhận duyệt
              </button>
              <button
                onClick={() => setShowApproveModal(false)}
                style={{ flex: 1, padding: '10px 0', background: '#f0f0f1', color: '#646970', border: 'none', borderRadius: 6, fontWeight: 600, fontSize: 13, cursor: 'pointer' }}
              >
                Hủy
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
