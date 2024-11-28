import Link from 'next/link';
import { routes } from '@/config/routes';
import EyeIcon from '@components/icons/eye';
import { Faq } from '@/data/tan-table-data';
import DateCell from '@ui/date-cell';
import PencilIcon from '@components/icons/pencil';
import AvatarCard from '@ui/avatar-card';
import DeletePopover from '@/app/shared/delete-popover';
import { createColumnHelper } from '@tanstack/react-table';
import { ActionIcon, Badge, Checkbox, Text, Tooltip } from 'rizzui';
import ActionsCellPlan from '@/app/components/plan/actionsCellPlan/ActionsCellPlan';
import Image from 'next/image';

const columnHelper = createColumnHelper<Faq>();

export const defaultColumns = (lang: string) => [
  columnHelper.accessor('name', {
    id: 'name',
    size: 240,
    header: lang === 'ar' ? 'اسم قسم الأسئلة' : 'FAQ Category Name',
    cell: ({ row }) => (
      <Text className="font-lexend text-sm font-medium text-gray-900 dark:text-gray-700">
        {row.original.name}
      </Text>
    ),
    enableSorting: false,
  }),
  columnHelper.accessor('image', {
    id: 'image',
    size: 200,
    header: lang === 'ar' ? 'صورة القسم' : 'Category Image',
    cell: ({ row }) => (
      <div className="flex h-28 w-28 items-center justify-center rounded-xl bg-gray-100">
          <Image
            src={row.original.image}
            className="aspect-square h-20 w-20"
            alt={"FAQ Category"}
            width={650}
            height={300}
          />
      </div>
    ),
  }),
  columnHelper.accessor('faqNumber', {
    id: 'faqNumber',
    size: 100,
    header: lang === 'ar' ? 'عدد الأسئلة' : 'FAQ Number',
    // filterFn: 'createdDate' as any,
    cell: ({ row }) => (
      <Text className="text-center font-lexend text-sm font-medium text-gray-900 dark:text-gray-700">
        {row.original.faqNumber}
      </Text>
    ),
  }),
  columnHelper.accessor('userName', {
    id: 'userName',
    size: 160,
    header: '',
    enablePinning: true,
    enableSorting: false,
    cell: ({ row }) => <ActionsCellPlan row={row} lang={lang}/>,
  })
];
