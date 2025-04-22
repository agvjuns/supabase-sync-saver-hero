
import { 
  EditBasicInfoSection,
  EditQuantityStatusSection,
  EditLocationSection,
  EditDescriptionSection,
  EditPriceAndCurrencySection,
  EditUomAndSkuSection,
  EditMinStockAndSupplierSection
} from './sections';
import EditFormActions from './EditFormActions';
import { InventoryItem } from '@/services/inventory/types';

interface EditItemFormContentProps {
  editedItem: InventoryItem;
  isSubmitting: boolean;
  isGeocoding: boolean;
  addressFound: boolean | null;
  isGettingLocation: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleNumberChange: (e: React.ChangeEvent<HTMLInputElement>, field: string) => void;
  handleSelectChange: (value: string, field: string) => void;
  handleCoordinateChange: (value: string, coordinateKey: 'lat' | 'lng') => void;
  getCurrentLocation: () => void;
  onCancel: () => void;
  onSave: () => void;
}

const EditItemFormContent = ({
  editedItem,
  isSubmitting,
  isGeocoding,
  addressFound,
  isGettingLocation,
  onChange,
  handleNumberChange,
  handleSelectChange,
  handleCoordinateChange,
  getCurrentLocation,
  onCancel,
  onSave
}: EditItemFormContentProps) => {
  return (
    <>
      <div className="flex-grow overflow-y-auto p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-6">
            <EditBasicInfoSection 
              editedItem={editedItem}
              onChange={onChange}
              handleSelectChange={handleSelectChange}
            />
            
            <EditQuantityStatusSection 
              editedItem={editedItem}
              onChange={onChange}
              handleSelectChange={handleSelectChange}
            />
            
            <EditLocationSection 
              editedItem={editedItem}
              onChange={onChange}
              handleCoordinateChange={handleCoordinateChange}
              isGeocoding={isGeocoding}
              addressFound={addressFound}
              getCurrentLocation={getCurrentLocation}
              isGettingLocation={isGettingLocation}
            />
          </div>
          
          <div className="space-y-6">
            <EditDescriptionSection 
              editedItem={editedItem}
              onChange={onChange}
            />
            
            <EditPriceAndCurrencySection 
              editedItem={editedItem}
              handleNumberChange={handleNumberChange}
              handleSelectChange={handleSelectChange}
            />
            
            <EditUomAndSkuSection 
              editedItem={editedItem}
              onChange={onChange}
              handleSelectChange={handleSelectChange}
            />
            
            <EditMinStockAndSupplierSection 
              editedItem={editedItem}
              onChange={onChange}
              handleNumberChange={handleNumberChange}
            />
          </div>
        </div>
      </div>
      
      <EditFormActions 
        onCancel={onCancel} 
        onSave={onSave} 
        isSaving={isSubmitting}
      />
    </>
  );
};

export default EditItemFormContent;
