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
import PriceField from '@/app/shared/controlled-table/price-field';
import DateFiled from '@/app/shared/controlled-table/date-field';
import StatusField from '@/app/shared/controlled-table/status-field';
import { FilterDrawerView } from '@/app/shared/controlled-table/table-filter';
import InputField from '../controlled-table/input-field';
import FromToField from '../controlled-table/from-to-number-field';
import { renderOptionDisplayValue, statusOptions } from '../invoice/form-utils-activation';
import RoleSelect from './selectInput';
import { useFileContext } from '@/app/components/context/FileContext';

interface TableToolbarProps<T extends Record<string, any>> {
  table: ReactTableType<T>;
  lang?: string;
  nameEN?: string;
  nameAr?: string;
  inputEarn: string[];
  setInputEarn: React.Dispatch<React.SetStateAction<string[]>>;
  inputSellerId: string;
  setInputSellerId: React.Dispatch<React.SetStateAction<string>>;
  selectedValue: string;
  setSelectedValue: React.Dispatch<React.SetStateAction<string>>;
  inputShopName: string;
  setInputShopName: React.Dispatch<React.SetStateAction<string>>;
}

const translations = {
  en: {
    searchPlaceholder: "Search by Stores name...",
    deleteTitle: "Delete",
    toggleColumns: "Toggle Columns",
    showFilters: "Filters",
    hideFilters: "Hide",
    sellerId: "Seller Id",
    earn: "Earning",
    select: "Select Status",
    shopName: "Shop Name",
    clear: "Clear",
    currency: "EGP",
  },
  ar: {
    searchPlaceholder: "البحث باسم المشتري...",
    deleteTitle: "حذف",
    toggleColumns: "تبديل الأعمدة",
    showFilters: "الفرز",
    hideFilters: "إخفاء",
    sellerId: "كود التاجر",
    earn: "الربح",
    select: "اختار حالة",
    shopName: "اسم المتجر",
    clear: "مسح",
    currency: "ج.م."
  }
};

export default function TableToolbarFilterStores<TData extends Record<string, any>>({
  table,
  lang = "en",
  nameEN="Stores",
  nameAr="التجار",
  inputEarn,
  setInputEarn,
  inputSellerId,
  setInputSellerId,
  selectedValue,
  setSelectedValue,
  inputShopName,
  setInputShopName,
}: TableToolbarProps<TData>) {
  const t = translations[lang as 'en' | 'ar'] || translations.en;
  const { setUpdateStores } = useFileContext();

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
          onChange={(e) => {
            table.setGlobalFilter(e.target.value);
            setInputShopName(e.target.value);
            setUpdateStores(true);
          }}
          inputClassName="h-9"
          clearable={true}
          prefix={<PiMagnifyingGlassBold className="h-4 w-4" />}
        />
        {!isMediumScreen && showFilters && <FilterElements lang={lang} table={table} inputEarn={inputEarn} setInputEarn={setInputEarn} inputSellerId={inputSellerId} setInputSellerId={setInputSellerId} selectedValue={selectedValue} setSelectedValue={setSelectedValue} inputShopName={inputShopName} setInputShopName={setInputShopName} />}
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
              <FilterElements lang={lang} table={table}  inputEarn={inputEarn} setInputEarn={setInputEarn} inputSellerId={inputSellerId} setInputSellerId={setInputSellerId} selectedValue={selectedValue} setSelectedValue={setSelectedValue} inputShopName={inputShopName} setInputShopName={setInputShopName} />
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

interface SelectOption {
  value: string;
  label: string;
}


function FilterElements<T extends Record<string, any>>({
  table,
  lang = 'en',
  inputEarn,
  setInputEarn,
  inputSellerId,
  setInputSellerId,
  selectedValue,
  setSelectedValue,
  inputShopName,
  setInputShopName,
}: TableToolbarProps<T> ) {
  const t = translations[lang as 'en' | 'ar'] || translations.en;
  const isMediumScreen = useMedia('(max-width: 1860px)', false);
  // const [inputEarn, setInputEarn] = useState<string[]>(['', '']);
  // const [inputSellerId, setInputSellerId] = useState('');
//   const [selectedStatus, setSelectedStatus] = useState<string>('');
  // const [selectedValue, setSelectedValue] = useState<string>('');
  const isFiltered =
  table.getState().globalFilter ||
  table.getState().columnFilters.length > 0 ||
  inputEarn.some((value) => value !== '') ||
  inputSellerId !== '' ||
  selectedValue !== '';
  const { setUpdateStores } = useFileContext();

//   const handleStatusChange = (option: SelectOption) => {
//     console.log("Selected option:", option);
//     setSelectedStatus(option.value);
//   };
  const handleValueSelectChange = (value: string) => {
    console.log("Selected real option:", value);
    setSelectedValue(value);
    setUpdateStores(true);
  };

  const staticOptions = lang === 'ar' 
  ? [
      { id: '1', name: 'نشط' },    
      { id: '2', name: 'غير نشط' },
      // { id: '3', name: 'قيد الانتظار' }
    ] 
  : [
      { id: '1', name: 'Active' },
      { id: '2', name: 'Inactive' },
      // { id: '3', name: 'Pending' }
    ];

  return (
    <>
      <PriceField
        value={inputEarn}
        onChange={(v) => {
          // table.getColumn('amount')?.setFilterValue(v);
          console.log("amount",v);
          setInputEarn(v);
          setUpdateStores(true);
        }}
        label={t.earn}
        toPlaceholder="0"
        fromPlaceholder="50k"
        currencyPrefix={t.currency}
      />
      <InputField
        value={inputSellerId}
        placeholder={t.sellerId}
        className={isMediumScreen?'w-full':'w-48'}
        onChange={(v) => {
          // table.getColumn('amount')?.setFilterValue(v);
          console.log("sellerId: ",v);
          setInputSellerId(v);
          setUpdateStores(true);
        }}
      />
      {/* <InputField
        value={inputShopName}
        placeholder={t.shopName}
        className={isMediumScreen?'w-full':'w-48'}
        onChange={(v) => {
          // table.getColumn('amount')?.setFilterValue(v);
          console.log("Shop Name: ",v);
          setInputShopName(v);
          setUpdateStores(true);
        }}
      /> */}
      <RoleSelect
        placeholder={t.select}
        options={staticOptions}
        optionId={true}
        selectValue={selectedValue}
        onChange={(e)=>handleValueSelectChange(e)}
      />
      {isFiltered && (
        <Button
          size="sm"
          onClick={() => {
            // Clear local filter states
            setInputEarn(['', '']);
            setInputSellerId('');
            setSelectedValue('');
            setUpdateStores(true);
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
