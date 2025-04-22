
import { Button } from '@/components/ui/button';
import { ArrowLeft, Edit } from 'lucide-react';
import { InventoryItem } from '@/services/inventory/types';
import InventoryDetail from './InventoryDetail';
import { useState } from 'react';
import EditItemForm from './forms/EditItemForm';

interface MobileDetailViewProps {
  selectedItem: InventoryItem;
  onClose: () => void;
}

const MobileDetailView = ({ selectedItem, onClose }: MobileDetailViewProps) => {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const handleEdit = () => {
    setIsEditModalOpen(true);
  };

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
  };

  return (
    <>
      <div className="mb-4 px-4 flex items-center justify-between">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={onClose}
          className="flex items-center text-muted-foreground"
        >
          <ArrowLeft className="h-4 w-4 mr-1" /> Back to list
        </Button>
        
        <Button 
          size="sm" 
          variant="outline" 
          onClick={handleEdit}
          className="border-indigo-200 text-indigo-700 hover:bg-indigo-50"
        >
          <Edit className="h-4 w-4 mr-1" />
          Edit
        </Button>
      </div>
      <div className="flex-grow">
        <InventoryDetail 
          item={selectedItem} 
          onClose={onClose}
          isEditing={false}
        />
      </div>

      {/* Edit Item Modal */}
      <EditItemForm 
        isOpen={isEditModalOpen} 
        onClose={handleCloseEditModal} 
        item={selectedItem}
      />
    </>
  );
};

export default MobileDetailView;
