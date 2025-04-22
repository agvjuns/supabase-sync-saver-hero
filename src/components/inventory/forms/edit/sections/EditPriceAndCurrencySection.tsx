
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { DollarSign } from 'lucide-react';
import { InventoryItem } from '@/services/inventory/types';

interface SectionProps {
  editedItem: InventoryItem;
  handleNumberChange?: (e: React.ChangeEvent<HTMLInputElement>, field: string) => void;
  handleSelectChange?: (value: string, field: string) => void;
}

export const EditPriceAndCurrencySection = ({ 
  editedItem, 
  handleNumberChange, 
  handleSelectChange 
}: SectionProps) => {
  return (
    <div className="space-y-1">
      <Label htmlFor="price" className="text-gray-700 flex items-center">
        <DollarSign className="h-4 w-4 mr-1 text-gray-500" />
        Price
      </Label>
      <Input
        id="price"
        name="price"
        type="number"
        step="0.01"
        value={editedItem.price}
        onChange={(e) => handleNumberChange && handleNumberChange(e, 'price')}
        className="border-gray-300 focus:border-blue-400"
      />
      
      <Label htmlFor="currency" className="text-gray-700 mt-1">Currency</Label>
      <Select
        value={editedItem.currency}
        onValueChange={(value) => handleSelectChange && handleSelectChange(value, 'currency')}
      >
        <SelectTrigger className="border-gray-300 focus:border-blue-400">
          <SelectValue placeholder="Currency" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="USD">USD ($)</SelectItem>
          <SelectItem value="EUR">EUR (€)</SelectItem>
          <SelectItem value="GBP">GBP (£)</SelectItem>
          <SelectItem value="JPY">JPY (¥)</SelectItem>
          <SelectItem value="CAD">CAD ($)</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};

export default EditPriceAndCurrencySection;
