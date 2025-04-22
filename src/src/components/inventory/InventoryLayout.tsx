
import { useState } from 'react';
import { InventoryItem } from '@/services/inventory/types';
import InventoryList from './InventoryList';
import InventoryDetail from './InventoryDetail';
import InventoryMap from './InventoryMap';
import MobileDetailView from './MobileDetailView';

export type ViewMode = 'split' | 'list' | 'map';

export interface InventoryLayoutProps {
  viewMode: ViewMode;
  items: InventoryItem[];
  selectedItem: InventoryItem | null;
  hoveredItem: InventoryItem | null;
  onItemSelect: (item: InventoryItem) => void;
  onItemHover: (item: InventoryItem | null) => void;
  onCloseDetail: () => void;
  isMobile: boolean;
}

const InventoryLayout = ({ 
  viewMode, 
  items, 
  selectedItem, 
  hoveredItem, 
  onItemSelect, 
  onItemHover, 
  onCloseDetail,
  isMobile 
}: InventoryLayoutProps) => {
  
  // Mobile: Detail View
  if (isMobile && selectedItem && viewMode === 'list') {
    return <MobileDetailView selectedItem={selectedItem} onClose={onCloseDetail} />;
  }

  // Mobile: Other Views
  if (isMobile) {
    switch (viewMode) {
      case 'list':
        return (
          <div className="flex-grow">
            <InventoryList 
              onItemSelect={onItemSelect} 
              onItemHover={onItemHover}
              selectedItem={selectedItem}
            />
          </div>
        );
      case 'map':
        return (
          <div className="flex-grow h-[calc(100vh-220px)]">
            <InventoryMap 
              items={items}
              selectedItem={selectedItem}
              hoveredItem={hoveredItem}
              onItemSelect={onItemSelect}
            />
          </div>
        );
      default: // split view
        return (
          <div className="flex-grow flex flex-col">
            <div className="flex-grow">
              <InventoryList 
                onItemSelect={onItemSelect} 
                onItemHover={onItemHover}
                selectedItem={selectedItem}
              />
            </div>
            <div className="h-[300px]">
              <InventoryMap 
                items={items}
                selectedItem={selectedItem}
                hoveredItem={hoveredItem}
                onItemSelect={onItemSelect}
              />
            </div>
          </div>
        );
    }
  }
  
  // Desktop Views
  switch (viewMode) {
    case 'list':
      return (
        <div className="flex-grow grid grid-cols-3 gap-0">
          <div className="col-span-3">
            <InventoryList 
              onItemSelect={onItemSelect} 
              onItemHover={onItemHover}
              selectedItem={selectedItem}
            />
          </div>
        </div>
      );
    case 'map':
      return (
        <div className="flex-grow h-[calc(100vh-220px)]">
          <InventoryMap 
            items={items}
            selectedItem={selectedItem}
            hoveredItem={hoveredItem}
            onItemSelect={onItemSelect}
          />
        </div>
      );
    default: // split view
      return (
        <div className="flex-grow grid grid-cols-3 gap-0">
          <div className="col-span-2">
            <InventoryList 
              onItemSelect={onItemSelect} 
              onItemHover={onItemHover}
              selectedItem={selectedItem}
            />
          </div>
          <div className="col-span-1">
            {selectedItem ? (
              <InventoryDetail 
                item={selectedItem} 
                onClose={onCloseDetail}
              />
            ) : (
              <InventoryMap 
                items={items}
                selectedItem={selectedItem}
                hoveredItem={hoveredItem}
                onItemSelect={onItemSelect}
              />
            )}
          </div>
        </div>
      );
  }
};

export default InventoryLayout;
