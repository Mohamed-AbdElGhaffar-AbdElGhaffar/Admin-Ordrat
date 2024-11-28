'use client';

import dynamic from 'next/dynamic';
import { Button } from 'rizzui';
import cn from '@utils/class-names';
import { PiArrowLineDownBold } from 'react-icons/pi';
import { PiPlusBold } from 'react-icons/pi';
import { useModal } from '@/app/shared/modal-views/use-modal';
import TradersForm from '../components/traders/TradersForm/TradersForm';
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

export default function AddTradersButton({
  title,
  modalBtnLabel = 'Add Traders',
  className,
  buttonLabel = 'Add Traders',
  lang,
  onSuccess,
}: React.PropsWithChildren<AddButtonProps>) {
  const { openModal } = useModal();

  return (
    <Button
      onClick={() =>
        openModal({
          view: (
            <TradersForm
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
