
import { useState } from 'react';
import { useInventory } from '@/hooks/useInventory';
import { InventoryItem, UpdateInventoryItem } from '@/services/inventory/types';
import { toast } from 'sonner';

export const useItemActions = (onClose: () => void) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { updateItem } = useInventory();

  const handleSave = async (editedItem: InventoryItem | null) => {
    if (!editedItem) return;
    
    try {
      setIsSubmitting(true);
      await updateItem(editedItem.id, {
        name: editedItem.name,
        location: editedItem.location,
        quantity: editedItem.quantity,
        status: editedItem.status,
        category: editedItem.category,
        coordinates: editedItem.coordinates,
        description: editedItem.description,
        price: editedItem.price,
        currency: editedItem.currency,
        uom: editedItem.uom,
        sku: editedItem.sku,
        minimumStock: editedItem.minimumStock,
        supplierInfo: editedItem.supplierInfo
      });
      onClose();
      toast.success('Item updated successfully');
    } catch (error) {
      console.error('Error updating item:', error);
      toast.error('Failed to update item');
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    isSubmitting,
    handleSave
  };
};
