'use client';
import {
  useDrawer,
  type DrawerPlacements,
} from '@/app/shared/drawer-views/use-drawer';
import { Button } from 'rizzui';
import cn from '@utils/class-names';
import { PiSliders } from 'react-icons/pi';

interface FiltersButtonProps {
  className?: string;
  modalView: React.ReactNode;
  placement: DrawerPlacements;
  lang:string;
}

export default function FiltersButton({
  className,
  placement,
  modalView,
  lang
}: FiltersButtonProps) {
  const { openDrawer } = useDrawer({lang});
  return (
    <Button
      className={cn(
        'mt-4 w-full cursor-pointer @lg:mt-0 @lg:w-auto',
        className
      )}
      onClick={() =>
        openDrawer({
          lang,
          view: modalView,
          placement,
        })
      }
    >
      <PiSliders className="me-1 h-4 w-4 rotate-90" />
      Filters
    </Button>
  );
}
