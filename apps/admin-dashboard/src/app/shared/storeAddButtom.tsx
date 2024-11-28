'use client';

import dynamic from 'next/dynamic';
import { Button } from 'rizzui';
import cn from '@utils/class-names';
import { PiArrowLineDownBold } from 'react-icons/pi';
import { PiPlusBold } from 'react-icons/pi';
import { useModal } from '@/app/shared/modal-views/use-modal';
import StoresForm from '../components/stores/StoresForm/StoresForm';
const FileUpload = dynamic(() => import('@/app/shared/file-upload'), {
  ssr: false,
});

type AddButtonProps = {
  title?: string;
  modalBtnLabel?: string;
  className?: string;
  buttonLabel?: string;
  lang?: string;
  onSuccess?: () => void;
};

export default function AddStoreButton({
  title,
  modalBtnLabel = 'Add Store',
  className,
  buttonLabel = 'Add Store',
  lang,
  onSuccess,
}: React.PropsWithChildren<AddButtonProps>) {
  const { openModal } = useModal();

  return (
    <Button
      onClick={() =>
        openModal({
          view: (
            <StoresForm
              title={title}
              modalBtnLabel={modalBtnLabel}
              lang={lang!}
              onSuccess={onSuccess}
            />
          ),
          customSize: '480px',
        })
      }
      className={cn('w-auto', className)}
    >
      <PiPlusBold className="me-1.5 h-[17px] w-[17px]" />
      {buttonLabel}
    </Button>
  );
}
