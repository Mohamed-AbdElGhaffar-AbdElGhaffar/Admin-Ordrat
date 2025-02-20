import React from 'react';
import { ActionIcon, Tooltip } from 'rizzui';
import { useModal } from '@/app/shared/modal-views/use-modal';
import PencilIcon from '@components/icons/pencil';
import DeletePopover from '@/app/shared/delete-popover';
import { API_BASE_URL } from '@/config/base-url';
import toast from 'react-hot-toast';
import { useFileContext } from '../../context/FileContext';
import UpdateArticleForm from '../UpdateArticleForm/UpdateArticleForm';

interface ActionsCellProps {
  row: any ;
  lang:string;
  view?:boolean; 
}

const ActionsCellArticle: React.FC<ActionsCellProps> = ({ row, lang, view = false }) => {    
  const { openModal } = useModal();
  const { setUpdateArticle } = useFileContext();  

  const handleOpenModal = () => {
    openModal({
      view: <UpdateArticleForm lang={lang} row={row.original} onSuccess={()=>setUpdateArticle(true)}/>,
      customSize: '700px',
    });
  };

  const handleDeleteFAQ = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/Article/Delete/${row.original.id}`, {
        method: 'DELETE',
        headers: {
          Accept: '*/*',
        },
      });

      if (response.ok) {
        setUpdateArticle(true);
        toast.success(lang === 'ar' ? 'تم حذف المقالة بنجاح!' : 'Article deleted successfully!');
      } else {
        toast.error(lang === 'ar' ? 'حدث خطأ أثناء الحذف' : 'An error occurred while deleting the Article');
      }
    } catch (error) {
      console.error('Error deleting feature:', error);
      toast.error(lang === 'ar' ? 'حدث خطأ أثناء الحذف' : 'An error occurred while deleting the Article');
    }
  };

  return (
    <div className="flex items-center justify-end gap-3 pe-3">
      <Tooltip
        size="sm"
        content={lang === 'ar' ? 'تعديل المقالة' : 'Edit Article'}
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
      <DeletePopover
        title={lang === 'ar' ? 'حذف المقالة' : 'Delete Article'}
        description={
          lang === 'ar' 
            ? `هل أنت متأكد أنك تريد حذف  (${row.original.title?row.original.title:'المقالة هذه '})؟`
            : `Are you sure you want to delete this (${row.original.title?row.original.title:'Article '})?`
        }
        onDelete={handleDeleteFAQ}
      />
    </div>
  );
};

export default ActionsCellArticle;
