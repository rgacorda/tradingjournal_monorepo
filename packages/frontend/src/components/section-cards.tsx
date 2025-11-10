import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

interface MainSectionCardsProps {
  data: {
    totalRevenue: number;
    totalWinRate: number;
    totalTrades: number;
    expectancy: number;
    pnlratio: number;
  }
}
export function SectionCards(data: MainSectionCardsProps) {
  return (
    <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Total Revenue</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            <span
              className={`${
                data.data.totalRevenue < 0
                  ? "text-red-500"
                  : "text-green-500"
              }`}
            >
              {data.data.totalRevenue.toFixed(2)}
            </span>
          </CardTitle>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Overall Performance
          </div>
          <div className="text-muted-foreground">
            Total Profit and Loss
          </div>
        </CardFooter>
      </Card>
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Win Rate</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            <span
              className={`${
                data.data.totalWinRate === undefined || data.data.totalWinRate < 0
                  ? "text-red-500"
                  : "text-green-500"
              }`}
            >
              {data.data.totalWinRate?.toFixed(2) ?? 0}
            </span>
          </CardTitle>
          {/* <CardAction>
            <Badge variant="outline">
              <IconTrendingDown />
              -20%
            </Badge>
          </CardAction> */}
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Win Rate Performance
          </div>
          <div className="text-muted-foreground">
            {data.data.totalWinRate >= 50 ? "Strong win rate" : "Win rate needs improvement"}
          </div>
        </CardFooter>
      </Card>
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Profit and Loss Ratio</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {data.data.pnlratio.toFixed(2)}
          </CardTitle>
          {/* <CardAction>
            <Badge variant="outline">
              <IconTrendingUp />
              +12.5%
            </Badge>
          </CardAction> */}
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            P/L ratio trend
          </div>
          <div className="text-muted-foreground">Consistent profitability growth</div>
        </CardFooter>
      </Card>
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Expectancy</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            <span
              className={`${
                data.data.expectancy < 0
                  ? "text-red-500"
                  : "text-green-500"
              }`}
            >
              {data.data.expectancy.toFixed(2)}
            </span>
          </CardTitle>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Overall Expectancy
          </div>
          <div className="text-muted-foreground">
            Average expected profit per trade
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}
