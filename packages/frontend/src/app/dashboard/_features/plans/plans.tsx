"use client";

import useSWR from "swr";
import { columns } from "./table/columns";
import { DataTable } from "./table/data-table";
import { fetcher } from "@/lib/fetcher";
import { toast } from "sonner";
import React from "react";

export type Plan = {
  id: string;
  name: string;
};

export default function PlansDashboard() {
  const { data, error } = useSWR<Plan[]>("/plan/", fetcher);

  if (error) toast.error("Failed to load plans");

  return (
    <>
      <div className="container mx-auto px-4 lg:px-6">
        <DataTable columns={columns} data={data || []} />
      </div>
    </>
  );
}
