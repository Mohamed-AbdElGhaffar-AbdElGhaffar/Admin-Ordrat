'use client';

import { PiXBold, PiPlusBold, PiMinusBold } from 'react-icons/pi';
import React, { useState } from 'react';
import { ActionIcon, Title, Button, Input, Textarea } from 'rizzui';
import ReactSelect from 'react-select';
import { useModal } from '@/app/shared/modal-views/use-modal';
import toast from 'react-hot-toast';
import styles from './PlanForm.module.css';
import { useFormik } from 'formik';
import * as Yup from 'yup';

type Feature = {
  title: string;
  description: string;
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
  const [dynamicOptions, setDynamicOptions] = useState([
    { value: 'feature1', label: lang === 'ar' ? 'ميزة 1' : 'Feature 1' },
    { value: 'feature2', label: lang === 'ar' ? 'ميزة 2' : 'Feature 2' },
  ]);

  const [featureTitle, setFeatureTitle] = useState('');
  const [featureDescription, setFeatureDescription] = useState('');
  const [featureTitleError, setFeatureTitleError] = useState('');
  const [featureDescriptionError, setFeatureDescriptionError] = useState('');
  const [selectFeatureError, setSelectFeatureError] = useState('');

  const text = {
    name: lang === 'ar' ? 'الأسم' : 'Name',
    annualPrice: lang === 'ar' ? 'السعر السنوي' : 'Annual Price',
    monthlyPrice: lang === 'ar' ? 'السعر الشهري' : 'Monthly Price',
    description: lang === 'ar' ? 'الوصف' : 'Description',
    addFeature: lang === 'ar' ? 'إضافة ميزة' : 'Add Feature',
    selectFeature: lang === 'ar' ? 'اختيار ميزة' : 'Select Feature',
    submit: lang === 'ar' ? 'إضافة خطة' : 'Add Plan',
    featureTitle: lang === 'ar' ? 'العنوان' : 'Title',
    featureDescription: lang === 'ar' ? 'الوصف' : 'Description',
    add: lang === 'ar' ? 'اضافة' : 'Add',
    clear: lang === 'ar' ? 'تفريغ' : 'Clear',
  };

  const requiredMessage = lang === 'ar' ? 'مطلوب' : 'is required';

  const mainFormSchema = Yup.object().shape({
    name: Yup.string().required(text.name + ' ' + requiredMessage),
    annualPrice: Yup.number().required(text.annualPrice + ' ' + requiredMessage),
    monthlyPrice: Yup.number().required(text.monthlyPrice + ' ' + requiredMessage),
    description: Yup.string().required(text.description + ' ' + requiredMessage),
  });

  const mainFormik = useFormik({
    initialValues: {
      name: '',
      annualPrice: '',
      monthlyPrice: '',
      description: '',
    },
    validationSchema: mainFormSchema,
    onSubmit: (values) => {
      console.log("Form data:", values);
      console.log("Selected Features:", selectedFeatures);
      closeModal();
      toast.success(lang === 'ar' ? 'تم إضافة الخطة بنجاح!' : 'Plan added successfully!');
    },
  });

  const validateFeatureInputs = () => {
    let isValid = true;

    if (!featureTitle) {
      setFeatureTitleError(text.featureTitle + ' ' + requiredMessage);
      isValid = false;
    } else {
      setFeatureTitleError('');
    }

    if (!featureDescription) {
      setFeatureDescriptionError(text.featureDescription + ' ' + requiredMessage);
      isValid = false;
    } else {
      setFeatureDescriptionError('');
    }

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

  const handleAddFeature = () => {
    if (validateFeatureInputs()) {
      const newFeature = { title: featureTitle, description: featureDescription };
      setSelectedFeatures((prev) => [...prev, newFeature]);
      setDynamicOptions((prev) => [...prev, { value: featureTitle, label: featureTitle }]);

      // Reset fields
      setFeatureTitle('');
      setFeatureDescription('');
      setVisibleSection('');
      toast.success(lang === 'ar' ? 'تمت إضافة الميزة!' : 'Feature added!');
    }
  };

  const handleClearFeatureInputs = () => {
    setFeatureTitle('');
    setFeatureDescription('');
    setFeatureTitleError('');
    setFeatureDescriptionError('');
  };

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
          <Input label={text.name} placeholder={text.name} name="name" value={mainFormik.values.name} onChange={mainFormik.handleChange} onBlur={mainFormik.handleBlur} error={mainFormik.touched.name && mainFormik.errors.name ? mainFormik.errors.name : ''} className="mb-4" />
          <Input label={text.annualPrice} placeholder={text.annualPrice} name="annualPrice" value={mainFormik.values.annualPrice} onChange={mainFormik.handleChange} onBlur={mainFormik.handleBlur} error={mainFormik.touched.annualPrice && mainFormik.errors.annualPrice ? mainFormik.errors.annualPrice : ''} className="mb-4" />
          <Input label={text.monthlyPrice} placeholder={text.monthlyPrice} name="monthlyPrice" value={mainFormik.values.monthlyPrice} onChange={mainFormik.handleChange} onBlur={mainFormik.handleBlur} error={mainFormik.touched.monthlyPrice && mainFormik.errors.monthlyPrice ? mainFormik.errors.monthlyPrice : ''} className="mb-4" />
          <Textarea label={text.description} placeholder={text.description} name="description" value={mainFormik.values.description} onChange={mainFormik.handleChange} onBlur={mainFormik.handleBlur} error={mainFormik.touched.description && mainFormik.errors.description ? mainFormik.errors.description : ''} className="mb-4" />

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
                value={selectedFeatures.map((feature) => ({ value: feature.title, label: feature.title }))}
                onChange={(selectedOptions) =>
                  setSelectedFeatures(selectedOptions.map((option) => ({ title: option.value, description: '' })))
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
              <Input
                label={text.featureTitle}
                placeholder={text.featureTitle}
                value={featureTitle}
                onChange={(e) => setFeatureTitle(e.target.value)}
                className="mb-2"
                error={featureTitleError}
              />
              <Textarea
                label={text.featureDescription}
                placeholder={text.featureDescription}
                value={featureDescription}
                onChange={(e) => setFeatureDescription(e.target.value)}
                className="mb-2"
                error={featureDescriptionError}
              />
              <div className="flex gap-2">
                <Button onClick={handleAddFeature} disabled={!featureTitle || !featureDescription} className="w-full">
                  {text.add}
                </Button>
                <Button onClick={handleClearFeatureInputs} variant="outline" className="w-full">
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
