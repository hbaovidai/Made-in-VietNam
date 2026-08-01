import { CustomSelect } from "@/src/components/CustomSelect";
import { BusinessType, SaleChannels, SaleChannelsMap, SupplierStatus } from "@/src/lib/enums";
import { useEffect, useState } from "react";
import { useToast } from "@/src/components/ui/Toast";
import { useTranslation } from "react-i18next";
import { api } from "@/src/lib/api";

// const aVeryComprehensiveListOfCategories = ['Nông sản', 'Thực phẩm & Đồ uống', 'Cà phê & Trà', 'Thủy hải sản', 'Dệt may & May mặc', 'Nội thất & Trang trí', 'Thủ công mỹ nghệ', 'Vật tư công nghiệp', 'Mỹ phẩm & Chăm sóc cá nhân', 'Điện tử', 'Sữa & Sản phẩm từ sữa', 'Gỗ & Lâm sản', 'Da giày', 'Cơ khí & Kim loại'];
interface l1Category { slug: string; id: string; name: string; }
interface SuppCategory { name: string; nameEn: string; id: string; }
type CategoryOption = Record<string, {slug: string; name: string; included: boolean}>;

type ChannelOption = Record<SaleChannels, string>;

const aVeryComprehensiveListOfMarkets = ['Việt Nam', 'Hoa Kỳ', 'Châu Âu', 'Nhật Bản', 'Hàn Quốc', 'Trung Quốc', 'Đông Nam Á', 'Úc & New Zealand', 'Trung Đông', 'Châu Phi'];

