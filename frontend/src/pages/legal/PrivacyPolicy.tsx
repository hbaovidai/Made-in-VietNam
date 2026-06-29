import React from 'react';
import { useTranslation } from 'react-i18next';
import { LegalPageLayout } from './LegalComponents';

export function PrivacyPolicy() {
  const { t } = useTranslation();

  return (
    <LegalPageLayout
      pageKey="privacy"
      breadcrumbLabel={t('privacy_policy') || 'Chính sách bảo mật'}
      seoTitle={t('privacy_hero_title') || 'Chính sách bảo mật'}
      seoKeywords="chính sách bảo mật, privacy policy, VIEProduct"
      defaultTitle={t('privacy_hero_title') || 'Chính sách bảo mật'}
      defaultSubtitle={t('privacy_hero_subtitle') || 'Chúng tôi cam kết bảo vệ dữ liệu cá nhân và quyền riêng tư của bạn.'}
      defaultLastUpdated="2026-06-24"
      settingsKeys={{
        titleVi: 'privacy_policy_title_vi',
        titleEn: 'privacy_policy_title_en',
        subtitleVi: 'privacy_policy_subtitle_vi',
        subtitleEn: 'privacy_policy_subtitle_en',
        lastUpdated: 'privacy_policy_last_updated',
        bannerBg: 'privacy_policy_banner_bg',
      }}
    />
  );
}
