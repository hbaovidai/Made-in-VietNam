import React, { useState } from 'react';
import { ShieldCheck, ArrowLeft, MoreHorizontal, Info, Flag } from 'lucide-react';

interface ChatHeaderProps {
  supplierName: string;
  verified: boolean;
  responseRate: string;
  responseTime: string;
  isStarred: boolean;
  onToggleStar: () => void;
  onBack?: () => void;
  onToggleInfo?: () => void;
  showInfoActive?: boolean;
}

export function ChatHeader({
  supplierName,
  verified,
  onBack,
  onToggleInfo,
  showInfoActive
}: ChatHeaderProps) {
  const [showDropdown, setShowDropdown] = useState(false);
  const [showReportToast, setShowReportToast] = useState(false);

  const handleReport = () => {
    setShowReportToast(true);
    setTimeout(() => setShowReportToast(false), 3500);
  };

  return (
    <div style={{
      height: 56, padding: '0 16px', background: '#fff', borderBottom: '1px solid #e2e8f0',
      display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0,
    }}>
      {/* Left: Back + Supplier Name + Badge */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, minWidth: 0 }}>
        {onBack && (
          <button
            onClick={onBack}
            className="md:hidden"
            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4, color: '#64748b' }}
          >
            <ArrowLeft size={18} />
          </button>
        )}

        <h3 style={{ fontSize: 14, fontWeight: 700, color: '#1e293b', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {supplierName}
        </h3>

        {verified && (
          <span style={{
            display: 'inline-flex', alignItems: 'center', gap: 3,
            background: '#ecfdf5', color: '#059669', border: '1px solid #a7f3d0',
            borderRadius: 12, padding: '2px 8px', fontSize: 10, fontWeight: 700, flexShrink: 0,
          }}>
            <ShieldCheck size={10} /> Đã xác minh
          </span>
        )}
      </div>

      {/* Right: More options only */}
      <div style={{ position: 'relative', flexShrink: 0 }}>
        <button
          onClick={() => setShowDropdown(!showDropdown)}
          style={{
            background: showDropdown ? '#f1f5f9' : 'transparent', border: 'none', cursor: 'pointer',
            padding: 6, borderRadius: 6, color: '#94a3b8', display: 'flex',
          }}
        >
          <MoreHorizontal size={16} />
        </button>

        {showDropdown && (
          <>
            <div style={{ position: 'fixed', inset: 0, zIndex: 30 }} onClick={() => setShowDropdown(false)} />
            <div style={{
              position: 'absolute', right: 0, marginTop: 4, width: 180,
              background: '#fff', border: '1px solid #e2e8f0', borderRadius: 10,
              boxShadow: '0 4px 12px rgba(0,0,0,.1)', padding: 4, zIndex: 40,
            }}>
              <button
                onClick={() => { onToggleInfo?.(); setShowDropdown(false); }}
                style={{
                  width: '100%', textAlign: 'left', padding: '8px 12px', fontSize: 12, fontWeight: 600,
                  display: 'flex', alignItems: 'center', gap: 8, background: 'none', border: 'none',
                  cursor: 'pointer', borderRadius: 6, color: showInfoActive ? '#2563eb' : '#334155',
                }}
              >
                <Info size={14} style={{ color: '#94a3b8' }} /> Thông tin doanh nghiệp
              </button>
              <button
                onClick={() => { handleReport(); setShowDropdown(false); }}
                style={{
                  width: '100%', textAlign: 'left', padding: '8px 12px', fontSize: 12, fontWeight: 600,
                  display: 'flex', alignItems: 'center', gap: 8, background: 'none', border: 'none',
                  cursor: 'pointer', borderRadius: 6, color: '#e11d48', borderTop: '1px solid #f1f5f9',
                }}
              >
                <Flag size={14} style={{ color: '#f43f5e' }} /> Báo cáo đối tác
              </button>
            </div>
          </>
        )}

        {showReportToast && (
          <div style={{
            position: 'absolute', right: 0, top: '100%', marginTop: 8,
            background: '#0f172a', color: '#fff', fontSize: 10, fontWeight: 700,
            padding: '6px 12px', borderRadius: 8, boxShadow: '0 4px 12px rgba(0,0,0,.2)',
            zIndex: 50, whiteSpace: 'nowrap',
          }}>
            🚩 Đã gửi báo cáo vi phạm đối tác tới Ban quản trị!
          </div>
        )}
      </div>
    </div>
  );
}
