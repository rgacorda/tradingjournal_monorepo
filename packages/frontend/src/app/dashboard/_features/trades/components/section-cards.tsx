import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

interface MainSectionCardsProps {
  data: {
    expectancy: number | undefined;
    totalWinRate: number;
    totalTrades: number;
    pnlratio: number;
    avgGrade: number;
  }
}
export function SectionCards(data: MainSectionCardsProps) {


  return (
    <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Expectancy</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            <span
              className={`${
                data.data.expectancy === undefined || data.data.expectancy < 0
                  ? "text-red-500"
                  : "text-green-500"
              }`}
            >
              {data.data.expectancy?.toFixed(2) ?? 0}
            </span>
          </CardTitle>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="text-muted-foreground">
            Average expected profit per trade
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
          {/* <div className="line-clamp-1 flex gap-2 font-medium">
            Down 20% this period <IconTrendingDown className="size-4" />
          </div> */}
          <div className="text-muted-foreground">
            Selected Strategy Win Rate
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
          <CardDescription>Average Grade</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {data.data.avgGrade ? data.data.avgGrade.toFixed(2) : 0}
          </CardTitle>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Grade (0-5)
          </div>
          <div className="text-muted-foreground">
            Estimated trading skills level.
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}
