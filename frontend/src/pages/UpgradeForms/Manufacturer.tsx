import { CheckboxField, FormFieldTextInput, UploadField, Label, FormContainer, SelectSingle, OptionButton, TextInput, Select } from "@/src/components/supplier_profile_submit_form/components";
import { AuthLayout } from "@/src/layouts/AuthLayout";
import { formBoxStyle } from "@/src/lib/constants";
import { fromConf, CompConf } from "@/src/lib/interfaces";
import { Award, Camera, Leaf, Loader2 } from "lucide-react";
import { useMemo, useState } from "react";

export enum OwnOrRentFact {
  OWN = 'OWN',
  RENT = 'RENT',
};

export function UpgradeFormManufacturer() {
  const [loading, setLoading] = useState<boolean>(false);

  const [factAddress, setFactAddress] = useState<string>('');
  const [ownOrRent, setOwnOrRent] = useState<OwnOrRentFact>();

  const [prodVol, setProdVol] = useState<string>('');
  const [prodVolUnit, setProdVolUnit] = useState<string>('');
  const [workerCount, setWorkerCount] = useState<number>();

  const [locationRegPapers, setLocRegPapers] = useState<File[]>([]);
  const [someDocAboutTheFactory, setSomedoc] = useState<File[]>([]);
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
            label='Sở hữu hay thuê xưởng?' value={OwnOrRentFact}
          >
            <OptionButton value={OwnOrRentFact.OWN} label="Sở hữu" 
              onClick={(val) => setOwnOrRent(OwnOrRentFact[val])}
              isSelected={ownOrRent == OwnOrRentFact.OWN}
              />

            <OptionButton value={OwnOrRentFact.RENT} label="Thuê"
              onClick={(val) => setOwnOrRent(OwnOrRentFact[val])}
              isSelected={ownOrRent == OwnOrRentFact.RENT}
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
          fileArray={someDocAboutTheFactory} setFileArray={setSomedoc}
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
