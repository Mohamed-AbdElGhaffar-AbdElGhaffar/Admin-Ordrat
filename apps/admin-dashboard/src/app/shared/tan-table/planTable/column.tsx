import Link from 'next/link';
import { routes } from '@/config/routes';
import EyeIcon from '@components/icons/eye';
import { Person } from '@/data/tan-table-data';
import DateCell from '@ui/date-cell';
import PencilIcon from '@components/icons/pencil';
import AvatarCard from '@ui/avatar-card';
import DeletePopover from '@/app/shared/delete-popover';
import { createColumnHelper } from '@tanstack/react-table';
import { ActionIcon, Badge, Checkbox, Text, Tooltip } from 'rizzui';
import ActionsCellPlan from '@/app/components/plan/actionsCellPlan/ActionsCellPlan';

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

const columnHelper = createColumnHelper<Person>();

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
    header: lang === 'ar' ? 'اسم الخطة' : 'Plan Name',
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
  columnHelper.accessor('egpMonthlyPlanPrice', {
    id: 'egpMonthlyPlanPrice',
    size: 240,
    header: lang === 'ar' ? 'السعر الشهري المصري' : 'Egyptian Monthly Price',
    cell: ({ row }) => (
      <Text className="font-lexend text-sm font-medium text-gray-900 dark:text-gray-700">
        {row.original.egpMonthlyPlanPrice}
      </Text>
    ),
  }),
  columnHelper.accessor('egpAnnualPlanPrice', {
    id: 'egpAnnualPlanPrice',
    size: 240,
    header: lang === 'ar' ? 'السعر السنوي المصري' : 'Egyptian Annual Price',
    // filterFn: 'createdDate' as any,
    cell: ({ row }) => (
      <Text className="font-lexend text-sm font-medium text-gray-900 dark:text-gray-700">
        {row.original.egpAnnualPlanPrice}
      </Text>
    ),
  }),
  columnHelper.accessor('usdMonthlyPlanPrice', {
    id: 'usdMonthlyPlanPrice',
    size: 240,
    header: lang === 'ar' ? 'السعر الشهري بالدولار' : 'Monthly Price in Dollars',
    cell: ({ row }) => (
      <Text className="font-lexend text-sm font-medium text-gray-900 dark:text-gray-700">
        {row.original.usdMonthlyPlanPrice}
      </Text>
    ),
  }),
  columnHelper.accessor('usdAnnualPlanPrice', {
    id: 'usdAnnualPlanPrice',
    size: 240,
    header: lang === 'ar' ? 'السعر السنوي بالدولار' : 'Annual Price in Dollars',
    // filterFn: 'createdDate' as any,
    cell: ({ row }) => (
      <Text className="font-lexend text-sm font-medium text-gray-900 dark:text-gray-700">
        {row.original.usdAnnualPlanPrice}
      </Text>
    ),
  }),
  columnHelper.accessor('sarMonthlyPlanPrice', {
    id: 'sarMonthlyPlanPrice',
    size: 240,
    header: lang === 'ar' ? 'السعر الشهري السعودي' : 'Saudi Monthly Price',
    cell: ({ row }) => (
      <Text className="font-lexend text-sm font-medium text-gray-900 dark:text-gray-700">
        {row.original.sarMonthlyPlanPrice}
      </Text>
    ),
  }),
  columnHelper.accessor('sarAnnualPlanPrice', {
    id: 'sarAnnualPlanPrice',
    size: 240,
    header: lang === 'ar' ? 'السعر السنوي السعودي' : 'Saudi Annual Price',
    // filterFn: 'createdDate' as any,
    cell: ({ row }) => (
      <Text className="font-lexend text-sm font-medium text-gray-900 dark:text-gray-700">
        {row.original.sarAnnualPlanPrice}
      </Text>
    ),
  }),
  columnHelper.accessor('kwdMonthlyPlanPrice', {
    id: 'kwdMonthlyPlanPrice',
    size: 240,
    header: lang === 'ar' ? 'السعر الشهري الكويتي' : 'Kuwaiti Monthly Price',
    cell: ({ row }) => (
      <Text className="font-lexend text-sm font-medium text-gray-900 dark:text-gray-700">
        {row.original.kwdMonthlyPlanPrice}
      </Text>
    ),
  }),
  columnHelper.accessor('kwdAnnualPlanPrice', {
    id: 'kwdAnnualPlanPrice',
    size: 240,
    header: lang === 'ar' ? 'السعر السنوي الكويتي' : 'Kuwaiti Annual Price',
    // filterFn: 'createdDate' as any,
    cell: ({ row }) => (
      <Text className="font-lexend text-sm font-medium text-gray-900 dark:text-gray-700">
        {row.original.kwdAnnualPlanPrice}
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
    cell: ({ row }) => <ActionsCellPlan row={row} lang={lang}/>,
  })
];
