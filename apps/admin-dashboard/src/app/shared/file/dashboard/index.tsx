"use client";

import StorageReport from "@/app/shared/file/dashboard/storage-report";
import FileStats from "@/app/shared/file/dashboard/file-stats";
import StorageSummary from "@/app/shared/file/dashboard/storage-summary";
import RecentFiles from "@/app/shared/file/dashboard/recent-files";
import QuickAccess from "@/app/shared/file/dashboard/quick-access";
import ActivityReport from "@/app/shared/file/dashboard/activity-report";
import Members from "@/app/shared/file/dashboard/members";
import FileListTable from "@/app/shared/file/dashboard/file-list/table";
import BestTraderTable from "@/app/shared/file/dashboard/best-trader/table";
import UpgradeStorage from "@/app/shared/file/dashboard/upgrade-storage";
import RecentActivities from "@/app/shared/file/dashboard/recent-activities";
import MetricCardsWithIcon from '@/app/shared/support/dashboard/dashboard-statistics';
import AppointmentStats from "@/app/shared/support/dashboard/appointment-stats";

import SimpleLineChart from '@/app/shared/chart-widgets/simple-line-chart';
import CustomizedDotLineChart from '@/app/shared/chart-widgets/customized-dot-line-chart';
import SimpleBarChart from '@/app/shared/chart-widgets/simple-bar-chart';
import MixBarChart from '@/app/shared/chart-widgets/mix-bar-chart';
import CustomShapeBarChart from '@/app/shared/chart-widgets/custom-shape-bar-chart';
import BrushBarChart from '@/app/shared/chart-widgets/brush-bar-chart';
import SimpleAreaChart from '@/app/shared/chart-widgets/simple-area-chart';
import StackedAreaChart from '@/app/shared/chart-widgets/stacked-area-chart';
import SimpleRadarChart from '@/app/shared/chart-widgets/simple-radar-chart';
import RadialBarChart from '@/app/shared/chart-widgets/radial-bar-chart';
import CustomizedMixChart from "./customized-mi-max-mix-chart-profit-orders";
import BestSellingStores from "./best-selling-stores";
import ProfitsAccordingGeographical from "./profits-according-to-geographical-regions";
import PlansChart from "./plans-chart";
import PlanRadialBarChart from "../plan-radial-bar-chart";
// import CustomizedMixChart from '@/app/shared/chart-widgets/customized-mix-chart';

import Department from '@/app/shared/appointment/dashboard/department';
import Patients from '@/app/shared/appointment/dashboard/patients';
import TotalAppointment from "../../appointment/dashboard/total-appointment";
import AppointmentDiseases from "../../appointment/dashboard/appointment-diseases";

export default function FileDashboard({ lang }: { lang?: string }) {
  return (
    <div className="@container">
      <AppointmentStats className="col-span-full mb-5 2xl:mb-8" lang={lang} />
      <div className="grid grid-cols-12 gap-6 @container @[59rem]:gap-7 mt-5 2xl:mt-8">
        <TotalAppointment className="col-span-full @[59rem]:col-span-6 @[90rem]:col-span-7 @[90rem]:col-start-auto @[90rem]:row-start-auto" />
        <AppointmentDiseases className="col-span-full @[59rem]:col-span-6 @[90rem]:col-span-5" />
        <Patients className="col-span-full @[59rem]:col-span-6" lang={lang!} />
        <Department className="col-span-full @[59rem]:col-span-6" lang={lang!} />
      </div>
      <div className="grid grid-cols-1 gap-6 @container lg:grid-cols-12 2xl:gap-8 mt-5 2xl:mt-8">
        <div className="col-span-full flex flex-col gap-6">
          <BestTraderTable lang={lang} />
        </div>
      </div>
    </div>
  );
}
