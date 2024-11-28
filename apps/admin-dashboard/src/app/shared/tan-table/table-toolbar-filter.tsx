'use client';

import { useState } from 'react';
import cn from '@utils/class-names';
import { useMedia } from 'react-use';
import Popover from '@ui/carbon-menu/popover/popover';
import { ActionIcon, Button, Checkbox, Input, Title } from 'rizzui';
import { type Table as ReactTableType } from '@tanstack/react-table';
import { getDateRangeStateValues } from '@utils/get-formatted-date';
import {
  PiTrash,
  PiFunnel,
  PiTextColumns,
  PiTrashDuotone,
  PiMagnifyingGlassBold,
} from 'react-icons/pi';
import {
  statusOptions,
  renderOptionDisplayValue,
} from '@/app/shared/invoice/form-utils';
import PriceField from '@/app/shared/controlled-table/price-field';
import DateFiled from '@/app/shared/controlled-table/date-field';
import StatusField from '@/app/shared/controlled-table/status-field';
import { FilterDrawerView } from '@/app/shared/controlled-table/table-filter';
import InputField from '../controlled-table/input-field';
import FromToField from '../controlled-table/from-to-number-field';
import { useFileContext } from '@/app/components/context/FileContext';

interface TableToolbarProps<T extends Record<string, any>> {
  table: ReactTableType<T>;
  lang?: string;
  nameEN?: string;
  nameAr?: string;
  inputFromTo: string[];
  setInputFromTo: React.Dispatch<React.SetStateAction<string[]>>;
  inputEndUserName: string;
  setInputEndUserName: React.Dispatch<React.SetStateAction<string>>;
  inputEndUserPhoneNumber: string;
  setInputEndUserPhoneNumber: React.Dispatch<React.SetStateAction<string>>;
  inputShopName: string;
  setInputShopName: React.Dispatch<React.SetStateAction<string>>;
  createdDate: [Date | null, Date | null];
  setCreatedDate: React.Dispatch<React.SetStateAction<[Date | null, Date | null]>>;
}

const translations = {
  en: {
    searchPlaceholder: "Search by Reviews name...",
    deleteTitle: "Delete",
    toggleColumns: "Toggle Columns",
    showFilters: "Filters",
    hideFilters: "Hide",
    endUserName: "End User Name",
    endUserPhoneNumber: "End User Phone Number",
    shopName: "Shop Name",
    rateLabel: "Rate",
    fromDatePlaceholder: "From Date",
    toDatePlaceholder: "To Date",
    clear: "Clear"
  },
  ar: {
    searchPlaceholder: "البحث باسم المراجعة...",
    deleteTitle: "حذف",
    toggleColumns: "تبديل الأعمدة",
    showFilters: "الفرز",
    hideFilters: "إخفاء",
    endUserName: "اسم المستخدم النهائي",
    endUserPhoneNumber: "رقم هاتف المستخدم النهائي",
    shopName: "اسم المتجر",
    rateLabel: "التقييم",
    fromDatePlaceholder: "من تاريخ",
    toDatePlaceholder: "إلى تاريخ",
    clear: "مسح"
  }
};

