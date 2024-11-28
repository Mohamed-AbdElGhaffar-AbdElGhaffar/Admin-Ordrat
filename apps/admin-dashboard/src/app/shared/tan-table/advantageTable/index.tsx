'use client';

import React, { useEffect, useState } from 'react';
import { defaultColumns } from './column';
import TableToolbar from '@/app/shared/tan-table/table-toolbar';
import MainTable from '@/app/shared/table/main-table';
import WidgetCard from '@components/cards/widget-card';
import { Feature } from '@/data/tan-table-data';
import TablePagination from '@/app/shared/table/table-pagination';
import { useTanStackTable } from '@/app/shared/tan-table/custom-table-components/use-TanStack-Table';

import { Button } from 'rizzui';
import { PiArrowsClockwiseBold } from 'react-icons/pi';
import ImportButton from '../../import-button';
import { useFileContext } from '@/app/components/context/FileContext';
import { API_BASE_URL } from '@/config/base-url';

export default function AdvantageTable({lang = "en"}:{lang?:string;}) {
  const [defaultData, setDefaultData] = useState<Feature[]>([]);
  const { updateData, setUpdateData } = useFileContext();
  
  const { table, setData } = useTanStackTable<Feature>({
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
      const response = await fetch(`${API_BASE_URL}/api/Feature/GetAll`, {
        method: 'GET',
        headers: {
          'Accept-Language': lang,
        },
      });
      const data = await response.json();

      const transformedData = data.map((feature: any) => ({
        id: feature.id,
        name: lang === 'ar' ? feature.name : feature.name,
        userName: lang === 'ar' ? feature.name : feature.name,
        description: lang === 'ar' ? feature.description : feature.description,
      }));

      setDefaultData(transformedData);
      setData(transformedData);
    } catch (error) {
      console.error('Error fetching plans:', error);
    }
  };
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
      <WidgetCard title={lang === 'ar' ? 'جدول المزايا' : 'Feature Table'} className="flex flex-col gap-4">
        <div className="flex justify-end items-center">
            <Button onClick={handleRefreshData} className="w-auto me-6">
              <PiArrowsClockwiseBold className="me-1.5 h-[17px] w-[17px]" />
              {lang == "en"?"Update Data":'تحديث البيانات'}
            </Button>
            <ImportButton lang={lang} title={lang == "en"?"Add Feature":'إضافة ميزة'} buttonLabel={lang == "en"?"Add Feature":'إضافة ميزة'} modalBtnLabel={lang == "en"?"Add Feature":'إضافة ميزة'} onSuccess={handleRefreshData} />
        </div>
        <TableToolbar nameEN='Feature' nameAr='الميزة' table={table}  lang={lang}/>
        <MainTable table={table} variant={'modern'} lang={lang} />
        <TablePagination table={table} lang={lang} />
      </WidgetCard>
    </>
  );
}
