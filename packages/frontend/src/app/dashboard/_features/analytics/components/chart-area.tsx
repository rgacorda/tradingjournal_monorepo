"use client";

import * as React from "react";
import { AreaChart, Area, CartesianGrid, XAxis, YAxis } from "recharts";
import useSWR from "swr";
import { fetcher } from "@/lib/fetcher";
import { Trade } from "@/actions/trades/trades";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardAction,
} from "@/components/ui/card";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

export function ChartAreaInteractive() {
  const isMobile = useIsMobile();
  const { data: trades } = useSWR<Trade[]>("/trade/", fetcher);
  const { data: accounts } = useSWR("/account/", fetcher);
  const [timeRange, setTimeRange] = React.useState("90d");

  // Helper function to get adjusted realized value
  const getAdjustedRealized = React.useCallback((trade: Trade) => {
    if (!accounts) return Number(trade.realized);

    const account = accounts.find((acc: { id: string; isCommissionsIncluded?: boolean }) => acc.id === trade.accountId);
    const isCommissionsIncluded = account?.isCommissionsIncluded || false;
    const realized = Number(trade.realized);
    const fees = Number(trade.fees) || 0;

    return isCommissionsIncluded ? realized - fees : realized;
  }, [accounts]);

  // Group and sum realized per day
  const groupedData = React.useMemo(() => {
    if (!trades || !accounts) return [];

    const map = new Map<string, number>();
    for (const trade of trades) {
      // Use the date string directly (no need to convert since it's already YYYY-MM-DD)
      const dateKey = trade.date;
      map.set(dateKey, (map.get(dateKey) || 0) + getAdjustedRealized(trade));
    }

    // Convert to cumulative sorted list
    const sortedDates = Array.from(map.entries()).sort(([a], [b]) =>
      a.localeCompare(b)
    );

    let cumulative = 0;
    return sortedDates.map(([date, realized]) => {
      cumulative += realized;
      return { date, cumulative };
    });
  }, [trades, accounts, getAdjustedRealized]);

  const filteredData = React.useMemo(() => {
    const reference = new Date();
    let days = 90;
    if (timeRange === "30d") days = 30;
    if (timeRange === "365d") days = 365;

    const start = new Date(reference);
    start.setDate(reference.getDate() - days);

    return groupedData.filter((item) => new Date(item.date) >= start);
  }, [groupedData, timeRange]);

  return (
    <Card className="@container/card">
      <CardHeader>
        <CardTitle>Cumulative Revenue</CardTitle>
        <CardDescription>
          {timeRange === "365d"
            ? "Total for the last 1 year"
            : timeRange === "90d"
            ? "Total for the last 3 months"
            : "Total for the last 30 days"}
        </CardDescription>
        <CardAction>
          <ToggleGroup
            type="single"
            value={timeRange}
            onValueChange={setTimeRange}
            variant="outline"
            className="hidden @[767px]/card:flex"
          >
            <ToggleGroupItem value="365d">1 year</ToggleGroupItem>
            <ToggleGroupItem value="90d">3 months</ToggleGroupItem>
            <ToggleGroupItem value="30d">30 days</ToggleGroupItem>
          </ToggleGroup>
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="flex w-40 @[767px]/card:hidden" size="sm">
              <SelectValue placeholder="Time Range" />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              <SelectItem value="365d">1 year</SelectItem>
              <SelectItem value="90d">3 months</SelectItem>
              <SelectItem value="30d">30 days</SelectItem>
            </SelectContent>
          </Select>
        </CardAction>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        {filteredData.length === 0 ? (
          <div className="h-[250px] flex items-center justify-center text-muted-foreground text-sm">
            No trade data available for this time range.
          </div>
        ) : (
          <ChartContainer
            config={{
              cumulative: {
                label: "Cumulative Realized",
                color: "var(--primary)",
              },
            }}
            className="h-[250px] w-full"
          >
            <AreaChart data={filteredData}>
              <defs>
                <linearGradient id="fillCumulative" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor="var(--color-cumulative)"
                    stopOpacity={1}
                  />
                  <stop
                    offset="95%"
                    stopColor="var(--color-cumulative)"
                    stopOpacity={0.1}
                  />
                </linearGradient>
              </defs>
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="date"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                minTickGap={32}
                tickFormatter={(value) =>
                  new Date(value).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  })
                }
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                tickCount={4}
              />
              <ChartTooltip
                cursor={false}
                defaultIndex={isMobile ? -1 : 10}
                content={
                  <ChartTooltipContent
                    labelFormatter={(value) =>
                      new Date(value).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      })
                    }
                    indicator="dot"
                  />
                }
              />
              <Area
                dataKey="cumulative"
                type="monotone"
                fill="url(#fillCumulative)"
                stroke="var(--color-cumulative)"
                strokeWidth={2}
              />
            </AreaChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  );
}
