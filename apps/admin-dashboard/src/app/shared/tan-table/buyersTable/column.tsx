import { Buyers } from '@/data/tan-table-data';
import { createColumnHelper } from '@tanstack/react-table';
import { Checkbox, Text } from 'rizzui';
import ActionsCellBuyers from '@/app/components/buyers/actionsCellBuyers/ActionsCellBuyers';

const columnHelper = createColumnHelper<Buyers>();

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
  columnHelper.accessor('phoneNumber', {
    id: 'phoneNumber',
    size: 160,
    header: lang === 'ar' ? 'رقم الهاتف' : 'Phone Number',
    cell: ({ row }) => (
      <Text className="font-lexend text-sm font-medium text-gray-900 dark:text-gray-700">
        {row.original.phoneNumber}
      </Text>
    ),
  }),
  columnHelper.accessor('joiningDate', {
    id: 'joiningDate',
    size: 240,
    header: lang === 'ar' ? 'تاريخ الانضمام' : 'Joining Date',
    cell: ({ row }) => (
      <Text className="font-lexend text-sm font-medium text-gray-900 dark:text-gray-700">
        {row.original.joiningDate}
      </Text>
    ),
  }),
  columnHelper.accessor('shop', {
    id: 'shop',
    size: 240,
    header: lang === 'ar' ? 'المتجر' : 'Shop',
    cell: ({ row }) => (
      <Text className="font-lexend text-sm font-medium text-gray-900 dark:text-gray-700">
        {row.original.shop}
      </Text>
    ),
  }),
  columnHelper.accessor('userName', {
    id: 'userName',
    size: 160,
    header: '',
    enablePinning: true,
    enableSorting: false,
    cell: ({ row }) => <ActionsCellBuyers row={row} lang={lang}/>,
  })
];
