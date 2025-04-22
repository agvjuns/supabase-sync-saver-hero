
import { 
  FormField, 
  FormItem, 
  FormLabel, 
  FormControl, 
  FormMessage 
} from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { UseFormReturn } from 'react-hook-form';
import { FormValues } from '../AddItemFormTypes';

interface DescriptionSectionProps {
  form: UseFormReturn<FormValues>;
}

export const DescriptionSection = ({ form }: DescriptionSectionProps) => {
  return (
    <FormField
      control={form.control}
      name="description"
      render={({ field }) => (
        <FormItem>
          <FormLabel className="text-gray-700 font-medium">Notes (Optional)</FormLabel>
          <FormControl>
            <Textarea 
              {...field} 
              placeholder="Item description"
              rows={3}
              className="border-gray-300 focus:border-gray-400 min-h-[80px]"
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default DescriptionSection;
