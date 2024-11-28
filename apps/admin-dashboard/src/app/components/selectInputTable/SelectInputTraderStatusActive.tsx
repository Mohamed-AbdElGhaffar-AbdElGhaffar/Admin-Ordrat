'use client';
import { useEffect, useState } from 'react';
import { Select, Text } from 'rizzui';
import { PiCheckCircleBold, PiClockBold } from 'react-icons/pi';
import SelectTableColumn from './selectTableColumn';

interface SelectInputTraderStatusActiveProps {
  selectItem?: string;
  lang?: string;
}

const translations = {
  en: {
    select: "Select Status",
  },
  ar: {
    select: "اختار حالة",
  }
};

function SelectInputTraderStatusActive({ lang = 'en', selectItem }: SelectInputTraderStatusActiveProps) {
  const t = translations[lang as 'en' | 'ar'] || translations.en;
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
  const [selectedValue, setSelectedValue] = useState<string>('');
  const handleValueSelectChange = (value: string) => {
    console.log("Selected column option:", value);
    setSelectedValue(value);
  };
  return (
    <SelectTableColumn
        placeholder={t.select}
        options={staticOptions}
        optionId={true}
        selectValue={selectedValue}
        onChange={(e)=>handleValueSelectChange(e)}
        selectItem={selectItem}
      />
  );
}

export default SelectInputTraderStatusActive;
