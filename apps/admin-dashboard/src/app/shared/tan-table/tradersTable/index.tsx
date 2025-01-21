'use client';

import React, { useEffect, useState } from 'react';
import { defaultColumns } from './column';
import MainTable from '@/app/shared/table/main-table';
import WidgetCard from '@components/cards/widget-card';
import { Traders } from '@/data/tan-table-data';
import TablePagination from '@/app/shared/table/table-pagination';
import { useTanStackTable } from '@/app/shared/tan-table/custom-table-components/use-TanStack-Table';

import { Button } from 'rizzui';
import { PiArrowsClockwiseBold } from 'react-icons/pi';
import TableToolbarFilter from '../table-toolbar-filter';
import TableToolbarFilterAccounts from '../table-toolbar-filter-accounts';
import AddAccountsButton from '../../accountsAddButtom';
import AddTradersButton from '../../TradersAddButtom';
import { useFileContext } from '@/app/components/context/FileContext';
import { API_BASE_URL } from '@/config/base-url';
import TableToolbarFilterTraders from '../table-toolbar-filter-traders';
import { useGuardContext } from '@/app/components/context/GuardContext';
import { useRouter } from 'next/navigation';

export default function TradersTable({lang = "en"}:{lang?:string;}) {
  // const defaultData: Traders[] = [
  //   {
  //       id: '0',
  //       name: lang === 'ar' ? 'علي محمد' : 'Ali Mohamed',
  //       status: lang === 'ar' ? 'نشط' : 'Active',
  //       TotalSales: lang === 'ar' ? '500,000 جنيه' : '500,000 EGP',
  //       country: lang === 'ar' ? 'مصر' : 'Egypt',
  //       activated: lang === 'ar' ? 'نشط' : 'Active',
  //       userName: lang === 'ar' ? 'علي م.' : 'Ali M.',
  //   },
  //   {
  //       id: '1',
  //       name: lang === 'ar' ? 'سارة عبد الله' : 'Sara Abdullah',
  //       status: lang === 'ar' ? 'غير نشط' : 'Inactive',
  //       TotalSales: lang === 'ar' ? '300,000 جنيه' : '300,000 EGP',
  //       country: lang === 'ar' ? 'الإمارات' : 'UAE',
  //       activated: lang === 'ar' ? 'غير نشط' : 'Inactive',
  //       userName: lang === 'ar' ? 'سارة ع.' : 'Sara A.',
  //   },
  //   {
  //       id: '2',
  //       name: lang === 'ar' ? 'خالد حسن' : 'Khaled Hassan',
  //       status: lang === 'ar' ? 'نشط' : 'Active',
  //       TotalSales: lang === 'ar' ? '400,000 جنيه' : '400,000 EGP',
  //       country: lang === 'ar' ? 'السعودية' : 'Saudi Arabia',
  //       activated: lang === 'ar' ? 'نشط' : 'Active',
  //       userName: lang === 'ar' ? 'خالد ح.' : 'Khaled H.',
  //   },
  //   {
  //       id: '3',
  //       name: lang === 'ar' ? 'مها علي' : 'Maha Ali',
  //       status: lang === 'ar' ? 'نشط' : 'Active',
  //       TotalSales: lang === 'ar' ? '200,000 جنيه' : '200,000 EGP',
  //       country: lang === 'ar' ? 'مصر' : 'Egypt',
  //       activated: lang === 'ar' ? 'نشط' : 'Active',
  //       userName: lang === 'ar' ? 'مها ع.' : 'Maha A.',
  //   },
  //   {
  //       id: '4',
  //       name: lang === 'ar' ? 'ياسمين عمر' : 'Yasmin Omar',
  //       status: lang === 'ar' ? 'غير نشط' : 'Inactive',
  //       TotalSales: lang === 'ar' ? '150,000 جنيه' : '150,000 EGP',
  //       country: lang === 'ar' ? 'لبنان' : 'Lebanon',
  //       activated: lang === 'ar' ? 'غير نشط' : 'Inactive',
  //       userName: lang === 'ar' ? 'ياسمين ع.' : 'Yasmin A.',
  //   },
  //   {
  //       id: '5',
  //       name: lang === 'ar' ? 'عمرو سعيد' : 'Amr Said',
  //       status: lang === 'ar' ? 'نشط' : 'Active',
  //       TotalSales: lang === 'ar' ? '450,000 جنيه' : '450,000 EGP',
  //       country: lang === 'ar' ? 'الكويت' : 'Kuwait',
  //       activated: lang === 'ar' ? 'نشط' : 'Active',
  //       userName: lang === 'ar' ? 'عمرو س.' : 'Amr S.',
  //   },
  //   {
  //       id: '6',
  //       name: lang === 'ar' ? 'نورا حسام' : 'Noura Hossam',
  //       status: lang === 'ar' ? 'نشط' : 'Active',
  //       TotalSales: lang === 'ar' ? '250,000 جنيه' : '250,000 EGP',
  //       country: lang === 'ar' ? 'الأردن' : 'Jordan',
  //       activated: lang === 'ar' ? 'نشط' : 'Active',
  //       userName: lang === 'ar' ? 'نورا ح.' : 'Noura H.',
  //   },
  // ];

  const [inputName, setInputName] = useState('');
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
    "inputPhoneNumber":inputPhoneNumber,
    "selectedValue":selectedValue,
    "toFromDate":toFromDate,
  });

  const [defaultData, setDefaultData] = useState<Traders[]>([]);
  const { updateSeller, setUpdateSeller } = useFileContext();
  const { setGuard } = useGuardContext();
  const router = useRouter();
  const { table, setData } = useTanStackTable<Traders>({
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

  const fetchSeller = async () => {
    const formatDate = (date: Date | null): string => {
      return date ? date.toISOString().split('T')[0] : '';
    };
  
    const queryParams = new URLSearchParams({
      PhoneNumber: inputPhoneNumber,
      Name: inputName,
      IsActive: selectedValue == '1'? 'true' : selectedValue == '2'? 'false' : '',
      FromDate: formatDate(toFromDate[0]),
      ToDate: formatDate(toFromDate[1]),
      PageNumber: (pageIndex + 1).toString(),
      PageSize: pageSize.toString(),
    });
  
    try {
      const response = await fetch(`${API_BASE_URL}/api/Seller/Filter?${queryParams}`, {
        method: 'GET',
        headers: {
          Accept: '*/*',
          'Accept-Language': lang,
        },
      });
  
      if (response.ok) {
        const result = await response.json();
  
        // Transforming API data to match `defaultData` structure
        const transformedData = result.entities.map((seller: any) => ({
          id: seller.id,
          name: seller.name || '',
          userName: seller.name || '',
          email: seller.email || '',
          TotalSales: `${seller.totalSales}${lang === 'ar' ? 'جنيه' : 'EGP'}`,
          country: lang === 'ar' ? 'مصر' : 'Egypt',
          activated: seller.isActive
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
        setGuard(false);
        localStorage.clear();
        router.push(`/${lang}/signin`);
        console.error('Failed to fetch Seller:', response.statusText);
      }
    } catch (error) {
      setGuard(false);
      localStorage.clear();
      router.push(`/${lang}/signin`);
      console.error('Error fetching Seller:', error);
    }
  };  

  useEffect(() => {
    fetchSeller();
  }, [setData, lang]); 

  useEffect(() => {
    if (updateSeller == true) {
      handleRefreshData();
      setUpdateSeller(false);
    }
  }, [updateSeller]); 

  const handleRefreshData = () => {
    fetchSeller();
  };


  return (
    <>
      <WidgetCard title={lang === 'ar' ? 'جدول التجار' : 'Traders Table'} className="flex flex-col gap-4">
        <div className="flex justify-end items-center">
            <Button onClick={handleRefreshData} className="w-auto me-6">
              <PiArrowsClockwiseBold className="me-1.5 h-[17px] w-[17px]" />
              {lang == "en"?"Update Data":'تحديث البيانات'}
            </Button>
            <AddTradersButton lang={lang} title={lang == "en"?"Add Trader":'اضافة تاجر'} buttonLabel={lang == "en"?"Add Trader":'اضافة تاجر'} modalBtnLabel={lang == "en"?"Add Trader":'اضافة تاجر'} onSuccess={handleRefreshData} />
        </div>
        <TableToolbarFilterTraders
          nameEN="Traders" 
          nameAr="التجار" 
          table={table}  
          lang={lang}
          inputName={inputName}
          setInputName={setInputName}
          inputPhoneNumber={inputPhoneNumber}
          setInputPhoneNumber={setInputPhoneNumber}
          selectedValue={selectedValue}
          setSelectedValue={setSelectedValue}
          toFromDate={toFromDate}
          setToFromDate={setToFromDate}
        />
        <MainTable table={table} variant={'modern'} lang={lang} />
        <TablePagination options={options} table={table} lang={lang} pageIndex={pageIndex} totalPages={totalPages} setPageIndex={setPageIndex} setPageSize={setPageSize} setUpdate={setUpdateSeller} />
      </WidgetCard>
    </>
  );
}
