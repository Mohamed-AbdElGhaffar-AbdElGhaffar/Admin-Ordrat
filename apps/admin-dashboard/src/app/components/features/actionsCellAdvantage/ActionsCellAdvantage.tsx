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
import toast from 'react-hot-toast';
import { API_BASE_URL } from '@/config/base-url';
import { useFileContext } from '../../context/FileContext';
import UpdateAdvantageForm from '../updateAdvantageForm/UpdateAdvantageForm';
interface FeatureRow {
  id: string;
  name: string;
  description: string;
}
interface ActionsCellProps {
  row: { original: FeatureRow };
  lang:string;
  view?:boolean;
}

const ActionsCellAdvantage: React.FC<ActionsCellProps> = ({ row, lang, view = false }) => {
    // console.log("row: ",row);
    
  const { openModal } = useModal();
  const { setUpdateData } = useFileContext();

  const handleOpenModal = async () => {
    openModal({
      view: <UpdateAdvantageForm lang={lang} featureId={row.original.id} />,
      customSize: '480px',
    });
  };

  const handleOpenDetailsModal = async () => {
    openModal({
      view: <UpdateAdvantageForm lang={lang} title={`معلومات الميزة`} featureId={row.original.id} />,
      customSize: '800px',
    });
  };

  const handleDeleteFeature = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/Feature/Delete/${row.original.id}`, {
        method: 'DELETE',
        headers: {
          Accept: '*/*',
        },
      });

      if (response.ok) {
        setUpdateData(true);
        toast.success(lang === 'ar' ? 'تم حذف الميزة بنجاح!' : 'Feature deleted successfully!');
      } else {
        toast.error(lang === 'ar' ? 'حدث خطأ أثناء الحذف' : 'An error occurred while deleting the feature');
      }
    } catch (error) {
      console.error('Error deleting feature:', error);
      toast.error(lang === 'ar' ? 'حدث خطأ أثناء الحذف' : 'An error occurred while deleting the feature');
    }
  };

  return (
    <div className="flex items-center justify-end gap-3 pe-3">
      <Tooltip
        size="sm"
        content={lang === 'ar' ? 'تعديل الميزة' : 'Edit Feature'}
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
          content={lang === 'ar' ? 'عرض الميزة' : 'View Feature'}
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
        title={lang === 'ar' ? 'حذف الميزة' : 'Delete the Feature'}
        description={
          lang === 'ar' 
            ? `هل أنت متأكد أنك تريد حذف ${row.original.name}؟`
            : `Are you sure you want to delete this ${row.original.name}?`
        }
        onDelete={handleDeleteFeature}
      />
    </div>
  );
};

export default ActionsCellAdvantage;
