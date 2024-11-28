'use client';

import cn from '@utils/class-names';
// import TicketIcon from '@components/icons/ticket';
import TagIcon from '@components/icons/tag';
import MetricCard from '@components/cards/metric-card';
import TagIcon2 from '@components/icons/tag-2';
import TagIcon3 from '@components/icons/tag-3';
import { useTranslation } from '@/app/i18n/client';
import {
  PiCalendarCheck,
  PiCaretLeftBold,
  PiCaretRightBold,
  PiCheckCircle,
  PiClock,
  PiPhoneSlash,
  PiArrowDownRight,
  PiArrowUpRight,
} from 'react-icons/pi';
import ClockIcon from './clock';
import TotalProfitsIcon from './profits';
import DriversIcon from './drivers';
import RestaurantsIcon from './restaurants';

const ticketStats = [
  {
    id: 1,
    icon: <ClockIcon className="h-full w-full" />,
    title: 'average-order-delivery-time',
    metric: '12,450',
  },
  {
    id: 2,
    icon: <TotalProfitsIcon className="h-full w-full" />,
    title: 'total-profits',
    metric: '3,590',
  },
  {
    id: 3,
    icon: <DriversIcon className="h-full w-full" />,
    title: 'number-of-delivery-drivers',
    metric: '7,890',
  },
  {
    id: 4,
    icon: <TagIcon3 className="h-full w-full" />,
    title: 'number-of-merchants',
    metric: '1,160',
  },
  {
    id: 5,
    icon: <RestaurantsIcon className="h-full w-full" />,
    title: 'average-profit-of-restaurants',
    metric: '1,160',
  },
];

export default function StatCards({
  className,
  lang,
}: {
  className?: string;
  lang?: string;
}) {
  const { t } = useTranslation(lang!, 'dashboard');
  return (
    <div
      className={cn('grid grid-cols-1 gap-5 3xl:gap-8 4xl:gap-9', className)}
    >
      {ticketStats.map((stat) => (
        <MetricCard
          key={stat.title + stat.id}
          title={t(stat.title)}
          metric={stat.metric}
          icon={stat.icon}
          iconClassName="bg-transparent w-11 h-11"
        />
      ))}
    </div>
  );
}
