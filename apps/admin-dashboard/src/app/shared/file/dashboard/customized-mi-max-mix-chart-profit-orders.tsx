"use client";

import WidgetCard from "@components/cards/widget-card";
import {
  Area,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ComposedChart,
  ResponsiveContainer,
} from "recharts";
import { Badge } from "rizzui";
import cn from "@utils/class-names";
import { useMedia } from "@hooks/use-media";
import { CustomYAxisTick } from "@components/charts/custom-yaxis-tick";
import { CustomTooltip } from "@components/charts/custom-tooltip";
import ButtonGroupAction from "@components/charts/button-group-action";
import SimpleBar from "@ui/simplebar";
import { useTranslation } from "@/app/i18n/client";

const data = [
  {
    month: "Jan",
    Orders: 5000,
    Users: 1600,
    Profits: 4000,
  },
  {
    month: "Feb",
    Orders: 8500,
    Users: 2000,
    Profits: 5798,
  },
  {
    month: "Mar",
    Orders: 7000,
    Users: 3000,
    Profits: 8300,
  },
  {
    month: "Apr",
    Orders: 5780,
    Users: 3908,
    Profits: 6798,
  },
  {
    month: "May",
    Orders: 4890,
    Users: 2500,
    Profits: 5000,
  },
  {
    month: "Jun",
    Orders: 8000,
    Users: 3200,
    Profits: 7800,
  },
  {
    month: "Jul",
    Orders: 4890,
    Users: 2500,
    Profits: 8500,
  },
  {
    month: "Aug",
    Orders: 3780,
    Users: 3908,
    Profits: 9908,
  },
  {
    month: "Sep",
    Orders: 7800,
    Users: 2800,
    Profits: 8500,
  },
  {
    month: "Oct",
    Orders: 5780,
    Users: 1908,
    Profits: 7208,
  },
  {
    month: "Nov",
    Orders: 4780,
    Users: 1908,
    Profits: 4908,
  },
  {
    month: "Dec",
    Orders: 7500,
    Users: 3000,
    Profits: 9000,
  },
];

const filterOptions = ["Week", "Month", "Year"];

export default function CustomizedMixChart({
  className,
  lang,
}: {
  className?: string;
  lang?: string;
}) {
  const { t } = useTranslation(lang!);
  const isMediumScreen = useMedia("(max-width: 1200px)", false);
  const isTablet = useMedia("(max-width: 800px)", false);
  function handleFilterBy(data: string) {
    console.log("Audience Metrics Filter:", data);
  }

  return (
    <WidgetCard
      title={t("text-customized-mix-chart")}
      description={
        <>
          <Badge
            renderAsDot
            className="me-0.5 bg-[#eab308] dark:bg-[#7c88b2]"
          />{" "}
          {t("text-users")}
          <Badge renderAsDot className="me-0.5 ms-4 bg-[#5a5fd7]" />{" "}
          {t("text-new-users")}
          <Badge renderAsDot className="me-0.5 ms-4 bg-[#10b981]" />{" "}
          {t("text-sessions")}
        </>
      }
      descriptionClassName="text-gray-500 mt-1.5 mb-3 @lg:mb-0"
      action={
        <ButtonGroupAction
          options={filterOptions}
          onChange={(data) => handleFilterBy(data)}
          className="-ms-2 mb-3 @lg:mb-0 @lg:ms-0"
        />
      }
      headerClassName="flex-col @lg:flex-row"
      rounded="lg"
      className={className}
    >
      <SimpleBar>
        <div className={cn("h-[420px] w-full pt-9 @7xl:h-[480px]")}>
          <ResponsiveContainer
            width="100%"
            {...(isTablet && { minWidth: "700px" })}
            height="100%"
          >
            <ComposedChart
              data={data}
              barSize={isMediumScreen ? 20 : 28}
              className="[&_.recharts-cartesian-axis-tick-value]:fill-gray-500  [&_.recharts-cartesian-axis.yAxis]:-translate-y-3 rtl:[&_.recharts-cartesian-axis.yAxis]:-translate-x-12"
            >
              <defs>
                <linearGradient id="analyticsArea" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor="#F0F1FF"
                    className=" [stop-opacity:0.2]"
                  />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="month" axisLine={false} tickLine={false} />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={<CustomYAxisTick />}
              />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="step"
                dataKey="Profits"
                stroke="#10b981"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#analyticsArea)"
              />
              <Bar
                dataKey="Orders"
                fill="#5a5fd7"
                {...(isTablet
                  ? { stackId: "userMetrics" }
                  : { radius: [4, 4, 0, 0] })}
              />
              <Bar
                dataKey="Users"
                fill="#eab308"
                radius={[4, 4, 0, 0]}
                {...(isTablet && { stackId: "userMetrics" })}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </SimpleBar>
    </WidgetCard>
  );
}
