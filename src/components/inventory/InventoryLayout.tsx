
import { useState, useEffect } from 'react';
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
  const [isEditing, setIsEditing] = useState(false);
  const [isAddFormOpen, setIsAddFormOpen] = useState(false);
  const [isImportExportActive, setIsImportExportActive] = useState(false);
  
  // Listen for edit form open/close events
  useEffect(() => {
    const handleEditFormChange = (event: CustomEvent) => {
      setIsEditing(event.detail.isOpen);
    };
    
    window.addEventListener('editFormStateChange' as any, handleEditFormChange);
    
    return () => {
      window.removeEventListener('editFormStateChange' as any, handleEditFormChange);
    };
  }, []);
  
  // Listen for add form open/close events
  useEffect(() => {
    const handleAddFormChange = (event: CustomEvent) => {
      setIsAddFormOpen(event.detail.isOpen);
    };
    
    window.addEventListener('addFormStateChange' as any, handleAddFormChange);
    
    return () => {
      window.removeEventListener('addFormStateChange' as any, handleAddFormChange);
    };
  }, []);
  
  // Listen for import/export dialog open/close events
  useEffect(() => {
    const handleImportModalChange = (event: CustomEvent) => {
      setIsImportExportActive(event.detail.isOpen);
    };
    
    window.addEventListener('importModalStateChange' as any, handleImportModalChange);
    
    return () => {
      window.removeEventListener('importModalStateChange' as any, handleImportModalChange);
    };
  }, []);
  
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
            {!isImportExportActive && !isAddFormOpen && (
              <InventoryMap 
                items={items}
                selectedItem={selectedItem}
                hoveredItem={hoveredItem}
                onItemSelect={onItemSelect}
              />
            )}
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
            {!isImportExportActive && !isEditing && !isAddFormOpen && (
              <div className="h-[300px]">
                <InventoryMap 
                  items={items}
                  selectedItem={selectedItem}
                  hoveredItem={hoveredItem}
                  onItemSelect={onItemSelect}
                />
              </div>
            )}
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
          {!isImportExportActive && !isAddFormOpen && (
            <InventoryMap 
              items={items}
              selectedItem={selectedItem}
              hoveredItem={hoveredItem}
              onItemSelect={onItemSelect}
            />
          )}
        </div>
      );
    default: // split view - updated to hide map when editing, adding, or importing/exporting
      return (
        <div className="flex-grow grid grid-cols-3 gap-0">
          <div className={isEditing || isImportExportActive || isAddFormOpen ? "col-span-3" : "col-span-2"}>
            <InventoryList 
              onItemSelect={onItemSelect} 
              onItemHover={onItemHover}
              selectedItem={selectedItem}
            />
          </div>
          {!isEditing && !isImportExportActive && !isAddFormOpen && (
            <div className="col-span-1 max-h-screen overflow-hidden">
              <InventoryMap 
                items={items}
                selectedItem={selectedItem}
                hoveredItem={hoveredItem}
                onItemSelect={onItemSelect}
              />
            </div>
          )}
        </div>
      );
  }
};

export default InventoryLayout;
