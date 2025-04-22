
import { Button } from '@/components/ui/button';
import { Edit, Save, X } from 'lucide-react';

interface DetailHeaderProps {
  title: string;
  isEditing: boolean;
  onEdit: () => void;
  onSave: () => void;
  onClose: () => void;
}

const DetailHeader = ({ 
  title, 
  isEditing, 
  onEdit, 
  onSave, 
  onClose 
}: DetailHeaderProps) => {
  return (
    <div className="p-4 border-b border-border flex items-center justify-between">
      <h3 className="text-lg font-medium">{title}</h3>
      <div className="flex space-x-2">
        {isEditing ? (
          <Button size="sm" onClick={onSave}>
            <Save className="h-4 w-4 mr-1" />
            Save
          </Button>
        ) : (
          <Button size="sm" variant="outline" onClick={onEdit}>
            <Edit className="h-4 w-4 mr-1" />
            Edit
          </Button>
        )}
        <Button size="icon" variant="ghost" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default DetailHeader;
