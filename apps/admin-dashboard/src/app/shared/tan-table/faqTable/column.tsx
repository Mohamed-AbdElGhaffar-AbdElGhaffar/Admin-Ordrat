import { Faq } from '@/data/tan-table-data';
import { createColumnHelper } from '@tanstack/react-table';
import { Text } from 'rizzui';
import Image from 'next/image';
import ActionsCellFAQ from '@/app/components/faq/actionsCellFAQ/ActionsCellFAQ';

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
    size: 140,
    header: lang === 'ar' ? 'عدد الأسئلة' : 'FAQ Number',
    cell: ({ row }) => (
      <Text className="text-center font-lexend text-sm font-medium text-gray-900 dark:text-gray-700">
        {row.original.faqNumber}
      </Text>
    ),
  }),
  columnHelper.accessor('title', {
    id: 'title',
    size: 200,
    header: lang === 'ar' ? 'عنوان' : 'Title',
    cell: ({ row }) => (
      <Text className="font-lexend text-sm font-medium text-gray-900 dark:text-gray-700">
        {row.original.title}
      </Text>
    ),
  }),
  columnHelper.accessor('metaDescription', {
    id: 'metaDescription',
    size: 240,
    header: lang === 'ar' ? 'وصف جوجل' : 'Meta Description',
    cell: ({ row }) => (
      <Text className="text-center font-lexend text-sm font-medium text-gray-900 dark:text-gray-700">
        {row.original.metaDescription}
      </Text>
    ),
  }),
  columnHelper.accessor('userName', {
    id: 'userName',
    size: 160,
    header: '',
    enablePinning: true,
    enableSorting: false,
    cell: ({ row }) => <ActionsCellFAQ row={row} lang={lang}/>,
  })
];
