
import { PackageCheck, PackageX } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface StatusBadgeProps {
  status: string;
}

export const StatusBadge = ({ status }: StatusBadgeProps) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'In Stock':
        return 'bg-green-500/10 text-green-600 border-green-300';
      case 'Low Stock':
        return 'bg-amber-500/10 text-amber-600 border-amber-300';
      case 'Out of Stock':
        return 'bg-red-500/10 text-red-600 border-red-300';
      default:
        return 'bg-gray-500/10 text-gray-600 border-gray-300';
    }
  };
  
  const StatusIcon = ({ status }: { status: string }) => {
    switch (status) {
      case 'In Stock':
        return <PackageCheck className="h-4 w-4 text-green-500 mr-1.5" />;
      case 'Out of Stock':
        return <PackageX className="h-4 w-4 text-red-500 mr-1.5" />;
      default:
        return <PackageCheck className="h-4 w-4 text-amber-500 mr-1.5" />;
    }
  };

  return (
    <Badge variant="outline" className={`flex w-fit items-center text-base px-3 py-1 ${getStatusColor(status)}`}>
      <StatusIcon status={status} />
      {status}
    </Badge>
  );
};

export default StatusBadge;
