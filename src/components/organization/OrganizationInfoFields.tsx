
import { BookOpen, Calendar } from 'lucide-react';
import { OrganizationField } from './OrganizationField';
import { Label } from '@/components/ui/label';

interface OrganizationInfoFieldsProps {
  subscriptionTier: string;
  createdAt: string;
  formatDate: (date: string) => string;
}

export const OrganizationInfoFields = ({ 
  subscriptionTier, 
  createdAt, 
  formatDate 
}: OrganizationInfoFieldsProps) => {
  return (
    <>
      <div className="pt-2 space-y-2">
        <Label className="text-slate-300">Subscription Tier</Label>
        <div className="flex items-center border border-slate-700 rounded-md p-3 bg-slate-900">
          <BookOpen className="h-4 w-4 mr-2 text-slate-400" />
          <span className="capitalize text-white">{subscriptionTier || 'Free'}</span>
        </div>
      </div>
      
      <div className="pt-2 space-y-2">
        <Label className="text-slate-300">Created On</Label>
        <div className="flex items-center border border-slate-700 rounded-md p-3 bg-slate-900">
          <Calendar className="h-4 w-4 mr-2 text-slate-400" />
          <span className="text-white">{createdAt ? formatDate(createdAt) : 'Unknown'}</span>
        </div>
      </div>
    </>
  );
};
