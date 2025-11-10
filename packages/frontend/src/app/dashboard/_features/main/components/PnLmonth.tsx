"use client";

import { Trade } from "@/actions/trades/trades";
import { Account } from "@/actions/accounts/account";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  addDays,
  format,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  isSameMonth,
  isSameDay,
} from "date-fns";
import React, { useState } from "react";
import { parseDateOnly } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import useSWR from "swr";
import { fetcher } from "@/lib/fetcher";

export type Event = {
  id: string;
  title: string;
  date: string; // ISO string
};

type Props = {
  trades: Trade[] | undefined;
};

export const MonthCalendar: React.FC<Props> = ({ trades }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const { data: accounts } = useSWR<Account[]>("/account/", fetcher);

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart, { weekStartsOn: 0 });
  const endDate = endOfWeek(monthEnd, { weekStartsOn: 0 });



  // Helper to get adjusted realized based on commission setting
  const getAdjustedRealized = React.useCallback((trade: Trade) => {
    if (!accounts) return Number(trade.realized);

    const account = accounts.find(acc => acc.id === trade.accountId);
    const isCommissionsIncluded = account?.isCommissionsIncluded || false;
    const realized = Number(trade.realized);
    const fees = Number(trade.fees) || 0;

    return isCommissionsIncluded ? realized - fees : realized;
  }, [accounts]);

  // Group trades by date and summarize, but only for current month
  const events = React.useMemo(() => {
    if (!trades || !accounts) return [];

    const map = new Map<string, { count: number; realized: number }>();

    for (const trade of trades) {
      // Parse DATEONLY string correctly to avoid timezone shifts
      const tradeDate = parseDateOnly(trade.date);
      // Only include trades within the current month
      if (
        tradeDate.getFullYear() === currentMonth.getFullYear() &&
        tradeDate.getMonth() === currentMonth.getMonth()
      ) {
        // Use the original date string as the key (no conversion needed)
        const dateKey = trade.date;
        const current = map.get(dateKey) || { count: 0, realized: 0 };
        map.set(dateKey, {
          count: current.count + 1,
          realized: current.realized + getAdjustedRealized(trade),
        });
      }
    }

    return Array.from(map.entries()).map(([date, value]) => ({
      id: date,
      date,
      title: `${value.count} trade${
        value.count > 1 ? "s" : ""
      } | $${value.realized.toFixed(2)}`,
    }));
  }, [trades, currentMonth, accounts, getAdjustedRealized]);

  // Calendar rendering
  const rows = [];
  let days = [];
  let day = startDate;

  while (day <= endDate) {

    for (let i = 0; i < 7; i++) {
      const isCurrentMonth = isSameMonth(day, monthStart);
      const isToday = isSameDay(day, new Date());
      // Only show events for days in the current month
      const dayEvents = isCurrentMonth
        ? events.filter((event) => isSameDay(parseDateOnly(event.date), day))
        : [];
      const daySummary = dayEvents[0];
      const realizedAmount = daySummary
        ? parseFloat(daySummary.title.split("|")[1].replace("$", ""))
        : null;

      const cellBg =
        realizedAmount !== null
          ? realizedAmount >= 0
            ? "bg-green-50 text-green-900"
            : "bg-red-50 text-red-900"
          : isCurrentMonth
          ? "bg-white"
          : "bg-gray-100 text-gray-400";

      days.push(
        <div
          key={day.toString()}
          className={`
            h-32 p-2 border rounded-lg flex flex-col justify-between transition-all
            ${cellBg} ${isToday ? "ring-2 ring-primary" : ""}
          `}
        >
          {/* Top: Day number */}
          <div className="text-[11px] font-bold text-gray-700">
            {format(day, "d")}
          </div>

          {/* Bottom: Trade badge */}
          <div className="mt-auto">
            {dayEvents.map((event) => (
              <div
                key={event.id}
                className={`
                  text-[11px] font-medium text-center px-2 py-[2px] rounded-md 
                  ${
                    realizedAmount! >= 0
                      ? "bg-green-200 text-green-900"
                      : "bg-red-200 text-red-900"
                  }
                `}
              >
                {event.title}
              </div>
            ))}
          </div>
        </div>
      );

      day = addDays(day, 1);
    }

    rows.push(
      <div key={day.toString()} className="grid grid-cols-7 gap-1">
        {days}
      </div>
    );
    days = [];
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between w-full space-y-1.5">
          <div>
            <CardTitle>Month Calendar</CardTitle>
            <CardDescription>Daily Trades and PnL View</CardDescription>
          </div>
          <div className="flex items-center gap-2 w-auto">
            {/* Month Select */}
            <Select
              value={String(currentMonth.getMonth())}
              onValueChange={(month) => {
                setCurrentMonth(
                  new Date(currentMonth.getFullYear(), Number(month), 1)
                );
              }}
            >
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Month" />
              </SelectTrigger>
              <SelectContent>
                {Array.from({ length: 12 }).map((_, i) => (
                  <SelectItem key={i} value={String(i)}>
                    {format(new Date(2000, i, 1), "MMMM")}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {/* Year Select */}
            <Select
              value={String(currentMonth.getFullYear())}
              onValueChange={(year) => {
                setCurrentMonth(
                  new Date(Number(year), currentMonth.getMonth(), 1)
                );
              }}
            >
              <SelectTrigger className="w-24">
                <SelectValue placeholder="Year" />
              </SelectTrigger>
              <SelectContent>
                {Array.from({ length: 10 }).map((_, i) => {
                  const y = new Date().getFullYear() - 5 + i;
                  return (
                    <SelectItem key={y} value={String(y)}>
                      {y}
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          {/* Weekdays */}
          <div className="min-w-[1000px] w-fit mx-auto">
            <div className="grid grid-cols-7 bg-gray-200 text-center text-xs font-semibold rounded-t-md overflow-hidden">
              {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
                <div key={d} className="py-2 border">
                  {d}
                </div>
              ))}
            </div>

            {/* Calendar Body */}
            <div className="divide-y space-y-1">{rows}</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
