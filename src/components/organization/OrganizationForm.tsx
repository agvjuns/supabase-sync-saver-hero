
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { useOrganizationContext } from './OrganizationContext';

interface OrganizationFormProps {
  isAdmin: boolean;
}

export const OrganizationForm = ({ isAdmin }: OrganizationFormProps) => {
  const { formData, isEditing, isSaving, handleInputChange, handleSave, handleCancel } = useOrganizationContext();

  return (
    <>
      <div className="space-y-2">
        <Label htmlFor="name" className="text-slate-300">Organization Name</Label>
        <Input 
          id="name"
          name="name"
          value={formData.name}
          onChange={handleInputChange}
          disabled={!isEditing || isSaving}
          className="bg-slate-900 border-slate-700 text-white"
        />
      </div>
      
      {isAdmin && (
        <div className="space-y-2">
          <Label htmlFor="billingEmail" className="text-slate-300">Billing Email</Label>
          <Input 
            id="billingEmail"
            name="billingEmail"
            type="email"
            value={formData.billingEmail}
            onChange={handleInputChange}
            disabled={!isEditing || isSaving}
            className="bg-slate-900 border-slate-700 text-white"
            placeholder={isAdmin ? 'Enter billing email' : ''}
          />
        </div>
      )}
      
      {isEditing && (
        <div className="flex justify-end gap-2 mt-4">
          <Button 
            variant="outline" 
            onClick={handleCancel}
            disabled={isSaving}
            className="border-slate-600 text-white hover:bg-slate-700"
          >
            Cancel
          </Button>
          <Button  
            onClick={handleSave}
            disabled={isSaving}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            {isSaving ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : 'Save Changes'}
          </Button>
        </div>
      )}
    </>
  );
};
