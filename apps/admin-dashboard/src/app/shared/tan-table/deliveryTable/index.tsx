'use client';

import React from 'react';
import { defaultColumns } from './column';
import MainTable from '@/app/shared/table/main-table';
import WidgetCard from '@components/cards/widget-card';
import { Delivery } from '@/data/tan-table-data';
import TablePagination from '@/app/shared/table/table-pagination';
import { useTanStackTable } from '@/app/shared/tan-table/custom-table-components/use-TanStack-Table';

import { Button } from 'rizzui';
import { PiArrowsClockwiseBold } from 'react-icons/pi';
import TableToolbarFilter from '../table-toolbar-filter';
import TableToolbarFilterAccounts from '../table-toolbar-filter-accounts';
import AddAccountsButton from '../../accountsAddButtom';
import AddTradersButton from '../../TradersAddButtom';

export default function DeliveryTable({lang = "en"}:{lang?:string;}) {
  const defaultData: Delivery[] = [
    {
        id: '0',
        name: lang === 'ar' ? 'علي محمد' : 'Ali Mohamed',
        size: lang === 'ar' ? 'كبير' : 'Large',
        tradersUsed: lang === 'ar' ? '10 تجار' : '10 Traders',
        drivers: lang === 'ar' ? '3 سائقين' : '3 Drivers',
        activated: lang === 'ar' ? 'نشط' : 'Active',
        userName: lang === 'ar' ? 'علي م.' : 'Ali M.',
    },
    {
        id: '1',
        name: lang === 'ar' ? 'سارة عبد الله' : 'Sara Abdullah',
        size: lang === 'ar' ? 'متوسط' : 'Medium',
        tradersUsed: lang === 'ar' ? '7 تجار' : '7 Traders',
        drivers: lang === 'ar' ? '2 سائقين' : '2 Drivers',
        activated: lang === 'ar' ? 'غير نشط' : 'Inactive',
        userName: lang === 'ar' ? 'سارة ع.' : 'Sara A.',
    },
    {
        id: '2',
        name: lang === 'ar' ? 'خالد حسن' : 'Khaled Hassan',
        size: lang === 'ar' ? 'صغير' : 'Small',
        tradersUsed: lang === 'ar' ? '5 تجار' : '5 Traders',
        drivers: lang === 'ar' ? '1 سائق' : '1 Driver',
        activated: lang === 'ar' ? 'نشط' : 'Active',
        userName: lang === 'ar' ? 'خالد ح.' : 'Khaled H.',
    },
    {
        id: '3',
        name: lang === 'ar' ? 'مها علي' : 'Maha Ali',
        size: lang === 'ar' ? 'كبير' : 'Large',
        tradersUsed: lang === 'ar' ? '8 تجار' : '8 Traders',
        drivers: lang === 'ar' ? '4 سائقين' : '4 Drivers',
        activated: lang === 'ar' ? 'نشط' : 'Active',
        userName: lang === 'ar' ? 'مها ع.' : 'Maha A.',
    },
    {
        id: '4',
        name: lang === 'ar' ? 'ياسمين عمر' : 'Yasmin Omar',
        size: lang === 'ar' ? 'متوسط' : 'Medium',
        tradersUsed: lang === 'ar' ? '6 تجار' : '6 Traders',
        drivers: lang === 'ar' ? '2 سائقين' : '2 Drivers',
        activated: lang === 'ar' ? 'غير نشط' : 'Inactive',
        userName: lang === 'ar' ? 'ياسمين ع.' : 'Yasmin A.',
    },
    {
        id: '5',
        name: lang === 'ar' ? 'عمرو سعيد' : 'Amr Said',
        size: lang === 'ar' ? 'كبير' : 'Large',
        tradersUsed: lang === 'ar' ? '9 تجار' : '9 Traders',
        drivers: lang === 'ar' ? '3 سائقين' : '3 Drivers',
        activated: lang === 'ar' ? 'نشط' : 'Active',
        userName: lang === 'ar' ? 'عمرو س.' : 'Amr S.',
    },
    {
        id: '6',
        name: lang === 'ar' ? 'نورا حسام' : 'Noura Hossam',
        size: lang === 'ar' ? 'صغير' : 'Small',
        tradersUsed: lang === 'ar' ? '4 تجار' : '4 Traders',
        drivers: lang === 'ar' ? '1 سائق' : '1 Driver',
        activated: lang === 'ar' ? 'نشط' : 'Active',
        userName: lang === 'ar' ? 'نورا ح.' : 'Noura H.',
    },
];


  const { table, setData } = useTanStackTable<Delivery>({
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
        activatedFilter: (row, columnId, value) => {
          if (!value) return false;
          let status =
            row.original[columnId].toLowerCase() === value.toLowerCase()
              ? true
              : false;
          return status;
        },
        priceFilter: (row, columnId, value) => {
          if (!value) return false;
          console.log('custom filter conditions', row, columnId, value);
          return true;
        },
        createdDate: (row, columnId, value) => {
          if (!value) return false;
          console.log('custom filter conditions', row, columnId, value);
          return true;
        },
        dueDate: (row, columnId, value) => {
          if (!value) return false;
          console.log('custom filter conditions', row, columnId, value);
          return true;
        },
      },
      meta: {
      },
      enableColumnResizing: false,
    },
  });

  const handleRefreshData = () => {
    console.log("refresh data");
    
  };

  return (
    <>
      <WidgetCard title={lang === 'ar' ? 'جدول التوصيل' : 'Delivery Table'} className="flex flex-col gap-4">
        <div className="flex justify-end items-center">
            <Button onClick={handleRefreshData} className="w-auto me-6">
              <PiArrowsClockwiseBold className="me-1.5 h-[17px] w-[17px]" />
              {lang == "en"?"Update Data":'تحديث البيانات'}
            </Button>
            <AddTradersButton lang={lang} title={lang == "en"?"Add a shipping area":' اضافة منطقة شحن'} buttonLabel={lang == "en"?"Add a shipping area":' اضافة منطقة شحن'} modalBtnLabel={lang == "en"?"Add a shipping area":' اضافة منطقة شحن'} onSuccess={handleRefreshData} />
        </div>
        {/* <TableToolbarFilterAccounts nameEN="Delivery" nameAr="التوصيل" table={table}  lang={lang}/> */}
        <MainTable table={table} variant={'modern'} lang={lang} />
        <TablePagination table={table} lang={lang} />
      </WidgetCard>
    </>
  );
}
