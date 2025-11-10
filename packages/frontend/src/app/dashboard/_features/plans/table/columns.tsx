"use client";

import { Plan } from "../plans";
import { ColumnDef, Row } from "@tanstack/react-table";
import { ArrowUpDown, MoreHorizontal } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import React from "react";
import { usePlanUIStore } from "@/stores/plan-ui-store";

const ActionsCell: React.FC<{ row: Row<Plan> }> = ({ row }) => {
  const plan = row.original;

  const setEditOpen = usePlanUIStore((s) => s.setEditOpen);
  const setDeleteOpen = usePlanUIStore((s) => s.setDeleteOpen);
  const setSelectedPlanId = usePlanUIStore((s) => s.setSelectedPlanId);

  const handleEdit = () => {
    setEditOpen(true);
    setSelectedPlanId(plan.id || null);
  };

  const handleDelete = () => {
    setDeleteOpen(true);
    setSelectedPlanId(plan.id || null);
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
        <DropdownMenuItem onClick={() => navigator.clipboard.writeText(plan.id)}>
          Copy Plan ID
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleEdit}>Edit Plan</DropdownMenuItem>
        <DropdownMenuItem className="text-red-500" onClick={handleDelete}>
          Delete Plan
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export const columns: ColumnDef<Plan>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Plan Name
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
  },
  {
    id: "actions",
    cell: ({ row }) => <ActionsCell row={row} />,
  },
];
