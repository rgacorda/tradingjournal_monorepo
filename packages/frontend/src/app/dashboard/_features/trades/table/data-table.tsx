"use client";

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getSortedRowModel,
  SortingState,
  getPaginationRowModel,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import * as React from "react";
import { Button } from "@/components/ui/button";
import { Trash } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import MistakesUpdateCard from "../components/mistakes-Updatecard";
import { deleteTrades } from "@/actions/trades/trades";
import useSWR, { mutate } from "swr";
import { toast } from "sonner";
import { Account } from "@/actions/accounts/account";
import { fetcher } from "@/lib/fetcher";
import { useTradeUIStore } from "@/stores/trade-ui-store";
import { AxiosError } from "axios";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
}

export function DataTable<TData, TValue>({
  columns,
  data,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    state: {
      sorting,
    },
  });

  const { data: accounts } = useSWR<Account[]>("/account/", fetcher);
  const { data: plans } = useSWR<Account[]>("/plan/", fetcher);
  const setFilter = useTradeUIStore((s) => s.setFilter);

  return (
    <>
      <div className="flex flex-wrap items-center justify-between py-2 gap-2">
        <div className="flex items-center gap-2">
          <Select
            value={useTradeUIStore.getState().filter}
            onValueChange={setFilter}
          >
            <SelectTrigger className="w-[280px]">
              <SelectValue placeholder="Select a Filter" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Accounts</SelectLabel>
                {accounts?.map(({ name, id }) => (
                  <SelectItem key={id} value={id || ""}>
                    {name}
                  </SelectItem>
                ))}
              </SelectGroup>
              <SelectGroup>
                <SelectLabel>Plans</SelectLabel>
                {plans?.map(({ name, id }) => (
                  <SelectItem key={id} value={id || ""}>
                    {name}
                  </SelectItem>
                ))}
              </SelectGroup>
              <SelectGroup>
                <SelectLabel>Side</SelectLabel>
                <SelectItem value="long">Long</SelectItem>
                <SelectItem value="short">Short</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>

          <Button
            variant="outline"
            onClick={() => setFilter(undefined)}
          >
            Clear Filter
          </Button>
        </div>

        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={async () => {
              const selectedRows = table.getSelectedRowModel().rows;
              const selectedIds = selectedRows.map(
                (row) => (row.original as { id: string }).id
              );
              try {
                await deleteTrades(selectedIds);
                table.resetRowSelection();
                mutate("/trade/");
                toast.success("Trades deleted successfully.");
              } catch (error) {
                const axiosError = error as AxiosError;
                const message = axiosError.message || "Failed to delete trades.";
                toast.error(message);
              }
            }}
          >
            <Trash className="text-red-500" />
          </Button>
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="text-muted-foreground flex-1 text-sm ">
          {table.getFilteredSelectedRowModel().rows.length} of{" "}
          {table.getFilteredRowModel().rows.length} row(s) selected.
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          Previous
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          Next
        </Button>
      </div>
      <MistakesUpdateCard />
    </>
  );
}
