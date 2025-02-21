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
import axiosClient from '../../context/api';

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
    egpAnnualPrice: lang === 'ar' ? 'السعر السنوي المصري' : 'Egyptian Annual Price',
    egpMonthlyPrice: lang === 'ar' ? 'السعر الشهري المصري' : 'Egyptian Monthly Price',
    usdAnnualPrice: lang === 'ar' ? 'السعر السنوي بالدولار' : 'Annual Price in Dollars',
    usdMonthlyPrice: lang === 'ar' ? 'السعر الشهري بالدولار' : 'Monthly Price in Dollars',
    sarAnnualPrice: lang === 'ar' ? 'السعر السنوي السعودي' : 'Saudi Annual Price',
    sarMonthlyPrice: lang === 'ar' ? 'السعر الشهري السعودي' : 'Saudi Monthly Price',
    kwdAnnualPrice: lang === 'ar' ? 'السعر السنوي الكويتي' : 'Kuwaiti Annual Price',
    kwdMonthlyPrice: lang === 'ar' ? 'السعر الشهري الكويتي' : 'Kuwaiti Monthly Price',
    addFeature: lang === 'ar' ? 'إضافة ميزة' : 'Add Feature',
    selectFeature: lang === 'ar' ? 'اختيار ميزة' : 'Select Feature',
    submit: lang === 'ar' ? 'إضافة خطة' : 'Add Plan',
    featureNameAr: lang === 'ar' ? 'العنوان (عربي)' : 'Title (Arabic)',
    featureNameEn: lang === 'ar' ? 'العنوان (إنجليزي)' : 'Title (English)',
    featureDescriptionAr: lang === 'ar' ? 'الوصف (عربي)' : 'Description (Arabic)',
    featureDescriptionEn: lang === 'ar' ? 'الوصف (إنجليزي)' : 'Description (English)',
    add: lang === 'ar' ? 'اضافة' : 'Add',
    clear: lang === 'ar' ? 'تفريغ' : 'Clear',

    requiredMessage: lang === 'ar' ? ' يجب أن يكون رقمًا' : ' Must be a number',
  };

  const requiredMessage = lang === 'ar' ? 'مطلوب' : 'is required';

  const mainFormSchema = Yup.object().shape({
    nameAr: Yup.string().required(text.nameAr + ' ' + requiredMessage),
    nameEn: Yup.string().required(text.nameEn + ' ' + requiredMessage),
    descriptionAr: Yup.string().required(text.descriptionAr + ' ' + requiredMessage),
    descriptionEn: Yup.string().required(text.descriptionEn + ' ' + requiredMessage),
    egpAnnualPrice: Yup.string()
    .required(text.egpAnnualPrice + ' ' + requiredMessage)
    .test('is-number', text.egpAnnualPrice + text.requiredMessage, (value) => !isNaN(parseFloat(value))),
    egpMonthlyPrice: Yup.string()
    .required(text.egpMonthlyPrice + ' ' + requiredMessage)
    .test('is-number', text.egpMonthlyPrice + text.requiredMessage, (value) => !isNaN(parseFloat(value))),
    
    usdAnnualPrice: Yup.string()
    .required(text.usdAnnualPrice + ' ' + requiredMessage)
    .test('is-number', text.usdAnnualPrice + text.requiredMessage, (value) => !isNaN(parseFloat(value))),
    usdMonthlyPrice: Yup.string()
    .required(text.usdMonthlyPrice + ' ' + requiredMessage)
    .test('is-number', text.usdMonthlyPrice + text.requiredMessage, (value) => !isNaN(parseFloat(value))),
    
    sarAnnualPrice: Yup.string()
    .required(text.sarAnnualPrice + ' ' + requiredMessage)
    .test('is-number', text.sarAnnualPrice + text.requiredMessage, (value) => !isNaN(parseFloat(value))),
    sarMonthlyPrice: Yup.string()
    .required(text.sarMonthlyPrice + ' ' + requiredMessage)
    .test('is-number', text.sarMonthlyPrice + text.requiredMessage, (value) => !isNaN(parseFloat(value))),
    
    kwdAnnualPrice: Yup.string()
    .required(text.kwdAnnualPrice + ' ' + requiredMessage)
    .test('is-number', text.kwdAnnualPrice + text.requiredMessage, (value) => !isNaN(parseFloat(value))),
    kwdMonthlyPrice: Yup.string()
    .required(text.kwdMonthlyPrice + ' ' + requiredMessage)
    .test('is-number', text.kwdMonthlyPrice + text.requiredMessage, (value) => !isNaN(parseFloat(value))),
  });

  const mainFormik = useFormik({
    initialValues: {
      nameAr: '',
      nameEn: '',
      descriptionAr: '',
      descriptionEn: '',
      egpAnnualPrice: '',
      egpMonthlyPrice: '',
      usdAnnualPrice: '',
      usdMonthlyPrice: '',
      sarAnnualPrice: '',
      sarMonthlyPrice: '',
      kwdAnnualPrice: '',
      kwdMonthlyPrice: '',
    },
    validationSchema: mainFormSchema,
    onSubmit: async (values) => {
      try {
        const requestPayload = {
          nameAr: values.nameAr,
          nameEn: values.nameEn,
          descriptionAr: values.descriptionAr,
          descriptionEn: values.descriptionEn,
          egpAnnualPrice: parseFloat(values.egpAnnualPrice),
          egpMonthlyPrice: parseFloat(values.egpMonthlyPrice),
          usdAnnualPrice: parseFloat(values.usdAnnualPrice),
          usdMonthlyPrice: parseFloat(values.usdMonthlyPrice),
          sarAnnualPrice: parseFloat(values.sarAnnualPrice),
          sarMonthlyPrice: parseFloat(values.sarMonthlyPrice),
          kwdAnnualPrice: parseFloat(values.kwdAnnualPrice),
          kwdMonthlyPrice: parseFloat(values.kwdMonthlyPrice),
          isActive: true,
          planFeatures: selectedFeatures.map((feature, index) =>({
            featureId: feature.id,
            featureOrder: index,
          })),
        };
    
        console.log("Request Payload:", requestPayload);
    
        const response = await axiosClient.post('/api/Plan/Create', requestPayload, {
          headers: {
            'Content-Type': 'application/json',
            Accept: '*/*',
            'Accept-Language': lang,
          },
        });
    
        if (response.status === 200 || response.status === 201) {
          console.log('Plan created successfully');
          toast.success(lang === 'ar' ? 'تم إضافة الخطة بنجاح!' : 'Plan added successfully!');
          closeModal();
          if (onSuccess) onSuccess();
        } else {
          console.error('Failed to create plan:', response.data);
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
      const responseAr = await axiosClient.get('/api/Feature/GetAll', {
        headers: {
          'Accept-Language': 'ar',
        },
      });
  
      const responseEn = await axiosClient.get('/api/Feature/GetAll', {
        headers: {
          'Accept-Language': 'en',
        },
      });
  
      if (responseAr.status === 200 && responseEn.status === 200) {
        const featuresAr = await responseAr.data;
        const featuresEn = await responseEn.data;
  
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
        const response = await axiosClient.post('/api/Feature/Create', feature, {
          headers: {
            'Content-Type': 'application/json',
            Accept: '*/*',
          },
        });

        if (response.status === 200 || response.status === 201) {
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
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            <Input label={text.nameAr} placeholder={text.nameAr} name="nameAr" value={mainFormik.values.nameAr} onChange={mainFormik.handleChange} onBlur={mainFormik.handleBlur} error={mainFormik.touched.nameAr && mainFormik.errors.nameAr ? mainFormik.errors.nameAr : ''} className="mb-4" />
            <Input label={text.nameEn} placeholder={text.nameEn} name="nameEn" value={mainFormik.values.nameEn} onChange={mainFormik.handleChange} onBlur={mainFormik.handleBlur} error={mainFormik.touched.nameEn && mainFormik.errors.nameEn ? mainFormik.errors.nameEn : ''} className="mb-4" />
            <Input type='number' label={text.egpAnnualPrice} placeholder={text.egpAnnualPrice} name="egpAnnualPrice" value={mainFormik.values.egpAnnualPrice} onChange={mainFormik.handleChange} onBlur={mainFormik.handleBlur} error={mainFormik.touched.egpAnnualPrice && mainFormik.errors.egpAnnualPrice ? mainFormik.errors.egpAnnualPrice : ''} className="mb-4" />
            <Input type='number' label={text.egpMonthlyPrice} placeholder={text.egpMonthlyPrice} name="egpMonthlyPrice" value={mainFormik.values.egpMonthlyPrice} onChange={mainFormik.handleChange} onBlur={mainFormik.handleBlur} error={mainFormik.touched.egpMonthlyPrice && mainFormik.errors.egpMonthlyPrice ? mainFormik.errors.egpMonthlyPrice : ''} className="mb-4" />
            <Input type='number' label={text.usdAnnualPrice} placeholder={text.usdAnnualPrice} name="usdAnnualPrice" value={mainFormik.values.usdAnnualPrice} onChange={mainFormik.handleChange} onBlur={mainFormik.handleBlur} error={mainFormik.touched.usdAnnualPrice && mainFormik.errors.usdAnnualPrice ? mainFormik.errors.usdAnnualPrice : ''} className="mb-4" />
            <Input type='number' label={text.usdMonthlyPrice} placeholder={text.usdMonthlyPrice} name="usdMonthlyPrice" value={mainFormik.values.usdMonthlyPrice} onChange={mainFormik.handleChange} onBlur={mainFormik.handleBlur} error={mainFormik.touched.usdMonthlyPrice && mainFormik.errors.usdMonthlyPrice ? mainFormik.errors.usdMonthlyPrice : ''} className="mb-4" />
            <Input type='number' label={text.sarAnnualPrice} placeholder={text.sarAnnualPrice} name="sarAnnualPrice" value={mainFormik.values.sarAnnualPrice} onChange={mainFormik.handleChange} onBlur={mainFormik.handleBlur} error={mainFormik.touched.sarAnnualPrice && mainFormik.errors.sarAnnualPrice ? mainFormik.errors.sarAnnualPrice : ''} className="mb-4" />
            <Input type='number' label={text.sarMonthlyPrice} placeholder={text.sarMonthlyPrice} name="sarMonthlyPrice" value={mainFormik.values.sarMonthlyPrice} onChange={mainFormik.handleChange} onBlur={mainFormik.handleBlur} error={mainFormik.touched.sarMonthlyPrice && mainFormik.errors.sarMonthlyPrice ? mainFormik.errors.sarMonthlyPrice : ''} className="mb-4" />
            <Input type='number' label={text.kwdAnnualPrice} placeholder={text.kwdAnnualPrice} name="kwdAnnualPrice" value={mainFormik.values.kwdAnnualPrice} onChange={mainFormik.handleChange} onBlur={mainFormik.handleBlur} error={mainFormik.touched.kwdAnnualPrice && mainFormik.errors.kwdAnnualPrice ? mainFormik.errors.kwdAnnualPrice : ''} className="mb-4" />
            <Input type='number' label={text.kwdMonthlyPrice} placeholder={text.kwdMonthlyPrice} name="kwdMonthlyPrice" value={mainFormik.values.kwdMonthlyPrice} onChange={mainFormik.handleChange} onBlur={mainFormik.handleBlur} error={mainFormik.touched.kwdMonthlyPrice && mainFormik.errors.kwdMonthlyPrice ? mainFormik.errors.kwdMonthlyPrice : ''} className="mb-4" />
            <Textarea label={text.descriptionAr} placeholder={text.descriptionAr} name="descriptionAr" value={mainFormik.values.descriptionAr} onChange={mainFormik.handleChange} onBlur={mainFormik.handleBlur} error={mainFormik.touched.descriptionAr && mainFormik.errors.descriptionAr ? mainFormik.errors.descriptionAr : ''} className="mb-4" />
            <Textarea label={text.descriptionEn} placeholder={text.descriptionEn} name="descriptionEn" value={mainFormik.values.descriptionEn} onChange={mainFormik.handleChange} onBlur={mainFormik.handleBlur} error={mainFormik.touched.descriptionEn && mainFormik.errors.descriptionEn ? mainFormik.errors.descriptionEn : ''} className="mb-4" />
          </div>

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
