
import { Label } from '@/components/ui/label';
import { Tag, Plus } from 'lucide-react';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { InventoryItem } from '@/services/inventory/types';
import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface ItemCategoryProps {
  item: InventoryItem;
  isEditing: boolean;
  editedItem: InventoryItem;
  onSelectChange: (value: string, field: string) => void;
}

// Default categories that are always available
const DEFAULT_CATEGORIES = [
  "Uncategorized",
  "Electronics",
  "Furniture",
  "Office Supplies",
  "Food",
  "Equipment",
  "Supplies",
  "Other"
];

const ItemCategory = ({ 
  item, 
  isEditing, 
  editedItem, 
  onSelectChange 
}: ItemCategoryProps) => {
  const [showCustomCategory, setShowCustomCategory] = useState(false);
  const [customCategory, setCustomCategory] = useState('');
  const [categories, setCategories] = useState<string[]>(DEFAULT_CATEGORIES);

  // Add the current item's category if it's not in the default list
  useEffect(() => {
    if (item?.category && !DEFAULT_CATEGORIES.includes(item.category) && !categories.includes(item.category)) {
      setCategories(prev => [...prev, item.category]);
    }
  }, [item]);

  // Update categories if editedItem changes
  useEffect(() => {
    if (editedItem?.category && !DEFAULT_CATEGORIES.includes(editedItem.category) && !categories.includes(editedItem.category)) {
      setCategories(prev => [...prev, editedItem.category]);
    }
  }, [editedItem]);

  const handleCategoryChange = (value: string) => {
    if (value === 'add_new') {
      setShowCustomCategory(true);
    } else {
      onSelectChange(value, 'category');
    }
  };

  const handleCustomCategorySubmit = () => {
    if (customCategory.trim()) {
      const newCategory = customCategory.trim();
      // Update the form value
      onSelectChange(newCategory, 'category');
      // Add to categories list if not already there
      if (!categories.includes(newCategory)) {
        setCategories(prev => [...prev, newCategory]);
      }
      setShowCustomCategory(false);
      setCustomCategory('');
    }
  };

  return (
    <div className="space-y-2">
      <Label htmlFor="category" className="text-base">Category</Label>
      {isEditing ? (
        showCustomCategory ? (
          <div className="flex gap-2">
            <Input
              value={customCategory}
              onChange={(e) => setCustomCategory(e.target.value)}
              placeholder="New category name"
              className="border-blue-200 focus:border-blue-400 text-base"
            />
            <Button
              type="button"
              onClick={handleCustomCategorySubmit}
              className="px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              size="sm"
            >
              Add
            </Button>
          </div>
        ) : (
          <Select
            value={editedItem.category}
            onValueChange={handleCategoryChange}
          >
            <SelectTrigger className="text-base">
              <SelectValue placeholder="Select category" className="text-base" />
            </SelectTrigger>
            <SelectContent className="text-base">
              {categories.map((category) => (
                <SelectItem key={category} value={category} className="text-base">
                  {category}
                </SelectItem>
              ))}
              <SelectItem value="add_new" className="text-blue-600 font-medium text-base">
                <div className="flex items-center">
                  <Plus className="h-4 w-4 mr-2" />
                  Add New Category
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
        )
      ) : (
        <div className="flex items-center text-base">
          <Tag className="h-5 w-5 mr-2 text-muted-foreground" />
          {item.category}
        </div>
      )}
    </div>
  );
};

export default ItemCategory;
