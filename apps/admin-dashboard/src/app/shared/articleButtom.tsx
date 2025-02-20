'use client';

import dynamic from 'next/dynamic';
import { Button } from 'rizzui';
import cn from '@utils/class-names';
import { PiPlusBold } from 'react-icons/pi';
import { useModal } from '@/app/shared/modal-views/use-modal';
import AddArticleForm from '../components/article/AddArticleForm/AddArticleForm';
const FileUpload = dynamic(() => import('@/app/shared/file-upload'), {
  ssr: false,
});

type AddButtonProps = {
  className?: string;
  buttonLabel?: string;
  lang?: string;
  onSuccess?: () => void;
};

export default function ArticleAddButton({
  className,
  buttonLabel = 'Add Article',
  lang,
  onSuccess,
}: React.PropsWithChildren<AddButtonProps>) {
  const { openModal } = useModal();
  return (
    <Button
      onClick={() =>
        openModal({
          view: (
            <AddArticleForm title={lang === 'ar' ? "المقالة" : "Article"} lang={lang!} onSuccess={onSuccess} />
          ),
          customSize: '700px',
        })
      }
      className={cn('w-auto', className)}
    >
      <PiPlusBold className="me-0 sm:me-1.5 h-[17px] w-[17px]" />
      <span className='hidden sm:block'>{buttonLabel}</span>
    </Button>
  );
}
