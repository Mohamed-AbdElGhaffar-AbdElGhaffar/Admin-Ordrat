import Link from 'next/link';
import { routes } from '@/config/routes';
import EyeIcon from '@components/icons/eye';
import { Traders } from '@/data/tan-table-data';
import DateCell from '@ui/date-cell';
import PencilIcon from '@components/icons/pencil';
import AvatarCard from '@ui/avatar-card';
import DeletePopover from '@/app/shared/delete-popover';
import { createColumnHelper } from '@tanstack/react-table';
import { ActionIcon, Badge, Checkbox, Text, Tooltip } from 'rizzui';
import SelectInputAdminActive from '@/app/components/selectInputTable/SelectInputAdminActive';
import SelectInputTraderStatusActive from '@/app/components/selectInputTable/SelectInputTraderStatusActive';
import SelectInputTraderActivated from '@/app/components/selectInputTable/SelectInputTraderActivated';
import ActionsCellTraders from '@/app/components/traders/actionsCellTraders/ActionsCellTraders';

const columnHelper = createColumnHelper<Traders>();
const avatar = 'https://isomorphic-furyroad.s3.amazonaws.com/public/avatars/avatar-01.webp'
export const defaultColumns = (lang: string) => [
  columnHelper.accessor('id', {
    id: 'id',
    size: 60,
    header: ({ table }) => (
      <Checkbox
        aria-label="Select all rows"
        checked={table.getIsAllPageRowsSelected()}
        onChange={() => table.toggleAllPageRowsSelected()}
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        aria-label="Select row"
        checked={row.getIsSelected()}
        onChange={() => row.toggleSelected()}
      />
    ),
    enableSorting: false,
  }),
  columnHelper.accessor('name', {
    id: 'name',
    size: 260,
    header: lang === 'ar' ? 'الاسم' : 'Name',
    cell: ({ row }) => (
      <AvatarCard
        src={avatar}
        name={row.original.name}
        description={row.original.id}
      />
    ),
    enableSorting: false,
  }),
  columnHelper.accessor('email', {
    id: 'email',
    size: 200,
    header: lang === 'ar' ? 'بريد التاجر الالكتروني' : 'Trader Email',
    cell: ({ row }) => (
      <>
        <Text className="font-lexend text-sm font-medium text-gray-900 dark:text-gray-700">
          {row.original.email}
        </Text>
      </>
    ),
  }),
  columnHelper.accessor('TotalSales', {
    id: 'TotalSales',
    size: 160,
    header: lang === 'ar' ? 'اجمالي المبيعات' : 'Total Sales',
    cell: ({ row }) => (
      <Text className="font-lexend text-sm font-medium text-gray-900 dark:text-gray-700">
        {row.original.TotalSales}
      </Text>
    ),
  }),
  columnHelper.accessor('country', {
    id: 'country',
    size: 120,
    header: lang === 'ar' ? 'البلد' : 'Country',
    cell: ({ row }) => (
      <Text className="font-lexend text-sm font-medium text-gray-900 dark:text-gray-700">
        {row.original.country}
      </Text>
    ),
  }),
  columnHelper.accessor('activated', {
    id: 'activated',
    size: 120,
    header: lang === 'ar' ? 'مفعل' : 'Activated',
    cell: ({ row }) => (
      <>
        <SelectInputTraderActivated
          lang={lang}
          selectItem={row.original.activated}
        />
      </>
    ),
  }),
  columnHelper.accessor('userName', {
    id: 'userName',
    size: 240,
    header: '',
    enablePinning: true,
    enableSorting: false,
    cell: ({ row }) => <ActionsCellTraders row={row} lang={lang}/>,
  })
];
