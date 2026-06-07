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
      <h2>{t('tos_sect_1_title')}</h2>
      <p>
        {t('tos_sect_1_point_1')}
      </p>
      <p>
        {t('tos_sect_1_point_2')}
      </p>
      <ul>
        <li>- {t('tos_sect_1_item_1')}</li>
        <li>- {t('tos_sect_1_item_2')}</li>
        <li>- {t('tos_sect_1_item_3')}</li>
        <li>- {t('tos_sect_1_item_4')}</li>
      </ul>

      <h2>{t('tos_sect_2_title')}</h2>
      <p>
        {t('tos_sect_2_point_1')}
      </p>
      <p>
        {t('tos_sect_2_point_2')}
      </p>

      <h2>{t('tos_sect_3_title')}</h2>
      <p>
        {t('tos_sect_3_point_1')}
      </p>
      <p>
        {t('tos_sect_3_declaration_title')}
      </p>
      <p>
        {t('tos_sect_3_declaration_desc')}
      </p>

      <h2>{t('tos_sect_4_title')}</h2>
      <p>
        {t('tos_sect_4_point')}
      </p>
      <ul>
        <li>- {t('tos_sect_4_item_1')}</li>
        <li>- {t('tos_sect_4_item_2')}</li>
      </ul>

      <h2>{t('tos_sect_5_title')}</h2>
      <p>
        {t('tos_sect_5_point_1')}
      </p>
      <p>
        {t('tos_sect_5_point_2')}
      </p>

      <h2>{t('tos_sect_6_title')}</h2>
      <p>
        {t('tos_sect_6_point_1')}
      </p>
      <p>
        {t('tos_sect_6_point_2')}
      </p>

      <h2>{t('tos_sect_7_title')}</h2>
      <p>
        {t('tos_sect_7_point_1')}
      </p>
      <p>
        {t('tos_sect_7_point_2')}
      </p>

      <h2>{t('tos_sect_8_title')}</h2>
      <p>
        {t('tos_sect_8_point_1')}
      </p>
      <p>
        {t('tos_sect_8_point_2')}
      </p>

      <h2>{t('tos_sect_9_title')}</h2>
      <p>
        {t('tos_sect_9_point_1')}
      </p>
      <p>
        {t('tos_sect_9_point_2')}
      </p>

    </PolicyLayout>
  );
}
