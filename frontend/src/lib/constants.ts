// rename this later
export enum FontSizes {
  NORMAL = 'text-[16px]',
  FORM_FIELD_SECTION_TITLE = 'text-[22px]',
}

export const formLabel = (fontSizes: FontSizes = FontSizes.NORMAL) => {
  return `${fontSizes} font-bold text-[#0F172A]`;
};

export const formBoxStyle = 'w-full px-4 py-3.5 bg-[#F8FAFC] border border-slate-200 rounded-xl hover:border hover:border-blue-950 focus:outline-none focus:border focus:border-blue-950';
