import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../components/ui/Toast';
import { api } from '../lib/api';
import { AuthLayout } from '../layouts/AuthLayout';
import { BusinessType, SupplierAccountHolderRole, SupplierType, } from '../lib/enums';

function Label( { text } ) {
  return (
    <label className="text-[13px] font-bold text-[#0F172A]"
    >{text}</label>
  )
}

function FormFieldTextInput( { value, setValue, placeHolder, required = true } ) {
  return (
    <input
      required={required}
      type="text"
      value={value}
      onChange={(e) => setValue(e.target.value) }
      placeholder={placeHolder}
      className="w-full px-4 py-3.5 bg-[#F8FAFC] border border-slate-200 rounded-xl"
    />
  );
}

function FormField({ label, value, setValue, placeHolder=label, required=true}) {
  return (
    <div className="space-y-2">
      <Label text={label}/>
      <FormFieldTextInput
        value={value}
        setValue={setValue}
        placeHolder={placeHolder}
        required={required}
      />
    </div>
  );
}

function Selection( { label, value, setValue, options } ) {
  return (
    <div className="space-y-2">
      <label className="text-[13px] font-bold text-[#0F172A]">
        {label}
      </label>

      <select
        required
        value={value}
        onChange={(e)=>setValue(e.target.value)}
        className="w-full px-4 py-3.5 bg-[#F8FAFC] border border-slate-200 rounded-xl"
      >
        {options && Object.keys(options).map(optionLabel => {
          return (
            <option value={options[optionLabel]}>{optionLabel}</option>
          );
        })}
      </select>
    </div>
  );
}

