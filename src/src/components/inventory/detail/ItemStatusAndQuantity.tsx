
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { InventoryItem } from '@/services/inventory/types';

interface ItemStatusAndQuantityProps {
  item: InventoryItem;
  isEditing: boolean;
  editedItem: InventoryItem;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onSelectChange: (value: string, field: string) => void;
}

const ItemStatusAndQuantity = ({ 
  item, 
  isEditing, 
  editedItem, 
  onChange, 
  onSelectChange 
}: ItemStatusAndQuantityProps) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'In Stock':
        return 'bg-green-500/10 text-green-600 border-green-300';
      case 'Low Stock':
        return 'bg-amber-500/10 text-amber-600 border-amber-300';
      case 'Out of Stock':
        return 'bg-red-500/10 text-red-600 border-red-300';
      default:
        return 'bg-gray-500/10 text-gray-600 border-gray-300';
    }
  };

  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="space-y-2">
        <Label className="text-base">Status</Label>
        {isEditing ? (
          <Select
            defaultValue={editedItem.status}
            onValueChange={(value) => onSelectChange(value, 'status')}
          >
            <SelectTrigger className="text-base">
              <SelectValue placeholder="Select status" className="text-base" />
            </SelectTrigger>
            <SelectContent className="text-base">
              <SelectItem value="In Stock" className="text-base">In Stock</SelectItem>
              <SelectItem value="Low Stock" className="text-base">Low Stock</SelectItem>
              <SelectItem value="Out of Stock" className="text-base">Out of Stock</SelectItem>
            </SelectContent>
          </Select>
        ) : (
          <Badge variant="outline" className={`flex w-fit items-center text-base px-3 py-1 ${getStatusColor(item.status)}`}>
            {item.status}
          </Badge>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="quantity" className="text-base">Quantity</Label>
        {isEditing ? (
          <Input
            id="quantity"
            name="quantity"
            type="number"
            value={editedItem.quantity}
            onChange={onChange}
            className="text-base"
          />
        ) : (
          <div className="text-2xl font-semibold">{item.quantity}</div>
        )}
      </div>
    </div>
  );
};

export default ItemStatusAndQuantity;
