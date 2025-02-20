'use client';

import React, { useEffect, useState } from 'react';
import { defaultColumns } from './column';
import MainTable from '@/app/shared/table/main-table';
import WidgetCard from '@components/cards/widget-card';
import { Article } from '@/data/tan-table-data';
import TablePagination from '@/app/shared/table/table-pagination';
import { useTanStackTable } from '@/app/shared/tan-table/custom-table-components/use-TanStack-Table';

import { Button } from 'rizzui';
import { PiArrowsClockwiseBold } from 'react-icons/pi';
import TableToolbarFilter from '../table-toolbar-filter-final';
import { useFileContext } from '@/app/components/context/FileContext';
import axiosClient from '@/app/components/context/api';
import ArticleAddButton from '../../articleButtom';

export default function ArticleTable({lang = "en"}:{lang?:string;}) {

  const [inputName, setInputName] = useState('');

  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(5);
  const [totalPages, setTotalPages] = useState(5);

  const options = [
    { value: 5, label: '5' },
    { value: 10, label: '10' },
    { value: 15, label: '15' },
    { value: 20, label: '20' },
  ];

  const [defaultData, setDefaultData] = useState<Article[]>([]);
  const { updateArticle, setUpdateArticle } = useFileContext();
  
  const { table, setData } = useTanStackTable<Article>({
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
        
      },
      enableColumnResizing: false,
    },
  });

  const fetchArticle = async () => {
    const queryParams = new URLSearchParams({
      name: inputName,
      PageNumber: (pageIndex + 1).toString(),
      PageSize: pageSize.toString(),
    });
  
    try {
      const response = await axiosClient.get(
        `/api/Article/GetAll?${queryParams}`,
        {
          headers: {
            Accept: '*/*',
            'Accept-Language': lang,
          },
        }
      );

      const result = response.data;
      console.log("result: ",result);
      

      const transformedData = result.entities.map((item: any) => ({
        id: item.id,
        title: item.title || '',
        userName: item.title || '',
        description: item.description || '',
        metaDescription: item.metaDescription || '',
        slug: item.slug || '',
        tags: item.tags || '',
        imageUrl: item.imageUrl,
        createdAt: item.createdAt,
        lastUpdatedAt: item.lastUpdatedAt,
      }));
      console.log("transformedData: ",transformedData);
      
      setDefaultData(transformedData);
      setData(transformedData);
      setTotalPages(result.totalPages);
    } catch (error) {
      console.error('Error fetching:', error);
    }
  };  

  useEffect(() => {
    fetchArticle();
  }, [setData, lang]); 

  useEffect(() => {
    if (updateArticle == true) {
      handleRefreshData();
      setUpdateArticle(false);
    }
  }, [updateArticle]); 

  const handleRefreshData = () => {
    fetchArticle();
  };

  return (
    <>
      <WidgetCard title={lang === 'ar' ? 'جدول المقالات' : 'Articles Table'} className="flex flex-col gap-4">
        <div className="flex justify-end items-center">
            <Button onClick={handleRefreshData} className="me-2 sm:me-6">
              <PiArrowsClockwiseBold className="me-0 sm:me-1.5 h-[17px] w-[17px]" />
              <span className='hidden sm:block'>{lang == "en"?"Update Data":'تحديث البيانات'}</span>
            </Button>
            <ArticleAddButton lang={lang} buttonLabel={lang === 'ar' ? "إضافة المقالة" : "Add Article"}  onSuccess={handleRefreshData} /> 
        </div>
        <TableToolbarFilter
          nameEN="Article" 
          nameAr="المقالة" 
          table={table}
          lang={lang}
          search={inputName}
          setSearch={setInputName}
          filters={[]}
          onSuccess={()=>setUpdateArticle(true)}
        />
        <MainTable table={table} variant={'modern'} lang={lang} />
        <TablePagination options={options} table={table} lang={lang} pageIndex={pageIndex} totalPages={totalPages} setPageIndex={setPageIndex} setPageSize={setPageSize} setUpdate={setUpdateArticle} />
      </WidgetCard>
    </>
  );
}
