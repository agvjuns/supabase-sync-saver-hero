
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
import { UseFormReturn } from 'react-hook-form';
import { FormValues } from '../AddItemFormTypes';

interface QuantityStatusSectionProps {
  form: UseFormReturn<FormValues>;
}

export const QuantityStatusSection = ({ form }: QuantityStatusSectionProps) => {
  return (
    <div className="grid grid-cols-2 gap-2">
      <FormField
        control={form.control}
        name="quantity"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-gray-700 font-medium">Quantity</FormLabel>
            <FormControl>
              <Input 
                type="number" 
                {...field} 
                onChange={e => field.onChange(parseInt(e.target.value))}
                className="border-gray-300 focus:border-gray-400"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="status"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-gray-700 font-medium">Status</FormLabel>
            <Select 
              onValueChange={field.onChange} 
              defaultValue={field.value}
            >
              <FormControl>
                <SelectTrigger className="border-gray-300 focus:border-gray-400 bg-white">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
              </FormControl>
              <SelectContent className="bg-white shadow-lg rounded-md">
                <SelectItem value="In Stock">In Stock</SelectItem>
                <SelectItem value="Low Stock">Low Stock</SelectItem>
                <SelectItem value="Out of Stock">Out of Stock</SelectItem>
                <SelectItem value="On Order">On Order</SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};

export default QuantityStatusSection;
