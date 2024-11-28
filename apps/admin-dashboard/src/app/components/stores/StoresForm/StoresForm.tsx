'use client';

import { PiXBold, PiPlusBold, PiMinusBold } from 'react-icons/pi';
import React, { useEffect, useState } from 'react';
import { ActionIcon, Title, Button, Input, Textarea } from 'rizzui';
import ReactSelect from 'react-select';
import { useModal } from '@/app/shared/modal-views/use-modal';
import toast from 'react-hot-toast';
import styles from './StoresForm.module.css';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import FileUpload from '@/app/shared/image-form-upload';
import { useFileContext } from '../../context/FileContext';
import RoleSelect from '@/app/shared/tan-table/selectInput';
import { ChromePicker } from 'react-color';
import { Loader } from 'lucide-react';
import { API_BASE_URL } from '@/config/base-url';

type Feature = {
  title: string;
  address: string;
};

type Seller = {
  email: string;
  phoneNumber: string;
  firstName: string;
  lastName: string;
};

type StoresFormProps = {
  title?: string;
  modalBtnLabel?: string;
  onSuccess?: () => void;
  lang: string;
};

export default function StoresForm({
  title,
  modalBtnLabel = 'إضافة متجر',
  onSuccess,
  lang = 'en',
}: StoresFormProps) {
  const { closeModal } = useModal();
  const [visibleSection, setVisibleSection] = useState<'' | 'addSeller'>('');
  const [seller, setSeller] = useState<Seller>({
    email: '',
    phoneNumber: '',
    firstName: '',
    lastName: '',
  });
  const [sellerError, setSellerError] = useState({
    email: '',
    phoneNumber: '',
    firstName: '',
    lastName: '',
  });
  const { fileData } = useFileContext();
  const text = {
    nameAr: lang === 'ar' ? 'الأسم (عربي)' : 'Name (Arabic)',
    nameEn: lang === 'ar' ? 'الأسم (انجليزي)' : 'Name (English)',
    subDomain: lang === 'ar' ? 'الصب دومين' : 'Sub Domain',
    address: lang === 'ar' ? 'العنوان' : 'Address',
    submit: lang === 'ar' ? 'انشاء' : 'Create',
    select: lang === 'ar' ? "نوع المتجر" : "Shop Type",
    selectSellerId: lang === 'ar' ? "كود التاجر" : "Seller Id",
    clear: lang === 'ar' ? 'تفريغ' : 'Clear',
    logo: lang === 'ar' ? 'اللوجو' : 'logo',
    background: lang === 'ar' ? 'الخلفية' : 'Background',
    mainColor: lang === 'ar' ? 'اللون الرئيسي' : 'Main Color',
    secondaryColor: lang === 'ar' ? 'اللون الثانوي' : 'Secondary Color',
    addSeller: lang === 'ar' ? 'إضافة تاجر' : 'Add Seller',
    sellerName: lang === 'ar' ? 'اسم التاجر' : 'Seller Name',
    sellerEmail: lang === 'ar' ? 'البريد الإلكتروني للتاجر' : 'Seller Email',
  };

  const requiredMessage = lang === 'ar' ? 'مطلوب' : 'is required';

  const [sellerOptions, setSellerOptions] = useState<{ id: string; name: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const { setUpdateStores } = useFileContext();

  const mainFormSchema = Yup.object().shape({
    nameAr: Yup.string().required(text.nameAr + ' ' + requiredMessage),
    nameEn: Yup.string().required(text.nameEn + ' ' + requiredMessage),
    subDomain: Yup.string().required(text.subDomain + ' ' + requiredMessage),
    shopType: Yup.string().required(`${text.select} ${requiredMessage}`),
    sellerId: Yup.string().required(`${text.selectSellerId} ${requiredMessage}`),
    mainColor: Yup.string().required(`${text.mainColor} ${requiredMessage}`),
    secondaryColor: Yup.string().required(`${text.secondaryColor} ${requiredMessage}`),
    logo: Yup.mixed().required(`${text.logo} ${requiredMessage}`).test(
      'fileFormat',
      lang === 'ar' ? 'يجب أن يكون ملف صورة' : 'Must be an image file',
      (file) => {
        return !file || (file instanceof File && ['image/jpeg', 'image/png', 'image/gif'].includes(file.type));
      }
    ),
    background: Yup.mixed().required(`${text.background} ${requiredMessage}`).test(
      'fileFormat',
      lang === 'ar' ? 'يجب أن يكون ملف صورة' : 'Must be an image file',
      (file) => {
        return !file || (file instanceof File && ['image/jpeg', 'image/png', 'image/gif'].includes(file.type));
      }
    ),
  });

  const mainFormik = useFormik({
    initialValues: {
      nameAr: '',
      nameEn: '',
      subDomain: '',
      shopType: '',
      sellerId: '',
      mainColor: '#ffffff',
      secondaryColor: '#000000',
      logo: null,
      background: null,
    },
    validationSchema: mainFormSchema,
    onSubmit: async (values) => {
      const formData = new FormData();
      formData.append('NameAr', values.nameAr);
      formData.append('NameEn', values.nameEn);
      formData.append('SubdomainName', values.subDomain);
      formData.append('ShopType', values.shopType);
      formData.append('SellerId', values.sellerId);
      formData.append('MainColor', values.mainColor);
      formData.append('SecondaryColor', values.secondaryColor);
      if (values.logo) {
        formData.append('Logo', values.logo);
      }
      if (values.background) {
        formData.append('Background', values.background);
      }
      formData.append('TopRatedIsEnabled', 'true');
      formData.append('TopSellingIsEnabled', 'true');
  
      try {
        const response = await fetch(`${API_BASE_URL}/api/Shop/Create`, {
          method: 'POST',
          headers: {
            'Accept-Language': lang,
          },
          body: formData,
        });
  
        if (response.ok) {
          closeModal();
          toast.success(lang === 'ar' ? 'تم انشاء المتجر بنجاح!' : 'Shop created successfully!');
          setUpdateStores(true);
        } else {
          const errorText = await response.text();
          toast.error(
            lang === 'ar'
              ? `فشل في إنشاء المتجر: ${errorText}`
              : `Failed to create shop: ${errorText}`
          );
        }
      } catch (error) {
        console.error('Error creating shop:', error);
        toast.error(lang === 'ar' ? 'حدث خطأ أثناء إنشاء المتجر' : 'An error occurred while creating the shop');
      }
    },
  });


  const handleFileChange = (file: File | null) => {
    mainFormik.setFieldValue('logo', file);
  };
  const handleFileDelete = () => {
    mainFormik.setFieldValue('logo', null);
  };
  const handleFileBackgroundChange = (file: File | null) => {
    mainFormik.setFieldValue('background', file);
  };
  const handleFileBackgroundDelete = () => {
    mainFormik.setFieldValue('background', null);
  };
  const staticOptions = lang === 'ar' 
  ? [
      { id: '0', name: 'مطعم' },    
      { id: '1', name: 'سوبر ماركت' },
    ] 
  : [
      { id: '0', name: 'Resturant' },    
      { id: '1', name: 'SuperMarket' },
    ];

  const [selectedValue, setSelectedValue] = useState<string>('');
  const [selectedSellerIdValue, setSelectedSellerIdValue] = useState<string>('');
  const handleValueSelectChange = (value: string) => {
    console.log("Selected real option:", value);
    setSelectedValue(value);
    mainFormik.setFieldValue('shopType', value)
  };
  const handleValueSelectSellerIdChange = (value: string) => {
    console.log("Selected SellerId option:", value);
    setSelectedSellerIdValue(value);
    mainFormik.setFieldValue('sellerId', value)
  };

  const fetchSellers = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/Seller/Filter`, {
        method: 'GET',
        headers: {
          Accept: '*/*',
          'Accept-Language': lang,
        },
      });

      if (response.ok) {
        const data = await response.json();
        const sellers = data.entities.map((seller: any) => ({
          id: seller.id,
          name: seller.name,
        }));
        setSellerOptions(sellers);
      } else {
        toast.error(lang === 'ar' ? 'فشل في جلب التجار' : 'Failed to fetch sellers');
      }
    } catch (error) {
      console.error('Error fetching sellers:', error);
      toast.error(lang === 'ar' ? 'حدث خطأ أثناء جلب التجار' : 'An error occurred while fetching sellers');
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchSellers();
  }, [lang]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <Loader className="animate-spin text-[#e11d48]" width={40} height={40} />
      </div>
    );
  }

  const handleColorChange = (field: 'mainColor' | 'secondaryColor', color: string) => {
    mainFormik.setFieldValue(field, color);
  };

  const validateSellerInputs = () => {
    const errors = { email: '', phoneNumber: '', firstName: '', lastName: '' };
    let isValid = true;
  
    if (!seller.firstName) {
      errors.firstName = lang === 'ar' ? 'الاسم الأول مطلوب' : 'First name is required';
      isValid = false;
    }
  
    if (!seller.lastName) {
      errors.lastName = lang === 'ar' ? 'الاسم الأخير مطلوب' : 'Last name is required';
      isValid = false;
    }
  
    if (!seller.email) {
      errors.email = lang === 'ar' ? 'البريد الإلكتروني مطلوب' : 'Email is required';
      isValid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(seller.email)) {
      errors.email = lang === 'ar' ? 'بريد إلكتروني غير صالح' : 'Invalid email address';
      isValid = false;
    }
  
    if (!seller.phoneNumber) {
      errors.phoneNumber = lang === 'ar' ? 'رقم الهاتف مطلوب' : 'Phone number is required';
      isValid = false;
    } else if (!/^\d+$/.test(seller.phoneNumber)) {
      errors.phoneNumber = lang === 'ar' ? 'رقم الهاتف غير صالح' : 'Invalid phone number';
      isValid = false;
    }
  
    setSellerError(errors);
    return isValid;
  };
  
  // Dynamic validation on change
  const handleInputChange = (field: string, value: string) => {
    setSeller((prev) => ({ ...prev, [field]: value }));

    // Validate dynamically
    setSellerError((prev) => ({
      ...prev,
      [field]: (() => {
        if (field === 'firstName' || field === 'lastName') {
          return value ? '' : lang === 'ar' ? `${field === 'firstName' ? 'الاسم الأول' : 'الاسم الأخير'} مطلوب` : `${field === 'firstName' ? 'First name' : 'Last name'} is required`;
        }
        if (field === 'email') {
          return !value
            ? lang === 'ar' ? 'البريد الإلكتروني مطلوب' : 'Email is required'
            : /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
            ? ''
            : lang === 'ar'
            ? 'بريد إلكتروني غير صالح'
            : 'Invalid email address';
        }
        if (field === 'phoneNumber') {
          return !value
            ? lang === 'ar' ? 'رقم الهاتف مطلوب' : 'Phone number is required'
            : /^\d+$/.test(value)
            ? ''
            : lang === 'ar'
            ? 'رقم الهاتف غير صالح'
            : 'Invalid phone number';
        }
        return '';
      })(),
    }));
  };

  const handleAddSeller = async () => {
    if (validateSellerInputs()) {
      console.log('Seller Data:', seller);
      try {
        const response = await fetch(`${API_BASE_URL}/api/Seller/Create`, {
          method: 'POST',
          headers: {
            'Accept': '*/*',
            'Accept-Language': lang,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: seller.email,
            phoneNumber: seller.phoneNumber,
            firstName: seller.firstName,
            lastName: seller.lastName,
          }),
        });
  
        if (response.ok) {
          const data = await response.json();
          toast.success(
            lang === 'ar' ? 'تمت إضافة التاجر بنجاح!' : data.message || 'Seller added successfully!'
          );
          setSeller({ email: '', phoneNumber: '', firstName: '', lastName: '' });
          setVisibleSection('');
          fetchSellers();
        } else {
          const errorText = await response.text();
          toast.error(
            lang === 'ar'
              ? `فشل في إضافة التاجر: ${errorText}`
              : `Failed to add seller: ${errorText}`
          );
        }
      } catch (error) {
        console.error('Error adding seller:', error);
        toast.error(lang === 'ar' ? 'حدث خطأ أثناء إضافة التاجر' : 'An error occurred while adding the seller');
      }
    }
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
        <Title as="h4" className="text-lg mb-3">{lang === 'ar' ? 'بيانات المتجر :' : 'Store Data:'}</Title>
        <form onSubmit={(e) => {
          e.preventDefault();
          mainFormik.handleSubmit();
        }}>
          <Input label={text.nameAr} placeholder={text.nameAr} name="nameAr" value={mainFormik.values.nameAr} onChange={mainFormik.handleChange} onBlur={mainFormik.handleBlur} error={mainFormik.touched.nameAr && mainFormik.errors.nameAr ? mainFormik.errors.nameAr : ''} className="mb-4" />
          <Input label={text.nameEn} placeholder={text.nameEn} name="nameEn" value={mainFormik.values.nameEn} onChange={mainFormik.handleChange} onBlur={mainFormik.handleBlur} error={mainFormik.touched.nameEn && mainFormik.errors.nameEn ? mainFormik.errors.nameEn : ''} className="mb-4" />
          <Input label={text.subDomain} placeholder={text.subDomain} name="subDomain" value={mainFormik.values.subDomain} onChange={mainFormik.handleChange} onBlur={mainFormik.handleBlur} error={mainFormik.touched.subDomain && mainFormik.errors.subDomain ? mainFormik.errors.subDomain : ''} className="mb-4" />
          {/* <Textarea label={text.address} placeholder={text.address} name="address" value={mainFormik.values.address} onChange={mainFormik.handleChange} onBlur={mainFormik.handleBlur} error={mainFormik.touched.address && mainFormik.errors.address ? mainFormik.errors.address : ''} className="mb-4" /> */}
          <label htmlFor="select" className='block text-sm mb-1.5 font-medium'>{text.select}</label>
          <div className='mb-3'>
            <RoleSelect
              placeholder={text.select}
              options={staticOptions}
              optionId={true}
              selectValue={selectedValue}
              onChange={(e)=>handleValueSelectChange(e)}
              error={mainFormik.touched.shopType && mainFormik.errors.shopType ? mainFormik.errors.shopType : ''}
            />
          </div>
          <label htmlFor="sellerId" className='block text-sm mb-1.5 font-medium'>{text.selectSellerId}</label>
          <div className='mb-3'>
            <RoleSelect
              placeholder={text.selectSellerId}
              options={sellerOptions}
              optionId={true}
              selectValue={selectedSellerIdValue}
              onChange={(e)=>handleValueSelectSellerIdChange(e)}
              error={mainFormik.touched.sellerId && mainFormik.errors.sellerId ? mainFormik.errors.sellerId : ''}
            />
          </div>
          <div className="mb-3">
            <label className="block text-sm font-medium mb-2">{text.mainColor}</label>
            <ChromePicker
              color={mainFormik.values.mainColor}
              onChangeComplete={(color) => handleColorChange('mainColor', color.hex)}
              styles={{
                default: {
                  picker: {
                    width: '100%',
                  },
                },
              }}
            />
            {mainFormik.touched.mainColor && mainFormik.errors.mainColor && (
              <div className="text-red-500 text-sm">{mainFormik.errors.mainColor}</div>
            )}
          </div>
          <div className="mb-3">
            <label className="block text-sm font-medium mb-2">{text.secondaryColor}</label>
            <ChromePicker
              color={mainFormik.values.secondaryColor}
              onChangeComplete={(color) => handleColorChange('secondaryColor', color.hex)}
              styles={{
                default: {
                  picker: {
                    width: '100%',
                  },
                },
              }}
            />
            {mainFormik.touched.secondaryColor && mainFormik.errors.secondaryColor && (
              <div className="text-red-500 text-sm">{mainFormik.errors.secondaryColor}</div>
            )}
          </div>
          <FileUpload
            label={text.logo}
            accept="img"
            multiple={false}
            multipleFiles={false}
            lang={lang}
            onFileChange={handleFileChange}
            onFileDelete={handleFileDelete}
            // btnLabel={modalBtnLabel}
          />
          {mainFormik.touched.logo && mainFormik.errors.logo && (
            <div className={`text-red-500 text-sm ${fileData? '' : 'mb-6' }`}>{mainFormik.errors.logo}</div>
          )}
          <FileUpload
            label={text.background}
            accept="img"
            multiple={false}
            multipleFiles={false}
            lang={lang}
            onFileChange={handleFileBackgroundChange}
            onFileDelete={handleFileBackgroundDelete}
            // btnLabel={modalBtnLabel}
          />
          {mainFormik.touched.background && mainFormik.errors.background && (
            <div className={`text-red-500 text-sm ${fileData? '' : 'mb-6' }`}>{mainFormik.errors.background}</div>
          )}

          {visibleSection === 'addSeller' && (
            <div className="p-3 border border-gray-200 rounded-md mb-4">
              <div className="flex justify-end">
                <ActionIcon onClick={() => setVisibleSection('')} className="text-white">
                  <PiMinusBold />
                </ActionIcon>
              </div>
              <Input
                label={lang === 'ar' ? 'الاسم الأول' : 'First Name'}
                placeholder={lang === 'ar' ? 'الاسم الأول' : 'First Name'}
                value={seller.firstName}
                onChange={(e) => handleInputChange('firstName', e.target.value)}
                className="mb-2"
                error={sellerError.firstName}
              />
              <Input
                label={lang === 'ar' ? 'الاسم الأخير' : 'Last Name'}
                placeholder={lang === 'ar' ? 'الاسم الأخير' : 'Last Name'}
                value={seller.lastName}
                onChange={(e) => handleInputChange('lastName', e.target.value)}
                className="mb-2"
                error={sellerError.lastName}
              />
              <Input
                label={lang === 'ar' ? 'البريد الإلكتروني' : 'Email'}
                placeholder={lang === 'ar' ? 'البريد الإلكتروني' : 'Email'}
                value={seller.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className="mb-2"
                error={sellerError.email}
              />
              <Input
                label={lang === 'ar' ? 'رقم الهاتف' : 'Phone Number'}
                placeholder={lang === 'ar' ? 'رقم الهاتف' : 'Phone Number'}
                value={seller.phoneNumber}
                onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
                className="mb-2"
                error={sellerError.phoneNumber}
              />
              <div className="flex gap-2">
                <Button onClick={handleAddSeller} className="w-full">
                  {lang === 'ar' ? 'اضافة' : 'Add'}
                </Button>
                <Button
                  onClick={() =>
                    setSeller({ email: '', phoneNumber: '', firstName: '', lastName: '' })
                  }
                  variant="outline"
                  className="w-full"
                >
                  {lang === 'ar' ? 'تفريغ' : 'Clear'}
                </Button>
              </div>
            </div>
          )}

          {/* Button to Show Add Seller Section */}
          <div className="flex gap-3 mb-4">
            <Button onClick={() => setVisibleSection('addSeller')} variant="outline" className="w-full">
              {text.addSeller}
            </Button>
          </div>


          {/* Submit Button */}
          <div className="flex justify-end gap-3">
            <Button type="submit" className="w-full">
              {text.submit}<PiPlusBold className="ms-1.5 h-[17px] w-[17px]" />
            </Button>
            <Button onClick={() => console.log("clear")} variant="outline" className="w-full">
              {text.clear}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