export default function TableToolbarFilter<TData extends Record<string, any>>({
  table,
  lang = "en",
  nameEN="Reviews",
  nameAr="المراجعات",
  inputFromTo,
  setInputFromTo,
  inputEndUserName,
  setInputEndUserName,
  inputEndUserPhoneNumber,
  setInputEndUserPhoneNumber,
  inputShopName,
  setInputShopName,
  createdDate,
  setCreatedDate,
}: TableToolbarProps<TData>) {
  const t = translations[lang as 'en' | 'ar'] || translations.en;

  const [openDrawer, setOpenDrawer] = useState(false);
  const [showFilters, setShowFilters] = useState(true);
  const isMediumScreen = useMedia('(max-width: 1860px)', false);
  const isMultipleSelected = table.getSelectedRowModel().rows.length > 1;
  const placeholder = lang === 'ar' ? `البحث باسم ${nameAr}...` : `Search by ${nameEN} name...`;
  const deleteTitle = lang === 'ar' ? `حذف` : `Delete`;
  const toggleColumns = lang === 'ar' ? `تبديل الأعمدة` : `Toggle Columns`;
  const {
    options: { meta },
  } = table;

  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-wrap items-center gap-4">
        <Input
          type="search"
          placeholder={placeholder}
          value={table.getState().globalFilter ?? ''}
          onClear={() => table.setGlobalFilter('')}
          onChange={(e) => table.setGlobalFilter(e.target.value)}
          inputClassName="h-9"
          clearable={true}
          prefix={<PiMagnifyingGlassBold className="h-4 w-4" />}
        />
        {!isMediumScreen && showFilters && <FilterElements lang={lang} table={table} inputFromTo={inputFromTo} setInputFromTo={setInputFromTo} inputEndUserName={inputEndUserName} setInputEndUserName={setInputEndUserName} inputEndUserPhoneNumber={inputEndUserPhoneNumber} setInputEndUserPhoneNumber={setInputEndUserPhoneNumber} inputShopName={inputShopName} setInputShopName={setInputShopName} createdDate={createdDate} setCreatedDate={setCreatedDate} />}
      </div>
      <div className="flex items-center gap-4">
        <Button
          {...(isMediumScreen
            ? {
                onClick: () => {
                  setOpenDrawer(() => !openDrawer);
                },
              }
            : { onClick: () => setShowFilters(() => !showFilters) })}
          variant={'outline'}
          className={cn(
            'h-[34px] pe-3 ps-2.5',
            !isMediumScreen && showFilters && 'border-dashed border-gray-700'
          )}
        >
          <PiFunnel className="me-1.5 h-[18px] w-[18px]" strokeWidth={1.7} />
          {!isMediumScreen && showFilters ? t.hideFilters : t.showFilters}
        </Button>

        {isMediumScreen && (
          <FilterDrawerView isOpen={openDrawer} setOpenDrawer={setOpenDrawer}>
            <div className="grid grid-cols-1 gap-6">
              <FilterElements lang={lang} table={table}  inputFromTo={inputFromTo} setInputFromTo={setInputFromTo} inputEndUserName={inputEndUserName} setInputEndUserName={setInputEndUserName} inputEndUserPhoneNumber={inputEndUserPhoneNumber} setInputEndUserPhoneNumber={setInputEndUserPhoneNumber} inputShopName={inputShopName} setInputShopName={setInputShopName} createdDate={createdDate} setCreatedDate={setCreatedDate} />
            </div>
          </FilterDrawerView>
        )}

        {isMultipleSelected ? (
          <Button
            size="sm"
            color="danger"
            variant="outline"
            className="h-[34px] gap-2 text-sm"
            onClick={() =>
            //   meta?.handleMultipleDelete &&
            //   meta.handleMultipleDelete(
            //     table.getSelectedRowModel().rows.map((r) => r.original.id)
            //   )
                console.log("delete")
            
            }
          >
            <PiTrash size={18} />
            {deleteTitle}
          </Button>
        ) : null}

        {table && (
          <Popover position="bottom-end">
            <Popover.Trigger>
              <ActionIcon
                variant="outline"
                title={toggleColumns}
                className="h-auto w-auto p-1"
              >
                <PiTextColumns strokeWidth={3} className="size-6" />
              </ActionIcon>
            </Popover.Trigger>
            <Popover.Content className="z-0">
              <div className="p-2 text-left rtl:text-right">
                <Title as="h6" className="mb-6 px-0.5 text-sm font-semibold">
                  {toggleColumns}
                </Title>
                <div className="grid grid-cols-2 gap-6">
                  {table.getAllLeafColumns().map((column) => {
                    return (
                      typeof column.columnDef.header === 'string' &&
                      column.columnDef.header.length > 0 && (
                        <Checkbox
                          key={column.id}
                          label={<>{column.columnDef.header}</>}
                          checked={column.getIsVisible()}
                          onChange={column.getToggleVisibilityHandler()}
                        />
                      )
                    );
                  })}
                </div>
              </div>
            </Popover.Content>
          </Popover>
        )}
      </div>
    </div>
  );
}

