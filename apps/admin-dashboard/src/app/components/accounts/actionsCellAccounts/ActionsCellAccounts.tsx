// components/ActionsCell.tsx
import React from 'react';
import Link from 'next/link';
import { routes } from '@/config/routes';
import { ActionIcon, Tooltip } from 'rizzui';
import { useModal } from '@/app/shared/modal-views/use-modal';
import PencilIcon from '@components/icons/pencil';
import EyeIcon from '@components/icons/eye';
// import UpdateAccountsForm from '../updateGuestForm/UpdateGuestForm';
// import GuestDetailsModal from '../guestDetailsModal/GuestDetailsModal';
import DeletePopover from '@/app/shared/delete-popover';
import UpdateAccountsForm from '../updateAccountsForm/UpdateAccountsForm';
import { useFileContext } from '../../context/FileContext';
import { API_BASE_URL } from '@/config/base-url';
import toast from 'react-hot-toast';

interface ActionsCellProps {
  row: { original: { id: string; name: string; }; id: string };
  lang:string;
  view?:boolean;
}

const ActionsCellAccounts: React.FC<ActionsCellProps> = ({ row, lang, view = false }) => {    
  const { openModal } = useModal();
 
  const handleOpenModal = () => {
    openModal({
      view: <UpdateAccountsForm lang={lang} accountId={row.original.id} onSuccess={()=>setUpdateAccounts(true)} />,
      customSize: '480px',
    });
  };

  const handleOpenDetailsModal = () => {
    openModal({
      view: <UpdateAccountsForm lang={lang} title={`معلومات المسؤول`} accountId={row.original.id} onSuccess={()=>setUpdateAccounts(true)} />,
      customSize: '800px',
    });
  };

  const { setUpdateAccounts } = useFileContext();

  const handleDeleteAccount = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/Support/Delete/${row.original.id}`, {
        method: 'DELETE',
        headers: {
          Accept: '*/*',
        },
      });

      if (response.ok) {
        setUpdateAccounts(true);
        toast.success(lang === 'ar' ? 'تم حذف المسؤول بنجاح!' : 'Admin deleted successfully!');
      } else {
        toast.error(lang === 'ar' ? 'حدث خطأ أثناء الحذف' : 'An error occurred while deleting the admin');
      }
    } catch (error) {
      console.error('Error deleting feature:', error);
      toast.error(lang === 'ar' ? 'حدث خطأ أثناء الحذف' : 'An error occurred while deleting the admin');
    }
  };

  return (
    <div className="flex items-center justify-end gap-3 pe-3">
      <Tooltip
        size="sm"
        content={lang === 'ar' ? 'تعديل المسؤول' : 'Edit Admin'}
        placement="top"
        color="invert"
      >
        <ActionIcon
          as="span"
          size="sm"
          variant="outline"
          className="hover:!border-gray-900 hover:text-gray-700"
          onClick={handleOpenModal}
        >
          <PencilIcon className="h-4 w-4" />
        </ActionIcon>
      </Tooltip>
      {view &&
        <Tooltip
          size="sm"
          content={lang === 'ar' ? 'عرض المسؤل' : 'View Admin'}
          placement="top"
          color="invert"
        >
          <ActionIcon
            as="span"
            size="sm"
            variant="outline"
            className="hover:!border-gray-900 hover:text-gray-700"
            onClick={handleOpenDetailsModal}
          >
            <EyeIcon className="h-4 w-4" />
          </ActionIcon>
        </Tooltip>
      }
      <DeletePopover
        title={lang === 'ar' ? 'حذف المسؤول' : 'Delete the Admin'}
        description={
          lang === 'ar' 
            ? `هل أنت متأكد أنك تريد حذف ${row.original.name}؟`
            : `Are you sure you want to delete this ${row.original.name}?`
        }
        onDelete={handleDeleteAccount}
      />
    </div>
  );
};

export default ActionsCellAccounts;
