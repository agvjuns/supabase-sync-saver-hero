
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts';

interface LocationData {
  name: string;
  inStock: number;
  lowStock: number;
  outOfStock: number;
}

interface InventoryLocationChartProps {
  data: LocationData[];
}

const InventoryLocationChart = ({ data }: InventoryLocationChartProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Inventory by Location</CardTitle>
        <CardDescription>Stock status across locations</CardDescription>
      </CardHeader>
      <CardContent className="h-80">
        {data.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="inStock" name="In Stock" fill="#22c55e" stackId="a" />
              <Bar dataKey="lowStock" name="Low Stock" fill="#f59e0b" stackId="a" />
              <Bar dataKey="outOfStock" name="Out of Stock" fill="#ef4444" stackId="a" />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex items-center justify-center h-full text-muted-foreground">
            No location data available
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default InventoryLocationChart;
