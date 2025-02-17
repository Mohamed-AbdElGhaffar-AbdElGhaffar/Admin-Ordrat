'use client';
import StatusField from '@/app/shared/controlled-table/status-field';
import { Badge, Text, Button } from 'rizzui';
import { transactionTypes } from '@/data/transaction-history';
import { PiTrashDuotone } from 'react-icons/pi';
import { useState } from 'react';

const transactionTypesOptions = Object.entries(transactionTypes).map(
  ([value, label]) => ({ label, value })
);

const statusOptions = [
  {
    value: 'complete',
    label: 'Complete',
  },
  {
    value: 'pending',
    label: 'Pending',
  },
  {
    value: 'canceled',
    label: 'Canceled',
  },
];

type FilterElementProps = {
  isFiltered: boolean;
  filters: { [key: string]: any };
  updateFilter: (columnId: string, filterValue: string | any[]) => void;
  handleReset: () => void;
  lang?: string;
};
export default function FilterElement({
  isFiltered,
  filters,
  updateFilter,
  handleReset,
  lang='en',
}: FilterElementProps) {
  const text = {
    selectPlan: lang === 'ar' ? 'اختر الخطة' : 'Select plan',
    selectStatus: lang === 'ar' ? 'اختر الحالة' : 'Select status',
    clear: lang === 'ar' ? 'حذف' : 'Clear',
  };
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const plansOptions = [
    {
      value: 'basic',
      label: lang ==='ar'? 'الخطة الاساسية':'Basic Plan',
    },
    {
      value: 'advanced',
      label: lang ==='ar'? 'خطة متقدمة':'Advanced Plan',
    },
    {
      value: 'VIP',
      label: lang ==='ar'? 'خطة مميزة':'VIP Plan',
    },
  ];
  return (
    <div className="flex w-full flex-col items-center gap-3 md:flex-row md:w-auto @[57rem]:-ms-4">
      <div className="flex w-full flex-col gap-3  md:flex-row md:w-auto">
        <StatusField
          dropdownClassName="!z-10"
          className="w-full min-w-[158px] md:w-auto"
          placeholder={text.selectPlan}
          options={plansOptions}
          value={selectedPlan}
          onChange={(value: string) => {
            setSelectedPlan(value);
          }}
          getOptionValue={(option: { value: any }) => option.value}
          displayValue={(selected: string) =>
            plansOptions.find((option) => option.value === selected)
              ?.label ?? ''
          }
          placement="bottom-start"
        />
        <StatusField
          dropdownClassName="!z-10"
          className="w-full min-w-[145px] @[42rem]:w-auto"
          placeholder={text.selectStatus}
          options={statusOptions}
          value={filters['status']}
          onChange={(value: string) => {
            updateFilter('status', value);
          }}
          getOptionValue={(option: { value: any }) => option.value}
          getOptionDisplayValue={(option: { value: any }) =>
            renderOptionDisplayValue(option.value as string)
          }
          displayValue={(selected: string) =>
            renderOptionDisplayValue(selected)
          }
        />
      </div>
      {isFiltered ? (
        <Button
          size="sm"
          onClick={() => {
            handleReset();
          }}
          className="h-8 bg-gray-200/70"
          variant="flat"
        >
          <PiTrashDuotone className="me-1.5 h-[17px] w-[17px]" /> {text.clear}
        </Button>
      ) : null}
    </div>
  );
}

function renderOptionDisplayValue(value: string) {
  switch (value.toLowerCase()) {
    case 'pending':
      return (
        <div className="flex items-center">
          <Badge color="warning" renderAsDot />
          <Text className="ms-2 font-medium capitalize text-orange-dark">
            {value}
          </Text>
        </div>
      );
    case 'complete':
      return (
        <div className="flex items-center">
          <Badge color="success" renderAsDot />
          <Text className="ms-2 font-medium capitalize text-green-dark">
            {value}
          </Text>
        </div>
      );
    case 'canceled':
      return (
        <div className="flex items-center">
          <Badge color="danger" renderAsDot />
          <Text className="ms-2 font-medium capitalize text-green-dark">
            {value}
          </Text>
        </div>
      );
    default:
      return (
        <div className="flex items-center">
          <Badge renderAsDot className="bg-gray-400" />
          <Text className="ms-2 font-medium capitalize text-gray-600">
            {value}
          </Text>
        </div>
      );
  }
}
