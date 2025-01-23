'use client';

import { PiXBold, PiArrowClockwiseBold, PiMinusBold } from 'react-icons/pi';
import React, { useEffect, useState } from 'react';
import { ActionIcon, Title, Button, Input, Textarea } from 'rizzui';
import ReactSelect from 'react-select';
import { useModal } from '@/app/shared/modal-views/use-modal';
import toast from 'react-hot-toast';
import styles from './UpdateAdvantageForm.module.css';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { API_BASE_URL } from '@/config/base-url';
import { Loader } from 'lucide-react';
import { useFileContext } from '../../context/FileContext';
import axiosClient from '../../context/api';

type Feature = {
  id: string;
  nameAr: string;
  nameEn: string;
  descriptionAr: string;
  descriptionEn: string;
};

type UpdateAdvantageFormProps = {
  title?: string;
  modalBtnLabel?: string;
  onSuccess?: () => void;
  lang: string;
  featureId: string; // Only ID passed initially
};

export default function UpdateAdvantageForm({
  title,
  modalBtnLabel = 'تعديل ميزة',
  onSuccess,
  lang = 'en',
  featureId,
}: UpdateAdvantageFormProps) {
  const { closeModal } = useModal();
  const [feature, setFeature] = useState<Feature | null>(null);
  const [loading, setLoading] = useState(true);
  const [isChanged, setIsChanged] = useState(false);
  const { setUpdateData } = useFileContext();

  const text = {
    nameAr: lang === 'ar' ? 'الأسم (عربي)' : 'Name (Arabic)',
    nameEn: lang === 'ar' ? 'الأسم (انجليزي)' : 'Name (English)',
    descriptionAr: lang === 'ar' ? 'الوصف (عربي)' : 'Description (Arabic)',
    descriptionEn: lang === 'ar' ? 'الوصف (انجليزي)' : 'Description (English)',
    submit: lang === 'ar' ? 'تعديل ميزة' : 'Update Feature',
  };

  const requiredMessage = lang === 'ar' ? 'مطلوب' : 'is required';

  const mainFormSchema = Yup.object().shape({
    nameAr: Yup.string().required(`${text.nameAr} ${requiredMessage}`),
    nameEn: Yup.string().required(`${text.nameEn} ${requiredMessage}`),
    descriptionAr: Yup.string().required(`${text.descriptionAr} ${requiredMessage}`),
    descriptionEn: Yup.string().required(`${text.descriptionEn} ${requiredMessage}`),
  });

  const mainFormik = useFormik({
    initialValues: {
      nameAr: feature?.nameAr || '',
      nameEn: feature?.nameEn || '',
      descriptionAr: feature?.descriptionAr || '',
      descriptionEn: feature?.descriptionEn || '',
    },
    validationSchema: mainFormSchema,
    enableReinitialize: true,
    onSubmit: async (values) => {
      try {
        const response = await axiosClient.put(`/api/Feature/Update/${featureId}`, values, {
          headers: {
            'Content-Type': 'application/json',
            Accept: '*/*',
          },
        });
     
        if (response.status === 200 || response.status === 204) {
          toast.success(lang === 'ar' ? 'تم تعديل الميزة بنجاح!' : 'Feature updated successfully!');
          closeModal();
          setUpdateData(true);
        } else {
          toast.error(lang === 'ar' ? 'حدث خطأ أثناء التعديل' : 'An error occurred while updating the feature');
        }
      } catch (error) {
        console.error('Error updating feature:', error);
        toast.error(lang === 'ar' ? 'حدث خطأ أثناء التعديل' : 'An error occurred while updating the feature');
      }
    },
  });

  const fetchFeatureDetails = async (id: string): Promise<Feature | null> => {
    try {
      const [arResponse, enResponse] = await Promise.all([
        axiosClient.get('/api/Feature/GetAll', {
          headers: {
            Accept: '*/*',
            'Accept-Language': 'ar',
          },
        }),
        axiosClient.get('/api/Feature/GetAll', {
          headers: {
            Accept: '*/*',
            'Accept-Language': 'en',
          },
        }),
      ]);
    
      if (arResponse.status === 200 && enResponse.status === 200) {
        const arData = await arResponse.data;
        const enData = await enResponse.data;

        const arFeature = arData.find((feature: { id: string }) => feature.id === id);
        const enFeature = enData.find((feature: { id: string }) => feature.id === id);

        if (arFeature && enFeature) {
          return {
            id,
            nameAr: arFeature.name,
            nameEn: enFeature.name,
            descriptionAr: arFeature.description,
            descriptionEn: enFeature.description,
          };
        }
      }

      toast.error(lang === 'ar' ? 'حدث خطأ أثناء جلب البيانات' : 'Failed to fetch feature details');
      return null;
    } catch (error) {
      console.error('Error fetching feature details:', error);
      toast.error(lang === 'ar' ? 'حدث خطأ أثناء جلب البيانات' : 'Failed to fetch feature details');
      return null;
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      const details = await fetchFeatureDetails(featureId);
      setFeature(details);
      setLoading(false);
    };

    fetchData();
  }, [featureId]);

  useEffect(() => {
    if (feature) {
      const isFormChanged =
        mainFormik.values.nameAr !== feature.nameAr ||
        mainFormik.values.nameEn !== feature.nameEn ||
        mainFormik.values.descriptionAr !== feature.descriptionAr ||
        mainFormik.values.descriptionEn !== feature.descriptionEn;
      setIsChanged(isFormChanged);
    }
  }, [mainFormik.values, feature]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <Loader className="animate-spin text-[#e11d48]" width={40} height={40} />
      </div>
    );
  }

  if (!feature) {
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
          <Input label={text.nameAr} placeholder={text.nameAr} name="nameAr" value={mainFormik.values.nameAr} onChange={mainFormik.handleChange} onBlur={mainFormik.handleBlur} error={mainFormik.touched.nameAr && mainFormik.errors.nameAr ? mainFormik.errors.nameAr : ''} className="mb-4" />
          <Textarea label={text.descriptionAr} placeholder={text.descriptionAr} name="descriptionAr" value={mainFormik.values.descriptionAr} onChange={mainFormik.handleChange} onBlur={mainFormik.handleBlur} error={mainFormik.touched.descriptionAr && mainFormik.errors.descriptionAr ? mainFormik.errors.descriptionAr : ''} className="mb-4" />
          <Input label={text.nameEn} placeholder={text.nameEn} name="nameEn" value={mainFormik.values.nameEn} onChange={mainFormik.handleChange} onBlur={mainFormik.handleBlur} error={mainFormik.touched.nameEn && mainFormik.errors.nameEn ? mainFormik.errors.nameEn : ''} className="mb-4" />
          <Textarea label={text.descriptionEn} placeholder={text.descriptionEn} name="descriptionEn" value={mainFormik.values.descriptionEn} onChange={mainFormik.handleChange} onBlur={mainFormik.handleBlur} error={mainFormik.touched.descriptionEn && mainFormik.errors.descriptionEn ? mainFormik.errors.descriptionEn : ''} className="mb-4" />
          {/* Submit Button */}
          <div className="flex justify-end gap-3">
            <Button type="submit" className="w-full" disabled={!isChanged}>
              {text.submit}<PiArrowClockwiseBold className="ms-1.5 h-[17px] w-[17px]" />
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
