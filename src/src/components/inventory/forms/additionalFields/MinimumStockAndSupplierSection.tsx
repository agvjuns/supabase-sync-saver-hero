
import { 
  FormField, 
  FormItem, 
  FormLabel, 
  FormControl, 
  FormMessage 
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { TrendingDown, Truck } from 'lucide-react';
import { UseFormReturn } from 'react-hook-form';
import { FormValues } from '../AddItemFormTypes';

interface SectionProps {
  form: UseFormReturn<FormValues>;
}

const MinimumStockAndSupplierSection = ({ form }: SectionProps) => {
  return (
    <div className="grid grid-cols-2 gap-2">
      <FormField
        control={form.control}
        name="minimumStock"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-gray-700 font-medium flex items-center">
              <TrendingDown className="h-4 w-4 mr-1 text-blue-500" />
              Minimum Stock
            </FormLabel>
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
        name="supplierInfo"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-gray-700 font-medium flex items-center">
              <Truck className="h-4 w-4 mr-1 text-blue-500" />
              Supplier Info
            </FormLabel>
            <FormControl>
              <Input 
                {...field} 
                placeholder="Supplier details" 
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

export default MinimumStockAndSupplierSection;
