
import { useEffect, useState } from 'react';
import { InventoryItem } from '@/hooks/useInventory';
import DashboardSummaryCards from './DashboardSummaryCards';
import InventoryOverviewChart from './InventoryOverviewChart';
import InventoryLocationChart from './InventoryLocationChart';
import RecentActivityList from './RecentActivityList';
import LoadingState from './LoadingState';

interface DashboardContentProps {
  items: InventoryItem[];
  loading: boolean;
}

interface DashboardData {
  totalItems: number;
  distinctItemsCount: number;
  locationsCount: number;
  lowStockItems: number;
  inventoryOverTime: Array<{ name: string; value: number }>;
  inventoryByLocation: Array<{
    name: string;
    inStock: number;
    lowStock: number;
    outOfStock: number;
  }>;
}

const DashboardContent = ({ items, loading }: DashboardContentProps) => {
  const [dashboardData, setDashboardData] = useState<DashboardData>({
    totalItems: 0,
    distinctItemsCount: 0,
    locationsCount: 0,
    lowStockItems: 0,
    inventoryOverTime: [],
    inventoryByLocation: []
  });

  // Process inventory data when items are loaded or changed
  useEffect(() => {
    console.log("Recalculating dashboard data with items:", items?.length || 0);
    
    // Reset data if there are no items
    if (!items || items.length === 0) {
      setDashboardData({
        totalItems: 0,
        distinctItemsCount: 0,
        locationsCount: 0,
        lowStockItems: 0,
        inventoryOverTime: [],
        inventoryByLocation: []
      });
      return;
    }
    
    // Count distinct items (using the length of the items array)
    const distinctItemsCount = items.length;
    
    // Count total items by summing quantities
    const totalQuantity = items.reduce((sum, item) => sum + item.quantity, 0);
    console.log("Total quantity calculation:", totalQuantity);
    
    // Count unique locations (filtering out null or empty locations)
    const validLocations = items
      .map(item => item.location)
      .filter(location => location && location.trim() !== '');
    const uniqueLocations = [...new Set(validLocations)];
    
    // Count low stock items
    const lowStockCount = items.filter(item => item.status === 'Low Stock').length;

    // Prepare data for inventory over time chart (grouped by category)
    const categoryCounts = items.reduce((acc, item) => {
      const category = item.category || 'Uncategorized';
      if (!acc[category]) acc[category] = 0;
      acc[category] += item.quantity;
      return acc;
    }, {} as Record<string, number>);
    
    const inventoryOverTime = Object.keys(categoryCounts).map(category => ({
      name: category,
      value: categoryCounts[category]
    }));

    // Prepare data for inventory by location chart
    const locationData = uniqueLocations.map(location => {
      const locationItems = items.filter(item => item.location === location);
      return {
        name: location,
        inStock: locationItems.filter(item => item.status === 'In Stock').reduce((sum, item) => sum + item.quantity, 0),
        lowStock: locationItems.filter(item => item.status === 'Low Stock').reduce((sum, item) => sum + item.quantity, 0),
        outOfStock: locationItems.filter(item => item.status === 'Out of Stock').reduce((sum, item) => sum + item.quantity, 0)
      };
    });

    setDashboardData({
      totalItems: distinctItemsCount,
      distinctItemsCount,
      locationsCount: uniqueLocations.length,
      lowStockItems: lowStockCount,
      inventoryOverTime,
      inventoryByLocation: locationData
    });
  }, [items]); // Dependency on items ensures recalculation when items change

  if (loading) {
    return <LoadingState />;
  }

  // Calculate total quantity here
  const totalQuantity = items ? items.reduce((sum, item) => sum + item.quantity, 0) : 0;

  return (
    <>
      <DashboardSummaryCards 
        totalItems={dashboardData.totalItems}
        itemsCount={totalQuantity}
        locationsCount={dashboardData.locationsCount}
        lowStockItems={dashboardData.lowStockItems}
      />
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <InventoryOverviewChart data={dashboardData.inventoryOverTime} />
        <InventoryLocationChart data={dashboardData.inventoryByLocation} />
      </div>
      
      <RecentActivityList items={items} />
    </>
  );
};

export default DashboardContent;
