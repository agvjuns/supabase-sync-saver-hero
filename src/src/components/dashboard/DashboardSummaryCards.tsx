
import { Package2, Map, Users, Activity } from 'lucide-react';
import DashboardCard from './DashboardCard';
import { useAuth } from '@/hooks/useAuth';

interface DashboardSummaryCardsProps { 
  totalItems: number; 
  itemsCount: number; 
  locationsCount: number; 
  lowStockItems: number;
}

const DashboardSummaryCards = ({ 
  totalItems, 
  itemsCount, 
  locationsCount, 
  lowStockItems 
}: DashboardSummaryCardsProps) => {
  // Get current user information
  const { user } = useAuth();
  
  // Determine the change description for low stock items
  const getLowStockDescription = () => {
    if (lowStockItems === 0) return "All stocked";
    if (lowStockItems === 1) return "1 item needs restocking";
    return `${lowStockItems} items need restocking`;
  };

  // Get the user's email or display a fallback
  const getUserDisplayName = () => {
    if (!user) return "Guest";
    return user.email || "Active user";
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <DashboardCard 
        title="Unique Items"
        value={totalItems.toString()}
        change={`${itemsCount} Total Inventory Qty`}
        trend="neutral"
        icon={<Package2 className="h-5 w-5" />}
        description="Distinct items tracked"
      />
      <DashboardCard 
        title="Locations"
        value={locationsCount.toString()}
        change={locationsCount > 0 ? "Active" : "None"}
        trend="neutral"
        icon={<Map className="h-5 w-5" />}
        description="Active locations"
      />
      <DashboardCard 
        title="Low Stock Items"
        value={lowStockItems.toString()}
        change={getLowStockDescription()}
        trend={lowStockItems > 0 ? "down" : "up"}
        icon={<Activity className="h-5 w-5" />}
        description="Inventory needs attention"
      />
      <DashboardCard 
        title="Team Members"
        value="1"
        change={getUserDisplayName()}
        trend="neutral"
        icon={<Users className="h-5 w-5" />}
        description="Active users"
      />
    </div>
  );
};

export default DashboardSummaryCards;
