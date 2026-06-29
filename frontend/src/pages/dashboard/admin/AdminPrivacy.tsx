import React from 'react';
import { LegalAdminEditor } from '../../legal/LegalAdminEditor';

export function AdminPrivacy() {
  return (
    <LegalAdminEditor
      pageKey="privacy"
      pageTitle="Chính sách bảo mật"
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
