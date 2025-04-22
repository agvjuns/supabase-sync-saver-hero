
import { supabase } from '@/integrations/supabase/client';
import { InventoryItem, NewInventoryItem } from './types';
import * as XLSX from 'xlsx';
import { getUserOrganizationId } from './organizationService';
import { toast } from 'sonner';

// Helper to convert InventoryItem to a flattened object for export
const flattenItemForExport = (item: InventoryItem) => {
  return {
    id: item.id,
    name: item.name,
    location: item.location,
    latitude: item.coordinates.lat,
    longitude: item.coordinates.lng,
    quantity: item.quantity,
    status: item.status,
    category: item.category,
    description: item.description || '',
    price: item.price,
    currency: item.currency,
    uom: item.uom,
    sku: item.sku || '',
    minimumStock: item.minimumStock,
    supplierInfo: item.supplierInfo || '',
    lastUpdated: item.lastUpdated
  };
};

// Helper to parse imported data to NewInventoryItem format
const parseImportedItem = (row: any): Partial<NewInventoryItem> => {
  // Basic validation
  if (!row.name) {
    throw new Error('Name is required for all items');
  }

  return {
    name: row.name,
    location: row.location || 'Unknown',
    coordinates: {
      lat: parseFloat(row.latitude) || 0,
      lng: parseFloat(row.longitude) || 0
    },
    quantity: parseInt(row.quantity) || 0,
    status: row.status || 'In Stock',
    category: row.category || 'Uncategorized',
    description: row.description || '',
    price: parseFloat(row.price) || 0,
    currency: row.currency || 'USD',
    uom: row.uom || 'Unit',
    sku: row.sku || '',
    minimumStock: parseInt(row.minimumStock) || 0,
    supplierInfo: row.supplierInfo || ''
  };
};

// Export inventory to CSV
export const exportToCsv = (items: InventoryItem[]): string => {
  const flattenedItems = items.map(flattenItemForExport);
  
  // Create CSV header
  const headers = Object.keys(flattenedItems[0] || {}).join(',');
  
  // Create CSV rows
  const rows = flattenedItems.map(item => 
    Object.values(item).map(value => 
      // Wrap strings with commas in quotes
      typeof value === 'string' && value.includes(',') 
        ? `"${value}"` 
        : value
    ).join(',')
  );
  
  // Combine header and rows
  return [headers, ...rows].join('\n');
};

// Export inventory to Excel
export const exportToExcel = (items: InventoryItem[]): Uint8Array => {
  const flattenedItems = items.map(flattenItemForExport);
  
  // Create workbook and worksheet
  const worksheet = XLSX.utils.json_to_sheet(flattenedItems);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Inventory');
  
  // Generate Excel binary
  return XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
};

// Export inventory to JSON
export const exportToJson = (items: InventoryItem[]): string => {
  const flattenedItems = items.map(flattenItemForExport);
  return JSON.stringify(flattenedItems, null, 2);
};

// Download file helper
export const downloadFile = (data: string | Uint8Array, filename: string) => {
  const blob = new Blob(
    [data], 
    { type: filename.endsWith('.csv') 
        ? 'text/csv;charset=utf-8;' 
        : filename.endsWith('.xlsx') 
          ? 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
          : 'application/json'
    }
  );
  
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

// Import from CSV/Excel/JSON
export const importFromFile = async (
  file: File, 
  userId: string, 
  onProgress?: (progress: number) => void
): Promise<number> => {
  try {
    let data: any[] = [];
    
    // Read file based on type
    if (file.name.endsWith('.csv') || file.name.endsWith('.xlsx')) {
      const arrayBuffer = await file.arrayBuffer();
      const workbook = XLSX.read(arrayBuffer);
      const firstSheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[firstSheetName];
      data = XLSX.utils.sheet_to_json(worksheet);
    } else if (file.name.endsWith('.json')) {
      const text = await file.text();
      data = JSON.parse(text);
    } else {
      throw new Error('Unsupported file format. Please use CSV, Excel, or JSON.');
    }
    
    if (!data || !data.length) {
      throw new Error('No data found in the file');
    }
    
    // Get organization ID
    const organizationId = await getUserOrganizationId(userId);
    if (!organizationId) {
      throw new Error('Could not determine organization');
    }
    
    // Process items in batches for better UX with large imports
    const batchSize = 25;
    let imported = 0;
    
    for (let i = 0; i < data.length; i += batchSize) {
      const batch = data.slice(i, i + batchSize);
      
      // Map to proper format and insert
      const importBatch = batch.map(row => {
        try {
          const parsedItem = parseImportedItem(row);
          return {
            name: parsedItem.name || 'Unknown Item',
            location_name: parsedItem.location,
            latitude: parsedItem.coordinates?.lat,
            longitude: parsedItem.coordinates?.lng,
            quantity: parsedItem.quantity,
            status: parsedItem.status,
            category: parsedItem.category,
            description: parsedItem.description,
            price: parsedItem.price,
            currency: parsedItem.currency,
            uom: parsedItem.uom,
            sku: parsedItem.sku,
            minimum_stock: parsedItem.minimumStock,
            supplier_info: parsedItem.supplierInfo,
            created_by: userId,
            updated_by: userId,
            organization_id: organizationId
          };
        } catch (error) {
          console.error(`Error parsing item at index ${i}`, row, error);
          throw new Error(`Error at row ${i+1}: ${(error as Error).message}`);
        }
      });
      
      const { error } = await supabase
        .from('inventory_items')
        .insert(importBatch);
      
      if (error) {
        console.error('Error importing batch:', error);
        throw new Error(`Import error: ${error.message}`);
      }
      
      imported += batch.length;
      
      // Report progress
      if (onProgress) {
        onProgress(Math.floor((imported / data.length) * 100));
      }
    }
    
    return imported;
  } catch (error) {
    console.error('Import error:', error);
    throw error;
  }
};
