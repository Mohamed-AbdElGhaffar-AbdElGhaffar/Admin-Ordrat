import Link from 'next/link';
import { routes } from '@/config/routes';
import EyeIcon from '@components/icons/eye';
import { Person, Reviews } from '@/data/tan-table-data';
import DateCell from '@ui/date-cell';
import PencilIcon from '@components/icons/pencil';
import AvatarCard from '@ui/avatar-card';
import DeletePopover from '@/app/shared/delete-popover';
import { createColumnHelper } from '@tanstack/react-table';
import { ActionIcon, Badge, Checkbox, Text, Tooltip } from 'rizzui';
import ActionsCellReviews from '@/app/components/reviews/actionsCellReviews/ActionsCellReviews';

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

const columnHelper = createColumnHelper<Reviews>();

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
  // columnHelper.accessor('email', {
  //   id: 'email',
  //   size: 240,
  //   header: lang === 'ar' ? 'البريد الالكتروني' : 'Email',
  //   cell: ({ row }) => (
  //     <Text className="font-lexend text-sm font-medium text-gray-900 dark:text-gray-700">
  //       {row.original.email}
  //     </Text>
  //   ),
  // }),
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
  columnHelper.accessor('evaluation', {
    id: 'evaluation',
    size: 240,
    header: lang === 'ar' ? 'التقييم' : 'Evaluation',
    cell: ({ row }) => (
      <Text className="font-lexend text-sm font-medium text-gray-900 dark:text-gray-700">
        {row.original.evaluation}
      </Text>
    ),
  }),
  columnHelper.accessor('comment', {
    id: 'comment',
    size: 240,
    header: lang === 'ar' ? 'التعليق' : 'Comment',
    cell: ({ row }) => (
      <Text className="font-lexend text-sm font-medium text-gray-900 dark:text-gray-700">
        {row.original.comment}
      </Text>
    ),
  }),
  columnHelper.accessor('createdAt', {
    id: 'createdAt',
    size: 200,
    header: lang === 'ar' ? 'تاريخ الإنشاء' : 'Created Date',
    cell: ({ row }) => <DateCell date={new Date(row.original.createdAt)} lang={lang} />,
  }),
  columnHelper.accessor('userName', {
    id: 'userName',
    size: 160,
    header: '',
    enablePinning: true,
    enableSorting: false,
    cell: ({ row }) => <ActionsCellReviews row={row} lang={lang}/>,
  })
];
