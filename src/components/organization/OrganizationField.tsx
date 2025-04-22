
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { ReactNode } from 'react';

interface OrganizationFieldProps {
  label: string;
  icon: ReactNode;
  value: string;
  readOnly?: boolean;
}

export const OrganizationField = ({ 
  label, 
  icon, 
  value,
  readOnly = true
}: OrganizationFieldProps) => {
  return (
    <div className="pt-2 space-y-2">
      <Label className="text-slate-300">{label}</Label>
      <div className="flex items-center border border-slate-700 rounded-md p-3 bg-slate-900">
        {icon}
        <span className="text-white">{value}</span>
      </div>
    </div>
  );
};
