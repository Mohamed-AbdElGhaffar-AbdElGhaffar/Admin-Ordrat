'use client';

import React, { useEffect, useState } from 'react';
import { defaultColumns } from './column';
import TableToolbar from '@/app/shared/tan-table/table-toolbar';
import MainTable from '@/app/shared/table/main-table';
import WidgetCard from '@components/cards/widget-card';
import { Faq } from '@/data/tan-table-data';
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
import FaqsAddButton from '../../faqAddButtom';

export default function FaqTable({lang = "en"}:{lang?:string;}) {
  const [defaultData, setDefaultData] = useState<Faq[]>([]);
  const { updateFaq, setUpdateFaq } = useFileContext();
  const { setGuard } = useGuardContext();
  const router = useRouter();

  const { table, setData } = useTanStackTable<Faq>({
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
      },
      meta: {
      },
      enableColumnResizing: false,
    },
  });

  const fetchData = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/FAQCategory/GetOrdratFAQs`, {
        method: 'GET',
        headers: {
          'Accept-Language': lang,
        },
      });
      const data = await response.json();

      const transformedData = data.map((item: any) => ({
        id: item.id,
        name: item.name,
        title: item.title,
        userName: item.name,
        metaDescription: item.metaDescription,
        image: item.imageUrl,
        faqNumber: item.faQs.length,
        faQs: item.faQs,
      }));

      setDefaultData(transformedData);
      setData(transformedData);
    } catch (error) {
      setGuard(false);
      localStorage.clear();
      router.push(`/${lang}/signin`);
      console.error('Error fetching faq:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [setData, lang]); 

  useEffect(() => {
    if (updateFaq == true) {
      handleRefreshData();
      setUpdateFaq(false);
    }
  }, [updateFaq]); 

  const handleRefreshData = () => {
    fetchData();
  };

  return (
    <>
      <WidgetCard title={lang === 'ar' ? 'جدول الأسئلة الشائعة' : 'FAQ Table'} className="flex flex-col gap-4">
        <div className="flex justify-end items-center">
            <Button onClick={handleRefreshData} className="w-auto me-6">
              <PiArrowsClockwiseBold className="me-1.5 h-[17px] w-[17px]" />
              {lang == "en"?"Update Data":'تحديث البيانات'}
            </Button>
            <FaqsAddButton lang={lang} buttonLabel={lang === 'ar' ? "إضافة قسم الأسئلة" : "Add Faq Category"}  onSuccess={handleRefreshData} /> 
        </div>
        <TableToolbar nameEN="faq category" nameAr="قسم الأسئلة" table={table}  lang={lang}/>
        <MainTable table={table} variant={'modern'} lang={lang} />
        <TablePagination table={table} lang={lang} select={false} />
      </WidgetCard>
    </>
  );
}
