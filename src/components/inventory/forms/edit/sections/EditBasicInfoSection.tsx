import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import CategorySelect from '@/components/inventory/CategorySelect';
import { InventoryItem } from '@/services/inventory/types';

interface SectionProps {
  editedItem: InventoryItem;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleSelectChange?: (value: string, field: string) => void;
  categories: string[];
}

export const EditBasicInfoSection = ({
  editedItem,
  onChange,
  handleSelectChange,
  categories,
}: SectionProps) => {
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
      <CategorySelect
        categories={categories}
        value={editedItem.category}
        onChange={v => handleSelectChange && handleSelectChange(v, 'category')}
      />
    </div>
  );
};

export default EditBasicInfoSection;
