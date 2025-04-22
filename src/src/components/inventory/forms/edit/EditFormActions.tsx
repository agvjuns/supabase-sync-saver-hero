
import { Button } from '@/components/ui/button';
import { X, Save, Loader2 } from 'lucide-react';

interface EditFormActionsProps {
  isSaving?: boolean;
  onCancel?: () => void;
  onSave?: () => void;
}

const EditFormActions = ({ isSaving = false, onCancel, onSave }: EditFormActionsProps) => {
  return (
    <div className="flex justify-end space-x-2 pt-2 border-t p-4">
      {onCancel && (
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          className="border-gray-200 text-gray-700 hover:bg-gray-50"
        >
          <X className="mr-2 h-4 w-4" />
          Cancel
        </Button>
      )}
      <Button 
        type={onSave ? "button" : "submit"}
        onClick={onSave}
        disabled={isSaving}
        className="bg-blue-500 hover:bg-blue-600 text-white"
      >
        {isSaving ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Saving...
          </>
        ) : (
          <>
            <Save className="mr-2 h-4 w-4" />
            Save Changes
          </>
        )}
      </Button>
    </div>
  );
};

export default EditFormActions;
