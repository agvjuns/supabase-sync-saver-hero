
import { useEffect, useState } from 'react';
import { TileLayer, MapContainer as LeafletMapContainer, useMap } from 'react-leaflet';
import { InventoryItem } from '@/services/inventory/types';
import { MapMarker } from './MapMarker';
import MapUpdater from './MapUpdater';
import { Map as LeafletMap } from 'leaflet';

// Create a wrapper component to access the map instance
const MapInitializer = ({ onMapReady }: { onMapReady: (map: LeafletMap) => void }) => {
  const map = useMap();
  
  useEffect(() => {
    onMapReady(map);
  }, [map, onMapReady]);
  
  return null;
};

type MapContainerProps = {
  items: InventoryItem[];
  selectedItem: InventoryItem | null;
  hoveredItem: InventoryItem | null;
  onItemSelect: (item: InventoryItem) => void;
  isMapLoaded: boolean;
  setIsMapLoaded: (isLoaded: boolean) => void;
  mapKey: string;
  defaultCenter: [number, number];
  onMapReady: (mapInstance: LeafletMap) => void;
};

export const MapContainerComponent = ({
  items,
  selectedItem,
  hoveredItem,
  onItemSelect,
  isMapLoaded,
  mapKey,
  defaultCenter,
  onMapReady
}: MapContainerProps) => {
  return (
    <div className="h-full">
      {!isMapLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-background/80 z-50">
          <div className="flex flex-col items-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            <span className="mt-4 text-muted-foreground">Loading map...</span>
          </div>
        </div>
      )}

      <LeafletMapContainer
        key={mapKey}
        center={defaultCenter}
        zoom={items.length > 0 ? 10 : 7}
        style={{ height: '100%', width: '100%' }}
        zoomControl={true}
        attributionControl={true}
      >
        {/* Use MapInitializer to get map instance */}
        <MapInitializer onMapReady={onMapReady} />
        
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {/* Render markers for all items */}
        {items.map(item => (
          <MapMarker
            key={item.id}
            item={item}
            isSelected={selectedItem?.id === item.id}
            isHovered={hoveredItem?.id === item.id}
            onItemSelect={onItemSelect}
          />
        ))}
        
        {/* Component to handle map updates */}
        <MapUpdater selectedItem={selectedItem} items={items} />
      </LeafletMapContainer>

      <div className="absolute bottom-2 right-2 text-xs text-muted-foreground bg-white/80 px-2 py-1 rounded">
        Map data © OpenStreetMap contributors
      </div>
    </div>
  );
};
