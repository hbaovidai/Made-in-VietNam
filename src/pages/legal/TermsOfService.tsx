import React from 'react';
import { useTranslation } from 'react-i18next';
import { PolicyLayout } from '../../components/PolicyLayout';

export function TermsOfService() {
  const { t } = useTranslation();
  return (
    <PolicyLayout 
      title={t('terms_of_service')} 
      lastUpdated={t('terms_last_updated')}
      breadcrumbs={[{ label: t('legal'), href: "/privacy" }, { label: t('terms_of_service') }]}
    >
      <h2>1. {t('terms_section_1_title')}</h2>
      <p>
        {t('terms_section_1_desc')}
      </p>

      <h2>2. {t('terms_section_2_title')}</h2>
      <p>
        {t('terms_section_2_desc')}
      </p>
      <ul>
        <li>{t('terms_section_2_point_1')}</li>
        <li>{t('terms_section_2_point_2')}</li>
        <li>{t('terms_section_2_point_3')}</li>
        <li>{t('terms_section_2_point_4')}</li>
        <li>{t('terms_section_2_point_5')}</li>
      </ul>

      <h2>3. {t('terms_section_3_title')}</h2>
      <p>
        {t('terms_section_3_desc')}
      </p>

      <h2>4. {t('terms_section_4_title')}</h2>
      <p>
        {t('terms_section_4_desc')}
      </p>

      <h2>5. {t('terms_section_5_title')}</h2>
      <p>
        {t('terms_section_5_desc')}
      </p>

      <h2>6. {t('terms_section_6_title')}</h2>
      <p>
        {t('terms_section_6_desc')}
      </p>

      <h2>7. {t('terms_section_7_title')}</h2>
      <p>
        {t('terms_section_7_desc')}
      </p>
    </PolicyLayout>
  );
}
