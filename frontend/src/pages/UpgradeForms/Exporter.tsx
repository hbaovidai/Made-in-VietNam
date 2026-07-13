import { CheckboxField, FormContainer, FormFieldTextInput, OptionButton, Select, UploadField, } from "@/src/components/supplier_profile_submit_form/components";
import { AuthLayout } from "@/src/layouts/AuthLayout";
import { Incoterm, Market } from "@/src/lib/enums";
import { Award, Loader2 } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/src/components/ui/Toast";
import { api } from "@/src/lib/api";

const marketLabelMap = {
  [Market.USA]: 'Mỹ', [Market.EU]: 'EU', [Market.JPN]: 'Nhật Bản',
  [Market.KOR]: 'Hàn Quốc', [Market.CHN]: 'Trung Quốc', [Market.ASEAN]: 'ASEAN',
  [Market.AUS]: 'Úc', [Market.ME]: 'Trung Đông', [Market.AF]: 'Châu Phi', [Market.OTHER]: 'Khác'
};

export function UpgradeFormExporter() {
  const { addToast } = useToast();
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

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>, setFileArray: Function) => {
    const files = Array.from(e.target.files);
    setFileArray(prev => [...prev, files]);
  }

  const handleSubmit = async (e: React.SubmitEvent) => {
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

      const [
        exporterPapersUrl, foreignContractsUrl, internationalCertsUrl
      ] = await Promise.all([
        uploadFiles(exporterPapers), uploadFiles(foreignContracts), uploadFiles(internationalCerts),
      ]);

      const dto = {
        yearsExp, hasOrgCert, isMainIndust, 
        exporterPapersUrl, foreignContractsUrl, internationalCertsUrl,
      }

    } catch (error) {
      addToast({type: 'error', title: 'Nộp hồ sơ không thành công', message: error.message});
    }

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
