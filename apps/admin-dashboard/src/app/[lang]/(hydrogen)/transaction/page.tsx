import SessionGuard from '@/app/components/guard/SessionGuard';
import TransactionHistoryTable from '@/app/shared/tan-table/transaction-history-table';
import { metaObject } from '@/config/site.config';

export const metadata = {
  ...metaObject('Transaction'),
};

export default function Transaction({
  params: { lang },
}: {
  params: {
    lang: string;
  };
}) {
  return<>
    <SessionGuard lang={lang}>
      <TransactionHistoryTable className="col-span-full" lang={lang} />
    </SessionGuard>
  </>;
}
