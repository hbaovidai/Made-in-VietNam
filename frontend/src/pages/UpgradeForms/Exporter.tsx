import { CheckboxField, CheckboxFieldProps, FormContainer, FormContainerProps, FormFieldTextInput, FormFieldTextInputProps, OptionButton, Select, SelectMultiple, SelectMultipleProps, UploadField, UploadFieldProps } from "@/src/components/supplier_profile_submit_form/components";
import { AuthLayout } from "@/src/layouts/AuthLayout";
import { Incoterm, Market } from "@/src/lib/enums";
import { CompConf } from "@/src/lib/interfaces";
import { Award, Loader2 } from "lucide-react";
import { useState } from "react";

const marketLabelMap = {
  [Market.US]: 'Mỹ', [Market.EU]: 'EU', [Market.JAP]: 'Nhật Bản',
  [Market.SKOR]: 'Hàn Quốc', [Market.CHINA]: 'Trung Quốc', [Market.ASEAN]: 'ASEAN',
  [Market.AUS]: 'Úc', [Market.MID_EAST]: 'Trung Đông', [Market.AFRICA]: 'Châu Phi', [Market.OTHER]: 'Khác'
};

export function UpgradeFormExporter() {
  const [loading, setLoading] = useState<boolean>(false);

  const [yearsExp, setYearsExp] = useState<number>();

  const [exporterPapers, setExporterPapers] = useState<File[]>([]);
  const [foreignContracts, setForeignContracts] = useState<File[]>([]);
  const [internationalCerts, setInternationalCerts] = useState<File[]>([]);

  const [hasOrgCert, setHasOrgCert] = useState<boolean>(false);
  const [isMainIndust, setIsMainIndust] = useState<boolean>(false);
  const [legalInfoWasLegitTrustMeBro, setLegitInfo] = useState<boolean>(false);

  const marketsObject = Object.keys(Market).reduce((acc, key) => {
    acc[key] = {
      label: marketLabelMap[key],
      selected: false,
    }
    return acc;
  }, {});
  const [marketOptions, setMarketOptions] = useState(marketsObject);
  console.log(marketOptions)

  const toggleMarket = (key: string) => {
    setMarketOptions( prevOpts => ({
      ...prevOpts,
      [key]: {
        ...prevOpts[key],
        selected: !prevOpts[key].selected
      }
    }));
  }

  const incotermsObject = Object.keys(Incoterm).reduce((acc, key) => {
    acc[key] = { 
      label: Incoterm[key], 
      selected: false ,
    };
    return acc;
  }, {});
  const [incotermsOptions, setIncotermsOptions] = useState(incotermsObject);
  const toggleIncoterm = (key: string) => {
    setIncotermsOptions( prevOpts => ({
      ...prevOpts,
      [key]: {
        ...prevOpts[key],
        selected: !prevOpts[key].selected
      }
    }));
  }

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>, setFileArry: Function) => {
    const files = Array.from(e.target.files);
  }

  const handleSubmit = async (e: React.SubmitEvent) => {
    e.preventDefault();
    // TODO: code this later
    return;
  }

  return (
    <AuthLayout>
      { loading ? (
        <Loader2 className="animate-spin w-full h-full max-w-[10%] max-h-[10%]"/>
      ) : (
        <FormContainer
        handleSubmit={handleSubmit}
        >
          <FormFieldTextInput
          label="Số năm kinh nghiệm xuất khẩu" value={yearsExp} setValue={setYearsExp}
          />

          <Select
          label="Thị trường đã từng xuất khẩu" value={marketOptions}
          >
            {Object.keys(marketOptions).map(key => {
              const label = marketOptions[key].label;
              const isSelected = marketOptions[key].selected;
              return (
                <OptionButton
                  key={label} label={label} value={key}
                  isSelected={isSelected} onClick={toggleMarket}
                />
              );
            })}
          </Select>

          <Select
          label="Điều kiện Incoterm áp dụng" value={incotermsObject}
          >
          {Object.keys(incotermsOptions).map(key => {
            const label = incotermsOptions[key].label;
            const isSelected = incotermsOptions[key].selected;
            return (
              <OptionButton key={label} label={label} value={key}
              onClick={toggleIncoterm} isSelected={isSelected}
              />
            )
          })}
          </Select>

          <hr/>

          <UploadField label="Upload: Tờ khai hải quan xuất khẩu mẫu"
          handleUpload={handleUpload} fileArray={exporterPapers} setFileArray={setExporterPapers}
          />

          <UploadField label="Upload: Hợp đồng ngoại thương mẫu"
          handleUpload={handleUpload} fileArray={foreignContracts} setFileArray={setForeignContracts}
          />

          <CheckboxField label="Có C/O (Giấy chứng nhận xuất xứ)" setValue={setHasOrgCert} />
          <CheckboxField label='Ngành đặc thù (gạo, gỗ, khoáng sản,...)' setValue={setIsMainIndust}/>

          <hr/>

          <UploadField label="Upload: Chứng nhận tiêu chuẩn quốc tế (FDA/CE/JAS/Halal...)"
          handleUpload={handleUpload} fileArray={internationalCerts} setFileArray={setInternationalCerts}
          Icon=<Award/>
          />

          <CheckboxField setValue={setLegitInfo}
          label="Tôi cam kết toàn bộ thông tin và giấy tờ cung cấp ở trên là chính xác, hợp lệ. Tôi chịu trách nhiệm pháp lý nếu có sai phạm."
          />

        </FormContainer>
      )}
    </AuthLayout>
  );
}
