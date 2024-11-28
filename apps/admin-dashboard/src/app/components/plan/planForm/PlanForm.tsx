'use client';

import { PiXBold, PiPlusBold, PiMinusBold } from 'react-icons/pi';
import React, { useEffect, useState } from 'react';
import { ActionIcon, Title, Button, Input, Textarea } from 'rizzui';
import ReactSelect from 'react-select';
import { useModal } from '@/app/shared/modal-views/use-modal';
import toast from 'react-hot-toast';
import styles from './PlanForm.module.css';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { API_BASE_URL } from '@/config/base-url';
import { useFileContext } from '../../context/FileContext';

type Feature = {
  id: string;
  nameAr: string;
  nameEn: string;
  descriptionAr: string;
  descriptionEn: string;
};

type PlanFormProps = {
  title?: string;
  modalBtnLabel?: string;
  onSuccess?: () => void;
  lang: string;
};

export default function PlanForm({
  title,
  modalBtnLabel = 'إضافة ضيف',
  onSuccess,
  lang = 'en',
}: PlanFormProps) {
  const { closeModal } = useModal();
  const [selectedFeatures, setSelectedFeatures] = useState<Feature[]>([]);
  const [visibleSection, setVisibleSection] = useState<'' | 'addFeature' | 'selectFeature'>('');
  const [dynamicOptions, setDynamicOptions] = useState<{ value: string; label: string }[]>([]);

  const [feature, setFeature] = useState<Feature>({
    id: '',
    nameAr: '',
    nameEn: '',
    descriptionAr: '',
    descriptionEn: '',
  });
  const [featureError, setFeatureError] = useState({
    nameAr: '',
    nameEn: '',
    descriptionAr: '',
    descriptionEn: '',
  });
  const [selectFeatureError, setSelectFeatureError] = useState('');

  const { setUpdateData } = useFileContext();

  const text = {
    nameAr: lang === 'ar' ? 'الأسم (عربي)' : 'Name (Arabic)',
    nameEn: lang === 'ar' ? 'الأسم (انجليزي)' : 'Name (English)',
    descriptionAr: lang === 'ar' ? 'الوصف (عربي)' : 'Description (Arabic)',
    descriptionEn: lang === 'ar' ? 'الوصف (انجليزي)' : 'Description (English)',
    annualPrice: lang === 'ar' ? 'السعر السنوي' : 'Annual Price',
    monthlyPrice: lang === 'ar' ? 'السعر الشهري' : 'Monthly Price',
    addFeature: lang === 'ar' ? 'إضافة ميزة' : 'Add Feature',
    selectFeature: lang === 'ar' ? 'اختيار ميزة' : 'Select Feature',
    submit: lang === 'ar' ? 'إضافة خطة' : 'Add Plan',
    featureNameAr: lang === 'ar' ? 'العنوان (عربي)' : 'Title (Arabic)',
    featureNameEn: lang === 'ar' ? 'العنوان (إنجليزي)' : 'Title (English)',
    featureDescriptionAr: lang === 'ar' ? 'الوصف (عربي)' : 'Description (Arabic)',
    featureDescriptionEn: lang === 'ar' ? 'الوصف (إنجليزي)' : 'Description (English)',
    add: lang === 'ar' ? 'اضافة' : 'Add',
    clear: lang === 'ar' ? 'تفريغ' : 'Clear',
  };

  const requiredMessage = lang === 'ar' ? 'مطلوب' : 'is required';

  const mainFormSchema = Yup.object().shape({
    nameAr: Yup.string().required(text.nameAr + ' ' + requiredMessage),
    nameEn: Yup.string().required(text.nameEn + ' ' + requiredMessage),
    descriptionAr: Yup.string().required(text.descriptionAr + ' ' + requiredMessage),
    descriptionEn: Yup.string().required(text.descriptionEn + ' ' + requiredMessage),
    annualPrice: Yup.number().required(text.annualPrice + ' ' + requiredMessage),
    monthlyPrice: Yup.number().required(text.monthlyPrice + ' ' + requiredMessage),
  });

  const mainFormik = useFormik({
    initialValues: {
      nameAr: '',
      nameEn: '',
      descriptionAr: '',
      descriptionEn: '',
      annualPrice: '',
      monthlyPrice: '',
    },
    validationSchema: mainFormSchema,
    onSubmit: async (values) => {
      try {
        const requestPayload = {
          nameAr: values.nameAr,
          nameEn: values.nameEn,
          descriptionAr: values.descriptionAr,
          descriptionEn: values.descriptionEn,
          annualPrice: parseFloat(values.annualPrice),
          monthlyPrice: parseFloat(values.monthlyPrice),
          isActive: true,
          planFeatures: selectedFeatures.map((feature) => feature.id),
        };
    
        console.log("Request Payload:", requestPayload);
    
        const response = await fetch(`${API_BASE_URL}/api/Plan/Create`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Accept: '*/*',
            'Accept-Language': lang,
          },
          body: JSON.stringify(requestPayload),
        });
    
        if (response.ok) {
          console.log('Plan created successfully');
          toast.success(lang === 'ar' ? 'تم إضافة الخطة بنجاح!' : 'Plan added successfully!');
          closeModal();
          if (onSuccess) onSuccess();
        } else {
          const errorResponse = await response.json();
          console.error('Failed to create plan:', errorResponse);
          toast.error(lang === 'ar' ? 'حدث خطأ أثناء إضافة الخطة' : 'Failed to add plan');
        }
      } catch (error) {
        console.error('Error creating plan:', error);
        toast.error(lang === 'ar' ? 'حدث خطأ غير متوقع' : 'An unexpected error occurred');
      }
    },    
  });

  const validateFeatureInputs = () => {
    const errors = { nameAr: '', nameEn: '', descriptionAr: '', descriptionEn: '' };
    let isValid = true;

    if (!feature.nameAr) {
      errors.nameAr = text.featureNameAr + ' ' + requiredMessage;
      isValid = false;
    }
    if (!feature.nameEn) {
      errors.nameEn = text.featureNameEn + ' ' + requiredMessage;
      isValid = false;
    }
    if (!feature.descriptionAr) {
      errors.descriptionAr = text.featureDescriptionAr + ' ' + requiredMessage;
      isValid = false;
    }
    if (!feature.descriptionEn) {
      errors.descriptionEn = text.featureDescriptionEn + ' ' + requiredMessage;
      isValid = false;
    }

    setFeatureError(errors);
    return isValid;
  };

  const validateSelectFeature = () => {
    if ((visibleSection === 'selectFeature' || selectedFeatures.length > 0) && selectedFeatures.length === 0) {
      setSelectFeatureError(text.selectFeature + ' ' + requiredMessage);
      return false;
    } else {
      setSelectFeatureError('');
      return true;
    }
  };

  const fetchAllFeatures = async () => {
    try {
      const responseAr = await fetch(`${API_BASE_URL}/api/Feature/GetAll`, {
        method: 'GET',
        headers: {
          Accept: '*/*',
          'Accept-Language': 'ar',
        },
      });
  
      const responseEn = await fetch(`${API_BASE_URL}/api/Feature/GetAll`, {
        method: 'GET',
        headers: {
          Accept: '*/*',
          'Accept-Language': 'en',
        },
      });
  
      if (responseAr.ok && responseEn.ok) {
        const featuresAr = await responseAr.json();
        const featuresEn = await responseEn.json();
  
        const unifiedFeatures = featuresAr.map((featureAr: { id: string; name: string; description: string }) => {
          const correspondingEn = featuresEn.find((featureEn: { id: string }) => featureEn.id === featureAr.id);
          return {
            id: featureAr.id,
            nameAr: featureAr.name,
            nameEn: correspondingEn?.name || '',
            descriptionAr: featureAr.description,
            descriptionEn: correspondingEn?.description || '',
          };
        });
  
        const updatedOptions = unifiedFeatures.map((feature: Feature) => ({
          value: feature.id,
          label: lang === 'ar' ? feature.nameAr : feature.nameEn,
        }));
        setDynamicOptions(updatedOptions);
  
        return unifiedFeatures;
      } else {
        toast.error(lang === 'ar' ? 'حدث خطأ أثناء تحديث القائمة' : 'Failed to fetch updated features');
        return [];
      }
    } catch (error) {
      console.error('Error fetching features:', error);
      toast.error(lang === 'ar' ? 'حدث خطأ أثناء تحديث القائمة' : 'Failed to fetch updated features');
      return [];
    }
  };
  
  const handleAddFeature = async () => {
    if (validateFeatureInputs()) {
      try {
        const response = await fetch(`${API_BASE_URL}/api/Feature/Create`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Accept: '*/*',
          },
          body: JSON.stringify(feature),
        });

        if (response.ok) {
          toast.success(lang === 'ar' ? 'تمت إضافة الميزة!' : 'Feature added!');

          const updatedFeatures = await fetchAllFeatures();

          const newlyAddedFeature = updatedFeatures.find(
            (item: Feature) =>
              item.nameAr === feature.nameAr &&
              item.nameEn === feature.nameEn &&
              item.descriptionAr === feature.descriptionAr &&
              item.descriptionEn === feature.descriptionEn
          );
          console.log("Updated features:", updatedFeatures);
          
          console.log("newlyAddedFeature: ",newlyAddedFeature);
          
          if (newlyAddedFeature) {
            setSelectedFeatures((prev) => [...prev, newlyAddedFeature]);
          }
          
          console.log("Feature sent:", feature);
          setFeature({ id: '', nameAr: '', nameEn: '', descriptionAr: '', descriptionEn: '' });
          setUpdateData(true);
          setVisibleSection('');
        } else {
          toast.error(lang === 'ar' ? 'حدث خطأ أثناء الإضافة' : 'An error occurred while adding the feature');
        }
      } catch (error) {
        console.error('Error adding feature:', error);
        toast.error(lang === 'ar' ? 'حدث خطأ أثناء الإضافة' : 'An error occurred while adding the feature');
      }
    }
  };

  useEffect(() => {
    fetchAllFeatures();
  }, []);

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
          if (validateSelectFeature()) {
            mainFormik.handleSubmit();
          }
        }}>
          <Input label={text.nameAr} placeholder={text.nameAr} name="nameAr" value={mainFormik.values.nameAr} onChange={mainFormik.handleChange} onBlur={mainFormik.handleBlur} error={mainFormik.touched.nameAr && mainFormik.errors.nameAr ? mainFormik.errors.nameAr : ''} className="mb-4" />
          <Input label={text.nameEn} placeholder={text.nameEn} name="nameEn" value={mainFormik.values.nameEn} onChange={mainFormik.handleChange} onBlur={mainFormik.handleBlur} error={mainFormik.touched.nameEn && mainFormik.errors.nameEn ? mainFormik.errors.nameEn : ''} className="mb-4" />
          <Input label={text.annualPrice} placeholder={text.annualPrice} name="annualPrice" value={mainFormik.values.annualPrice} onChange={mainFormik.handleChange} onBlur={mainFormik.handleBlur} error={mainFormik.touched.annualPrice && mainFormik.errors.annualPrice ? mainFormik.errors.annualPrice : ''} className="mb-4" />
          <Input label={text.monthlyPrice} placeholder={text.monthlyPrice} name="monthlyPrice" value={mainFormik.values.monthlyPrice} onChange={mainFormik.handleChange} onBlur={mainFormik.handleBlur} error={mainFormik.touched.monthlyPrice && mainFormik.errors.monthlyPrice ? mainFormik.errors.monthlyPrice : ''} className="mb-4" />
          <Textarea label={text.descriptionAr} placeholder={text.descriptionAr} name="descriptionAr" value={mainFormik.values.descriptionAr} onChange={mainFormik.handleChange} onBlur={mainFormik.handleBlur} error={mainFormik.touched.descriptionAr && mainFormik.errors.descriptionAr ? mainFormik.errors.descriptionAr : ''} className="mb-4" />
          <Textarea label={text.descriptionEn} placeholder={text.descriptionEn} name="descriptionEn" value={mainFormik.values.descriptionEn} onChange={mainFormik.handleChange} onBlur={mainFormik.handleBlur} error={mainFormik.touched.descriptionEn && mainFormik.errors.descriptionEn ? mainFormik.errors.descriptionEn : ''} className="mb-4" />

          {/* Select Feature Section */}
          {(visibleSection === 'selectFeature' || selectedFeatures.length > 0) && (
            <div className="p-3 border border-gray-200 rounded-md mb-4">
              <div className="flex justify-end mb-4">
                <ActionIcon onClick={() => setVisibleSection('')} className="text-white">
                  <PiMinusBold />
                </ActionIcon>
              </div>
              <ReactSelect
                isMulti
                placeholder={text.selectFeature}
                value={selectedFeatures.map((feature) => ({
                  value: feature.id,
                  label: lang === 'ar' ? feature.nameAr : feature.nameEn,
                }))}
                onChange={(selectedOptions) =>
                  setSelectedFeatures(
                    selectedOptions.map((option) => ({
                      id: option.value,
                      nameAr: lang === 'ar' ? option.label : '',
                      nameEn: lang === 'ar' ? '' : option.label,
                      descriptionAr: '',
                      descriptionEn: '',
                    }))
                  )
                }
                options={dynamicOptions}
                styles={{
                  menuList: (provided) => ({
                    ...provided,
                    maxHeight: '120px',
                  }),
                }}
              />

              {selectFeatureError && <div className="text-red-500 text-sm">{selectFeatureError}</div>}
            </div>
          )}

          {/* Add Feature Section */}
          {visibleSection === 'addFeature' && (
            <div className="p-3 border border-gray-200 rounded-md mb-4">
              <div className="flex justify-end">
                <ActionIcon onClick={() => setVisibleSection('')} className="text-white">
                  <PiMinusBold />
                </ActionIcon>
              </div>
              <Input label={text.featureNameAr} placeholder={text.featureNameAr} value={feature.nameAr} onChange={(e) => setFeature((prev) => ({ ...prev, nameAr: e.target.value }))} className="mb-2" error={featureError.nameAr} />
              <Input label={text.featureNameEn} placeholder={text.featureNameEn} value={feature.nameEn} onChange={(e) => setFeature((prev) => ({ ...prev, nameEn: e.target.value }))} className="mb-2" error={featureError.nameEn} />
              <Textarea label={text.featureDescriptionAr} placeholder={text.featureDescriptionAr} value={feature.descriptionAr} onChange={(e) => setFeature((prev) => ({ ...prev, descriptionAr: e.target.value }))} className="mb-2" error={featureError.descriptionAr} />
              <Textarea label={text.featureDescriptionEn} placeholder={text.featureDescriptionEn} value={feature.descriptionEn} onChange={(e) => setFeature((prev) => ({ ...prev, descriptionEn: e.target.value }))} className="mb-2" error={featureError.descriptionEn} />
              <div className="flex gap-2">
                <Button onClick={handleAddFeature} disabled={!feature.nameAr || ! feature.nameEn || !feature.descriptionAr  || !feature.descriptionEn} className="w-full">
                  {text.add}
                </Button>
                <Button onClick={() => setFeature({ id: '', nameAr: '', nameEn: '', descriptionAr: '', descriptionEn: '' })} variant="outline" className="w-full">
                  {text.clear}
                </Button>
              </div>
            </div>
          )}

          {/* Feature Buttons */}
          <div className="flex gap-3 mb-4">
            <Button onClick={() => setVisibleSection('addFeature')} variant="outline" className="w-full">
              {text.addFeature}
            </Button>
            <Button onClick={() => setVisibleSection('selectFeature')} variant="outline" className="w-full">
              {text.selectFeature}
            </Button>
          </div>

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
