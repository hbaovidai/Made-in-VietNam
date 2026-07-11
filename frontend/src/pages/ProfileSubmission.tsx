import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../components/ui/Toast';
import { api } from '../lib/api';
import { AuthLayout } from '../layouts/AuthLayout';
import { BusinessType, SupplierAccountHolderRole, SupplierType, } from '../lib/enums';
import { FontSizes, formLabel, } from '../lib/constants';
import { Select, FormFieldTextInput, UploadField, TextInput, Label, OptionButton } from '../components/supplier_profile_submit_form/components';
import { Loader2 } from 'lucide-react';

// TODO: there is a memory leak on this page, and idk why.
// if you upload files, and reload the page, the memory usage stays the same until you close the page
// so i'm guessing there is something about the files
// but we're only storing urls got back from the databse so idk what the fuck is happening
const stepIndicatorStyle = 'step-dot w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold';

export function ProfileSubmission() {
  const { t } = useTranslation();
  const { addToast } = useToast();

  // legal infgo
  const [companyName, setCompanyName] = useState<string>('');
  const [taxCode, setTaxCode] = useState<string>('');
  const [legalRepName, setLegalRepName]  = useState<string>('');
  const [legalRepGovId, setLegalRepGovId] = useState<string>('');

  const [primaryLocation, setPrimaryLocation] = useState<string>('');

  // contact info
  const [accountHolderName, setAccountHolderName] = useState<string>('');
  const [contactPhone, setContactPhone] = useState<string>('');
  const [contactEmail, setContactEmail] = useState<string>('');
  const [accountHolderRole, setAccountHolderRole] = useState<SupplierAccountHolderRole>(SupplierAccountHolderRole.EMPLOYEE);

  // extra
  const [businessType, setBusinessType] = useState<BusinessType>(BusinessType.PRIVATE);
  const [supplierType, setSupplierType] = useState<SupplierType>(SupplierType.DISTRIBUTOR);

  const [businessLicenses, setBusinessLicenses] = useState<File[]>([]);
  const [legalRepGovIds, setLegalRepGovIds] = useState<File[]>([]);
  const [authorizationLetters, setAuthorizationLetters] = useState<File[]>([]);
  const [extraDocs, setExtraDors] = useState<File[]>([]);

  const handleUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
    setImageArray,
  ) => {
    try {
      if (!e.target.files) return;
      const newImages = Array.from(e.target.files);
      setImageArray((prev) => [...prev, ...newImages]);
    } catch (error) {
      console.log(error);
    }
  };

  const [loading, setLoading] = useState<boolean>(false);
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const uploadFiles = async (fileItems: File[]) => {
        const urls: string[] = [];
        for (const item of fileItems) {
          const formData = new FormData();
          formData.append('file', item);

          const res = await api.post('/uploads', formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
          });
          urls.push(res.data.url);
        }
        return urls;
      };

      setLoading(true);
      const [
        uploadedLicenses, uploadedGovIds, uploadedAuthLetters,
        uploadedExtraDocs,
      ] = await Promise.all([
        uploadFiles(businessLicenses),
        uploadFiles(legalRepGovIds),
        uploadFiles(authorizationLetters),
        uploadFiles(extraDocs),
      ]);

      const dto = {
        companyName, taxCode, legalRepName, legalRepGovId,
        primaryLocation,

        accountHolderName, accountHolderRole,
        contactPhone, contactEmail,
        businessType, supplierType,

        businessLicenseUrl: uploadedLicenses, 
        legalRepGovIdUrl: uploadedGovIds,
        authorizationLetterUrl: uploadedAuthLetters,
        extraDocsUrl: uploadedExtraDocs,
      };

      const res = await api.post(
        '/auth/turbo_secret_registration_form', dto,
        {headers: {
          'Content-Type': 'application/json',
        }},
      );
      setLoading(false);

      addToast({ type: 'info', title: 'Đã gửi đơn', message: res.data.message });

    } catch (error) {
      console.error("Submission or upload failed:", error);
      addToast({ type: 'error', title: 'Lỗi', message: 'Không thể hoàn tất đăng ký' });

    } finally {
      setLoading(false);
    }
  };

  const accountHolderRoleOptions = {
    "Nhân viên": SupplierAccountHolderRole.EMPLOYEE,
    "Quản lý": SupplierAccountHolderRole.MANAGER,
    "Đại diện Pháp Lý": SupplierAccountHolderRole.LEGAL_REP,
    "Chủ sở hữu": SupplierAccountHolderRole.OWNER,
  };
  const accountHolderRoleButtons = Object.keys(accountHolderRoleOptions).map(label => {
    const value = accountHolderRoleOptions[label];
    const selected = accountHolderRole == value;
    return <OptionButton key={label} label={label} value={value}
            isSelected={selected} onClick={setAccountHolderRole}/>;
  });

  const supplierTypeOptions = {
    "Nhà cung cấp": SupplierType.DISTRIBUTOR,
    "Nhà sản xuất": SupplierType.MANUFACTURER,
    "Nhà xuất khẩu": SupplierType.EXPORTER,
    "Sản phẩm số": SupplierType.DIGITAL_GOODS,
  };
  const supplierTypeButtons = Object.keys(supplierTypeOptions).map(label => {
    const value = supplierTypeOptions[label];
    const selected = supplierType == value;
    return <OptionButton key={value} label={label} value={value}
            onClick={setSupplierType} isSelected={selected}/>
  });

  const businessTypeOptions = {
    "Công ty TNHH": BusinessType.LIMITED_LIABILITY,
    "Công ty Cổ phần": BusinessType.JOINT_STOCK,
    "Công ty Tư nhân": BusinessType.PRIVATE,
  }
  const businessTypeButtons = Object.keys(businessTypeOptions).map(label => {
    const value = businessTypeOptions[label];
    const selected = businessType == value;
    return <OptionButton key={label} label={label} value={value}
            isSelected={selected} onClick={setBusinessType}/>
  });

  const contactInfoInputs = [
    { id: 'account-holder-name', Component: FormFieldTextInput,
      props: { label: "Họ và Tên", value: accountHolderName, setValue: setAccountHolderName, placeHolder: "Trần Thị B" } },
    { id: 'account-holder-role', Component: Select,
      props: { label: 'Vai trò', children: accountHolderRoleButtons } },
      ...(!([SupplierAccountHolderRole.OWNER, SupplierAccountHolderRole.LEGAL_REP].includes(accountHolderRole)) ? [
      {id: 'permission-paper', Component: UploadField,
      props: { 
        label: 'Upload: Giấy ủy quyền', handleUpload,
        fileArray: authorizationLetters, setFileArray: setAuthorizationLetters,
      }}
    ] : []),
    { id: 'contact-phone', Component: FormFieldTextInput,
      props: { label: 'SĐT', value: contactPhone, setValue: setContactPhone, placeHolder: '0123456789'} },
    { id: 'contact-email', Component: FormFieldTextInput,
      props: { label: "Email", value: contactEmail, setValue: setContactEmail, placeHolder: "abcxyz@example.com" } },
  ];

  const legalInfoInputs = [
    { id: 'company-name', Component: FormFieldTextInput, 
      props: { label: "Tên doanh nghiệp", value: companyName, setValue: setCompanyName, placeHolder: "Tên DN như trên giấy ĐKKD" }
    },
    { id: 'tax-code', Component: FormFieldTextInput,
      props: { label: "Mã số thuế", value: taxCode, setValue: setTaxCode, }
    },
    { id: 'legal-rep-name', Component: FormFieldTextInput,
      props: {
        label: "Người đại diện pháp luật",
        value: legalRepName, setValue: setLegalRepName, placeHolder: "Nguyễn Văn B"
      } },
    { id: 'legal-rep-gov-id', Component: FormFieldTextInput,
      props: { label: "CCCD/Hộ chiếu Người đại diện", value: legalRepGovId, setValue: setLegalRepGovId, } },

    { id: 'primary-address', Component: FormFieldTextInput,
      props: { label: 'Địa chỉ', value: primaryLocation, setValue: setPrimaryLocation } },

    { id: 'business-licenses-upload', Component: UploadField,
      props: { 
        label: 'Upload: Giấy chứng nhận đăng ký doanh nghiệp', handleUpload,
        fileArray: businessLicenses, setFileArray: setBusinessLicenses,
    }},
    { id: "gov_id_upload_field", Component: UploadField,
      props: { 
        label: "Upload: Ảnh CCCD/Hộ chiếu người đại diện", handleUpload,
        fileArray: legalRepGovIds, setFileArry: setLegalRepGovIds,
    }},
  ];

  const extraInputs = [
    { id: 'business-type', Component: Select, 
      props: { label: "Loại hình tổ chức", children: businessTypeButtons, }
    },
    { id: 'supplier-type', Component: Select,
      props: { label: "Mô hình hoạt động chính trên sàn", children: supplierTypeButtons, }
    },
  ];

  const miscDocuments = [
    { id: 'misc-document', Component: UploadField,
      props: {
        label: 'Dựa trên mô hình và ngành hàng đã chọn, vui lòng upload thêm các giấy tờ cần thiết',
        fileArray: extraDocs, setFileArray: setExtraDors, handleUpload, required: false
      }},
  ];

  const [currentStep, setCurrStep] = useState(1);
  const fieldsOfStep = {
    1: legalInfoInputs,
    2: contactInfoInputs,
    3: extraInputs,
    4: miscDocuments,
  }
  const titleOfStep = (step) => {
    const map = {
      1: 'Nhóm A: Thông tin pháp lý',
      2: 'Nhóm B: Thông tin liên hệ',
      3: 'Nhóm C: Mô hình kinh doanh & Ngành hàng',
      4: 'Giấy tờ bổ sung',
    };
    return (
      <Label
        key='step-big-title' text={map[step]} 
        fontSize={FontSizes.FORM_FIELD_SECTION_TITLE}
      />
    );
  }

  /*
  Pass this from previous page,
  auth context or api
  */
  const [position, setPosition] = useState("");
  const bigE = (
    <AuthLayout>

    <div className='flex flex-col w-full max-w-[60%] self-start'>

      <nav className="justify-between mb-8">
        <div className="flex items-center gap-2">
          <>
          {[1, 2, 3].map( (step) => {
            return (
              <>
              <span 
                className={stepIndicatorStyle + ((step === currentStep)? ' bg-blue-400': ' bg-blue-100')}
                onClick={() => {setCurrStep(step)}}
              >
                {step}
              </span>
              <div className="w-8 h-0.5 bg-gray-300" />
              </>
            );
          })}
          <span 
            className={stepIndicatorStyle + ((4 === currentStep)? ' bg-blue-400': ' bg-blue-100')}
            onClick={() => {setCurrStep(4)}}
          >
            {4}
          </span>
          </>
        </div>
      </nav>

      <form className="w-full"
        onSubmit={handleSubmit}
      >
        <div className="flex-col p-8 space-y-4 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 ">
          {titleOfStep(currentStep)}
          { fieldsOfStep[currentStep].map( ({id, Component, props}) => {
            return (<Component key={id} {...props}/>);
          }) }
        </div>

        <div className="mt-2 mb-10 p-3 relative">
          { currentStep > 1 && (
            <button
              type="button"
              className="bg-blue-100 hover:bg-blue-200 p-3 rounded-xl absolute left-0 transition-colors ease-in"
              onClick={() => setCurrStep(currentStep-1)}
            >
              Quay lại
            </button>
          )}

          { currentStep > 3 && (
            <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-300 text-white p-3 rounded-xl font-bold transition-colors ease-in absolute right-0" 
            >
              Gửi đăng ký
            </button>
          )}

          { currentStep < 4 && (
            <button
              type="button"
              className="bg-blue-300 hover:bg-blue-400 p-3 rounded-xl absolute right-0 transition-colors ease-in"
              onClick={() => (setCurrStep(currentStep+1))}
            >
              Tiếp tục
            </button>
          )}
        </div>
      </form>

    </div>

    </AuthLayout>
  );

  return (
    loading ? (
      <AuthLayout>
        <Loader2 className='animate-spin w-full h-full max-w-[10%] max-h-[10%]'/>
      </AuthLayout>
    ) : bigE
  );
}