function FilterElements<T extends Record<string, any>>({
  table,
  lang = 'en',
  inputFromTo,
  setInputFromTo,
  inputEndUserName,
  setInputEndUserName,
  inputEndUserPhoneNumber,
  setInputEndUserPhoneNumber,
  inputShopName,
  setInputShopName,
  createdDate,
  setCreatedDate,
}: TableToolbarProps<T> ) {
  const t = translations[lang as 'en' | 'ar'] || translations.en;
  const isMediumScreen = useMedia('(max-width: 1860px)', false);
  // const priceFieldValue = (table.getColumn('amount')?.getFilterValue() ?? [
  //   '',
  //   '',
  // ]) as string[];
  // const [inputFromTo, setInputFromTo] = useState<string[]>(['', '']);
  // const [inputEndUserName, setInputEndUserName] = useState('');
  // const [inputEndUserPhoneNumber, setInputEndUserPhoneNumber] = useState('');
  // const [inputShopName, setInputShopName] = useState('');
  // const [createdDate, setCreatedDate] = useState<[Date | null, Date | null]>([null, null]);
  const { setUpdateReviews } = useFileContext();
  const isFiltered =
  table.getState().globalFilter ||
  table.getState().columnFilters.length > 0 ||
  inputFromTo.some((value) => value !== '') ||
  inputEndUserName !== '' ||
  inputEndUserPhoneNumber !== '' ||
  inputShopName !== '' ||
  (createdDate[0] !== null && createdDate[1] !== null);
  return (
    <>
      {/* <PriceField
        value={priceFieldValue}
        onChange={(v) => {
          // table.getColumn('amount')?.setFilterValue(v);
          console.log("amount",v);
          
        }}
      /> */}
      <FromToField
        value={inputFromTo}
        label={t.rateLabel}
        toPlaceholder="0"
        fromPlaceholder="5"
        onChange={(v) => {
          // table.getColumn('amount')?.setFilterValue(v);
          console.log("input From To:",v);
          setInputFromTo(v);
          setUpdateReviews(true);
        }}
      />
      <InputField
        value={inputEndUserName}
        placeholder={t.endUserName}
        className={isMediumScreen?'w-full':'w-48'}
        onChange={(v) => {
          // table.getColumn('amount')?.setFilterValue(v);
          console.log("EndUserName: ",v);
          setInputEndUserName(v);
          setUpdateReviews(true);
        }}
      />
      <InputField
        value={inputEndUserPhoneNumber}
        placeholder={t.endUserPhoneNumber}
        className={isMediumScreen?'w-full':'w-48'}
        onChange={(v) => {
          // table.getColumn('amount')?.setFilterValue(v);
          console.log("EndUserPhoneNumber: ",v);
          setInputEndUserPhoneNumber(v);
          setUpdateReviews(true);
        }}
      />
      <InputField
        value={inputShopName}
        placeholder={t.shopName}
        className={isMediumScreen?'w-full':'w-48'}
        onChange={(v) => {
          // table.getColumn('amount')?.setFilterValue(v);
          console.log("Shop Name: ",v);
          setInputShopName(v);
          setUpdateReviews(true);
        }}
      />
      <DateFiled
        className="w-full"
        placeholderText={`${t.fromDatePlaceholder} ${t.toDatePlaceholder}`}
        endDate={createdDate[1] ? getDateRangeStateValues(createdDate[1].toISOString()) : null}
        selected={createdDate[0] ? getDateRangeStateValues(createdDate[0].toISOString()) : null}
        startDate={createdDate[0] ? getDateRangeStateValues(createdDate[0].toISOString()) : null}
        onChange={(date) =>{ 
          table.getColumn('createdAt')?.setFilterValue(date);
          setCreatedDate(date as [Date | null, Date | null]);
          console.log("From Date", date);
          setUpdateReviews(true);
        }}
      />
      
      {isFiltered && (
        <Button
          size="sm"
          onClick={() => {
            // Clear local filter states
            setInputFromTo(['', '']);
            setInputEndUserName('');
            setInputEndUserPhoneNumber('');
            setInputShopName('');
            setCreatedDate([null, null]);
            setUpdateReviews(true);
          }}
          variant="flat"
          className="h-9 bg-gray-200/70"
        >
          <PiTrashDuotone className="me-1.5 h-[17px] w-[17px]" /> {t.clear}
        </Button>
      )}
    </>
  );
}
