import { useTranslation } from 'react-i18next';

/**
 * Hook giúp lấy đúng trường dữ liệu theo ngôn ngữ hiện tại.
 * 
 * Ví dụ:
 *   const localized = useLocalized();
 *   localized(product, 'name')         → product.nameEn (nếu đang EN) hoặc product.name (nếu đang VI)
 *   localized(product, 'description')  → product.descriptionEn hoặc product.description
 *   localized(category, 'name')        → category.nameEn hoặc category.name
 */
export function useLocalized() {
  const { i18n } = useTranslation();
  const isEn = i18n.language === 'en';

  return function localized(obj: any, field: string): string {
    if (!obj) return '';
    if (isEn) {
      const enField = `${field}En`;
      // Dùng bản dịch tiếng Anh nếu có, fallback về tiếng Việt
      return obj[enField] || obj[field] || '';
    }
    return obj[field] || '';
  };
}
