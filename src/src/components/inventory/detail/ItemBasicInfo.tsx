
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Clock } from 'lucide-react';
import { InventoryItem } from '@/services/inventory/types';

interface ItemBasicInfoProps {
  item: InventoryItem;
  isEditing: boolean;
  editedItem: InventoryItem;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

const ItemBasicInfo = ({ 
  item, 
  isEditing, 
  editedItem, 
  onChange 
}: ItemBasicInfoProps) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  return (
    <div>
      {isEditing ? (
        <div className="space-y-2">
          <Label htmlFor="name" className="text-base">Name</Label>
          <Input
            id="name"
            name="name"
            value={editedItem.name}
            onChange={onChange}
            className="text-base"
          />
        </div>
      ) : (
        <h2 className="text-3xl font-semibold">{item.name}</h2>
      )}

      <div className="flex items-center mt-2 text-base text-muted-foreground">
        <Clock className="h-5 w-5 mr-1" />
        Last updated: {formatDate(item.lastUpdated)}
      </div>
    </div>
  );
};

export default ItemBasicInfo;
