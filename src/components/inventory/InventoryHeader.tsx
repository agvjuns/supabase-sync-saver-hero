
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import InventoryViewToggle from './InventoryViewToggle';

type ViewMode = 'split' | 'list' | 'map';

interface InventoryHeaderProps {
  title: string;
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
  onBack?: () => void;
  showBackButton?: boolean;
}

const InventoryHeader = ({ 
  title, 
  viewMode, 
  setViewMode, 
  onBack, 
  showBackButton = false 
}: InventoryHeaderProps) => {
  return (
    <div className="p-4 flex items-center justify-between border-b border-border">
      <div className="flex items-center">
        {showBackButton && (
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onBack}
            className="mr-2 flex items-center text-muted-foreground"
          >
            <ArrowLeft className="h-4 w-4 mr-1" /> Back
          </Button>
        )}
        <h1 className="text-xl font-bold">{title}</h1>
      </div>
      
      <InventoryViewToggle viewMode={viewMode} setViewMode={setViewMode} />
    </div>
  );
};

export default InventoryHeader;
