
import { useEffect } from 'react';
import { useMap } from 'react-leaflet';
import L from 'leaflet';
import { InventoryItem } from '@/services/inventory/types';

type MapUpdaterProps = { 
  selectedItem: InventoryItem | null;
  items: InventoryItem[];
};

const MapUpdater = ({ selectedItem, items }: MapUpdaterProps) => {
  const map = useMap();
  
  useEffect(() => {
    if (!map) return;
    
    // Use a small delay to ensure map is ready
    const timer = setTimeout(() => {
      if (selectedItem) {
        map.setView(
          [selectedItem.coordinates.lat, selectedItem.coordinates.lng],
          13
        );
      } else if (items.length > 0) {
        // Create a bounds object for all items
        const bounds = L.latLngBounds(
          items.map(item => [item.coordinates.lat, item.coordinates.lng])
        );
        // Fit the map to show all markers with some padding
        map.fitBounds(bounds, { padding: [50, 50] });
      }
      
      // Safely call invalidateSize
      map.invalidateSize({ animate: false });
    }, 300);
    
    return () => clearTimeout(timer);
  }, [selectedItem, items, map]);

  return null;
};

export default MapUpdater;
