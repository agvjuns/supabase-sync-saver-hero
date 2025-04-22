
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Loader2, MapPin } from 'lucide-react';
import { InventoryItem } from '@/services/inventory/types';
import { Button } from '@/components/ui/button';

interface LocationSectionProps {
  editedItem: InventoryItem;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleCoordinateChange: (value: string, coordinateKey: 'lat' | 'lng') => void;
  isGeocoding: boolean;
  addressFound: boolean | null;
  getCurrentLocation?: () => void;
  isGettingLocation?: boolean;
}

export const EditLocationSection = ({ 
  editedItem, 
  onChange, 
  handleCoordinateChange,
  isGeocoding,
  addressFound,
  getCurrentLocation,
  isGettingLocation = false
}: LocationSectionProps) => {
  return (
    <div className="space-y-1">
      <Label htmlFor="location" className="text-gray-700">Location</Label>
      <Input
        id="location"
        name="location"
        value={editedItem.location}
        onChange={onChange}
        className="border-gray-300 focus:border-blue-400"
      />
      
      {getCurrentLocation && (
        <Button 
          type="button" 
          onClick={getCurrentLocation} 
          disabled={isGettingLocation}
          className="px-3 py-1 h-7 text-xs text-white bg-green-500 hover:bg-green-600 rounded-full shadow-sm mt-1"
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
      
      <div className="grid grid-cols-2 gap-2 mt-1">
        <div>
          <Label htmlFor="lat" className="text-gray-700">Latitude</Label>
          <Input
            id="lat"
            name="lat"
            type="number"
            step="0.000001"
            value={editedItem.coordinates.lat}
            onChange={(e) => handleCoordinateChange(e.target.value, 'lat')}
            className="border-gray-300 focus:border-blue-400"
          />
        </div>
        <div>
          <Label htmlFor="lng" className="text-gray-700">Longitude</Label>
          <Input
            id="lng"
            name="lng"
            type="number"
            step="0.000001"
            value={editedItem.coordinates.lng}
            onChange={(e) => handleCoordinateChange(e.target.value, 'lng')}
            className="border-gray-300 focus:border-blue-400"
          />
        </div>
      </div>
    </div>
  );
};

export default EditLocationSection;
