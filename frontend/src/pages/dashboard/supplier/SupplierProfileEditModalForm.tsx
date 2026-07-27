import { CustomSelect } from "@/src/components/CustomSelect";
import { SaleChannels } from "@/src/lib/enums";
import { useState } from "react";
import { useToast } from "@/src/components/ui/Toast";
import { useTranslation } from "react-i18next";

const aVeryComprehensiveListOfCategories = ['Nông sản', 'Thực phẩm & Đồ uống', 'Cà phê & Trà', 'Thủy hải sản', 'Dệt may & May mặc', 'Nội thất & Trang trí', 'Thủ công mỹ nghệ', 'Vật tư công nghiệp', 'Mỹ phẩm & Chăm sóc cá nhân', 'Điện tử', 'Sữa & Sản phẩm từ sữa', 'Gỗ & Lâm sản', 'Da giày', 'Cơ khí & Kim loại'];

const aVeryComprehensiveListOfMarkets = ['Việt Nam', 'Hoa Kỳ', 'Châu Âu', 'Nhật Bản', 'Hàn Quốc', 'Trung Quốc', 'Đông Nam Á', 'Úc & New Zealand', 'Trung Đông', 'Châu Phi'];

const businessTypeOptions = [
  { value: 'PRIVATE', label: 'Tư nhân' },
  { value: 'LIMITED_LIABILITY', label: 'TNHH' },
  { value: 'JOINT_STOCK', label: 'Cổ phần' },
];

const employeeCountOptions = [
  { value: '1-10', label: '1 - 10 người' }, { value: '11-50', label: '11 - 50 người' },
  { value: '51-200', label: '51 - 200 người' }, { value: '201-500', label: '201 - 500 người' },
  { value: '501-1000', label: '501 - 1,000 người' }, { value: '1000+', label: 'Trên 1,000 người' },
]

interface ChannelEntry { type: SaleChannels; url: string; }

interface EditModalTextFieldProps {
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  label: string; value: string | number;
}
function EditModalTextField(props: EditModalTextFieldProps) {
  console.log(props.value);
  return (
    <div className="space-y-2">
    <label className="text-[10px] font-normal text-ink-subtle uppercase tracking-widest block" style={{ letterSpacing: '0.32px' }}>{props.label}</label>
    <input 
    type="text" 
    className="w-full px-3.5 py-2 bg-surface-1 border border-hairline text-xs outline-none focus:border-b-2 focus:border-b-primary" 
    style={{ borderRadius: 0, letterSpacing: '0.16px' }}
    value={props.value} 
    onChange={props.onChange}
    />
    </div>
  )
}

interface EditModalformProps {
  setIsEditModalOpen: (boolean) => void;
}

