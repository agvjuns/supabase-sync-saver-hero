
import { useState } from 'react';
import { InventoryItem } from '@/services/inventory/types';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { MapPin, Loader2 } from 'lucide-react';

interface ItemLocationProps {
  item: InventoryItem;
  isEditing: boolean;
  editedItem: InventoryItem;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onCoordinateChange: (value: string, field: 'lat' | 'lng') => void;
}

const ItemLocation = ({ 
  item,
  isEditing,
  editedItem,
  onChange,
  onCoordinateChange
}: ItemLocationProps) => {
  const [isMapExpanded, setIsMapExpanded] = useState(false);
  
  const formatCoordinate = (coord: number) => {
    return coord.toFixed(6);
  };
  
  const handleMapToggle = () => {
    setIsMapExpanded(!isMapExpanded);
  };

  // Ensure we don't try to pass a complex object to the onChange handler
  const handleValueChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    // Only pass the event if it's a simple input change
    if (e.target && typeof e.target.value === 'string') {
      onChange(e);
    }
  };
  
  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex justify-between items-start">
          <div className="space-y-1">
            <h3 className="text-lg font-medium flex items-center">
              <MapPin className="h-5 w-5 mr-1 text-blue-500" />
              Location
            </h3>
            {isEditing ? (
              <div className="space-y-2">
                <div>
                  <Label htmlFor="location" className="sr-only">Location</Label>
                  <Input
                    id="location"
                    name="location"
                    value={editedItem.location}
                    onChange={handleValueChange}
                    placeholder="Enter location"
                    className="w-full"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <Label htmlFor="lat" className="text-xs text-gray-500">Latitude</Label>
                    <Input
                      id="lat"
                      type="number"
                      step="0.000001"
                      value={editedItem.coordinates.lat}
                      onChange={(e) => onCoordinateChange(e.target.value, 'lat')}
                      className="w-full"
                    />
                  </div>
                  <div>
                    <Label htmlFor="lng" className="text-xs text-gray-500">Longitude</Label>
                    <Input
                      id="lng"
                      type="number"
                      step="0.000001"
                      value={editedItem.coordinates.lng}
                      onChange={(e) => onCoordinateChange(e.target.value, 'lng')}
                      className="w-full"
                    />
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-1">
                <p className="text-sm">{item.location}</p>
                <p className="text-xs text-gray-500">
                  Coordinates: {formatCoordinate(item.coordinates.lat)}, {formatCoordinate(item.coordinates.lng)}
                </p>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ItemLocation;
