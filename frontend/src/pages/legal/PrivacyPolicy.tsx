import React from 'react';
import { useTranslation, Trans } from 'react-i18next';
import { PolicyLayout } from '../../components/PolicyLayout';

export function PrivacyPolicy() {
  const { t } = useTranslation();
  return (
    <PolicyLayout 
      title={t('privacy_policy')} 
      lastUpdated={t('privacy_last_updated')}
      breadcrumbs={[{ label: t('legal'), href: "/terms" }, { label: t('privacy_policy') }]}
    >
      <h2>1. {t('privacy_section_1_title')}</h2>
      <p>
        {t('privacy_section_1_desc')}
      </p>

      <h2>2. {t('privacy_section_2_title')}</h2>
      <p>
        {t('privacy_section_2_desc_1')}
      </p>
      <p>
        {t('privacy_section_2_desc_2')}
      </p>
      <ul>
        <li><strong>{t('identity_data')}</strong> {t('identity_data_desc')}</li>
        <li><strong>{t('contact_data')}</strong> {t('contact_data_desc')}</li>
        <li><strong>{t('financial_data')}</strong> {t('financial_data_desc')}</li>
        <li><strong>{t('transaction_data')}</strong> {t('transaction_data_desc')}</li>
        <li><strong>{t('technical_data')}</strong> {t('technical_data_desc')}</li>
      </ul>

      <h2>3. {t('privacy_section_3_title')}</h2>
      <p>
        {t('privacy_section_3_desc')}
      </p>
      <ul>
        <li>{t('privacy_section_3_point_1')}</li>
        <li>{t('privacy_section_3_point_2')}</li>
        <li>{t('privacy_section_3_point_3')}</li>
      </ul>

      <h2>4. {t('privacy_section_4_title')}</h2>
      <p>
        {t('privacy_section_4_desc')}
      </p>

      <h2>5. {t('privacy_section_5_title')}</h2>
      <p>
        {t('privacy_section_5_desc')}
      </p>
    </PolicyLayout>
  );
}
