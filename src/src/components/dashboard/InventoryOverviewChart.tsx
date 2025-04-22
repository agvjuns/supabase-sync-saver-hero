
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from 'recharts';
import { PackageSearch } from 'lucide-react';

interface InventoryChartData {
  name: string;
  value: number;
}

interface InventoryOverviewChartProps {
  data: InventoryChartData[];
}

// Color palette for category dots
const categoryColors = [
  "#3b82f6", // Blue-500
  "#10b981", // Emerald-500
  "#f97316", // Orange-500
  "#8b5cf6", // Violet-500
  "#ef4444", // Red-500
  "#eab308", // Yellow-500
  "#06b6d4", // Cyan-500
  "#84cc16", // Lime-500
  "#a855f7", // Purple-500
  "#f43f5e", // Rose-500
];

const InventoryOverviewChart = ({ data }: InventoryOverviewChartProps) => {
  return (
    <Card className="shadow-md hover:shadow-lg transition-shadow border-blue-100">
      <CardHeader className="pb-2">
        <div className="flex items-center">
          <div>
            <CardTitle className="text-2xl font-bold text-blue-800">Inventory Overview</CardTitle>
            <CardDescription className="text-base text-blue-600">Inventory by category</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="h-[480px] pb-4 flex flex-col">
        {data.length > 0 ? (
          <>
            <ChartContainer
              className="flex-1 w-full"
              config={{
                line: {
                  theme: {
                    light: "hsl(var(--primary))",
                    dark: "hsl(var(--primary))",
                  },
                },
                categories: {
                  color: "hsl(var(--muted-foreground))",
                },
                tooltip: {
                  color: "hsl(var(--primary))",
                },
                grid: {
                  color: "hsl(var(--border))",
                },
              }}
            >
              <ResponsiveContainer width="100%" height="100%">
                <PieChart margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
                  <ChartTooltip
                    content={<ChartTooltipContent className="text-white [&>div]:bg-gray-800 [&>div]:border-gray-700" />}
                    cursor={false}
                  />
                  <Pie
                    data={data}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={120}
                    paddingAngle={2}
                    stroke="hsl(var(--background))"
                    strokeWidth={2}
                  >
                    {data.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={categoryColors[index % categoryColors.length]}
                      />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </ChartContainer>
            <div className="mt-2 flex flex-col gap-2 overflow-y-auto max-h-[120px] pr-2">
              {data.map((item, index) => (
                <div key={`legend-${item.name}`} className="flex items-center gap-2 text-sm">
                  <div
                    className="h-3 w-3 rounded-full shrink-0"
                    style={{ backgroundColor: categoryColors[index % categoryColors.length] }}
                  />
                  <span className="text-muted-foreground truncate">{item.name}</span>
                  <span className="text-foreground font-medium ml-1">({item.value})</span>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-muted-foreground gap-3">
            <PackageSearch className="h-12 w-12 text-muted-foreground/50" />
            <span className="text-lg">No inventory data available</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default InventoryOverviewChart;
