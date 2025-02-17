// components/ActionsCell.tsx
import React from 'react';
import Link from 'next/link';
import { routes } from '@/config/routes';
import { ActionIcon, Tooltip } from 'rizzui';
import { useModal } from '@/app/shared/modal-views/use-modal';
import PencilIcon from '@components/icons/pencil';
import EyeIcon from '@components/icons/eye';
// import UpdatePlanForm from '../updateGuestForm/UpdateGuestForm';
// import GuestDetailsModal from '../guestDetailsModal/GuestDetailsModal';
import DeletePopover from '@/app/shared/delete-popover';
import { API_BASE_URL } from '@/config/base-url';
import toast from 'react-hot-toast';
import { useFileContext } from '../../context/FileContext';
import UpdatePlanForm from '../updatePlanForm/UpdatePlanForm';

interface ActionsCellProps {
  row: { original: { id: string; name: string; }; id: string };
  lang:string;
  view?:boolean; 
}

const ActionsCellPlan: React.FC<ActionsCellProps> = ({ row, lang, view = false }) => {
    // console.log("row: ",row);
    
  const { openModal } = useModal();
  const { setUpdateData } = useFileContext();

  const handleOpenModal = () => {
    openModal({
      view: <UpdatePlanForm lang={lang} planId={row.original.id}  />,
      customSize: '700px',
    });
  };

  const handleOpenDetailsModal = () => {
    openModal({
      view: <UpdatePlanForm lang={lang} title={`معلومات الخطة`} planId={row.original.id} />,
      customSize: '700px',
    });
  };

  const handleDeletePlan = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/Plan/Delete/${row.original.id}`, {
        method: 'DELETE',
        headers: {
          Accept: '*/*',
        },
      });

      if (response.ok) {
        setUpdateData(true);
        toast.success(lang === 'ar' ? 'تم حذف الخطة بنجاح!' : 'Plan deleted successfully!');
      } else {
        toast.error(lang === 'ar' ? 'حدث خطأ أثناء الحذف' : 'An error occurred while deleting the plan');
      }
    } catch (error) {
      console.error('Error deleting feature:', error);
      toast.error(lang === 'ar' ? 'حدث خطأ أثناء الحذف' : 'An error occurred while deleting the plan');
    }
  };

  return (
    <div className="flex items-center justify-end gap-3 pe-3">
      <Tooltip
        size="sm"
        content={lang === 'ar' ? 'تعديل الخطة' : 'Edit Plan'}
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
          content={lang === 'ar' ? 'عرض الخطة' : 'View Plan'}
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
        title={lang === 'ar' ? 'حذف الخطة' : 'Delete the Plan'}
        description={
          lang === 'ar' 
            ? `هل أنت متأكد أنك تريد حذف  ${row.original.name?row.original.name:'هذه الخطة'}؟`
            : `Are you sure you want to delete this ${row.original.name?row.original.name:'Plan'}?`
        }
        onDelete={handleDeletePlan}
      />
    </div>
  );
};

export default ActionsCellPlan;
