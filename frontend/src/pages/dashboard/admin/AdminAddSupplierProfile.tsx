import { FormContainer, FormFieldTextInput, Label, OptionButton, Select, TextInput } from "@/src/components/supplier_profile_submit_form/components";
import { api } from "@/src/lib/api";
import { FontSizes } from "@/src/lib/constants";
import { BusinessType, SupplierAccountHolderRole, SupplierType } from "@/src/lib/enums";
import React, { SubmitEvent, useCallback, useMemo, useState } from "react";
import { useToast } from "@/src/components/ui/Toast";

export function AdminAppSupplier() {
  const { addToast } = useToast();
  // legal info
  const [companyName, setCompanyName] = useState<string>('');
  const [taxCode, setTaxCode] = useState<string>('');
  const [legalRepName, setLegalRepName]  = useState<string>('');
  const [legalRepGovId, setLegalRepGovId] = useState<string>('');

  const [province, setProvince] = useState<string>('');
  const [ward, setWard] = useState<string>('');
  const [streetAddress, setStreetAddress] = useState<string>('');

  // contact info
  const [accountHolderName, setAccountHolderName] = useState<string>('');
  const [contactPhone, setContactPhone] = useState<string>('');
  const [contactEmail, setContactEmail] = useState<string>('');
  const [accountHolderRole, setAccountHolderRole] = useState<SupplierAccountHolderRole>(SupplierAccountHolderRole.EMPLOYEE);

  // extra
  const [businessType, setBusinessType] = useState<BusinessType>(BusinessType.PRIVATE);
  const [supplierType, setSupplierType] = useState<SupplierType>(SupplierType.DISTRIBUTOR);

  const handleSubmit = useCallback( async (
    e: React.SubmitEvent<SubmitEvent>,
  ) => {
    e.preventDefault();

    try {
      const dto = {
        companyName, taxCode, legalRepName, legalRepGovId,
        province, ward, streetAddress,

        accountHolderName, accountHolderRole,
        contactPhone, contactEmail,
        businessType, supplierType,
      };
      
      addToast({ type: 'info', title: 'Đang gửi đơn', message: 'Đơn của bạn đang được xử lý' });
      const res = await api.post('/suppliers/create_fake_supplier', dto);
      addToast({ type: 'info', title: 'Đã tạo tài khoản', message: res.data.message });

    } catch (error) {
      console.error("Submission or upload failed:", error);
      addToast({ type: 'error', title: 'Lỗi', message: 'Không thể hoàn tất tạo tài khoản' });
    }

  }, [])

  return (
    <div>
    <FormContainer
      formTitle="Thêm hồ sơ NCC" submitButtonText="Thêm hồ sơ"
      handleSubmit={handleSubmit}
    >
      <Label text="Thông tin pháp lý" fontSize={FontSizes.FORM_FIELD_SECTION_TITLE}/>

      <FormFieldTextInput label="Tên doanh nghiệp" value={companyName} setValue={setCompanyName}/>
      <FormFieldTextInput label="Mã số thuế" value={taxCode} setValue={setTaxCode}/>
      <FormFieldTextInput label="Người đại diện pháp luật" value={legalRepName} setValue={setLegalRepName} required={false}/>
      <FormFieldTextInput label="CCCD/Hộ chiếu người đại diện pháp luật" value={legalRepGovId} setValue={setLegalRepGovId} required={false}/>

      <div>
        <Label text="Địa chỉ"/>
        <TextInput placeHolder="quận" value={province} setValue={setProvince}/>
        <TextInput placeHolder="huyện" value={ward} setValue={setWard}/>
        <TextInput placeHolder="đường, số nhà" value={streetAddress} setValue={setStreetAddress}/>
      </div>

      <Select label="Loại hình tổ chức">
        <OptionButton label='Tư nhân' value={BusinessType.PRIVATE} onClick={setBusinessType}/>
        <OptionButton label='Cổ phần' value={BusinessType.JOINT_STOCK} onClick={setBusinessType}/>
        <OptionButton label='TNHH' value={BusinessType.LIMITED_LIABILITY} onClick={setBusinessType}/>
      </Select>

      <Label text="Thông tin liên hệ" fontSize={FontSizes.FORM_FIELD_SECTION_TITLE}/>

      <FormFieldTextInput label="Họ và Tên" value={accountHolderName} setValue={setAccountHolderName}/>
      <FormFieldTextInput label="SĐT" value={contactPhone} setValue={setContactPhone}/>
      <FormFieldTextInput label="Email" value={contactEmail} setValue={setContactEmail}/>

      <Select label="Vai trò">
        <OptionButton label="Nhân viên" value={SupplierAccountHolderRole.EMPLOYEE} onClick={setAccountHolderRole}/>
        <OptionButton label="Quản lý" value={SupplierAccountHolderRole.MANAGER} onClick={setAccountHolderRole}/>
        <OptionButton label="Đại diện pháp luật" value={SupplierAccountHolderRole.LEGAL_REP} onClick={setAccountHolderRole}/>
        <OptionButton label="Chủ sở hữu" value={SupplierAccountHolderRole.OWNER} onClick={setAccountHolderRole}/>
      </Select>

      <Select label="Loại hình hoạt động trên sàn">
        <OptionButton label='Nhà cung cấp' value={SupplierType.DISTRIBUTOR} onClick={setSupplierType}/>
        <OptionButton label='Nhà sản xuất' value={SupplierType.MANUFACTURER} onClick={setSupplierType}/>
        <OptionButton label='Nhà xuất khẩu' value={SupplierType.EXPORTER} onClick={setSupplierType}/>
        <OptionButton label='Sản phẩm số' value={SupplierType.DIGITAL_GOODS} onClick={setSupplierType}/>
      </Select>

    </FormContainer>
    </div>
  );
}
