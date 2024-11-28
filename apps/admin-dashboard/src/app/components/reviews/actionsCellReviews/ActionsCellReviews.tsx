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
import { API_BASE_URL } from '@/config/base-url';
import { useFileContext } from '../../context/FileContext';
import toast from 'react-hot-toast';

interface ActionsCellProps {
  row: { original: { id: string; name: string; }; id: string };
  lang:string;
  view?:boolean;
}

const ActionsCellReviews: React.FC<ActionsCellProps> = ({ row, lang, view = false }) => {
    // console.log("row: ",row);
    const { setUpdateReviews } = useFileContext();

    const handleDeleteReview = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/Review/DeleteReview/${row.original.id}`, {
          method: 'DELETE',
          headers: {
            Accept: '*/*',
          },
        });
  
        if (response.ok) {
          setUpdateReviews(true);
          toast.success(lang === 'ar' ? 'تم حذف التعليق بنجاح!' : 'Review deleted successfully!');
        } else {
          toast.error(lang === 'ar' ? 'حدث خطأ أثناء الحذف' : 'An error occurred while deleting the review');
        }
      } catch (error) {
        console.error('Error deleting feature:', error);
        toast.error(lang === 'ar' ? 'حدث خطأ أثناء الحذف' : 'An error occurred while deleting the review');
      }
    };
  return (
    <div className="flex items-center justify-end gap-3 pe-3">
      <DeletePopover
        title={lang === 'ar' ? 'حذف التعليق' : 'Delete the Review'}
        description={
          lang === 'ar' 
            ? `هل أنت متأكد أنك تريد حذف ${row.original.name?row.original.name : 'التعليق'}؟`
            : `Are you sure you want to delete this ${row.original.name} Review?`
        }
        onDelete={handleDeleteReview}
      />
    </div>
  );
};

export default ActionsCellReviews;
