import { Helmet } from 'react-helmet-async';
import { useAppearance } from '../contexts/AppearanceContext';

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

export function SEOHead({
  title,
  description,
  keywords = 'VIEProduct, B2B, thương mại quốc tế, nhà cung cấp Việt Nam, sản phẩm Việt Nam, xuất khẩu, Made in Vietnam',
  ogImage,
  canonical,
  ogType = 'website',
  structuredData,
  noindex = false,
}: SEOHeadProps) {
  const { settings } = useAppearance();
  const siteName = settings.site_name || 'VIEProduct';
  const siteUrl = settings.site_url || 'https://vieproduct.com';
  const tagline = settings.site_tagline || '';

  const defaultDesc = settings.site_description || 'VIEProduct - Nền tảng B2B hàng đầu kết nối nhà cung cấp Việt Nam với thị trường toàn cầu. Tìm kiếm sản phẩm, nhà sản xuất uy tín và dịch vụ thương mại quốc tế.';
  const finalDesc = description || defaultDesc;

  const defaultOgImage = `${siteUrl}/og-image.png`;
  const finalOgImage = ogImage || defaultOgImage;

  const fullTitle = title ? `${title} | ${siteName}` : (tagline ? `${siteName} - ${tagline}` : `${siteName} - B2B Global Trade Platform`);
  const fullCanonical = canonical ? `${siteUrl}${canonical}` : undefined;

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={finalDesc} />
      <meta name="keywords" content={keywords} />
      {noindex && <meta name="robots" content="noindex, nofollow" />}

      {/* Open Graph */}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={finalDesc} />
      <meta property="og:type" content={ogType} />
      <meta property="og:site_name" content={siteName} />
      <meta property="og:image" content={finalOgImage} />
      {fullCanonical && <meta property="og:url" content={fullCanonical} />}
      <meta property="og:locale" content="vi_VN" />
      <meta property="og:locale:alternate" content="en_US" />

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={finalDesc} />
      <meta name="twitter:image" content={finalOgImage} />

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
