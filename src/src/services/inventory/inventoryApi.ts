import { supabase } from '@/integrations/supabase/client';
import { NewInventoryItem, UpdateInventoryItem, SupabaseInventoryItem } from './types';
import { getUserOrganizationId } from './organizationService';
import { toast } from 'sonner';

/**
 * Fetch inventory items from Supabase
 */
export const fetchInventoryItems = async (userId: string): Promise<SupabaseInventoryItem[]> => {
  console.log('Fetching inventory, user ID:', userId || 'not logged in');
  
  if (!userId) {
    console.log('No user logged in, skipping inventory fetch');
    return [];
  }

  try {
    // Get organization ID first
    const organizationId = await getUserOrganizationId(userId);
    console.log('User organization ID:', organizationId);
    
    // Get all inventory items for this organization
    const { data, error: itemsError } = await supabase
      .from('inventory_items')
      .select('*')
      .eq('organization_id', organizationId);

    if (itemsError) {
      console.error('Supabase error:', itemsError);
      throw new Error(itemsError.message || 'Failed to fetch inventory items');
    }

    console.log('Fetched inventory data:', data);
    return data || [];
  } catch (error: any) {
    console.error('Error in fetchInventoryItems:', error);
    throw error;
  }
};

/**
 * Add a new inventory item
 */
export const addInventoryItem = async (
  userId: string, 
  item: NewInventoryItem
): Promise<SupabaseInventoryItem> => {
  if (!userId) {
    throw new Error('You must be logged in to add items');
  }
  
  try {
    console.log('Adding new item, user ID:', userId);
    
    // Get organization ID first
    const organizationId = await getUserOrganizationId(userId);
    
    if (!organizationId) {
      throw new Error('No organization found for this user');
    }
    
    // Check if required fields are present
    if (!item.name) {
      throw new Error('Item name is required');
    }
    
    // Transform to Supabase format and include user IDs
    const newItem = {
      name: item.name,
      location_name: item.location || 'Unknown location',
      quantity: item.quantity || 0,
      status: item.status || 'In Stock',
      latitude: item.coordinates?.lat || 0,
      longitude: item.coordinates?.lng || 0,
      category: item.category || 'Uncategorized',
      description: item.description || '',
      price: item.price || 0,
      currency: item.currency || 'USD',
      uom: item.uom || 'Unit',
      sku: item.sku || '',
      minimum_stock: item.minimumStock || 0,
      supplier_info: item.supplierInfo || '',
      created_by: userId,
      updated_by: userId,
      organization_id: organizationId
    };

    console.log('Adding new item:', newItem);

    const { data, error } = await supabase
      .from('inventory_items')
      .insert(newItem)
      .select();

    if (error) {
      console.error('Error adding item:', error);
      throw new Error(error.message || 'Failed to add item');
    }

    console.log('Add item response:', data);
    
    if (!data || data.length === 0) {
      throw new Error('Failed to retrieve the added item');
    }

    return data[0];
  } catch (error: any) {
    console.error('Error in addInventoryItem:', error);
    throw error;
  }
};

/**
 * Update an existing inventory item
 */
export const updateInventoryItem = async (
  userId: string, 
  id: string, 
  updates: UpdateInventoryItem
): Promise<void> => {
  if (!userId) {
    throw new Error('You must be logged in to update items');
  }
  
  try {
    // Transform to Supabase format
    const updateData: any = {
      updated_by: userId, // Always include the user who is updating
      updated_at: new Date().toISOString()
    };
    
    if (updates.name) updateData.name = updates.name;
    if (updates.location !== undefined) updateData.location_name = updates.location;
    if (updates.quantity !== undefined) updateData.quantity = updates.quantity;
    if (updates.status) updateData.status = updates.status;
    if (updates.category) updateData.category = updates.category;
    if (updates.description !== undefined) updateData.description = updates.description;
    if (updates.coordinates) {
      updateData.latitude = updates.coordinates.lat;
      updateData.longitude = updates.coordinates.lng;
    }
    if (updates.price !== undefined) updateData.price = updates.price;
    if (updates.currency) updateData.currency = updates.currency;
    if (updates.uom) updateData.uom = updates.uom;
    if (updates.sku !== undefined) updateData.sku = updates.sku;
    if (updates.minimumStock !== undefined) updateData.minimum_stock = updates.minimumStock;
    if (updates.supplierInfo !== undefined) updateData.supplier_info = updates.supplierInfo;

    console.log('Updating item:', id, updateData);

    const { error } = await supabase
      .from('inventory_items')
      .update(updateData)
      .eq('id', id);

    if (error) {
      console.error('Error updating item:', error);
      throw new Error(error.message || 'Failed to update item');
    }
    
    console.log('Item updated successfully:', id);
  } catch (error: any) {
    console.error('Error in updateInventoryItem:', error);
    throw error;
  }
};

/**
 * Delete an inventory item
 */
export const deleteInventoryItem = async (userId: string, id: string): Promise<void> => {
  if (!userId) {
    throw new Error('You must be logged in to delete items');
  }
  
  try {
    console.log('Deleting item:', id);
    
    const { error } = await supabase
      .from('inventory_items')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting item:', error);
      throw new Error(error.message || 'Failed to delete item');
    }
    
    console.log('Item deleted successfully:', id);
  } catch (error: any) {
    console.error('Error in deleteInventoryItem:', error);
    throw error;
  }
};
