
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
        // Focus on selected item with proper zoom level
        map.setView(
          [selectedItem.coordinates.lat, selectedItem.coordinates.lng],
          14,  // Specific zoom level for better focus
          {
            animate: true,
            duration: 0.5, // Smooth animation
            noMoveStart: true // Prevents unwanted events
          }
        );
      } else if (items.length > 0) {
        // Create a bounds object for all items
        const bounds = L.latLngBounds(
          items.map(item => [item.coordinates.lat, item.coordinates.lng])
        );
        
        // Only adjust if bounds are valid
        if (bounds.isValid()) {
          // Add padding to ensure markers are visible
          map.fitBounds(bounds, { 
            padding: [50, 50],
            animate: true,
            duration: 0.5,
            maxZoom: 12 // Prevent zooming in too much
          });
        }
      }
      
      // Safely call invalidateSize with fixed timing
      map.invalidateSize({ animate: true });
    }, 300);
    
    return () => clearTimeout(timer);
  }, [selectedItem, items, map]);
  
  return null;
};

export default MapUpdater;
