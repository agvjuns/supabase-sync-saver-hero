
import { useState, useEffect } from 'react';
import { InventoryItem } from '@/services/inventory/types';
import EmptyDetailState from './detail/EmptyDetailState';
import DetailHeader from './detail/DetailHeader';
import ItemBasicInfo from './detail/ItemBasicInfo';
import ItemStatusAndQuantity from './detail/ItemStatusAndQuantity';
import ItemCategory from './detail/ItemCategory';
import ItemLocation from './detail/ItemLocation';
import ItemAdditionalDetails from './detail/ItemAdditionalDetails';
import ItemDescription from './detail/ItemDescription';
import QuickActions from './detail/QuickActions';
import EditItemForm from './forms/EditItemForm';

interface InventoryDetailProps {
  item: InventoryItem | null;
  onClose: () => void;
  isEditing?: boolean;
  onEditChange?: (editing: boolean) => void;
  editedItem?: InventoryItem | null;
  onItemChange?: (item: InventoryItem) => void;
}

const InventoryDetail = ({ 
  item, 
  onClose,
  isEditing: externalIsEditing,
  onEditChange,
  editedItem: externalEditedItem,
  onItemChange
}: InventoryDetailProps) => {
  const [internalIsEditing, setInternalIsEditing] = useState(false);
  const [internalEditedItem, setInternalEditedItem] = useState<InventoryItem | null>(item);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  
  // Use external or internal state
  const isEditing = externalIsEditing !== undefined ? externalIsEditing : internalIsEditing;
  const editedItem = externalEditedItem !== undefined ? externalEditedItem : internalEditedItem;

  useEffect(() => {
    if (!externalEditedItem) {
      setInternalEditedItem(item);
    }
  }, [item, externalEditedItem]);

  if (!item) {
    return <EmptyDetailState />;
  }

  const handleEdit = () => {
    // Open the edit modal
    setIsEditModalOpen(true);
  };

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
    // Reset editing states
    if (onEditChange) {
      onEditChange(false);
    } else {
      setInternalIsEditing(false);
    }
  };

  return (
    <div className="h-full flex flex-col overflow-hidden bg-background border-l border-border animate-fade-in">
      <DetailHeader 
        title="Item Details"
        isEditing={isEditing}
        onEdit={handleEdit}
        onSave={() => {}} // We don't need this anymore as saving is handled in the modal
        onClose={onClose}
      />

      <div className="flex-grow overflow-y-auto p-4 space-y-6">
        {editedItem && (
          <>
            <ItemBasicInfo 
              item={item} 
              isEditing={false} // We never want inline editing now
              editedItem={item} // Use the original item for display
              onChange={() => {}} // No-op function
            />

            <ItemStatusAndQuantity 
              item={item} 
              isEditing={false}
              editedItem={item}
              onChange={() => {}}
              onSelectChange={() => {}}
            />

            <ItemCategory 
              item={item} 
              isEditing={false}
              editedItem={item} 
              onSelectChange={() => {}}
            />

            <ItemLocation 
              item={item} 
              isEditing={false}
              editedItem={item}
              onChange={() => {}}
              onCoordinateChange={() => {}}
            />

            <ItemAdditionalDetails item={item} />

            <ItemDescription 
              item={item} 
              isEditing={false}
              editedItem={item} 
              onChange={() => {}}
            />

            <QuickActions />
          </>
        )}
      </div>

      {/* Fix the type error by providing the required item prop */}
      {item && (
        <EditItemForm 
          isOpen={isEditModalOpen} 
          onClose={handleCloseEditModal} 
          item={item}
        />
      )}
    </div>
  );
};

export default InventoryDetail;
