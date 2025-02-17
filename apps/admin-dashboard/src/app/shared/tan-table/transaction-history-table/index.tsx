'use client';

// import { getColumns } from '@/app/shared/financial/dashboard/transaction-history-table/columns';
import { transactionHistory } from '@/data/transaction-history';
import WidgetCard from '@components/cards/widget-card';
import { useCallback, useState, useMemo } from 'react';
import { useColumn } from '@hooks/use-column';
import { useTable } from '@hooks/use-table';
import ControlledTable from '@/app/shared/controlled-table/index';
import { PiMagnifyingGlassBold } from 'react-icons/pi';
import { Input } from 'rizzui';
// import FilterElement from '@/app/shared/financial/dashboard/transaction-history-table/filter-element';
import { getColumns } from './columns';
import FilterElement from './filter-element';

const filterState = {
  date: [null, null],
  status: '',
};
export default function TransactionHistoryTable({
  className,
  lang,
}: {
  className?: string;
  lang?: string;
}) {
  const text = {
    title: lang === 'ar' ? 'تاريخ المعاملات' : 'Transaction History',
    search: lang === 'ar' ? 'البحث عن تفاصيل المستخدم...' : 'Search for user details...',
    clear: lang === 'ar' ? 'حذف' : 'Clear',
  };
  const [pageSize, setPageSize] = useState(7);

  const onHeaderCellClick = (value: string) => ({
    onClick: () => {
      handleSort(value);
    },
  });

  const onDeleteItem = useCallback((id: string) => {
    handleDelete(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const {
    isLoading,
    isFiltered,
    tableData,
    currentPage,
    totalItems,
    handlePaginate,
    filters,
    updateFilter,
    searchTerm,
    handleSearch,
    sortConfig,
    handleSort,
    selectedRowKeys,
    handleRowSelect,
    handleSelectAll,
    handleDelete,
    handleReset,
  } = useTable(transactionHistory, pageSize, filterState);

  const columns = useMemo(
    () =>
      getColumns({
        data: transactionHistory,
        sortConfig,
        checkedItems: selectedRowKeys,
        onHeaderCellClick,
        onDeleteItem,
        onChecked: handleRowSelect,
        handleSelectAll,
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [
      selectedRowKeys,
      onHeaderCellClick,
      sortConfig.key,
      sortConfig.direction,
      onDeleteItem,
      handleRowSelect,
      handleSelectAll,
    ]
  );

  const { visibleColumns } = useColumn(columns);
  return (
    <WidgetCard
      className={className}
      headerClassName="mb-6 items-start flex-col md:flex-row md:items-center"
      actionClassName="w-full ps-0 items-center"
      titleClassName="w-[19ch]"
      title={text.title}
      action={
        <div className=" mt-4 flex w-full flex-col-reverse items-center justify-between  gap-3  md:flex-row md:mt-0">
          <FilterElement
            isFiltered={isFiltered}
            filters={filters}
            updateFilter={updateFilter}
            handleReset={handleReset}
            lang={lang}
          />
          <Input
            className="w-full md:w-auto"
            type="search"
            inputClassName="h-9"
            placeholder={text.search}
            value={searchTerm}
            onClear={() => handleSearch('')}
            onChange={(event) => handleSearch(event.target.value)}
            clearable
            prefix={<PiMagnifyingGlassBold className="h-4 w-4" />}
          />
        </div>
      }
    >
      <ControlledTable
        variant="modern"
        data={tableData}
        isLoading={isLoading}
        showLoadingText={true}
        // @ts-ignore
        columns={visibleColumns}
        paginatorOptions={{
          pageSize,
          setPageSize,
          total: totalItems,
          current: currentPage,
          onChange: (page: number) => handlePaginate(page),
        }}
        className="-mx-5 lg:-mx-7"
      />
    </WidgetCard>
  );
}
