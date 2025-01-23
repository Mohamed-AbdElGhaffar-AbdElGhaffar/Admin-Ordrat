'use client';

import React, { useEffect, useState } from 'react';
import { defaultColumns } from './column';
import MainTable from '@/app/shared/table/main-table';
import WidgetCard from '@components/cards/widget-card';
import { Reviews } from '@/data/tan-table-data';
import TablePagination from '@/app/shared/table/table-pagination';
import { useTanStackTable } from '@/app/shared/tan-table/custom-table-components/use-TanStack-Table';

import { Button } from 'rizzui';
import { PiArrowsClockwiseBold } from 'react-icons/pi';
import { useFileContext } from '@/app/components/context/FileContext';
import { API_BASE_URL } from '@/config/base-url';
import { useGuardContext } from '@/app/components/context/GuardContext';
import { useRouter } from 'next/navigation';
import TableToolbarFilter from '../table-toolbar-filter-final';
import axiosClient from '@/app/components/context/api';

export default function ReviewsTable({lang = "en"}:{lang?:string;}) {
  const [inputFromTo, setInputFromTo] = useState<string[]>(['', '']);
  const [inputEndUserName, setInputEndUserName] = useState('');
  const [inputEndUserPhoneNumber, setInputEndUserPhoneNumber] = useState('');
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
    "inputFromTo":inputFromTo,
    "inputEndUserName":inputEndUserName,
    "inputEndUserPhoneNumber":inputEndUserPhoneNumber,
    "inputShopName":inputShopName,
    "createdDate":createdDate,
  });

  const [defaultData, setDefaultData] = useState<Reviews[]>([]);
  const { updateReviews, setUpdateReviews } = useFileContext();
  const { setGuard } = useGuardContext();
  const router = useRouter();
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
      const response = await axiosClient.get('/api/Review/Filter', {
        params: queryParams,
        headers: {
          Accept: '*/*',
          'Accept-Language': lang,
        },
      });
  
      // Handle the response data
      if (response.status === 200) {
        const result = await response.data;
  
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
          createdAt: review.createdAt
        }));
  
        setDefaultData(transformedData);
        setData(transformedData);
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
          nameEN="Reviews End User"
          nameAr="مراجعات المستخدم"
          table={table}
          lang={lang}
          search={inputEndUserName}
          setSearch={setInputEndUserName}
          filters={[
            {
              type: 'input',
              value: inputEndUserPhoneNumber,
              setValue: setInputEndUserPhoneNumber,
              placeholder: lang === 'ar' ? 'رقم الهاتف' : 'Phone Number',
            },
            {
              type: 'input',
              value: inputShopName,
              setValue: setInputShopName,
              placeholder: lang === 'ar' ? "اسم المتجر" : "Shop Name",
            },
            {
              type: 'fromTo',
              value: inputFromTo,
              setValue: setInputFromTo,
              label: lang === 'ar' ? "التقييم" : "Rate",
            },
            {
              type: 'date',
              value: createdDate,
              setValue: setCreatedDate,
            },
          ]}
          onSuccess={()=>setUpdateReviews(true)}
        />
        <MainTable table={table} variant={'modern'} lang={lang} />
        <TablePagination options={options} table={table} lang={lang} pageIndex={pageIndex} totalPages={totalPages} setPageIndex={setPageIndex} setPageSize={setPageSize} setUpdate={setUpdateReviews} />
      </WidgetCard>
    </>
  );
}
