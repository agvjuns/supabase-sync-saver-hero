
import { InventoryItem, SupabaseInventoryItem } from './types';

/**
 * Transform from Supabase format to application format
 */
export const transformItems = (data: SupabaseInventoryItem[] | null): InventoryItem[] => {
  if (!data) return [];
  
  return data.map(item => ({
    id: item.id,
    name: item.name,
    location: item.location_name || 'No location',
    quantity: item.quantity || 0,
    status: item.status || 'In Stock',
    coordinates: { 
      lat: parseFloat(String(item.latitude)) || 0, 
      lng: parseFloat(String(item.longitude)) || 0 
    },
    category: item.category || 'Uncategorized',
    lastUpdated: item.updated_at,
    description: item.description || '',
    price: parseFloat(String(item.price)) || 0,
    currency: item.currency || 'USD',
    uom: item.uom || 'Unit',
    sku: item.sku || '',
    minimumStock: item.minimum_stock || 0,
    supplierInfo: item.supplier_info || '',
  }));
};

