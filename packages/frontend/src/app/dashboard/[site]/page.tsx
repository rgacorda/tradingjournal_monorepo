"use client";

import { useEffect } from "react";
import { use } from "react";
import MainDashboard from "../_features/main/main";
import TradeDashboard from "../_features/trades/trades";
import AccountDashboard from "../_features/accounts/accounts";
import { useDashboardStore } from "@/stores/dashboard-ui-store";
import PlansDashboard from "../_features/plans/plans";
import AnalyticsDashboard from "../_features/analytics/analytics";
import UserProfile from "../_features/user/userProfile";

export default function SiteDashboardPage({
  params,
}: {
  params: Promise<{ site: string }>;
}) {
  const { site } = use(params);
  const { setDashboard } = useDashboardStore((s) => s);

  useEffect(() => {
    setDashboard({ title: site.charAt(0).toUpperCase() + site.slice(1) });
  }, [site, setDashboard]);


  switch (site) {
    case "main":
      return <MainDashboard />;
    case "analytics":
      return <AnalyticsDashboard />;
    case "trades":
      return <TradeDashboard />;
    case "accounts":
      return <AccountDashboard />;
    case "plans":
      return <PlansDashboard />;
    case "user":
      return <UserProfile />;
    default:
      return <div>{site}</div>;
  }
}
