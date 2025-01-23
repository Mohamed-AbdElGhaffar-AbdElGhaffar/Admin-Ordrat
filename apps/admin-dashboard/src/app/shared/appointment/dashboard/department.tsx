'use client';

import WidgetCard from '@components/cards/widget-card';
import TrendingUpIcon from '@components/icons/trending-up';
import { Title } from 'rizzui';
import cn from '@utils/class-names';
import {
  ResponsiveContainer,
  XAxis,
  YAxis,
  Bar,
  LabelList,
  ComposedChart,
} from 'recharts';
import SimpleBar from 'simplebar-react';
import DropdownAction from '@components/charts/dropdown-action';
import { formatNumber } from '@utils/format-number';
import { useTranslation } from '@/app/i18n/client';
import { useEffect, useState } from 'react';
import axiosClient from '@/app/components/context/api';
import { Loader } from 'lucide-react';

const data = [
  {
    name: 'Dr. Consultant',
    total: 530,
    fill: '#2B7F75',
  },
  {
    name: 'Therapy',
    total: 915,
    fill: '#FFD66B',
  },
  {
    name: 'Conference',
    total: 785,
    fill: '#04364A',
  },
  {
    name: 'Training',
    total: 345,
    fill: '#176B87',
  },
  {
    name: 'Marketing',
    total: 915,
    fill: '#64CCC5',
  },
  {
    name: 'Management',
    total: 260,
    fill: '#F7B787',
  },
];
const localizedData = {
  en: [
    { name: 'karam ElSham', total: 530, fill: '#e11d48' },
    { name: 'Shop 2', total: 915, fill: '#ec4561' },
    { name: 'Shop 3', total: 785, fill: '#f46d78' },
    { name: 'Shop 4', total: 345, fill: '#fa8e95' },
    { name: 'Shop 5', total: 915, fill: '#ffc1c9' },
    { name: 'Shop 6', total: 260, fill: '#ffebee' },
  ],
  ar: [
    { name: 'متجر كرم الشام', total: 530, fill: '#e11d48' },
    { name: 'المتجر 2', total: 915, fill: '#ec4561' },
    { name: 'المتجر 3', total: 785, fill: '#f46d78' },
    { name: 'المتجر 4', total: 345, fill: '#fa8e95' },
    { name: 'المتجر 5', total: 915, fill: '#ffc1c9' },
    { name: 'المتجر 6', total: 260, fill: '#ffebee' },
  ],
};

const viewOptions = [
  {
    value: 'Daily',
    label: 'Daily',
  },
  {
    value: 'Monthly',
    label: 'Monthly',
  },
];

export default function Department({ className, lang }: { className?: string; lang: string; }) {
  function handleChange(viewType: string) {
    console.log('viewType', viewType);
  }

  const { t } = useTranslation(lang!, "dashboardTable");
  // const [chartData, setChartData] = useState(localizedData['en']);

  // useEffect(() => {
  //   if (lang == 'ar') {
  //     setChartData(localizedData[lang]);
  //   }else{
  //     setChartData(localizedData['en']);
  //   }
  // }, [lang]);
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch data from API
  const fetchBestSellers = async () => {
    try {
      const response = await axiosClient.get('/api/AdminStatistics/GetBestSellers', {
        headers: {
          'Accept-Language': lang || 'en',
        },
      });

      if (response.status === 200) {
        const bestSellers = response.data.slice(0, 6); // Take the first 6 entries
        const transformedData = bestSellers.map((seller: any, index: number) => ({
          name: seller.name,
          total: seller.totalSales,
          fill: ['#2B7F75', '#FFD66B', '#04364A', '#176B87', '#64CCC5', '#F7B787'][index % 6], // Dynamic fill colors
        }));
        setChartData(transformedData);
      } else {
        console.error('Failed to fetch best sellers');
      }
    } catch (error: any) {
      console.error('Error fetching best sellers:', error.response || error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBestSellers();
  }, [lang]);

  return (
    <WidgetCard
      title={t('table-title')}
      titleClassName="text-gray-700 font-normal sm:text-sm font-inter"
      headerClassName="items-center"
      className={cn('@container', className)}
      // action={
      //   <DropdownAction
      //     className="rounded-lg border"
      //     options={viewOptions}
      //     onChange={handleChange}
      //     dropdownClassName="!z-0"
      //   />
      // }
    >
      {loading?
        <div className="w-full flex items-center justify-center min-h-[200px]">
          <Loader className="animate-spin text-[#e11d48]" width={40} height={40} />
        </div>
        :
        <>
          <div className="mb-4 mt-2 flex items-center gap-2 @lg:mt-1">
            <Title as="h2" className="font-inter font-bold">
              73,504
            </Title>
            <span className="flex items-center gap-1 text-green-dark">
              <TrendingUpIcon className="h-auto w-5" />
              <span className="font-semibold leading-none"> +32.40%</span>
            </span>
          </div>
          <SimpleBar>
            <div className="h-[20rem] w-full pt-1">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart
                  layout="vertical"
                  data={chartData}
                  className="[&_.recharts-tooltip-cursor]:fill-opacity-20 dark:[&_.recharts-tooltip-cursor]:fill-opacity-10 [&_.recharts-cartesian-axis-tick-value]:fill-gray-300 dark:[&_.recharts-cartesian-axis-tick-value]:fill-gray-700 [&_path.recharts-rectangle]:!stroke-none"
                >
                  <XAxis
                    type="number"
                    axisLine={false}
                    tickLine={false}
                    hide={true}
                  />
                  <YAxis
                    dataKey="name"
                    type="category"
                    axisLine={false}
                    tickLine={false}
                    style={{ fontSize: 13, fontWeight: 500 }}
                    width={100}
                    className="rtl:-translate-x-24 [&_.recharts-text]:fill-gray-700"
                  />
                  <Bar dataKey="total" barSize={28} radius={[50, 50, 50, 50]}>
                    <LabelList
                      position="right"
                      dataKey="total"
                      content={<CustomizedLabel />}
                    />
                  </Bar>
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </SimpleBar>
        </>
      }
    </WidgetCard>
  );
}

function CustomizedLabel(props: any) {
  const { x, y, width, height, value } = props;
  const radius = 10;

  return (
    <g>
      <rect
        x={x + width - 44}
        y={y + 4}
        width={40}
        height={height - 8}
        rx={radius}
        fill="#ffffff"
      />
      <text
        y={y + 1 + height / 2}
        x={x + width - 24}
        fill="currentColor"
        className="text-[13px] font-medium text-gray-800 dark:text-gray-200"
        textAnchor="middle"
        dominantBaseline="middle"
      >
        {formatNumber(value)}
      </text>
    </g>
  );
}
