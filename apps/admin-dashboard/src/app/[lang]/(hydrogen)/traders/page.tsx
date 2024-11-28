import TradersTable from '@/app/shared/tan-table/tradersTable';
import { metaObject } from '@/config/site.config';

export const metadata = {
  ...metaObject('Traders'),
};

export default function Traders({
  params: { lang },
}: {
  params: {
    lang: string;
  };
}) {
  return<>
    {/* <FileDashboard lang={lang} />; */}
    <TradersTable  lang={lang} />
  </>;
}
