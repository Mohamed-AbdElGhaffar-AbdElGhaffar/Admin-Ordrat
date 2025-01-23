'use client';

import { Button } from 'rizzui';
import cn from '@utils/class-names';
import { useScrollableSlider } from '@hooks/use-scrollable-slider';
import { IconType } from 'react-icons/lib';
import {
  PiCalendarCheck,
  PiCaretLeftBold,
  PiCaretRightBold,
  PiCheckCircle,
  PiClock,
  PiPhoneSlash,
  PiArrowDownRight,
  PiArrowUpRight,
  PiCurrencyDollar,
  PiMotorcycle,
  PiTruck,
  PiUsers,
  PiForkKnife,
  PiChefHat,
} from 'react-icons/pi';
import { useTranslation } from '@/app/i18n/client';
import { API_BASE_URL } from '@/config/base-url';
import { useEffect, useState } from 'react';
import { Loader } from 'lucide-react';
import axiosClient from '@/app/components/context/api';

type AppointmentStatsType = {
  className?: string;
  lang?: string;
};

// const statData: StatType[] = [
//   {
//     title: 'average-order-delivery-time',
//     amount: '26,085',
//     increased: true,
//     percentage: '32.40',
//     icon: PiClock,
//   },
//   {
//     title: 'total-profits',
//     amount: '15,786',
//     increased: true,
//     percentage: '32.40',
//     icon: PiCurrencyDollar,
//   },
//   {
//     title: 'number-of-delivery-drivers',
//     amount: '8,503',
//     increased: false,
//     percentage: '32.40',
//     icon: PiMotorcycle,
//   },
//   {
//     title: 'number-of-merchants',
//     amount: '2,430',
//     increased: true,
//     percentage: '32.40',
//     icon: PiUsers,
//   },
//   {
//     title: 'average-profit-of-restaurants',
//     amount: '1,160',
//     increased: true,
//     percentage: '32.40',
//     icon: PiChefHat, // You can choose an icon based on the context here
//   },
// ];

export type StatType = {
  icon: IconType;
  title: string;
  amount: string;
  increased: boolean;
  percentage: string;
  loading?: boolean;
  iconWrapperFill?: string;
  className?: string;
};

export type StatCardProps = {
  className?: string;
  transaction: StatType;
  lang?: string;
};

function StatCard({ className, transaction, lang }: StatCardProps) {
  const { icon, title, amount, increased, percentage, loading } = transaction;
  const Icon = icon;
  const { t } = useTranslation(lang!, 'dashboard');
  return (
    <div
      className={cn(
        'group w-full rounded-[14px] border border-gray-300 px-6 py-7 @container first:bg-[#e11d48]',
        className
      )}
    >
      {loading ?
        <div className="flex items-center justify-center min-h-[110px]">
          <Loader className="animate-spin text-[#e11d48]" width={40} height={40} />
        </div>
      :
        <>
          <div className="mb-4 flex items-center gap-5">
            <span
              className={cn(
                'flex rounded-[14px] bg-[#e11d48] p-2.5 text-gray-0 group-first:bg-gray-0 group-first:text-[#e11d48] dark:text-gray-900 dark:group-first:bg-gray-900'
              )}
            >
              <Icon className="h-auto w-[30px]" />
            </span>
            <div className="space-y-1.5">
              <p className="font-medium text-gray-500 group-first:text-gray-100 dark:group-first:text-gray-800 truncate overflow-hidden text-ellipsis whitespace-nowrap">
              {t(title)}
              </p>
              <p className="text-lg font-bold text-gray-900 group-first:text-gray-0 dark:text-gray-700 dark:group-first:text-gray-900 2xl:text-[20px] 3xl:text-3xl">
              {amount}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1.5">
            <div
              className={cn(
                'flex items-center gap-1 ',
                increased ? 'text-green-dark ' : 'text-red-dark'
              )}
            >
              <span
                className={cn(
                  'flex rounded-full  px-2.5 py-1.5 group-first:bg-gray-0 dark:group-first:bg-gray-900 dark:group-first:text-green-700',
                  increased
                    ? 'bg-green-lighter/70 dark:bg-green-dark/30'
                    : 'bg-red-lighter/70 dark:bg-red-dark/30'
                )}
              >
                {increased ? (
                  <PiArrowUpRight className="h-auto w-4" />
                ) : (
                  <PiArrowDownRight className="h-auto w-4" />
                )}
              </span>
              <span className="font-semibold leading-none group-first:text-gray-0 dark:group-first:text-gray-900">
              {lang === 'ar' 
                ? `${percentage}% ${increased ? '+' : '-'}` 
                : `${increased ? '+' : '-'}${percentage}%`}
              </span>
            </div>
            <span className="truncate leading-none text-gray-500 group-first:text-gray-100 dark:group-first:text-gray-800">
            {increased
                ? lang === 'ar'
                  ? 'زيادة الشهر الماضي'
                  : 'Increased last month'
                : lang === 'ar'
                ? 'انخفاض الشهر الماضي'
                : 'Decreased last month'}
            </span>
          </div>
        </>
      }
    </div>
  );
}

