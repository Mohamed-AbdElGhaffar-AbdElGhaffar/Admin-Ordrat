// components/ActionsCell.tsx
import React from 'react';
import Link from 'next/link';
import { routes } from '@/config/routes';
import { ActionIcon, Tooltip } from 'rizzui';
import { useModal } from '@/app/shared/modal-views/use-modal';
import PencilIcon from '@components/icons/pencil';
import EyeIcon from '@components/icons/eye';
import UpdatePlanForm from '../updatePlanForm/UpdatePlanForm';
// import UpdatePlanForm from '../updateGuestForm/UpdateGuestForm';
// import GuestDetailsModal from '../guestDetailsModal/GuestDetailsModal';
import DeletePopover from '@/app/shared/delete-popover';
import { useFileContext } from '../../context/FileContext';
import { API_BASE_URL } from '@/config/base-url';
import toast from 'react-hot-toast';

interface ActionsCellProps {
  row: { original: { id: string; name: string; }; id: string };
  lang:string;
  view?:boolean;
}

const ActionsCellStores: React.FC<ActionsCellProps> = ({ row, lang, view = false }) => {
  // console.log("row: ",row);
  const { setUpdateStores } = useFileContext();

  const handleDeleteStore = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/Shop/Delete/${row.original.id}`, {
        method: 'DELETE',
        headers: {
          Accept: '*/*',
        },
      });

      if (response.ok) {
        const result = await response.json();
        setUpdateStores(true);
        toast.success(
          lang === 'ar'
            ? result.message || 'تم حذف المتجر بنجاح!'
            : result.message || 'Store deleted successfully!'
        );
      } else {
        const errorMessage = await response.text();
        toast.error(
          lang === 'ar'
            ? `حدث خطأ أثناء الحذف: ${errorMessage}`
            : `An error occurred while deleting the store: ${errorMessage}`
        );
      }
    } catch (error) {
      console.error('Error deleting store:', error);
      toast.error(
        lang === 'ar'
          ? 'حدث خطأ أثناء الحذف'
          : 'An error occurred while deleting the store'
      );
    }
  };
  return (
    <div className="flex items-center justify-end gap-3 pe-3">
      <DeletePopover
        title={lang === 'ar' ? 'حذف المتجر' : 'Delete the Store'}
        description={
          lang === 'ar' 
            ? `هل أنت متأكد أنك تريد حذف هذا متجر ${row.original.name}؟`
            : `Are you sure you want to delete this ${row.original.name} Store?`
        }
        onDelete={handleDeleteStore}
      />
    </div>
  );
};

export default ActionsCellStores;
