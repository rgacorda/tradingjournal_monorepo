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
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Lightbulb, Target, AlertTriangle } from "lucide-react";

export default function MistakeInsights() {
  const { data, error, isLoading } = useSWR<MistakeAnalyticsResponse>(
    "/mistake/analytics",
    getMistakeAnalytics
  );

  if (isLoading || error || !data || data.analytics.length === 0) {
    return null;
  }

  const { analytics, summary } = data;

  // Generate insights and recommendations
  const generateInsights = () => {
    const insights: string[] = [];
    const mostFrequent = analytics[0];
    const recentMistakes = analytics.filter(
      (a) =>
        a.recency.daysSinceLastOccurrence !== null &&
        a.recency.daysSinceLastOccurrence < 7
    );
    const worstGradeImpact = [...analytics]
      .filter((a) => a.gradeAnalysis.gradeImpact !== null)
      .sort(
        (a, b) =>
          (a.gradeAnalysis.gradeImpact || 0) -
          (b.gradeAnalysis.gradeImpact || 0)
      )[0];
    const worstFinancial = [...analytics].sort(
      (a, b) => a.financialImpact.averagePnL - b.financialImpact.averagePnL
    )[0];

    if (mostFrequent && mostFrequent.frequency.count > 0) {
      insights.push(
        `Your most common mistake is "${mostFrequent.mistakeName}" (${
          mostFrequent.frequency.count
        } times, ${mostFrequent.frequency.percentageOfTrades.toFixed(
          1
        )}% of trades).`
      );
    }

    if (recentMistakes.length > 0) {
      insights.push(
        `You have made ${recentMistakes.length} mistake${
          recentMistakes.length > 1 ? "s" : ""
        } in the past 7 days: ${recentMistakes
          .map((m) => `"${m.mistakeName}"`)
          .join(", ")}. Focus on addressing these immediately.`
      );
    }

    if (
      worstGradeImpact &&
      worstGradeImpact.gradeAnalysis.gradeImpact !== null
    ) {
      insights.push(
        `"${
          worstGradeImpact.mistakeName
        }" has the worst impact on your trade quality (${worstGradeImpact.gradeAnalysis.gradeImpact.toFixed(
          2
        )} grade points below average).`
      );
    }

    if (worstFinancial && worstFinancial.financialImpact.averagePnL < 0) {
      insights.push(
        `"${worstFinancial.mistakeName}" costs you an average of $${Math.abs(
          worstFinancial.financialImpact.averagePnL
        ).toFixed(
          2
        )} per occurrence (total: $${worstFinancial.financialImpact.totalPnL.toFixed(
          2
        )}).`
      );
    }

    return insights;
  };

  const generateRecommendations = () => {
    const recommendations: string[] = [];
    const mostFrequent = analytics[0];
    const recentMistakes = analytics.filter(
      (a) =>
        a.recency.daysSinceLastOccurrence !== null &&
        a.recency.daysSinceLastOccurrence < 7
    );
    const highImpactMistakes = analytics.filter(
      (a) =>
        a.gradeAnalysis.gradeImpact !== null &&
        a.gradeAnalysis.gradeImpact < -0.5
    );

    if (recentMistakes.length > 0 && mostFrequent) {
      const isRecentAndFrequent = recentMistakes.some(
        (m) => m.mistakeId === mostFrequent.mistakeId
      );
      if (isRecentAndFrequent) {
        recommendations.push(
          `🎯 **High Priority**: "${mostFrequent.mistakeName}" is both your most frequent mistake AND you made it recently. Create a checklist or pre-trade routine to prevent this.`
        );
      }
    }

    const costlyMistakes = analytics.filter(
      (a) => a.financialImpact.averagePnL < -50
    );
    if (costlyMistakes.length > 0) {
      recommendations.push(
        `💰 **Financial Focus**: ${costlyMistakes
          .map((m) => `"${m.mistakeName}"`)
          .join(", ")} ${
          costlyMistakes.length > 1 ? "are" : "is"
        } costing you significantly. Consider reducing position size when risk of this mistake is high.`
      );
    }

    if (highImpactMistakes.length > 0) {
      recommendations.push(
        `📊 **Quality Improvement**: Work on ${highImpactMistakes
          .map((m) => `"${m.mistakeName}"`)
          .join(
            ", "
          )} to improve your execution quality. These mistakes severely affect your trade grades.`
      );
    }

    const improvingMistakes = analytics.filter(
      (a) =>
        a.recency.daysSinceLastOccurrence !== null &&
        a.recency.daysSinceLastOccurrence > 30
    );
    if (improvingMistakes.length > 0) {
      recommendations.push(
        `✅ **Good Progress**: You have not made ${improvingMistakes
          .map((m) => `"${m.mistakeName}"`)
          .join(", ")} in over 30 days. Keep up the discipline!`
      );
    }

    if (summary.tradesWithMistakes / summary.totalTrades > 0.3) {
      recommendations.push(
        `⚠️ **Overall**: ${(
          (summary.tradesWithMistakes / summary.totalTrades) *
          100
        ).toFixed(
          1
        )}% of your trades have mistakes. Aim to reduce this below 20% by focusing on pre-trade preparation.`
      );
    }

    return recommendations;
  };

  const insights = generateInsights();
  const recommendations = generateRecommendations();

  if (insights.length === 0 && recommendations.length === 0) {
    return null;
  }

  return (
    <Card className="border-blue-200 bg-blue-50/50 dark:border-blue-900 dark:bg-blue-950/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Lightbulb className="h-5 w-5 text-blue-600" />
          Key Insights & What to Improve
        </CardTitle>
        <CardDescription>
          Based on your mistake patterns, here is what needs your attention
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {insights.length > 0 && (
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Current Situation</AlertTitle>
            <AlertDescription>
              <ul className="mt-2 space-y-2">
                {insights.map((insight, index) => (
                  <li key={index} className="text-sm">
                    • {insight}
                  </li>
                ))}
              </ul>
            </AlertDescription>
          </Alert>
        )}

        {recommendations.length > 0 && (
          <Alert className="border-green-200 bg-green-50 dark:border-green-900 dark:bg-green-950">
            <Target className="h-4 w-4 text-green-600" />
            <AlertTitle className="text-green-900 dark:text-green-100">
              Action Plan
            </AlertTitle>
            <AlertDescription className="text-green-800 dark:text-green-200">
              <ul className="mt-2 space-y-2">
                {recommendations.map((rec, index) => (
                  <li key={index} className="text-sm">
                    {rec}
                  </li>
                ))}
              </ul>
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
}
