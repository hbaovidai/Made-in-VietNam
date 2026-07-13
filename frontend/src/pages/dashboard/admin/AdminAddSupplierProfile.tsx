import { FormContainer, FormFieldTextInput, Label, OptionButton, Select, TextInput, UploadField } from "@/src/components/supplier_profile_submit_form/components";
import { api } from "@/src/lib/api";
import { FontSizes } from "@/src/lib/constants";
import { BusinessType, SupplierAccountHolderRole, SupplierType } from "@/src/lib/enums";
import React, { SubmitEvent, useCallback, useEffect, useMemo, useState } from "react";
import { useToast } from "@/src/components/ui/Toast";
import { FIVE_MEG } from "@/src/lib/constants";
import { Loader2 } from "lucide-react";

interface CategoryOption {
  id: string;
  slug: string;
  name: string;
  included: boolean;
}

export function AdminAppSupplier() {
  const { addToast } = useToast();

  const [accountHolderRole, setAccountHolderRole] = useState<SupplierAccountHolderRole>(SupplierAccountHolderRole.EMPLOYEE);
  const [businessType, setBusinessType] = useState<BusinessType>(BusinessType.PRIVATE);
  const [supplierType, setSupplierType] = useState<SupplierType>(SupplierType.DISTRIBUTOR);

  const [logoFile, setLogoFile] = useState<File>(null);
  const [bannerFile, setBannerFile] = useState<File>(null);

  const [categoryOptions, setCategoryOptions] = useState<CategoryOption[]>([]);
  useEffect(() => {
    let isMounted = true;
    const fetchCats = async () => {
      try {
        const res = await api.get('categories/cats/l1');
        if (isMounted) setCategoryOptions(res.data as CategoryOption[]);
      } catch (error) {
        console.error('Failed to fetch categories:', error);
      }
    };
    fetchCats(); return () => { isMounted = false; };
  }, [api]);

  const toggleCategoryInclusion = (slug: string) => {
    setCategoryOptions((prevOptions) =>
      prevOptions.map((cat) =>
        cat.slug === slug 
          ? { ...cat, included: !cat.included } 
          : cat
      )
    );
  };

  const handleUploadOneFile = useCallback((
    e: React.ChangeEvent<HTMLInputElement>, setFile
  ) => {
    try {
      if (!e.target.files) return;

      const file = e.target.files[0];
      if (file.size > FIVE_MEG) {
        addToast({
          'type': 'error', title: 'Kích thước file quá to',
          message: `Kích thước của ${file.name} vượt quá 5MB`
        }); return;
      }
      setFile(file);
      console.log('file set');

    } catch (error) {console.error(error)}
  }, [])

  const handleUploadMultifile = useCallback((
    e: React.ChangeEvent<HTMLInputElement>, setImageArray,
  ) => {
    try {
      if (!e.target.files) return;

      for (const file of e.target.files) {
        if (file.size > FIVE_MEG) {
          addToast({
            'type': 'error', title: 'Kích thước file quá to',
            message: `Kích thước của ${file.name} vượt quá 5MB`
          });
          continue;
        }
        setImageArray((prev) => [...prev, file]);
      }

    } catch (error) { console.log(error); }
  }, []);

  const uploadToServer = useCallback( async (file) => {
    let url = '';
    const formData = new FormData(); formData.append('file', file);

    const res = await api.post('/uploads', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });

    url = res.data.url; return url;
  }, []);

  // this freezes the references, handleSubmit will only see states as they are first initialized
  const handleSubmit = useCallback( async (
    e: React.SubmitEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    try {
      const formData = new FormData(e.currentTarget);
      let {logo, banner, ...dto} = Object.fromEntries(formData.entries());

      dto = {
        ...dto,
        categoryOptions: JSON.parse(dto.categoryOptions as string)
      };

      let logoUrl = "";
      let bannerUrl = "";
      [ logoUrl, bannerUrl ] = await Promise.all([
        uploadToServer(logoFile), uploadToServer(bannerFile)
      ]);

      dto['logo'] = logoUrl; dto['banner'] = bannerUrl;

      dto = Object.fromEntries(
        Object.entries(dto).map(([key, value]) => [ key, value === '' ? undefined : value ])
      )

      addToast({ type: 'info', title: 'Đang gửi đơn', message: 'Đơn của bạn đang được xử lý' });
      console.log(dto);
      const res = await api.post(
        '/suppliers/create_fake_supplier', dto,
        { headers: { 'Content-Type': 'application/json', } },
      );

      const message = res.data.message;
      if (res.data.success) {
        addToast({ type: 'info', title: 'Đã tạo hồ sơ supplier', message: message });
      } else {
        addToast({ type: 'error', title: 'Lỗi tạo hồ sơ', message: message });
      }

    } catch (error) {
      console.error("Submission or upload failed:", error);
      addToast({ type: 'error', title: 'Lỗi', message: 'Không thể hoàn tất tạo hồ sơ' });
    }

  }, [logoFile, bannerFile])

  return (
      <FormContainer
        formTitle="Thêm hồ sơ NCC" submitButtonText="Thêm hồ sơ"
        handleSubmit={handleSubmit} containerStyle="w-full mx-auto items-center max-w-[60%]"
      >

      <FormFieldTextInput label="Tên doanh nghiệp" name="companyName" />
      <FormFieldTextInput label="Địa chỉ" name="primaryLocation" />

      <Select label="Loại hình hoạt động trên sàn" name="supplierType" value={supplierType}>
        <OptionButton key={SupplierType.DISTRIBUTOR} label='Nhà cung cấp' value={SupplierType.DISTRIBUTOR} onClick={setSupplierType}
        isSelected={supplierType === SupplierType.DISTRIBUTOR}/>
        <OptionButton key={SupplierType.MANUFACTURER} label='Nhà sản xuất' value={SupplierType.MANUFACTURER} onClick={setSupplierType}
        isSelected={supplierType === SupplierType.MANUFACTURER}/>
        <OptionButton key={SupplierType.EXPORTER} label='Nhà xuất khẩu' value={SupplierType.EXPORTER} onClick={setSupplierType}
        isSelected={supplierType === SupplierType.EXPORTER}/>
        <OptionButton key={SupplierType.DIGITAL_GOODS} label='Sản phẩm số' value={SupplierType.DIGITAL_GOODS} onClick={setSupplierType}
        isSelected={supplierType === SupplierType.DIGITAL_GOODS}/>
      </Select>

      <Select label="Danh mục" name='categoryOptions' required={true}
        value={
          categoryOptions.filter(opt => opt.included).length > 0
            ? JSON.stringify(categoryOptions.filter(opt => opt.included)) : ""
        }
      >
        {categoryOptions && categoryOptions.map((catOpt: CategoryOption) => {
          return <OptionButton 
            label={catOpt.name} isSelected={catOpt.included} value={catOpt.slug}
            onClick={toggleCategoryInclusion} key={catOpt.slug}
          />
        })}
      </Select>

      <FormFieldTextInput label="Mã số thuế" name="taxCode"/>

      <Select label="Loại hình tổ chức" value={businessType} name="businessType">
        <OptionButton key={BusinessType.PRIVATE} label='Tư nhân' value={BusinessType.PRIVATE} onClick={setBusinessType}
        isSelected={businessType === BusinessType.PRIVATE}/>
        <OptionButton key={BusinessType.JOINT_STOCK} label='Cổ phần' value={BusinessType.JOINT_STOCK} onClick={setBusinessType}
        isSelected={businessType === BusinessType.JOINT_STOCK}/>
        <OptionButton key={BusinessType.LIMITED_LIABILITY} label='TNHH' value={BusinessType.LIMITED_LIABILITY} onClick={setBusinessType}
        isSelected={businessType === BusinessType.LIMITED_LIABILITY}/>
      </Select>

      <Label text="Thông tin liên hệ" fontSize={FontSizes.FORM_FIELD_SECTION_TITLE}/>

      <FormFieldTextInput label="SĐT" name="contactPhone"/>
      <FormFieldTextInput label="Email" name='contactEmail'/>

      <Select label="Vai trò" value={accountHolderRole} name="accountHolderRole">
        <OptionButton label="Nhân viên" value={SupplierAccountHolderRole.EMPLOYEE} onClick={setAccountHolderRole}
        isSelected={accountHolderRole === SupplierAccountHolderRole.EMPLOYEE}/>
        <OptionButton label="Quản lý" value={SupplierAccountHolderRole.MANAGER} onClick={setAccountHolderRole}
        isSelected={accountHolderRole === SupplierAccountHolderRole.MANAGER}/>
        <OptionButton label="Đại diện pháp luật" value={SupplierAccountHolderRole.LEGAL_REP} onClick={setAccountHolderRole}
        isSelected={accountHolderRole === SupplierAccountHolderRole.LEGAL_REP}/>
        <OptionButton label="Chủ sở hữu" value={SupplierAccountHolderRole.OWNER} onClick={setAccountHolderRole}
        isSelected={accountHolderRole === SupplierAccountHolderRole.OWNER}/>
      </Select>

      <Label text="Kênh bán" fontSize={FontSizes.FORM_FIELD_SECTION_TITLE} />
      <FormFieldTextInput label="Website" name="website" required={false}/>
      <FormFieldTextInput label="Facebook" name="facebook" required={false}/>
      <FormFieldTextInput label="Shopee" name="shopee" required={false}/>
      <FormFieldTextInput label="Instagram" name='instagram' required={false}/>

      <UploadField label="Logo" name="logo"
      fileArray={logoFile ? [logoFile] : []} setFileArray={setLogoFile}
      handleUpload={handleUploadOneFile}
      />

      <UploadField label="Banner" name="banner"
      fileArray={bannerFile ? [bannerFile] : []} setFileArray={setBannerFile}
      handleUpload={handleUploadOneFile}
      />

    </FormContainer>
);
}
