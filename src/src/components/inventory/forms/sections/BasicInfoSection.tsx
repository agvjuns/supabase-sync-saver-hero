
import { useState, useEffect } from 'react';
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
import { Plus } from 'lucide-react';
import { UseFormReturn } from 'react-hook-form';
import { FormValues } from '../AddItemFormTypes';
import { Button } from '@/components/ui/button';

// Default categories that are always available
const DEFAULT_CATEGORIES = [
  "Uncategorized",
  "Electronics",
  "Food",
  "Equipment",
  "Supplies"
];

interface BasicInfoSectionProps {
  form: UseFormReturn<FormValues>;
}

export const BasicInfoSection = ({ form }: BasicInfoSectionProps) => {
  const [showCustomCategory, setShowCustomCategory] = useState(false);
  const [customCategory, setCustomCategory] = useState('');
  const [categories, setCategories] = useState<string[]>(DEFAULT_CATEGORIES);

  // This effect runs when the form value for category changes
  useEffect(() => {
    const currentCategory = form.getValues('category');
    if (currentCategory && !DEFAULT_CATEGORIES.includes(currentCategory) && !categories.includes(currentCategory)) {
      setCategories(prev => [...prev, currentCategory]);
    }
  }, [form.getValues('category')]);

  const handleCustomCategorySubmit = () => {
    if (customCategory.trim()) {
      const newCategory = customCategory.trim();
      // Update the form value
      form.setValue('category', newCategory);
      // Add to categories list if not already there
      if (!categories.includes(newCategory)) {
        setCategories(prev => [...prev, newCategory]);
      }
      setShowCustomCategory(false);
      setCustomCategory('');
    }
  };

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
      
      {showCustomCategory ? (
        <div className="space-y-1">
          <FormLabel className="text-gray-700 font-medium">New Category</FormLabel>
          <div className="flex gap-1">
            <Input
              value={customCategory}
              onChange={(e) => setCustomCategory(e.target.value)}
              placeholder="Category name"
              className="border-gray-300 focus:border-gray-400"
            />
            <Button 
              type="button" 
              onClick={handleCustomCategorySubmit}
              className="bg-blue-600 text-white hover:bg-blue-700"
              size="sm"
            >
              Add
            </Button>
          </div>
        </div>
      ) : (
        <FormField
          control={form.control}
          name="category"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-gray-700 font-medium">Category</FormLabel>
              <Select 
                onValueChange={(value) => {
                  if (value === 'add_new') {
                    setShowCustomCategory(true);
                  } else {
                    field.onChange(value);
                  }
                }} 
                defaultValue={field.value}
                value={field.value}
              >
                <FormControl>
                  <SelectTrigger className="border-gray-300 focus:border-gray-400 bg-white">
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent className="bg-white shadow-lg rounded-md">
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                  <SelectItem value="add_new" className="text-blue-600 font-medium">
                    <div className="flex items-center">
                      <Plus className="h-4 w-4 mr-2" />
                      Add New Category
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
      )}
    </>
  );
};

export default BasicInfoSection;
