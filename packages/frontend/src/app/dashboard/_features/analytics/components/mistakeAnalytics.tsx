"use client";

import {
  getMistakeAnalytics,
  MistakeAnalyticsResponse,
} from "@/actions/mistakes/mistakes";
import useSWR from "swr";
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
  TrendingDown,
  TrendingUp,
  Clock,
  AlertCircle,
} from "lucide-react";

export default function MistakeAnalytics() {
  const { data, error, isLoading } = useSWR<MistakeAnalyticsResponse>(
    "/mistake/analytics",
    getMistakeAnalytics
  );

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Mistake Analytics</CardTitle>
          <CardDescription>Loading analytics...</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Mistake Analytics</CardTitle>
          <CardDescription className="text-destructive">
            Failed to load analytics
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  if (!data || data.analytics.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Mistake Analytics</CardTitle>
          <CardDescription>
            No mistakes tracked yet. Start tracking mistakes in your trades to
            see analytics.
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  const { analytics, summary } = data;

  const getGradeImpactColor = (
    impact: number | null
  ): "secondary" | "destructive" | "default" | "outline" => {
    if (impact === null) return "secondary";
    if (impact < -1) return "destructive";
    if (impact < 0) return "outline";
    return "default";
  };

  const getRecencyColor = (
    days: number | null
  ): "secondary" | "destructive" | "default" | "outline" => {
    if (days === null) return "secondary";
    if (days < 7) return "destructive";
    if (days < 30) return "outline";
    return "default";
  };

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Mistakes Tracked
            </CardTitle>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summary.totalMistakes}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Trades with Mistakes
            </CardTitle>
            <TrendingDown className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {summary.tradesWithMistakes}
            </div>
            <p className="text-xs text-muted-foreground">
              {summary.totalTrades > 0
                ? `${(
                    (summary.tradesWithMistakes / summary.totalTrades) *
                    100
                  ).toFixed(1)}% of total trades`
                : "No trades yet"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Clean Trades</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {summary.totalTrades - summary.tradesWithMistakes}
            </div>
            <p className="text-xs text-muted-foreground">
              {summary.totalTrades > 0
                ? `${(
                    ((summary.totalTrades - summary.tradesWithMistakes) /
                      summary.totalTrades) *
                    100
                  ).toFixed(1)}% mistake-free`
                : "No trades yet"}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Analytics Table */}
      <Card>
        <CardHeader>
          <CardTitle>Mistake Analytics</CardTitle>
          <CardDescription>
            Frequency, recency, and grade impact analysis for each mistake type
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Mistake</TableHead>
                <TableHead className="text-right">Frequency</TableHead>
                <TableHead className="text-right">% of Trades</TableHead>
                <TableHead className="text-right">Last Occurred</TableHead>
                <TableHead className="text-right">Days Since</TableHead>
                <TableHead className="text-right">Avg Grade</TableHead>
                <TableHead className="text-right">Grade Impact</TableHead>
                <TableHead className="text-right">Avg P&L</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {analytics.map((item) => (
                <TableRow key={item.mistakeId}>
                  <TableCell className="font-medium">
                    {item.mistakeName}
                  </TableCell>
                  <TableCell className="text-right">
                    <Badge variant="outline">{item.frequency.count}</Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    {item.frequency.percentageOfTrades.toFixed(1)}%
                  </TableCell>
                  <TableCell className="text-right">
                    {item.recency.lastOccurrence ? (
                      <span className="text-sm">
                        {new Date(
                          item.recency.lastOccurrence
                        ).toLocaleDateString()}
                      </span>
                    ) : (
                      <span className="text-muted-foreground">Never</span>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    {item.recency.daysSinceLastOccurrence !== null ? (
                      <Badge
                        variant={getRecencyColor(
                          item.recency.daysSinceLastOccurrence
                        )}
                      >
                        <Clock className="mr-1 h-3 w-3" />
                        {item.recency.daysSinceLastOccurrence}d
                      </Badge>
                    ) : (
                      <span className="text-muted-foreground">-</span>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    {item.gradeAnalysis.averageGrade !== null ? (
                      <span className="font-medium">
                        {item.gradeAnalysis.averageGrade.toFixed(1)}
                      </span>
                    ) : (
                      <span className="text-muted-foreground">-</span>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    {item.gradeAnalysis.gradeImpact !== null ? (
                      <Badge
                        variant={getGradeImpactColor(
                          item.gradeAnalysis.gradeImpact
                        )}
                      >
                        {item.gradeAnalysis.gradeImpact > 0 ? (
                          <TrendingUp className="mr-1 h-3 w-3" />
                        ) : (
                          <TrendingDown className="mr-1 h-3 w-3" />
                        )}
                        {item.gradeAnalysis.gradeImpact > 0 ? "+" : ""}
                        {item.gradeAnalysis.gradeImpact.toFixed(2)}
                      </Badge>
                    ) : (
                      <span className="text-muted-foreground">-</span>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <span
                      className={
                        item.financialImpact.averagePnL >= 0
                          ? "text-green-600"
                          : "text-red-600"
                      }
                    >
                      ${item.financialImpact.averagePnL.toFixed(2)}
                    </span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Grade Impact Insights */}
      <Card>
        <CardHeader>
          <CardTitle>Grade Impact Insights</CardTitle>
          <CardDescription>
            Understanding how mistakes affect your trade quality
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            {analytics
              .filter((item) => item.gradeAnalysis.gradeImpact !== null)
              .sort(
                (a, b) =>
                  (a.gradeAnalysis.gradeImpact || 0) -
                  (b.gradeAnalysis.gradeImpact || 0)
              )
              .slice(0, 5)
              .map((item) => (
                <div
                  key={item.mistakeId}
                  className="flex items-center justify-between rounded-lg border p-3"
                >
                  <div>
                    <p className="font-medium">{item.mistakeName}</p>
                    <p className="text-sm text-muted-foreground">
                      {item.frequency.count} occurrences • Avg grade:{" "}
                      {item.gradeAnalysis.averageGrade?.toFixed(1) || "N/A"}
                    </p>
                  </div>
                  <Badge
                    variant={getGradeImpactColor(
                      item.gradeAnalysis.gradeImpact
                    )}
                  >
                    {item.gradeAnalysis.gradeImpact! > 0 ? "+" : ""}
                    {item.gradeAnalysis.gradeImpact!.toFixed(2)}
                  </Badge>
                </div>
              ))}
          </div>
          <div className="pt-4 text-sm text-muted-foreground">
            <p>
              <strong>Grade Impact</strong> shows how much a mistake affects
              your trade execution quality compared to your overall average
              grade.
            </p>
            <p className="mt-2">
              <strong>Overall Average Grade:</strong>{" "}
              {analytics[0]?.gradeAnalysis.overallAverageGrade?.toFixed(2) ||
                "N/A"}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
