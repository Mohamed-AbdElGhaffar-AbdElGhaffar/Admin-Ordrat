'use client';
// components/ActionsCell.tsx
import React, { useState } from 'react';
import Link from 'next/link';
import { routes } from '@/config/routes';
import { ActionIcon, Tooltip, Button } from 'rizzui';
import { useModal } from '@/app/shared/modal-views/use-modal';
import PencilIcon from '@components/icons/pencil';
import EyeIcon from '@components/icons/eye';
// import UpdatePlanForm from '../updateGuestForm/UpdateGuestForm';
// import GuestDetailsModal from '../guestDetailsModal/GuestDetailsModal';
import DeletePopover from '@/app/shared/delete-popover';
import UpdateTradersForm from '../updatePlanForm/UpdateTradersForm';
import { PiWarningBold, PiXBold, PiDoorBold } from 'react-icons/pi';
import { useFileContext } from '../../context/FileContext';
import { API_BASE_URL } from '@/config/base-url';
import toast from 'react-hot-toast';
import WarnForm from '../warnForm/WarnForm';

interface ActionsCellProps {
  row: { original: { id: string; name: string; }; id: string };
  lang:string;
  view?:boolean;
}

const ActionsCellTraders: React.FC<ActionsCellProps> = ({ row, lang, view = false }) => {
    // console.log("row: ",row);
    
  const { openModal } = useModal();
  const [isBanned, setIsBanned] = useState(false);
  const [warnCount, setWarnCount] = useState(0);
  const { setUpdateSeller } = useFileContext();

  const handleOpenModal = () => {
    openModal({
      view: <UpdateTradersForm lang={lang} traderId={row.original.id} />,
      customSize: '480px',
    });
  };

  const handleOpenDetailsModal = () => {
    openModal({
      view: <UpdateTradersForm lang={lang} title={`معلومات التاجر`} traderId={row.original.id} />,
      customSize: '800px',
    });
  };

  const toggleBan = () => {
    setIsBanned(!isBanned);
  };

  const incrementWarnCount = () => {
    setWarnCount(warnCount + 1);
  };

  const handleWarnModal = () => {
    openModal({
      // view: <UpdateTradersForm lang={lang} traderId={row.original.id} />,
      view: <WarnForm lang={lang} title={lang == "ar"? "إنذار" : "Warn"} onSuccess={incrementWarnCount} />,
      customSize: '480px',
    });
  };

  const handleDeleteSeller = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/Seller/Delete/${row.original.id}`, {
        method: 'DELETE',
        headers: {
          Accept: '*/*',
        },
      });

      if (response.ok) {
        setUpdateSeller(true);
        toast.success(lang === 'ar' ? 'تم حذف التاجر بنجاح!' : 'Seller deleted successfully!');
      } else {
        toast.error(lang === 'ar' ? 'حدث خطأ أثناء الحذف' : 'An error occurred while deleting the Seller');
      }
    } catch (error) {
      console.error('Error deleting feature:', error);
      toast.error(lang === 'ar' ? 'حدث خطأ أثناء الحذف' : 'An error occurred while deleting the Seller');
    }
  };

  return (
    <div className="flex items-center justify-end gap-3 pe-3">
      <Tooltip
        size="sm"
        content={isBanned ? (lang === 'ar' ? 'إلغاء الحظر' : 'Unban') : (lang === 'ar' ? 'حظر' : 'Ban')}
        placement="top"
        color="invert"
      >
        <Button
          variant="solid"
          onClick={toggleBan}
          className={`flex items-center gap-1 ${isBanned ? 'bg-gray-400 hover:bg-gray-500' : 'bg-red-500'}`}
          style={{ width: '28px', height: '28px', padding: 0 }}
        >
          <PiXBold className="h-4 w-4" />
          {/* {isBanned ? (lang === 'ar' ? 'غير محظور' : 'Not Banned') : (lang === 'ar' ? 'محظور' : 'Banned')} */}
        </Button>
      </Tooltip>

      <Tooltip
        size="sm"
        content={lang === 'ar' ? 'تحذير' : 'Warn'}
        placement="top"
        color="invert"
      >
        <Button
          variant="solid"
          onClick={handleWarnModal}
          className="flex items-center gap-1 bg-yellow-400 hover:bg-yellow-500"
          style={{ height: '28px', padding: "0 5px" }}
        >
          <PiWarningBold className="h-4 w-4" />
          ({warnCount})
        </Button>
      </Tooltip>
      <Tooltip
        size="sm"
        content={lang === 'ar' ? 'دخول' : 'Enter'}
        placement="top"
        color="invert"
      >
        <Link href="/" passHref>
          <Button
            variant="solid"
            className="flex items-center justify-center gap-1 bg-blue-500 hover:bg-blue-600"
            style={{ width: '28px', height: '28px', padding: 0 }}
          >
            <PiDoorBold className="h-4 w-4 text-white" />
          </Button>
        </Link>
      </Tooltip>
      <Tooltip
        size="sm"
        content={lang === 'ar' ? 'تعديل التاجر' : 'Edit Trader'}
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
          content={lang === 'ar' ? 'عرض التاجر' : 'View Trader'}
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
        title={lang === 'ar' ? 'حذف التاجر' : 'Delete the Trader'}
        description={
          lang === 'ar' 
            ? `هل أنت متأكد أنك تريد حذف ${row.original.name}؟`
            : `Are you sure you want to delete this ${row.original.name}?`
        }
        onDelete={handleDeleteSeller}
      />
    </div>
  );
};

export default ActionsCellTraders;
