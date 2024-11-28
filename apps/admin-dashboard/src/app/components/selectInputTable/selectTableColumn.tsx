'use client';
import { useEffect, useMemo, useState } from 'react';
import { Select, Text } from 'rizzui';
import { PiCheckCircleBold, PiClockBold } from 'react-icons/pi';

interface SelectTableColumnProps {
  placeholder?: string;
  options: { id: string; name: string }[];
  selectItem?: string;
  selectValue: string | undefined; 
  onChange: (value: string) => void;
  error?: string;
  optionId?: boolean;
  lang?: string;
}

interface SelectOption {
  value: string;
  label: string;
}

function SelectTableColumn({ lang = 'en', placeholder = "Select Role", optionId, options, selectItem, selectValue, onChange }: SelectTableColumnProps) {
  // const selectItemValue = options.find((option) => option.name === selectItem);
  // const [value, setValue] = useState(selectItemValue);
  const staticOptions = lang === 'ar' 
  ? [
      { id: '1', name: 'نشط' },    
      { id: '2', name: 'غير نشط' },
      { id: '3', name: 'قيد الانتظار' }
    ] 
  : [
      { id: '1', name: 'Active' },
      { id: '2', name: 'Inactive' },
      { id: '3', name: 'Pending' }
    ];
  const finalOptions = options && options.length > 0 ? options : staticOptions;
  
  const selectOptions = useMemo(
    () =>
      (options && options.length > 0 ? options : staticOptions).map((option) => ({
        id: option.id,
        value: optionId ? option.id : option.name,
        label: option.name,
      })),
    [options, staticOptions, optionId]
  );


  const initialSelected = selectItem
    ? selectOptions.find((option) => option.label === selectItem) || null
    : null;

  const [value, setValue] = useState<SelectOption | null>(initialSelected);

  // Update internal state and trigger onChange when selectValue changes externally
  useEffect(() => {
    const selectedOption = selectOptions.find(
      (option) => option.value === selectValue
    ) || null;
    
    if (selectedOption && selectedOption.value !== value?.value) {
      setValue(selectedOption);
    }
  }, [selectValue, selectOptions, value]);
  return (
    <div>
      <Select
        dropdownClassName="!z-10"
        className="min-w-[120px]"
        inPortal={false}
        placeholder={placeholder}
        options={selectOptions}
        value={value}
        onChange={(option: SelectOption | null) => {
          setValue(option);
          if (option) {
            onChange(option.value);
          }
        }}
        displayValue={(option: { label: any }) =>
          renderOptionDisplayValue(option.label as string)
        }
      />
    </div>
  );
}

function renderOptionDisplayValue(value: string) {
  switch (value) {
    default:
      return (
        <div className="flex items-center">
          <PiCheckCircleBold className="shrink-0 fill-green text-base" />
          <Text className="ms-1.5 text-sm font-medium capitalize text-gray-700">
            {value}
          </Text>
        </div>
      );
  }
}

export default SelectTableColumn;
