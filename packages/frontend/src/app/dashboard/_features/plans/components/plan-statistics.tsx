"use client";

import useSWR from "swr";
import { getPlanStatistics } from "@/actions/plans/plans";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  TrendingUp,
  TrendingDown,
  Target,
  DollarSign,
  FileText,
  BarChart3,
} from "lucide-react";

export type PlanStatistic = {
  planId: string;
  planName: string;
  totalPnL: number;
  winRate: number;
  averageRR: number;
  expectancy: number;
  numberOfTrades: number;
};

export default function PlanStatistics() {
  const { data, error, isLoading } = useSWR<PlanStatistic[]>(
    "/plan/statistics",
    getPlanStatistics
  );

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Plan Performance</CardTitle>
          <CardDescription>Loading statistics...</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Plan Performance</CardTitle>
          <CardDescription className="text-destructive">
            Failed to load plan statistics
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  if (!data || data.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Plan Performance</CardTitle>
          <CardDescription>
            No plans created yet. Create a plan to start tracking its
            performance.
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  // Filter out plans with no trades for cleaner display
  const plansWithTrades = data.filter((plan) => plan.numberOfTrades > 0);
  const totalTrades = data.reduce((sum, plan) => sum + plan.numberOfTrades, 0);
  const totalPnL = data.reduce((sum, plan) => sum + plan.totalPnL, 0);
  const activePlans = plansWithTrades.length;

  const getWinRateColor = (
    winRate: number
  ): "secondary" | "destructive" | "default" | "outline" => {
    if (winRate >= 60) return "default";
    if (winRate >= 50) return "outline";
    if (winRate >= 40) return "secondary";
    return "destructive";
  };

  const getRRColor = (
    rr: number
  ): "secondary" | "destructive" | "default" | "outline" => {
    if (rr >= 2) return "default";
    if (rr >= 1.5) return "outline";
    if (rr >= 1) return "secondary";
    return "destructive";
  };

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Plans</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.length}</div>
            <p className="text-xs text-muted-foreground">
              {activePlans} active with trades
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Trades</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalTrades}</div>
            <p className="text-xs text-muted-foreground">
              Across all trading plans
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Combined P&L</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div
              className={`text-2xl font-bold ${
                totalPnL >= 0 ? "text-green-600" : "text-red-600"
              }`}
            >
              ${totalPnL.toFixed(2)}
            </div>
            <p className="text-xs text-muted-foreground">Total profit & loss</p>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Plan Statistics Table */}
      {plansWithTrades.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Plan Performance Analytics</CardTitle>
            <CardDescription>
              Detailed performance metrics for each trading plan
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Plan Name</TableHead>
                  <TableHead className="text-right">Trades</TableHead>
                  <TableHead className="text-right">Total P&L</TableHead>
                  <TableHead className="text-right">Win Rate</TableHead>
                  <TableHead className="text-right">Avg RR</TableHead>
                  <TableHead className="text-right">Expectancy</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {plansWithTrades
                  .sort((a, b) => b.numberOfTrades - a.numberOfTrades)
                  .map((plan) => (
                    <TableRow key={plan.planId}>
                      <TableCell className="font-medium">
                        {plan.planName}
                      </TableCell>
                      <TableCell className="text-right">
                        <Badge variant="outline">{plan.numberOfTrades}</Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <span
                          className={`font-medium ${
                            plan.totalPnL >= 0
                              ? "text-green-600"
                              : "text-red-600"
                          }`}
                        >
                          ${plan.totalPnL.toFixed(2)}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <Badge variant={getWinRateColor(plan.winRate)}>
                          <Target className="mr-1 h-3 w-3" />
                          {plan.winRate.toFixed(1)}%
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Badge variant={getRRColor(plan.averageRR)}>
                          {plan.averageRR >= 1.5 ? (
                            <TrendingUp className="mr-1 h-3 w-3" />
                          ) : (
                            <TrendingDown className="mr-1 h-3 w-3" />
                          )}
                          {plan.averageRR.toFixed(2)}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <span
                          className={`font-medium ${
                            plan.expectancy >= 0
                              ? "text-green-600"
                              : "text-red-600"
                          }`}
                        >
                          ${plan.expectancy.toFixed(2)}
                        </span>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {data.length > plansWithTrades.length && (
        <p className="text-sm text-muted-foreground">
          {data.length - plansWithTrades.length} plan(s) without trades not
          shown in the table
        </p>
      )}
    </div>
  );
}
