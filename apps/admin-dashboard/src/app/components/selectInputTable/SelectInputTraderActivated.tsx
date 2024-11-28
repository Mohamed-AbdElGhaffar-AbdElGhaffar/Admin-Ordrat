'use client';
import { useEffect, useState } from 'react';
import { Select, Text } from 'rizzui';
import { PiCheckCircleBold, PiClockBold } from 'react-icons/pi';
import SelectTableColumn from './selectTableColumn';
import { useFileContext } from '../context/FileContext';
import toast from 'react-hot-toast';
import { API_BASE_URL } from '@/config/base-url';

interface SelectInputTraderActivatedProps {
  selectItem?: string;
  lang?: string;
  selectItemId?: string;
}

const translations = {
  en: {
    select: "Select Status",
    updateSuccess: "Status updated successfully!",
    updateFail: "Failed to update status.",
  },
  ar: {
    select: "اختار حالة",
    updateSuccess: "تم تحديث الحالة بنجاح!",
    updateFail: "فشل في تحديث الحالة.",
  }
};

function SelectInputTraderActivated({ lang = 'en', selectItem, selectItemId }: SelectInputTraderActivatedProps) {
  const t = translations[lang as 'en' | 'ar'] || translations.en;
  const { updateSeller, setUpdateSeller } = useFileContext();
  const staticOptions = lang === 'ar' 
  ? [
      { id: '1', name: 'نشط' },    
      { id: '2', name: 'غير نشط' },
    ] 
  : [
      { id: '1', name: 'Active' },
      { id: '2', name: 'Inactive' },
    ];
  const [selectedValue, setSelectedValue] = useState<string>('');

  const handleValueSelectChange = async (value: string) => {
    console.log("Selected column option:", value);
    setSelectedValue(value);
    const isActive = value === '1';

    // try {
    //   const apiEndpoint = isActive
    //     ? `${API_BASE_URL}/api/Shop/Activate/${selectItemId}`
    //     : `${API_BASE_URL}/api/Shop/DeActivate/${selectItemId}`;
    //   const response = await fetch(apiEndpoint, {
    //     method: 'PATCH',
    //     headers: {
    //       Accept: '*/*',
    //     },
    //   });

    //   if (response.ok) {
    //     toast.success(t.updateSuccess);
    //     setUpdateSeller(true);
    //   } else {
    //     const errorData = await response.json();
    //     console.error('Error updating status:', errorData);
    //     toast.error(t.updateFail);
    //   }
    // } catch (error) {
    //   console.error('Error during status update:', error);
    //   toast.error(t.updateFail);
    // }
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

export default SelectInputTraderActivated;
