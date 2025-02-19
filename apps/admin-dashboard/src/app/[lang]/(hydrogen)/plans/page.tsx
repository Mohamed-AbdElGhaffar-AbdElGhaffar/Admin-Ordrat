import SessionGuard from '@/app/components/guard/SessionGuard';
import MetricCardsWithIcon from '@/app/shared/support/dashboard/dashboard-statistics';
import AdvantageTable from '@/app/shared/tan-table/advantageTable';
import PlanTable from '@/app/shared/tan-table/planTable';
import { metaObject } from '@/config/site.config';

export const metadata = {
  ...metaObject('plans'),
};

export default function Plans({
  params: { lang },
}: {
  params: {
    lang: string;
  };
}) {
  return<>
    {/* <FileDashboard lang={lang} />; */}
    <SessionGuard lang={lang}>
      <div className='flex flex-col gap-5'>
        <div className="grid grid-cols-1 gap-6 @container 3xl:gap-8 mb-5 2xl:mb-8">
          <MetricCardsWithIcon className="@md:grid-cols-2 @xl:grid-cols-3 @2xl:grid-cols-3 @6xl:grid-cols-5 4xl:gap-8" />
        </div>
        <PlanTable  lang={lang} />
        <AdvantageTable  lang={lang} />
      </div>
    </SessionGuard>
  </>;
}
