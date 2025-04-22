
import { Button } from '@/components/ui/button';
import { LayoutGrid, MapIcon, List } from 'lucide-react';

type ViewMode = 'split' | 'list' | 'map';

interface InventoryViewToggleProps {
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
}

const InventoryViewToggle = ({ viewMode, setViewMode }: InventoryViewToggleProps) => {
  return (
    <div className="flex items-center gap-1 p-1 bg-muted rounded-md">
      <Button
        variant={viewMode === 'list' ? "secondary" : "ghost"}
        size="sm"
        className="h-8 px-2"
        onClick={() => setViewMode('list')}
      >
        <List className="h-4 w-4 mr-1" />
        List
      </Button>
      <Button
        variant={viewMode === 'split' ? "secondary" : "ghost"}
        size="sm"
        className="h-8 px-2"
        onClick={() => setViewMode('split')}
      >
        <LayoutGrid className="h-4 w-4 mr-1" />
        Split
      </Button>
      <Button
        variant={viewMode === 'map' ? "secondary" : "ghost"}
        size="sm"
        className="h-8 px-2"
        onClick={() => setViewMode('map')}
      >
        <MapIcon className="h-4 w-4 mr-1" />
        Map
      </Button>
    </div>
  );
};

export default InventoryViewToggle;
