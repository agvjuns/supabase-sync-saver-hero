
import { useState } from 'react';
import { toast } from 'sonner';
import { InventoryItem } from '@/services/inventory/types';
import { geocodeAddress, reverseGeocode } from '@/components/inventory/forms/GeocodingService';

export const useLocationHandling = (editedItem: InventoryItem | null, setEditedItem: React.Dispatch<React.SetStateAction<InventoryItem | null>>) => {
  const [isGeocoding, setIsGeocoding] = useState(false);
  const [addressFound, setAddressFound] = useState<boolean | null>(null);
  const [isGettingLocation, setIsGettingLocation] = useState(false);

  const handleLocationChange = async (value: string) => {
    if (!editedItem || value.trim().length <= 3) return;
    
    setIsGeocoding(true);
    setAddressFound(null);
    
    try {
      console.log("Attempting to geocode address:", value);
      const result = await geocodeAddress(value);
      console.log("Geocoding result:", result);
      
      if (result.found) {
        setEditedItem(prev => 
          prev ? { 
            ...prev, 
            coordinates: { 
              lat: result.lat, 
              lng: result.lng 
            } 
          } : null
        );
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

  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      toast.error('Geolocation is not supported by your browser');
      return;
    }

    setIsGettingLocation(true);
    
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        
        if (editedItem) {
          const updatedCoordinates = { lat: latitude, lng: longitude };
          
          try {
            const result = await reverseGeocode(latitude, longitude);
            
            if (result.found && result.address) {
              setEditedItem({
                ...editedItem,
                coordinates: updatedCoordinates,
                location: result.address
              });
              toast.success('Address found for your location');
            } else {
              setEditedItem({
                ...editedItem,
                coordinates: updatedCoordinates,
                location: `Lat: ${latitude.toFixed(6)}, Lng: ${longitude.toFixed(6)}`
              });
              toast.info('Using coordinates as location (no address found)');
            }
          } catch (error) {
            console.error('Error reverse geocoding:', error);
            setEditedItem({
              ...editedItem,
              coordinates: updatedCoordinates,
              location: `Lat: ${latitude.toFixed(6)}, Lng: ${longitude.toFixed(6)}`
            });
            toast.error('Could not find address for your location');
          }
        }
        
        setIsGettingLocation(false);
        toast.success('Current location detected');
      },
      (error) => {
        console.error('Error getting current location:', error);
        setIsGettingLocation(false);
        
        switch (error.code) {
          case error.PERMISSION_DENIED:
            toast.error('Location permission denied. Please enable location services.');
            break;
          case error.POSITION_UNAVAILABLE:
            toast.error('Location information is unavailable.');
            break;
          case error.TIMEOUT:
            toast.error('Location request timed out.');
            break;
          default:
            toast.error('An error occurred while getting your location.');
        }
      },
      { 
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      }
    );
  };

  return {
    isGeocoding,
    addressFound,
    isGettingLocation,
    handleLocationChange,
    getCurrentLocation
  };
};
