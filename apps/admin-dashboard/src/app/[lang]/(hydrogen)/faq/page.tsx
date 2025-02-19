import SessionGuard from '@/app/components/guard/SessionGuard';
import FaqTable from '@/app/shared/tan-table/faqTable';
import { metaObject } from '@/config/site.config';

export const metadata = {
  ...metaObject('FAQ'),
};

export default function FAQ({
  params: { lang },
}: {
  params: {
    lang: string;
  };
}) {
  return<>
    <SessionGuard lang={lang}>
      <FaqTable  lang={lang} />
    </SessionGuard>
  </>;
}
