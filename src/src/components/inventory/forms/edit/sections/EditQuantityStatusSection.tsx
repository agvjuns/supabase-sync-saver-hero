
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { InventoryItem } from '@/services/inventory/types';

interface SectionProps {
  editedItem: InventoryItem;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleSelectChange?: (value: string, field: string) => void;
}

export const EditQuantityStatusSection = ({ 
  editedItem, 
  onChange, 
  handleSelectChange 
}: SectionProps) => {
  return (
    <div className="space-y-1">
      <Label htmlFor="quantity" className="text-gray-700">Quantity</Label>
      <Input
        id="quantity"
        name="quantity"
        type="number"
        value={editedItem.quantity}
        onChange={onChange}
        className="border-gray-300 focus:border-blue-400 bg-white text-gray-900"
      />

      <Label htmlFor="status" className="text-gray-700 mt-1">Status</Label>
      <Select
        value={editedItem.status}
        onValueChange={(value) => handleSelectChange && handleSelectChange(value, 'status')}
      >
        <SelectTrigger className="border-gray-300 focus:border-blue-400 bg-white text-gray-900">
          <SelectValue placeholder="Status" />
        </SelectTrigger>
        <SelectContent className="bg-white text-gray-900">
          <SelectItem value="In Stock">In Stock</SelectItem>
          <SelectItem value="Low Stock">Low Stock</SelectItem>
          <SelectItem value="Out of Stock">Out of Stock</SelectItem>
          <SelectItem value="On Order">On Order</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};

export default EditQuantityStatusSection;
