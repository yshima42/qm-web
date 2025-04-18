import { useLocale, useTranslations } from 'next-intl';

import LocaleSwitcherSelect from './locale-switcher-select';

export default function LocaleSwitcher() {
  const t = useTranslations('locale-switcher');
  const locale = useLocale();

  return (
    <LocaleSwitcherSelect
      defaultValue={locale}
      items={[
        {
          value: 'en',
          label: t('en'),
        },
        {
          value: 'ja',
          label: t('ja'),
        },
      ]}
      label={t('label')}
    />
  );
}
