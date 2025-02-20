import { Article } from '@/data/tan-table-data';
import { createColumnHelper } from '@tanstack/react-table';
import { Text } from 'rizzui';
import AvatarCard from '@ui/avatar-card';
import ActionsCellFAQ from '@/app/components/faq/actionsCellFAQ/ActionsCellFAQ';
import DateCell from '@ui/date-cell';
import ActionsCellArticle from '@/app/components/article/actionsCellArticle/ActionsCellArticle';

const columnHelper = createColumnHelper<Article>();

export const defaultColumns = (lang: string) => [
  columnHelper.accessor('title', {
    id: 'title',
    size: 240,
    header: lang === 'ar' ? 'الاسم' : 'Name',
    cell: ({ row }) => (
      <AvatarCard
        src={row.original.imageUrl}
        name={row.original.title}
        description={``}
      />
    ),
    enableSorting: false,
  }),
  columnHelper.accessor('description', {
    id: 'description',
    size: 280,
    header: lang === 'ar' ? 'الوصف' : 'Description',
    cell: ({ row }) => (
      <Text className="text-center font-lexend text-sm font-medium text-gray-900 dark:text-gray-700">
        {row.original.description}
      </Text>
    ),
  }),
  columnHelper.accessor('metaDescription', {
    id: 'metaDescription',
    size: 240,
    header: lang === 'ar' ? "الوصف التعريفي" : 'Meta Description',
    cell: ({ row }) => (
      <Text className="font-lexend text-sm font-medium text-gray-900 dark:text-gray-700">
        {row.original.metaDescription}
      </Text>
    ),
  }),
  columnHelper.accessor('slug', {
    id: 'slug',
    size: 110,
    header: lang === 'ar' ? 'slug' : 'Slug',
    cell: ({ row }) => (
      <Text className="font-lexend text-sm font-medium text-gray-900 dark:text-gray-700">
        {row.original.slug}
      </Text>
    ),
  }),
  columnHelper.accessor('tags', {
    id: 'tags',
    size: 110,
    header: lang === 'ar' ? 'العلامات' : 'Tags',
    cell: ({ row }) => (
      <Text className="font-lexend text-sm font-medium text-gray-900 dark:text-gray-700">
        {row.original.tags}
      </Text>
    ),
  }),
  columnHelper.accessor('createdAt', {
    id: 'createdAt',
    size: 200,
    header: lang === 'ar' ? 'تاريخ الإنشاء' : 'Created Date',
    cell: ({ row }) => <DateCell date={new Date(row.original.createdAt)} lang={lang} />,
  }),
  columnHelper.accessor('lastUpdatedAt', {
    id: 'lastUpdatedAt',
    size: 240,
    header: lang === 'ar' ? "تاريخ آخر تحديث" : 'last Updated Date',
    cell: ({ row }) => <DateCell date={new Date(row.original.lastUpdatedAt)} lang={lang} />,
  }),
  columnHelper.accessor('userName', {
    id: 'userName',
    size: 160,
    header: '',
    enablePinning: true,
    enableSorting: false,
    cell: ({ row }) => <ActionsCellArticle row={row} lang={lang}/>,
  })
];
