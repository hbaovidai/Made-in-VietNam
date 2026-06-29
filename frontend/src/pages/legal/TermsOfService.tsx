import React from 'react';
import { useTranslation } from 'react-i18next';
import { LegalPageLayout } from './LegalComponents';

export function TermsOfService() {
  const { t } = useTranslation();

  return (
    <LegalPageLayout
      pageKey="terms"
      breadcrumbLabel={t('terms_of_service') || 'Điều khoản dịch vụ'}
      seoTitle={t('terms_hero_title') || 'Điều khoản dịch vụ'}
      seoKeywords="điều khoản, terms of service, VIEProduct"
      defaultTitle={t('terms_hero_title') || 'Điều khoản dịch vụ'}
      defaultSubtitle={t('terms_hero_subtitle') || 'Điều khoản và điều kiện sử dụng dịch vụ nền tảng VIEProduct B2B Trade.'}
      defaultLastUpdated="2026-06-24"
      settingsKeys={{
        titleVi: 'legal_terms_title_vi',
        titleEn: 'legal_terms_title_en',
        subtitleVi: 'legal_terms_subtitle_vi',
        subtitleEn: 'legal_terms_subtitle_en',
        lastUpdated: 'legal_terms_last_updated',
        bannerBg: 'legal_terms_banner_bg',
      }}
    />
  );
}
