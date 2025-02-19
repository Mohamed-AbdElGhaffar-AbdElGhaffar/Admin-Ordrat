import SessionGuard from '@/app/components/guard/SessionGuard';
import ReviewsTable from '@/app/shared/tan-table/reviewsTable';
import StoresTable from '@/app/shared/tan-table/storesTable';
import { metaObject } from '@/config/site.config';

export const metadata = {
  ...metaObject('Stores'),
};

export default function Stores({
  params: { lang },
}: {
  params: {
    lang: string;
  };
}) {
  return<>
    {/* <FileDashboard lang={lang} />; */}
    <SessionGuard lang={lang}>
      <StoresTable  lang={lang} />
    </SessionGuard>
  </>;
}
