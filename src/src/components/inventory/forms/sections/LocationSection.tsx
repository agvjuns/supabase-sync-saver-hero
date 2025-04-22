
import { 
  FormField, 
  FormItem, 
  FormLabel, 
  FormControl, 
  FormMessage 
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Loader2, MapPin } from 'lucide-react';
import { UseFormReturn } from 'react-hook-form';
import { FormValues } from '../AddItemFormTypes';
import { Button } from '@/components/ui/button';

interface LocationSectionProps {
  form: UseFormReturn<FormValues>;
  isGeocoding: boolean;
  addressFound: boolean | null;
  onLocationChange: (value: string) => void;
  getCurrentLocation?: () => void;
  isGettingLocation?: boolean;
}

export const LocationSection = ({ 
  form, 
  isGeocoding, 
  addressFound, 
  onLocationChange, 
  getCurrentLocation,
  isGettingLocation = false
}: LocationSectionProps) => {
  return (
    <>
      <FormField
        control={form.control}
        name="location"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-gray-700 font-medium">Location</FormLabel>
            <div className="space-y-1">
              <FormControl>
                <Input 
                  {...field} 
                  placeholder="Storage location" 
                  className="border-gray-300 focus:border-gray-400"
                  onChange={(e) => {
                    field.onChange(e);
                    if (e.target.value.trim()) {
                      onLocationChange(e.target.value);
                    }
                  }}
                  onBlur={(e) => {
                    if (e.target.value.trim() && addressFound === null) {
                      onLocationChange(e.target.value);
                    }
                  }}
                />
              </FormControl>
              
              {getCurrentLocation && (
                <Button 
                  type="button" 
                  onClick={getCurrentLocation} 
                  disabled={isGettingLocation}
                  className="px-3 py-1 h-7 text-xs text-white bg-green-500 hover:bg-green-600 rounded-full shadow-sm"
                  variant="outline"
                >
                  {isGettingLocation ? (
                    <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                  ) : (
                    <MapPin className="h-3 w-3 mr-1" />
                  )}
                  {isGettingLocation ? 'Getting Location...' : 'Get Current Location'}
                </Button>
              )}
            </div>
            
            {isGeocoding && (
              <div className="text-sm text-muted-foreground flex items-center mt-1">
                <Loader2 className="mr-2 h-3 w-3 animate-spin" />
                Finding address...
              </div>
            )}
            {addressFound === true && !isGeocoding && (
              <div className="text-sm text-green-600 mt-1">
                Address found
              </div>
            )}
            {addressFound === false && !isGeocoding && (
              <div className="text-sm text-red-600 mt-1">
                Address not found, please enter coordinates manually
              </div>
            )}
            <FormMessage />
          </FormItem>
        )}
      />
      
      <div className="grid grid-cols-2 gap-2">
        <FormField
          control={form.control}
          name="coordinates.lat"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-gray-700 font-medium">Latitude</FormLabel>
              <FormControl>
                <Input 
                  type="number" 
                  step="0.000001"
                  value={field.value}
                  className="border-gray-300 focus:border-gray-400"
                  onChange={e => {
                    const lat = parseFloat(e.target.value) || 0;
                    form.setValue('coordinates', {
                      ...form.getValues('coordinates'),
                      lat
                    });
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="coordinates.lng"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-gray-700 font-medium">Longitude</FormLabel>
              <FormControl>
                <Input 
                  type="number" 
                  step="0.000001"
                  value={field.value}
                  className="border-gray-300 focus:border-gray-400"
                  onChange={e => {
                    const lng = parseFloat(e.target.value) || 0;
                    form.setValue('coordinates', {
                      ...form.getValues('coordinates'),
                      lng
                    });
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </>
  );
};

export default LocationSection;
