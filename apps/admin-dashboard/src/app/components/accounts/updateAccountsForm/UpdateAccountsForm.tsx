'use client';

import { PiXBold, PiPlusBold, PiMinusBold, PiArrowClockwiseBold } from 'react-icons/pi';
import React, { useEffect, useState } from 'react';
import { ActionIcon, Title, Button, Input, Password } from 'rizzui';
import ReactSelect from 'react-select';
import { useModal } from '@/app/shared/modal-views/use-modal';
import toast from 'react-hot-toast';
import styles from './UpdateAccountsForm.module.css';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { API_BASE_URL } from '@/config/base-url';
import { Loader } from 'lucide-react';
import { useFileContext } from '../../context/FileContext';
import axiosClient from '../../context/api';

type Group = {
  id: string;
  name: string;
};

type NewGroup = {
  nameEn: string;
  nameAr: string;
  roles: { roleId:string; }[];
};
type NewRole = {
  nameEn: string;
  nameAr: string;
};

type UpdateAccountsFormProps = {
  title?: string;
  modalBtnLabel?: string;
  onSuccess?: () => void;
  lang: string;
  accountId: string;
};

export default function UpdateAccountsForm({
  title,
  modalBtnLabel = 'تعديل مساعد ادمن',
  onSuccess,
  lang = 'en',
  accountId
}: UpdateAccountsFormProps) {
  const { closeModal } = useModal();
  const [selectedGroups, setSelectedGroups] = useState<Group[]>([]);
  const [dynamicOptions, setDynamicOptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isGroupModalOpen, setIsGroupModalOpen] = useState(false);
  const [isRoleModalOpen, setIsRoleModalOpen] = useState(false);
  const [newGroup, setNewGroup] = useState<NewGroup>({
    nameAr: '',
    nameEn: '',
    roles: [],
  });
  const [newRole, setNewRole] = useState<NewRole>({
    nameAr: '',
    nameEn: '',
  });
  const [selectedRoles, setSelectedRoles] = useState<Group[]>([]);
  
  const [dynamicRoleOptions, setDynamicRoleOptions] = useState([]);
  const [role, setRole] = useState(true);
  const [newGroupError, setNewGroupError] = useState({
    nameAr: '',
    nameEn: '',
    roles: '',
  });
  const [newRoleError, setNewRoleError] = useState({
    nameAr: '',
    nameEn: '',
  });

  const text = {
    firstName: lang === 'ar' ? 'الاسم الأول' : 'First Name',
    lastName: lang === 'ar' ? 'الاسم الأخير' : 'Last Name',
    phoneNumber: lang === 'ar' ? 'رقم الهاتف' : 'Phone Number',
    email: lang === 'ar' ? 'البريد الالكتروني' : 'Email',
    password: lang === 'ar' ? 'كلمة المرور' : 'Password',
    selectPermissions: lang === 'ar' ? 'اختيار جروب الصلاحيات' : 'Select Permissions Groups',

    submit: lang === 'ar' ? 'تعديل مساعد المسؤول' : 'Update Admin Assestant',

    addGroup: lang === 'ar' ? 'إضافة مجموعة جديدة' : 'Add New Group',
    addRole: lang === 'ar' ? 'إضافة صلاحية جديدة' : 'Add New Role',

    newGroupAr: lang === 'ar' ? 'اسم المجموعة (عربي)' : 'Group Name (Arabic)',
    newGroupEn: lang === 'ar' ? 'اسم المجموعة (إنجليزي)' : 'Group Name (English)',
    role: lang === 'ar' ? 'صلاحيات المجموعة' : 'Group Role',

    newRoleAr: lang === 'ar' ? 'اسم الصلاحية (عربي)' : 'Role Name (Arabic)',
    newRoleEn: lang === 'ar' ? 'اسم الصلاحية (إنجليزي)' : 'Role Name (English)',

    add: lang === 'ar' ? 'اضافة' : 'Add',
    clear: lang === 'ar' ? 'تفريغ' : 'Clear',
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
    permissions: Yup.array().min(1, text.selectPermissions + ' ' + requiredMessage),
  });

  // State for fetched data
  const [initialValues, setInitialValues] = useState({
    firstName: '',
    lastName: '',
    phoneNumber: '',
    email: '',
    permissions: [],
  });

  const fetchData = async () => {
    try {
      const accountResponse = await axiosClient.get(`/api/Support/GetById/${accountId}`, {
        headers: { 'Accept-Language': lang },
      });
      const accountData = accountResponse.data;

      const groupsResponse = await axiosClient.get('/api/Group/GetAll', {
        headers: { 'Accept-Language': lang },
      });
      const groupsData = groupsResponse.data.map((group: Group) => ({
        value: group.id,
        label: group.name,
      }));

      setDynamicOptions(groupsData);
      setInitialValues({
        firstName: accountData.firstName,
        lastName: accountData.lastName,
        phoneNumber: accountData.phoneNumber,
        email: accountData.email,
        permissions: accountData.groups.map((group: Group) => ({
          id: group.id,
        })),
      });
      const options = accountData.groups.map((group: Group) => ({ id: group.id, name: group.name }));
      setSelectedGroups(options);
      // mainFormik.setFieldValue('permissions', options);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error(lang === 'ar' ? 'حدث خطأ أثناء تحميل البيانات' : 'Error fetching data');
      setLoading(false);
    }
  };

  // Formik configuration
  const mainFormik = useFormik({
    initialValues,
    enableReinitialize: true,
    validationSchema: mainFormSchema,
    onSubmit: async (values) => {
      const updatedData = {
        firstName: values.firstName,
        lastName: values.lastName,
        phoneNumber: values.phoneNumber,
        email: values.email,
        groups: values.permissions.map((permission: any) => permission.id),
      };      
      try {

        const response = await axiosClient.put(`/api/Support/Update/${accountId}`, updatedData, {
          headers: { 'Accept-Language': lang },
        });

        if (response.status === 200) {
          toast.success(lang === 'ar' ? 'تم تعديل الحساب بنجاح!' : 'Account updated successfully!');
          if (onSuccess) onSuccess();
          closeModal();
        }
      } catch (error) {
        console.error('Error updating account:', error);
        toast.error(lang === 'ar' ? 'حدث خطأ أثناء تعديل الحساب' : 'Error updating account');
      }
    },
  });


  const validateNewGroupInputs = () => {
    const errors = { nameAr: '', nameEn: '', roles:'' };
    let isValid = true;

    if (!newGroup.nameAr) {
      errors.nameAr = text.newGroupAr + ' ' + requiredMessage;
      isValid = false;
    }
    if (!newGroup.nameEn) {
      errors.nameEn = text.newGroupEn + ' ' + requiredMessage;
      isValid = false;
    }
    if (newGroup.roles.length == 0 && !role) {
      errors.roles = text.role + ' ' + requiredMessage;
      isValid = false;
    }

    setNewGroupError(errors);
    return isValid;
  };

  const validateNewRoleInputs = () => {
    const errors = { nameAr: '', nameEn: '' };
    let isValid = true;

    if (!newRole.nameAr) {
      errors.nameAr = text.newRoleAr + ' ' + requiredMessage;
      isValid = false;
    }
    if (!newRole.nameEn) {
      errors.nameEn = text.newRoleEn + ' ' + requiredMessage;
      isValid = false;
    }

    setNewRoleError(errors);
    return isValid;
  };

  // Fetch dynamic options
  const fetchGroups = async () => {
    try {
      const { data } = await axiosClient.get('/api/Group/GetAll', {
        headers: {
          'Accept-Language': lang,
        },
      });
      const options = data.map((group: { id: any; name: any; }) => ({ value: group.id, label: group.name }));
      setDynamicOptions(options);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching groups:', error);
      toast.error(lang === 'ar' ? 'خطأ في تحميل الصلاحيات' : 'Error fetching permissions');
      setLoading(false);
    }
  };

  // Fetch dynamic options for Roles
  const fetchRoles = async () => {
    try {
      const { data } = await axiosClient.get('/api/Role/GetAll', {
        headers: {
          'Accept-Language': lang,
        },
      });
      const options = data.map((role: { id: any; name: any; }) => ({ value: role.id, label: role.name }));
      setDynamicRoleOptions(options);
    } catch (error) {
      console.error('Error fetching groups:', error);
      toast.error(lang === 'ar' ? 'خطأ في تحميل صلاحيات الجروب' : 'Error fetching role permissions');
    }
  };

  const createGroup = async () => {
    if (validateNewGroupInputs()) {      
      try {
        const response = await axiosClient.post('/api/Group/Create', newGroup);

        if (response.status === 200) {
          toast.success(lang === 'ar' ? 'تم إنشاء المجموعة بنجاح!' : 'Group created successfully!');
          setNewGroup({ nameAr: '', nameEn: '', roles: [], });
          setSelectedRoles([]);
          setRole(true);
          setIsGroupModalOpen(false);
          fetchGroups();
        } else {
          toast.error(lang === 'ar' ? 'فشل في إنشاء المجموعة' : 'Failed to create group');
        }
      } catch (error) {
        console.error('Error creating group:', error);
        toast.error(lang === 'ar' ? 'حدث خطأ أثناء إنشاء المجموعة' : 'An error occurred while creating the group');
      }
    }
  };

  const createRole = async () => {
    if (validateNewRoleInputs()) {      
      try {
        const response = await axiosClient.post('/api/Role/Create', newRole);

        if (response.status === 200) {
          toast.success(lang === 'ar' ? 'تم إنشاء الصلاحية بنجاح!' : 'Role created successfully!');
          setNewRole({ nameAr: '', nameEn: '' });
          setIsRoleModalOpen(false);
          fetchRoles();
        } else {
          toast.error(lang === 'ar' ? 'فشل في إنشاء الصلاحية' : 'Failed to create role');
        }
      } catch (error) {
        console.error('Error creating role:', error);
        toast.error(lang === 'ar' ? 'حدث خطأ أثناء إنشاء الصلاحية' : 'An error occurred while creating the role');
      }
    }
  };

  useEffect(() => {
    fetchGroups();
    fetchRoles();
    fetchData();
  }, [lang]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <Loader className="animate-spin text-[#e11d48]" width={40} height={40} />
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
          {/* <Input label={text.name} placeholder={text.name} name="name" value={mainFormik.values.name} onChange={mainFormik.handleChange} onBlur={mainFormik.handleBlur} error={mainFormik.touched.name && mainFormik.errors.name ? mainFormik.errors.name : ''} className="mb-4" /> */}
          <Input label={text.firstName} placeholder={text.firstName} name="firstName" value={mainFormik.values.firstName} onChange={mainFormik.handleChange} onBlur={mainFormik.handleBlur} error={mainFormik.touched.firstName && mainFormik.errors.firstName ? mainFormik.errors.firstName : ''} className="mb-4" />
          <Input label={text.lastName} placeholder={text.lastName} name="lastName" value={mainFormik.values.lastName} onChange={mainFormik.handleChange} onBlur={mainFormik.handleBlur} error={mainFormik.touched.lastName && mainFormik.errors.lastName ? mainFormik.errors.lastName : ''} className="mb-4" />
          <Input label={text.phoneNumber} placeholder={text.phoneNumber} name="phoneNumber" value={mainFormik.values.phoneNumber} onChange={mainFormik.handleChange} onBlur={mainFormik.handleBlur} error={mainFormik.touched.phoneNumber && mainFormik.errors.phoneNumber ? mainFormik.errors.phoneNumber : ''} className="mb-4" />
          <Input label={text.email} placeholder={text.email} name="email" value={mainFormik.values.email} onChange={mainFormik.handleChange} onBlur={mainFormik.handleBlur} error={mainFormik.touched.email && mainFormik.errors.email ? mainFormik.errors.email : ''} className="mb-4" />
          <div className='mb-4'>
            <label className="block text-sm mb-1.5 font-medium" htmlFor="permissions">
              {text.selectPermissions}
            </label>
            <ReactSelect
              isMulti
              placeholder={text.selectPermissions}
              value={selectedGroups.map((group) => ({ value: group.id, label: group.name }))}
              onChange={(selectedOptions) => {
                const options = selectedOptions.map((option) => ({ id: option.value, name: option.label }));
                const newOptions = selectedOptions.map((option) => ({ id: option.value }));
                setSelectedGroups(options);
                mainFormik.setFieldValue('permissions', newOptions);
              }}
              options={dynamicOptions}
              styles={{
                menuList: (provided) => ({
                  ...provided,
                  maxHeight: '120px',
                }),
              }}
            />
            {mainFormik.touched.permissions && mainFormik.errors.permissions && (
              <div className="text-red text-[13px] mt-0.5">
                {mainFormik.errors.permissions}
              </div>
            )}
          </div>

          {isGroupModalOpen && (
            <div className="p-3 border border-gray-200 rounded-md mb-4">
              <div className="flex justify-end">
                <ActionIcon onClick={() => {
                    setIsGroupModalOpen(false);
                    setNewGroup({ nameAr: '', nameEn: '', roles: [] });
                    setSelectedRoles([]);
                  }} className="text-white"
                >
                  <PiMinusBold />
                </ActionIcon>
              </div>
              <Input label={text.newGroupAr} placeholder={text.newGroupAr} value={newGroup.nameAr} onChange={(e) => setNewGroup((prev) => ({ ...prev, nameAr: e.target.value }))} className="mb-2" error={newGroupError.nameAr} />
              <Input label={text.newGroupEn} placeholder={text.newGroupEn} value={newGroup.nameEn} onChange={(e) => setNewGroup((prev) => ({ ...prev, nameEn: e.target.value }))} className="mb-2" error={newGroupError.nameEn} />        
              <label className="block text-sm mb-1.5 font-medium" htmlFor="permissions">
                {text.role}
              </label>
              <ReactSelect
                isMulti
                placeholder={text.role}
                value={selectedRoles.map((group) => ({ value: group.id, label: group.name }))}
                onChange={(selectedOptions) => {
                  const options = selectedOptions.map((option) => ({ id: option.value, name: option.label }));
                  const RealOptions = selectedOptions.map((option) => ({ roleId: option.value }));
                  setSelectedRoles(options);
                  setNewGroup((prev) => ({ ...prev, roles: RealOptions }))                  
                  if(selectedOptions.length == 0){
                    setRole(true);
                  }else{
                    setRole(false);
                  }
                }}
                options={dynamicRoleOptions}
                styles={{
                  menuList: (provided) => ({
                    ...provided,
                    maxHeight: '120px',
                  }),
                }}
              />
              {newGroupError.roles && (
                <div className="text-red text-[13px] mt-0.5">
                  {newGroupError.roles}
                </div>
              )}
              <div className="flex gap-2 mt-4">
                <Button onClick={createGroup} disabled={!newGroup.nameAr || ! newGroup.nameEn || ! newGroup.roles || role} className="w-full">
                  {text.add}
                </Button>
                <Button onClick={() => {
                    setNewGroup({ nameAr: '', nameEn: '', roles: [] });
                    setSelectedRoles([]);
                  }} 
                  variant="outline" className="w-full"
                >
                  {text.clear}
                </Button>
              </div>
            </div>
          )}
          
          {isRoleModalOpen && (
            <div className="p-3 border border-gray-200 rounded-md mb-4">
              <div className="flex justify-end">
                <ActionIcon onClick={() => {
                    setIsRoleModalOpen(false);
                    setNewRole({ nameAr: '', nameEn: '' });
                  }} className="text-white"
                >
                  <PiMinusBold />
                </ActionIcon>
              </div>
              <Input label={text.newRoleAr} placeholder={text.newRoleAr} value={newRole.nameAr} onChange={(e) => setNewRole((prev) => ({ ...prev, nameAr: e.target.value }))} className="mb-2" error={newRoleError.nameAr} />
              <Input label={text.newRoleEn} placeholder={text.newRoleEn} value={newRole.nameEn} onChange={(e) => setNewRole((prev) => ({ ...prev, nameEn: e.target.value }))} className="mb-2" error={newRoleError.nameEn} />        
              <div className="flex gap-2 mt-4">
                <Button onClick={createRole} disabled={!newRole.nameAr || !newRole.nameEn} className="w-full">
                  {text.add}
                </Button>
                <Button onClick={() => {
                    setNewRole({ nameAr: '', nameEn: '' });
                  }} 
                  variant="outline" className="w-full"
                >
                  {text.clear}
                </Button>
              </div>
            </div>
          )}

          {/* Group and Role Buttons */}
          <div className="flex gap-3 mb-0">
            <Button variant="outline" className="w-full" onClick={() => setIsGroupModalOpen(true)}>
              {text.addGroup}
            </Button>
            <Button variant="outline" className="w-full" onClick={() => setIsRoleModalOpen(true)}>
              {text.addRole}
            </Button>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end gap-3 mt-4">
            <Button type="submit" className="w-full">
              {text.submit}<PiPlusBold className="ms-1.5 h-[17px] w-[17px]" />
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
