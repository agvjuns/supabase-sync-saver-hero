
import { ArrowUp, ArrowDown } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

export interface DashboardCardProps {
  title: string;
  value: string;
  change: string;
  trend: 'up' | 'down' | 'neutral';
  icon: React.ReactNode;
  description: string;
}

const DashboardCard = ({ title, value, change, trend, icon, description }: DashboardCardProps) => {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="bg-primary/10 p-2 rounded-md">
            {icon}
          </div>
          <div className={`text-sm font-medium flex items-center ${
            trend === 'up' ? 'text-green-600' : trend === 'down' ? 'text-red-600' : 'text-muted-foreground'
          }`}>
            {trend === 'up' ? (
              <ArrowUp className="h-3 w-3 mr-1" />
            ) : trend === 'down' ? (
              <ArrowDown className="h-3 w-3 mr-1" />
            ) : null}
            {change}
          </div>
        </div>
        <div className="font-bold text-2xl">{value}</div>
        <div className="text-sm text-muted-foreground">{description}</div>
      </CardContent>
    </Card>
  );
};

export default DashboardCard;
