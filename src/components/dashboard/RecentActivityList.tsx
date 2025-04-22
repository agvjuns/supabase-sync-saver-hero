
import { Package2, Activity, RefreshCw, AlertTriangle, Trash } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { InventoryItem } from '@/hooks/useInventory';

interface ActivityItem {
  type: 'create' | 'update' | 'delete' | 'alert';
  title: string;
  description: string;
  time: string;
  icon: React.ReactNode;
}

interface RecentActivityListProps {
  items: InventoryItem[];
}

const activityColors = {
  create: 'bg-green-100 text-green-600 dark:bg-green-900/20 dark:text-green-400',
  update: 'bg-blue-100 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400',
  delete: 'bg-red-100 text-red-600 dark:bg-red-900/20 dark:text-red-400',
  alert: 'bg-amber-100 text-amber-600 dark:bg-amber-900/20 dark:text-amber-400',
};

// Fallback static activity items for when no inventory data is available
const activityItems = [
  {
    type: 'create' as const,
    title: 'New inventory item added',
    description: 'MacBook Pro 16" was added to New York Warehouse',
    time: '2 hours ago',
    icon: <Package2 className="h-4 w-4" />,
  },
  {
    type: 'update' as const,
    title: 'Inventory updated',
    description: 'Wireless Headphones quantity changed from 12 to 8',
    time: '5 hours ago',
    icon: <RefreshCw className="h-4 w-4" />,
  },
  {
    type: 'alert' as const,
    title: 'Low stock alert',
    description: 'External Monitor is running low on stock (5 remaining)',
    time: '1 day ago',
    icon: <AlertTriangle className="h-4 w-4" />,
  },
  {
    type: 'delete' as const,
    title: 'Item removed',
    description: 'Office Chair was removed from inventory',
    time: '2 days ago',
    icon: <Trash className="h-4 w-4" />,
  },
];

const RecentActivityList = ({ items }: RecentActivityListProps) => {
  // Generate recent activity items based on actual inventory
  const generateRecentActivity = (): ActivityItem[] => {
    if (!items || items.length === 0) return activityItems;
    
    // We'll use the most recent items based on lastUpdated
    const sortedItems = [...items].sort((a, b) => 
      new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime()
    ).slice(0, 4);
    
    return sortedItems.map((item) => {
      // Define type as one of the allowed literal types
      let activityType: 'create' | 'update' | 'delete' | 'alert' = 'update';
      let description = `${item.name} was updated in ${item.location}`;
      let icon = <RefreshCw className="h-4 w-4" />;
      
      if (item.status === 'Low Stock') {
        activityType = 'alert';
        description = `${item.name} is running low on stock (${item.quantity} remaining)`;
        icon = <AlertTriangle className="h-4 w-4" />;
      } else if (item.quantity === 0) {
        activityType = 'delete';
        description = `${item.name} is out of stock`;
        icon = <Trash className="h-4 w-4" />;
      }
      
      return {
        type: activityType,
        title: `Inventory ${activityType === 'alert' ? 'alert' : 'updated'}`,
        description,
        time: formatTimeAgo(new Date(item.lastUpdated)),
        icon,
      };
    });
  };

  // Helper to format time ago
  const formatTimeAgo = (date: Date): string => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHrs = Math.floor(diffMs / (1000 * 60 * 60));
    
    if (diffHrs < 1) return 'Less than an hour ago';
    if (diffHrs < 24) return `${diffHrs} hour${diffHrs > 1 ? 's' : ''} ago`;
    const diffDays = Math.floor(diffHrs / 24);
    return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
  };

  const recentActivities = generateRecentActivity();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
        <CardDescription>Latest updates and changes</CardDescription>
      </CardHeader>
      <CardContent>
        {items.length > 0 ? (
          <ul className="space-y-4">
            {recentActivities.map((item, index) => (
              <li key={index} className="flex items-start gap-4 pb-4 border-b border-border last:border-0 last:pb-0">
                <div className={`rounded-full p-2 ${activityColors[item.type]}`}>
                  {item.icon}
                </div>
                <div className="flex-1">
                  <p className="font-medium">{item.title}</p>
                  <p className="text-sm text-muted-foreground">{item.description}</p>
                </div>
                <time className="text-sm text-muted-foreground">{item.time}</time>
              </li>
            ))}
          </ul>
        ) : (
          <div className="flex items-center justify-center h-24 text-muted-foreground">
            No recent activity
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default RecentActivityList;
