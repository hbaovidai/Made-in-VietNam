import { Helmet } from 'react-helmet-async';

interface SEOHeadProps {
  title?: string;
  description?: string;
  keywords?: string;
  ogImage?: string;
  canonical?: string;
}

const SITE_NAME = 'VIEproduct';
const DEFAULT_DESCRIPTION = 'Nền tảng B2B hàng đầu kết nối nhà cung cấp Việt Nam với thị trường toàn cầu. Tìm kiếm sản phẩm, nhà sản xuất uy tín và dịch vụ thương mại quốc tế.';

export function SEOHead({
  title,
  description = DEFAULT_DESCRIPTION,
  keywords = 'VIEproduct, B2B, thương mại quốc tế, nhà cung cấp Việt Nam, sản phẩm Việt Nam, xuất khẩu',
  ogImage,
  canonical,
}: SEOHeadProps) {
  const fullTitle = title ? `${title} | ${SITE_NAME}` : `${SITE_NAME} - B2B Global Trade Platform`;

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />

      {/* Open Graph */}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content={SITE_NAME} />
      {ogImage && <meta property="og:image" content={ogImage} />}
      {canonical && <meta property="og:url" content={canonical} />}

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      {ogImage && <meta name="twitter:image" content={ogImage} />}

      {/* Canonical */}
      {canonical && <link rel="canonical" href={canonical} />}
    </Helmet>
  );
}
