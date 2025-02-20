import SessionGuard from '@/app/components/guard/SessionGuard';
import ArticleTable from '@/app/shared/tan-table/articleTable';
import { metaObject } from '@/config/site.config';

export const metadata = {
  ...metaObject('Article'),
};

export default function Article({
  params: { lang },
}: {
  params: {
    lang: string;
  };
}) {
  return<>
    <SessionGuard lang={lang}>
      <ArticleTable lang={lang} />
    </SessionGuard>
  </>;
}
