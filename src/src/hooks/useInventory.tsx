
import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { InventoryItem, NewInventoryItem, UpdateInventoryItem } from '@/services/inventory/types';
import { 
  fetchInventoryItems, 
  addInventoryItem, 
  updateInventoryItem, 
  deleteInventoryItem 
} from '@/services/inventory/inventoryApi';
import { transformItems } from '@/services/inventory/transformers';

export type { InventoryItem, NewInventoryItem, UpdateInventoryItem };

export const useInventory = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  // Use React Query for data fetching
  const { 
    data: items = [], 
    isLoading: loading, 
    error: queryError,
    refetch
  } = useQuery({
    queryKey: ['inventoryItems', user?.id],
    queryFn: async () => {
      if (!user) {
        console.log('No user logged in, skipping inventory fetch');
        return [];
      }
      
      try {
        const data = await fetchInventoryItems(user.id);
        return transformItems(data);
      } catch (err: any) {
        console.error('Error fetching inventory:', err);
        
        // Show toast with more user-friendly message for common errors
        if (err.message?.includes('infinite recursion')) {
          toast.error('Database permission issue. Please try again later or contact support.');
        } else if (err.message?.includes('permission denied')) {
          toast.error('You do not have permission to access this data. Please contact your administrator.');
        } else {
          toast.error('Failed to load inventory items');
        }
        
        throw err;
      }
    },
    enabled: !!user,
    retry: 1
  });

  // Error state derived from query error
  const error = queryError ? (queryError as Error).message : null;

  // Add item mutation
  const addItemMutation = useMutation({
    mutationFn: async (item: NewInventoryItem) => {
      if (!user) {
        throw new Error('You must be logged in to add items');
      }
      return await addInventoryItem(user.id, item);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inventoryItems', user?.id] });
      toast.success('Item added successfully');
    },
    onError: (err: any) => {
      console.error('Error adding inventory item:', err);
      toast.error('Failed to add item: ' + err.message);
    }
  });

  // Update item mutation
  const updateItemMutation = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: UpdateInventoryItem }) => {
      if (!user) {
        throw new Error('You must be logged in to update items');
      }
      return await updateInventoryItem(user.id, id, updates);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inventoryItems', user?.id] });
      toast.success('Item updated successfully');
    },
    onError: (err: any) => {
      console.error('Error updating inventory item:', err);
      toast.error('Failed to update item: ' + err.message);
    }
  });

  // Delete item mutation
  const deleteItemMutation = useMutation({
    mutationFn: async (id: string) => {
      if (!user) {
        throw new Error('You must be logged in to delete items');
      }
      return await deleteInventoryItem(user.id, id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inventoryItems', user?.id] });
      toast.success('Item deleted successfully');
    },
    onError: (err: any) => {
      console.error('Error deleting inventory item:', err);
      toast.error('Failed to delete item: ' + err.message);
    }
  });

  const addItem = async (item: NewInventoryItem) => {
    return addItemMutation.mutateAsync(item);
  };

  const updateItem = async (id: string, updates: UpdateInventoryItem) => {
    return updateItemMutation.mutateAsync({ id, updates });
  };

  const deleteItem = async (id: string) => {
    return deleteItemMutation.mutateAsync(id);
  };

  return {
    items,
    loading,
    error,
    fetchInventory: refetch,
    addItem,
    updateItem,
    deleteItem
  };
};
