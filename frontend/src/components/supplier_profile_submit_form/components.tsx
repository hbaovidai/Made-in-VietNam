import { formLabel, formBoxStyle, verSuppRegFormUploadStyle, FontSizes } from "@/src/lib/constants";
import { UploadIcon } from "lucide-react";

export interface OptionButtonProps {
  label: string; value: any;
  isSelected?: boolean;
  onClick?: (value: any) => void;
  style?: string;
};

export function OptionButton(props: OptionButtonProps) {
  var labelIncluded = props.isSelected ?? false;
  const buttonStyle = props.style ?? 'px-3 py-1.5 text-center rounded-full border border-slate-400';
  const color = `${labelIncluded ? 'bg-blue-600 text-white' : 'bg-white text-slate-700'}`;
  const style = props.style ?? `${buttonStyle} ${color}`;

  return (
    <button
      type='button'
      value={props.value}
      className={style}
      onClick={() => props.onClick(props.value)}
    > 
      {props.label}
    </button>
  );
}

export interface LabelProps {
  text: string;
  fontSize?: FontSizes;
}

export function Label(props: LabelProps) {
  const fontSize = props.fontSize ?? FontSizes.NORMAL;
  return <label className={formLabel(fontSize)}> {props.text} </label>;
}

export interface UploadFieldProps {
  label: string; handleUpload: Function; fileArray: File[]; setFileArray: Function;
  uploadText?: string; uploadBoxStyle?: string; required?: boolean;
  labelComponent?: React.ComponentType;
  Icon?: React.ReactNode,
  name: string; id?: string;
  multifile?: boolean
};

export function UploadField( props: UploadFieldProps) {
  const LabelComponent = props.labelComponent ?? (() => (
    <Label text={props.label}/>
  ));

  const validationValue = (props.fileArray && props.fileArray.length > 0 )
    ? props.fileArray.map(f => f.name).join(', ') 
    : "";

  return (
    <div className="space-y-2 flex flex-col w-full">
      <LabelComponent/>

      <label className={`${props.uploadBoxStyle ?? verSuppRegFormUploadStyle}`}>
        <div></div>
        {props.Icon ?? <UploadIcon/>} <p>{props.uploadText ?? 'Nhấn để tải lên'}</p>
        <input type="file"
          className='hidden'
          multiple={props.multifile ? true : false}
          accept=".png,.jpg,.jpeg,.pdf,.webp"
          name={props.name} id={props.id} 
          onChange={(e) => props.handleUpload(e, props.setFileArray)}
        />
      </label>
      <input
        type='text' className="sr-only"
        required={props.required ?? true} value={validationValue}
      />

      { props.fileArray && (
        <div className='grid grid-cols-3 gap-0'>
          {props.fileArray.map( ({ name }) => {
            return (
              <p key={name} >{name}</p>
            );
          })}
        </div>
      )}

    </div>
  );
}

export interface TextInputProps {
  value?: any; setValue?: Function; 
  placeHolder?: string;
  required?: boolean;
  style?: string;
  name: string; id?: string
}

export function TextInput( props: TextInputProps ) {
  return (
    <input
      required={props.required ?? true}
      type="text" name={props.name} id={props.id}
      value={props.value}
      onChange={(e) => props.setValue?.(e.target.value)}
      placeholder={props.placeHolder ?? '...'}
      className={props.style ?? formBoxStyle}
    />
  );
}

export interface FormFieldTextInputProps {
  label: string;
  subLabel?: string;
  value?: any; setValue?: (arg: any) => void;
  placeHolder?: string; required?: boolean;
  inputBoxStyle?: string;
  name: string; id?: string;
}

export function FormFieldTextInput(props: FormFieldTextInputProps) {
  return (
    <div className="space-y-2">
      <Label text={props.label}/>
      <TextInput
        value={props.value} name={props.name} id={props.id}
        setValue={props.setValue}
        placeHolder={props.placeHolder ?? '...'}
        required={props.required ?? true}
        style={props.inputBoxStyle}
      />
    </div>
  );
}

export interface SelectProps {
  label: string; subLabel?: string;
  value?: any; onButtonClick?: Function;
  required?: boolean; style?: string;
  children: React.ReactNode;
  name: string; id?: string
}

export function Select(props: SelectProps) {
  const style = props.style ?? 'space-y-2 space-x-2'
  return (
    <div>
      <Label text={props.label}/>
      <input
        type='text' name={props.name} id={props.id}
        required={props.required ?? true}
        className="sr-only"
        value={props.value}
        onChange={(e) => props.onButtonClick(e.target.value)}
      />
      <div className={style}>
        {props.children}
      </div>
    </div>
  );
}

export interface CheckboxFieldProps {
  label: string; setValue: Function;
  required?: boolean;
  checkBoxStyle?: string;
  fieldStyle?: string;
  name: string; id?: string;
};

export function CheckboxField(props: CheckboxFieldProps) {
  const fieldStyle = props.fieldStyle ?? '';
  const checkBoxStyle = props.checkBoxStyle ?? 'mr-2';

  return (
    <div className={fieldStyle}>
    <label
    >
      <input type='checkbox'
        required={props.required ?? true}
        // value='yes'
        className={checkBoxStyle}
        onChange={(e) => {props.setValue(e.target.checked)}}
      />
      {props.label}
    </label>
    </div>
  );
}

export interface FormContainerProps {
  children: React.ReactNode;
  handleSubmit: (e) => void;
  submitButton?: React.ReactNode;
  formTitleElement?: React.ReactNode;
  containerStyle?: string;
  formStyle?: string;
  formTitle?: string; submitButtonText?: string;
}

export function FormContainer( props: FormContainerProps ) {
  const containerStyle = props.containerStyle ?? 'w-full max-w-[50%] flex-col self-start';
  const formStyle = props.formStyle ?? 'space-y-4 ';

  const formTitleElement = props.formTitleElement ?? (
    <Label text={props.formTitle ?? 'Xác Minh Nhà Xuất Khẩu'} fontSize={FontSizes.FORM_TITLE}/>
  );

  const submitButton = props.submitButton ?? (
    <button
      type="submit"
      /* we really need to standardize the styles man */
      className="
        bg-blue-600 hover:bg-blue-300 text-white p-2.5 rounded-xl font-bold transition-colors ease-in
        w-full m-auto
        " 
    >
      {props.submitButtonText ?? 'Gửi hồ sơ xác minh'}
    </button>
  );
  
  return (
    <div className={containerStyle}>
      {formTitleElement}
      <form 
        onSubmit={props.handleSubmit}
        className={formStyle}
      >
        {props.children}
        {submitButton}
      </form>
    </div>
  );
}
