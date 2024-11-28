import AccountsTable from '@/app/shared/tan-table/accountsTable';
import { metaObject } from '@/config/site.config';

export const metadata = {
  ...metaObject('Accounts'),
};

export default function Accounts({
  params: { lang },
}: {
  params: {
    lang: string;
  };
}) {
  return<>
    {/* <FileDashboard lang={lang} />; */}
    <AccountsTable  lang={lang} />
  </>;
}
