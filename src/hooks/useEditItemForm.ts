
import { useState, useEffect } from 'react';
import { InventoryItem } from '@/services/inventory/types';
import { useLocationHandling } from './inventory/useLocationHandling';
import { useFormFields } from './inventory/useFormFields';
import { useItemActions } from './inventory/useItemActions';

export const useEditItemForm = (initialItem: InventoryItem, onClose: () => void) => {
  const [editedItem, setEditedItem] = useState<InventoryItem>(initialItem);

  // Update edited item when input item changes
  useEffect(() => {
    if (initialItem && (!editedItem || editedItem.id !== initialItem.id)) {
      setEditedItem({...initialItem});
    }
  }, [initialItem, editedItem]);

  // Use our extracted hooks
  const {
    isGeocoding,
    addressFound,
    isGettingLocation,
    handleLocationChange,
    getCurrentLocation
  } = useLocationHandling(editedItem, setEditedItem);

  const {
    handleInputChange,
    handleNumberChange,
    handleSelectChange,
    handleCoordinateChange
  } = useFormFields(editedItem, setEditedItem, handleLocationChange);

  const {
    isSubmitting,
    handleSave
  } = useItemActions(onClose);

  // Create a wrapper for handleSave that passes the current editedItem
  const saveItem = () => handleSave(editedItem);

  return {
    editedItem,
    isSubmitting,
    isGeocoding,
    addressFound,
    isGettingLocation,
    handleInputChange,
    handleNumberChange,
    handleSelectChange,
    handleCoordinateChange,
    getCurrentLocation,
    handleSave: saveItem
  };
};
