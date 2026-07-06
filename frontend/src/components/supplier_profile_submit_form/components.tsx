import { formLabel, formBoxStyle } from "@/src/lib/constants";

export function Label( { text, fontSize = undefined }: { text: any; fontSize?: any } ) {
  return (
    <label className={formLabel(fontSize)}
    >{text}</label>
  )
}

export function FormFieldTextInput( { value, setValue, placeHolder, required = true } ) {
  return (
    <input
      required={required}
      type="text"
      value={value}
      onChange={(e) => setValue(e.target.value) }
      placeholder={placeHolder}
      className={`${formBoxStyle}`}
    />
  );
}

export function FormField({ label, value, setValue, placeHolder=label, required=true}) {
  return (
    <div className="space-y-2">
      <Label text={label}/>
      <FormFieldTextInput
        value={value}
        setValue={setValue}
        placeHolder={placeHolder}
        required={required}
      />
    </div>
  );
}

export function Selection( { label, value, setValue, options } ) {
  return (
    <div className="space-y-2">
      <label className={formLabel()}>
        {label}
      </label>

      <select
        required
        value={value}
        onChange={(e)=>setValue(e.target.value)}
        className={`${formBoxStyle}`}
      >
        {options && Object.keys(options).map(optionLabel => {
          return (
            <option value={options[optionLabel]}>{optionLabel}</option>
          );
        })}
      </select>
    </div>
  );
}

export function UploadField( { label, handleUpload, urlArray } ) {
  return (
    <div className="space-y-2 flex flex-col">
      <Label text={label}/>
      <input type="file" required
        accept=".png,.jpg,.jpeg,.pdf,.webp"
        className="w-full px-4 py-3.5 text-[13px] text-justify
          rounded-xl bg-blue-200 hover:border hover:border-blue-950
          file:mr-4 file:py-2 file:px-4
          file:rounded-md file:border-0
          file:text-sm file:font-semibold
          file:bg-blue-50 file:text-[#0F172A]
          hover:file:bg-blue-100
          cursor-pointer"
        onChange={(e) => handleUpload(e, urlArray)}
      />
    </div>
  );
}
