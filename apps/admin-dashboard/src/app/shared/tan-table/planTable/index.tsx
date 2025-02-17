'use client';

import React, { useEffect, useState } from 'react';
import { defaultColumns } from './column';
import TableToolbar from '@/app/shared/tan-table/table-toolbar';
import MainTable from '@/app/shared/table/main-table';
import WidgetCard from '@components/cards/widget-card';
import { Person } from '@/data/tan-table-data';
import TablePagination from '@/app/shared/table/table-pagination';
import { useTanStackTable } from '@/app/shared/tan-table/custom-table-components/use-TanStack-Table';

import { Button } from 'rizzui';
import { PiArrowsClockwiseBold } from 'react-icons/pi';
import ImportButton from '../../import-button';
import AddButton from '../../planAddButtom';
import { API_BASE_URL } from '@/config/base-url';
import { useFileContext } from '@/app/components/context/FileContext';
import { useGuardContext } from '@/app/components/context/GuardContext';
import { useRouter } from 'next/navigation';
import axiosClient from '@/app/components/context/api';

export default function PlanTable({lang = "en"}:{lang?:string;}) {
  const [defaultData, setDefaultData] = useState<Person[]>([]);
  const { updateData, setUpdateData } = useFileContext();
  const { setGuard } = useGuardContext();
  const router = useRouter();
  const { table, setData } = useTanStackTable<Person>({
    tableData: defaultData,
    columnConfig: defaultColumns(lang),
    options: {
      initialState: {
        pagination: {
          pageIndex: 0,
          pageSize: 5,
        },
      },
      filterFns: {
        statusFilter: (row, columnId, value) => {
          if (!value) return false;
          let status =
            row.original[columnId].toLowerCase() === value.toLowerCase()
              ? true
              : false;
          return status;
        },
        priceFilter: (row, columnId, value) => {
          if (!value) return false;
          // console.log('custom filter conditions', row, columnId, value);
          return true;
        },
        createdDate: (row, columnId, value) => {
          if (!value) return false;
          // console.log('custom filter conditions', row, columnId, value);
          return true;
        },
        dueDate: (row, columnId, value) => {
          if (!value) return false;
          // console.log('custom filter conditions', row, columnId, value);
          return true;
        },
      },
      meta: {
        // handleDeleteRow: (row) => {
        //   setData((prev) => prev.filter((r) => r.id !== row.id));
        // },
        // handleMultipleDelete: (rows) => {
        //   setData((prev) => prev.filter((r) => !rows.includes(r.id)));
        //   table.resetRowSelection();
        // },
      },
      enableColumnResizing: false,
    },
  });

  // Fetch data from the API and transform it to match the `Person` type
  const fetchData = async () => {
    try {
      const response = await axiosClient.get('/api/Plan/GetAll', {
        headers: {
          'Accept-Language': lang,
        },
      });
      const data = await response.data;

      const transformedData = data.map((plan: any) => ({
        id: plan.id,
        name: lang === 'ar' ? plan.name : plan.name,
        userName: lang === 'ar' ? plan.name : plan.name,
        egpMonthlyPlanPrice:
          lang === 'ar'
            ? `${plan.egpMonthlyPrice} جنيه`
            : `${plan.egpMonthlyPrice} EGP`,
        egpAnnualPlanPrice:
          lang === 'ar'
            ? `${plan.egpAnnualPrice} جنيه`
            : `${plan.egpAnnualPrice} EGP`,
        usdMonthlyPlanPrice:
          lang === 'ar'
            ? `${plan.usdMonthlyPrice} دولار`
            : `${plan.usdMonthlyPrice} USD`,
        usdAnnualPlanPrice:
          lang === 'ar'
            ? `${plan.usdAnnualPrice} دولار`
            : `${plan.usdAnnualPrice} USD`,
        sarMonthlyPlanPrice:
          lang === 'ar'
            ? `${plan.sarMonthlyPrice} ريال سعودي`
            : `${plan.sarMonthlyPrice} SAR`,
        sarAnnualPlanPrice:
          lang === 'ar'
            ? `${plan.sarAnnualPrice} ريال سعودي`
            : `${plan.sarAnnualPrice} SAR`,
        kwdMonthlyPlanPrice:
          lang === 'ar'
            ? `${plan.kwdMonthlyPrice} دينار كويتي`
            : `${plan.kwdMonthlyPrice} KWD`,
        kwdAnnualPlanPrice:
          lang === 'ar'
            ? `${plan.kwdAnnualPrice} دينار كويتي`
            : `${plan.kwdAnnualPrice} KWD`,
      }));

      setDefaultData(transformedData);
      setData(transformedData);
    } catch (error) {
      setGuard(false);
      localStorage.clear();
      router.push(`/${lang}/signin`);
      console.error('Error fetching plans:', error);
    }
  };

  // useEffect(() => {
  //   fetchData();
  // }, [lang]);

  useEffect(() => {
    fetchData();
  }, [setData, lang]); 

  useEffect(() => {
    if (updateData == true) {
      handleRefreshData();
      setUpdateData(false);
    }
  }, [updateData]); 

  const handleRefreshData = () => {
    fetchData();
  };

  return (
    <>
      <WidgetCard title={lang === 'ar' ? 'جدول الخطط' : 'Plan Table'} className="flex flex-col gap-4">
        <div className="flex justify-end items-center">
            <Button onClick={handleRefreshData} className="w-auto me-6">
              <PiArrowsClockwiseBold className="me-1.5 h-[17px] w-[17px]" />
              {lang == "en"?"Update Data":'تحديث البيانات'}
            </Button>
            <AddButton lang={lang} title={lang == "en"?"Add Plan":'إضافة خطه'} buttonLabel={lang == "en"?"Add Plan":'إضافة خطه'} modalBtnLabel={lang == "en"?"Add Plan":'إضافة خطه'} onSuccess={handleRefreshData} />
        </div>
        <TableToolbar table={table}  lang={lang}/>
        <MainTable table={table} variant={'modern'} lang={lang} />
        <TablePagination table={table} lang={lang} />
      </WidgetCard>
    </>
  );
}
