export const dynamic = 'force-dynamic';

import { redirect } from 'next/navigation';

import { EXTERNAL_URLS } from '@/lib/urls';

export default function Page() {
  redirect(EXTERNAL_URLS.LP);
}
