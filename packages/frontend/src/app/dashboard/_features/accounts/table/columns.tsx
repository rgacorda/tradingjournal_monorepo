"use client";

import { Account, updateAccount } from "@/actions/accounts/account";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAccountUIStore } from "@/stores/account-ui-store";
import { ColumnDef, Row } from "@tanstack/react-table";
import { MoreHorizontal, ArrowUpDown } from "lucide-react";
import React from "react";
import { toast } from "sonner";
import { mutate } from "swr";

// ✅ Correct type: row is Row<Account>
const ActionsCell: React.FC<{ row: Row<Account> }> = ({ row }) => {
  const account = row.original; // Extract actual account data

  const setEditOpen = useAccountUIStore((s) => s.setEditOpen);
  const setDeleteOpen = useAccountUIStore((s) => s.setDeleteOpen);
  const setSelectedAccountId = useAccountUIStore((s) => s.setSelectedAccountId);

  const handleEdit = () => {
    setEditOpen(true);
    setSelectedAccountId(account.id || null);
  };

  const handleDelete = () => {
    setDeleteOpen(true);
    setSelectedAccountId(account.id || null);
  };

  const handleToggleAnalytics = async () => {
    try {
      await updateAccount(account.id || null, {
        isAnalyticsIncluded: !account.isAnalyticsIncluded,
      });
      mutate("/account/");
      toast.success(`Account ${account.isAnalyticsIncluded ? "excluded from" : "included in"} analytics.`);
    } catch {
      toast.error("Failed to update analytics status.");
    }
  };

  const handleToggleCommission = async () => {
    try {
      await updateAccount(account.id || null, {
        isCommissionsIncluded: !account.isCommissionsIncluded,
      });
      mutate("/account/");
      toast.success(`Commission ${account.isCommissionsIncluded ? "excluded from" : "included in"} statistics.`);
    } catch {
      toast.error("Failed to update commission status.");
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <span className="sr-only">Open menu</span>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Actions</DropdownMenuLabel>
        <DropdownMenuItem onClick={handleToggleAnalytics}>
          Toggle Analytics
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleToggleCommission}>
          Toggle Commission
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleEdit}>Edit Account</DropdownMenuItem>
        <DropdownMenuItem className="text-red-500" onClick={handleDelete}>
          Delete Account
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export const columns: ColumnDef<Account>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Account Name
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
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
      const amount = parseFloat(row.getValue("balance"));
      const formatted = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(amount);

      return <div className="font-medium">{formatted}</div>;
    },
  },
  {
    accessorKey: "isAnalyticsIncluded",
    header: "Analytics",
    cell: ({ row }) => {
      const isIncluded = row.getValue("isAnalyticsIncluded");
      return (
        <Badge
          variant={isIncluded ? "outline" : "destructive"}
          className="text-xs mr-1"
        >
          {isIncluded ? "Included" : "Excluded"}
        </Badge>
      );
    },
  },
  {
    accessorKey: "isCommissionsIncluded",
    header: "Commission",
    cell: ({ row }) => {
      const isIncluded = row.getValue("isCommissionsIncluded");
      return (
        <Badge
          variant={isIncluded ? "outline" : "secondary"}
          className="text-xs mr-1"
        >
          {isIncluded ? "Included" : "Excluded"}
        </Badge>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => <ActionsCell row={row} />,
  },
];
