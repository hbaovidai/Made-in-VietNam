import React from 'react';
import { LegalAdminEditor } from '../../legal/LegalAdminEditor';

export function AdminLegal() {
  return (
    <LegalAdminEditor
      pageKey="terms"
      pageTitle="Điều khoản sử dụng"
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
