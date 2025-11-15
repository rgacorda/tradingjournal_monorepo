import React from "react";
import StatTable from "./components/statTable";
import { ChartAreaInteractive } from "./components/chart-area";
import MistakeAnalytics from "./components/mistakeAnalytics";
import MistakeInsights from "./components/mistakeInsights";

export default function AnalyticsDashboard() {
  return (
    <div className="container mx-auto px-6 space-y-6">
      <MistakeInsights />
      <ChartAreaInteractive />
      <StatTable />
      <MistakeAnalytics />
    </div>
  );
}
