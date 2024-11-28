'use client';

import React, { useEffect, useState } from 'react';
import { defaultColumns } from './column';
import TableToolbar from '@/app/shared/tan-table/table-toolbar';
import MainTable from '@/app/shared/table/main-table';
import WidgetCard from '@components/cards/widget-card';
import { Person, Reviews } from '@/data/tan-table-data';
import TablePagination from '@/app/shared/table/table-pagination';
import { useTanStackTable } from '@/app/shared/tan-table/custom-table-components/use-TanStack-Table';

import { Button } from 'rizzui';
import { PiArrowsClockwiseBold } from 'react-icons/pi';
import ImportButton from '../../import-button';
import AddReviewsButton from '../../reviewsAddButtom';
import TableToolbarFilter from '../table-toolbar-filter';
import { useFileContext } from '@/app/components/context/FileContext';
import { API_BASE_URL } from '@/config/base-url';
// import TablePagination from '@/app/shared/table/table-pagination-test';
// import AddButton from '../../planAddButtom';

export default function ReviewsTable({lang = "en"}:{lang?:string;}) {
//   const defaultData: Reviews[] = [
//     {
//         id: '0',
//         name: lang === 'ar' ? 'علي محمد' : 'Ali Mohamed',
//         userName: lang === 'ar' ? 'علي م.' : 'Ali M.',
//         phoneNumber: '+201234567890',
//         email: 'ali.mohamed@example.com',
//         shop: lang === 'ar' ? 'متجر الإلكترونيات' : 'Electronics Shop',
//         comment: lang === 'ar' ? 'خدمة رائعة وجودة عالية.' : 'Great service and high quality.',
//         evaluation: '5',
//     },
//     {
//         id: '1',
//         name: lang === 'ar' ? 'سارة عبد الله' : 'Sara Abdallah',
//         userName: lang === 'ar' ? 'سارة ع.' : 'Sara A.',
//         phoneNumber: '+201298765432',
//         email: 'sara.abdallah@example.com',
//         shop: lang === 'ar' ? 'متجر الأزياء' : 'Fashion Boutique',
//         comment: lang === 'ar' ? 'التصاميم عصرية والمنتجات ممتازة.' : 'Trendy designs and excellent products.',
//         evaluation: '4',
//     },
//     {
//         id: '2',
//         name: lang === 'ar' ? 'خالد حسن' : 'Khaled Hassan',
//         userName: lang === 'ar' ? 'خالد ح.' : 'Khaled H.',
//         phoneNumber: '+201234654321',
//         email: 'khaled.hassan@example.com',
//         shop: lang === 'ar' ? 'محل الأدوات المنزلية' : 'Home Goods Store',
//         comment: lang === 'ar' ? 'مجموعة متنوعة وأسعار معقولة.' : 'Wide variety and reasonable prices.',
//         evaluation: '4',
//     },
//     {
//         id: '3',
//         name: lang === 'ar' ? 'مها عادل' : 'Maha Adel',
//         userName: lang === 'ar' ? 'مها ع.' : 'Maha A.',
//         phoneNumber: '+201245678910',
//         email: 'maha.adel@example.com',
//         shop: lang === 'ar' ? 'متجر الكتب' : 'Bookstore',
//         comment: lang === 'ar' ? 'مجموعة رائعة من الكتب.' : 'Great collection of books.',
//         evaluation: '5',
//     },
//     {
//         id: '4',
//         name: lang === 'ar' ? 'ياسمين علي' : 'Yasmin Ali',
//         userName: lang === 'ar' ? 'ياسمين ع.' : 'Yasmin A.',
//         phoneNumber: '+201287654321',
//         email: 'yasmin.ali@example.com',
//         shop: lang === 'ar' ? 'متجر الأثاث' : 'Furniture Store',
//         comment: lang === 'ar' ? 'الخدمة ممتازة والتوصيل سريع.' : 'Excellent service and fast delivery.',
//         evaluation: '5',
//     },
//     {
//         id: '5',
//         name: lang === 'ar' ? 'عمرو السيد' : 'Amr Elsayed',
//         userName: lang === 'ar' ? 'عمرو س.' : 'Amr S.',
//         phoneNumber: '+201236547890',
//         email: 'amr.elsayed@example.com',
//         shop: lang === 'ar' ? 'متجر الأدوات الرياضية' : 'Sports Store',
//         comment: lang === 'ar' ? 'الأسعار مرتفعة قليلاً ولكن الجودة ممتازة.' : 'Prices are a bit high, but quality is great.',
//         evaluation: '4',
//     },
//     {
//         id: '6',
//         name: lang === 'ar' ? 'نورا حامد' : 'Noura Hamed',
//         userName: lang === 'ar' ? 'نورا ح.' : 'Noura H.',
//         phoneNumber: '+201245678911',
//         email: 'noura.hamed@example.com',
//         shop: lang === 'ar' ? 'متجر العطور' : 'Perfume Shop',
//         comment: lang === 'ar' ? 'روائح رائعة وخيارات متعددة.' : 'Amazing scents and a wide variety.',
//         evaluation: '5',
//     },
// ];

  // Moved states here
  
  const [inputFromTo, setInputFromTo] = useState<string[]>(['', '']);
  const [inputEndUserName, setInputEndUserName] = useState('');
  const [inputEndUserPhoneNumber, setInputEndUserPhoneNumber] = useState('');
  const [inputShopName, setInputShopName] = useState('');
  const [createdDate, setCreatedDate] = useState<[Date | null, Date | null]>([null, null]);

  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(5);
  const [totalPages, setTotalPages] = useState(5);
  // const totalPages = 5;

  const options = [
    { value: 5, label: '5' },
    { value: 10, label: '10' },
    { value: 15, label: '15' },
    { value: 20, label: '20' },
  ];
  console.log("pageIndex: ",pageIndex);
  console.log("filter data: ",{
    "inputFromTo":inputFromTo,
    "inputEndUserName":inputEndUserName,
    "inputEndUserPhoneNumber":inputEndUserPhoneNumber,
    "inputShopName":inputShopName,
    "createdDate":createdDate,
  });

  const [defaultData, setDefaultData] = useState<Reviews[]>([]);
  const { updateReviews, setUpdateReviews } = useFileContext();
  
  const { table, setData } = useTanStackTable<Reviews>({
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
      EndUserPhoneNumber: inputEndUserPhoneNumber,
      EndUserName: inputEndUserName,
      ShopName: inputShopName,
      FromDate: formatDate(createdDate[0]),
      ToDate: formatDate(createdDate[1]),
      FromRate: inputFromTo[0] || '',
      ToRate: inputFromTo[1] || '',
      PageNumber: (pageIndex + 1).toString(),
      PageSize: pageSize.toString(),
    });
  
    try {
      const response = await fetch(`${API_BASE_URL}/api/Review/Filter?${queryParams}`, {
        method: 'GET',
        headers: {
          Accept: '*/*',
          'Accept-Language': lang,
        },
      });
  
      if (response.ok) {
        const result = await response.json();
  
        // Transforming API data to match `defaultData` structure
        const transformedData = result.entities.map((review: any) => ({
          id: review.id,
          name: lang === 'ar' ? review.endUserName || '' : review.endUserName || '',
          userName: lang === 'ar' ? review.endUserName || '' : review.endUserName || '',
          phoneNumber: review.endUserPhoneNumber || 'N/A',
          email: '',
          shop: review.shopName,
          comment: review.reviewText,
          evaluation: review.rate.toString(),
        }));
  
        setDefaultData(transformedData);
        setData(transformedData);
        setTotalPages(result.totalPages);
      } else {
        console.error('Failed to fetch reviews:', response.statusText);
      }
    } catch (error) {
      console.error('Error fetching reviews:', error);
    }
  };  

  useEffect(() => {
    fetchReviews();
  }, [setData, lang]); 

  useEffect(() => {
    if (updateReviews == true) {
      handleRefreshData();
      setUpdateReviews(false);
    }
  }, [updateReviews]); 

  const handleRefreshData = () => {
    fetchReviews();
  };

  return (
    <>
      <WidgetCard title={lang === 'ar' ? 'جدول المراجعات' : 'Reviews Table'} className="flex flex-col gap-4">
        <div className="flex justify-end items-center">
            <Button onClick={handleRefreshData} className="w-auto">
              <PiArrowsClockwiseBold className="me-1.5 h-[17px] w-[17px]" />
              {lang == "en"?"Update Data":'تحديث البيانات'}
            </Button>
        </div>
        <TableToolbarFilter
          nameEN="Reviews"
          nameAr="المراجعات"
          table={table}
          lang={lang}
          inputFromTo={inputFromTo}
          setInputFromTo={setInputFromTo}
          inputEndUserName={inputEndUserName}
          setInputEndUserName={setInputEndUserName}
          inputEndUserPhoneNumber={inputEndUserPhoneNumber}
          setInputEndUserPhoneNumber={setInputEndUserPhoneNumber}
          inputShopName={inputShopName}
          setInputShopName={setInputShopName}
          createdDate={createdDate}
          setCreatedDate={setCreatedDate}
        />
        <MainTable table={table} variant={'modern'} lang={lang} />
        <TablePagination options={options} table={table} lang={lang} pageIndex={pageIndex} totalPages={totalPages} setPageIndex={setPageIndex} setPageSize={setPageSize} setUpdate={setUpdateReviews} />
      </WidgetCard>
    </>
  );
}
