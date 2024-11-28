'use client';

import { PiXBold, PiPlusBold, PiMinusBold } from 'react-icons/pi';
import React, { useState } from 'react';
import { ActionIcon, Title, Button, Input, Textarea } from 'rizzui';
import ReactSelect from 'react-select';
import { useModal } from '@/app/shared/modal-views/use-modal';
import toast from 'react-hot-toast';
import styles from './AdvantageForm.module.css';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { API_BASE_URL } from '@/config/base-url';

type AdvantageFormProps = {
  title?: string;
  modalBtnLabel?: string;
  onSuccess?: () => void;
  lang: string;
};

export default function AdvantageForm({
  title,
  modalBtnLabel = 'إضافة ميزة',
  onSuccess,
  lang = 'en',
}: AdvantageFormProps) {
  const { closeModal } = useModal();
  const text = {
    nameAr: lang === 'ar' ? 'الأسم (عربي)' : 'Name (Arabic)',
    nameEn: lang === 'ar' ? 'الأسم (انجليزي)' : 'Name (English)',
    descriptionAr: lang === 'ar' ? 'الوصف (عربي)' : 'Description (Arabic)',
    descriptionEn: lang === 'ar' ? 'الوصف (انجليزي)' : 'Description (English)',
    submit: lang === 'ar' ? 'إضافة ميزة' : 'Add Feature',
  };

  const requiredMessage = lang === 'ar' ? 'مطلوب' : 'is required';

  const mainFormSchema = Yup.object().shape({
    nameAr: Yup.string().required(text.nameAr + ' ' + requiredMessage),
    nameEn: Yup.string().required(text.nameEn + ' ' + requiredMessage),
    descriptionAr: Yup.string().required(text.descriptionAr + ' ' + requiredMessage),
    descriptionEn: Yup.string().required(text.descriptionEn + ' ' + requiredMessage),
  });

  const mainFormik = useFormik({
    initialValues: {
      nameAr: '',
      nameEn: '',
      descriptionAr: '',
      descriptionEn: '',
    },
    validationSchema: mainFormSchema,
    onSubmit: async (values) => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/Feature/Create`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept-Language': lang,
          },
          body: JSON.stringify(values),
        });

        if (response.ok) {
          if (onSuccess) onSuccess();
          toast.success(lang === 'ar' ? 'تم إضافة الميزة بنجاح!' : 'Feature added successfully!');
          closeModal();
        } else {
          toast.error(lang === 'ar' ? 'حدث خطأ أثناء الإضافة' : 'An error occurred while adding the feature');
        }
      } catch (error) {
        console.error('Error:', error);
        toast.error(lang === 'ar' ? 'حدث خطأ أثناء الإضافة' : 'An error occurred while adding the feature');
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
          <Input label={text.nameAr} placeholder={text.nameAr} name="nameAr" value={mainFormik.values.nameAr} onChange={mainFormik.handleChange} onBlur={mainFormik.handleBlur} error={mainFormik.touched.nameAr && mainFormik.errors.nameAr ? mainFormik.errors.nameAr : ''} className="mb-4" />
          <Textarea label={text.descriptionAr} placeholder={text.descriptionAr} name="descriptionAr" value={mainFormik.values.descriptionAr} onChange={mainFormik.handleChange} onBlur={mainFormik.handleBlur} error={mainFormik.touched.descriptionAr && mainFormik.errors.descriptionAr ? mainFormik.errors.descriptionAr : ''} className="mb-4" />
          <Input label={text.nameEn} placeholder={text.nameEn} name="nameEn" value={mainFormik.values.nameEn} onChange={mainFormik.handleChange} onBlur={mainFormik.handleBlur} error={mainFormik.touched.nameEn && mainFormik.errors.nameEn ? mainFormik.errors.nameEn : ''} className="mb-4" />
          <Textarea label={text.descriptionEn} placeholder={text.descriptionEn} name="descriptionEn" value={mainFormik.values.descriptionEn} onChange={mainFormik.handleChange} onBlur={mainFormik.handleBlur} error={mainFormik.touched.descriptionEn && mainFormik.errors.descriptionEn ? mainFormik.errors.descriptionEn : ''} className="mb-4" />

          {/* Submit Button */}
          <div className="flex justify-end gap-3">
            <Button type="submit" className="w-full">
              {text.submit}<PiPlusBold className="ms-1.5 h-[17px] w-[17px]" />
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
