"use client";

import useSWR from "swr";
import { columns } from "./table/columns";
import { DataTable } from "./table/data-table";
import { fetcher } from "@/lib/fetcher";
import { toast } from "sonner";
import { Trade } from "@/actions/trades/trades";
import React, { useEffect } from "react";
import { SectionCards } from "./components/section-cards";
import { useTradeUIStore } from "@/stores/trade-ui-store";

export default function TradeDashboard() {
  const { data: trades, error } = useSWR<Trade[]>("/trade/", fetcher);
  const { data: accounts } = useSWR("/account/", fetcher);
  const filter = useTradeUIStore((s) => s.filter);
  const setFilter = useTradeUIStore((s) => s.setFilter);

  if (error) toast.error("Failed to load trades");

  useEffect(() => {
    setFilter(undefined);
  }, [setFilter]);

  const filteredTrades = React.useMemo(() => {
    if (!trades) return [];
    if (!filter) return trades;
    return trades.filter(
      (trade) =>
        trade.side === filter ||
        trade.planId === filter ||
        trade.accountId === filter
    );
  }, [trades, filter]);

  const stats = React.useMemo(() => {
    const all = filteredTrades;
    if (!all || all.length === 0 || !accounts) {
      return {
        expectancy: 0,
        totalTrades: 0,
        totalWinRate: 0,
        pnlratio: 0,
        avgGrade: 0,
      };
    }

    // Create a map of accountId -> isCommissionsIncluded
    const accountCommissionMap = new Map(
      accounts.map((acc: { id: string; isCommissionsIncluded?: boolean }) => [acc.id, acc.isCommissionsIncluded])
    );

    // Helper function to get adjusted realized value
    const getAdjustedRealized = (trade: Trade) => {
      const isCommissionsIncluded = accountCommissionMap.get(trade.accountId);
      const realized = Number(trade.realized);
      const fees = Number(trade.fees) || 0;

      // If isCommissionsIncluded is true, subtract fees from realized
      return isCommissionsIncluded ? realized - fees : realized;
    };

    const totalTrades = all.length;
    const winners = all.filter((t) => getAdjustedRealized(t) > 0);
    const losers = all.filter((t) => getAdjustedRealized(t) < 0);
    const winRate = totalTrades > 0 ? winners.length / totalTrades : 0;

    const avgWin =
      winners.reduce((acc, t) => acc + getAdjustedRealized(t), 0) /
      (winners.length || 1);
    const avgLoss =
      losers.reduce((acc, t) => acc + Math.abs(getAdjustedRealized(t)), 0) /
      (losers.length || 1);

    const pnlratio = avgWin / (avgLoss || 1);

    const expectancy = (winRate * avgWin) - ((1 - winRate) * avgLoss);

    const gradeValues = all
      .map((t) => Number(t.grade))
      .filter((g) => !isNaN(g) && g >= 0 && g <= 5);

    const avgGrade =
      gradeValues.length > 0
        ? gradeValues.reduce((sum, g) => sum + g, 0) / gradeValues.length
        : 0;

    return {
      expectancy,
      totalTrades,
      totalWinRate: winRate * 100,
      pnlratio,
      avgGrade,
    };
  }, [filteredTrades, accounts]);

  return (
    <>
      <SectionCards data={stats} />
      <div className="container mx-auto px-4 lg:px-6">
        <DataTable columns={columns} data={filteredTrades || []} />
      </div>
    </>
  );
}
