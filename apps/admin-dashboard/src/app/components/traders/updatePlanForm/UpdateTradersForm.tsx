'use client';

import { PiXBold, PiPlusBold, PiMinusBold } from 'react-icons/pi';
import React, { useEffect, useState } from 'react';
import { ActionIcon, Title, Button, Input, Textarea } from 'rizzui';
import ReactSelect from 'react-select';
import { useModal } from '@/app/shared/modal-views/use-modal';
import toast from 'react-hot-toast';
import styles from './UpdateTradersForm.module.css';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useFileContext } from '../../context/FileContext';
import { API_BASE_URL } from '@/config/base-url';
import { Loader } from 'lucide-react';

type Address = {
  city: string;
  governorate: string;
  country: string;
};


type UpdateTradersFormProps = {
  title?: string;
  modalBtnLabel?: string;
  onSuccess?: () => void;
  lang: string;
  traderId: string;
};

type TradersDetails = {
  id: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  email: string;
};
export default function UpdateTradersForm({
  title,
  modalBtnLabel = 'تعديل تاجر',
  onSuccess,
  traderId,
  lang = 'en',
}: UpdateTradersFormProps) {
  const { closeModal } = useModal();
  const [selectedAddresses, setSelectedAddresses] = useState<Address[]>([]);
  const [visibleSection, setVisibleSection] = useState<'' | 'addAddress' | 'selectAddress'>('');
  const [dynamicOptions, setDynamicOptions] = useState([
    { value: 'address1', label: lang === 'ar' ? 'عنوان 1' : 'Address 1' },
    { value: 'address2', label: lang === 'ar' ? 'عنوان 2' : 'Address 2' },
  ]);

  const [addressCity, setAddressCity] = useState('');
  const [addressGovernorate, setAddressGovernorate] = useState('');
  const [addressCountry, setAddressCountry] = useState('');
  const [addressErrors, setAddressErrors] = useState({ city: '', governorate: '', country: '' });
  const [selectAddressError, setSelectAddressError] = useState('');

  const [tradersDetails, setTradersDetails] = useState<TradersDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [isChanged, setIsChanged] = useState(false);
  const { setUpdateSeller } = useFileContext();

  const text = {
    name: lang === 'ar' ? 'الأسم' : 'Name',
    contactNumber: lang === 'ar' ? 'رقم التواصل' : 'Contact Number',
    email: lang === 'ar' ? 'البريد الالكتروني' : 'Email',
    preferredLanguage: lang === 'ar' ? 'اللغة المفضلة' : 'Preferred language',
    password: lang === 'ar' ? 'كلمة السر' : 'Password',
    addAddress: lang === 'ar' ? 'إضافة عنوان' : 'Add Address',
    selectAddress: lang === 'ar' ? 'اختيار عنوان' : 'Select Address',
    submit: lang === 'ar' ? 'تعديل تاجر' : 'Update Trader',
    city: lang === 'ar' ? 'المدينه' : 'City',
    governorate: lang === 'ar' ? 'المحافظة' : 'Governorate',
    country: lang === 'ar' ? 'البلد' : 'Country',
    phoneNumber: lang === 'ar' ? 'رقم الهاتف' : 'Phone Number',
    firstName: lang === 'ar' ? 'الاسم الأول' : 'First Name',
    lastName: lang === 'ar' ? 'الاسم الأخير' : 'Last Name',
    add: lang === 'ar' ? 'اضافة' : 'Add',
    clear: lang === 'ar' ? 'تفريغ' : 'Clear',
  };

  const requiredMessage = lang === 'ar' ? 'مطلوب' : 'is required';

  const fetchTradersDetails = async (id: string) => {
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
        const trader = data.entities.find((trader: { id: string }) => trader.id === id);

        if (trader) {
          return {
            id: trader.id,
            firstName: trader.name.split(' ')[0],
            lastName: trader.name.split(' ')[1] || '',
            phoneNumber: trader.phoneNumber,
            email: trader.email,
          };
        }
      }

      throw new Error('Failed to fetch trader details');
    } catch (error) {
      console.error('Error fetching trader details:', error);
      return null;
    }
  };
  useEffect(() => {
    const fetchData = async () => {
      const details = await fetchTradersDetails(traderId);
      setTradersDetails(details);
      setLoading(false);
    };

    fetchData();
  }, [traderId]);

  const mainFormSchema = Yup.object().shape({
    // name: Yup.string().required(text.name + ' ' + requiredMessage),
    // contactNumber: Yup.number().required(text.contactNumber + ' ' + requiredMessage),
    // email: Yup.string().required(text.email + ' ' + requiredMessage),
    // password: Yup.string().required(text.password + ' ' + requiredMessage),
    // preferredLanguage: Yup.string().required(text.preferredLanguage + ' ' + requiredMessage),
    email: Yup.string()
      .email(lang === 'ar' ? 'صيغة البريد الإلكتروني غير صحيحة' : 'Invalid email format')
      .required(text.email + ' ' + requiredMessage),
    phoneNumber: Yup.string()
      .required(text.phoneNumber + ' ' + requiredMessage)
      .matches(/^\d+$/, lang === 'ar' ? 'يجب أن يحتوي رقم الهاتف على أرقام فقط' : 'Phone number must contain only digits'),
    firstName: Yup.string().required(text.firstName + ' ' + requiredMessage),
    lastName: Yup.string().required(text.lastName + ' ' + requiredMessage),
  });

  const mainFormik = useFormik({
    initialValues: {
      // name: '',
      // contactNumber: '',
      // email: '',
      // password: '',
      // preferredLanguage: '',
      firstName: tradersDetails?.firstName || '',
      lastName: tradersDetails?.lastName || '',
      phoneNumber: tradersDetails?.phoneNumber || '',
      email: tradersDetails?.email || '',
    },
    validationSchema: mainFormSchema,
    enableReinitialize: true,
    onSubmit: async (values) => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/Seller/Update/${traderId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Accept-Language': lang,
          },
          body: JSON.stringify(values),
        });

        if (response.ok) {
          toast.success(lang === 'ar' ? 'تم تعديل التاجر بنجاح!' : 'Trader updated successfully!');
          setUpdateSeller(true);
          // console.log("Selected Addresses:", selectedAddresses);
          closeModal();
        } else {
          const errorData = await response.json();
          toast.error(errorData.message || lang === 'ar' ? 'حدث خطأ أثناء التعديل' : 'An error occurred while updating');
        }
      } catch (error) {
        console.error('Error updating trader:', error);
        toast.error(lang === 'ar' ? 'حدث خطأ أثناء التعديل' : 'An error occurred while updating');
      }
    },
  });

  const validateAddressInputs = () => {
    const errors = { city: '', governorate: '', country: '' };
    let isValid = true;

    if (!addressCity) {
      errors.city = text.city + ' ' + requiredMessage;
      isValid = false;
    }
    if (!addressGovernorate) {
      errors.governorate = text.governorate + ' ' + requiredMessage;
      isValid = false;
    }
    if (!addressCountry) {
      errors.country = text.country + ' ' + requiredMessage;
      isValid = false;
    }

    setAddressErrors(errors);
    return isValid;
  };

  const validateSelectAddress = () => {
    if (visibleSection === 'selectAddress' && selectedAddresses.length === 0) {
      setSelectAddressError(text.selectAddress + ' ' + requiredMessage);
      return false;
    } else {
      setSelectAddressError('');
      return true;
    }
  };

  const handleAddAddress = () => {
    if (validateAddressInputs()) {
      const newAddress = { city: addressCity, governorate: addressGovernorate, country: addressCountry };
      setSelectedAddresses((prev) => [...prev, newAddress]);
      setDynamicOptions((prev) => [...prev, { value: addressCity, label: addressCity }]);

      setAddressCity('');
      setAddressGovernorate('');
      setAddressCountry('');
      setVisibleSection('');
      toast.success(lang === 'ar' ? 'تمت إضافة العنوان!' : 'Address added!');
    }
  };

  const handleClearAddressInputs = () => {
    setAddressCity('');
    setAddressGovernorate('');
    setAddressCountry('');
    setAddressErrors({ city: '', governorate: '', country: '' });
  };

  useEffect(() => {
    if (tradersDetails) {
      const isFormChanged =
        mainFormik.values.firstName !== tradersDetails.firstName ||
        mainFormik.values.lastName !== tradersDetails.lastName ||
        mainFormik.values.phoneNumber !== tradersDetails.phoneNumber ||
        mainFormik.values.email !== tradersDetails.email;
      setIsChanged(isFormChanged);
    }
  }, [mainFormik.values, tradersDetails]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <Loader className="animate-spin text-[#e11d48]" width={40} height={40} />
      </div>
    );
  }

  if (!tradersDetails) {
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
          if (validateSelectAddress()) {
            mainFormik.handleSubmit();
          }
        }}>
          <Input label={text.firstName} placeholder={text.firstName} name="firstName" value={mainFormik.values.firstName} onChange={mainFormik.handleChange} onBlur={mainFormik.handleBlur} error={mainFormik.touched.firstName && mainFormik.errors.firstName ? mainFormik.errors.firstName : ''} className="mb-4" />
          <Input label={text.lastName} placeholder={text.lastName} name="lastName" value={mainFormik.values.lastName} onChange={mainFormik.handleChange} onBlur={mainFormik.handleBlur} error={mainFormik.touched.lastName && mainFormik.errors.lastName ? mainFormik.errors.lastName : ''} className="mb-4" />
          <Input label={text.email} placeholder={text.email} name="email" value={mainFormik.values.email} onChange={mainFormik.handleChange} onBlur={mainFormik.handleBlur} error={mainFormik.touched.email && mainFormik.errors.email ? mainFormik.errors.email : ''} className="mb-4" />
          <Input label={text.phoneNumber} placeholder={text.phoneNumber} name="phoneNumber" value={mainFormik.values.phoneNumber} onChange={mainFormik.handleChange} onBlur={mainFormik.handleBlur} error={mainFormik.touched.phoneNumber && mainFormik.errors.phoneNumber ? mainFormik.errors.phoneNumber : ''} className="mb-4" />
          {/* <Input label={text.preferredLanguage} placeholder={text.preferredLanguage} name="preferredLanguage" value={mainFormik.values.preferredLanguage} onChange={mainFormik.handleChange} onBlur={mainFormik.handleBlur} error={mainFormik.touched.preferredLanguage && mainFormik.errors.preferredLanguage ? mainFormik.errors.preferredLanguage : ''} className="mb-4" /> */}
          {/* <Textarea label={text.description} placeholder={text.description} name="description" value={mainFormik.values.description} onChange={mainFormik.handleChange} onBlur={mainFormik.handleBlur} error={mainFormik.touched.description && mainFormik.errors.description ? mainFormik.errors.description : ''} className="mb-4" /> */}

          {/* Select Address Section */}
          {(visibleSection === 'selectAddress' || selectedAddresses.length > 0) && (
            <div className="p-3 border border-gray-200 rounded-md mb-4">
              <div className="flex justify-end mb-4">
                <ActionIcon onClick={() => setVisibleSection('')} className="text-white">
                  <PiMinusBold />
                </ActionIcon>
              </div>
              <ReactSelect
                isMulti
                placeholder={text.selectAddress}
                value={selectedAddresses.map((address) => ({ value: address.city, label: address.city }))}
                onChange={(selectedOptions) =>
                  setSelectedAddresses(selectedOptions.map((option) => ({ city: option.value, governorate: '', country: '' })))
                }
                options={dynamicOptions}
                styles={{
                  menuList: (provided) => ({
                    ...provided,
                    maxHeight: '120px',
                  }),
                }}
              />
              {selectAddressError && <div className="text-red-500 text-sm">{selectAddressError}</div>}
            </div>
          )}

          {/* Add Address Section */}
          {visibleSection === 'addAddress' && (
            <div className="p-3 border border-gray-200 rounded-md mb-4">
              <div className="flex justify-end">
                <ActionIcon onClick={() => setVisibleSection('')} className="text-white">
                  <PiMinusBold />
                </ActionIcon>
              </div>
              <Input
                label={text.city}
                placeholder={text.city}
                value={addressCity}
                onChange={(e) => setAddressCity(e.target.value)}
                className="mb-2"
                error={addressErrors.city}
              />
              <Input
                label={text.governorate}
                placeholder={text.governorate}
                value={addressGovernorate}
                onChange={(e) => setAddressGovernorate(e.target.value)}
                className="mb-2"
                error={addressErrors.governorate}
              />
              <Input
                label={text.country}
                placeholder={text.country}
                value={addressCountry}
                onChange={(e) => setAddressCountry(e.target.value)}
                className="mb-2"
                error={addressErrors.country}
              />
              <div className="flex gap-2">
                <Button onClick={handleAddAddress} disabled={!addressCity || !addressGovernorate || !addressCountry} className="w-full">
                  {text.add}
                </Button>
                <Button onClick={handleClearAddressInputs} variant="outline" className="w-full">
                  {text.clear}
                </Button>
              </div>
            </div>
          )}


          {/* Feature Buttons */}
          <div className="flex gap-3 mb-4">
            <Button onClick={() => setVisibleSection('addAddress')} variant="outline" className="w-full">
              {text.addAddress}
            </Button>
            <Button onClick={() => setVisibleSection('selectAddress')} variant="outline" className="w-full">
              {text.selectAddress}
            </Button>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end gap-3">
            <Button type="submit" className="w-full" disabled={!isChanged}>
              {text.submit}<PiPlusBold className="ms-1.5 h-[17px] w-[17px]" />
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
