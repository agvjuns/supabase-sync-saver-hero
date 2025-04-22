
import L from 'leaflet';
import { Marker, Popup } from 'react-leaflet';
import { InventoryItem } from '@/services/inventory/types';

type MapMarkerProps = {
  item: InventoryItem;
  isSelected: boolean;
  isHovered: boolean;
  onItemSelect: (item: InventoryItem) => void;
};

export const MapMarker = ({ item, isSelected, isHovered, onItemSelect }: MapMarkerProps) => {
  // Create custom markers based on item status
  const getMarkerIcon = () => {
    let color = 'blue';
    
    if (!isSelected && !isHovered) {
      switch (item.status) {
        case 'In Stock':
          color = 'green';
          break;
        case 'Low Stock':
          color = 'orange';
          break;
        case 'Out of Stock':
          color = 'red';
          break;
        default:
          color = 'blue';
      }
    }
    
    // Size based on selection/hover state
    const size = isSelected ? 48 : isHovered ? 42 : 36;
    
    // Create an SVG map pin
    const svgIcon = `
      <svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 22c-5.523 0-10-4.477-10-10s4.477-10 10-10 10 4.477 10 10-4.477 10-10 10z" fill="white" stroke="white" stroke-width="0.5"/>
        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" fill="#${getColorHex(color)}" stroke="white" stroke-width="1.5"/>
        <circle cx="12" cy="10" r="3" fill="white" stroke="white" stroke-width="0.5"/>
      </svg>
    `;
    
    return L.divIcon({
      className: 'custom-pin-icon',
      html: svgIcon,
      iconSize: [size, size],
      iconAnchor: [size/2, size], // Bottom middle of the icon is the anchor point
      popupAnchor: [0, -size] // Popup appears above the icon
    });
  };
  
  return (
    <Marker
      key={item.id}
      position={[item.coordinates.lat, item.coordinates.lng]}
      icon={getMarkerIcon()}
      eventHandlers={{
        click: () => onItemSelect(item),
      }}
    >
      <Popup>
        <div className="p-1">
          <h4 className="font-medium">{item.name}</h4>
          <p className="text-sm">{item.location}</p>
          <p className="text-sm">Quantity: {item.quantity}</p>
          <p className="text-sm">Status: {item.status}</p>
        </div>
      </Popup>
    </Marker>
  );
};

// Helper function to get color hex codes
const getColorHex = (color: string): string => {
  switch (color) {
    case 'green': return '22c55e';
    case 'orange': return 'f59e0b';
    case 'red': return 'ef4444';
    case 'blue': return '3b82f6';
    default: return '3b82f6';
  }
};
