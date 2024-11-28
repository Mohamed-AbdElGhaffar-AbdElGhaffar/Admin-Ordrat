import Link from 'next/link';
import { routes } from '@/config/routes';
import EyeIcon from '@components/icons/eye';
import { Accounts } from '@/data/tan-table-data';
import DateCell from '@ui/date-cell';
import PencilIcon from '@components/icons/pencil';
import AvatarCard from '@ui/avatar-card';
import DeletePopover from '@/app/shared/delete-popover';
import { createColumnHelper } from '@tanstack/react-table';
import { ActionIcon, Badge, Checkbox, Text, Tooltip } from 'rizzui';
import ActionsCellStores from '@/app/components/stores/actionsCellReviews/ActionsCellStores';
import SelectInputAdminActive from '@/app/components/selectInputTable/SelectInputAdminActive';
import ActionsCellAccounts from '@/app/components/accounts/actionsCellAccounts/ActionsCellAccounts';

const columnHelper = createColumnHelper<Accounts>();

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
  columnHelper.accessor('email', {
    id: 'email',
    size: 180,
    header: lang === 'ar' ? 'البريد الالكتروني' : 'Email',
    cell: ({ row }) => (
      <Text className="font-lexend text-sm font-medium text-gray-900 dark:text-gray-700">
        {row.original.email}
      </Text>
    ),
  }),
  columnHelper.accessor('activated', {
    id: 'activated',
    size: 120,
    header: lang === 'ar' ? 'مفعل' : 'Activated',
    cell: ({ row }) => (
      <>
        <SelectInputAdminActive
          lang={lang}
          selectItem={row.original.activated}
          selectItemId={row.original.id}
          rowData={{
            id: row.original.id,
            firstName: row.original.name.split(' ')[1] || '',
            lastName: row.original.name.split(' ')[1] || '',
            phoneNumber: row.original.phoneNumber,
            email: row.original.email,
          }}
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
    cell: ({ row }) => <ActionsCellAccounts row={row} lang={lang}/>,
  })
];
