
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { List, Package, Plus } from 'lucide-react';
import { InventoryItem } from '@/services/inventory/types';
import { useState } from 'react';

interface SectionProps {
  editedItem: InventoryItem;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleSelectChange?: (value: string, field: string) => void;
}

export const EditUomAndSkuSection = ({ 
  editedItem, 
  onChange, 
  handleSelectChange 
}: SectionProps) => {
  const [showCustomUom, setShowCustomUom] = useState(false);
  const [customUom, setCustomUom] = useState('');

  const handleUomChange = (value: string) => {
    if (value === 'custom') {
      setShowCustomUom(true);
    } else {
      handleSelectChange && handleSelectChange(value, 'uom');
    }
  };

  const handleCustomUomSubmit = () => {
    if (customUom.trim()) {
      handleSelectChange && handleSelectChange(customUom.trim(), 'uom');
      setShowCustomUom(false);
      setCustomUom('');
    }
  };

  return (
    <div className="space-y-1">
      <Label htmlFor="uom" className="text-gray-700 flex items-center">
        <List className="h-4 w-4 mr-1 text-gray-500" />
        Unit of Measurement
      </Label>
      
      {showCustomUom ? (
        <div className="flex gap-1">
          <Input
            value={customUom}
            onChange={(e) => setCustomUom(e.target.value)}
            placeholder="New UOM"
            className="border-gray-300 focus:border-blue-400"
          />
          <button
            type="button"
            onClick={handleCustomUomSubmit}
            className="px-2 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Add
          </button>
        </div>
      ) : (
        <Select
          value={editedItem.uom}
          onValueChange={handleUomChange}
        >
          <SelectTrigger className="border-gray-300 focus:border-blue-400">
            <SelectValue placeholder="Unit" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="EACH">Each</SelectItem>
            <SelectItem value="Unit">Unit</SelectItem>
            <SelectItem value="Kg">Kilogram (kg)</SelectItem>
            <SelectItem value="g">Gram (g)</SelectItem>
            <SelectItem value="L">Liter (L)</SelectItem>
            <SelectItem value="mL">Milliliter (mL)</SelectItem>
            <SelectItem value="m">Meter (m)</SelectItem>
            <SelectItem value="ft">Foot (ft)</SelectItem>
            <SelectItem value="Pcs">Pieces (pcs)</SelectItem>
            <SelectItem value="Box">Box</SelectItem>
            <SelectItem value="Pair">Pair</SelectItem>
            <SelectItem value="custom" className="text-blue-600 font-medium">
              <div className="flex items-center">
                <Plus className="h-4 w-4 mr-1" />
                Add Custom UOM
              </div>
            </SelectItem>
          </SelectContent>
        </Select>
      )}
      
      <Label htmlFor="sku" className="text-gray-700 flex items-center mt-1">
        <Package className="h-4 w-4 mr-1 text-gray-500" />
        SKU
      </Label>
      <Input
        id="sku"
        name="sku"
        value={editedItem.sku || ''}
        onChange={onChange}
        placeholder="Stock Keeping Unit"
        className="border-gray-300 focus:border-blue-400"
      />
    </div>
  );
};

export default EditUomAndSkuSection;
