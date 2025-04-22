import { UseFormReturn } from 'react-hook-form';
import { FormValues } from '../AddItemFormTypes';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import CategorySelect from '@/components/inventory/CategorySelect';

interface BasicInfoSectionProps {
  form: UseFormReturn<FormValues>;
  categories: string[];
}

export const BasicInfoSection = ({ form, categories }: BasicInfoSectionProps) => {
  return (
    <>
      <FormField
        control={form.control}
        name="name"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-gray-700 font-medium">Name</FormLabel>
            <FormControl>
              <Input {...field} placeholder="Item name" className="border-gray-300 focus:border-gray-400" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="category"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-gray-700 font-medium">Category</FormLabel>
            <FormControl>
              <CategorySelect
                categories={categories}
                value={field.value}
                onChange={field.onChange}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
};

export default BasicInfoSection;