export function EditModalform(props: EditModalformProps) {
  const { addToast } = useToast();
  const { t } = useTranslation();

  const [editForm, setEditForm] = useState({ companyName: '', businessType: '', description: '', companyEmail: '', companyPhone: '', legalRepName: '', yearEstablished: '', employee_count: '', industries: [] as string[], markets: [] as string[] });

  // setEditForm({
  //   companyName: s.companyName || '',
  //   businessType: s.businessType || '',
  //   description: s.description || '',
  //   companyEmail: s.companyEmail || '',
  //   companyPhone: s.companyPhone || '',
  //   legalRepName: s.legalRepName || '',
  //   yearEstablished: s.yearEstablished ? String(s.yearEstablished) : '',
  //   employee_count: s.employee_count || '',
  //   industries: s.industries ? s.industries.map((i: any) => i.industry) : [],
  //     markets: s.markets ? s.markets.map((m: any) => m.market) : [],
  // });

  const handleUpdateProfile = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log('handleUpdateProfile triggered');
    
    try {
      // Filter out empty string fields to avoid DTO validation errors
      const payload: Record<string, any> = {};
      for (const [key, value] of Object.entries(editForm)) {
        if (Array.isArray(value)) {
          payload[key] = value; // always send arrays (industries, markets)
        } else if (value !== '') {
          payload[key] = value;
        }
      }

      // Convert yearEstablished to number for backend validation
      if (payload.yearEstablished) {
        payload.yearEstablished = parseInt(payload.yearEstablished, 10);
      }

      console.log(payload); return;
      

      // const res = await api.put(`/suppliers/${supplierId}`, payload);
      // setSupplier(res.data);
      // setIsEditModalOpen(false);
      // addToast({ type: 'success', title: t('update_profile_success_title'), message: t('update_profile_success_desc') });
    } catch (e) {
      addToast({ type: 'error', title: 'Lỗi', message: 'Không thể cập nhật hồ sơ' });
    }
  };

  return (
    <form onSubmit={handleUpdateProfile} className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <EditModalTextField label={t('company_name_en_label')} value={editForm.companyName}
          onChange={(e) => setEditForm({...editForm, companyName: e.target.value})} />

        <div className="space-y-2">
          <label className="text-[10px] font-normal text-ink-subtle uppercase tracking-widest block" style={{ letterSpacing: '0.32px' }}>{t('biz_type_label')}</label>
          <CustomSelect
            options={businessTypeOptions}
            value={editForm.businessType}
            onChange={(val) => setEditForm({...editForm, businessType: val})}
            placeholder="-- Chọn loại hình --"
            searchable={false}
          />
        </div>

        <EditModalTextField label={t('nguoi_dai_dien')} value={editForm.legalRepName}
          onChange={(e) => setEditForm({...editForm, legalRepName: e.target.value})} />
        <EditModalTextField label='Email công ty' value={editForm.companyEmail}
          onChange={(e) => setEditForm({...editForm, companyEmail: e.target.value})} />
        <EditModalTextField label='Số điện thoại' value={editForm.companyPhone}
          onChange={(e) => setEditForm({...editForm, companyPhone: e.target.value})} />
        <EditModalTextField label='Năm thành lập' value={editForm.yearEstablished}
          onChange={(e) => setEditForm({...editForm, yearEstablished: e.target.value})}/>

        <div className="space-y-2">
          <label className="text-[10px] font-normal text-ink-subtle uppercase tracking-widest block" style={{ letterSpacing: '0.32px' }}>Tổng nhân sự</label>
          <CustomSelect
            options={employeeCountOptions}
            value={editForm.employee_count}
            onChange={(val) => setEditForm({...editForm, employee_count: val})}
            placeholder="-- Chọn --"
            searchable={false}
          />
        </div>

        <div className="space-y-2 col-span-2">
          <label className="text-[10px] font-normal text-ink-subtle uppercase tracking-widest block" style={{ letterSpacing: '0.32px' }}>Ngành hàng</label>
          <div className="flex flex-wrap gap-2 p-3 bg-surface-1 border border-hairline min-h-[44px]" style={{ borderRadius: 0 }}>
            {aVeryComprehensiveListOfCategories.map((ind) => {
              const isSelected = editForm.industries.includes(ind);
              return (
                <button
                  type="button"
                  key={ind}
                  onClick={() => {
                    const next = isSelected
                      ? editForm.industries.filter((i) => i !== ind)
                      : [...editForm.industries, ind];
                    setEditForm({ ...editForm, industries: next });
                  }}
                  className={`px-3 py-1.5 text-xs font-normal border transition-all ${
                    isSelected
                      ? 'bg-primary text-white border-primary'
                      : 'bg-surface-1 text-ink border-hairline hover:bg-surface-2'
                  }`}
                  style={{ borderRadius: 0, letterSpacing: '0.16px' }}
                >
                  {ind}
                </button>
              );
            })}
          </div>
        </div>
        <div className="space-y-2 col-span-2">
          <label className="text-[10px] font-normal text-ink-subtle uppercase tracking-widest block" style={{ letterSpacing: '0.32px' }}>Thị trường xuất khẩu</label>
          <div className="flex flex-wrap gap-2 p-3 bg-surface-1 border border-hairline min-h-[44px]" style={{ borderRadius: 0 }}>
            {aVeryComprehensiveListOfMarkets.map((mkt) => {
              const isSelected = editForm.markets.includes(mkt);
              return (
                <button
                  type="button"
                  key={mkt}
                  onClick={() => {
                    const next = isSelected
                      ? editForm.markets.filter((m) => m !== mkt)
                      : [...editForm.markets, mkt];
                    setEditForm({ ...editForm, markets: next });
                  }}
                  className={`px-3 py-1.5 text-xs font-normal border transition-all ${
                    isSelected
                      ? 'bg-primary text-white border-primary'
                      : 'bg-surface-1 text-ink border-hairline hover:bg-surface-2'
                  }`}
                  style={{ borderRadius: 0, letterSpacing: '0.16px' }}
                >
                  {mkt}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-[10px] font-normal text-ink-subtle uppercase tracking-widest block" style={{ letterSpacing: '0.32px' }}>{t('short_desc_label')}</label>
        <textarea 
          className="w-full px-3.5 py-2 bg-surface-1 border border-hairline text-xs outline-none focus:border-b-2 focus:border-b-primary min-h-[90px]" 
          style={{ borderRadius: 0, letterSpacing: '0.16px' }}
          value={editForm.description} 
          onChange={(e) => setEditForm({...editForm, description: e.target.value})}
        />
      </div>

      <div className="flex justify-end gap-3 pt-6 border-t border-hairline">
        <button type="button" onClick={() => props.setIsEditModalOpen(false)} 
          className="bg-surface-2 hover:bg-surface-3 text-ink text-xs font-normal px-4 py-2"
          style={{ borderRadius: 0, letterSpacing: '0.16px' }}
        > {t('cancel_btn')} </button>
        <button type="submit" 
          className="bg-primary hover:bg-primary-hover text-white text-xs font-normal px-4 py-2"
          style={{ borderRadius: 0, letterSpacing: '0.16px' }}
        > {t('save_changes_btn')} </button>
      </div>

    </form>
  )
}
