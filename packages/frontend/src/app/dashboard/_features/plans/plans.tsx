"use client";

import useSWR from "swr";
import { columns } from "./table/columns";
import { DataTable } from "./table/data-table";
import { fetcher } from "@/lib/fetcher";
import { toast } from "sonner";
import React from "react";
import PlanStatistics from "./components/plan-statistics";

export type Plan = {
  id: string;
  name: string;
};

export default function PlansDashboard() {
  const { data, error } = useSWR<Plan[]>("/plan/", fetcher);

  if (error) toast.error("Failed to load plans");

  return (
    <div className="container mx-auto px-6 space-y-6">
      <PlanStatistics />
      <DataTable columns={columns} data={data || []} />
    </div>
  );
}