function UploadField( { label, handleUpload, urlArray } ) {
  return (
    <div className="space-y-2 flex flex-col">
      <Label text={label}/>
      <input type="file" required
        accept=".png,.jpg,.jpeg,.pdf,.webp"
        className="w-full px-4 py-3.5 text-[13px] text-justify
          rounded-xl bg-blue-200 hover:border hover:border-blue-950
          file:mr-4 file:py-2 file:px-4
          file:rounded-md file:border-0
          file:text-sm file:font-semibold
          file:bg-blue-50 file:text-[#0F172A]
          hover:file:bg-blue-100
          cursor-pointer"
        onSubmit={(e) => handleUpload(e, imageArray)}
      />
    </div>
  );
}

export function ProfileSubmission() {
  const { t } = useTranslation();

  const [accountHolderFullName, setAccountHolderFullName] = useState<string>();
  const [accountHolderPhone, setAccountHolderPhone] = useState<string>();
  const [accountHolderRole, setAccountHolderRole] = useState<SupplierAccountHolderRole>(SupplierAccountHolderRole.EMPLOYEE);
  const [accountHolderGovId, setAccountholderGovId] = useState<File[] | null>(null);
  const [accountHolderEmail, setAccountHolderEmail] = useState<string>();
  const accountHolderGovIdUrl: string[] = [];
  const authorizationLetterUrl: string[] = [];
  const [authorizationLetter, setAuthorizationLetter] = useState<File[] | null>(null);

  const [companyName, setCompanyName] = useState<string>();
  const [businessType, setBusinessType] = useState<BusinessType>(BusinessType.PRIVATE);
  const businessLicenseUrl: string[] = [];

  const [taxCode, setTaxCode] = useState<string>();
  const [legalRepName, setCompanyLegalRepName]  = useState<string>();
  const [legalRepPhone, setCompanyLegalRepPhone]  = useState<string>();
  const [businessLicense, setBusinessLicense] = useState<File | null>(null);
  const [province, setProvince] = useState<string>();
  const [district, setDistrict] = useState<string>();
  const [ward, setWard] = useState<string>();
  const [streetAddress, setStreetAddress] = useState<string>();

  const [supplierType, setSupplierType] = useState<SupplierType>(SupplierType.NORMAL);

  const handleUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    urlArray: string[],
  ) => {
    try {
      const image = e.target.files?.[0];
      const formData = new FormData();
      formData.append('file', image);
      
      const res = await api.post('/uploads', formData,
        { headers: { 'Content-Type': 'multipart/form-data' } }
      );
      const imageUrl = res.data.url;

      urlArray.push(imageUrl);
    } catch (error) {
      console.log(error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const dto = {
      accountHolderGovId, accountHolderPhone, accountHolderEmail,
      accountHolderGovIdUrl, authorizationLetterUrl, accountHolderRole,
      companyName, businessType, businessLicenseUrl,
      taxCode, legalRepName, legalRepPhone,
      province, district, ward,
      streetAddress, supplierType,
    }

    const res = await api.post('/turbo_secret_registration_form', dto);
    if (res.data.success) {
      alert(res.data.message);
    }
  };

  const accountHolderRoleOptions = {
    "Nhân viên": SupplierAccountHolderRole.EMPLOYEE,
    "Quản lý": SupplierAccountHolderRole.MANAGER,
    "Đại diện Pháp Lý": SupplierAccountHolderRole.LEGAL_REP,
    "Chủ sở hữu": SupplierAccountHolderRole.OWNER,
  };

  const supplierTypeOptions = {
    "Nhà cung cấp": SupplierType.NORMAL,
    "Nhà sản xuất": SupplierType.MANUFACTURER,
    "Nhà xuất khẩu": SupplierType.EXPORTER,
  };

  const businessTypeOptions = {
    "Công ty TNHH": BusinessType.LIMITED_LIABILITY,
    "Công ty Cổ phần": BusinessType.JOINT_STOCK,
    "Công ty Tư nhân": BusinessType.PRIVATE,
  }

  const contactInfoInputs = [
    { id: "accountHolderFullName", Component: FormField,
      props: { label: "Họ và Tên", value: accountHolderFullName, setValue: setAccountHolderFullName, placeHolder: "Nguyễn Văn A" } },
    { id: "accountHolderPhone", Component: FormField,
      props: { label: "Số Điện thoại", value: accountHolderPhone, setValue: setAccountHolderPhone, placeHolder: "012318234"} },
    { id: "accountHolderEmail", Component: FormField,
      props: { label: "Email", value: accountHolderEmail, setValue: setAccountHolderEmail, placeHolder: "abcxyz@example.com" } },
    { id: "accountHolderGovId", Component: FormField,
      props: { label: "CCCD/Passport", value: accountHolderGovId, setValue: setAccountholderGovId, } },
    { id: "gov_id_upload_field", Component: UploadField,
      props: { label: "Ảnh chụp CCCD/Passport", handleUpload: handleUpload, urlArray: accountHolderGovIdUrl } },
    { id: "accountHolderRole'", Component: Selection,
      props: {
        label: "Chức vụ trong Doanh nghiệp", value: accountHolderRole, setValue: setAccountHolderRole, options: accountHolderRoleOptions
      } },
    ...(accountHolderRole !== SupplierAccountHolderRole.OWNER ? [
      {id: 'permission-paper', Component: UploadField,
      props: { label: 'Giấy ủy quyền từ ban giám đốc', handleUpload: handleUpload, govIdUrlArray: authorizationLetterUrl }}
    ] : []),
  ];

  const businessInputs = [
    { id: 'company-name', Component: FormField, 
      props: { label: "Tên chính thức của Doanh nghiệp", value: companyName, setValue: setCompanyName, placeHolder: "Công Ty TNHH ABC" }
    },
    { id: 'tax-code', Component: FormField,
      props: { label: "Mã số thuế", value: taxCode, setValue: setTaxCode, }
    },
    { id: 'legal-rep-name', Component: FormField,
      props: {
        label: "Họ và Tên Người Đại diện Pháp lý",
        value: legalRepName, setValue: setCompanyLegalRepName, placeHolder: "Nguyễn Văn B"
      }
    },
    { id: 'legal-rep-phane', Component: FormField,
      props: { label: "Số Điện thoại Người Đại diện Pháp lý", value: legalRepPhone, setValue: setCompanyLegalRepPhone, }
    },
    { id: 'business-type', Component: Selection, 
      props: { label: "Loại hình tổ chức", value: businessType, setValue: setBusinessType, options: businessTypeOptions, }
    },
    { id: 'supplier-type', Component: Selection,
      props: { label: "Mô hình hoạt động chính trên sàn", value: supplierType, setValue: setSupplierType, options: supplierTypeOptions, }
    },

    // address time......
    { id: 'address-header', Component: Label,
      props: { text: 'Địa chỉ trụ sở chính (theo ĐKKD)' }
    },
    { id: 'address-province', Component: FormFieldTextInput,
      props: { placeHolder: "Tỉnh/Thành phố", value: province, setValue: setProvince }},
    { id: 'address-district', Component: FormFieldTextInput,
      props: { placeHolder: "Quận/Huyện", value: district, setValue: setDistrict }},
    { id: 'address-ward', Component: FormFieldTextInput,
      props: { placeHolder: "Phường/Xã", value: ward, setValue: setWard }},
    { id: 'address-street', Component: FormFieldTextInput,
      props: {placeHolder: "Số nhà/Tên đường", value: streetAddress, setValue: setStreetAddress}},

    { id: 'business-licenses-upload', Component: UploadField,
      props: { label: 'Giấy phép Đăng ký kinh doanh (ĐKKD)', handleUpload: handleUpload, businessLicenseUrlArray: businessLicenseUrl }
    }
  ]

  /*
  Pass this from previous page,
  auth context or api
  */
  const [position, setPosition] = useState("");
  return (
    <AuthLayout>

      <form className="w-full max-w-[60%] bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 overflow-hidden"
        onSubmit={handleSubmit}
      >
        {/* account holder section */}
        <div className="px-10 py-10 space-y-4">
          {/* todo: center the text */}
          <div className="flex ">
            <label className="font-bold text-[22px] ">Thông tin liên hệ người kiểm soát tài khoản</label>
          </div>

          {contactInfoInputs.map( ({ id, Component, props }) => {
            return (
              <Component key={id} {...props}/>
            );
          })}

        </div>

        <div className="px-10 py-10 space-y-4">
          <label className="font-bold text-[22px]">Thông tin Doanh nghiệp</label>

          {businessInputs.map( ( { id, Component, props } ) => {
            return (
              <Component key={id} {...props}/>
            );
          })}

          {/* Submit */}
          <button
            type="submit"
            className="w-full bg-[#0F172A] hover:bg-[#1E293B] text-white py-3.5 rounded-xl font-bold text-sm transition-colors mt-6"
          >
            {t("Submit Company Profile")}
          </button>

        </div>
      </form>

    </AuthLayout>
  );
}
