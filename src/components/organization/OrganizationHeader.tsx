
import { Button } from '@/components/ui/button';
import { CardDescription, CardTitle } from '@/components/ui/card';
import { Building, Edit } from 'lucide-react';
import { useOrganizationContext } from './OrganizationContext';

interface OrganizationHeaderProps {
  isAdmin: boolean;
}

export const OrganizationHeader = ({ isAdmin }: OrganizationHeaderProps) => {
  const { isEditing, setIsEditing } = useOrganizationContext();

  return (
    <div className="flex flex-row items-center justify-between">
      <div>
        <CardTitle className="text-xl font-semibold text-white flex items-center">
          <Building className="h-5 w-5 mr-2 text-white" />
          Organization Details
        </CardTitle>
        <CardDescription className="text-slate-400">
          Manage your organization information
        </CardDescription>
      </div>
      {isAdmin && !isEditing && (
        <Button 
          variant="outline" 
          size="icon"
          onClick={() => setIsEditing(true)}
          className="h-8 w-8 border-slate-600 hover:bg-slate-700 text-white"
        >
          <Edit className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
};
