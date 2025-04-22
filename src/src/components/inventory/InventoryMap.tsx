
import { useEffect, useRef, useState } from 'react';
import { InventoryItem } from '@/services/inventory/types';
import { Map as LeafletMap } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { initializeLeafletIcons, getDefaultCenter } from './map/utils';
import { MapContainerComponent } from './map/MapContainer';

const InventoryMap = ({ items, selectedItem, hoveredItem, onItemSelect }: {
  items: InventoryItem[];
  selectedItem: InventoryItem | null;
  hoveredItem: InventoryItem | null;
  onItemSelect: (item: InventoryItem) => void;
}) => {
  const [isMapLoaded, setIsMapLoaded] = useState(false);
  const mapRef = useRef<LeafletMap | null>(null);

  // Fix for Leaflet marker icons not displaying
  useEffect(() => {
    initializeLeafletIcons();
  }, []);

  useEffect(() => {
    // Set map as loaded after a small delay to ensure smoother UI
    const timer = setTimeout(() => {
      setIsMapLoaded(true);
    }, 300);

    return () => clearTimeout(timer);
  }, []);

  const handleMapReady = (mapInstance: LeafletMap) => {
    mapRef.current = mapInstance;
    mapInstance.invalidateSize();
  };

  return (
    <div className="h-full flex flex-col overflow-hidden border-t md:border-t-0 md:border-l border-border relative bg-muted/20">
      <div className="p-4 border-b border-border bg-background">
        <h3 className="font-medium">Location Map</h3>
      </div>
      
      <div className="flex-grow relative overflow-hidden">
        <MapContainerComponent
          items={items}
          selectedItem={selectedItem}
          hoveredItem={hoveredItem}
          onItemSelect={onItemSelect}
          isMapLoaded={isMapLoaded}
          setIsMapLoaded={setIsMapLoaded}
          mapKey={`map-${items.length}-${selectedItem?.id || 'none'}`}
          defaultCenter={getDefaultCenter(selectedItem, items)}
          onMapReady={handleMapReady}
        />
      </div>
    </div>
  );
};

export default InventoryMap;
