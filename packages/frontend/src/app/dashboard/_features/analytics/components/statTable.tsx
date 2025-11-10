import { Trade } from "@/actions/trades/trades";
import { fetcher } from "@/lib/fetcher";
import useSWR from "swr";
import { useMemo } from "react";

type StatItem = {
  label: string;
  value: string;
  hint?: string;
  locked?: boolean;
};

function calculateStats(
  trades: Trade[] | undefined,
  accounts: { id: string; isCommissionsIncluded?: boolean }[] | undefined
): {
  left: StatItem[];
  right: StatItem[];
} {
  if (!trades || trades.length === 0 || !accounts) {
    return { left: [], right: [] };
  }

  // Create a map of accountId -> isCommissionsIncluded
  const accountCommissionMap = new Map(
    accounts.map((acc) => [acc.id, acc.isCommissionsIncluded])
  );

  // Helper function to get adjusted realized value
  const getAdjustedRealized = (trade: Trade) => {
    const isCommissionsIncluded = accountCommissionMap.get(trade.accountId);
    const realized = Number(trade.realized);
    const fees = Number(trade.fees) || 0;
    return isCommissionsIncluded ? realized - fees : realized;
  };

  const realized = trades
    .map((t) => getAdjustedRealized(t))
    .filter((r) => !isNaN(r));
  const totalGainLoss = realized.reduce((a, b) => a + b, 0);
  const averageTrade = totalGainLoss / trades.length;
  const tradeDates = [...new Set(trades.map((t) => t.date))];
  const averageDaily = totalGainLoss / tradeDates.length;
  const stdDev = Math.sqrt(
    realized.reduce((sum, r) => sum + Math.pow(r - averageTrade, 2), 0) /
      (trades.length - 1 || 1)
  );
  // const scratchTrades = trades.filter((t) => getAdjustedRealized(t) === 0);
  const largestGain = Math.max(...realized);
  const largestLoss = Math.min(...realized);
  const perShare = trades.map((t) =>
    t.quantity ? getAdjustedRealized(t) / t.quantity : 0
  );
  const perShareAvg = perShare.reduce((a, b) => a + b, 0) / trades.length;

  const wins = trades.filter((t) => getAdjustedRealized(t) > 0);
  const losses = trades.filter((t) => getAdjustedRealized(t) < 0);
  const winAvg =
    wins.length > 0
      ? wins.reduce((sum, t) => sum + getAdjustedRealized(t), 0) / wins.length
      : 0;
  const lossAvg =
    losses.length > 0
      ? losses.reduce((sum, t) => sum + getAdjustedRealized(t), 0) / losses.length
      : 0;
  const winRate = (wins.length / trades.length) * 100;

  let maxWinStreak = 0;
  let maxLossStreak = 0;
  let currentWinStreak = 0;
  let currentLossStreak = 0;

  for (const t of trades) {
    const adjustedRealized = getAdjustedRealized(t);
    if (adjustedRealized > 0) {
      currentWinStreak++;
      maxWinStreak = Math.max(maxWinStreak, currentWinStreak);
      currentLossStreak = 0;
    } else if (adjustedRealized < 0) {
      currentLossStreak++;
      maxLossStreak = Math.max(maxLossStreak, currentLossStreak);
      currentWinStreak = 0;
    } else {
      currentWinStreak = 0;
      currentLossStreak = 0;
    }
  }

  const totalWin = wins.reduce((sum, t) => sum + getAdjustedRealized(t), 0);
  const totalLoss = losses.reduce((sum, t) => sum + getAdjustedRealized(t), 0);

  const profitFactor = totalLoss < 0 ? Math.abs(totalWin / totalLoss) : "N/A";

  const totalCommissions = trades.reduce(
    (sum, t) => sum + Number(t.fees || 0),
    0
  );

  const sqn =
    stdDev > 0 ? (averageTrade / stdDev) * Math.sqrt(trades.length) : 0;

  const KwinRate = wins.length / trades.length;
  const avgWin = winAvg;
  const avgLoss = Math.abs(lossAvg);

  const kelly =
    avgLoss === 0 || avgWin === 0
      ? 0
      : KwinRate - (1 - KwinRate) * (avgLoss / avgWin);

  // Calculate expectancy: (Win Rate × Average Win) - (Loss Rate × Average Loss)
  const expectancy = (KwinRate * avgWin) - ((1 - KwinRate) * avgLoss);

  return {
    left: [
      { label: "Total Gain/Loss", value: `$${totalGainLoss.toFixed(2)}` },
      {
        label: "Average Daily Gain/Loss",
        value: `$${averageDaily.toFixed(2)}`,
      },
      {
        label: "Average Trade Gain/Loss",
        value: `$${averageTrade.toFixed(2)}`,
      },
      {
        label: "Expectancy",
        value: `$${expectancy.toFixed(2)}`,
      },
      { label: "Total Number of Trades", value: `${trades.length}` },
      { label: "Trade P&L Standard Deviation", value: `$${stdDev.toFixed(2)}` },
      { label: "Kelly Percentage", value: `${kelly.toFixed(2)}%` },
      { label: "Total Commissions", value: `$${totalCommissions.toFixed(2)}` },
    ],
    right: [
      { label: "Largest Gain", value: `$${largestGain.toFixed(2)}` },
      { label: "Largest Loss", value: `$${largestLoss.toFixed(2)}` },
      { label: "Average Daily Volume", value: "124" },
      {
        label: "Average Per-share Gain/Loss",
        value: `$${perShareAvg.toFixed(2)}`,
      },
      { label: "Average Winning Trade", value: `$${winAvg.toFixed(2)}` },
      { label: "Average Losing Trade", value: `$${lossAvg.toFixed(2)}` },
      {
        label: "Number of Winning Trades",
        value: `${wins.length} (${winRate.toFixed(1)}%)`,
      },
      {
        label: "Number of Losing Trades",
        value: `${losses.length} (${(100 - winRate).toFixed(1)}%)`,
      },
      { label: "Max Consecutive Wins", value: `${maxWinStreak}` },
      { label: "Max Consecutive Losses", value: `${maxLossStreak}` },
      { label: "System Quality Number (SQN)", value: `${sqn.toFixed(2)}` },
      {
        label: "Profit factor",
        value:
          typeof profitFactor === "string"
            ? profitFactor
            : profitFactor.toFixed(2),
      },
    ],
  };
}

