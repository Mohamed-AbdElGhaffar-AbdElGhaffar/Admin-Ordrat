import SessionGuard from '@/app/components/guard/SessionGuard';
import ArticalTable from '@/app/shared/tan-table/articalTable';
import { metaObject } from '@/config/site.config';

export const metadata = {
  ...metaObject('Artical'),
};

export default function Artical({
  params: { lang },
}: {
  params: {
    lang: string;
  };
}) {
  return<>
    <SessionGuard lang={lang}>
      <ArticalTable lang={lang} />
    </SessionGuard>
  </>;
}
