'use client';

import dynamic from 'next/dynamic';
import { Button } from 'rizzui';
import cn from '@utils/class-names';
import { PiArrowLineDownBold } from 'react-icons/pi';
import { PiPlusBold } from 'react-icons/pi';
import { useModal } from '@/app/shared/modal-views/use-modal';
import PlanForm from '../components/plan/planForm/PlanForm';
// import AdvantageForm from '../components/AdvantageForm/AdvantageForm';
// import PlanForm from '../components/planForm/PlanForm';
const FileUpload = dynamic(() => import('@/app/shared/file-upload'), {
  ssr: false,
});

type AddReviewsButtonProps = {
  title?: string;
  modalBtnLabel?: string;
  className?: string;
  buttonLabel?: string;
  lang?: string;
  onSuccess?: () => void;
};

export default function AddReviewsButton({
  title,
  modalBtnLabel = 'Add Plan',
  className,
  buttonLabel = 'Add Plan',
  lang,
  onSuccess,
}: React.PropsWithChildren<AddReviewsButtonProps>) {
  const { openModal } = useModal();

  return (
    <Button
      onClick={() =>
        openModal({
          view: (
            <PlanForm
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
