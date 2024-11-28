'use client';

import { PiXBold, PiPlusBold, PiMinusBold } from 'react-icons/pi';
import React, { useEffect, useState } from 'react';
import { ActionIcon, Title, Button, Input, Textarea } from 'rizzui';
import ReactSelect from 'react-select';
import { useModal } from '@/app/shared/modal-views/use-modal';
import toast from 'react-hot-toast';
import styles from './ViewBuyersForm.module.css';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { boolean } from 'zod';
import { Loader } from 'lucide-react';
import { API_BASE_URL } from '@/config/base-url';

type Feature = {
  title: string;
  description: string;
};
type GuestData = {
  id: string;
  name: string;
  totalItems: number;
  totalPaid: string;
  email: string;
  phoneNumber: string;
  country: string;
  state: string;
  city: string;
};
type ViewBuyersFormProps = {
  title?: string;
  modalBtnLabel?: string;
  onSuccess?: () => void;
  lang: string;
  planId: string;
  // guestData: GuestData;
  // loading: boolean;
};

export default function ViewBuyersForm({
  title,
  modalBtnLabel = 'عرض مشتري',
  onSuccess,
  lang = 'en',
  planId,
  // guestData,
  // loading,
}: ViewBuyersFormProps) {
  const { closeModal } = useModal();

  const [guestData, setGuestData] = useState<GuestData | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchGuestData = async (id: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/EndUser/GetById/${id}`, {
        method: 'GET',
        headers: {
          Accept: '*/*',
          'Accept-Language': lang,
        },
      });

      if (response.ok) {
        const data = await response.json();
        const transformedData: GuestData = {
          id,
          name: `${data.firstName} ${data.lastName}`,
          totalItems: data.totalPurchasedProducts || 0,
          totalPaid: `${data.totalProfit || 0} ${lang === 'ar' ? 'جنيه' : 'EGP'}`,
          email: data.email || '',
          phoneNumber: data.phoneNumber || '',
          country: lang === 'ar' ? 'مصر' : 'Egypt',
          state: lang === 'ar' ? 'القاهرة' : 'Cairo',
          city: lang === 'ar' ? 'مدينة نصر' : 'Nasr City',
        };

        setGuestData(transformedData);
      } else {
        toast.error(lang === 'ar' ? 'فشل في تحميل بيانات المشتري' : 'Failed to load buyer data');
      }
    } catch (error) {
      console.error('Error fetching guest data:', error);
      toast.error(lang === 'ar' ? 'حدث خطأ أثناء تحميل البيانات' : 'An error occurred while fetching the buyer data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGuestData(planId);
  }, [planId]);


  const text = {
    name: lang === 'ar' ? 'الأسم' : 'Name',
    totalItems: lang === 'ar' ? 'عدد المنتجات التي اشتراها' : 'Total Items Purchased',
    totalPaid: lang === 'ar' ? 'اجمالي المدفوع' : 'Total Paid',
    email: lang === 'ar' ? 'البريد الالكتروني' : 'Email',
    phone: lang === 'ar' ? 'رقم الهاتف' : 'Phone Number',
    location: lang === 'ar' ? 'العنوان' : 'Location',
    country: lang === 'ar' ? 'البلد' : 'Country',
    state: lang === 'ar' ? 'المحافظة' : 'State',
    city: lang === 'ar' ? 'المدينه' : 'City',
    warn: lang === 'ar' ? 'انذار' : 'Warn',
    ban: lang === 'ar' ? 'حظر' : 'Ban',
    submit: lang === 'ar' ? 'معلومات المشتري' : 'Buyer Information',
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <Loader className="animate-spin text-[#e11d48]" width={40} height={40} />
      </div>
    );
  }

  if (!guestData) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <p>{lang === 'ar' ? 'لا توجد بيانات لعرضها' : 'No data available to display'}</p>
      </div>
    );
  }
  
  return (
    <div className='py-1'>
      <div className={`m-auto ps-3 rounded-xl pe-1.5 me-1.5 pb-4 pt-4 rtl IBM-Plex-sans ${styles.customScroll}`}>
        <div className="mb-6 flex items-center justify-between">
          <Title as="h3" className="text-base IBM-Plex-sans">{title || text.submit}</Title>
          <ActionIcon size="sm" variant="text" onClick={closeModal} className="p-0 text-gray-500 hover:!text-gray-900">
            <PiXBold className="h-[18px] w-[18px]" />
          </ActionIcon>
        </div>

        {/* Buyer Information */}
        <div className="text-start">
          <Title as="h4" className="text-lg mb-3">{lang === 'ar' ? 'بيانات العميل :' : 'Client Data:'}</Title>
          <div className='w-full block md:flex'>
            <div className='w-full md:w-5/12'>
              <h3 className="font-bold text-lg leading-[28px] text-black pb-[10px]">
                {text.name}: <span className="font-normal text-lg leading-[28px] text-gray-500">{guestData.name || (lang === 'ar' ? 'غير متوفر' : 'Not Available')}</span>
              </h3>
              <h3 className="font-bold text-lg leading-[28px] text-black pb-[10px]">
                {text.totalItems}: <span className="font-normal text-base leading-[28px] text-gray-500">{guestData.totalItems || '0'}</span>
              </h3>
              <h3 className="font-bold text-lg leading-[28px] text-black pb-[10px]">
                {text.totalPaid}: <span className="font-normal text-base leading-[28px] text-gray-500">{guestData.totalPaid || '0'}</span>
              </h3>
            </div>
            <div className='w-full md:w-7/12'>
              <h3 className="font-bold text-lg leading-[28px] text-black pb-[10px]">
                {text.email}: <span className="font-normal text-base leading-[28px] text-gray-500">{guestData.email || (lang === 'ar' ? 'لا يوجد' : 'Not Available')}</span>
              </h3>
              <h3 className="font-bold text-lg leading-[28px] text-black pb-[10px]">
                {text.phone}: <span className="font-normal text-base leading-[28px] text-gray-500">{guestData.phoneNumber || (lang === 'ar' ? 'لا يوجد' : 'Not Available')}</span>
              </h3>
            </div>
          </div>

          {/* Location Information */}
          <div className='border-t border-[#dee2e6] mt-4'>
            <Title as="h4" className="text-lg mt-4 mb-3">{text.location}:</Title>
            <div className='w-full block md:flex'>
              <div className='w-full md:w-6/12'>
                <h3 className="font-bold text-lg leading-[28px] text-black pb-[10px]">
                  {text.country}: <span className="font-normal text-base leading-[28px] text-gray-500">{guestData.country || (lang === 'ar' ? 'غير متوفر' : 'Not Available')}</span>
                </h3>
                <h3 className="font-bold text-lg leading-[28px] text-black pb-[10px]">
                  {text.state}: <span className="font-normal text-base leading-[28px] text-gray-500">{guestData.state || (lang === 'ar' ? 'غير متوفر' : 'Not Available')}</span>
                </h3>
              </div>
              <div className='w-full md:w-6/12'>
                <h3 className="font-bold text-lg leading-[28px] text-black pb-[10px]">
                  {text.city}: <span className="font-normal text-base leading-[28px] text-gray-500">{guestData.city || (lang === 'ar' ? 'غير متوفر' : 'Not Available')}</span>
                </h3>
              </div>
            </div>
          </div>
        </div> 

        <div className="flex gap-3">
          <Button onClick={() => console.log("Ban") } className="w-full">
            {text.ban}
          </Button>
          <Button onClick={() => console.log("warn") } className="w-full">
            {text.warn}
          </Button>
        </div>
      </div>
    </div>
  );
}
