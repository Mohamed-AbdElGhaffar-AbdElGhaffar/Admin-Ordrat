'use client';

import { PiXBold, PiPlusBold, PiMinusBold, PiArrowClockwiseBold } from 'react-icons/pi';
import React, { useEffect, useState } from 'react';
import { ActionIcon, Title, Button, Input, Textarea } from 'rizzui';
import ReactSelect from 'react-select';
import { useModal } from '@/app/shared/modal-views/use-modal';
import toast from 'react-hot-toast';
import styles from './UpdateAccountsForm.module.css';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { API_BASE_URL } from '@/config/base-url';
import { Loader } from 'lucide-react';
import { useFileContext } from '../../context/FileContext';

type Feature = {
  title: string;
  description: string;
};

type UpdateAccountsFormProps = {
  title?: string;
  modalBtnLabel?: string;
  onSuccess?: () => void;
  lang: string;
  accountId: string;
};

type AccountDetails = {
  id: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  email: string;
};

export default function UpdateAccountsForm({
  title,
  modalBtnLabel = 'تعديل مساعد ادمن',
  onSuccess,
  lang = 'en',
  accountId
}: UpdateAccountsFormProps) {
  const { closeModal } = useModal();
  const [selectedFeatures, setSelectedFeatures] = useState<Feature[]>([]);
  const [dynamicOptions, setDynamicOptions] = useState([
    { value: 'feature1', label: lang === 'ar' ? 'ميزة 1' : 'Feature 1' },
    { value: 'feature2', label: lang === 'ar' ? 'ميزة 2' : 'Feature 2' },
  ]);
  const [accountDetails, setAccountDetails] = useState<AccountDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [isChanged, setIsChanged] = useState(false);
  const { setUpdateAccounts } = useFileContext();

  const text = {
    firstName: lang === 'ar' ? 'الاسم الأول' : 'First Name',
    lastName: lang === 'ar' ? 'الاسم الأخير' : 'Last Name',
    phoneNumber: lang === 'ar' ? 'رقم الهاتف' : 'Phone Number',
    email: lang === 'ar' ? 'البريد الالكتروني' : 'Email',
    selectPermissions: lang === 'ar' ? 'اختيار صلاحية' : 'Select Permissions',
    submit: lang === 'ar' ? 'تعديل مساعد المسؤول' : 'Update Admin Assestant',
  };

  const requiredMessage = lang === 'ar' ? 'مطلوب' : 'is required';

  const fetchAccountDetails = async (id: string) => {
    try {
      const [responseAr, responseEn] = await Promise.all([
        fetch(`${API_BASE_URL}/api/Support/GetById/${accountId}`, {
          headers: { 'Accept-Language': 'ar' },
        }),
        fetch(`${API_BASE_URL}/api/Support/GetById/${accountId}`, {
          headers: { 'Accept-Language': 'en' },
        }),
      ]);

      if (responseAr.ok && responseEn.ok) {
        const dataAr = await responseAr.json();
        const dataEn = await responseEn.json();
        if (dataEn) {
          return {
            id: dataEn.id,
            firstName: dataEn.firstName,
            lastName: dataEn.lastName,
            phoneNumber: dataEn.phoneNumber,
            email: dataEn.email,
          };
        }
      }

      throw new Error('Failed to fetch account details');
    } catch (error) {
      console.error('Error fetching account details:', error);
      return null;
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      const details = await fetchAccountDetails(accountId);
      setAccountDetails(details);
      setLoading(false);
    };

    fetchData();
  }, [accountId]);

  const mainFormSchema = Yup.object().shape({
    firstName: Yup.string().required(`${text.firstName} ${requiredMessage}`),
    lastName: Yup.string().required(`${text.lastName} ${requiredMessage}`),
    phoneNumber: Yup.string()
      .required(`${text.phoneNumber} ${requiredMessage}`)
      .matches(/^\d+$/, lang === 'ar' ? 'رقم الهاتف غير صالح' : 'Invalid phone number'),
    email: Yup.string()
      .required(`${text.email} ${requiredMessage}`)
      .email(lang === 'ar' ? 'البريد الإلكتروني غير صالح' : 'Invalid email address'),
    // permissions: Yup.array().min(1, text.selectPermissions + ' ' + requiredMessage),
  });

  const mainFormik = useFormik({
    initialValues: {
      firstName: accountDetails?.firstName || '',
      lastName: accountDetails?.lastName || '',
      phoneNumber: accountDetails?.phoneNumber || '',
      email: accountDetails?.email || '',
      // permissions: [],
    },
    validationSchema: mainFormSchema,
    enableReinitialize: true,
    onSubmit: async (values) => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/Support/Update/${accountId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Accept-Language': lang,
          },
          body: JSON.stringify(values),
        });

        if (response.ok) {
          toast.success(lang === 'ar' ? 'تم تعديل مساعد المسؤول بنجاح!' : 'Admin Assistant updated successfully!');
          setUpdateAccounts(true);
          closeModal();
        } else {
          const errorData = await response.json();
          toast.error(errorData.message || lang === 'ar' ? 'حدث خطأ أثناء التعديل' : 'An error occurred while updating');
        }
      } catch (error) {
        console.error('Error updating account:', error);
        toast.error(lang === 'ar' ? 'حدث خطأ أثناء التعديل' : 'An error occurred while updating');
      }
    },
  });

  useEffect(() => {
    if (accountDetails) {
      const isFormChanged =
        mainFormik.values.firstName !== accountDetails.firstName ||
        mainFormik.values.lastName !== accountDetails.lastName ||
        mainFormik.values.phoneNumber !== accountDetails.phoneNumber ||
        mainFormik.values.email !== accountDetails.email;
      setIsChanged(isFormChanged);
    }
  }, [mainFormik.values, accountDetails]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <Loader className="animate-spin text-[#e11d48]" width={40} height={40} />
      </div>
    );
  }

  if (!accountDetails) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <p>{lang === 'ar' ? 'فشل تحميل البيانات' : 'Failed to load data'}</p>
      </div>
    );
  }

  return (
    <div className='py-1'>
      <div className={`m-auto ps-3 rounded-xl pe-1.5 me-1.5 pb-4 pt-4 rtl IBM-Plex-sans ${styles.customScroll}`}>
        <div className="mb-6 flex items-center justify-between">
          <Title as="h3" className="text-lg IBM-Plex-sans">{title || text.submit}</Title>
          <ActionIcon size="sm" variant="text" onClick={closeModal} className="p-0 text-gray-500 hover:!text-gray-900">
            <PiXBold className="h-[18px] w-[18px]" />
          </ActionIcon>
        </div>

        {/* Main Form Inputs */}
        <form onSubmit={(e) => {
          e.preventDefault();
          mainFormik.handleSubmit();
        }}>
          <Input label={text.firstName} placeholder={text.firstName} name="firstName" value={mainFormik.values.firstName} onChange={mainFormik.handleChange} onBlur={mainFormik.handleBlur} error={mainFormik.touched.firstName && mainFormik.errors.firstName ? mainFormik.errors.firstName : ''} className="mb-4" />
          <Input label={text.lastName} placeholder={text.lastName} name="lastName" value={mainFormik.values.lastName} onChange={mainFormik.handleChange} onBlur={mainFormik.handleBlur} error={mainFormik.touched.lastName && mainFormik.errors.lastName ? mainFormik.errors.lastName : ''} className="mb-4" />
          <Input label={text.phoneNumber} placeholder={text.phoneNumber} name="phoneNumber" value={mainFormik.values.phoneNumber} onChange={mainFormik.handleChange} onBlur={mainFormik.handleBlur} error={mainFormik.touched.phoneNumber && mainFormik.errors.phoneNumber ? mainFormik.errors.phoneNumber : ''} className="mb-4" />
          <Input label={text.email} placeholder={text.email} name="email" value={mainFormik.values.email} onChange={mainFormik.handleChange} onBlur={mainFormik.handleBlur} error={mainFormik.touched.email && mainFormik.errors.email ? mainFormik.errors.email : ''} className="mb-4" />

          <label className="block text-sm mb-1.5 font-medium" htmlFor="permissions">
            {text.selectPermissions}
          </label>
          <ReactSelect
            isMulti
            placeholder={text.selectPermissions}
            value={selectedFeatures.map((feature) => ({ value: feature.title, label: feature.title }))}
            onChange={(selectedOptions) => {
              const options = selectedOptions.map((option) => ({ title: option.value, description: '' }));
              setSelectedFeatures(options);
              mainFormik.setFieldValue('permissions', options);
            }}
            options={dynamicOptions}
            styles={{
              menuList: (provided) => ({
                ...provided,
                maxHeight: '120px',
              }),
            }}
          />
          {/* {mainFormik.touched.permissions && mainFormik.errors.permissions && (
            <div className="text-red text-[13px] mt-0.5">
              {mainFormik.errors.permissions}
            </div>
          )} */}
          {/* Submit Button */}
          <div className="flex justify-end gap-3 mt-8">
            <Button type="submit" className="w-full" disabled={!isChanged}>
              {text.submit}<PiArrowClockwiseBold className="ms-1.5 h-[17px] w-[17px]" />
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