export default function StatTable() {
  const {
    data: trades,
    // error,
    isLoading,
  } = useSWR<Trade[]>("/trade/", fetcher);
  const { data: accounts } = useSWR("/account/", fetcher);

  const { left, right } = useMemo(
    () => calculateStats(trades, accounts),
    [trades, accounts]
  );

  if (isLoading) {
    return (
      <div className="bg-card text-card-foreground flex flex-col items-center justify-center rounded-xl border py-10 shadow-sm px-6">
        <p className="text-muted-foreground text-sm">Loading statistics...</p>
      </div>
    );
  }

  if (!trades || trades.length === 0) {
    return (
      <div className="bg-card text-card-foreground flex flex-col items-center justify-center rounded-xl border py-10 shadow-sm px-6">
        <h2 className="text-lg font-semibold">No Trades Available</h2>
        <p className="text-muted-foreground text-sm mt-2">
          Connect an account and add trades to see your full statistics here.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-card text-card-foreground flex flex-col gap-6 rounded-xl border py-6 shadow-sm px-6">
      <div className="flex-1">
        <h2 className="text-lg font-semibold">Full Statistics</h2>
        <p className="text-muted-foreground text-sm">
          Full statistics show a complete picture of your trading system&apos;s
          performance. All the metrics are calculated based on the data from
          your connected accounts. The metrics are grouped into two sections:
          the left section shows general statistics, and the right section shows
          detailed statistics.
        </p>
      </div>
      <div className="grid md:grid-cols-2 gap-4">
        <div className="space-y-2 pb-4 mb-4 md:pb-0 md:mb-0">
          {left.map((stat, idx) => (
            <div key={idx} className="flex justify-between">
              <span className="text-sm text-muted-foreground">
                {stat.label}
              </span>
              <span
                className={`text-sm font-medium ${
                  stat.locked ? "opacity-50" : ""
                }`}
              >
                {stat.value}
              </span>
            </div>
          ))}
        </div>
        <div className="space-y-2">
          {right.map((stat, idx) => (
            <div key={idx} className="flex justify-between">
              <span className="text-sm text-muted-foreground">
                {stat.label}
              </span>
              <span
                className={`text-sm font-medium ${
                  stat.locked ? "opacity-50" : ""
                }`}
              >
                {stat.value}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
