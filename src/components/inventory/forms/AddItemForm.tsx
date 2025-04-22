import React, { useState, useCallback, useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { useInventory } from '@/hooks/useInventory';
import { BasicInfoSection, QuantityStatusSection, LocationSection, DescriptionSection } from './sections';
import { AdditionalFieldsSection } from './additionalFields';
import FormActions from './FormActions';
import { FormSchema, FormValues, AddItemFormProps } from './AddItemFormTypes';
import { geocodeAddress, reverseGeocode, debounce } from './GeocodingService';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter 
} from '@/components/ui/dialog';
import { Form } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

const AddItemForm = ({ isOpen, onClose, categories }: AddItemFormProps) => {
  const [isGeocoding, setIsGeocoding] = useState(false);
  const [addressFound, setAddressFound] = useState<boolean | null>(null);
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  
  const { addItem } = useInventory();
  
  useEffect(() => {
    const event = new CustomEvent('addFormStateChange', { 
      detail: { isOpen } 
    });
    window.dispatchEvent(event);
    
    return () => {
      if (isOpen) {
        const closeEvent = new CustomEvent('addFormStateChange', { 
          detail: { isOpen: false } 
        });
        window.dispatchEvent(closeEvent);
      }
    };
  }, [isOpen]);
  
  const form = useForm<FormValues>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: '',
      category: 'Uncategorized',
      quantity: 1,
      status: 'In Stock',
      location: '',
      coordinates: { lat: 0, lng: 0 },
      description: '',
      price: 0,
      currency: 'USD',
      uom: 'EACH',
      sku: '',
      minimumStock: 0,
      supplierInfo: ''
    }
  });
  
  const handleLocationChange = async (value: string) => {
    if (value.trim().length <= 3) return;
    
    setIsGeocoding(true);
    setAddressFound(null);
    
    try {
      const result = await geocodeAddress(value);
      
      if (result.found) {
        form.setValue('coordinates.lat', result.lat);
        form.setValue('coordinates.lng', result.lng);
        setAddressFound(true);
        toast.success('Address coordinates found');
      } else {
        setAddressFound(false);
        toast.error('Address not found');
      }
    } catch (error) {
      console.error('Error geocoding address:', error);
      setAddressFound(false);
      toast.error('Failed to geocode address');
    } finally {
      setIsGeocoding(false);
    }
  };
  
  const debouncedHandleLocationChange = useCallback(debounce(handleLocationChange, 1000), []);
  
  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      toast.error('Geolocation is not supported by your browser');
      return;
    }
    
    setIsGettingLocation(true);
    
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        
        form.setValue('coordinates', { lat: latitude, lng: longitude });
        
        try {
          const result = await reverseGeocode(latitude, longitude);
          
          if (result.found && result.address) {
            form.setValue('location', result.address);
            toast.success('Address found for your location');
          } else {
            form.setValue('location', `Lat: ${latitude.toFixed(6)}, Lng: ${longitude.toFixed(6)}`);
            toast.info('Using coordinates as location (no address found)');
          }
        } catch (error) {
          console.error('Error reverse geocoding:', error);
          form.setValue('location', `Lat: ${latitude.toFixed(6)}, Lng: ${longitude.toFixed(6)}`);
          toast.error('Could not find address for your location');
        }
        
        setIsGettingLocation(false);
        toast.success('Current location detected');
      },
      (error) => {
        console.error('Error getting current location:', error);
        setIsGettingLocation(false);
        
        switch (error.code) {
          case error.PERMISSION_DENIED:
            toast.error('Location permission denied');
            break;
          case error.POSITION_UNAVAILABLE:
            toast.error('Location information unavailable');
            break;
          case error.TIMEOUT:
            toast.error('Location request timed out');
            break;
          default:
            toast.error('Error getting location');
        }
      }
    );
  };
  
  const onSubmit = async (data: FormValues) => {
    try {
      const newItemData = {
        name: data.name,
        category: data.category,
        quantity: data.quantity,
        status: data.status,
        location: data.location,
        coordinates: {
          lat: data.coordinates.lat,
          lng: data.coordinates.lng
        },
        description: data.description || '',
        price: data.price,
        currency: data.currency,
        uom: data.uom,
        sku: data.sku || '',
        minimumStock: data.minimumStock,
        supplierInfo: data.supplierInfo || ''
      };
      
      await addItem(newItemData);
      form.reset();
      onClose();
    } catch (error) {
      console.error('Failed to add item:', error);
      toast.error('Failed to add item');
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-2xl p-0 overflow-hidden bg-white">
        <DialogHeader className="px-6 py-4 border-b bg-white">
          <DialogTitle className="text-xl font-semibold">Add New Item</DialogTitle>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 px-6 py-4 max-h-[70vh] overflow-y-auto bg-white">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-4">
                <BasicInfoSection form={form} categories={categories} />
                <QuantityStatusSection form={form} />
                <LocationSection 
                  form={form} 
                  isGeocoding={isGeocoding}
                  addressFound={addressFound}
                  onLocationChange={debouncedHandleLocationChange}
                  getCurrentLocation={getCurrentLocation}
                  isGettingLocation={isGettingLocation}
                />
                <DescriptionSection form={form} />
              </div>
              
              <div>
                <AdditionalFieldsSection form={form} />
              </div>
            </div>
            
            <FormActions 
              isSubmitting={form.formState.isSubmitting} 
              onCancel={onClose} 
            />
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default AddItemForm;
