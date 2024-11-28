'use client';

import React, { useEffect, useState } from 'react';
import { defaultColumns } from './column';
import MainTable from '@/app/shared/table/main-table';
import WidgetCard from '@components/cards/widget-card';
import { Accounts } from '@/data/tan-table-data';
import TablePagination from '@/app/shared/table/table-pagination';
import { useTanStackTable } from '@/app/shared/tan-table/custom-table-components/use-TanStack-Table';

import { Button } from 'rizzui';
import { PiArrowsClockwiseBold } from 'react-icons/pi';
import TableToolbarFilter from '../table-toolbar-filter';
import TableToolbarFilterAccounts from '../table-toolbar-filter-accounts';
import AddAccountsButton from '../../accountsAddButtom';
import { useFileContext } from '@/app/components/context/FileContext';
import { API_BASE_URL } from '@/config/base-url';

export default function AccountsTable({lang = "en"}:{lang?:string;}) {
//   const defaultData: Accounts[] = [
//     {
//         id: '0',
//         name: lang === 'ar' ? 'علي محمد' : 'Ali Mohamed',
//         phoneNumber: '0123456789',
//         email: 'ali.mohamed@admin.com',
//         userName: lang === 'ar' ? 'علي م.' : 'Ali M.',
//         activated: lang === 'ar' ? 'نشط' : 'Active',
//     },
//     {
//         id: '1',
//         name: lang === 'ar' ? 'سارة عبد الله' : 'Sara Abdullah',
//         phoneNumber: '0987654321',
//         email: 'sara.abdullah@admin.com',
//         userName: lang === 'ar' ? 'سارة ع.' : 'Sara A.',
//         activated: lang === 'ar' ? 'غير نشط' : 'Inactive',
//     },
//     {
//         id: '2',
//         name: lang === 'ar' ? 'خالد حسن' : 'Khaled Hassan',
//         phoneNumber: '0123456789',
//         email: 'khaled.hassan@admin.com',
//         userName: lang === 'ar' ? 'خالد ح.' : 'Khaled H.',
//         activated: lang === 'ar' ? 'نشط' : 'Active',
//     },
//     {
//         id: '3',
//         name: lang === 'ar' ? 'مها علي' : 'Maha Ali',
//         phoneNumber: '0987654321',
//         email: 'maha.ali@admin.com',
//         userName: lang === 'ar' ? 'مها ع.' : 'Maha A.',
//         activated: lang === 'ar' ? 'نشط' : 'Active',
//     },
//     {
//         id: '4',
//         name: lang === 'ar' ? 'ياسمين عمر' : 'Yasmin Omar',
//         phoneNumber: '0123456789',
//         email: 'yasmin.omar@admin.com',
//         userName: lang === 'ar' ? 'ياسمين ع.' : 'Yasmin A.',
//         activated: lang === 'ar' ? 'غير نشط' : 'Inactive',
//     },
//     {
//         id: '5',
//         name: lang === 'ar' ? 'عمرو سعيد' : 'Amr Said',
//         phoneNumber: '0987654321',
//         email: 'amr.said@admin.com',
//         userName: lang === 'ar' ? 'عمرو س.' : 'Amr S.',
//         activated: lang === 'ar' ? 'نشط' : 'Active',
//     },
//     {
//         id: '6',
//         name: lang === 'ar' ? 'نورا حسام' : 'Noura Hossam',
//         phoneNumber: '0123456789',
//         email: 'noura.hossam@admin.com',
//         userName: lang === 'ar' ? 'نورا ح.' : 'Noura H.',
//         activated: lang === 'ar' ? 'نشط' : 'Active',
//     },
// ];

  const [inputName, setInputName] = useState('');
  const [inputEmail, setInputEmail] = useState('');
  const [inputPhoneNumber, setInputPhoneNumber] = useState('');
  const [selectedValue, setSelectedValue] = useState<string>('');
  const [toFromDate, setToFromDate] = useState<[Date | null, Date | null]>([null, null]);


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
    "inputName":inputName,
    "inputEmail":inputEmail,
    "inputPhoneNumber":inputPhoneNumber,
    "selectedValue":selectedValue,
    "toFromDate":toFromDate,
  });

  const [defaultData, setDefaultData] = useState<Accounts[]>([]);
  const { updateAccounts, setUpdateAccounts } = useFileContext();
    
  const { table, setData } = useTanStackTable<Accounts>({
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

  const fetchReviews = async () => {
    const formatDate = (date: Date | null): string => {
      return date ? date.toISOString().split('T')[0] : '';
    };
  
    const queryParams = new URLSearchParams({
      PhoneNumber: inputPhoneNumber,
      Name: inputName,
      Email: inputEmail,
      IsActive: selectedValue == '1'? 'true' : selectedValue == '2'? 'false' : '',
      FromDate: formatDate(toFromDate[0]),
      ToDate: formatDate(toFromDate[1]),
      PageNumber: (pageIndex + 1).toString(),
      PageSize: pageSize.toString(),
    });
  
    try {
      const response = await fetch(`${API_BASE_URL}/api/Support/Filter?${queryParams}`, {
        method: 'GET',
        headers: {
          Accept: '*/*',
          'Accept-Language': lang,
        },
      });
  
      if (response.ok) {
        const result = await response.json();
  
        // Transforming API data to match `defaultData` structure
        const transformedData = result.entities.map((account: any) => ({
          id: account.id,
          name: account.name || '',
          userName: account.name || '',
          phoneNumber: account.phoneNumber || 'N/A',
          email: account.email || '',
          activated: account.isActive
            ? lang === 'ar'
              ? 'نشط'
              : 'Active'
            : lang === 'ar'
            ? 'غير نشط'
            : 'Inactive',
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
    if (updateAccounts == true) {
      handleRefreshData();
      setUpdateAccounts(false);
    }
  }, [updateAccounts]); 

  const handleRefreshData = () => {
    fetchReviews();
  };

  return (
    <>
      <WidgetCard title={lang === 'ar' ? 'جدول الحسابات' : 'Accounts Table'} className="flex flex-col gap-4">
        <div className="flex justify-end items-center">
            <Button onClick={handleRefreshData} className="w-auto me-6">
              <PiArrowsClockwiseBold className="me-1.5 h-[17px] w-[17px]" />
              {lang == "en"?"Update Data":'تحديث البيانات'}
            </Button>
            <AddAccountsButton lang={lang} title={lang == "en"?"Add Admin Assistant":' اضافة مساعد ادمن'} buttonLabel={lang == "en"?"Add Admin Assistant":' اضافة مساعد ادمن'} modalBtnLabel={lang == "en"?"Add Admin Assistant":' اضافة مساعد ادمن'} onSuccess={handleRefreshData} />
        </div>
        <TableToolbarFilterAccounts 
          nameEN="Accounts" 
          nameAr="الحسابات" 
          table={table}  
          lang={lang}
          inputName={inputName}
          setInputName={setInputName}
          inputEmail={inputEmail}
          setInputEmail={setInputEmail}
          inputPhoneNumber={inputPhoneNumber}
          setInputPhoneNumber={setInputPhoneNumber}
          selectedValue={selectedValue}
          setSelectedValue={setSelectedValue}
          toFromDate={toFromDate}
          setToFromDate={setToFromDate}
        />
        <MainTable table={table} variant={'modern'} lang={lang} />
        <TablePagination options={options} table={table} lang={lang} pageIndex={pageIndex} totalPages={totalPages} setPageIndex={setPageIndex} setPageSize={setPageSize} setUpdate={setUpdateAccounts} />
      </WidgetCard> 
    </>
  );
}
