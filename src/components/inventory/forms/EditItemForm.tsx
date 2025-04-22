import { useEffect, useState, useCallback } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import EditItemFormContent from './edit/EditItemFormContent';
import { InventoryItem } from '@/services/inventory/types';
import { useForm } from 'react-hook-form';
import { FormValues, FormSchema } from './AddItemFormTypes';
import { zodResolver } from '@hookform/resolvers/zod';
import { geocodeAddress, debounce } from './GeocodingService';

interface EditItemFormProps {
  isOpen: boolean;
  onClose: () => void;
  item: InventoryItem | null;
  categories: string[];
}

const EditItemForm = ({ isOpen, onClose, item, categories }: EditItemFormProps) => {
  const form = useForm<FormValues>({
    resolver: zodResolver(FormSchema),
    defaultValues: item
      ? {
          name: item.name,
          category: item.category,
          quantity: item.quantity,
          status: item.status,
          location: item.location,
          coordinates: item.coordinates,
          description: item.description,
          price: item.price,
          currency: item.currency,
          uom: item.uom,
          sku: item.sku,
          minimumStock: item.minimumStock,
          supplierInfo: item.supplierInfo,
        }
      : {},
  });

  // Geocoding state for location section
  const [isGeocoding, setIsGeocoding] = useState(false);
  const [addressFound, setAddressFound] = useState<boolean | null>(null);

  // Debounced geocoding handler
  const handleLocationChange = useCallback(
    debounce(async (value: string) => {
      if (value.trim().length <= 3) return;
      setIsGeocoding(true);
      setAddressFound(null);
      try {
        const result = await geocodeAddress(value);
        if (result.found) {
          form.setValue('coordinates.lat', result.lat);
          form.setValue('coordinates.lng', result.lng);
          setAddressFound(true);
        } else {
          setAddressFound(false);
        }
      } catch {
        setAddressFound(false);
      } finally {
        setIsGeocoding(false);
      }
    }, 1000),
    [form]
  );

  useEffect(() => {
    if (item) {
      form.reset({
        name: item.name,
        category: item.category,
        quantity: item.quantity,
        status: item.status,
        location: item.location,
        coordinates: item.coordinates,
        description: item.description,
        price: item.price,
        currency: item.currency,
        uom: item.uom,
        sku: item.sku,
        minimumStock: item.minimumStock,
        supplierInfo: item.supplierInfo,
      });
    }
  }, [item, form]);

  const handleSave = async () => {
    // Implement save logic here, e.g., call API and close modal on success
    onClose();
  };

  // Generic onChange handler for text/textarea fields
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    form.setValue(name as keyof FormValues, value);
    if (name === 'location') {
      handleLocationChange(value);
    }
  };

  if (!item) return null;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-2xl p-0 overflow-hidden bg-white z-[1200]">
        <DialogHeader className="px-6 py-4 border-b bg-white">
          <DialogTitle className="text-xl font-semibold">Edit Item</DialogTitle>
        </DialogHeader>
        <EditItemFormContent
          form={form}
          editedItem={item}
          onSave={handleSave}
          isSubmitting={form.formState.isSubmitting}
          categories={categories}
          onChange={handleChange}
          handleSelectChange={(value, field) => form.setValue(field as keyof FormValues, value)}
          isGeocoding={isGeocoding}
          addressFound={addressFound}
          onLocationChange={handleLocationChange}
        />
      </DialogContent>
    </Dialog>
  );
};

export default EditItemForm;
