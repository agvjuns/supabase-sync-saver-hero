
import { InventoryItem } from '@/services/inventory/types';
import { debounce } from '@/components/inventory/forms/GeocodingService';

export const useFormFields = (
  editedItem: InventoryItem | null, 
  setEditedItem: React.Dispatch<React.SetStateAction<InventoryItem | null>>,
  handleLocationChange: (value: string) => Promise<void>
) => {
  const debouncedHandleLocationChange = debounce(handleLocationChange, 1000);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (!editedItem) return;
    const { name, value } = e.target;
    setEditedItem({ ...editedItem, [name]: value });
    
    if (name === 'location') {
      debouncedHandleLocationChange(value);
    }
  };

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>, field: string) => {
    if (!editedItem) return;
    const value = e.target.value ? parseFloat(e.target.value) : 0;
    setEditedItem({ ...editedItem, [field]: value });
  };

  const handleSelectChange = (value: string, field: string) => {
    if (!editedItem) return;
    setEditedItem({ ...editedItem, [field]: value });
  };

  const handleCoordinateChange = (value: string, coordinateKey: 'lat' | 'lng') => {
    if (!editedItem) return;
    const numValue = parseFloat(value);
    setEditedItem({
      ...editedItem,
      coordinates: {
        ...editedItem.coordinates,
        [coordinateKey]: isNaN(numValue) ? 0 : numValue
      }
    });
  };

  return {
    handleInputChange,
    handleNumberChange,
    handleSelectChange,
    handleCoordinateChange
  };
};
