
import * as RechartsPrimitive from "recharts"
import ChartContainer from "./ChartContainer"
import ChartTooltipContent from "./ChartTooltipContent"
import ChartLegendContent from "./ChartLegendContent"
import ChartStyle from "./ChartStyle"
import { ChartConfig } from "./types"

const ChartTooltip = RechartsPrimitive.Tooltip
const ChartLegend = RechartsPrimitive.Legend

export {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
  ChartStyle,
}

export type { ChartConfig }
