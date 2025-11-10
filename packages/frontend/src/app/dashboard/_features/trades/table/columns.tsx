"use client";

import { Trade, updateTrade } from "@/actions/trades/trades";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, MoreHorizontal } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectGroup, SelectLabel, SelectItem } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { toast } from "sonner";
import { mutate } from "swr";
import useSWR from "swr";
import { Plan } from "../../plans/plans";
import { fetcher } from "@/lib/fetcher";
import { useTradeUIStore } from "@/stores/trade-ui-store";
import { AxiosError } from "axios";
import React from "react";
import { parseDateOnly } from "@/lib/utils";

function PlanSelectCell({ trade }: { trade: Trade }) {
  const { data: plans } = useSWR<Plan[]>("/plan/", fetcher);

  return (
    <Select
      value={trade.planId}
      onValueChange={async (value) => {
        try {
          await updateTrade(trade.id, { ...trade, planId: value });
          mutate("/trade/");
          toast.success("Trade updated successfully.");
        } catch (error) {
          const axiosError = error as AxiosError<{ message?: string }>;
          toast.error(axiosError.response?.data?.message || "Failed to update trade.");
        }
      }}
    >
      <SelectTrigger className="w-[180px] border-none">
        <SelectValue placeholder="Select a plan" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Plans</SelectLabel>
          {plans?.map((plan) => (
            <SelectItem key={plan.id} value={plan.id}>
              {plan.name}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}

function MistakeCell({ trade }: { trade: Trade }) {
  const setEditOpen = useTradeUIStore((s) => s.setEditOpen);
  const setSelectedTradeId = useTradeUIStore((s) => s.setSelectedTradeId);

  const handleClick = () => {
    setSelectedTradeId(trade.id);
    setEditOpen(true);
  };

  if (trade.mistakes?.length > 0) {
    return (
      <>
        <Badge variant="outline" className="text-xs mr-1" onClick={handleClick}>
          {trade.mistakes[0]}
        </Badge>
        {trade.mistakes.length > 1 && (
          <Badge variant="outline" className="text-xs mr-1" onClick={handleClick}>
            +{trade.mistakes.length - 1}
          </Badge>
        )}
      </>
    );
  }

  return (
    <Badge variant="outline" className="text-xs" onClick={handleClick}>
      No mistakes
    </Badge>
  );
}

export const columns: ColumnDef<Trade>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && "indeterminate")}
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
  },
  {
    accessorKey: "date",
    header: ({ column }) => (
      <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
        Date
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
  const value = row.getValue("date") as string;
  // Parse DATEONLY string correctly to avoid timezone shifts
  return <div>{format(parseDateOnly(value), "MMM dd, yyyy")}</div>;
},
    sortingFn: (rowA, rowB, columnId) => {
      // Parse DATEONLY strings correctly for sorting
      const a = parseDateOnly(rowA.getValue(columnId) as string).getTime();
      const b = parseDateOnly(rowB.getValue(columnId) as string).getTime();
      return a - b;
    },
  },
  // {
  //   accessorKey: "time",
  //   header: "Time",
  // },
  {
    accessorKey: "ticker",
    header: "Ticker",
  },
  {
    accessorKey: "side",
    header: "Side",
    cell: ({ row }) => {
      const side = row.getValue("side") as string;
      const color = side.toLowerCase() === "long" ? "text-green-500" : "text-red-500";
      return <div className={color}>{side.charAt(0).toUpperCase() + side.slice(1)}</div>;
    },
  },
  {
    accessorKey: "quantity",
    header: "Quantity",
  },
  {
    accessorKey: "entry",
    header: "Entry",
  },
  {
    accessorKey: "exit",
    header: "Exit",
  },
  {
    accessorKey: "planId",
    header: "Setup",
    cell: ({ row }) => <PlanSelectCell trade={row.original} />,
  },
  {
    accessorKey: "grade",
    header: "Grade",
    cell: ({ row }) => (
      <Input
        type="number"
        className="h-8 w-16 border-transparent bg-transparent text-right shadow-none focus-visible:border"
        defaultValue={row.original.grade}
        min={0}
        max={5}
        onBlur={async (e) => {
          const newValue = Number(e.target.value);
          if (newValue !== row.original.grade) {
            try {
              await updateTrade(row.original.id, { ...row.original, grade: newValue });
              toast.success("Grade updated successfully.");
            } catch (error) {
              const axiosError = error as AxiosError<{ message?: string }>;
              toast.error(axiosError.response?.data?.message || "Failed to update grade.");
            }
          }
        }}
      />
    ),
  },
  {
    accessorKey: "mistakes",
    header: "Mistakes",
    cell: ({ row }) => <MistakeCell trade={row.original} />,
  },
  {
    accessorKey: "fees",
    header: "Fees",
    cell: ({ row }) => (
      <Input
        className="text-red-500 h-8 w-16 border-transparent bg-transparent text-right shadow-none"
        defaultValue={row.original.fees}
        onBlur={async (e) => {
          const newValue = parseFloat(e.target.value);
          if (!isNaN(newValue) && newValue !== row.original.fees) {
            try {
              await updateTrade(row.original.id, { ...row.original, fees: newValue });
              mutate("/trade/");
              toast.success("Fees updated successfully.");
            } catch (error) {
              const axiosError = error as AxiosError<{ message?: string }>;
              toast.error(axiosError.response?.data?.message || "Failed to update fees.");
            }
          }
        }}
      />
    ),
  },
  {
    accessorKey: "realized",
    header: () => <div className="text-right">Realized</div>,
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("realized"));
      const formatted = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(amount);
      const color = amount >= 0 ? "text-green-500" : "text-red-500";
      return <div className={`${color} text-right font-medium`}>{formatted}</div>;
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const trade = row.original;
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
            <DropdownMenuItem onClick={() => navigator.clipboard.writeText(trade.id)}>
              Copy Trade ID
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
