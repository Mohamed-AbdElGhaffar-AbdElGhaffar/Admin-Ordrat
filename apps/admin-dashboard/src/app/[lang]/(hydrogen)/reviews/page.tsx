import ReviewsTable from '@/app/shared/tan-table/reviewsTable';
import { metaObject } from '@/config/site.config';

export const metadata = {
  ...metaObject('Reviews'),
};

export default function Reviews({
  params: { lang },
}: {
  params: {
    lang: string;
  };
}) {
  return<>
    {/* <FileDashboard lang={lang} />; */}
    <ReviewsTable  lang={lang} />
  </>;
}
