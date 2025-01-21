'use client';
import { useEffect, useState } from 'react';
import { Select, Text } from 'rizzui';
import { PiCheckCircleBold, PiClockBold } from 'react-icons/pi';
import SelectTableColumn from './selectTableColumn';
import toast from 'react-hot-toast';
import { API_BASE_URL } from '@/config/base-url';
import { useFileContext } from '../context/FileContext';
import axiosClient from '../context/api';

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
    const updatedData = {
      firstName: rowData.firstName,
      lastName: rowData.lastName,
      phoneNumber: rowData.phoneNumber,
      email: rowData.email,
      isActive: isActive,
    }; 
    try {
      const response = await axiosClient.put(`/api/Support/Update/${selectItemId}`, updatedData, {
          headers: { 'Accept-Language': lang },
        });

        if (response.status === 200) {
        toast.success(t.updateSuccess);
        setUpdateAccounts(true);
      } else {
        console.error('Error updating status');
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
