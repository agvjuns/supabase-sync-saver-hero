
import L from 'leaflet';

// Fix for Leaflet marker icons not displaying
export const initializeLeafletIcons = () => {
  delete (L.Icon.Default.prototype as any)._getIconUrl;
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
    iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
  });
};

// Determine center and zoom based on items
export const getDefaultCenter = (
  selectedItem: any,
  items: any[]
): [number, number] => {
  if (selectedItem) {
    return [selectedItem.coordinates.lat, selectedItem.coordinates.lng];
  }
  if (items.length > 0) {
    return [items[0].coordinates.lat, items[0].coordinates.lng];
  }
  // Default to Florida, USA if no items
  return [27.9944024, -81.7602544]; // Florida center
};
