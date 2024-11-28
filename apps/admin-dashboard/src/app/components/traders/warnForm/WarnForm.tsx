'use client';

import { PiXBold, PiPlusBold, PiMinusBold } from 'react-icons/pi';
import React, { useState } from 'react';
import { ActionIcon, Title, Button, Input, Textarea } from 'rizzui';
import ReactSelect from 'react-select';
import { useModal } from '@/app/shared/modal-views/use-modal';
import toast from 'react-hot-toast';
import styles from './WarnForm.module.css';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { API_BASE_URL } from '@/config/base-url';

type WarnFormProps = {
  title?: string;
  modalBtnLabel?: string;
  onSuccess?: () => void;
  lang: string;
};

export default function WarnForm({
  title,
  modalBtnLabel = 'إنذار',
  onSuccess,
  lang = 'en',
}: WarnFormProps) {
  const { closeModal } = useModal();
  const text = {
    warnReason: lang === 'ar' ? 'سبب الإنذار' : 'Reason for Warn',
    submit: lang === 'ar' ? 'إنذار' : 'Warn',
  };

  const requiredMessage = lang === 'ar' ? 'مطلوب' : 'is required';

  const mainFormSchema = Yup.object().shape({
    // warn: Yup.string().required(text.warnReason + ' ' + requiredMessage),
  });

  const mainFormik = useFormik({
    initialValues: {
        warn: '',
    },
    validationSchema: mainFormSchema,
    onSubmit: (values) => {
        console.log("Form data:", values);
        if (onSuccess) onSuccess();
        closeModal();
        toast.success(lang === 'ar' ? 'تم إنذار تاجر بنجاح!' : 'Trader warned successfully!');
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
          <Textarea label={text.warnReason} placeholder={text.warnReason} name="warn" value={mainFormik.values.warn} onChange={mainFormik.handleChange} onBlur={mainFormik.handleBlur} error={mainFormik.touched.warn && mainFormik.errors.warn ? mainFormik.errors.warn : ''} className="mb-4" />

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
