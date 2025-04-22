import EditBasicInfoSection from './sections/EditBasicInfoSection';
import { QuantityStatusSection } from '../sections/QuantityStatusSection';
import { LocationSection } from '../sections/LocationSection';
import { DescriptionSection } from '../sections/DescriptionSection';
import { AdditionalFieldsSection } from '../additionalFields';
import { UseFormReturn } from 'react-hook-form';
import { FormValues } from '../AddItemFormTypes';
import { Form } from '@/components/ui/form';
import { InventoryItem } from '@/services/inventory/types'; // Import InventoryItem type

interface EditItemFormContentProps {
  form: UseFormReturn<FormValues>;
  editedItem: InventoryItem; // Use InventoryItem type instead of any
  onSave: () => Promise<void>;
  isSubmitting: boolean;
  categories: string[];
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleSelectChange: (value: string, field: string) => void;
  isGeocoding: boolean;
  addressFound: boolean | null;
  onLocationChange: (value: string) => void;
}

const EditItemFormContent = ({
  form,
  editedItem,
  onSave,
  isSubmitting,
  categories,
  onChange,
  handleSelectChange,
  isGeocoding,
  addressFound,
  onLocationChange,
}: EditItemFormContentProps) => {
  return (
    <Form {...form}>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          onSave();
        }}
        className="space-y-4 px-6 py-4 max-h-[70vh] overflow-y-auto bg-white"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-4">
            <EditBasicInfoSection
              editedItem={editedItem}
              onChange={onChange}
              handleSelectChange={handleSelectChange}
              categories={categories}
            />
            <QuantityStatusSection form={form} />
            <LocationSection
              form={form}
              isGeocoding={isGeocoding}
              addressFound={addressFound}
              onLocationChange={onLocationChange}
            />
            <DescriptionSection form={form} />
          </div>
          <div>
            <AdditionalFieldsSection form={form} />
          </div>
        </div>
        <div className="flex justify-end">
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
            disabled={isSubmitting}
          >
            Save Changes
          </button>
        </div>
      </form>
    </Form>
  );
};

export default EditItemFormContent;
