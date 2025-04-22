
import { useState } from 'react';
import { 
  FormField, 
  FormItem, 
  FormLabel, 
  FormControl, 
  FormMessage 
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { List, Package, Plus } from 'lucide-react';
import { UseFormReturn } from 'react-hook-form';
import { FormValues } from '../AddItemFormTypes';
import { Button } from '@/components/ui/button';

interface AdditionalFieldsProps {
  form: UseFormReturn<FormValues>;
}

export const UomAndSkuSection = ({ form }: AdditionalFieldsProps) => {
  const [showCustomUom, setShowCustomUom] = useState(false);
  const [customUom, setCustomUom] = useState('');

  const handleUomChange = (value: string) => {
    if (value === 'custom') {
      setShowCustomUom(true);
    } else {
      form.setValue('uom', value);
    }
  };

  const handleCustomUomSubmit = () => {
    if (customUom.trim()) {
      form.setValue('uom', customUom.trim());
      setShowCustomUom(false);
      setCustomUom('');
    }
  };

  return (
    <div className="grid grid-cols-2 gap-2">
      <FormField
        control={form.control}
        name="uom"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-gray-700 font-medium flex items-center">
              <List className="h-4 w-4 mr-1 text-blue-500" />
              Unit of Measurement
            </FormLabel>
            {showCustomUom ? (
              <div className="flex gap-1 mt-1">
                <Input
                  value={customUom}
                  onChange={(e) => setCustomUom(e.target.value)}
                  placeholder="New UOM"
                  className="border-gray-300 focus:border-gray-400"
                />
                <Button
                  type="button"
                  onClick={handleCustomUomSubmit}
                  className="px-2 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                  size="sm"
                >
                  Add
                </Button>
              </div>
            ) : (
              <Select 
                onValueChange={handleUomChange}
                value={field.value}
              >
                <FormControl>
                  <SelectTrigger className="border-gray-300 focus:border-gray-400 bg-white">
                    <SelectValue placeholder="Select UOM" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent className="bg-white shadow-lg rounded-md">
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
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="sku"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-gray-700 font-medium flex items-center">
              <Package className="h-4 w-4 mr-1 text-blue-500" />
              SKU
            </FormLabel>
            <FormControl>
              <Input 
                {...field} 
                placeholder="Stock Keeping Unit" 
                className="border-gray-300 focus:border-gray-400"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};
