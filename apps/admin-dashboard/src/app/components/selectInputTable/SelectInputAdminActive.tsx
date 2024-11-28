'use client';
import { useEffect, useState } from 'react';
import { Select, Text } from 'rizzui';
import { PiCheckCircleBold, PiClockBold } from 'react-icons/pi';
import SelectTableColumn from './selectTableColumn';
import toast from 'react-hot-toast';
import { API_BASE_URL } from '@/config/base-url';
import { useFileContext } from '../context/FileContext';

interface SelectInputAdminActiveProps {
  selectItem?: string;
  lang?: string;
  selectItemId?: string;
  rowData: {
    id: string;
    firstName: string;
    lastName: string;
    phoneNumber: string;
    email: string;
  };
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

function SelectInputAdminActive({ lang = 'en', selectItem, selectItemId, rowData, }: SelectInputAdminActiveProps) {
  const t = translations[lang as 'en' | 'ar'] || translations.en;
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
  const [selectedValue, setSelectedValue] = useState<string>(selectItem?selectItem:'');
  const { updateAccounts, setUpdateAccounts } = useFileContext();
  console.log("select item for: ",rowData.firstName," select: ",selectItem);
  

  // useEffect(() => {
  //   if (selectItem) {
  //     setSelectedValue(selectItem);
  //   }
  // }, [selectItem]);

  const handleValueSelectChange = async (value: string) => {
    console.log("Selected column option:", value);
    setSelectedValue(value);
    const isActive = value === '1';

    try {
      const response = await fetch(`${API_BASE_URL}/api/Support/Update/${selectItemId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Accept-Language': lang,
        },
        body: JSON.stringify({
          firstName: rowData.firstName,
          lastName: rowData.lastName,
          phoneNumber: rowData.phoneNumber,
          email: rowData.email,
          isActive,
        }),
      });

      if (response.ok) {
        toast.success(t.updateSuccess);
        setUpdateAccounts(true);
      } else {
        const errorData = await response.json();
        console.error('Error updating status:', errorData);
        toast.error(t.updateFail);
      }
    } catch (error) {
      console.error('Error during status update:', error);
      toast.error(t.updateFail);
    }
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

export default SelectInputAdminActive;
