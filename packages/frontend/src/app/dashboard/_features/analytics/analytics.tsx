import React from "react";
import StatTable from "./components/statTable";
import { ChartAreaInteractive } from "./components/chart-area";
import MistakeAnalytics from "./components/mistakeAnalytics";

export default function AnalyticsDashboard() {
  return (
    <div className="container mx-auto px-6">
      <div className="mb-6">
        <ChartAreaInteractive />
      </div>
      <StatTable />
      <div className="mt-8">
        <MistakeAnalytics />
      </div>
      {/* <div className="grid grid-cols-2">
        <StatCharts />
        <StatCharts />
        <StatCharts />
        <StatCharts />
    </div> */}
    </div>
  );
}
