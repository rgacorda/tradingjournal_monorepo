import React from "react";
import StatTable from "./components/statTable";
import { ChartAreaInteractive } from "./components/chart-area";
import MistakeAnalytics from "./components/mistakeAnalytics";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useAnalyticsUIStore } from "@/stores/analytics-ui-store";

export default function AnalyticsDashboard() {
  const limitFilter = useAnalyticsUIStore((s) => s.limitFilter);
  const setLimitFilter = useAnalyticsUIStore((s) => s.setLimitFilter);

  return (
    <div className="container mx-auto px-6 space-y-6">
      <div className="flex items-center gap-2">
        <Select
          value={limitFilter?.toString()}
          onValueChange={(value) =>
            setLimitFilter(value ? Number(value) : undefined)
          }
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="All Trades" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Limit Trades</SelectLabel>
              <SelectItem value="20">Last 20</SelectItem>
              <SelectItem value="50">Last 50</SelectItem>
              <SelectItem value="100">Last 100</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
        <Button variant="outline" onClick={() => setLimitFilter(undefined)}>
          Clear Filter
        </Button>
      </div>
      <ChartAreaInteractive />
      <StatTable />
      <MistakeAnalytics />
    </div>
  );
}
