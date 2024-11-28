import Link from 'next/link';
import { routes } from '@/config/routes';
import EyeIcon from '@components/icons/eye';
import { Feature } from '@/data/tan-table-data';
import DateCell from '@ui/date-cell';
import PencilIcon from '@components/icons/pencil';
import AvatarCard from '@ui/avatar-card';
import DeletePopover from '@/app/shared/delete-popover';
import { createColumnHelper } from '@tanstack/react-table';
import { ActionIcon, Badge, Checkbox, Text, Tooltip } from 'rizzui';
import ActionsCellAdvantage from '@/app/components/features/actionsCellAdvantage/ActionsCellAdvantage';

// function getStatusBadge(status: string) {
//   switch (status?.toLowerCase()) {
//     case 'pending':
//       return (
//         <div className="flex items-center">
//           <Badge color="warning" renderAsDot />
//           <Text className="ms-2 font-medium text-orange-dark">{status}</Text>
//         </div>
//       );
//     case 'paid':
//       return (
//         <div className="flex items-center">
//           <Badge color="success" renderAsDot />
//           <Text className="ms-2 font-medium text-green-dark">{status}</Text>
//         </div>
//       );
//     case 'overdue':
//       return (
//         <div className="flex items-center">
//           <Badge color="danger" renderAsDot />
//           <Text className="ms-2 font-medium text-red-dark">{status}</Text>
//         </div>
//       );
//     default:
//       return (
//         <div className="flex items-center">
//           <Badge renderAsDot className="bg-gray-400" />
//           <Text className="ms-2 font-medium text-gray-600">{status}</Text>
//         </div>
//       );
//   }
// }

const columnHelper = createColumnHelper<Feature>();

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
    size: 300,
    header: lang === 'ar' ? 'اسم الميزة' : 'Feature Name',
    cell: ({ row }) => (
      // <AvatarCard
      //   src={row.original.avatar}
      //   name={row.original.name}
      //   description={`INV-${row.original.id}`}
      // />
      <Text className="font-lexend text-sm font-medium text-gray-900 dark:text-gray-700">
        {row.original.name}
      </Text>
    ),
    enableSorting: false,
  }),
  columnHelper.accessor('description', {
    id: 'description',
    size: 300,
    header: lang === 'ar' ? 'الوصف' : 'Description',
    // filterFn: 'createdDate' as any,
    cell: ({ row }) => (
      <Text className="font-lexend text-sm font-medium text-gray-900 dark:text-gray-700">
        {row.original.description}
      </Text>
    ),
  }),
  // columnHelper.accessor('dueDate', {
  //   id: 'dueDate',
  //   size: 200,
  //   header: 'Due Date',
  //   filterFn: 'dueDate' as any,
  //   cell: ({ row }) => <DateCell date={new Date(row.original.createdAt)} />,
  // }),
  // columnHelper.accessor('amount', {
  //   id: 'amount',
  //   size: 140,
  //   header: 'Amount',
  //   filterFn: 'priceFilter' as any,
  //   cell: ({ row }) => (
  //     <Text className="font-medium text-gray-700 dark:text-gray-600">
  //       ${row.original.amount}
  //     </Text>
  //   ),
  // }),
  // columnHelper.accessor('status', {
  //   id: 'status',
  //   size: 140,
  //   header: 'Status',
  //   filterFn: 'statusFilter' as any,
  //   cell: (info) => getStatusBadge(info.renderValue()!),
  // }),
  columnHelper.accessor('userName', {
    id: 'userName',
    size: 160,
    header: '',
    enablePinning: true,
    enableSorting: false,
    cell: ({ row }) => <ActionsCellAdvantage row={row} lang={lang}/>,
  })
];
