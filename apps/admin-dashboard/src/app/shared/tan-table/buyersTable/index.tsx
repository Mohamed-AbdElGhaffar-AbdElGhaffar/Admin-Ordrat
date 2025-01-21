'use client';

import React, { useEffect, useState } from 'react';
import { defaultColumns } from './column';
import TableToolbar from '@/app/shared/tan-table/table-toolbar';
import MainTable from '@/app/shared/table/main-table';
import WidgetCard from '@components/cards/widget-card';
import { Buyers } from '@/data/tan-table-data';
import TablePagination from '@/app/shared/table/table-pagination';
import { useTanStackTable } from '@/app/shared/tan-table/custom-table-components/use-TanStack-Table';

import { Button } from 'rizzui';
import { PiArrowsClockwiseBold } from 'react-icons/pi';
import TableToolbarFilterBuyers from '../table-toolbar-filter-buyers';
import { useFileContext } from '@/app/components/context/FileContext';
import { API_BASE_URL } from '@/config/base-url';
import { useGuardContext } from '@/app/components/context/GuardContext';
import { useRouter } from 'next/navigation';
// import AddButton from '../../planAddButtom';

export default function BuyersTable({lang = "en"}:{lang?:string;}) {
//   const defaultData: Buyers[] = [
//     {
//         id: '0',
//         name: lang === 'ar' ? 'علي محمد' : 'Ali Mohamed',
//         userName: lang === 'ar' ? 'علي م.' : 'Ali M.',
//         phoneNumber: '+201234567890',
//         shop: lang === 'ar' ? 'متجر الإلكترونيات' : 'Electronics Shop',
//         joiningDate: '2023-01-15',
//     },
//     {
//         id: '1',
//         name: lang === 'ar' ? 'سارة عبد الله' : 'Sara Abdallah',
//         userName: lang === 'ar' ? 'سارة ع.' : 'Sara A.',
//         phoneNumber: '+201298765432',
//         shop: lang === 'ar' ? 'متجر الأزياء' : 'Fashion Boutique',
//         joiningDate: '2023-02-20',
//     },
//     {
//         id: '2',
//         name: lang === 'ar' ? 'خالد حسن' : 'Khaled Hassan',
//         userName: lang === 'ar' ? 'خالد ح.' : 'Khaled H.',
//         phoneNumber: '+201234654321',
//         shop: lang === 'ar' ? 'محل الأدوات المنزلية' : 'Home Goods Store',
//         joiningDate: '2023-03-12',
//     },
//     {
//         id: '3',
//         name: lang === 'ar' ? 'مها عادل' : 'Maha Adel',
//         userName: lang === 'ar' ? 'مها ع.' : 'Maha A.',
//         phoneNumber: '+201245678910',
//         shop: lang === 'ar' ? 'متجر الكتب' : 'Bookstore',
//         joiningDate: '2023-04-05',
//     },
//     {
//         id: '4',
//         name: lang === 'ar' ? 'ياسمين علي' : 'Yasmin Ali',
//         userName: lang === 'ar' ? 'ياسمين ع.' : 'Yasmin A.',
//         phoneNumber: '+201287654321',
//         shop: lang === 'ar' ? 'متجر الأثاث' : 'Furniture Store',
//         joiningDate: '2023-05-10',
//     },
//     {
//         id: '5',
//         name: lang === 'ar' ? 'عمرو السيد' : 'Amr Elsayed',
//         userName: lang === 'ar' ? 'عمرو س.' : 'Amr S.',
//         phoneNumber: '+201236547890',
//         shop: lang === 'ar' ? 'متجر الأدوات الرياضية' : 'Sports Store',
//         joiningDate: '2023-06-18',
//     },
//     {
//         id: '6',
//         name: lang === 'ar' ? 'نورا حامد' : 'Noura Hamed',
//         userName: lang === 'ar' ? 'نورا ح.' : 'Noura H.',
//         phoneNumber: '+201245678911',
//         shop: lang === 'ar' ? 'متجر العطور' : 'Perfume Shop',
//         joiningDate: '2023-07-22',
//     },
// ];

  const [inputName, setInputName] = useState('');
  const [inputPhoneNumber, setInputPhoneNumber] = useState('');
  const [inputShopName, setInputShopName] = useState('');
  const [createdDate, setCreatedDate] = useState<[Date | null, Date | null]>([null, null]);

  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(5);
  const [totalPages, setTotalPages] = useState(5);

  const options = [
    { value: 5, label: '5' },
    { value: 10, label: '10' },
    { value: 15, label: '15' },
    { value: 20, label: '20' },
  ];
  console.log("pageIndex: ",pageIndex);
  console.log("filter data: ",{
    "inputName":inputName,
    "inputPhoneNumber":inputPhoneNumber,
    "inputShopName":inputShopName,
    "createdDate":createdDate,
  });

  const [defaultData, setDefaultData] = useState<Buyers[]>([]);
  const { updateBuyers, setUpdateBuyers } = useFileContext();
  const { setGuard } = useGuardContext();
  const router = useRouter();
  
  const { table, setData } = useTanStackTable<Buyers>({
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

  const fetchReviews = async () => {
    const formatDate = (date: Date | null): string => {
      return date ? date.toISOString().split('T')[0] : '';
    };
  
    const queryParams = new URLSearchParams({
      PhoneNumber: inputPhoneNumber,
      Name: inputName,
      ShopName: inputShopName,
      FromDate: formatDate(createdDate[0]),
      ToDate: formatDate(createdDate[1]),
      PageNumber: (pageIndex + 1).toString(),
      PageSize: pageSize.toString(),
    });
  
    try {
      const response = await fetch(`${API_BASE_URL}/api/EndUser/Filter?${queryParams}`, {
        method: 'GET',
        headers: {
          Accept: '*/*',
          'Accept-Language': lang,
        },
      });
  
      if (response.ok) {
        const result = await response.json();
  
        // Transforming API data to match `defaultData` structure
        const transformedData = result.entities.map((buyer: any) => ({
          id: buyer.id,
          name: buyer.name || '',
          userName: buyer.name || '',
          phoneNumber: buyer.phoneNumber || 'N/A',
          shop: buyer.shopName,
          joiningDate: buyer.createdAt,
        }));
  
        setDefaultData(transformedData);
        setData(transformedData);
        console.log("totalPages: ", result.totalPages);
        
        setTotalPages(result.totalPages);
      } else {
        setGuard(false);
        localStorage.clear();
        router.push(`/${lang}/signin`);
        console.error('Failed to fetch reviews:', response.statusText);
      }
    } catch (error) {
      setGuard(false);
      localStorage.clear();
      router.push(`/${lang}/signin`);
      console.error('Error fetching reviews:', error);
    }
  };  

  useEffect(() => {
    fetchReviews();
  }, [setData, lang]); 

  useEffect(() => {
    if (updateBuyers == true) {
      handleRefreshData();
      setUpdateBuyers(false);
    }
  }, [updateBuyers]); 

  const handleRefreshData = () => {
    fetchReviews();
  };

  return (
    <>
      <WidgetCard title={lang === 'ar' ? 'جدول المشتريين' : 'Buyers Table'} className="flex flex-col gap-4">
        <div className="flex justify-end items-center">
            <Button onClick={handleRefreshData} className="w-auto">
              <PiArrowsClockwiseBold className="me-1.5 h-[17px] w-[17px]" />
              {lang == "en"?"Update Data":'تحديث البيانات'}
            </Button>
        </div>
        <TableToolbarFilterBuyers 
          nameEN="Buyers" 
          nameAr="المشتريين" 
          table={table}  
          lang={lang}
          inputName={inputName}
          setInputName={setInputName}
          inputPhoneNumber={inputPhoneNumber}
          setInputPhoneNumber={setInputPhoneNumber}
          inputShopName={inputShopName}
          setInputShopName={setInputShopName}
          createdDate={createdDate}
          setCreatedDate={setCreatedDate}
        />
        <MainTable table={table} variant={'modern'} lang={lang} />
        <TablePagination options={options} table={table} lang={lang} pageIndex={pageIndex} totalPages={totalPages} setPageIndex={setPageIndex} setPageSize={setPageSize} setUpdate={setUpdateBuyers} />
      </WidgetCard>
    </>
  );
}
