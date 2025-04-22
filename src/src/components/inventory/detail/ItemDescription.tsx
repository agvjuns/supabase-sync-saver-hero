
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { InventoryItem } from '@/services/inventory/types';

interface ItemDescriptionProps {
  item: InventoryItem;
  isEditing: boolean;
  editedItem: InventoryItem;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

const ItemDescription = ({ 
  item, 
  isEditing, 
  editedItem, 
  onChange 
}: ItemDescriptionProps) => {
  return (
    <div className="space-y-2">
      <Label htmlFor="description" className="text-blue-800 font-medium text-base">Description</Label>
      {isEditing ? (
        <Textarea
          id="description"
          name="description"
          rows={4}
          value={editedItem.description || ''}
          onChange={onChange}
          placeholder="Enter item description..."
          className="border-blue-200 focus:border-blue-400 text-base"
        />
      ) : (
        <div className="px-4 py-3 bg-blue-50/50 rounded-md text-muted-foreground border border-blue-100 text-base">
          {item.description || 'No description available.'}
        </div>
      )}
    </div>
  );
};

export default ItemDescription;
