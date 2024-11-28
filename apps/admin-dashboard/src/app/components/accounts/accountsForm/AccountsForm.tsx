'use client';

import { PiXBold, PiPlusBold, PiMinusBold } from 'react-icons/pi';
import React, { useState } from 'react';
import { ActionIcon, Title, Button, Input, Textarea } from 'rizzui';
import ReactSelect from 'react-select';
import { useModal } from '@/app/shared/modal-views/use-modal';
import toast from 'react-hot-toast';
import styles from './AccountsForm.module.css';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { API_BASE_URL } from '@/config/base-url';

type Feature = {
  title: string;
  description: string;
};

type AccountsFormProps = {
  title?: string;
  modalBtnLabel?: string;
  onSuccess?: () => void;
  lang: string;
};

export default function AccountsForm({
  title,
  modalBtnLabel = 'إضافة مساعد ادمن',
  onSuccess,
  lang = 'en',
}: AccountsFormProps) {
  const { closeModal } = useModal();
  const [selectedFeatures, setSelectedFeatures] = useState<Feature[]>([]);
  const [dynamicOptions, setDynamicOptions] = useState([
    { value: 'feature1', label: lang === 'ar' ? 'ميزة 1' : 'Feature 1' },
    { value: 'feature2', label: lang === 'ar' ? 'ميزة 2' : 'Feature 2' },
  ]);

  const text = {
    firstName: lang === 'ar' ? 'الاسم الأول' : 'First Name',
    lastName: lang === 'ar' ? 'الاسم الأخير' : 'Last Name',
    phoneNumber: lang === 'ar' ? 'رقم الهاتف' : 'Phone Number',
    email: lang === 'ar' ? 'البريد الالكتروني' : 'Email',
    selectPermissions: lang === 'ar' ? 'اختيار صلاحية' : 'Select Permissions',
    submit: lang === 'ar' ? 'إضافة مساعد المسؤول' : 'Add Admin Assestant',
  };

  const requiredMessage = lang === 'ar' ? 'مطلوب' : 'is required';

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
      firstName: '',
      lastName: '',
      phoneNumber: '',
      email: '',
      // permissions: [],
    },
    validationSchema: mainFormSchema,
    onSubmit: async (values) => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/Support/Create`, {
          method: 'POST',
          headers: {
            'Accept-Language': lang,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(values),
        });

        if (response.ok) {
          const result = await response.json();
          toast.success(result.message || (lang === 'ar' ? 'تم الإضافة بنجاح!' : 'Support created successfully!'));
          if (onSuccess) onSuccess();
          closeModal();
        } else {
          const errorText = await response.text();
          toast.error(
            lang === 'ar'
              ? `فشل في الإضافة: ${errorText}`
              : `Failed to create support: ${errorText}`
          );
        }
      } catch (error) {
        console.error('Error creating support:', error);
        toast.error(lang === 'ar' ? 'حدث خطأ أثناء الإضافة' : 'An error occurred while creating support');
      }
    },
  });

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
          {/* <Input label={text.name} placeholder={text.name} name="name" value={mainFormik.values.name} onChange={mainFormik.handleChange} onBlur={mainFormik.handleBlur} error={mainFormik.touched.name && mainFormik.errors.name ? mainFormik.errors.name : ''} className="mb-4" /> */}
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
            <Button type="submit" className="w-full">
              {text.submit}<PiPlusBold className="ms-1.5 h-[17px] w-[17px]" />
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
