import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ExternalLink, CheckCircle, ArrowLeft, X } from 'lucide-react';
import { api } from '../../../lib/api';
import { BusinessType, SupplierAccountHolderRole, SupplierStatus, SupplierType } from '@/src/lib/enums';
import { FontSizes, formBoxStyle, formLabel } from '@/src/lib/constants';
import { Label } from '@/src/components/supplier_profile_submit_form/components';

export const busType = {
  [BusinessType.PRIVATE]: 'Tư nhân',
  [BusinessType.JOINT_STOCK]: 'Cổ phần',
  [BusinessType.LIMITED_LIABILITY]: 'TNHH',
}

export const suppType = {
  [SupplierType.NORMAL]: 'nhà cung cấp',
  [SupplierType.MANUFACTURER]: 'nhà sản xuất',
  [SupplierType.EXPORTER]: 'nhà xuất khẩu',
  [SupplierType.MANU_EXPORT]: 'sản xuất & xuất khẩu',
}

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

export interface SupplierApplicationRequest {
  id: string;

  accountHolderFullName: string;
  accountHolderEmail: string;
  accountHolderPhone: string;
  accountHolderRole: SupplierAccountHolderRole;
  accountHolderGovId: string;
  accountHolderGovIdUrl: string[];
  authorizationLetterUrl?: string[];

  companyName: string;
  businessType: BusinessType;
  suppplierType: SupplierType;

  province: string;
  district: string;
  ward: string;
  streetAddress:string;

  taxCode: string;
  legalRepName: string;
  legalRepPhone: string;
  businessLicenseUrl: string[];

  createdAt: Date;
  status: SupplierStatus;
}

interface Props {
  id: string;
  onApprove: (id: string) => void;
  onReject: (id: string, reason: string) => void;
  onDelete: (id: string) => void;
  onBack: () => void;
}

// ─── Styles ──────────────────────────────────────────────────
const grid2: React.CSSProperties = { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 24px' };

function DetailFieldBox( { label, content } ) {
  return (
    <div>
      <Label text={label} fontSize={FontSizes.NORMAL}/>
      <div className={`${formBoxStyle}`}>
        {content}
      </div>
    </div>
  );
}

function ImageGridBox( { label,  } ) {

}

export function SupplierApplicationDetail(
  { id, onApprove, onReject, onDelete, onBack }: Props
) {

  const [profile, setProfile] = useState<SupplierProfile>({});
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

  const companySection = [
    { id: 'comp-name', Component: DetailFieldBox,
      props: {label: 'Tên DN', content: profile.companyName }
    },
    { id: 'comp-tax-code', Component: DetailFieldBox,
      props: {label: 'Mã số thuế', content: profile.taxCode },
    },
    { id: 'comp-address', Component: DetailFieldBox,
      props: {label: 'Địa chỉ', content: `${profile.province}, ${profile.district}, ${profile.ward}, ${profile.streetAddress}` }
    },
    { id: 'comp-bustype', Component: DetailFieldBox,
      props: {label: 'Loại hình tổ chức', content: busType[profile.businessType]}
    },
    { id: 'comp-supp-type', Component: DetailFieldBox,
      props: {label: 'Loại NCC', content: suppType[profile.supplierType]}
    },
    { id: 'comp-legal-rep-name', Component: DetailFieldBox,
      props: {label: 'Tên người đại diện pháp lý', content: profile.legalRepName}
    },
    { id: 'comp-legal-rep-phone', Component: DetailFieldBox,
      props: {label: 'SĐT người đại diện pháp lý', content: profile.legalRepPhone}
    },
  ]

  const accountHolderSection = [

  ];

  return (
  <div> 
    {/*bread crumbs*/}
    <div className="wp-breadcrumb">
      <Link to="/dashboard/admin">Dashboard</Link>
      <span className="wp-breadcrumb-sep">›</span>
      <Link to="/dashboard/admin/">Hồ sơ NCC</Link> {/* todo: fix link later */}
      <span className="wp-breadcrumb-sep">›</span>
      <span className="wp-breadcrumb-current">{profile.companyName}</span>
    </div>


    <div className="wp-page-header" style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
      <button onClick={onBack} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--wp-accent)', display: 'flex' }}>
      <ArrowLeft size={20} />
      </button>
      <h1 className="wp-page-title" style={{ margin: 0 }}>Chi tiết hồ sơ NCC</h1>
    </div>

    {/* info display part */}
    <div className='w-full flex flex-col items-center justify-center p-4'>
      <div className='max-w-[80%] w-full h-full'>
        <div>
          <Label text='Thông tin DN' fontSize={FontSizes.FORM_FIELD_SECTION_TITLE}/>
          {companySection.map(( {id, Component, props} ) => {
            return (
              <Component key={id} {...props}/>
            );
          })}
        </div>
        <div>
          <Label text='Thông tin người kiểm soát TK' fontSize={FontSizes.FORM_FIELD_SECTION_TITLE}/>
        </div>
      </div>

      {/* Quyết định — chỉ hiện khi pending
      {profile.status === SupplierStatus.UNVERIFIED && (
        <div className="flex flex-col gap-4 max-w-md mx-auto p-4 bg-white rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-800">
            Quyết định
          </h3>

          <div className="flex gap-3">
            <button
              onClick={() => onReject(id, "no reason")}
              className="px-4 py-2 rounded-md bg-red-500 text-white hover:bg-red-600 transition"
            >
              Từ chối
            </button>

            <button
              onClick={() => onApprove(id)}
              className="px-4 py-2 rounded-md bg-green-500 text-white hover:bg-green-600 transition"
            >
              Phê duyệt
            </button>

            <button
              onClick={() => onDelete(id)}
              className="px-4 py-2 rounded-md bg-gray-500 text-white hover:bg-gray-600 transition"
            >
              Xóa hồ sơ
            </button>
          </div>
        </div>
      )} */}

    </div>

  </div>
  );
}
