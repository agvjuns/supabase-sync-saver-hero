
export type InventoryItem = {
  id: string;
  name: string;
  location: string;
  quantity: number;
  status: string;
  coordinates: { lat: number; lng: number };
  category: string;
  lastUpdated: string;
  description?: string;
  price: number;
  currency: string;
  uom: string; // Unit of Measurement
  sku?: string;
  minimumStock: number;
  supplierInfo?: string;
};

export type SupabaseInventoryItem = {
  id: string;
  name: string;
  location_name: string;
  quantity: number;
  status: string;
  latitude: number;
  longitude: number;
  category: string;
  updated_at: string;
  organization_id: string;
  created_by: string;
  updated_by: string;
  description?: string;
  price: number;
  currency: string;
  uom: string;
  sku?: string;
  minimum_stock: number;
  supplier_info?: string;
};

export type NewInventoryItem = Omit<InventoryItem, 'id' | 'lastUpdated'>;
export type UpdateInventoryItem = Partial<Omit<InventoryItem, 'id' | 'lastUpdated'>>;