export function StatGrid({ lang }:{ lang? : string} ) {
  const [statData, setStatData] = useState<StatType[]>([
    {
      title: 'average-order-delivery-time',
      amount: '26,085',
      increased: true,
      percentage: '32.40',
      icon: PiClock,
    },
    {
      title: 'total-profits',
      amount: '15,786',
      increased: true,
      percentage: '32.40',
      icon: PiCurrencyDollar,
    },
    {
      title: 'number-of-delivery-drivers',
      amount: '',
      increased: false,
      percentage: '32.40',
      icon: PiMotorcycle,
      loading: true,
    },
    {
      title: 'number-of-merchants',
      amount: '',
      increased: true,
      percentage: '32.40',
      icon: PiUsers,
      loading: true,
    },
    {
      title: 'average-profit-of-restaurants',
      amount: '1,160',
      increased: true,
      percentage: '32.40',
      icon: PiChefHat,
    },
  ]);

  useEffect(() => {
    const fetchNumberOfMerchants = async () => {
      try {
        const response = await axiosClient.get('/api/AdminStatistics/GetTotalSellers', {
          headers: { 'Accept-Language': lang || 'en' },
        });
    
        if (response.status === 200) {
          const { numberOfSellers } = await response.data;
          setStatData((prevData) =>
            prevData.map((stat) =>
              stat.title === 'number-of-merchants'
                ? { ...stat, amount: numberOfSellers.toString(), loading: false }
                : stat
            )
          );
        } else {
          console.error('Failed to fetch number of merchants');
        }
      } catch (error: any) {
        console.error('Error fetching number of merchants:', error.response || error.message);
      }
    };
    const fetchNumberOfDelivery = async () => {
      try {
        const response = await axiosClient.get('/api/AdminStatistics/GetOrdratTotalDeliveries', {
          headers: { 'Accept-Language': lang || 'en' },
        });
    
        if (response.status === 200) {
          const { numberOfOrdratDeliveries } = response.data;
          setStatData((prevData) =>
            prevData.map((stat) =>
              stat.title === 'number-of-delivery-drivers'
                ? { ...stat, amount: numberOfOrdratDeliveries.toString(), loading: false }
                : stat
            )
          );
        } else {
          console.error('Failed to fetch number of merchants');
        }
      } catch (error: any) {
        console.error('Error fetching number of merchants:', error.response || error.message);
      }
    };

    fetchNumberOfMerchants();
    fetchNumberOfDelivery();
  }, [lang]);

  return (
    <>
      {statData.map((stat: StatType, index: number) => {
        return (
          <StatCard
            key={'stat-card-' + index}
            transaction={stat}
            className="min-w-[300px]"
            lang={lang}
          />
        );
      })}
    </>
  );
}

export default function AppointmentStats({ className, lang }: AppointmentStatsType) {
  const {
    sliderEl,
    sliderPrevBtn,
    sliderNextBtn,
    scrollToTheRight,
    scrollToTheLeft,
  } = useScrollableSlider();

  return (
    <div
      className={cn(
        'relative flex w-auto items-center overflow-hidden',
        className
      )}
    >
      <Button
        title="Prev"
        variant="text"
        ref={sliderPrevBtn}
        onClick={() => scrollToTheLeft()}
        className="!absolute -left-1 top-0 z-10 !h-full w-20 !justify-start rounded-none bg-gradient-to-r from-gray-0 via-gray-0/70 to-transparent px-0 ps-1 text-gray-500 hover:text-gray-900 dark:from-gray-50 dark:via-gray-50/70 3xl:hidden"
      >
        <PiCaretLeftBold className="h-5 w-5" />
      </Button>
      <div className="w-full overflow-hidden">
        <div
          ref={sliderEl}
          className="custom-scrollbar-x grid grid-flow-col gap-5 overflow-x-auto scroll-smooth 2xl:gap-6 "
        >
          <StatGrid lang={lang} />
        </div>
      </div>
      <Button
        title="Next"
        variant="text"
        ref={sliderNextBtn}
        onClick={() => scrollToTheRight()}
        className="dark: !absolute -right-2 top-0 z-10 !h-full w-20 !justify-end rounded-none bg-gradient-to-l from-gray-0 via-gray-0/70 to-transparent px-0 pe-2 text-gray-500 hover:text-gray-900 dark:from-gray-50 dark:via-gray-50/70 3xl:hidden "
      >
        <PiCaretRightBold className="h-5 w-5" />
      </Button>
    </div>
  );
}