const businessTypeOptions = [
  { value: BusinessType.PRIVATE, label: 'Tư nhân' },
  { value: BusinessType.LIMITED_LIABILITY, label: 'TNHH' },
  { value: BusinessType.JOINT_STOCK, label: 'Cổ phần' },
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

interface SupplierFields {
  id?: string;

  companyName?: string; description?: string;
  taxCode?: string; yearEstablished?: string; employee_count?: string;
  businessType?: string;

  contactEmail?: string; contactPhone?: string;
  legalRepName?: string;

  logo?: string; banner?: string;
  status?: SupplierStatus;

  categories?: {category: SuppCategory}[];
  categoryOptions?: {id: string; name: string; slug: string; included: boolean}[];

  channels?: ChannelEntry[];
};

interface EditModalformProps {
  handleCloseModal: () => void;
  initialSupplier: SupplierFields;
  handleSupplierUpdate: (s: SupplierFields) => void;
}

export function EditModalform(props: EditModalformProps) {
  const { addToast } = useToast();
  const { t } = useTranslation();

  const [editForm, setEditForm] = useState<SupplierFields>({ 
    companyName: '', businessType: '', description: '',
    contactEmail: '', contactPhone: '', legalRepName: '',
    yearEstablished: '', employee_count: '',
    categories: [],
  });
  

  const [categoryOptions, setCategoryOptions] = useState<CategoryOption>({});
  const [l1Categories, setL1Categories] = useState<l1Category[]>([]);

  const [channelOptions, setChannelOptions] =
    useState<ChannelOption>( {} as Record<SaleChannels, string> );

  useEffect(() => {
    const init = async () => {
      setEditForm(props.initialSupplier);
      try {
        const res = await api.get('/categories/cats/l1');
        if (res.data) { setL1Categories(res.data); }

        const chanOpt = Object.values(SaleChannels).reduce((acc, channel) => {
          acc[channel] = ''; return acc;
        }, {} as Record<SaleChannels, string>);
        props.initialSupplier.channels.forEach((channel) => {
          chanOpt[channel.type] = channel.url;
        });
        setChannelOptions(chanOpt);

      // } catch (error) { console.error(error); }
      } catch (error) { console.error(error); }
    }

    init();
  }, []);

  useEffect(() => {
    const setCategoryList = () => {
      if (!l1Categories?.length) return;

      const opts: CategoryOption = {};
      l1Categories.forEach((cat) => {
        const opt = { name: cat.name, slug: cat.slug, included: false };
        props.initialSupplier.categories.forEach(({category}) => {
          if (category.id == cat.id) opt.included = true;
        });
        opts[cat.id] = opt;
      });

      setCategoryOptions(opts);
    };

    setCategoryList();
  }, [l1Categories]);

  const handleUpdateProfile = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    try {
      // Filter out empty string fields to avoid DTO validation errors
      const payload: Partial<Record<keyof SupplierFields, any>> = {};
      for (const [key, value] of Object.entries(editForm)) {
        const bannedKeys = ['id', 'addresses', 'categories'];
        if (bannedKeys.includes(key)) continue;

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

      const channels: {type: string; url: string}[] = [];
      Object.keys(channelOptions).forEach((type) => {
        if (channelOptions[type] !== '') 
          channels.push({type, url: channelOptions[type]});
      });
      payload.channels = channels;

      const categories:
        {id: string; slug: string; name: string; included: boolean}[] = [];
      Object.keys(categoryOptions).forEach((id) => {
        const rest = categoryOptions[id];
        categories.push({ id, ...rest })
      });
      payload.categoryOptions = categories;

      addToast({ type: 'info', title: 'Vui lòng đợi', message: 'Hệ thông đang cập nhật hồ sơ.' });
      const res = await api.put(`/suppliers/${props.initialSupplier.id}`, payload);

      console.log(res.data);
      props.handleSupplierUpdate(res.data);
      props.handleCloseModal();
      addToast({ type: 'success', title: t('update_profile_success_title'), message: t('update_profile_success_desc') });
    } catch (e) {
      addToast({ type: 'error', title: 'Lỗi', message: 'Không thể cập nhật hồ sơ' });
      // console.error(e);
    }
  };

  const handleCatToggle = (id: string, prev: boolean) => {
    setCategoryOptions({ 
      ...categoryOptions,
      [id]: { ...categoryOptions[id], included: !prev }
    })
  };

  return (
    <form onSubmit={handleUpdateProfile} className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <EditModalTextField label={t('company_name_en_label')} value={editForm.companyName}
          onChange={(e) => setEditForm({...editForm, companyName: e.target.value})} />

        {/* business type selection */}
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
        <EditModalTextField label='Email công ty' value={editForm.contactEmail}
          onChange={(e) => setEditForm({...editForm, contactEmail: e.target.value})} />
        <EditModalTextField label='Số điện thoại' value={editForm.contactPhone}
          onChange={(e) => setEditForm({...editForm, contactPhone: e.target.value})} />
        <EditModalTextField label='Năm thành lập' value={editForm.yearEstablished}
          onChange={(e) => setEditForm({...editForm, yearEstablished: e.target.value})}/>

        {/* employee count selection */}
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

            { Object.values(categoryOptions).length > 0 ?
              Object.entries(categoryOptions).map(([id, opt]) => {
              return (
                <button type="button" key={opt.name}
                  onClick={()=> handleCatToggle(id, opt.included)}
                  className={`px-3 py-1.5 text-xs font-normal border transition-all ${
                    opt.included
                      ? 'bg-primary text-white border-primary'
                      : 'bg-surface-1 text-ink border-hairline hover:bg-surface-2'
                  }`}
                  style={{ borderRadius: 0, letterSpacing: '0.16px' }}
                > {opt.name} </button>
              );
            }) : 'lỗi lấy categories'}

          </div>
        </div>

        {/* market selection (market is reserved for exporters, so we'll just have to hide it for now) */}
        {/*
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
        */}
      </div>

      <div className="grid grid-cols-2 gap-4">
        {Object.entries(channelOptions).map(([type, url]) => {
          return (
            <EditModalTextField label={SaleChannelsMap[type]} value={url} key={type}
              onChange={
                (e) => setChannelOptions({
                  ...channelOptions, [type]: e.target.value
                })}
            />
          );
        })}
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
        <button type="button" onClick={props.handleCloseModal} 
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
