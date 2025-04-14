import { useTranslations } from 'next-intl';

import LocaleSwitcher from '@/components/ui/locale-switcher';

export const dynamic = 'force-dynamic';

// import { redirect } from 'next/navigation';

// import { EXTERNAL_URLS } from '@/lib/urls';

export default function Page() {
  const t = useTranslations('HomePage');
  return (
    <div>
      <div>{t('title')}</div>
      <LocaleSwitcher />
    </div>
  );
  // redirect(EXTERNAL_URLS.LP);
}
