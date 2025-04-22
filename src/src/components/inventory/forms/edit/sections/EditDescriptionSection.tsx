
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { InventoryItem } from '@/services/inventory/types';

interface SectionProps {
  editedItem: InventoryItem;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

export const EditDescriptionSection = ({ 
  editedItem, 
  onChange 
}: SectionProps) => {
  return (
    <div className="space-y-1">
      <Label htmlFor="description" className="text-gray-700">Notes</Label>
      <Textarea
        id="description"
        name="description"
        rows={3}
        value={editedItem.description || ''}
        onChange={onChange}
        className="border-gray-300 focus:border-blue-400 min-h-[90px]"
      />
    </div>
  );
};

export default EditDescriptionSection;
