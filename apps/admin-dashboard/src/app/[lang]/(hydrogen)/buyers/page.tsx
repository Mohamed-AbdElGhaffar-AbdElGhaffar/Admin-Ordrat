import BuyersTable from '@/app/shared/tan-table/buyersTable';
import { metaObject } from '@/config/site.config';

export const metadata = {
  ...metaObject('Buyers'),
};

export default function Buyers({
  params: { lang },
}: {
  params: {
    lang: string;
  };
}) {
  return<>
    {/* <FileDashboard lang={lang} />; */}
    <BuyersTable  lang={lang} />
  </>;
}
