
import { useState, useEffect } from 'react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import InventoryLayout from '@/components/inventory/InventoryLayout';
import InventoryViewToggle from '@/components/inventory/InventoryViewToggle';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { useInventory } from '@/hooks/useInventory';
import { useUserProfile } from '@/hooks/useUserProfile';
import { ViewMode } from '@/components/inventory/InventoryLayout';
import { InventoryItem } from '@/services/inventory/types';
import ImportExport from '@/components/inventory/ImportExport';

interface InventoryProps {
  initialView?: 'list' | 'map';
}

const Inventory = ({ initialView = 'list' }: InventoryProps) => {
  const [viewMode, setViewMode] = useState<ViewMode>(initialView === 'map' ? 'map' : 'split');
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);
  const [hoveredItem, setHoveredItem] = useState<InventoryItem | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  
  const { items, loading, fetchInventory } = useInventory();
  const { userProfile, userOrganization } = useUserProfile();

  // Handle responsive layout
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile(); // Check on initial load
    window.addEventListener('resize', checkMobile);
    
    return () => {
      window.removeEventListener('resize', checkMobile);
    };
  }, []);

  const handleItemSelect = (item: InventoryItem) => {
    setSelectedItem(current => current?.id === item.id ? null : item);
  };

  const handleItemHover = (item: InventoryItem | null) => {
    setHoveredItem(item);
  };

  const handleCloseDetail = () => {
    setSelectedItem(null);
  };

  const handleImportComplete = () => {
    fetchInventory();
  };

  return (
    <ProtectedRoute>
      <DashboardLayout 
        title="Inventory" 
        userProfile={userProfile} 
        userOrganization={userOrganization}
        hideSearchInput={true}
      >
        <div className="p-4 flex justify-between items-center">
          <ImportExport items={items} onImportComplete={handleImportComplete} />
          <InventoryViewToggle viewMode={viewMode} setViewMode={setViewMode} />
        </div>
        
        <InventoryLayout 
          viewMode={viewMode}
          items={items}
          selectedItem={selectedItem}
          hoveredItem={hoveredItem}
          onItemSelect={handleItemSelect}
          onItemHover={handleItemHover}
          onCloseDetail={handleCloseDetail}
          isMobile={isMobile}
        />
      </DashboardLayout>
    </ProtectedRoute>
  );
};

export default Inventory;
