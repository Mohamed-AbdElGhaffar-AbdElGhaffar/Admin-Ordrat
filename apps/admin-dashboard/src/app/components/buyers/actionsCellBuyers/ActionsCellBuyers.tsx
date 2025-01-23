// components/ActionsCell.tsx
import React, { useState } from 'react';
import Link from 'next/link';
import { routes } from '@/config/routes';
import { ActionIcon, Tooltip } from 'rizzui';
import { useModal } from '@/app/shared/modal-views/use-modal';
import PencilIcon from '@components/icons/pencil';
import EyeIcon from '@components/icons/eye';
// import UpdatePlanForm from '../updatePlanForm/UpdatePlanForm';
// import UpdatePlanForm from '../updateGuestForm/UpdateGuestForm';
// import GuestDetailsModal from '../guestDetailsModal/GuestDetailsModal';
import DeletePopover from '@/app/shared/delete-popover';
import ViewBuyersForm from '../viewBuyersForm/ViewBuyersForm';
import { useFileContext } from '../../context/FileContext';
import { API_BASE_URL } from '@/config/base-url';
import toast from 'react-hot-toast';

type GuestData = {
  id: string;
  name: string;
  totalItems: number;
  totalPaid: string;
  email: string;
  phoneNumber: string;
  country: string;
  state: string;
  city: string;
};

interface ActionsCellProps {
  row: { original: { id: string; name: string; }; id: string };
  lang:string;
  view?:boolean;
}

const ActionsCellBuyers: React.FC<ActionsCellProps> = ({ row, lang, view = false }) => {
    const title= lang === 'ar' ? 'معلومات الشتري' : 'Buyers Information';

    const [guestData, setGuestData] = useState<GuestData | null>(null);
    const [loading, setLoading] = useState(false);
    const { openModal } = useModal();
    const { setUpdateBuyers } = useFileContext();

    const fetchGuestData = async (id: string) => {
      setLoading(true);
      try {
        const response = await fetch(`${API_BASE_URL}/api/EndUser/GetById/${id}`, {
          method: 'GET',
          headers: {
            Accept: '*/*',
            'Accept-Language': lang,
          },
        });
  
        if (response.ok) {
          const data = await response.json();
          const transformedData: GuestData = {
            id,
            name: `${data.firstName} ${data.lastName}`,
            totalItems: data.totalPurchasedProducts || 0,
            totalPaid: `${data.totalProfit || 0} ${lang === 'ar' ? 'جنيه' : 'EGP'}`,
            email: data.email || '',
            phoneNumber: data.phoneNumber || '',
            country: lang === 'ar' ? 'مصر' : 'Egypt',
            state: lang === 'ar' ? 'القاهرة' : 'Cairo',
            city: lang === 'ar' ? 'مدينة نصر' : 'Nasr City',
          };
  
          setGuestData(transformedData);
        } else {
          toast.error(lang === 'ar' ? 'فشل في تحميل بيانات المشتري' : 'Failed to load buyer data');
        }
      } catch (error) {
        console.error('Error fetching guest data:', error);
        toast.error(lang === 'ar' ? 'حدث خطأ أثناء تحميل البيانات' : 'An error occurred while fetching the buyer data');
      } finally {
        setLoading(false);
      }
    };
  

    const handleOpenDetailsModal = () => {
        // await fetchGuestData(row.original.id);
        openModal({
          view: <ViewBuyersForm lang={lang} title={title} planId={row.original.id}/>,
          customSize: '800px',
        });
    };


    const handleDeleteBuyer = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/EndUser/Delete/${row.original.id}`, {
          method: 'DELETE',
          headers: {
            Accept: '*/*',
          },
        });
  
        if (response.ok) {
          setUpdateBuyers(true);
          toast.success(lang === 'ar' ? 'تم حذف المشتري بنجاح!' : 'Buyer deleted successfully!');
        } else {
          toast.error(lang === 'ar' ? 'حدث خطأ أثناء الحذف' : 'An error occurred while deleting the buyer');
        }
      } catch (error) {
        console.error('Error deleting feature:', error);
        toast.error(lang === 'ar' ? 'حدث خطأ أثناء الحذف' : 'An error occurred while deleting the buyer');
      }
    };
  return (
    <div className="flex items-center justify-end gap-3 pe-3">
      <Tooltip
        size="sm"
        content={lang === 'ar' ? 'عرض المشتري' : 'View Buyer'}
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
      <DeletePopover
        title={lang === 'ar' ? 'حذف المشتري' : 'Delete the Buyer'}
        description={
          lang === 'ar' 
            ? `هل أنت متأكد أنك تريد حذف ${row.original.name?row.original.name:'المشتري'}؟`
            : `Are you sure you want to delete this ${row.original.name} Buyer?`
        }
        onDelete={handleDeleteBuyer}
      />
    </div>
  );
};

export default ActionsCellBuyers;
