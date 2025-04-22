
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Plus } from 'lucide-react';
import { InventoryItem } from '@/services/inventory/types';
import { useState } from 'react';
import { Button } from '@/components/ui/button';

interface SectionProps {
  editedItem: InventoryItem;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleSelectChange?: (value: string, field: string) => void;
}

export const EditBasicInfoSection = ({ 
  editedItem, 
  onChange, 
  handleSelectChange 
}: SectionProps) => {
  const [showCustomCategory, setShowCustomCategory] = useState(false);
  const [customCategory, setCustomCategory] = useState('');

  const handleCategoryChange = (value: string) => {
    if (value === 'add_new') {
      setShowCustomCategory(true);
    } else {
      handleSelectChange && handleSelectChange(value, 'category');
    }
  };

  const handleCustomCategorySubmit = () => {
    if (customCategory.trim()) {
      handleSelectChange && handleSelectChange(customCategory.trim(), 'category');
      setShowCustomCategory(false);
      setCustomCategory('');
    }
  };

  return (
    <div className="space-y-1">
      <Label htmlFor="name" className="text-gray-700">Name</Label>
      <Input
        id="name"
        name="name"
        value={editedItem.name}
        onChange={onChange}
        className="border-gray-300 focus:border-blue-400"
      />
      
      <Label htmlFor="category" className="text-gray-700 mt-1">Category</Label>
      {showCustomCategory ? (
        <div className="flex gap-1">
          <Input
            value={customCategory}
            onChange={(e) => setCustomCategory(e.target.value)}
            placeholder="New category name"
            className="border-gray-300 focus:border-blue-400"
          />
          <button
            type="button"
            onClick={handleCustomCategorySubmit}
            className="px-2 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Add
          </button>
        </div>
      ) : (
        <Select
          value={editedItem.category}
          onValueChange={handleCategoryChange}
        >
          <SelectTrigger className="border-gray-300 focus:border-blue-400">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Uncategorized">Uncategorized</SelectItem>
            <SelectItem value="Electronics">Electronics</SelectItem>
            <SelectItem value="Food">Food</SelectItem>
            <SelectItem value="Equipment">Equipment</SelectItem>
            <SelectItem value="Supplies">Supplies</SelectItem>
            <SelectItem value="add_new" className="text-blue-600 font-medium">
              <div className="flex items-center">
                <Plus className="h-4 w-4 mr-2" />
                Add New Category
              </div>
            </SelectItem>
          </SelectContent>
        </Select>
      )}
    </div>
  );
};

export default EditBasicInfoSection;
