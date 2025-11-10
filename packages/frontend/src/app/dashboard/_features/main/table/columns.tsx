"use client";

import { Account } from "@/actions/accounts/account";
import { Trade } from "@/actions/trades/trades";
import { Button } from "@/components/ui/button";
import { fetcher } from "@/lib/fetcher";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, TrendingDown, TrendingUp } from "lucide-react";
import React from "react";
import useSWR from "swr";

const LiveValueCell: React.FC<{ balance: number, account: Account }> = ({ balance, account }) => {
  const { data: trades } = useSWR<Trade[]>("/trade/", fetcher);

  // Helper to get adjusted realized based on commission setting
  const getAdjustedRealized = (trade: Trade) => {
    const realized = Number(trade.realized);
    const fees = Number(trade.fees) || 0;
    return account.isCommissionsIncluded ? realized - fees : realized;
  };

  const totalRealized =
    trades
      ?.filter(trade => trade.accountId === account.id)
      .reduce((sum, trade) => sum + getAdjustedRealized(trade), 0) || 0;

  const combined = balance + totalRealized;

  const formatted = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    signDisplay: "auto",
  }).format(combined);

  const isUp = combined > balance;
  const isNegative = combined < 0;

  if (combined === balance) {
    return (
      <div className={`font-medium ${isNegative ? "text-red-600" : ""}`}>
        {formatted}
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2 font-medium">
      <span className={isUp ? "text-green-600" : "text-red-600"}>
        {formatted}
      </span>
      {isUp ? (
        <TrendingUp className="w-4 h-4 text-green-600" />
      ) : (
        <TrendingDown className="w-4 h-4 text-red-600" />
      )}
    </div>
  );
};

export const columns: ColumnDef<Account>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => (
      <Button
        variant="ghost"
        className="flex items-center justify-start"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Account Name
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => (
      <div className="flex items-center justify-start">
        {row.getValue("name")}
      </div>
    ),
  },
  {
    accessorKey: "balance",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Initial Value
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
      const balance = parseFloat(row.getValue("balance")) || 0;

      const formatted = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(balance);

      return <div className="font-medium">{formatted}</div>;
    },
  },
  {
    id: "status",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Live Value
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    // ✅ use React component for hook-safe usage
    cell: ({ row }) => {
      const balance = parseFloat(row.getValue("balance")) || 0;
      const account = row.original;
      return <LiveValueCell balance={balance} account={account} />;
    },
  },
];
