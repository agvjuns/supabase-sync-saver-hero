
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
import { DollarSign } from 'lucide-react';
import { UseFormReturn } from 'react-hook-form';
import { FormValues } from '../AddItemFormTypes';

interface SectionProps {
  form: UseFormReturn<FormValues>;
}

const PriceAndCurrencySection = ({ form }: SectionProps) => {
  return (
    <div className="grid grid-cols-2 gap-2">
      <FormField
        control={form.control}
        name="price"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-gray-700 font-medium flex items-center">
              <DollarSign className="h-4 w-4 mr-1 text-blue-500" />
              Price
            </FormLabel>
            <FormControl>
              <Input 
                type="number" 
                step="0.01"
                {...field} 
                onChange={e => field.onChange(parseFloat(e.target.value))}
                className="border-gray-300 focus:border-gray-400"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="currency"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-gray-700 font-medium flex items-center">
              Currency
            </FormLabel>
            <Select 
              onValueChange={field.onChange} 
              defaultValue={field.value}
            >
              <FormControl>
                <SelectTrigger className="border-gray-300 focus:border-gray-400 bg-white">
                  <SelectValue placeholder="Select currency" />
                </SelectTrigger>
              </FormControl>
              <SelectContent className="bg-white shadow-lg rounded-md">
                <SelectItem value="USD">USD ($)</SelectItem>
                <SelectItem value="EUR">EUR (€)</SelectItem>
                <SelectItem value="GBP">GBP (£)</SelectItem>
                <SelectItem value="JPY">JPY (¥)</SelectItem>
                <SelectItem value="CAD">CAD ($)</SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};

export default PriceAndCurrencySection;
