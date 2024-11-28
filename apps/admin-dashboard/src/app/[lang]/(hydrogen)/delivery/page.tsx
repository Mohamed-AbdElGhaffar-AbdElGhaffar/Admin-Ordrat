import DeliveryTable from '@/app/shared/tan-table/deliveryTable';
import { metaObject } from '@/config/site.config';

export const metadata = {
  ...metaObject('Delivery'),
};

export default function Delivery({
  params: { lang },
}: {
  params: {
    lang: string;
  };
}) {
  return<>
    {/* <FileDashboard lang={lang} />; */}
    <DeliveryTable  lang={lang} />
  </>;
}
