'use client';

import React, { useEffect, useState } from 'react';
import { defaultColumns } from './column';
import MainTable from '@/app/shared/table/main-table';
import WidgetCard from '@components/cards/widget-card';
import { Stores } from '@/data/tan-table-data';
import TablePagination from '@/app/shared/table/table-pagination';
import { useTanStackTable } from '@/app/shared/tan-table/custom-table-components/use-TanStack-Table';

import { Button } from 'rizzui';
import { PiArrowsClockwiseBold } from 'react-icons/pi';
import TableToolbarFilter from '../table-toolbar-filter';
import AddStoreButton from '../../storeAddButtom';
import TableToolbarFilterStores from '../table-toolbar-filter-stores';
import { useFileContext } from '@/app/components/context/FileContext';
import { API_BASE_URL } from '@/config/base-url';
import { useGuardContext } from '@/app/components/context/GuardContext';
import { useRouter } from 'next/navigation';
import axiosClient from '@/app/components/context/api';

export default function StoresTable({lang = "en"}:{lang?:string;}) {
  // const defaultData: Stores[] = [
  //   {
  //     id: '0',
  //     name: lang === 'ar' ? 'متجر الإلكترونيات' : 'Electronics Store',
  //     userName: lang === 'ar' ? 'علي م.' : 'Ali M.',
  //     storeStatus: lang === 'ar' ? 'نشط' : 'Active',
  //     totalSales: lang === 'ar' ? '50,000 جنيه' : '50,000 EGP',
  //     jointPlan: lang === 'ar' ? 'الخطة الذهبية' : 'Gold Plan',
  //     activated: lang === 'ar' ? 'نشط' : 'Active',
  //   },
  //   {
  //     id: '1',
  //     name: lang === 'ar' ? 'متجر الأزياء' : 'Fashion Boutique',
  //     userName: lang === 'ar' ? 'سارة ع.' : 'Sara A.',
  //     storeStatus: lang === 'ar' ? 'غير نشط' : 'Inactive',
  //     totalSales: lang === 'ar' ? '120,000 جنيه' : '120,000 EGP',
  //     jointPlan: lang === 'ar' ? 'الخطة الفضية' : 'Silver Plan',
  //     activated: lang === 'ar' ? 'غير نشط' : 'Inactive',
  //   },
  //   {
  //     id: '2',
  //     name: lang === 'ar' ? 'محل الأدوات المنزلية' : 'Home Goods Store',
  //     userName: lang === 'ar' ? 'خالد ح.' : 'Khaled H.',
  //     storeStatus: lang === 'ar' ? 'نشط' : 'Active',
  //     totalSales: lang === 'ar' ? '75,000 جنيه' : '75,000 EGP',
  //     jointPlan: lang === 'ar' ? 'الخطة البرونزية' : 'Bronze Plan',
  //     activated: lang === 'ar' ? 'نشط' : 'Active',
  //   },
  //   {
  //     id: '3',
  //     name: lang === 'ar' ? 'مكتبة' : 'Bookstore',
  //     userName: lang === 'ar' ? 'مها ع.' : 'Maha A.',
  //     storeStatus: lang === 'ar' ? 'نشط' : 'Active',
  //     totalSales: lang === 'ar' ? '60,000 جنيه' : '60,000 EGP',
  //     jointPlan: lang === 'ar' ? 'الخطة الأساسية' : 'Basic Plan',
  //     activated: lang === 'ar' ? 'نشط' : 'Active',
  //   },
  //   {
  //     id: '4',
  //     name: lang === 'ar' ? 'متجر الأثاث' : 'Furniture Store',
  //     userName: lang === 'ar' ? 'ياسمين ع.' : 'Yasmin A.',
  //     storeStatus: lang === 'ar' ? 'غير نشط' : 'Inactive',
  //     totalSales: lang === 'ar' ? '40,000 جنيه' : '40,000 EGP',
  //     jointPlan: lang === 'ar' ? 'الخطة الفضية' : 'Silver Plan',
  //     activated: lang === 'ar' ? 'غير نشط' : 'Inactive',
  //   },
  //   {
  //     id: '5',
  //     name: lang === 'ar' ? 'متجر الأدوات الرياضية' : 'Sports Store',
  //     userName: lang === 'ar' ? 'عمرو س.' : 'Amr S.',
  //     storeStatus: lang === 'ar' ? 'نشط' : 'Active',
  //     totalSales: lang === 'ar' ? '95,000 جنيه' : '95,000 EGP',
  //     jointPlan: lang === 'ar' ? 'الخطة الذهبية' : 'Gold Plan',
  //     activated: lang === 'ar' ? 'نشط' : 'Active',
  //   },
  //   {
  //     id: '6',
  //     name: lang === 'ar' ? 'متجر العطور' : 'Perfume Shop',
  //     userName: lang === 'ar' ? 'نورا ح.' : 'Noura H.',
  //     storeStatus: lang === 'ar' ? 'نشط' : 'Active',
  //     totalSales: lang === 'ar' ? '35,000 جنيه' : '35,000 EGP',
  //     jointPlan: lang === 'ar' ? 'الخطة البرونزية' : 'Bronze Plan',
  //     activated: lang === 'ar' ? 'نشط' : 'Active',
  //   },
  // ];
  
  const [inputEarn, setInputEarn] = useState<string[]>(['', '']);
  const [inputSellerId, setInputSellerId] = useState('');
  const [inputShopName, setInputShopName] = useState('');
  const [selectedValue, setSelectedValue] = useState<string>('');
  
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
  
  useEffect(() => {
    console.log("filter data: ",{
      "inputEarn":inputEarn,
      "inputSellerId":inputSellerId,
      "selectedValue":selectedValue,
    });
  }, [inputEarn]);

  const [defaultData, setDefaultData] = useState<Stores[]>([]);
  const { updateStores, setUpdateStores } = useFileContext();
  const { setGuard } = useGuardContext();
  const router = useRouter();
  const { table, setData } = useTanStackTable<Stores>({
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

  const fetchStores = async () => {
    const queryParams = new URLSearchParams();

    queryParams.append('searchShopName', inputShopName || '');
    queryParams.append('MinEarning', inputEarn[0] || '');
    queryParams.append('MaxEarning', inputEarn[1] || '');
    queryParams.append('IsActive', selectedValue == '1'? 'true' : selectedValue == '2'? 'false' : '');
    queryParams.append('paginateParams.PageNumber', (pageIndex + 1).toString());
    queryParams.append('paginateParams.PageSize', pageSize.toString());
    
    try {
      const response = await axiosClient.get('/api/Shop/GetAll', {
        params: queryParams,
        headers: {
          Accept: '*/*',
          'Accept-Language': lang,
        },
      });
  
      if (response.status === 200) {
        const result = response.data;

        const transformedData = result.entities.map((store: any) => ({
          id: store.id,
          name: store.name || '',
          userName: store.name || '',
          sellerName: store.sellerName || '',
          storeStatus: store.isActive
            ? lang === 'ar'
              ? 'نشط'
              : 'Active' 
            : lang === 'ar'
            ? 'غير نشط'
            : 'Inactive',
          totalSales: `${store.totalEarnings || 0} ${lang === 'ar' ? 'جنيه' : 'EGP'}`,
          jointPlan: '',
          activated: store.isActive
            ? lang === 'ar'
              ? 'نشط'
              : 'Active'
            : lang === 'ar'
            ? 'غير نشط'
            : 'Inactive',
        }));

        setDefaultData(transformedData);
        setData(transformedData);
        setTotalPages(result.totalPages || 1);
      } else {
        setGuard(false);
        localStorage.clear();
        router.push(`/${lang}/signin`);
        console.error('Failed to fetch stores:', response.statusText);
      }
    } catch (error) {
      setGuard(false);
      localStorage.clear();
      router.push(`/${lang}/signin`);
      console.error('Error fetching stores:', error);
    }
  };

  useEffect(() => {
    fetchStores();
  }, [setData, lang]);

  useEffect(() => {
    if (updateStores == true) {
      fetchStores();
      setUpdateStores(false);
    }
  }, [updateStores]);

  const handleRefreshData = () => {
    fetchStores();
  };

  return (
    <>
      <WidgetCard title={lang === 'ar' ? 'جدول المتاجر' : 'Stores Table'} className="flex flex-col gap-4">
        <div className="flex justify-end items-center">
            <Button onClick={handleRefreshData} className="w-auto me-6">
              <PiArrowsClockwiseBold className="me-1.5 h-[17px] w-[17px]" />
              {lang == "en"?"Update Data":'تحديث البيانات'}
            </Button>
            <AddStoreButton lang={lang} title={lang == "en"?"Add Store":'إضافة متجر'} buttonLabel={lang == "en"?"Add Store":'إضافة متجر'} modalBtnLabel={lang == "en"?"Add Store":'إضافة متجر'} onSuccess={handleRefreshData} />
        </div>
        <TableToolbarFilterStores 
          nameEN="Stores" 
          nameAr="المتاجر" 
          table={table}  
          lang={lang}
          inputEarn={inputEarn}
          setInputEarn={setInputEarn}
          inputSellerId={inputSellerId}
          setInputSellerId={setInputSellerId}
          selectedValue={selectedValue}
          setSelectedValue={setSelectedValue}
          inputShopName={inputShopName}
          setInputShopName={setInputShopName}
        />
        <MainTable table={table} variant={'modern'} lang={lang} />
        <TablePagination options={options} table={table} lang={lang} pageIndex={pageIndex} totalPages={totalPages} setPageIndex={setPageIndex} setPageSize={setPageSize} setUpdate={setUpdateStores} />
      </WidgetCard>
    </>
  );
}
