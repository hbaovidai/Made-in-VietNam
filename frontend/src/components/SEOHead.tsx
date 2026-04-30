import { Helmet } from 'react-helmet-async';

interface SEOHeadProps {
  title?: string;
  description?: string;
  keywords?: string;
  ogImage?: string;
  canonical?: string;
  ogType?: string;
  structuredData?: object;
  noindex?: boolean;
}

const SITE_NAME = 'VIEProduct';
const SITE_URL = 'https://vieproduct.com';
const DEFAULT_DESCRIPTION = 'VIEProduct - Nền tảng B2B hàng đầu kết nối nhà cung cấp Việt Nam với thị trường toàn cầu. Tìm kiếm sản phẩm, nhà sản xuất uy tín và dịch vụ thương mại quốc tế.';
const DEFAULT_OG_IMAGE = `${SITE_URL}/og-image.png`;

export function SEOHead({
  title,
  description = DEFAULT_DESCRIPTION,
  keywords = 'VIEProduct, B2B, thương mại quốc tế, nhà cung cấp Việt Nam, sản phẩm Việt Nam, xuất khẩu, Made in Vietnam',
  ogImage = DEFAULT_OG_IMAGE,
  canonical,
  ogType = 'website',
  structuredData,
  noindex = false,
}: SEOHeadProps) {
  const fullTitle = title ? `${title} | ${SITE_NAME}` : `${SITE_NAME} - B2B Global Trade Platform`;
  const fullCanonical = canonical ? `${SITE_URL}${canonical}` : undefined;

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      {noindex && <meta name="robots" content="noindex, nofollow" />}

      {/* Open Graph */}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content={ogType} />
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:image" content={ogImage} />
      {fullCanonical && <meta property="og:url" content={fullCanonical} />}
      <meta property="og:locale" content="vi_VN" />
      <meta property="og:locale:alternate" content="en_US" />

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />

      {/* Canonical */}
      {fullCanonical && <link rel="canonical" href={fullCanonical} />}

      {/* JSON-LD Structured Data */}
      {structuredData && (
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      )}
    </Helmet>
  );
}
