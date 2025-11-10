"use client";
import { SectionCards } from "@/components/section-cards";
import React from "react";
import useSWR from "swr";
import { Trade } from "@/actions/trades/trades";
import { fetcher } from "@/lib/fetcher";
import { Account } from "@/actions/accounts/account";
import { MonthCalendar } from "./components/PnLmonth";
import { DataTable } from "./table/data-table";
import { columns } from "./table/columns";
import { Card, CardContent } from "@/components/ui/card";

export default function MainDashboard() {
  const { data: trades } = useSWR<Trade[]>("/trade/", fetcher);
  const { data: accounts } = useSWR<Account[]>("/account/", fetcher);

  // Helper function to get adjusted realized value
  const getAdjustedRealized = React.useCallback((trade: Trade) => {
    if (!accounts) return Number(trade.realized);

    const account = accounts.find(acc => acc.id === trade.accountId);
    const isCommissionsIncluded = account?.isCommissionsIncluded || false;
    const realized = Number(trade.realized);
    const fees = Number(trade.fees) || 0;

    return isCommissionsIncluded ? realized - fees : realized;
  }, [accounts]);

  // Overall Revenue (all time)
  const totalRevenue = trades
    ?.reduce((acc, trade) => acc + getAdjustedRealized(trade), 0) ?? 0;

  const totalTrades = trades?.length ?? 0;
  const winningTrades = trades?.filter((t) => getAdjustedRealized(t) > 0) ?? [];
  const losingTrades = trades?.filter((t) => getAdjustedRealized(t) < 0) ?? [];

  const totalWinners = winningTrades.length;
  const winRate = totalTrades > 0 ? totalWinners / totalTrades : 0;

  const averageWin =
    winningTrades.reduce((acc, t) => acc + getAdjustedRealized(t), 0) /
    (winningTrades.length || 1);
  const averageLoss =
    losingTrades.reduce((acc, t) => acc + Math.abs(getAdjustedRealized(t)), 0) /
    (losingTrades.length || 1);

  // const expectancy =
  //   winRate * averageWin - (1 - winRate) * averageLoss;

  const pnlratio = averageWin / (averageLoss || 1);

  // Overall Expectancy
  const expectancy = (winRate * averageWin) - ((1 - winRate) * averageLoss);

  return (
    <div>
      <SectionCards
        data={{
          totalRevenue,
          totalWinRate: winRate * 100,
          totalTrades,
          expectancy,
          pnlratio,
        }}
      />
      <div className="py-4 px-4 lg:px-6">
        <MonthCalendar trades={trades} />
      </div>
      <div className="py-4 px-4 lg:px-6">
        <Card>
          <CardContent>
            <DataTable columns={columns} data={accounts || []} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
