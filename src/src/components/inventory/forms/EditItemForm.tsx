
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import EditItemFormContent from './edit/EditItemFormContent';
import { InventoryItem } from '@/services/inventory/types';
import { useEditItemForm } from '@/hooks/useEditItemForm';

interface EditItemFormProps {
  isOpen: boolean;
  onClose: () => void;
  item: InventoryItem;
}

const EditItemForm = ({ isOpen, onClose, item }: EditItemFormProps) => {
  const {
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
    handleSave
  } = useEditItemForm(item, onClose);

  if (!editedItem) return null;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-3xl h-[80vh] flex flex-col p-0 overflow-hidden bg-white rounded-lg">
        <DialogTitle className="px-6 py-4 border-b text-xl font-semibold">
          Edit Item
        </DialogTitle>
        
        <EditItemFormContent
          editedItem={editedItem}
          isSubmitting={isSubmitting}
          isGeocoding={isGeocoding}
          addressFound={addressFound}
          isGettingLocation={isGettingLocation}
          onChange={handleInputChange}
          handleNumberChange={handleNumberChange}
          handleSelectChange={handleSelectChange}
          handleCoordinateChange={handleCoordinateChange}
          getCurrentLocation={getCurrentLocation}
          onCancel={onClose}
          onSave={handleSave}
        />
      </DialogContent>
    </Dialog>
  );
};

export default EditItemForm;
