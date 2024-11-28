import Link from 'next/link';
import { routes } from '@/config/routes';
import EyeIcon from '@components/icons/eye';
import { Stores } from '@/data/tan-table-data';
import DateCell from '@ui/date-cell';
import PencilIcon from '@components/icons/pencil';
import AvatarCard from '@ui/avatar-card';
import DeletePopover from '@/app/shared/delete-popover';
import { createColumnHelper } from '@tanstack/react-table';
import { ActionIcon, Badge, Checkbox, Text, Tooltip } from 'rizzui';
import ActionsCellStores from '@/app/components/stores/actionsCellReviews/ActionsCellStores';
import SelectInputTable from '@/app/components/selectInputTable/SelectInputBody';

const columnHelper = createColumnHelper<Stores>();

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
    size: 240,
    header: lang === 'ar' ? 'الاسم' : 'Name',
    cell: ({ row }) => (
      <Text className="font-lexend text-sm font-medium text-gray-900 dark:text-gray-700">
        {row.original.name}
      </Text>
    ),
    enableSorting: false,
  }),
  columnHelper.accessor('sellerName', {
    id: 'sellerName',
    size: 240,
    header: lang === 'ar' ? 'اسم التاجر' : 'Seller Name',
    cell: ({ row }) => (
      <Text className="font-lexend text-sm font-medium text-gray-900 dark:text-gray-700">
        {row.original.sellerName}
      </Text>
    ),
    enableSorting: false,
  }),
  columnHelper.accessor('storeStatus', {
    id: 'storeStatus',
    size: 160,
    header: lang === 'ar' ? 'حالة المتجر' : 'Store status',
    cell: ({ row }) => (
      <Text className="font-lexend text-sm font-medium text-gray-900 dark:text-gray-700">
        {row.original.storeStatus}
      </Text>
    ),
  }),
  columnHelper.accessor('totalSales', {
    id: 'totalSales',
    size: 180,
    header: lang === 'ar' ? 'اجمالي المبيعات' : 'Total sales',
    cell: ({ row }) => (
      <Text className="font-lexend text-sm font-medium text-gray-900 dark:text-gray-700">
        {row.original.totalSales}
      </Text>
    ),
  }),
  columnHelper.accessor('jointPlan', {
    id: 'jointPlan',
    size: 240,
    header: lang === 'ar' ? 'الخطة المشترك بها' : 'Joint plan',
    cell: ({ row }) => (
      <Text className="font-lexend text-sm font-medium text-gray-900 dark:text-gray-700">
        {row.original.jointPlan}
      </Text>
    ),
  }),
  columnHelper.accessor('activated', {
    id: 'activated',
    size: 120,
    header: lang === 'ar' ? 'مفعل' : 'Activated',
    cell: ({ row }) => (
      <>
        <SelectInputTable
          lang={lang}
          selectItem={row.original.activated}
          selectItemId={row.original.id}
        />
      </>
    ),
  }),
  columnHelper.accessor('userName', {
    id: 'userName',
    size: 160,
    header: '',
    enablePinning: true,
    enableSorting: false,
    cell: ({ row }) => <ActionsCellStores row={row} lang={lang}/>,
  })
];
