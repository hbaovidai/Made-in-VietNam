import { CheckboxField, FormFieldTextInput, UploadField, Label, FormContainer, OptionButton, TextInput, Select } from "@/src/components/supplier_profile_submit_form/components";
import { AuthLayout } from "@/src/layouts/AuthLayout";
import { api } from "@/src/lib/api";
import { Award, Camera, Leaf, Loader2 } from "lucide-react";
import { useCallback, useMemo, useState } from "react";

export function UpgradeFormManufacturer() {
  const [loading, setLoading] = useState<boolean>(false);

  const [factAddress, setFactAddress] = useState<string>('');
  const [ownFactory, setOwnFactory] = useState<boolean>(true);

  const [prodVol, setProdVol] = useState<string>('');
  const [prodVolUnit, setProdVolUnit] = useState<string>('');
  const [workerCount, setWorkerCount] = useState<number>();

  const [locationRegPapers, setLocRegPapers] = useState<File[]>([]);
  const [realEstUsagePermDoc, setPermDoc] = useState<File[]>([]);
  const [industrySpecificPapers, setIndSpecPapers] = useState<File[]>([]);
  const [factMed, setFactMed] = useState<File[]>([]);
  const [extraCerts, setExtraCerts] = useState<File[]>([]);
  const [envCerts, setEnvCerts] = useState<File[]>([]);

  const [legalInfoWasLegitTrustMeBro, setLegitInfo] = useState<boolean>(false);

  const appendFiles = (newFiles: File[], setArray) => {
    setArray(prev => [...prev, newFiles])
  }

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>, setFileArray) => {
    const newFiles = Array.from(e.target.files);
    appendFiles(newFiles, setFileArray);
  }

  const handleSubmit = useCallback(
    async (e: React.SubmitEvent) => {
      e.preventDefault();

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
        locationRegUrl, realEstUsagePermUrl,
        industrySpecificPapersUrl, factMedUrl,
        extraCertsUrl, envCertsUrl
      ] = await Promise.all([
        uploadFiles(locationRegPapers), uploadFiles(realEstUsagePermDoc),
        uploadFiles(industrySpecificPapers), uploadFiles(factMed),
        uploadFiles(extraCerts), uploadFiles(envCerts)
      ]);

      const dto = {
        factAddress, ownFactory, prodVol, prodVolUnit, workerCount,

        locationRegUrl, realEstUsagePermUrl,
        industrySpecificPapersUrl, factMedUrl,
        extraCertsUrl, envCertsUrl
      }

      const res = api.post(
        '', dto,
        {headers: { 'Content-Type': 'application/json' }}
      );
    },
    [],
  )
  

  return (
    <AuthLayout>
      { loading ? (
        <Loader2 className="animate-spin w-full h-full max-w-[10%] max-h-[10%]"/>
      ) : (

        <FormContainer
          handleSubmit={() => {}}
        >
          <FormFieldTextInput value={factAddress} setValue={setFactAddress}
            label='Địa chỉ nhà xưởng'
          />

          <Select
            label='Sở hữu hay thuê xưởng?' value={ownFactory}
          >
            <OptionButton value={true} label="Sở hữu" 
              onClick={(val) => setOwnFactory(val)}
              isSelected={ownFactory}
              />

            <OptionButton value={false} label="Thuê"
              onClick={(val) => setOwnFactory(val)}
              isSelected={!ownFactory}
              />
          </Select>

          <Label text="Công xuất sản xuất"/>
          <div className='flex space-x-2'>
              <div className="w-[80%]">
              <TextInput value={prodVol} setValue={setProdVol}
                placeHolder="VD: 10.000"/>
              </div>
              <div>
              <TextInput value={prodVolUnit} setValue={setProdVolUnit}
                placeHolder="đơn vị/tháng"
              />
              </div>
          </div>

          <FormFieldTextInput value={workerCount} setValue={setWorkerCount}
          label="Số lao động sản xuất trực tiếp"
          />

          <UploadField label="Giấy CN đăng ký địa điểm / chi nhánh sản xuất"
          fileArray={locationRegPapers} setFileArray={setLocRegPapers}
          handleUpload={handleUpload}
          />

          <UploadField label="Giấy CNQSDĐ hoặc Hợp đồng thuê xưởng"
          fileArray={realEstUsagePermDoc} setFileArray={setPermDoc}
          handleUpload={handleUpload}
          />

          <UploadField label='Giấy phép đủ điều kiện sản xuất theo ngành'
          fileArray={industrySpecificPapers} setFileArray={setIndSpecPapers}
          handleUpload={handleUpload}
          />

          <UploadField label='Ảnh / video thực tế nhà xưởng'
          fileArray={factMed} setFileArray={setFactMed}
          handleUpload={handleUpload} Icon=<Camera/>
          />

          <UploadField label='Chứng nhận ISO/HACCP (nếu có)'
          fileArray={extraCerts} setFileArray={setExtraCerts}
          handleUpload={handleUpload} Icon=<Award/>
          />

          <UploadField label='Giấy xác nhận môi trường'
          fileArray={envCerts} setFileArray={setEnvCerts}
          handleUpload={handleUpload} Icon=<Leaf/>
          />

          <hr className='text-gray-300'/>

         <CheckboxField setValue={setLegitInfo}
         label='Tôi cam kết toàn bộ thông tin và giấy tờ cung cấp ở trên là chính xác, hợp lệ. Tôi chịu trách nhiệm pháp lý nếu có sai phạm.'
         />

        </FormContainer>
      )}
    </AuthLayout>
  );
}
