'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useTable } from '@hooks/use-table';
import { useColumn } from '@hooks/use-column';
import { getColumns } from '@/app/shared/file/dashboard/best-trader/columns';
import { Title } from 'rizzui';
import { routes } from '@/config/routes';
// import { allFilesData } from '@/data/all-files';
import { useTranslation } from '@/app/i18n/client';
import ControlledTable from '@/app/shared/controlled-table';

import docIcon from '@public/doc-icon.svg';
import xmlIcon from '@public/xml-icon.svg';
import pdfIcon from '@public/pdf-icon.svg';
import imageIcon from '@public/image-icon.svg';
import folderIcon from '@public/folder-icon.svg';
import { API_BASE_URL } from '@/config/base-url';
const allFilesData1 = [
  {
    id : "ff5fe86a-137f-4043-b4a4-ae92080f21fe",
    name : "string string",
    email : "string",
    phoneNumber : "string",
    status : "true",
    totalSales : 1313
  },
  {
    id : "b9e3ce38-e8b0-4a41-80ef-af88262bf861",
    name : "mmm mmm",
    email : "mmm@gmail.com",
    phoneNumber : "01227375904",
    status : "true",
    totalSales : 0
  },
  {
    id : "5e413af9-7108-4dc4-b986-e2acd189e622",
    name : "mohamed Abd Elghaffar",
    email : "mohamed@gmail",
    phoneNumber : "01227375904",
    status : "true",
    totalSales : 0
  },
  {
    id : "b301e9ae-630a-4dcc-8b09-e3272ff88b95",
    name : "string string",
    email : "stsaring",
    phoneNumber : "string",
    status : "false",
    totalSales : 0
  },
  {
    id : "96804cd7-7c42-4274-8738-f95f76fc480f",
    name : "Ahmed mohamed",
    email : "Ahmed@gmail",
    phoneNumber : "01227375904",
    status : "true",
    totalSales : 0
  }
];

export default function BestTraderTable({ className, lang }: { className?: string; lang?: string; }) {
  const [pageSize, setPageSize] = useState(5);
  const [allFilesData, setAllFilesData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { t } = useTranslation(lang!, 'dashboardTable');
  console.log("allFilesData: ",allFilesData);
  
  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/AdminStatistics/GetBestSellers`, {
        method: 'GET',
        headers: {
          Accept: '*/*',
          'Accept-Language': lang || 'en',
        },
      });

      if (response.ok) {
        const data = await response.json();
        const transformedData = data.map((item: any) => ({
          id: item.id,
          name: item.name,
          email: item.email,
          phoneNumber: item.phoneNumber,
          status: item.isActive ? (lang === 'ar' ? 'نشط' : 'Active') : lang === 'ar' ? 'غير نشط' : 'Inactive',
          totalSales: `${item.totalSales} ${lang === 'ar' ? 'جنيه' : 'EGP'}`,
        }));
        setAllFilesData(transformedData);
      } else {
        console.error('Failed to fetch data:', response.statusText);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [lang]);
  
  const onHeaderCellClick = (value: string) => ({
    onClick: () => {
      handleSort(value);
    },
  });

  const onDeleteItem = (id: string) => {
    handleDelete(id);
  };

  const {
    isLoading,
    tableData,
    currentPage,
    totalItems,
    handlePaginate,
    sortConfig,
    handleSort,
    handleDelete,
  } = useTable(allFilesData, pageSize);

  const columns = useMemo(
    () => getColumns({ sortConfig, onHeaderCellClick, onDeleteItem, t }),
    [onHeaderCellClick, sortConfig.key, sortConfig.direction, onDeleteItem]
  );

  const { visibleColumns } = useColumn(columns);
  console.log("tableData: ",tableData);
  
  return (
    <div className={className}>
      <div className="mb-3 flex items-center justify-between 2xl:mb-5">
        <Title
          as="h3"
          className="text-lg font-semibold text-gray-900 xl:text-xl"
        >
          {t('table-title')}
        </Title>
        {/* <Link
          href={routes.file.manager}
          className="text-sm font-medium text-gray-900 hover:underline"
        >
          {t('text-view-all')}
        </Link> */}
      </div>
      <ControlledTable
        isLoading={loading || isLoading}
        data={allFilesData}
        // @ts-ignore
        columns={visibleColumns}
        scroll={{ x: 1000 }}
        variant="modern"
        tableLayout="fixed"
        rowKey={(record) => record.id}
        className="overflow-hidden rounded-lg border border-muted text-sm"
        // paginatorOptions={{
        //   pageSize,
        //   setPageSize,
        //   total: totalItems,
        //   current: currentPage,
        //   onChange: (page: number) => handlePaginate(page),
        // }}
        t={t}
      />
    </div>
  );
}
