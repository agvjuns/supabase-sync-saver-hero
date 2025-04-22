
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { TrendingDown, Truck } from 'lucide-react';
import { InventoryItem } from '@/services/inventory/types';

interface SectionProps {
  editedItem: InventoryItem;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleNumberChange?: (e: React.ChangeEvent<HTMLInputElement>, field: string) => void;
}

export const EditMinStockAndSupplierSection = ({ 
  editedItem, 
  onChange, 
  handleNumberChange 
}: SectionProps) => {
  return (
    <div className="grid grid-cols-2 gap-2">
      <div className="space-y-1">
        <Label htmlFor="minimumStock" className="text-gray-700 flex items-center">
          <TrendingDown className="h-4 w-4 mr-1 text-gray-500" />
          Minimum Stock
        </Label>
        <Input
          id="minimumStock"
          name="minimumStock"
          type="number"
          value={editedItem.minimumStock}
          onChange={(e) => handleNumberChange && handleNumberChange(e, 'minimumStock')}
          className="border-gray-300 focus:border-blue-400"
        />
      </div>
      
      <div className="space-y-1">
        <Label htmlFor="supplierInfo" className="text-gray-700 flex items-center">
          <Truck className="h-4 w-4 mr-1 text-gray-500" />
          Supplier Info
        </Label>
        <Input
          id="supplierInfo"
          name="supplierInfo"
          value={editedItem.supplierInfo || ''}
          onChange={onChange}
          placeholder="Supplier details"
          className="border-gray-300 focus:border-blue-400"
        />
      </div>
    </div>
  );
};

export default EditMinStockAndSupplierSection;
