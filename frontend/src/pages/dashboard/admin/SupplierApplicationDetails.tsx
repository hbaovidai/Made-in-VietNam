import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ExternalLink, CheckCircle, ArrowLeft, X } from 'lucide-react';
import { api } from '../../../lib/api';

export type ApplicantRole = 'OWNER' | 'EMPLOYEE' | 'MANAGER' | 'LEGAL_REP';
export type SupplierApplicationStatus = 'PENDING' | 'REJECTED' | 'APPROVED';

export interface SupplierApplicationRequest {
  id: number;
  firstName: string;
  lastName: string;
  applicantRole: ApplicantRole;
  govId: string;
  govIdPicUrl: string[];
  email: string;
  phone: string;
  createdAt: Date;
  status: SupplierApplicationStatus;
}

interface Props {
  request: SupplierApplicationRequest;
  onApprove: (id: number) => void;
  onReject: (id: number, reason: string) => void;
  onDelete: (id: number) => void;
  onBack: () => void;
}

const fetchData = async (id: number) => {
  const result = await api.get(`/supp_apps/${id}`, {
    headers: {Authorization: `${localStorage.getItem('token')}`}
  });
  return result;
}

// ─── Styles ──────────────────────────────────────────────────
const grid2: React.CSSProperties = { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 24px' };

export function SupplierApplicationDetail(
  { request, onApprove, onReject, onDelete, onBack }: Props
) {
  const fullName = `${request.lastName} ${request.firstName}`;

  return (
  <div> 
    {/*bread crumbs*/}
    <div className="wp-breadcrumb">
      <Link to="/dashboard/admin">Dashboard</Link>
      <span className="wp-breadcrumb-sep">›</span>
      <Link to="/dashboard/admin/verifications">Ứng viên</Link>
      <span className="wp-breadcrumb-sep">›</span>
      <span className="wp-breadcrumb-current">{fullName}</span>
    </div>


    <div className="wp-page-header" style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
      <button onClick={onBack} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--wp-accent)', display: 'flex' }}>
      <ArrowLeft size={20} />
      </button>
      <h1 className="wp-page-title" style={{ margin: 0 }}>Chi tiết hồ sơ phê duyệt</h1>
    </div>

    <div style={grid2}>
      <div>
        <div>Họ và Tên</div> <div>{fullName}</div>
      </div>
      <div>
        <div>Sđt</div> <div>{request.phone}</div>
      </div>
      <div>
        <div>Email</div> <div>{request.email}</div>
      </div>

      <div>
        <div>Mã CCCD/Passport</div> <div>{request.govId}</div>
      </div>
      <div>
        <div>Link ảnh CCCD/Passport</div>
        <>
          {request.govIdPicUrl.length == 0 ? (
            <div>Không có link</div>
          ) : (
            <div>
            {request.govIdPicUrl.map((url, index) => (
              <a key={index} href={url} rel="noreferrer">{url}</a>
            ))}
            </div>
          )}
        </>
      </div>

      <div>
        <div>Ngày nộp</div> <div>{request.createdAt.toLocaleString()}</div>
      </div>
      <div>
        <div>Tình trạng phê duyệt</div> <div>{request.status}</div>
      </div>
    </div>

    {/* Quyết định — chỉ hiện khi pending */}
    {request.status === 'PENDING' && (
      <div className="flex flex-col gap-4 max-w-md mx-auto p-4 bg-white rounded-lg shadow">
        <h3 className="text-lg font-semibold text-gray-800">
          Quyết định
        </h3>

        <div className="flex gap-3">
          <button
            onClick={() => onReject(request.id, "no reason")}
            className="px-4 py-2 rounded-md bg-red-500 text-white hover:bg-red-600 transition"
          >
            Từ chối
          </button>

          <button
            onClick={() => onApprove(request.id)}
            className="px-4 py-2 rounded-md bg-green-500 text-white hover:bg-green-600 transition"
          >
            Phê duyệt
          </button>

          <button
            onClick={() => onDelete(request.id)}
            className="px-4 py-2 rounded-md bg-gray-500 text-white hover:bg-gray-600 transition"
          >
            Xóa hồ sơ
          </button>
        </div>
      </div>
    )}
  </div>
  )

}
