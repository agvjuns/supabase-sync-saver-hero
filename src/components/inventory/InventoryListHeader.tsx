
import { ArrowUpDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { TableHead, TableHeader, TableRow } from '@/components/ui/table';

// Define types for sorting
export type SortKey = 'name' | 'status' | 'quantity'; // Added export
export type SortDirection = 'asc' | 'desc'; // Added export

export interface SortConfig { // Added export
  key: SortKey;
  direction: SortDirection;
}

// Define props for the component
interface InventoryListHeaderProps {
  sortConfig: SortConfig | null;
  onSort: (key: SortKey) => void; // Function to call when a sortable header is clicked
}

const InventoryListHeader = ({ sortConfig, onSort }: InventoryListHeaderProps) => {
  // Helper function to determine which icon to show based on sort state
  const getSortIcon = (key: SortKey) => {
    if (!sortConfig || sortConfig.key !== key) {
      // Default icon when not sorted by this key
      return <ArrowUpDown className="h-3 w-3 text-muted-foreground/50 ml-1" />;
    }
    // Icons when sorted (could use different icons for asc/desc if needed)
    // For now, just show the active state icon
    return sortConfig.direction === 'asc' ?
      <ArrowUpDown className="h-3 w-3 ml-1" /> : // Icon for ascending
      <ArrowUpDown className="h-3 w-3 ml-1" />; // Icon for descending (same for now)
  };

  return (
    // Added z-index to ensure header stays above scrolling content
    <TableHeader className="bg-muted/50 sticky top-0 z-10">
      <TableRow>
        <TableHead className="w-[300px] text-base">
          {/* Added onClick handler and improved focus style */}
          <Button variant="ghost" onClick={() => onSort('name')} className="p-0 font-medium text-base flex items-center gap-1 hover:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0">
            Name
            {getSortIcon('name')}
          </Button>
        </TableHead>
        <TableHead className="text-base">Location</TableHead>
        <TableHead className="text-base">
           {/* Added onClick handler and improved focus style */}
          <Button variant="ghost" onClick={() => onSort('status')} className="p-0 font-medium text-base flex items-center gap-1 hover:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0">
            Status
            {getSortIcon('status')}
          </Button>
        </TableHead>
        <TableHead className="text-right text-base">
           {/* Added onClick handler and improved focus style */}
          <Button variant="ghost" onClick={() => onSort('quantity')} className="p-0 font-medium text-base flex items-center gap-1 justify-end hover:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0">
            Quantity
            {getSortIcon('quantity')}
          </Button>
        </TableHead>
        {/* Renamed Header */}
        <TableHead className="text-right text-base">Actions</TableHead>
        {/* Cell for delete button alignment */}
        <TableHead className="w-8"></TableHead>
      </TableRow>
    </TableHeader>
  );
};

export default InventoryListHeader;
