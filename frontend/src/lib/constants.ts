export enum FontSizes {
  NORMAL = 'text-[16px]',
  FORM_FIELD_SECTION_TITLE = 'text-[22px]',
  FORM_TITLE = 'text-[30px]',
}

export const formLabel = (fontSizes: FontSizes = FontSizes.NORMAL) => {
  return `${fontSizes} font-bold text-[#0F172A]`;
};

export const formBoxStyle = 'w-full px-4 py-3.5 bg-[#F8FAFC] border border-slate-200 rounded-xl hover:border hover:border-blue-950 focus:outline-none focus:border focus:border-blue-950 focus:placeholder-blue-950 transition-colors ease-in hover:placeholder-blue-950';

export const verSuppRegFormUploadStyle = "w-full border border-dashed border-gray-400 border-2 rounded-0 justify-center items-center flex flex-col text-center space-y-4 p-4 text-gray-400 hover:border-blue-950 transition-colors ease-in hover:text-blue-950";
